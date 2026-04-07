# 🌾 Guía de Seed - Cosecha (Harvest)

Este documento especifica la estructura y datos para el nuevo seed enfocado en **Cosechas** del sistema Paddy.

---

## 📋 Especificación Base

### 1️⃣ Usuarios

#### Admin Principal
```
Email:    admin@ayg.cl
Password: 098098
Role:     ADMIN
Status:   Activo
```


#### Permisos Asociados (Override)

El usuario admin tendrá todos los permisos explícitamente asignados (override GRANT):

| permissionKey                | effect |
|------------------------------|--------|
| users.view                   | GRANT  |
| users.create                 | GRANT  |
| users.update                 | GRANT  |
| users.delete                 | GRANT  |
| users.manage_permissions     | GRANT  |
| producers.view               | GRANT  |
| producers.create             | GRANT  |
| producers.update             | GRANT  |
| producers.delete             | GRANT  |
| rice_types.view              | GRANT  |
| rice_types.create            | GRANT  |
| rice_types.update            | GRANT  |
| rice_types.delete            | GRANT  |
| seasons.view                 | GRANT  |
| seasons.create               | GRANT  |
| seasons.update               | GRANT  |
| seasons.delete               | GRANT  |
| templates.view               | GRANT  |
| templates.create             | GRANT  |
| templates.update             | GRANT  |
| templates.delete             | GRANT  |
| analysis_params.view         | GRANT  |
| analysis_params.create       | GRANT  |
| analysis_params.update       | GRANT  |
| analysis_params.delete       | GRANT  |
| receptions.view              | GRANT  |
| receptions.create            | GRANT  |
| receptions.update            | GRANT  |
| receptions.cancel            | GRANT  |
| analysis_records.view        | GRANT  |
| analysis_records.create      | GRANT  |
| analysis_records.update      | GRANT  |
| advances.view                | GRANT  |
| advances.create              | GRANT  |
| advances.update              | GRANT  |
| advances.cancel              | GRANT  |
| advances.change_interest     | GRANT  |
| transactions.view            | GRANT  |
| settlements.view             | GRANT  |
| settlements.create           | GRANT  |
| settlements.save             | GRANT  |
| settlements.complete         | GRANT  |
| settlements.cancel           | GRANT  |
| settlement_services.view     | GRANT  |
| settlement_services.create   | GRANT  |
| settlement_services.update   | GRANT  |
| settlement_services.delete   | GRANT  |
| analytics.view               | GRANT  |

Todos los permisos se asignan con efecto `GRANT`.

#### Usuario Consultor
```
Email:    consultor@ayg.cl
Password: 098098
Role:     CONSULTOR
Status:   Activo
```

#### Permisos Asociados (Override) - Consultor

El usuario consultor tendrá permisos de lectura (view) en la mayoría de módulos, sin capacidad de crear, actualizar o eliminar datos:

| permissionKey          | effect |
|------------------------|--------|
| users.view             | GRANT  |
| producers.view         | GRANT  |
| rice_types.view        | GRANT  |
| seasons.view           | GRANT  |
| templates.view         | GRANT  |
| analysis_params.view   | GRANT  |
| receptions.view        | GRANT  |
| analysis_records.view  | GRANT  |
| advances.view          | GRANT  |
| transactions.view      | GRANT  |
| settlements.view       | GRANT  |
| analytics.view         | GRANT  |

El usuario consultor solo tiene permisos de visualización, sin acceso a creación, actualización o eliminación de registros.

---

## 🌾 Tipos de Arroz

El sistema maneja 4 tipos de arroz:

| ID | Código    | Nombre      | Precio Referencia | Estado   |
|----|-----------|-------------|-------------------|----------|
| 1  | DIAMANTE  | Diamante    | 600               | Inactivo |
| 2  | ZAFIRO    | Zafiro      | 550               | Activo ✅ |
| 7  | BR        | Brillante   | 200               | Activo ✅ |
| 8  | HR        | Harper      | 200               | Inactivo |

