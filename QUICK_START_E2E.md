# 🚀 QUICK START - Playwright E2E Tests

## En 3 pasos

### 1️⃣ Backend (Terminal 1)
```bash
cd backend
npm run db:setup        # Reset DB + seed:test-cosecha
npm run start:dev       # localhost:3000
```

### 2️⃣ Frontend (Terminal 2)
```bash
cd frontend
npm run dev            # localhost:3001
```

### 3️⃣ Tests (Terminal 3)
```bash
cd frontend
npm run test:e2e:ui    # Modo interactivo (RECOMENDADO)
```

---

## 📑 Comandos Principales

```bash
# Modo UI (interactivo) ⭐ MEJOR PARA EMPEZAR
npm run test:e2e:ui

# Todos los tests en paralelo
npm run test:e2e

# Debug step-by-step
npm run test:e2e:debug

# Ver navegador
npm run test:e2e:headed

# Test específico
npx playwright test tests/e2e/auth.spec.ts

# Ver reporte
npm run test:e2e:report
```

---

## 🔑 Test Users (seed:test-cosecha)

```
ADMIN:      admin@ayg.cl / 098098
CONSULTANT: consultor@ayg.cl / 098098
```

---

## 📊 22 Tests Listos (Tier 1 & 2)

| Feature | Tests | Status |
|---------|-------|--------|
| Autenticación | 6 | ✅ |
| Recepciones | 4 | ✅ |
| Finanzas | 6 | ✅ |
| Productores | 6 | ✅ |

---

## 🎭 Usar Fixtures en Tests

```typescript
import { test, expect } from '../fixtures';

test('ejemplo', async ({ 
  authenticatedPageAsAdmin,  // Page logueada
  apiClient,                 // HTTP con token
  seedData,                  // Datos del seed
  page 
}) => {
  // Ejemplos
  const producer = seedData.getProducerById(1);
  const response = await apiClient.get('/producers');
  await page.goto('/paddy/operations');
});
```

---

## 📁 Estructura Base

```
frontend/tests/
├── fixtures/
│   ├── auth.fixture.ts       ← Page autenticada
│   ├── api.fixture.ts        ← HTTP client
│   ├── data.fixture.ts       ← Datos seed
│   ├── helpers/              ← Utilidades
│   └── index.ts              ← Exporta todo
├── e2e/
│   ├── auth.spec.ts          ← Tests auth
│   ├── receptions.spec.ts    ← Tests recepciones
│   ├── finances.spec.ts      ← Tests finanzas
│   └── producers.spec.ts     ← Tests productores
└── data/
    └── roles.json            ← Credenciales seed
```

---

## ✨ Datos Disponibles

**Temporada Activa (2026)**:
- 10 Recepciones (status: analyzed)
- 10 Anticipos (status: paid)
- 0  Liquidaciones

**Productores**: 5 con datos completos  
**Tipos Arroz**: 4 (Diamante, Zafiro, Brillante, Harper)  
**Usuario Admin**: admin@ayg.cl / 098098

---

## ⚡ Modo Debug

```bash
# Abrir browser y pausar en cada paso
npm run test:e2e:debug tests/e2e/auth.spec.ts

# O directamente en UI
npm run test:e2e:ui
# → Luego hacer click en "Debug" en cada test
```

---

## 🎯 Próximo: Ejecutar Tests

```bash
npm run test:e2e:ui
# Se abrirá navegador con todos los tests listos
```

✅ **Listo para usar** - Todos los archivos creados y configurados
