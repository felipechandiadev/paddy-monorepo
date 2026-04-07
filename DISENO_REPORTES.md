                                                    
MAYO													
                                                    
            TOTAL	PROPIO	 DEPOSITO 								
        SALDO ANTERIOR	 5.733.503 	-93.268 	 5.826.771 								
        KILOS RECIBIDOS	 9.211.613 		 9.211.613 								
        COMPRAS		 3.003.331 	-3.003.331 								
                                                    
                                                    
                                                    
        EXISTENCIAS MES	 14.945.116 	 2.910.063 	 12.035.053 								
                                                    
                                                    
                                                    
                                                    
                                                    
FECHA	GUIA RECEPCION	RUT	AGRICULTOR	GUIA DE DESPACHO	 KILOS 	FACTURA COMPRA	 KILOS 	PRECIO	 TOTAL 	 BRUTOS 			
2/5/25	7413	JOSE CAMPOS ANABALON	16.462.767-5	193	 36.241 					 36.530 			
2/5/25	7414	CRISTIAN GONZALEZ SOTO	16.845.694-8	220	 38.281 					 38.520 			
2/5/25	7415	MINERVA GUZMAN GODOY	4.342.385-1	218	 34.638 					 35.750 			
2/5/25	7416	ADELA JAIDAR E HIJOS LTDA	78.465.080-4	212	 36.080 					 36.960 			
2/5/25	7417	DAVID FUENTES MORALES	13.615.745-0	208	 29.083 					 30.110 			
2/5/25	7418	ROBERTO GONZALEZ MUÑOZ	15.157.262-6	62	 18.644 					 18.760 			
2/5/25	7419	EDGARDO JAIDAR MORALES	8.936.235-0	538	 37.515 					 38.430 			
2/5/25	7420	ROBERTO GONZALEZ MUÑOZ	15.157.262-6	61	 30.261 					 30.450 			
2/5/25		MARIA VALDES MANRIQUEZ	8.200.408-4			40	 16.984 	400	 6.793.600 				
2/5/25		LORENA VALDES MANRIQUEZ	9.074.795-9			36	 49.103 	400	 19.641.200 				
3/5/24	7421	LUIS ORTEGA FUENTES	17.332.522-3	8	 38.559 					 38.800 			
3/5/24	7422	DAVID FUENTES MORALES	13.615.745-0	209	 31.132 					 31.680 			
3/5/24	7423	JUAN SALAS ESPINOZA	13.101.918-1	155	 34.793 					 35.070 			
3/5/24	7424	IDILIO HERNANDEZ ESPINOZA	11.177.416-1	493	 17.827 					 18.180 			
3/5/24	7425	MINERVA GUZMAN GODOY	4.342.385-1	219	 17.827 					 18.180 			
3/5/24	7426	SAMUEL HERNANDEZ CISTERNA	4.920.745-K	929	 33.796 					 34.210 			
3/5/24	7427	JORGE LOPEZ RIOS	7.734.296-6	320	 15.875 					 15.872 			
3/5/24	7428	JUAN SILVA TAPIA	10.255.776-K	560	 15.875 					 15.875 			
3/5/24	7429	CRISTIAN GONZALEZ SOTO	16.845.694-8	221	 30.256 					 30.320 			
4/5/25	7430	JUAN CARLOS ORTEGA SALDIAS	11.567.187-1	9	 32.413 					 32.730 			
4/5/25	7431	ANDRES GONZALEZ MUÑOZ	14.022.909-1	132	 32.905 					 33.110 			
4/5/25	7432	ANA MARIA VALDEZ PARRA	10.487.830-K	524	 21.206 					 21.375 			
4/5/25	7433	SILVIO CISTERNAS ORTEGA	9.802.282-1	383	 21.206 					 21.375 			
4/5/25	7434	JOSE CAMPOS ANABALON	16.462.767-5	194	 32.351 					 33.151 			
4/5/25	7435	JUAN SALAS ESPINOZA	13.101.918-1	156	 35.071 					 35.350 			
4/5/25	7436	MANUEL JAIDAR ESCOBAR	7.241.772-0	62	 36.803 					 37.700 			
4/5/25	7437	OMAR URRA FALCON	6.488.308-9	362	 33.054 					 33.860 			
4/5/25	7438	ROLANDO ORTEGA NIÑO	7.279.655-1	31	 39.840 					 39.840 			
4/5/25	7439	JUAN CARLOS ORTEGA SALDIAS	11.567.187-1	10	 5.508 					 5.670 			
4/5/25	7440	FELICIANO SEPULVEDA SAN MARTIN	14.536.149-4	129	 27.730 					 28.070 			
5/5/25	7441	JUAN SALAS ESPINOZA	13.101.918-1	157	 32.448 					 33.100 			
5/5/25	7442	HUGO ALEJANDRO RAMOS ARAVENA	19.990.939-8	53	 6.951 					 7.855 			
5/5/25	7443	EVELYN RAMOS RETAMAL	14.023.525-3	26	 6.951 					 7.855 			
5/5/25	7444	AGRICOLA DON SEBASTIAN	76.716.403-3	83	 31.540 					 31.540 			# Diseno de Reportes

Este documento define la idea, el objetivo y el alcance de los reportes ejecutivos del sistema Paddy.

La intencion es alinear negocio, producto y desarrollo antes de implementar cada reporte en backend y frontend.

## Criterios Base

- Los reportes deben construirse con datos que ya existen en el sistema o con reglas de calculo explicitamente definidas.
- Cada reporte debe dejar claro si muestra montos netos, IVA, total, o una combinacion de ellos.
- Cada reporte debe indicar si trabaja con recepciones, liquidaciones, anticipos o transacciones.
- Cuando una regla contable no este cerrada, debe marcarse como decision pendiente antes de implementarse.

---

## 1. Reporte Ejecutivo de Recaudacion por Secado

### Nombre propuesto

`Informe Consolidado de Servicios de Secado`

### Otros nombres posibles

- `Resumen Ejecutivo de Recaudacion por Secado`
- `Informe Gerencial de Cargos por Secado`
- `Consolidado de Secado por Temporada`

### Concepto

Este reporte busca mostrar, en un formato ejecutivo, cuanto se ha recaudado o se proyecta recaudar por concepto de secado dentro de un periodo determinado.

La idea no es mostrar solo recepciones individuales, sino entregar una vision consolidada del impacto economico del secado sobre la operacion:

- cuanto secado se aplico
- a cuantas recepciones afecto
- cuanto represento en monto neto
- cuanto IVA genero o podria generar
- cual fue el total economico asociado al servicio

### Objetivo de negocio

Permitir a gerencia y administracion responder rapidamente preguntas como:

- Cuanto estamos recaudando por secado en una temporada o periodo.
- Que productores concentran mayor cargo por secado.
- Que tipos de arroz o periodos generan mayor necesidad de secado.
- Cuanto del ingreso por secado corresponde a neto y cuanto a IVA.
- Como evoluciona el secado en el tiempo.

### Usuario objetivo

- Gerencia
- Administracion
- Finanzas
- Operaciones

### Parametros recomendados

#### Obligatorios

- `fechaInicio`
- `fechaFin`

#### Recomendados

- `seasonId`

#### Opcionales para version 1

- `producerId`
- `riceTypeId`
- `groupBy`: dia, semana, mes, productor, tipo de arroz
- `onlyLiquidated`: si solo considera recepciones ya liquidadas

#### Opcionales para version 2

- `minDryPercent`
- `maxDryPercent`
- `includeCancelled`
- `exportFormat`: pantalla, Excel, PDF

### Recomendacion funcional sobre filtros

Para una primera version, el filtro ideal seria:

- rango de fechas
- temporada
- productor opcional
- tipo de arroz opcional

Con eso ya se puede cubrir la mayoria de las consultas ejecutivas sin complejizar demasiado la implementacion.

### Fuente de datos actual del sistema

Hoy el sistema ya dispone de estos datos relacionados con secado:

- `Reception.dryPercent`
- `Reception.dryFeeApplied`
- `AnalysisRecord.dryPercent`
- `Reception.netWeight`
- `Reception.finalNetWeight`
- `Reception.ricePrice`
- logica de calculo de `dryingSubTotal` en liquidacion impresa

### Regla de calculo actualmente usada en impresion

Segun la logica actual de liquidacion impresa:

- `paddySubTotal = netWeight x ricePrice`
- `dryingSubTotal = round(paddySubTotal x (dryPercent / 100))`

Si el reporte usa exactamente la misma base que la liquidacion impresa, entonces debe heredar esa formula para evitar diferencias entre documentos.

### Punto contable pendiente

El sistema hoy no consolida de forma real un `ivaServices` para secado. En backend, el campo existe en `Settlement`, pero actualmente se guarda en `0`.

Por lo tanto, este reporte necesita definir una de estas dos posturas antes de implementarse:

1. `IVA de secado calculado`:
   se muestra un IVA estimado calculado como `netoSecado x 0.19`.
2. `IVA de secado registrado`:
   solo se muestra IVA cuando el sistema efectivamente lo persista y lo contabilice.

### Recomendacion de negocio

Para la version 1 del reporte, conviene marcar claramente el IVA como:

- `IVA secado estimado`

de modo que el reporte sea util de inmediato sin falsear que ese valor ya esta contabilizado como ingreso formal dentro de la liquidacion.

---

## Propuesta de estructura del reporte

### A. Encabezado ejecutivo

- Nombre del reporte
- Rango de fechas consultado
- Temporada
- Fecha y hora de generacion
- Usuario que genera el reporte

### B. Tarjetas resumen

Indicadores principales:

- Total recepciones con secado
- Total kg afectados por secado
- Promedio de porcentaje de secado
- Neto secado
- IVA secado estimado
- Total secado

### C. Tendencia temporal

Vista agrupada por dia, semana o mes:

- periodo
- cantidad de recepciones
- neto secado
- IVA secado
- total secado

### D. Consolidado por productor

- productor
- cantidad de recepciones con secado
- kg asociados
- promedio secado %
- neto secado
- IVA secado
- total secado

### E. Consolidado por tipo de arroz

- tipo de arroz
- cantidad de recepciones
- kg
- neto secado
- total secado

