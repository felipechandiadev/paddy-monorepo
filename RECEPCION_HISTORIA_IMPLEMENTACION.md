# Implementacion Propuesta: Campo `historia` en Recepciones

## 1. Objetivo

Disenar la implementacion para agregar un campo JSON `historia` en la entidad `Reception`, de modo que centralice la trazabilidad de:

- Cambios directos en la recepcion.
- Cambios realizados en `AnalysisRecord` asociados a esa recepcion.
- Eventos operativos relevantes (creacion, edicion, calculos, liquidacion, eliminacion logica, etc.).

El objetivo es que la recepcion sea la fuente unica de historial, incluso cuando el cambio ocurra en otra entidad relacionada.

## 2. Alcance funcional

Debe registrarse en `Reception.historia` para todos estos escenarios:

1. Creacion de recepcion.
2. Edicion de recepcion (registrar campo, valor anterior, valor nuevo).
3. Cambios de precio arroz y otros ajustes puntuales.
4. Creacion de analisis de grano (`AnalysisRecord`).
5. Edicion de analisis (incluyendo `dryPercent` y cualquier parametro de calidad).
6. Eliminacion de analisis.
7. Calculo de descuentos.
8. Aplicacion de liquidacion (`settle`).
9. Eliminacion logica de recepcion.

## 3. Cambio de modelo de datos

### 3.1 Entidad Reception

Agregar columna JSON nullable:

- `historia?: ReceptionHistoryEvent[]`

Sugerencia de columna TypeORM:

- `@Column({ type: 'json', nullable: true })`

### 3.2 Estructura recomendada del evento

Cada item del array `historia`:

```json
{
  "eventId": "uuid",
  "timestamp": "2026-03-11T20:10:33.123Z",
  "eventType": "RECEPTION_UPDATE",
  "source": "RECEPTION",
  "actor": {
    "userId": 1,
    "email": "admin@ayg.cl",
    "role": "ADMIN"
  },
  "request": {
    "method": "PUT",
    "route": "/api/v1/operations/receptions/123",
    "requestId": "req-abc-123"
  },
  "changes": [
    {
      "field": "ricePrice",
      "oldValue": 195,
      "newValue": 205
    }
  ],
  "summary": "Actualizacion de precio de arroz",
  "metadata": {
    "receptionId": 123,
    "analysisRecordId": null
  }
}
```

## 4. Tipos de evento sugeridos

### 4.1 Origen Reception

- `RECEPTION_CREATED`
- `RECEPTION_UPDATED`
- `RECEPTION_RICE_PRICE_UPDATED`
- `RECEPTION_DISCOUNTS_CALCULATED`
- `RECEPTION_SETTLED`
- `RECEPTION_SOFT_DELETED`

### 4.2 Origen AnalysisRecord (guardado en historia de Reception)

- `ANALYSIS_CREATED`
- `ANALYSIS_UPDATED`
- `ANALYSIS_DRY_PERCENT_UPDATED`
- `ANALYSIS_DELETED`

## 5. Estrategia de captura

## 5.1 Interceptor dedicado

Crear interceptor `ReceptionHistoryInterceptor` para endpoints de:

- Receptions
- Analysis de recepciones

Debe ejecutarse en:

- `POST/PUT/PATCH/DELETE /operations/receptions/*`
- `POST/PUT/PATCH/DELETE /operations/receptions/:receptionId/analysis*`
- `POST /operations/receptions/:receptionId/calculate-discounts`
- `POST /operations/receptions/:receptionId/settle`

## 5.2 Regla de funcionamiento

1. Identificar `receptionId` desde params o desde resultado de creacion.
2. Tomar snapshot previo (before) de `Reception` y, si aplica, de `AnalysisRecord`.
3. Ejecutar handler.
4. Tomar snapshot posterior (after).
5. Calcular diff de campos relevantes.
6. Construir evento y append en `Reception.historia`.

## 5.3 Registro de cambios

En operaciones UPDATE/PATCH:

- Registrar solo campos que cambian realmente.
- Formato por cambio: `field`, `oldValue`, `newValue`.

En operaciones CREATE/DELETE:

- `changes` puede contener estado inicial/final resumido.

## 6. Endpoints a cubrir (estado actual)

Segun controlador `operations` actual, cubrir:

- `POST /operations/receptions`
- `PUT /operations/receptions/:id`
- `PATCH /operations/receptions/:receptionId/rice-price`
- `DELETE /operations/receptions/:id`
- `POST /operations/receptions/:receptionId/analysis`
- `PUT /operations/receptions/:receptionId/analysis`
- `PATCH /operations/receptions/:receptionId/analysis/dry-percent`
- `DELETE /operations/receptions/:receptionId/analysis`
- `POST /operations/receptions/:receptionId/calculate-discounts`
- `POST /operations/receptions/:receptionId/settle`

## 7. Servicio de soporte recomendado

Crear `ReceptionHistoryService` con metodos:

- `appendEvent(receptionId, event)`
- `buildEvent(context)`
- `diffObjects(before, after, whitelistFields)`

Opcional:

- `trimHistory(receptionId, maxEvents)` para evitar crecimiento excesivo.

## 8. Gobernanza de datos

- No guardar passwords/tokens.
- Enmascarar datos bancarios o PII sensible si se incorporan en metadata.
- Mantener metadata minima util para trazabilidad.

## 9. Concurrencia y consistencia

Como `historia` es JSON en la misma fila, prevenir sobreescrituras:

- Actualizar `historia` dentro de la misma transaccion cuando sea posible.
- Considerar lock pesimista/optimista en escenarios de alta concurrencia.

## 10. Rendimiento

Riesgo: crecimiento del JSON en recepciones con mucha actividad.

Opciones:

1. Mantener solo ultimos N eventos en `historia`.
2. Rotar eventos antiguos a tabla historica (`reception_history_archive`).
3. Guardar resumen en `historia` y detalle completo en tabla dedicada futura.

## 11. Plan de implementacion por fases

### Fase 1 (MVP)

- Agregar columna `historia` en `receptions` + migracion.
- Crear tipos de evento y `ReceptionHistoryService`.
- Interceptor cubriendo create/update/delete de recepcion.

### Fase 2

- Extender interceptor a endpoints de analisis.
- Registrar `ANALYSIS_*` dentro de `Reception.historia`.
- Incluir diff detallado por campo.

### Fase 3

- Cobertura total de calculos/settle.
- Herramienta de consulta/filtrado de historia en UI admin.
- Politica de retencion/rotacion.

## 12. Criterios de aceptacion

1. Toda modificacion de recepcion genera evento en `historia`.
2. Toda modificacion de `AnalysisRecord` asociado genera evento en la `historia` de la recepcion.
3. En updates, se registra campo modificado con valor anterior y nuevo.
4. Eventos incluyen actor (`userId`) y timestamp.
5. Implementacion no rompe flujo actual de Operations.

## 13. Riesgos y decisiones abiertas

- Definir tamano maximo permitido para `historia`.
- Definir campos exactos para diff (whitelist).
- Definir si GET de historial se expone por API o solo uso interno.
- Definir si a mediano plazo conviene migrar a tabla dedicada de historial.

---

Documento de diseno para implementacion posterior. No aplica cambios de codigo productivo todavia.
