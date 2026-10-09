# Modelo Entidad-Relación

## Diagrama
┌─────────────────┐ ┌─────────────────┐
│ USER │ │ CATEGORY │
├─────────────────┤ ├─────────────────┤
│ id (PK) │ │ id (PK) │
│ email (UK) │ │ name (UK) │
│ name │ │ slug (UK) │
│ password │ │ description │
│ role (enum) │ │ icon │
│ organizationName│ │ color │
│ country │ │ createdAt │
│ avatarUrl │ └─────────────────┘
│ bio │ │
│ website │ │ 1
│ createdAt │ │
│ updatedAt │ │ N
└─────────────────┘ ┌─────────────────┐
│ 1 │ PROJECT │
│ ├─────────────────┤
│ N │ id (PK) │
│ │ title │
┌─────────────────┐ │ subtitle │
│ DONATION │ │ description │
├─────────────────┤ │ impact │
│ id (PK) │ │ beneficiaries │
│ amount │ │ country │
│ message │ │ region │
│ isAnonymous │ │ urgency (enum) │
│ userId (FK) │────────▶│ isForgotten │
│ projectId (FK) │ │ goal │
│ createdAt │ │ raised │
└─────────────────┘ │ imageUrl │
│ gallery (JSON) │
│ latitude │
│ longitude │
│ categoryId (FK) │
│ organizerId (FK)│
│ createdAt │
│ updatedAt │
└─────────────────┘




## Entidades

| Entidad | Descripción |
|---------|-------------|
| **User** | Usuarios del sistema (admin, organización, donante) |
| **Category** | Categorías de proyectos |
| **Project** | Proyectos humanitarios publicados |
| **Donation** | Donaciones realizadas por usuarios |

## Relaciones

- **User → Donation:** 1:N (un usuario puede hacer muchas donaciones)
- **User → Project:** 1:N (una organización puede crear muchos proyectos)
- **Category → Project:** 1:N (una categoría tiene muchos proyectos)
- **Project → Donation:** 1:N (un proyecto recibe muchas donaciones)

## Enums

### Role
- `ADMIN`: Administrador del sistema
- `ORG`: Organización que publica proyectos
- `DONOR`: Donante individual

### Urgency
- `LOW`: Baja urgencia
- `MEDIUM`: Urgencia media
- `HIGH`: Alta urgencia
- `CRITICAL`: Urgencia crítica

## Normalización

El modelo cumple con **Tercera Forma Normal (3FN)**:
- Cada tabla tiene clave primaria.
- No hay dependencias parciales ni transitivas.
- Los campos multivaluados (gallery) se almacenan como JSON.

## Índices

- `users.email`: UNIQUE
- `categories.name`: UNIQUE
- `categories.slug`: UNIQUE
- `projects.categoryId`: INDEX
- `projects.isForgotten`: INDEX
- `projects.organizerId`: INDEX
- `donations.userId`: INDEX
- `donations.projectId`: INDEX