# NaturaTech

Plataforma digital de turismo de naturaleza con IA, gamificación, accesibilidad e i18n.

## Requisitos

- Node.js 22+
- npm 10+

## Instalación

```bash
npm run install:all
```

## Desarrollo

```bash
# Desde la raíz
npm run dev

# O desde client/
cd client
npm run dev
```

Abre http://localhost:5173

## Build

```bash
# Desde la raíz
npm run build

# Vista previa de la compilación
npm run preview
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page |
| `/destinos` | Lista de especies |
| `/especies` | Identifica tu Ave |
| `/ia` | Asistente AI |

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
- TensorFlow.js + modelo aviar especializado preparado para reconocimiento visual

## Reconocimiento de aves

La identificación por fotografía se ejecuta en el navegador con TensorFlow.js y el modelo
especializado ubicado en `client/public/models/birds/`. El modelo actual clasifica seis
clases: `garza-azul`, `pelicano-peruano`, `cormoran`, `gaviota`, `playerito` y `not_bird`.
La clase `not_bird` incluye mamíferos, personas, paisajes y objetos para evitar falsos
positivos como clasificar una jirafa como llama.

El sistema acepta una identificación únicamente cuando la confianza es de al menos
`0.45`, la etiqueta corresponde a una clase aviar válida y existe coincidencia con una
especie registrada en el destino. Si el modelo no carga, se solicita otra imagen y no se
desbloquea ninguna especie.

Los artefactos publicados son `model.json`, los archivos `group1-shard*.bin` y
`labels.json`. Deben conservarse juntos en `client/public/models/birds/`.

### Entrenamiento del modelo

El dataset y el pipeline están en `dataset/birds/` y `scripts/train_bird_model.py`.
Para regenerar el modelo en Windows:

```powershell
py -3.11 -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements-model.txt
.venv\Scripts\python.exe scripts\train_bird_model.py
```

El script entrena mediante transferencia de aprendizaje con MobileNetV2, guarda
`bird_classifier.h5` y exporta automáticamente los archivos que consume el navegador.
La estructura de imágenes está documentada en `dataset/birds/README.md`.

## Despliegue

El proyecto se publica automáticamente en GitHub Pages mediante
`.github/workflows/deploy.yml` cada vez que se hace push a `main` o `master`. También se
puede ejecutar manualmente desde la pestaña **Actions** de GitHub.

Para publicar:

1. Confirma que `npm run build` termina correctamente.
2. Verifica que `client/public/models/birds/model.json`, `labels.json` y todos los `.bin`
   estén incluidos en el commit.
3. Ejecuta `git push origin main` o `git push origin master`.
4. En el repositorio, habilita GitHub Pages con **GitHub Actions** como fuente.

La aplicación usa rutas relativas mediante Vite (`base: './'`), por lo que los modelos y
los recursos estáticos funcionan en la URL del proyecto de GitHub Pages.

## Arquitectura futura

Los servicios en `client/src/services/` están preparados para reemplazar mocks por API Express + PostgreSQL.
