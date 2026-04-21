# 🚀 TRUCK MANAGEMENT SYSTEM - CHECKLIST DE IMPLEMENTACIÓN

**Status**: 📋 Listo para iniciar desarrollo  
**Última Actualización**: 21 de abril de 2026

---

## 📊 RESUMEN GENERAL

- **Documentos Creados**: 2 (Arquitectura + Ejemplos)
- **Fases de Desarrollo**: 7
- **Duración Estimada**: 4-5 semanas
- **Team Size**: 1-2 desarrolladores

---

## 🎯 FASE 1: SETUP INICIAL (Semana 1)

### 1.1 - Crear estructura de carpetas

```bash
# Frontend
mkdir -p frontend/src/app/paddy/logistics/{dispatch,weighing}
mkdir -p frontend/src/features/logistics/{context,hooks,services,components,types,actions,utils}

# Backend  
mkdir -p backend/src/modules/logistics/{presentation,application,domain,infrastructure,dtos}
```

**Checklist**:
- [ ] Carpetas creadas correctamente
- [ ] `.gitkeep` agregado en carpetas vacías
- [ ] Árbol de directorios verificado

---

### 1.2 - Definir tipos TypeScript

**Archivos a crear**:

- [ ] `frontend/src/features/logistics/types/logistics.types.ts`
  - [ ] `TruckState` enum
  - [ ] `WeighingType` enum
  - [ ] `Truck` interface
  - [ ] `LogisticsQueueState` interface
  - [ ] Validaciones
  
- [ ] `frontend/src/features/logistics/types/state.types.ts`
  - [ ] `LogisticsAction` type
  - [ ] `LogisticsContextType` interface

- [ ] `backend/src/modules/logistics/dtos/truck.dto.ts`
  - [ ] `CreateTruckDto`
  - [ ] `UpdateStateDto`
  - [ ] `WeighingDto`

**Verificaciones**:
- [ ] Tipos compilando sin errores
- [ ] No hay `any` no intencionales
- [ ] TypeScript strict mode activo

---

### 1.3 - Crear Context + Reducer

**Archivos a crear**:

- [ ] `frontend/src/features/logistics/context/LogisticsContext.tsx`
  - [ ] `LogisticsProvider` component
  - [ ] `useLogistics()` hook
  - [ ] Acciones (registrarCamion, avanzarEstado, etc)

- [ ] `frontend/src/features/logistics/context/reducer.ts`
  - [ ] `logisticsReducer` function
  - [ ] Casos para cada acción

- [ ] `frontend/src/features/logistics/context/actions.ts`
  - [ ] Tipos de acciones
  - [ ] Action creators (si se usan)

**Testing**:
- [ ] Context carga sin errores
- [ ] Provider envuelve correctamente
- [ ] Hook `useLogistics()` funciona en componentes test

---

### 1.4 - Setup Backend Entity

**Archivos a crear**:

- [ ] `backend/src/modules/logistics/domain/logistics.entity.ts`
  - [ ] `Truck` entity con TypeORM
  - [ ] Relaciones (si aplica)
  - [ ] Índices

- [ ] `backend/src/modules/logistics/logistics.module.ts`
  - [ ] Importar TypeORM para Truck
  - [ ] Registrar providers

**Verificaciones**:
- [ ] Entity compila
- [ ] Decoradores TypeORM correctos
- [ ] Migrations preparadas (no aplicadas)

---

## 🔌 FASE 2: BACKEND APIs (Semana 1-2)

### 2.1 - Crear Service

**Archivo**: `backend/src/modules/logistics/application/logistics.service.ts`

```typescript
@Injectable()
export class LogisticsService {
  constructor(
    @InjectRepository(Truck) private truckRepository: Repository<Truck>,
  ) {}
  
  // Métodos a implementar:
  async createTruck(input: CreateTruckDto): Promise<Truck>
  async updateState(id: string, newState: TruckState): Promise<Truck>
  async registerWeighing(id: string, input: WeighingDto): Promise<Truck>
  async getQueue(): Promise<LogisticsQueueState>
  async getTruck(id: string): Promise<Truck>
  async generateTicket(id: string): Promise<{ url: string, number: string }>
}
```

**Implementación**:
- [ ] Método `createTruck`
  - [ ] Validar input (patente, chofer, etc)
  - [ ] Generar numero_turno
  - [ ] Guardar en BD
  - [ ] Retornar Truck
  
- [ ] Método `updateState`
  - [ ] Validar transición permitida
  - [ ] Validar guards (si aplica)
  - [ ] Actualizar estado
  - [ ] Registrar timestamp
  - [ ] Retornar Truck

- [ ] Método `registerWeighing`
  - [ ] Validar peso > 0
  - [ ] Validar peso_tara < peso_bruto (si aplica)
  - [ ] Calcular peso_neto
  - [ ] Guardar y retornar