### F. Detalle operativo

Tabla detallada por recepcion:

- fecha recepcion
- numero de guia
- productor
- tipo de arroz
- kg paddy
- precio
- porcentaje secado
- neto paddy
- neto secado
- IVA secado
- total secado
- estado de la recepcion
- estado de la liquidacion

---

## KPIs sugeridos

- `receptionsWithDryingCount`
- `affectedPaddyKg`
- `averageDryPercent`
- `netDryingRevenue`
- `estimatedDryingVat`
- `totalDryingRevenue`
- `topProducerByDrying`
- `topRiceTypeByDrying`

---

## Definicion sugerida de metricas

### Recepciones con secado

Recepciones donde `dryPercent > 0`.

### Neto secado

`round((netWeight x ricePrice) x (dryPercent / 100))`

### IVA secado estimado

`round(netoSecado x 0.19)`

### Total secado

`netoSecado + ivaSecadoEstimado`

### Kg afectados por secado

Se recomienda definirlo como `netWeight` de las recepciones que presentan secado.

---

## Recomendacion de alcance MVP

### Version 1

- Filtros por fecha y temporada
- Resumen ejecutivo
- Consolidado por productor
- Detalle por recepcion
- Exportacion a Excel

### Version 2

- Agrupacion temporal avanzada
- Comparativo contra periodo anterior
- Ranking por tipo de arroz
- PDF gerencial
- Dashboard grafico

---

## Dudas de negocio a cerrar antes de implementar

1. El reporte debe mostrar `recaudacion real` o `recaudacion estimada` por secado.
2. El IVA de secado debe mostrarse como estimado o solo cuando quede persistido en liquidacion.
3. La fecha de corte debe ser la fecha de recepcion, fecha de analisis o fecha de liquidacion.
4. El universo debe incluir solo recepciones liquidadas o tambien recepciones analizadas pendientes de liquidar.
5. El monto de secado debe basarse en `netWeight` o en `finalNetWeight`.

---

## Recomendacion de definicion final para arrancar

Si hay que partir rapido y con bajo riesgo, la mejor definicion inicial seria:

- Base: recepciones liquidadas
- Fecha de corte: fecha de liquidacion o fecha de emision de liquidacion
- Formula: misma logica que la liquidacion impresa
- IVA: mostrarlo como `IVA secado estimado`
- Filtros: fecha inicio, fecha fin, temporada, productor opcional

Eso deja un reporte consistente, entendible y alineado con la informacion que hoy ya maneja el sistema.

---

## 2. Reporte Ejecutivo de Recaudacion por Servicios Financieros (Intereses)

### Nombre propuesto

`Informe Consolidado de Ingresos Financieros por Intereses`

### Otros nombres posibles

- `Resumen Ejecutivo de Recaudacion por Intereses`
- `Informe Gerencial de Servicios Financieros`
- `Consolidado de Intereses por Anticipos`
- `Informe de Intereses Devengados y Liquidados`

### Concepto

Este reporte busca mostrar cuanto ingreso financiero generan los anticipos otorgados a productores, a partir del calculo de intereses asociado a cada anticipo.

La idea es entregar una vision consolidada del negocio financiero vinculado a los anticipos:

- cuantos anticipos generan interes
- cuanto capital estuvo colocado
- cuanto interes se ha devengado o liquidado
- cuanto IVA financiero se estima o se reconoce
- cuanto representa el total del servicio financiero

### Objetivo de negocio

Permitir a gerencia y finanzas responder rapidamente preguntas como:

- Cuanto ingreso financiero generan los anticipos en un periodo.
- Que productores concentran mayor cargo por intereses.
- Cuanto corresponde a capital entregado versus ingreso por intereses.
- Cuanto interes esta solo devengado y cuanto ya fue liquidado.
- Como evoluciona la recaudacion financiera por temporada.

### Usuario objetivo

- Gerencia
- Finanzas
- Administracion
- Cobranza

### Parametros recomendados

#### Obligatorios

- `fechaInicio`
- `fechaFin`

#### Recomendados

- `seasonId`

#### Opcionales para version 1

- `producerId`
- `status`: paid, settled, cancelled
- `calculationMode`: `devengado` o `liquidado`
- `groupBy`: dia, semana, mes, productor

#### Opcionales para version 2

- `paymentMethod`
- `onlyInterestEnabled`
- `minInterestRate`
- `maxInterestRate`
- `exportFormat`: pantalla, Excel, PDF

### Recomendacion funcional sobre filtros

Para una primera version, el filtro ideal seria:

- rango de fechas
- temporada
- productor opcional
- modo de calculo: `devengado` o `liquidado`

Ese ultimo filtro es importante porque cambia completamente la lectura del reporte.

### Fuente de datos actual del sistema

Hoy el sistema ya dispone de estos datos relacionados con intereses:

- `Advance.amount`
- `Advance.issueDate`
- `Advance.interestRate`
- `Advance.interestEndDate`
- `Advance.isInterestCalculationEnabled`
- `Advance.status`
- logica de `calculateAdvanceAccruedInterest()` en backend
- consolidado `Settlement.totalInterest`

### Regla de calculo actualmente usada por el sistema

Segun la logica actual del backend:

- si `isInterestCalculationEnabled = false`, el interes es `0`
- si existe `interestEndDate` y es menor a la fecha de referencia, se usa esa fecha como corte
- si no existe, el calculo llega hasta la fecha actual o fecha de referencia
- `daysActive = diferencia entre fecha emision y fecha de corte`
- `monthsActive = daysActive / 30`
- `interes = round((amount x interestRate x monthsActive) / 100)`

Si el reporte quiere ser consistente con el sistema actual, debe reutilizar exactamente esta formula.

### Punto contable pendiente

Este reporte necesita definir si muestra:

1. `Interes devengado`:
   interes calculado al corte, aunque aun no se haya materializado en una liquidacion.
2. `Interes liquidado`:
   interes efectivamente consolidado en liquidaciones completadas.

Ambas lecturas son validas, pero responden preguntas distintas.

### Recomendacion de negocio

Para que el reporte sea realmente util, conviene tratarlo como un reporte con dos vistas:

- `Vista devengada`: para entender el ingreso financiero potencial al corte.
- `Vista liquidada`: para entender el ingreso financiero efectivamente cobrado o consolidado.

Si solo se implementa una vista en la version 1, la recomendacion es comenzar por:

- `Interes devengado al corte`

porque hoy esa logica ya existe claramente en backend y se puede obtener por anticipo.

### Punto tributario pendiente

El sistema hoy no persiste un `IVA de intereses` de forma contable en la entidad de liquidacion ni en el anticipo.

Por lo tanto, este reporte necesita definir una de estas dos posturas:

1. `IVA interes estimado`:
   se muestra como calculo auxiliar `interes x 0.19`.
2. `IVA interes registrado`:
   solo se incorpora cuando exista persistencia formal de ese dato.

### Recomendacion tributaria inicial

Para la version 1, si el negocio quiere ver la foto economica completa, conviene mostrarlo como:

- `IVA interes estimado`

y etiquetarlo explicitamente para no confundirlo con un dato contable ya formalizado.

---

## Propuesta de estructura del reporte

### A. Encabezado ejecutivo

- Nombre del reporte
- Rango de fechas consultado
- Temporada
- Modo de calculo: devengado o liquidado
- Fecha y hora de generacion
- Usuario que genera el reporte

### B. Tarjetas resumen

Indicadores principales:

- Total anticipos considerados
- Capital total colocado
- Tasa promedio de interes
- Interes neto
- IVA interes estimado
- Total servicios financieros

### C. Tendencia temporal

Vista agrupada por dia, semana o mes:

- periodo
- cantidad de anticipos
- capital
- interes neto
- IVA interes
- total financiero

### D. Consolidado por productor

- productor
- cantidad de anticipos
- capital total
- tasa promedio
- interes neto
- IVA interes
- total financiero

### E. Consolidado por estado

- estado del anticipo o estado de liquidacion
- cantidad
- capital
- interes
- total

### F. Detalle operativo

Tabla detallada por anticipo:

- fecha emision
- productor
- temporada
- folio anticipo
- monto capital
- tasa interes
- fecha termino interes
- dias devengados
- interes neto
- IVA interes
- total financiero
- estado anticipo
- settlementId si aplica

---

## KPIs sugeridos

- `advancesCount`
- `capitalPlaced`
- `averageInterestRate`
- `accruedInterestNet`
- `estimatedInterestVat`
- `totalFinancialRevenue`
- `topProducerByInterest`
- `settledInterestAmount`

---

## Definicion sugerida de metricas

### Anticipos con interes activo

Anticipos con `isInterestCalculationEnabled = true` y estado vigente segun el filtro aplicado.

### Capital colocado

Suma de `Advance.amount`.

### Interes neto

`round((amount x interestRate x (daysActive / 30)) / 100)`

### IVA interes estimado

`round(interesNeto x 0.19)`

### Total servicio financiero

`interesNeto + ivaInteresEstimado`

### Dias devengados

Dias entre `issueDate` y fecha de corte efectiva.

---

## Recomendacion de alcance MVP

### Version 1

- Filtros por fecha y temporada
- Vista devengada
- Resumen ejecutivo
- Consolidado por productor
- Detalle por anticipo
- Exportacion a Excel

### Version 2

- Vista dual: devengado vs liquidado
- Comparativo contra periodo anterior
- Segmentacion por estado y forma de pago
- PDF gerencial
- Dashboard grafico

---

## Dudas de negocio a cerrar antes de implementar

1. El reporte debe priorizar `interes devengado` o `interes liquidado`.
2. La fecha de corte debe basarse en `issueDate`, `interestEndDate` o fecha de liquidacion.
3. Deben incluirse anticipos pagados que aun no fueron liquidados.
4. El IVA interes debe mostrarse como estimado o esperar una implementacion contable formal.
5. La vista principal debe agrupar por anticipo, productor o liquidacion.

---

## Recomendacion de definicion final para arrancar

Si hay que partir rapido y con bajo riesgo, la mejor definicion inicial seria:

