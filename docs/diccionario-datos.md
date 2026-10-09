# Diccionario de Datos

## Tabla: users

| Campo | Tipo | Nulable | Restricción | Descripción |
|-------|------|---------|-------------|-------------|
| id | INT | No | PK, AUTO_INCREMENT | Identificador único |
| email | VARCHAR(191) | No | UNIQUE | Correo electrónico |
| name | VARCHAR(191) | No | — | Nombre completo |
| password | VARCHAR(191) | No | — | Contraseña hasheada (bcrypt) |
| role | ENUM | No | DEFAULT 'DONOR' | Rol: ADMIN, ORG, DONOR |
| organizationName | VARCHAR(191) | Sí | — | Nombre de la organización |
| country | VARCHAR(191) | Sí | — | País de origen |
| avatarUrl | VARCHAR(191) | Sí | — | URL del avatar |
| bio | TEXT | Sí | — | Descripción biográfica |
| website | VARCHAR(191) | Sí | — | Sitio web |
| createdAt | DATETIME | No | DEFAULT NOW() | Fecha de registro |
| updatedAt | DATETIME | No | — | Última actualización |

## Tabla: categories

| Campo | Tipo | Nulable | Restricción | Descripción |
|-------|------|---------|-------------|-------------|
| id | INT | No | PK, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(191) | No | UNIQUE | Nombre |
| slug | VARCHAR(191) | No | UNIQUE | Identificador URL-friendly |
| description | TEXT | Sí | — | Descripción |
| icon | VARCHAR(191) | Sí | — | Emoji o icono |
| color | VARCHAR(191) | Sí | — | Color HEX |
| createdAt | DATETIME | No | DEFAULT NOW() | Fecha de creación |

## Tabla: projects

| Campo | Tipo | Nulable | Restricción | Descripción |
|-------|------|---------|-------------|-------------|
| id | INT | No | PK, AUTO_INCREMENT | Identificador único |
| title | VARCHAR(191) | No | — | Título |
| subtitle | VARCHAR(191) | Sí | — | Subtítulo corto |
| description | TEXT | No | — | Descripción detallada |
| impact | TEXT | Sí | — | Impacto esperado |
| beneficiaries | INT | Sí | — | Número de beneficiarios |
| country | VARCHAR(191) | No | — | País |
| region | VARCHAR(191) | Sí | — | Región o ciudad |
| urgency | ENUM | No | DEFAULT 'MEDIUM' | Nivel de urgencia |
| isForgotten | BOOLEAN | No | DEFAULT FALSE | ¿Crisis olvidada? |
| goal | DECIMAL(12,2) | No | — | Meta de recaudación (USD) |
| raised | DECIMAL(12,2) | No | DEFAULT 0 | Monto recaudado |
| imageUrl | VARCHAR(191) | Sí | — | URL de imagen principal |
| gallery | JSON | Sí | — | Array de URLs |
| latitude | FLOAT | Sí | — | Latitud geográfica |
| longitude | FLOAT | Sí | — | Longitud geográfica |
| categoryId | INT | No | FK → categories.id | Categoría |
| organizerId | INT | Sí | FK → users.id | Organización creadora |
| createdAt | DATETIME | No | DEFAULT NOW() | Fecha de creación |
| updatedAt | DATETIME | No | — | Última actualización |

## Tabla: donations

| Campo | Tipo | Nulable | Restricción | Descripción |
|-------|------|---------|-------------|-------------|
| id | INT | No | PK, AUTO_INCREMENT | Identificador único |
| amount | DECIMAL(12,2) | No | — | Monto (USD) |
| message | TEXT | Sí | — | Mensaje de apoyo |
| isAnonymous | BOOLEAN | No | DEFAULT FALSE | ¿Anónima? |
| userId | INT | No | FK → users.id | Usuario |
| projectId | INT | No | FK → projects.id | Proyecto |
| createdAt | DATETIME | No | DEFAULT NOW() | Fecha |