**Notas:**
- Los precios de referencia están en pesos chilenos por kilo
- Todos los tipos deben incluirse en el seed, independientemente de su estado activo/inactivo
- Los tipos inactivos pueden ser usados en recepciones históricas (cosechas 2024-2025)

---

## 📅 Temporadas (Cosechas)

El sistema maneja 3 cosechas principales:

### Cosecha 2024
```
- Código:       COSECHA_2024
- Nombre:       Cosecha 2024
- Año:          2024
- Fecha Inicio: 01-01-2024
- Fecha Fin:    31-12-2024
- Estado:       Inactivo (archivado)
```

### Cosecha 2025
```
- Código:       COSECHA_2025
- Nombre:       Cosecha 2025
- Año:          2025
- Fecha Inicio: 01-01-2025
- Fecha Fin:    31-12-2025
- Estado:       Inactivo (archivado)
```

### Cosecha 2026 (ACTIVA)
```
- Código:       COSECHA_2026
- Nombre:       Cosecha 2026
- Año:          2026
- Fecha Inicio: 01-01-2026
- Fecha Fin:    31-12-2026
- Estado:       ACTIVO ✅
```

---

## 🎯 Estructura Planificada

### Fase 1: Entidades Base (Este documento)
- ✅ 1 Usuario Admin
- ✅ 3 Temporadas/Cosechas

### Fase 2: Configuración (Por definir)
- [ ] Tipos de Arroz
- [ ] Templates de Análisis
- [ ] Parámetros de Descuento

### Fase 3: Operaciones (Por definir)
- [ ] Productores
- [ ] Recepciones
- [ ] Análisis de Laboratorio

### Fase 4: Finanzas (Por definir)
- [ ] Anticipos
- [ ] Transacciones
- [ ] Liquidaciones

---

## 📝 Notas de Implementación

- El seed debe usar la función `roundTo2()` para todos los valores decimales
- Las fechas deben responder al rango de cada temporada
- El estado `isActive` diferencia cosechas activas de históricas
- Se debe validar integridad de relaciones (FK) antes de guardar

### 🧮 Regla de Redondeo para Pesos en Recepciones

Todos los valores de kilos en las recepciones (Peso Bruto, Tara, Peso Neto, Total Descuentos, Bonificación, Paddy Neto) deben ser **enteros**.
El cálculo y la visualización deben aplicar `Math.round(valor)` para eliminar decimales y mostrar solo el valor entero.

**Ejemplo:**
  - Peso Bruto: 2345 kg
  - Tara: 0 kg
  - Peso Neto: 2345 kg
  - Total Descuentos: 305 kg
  - Bonificación: +0 kg
  - Paddy Neto: 2040 kg

**Implementación recomendada:**
  - En el seed, al calcular cada valor de kilos, aplicar `Math.round(valor)` antes de guardar.
  - En el frontend, mostrar los valores de kilos sin decimales.

### 🏦 Reglas para Anticipos (Avances)

- El monto de cada anticipo debe ser un número entero (sin decimales). Aplicar `Math.round(valor)` al calcular el monto antes de guardar.
- La fecha de emisión (`issueDate`) debe estar dentro del rango de la temporada asociada.
- La fecha de vencimiento (`interestEndDate`) debe ser posterior a la emisión, preferentemente dentro de la temporada.
- El estado inicial debe ser `PAID`. Al liquidar, el estado debe cambiar a `SETTLED`.
- Cada anticipo debe estar vinculado a un productor y una temporada. Validar integridad de relaciones (FK).
- **Método de pago:** Solo se usará método de pago "cheque". Para cada anticipo, guardar:
    - Banco emisor
    - Número de cheque
    - Fecha de emisión
    - Fecha de vencimiento
- La tasa de interés debe ser un valor decimal, pero mostrar solo 2 decimales en el frontend.
- Incluir una descripción clara: “Anticipo {n} de {productor} - {temporada}”.

### 📦 Reglas para Recepciones