- Base: anticipos activos del periodo
- Fecha de corte: fecha fin del filtro
- Formula: misma logica de `calculateAdvanceAccruedInterest()`
- IVA: mostrarlo como `IVA interes estimado`
- Filtros: fecha inicio, fecha fin, temporada, productor opcional
- Vista principal: devengado al corte

Eso deja un reporte consistente con la logica actual del sistema y suficientemente claro para gerencia y finanzas.

---

## 3. Reporte de Rentabilidad por Servicios Financieros (Intereses)

### Nombre propuesto

`Estado de Rendimiento de Capital y Devengo de Intereses`

### Otros nombres posibles

- `Panel Ejecutivo de Rentabilidad Financiera`
- `Indicador de Rendimiento de Capital Colocado`
- `Gauge de Devengo y Recaudacion de Intereses`
- `Estado de Cumplimiento de Ingresos Financieros`

### Concepto

Este reporte no busca reemplazar el detalle analitico del reporte anterior, sino resumir en una sola vista ejecutiva que tan rentable ha sido el capital entregado en anticipos durante la temporada.

La idea central es comparar:

- lo que ya se ha recaudado o consolidado por intereses
- versus lo que se espera recaudar al cierre de la temporada

En otras palabras, es un reporte de `cumplimiento de rendimiento financiero`, no solo de acumulacion de movimientos.

### Presentacion principal

`Grafico de medidor (gauge)` que muestre el porcentaje de intereses ya recaudados versus los intereses proyectados para la temporada.

### Proposito

Medir la ganancia obtenida por el financiamiento otorgado a los productores y mostrar, de forma inmediata, si la temporada va por debajo, en linea o por sobre lo esperado en terminos de rendimiento financiero.

### Usuario objetivo

- Gerencia
- Finanzas
- Direccion comercial
- Administracion

### Preguntas que debe responder

- Cuanto capital se ha colocado en anticipos durante la temporada.
- Cuanto interes ya se ha devengado o liquidado.
- Que porcentaje del rendimiento esperado ya se alcanzo.
- Si la temporada va adelantada, normal o atrasada en captacion de ingresos financieros.
- Cual es la tasa de retorno efectiva del capital colocado.

### Parametros recomendados

#### Obligatorios

- `seasonId`

#### Recomendados

- `fechaCorte`

#### Opcionales para version 1

- `producerId`
- `calculationMode`: `devengado` o `liquidado`
- `comparisonMode`: `temporada actual` o `comparado con temporada anterior`

#### Opcionales para version 2

- `targetMode`: `proyeccion automatica` o `meta manual`
- `riceTypeId`
- `paymentMethod`
- `exportFormat`: pantalla, PDF ejecutivo

### Recomendacion funcional sobre filtros

Para este reporte, el filtro principal debe ser la temporada. A diferencia de otros reportes, aqui el foco no es tanto el rango operacional diario sino el avance de cumplimiento dentro del ciclo completo de la temporada.

Por eso, la combinacion recomendada para la primera version es:

- temporada
- fecha de corte
- productor opcional
- modo de calculo

### Fuente de datos actual del sistema

Este reporte puede apoyarse en datos ya existentes:

- `Season.startDate`
- `Season.endDate`
- `Advance.amount`
- `Advance.issueDate`
- `Advance.interestRate`
- `Advance.interestEndDate`
- `Advance.isInterestCalculationEnabled`
- `Advance.status`
- `Settlement.totalInterest`
- logica de `calculateAdvanceAccruedInterest()`

### Diferencia respecto al reporte 2

El reporte 2 responde `cuanto se genero y en que se compone`.

Este reporte 3 responde `que tan rentable va la temporada respecto de su potencial o meta`.

Por eso su presentacion principal no debe ser una tabla sino un indicador visual de cumplimiento.

### Definicion sugerida del gauge

#### Numerador sugerido

`intereses ya recaudados`

Segun la definicion de negocio, puede significar una de estas dos cosas:

1. `Interes liquidado acumulado`:
   suma de intereses consolidados en liquidaciones completadas.
2. `Interes devengado al corte`:
   suma del interes calculado de todos los anticipos vigentes a la fecha de corte.

#### Denominador sugerido

`intereses proyectados para la temporada`

La forma mas consistente con el sistema actual seria proyectarlo usando la fecha de termino real de la temporada (`Season.endDate`) como fecha de corte final.

Formula sugerida:

- para cada anticipo vigente de la temporada, calcular el interes esperado hasta `Season.endDate`
- sumar ese total como `proyeccion de cierre`

#### Porcentaje del gauge

`porcentajeCumplimiento = (interesAlCorte / interesProyectadoTemporada) x 100`

Si el valor supera el 100%, el gauge puede extenderse hasta 120% para reflejar sobrecumplimiento.

### Recomendacion visual del gauge

- `0% a 60%`: rojo
- `60% a 85%`: amarillo
- `85% a 100%`: verde
- `> 100%`: azul o verde intenso

### Tarjetas complementarias sugeridas

Ademas del gauge, conviene mostrar 4 KPIs alrededor:

- Capital colocado total
- Interes al corte
- Proyeccion de cierre
- Rentabilidad sobre capital

### KPI clave del reporte

#### Rentabilidad sobre capital colocado

`rentabilidad = (interesAlCorte / capitalColocado) x 100`

Este KPI ayuda a interpretar el gauge desde la eficiencia del capital, no solo desde el cumplimiento porcentual.

---

## Propuesta de estructura del reporte

### A. Encabezado ejecutivo

- Nombre del reporte
- Temporada
- Fecha de corte
- Modo: devengado o liquidado
- Fecha y hora de generacion

### B. Gauge principal

Indicador central:

- porcentaje de intereses recaudados versus proyectados

Texto complementario debajo del gauge:

- `Interes al corte: $X`
- `Proyeccion temporada: $Y`
- `Cumplimiento: Z%`

### C. Tarjetas resumen

- Capital colocado
- Interes al corte
- IVA interes estimado
- Total financiero al corte
- Rentabilidad sobre capital

### D. Comparativo temporal

Opcional o secundario:

- temporada actual vs temporada anterior
- interes al mismo punto del calendario
- porcentaje de avance comparado

### E. Tabla breve de soporte

No necesita ser extensa. Puede incluir top productores o top anticipos:

- productor
- capital colocado
- interes al corte
- proyeccion cierre
- cumplimiento %

---

## KPIs sugeridos

- `capitalPlaced`
- `interestAtCutoff`
- `projectedSeasonInterest`
- `interestCollectionProgressPercent`
- `capitalYieldPercent`
- `estimatedInterestVat`
- `totalFinancialValue`

---

## Definicion sugerida de metricas

### Capital colocado

Suma de `Advance.amount` de los anticipos incluidos en la temporada y el filtro.

### Interes al corte

Segun el modo elegido:

- `devengado`: interes calculado con fecha de corte
- `liquidado`: interes consolidado en liquidaciones completadas

### Proyeccion de cierre de temporada

Interes esperado calculado usando `Season.endDate` como fecha final de corte para los anticipos vigentes.

### IVA interes estimado

`round(interesAlCorte x 0.19)`

### Total financiero al corte

`interesAlCorte + ivaInteresEstimado`

### Rendimiento de capital

`(interesAlCorte / capitalColocado) x 100`

---

## Recomendacion de alcance MVP

### Version 1

- Filtro por temporada
- Fecha de corte
- Gauge principal
- 4 tarjetas KPI
- Modo devengado

### Version 2

- Vista devengado vs liquidado
- Comparativo contra temporada anterior
- Meta manual configurable
- PDF ejecutivo
- Drill-down a detalle por productor

---

## Dudas de negocio a cerrar antes de implementar

1. El numerador del gauge debe ser `devengado` o `liquidado`.
2. La proyeccion debe basarse en calculo automatico o en una meta de negocio cargada manualmente.
3. Se deben incluir solo anticipos vigentes o tambien anticipos ya liquidados.
4. El gauge puede superar 100% o debe topearse visualmente.
5. El KPI principal debe medirse sobre interes neto o total con IVA.

---

## Recomendacion de definicion final para arrancar

Si hay que partir rapido y con bajo riesgo, la mejor definicion inicial seria:

- Base: anticipos de la temporada
- Numerador: interes devengado al corte
- Denominador: interes proyectado a `Season.endDate`
- Presentacion: gauge + tarjetas KPI
- IVA: mostrarlo como `IVA interes estimado`
- Objetivo: medir rendimiento del capital colocado

Eso convierte este reporte en un panel ejecutivo claro, accionable y coherente con la informacion que hoy ya existe en el sistema.

---

## 4. Reporte de Retorno de Presupuesto

### Nombre propuesto

`Balance de Flujos de Capital y Recuperacion de Egresos`

### Otros nombres posibles

- `Estado de Recuperacion de Capital Entregado`
- `Informe de Retorno de Anticipos Presupuestarios`
- `Flujo de Salida y Recuperacion de Capital`
- `Waterfall de Presupuesto y Recuperacion por Liquidaciones`

### Concepto

Este reporte busca mostrar como el capital entregado a productores a traves de anticipos sale inicialmente de caja y luego se recupera, de manera progresiva, mediante descuentos aplicados en las liquidaciones.

No se enfoca en la ganancia financiera por intereses, sino en la `recuperacion del capital base` que fue desembolsado.

La lectura principal es de flujo:

- salida inicial de dinero por anticipos pagados
- recuperaciones sucesivas por descuentos en liquidaciones
- saldo de capital aun pendiente de recuperar

### Proposito

Medir cuanto del presupuesto destinado a anticipos ya fue recuperado y cuanto sigue expuesto, permitiendo evaluar rotacion del capital, uso del presupuesto y velocidad de recuperacion.

### Presentacion principal

`Grafico de cascada (Waterfall chart)` que muestre:

- la salida inicial de dinero
- las recuperaciones mensuales por descuentos en liquidaciones
- el saldo final pendiente o recuperado

### Usuario objetivo

- Gerencia
- Finanzas
- Tesoreria
- Administracion

### Preguntas que debe responder

