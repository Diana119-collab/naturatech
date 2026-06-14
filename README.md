# NaturaTech

Plataforma digital de turismo de naturaleza con IA, gamificación, accesibilidad e i18n.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
cd client
npm install
```

## Desarrollo

```bash
# Desde la raíz
npm run dev

# O desde client/
cd client && npm run dev
```

Abre http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page |
| `/destinos` | Lista de especies |
| `/especies` | Identifica tu Ave |
| `/ia` | Asistente AI |
| `/admin/login` | Panel admin (admin / naturatech2026) |

## Demo principal: La Arenilla

Destino completo con 3 zonas y 5 especies:
- Humedal: Garza blanca, Playerito
- Orilla: Pelícano peruano, Gaviota
- Mirador: Cormorán

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- React Router 7
- Leaflet + OpenStreetMap
- i18next (ES, EN, PT)
- LocalStorage (progreso anónimo NT-XXXXX)

## Arquitectura futura

Los servicios en `client/src/services/` están preparados para reemplazar mocks por API Express + PostgreSQL.

## Credenciales admin (demo)

- Usuario: `admin`
- Contraseña: `naturatech2026`
