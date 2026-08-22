# Modelo aviar especializado

Coloca en este directorio el modelo convertido a TensorFlow.js:

- `model.json`
- uno o varios archivos de pesos referenciados por `model.json`
- `labels.json`

El modelo debe ser un modelo Keras convertido con `tensorflowjs_converter`, aceptar
imagenes RGB de `224x224` y devolver una probabilidad por cada etiqueta. La normalizacion
`[-1, 1]` debe estar incluida dentro del modelo, como en el script de entrenamiento.
El orden de salida debe coincidir con `labels.json`. La ultima clase debe ser `not_bird`.

El cliente carga este modelo como fuente de identificacion. Si `model.json` no esta
presente o no puede cargarse, la aplicacion solicita otra imagen en lugar de mostrar una
clase generica de ImageNet.

## Conversion desde Keras

Con Python y TensorFlow.js instalado, convierte un modelo Keras compatible con:

```bash
tensorflowjs_converter --input_format=keras bird_classifier.h5 client/public/models/birds
```

Despues verifica que el directorio contenga `model.json` y los archivos `.bin` indicados
por ese archivo. El cliente los cargara automaticamente al iniciar la primera
identificacion por foto.