- Cuanto presupuesto se desembolso en anticipos dentro del periodo.
- Cuanto de ese capital ya fue recuperado mediante descuentos.
- En que meses se concentra la recuperacion.
- Cuanto capital sigue pendiente de recuperacion.
- Cual es la tasa de recuperacion del capital entregado.

### Parametros recomendados

#### Obligatorios

- `fechaInicio`
- `fechaFin`

#### Recomendados

- `seasonId`

#### Opcionales para version 1

- `producerId`
- `groupBy`: mes
- `viewMode`: `periodo` o `temporada completa`

#### Opcionales para version 2

- `paymentMethod`
- `status`
- `includePendingRecovery`
- `exportFormat`: pantalla, Excel, PDF

### Recomendacion funcional sobre filtros

Para una primera version, el filtro ideal seria:

- rango de fechas
- temporada
- productor opcional

Y el eje del waterfall deberia agruparse por `mes`, porque es la lectura mas natural para presupuesto y recuperacion.

### Fuente de datos actual del sistema

Hoy el sistema ya dispone de una base suficiente para este reporte:

- `Transaction` tipo `ADVANCE` con `amount` y `transactionDate`
- `Advance.amount`
- `Advance.seasonId`
- `Advance.producerId`
- `Settlement.totalAdvances`
- `Transaction` tipo `SETTLEMENT` con `transactionDate`
- relacion entre anticipos y liquidaciones mediante `settlementId`

### Interpretacion sugerida de los flujos

#### Egreso presupuestario

Debe tomarse desde la transaccion tipo `ADVANCE`, usando:

- `transactionDate` como fecha del desembolso
- `amount` como salida de capital

#### Recuperacion de capital

Debe tomarse desde las liquidaciones completadas, usando:

- `Settlement.totalAdvances` como capital recuperado por descuento
- `Transaction.transactionDate` de la transaccion tipo `SETTLEMENT` como fecha de imputacion de la recuperacion

Esta definicion es importante porque la recuperacion no entra como un cobro separado, sino como `compensacion` dentro de la liquidacion.

### Diferencia respecto a los reportes 2 y 3

- El reporte 2 mide `ingreso financiero por intereses`.
- El reporte 3 mide `rendimiento del capital colocado`.
- Este reporte 4 mide `recuperacion del capital entregado`.

Por eso el indicador principal aqui no es interes ni rentabilidad, sino flujo recuperado versus flujo desembolsado.

### Logica sugerida del waterfall

Secuencia visual recomendada:

1. `Salida inicial de capital` en negativo
2. `Recuperacion mes 1`
3. `Recuperacion mes 2`
4. `Recuperacion mes 3`
5. `...`
6. `Saldo pendiente por recuperar`

Alternativamente, si se quiere una lectura mas presupuestaria:

1. `Presupuesto egresado`
2. `Recuperacion acumulada`
3. `Capital pendiente`

### KPI principal del reporte

#### Tasa de recuperacion de capital

`tasaRecuperacion = (capitalRecuperado / capitalDesembolsado) x 100`

Este KPI resume en una sola cifra que porcentaje del dinero entregado ya fue absorbido nuevamente por el sistema mediante liquidaciones.

---

## Propuesta de estructura del reporte

### A. Encabezado ejecutivo

- Nombre del reporte
- Rango de fechas
- Temporada
- Fecha y hora de generacion
- Usuario que genera el reporte

### B. Waterfall principal

Elementos visuales:

- egreso inicial total
- recuperaciones mensuales
- saldo final pendiente

### C. Tarjetas resumen

- Capital desembolsado
- Capital recuperado
- Capital pendiente
- Tasa de recuperacion

### D. Tabla breve de soporte

Consolidado por mes:

- mes
- anticipos pagados
- monto desembolsado
- monto recuperado en liquidaciones
- saldo acumulado pendiente

### E. Tabla de detalle opcional

- fecha anticipo
- productor
- folio anticipo
- capital entregado
- settlementId asociado
- fecha liquidacion
- capital recuperado
- estado de recuperacion

---

## KPIs sugeridos

- `capitalDisbursed`
- `capitalRecovered`
- `capitalPendingRecovery`
- `capitalRecoveryRate`
- `monthlyRecoveryAmount`
- `monthlyDisbursementAmount`
- `netCapitalExposure`

---

## Definicion sugerida de metricas

### Capital desembolsado

Suma de transacciones tipo `ADVANCE` en el periodo.

### Capital recuperado

Suma de `Settlement.totalAdvances` de liquidaciones imputadas en el periodo.

### Capital pendiente de recuperar

`capitalDesembolsado - capitalRecuperado`

### Tasa de recuperacion

`(capitalRecuperado / capitalDesembolsado) x 100`

### Exposicion neta de capital

Monto de capital aun colocado y no compensado por descuentos en liquidaciones.

---

## Recomendacion de alcance MVP

### Version 1

- Filtros por fecha y temporada
- Waterfall mensual
- Tarjetas resumen
- Tabla consolidada por mes
- Exportacion a Excel

### Version 2

- Comparativo contra periodo anterior
- Drill-down por productor
- Segmentacion por forma de pago
- Dashboard financiero ampliado
- PDF ejecutivo

---

## Dudas de negocio a cerrar antes de implementar

1. La recuperacion debe imputarse por fecha de liquidacion, fecha de pago o fecha de transaccion settlement.
2. El capital recuperado debe incluir solo liquidaciones completadas o tambien borradores proyectados.
3. El saldo pendiente debe calcularse solo dentro del rango filtrado o sobre todo el historico de la temporada.
4. El waterfall debe partir desde egreso bruto del periodo o desde saldo pendiente inicial mas movimientos del periodo.
5. El reporte debe considerar recuperacion solo de capital o tambien mostrar intereses como capa separada.

---

## Recomendacion de definicion final para arrancar

Si hay que partir rapido y con bajo riesgo, la mejor definicion inicial seria:

- Base de egresos: transacciones `ADVANCE`
- Base de recuperacion: `Settlement.totalAdvances` en liquidaciones completadas
- Fecha de recuperacion: `transactionDate` de la transaccion `SETTLEMENT`
- Agrupacion: mensual
- Presentacion: waterfall + KPIs
- Objetivo: medir recuperacion de capital, no rentabilidad

---

## 5. Informe de Rendimiento de Proceso (Peso Neto vs. Paddy Neto)

### Nombre propuesto

`Balance de Mermas y Rendimiento Industrial`

### Otros nombres posibles

- `Informe de Rendimiento de Proceso por Temporada`
- `Consolidado de Descuentos y Mermas por Ingreso`
- `Resumen de Calidad de Materia Prima Recibida`
- `Reporte de Eficiencia de Recepcion`

### Concepto

Este reporte muestra la transformacion de peso desde el ingreso en romana hasta el arroz paddy neto disponible en silo. Cuantifica, en kilogramos y porcentaje, cuanta masa se pierde por impurezas, vano y humedad en el proceso de recepcion e inicio de secado.

El objetivo no es mostrar ingresos economicos sino la eficiencia fisica del proceso: cuanta materia prima "real" se recibe por cada kilo bruto que entra a planta.

### Objetivo de negocio

Responder preguntas como:

- Que porcentaje del peso bruto ingresado efectivamente se convierte en arroz paddy neto.
- Cuantos kilos se pierden por impurezas en promedio en esta temporada versus temporadas anteriores.
- Que productores o que tipos de arroz presentan mayor indice de merma.
- En que periodos del año (inicio, mitad, fin de temporada) la calidad de la materia prima es peor.
- Cuanto "peso fantasma" esta procesando la planta (secado, logistica) sobre materia que nunca se convierte en producto.

### Usuario objetivo

- Gerencia de Operaciones
- Jefe de Planta
- Gerencia General
- Control de Calidad

### Parametros recomendados

#### Obligatorios

- **Temporada** (`season_id`): para delimitar el universo de recepciones

#### Opcionales

- **Rango de fechas** (`receptionDate`): para analisis de periodo especifico
- **Productor** (`producerId`): drill-down por proveedor de materia prima
- **Tipo de arroz** (`riceTypeId`): para analizar rendimiento por variedad
- **Agrupacion temporal**: diaria / semanal / mensual

---

### Fuentes de datos

| Entidad | Campos utilizados |
|---|---|
| `Reception` | `grossWeight`, `humidity`, `impurities`, `vano`, `netWeight`, `riceTypeId`, `producerId`, `receptionDate`, `settlementId` |
| `AnalysisRecord` | `humidity`, `impurities`, `vano`, `dryPercent`, `receptionId` |
| `Settlement` | `issuedAt` (para filtrar liquidaciones) |
| `Producer` | `name`, `rut` (para etiquetado) |
| `RiceType` | `name` (para etiquetado) |
| `Season` | `startDate`, `endDate`, `year` (para filtro de temporada) |

---

### Reglas de calculo

#### Merma por impurezas (kg)

```
mermaPorImpurezas = grossWeight × (impurities / 100)
```

#### Merma por vano (kg)

```
mermaPorVano = grossWeight × (vano / 100)
```

#### Merma por humedad (kg)

La humedad afecta el peso durante el secado. Se calcula como perdida de peso sobre el peso despues de impurezas:

```
pesoDespuesImpurezas = grossWeight - mermaPorImpurezas - mermaPorVano
mermaPorHumedad = round(pesoDespuesImpurezas × (humidity / 100))
```

> Nota: el sistema actual persiste directamente `netWeight` en `Reception`. Si `netWeight` ya incorpora todos los descuentos, los calculos individuales de merma deben derivarse de los campos de analisis (`AnalysisRecord`) vinculados a cada recepcion.

#### Paddy neto resultante

```
paddyNeto = netWeight    // campo persistido en Reception
```

#### Rendimiento del proceso (%)

```
rendimientoProceso = (paddyNeto / grossWeight) × 100
```

#### Merma total (kg)

```
mermaTotalKg = grossWeight - paddyNeto
mermaTotalPct = (mermaTotalKg / grossWeight) × 100
```

#### Desglose proporcional de merma (para Sankey)

Para visualizar el flujo en el diagrama, cada capa de descuento se calcula en orden:

