# Guía de Configuración - Dealer con PostgreSQL

Esta guía te ayudará a configurar tanto el backend como el frontend para que funcionen con PostgreSQL.

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🗄️ Paso 1: Configurar PostgreSQL

1. **Instalar PostgreSQL** (si no lo tienes):
   - Windows: Descarga desde [postgresql.org](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Crear la base de datos**:
   ```sql
   -- Conectarte a PostgreSQL
   psql -U postgres

   -- Crear la base de datos
   CREATE DATABASE dealer_db;

   -- Salir
   \q
   ```

## 🔧 Paso 2: Configurar el Backend

1. **Navegar a la carpeta del servidor**:
   ```bash
   cd server
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   ```

4. **Editar `.env`** con tus credenciales:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=dealer_db
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña_postgres
   PORT=3000
   JWT_SECRET=tu_secreto_jwt_muy_seguro_cambiar_en_produccion
   CORS_ORIGIN=http://localhost:4200
   ```

5. **Inicializar la base de datos**:
   ```bash
   node database/init.js
   ```

   Esto creará:
   - Las tablas necesarias (users, favorites, vehicles)
   - El usuario admin (Pascual / PascualParedes2025)

6. **Iniciar el servidor**:
   ```bash
   # Desarrollo (con auto-reload)
   npm run dev

   # Producción
   npm start
   ```

   El servidor debería estar corriendo en `http://localhost:3000`

## 🎨 Paso 3: Configurar el Frontend

1. **Volver a la raíz del proyecto**:
   ```bash
   cd ..
   ```

2. **Verificar que HttpClient esté configurado** (ya está hecho en `app.config.ts`)

3. **Iniciar Angular**:
   ```bash
   ng serve
   ```

   La aplicación debería estar en `http://localhost:4200`

## ✅ Paso 4: Verificar que Funciona

1. **Verificar el backend**:
   - Abre `http://localhost:3000/api/health` en tu navegador
   - Deberías ver: `{"status":"OK","message":"Server is running"}`

2. **Probar registro**:
   - Ve a `http://localhost:4200/register`
   - Crea una cuenta nueva
   - Debería guardarse en PostgreSQL

3. **Probar login**:
   - Inicia sesión con tu cuenta
   - O usa el admin: `Pascual` / `PascualParedes2025`

4. **Probar favoritos**:
   - Busca un vehículo
   - Haz hover sobre la tarjeta y haz clic en la estrella
   - Debería guardarse en PostgreSQL

## 🔄 Cambiar entre Base de Datos y LocalStorage

Si quieres usar localStorage temporalmente (sin backend):

1. En `src/app/services/auth.service.ts`:
   ```typescript
   private useDatabase = false; // Cambiar a false
   ```

2. En `src/app/services/favorites.service.ts`:
   ```typescript
   private useDatabase = false; // Cambiar a false
   ```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que la base de datos `dealer_db` exista

### Error: "CORS policy"
- Verifica que `CORS_ORIGIN` en `.env` sea `http://localhost:4200`
- Verifica que el servidor esté corriendo en el puerto correcto

### Error: "Token inválido"
- Cierra sesión y vuelve a iniciar sesión
- Verifica que `JWT_SECRET` esté configurado

## 📝 Notas

- El usuario admin se crea automáticamente con:
  - Usuario: `Pascual`
  - Contraseña: `PascualParedes2025`
- Los tokens JWT expiran en 7 días
- Los favoritos se sincronizan automáticamente con la base de datos

