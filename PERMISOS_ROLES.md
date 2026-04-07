# Catálogo de Permisos — Paddy AyG

> Este documento lista todos los permisos disponibles en el sistema, independientemente del rol asignado.
> La asignación de permisos por rol se definirá en una tabla separada de gestión de permisos.

---

## Panel — `/paddy`

| # | Clave | Descripción |
|---|-------|-------------|
| 1 | `panel.view` | Visualizar el dashboard principal |

---

## Recepciones — `/paddy/operations/receptions`

| # | Clave | Descripción |
|---|-------|-------------|
| 2 | `receptions.view` | Visualizar la lista de recepciones |
| 3 | `receptions.create` | Crear una nueva recepción |
| 4 | `receptions.edit` | Editar una recepción (datos generales y análisis de granos) |
| 5 | `receptions.delete` | Eliminar / anular una recepción |
| 6 | `receptions.print` | Imprimir la información de una recepción (botón de impresión en el datagrid) |

---

## Productores — `/paddy/management/producers`

### Lista de Productores

| # | Clave | Descripción |
|---|-------|-------------|
| 7 | `producers.view` | Visualizar la lista de productores |
| 8 | `producers.create` | Crear un nuevo productor |
| 9 | `producers.delete` | Eliminar un productor |

### Detalle del Productor

| # | Clave | Descripción |
|---|-------|-------------|
| 10 | `producers.detail.view` | Visualizar el detalle del productor |
| 11 | `producers.detail.edit` | Editar la información del productor (RUT, nombre, email, teléfono, ciudad, dirección, estado activo) |
| 12 | `producers.bankaccounts.view` | Visualizar las cuentas bancarias del productor |
| 13 | `producers.bankaccounts.create` | Agregar una cuenta bancaria al productor |
| 14 | `producers.bankaccounts.delete` | Eliminar una cuenta bancaria del productor |
| 15 | `producers.detail.receptions.view` | Visualizar las recepciones asociadas al productor |
| 16 | `producers.detail.advances.view` | Visualizar los anticipos asociados al productor |
| 17 | `producers.detail.settlements.view` | Visualizar las liquidaciones asociadas al productor |

---

## Tipos de Arroz — `/paddy/management/rice-types`

| # | Clave | Descripción |
|---|-------|-------------|
| 18 | `ricetypes.view` | Visualizar los tipos de arroz |
| 19 | `ricetypes.create` | Crear un tipo de arroz |
| 20 | `ricetypes.edit` | Editar un tipo de arroz |
| 21 | `ricetypes.delete` | Eliminar un tipo de arroz |

---

## Usuarios — `/paddy/users`

| # | Clave | Descripción |
|---|-------|-------------|
| 22 | `users.view` | Visualizar la lista de usuarios |
| 23 | `users.create` | Crear un nuevo usuario |
| 24 | `users.edit` | Editar un usuario (nombre, email, rol, contraseña) |
| 25 | `users.delete` | Eliminar un usuario |

---

## Anticipos — `/paddy/finances/advances`

| # | Clave | Descripción |
|---|-------|-------------|
| 26 | `advances.view` | Visualizar la lista de anticipos |
| 27 | `advances.create` | Crear un nuevo anticipo |
| 28 | `advances.edit` | Editar un anticipo |
| 29 | `advances.delete` | Eliminar / anular un anticipo |
| 30 | `advances.print` | Imprimir el recibo de un anticipo (botón de impresión en el datagrid) |
| 31 | `advances.change-interest` | Modificar la tasa de interés de un anticipo (botón de cambio de interés en el datagrid) |

---

## Pagos — `/paddy/finances/payments`

| # | Clave | Descripción |
|---|-------|-------------|
| 32 | `payments.view` | Visualizar la lista de pagos |

---

## Liquidaciones — `/paddy/finances/settlements`

> `settlements.save` y `settlements.complete` son permisos distintos porque tienen diferente impacto financiero: guardar/pre-liquidar mantiene el estado en `draft`, mientras que liquidar lo pasa a `completed` de forma definitiva.

| # | Clave | Descripción |
|---|-------|-------------|
| 33 | `settlements.view` | Visualizar la lista de liquidaciones |
| 34 | `settlements.create` | Crear una nueva pre-liquidación |
| 35 | `settlements.save` | Guardar cambios / pre-liquidar (botón "Guardar cambios" o "Pre-liquidar" — estado `draft`) |
| 36 | `settlements.complete` | Liquidar (botón "Liquidar" — pasa la liquidación a estado `completed` de forma definitiva) |
| 37 | `settlements.delete` | Eliminar una liquidación |
| 38 | `settlements.print` | Imprimir una liquidación (tanto pre-liquidaciones en estado `draft` como liquidaciones cerradas en estado `completed`) |

---

## Reportes — `/paddy/reports/*`

| # | Clave | Descripción |
|---|-------|-------------|
| 39 | `reports.drying-revenue.view` | Ver reporte: Recaudación por Secado |
| 40 | `reports.interest-revenue.view` | Ver reporte: Recaudación por Intereses |
| 41 | `reports.financial-profitability.view` | Ver reporte: Rentabilidad de Servicios Financieros |
| 42 | `reports.budget-return.view` | Ver reporte: Retorno de Presupuesto |
| 43 | `reports.process-yield.view` | Ver reporte: Rendimiento de Proceso |
| 44 | `reports.volume-price.view` | Ver reporte: Volumen de Compra y Precio Promedio por Kilo |
| 45 | `reports.cash-projection.view` | Ver reporte: Proyección de Caja |
| 46 | `reports.inventory-book.view` | Ver reporte: Libro de Existencias |

---

## Configuración — Temporadas — `/paddy/settings/seasons`

| # | Clave | Descripción |
|---|-------|-------------|
| 47 | `seasons.view` | Visualizar las temporadas |
| 48 | `seasons.create` | Crear una temporada |
| 49 | `seasons.edit` | Editar una temporada |
| 50 | `seasons.delete` | Eliminar una temporada |

---

## Configuración — Parámetros de Análisis — `/paddy/settings/analysis-params`

| # | Clave | Descripción |
|---|-------|-------------|
| 51 | `analysis-params.view` | Visualizar los parámetros de análisis |
| 52 | `analysis-params.create` | Crear un parámetro de análisis |
| 53 | `analysis-params.edit` | Editar un parámetro de análisis |

---

## Configuración — Plantillas — `/paddy/settings/templates`

| # | Clave | Descripción |
|---|-------|-------------|
| 54 | `templates.view` | Visualizar las plantillas |
| 55 | `templates.create` | Crear una plantilla |
| 56 | `templates.edit` | Editar una plantilla |
| 57 | `templates.delete` | Eliminar una plantilla |

---

## Resumen — Total de Permisos

**57 permisos** distribuidos en 12 secciones del sistema.
