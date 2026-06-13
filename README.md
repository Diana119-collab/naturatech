# NaturaTech

Plataforma digital de turismo de naturaleza con IA, gamificación, accesibilidad e i18n — prototipo para hackathon.

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
| `/destinos` | Lista de destinos |
| `/explorar/la-arenilla` | Mapa interactivo (demo principal) |
| `/especies` | Colección digital |
| `/ia` | Guía Natura AI |
| `/certificado` | Certificado digital |
| `/admin/login` | Panel admin (admin / naturatech2026) |

## Demo principal: La Arenilla

Destino completo con 3 zonas y 5 especies:
- Humedal: Garza blanca, Playerito
- Orilla: Pelícano peruano, Gaviota
- Mirador: Cormorán

## Guion demo (3 minutos)

1. **0:00–0:30** — Landing: presentar NaturaTech, cambiar idioma (ES/EN/PT)
2. **0:30–1:15** — Elegir La Arenilla → mapa con zonas bloqueadas → identificar Garza blanca → zona desbloqueada
3. **1:15–2:00** — Ver colección, puntos/nivel, preguntar a Natura AI sobre colibríes
4. **2:00–2:30** — Activar modo accesibilidad (voz + texto grande)
5. **2:30–3:00** — Completar destino → certificado PDF → mencionar Cocachimba y Pantanos de Villa

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
