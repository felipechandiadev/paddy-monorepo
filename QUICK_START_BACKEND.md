# 🚀 GUÍA RÁPIDA DE USO - Backend Paddy TMS

## Inicio Rápido (5 minutos)

### 1️⃣ Clonar configuración
```bash
cd /Users/felipe/dev/paddy/paddy-tms/backend
cp .env.example .env
```

### 2️⃣ Iniciar Docker
```bash
docker-compose up -d
```

### 3️⃣ Instalar dependencias
```bash
npm install
```

### 4️⃣ Ejecutar migraciones
```bash
npm run db:migrate
```

### 5️⃣ Iniciar servidor
```bash
npm run start:dev
```

✅ Backend corriendo en `http://localhost:3000`

---

## 📚 Ejemplos de Uso

### Crear una nueva recepción de camión

```typescript
// POST /api/logistics/truck-receptions
{
  "numero_turno": 1,
  "producer_id": "uuid-del-productor",
  "patente": "ABC1234",
  "guia": "GUA-001",
  "chofer_nombre": "Juan Pérez",
  "rut_chofer": "12345678-9"
}
```

### Actualizar peso bruto

```typescript
// PATCH /api/logistics/truck-receptions/{id}/peso-bruto
{
  "peso_bruto": 5000.50
}
```

### Consultar recepciones

```typescript
// GET /api/logistics/truck-receptions?state=ESPERA&limit=10
// GET /api/logistics/truck-receptions/{id}
// GET /api/logistics/truck-receptions/producer/{producer_id}
```

---

## 🗄️ Comandos Útiles

```bash
# Base de datos
npm run db:migrate              # Ejecutar migraciones
npm run db:migrate:create       # Crear nueva migración
npm run db:seed                 # Cargar datos iniciales
npm run db:reset                # Resetear BD completamente
npm run db:setup                # Reset + Migraciones + Seed
npm run backup:db               # Hacer backup de BD

# Desarrollo
npm run start:dev               # Iniciar con hot-reload
npm run start:debug             # Debug mode
npm start                       # Producción
npm run build                   # Compilar proyecto

# Testing
npm test                        # Tests unitarios
npm run test:watch              # Tests en modo watch
npm run test:cov                # Cobertura de tests
npm run test:e2e                # Tests end-to-end

# Code quality
npm run lint                    # Linter
npm run format                  # Prettier format
```

---

## 🔧 Verificar Servicio

```bash
# Ver estado de MySQL
docker-compose ps

# Ver logs de MySQL
docker-compose logs mysql

# Acceder a MySQL
docker exec -it paddy_tms_mysql mysql -u root -ppassword paddy_tms

# Acceder a PhpMyAdmin
# Abrir: http://localhost:8080
# Usuario: root
# Password: password
```

---

## 📝 Agregar Nueva Migración

```bash
# 1. Crear archivo de migración
npm run db:migrate:create src/infrastructure/database/migrations/AddNewTable

# 2. Editar archivo creado
nano src/infrastructure/database/migrations/[timestamp]-AddNewTable.ts

# 3. Ejecutar migración
npm run db:migrate
```

Ejemplo de migración:

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddNewTable1724000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'my_table',
        columns: [
          // Define columns here
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('my_table');
  }
}
```

---

## 🛠️ Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar que MySQL está corriendo
docker-compose ps

# Reiniciar servicios
docker-compose down
docker-compose up -d

# Verificar logs
docker-compose logs mysql
```

### Error: "Port 3306 already in use"
```bash
# Encontrar proceso usando puerto
lsof -i :3306

# Cambiar puerto en docker-compose.yml
# De: "3306:3306"
# A: "3307:3306"
```

### Error: "Migration already run"
```bash
# Rollback de migraciones
# En data-source.ts, cambiar migrationsRun a true para rollback

# O resetear BD completo
npm run db:reset
npm run db:migrate
```

---

## 📱 Estructura de Archivos Importantes