```
nodoEntrada       = grossWeight
nodoPostImpurezas = grossWeight - mermaPorImpurezas
nodoPostVano      = nodoPostImpurezas - mermaPorVano
nodoPostHumedad   = nodoPostVano - mermaPorHumedad   // ≈ netWeight
nodoPaddyNeto     = netWeight
```

Los flujos del Sankey son:
- `nodoEntrada → nodoPostImpurezas`: peso limpio de impurezas
- `nodoEntrada → mermaImpurezas`: perdida por impurezas
- `nodoPostImpurezas → nodoPostVano`: peso limpio de vano
- `nodoPostImpurezas → mermaVano`: perdida por vano
- `nodoPostVano → paddyNeto`: peso final
- `nodoPostVano → mermaHumedad`: perdida por humedad

---

### Metricas clave (KPIs)

| KPI | Descripcion |
|---|---|
| **Rendimiento de proceso (%)** | `paddyNeto / grossWeight × 100` |
| **Merma total (kg)** | `grossWeight - paddyNeto` |
| **% Merma por impurezas** | Promedio ponderado de impurezas sobre total ingresado |
| **% Merma por vano** | Promedio ponderado de vano sobre total ingresado |
| **% Merma por humedad** | Promedio ponderado de humedad sobre total ingresado |
| **Total kg netos acumulados** | Suma de `netWeight` en el periodo |
| **Total recepciones procesadas** | Conteo de recepciones en el periodo |

---

### Estructura propuesta del reporte

#### Tarjetas resumen (header)

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Kg Brutos        │  │ Paddy Neto      │  │ Merma Total     │  │ Rendimiento     │
│ Ingresados       │  │ Resultante      │  │ (kg)            │  │ del Proceso     │
│  1.580.000 kg    │  │  1.432.400 kg   │  │  147.600 kg     │  │    90,7 %       │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

#### Diagrama de Sankey

Flujo de perdida de peso desde ingreso en romana hasta silo de arroz limpio.

```
                     ┌─────────────────────────────────────────────────────────┐
                     │                 DIAGRAMA DE SANKEY                      │
  Kg Brutos          │                                                          │
  Ingresados ════════╪═══════════════════════════════════════════> Paddy Neto  │
  (1.580.000 kg)     │              ╔═════════╗                  (1.432.400 kg)│
                     │              ║ Merma   ║ Impurezas: 32.000 kg           │
                     │              ║ Merma   ║ Vano:      18.000 kg           │
                     │              ║ Merma   ║ Humedad:   97.600 kg           │
                     └─────────────────────────────────────────────────────────┘
```

Tecnologia recomendada para frontend: **Recharts `<Sankey />`** o **D3-Sankey** dentro del componente de reporte.

#### Grafico de barras apiladas (desglose mensual)

- Eje X: mes de la temporada
- Eje Y: kilogramos
- Capas (de abajo a arriba): Paddy Neto (verde) → Merma Humedad (amarillo) → Merma Vano (naranja) → Merma Impurezas (rojo)
- Linea superpuesta: % rendimiento mensual (eje Y derecho)

#### Tabla de detalle por productor

| Productor | Kg Brutos | Merma Imp. (kg) | Merma Vano (kg) | Merma Hum. (kg) | Paddy Neto (kg) | Rendimiento (%) |
|---|---|---|---|---|---|---|
| Rodriguez, Juan | 180.000 | 3.600 | 2.160 | 11.700 | 162.540 | 90,3% |
| Gonzalez, Maria | 95.000 | 1.425 | 950 | 5.985 | 86.640 | 91,2% |
| ... | ... | ... | ... | ... | ... | ... |
| **Total** | **1.580.000** | **32.000** | **18.000** | **97.600** | **1.432.400** | **90,7%** |

#### Tabla de detalle por tipo de arroz

Similar a la tabla por productor, agrupando por `RiceType.name`, para identificar que variedades presentan mejor o peor rendimiento de proceso.

---

### Puntos tecnicos pendientes de definicion

#### 1. Disponibilidad de `grossWeight` en `Reception`

El sistema persiste `netWeight` en la entidad `Reception`. Se debe confirmar si el campo `grossWeight` (peso bruto antes de descuentos) tambien esta persistido o si solo existe en el informe de romana impreso.

> **Decision requerida**: confirmar si `Reception.grossWeight` existe como campo persistido o si debe agregarse al modelo.

#### 2. Granularidad de mermas por analisis

Actualmente `AnalysisRecord` persiste `humidity`, `impurities`, `vano` como porcentajes. El calculo de kilogramos de merma se hace dividiendo `grossWeight × porcentaje`, pero si `grossWeight` no existe como campo, se debe calcular en reversa desde `netWeight`.

Formula inversa:

```
totalDescuentoPct = impurities + vano + humidity
grossWeight = netWeight / (1 - totalDescuentoPct/100)
```

> **Advertencia**: esta formula inversa es una aproximacion y puede acumular error de redondeo si los descuentos se aplicaron de forma secuencial y no simultanea.

#### 3. Relacion entre `Reception` y `AnalysisRecord`

Confirmar si existe una relacion `1:1` o `1:N` entre `Reception` y `AnalysisRecord`. Si es `1:N` (multiples analisis por recepcion), definir cual se usa para el calculo de merma: el ultimo, el primero, o un promedio.

---

### Propuesta de endpoint de backend

```
GET /analytics/process-yield
  ?seasonId=...
  &startDate=...&endDate=...
  &producerId=...
  &riceTypeId=...
  &groupBy=producer|riceType|month
```

#### Respuesta sugerida

```json
{
  "summary": {
    "totalGrossWeight": 1580000,
    "totalNetWeight": 1432400,
    "totalShrinkageKg": 147600,
    "processYieldPct": 90.7,
    "impuritiesShrinkageKg": 32000,
    "vanoShrinkageKg": 18000,
    "humidityShrinkageKg": 97600
  },
  "sankey": {
    "nodes": [
      { "id": "entrada", "label": "Kg Brutos Ingresados" },
      { "id": "postImpurezas", "label": "Post Impurezas" },
      { "id": "postVano", "label": "Post Vano" },
      { "id": "paddyNeto", "label": "Paddy Neto" },
      { "id": "mermaImpurezas", "label": "Merma Impurezas" },
      { "id": "mermaVano", "label": "Merma Vano" },
      { "id": "mermaHumedad", "label": "Merma Humedad" }
    ],
    "links": [
      { "source": "entrada", "target": "postImpurezas", "value": 1548000 },
      { "source": "entrada", "target": "mermaImpurezas", "value": 32000 },
      { "source": "postImpurezas", "target": "postVano", "value": 1530000 },
      { "source": "postImpurezas", "target": "mermaVano", "value": 18000 },
      { "source": "postVano", "target": "paddyNeto", "value": 1432400 },
      { "source": "postVano", "target": "mermaHumedad", "value": 97600 }
    ]
  },
  "monthly": [
    {
      "month": "2025-11",
      "grossWeight": 320000,
      "netWeight": 290560,
      "yieldPct": 90.8,
      "impuritiesKg": 6400,
      "vanoKg": 3840,
      "humidityKg": 19200
    }
  ],
  "byProducer": [ ... ],
  "byRiceType": [ ... ]
}
```

---

### Recomendacion de alcance MVP

#### Version 1

- Filtros: temporada + rango de fechas
- 4 tarjetas KPI (kg brutos, paddy neto, merma total, rendimiento %)
- Diagrama de Sankey global (toda la temporada)
- Grafico de barras apiladas mensual con linea de rendimiento
- Tabla de totales por productor
- Exportacion a Excel

#### Version 2

- Filtro por tipo de arroz
- Drill-down por productor con Sankey individual
- Comparativo interanual (temporada actual vs anterior)
- Tabla por tipo de arroz
- Alertas de rendimiento bajo umbral configurable
- Exportacion a PDF con graficos embebidos

---

### Dudas de negocio a cerrar antes de implementar

1. El campo `grossWeight` existe como campo persistido en `Reception` o solo se imprime en el bono de romana.
2. Si `grossWeight` no existe, se acepta la formula inversa como aproximacion o se requiere agregar el campo al modelo.
3. La relacion entre `Reception` y `AnalysisRecord` es siempre `1:1` o puede ser `1:N`.
4. El rendimiento de proceso debe calcularse por recepcion individual o solo a nivel agregado.
5. Existe un umbral de rendimiento minimo aceptable para la planta (por ejemplo: debajo del 88% se considera materia prima de baja calidad).
6. La "merma por humedad" debe mostrarse como merma de proceso en planta o como caracteristica de la materia prima del productor.
7. El reporte debe filtrar solo recepciones con liquidacion asignada o incluir todas las recepciones procesadas.

---

### Recomendacion de definicion final para arrancar

Si hay que partir rapido y con bajo riesgo, la mejor definicion inicial seria:

- **Base de datos**: recepciones en la temporada seleccionada (`Season`) con sus registros de analisis (`AnalysisRecord`)
- **Peso neto**: usar `Reception.netWeight` como campo principal (ya persiste en el sistema)
- **Peso bruto**: confirmar existencia de `Reception.grossWeight`; si no existe, agregar el campo antes de implementar
- **Mermas**: calcular desde los porcentajes en `AnalysisRecord` aplicados sobre el `grossWeight`
- **Agrupacion**: mensual + por productor
- **Visualizacion**: Sankey global + barras apiladas mensuales + tabla por productor
- **Objetivo**: mostrar la calidad real de la materia prima recibida en la temporada y cuanta masa es "peso fantasma" que la planta procesa sin convertirse en arroz neto

---

## 6. Volumen de Compra y Precio Promedio por Kilo

### Objetivo del reporte

Mostrar **cuantos kilogramos de arroz paddy compro la planta en la temporada** y **a que precio promedio por kilo**. Es el reporte de volumen y costo de materia prima: cuanto se compro, cuanto se pago y si el precio fue uniforme o vario entre meses y proveedores.

Aplica tanto para la vision global de la temporada como para el analisis individual por productor.

---

### Consulta de negocio que responde