- [ ] Método `getQueue`
  - [ ] Obtener truck_actual (estado PESANDO_BRUTO)
  - [ ] Obtener próximos (estado ESPERA)
  - [ ] Obtener descargando (estado DESCARGANDO)
  - [ ] Calcular métricas de sesión
  - [ ] Retornar QueueState

**Testing**:
- [ ] Crear Truck funciona
- [ ] Transiciones válidas pasan
- [ ] Transiciones inválidas fallan
- [ ] Validaciones de peso funcionan

---

### 2.2 - Crear Controller

**Archivo**: `backend/src/modules/logistics/presentation/logistics.controller.ts`

**Endpoints**:

- [ ] `POST /logistics/trucks`
  - [ ] Validar body
  - [ ] Llamar service
  - [ ] Retornar 201 + Truck
  - [ ] Manejo de errores

- [ ] `PUT /logistics/trucks/{id}/state`
  - [ ] Validar ID existe
  - [ ] Validar nuevo estado
  - [ ] Llamar service
  - [ ] Retornar 200 + Truck

- [ ] `POST /logistics/trucks/{id}/weighing`
  - [ ] Validar peso
  - [ ] Validar tipo (bruto/tara)
  - [ ] Llamar service
  - [ ] Retornar 200 + Truck

- [ ] `GET /logistics/queue`
  - [ ] Llamar service
  - [ ] Retornar 200 + QueueState

- [ ] `GET /logistics/trucks/{id}`
  - [ ] Validar existe
  - [ ] Retornar Truck

- [ ] `POST /logistics/trucks/{id}/ticket`
  - [ ] Validar estado FINALIZADO
  - [ ] Generar PDF
  - [ ] Guardar archivo
  - [ ] Retornar URL

**Testing en Postman**:
- [ ] Crear camión retorna 201
- [ ] Actualizar estado retorna 200
- [ ] Registrar peso calcula correctamente
- [ ] Queue endpoint retorna estructura correcta
- [ ] Errores retornan status correcto

---

### 2.3 - Tests Backend

**Archivo**: `backend/test/logistics.e2e.spec.ts`

- [ ] Test creación de camión
- [ ] Test transición ESPERA → PESANDO_BRUTO
- [ ] Test transición PESANDO_BRUTO → DESCARGANDO
- [ ] Test transición DESCARGANDO → PESANDO_TARA
- [ ] Test transición PESANDO_TARA → FINALIZADO
- [ ] Test validación: peso negativo rechazado
- [ ] Test validación: peso_tara >= peso_bruto rechazado
- [ ] Test generación de ticket

**Comando**:
```bash
npm run test:e2e -- logistics
```

---

## 📱 FASE 3: FRONTEND HOOKS + SERVICES (Semana 2)

### 3.1 - Crear Services

**Archivo**: `frontend/src/features/logistics/services/truckService.ts`

```typescript
export const truckService = {
  async createTruck(input: CreateTruckInput): Promise<Truck>,
  async updateState(id: string, state: TruckState): Promise<Truck>,
  async registerWeighing(id: string, peso: number, tipo: string): Promise<Truck>,
  async getQueue(): Promise<LogisticsQueueState>,
  async getTruck(id: string): Promise<Truck>,
}
```

**Implementación**:
- [ ] Usar fetch con headers JWT
- [ ] Manejo de errores 401 (sesión expirada)
- [ ] Manejo de errores genéricos
- [ ] Logging en consola

---

### 3.2 - Crear Hooks

**Archivos**:

- [ ] `frontend/src/features/logistics/hooks/useLogisticsData.ts`
  - [ ] useQuery para obtener cola
  - [ ] Refetch automático cada 5s
  - [ ] Manejo de offline

- [ ] `frontend/src/features/logistics/hooks/useRealtimeSync.ts`
  - [ ] WebSocket listeners
  - [ ] Dispatch de actualizaciones
  - [ ] Cleanup en unmount

- [ ] `frontend/src/features/logistics/hooks/useTruckState.ts`
  - [ ] Validaciones de transición
  - [ ] Errores claros
  - [ ] State machine logic

**Testing**:
- [ ] Hooks no causan errores
- [ ] Datos se cargan correctamente
- [ ] Refetch funciona

---

### 3.3 - Crear Server Actions

**Archivo**: `frontend/src/features/logistics/actions/truck.action.ts`

- [ ] `createTruckAction`
- [ ] `updateTruckStateAction`
- [ ] `registerWeighingAction`
- [ ] `releaseTruckAction`

**Cada acción**:
- [ ] Obtener sesión del servidor
- [ ] Validar token JWT
- [ ] Hacer fetch al backend
- [ ] Retornar ApiResponse
- [ ] Manejo de errores

---