- Datos obligatorios de la recepción (`Reception`):
  - `producerId`: ID del productor
  - `seasonId`: ID de la temporada
  - `riceTypeId`: ID del tipo de arroz
  - `templateId`: ID del template de análisis
  - `grossWeight`: Peso bruto (entero, usar `Math.round`)
  - `tareWeight`: Peso tara (entero, usar `Math.round`)
  - `netWeight`: Peso neto (entero, usar `Math.round`)
  - `guideNumber`: Número de guía único
  - `licensePlate`: Patente del camión
  - `ricePrice`: Precio por kilo (entero, usar `Math.round`)
  - `receptionDate`: Fecha dentro del rango de la temporada
  - `status`: Inicialmente `ANALYZED`
  - `createdAt`, `updatedAt`: Fechas de registro y actualización
  - `notes`: Descripción breve

- Regla de redondeo:
  - Todos los valores de kilos deben ser enteros (`Math.round`).
  - El precio por kilo debe mostrar solo 2 decimales.

- Relaciones:
  - La recepción debe estar vinculada a un productor, temporada, tipo de arroz y template.


### 🧪 Reglas para Análisis Record

- Datos obligatorios del análisis (`AnalysisRecord`):
  - `receptionId`: ID de la recepción asociada
  - Parámetros de análisis (humedad, impurezas, verdes, manchados, yesosos, pelados, vano, hualcacho, etc.)
  - Cada parámetro debe incluir:
    - Valor de rango (decimal, mostrar solo 2 decimales)
    - Porcentaje de descuento (decimal, mostrar solo 2 decimales)
    - Tolerancia (decimal, mostrar solo 2 decimales)
  - `totalGroupPercent`: Suma de porcentajes del grupo de tolerancia
  - `groupTolerance`: Valor de tolerancia grupal
  - `bonusEnabled`: Si aplica bonificación
  - `useToleranceGroup`: Si aplica tolerancia grupal

- Regla de redondeo:
  - Los valores de análisis pueden tener decimales, pero deben mostrarse con máximo 2 decimales.

- Relaciones:
  - El análisis debe estar vinculado a la recepción.

---

## 💸 Reglas para Liquidaciones (Settlements)

1. **Liquidación por temporada:**
   - Cada productor debe tener una liquidación por cada temporada en la que tenga recepciones y anticipos.
   - La liquidación agrupa todas las recepciones y anticipos del productor en esa temporada.

2. **Estado inicial:**
   - El estado de la liquidación debe ser `IN_PROCESS` al crearla.
   - Al completar la liquidación, el estado pasa a `COMPLETED`.

3. **Montos y cálculos:**
   - El monto total liquidado debe ser la suma de todos los paddy netos de las recepciones menos los anticipos y descuentos.
   - Todos los valores de kilos y montos deben ser enteros (`Math.round`).
   - El precio por kilo es **entero** (no decimales).

4. **Fechas:**
   - La fecha de liquidación debe ser posterior a la última recepción y anticipo de la temporada.
   - Debe estar dentro del rango de la temporada.

5. **Método de pago:**
   - Solo se usará método de pago "cheque".
   - Registrar banco, número de cheque, fecha de emisión y vencimiento.

6. **Relaciones:**
   - La liquidación debe estar vinculada al productor, temporada, recepciones y anticipos.

7. **Excepción especial:**
   - En la temporada 2025, **uno de los productores debe quedar sin liquidación** (no se genera liquidación para ese productor en esa temporada).

8. **Descripción:**
   - La descripción debe indicar: “Liquidación {n} de {productor} - {temporada}”.

---

## 🧪 Reglas Especiales para Análisis Record

- En cada temporada, para **una recepción de cada productor**, el valor de secado y bonificación debe ser distinto de cero (para probar casos de bonificación y secado).
- El resto de las recepciones deben tener secado y bonificación en cero.
- Los valores de análisis deben mostrar máximo 2 decimales.

---

## 🏁 Orden de Generación de Registros

