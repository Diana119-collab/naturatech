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
- TensorFlow.js + `@tensorflow-models/mobilenet` para reconocimiento visual

## Reconocimiento de aves

La identificación por fotografía se ejecuta en el navegador mediante TensorFlow.js y
`@tensorflow-models/mobilenet` (`mobilenet.load()`). El modelo actual es MobileNet
preentrenado con ImageNet, por lo que es un clasificador general de imágenes y no un
modelo especializado exclusivamente en aves.

El flujo actual es:

1. Se valida que el archivo sea una imagen y se carga el modelo una sola vez.
2. MobileNet genera hasta cinco predicciones con su probabilidad.
3. Se normaliza y traduce la etiqueta detectada.
4. Se comprueba si la etiqueta corresponde a una clase de ave conocida por la aplicación.
5. Solo se acepta una predicción con confianza mínima de `0.45` y se compara con las
	especies registradas en el destino.
6. Una coincidencia válida permite descubrir la especie; los demás casos no modifican
	el progreso.

El resultado puede tener uno de estos estados:

- `bird_identified`: ave identificada y registrada en el destino.
- `bird_not_registered`: parece un ave, pero no pertenece a las especies configuradas.
- `not_a_bird`: la clase principal detectada no corresponde a un ave, por ejemplo una
  jirafa que MobileNet podría clasificar erróneamente como llama.
- `uncertain`: la predicción parece aviar, pero no alcanza el umbral de confianza.

Este filtro evita que cualquier imagen desbloquee una especie, pero no convierte a
MobileNet en un detector perfecto de aves. Para mejorar la precisión sería necesario
sustituirlo o complementarlo con un modelo entrenado específicamente con fotografías de
aves y ejemplos negativos de mamíferos, personas, paisajes y objetos.

## Arquitectura futura

Los servicios en `client/src/services/` están preparados para reemplazar mocks por API Express + PostgreSQL.

## Credenciales admin (demo)

- Usuario: `admin`
- Contraseña: `naturatech2026`