## 🎨 FASE 4: COMPONENTES BÁSICOS (Semana 3)

### 4.1 - Componentes Unitarios

**Archivos**:

- [ ] `TruckCard.tsx` - Mostrar info de un camión
- [ ] `StateIndicator.tsx` - Badge del estado
- [ ] `TimerDisplay.tsx` - Mostrar tiempo transcurrido
- [ ] `QueueList.tsx` - Lista de próximos camiones

**Requisitos por componente**:
- [ ] Props correctamente tipadas
- [ ] Estilos con Tailwind
- [ ] Accesibilidad (aria labels)
- [ ] Responsive

---

### 4.2 - Componentes Compuestos

**Archivos**:

- [ ] `TruckInputForm.tsx` - Formulario registro
  - [ ] Validación inline
  - [ ] Error messages
  - [ ] Botón submit

- [ ] `WeighingForm.tsx` - Ingreso de pesos
  - [ ] Input numérico
  - [ ] Validación en tiempo real
  - [ ] Mostrar pesos guardados
  - [ ] Calcular peso neto

- [ ] `CurrentTruckDisplay.tsx` - Turno actual
  - [ ] Mostrar info del camión
  - [ ] Estado actual
  - [ ] Acciones permitidas

---

### 4.3 - Vistas Principales

**Archivos**:

- [ ] `AdminDashboard.tsx`
  - [ ] 3 columnas layout
  - [ ] Registro nuevo camión (izq)
  - [ ] Turno actual + descargando (centro)
  - [ ] Próximos + finalizados (der)
  - [ ] Conectado al Context

- [ ] `MonitorDisplay.tsx`
  - [ ] 2 columnas
  - [ ] Turno actual (grande, parpadea)
  - [ ] Próximos (lista)
  - [ ] Indicator online/offline
  - [ ] Sin scroll, limpio

---

### 4.4 - Pages

**Archivos**:

- [ ] `frontend/src/app/paddy/logistics/layout.tsx`
  - [ ] LogisticsProvider wrapper
  - [ ] Layout general

- [ ] `frontend/src/app/paddy/logistics/weighing/page.tsx`
  - [ ] Renderizar AdminDashboard
  - [ ] Protegido con auth

- [ ] `frontend/src/app/paddy/logistics/dispatch/page.tsx`
  - [ ] Renderizar MonitorDisplay
  - [ ] Protegido con auth

---

## 🔄 FASE 5: SINCRONIZACIÓN RT (Semana 3-4)

### 5.1 - Configurar Supabase Realtime

- [ ] BD tiene tabla `trucks` en PostgreSQL
- [ ] LISTEN/NOTIFY habilitado
- [ ] Permisos RLS configurados
- [ ] Trigger en `trucks` para notificar cambios

**Backend**:
```typescript
// Cuando se actualiza truck, ejecutar:
// SELECT pg_notify('logistics:trucks', json_build_object(...)::text);
```

---

### 5.2 - Implementar Sync RT

**Archivo**: `frontend/src/features/logistics/services/realtimeService.ts`

```typescript
export const realtimeService = {
  onTrucksChanged(callback: (truck: Truck) => void): () => void {
    // Supabase listener
    // Return unsubscribe function
  },
}
```

- [ ] Conectar a Supabase RT
- [ ] Escuchar cambios en tabla trucks
- [ ] Despachar acciones al Context
- [ ] Manejo de desconexiones

---

### 5.3 - Offline-First

**Archivo**: `frontend/src/lib/localStorage/truckStore.ts`

- [ ] IndexedDB schema (pending-weighings table)
- [ ] Save pending actions cuando offline
- [ ] Sincronizar cuando online
- [ ] Indicador visual offline

**Service Worker**:
- [ ] `frontend/src/lib/serviceWorker/logistics-sw.ts`
- [ ] Cache API calls
- [ ] Serve from cache si offline
- [ ] Background sync cuando vuelve conexión

---

## 🧪 FASE 6: TESTING + PULIDO (Semana 4)

### 6.1 - Tests E2E (Playwright)

**Archivo**: `frontend/tests/e2e/logistics.spec.ts`

- [ ] Test completo: registro → pesaje bruto → descarga → pesaje tara → finalizado
- [ ] Test validación: peso negativo rechazado
- [ ] Test validación: peso_tara >= peso_bruto rechazado
- [ ] Test offline: guardar localmente, sincronizar online
- [ ] Test monitor: actualización en tiempo real
- [ ] Test admin: múltiples acciones simultáneas

**Comando**:
```bash
npm run test:e2e -- logistics
```

---

### 6.2 - Tests Unitarios

**Archivos**:

- [ ] `__tests__/logistics/state-machine.test.ts`
  - [ ] Transiciones válidas
  - [ ] Transiciones inválidas
  - [ ] Guards