1. Usuarios y permisos
2. Temporadas
3. Tipos de Arroz
4. Plantilla de Análisis
5. Parámetros de Análisis
6. Productores
7. Recepciones
8. Análisis Record
9. Anticipos
10. Transacciones
11. Liquidaciones

---

## ✅ Verificación Post-Ejecución

Una vez ejecutado el seed `seed-test-cosecha`, se debe verificar que la base de datos contenga:

| Entidad                  | Cantidad Esperada | Notas |
|--------------------------|-------------------|-------|
| Users                    | 2 ✓               | Admin + Consultor |
| Seasons                  | 3 ✓               | 2024 (inactivo), 2025 (inactivo), 2026 (activo) |
| RiceTypes                | 4 ✓               | Diamante, Zafiro, Brillante, Harper |
| Templates                | 1 ✓               | COSECHA 2026 |
| AnalysisParams           | 76 ✓              | Todos los parámetros de análisis |
| Producers                | 5 ✓               | Agrícola San Pedro, Los Robles, El Retiro, Central, Maule |
| Receptions               | 30 ✓              | 10 por temporada (2024, 2025, 2026) |
| AnalysisRecords          | 30 ✓              | 1:1 con Receptions |
| Advances                 | 30 ✓              | 10 por temporada (2024, 2025, 2026) |
| Transactions             | 30 ✓              | 1:1 con Advances (tipo ADVANCE) |
| Settlements              | 9 ✓               | 5 en COSECHA_2024 + 4 en COSECHA_2025 (excepción Productor #2) |
| SettlementReceptionSnapshots | 90 ✓         | ~10 por liquidación (recepciones asociadas) |
| UserPermissionOverrides  | 26 ✓              | Admin: 51 permisos, Consultor: 12 permisos |

**Desglose de Liquidaciones:**
- **COSECHA_2024:** 5 liquidaciones (1 por cada productor)
- **COSECHA_2025:** 4 liquidaciones (5 productores - 1 excepción: Productor #2 sin liquidación)
- **COSECHA_2026:** 0 liquidaciones (temporada activa, no liquidadas aún)
- **Total:** 9 liquidaciones

---

## 🔗 Referencia de Archivos

- **Seed Atual**: `/backend/src/infrastructure/persistence/seeders/`
- **Entities**: `/backend/src/modules/configuration/domain/configuration.entity.ts`
- **Enums**: `/backend/src/shared/enums/index.ts`

## 📊 Resumen de Cantidades y Reglas de Distribución

- **Temporadas:** 3 (cada una inicia en marzo y termina en agosto)
- **Recepciones:** 30 en total (10 por cada temporada)
  - Las fechas de las recepciones deben estar repartidas uniformemente entre las fechas de inicio y fin de cada temporada.
- **Anticipos:** 30 en total (10 por cada temporada)
  - Las fechas de los anticipos deben estar distribuidas uniformemente durante la temporada, pero no deben superar la mitad de la temporada (solo hasta la fecha media).

**Reglas de distribución:**
- Las fechas de cada registro (recepción o anticipo) se calculan para que estén separadas de forma uniforme dentro del rango permitido.
- Ejemplo: Si la temporada dura 150 días, cada recepción se asigna cada 15 días, y cada anticipo cada 7-8 días hasta la mitad de la temporada.

- **Productores:** 5 en total
  - Los nombres deben ser nombres chilenos (ejemplo: Agrícola San Pedro, Sociedad Agrícola Los Robles, etc.)
  - Los RUT deben ser válidos y únicos para cada productor
  - Todos los productores pertenecen a la ciudad de Parral
  - En cada temporada, a cada productor se le asignan 2 recepciones y 2 anticipos

**Ejemplo de nombres de productores:**
- Agrícola San Pedro LTDA
- Sociedad Agrícola Los Robles
- Empresa Agraria El Retiro
- Producción Arrocera Central
- Agroindustrial Maule SpA

**Reglas de asignación:**
- Cada productor tendrá 2 recepciones y 2 anticipos por temporada
- Los RUT deben ser generados de forma válida y única
- La ciudad para todos es Parral

---

## 📐 Parámetros de Análisis (Valores actuales de la base de datos)

| Parámetro                  | Unidad | Rango Inicio | Rango Fin | % Descuento |
|---------------------------|--------|-------------|-----------|-------------|
| Humedad                   | %      | 15.01       | 15.50     | 1.00        |
| Granos Verdes             | %      | 0.00        | 2.00      | 0.00        |
| Impurezas                 | %      | 0.00        | 0.50      | 0.00        |
| Granos Pelados y Partidos | %      | 0.00        | 1.00      | 0.00        |
| Hualcacho                 | %      | 0.01        | 0.50      | 0.75        |
| Granos Manchados          | %      | 0.01        | 0.50      | 0.50        |
| Vano                      | %      | 0.00        | 0.50      | 0.00        |
| Humedad                   | %      | 15.51       | 16.00     | 1.50        |
| Granos Verdes             | %      | 2.01        | 2.50      | 0.25        |
| Impurezas                 | %      | 0.51        | 1.00      | 0.00        |
| Granos Pelados y Partidos | %      | 1.01        | 2.00      | 1.00        |
| Hualcacho                 | %      | 0.51        | 1.00      | 1.50        |
| Granos Manchados          | %      | 0.51        | 1.00      | 1.00        |
| Vano                      | %      | 0.51        | 1.00      | 0.50        |
| Granos Pelados            | %      | 0.00        | 1.00      | 0.00        |
| Granos Yesosos            | %      | 0.00        | 1.00      | 0.00        |
| Humedad                   | %      | 16.01       | 16.50     | 2.00        |
| Granos Verdes             | %      | 2.51        | 3.00      | 0.50        |
| Impurezas                 | %      | 1.01        | 1.50      | 0.00        |
| Granos Pelados y Partidos | %      | 2.01        | 3.00      | 2.00        |
| Hualcacho                 | %      | 1.01        | 1.50      | 2.25        |
| Granos Manchados          | %      | 1.01        | 1.50      | 1.50        |
| Vano                      | %      | 1.01        | 1.50      | 1.00        |
| Granos Pelados            | %      | 1.01        | 2.00      | 1.00        |
| Granos Yesosos            | %      | 1.01        | 2.00      | 1.00        |
| Humedad                   | %      | 16.51       | 17.00     | 2.50        |
| Granos Verdes             | %      | 3.01        | 3.50      | 0.75        |
| Impurezas                 | %      | 1.51        | 1.99      | 0.00        |
| Granos Pelados y Partidos | %      | 3.01        | 4.00      | 3.00        |
| Hualcacho                 | %      | 1.51        | 2.00      | 3.00        |
| Granos Manchados          | %      | 1.51        | 2.00      | 2.00        |
| Vano                      | %      | 1.51        | 2.00      | 1.50        |
| Granos Pelados            | %      | 2.01        | 3.00      | 2.00        |
| Granos Yesosos            | %      | 2.01        | 3.00      | 2.00        |
| Humedad                   | %      | 17.01       | 17.50     | 3.00        |
| Granos Verdes             | %      | 3.51        | 4.00      | 1.00        |
| Impurezas                 | %      | 2.00        | 2.00      | 0.00        |
| Granos Pelados y Partidos | %      | 4.01        | 5.00      | 4.00        |
| Hualcacho                 | %      | 2.01        | 2.50      | 3.75        |
| Granos Manchados          | %      | 2.01        | 2.50      | 2.50        |
| Vano                      | %      | 2.01        | 2.50      | 2.00        |
| Granos Pelados            | %      | 3.01        | 4.00      | 3.00        |
| Granos Yesosos            | %      | 3.01        | 4.00      | 3.00        |
| Humedad                   | %      | 17.51       | 18.00     | 4.03        |
| Granos Verdes             | %      | 4.01        | 4.50      | 1.25        |
| Impurezas                 | %      | 2.01        | 2.50      | 0.50        |
| Granos Pelados y Partidos | %      | 5.01        | 6.00      | 5.00        |
| Hualcacho                 | %      | 2.51        | 3.00      | 4.50        |
| Granos Manchados          | %      | 2.51        | 3.00      | 3.00        |
| Vano                      | %      | 2.51        | 3.00      | 2.50        |
| Granos Pelados            | %      | 4.01        | 5.00      | 4.00        |
| Granos Yesosos            | %      | 4.01        | 5.00      | 4.00        |
| Humedad                   | %      | 18.01       | 18.50     | 4.62        |
| Granos Verdes             | %      | 4.51        | 5.00      | 1.50        |
| Impurezas                 | %      | 2.51        | 3.00      | 1.00        |
| Granos Pelados y Partidos | %      | 6.01        | 7.00      | 6.00        |
| Hualcacho                 | %      | 3.01        | 3.50      | 5.25        |
| Granos Manchados          | %      | 3.01        | 3.50      | 3.50        |
| Vano                      | %      | 3.01        | 3.50      | 3.00        |
| Granos Pelados            | %      | 5.01        | 6.00      | 5.00        |
| Granos Yesosos            | %      | 5.01        | 6.00      | 5.00        |
| Humedad                   | %      | 18.51       | 19.00     | 5.21        |
| Granos Verdes             | %      | 5.01        | 5.50      | 1.75        |
| Impurezas                 | %      | 3.01        | 3.50      | 1.50        |
| Granos Pelados y Partidos | %      | 7.01        | 8.00      | 7.00        |
| Hualcacho                 | %      | 3.51        | 4.00      | 6.00        |
| Granos Manchados          | %      | 3.51        | 4.00      | 4.00        |
| Vano                      | %      | 3.51        | 4.00      | 3.50        |
| Granos Pelados            | %      | 6.01        | 7.00      | 6.00        |
| Granos Yesosos            | %      | 6.01        | 7.00      | 6.00        |
| Humedad                   | %      | 19.01       | 19.50     | 5.79        |
| Granos Verdes             | %      | 5.51        | 6.00      | 2.00        |
| Impurezas                 | %      | 3.51        | 4.00      | 2.00        |
| Granos Pelados y Partidos | %      | 8.01        | 9.00      | 8.00        |
| Hualcacho                 | %      | 4.01        | 4.50      | 6.75        |

---

## 🖥️ Plantilla de Análisis (Pantalla)

**Datos de la plantilla actual:**

- Nombre: COSECHA 2026
- Es plantilla por defecto: Sí
- Usa grupo de tolerancia: Sí
- Valor de tolerancia grupal: 4.00
- Nombre de grupo de tolerancia: Analisis de Granos

**Configuración de parámetros en la plantilla:**

- Parámetros incluidos en el grupo de análisis:
  - Humedad: disponible (sí), porcentaje: 0.00, tolerancia: 4.00
  - Granos Verdes: disponible (sí), porcentaje: 0.00, tolerancia: 0.00
  - Impurezas: disponible (sí), porcentaje: 0.00, tolerancia: 0.00
  - Vano: disponible (no), porcentaje: 0.00, tolerancia: 0.00
  - Hualcacho: disponible (no), porcentaje: 0.00, tolerancia: 0.00
  - Granos Manchados: disponible (no), porcentaje: 0.00, tolerancia: 0.00
  - Granos Pelados: disponible (sí), porcentaje: 0.00, tolerancia: 0.00
  - Granos Yesosos: disponible (no), porcentaje: 0.00, tolerancia: 0.00
  - Bonificación: disponible (sí)
  - Secado: disponible (sí)

- Solo los parámetros con "disponible (sí)" se consideran en el análisis de la plantilla por defecto.
- Los valores de porcentaje y tolerancia están configurados en la plantilla, pero actualmente todos los porcentajes están en 0.00 y la tolerancia de Humedad es 4.00.