| Pregunta | Metrica |
|---|---|
| Cuantos kilos compre en total esta temporada? | `SUM(finalNetWeight)` sobre todas las recepciones liquidadas |
| Cual fue el precio promedio real que pague por kilo? | `SUM(totalPrice) / SUM(finalNetWeight)` |
| Cuanto pague en total (sin IVA)? | `SUM(Settlement.totalPrice)` |
| Cuanto pague en total (con IVA)? | `SUM(Settlement.totalPrice + Settlement.ivaRice)` |
| Que productor me vendio mas volumen? | Ranking por `SUM(finalNetWeight)` por productor |
| Que productor tuvo el precio promedio mas alto? | `SUM(totalPrice) / SUM(finalNetWeight)` por productor |
| Vario el precio promedio a lo largo de la temporada? | Precio promedio mensual: `SUM(totalPrice) / SUM(finalNetWeight)` agrupado por mes |
| Que participacion tuvo cada productor en el volumen total? | `kilosProductor / totalKilosTemporada * 100` |

---

### Modelo de datos

#### Campos fuente

| Campo | Entidad | Descripcion |
|---|---|---|
| `grossWeight` | `Reception` | Kilos brutos entregados por el camion |
| `tareWeight` | `Reception` | Peso del camion vacio (tara) |
| `netWeight` | `Reception` | `grossWeight - tareWeight` (bruto menos tara) |
| `finalNetWeight` | `Reception` | `netWeight - totalDiscountKg + bonusKg` — kilos sobre los que se paga |
| `ricePrice` | `Reception` | Precio base acordado por kilo (en CLP) |
| `totalPrice` | `Settlement` | Monto neto pagado al productor por la recepcion (sin IVA) |
| `ivaRice` | `Settlement` | IVA 19% aplicado sobre `totalPrice` |
| `season` | `Reception` | Temporada a la que pertenece la recepcion |
| `producer` | `Reception` | Productor que entrego la carga |
| `receptionDate` | `Reception` | Fecha de recepcion (para agrupacion mensual) |

#### Relaciones de join

```
Reception
  → Settlement (via reception_id)
  → Producer (via producer_id)
  → Season (via season_id)
  → RiceType (via rice_type_id)  [opcional: filtro por variedad]
```

#### Calculo del precio promedio ponderado

```
precioPromedioPonderado = SUM(totalPrice) / SUM(finalNetWeight)
```

Este es el precio **promedio ponderado por volumen**: si un productor entrego 5.000 kg a $200/kg y otro entrego 1.000 kg a $220/kg, el promedio no es $210 sino $203,3. Es el precio que realmente importa para el costo de materia prima.

Alternativamente se puede calcular desde `Reception.ricePrice` como promedio simple o ponderado:

```
precioPromedioSimple   = SUM(ricePrice) / COUNT(recepciones)
precioPromedioPonderado = SUM(ricePrice * finalNetWeight) / SUM(finalWeight)
```

Ambas formulas deben dar el mismo resultado que `SUM(totalPrice) / SUM(finalNetWeight)` porque `totalPrice = finalNetWeight * ricePrice`.

---

### KPIs globales de la temporada

| KPI | Formula | Unidad |
|---|---|---|
| `totalKilosBrutos` | `SUM(Reception.grossWeight)` | kg |
| `totalKilosNetos` | `SUM(Reception.netWeight)` | kg |
| `totalKilosPagados` | `SUM(Reception.finalNetWeight)` | kg |
| `mermaTotal%` | `(1 - totalKilosPagados / totalKilosBrutos) * 100` | % |
| `precioPromedioPonderado` | `SUM(totalPrice) / SUM(finalNetWeight)` | CLP/kg |
| `totalPagadoNeto` | `SUM(Settlement.totalPrice)` | CLP |
| `totalPagadoConIva` | `SUM(Settlement.totalPrice + Settlement.ivaRice)` | CLP |
| `cantidadRecepciones` | `COUNT(Reception)` | # |
| `cantidadProductores` | `COUNT(DISTINCT producer_id)` | # |

---

### Vista 1 — Resumen global de la temporada

Tarjetas KPI en la parte superior + tabla de resumen consolidado.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VOLUMEN Y PRECIO DE COMPRA — Temporada [nombre]                            │
│  Filtros: [Temporada ▾]  [Tipo de arroz ▾]                                  │
├─────────────┬─────────────┬─────────────┬──────────────┬────────────────────┤
│  Total kg   │  Total kg   │  Precio     │  Total pagado│  Total pagado      │
│  brutos     │  pagados    │  prom/kg    │  neto        │  con IVA           │
│             │             │             │              │                    │
│ 2.450.000   │ 2.215.000   │   $183,40   │  $406.000.000│  $483.140.000      │
│  (kg)       │  (kg)       │  (CLP/kg)   │  (sin IVA)   │  (con IVA 19%)     │
│                                Merma total: 9,6 %                           │
├─────────────┴─────────────┴─────────────┴──────────────┴────────────────────┤
│  Recepciones procesadas: 124    │    Productores activos: 12                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Vista 2 — Evolucion mensual de volumen y precio

Grafico de **barras (volumen kg pagados) + linea (precio promedio/kg)** agrupado por mes.

Tabla de soporte mensual:

| Mes | Recepciones | kg Brutos | kg Pagados | Merma % | Precio Prom/kg | Monto Neto |
|---|---|---|---|---|---|---|
| Marzo 2025 | 18 | 320.000 | 289.000 | 9,7% | $181,50 | $52.453.500 |
| Abril 2025 | 32 | 580.000 | 524.000 | 9,7% | $183,00 | $95.892.000 |
| Mayo 2025 | 41 | 780.000 | 705.000 | 9,6% | $184,20 | $129.861.000 |
| Junio 2025 | 33 | 770.000 | 697.000 | 9,5% | $183,80 | $128.014.600 |
| **TOTAL** | **124** | **2.450.000** | **2.215.000** | **9,6%** | **$183,40** | **$406.221.100** |

Permite detectar:
- Si el precio subio o bajo a lo largo de la temporada
- En que meses se concentro el volumen de compra
- Si la merma fue uniforme o vario con el tiempo (relacionado con la calidad de la materia prima en cada mes)

---

### Vista 3 — Analisis por productor

Tabla ranking ordenable por cualquier columna. Es el modulo de analisis individual requerido.

| Productor | Recepciones | kg Brutos | kg Pagados | Merma % | Precio Prom/kg | Monto Total Neto | Participacion % |
|---|---|---|---|---|---|---|---|
| Juan Perez | 22 | 480.000 | 432.000 | 10,0% | $184,50 | $79.704.000 | 19,5% |
| Maria Gonzalez | 19 | 410.000 | 375.000 | 8,5% | $183,00 | $68.625.000 | 16,9% |
| Pedro Rojas | 15 | 290.000 | 268.000 | 7,6% | $185,20 | $49.633.600 | 12,1% |
| ... | | | | | | | |
| **TOTAL** | **124** | **2.450.000** | **2.215.000** | **9,6%** | **$183,40** | **$406.221.100** | **100%** |

Columnas clave adicionales opcionales:
- `delta Precio vs Prom`: diferencia entre el precio promedio del productor y el precio promedio de la temporada (`producerAvgPrice - seasonAvgPrice`)
- Semaforo de precio: verde si el precio del productor esta dentro de ±2% del promedio, amarillo si esta entre 2%-5%, rojo si supera 5%
- Semaforo de merma: verde si merma < 8%, amarillo 8%-12%, rojo > 12%

---

### Vista 4 — Detalle por productor (drill-down)

Cuando el usuario hace clic en un productor de la tabla anterior, ve el detalle de todas sus recepciones:

| Fecha | N° Recepcion | Tipo Arroz | kg Brutos | kg Pagados | Merma % | Precio/kg | Monto Neto |
|---|---|---|---|---|---|---|---|
| 15-mar-2025 | REC-001 | Arroz Largo | 22.000 | 19.800 | 10,0% | $182,00 | $3.603.600 |
| 22-mar-2025 | REC-007 | Arroz Largo | 24.500 | 22.100 | 9,8% | $182,00 | $4.022.200 |
| 05-abr-2025 | REC-015 | Arroz Corto | 18.000 | 16.200 | 10,0% | $186,00 | $3.013.200 |
| ... | | | | | | | |
| **TOTAL** | | | **480.000** | **432.000** | **10,0%** | **$184,50** | **$79.704.000** |

---

### Endpoint propuesto

#### Global + mensual

```
GET /api/v1/analytics/volume-price?seasonId=:id&riceTypeId=:id
```

**Response:**
```json
{
  "season": { "id": 1, "name": "Temporada 2025", "year": 2025 },
  "summary": {
    "totalGrossKg": 2450000,
    "totalNetKg": 2215000,
    "mermaPct": 9.6,
    "weightedAvgPricePerKg": 183.40,
    "totalPaidNet": 406221100,
    "totalPaidWithVat": 483203109,
    "totalReceptions": 124,
    "totalProducers": 12
  },
  "monthly": [
    {
      "month": "2025-03",
      "receptions": 18,
      "grossKg": 320000,
      "netKg": 289000,
      "mermaPct": 9.7,
      "avgPricePerKg": 181.50,
      "totalPaidNet": 52453500
    }
  ]
}
```

#### Por productor

```
GET /api/v1/analytics/volume-price/by-producer?seasonId=:id&riceTypeId=:id
```

**Response:**
```json
{
  "seasonAvgPricePerKg": 183.40,
  "producers": [
    {
      "producerId": 3,
      "producerName": "Juan Perez",
      "producerRut": "12.345.678-9",
      "receptions": 22,
      "grossKg": 480000,
      "netKg": 432000,
      "mermaPct": 10.0,
      "avgPricePerKg": 184.50,
      "deltaVsSeasonAvg": 1.10,
      "totalPaidNet": 79704000,
      "participationPct": 19.5
    }
  ]
}
```

#### Drill-down por productor

```
GET /api/v1/analytics/volume-price/producer/:producerId?seasonId=:id
```

Retorna el detalle recepcion a recepcion del productor.

---

### Mockup de visualizacion

