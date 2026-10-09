# Documentación de API

**Base URL:** http://localhost:4000/api

## Endpoints públicos

### GET /health
Health check.
Respuesta: `{ "ok": true }`

### POST /auth/register
Registro de usuario.
Body:
```json
{
  "email": "user@example.com",
  "name": "Juan Pérez",
  "password": "123456",
  "role": "DONOR",
  "organizationName": "Mi ONG",
  "country": "México"
}

Respuesta (201): { "token": "...", "user": {...} }

POST /auth/login
Login.
Body:

json
{ "email": "donor@impacto.com", "password": "donor123" }
Respuesta (200): { "token": "...", "user": {...} }

GET /projects
Lista con filtros.
Query: page, limit, search, category, urgency, forgotten

GET /projects/:id
Detalle del proyecto.

GET /categories
Lista de categorías.

GET /dashboard/stats
Estadísticas globales.

GET /dashboard/by-category
Donaciones por categoría.

Endpoints protegidos
Header: Authorization: Bearer <token>

GET /auth/me
Perfil del usuario.

PUT /auth/me
Actualiza perfil.

POST /projects
Crear proyecto (ADMIN u ORG).

PUT /projects/:id
Editar proyecto (ADMIN o dueño).

DELETE /projects/:id
Eliminar proyecto (ADMIN o dueño).

GET /projects/mine
Mis proyectos (ORG).

POST /donations
Crear donación.
Body:

json
{
  "amount": 100,
  "message": "Ánimo",
  "isAnonymous": false,
  "projectId": 1
}
GET /donations/me
Mis donaciones.

POST /uploads/single
Subir imagen (multipart/form-data, field: image).

POST /uploads/multiple
Subir hasta 10 imágenes (field: images).

Códigos de estado
Código	Significado
200	OK
201	Creado
204	Sin contenido
400	Datos inválidos
401	No autenticado
403	Sin permisos
404	No encontrado
409	Conflicto
500	Error interno