```
backend/
├── src/
│   ├── app.module.ts                    # Módulo raíz
│   ├── main.ts                          # Entry point
│   ├── modules/
│   │   └── logistics/                   # Nuevo módulo
│   │       ├── domain/                  # Entidades
│   │       ├── application/             # Servicios, DTOs
│   │       ├── presentation/            # Controllers
│   │       └── logistics.module.ts      # Configuración módulo
│   └── infrastructure/
│       ├── database/
│       │   ├── data-source.ts           # Configuración TypeORM
│       │   ├── database.module.ts       # Módulo base de datos
│       │   └── migrations/              # Migraciones
│       └── persistence/
│           └── seeders/                 # Seeds de datos
├── .env.example                         # Variables de ejemplo
├── docker-compose.yml                   # Servicios Docker
└── package.json
```

---

## 🌐 Endpoints de Ejemplo

### Logistics Module (nuevo)

```bash
# Crear recepción
POST /api/logistics/truck-receptions

# Listar recepciones
GET /api/logistics/truck-receptions?limit=10&offset=0

# Obtener recepción por ID
GET /api/logistics/truck-receptions/{id}

# Listar por productor
GET /api/logistics/truck-receptions/producer/{producer_id}

# Actualizar
PATCH /api/logistics/truck-receptions/{id}

# Eliminar (soft delete)
DELETE /api/logistics/truck-receptions/{id}

# Obtener por estado
GET /api/logistics/truck-receptions?estado=ESPERA
```

---

## 📊 Base de Datos

### Tabla: `producers`
```
id                → UUID (Primary Key)
rut               → VARCHAR(20) UNIQUE
nombre            → VARCHAR(200)
contacto          → VARCHAR(100)
telefono          → VARCHAR(20)
email             → VARCHAR(100)
direccion         → TEXT
activo            → BOOLEAN
created_at        → TIMESTAMP
updated_at        → TIMESTAMP
deleted_at        → TIMESTAMP (nullable)
```

### Tabla: `truck_receptions`
```
id                      → UUID (Primary Key)
numero_turno            → INT
producer_id             → UUID (FK → producers.id)
patente                 → VARCHAR(50)
guia                    → VARCHAR(100)
chofer_nombre           → VARCHAR(100)
rut_chofer              → VARCHAR(20)
peso_bruto              → DECIMAL(10,2)
peso_tara               → DECIMAL(10,2)
peso_neto               → DECIMAL(10,2)
estado                  → ENUM(ESPERA, PESANDO_BRUTO, PESANDO_TARA, FINALIZADO)
fecha_hora_entrada      → TIMESTAMP
fecha_hora_peso_bruto   → TIMESTAMP
fecha_hora_peso_tara    → TIMESTAMP
fecha_hora_finalizacion → TIMESTAMP
numero_ticket           → VARCHAR(50)
pdf_url                 → VARCHAR(500)
created_at              → TIMESTAMP
updated_at              → TIMESTAMP
created_by              → VARCHAR(100)
deleted_at              → TIMESTAMP (nullable)
```

---

## 💡 Tips de Desarrollo

1. **Hot Reload:** Usar `npm run start:dev` para desarrollo con cambios automáticos

2. **Debugger:** Usar `npm run start:debug` y Chrome DevTools

3. **Logs:** Modificar `LOG_LEVEL` en `.env` (debug, info, warn, error)

4. **Testing:** Ejecutar tests antes de hacer commit

5. **Migraciones:** Siempre reversibles con método `down()`

6. **Seeds:** Para datos de prueba, no producción

7. **Entidades:** Usar DTOs para validación de entrada

8. **Índices:** Agregar en tablas con queries frecuentes

---

## 🔐 Seguridad

- [ ] Cambiar `JWT_SECRET` en `.env` (producción)
- [ ] Cambiar contraseña de MySQL (producción)
- [ ] Configurar HTTPS en frontend URL
- [ ] Habilitar SSL para BD (si aplica)
- [ ] No commitear `.env` (solo `.env.example`)

---

**Última actualización:** 21 de Abril, 2026

