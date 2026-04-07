# 🚀 SETUP: Backend Paddy DDD - Guía Completa

## Requisitos Previos

- **Node.js**: v18+ (LTS recomendado)
- **npm**: v9+
- **MySQL**: v8+
- **Git**

Verificar instalación:
```bash
node --version    # v18+
npm --version     # v9+
mysql --version   # Ver8+
```

## Paso 1: Clonar y configurar el proyecto

```bash
# Navegar a la carpeta del proyecto
cd /Users/felipe/dev/paddy/backend

# Instalar dependencias
npm install

# Crear archivo .env (copiar de .env.example)
cp .env.example .env

# Editar .env con tus valores
nano .env
```

### Configuración .env recomendada:
```env
NODE_ENV=development
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=redbull90
DATABASE_NAME=paddy

JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRATION=15m

NEXTAUTH_SECRET=otro_secreto_cambiar_en_produccion
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_DEBUG=false

APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

## Paso 2: Configurar MySQL

### Opción A: Usando comando MySQL CLI
```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE paddy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Verificar creación
mysql -u root -p -e "SHOW DATABASES;"
```

### Opción B: Usando MySQL Workbench
1. Conectar a servidor local (root, sin password o tu password)
2. Crear schema: `CREATE DATABASE paddy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
3. Verificar en "Schemas" panel

### Opción C: Docker (si tienes Docker)
```bash
docker run --name mysql-paddy \
  -e MYSQL_ROOT_PASSWORD=redbull90 \
  -e MYSQL_DATABASE=paddy \
  -p 3306:3306 \
  -d mysql:8.0
```

## Paso 3: Inicializar base de datos

```bash
# Desde carpeta /backend
cd /backend

# Ejecutar migraciones y seed (crear tablas + datos iniciales)
npm run db:setup

# O por separado:
npm run db:migrate    # Solo migraciones
npm run db:seed       # Solo datos de prueba
```

**Output esperado:**
```
✅ Conectado a base de datos
✅ Usuarios creados (admin, laboratorista, pesaje)
✅ Tipos de arroz creados
✅ Temporadas creadas
✅ Template por defecto creado
✅ Parámetros de análisis creados
✅ 10 productores de prueba creados

✅ SEED COMPLETADO EXITOSAMENTE

Usuarios de prueba:
  - Email: admin@example.com, Password: admin123, Role: ADMIN
  - Email: lab@example.com, Password: lab123, Role: LABORATORISTA
  - Email: pesaje@example.com, Password: pesaje123, Role: PESAJE
```

## Paso 4: Iniciar servidor backend

```bash
# Terminal 1: Backend en modo desarrollo (watch mode)
npm run start:dev

# Esperado:
# ✔ Webpack compiled successfully
# 🚀 Paddy Backend running on http://localhost:3000
# 📚 API Documentation available at http://localhost:3000/api/v1
```

## Paso 5: Probar endpoints

### En otra terminal, hacer curl requests:

```bash
# 1. Health check (sin autenticación)
curl http://localhost:3000/api/v1/auth/health

# 2. Login como admin
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Respuesta esperada:
# {
#   "success": true,
#   "data": {
#     "access_token": "eyJhbGciOiJIUzI1NiIs...",
#     "userId": 1,
#     "email": "admin@example.com",
#     "role": "admin"
#   }
# }

# 3. IMPORTANTE: Copiar el access_token

# 4. Usar token para protegidos endpoints
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X GET http://localhost:3000/api/v1/producers \
  -H "Authorization: Bearer $TOKEN"

# Respuesta esperada: 10 productores de prueba
```

## ✅ Verification Checklist

- [ ] MySQL está corriendo (`lsof -i :3306` muestra algo)
- [ ] Base datos `paddy` existe (`mysql -u root -p -e "USE paddy; SHOW TABLES;"`)
- [ ] Dependencias instaladas (`ls node_modules | wc -l > 0`)
- [ ] `.env` configurado con DATABASE_PASSWORD correcto
- [ ] Backend inicia sin errores (`npm run start:dev`)
- [ ] Health check responde 200 (`curl http://localhost:3000/api/v1/auth/health`)
- [ ] Login funciona y retorna token
- [ ] Endpoints protegidos responden con token válido

## 🔧 Troubleshooting

