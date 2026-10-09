#  Impacto Visible

Plataforma de donaciones y visualización humanitaria enfocada en dar visibilidad a las **crisis olvidadas** del mundo.

**Proyecto Integrador Full Stack** — 5to año

---

##  URLs de producción

| Servicio | URL |
|----------|-----|
| **Frontend** | https://impacto-visible.netlify.app |
| **Backend API** | https://impacto-visible-production.up.railway.app |
| **Repositorio** | https://github.com/Dtoc2025/Impacto-visible- |

---

## Credenciales de demostración

| Rol | Email | Contraseña |
|-----|-------|-----------|
| **Admin** | `admin@impacto.com` | `admin123` |
| **Donante** | `donor@impacto.com` | `donor123` |
| **Organización 1** | `medicos@impacto.com` | `org123` |
| **Organización 2** | `agua@impacto.com` | `org123` |

---

##  Descripción

Impacto Visible conecta donantes con proyectos humanitarios verificados en todo el mundo, dando especial visibilidad a las causas que no reciben cobertura mediática. Permite:

- Explorar proyectos con filtros por categoría, urgencia y crisis olvidadas.
- Donar de forma anónima o pública a cualquier proyecto.
- Visualizar el impacto con métricas en tiempo real.
- Registro de organizaciones para publicar proyectos.
- Panel de gestión para organizaciones.
- Dashboard con estadísticas globales.

---

##  Arquitectura
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ │ │ │ │ │
│ Frontend │─────▶│ Backend │─────▶│ MySQL │
│ Angular 18 │ HTTP │ Node + Express │Prisma│ 8.0 │
│ Tailwind CSS │ │ TypeScript │ │ │
│ │ │ │ │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘
:4200 :4000 :3307

text

- **Frontend:** Angular 18 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript + Prisma
- **Base de datos:** MySQL 8
- **DevOps:** Docker + Docker Compose + pnpm
- **Autenticación:** JWT + bcrypt
- **Subida de archivos:** Multer

---

##  Instalación y ejecución

### Requisitos previos

- **Docker Desktop** (con WSL2 en Windows)
- **pnpm** 9+ (`npm install -g pnpm`)
- **Node.js** 20+

###  Opción A: Con Docker (recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Dtoc2025/Impacto-visible-.git
cd Impacto-visible-

# 2. Levantar todo
docker compose up --build
Esperar 2-3 minutos la primera vez. El seed se ejecuta automáticamente si la DB está vacía.

Acceder:

Frontend: http://localhost:4200

Backend: http://localhost:4000/api/health

MySQL: localhost:3307

Detener:

bash
docker compose down
Detener y borrar DB (empezar de cero):

bash
docker compose down -v
docker compose up --build
 Opción B: Sin Docker
Terminal 1 — MySQL (Docker):

bash
docker compose up -d mysql
Terminal 2 — Backend:

bash
cd backend
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed
pnpm dev
Terminal 3 — Frontend:

bash
cd frontend
pnpm install
pnpm start
 Estructura del proyecto
text
Impacto-visible/
├── backend/                    # API REST
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de datos
│   │   ├── seed.ts             # Datos iniciales
│   │   └── migrations/         # Migraciones SQL
│   ├── src/
│   │   ├── config/             # Prisma + Multer
│   │   ├── controllers/        # Lógica de negocio
│   │   ├── middleware/         # Auth + errores
│   │   ├── routes/             # Endpoints REST
│   │   ├── utils/              # JWT
│   │   ├── app.ts              # Configuración Express
│   │   └── server.ts           # Punto de entrada
│   ├── uploads/                # Archivos subidos
│   ├── entrypoint.sh           # Script de arranque
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/                   # SPA Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Servicios, guards, modelos
│   │   │   ├── shared/         # Componentes reutilizables
│   │   │   └── features/       # Módulos por funcionalidad
│   │   ├── environments/       # Config por entorno
│   │   ├── styles.css
│   │   └── main.ts
│   ├── public/_redirects       # SPA routing Netlify
│   ├── proxy.conf.json
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── package.json
├── DB/
│   └── impacto_visible.sql     # Script SQL
├── docs/                       # Documentación técnica
│   ├── ER.md
│   ├── diccionario-datos.md
│   ├── paleta.md
│   ├── api.md
│   └── manual-usuario.md
├── docker-compose.yml
├── netlify.toml
├── pnpm-workspace.yaml
├── package.json
└── README.md
 Endpoints principales
Ver documentación completa en docs/api.md.

Método	Endpoint	Descripción
GET	/api/health	Health check
POST	/api/auth/register	Registro
POST	/api/auth/login	Login
GET	/api/auth/me	Perfil
PUT	/api/auth/me	Editar perfil
GET	/api/projects	Listar proyectos
GET	/api/projects/:id	Detalle
POST	/api/projects	Crear (ADMIN/ORG)
PUT	/api/projects/:id	Editar
DELETE	/api/projects/:id	Eliminar
GET	/api/projects/mine	Mis proyectos (ORG)
POST	/api/donations	Donar
GET	/api/donations/me	Mis donaciones
GET	/api/categories	Categorías
GET	/api/dashboard/stats	Stats
GET	/api/dashboard/by-category	Por categoría
POST	/api/uploads/single	Subir imagen
POST	/api/uploads/multiple	Subir varias
 Identidad visual
Ver docs/paleta.md.

Primario: Coral profundo (#E11D48)

Secundario: Naranja cálido (#EA580C)

Acento: Ámbar dorado (#F59E0B)

Neutros: Ink

Tipografía: Inter + Plus Jakarta Sans

 Documentación
Modelo Entidad-Relación

Diccionario de Datos

Paleta de colores

API Reference

Manual de Usuario

 Pruebas
bash
# Backend (pendiente)
cd backend
pnpm test

# Frontend (pendiente)
cd frontend
pnpm test
 Despliegue
Servicio	Plataforma	URL
Frontend	Netlify	https://impacto-visible.netlify.app
Backend	Railway	https://impacto-visible-production.up.railway.app
Base de datos	Railway MySQL	(interno)
 Autor
David Alejandro Toc Orozco
Proyecto Integrador — 5to año

 Licencia
Proyecto académico — Uso educativo.
MIT License © 2026 Impacto Visible

text