- [ ] `__tests__/logistics/calculations.test.ts`
  - [ ] Cálculo peso neto
  - [ ] Cálculo tiempos
  - [ ] Métricas

- [ ] `__tests__/logistics/validations.test.ts`
  - [ ] Validar patente
  - [ ] Validar peso
  - [ ] Validar input

---

### 6.3 - Performance

- [ ] Monitor display: <500ms update time
- [ ] Admin dashboard: <1s load time
- [ ] Sincronización RT: <1s latencia

**Medidas**:
```bash
# Chrome DevTools Performance tab
# Lighthouse audit
```

---

### 6.4 - Ajustes UI/UX

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode para monitor
- [ ] High contrast para accesibilidad
- [ ] Animaciones suaves
- [ ] Feedback visual (toasts, spinners)

---

## 🚀 FASE 7: PRODUCCIÓN (Semana 4-5)

### 7.1 - Documentación

- [ ] README TMS actualizado
- [ ] API documentation (Swagger)
- [ ] User guide para operadores
- [ ] Troubleshooting guide

---

### 7.2 - Deployment Checklist

**Backend**:
- [ ] Variables de entorno configuradas
- [ ] Migrations ejecutadas
- [ ] Logs configurados
- [ ] Backups de BD

**Frontend**:
- [ ] Build optimizado
- [ ] PWA manifest correcto
- [ ] Service workers registrados
- [ ] CDN configured

---

### 7.3 - Monitoring

- [ ] Logs centralizados (CloudWatch, DataDog)
- [ ] Alertas configuradas (errores, timeouts)
- [ ] Dashboards de métricas
- [ ] Health checks

---

### 7.4 - Go-Live

- [ ] Feedback de usuarios recolectado
- [ ] Issues críticos resueltos
- [ ] Documentación accesible
- [ ] Support setup

---

## 📊 TRACKING DE PROGRESO

### Semana 1
```
[████████░░] 80% Setup Inicial + Backend APIs Basics
- [ ] Setup completo
- [ ] Tipos definidos
- [ ] Context funcionando
- [ ] Service básico
- [ ] Controller con endpoints
```

### Semana 2
```
[████████░░] 80% Backend APIs + Frontend Setup
- [ ] Todas las APIs respondiendo
- [ ] Server Actions implementadas
- [ ] Hooks funcionando
- [ ] Datos fluyendo desde backend
```

### Semana 3
```
[██████░░░░] 60% Frontend UI + Realtime
- [ ] Componentes básicos
- [ ] AdminDashboard visible
- [ ] MonitorDisplay visible
- [ ] Sincronización RT parcial
```

### Semana 4
```
[████████░░] 80% Testing + Polish
- [ ] Tests E2E pasando
- [ ] Performance OK
- [ ] UI Pulida
- [ ] Offline working
```

### Semana 5
```
[██████████] 100% Production Ready
- [ ] Documentación completa
- [ ] Deployment checklist
- [ ] Monitoring activo
- [ ] Go-live
```

---

## ❓ PREGUNTAS / DECISIONES PENDIENTES

Marcar con ✅ cuando se resuelvan:

- [ ] **Balanza Integration**: ¿Cómo se conecta? (RS232, USB, API?)
- [ ] **Multi-site**: ¿Necesitamos múltiples locations?
- [ ] **PDF Storage**: ¿S3, CloudStorage, o local?
- [ ] **Supabase Status**: ¿Ya configurado en backend?
- [ ] **Audio Alerts**: ¿Suena en monitor cuando se llama camión?
- [ ] **Database URL**: ¿Cuál es la connection string?
- [ ] **API Base URL**: ¿Cuál es la URL backend?
- [ ] **Credentials**: ¿Dónde obtener credenciales Supabase?

---

## 🎯 DEFINICIÓN DE HECHO (DoD)

Cada checklist item es completado cuando:

✅ Código compilado sin warnings  
✅ Tests pasando (si aplica)  
✅ Code review aprobado  
✅ Documentación actualizada  
✅ Funciona en desarrollo local  
✅ Funciona en staging  

---

## 📞 RECURSOS Y CONTACTOS

| Recurso | Ubicación |
|---------|-----------|
| Documentación Principal | `TRUCK_MANAGEMENT_ARCHITECTURE.md` |
| Ejemplos de Código | `TRUCK_MANAGEMENT_CODE_EXAMPLES.md` |
| Este Checklist | `TRUCK_MANAGEMENT_CHECKLIST.md` |
| Backend Patterns | `base_other_projects/BACKEND_PATTERN_GUIDE.md` |
| Frontend Patterns | `base_other_projects/FRONTEND_DESIGN_QUICK_REFERENCE.md` |

---

**Checklist Creado**: 21 de abril de 2026  
**Versión**: 1.0  
**Status**: 🟢 Listo para iniciar