### Error: `connect ECONNREFUSED 127.0.0.1:3306`
**Problema**: MySQL no está corriendo
**Solución**:
```bash
# macOS con Homebrew
brew services start mysql

# O iniciarlo manualmente
mysql.server start
```

### Error: `ER_ACCESS_DENIED_FOR_USER`
**Problema**: Contraseña MySQL incorrecta en `.env`
**Solución**: 
1. Verificar contraseña en `.env`
2. Probar conexión: `mysql -u root -p`
3. Actualizar `.env` con datos correctos

### Error: `1049 - Unknown database 'paddy'`
**Problema**: Base de datos no existe
**Solución**:
```bash
mysql -u root -p -e "CREATE DATABASE paddy CHARACTER SET utf8mb4;"
```

### Error: `EADDRINUSE :::3000`
**Problema**: Puerto 3000 ya está en uso
**Solución**:
```bash
# Encontrar proceso en puerto 3000
lsof -i :3000

# Matar proceso (PID es el número en segunda columna)
kill -9 <PID>

# O cambiar PORT en .env
PORT=3001
```

### Error: "Token inválido"
**Problema**: Token expiró (15 minutos) o JWT_SECRET no coincide
**Solución**:
```bash
# Refrescar token
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Authorization: Bearer $OLD_TOKEN"

# O volver a hacer login
```

## 📚 Estructura de carpetas creada

```
backend/
├── src/
│   ├── modules/              # Lógica de negocio (8 dominios)
│   │   ├── auth/             # ✅ Completo
│   │   ├── users/            # ✅ Completo
│   │   ├── producers/        # ✅ Completo
│   │   ├── configuration/    # Entidades creadas (falta service/controller)
│   │   ├── operations/       # Entidades creadas (falta service/controller)
│   │   ├── finances/         # Entidades creadas (falta service/controller)
│   │   └── analytics/        # Estructura lista
│   ├── shared/               # ✅ Completo
│   ├── infrastructure/       # ✅ Base de datos configurada
│   ├── app.module.ts         # ✅ Orquestador
│   └── main.ts               # ✅ Punto de entrada
├── test/                     # Tests (estructura lista)
├── .env                      # Configuración
├── package.json              # Dependencias
└── README.md                 # Documentación
```

## 🎯 Próximos pasos (TODO)

1. **Implementar módulos restantes**:
   - [ ] `configuration/` - Service y Controller
   - [ ] `operations/` - Service y Controller para Receptions y AnalysisRecords
   - [ ] `finances/` - Service y Controller para Advances, Transactions, Settlements
   - [ ] `analytics/` - Reportes y consultas de solo lectura

2. **DTOs (Data Transfer Objects)**:
   - [ ] Crear `src/modules/*/dto/*.dto.ts` para cada módulo
   - [ ] Validación con `class-validator`

3. **Testing**:
   - [ ] Tests unitarios (`.spec.ts`)
   - [ ] Tests E2E (`test/` directory)

4. **Documentación OpenAPI (Swagger)**:
   - [ ] Instalar `@nestjs/swagger`
   - [ ] Decoradores `@ApiOperation`, `@ApiResponse`
   - [ ] Accesible en `/api/docs`

5. **Integración con Frontend**:
   - [ ] CORS configurado ✅
   - [ ] Tokens JWT sincronizados con NextAuth
   - [ ] Endpoints consumibles desde Next.js

## 📖 Comandos npm útiles

```bash
npm run start:dev              # Desarrollo con watch
npm run build                  # Compilar a dist/
npm run start:prod             # Iniciar compilado
npm run lint                   # ESLint
npm run format                 # Prettier
npm run test                   # Jest tests
npm run test:e2e              # E2E tests
npm run db:migrate            # TypeORM migraciones
npm run db:seed               # Datos iniciales
```

## 🔗 URLs Importantes

- **Backend API**: `http://localhost:3000`
- **API v1**: `http://localhost:3000/api/v1`
- **Health**: `http://localhost:3000/api/v1/auth/health`
- **Documentación**: Ver [backend/README.md](./README.md)

## 📞 Soporte

Si hay errores:
1. Verificar logs en terminal donde corre `npm run start:dev`
2. Revisar archivos en `src/` según error
3. Consultar [NestJS Docs](https://docs.nestjs.com)
4. Verificar README.md en carpeta backend

---

**¡Backend DDD listo para desarrollo! 🎉**