```
╔══════════════════════════════════════════════════════════════════════╗
║  VOLUMEN Y PRECIO DE COMPRA          Temporada 2025 ▾   Arroz: Todos ▾ ║
╠════════════╦═══════════════╦══════════════╦════════════╦═════════════╣
║ 2.450.000  ║   2.215.000   ║   $ 183,40   ║  $ 406 MM  ║  $ 483 MM   ║
║  kg Brutos ║   kg Pagados  ║   por kilo   ║  Neto      ║  Con IVA    ║
╠════════════╩═══════════════╩══════════════╩════════════╩═════════════╣
║                                                                      ║
║  kg Pagados por mes              Precio promedio mensual (CLP/kg)    ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          ──────────────────────────────────   ║
║  ▓█████▓  ████████  █████▓      ●──────●──────●──────●              ║
║  Mar      Abr       May  Jun    $181   $183   $184   $184            ║
║                                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║  RANKING PRODUCTORES                                      [Exportar] ║
║  Productor        kg Pagados   Particip  Precio/kg  Delta vs Prom    ║
║  Juan Perez       432.000      19,5%     $184,50    ▲ +$1,10        ║
║  Maria Gonzalez   375.000      16,9%     $183,00    ── $0,00        ║
║  Pedro Rojas      268.000      12,1%     $185,20    ▲ +$1,80        ║
║  [Ver detalle →]                                                     ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

### Logica de backend: consulta SQL conceptual

```sql
-- Global de temporada
SELECT
  SUM(r.gross_weight)                              AS total_gross_kg,
  SUM(r.final_net_weight)                          AS total_net_kg,
  ROUND((1 - SUM(r.final_net_weight) /
         SUM(r.gross_weight)) * 100, 2)            AS merma_pct,
  ROUND(SUM(s.total_price) /
        SUM(r.final_net_weight), 2)                AS avg_price_per_kg,
  SUM(s.total_price)                               AS total_paid_net,
  SUM(s.total_price + s.iva_rice)                  AS total_paid_with_vat,
  COUNT(r.id)                                      AS reception_count,
  COUNT(DISTINCT r.producer_id)                    AS producer_count
FROM receptions r
JOIN settlements s ON s.reception_id = r.id
WHERE r.season_id = :seasonId
  AND s.status = 'settled'           -- solo liquidaciones completadas

-- Por mes
SELECT
  DATE_FORMAT(r.reception_date, '%Y-%m')           AS month,
  COUNT(r.id)                                       AS reception_count,
  SUM(r.gross_weight)                               AS gross_kg,
  SUM(r.final_net_weight)                           AS net_kg,
  ROUND(SUM(s.total_price) /
        SUM(r.final_net_weight), 2)                 AS avg_price_per_kg,
  SUM(s.total_price)                                AS total_paid_net
FROM receptions r
JOIN settlements s ON s.reception_id = r.id
WHERE r.season_id = :seasonId
  AND s.status = 'settled'
GROUP BY DATE_FORMAT(r.reception_date, '%Y-%m')
ORDER BY month;

-- Por productor
SELECT
  p.id                                              AS producer_id,
  p.first_name || ' ' || p.last_name               AS producer_name,
  p.rut                                             AS producer_rut,
  COUNT(r.id)                                       AS reception_count,
  SUM(r.gross_weight)                               AS gross_kg,
  SUM(r.final_net_weight)                           AS net_kg,
  ROUND(SUM(s.total_price) /
        SUM(r.final_net_weight), 2)                 AS avg_price_per_kg,
  SUM(s.total_price)                                AS total_paid_net
FROM receptions r
JOIN settlements s ON s.reception_id = r.id
JOIN producers  p ON r.producer_id = p.id
WHERE r.season_id = :seasonId
  AND s.status = 'settled'
GROUP BY p.id
ORDER BY net_kg DESC;
```

---

### Alcance MVP

| Funcionalidad | Alcance |
|---|---|
| Totales globales de temporada | MVP |
| Evolucion mensual (grafico barras + linea) | MVP |
| Ranking de productores | MVP |
| Drill-down por productor (todas sus recepciones) | MVP |
| Filtro por tipo de arroz | MVP |
| Comparacion temporal (temporada actual vs anterior) | Post-MVP |
| Exportar a Excel | Post-MVP |
| Semaforo de precio y merma | Post-MVP |

---

### Dudas de negocio a cerrar antes de implementar

1. El "precio por kilo" que se muestra en el reporte debe ser sobre `finalNetWeight` (kilos pagados con descuentos de analisis) o sobre `netWeight` (kilos brutos menos tara)? La formula operacional es sobre `finalNetWeight`, pero para comparar con el mercado puede ser mas comodo usar el bruto.
2. Hay recepciones sin liquidacion asociada (por ejemplo, rechazadas o en proceso)? Deben incluirse con peso pero sin precio, o excluirse del reporte?
3. El filtro por tipo de arroz es relevante para este reporte? Algunos anos se puede comprar mas de una variedad a precios distintos.
4. El "precio base por kilo" (`ricePrice`) es el mismo para todos los productores en un mes dado, o puede variar individualmente por negociacion?
5. Se requiere mostrar el precio con o sin los ajustes por bonificacion de calidad?

Eso deja un reporte muy claro para tesoreria y finanzas, y ademas se apoya en datos que hoy ya existen en el sistema.

---

## 7. Libro de Existencias Virtual (Deposito vs. Almacen Propio)

### Objetivo del reporte

Generar un **libro de movimiento de existencias mensual** que refleje la ubicacion virtual de cada kilo de arroz paddy recibido en la temporada, distinguiendo entre:

- **DEPOSITO**: kilos recibidos del agricultor pero aun no comprados (liquidacion pendiente). El arroz no pertenece a la empresa.
- **PROPIO**: kilos formalmente comprados via liquidacion. El arroz es propiedad de la empresa.

El reporte replica el flujo contable real de la planta: toda recepcion ingresa al deposito; toda liquidacion concretada mueve kilos del deposito al almacen propio.

---

### Reglas de negocio del libro

| Evento | Efecto en DEPOSITO | Efecto en PROPIO |
|---|---|---|
| Llegada de una recepcion | `+ netWeight` (ingreso) | sin cambio |
| Liquidacion completada (status = `settled`) | `- finalNetWeight` (egreso) | `+ finalNetWeight` (ingreso) |
| Recepcion cancelada | se revierte el ingreso | sin cambio |

**Saldo mensual:**

```
DEPOSITO.cierre  = DEPOSITO.apertura + SUM(recepcionesDelMes.netWeight)
                   - SUM(comprasDelMes.finalNetWeight)

PROPIO.cierre    = PROPIO.apertura   + SUM(comprasDelMes.finalNetWeight)

TOTAL.cierre     = DEPOSITO.cierre   + PROPIO.cierre
```

> Nota: El "saldo PROPIO" puede ser negativo si se han comprado mas kilos de los que habia en deposito al inicio del periodo (situacion valida en los primeros meses de la temporada cuando el saldo anterior es cero y se hicieron compras anticipadas).

---

### Modelo de datos

#### Campos fuente

| Campo | Entidad | Descripcion | Movimiento |
|---|---|---|---|
| `netWeight` | `Reception` | Kilos brutos menos tara — lo que fisicamente entro al deposito | DEPOSITO + |
| `finalNetWeight` | `Reception` | Kilos pagados despues de descuentos de analisis — lo que se compra | DEPOSITO - / PROPIO + |
| `guideNumber` | `Reception` | Numero de guia de despacho del agricultor (ej: 193, 220, 218) | Dato de referencia |
| `grossWeight` | `Reception` | Kilos brutos del camion antes de tara | Columna informativa |
| `ricePrice` | `Reception` | Precio acordado por kg | Dato de compra |
| `totalPrice` | `Settlement` | Monto neto pagado al productor | Dato de compra |
| `ivaRice` | `Settlement` | IVA 19% sobre totalPrice | Dato de compra |
| `settledAt` | `Settlement` | Fecha en que se completo la liquidacion | Determina mes de compra |
| `receptionDate` | `Reception` | Fecha de llegada | Determina mes de recepcion |
| `producer` | `Reception` | Relacion con el productor (nombre, rut) | Identificacion |
| `settlementId` | `Reception` | FK a Settlement — si tiene valor, la recepcion esta comprada | Estado |

#### Campos pendientes de agregar al modelo

| Campo | Entidad | Motivo |
|---|---|---|
| `receptionBookNumber` | `Reception` | Numero correlativo del libro de recepciones (ej: 7413, 7414...). Actualmente no existe en el modelo. Se necesita para trazar cada guia fisicamente. |
| `purchaseInvoiceNumber` | `Settlement` | Numero de factura de compra emitida al agricultor. Actualmente el Settlement no tiene este campo. |

---

### Vista 1 — Cuadro resumen mensual

Encabezado del libro para el mes seleccionado. Replica exactamente el formato del cuadro de gestion actual de la empresa:

```
┌──────────────────────────────────────────────────────────────────────┐
│                          MAYO 2025                                   │
│  Temporada: [Temporada 2025 ▾]   Mes: [Mayo ▾]                      │
├─────────────────────┬──────────────────┬────────────────┬────────────┤
│                     │      TOTAL       │     PROPIO     │  DEPOSITO  │
├─────────────────────┼──────────────────┼────────────────┼────────────┤
│  SALDO ANTERIOR     │    5.733.503     │    -93.268     │ 5.826.771  │
│  KILOS RECIBIDOS    │    9.211.613     │        —       │ 9.211.613  │
│  COMPRAS            │    3.003.331     │  + 3.003.331   │-3.003.331  │
├─────────────────────┼──────────────────┼────────────────┼────────────┤
│  EXISTENCIAS MES    │   14.945.116     │  2.910.063     │12.035.053  │
└─────────────────────┴──────────────────┴────────────────┴────────────┘
```

**Calculos:**
- `SALDO_ANTERIOR` = existencias al cierre del mes anterior (calculado recursivamente)
- `KILOS_RECIBIDOS` = `SUM(Reception.netWeight)` donde `receptionDate` cae en el mes
- `COMPRAS` = `SUM(Reception.finalNetWeight)` de recepciones cuyo `Settlement.settledAt` cae en el mes
- `EXISTENCIAS_MES.DEPOSITO` = `SALDO_ANTERIOR.DEPOSITO + KILOS_RECIBIDOS - COMPRAS`
- `EXISTENCIAS_MES.PROPIO` = `SALDO_ANTERIOR.PROPIO + COMPRAS`

---

### Vista 2 — Detalle cronologico de movimientos

Listado de cada evento del mes, ordenado por fecha. Cada fila es o una recepcion o una compra, mostrando las columnas relevantes al tipo de movimiento.

**Columnas del detalle:**

| Columna | Recepcion (→ DEPOSITO) | Compra / Liquidacion (DEPOSITO → PROPIO) |
|---|---|---|
| FECHA | `Reception.receptionDate` | `Settlement.settledAt` |
| GUIA RECEPCION | `Reception.receptionBookNumber` (*) | — |
| RUT | `Producer.rut` | `Producer.rut` |
| AGRICULTOR | `Producer.firstName + lastName` | `Producer.firstName + lastName` |
| GUIA DE DESPACHO | `Reception.guideNumber` | — |
| KILOS (recibidos) | `Reception.netWeight` | — |
| FACTURA COMPRA | — | `Settlement.purchaseInvoiceNumber` (*) |
| KILOS (comprados) | — | `Reception.finalNetWeight` |
| PRECIO | — | `Reception.ricePrice` |
| TOTAL | — | `Settlement.totalPrice + Settlement.ivaRice` |
| BRUTOS | `Reception.grossWeight` | — |

(*) Campos no existentes actualmente en el modelo — ver seccion "Campos pendientes".

**Mockup del detalle:**

```
FECHA   GUIA REC  RUT              AGRICULTOR               GUIA DESP  KG RECIB   FACT COMPRA  KG COMPRA  PRECIO    TOTAL       BRUTOS
2/5/25  7413      16.462.767-5     JOSE CAMPOS ANABALON     193         36.241                                                   36.530
2/5/25  7414      16.845.694-8     CRISTIAN GONZALEZ SOTO   220         38.281                                                   38.520
2/5/25  7415      4.342.385-1      MINERVA GUZMAN GODOY     218         34.638                                                   35.750
2/5/25            8.200.408-4      MARIA VALDES MANRIQUEZ              —            Fact 40      16.984    $ 400    $ 6.793.600
2/5/25            9.074.795-9      LORENA VALDES MANRIQUEZ             —            Fact 36      49.103    $ 400    $19.641.200
3/5/25  7421      17.332.522-3     LUIS ORTEGA FUENTES      8           38.559                                                   38.800
...
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
                               TOTALES MES                              9.211.613               3.003.331                       ...
