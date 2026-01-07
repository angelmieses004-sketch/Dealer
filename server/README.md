# Dealer Backend API

Backend server para la aplicación Dealer con PostgreSQL.

## Requisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de PostgreSQL:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dealer_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
PORT=3000
JWT_SECRET=tu_secreto_jwt_muy_seguro
CORS_ORIGIN=http://localhost:4200
```

3. Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE dealer_db;
```

4. Inicializar el esquema de la base de datos:
```bash
node database/init.js
```

5. Iniciar el servidor:
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Endpoints API

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Favoritos

- `GET /api/favorites` - Obtener favoritos del usuario (requiere token)
- `POST /api/favorites/:vehicleId` - Añadir a favoritos (requiere token)
- `DELETE /api/favorites/:vehicleId` - Eliminar de favoritos (requiere token)
- `POST /api/favorites/toggle/:vehicleId` - Alternar favorito (requiere token)

## Autenticación

Los endpoints protegidos requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

El token se obtiene al hacer login o registro.