```

---

### Vista 3 — Acumulado de temporada (cierre mes a mes)

Tabla de evolucion mensual de los tres saldos para toda la temporada. Permite ver de un vistazo como se han ido comprando los kilos depositados.

| Mes | Saldo Ant. Total | Kg Recibidos | Compras | Existencias Total | PROPIO | DEPOSITO |
|---|---|---|---|---|---|---|
| Marzo 2025 | 0 | 1.450.200 | 0 | 1.450.200 | 0 | 1.450.200 |
| Abril 2025 | 1.450.200 | 2.180.000 | 850.000 | 2.780.200 | 850.000 | 1.930.200 |
| Mayo 2025 | 2.780.200 | 9.211.613 | 3.003.331 | 8.988.482 | 3.753.331 | 5.235.151 |
| ... | | | | | | |

---

### Endpoint propuesto

#### Cuadro resumen + detalle del mes

```
GET /api/v1/analytics/inventory-book?seasonId=:id&month=YYYY-MM
```

**Response:**
```json
{
  "month": "2025-05",
  "season": { "id": 1, "name": "Temporada 2025" },
  "summary": {
    "previousBalance": {
      "total": 5733503,
      "propio": -93268,
      "deposito": 5826771
    },
    "receivedKg": 9211613,
    "purchasedKg": 3003331,
    "closingBalance": {
      "total": 14945116,
      "propio": 2910063,
      "deposito": 12035053
    }
  },
  "movements": [
    {
      "date": "2025-05-02",
      "type": "RECEPTION",
      "receptionBookNumber": "7413",
      "rut": "16.462.767-5",
      "producerName": "JOSE CAMPOS ANABALON",
      "dispatchGuide": "193",
      "receivedKg": 36241,
      "grossKg": 36530,
      "purchasedKg": null,
      "price": null,
      "totalAmount": null
    },
    {
      "date": "2025-05-02",
      "type": "PURCHASE",
      "receptionBookNumber": null,
      "rut": "8.200.408-4",
      "producerName": "MARIA VALDES MANRIQUEZ",
      "dispatchGuide": null,
      "receivedKg": null,
      "grossKg": null,
      "purchasedKg": 16984,
      "price": 400,
      "totalAmount": 6793600,
      "purchaseInvoice": "40"
    }
  ]
}
```

#### Acumulado de temporada (mes a mes)

```
GET /api/v1/analytics/inventory-book/season-summary?seasonId=:id
```

---

### Logica de backend: calculo del saldo anterior

El "SALDO ANTERIOR" de un mes determinado se calcula acumulando todos los movimientos desde el inicio de la temporada hasta el ultimo dia del mes anterior:

```typescript
// Pseudocodigo
async function getInventoryBalance(seasonId: number, upToDate: Date) {
  // Todos los kg recibidos hasta upToDate
  const totalReceived = await SUM(Reception.netWeight)
    WHERE seasonId = seasonId
      AND receptionDate <= upToDate;

  // Todos los kg comprados hasta upToDate
  const totalPurchased = await SUM(Reception.finalNetWeight)
    WHERE Reception.settlementId IS NOT NULL
      AND Settlement.settledAt <= upToDate
      AND Settlement.status = 'settled';

  return {
    deposito: totalReceived - totalPurchased,
    propio:   totalPurchased,
    total:    totalReceived
  };
}
```

---

### Logica de clasificacion de movimientos en el detalle

El detalle combina en una sola lista ordenada por fecha dos tipos de eventos:

```typescript
type MovementEntry =
  | { type: 'RECEPTION'; reception: Reception }     // ingresa a DEPOSITO
  | { type: 'PURCHASE';  settlement: Settlement; reception: Reception }  // DEPOSITO → PROPIO

// Para construir el listado del mes:
// 1. Cargar todas las recepciones con receptionDate en el mes → tipo RECEPTION
// 2. Cargar todos los settlements con settledAt en el mes → tipo PURCHASE
//    (cada settlement se expande por sus recepciones relacionadas)
// 3. Unir ambas listas y ordenar por fecha ASC
```

---

### SQL conceptual del detalle mensual

```sql
-- RECEPCIONES DEL MES (ingresos a DEPOSITO)
SELECT
  'RECEPTION'                       AS movement_type,
  r.reception_date                  AS event_date,
  r.id                              AS reception_book_number,   -- pendiente: agregar campo
  p.rut                             AS rut,
  CONCAT(p.first_name, ' ', p.last_name) AS producer_name,
  r.guide_number                    AS dispatch_guide,
  r.net_weight                      AS received_kg,
  r.gross_weight                    AS gross_kg,
  NULL                              AS purchased_kg,
  NULL                              AS price_per_kg,
  NULL                              AS total_amount,
  NULL                              AS purchase_invoice
FROM receptions r
JOIN producers p ON r.producer_id = p.id
WHERE r.season_id = :seasonId
  AND DATE_FORMAT(r.reception_date, '%Y-%m') = :month

UNION ALL

-- COMPRAS DEL MES (egreso de DEPOSITO, ingreso a PROPIO)
SELECT
  'PURCHASE'                        AS movement_type,
  s.settled_at                      AS event_date,
  NULL                              AS reception_book_number,
  p.rut                             AS rut,
  CONCAT(p.first_name, ' ', p.last_name) AS producer_name,
  NULL                              AS dispatch_guide,
  NULL                              AS received_kg,
  NULL                              AS gross_kg,
  r.final_net_weight                AS purchased_kg,
  r.rice_price                      AS price_per_kg,
  s.total_price + s.iva_rice        AS total_amount,
  NULL                              AS purchase_invoice           -- pendiente: agregar campo
FROM settlements s
JOIN receptions  r ON r.settlement_id = s.id
JOIN producers   p ON s.producer_id   = p.id
WHERE s.season_id = :seasonId
  AND s.status    = 'settled'
  AND DATE_FORMAT(s.settled_at, '%Y-%m') = :month

ORDER BY event_date ASC, movement_type DESC;
```

---

### Alcance MVP

| Funcionalidad | Alcance |
|---|---|
| Cuadro resumen mensual (3 columnas) | MVP |
| Detalle cronologico de recepciones y compras del mes | MVP |
| Acumulado de temporada mes a mes | MVP |
| Filtro por mes y temporada | MVP |
| Exportar a Excel (conservando el formato del libro actual) | MVP — es el caso de uso principal |
| Filtro por productor | Post-MVP |
| Comparacion de saldo entre almacenes como % | Post-MVP |
| Alerta cuando el PROPIO llega a cero o es negativo | Post-MVP |

---

### Dudas de negocio a cerrar antes de implementar

1. El campo `receptionBookNumber` (numero correlativo 7413, 7414...) existe en alguna otra tabla o entidad del sistema actual, o se agrega como nuevo campo al modelo `Reception`?
2. El campo `purchaseInvoiceNumber` en `Settlement`: se emite una factura por productor (una por liquidacion) o puede haber mas de una factura asociada a un productor en el mismo mes?
3. La fecha de "COMPRA" en el libro es la fecha de creacion del settlement (`createdAt`) o hay una fecha de liquidacion definitiva (`settledAt`) que debe agregarse al modelo?
4. Cuando un settlement agrupa varias recepciones de un mismo productor, cada recepcion aparece como una fila separada de COMPRA en el libro, o se consolida en una sola fila con el total del settlement?
5. El "TOTAL" de la columna de compras incluye IVA (`totalPrice + ivaRice`) o se muestra el neto sin IVA?
6. Los kilos del cuadro resumen ("KILOS RECIBIDOS") usan `netWeight` (bruto menos tara, sin descuentos de calidad) o `finalNetWeight` (con descuentos)? En el ejemplo de la empresa parecen ser `netWeight`.