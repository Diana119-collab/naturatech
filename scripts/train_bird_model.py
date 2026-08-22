"""Train and export NaturaTech's local bird classifier.

Expected dataset:
  dataset/birds/train/<class>/*.jpg
  dataset/birds/validation/<class>/*.jpg
"""

from pathlib import Path
import json
import shutil
import subprocess
import sys

import tensorflow as tf

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 15
CLASS_NAMES = [
    "garza-azul",
    "pelicano-peruano",
    "cormoran",
    "gaviota",
    "playerito",
    "not_bird",
]
ROOT = Path(__file__).resolve().parents[1]
DATASET = ROOT / "dataset" / "birds"
OUTPUT = ROOT / "client" / "public" / "models" / "birds"
KERAS_OUTPUT = ROOT / "bird_classifier.h5"


def load_split(name: str):
    folder = DATASET / name
    missing = [class_name for class_name in CLASS_NAMES if not (folder / class_name).is_dir()]
    if missing:
        raise FileNotFoundError(f"Faltan carpetas en {folder}: {', '.join(missing)}")

    return tf.keras.utils.image_dataset_from_directory(
        folder,
        class_names=CLASS_NAMES,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=name == "train",
        seed=42,
    )


def main() -> None:
    train = load_split("train")
    validation = load_split("validation")

    augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.08),
        tf.keras.layers.RandomZoom(0.15),
    ], name="augmentation")
    train = train.map(lambda images, labels: (augmentation(images, training=True), labels))

    base = tf.keras.applications.MobileNetV2(
        input_shape=(*IMAGE_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    base.trainable = False

    inputs = tf.keras.Input(shape=(*IMAGE_SIZE, 3), name="image")
    x = tf.keras.layers.Rescaling(1 / 127.5, offset=-1, name="normalize")(inputs)
    x = base(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.25)(x)
    outputs = tf.keras.layers.Dense(len(CLASS_NAMES), activation="softmax", name="bird_classes")(x)
    model = tf.keras.Model(inputs, outputs, name="naturatech_bird_classifier")

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.fit(train, validation_data=validation, epochs=EPOCHS)

    model.save(KERAS_OUTPUT, save_format="h5")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    labels_path = OUTPUT / "labels.json"
    labels_path.write_text(json.dumps(CLASS_NAMES, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")

    converter = shutil.which("tensorflowjs_converter")
    if converter is None:
        local_converter = Path(sys.executable).parent / "tensorflowjs_converter.exe"
        if local_converter.exists():
            converter = str(local_converter)
    if converter is None:
        raise RuntimeError(
            "No se encontro tensorflowjs_converter. Ejecuta: "
            "pip install tensorflowjs"
        )

    converter_environment = None
    stub_path = ROOT / "scripts" / "converter_stubs"
    if stub_path.exists():
        import os
        converter_environment = os.environ.copy()
        converter_environment["PYTHONPATH"] = str(stub_path)

    subprocess.run([
        converter,
        "--input_format=keras",
        str(KERAS_OUTPUT),
        str(OUTPUT),
    ], check=True, env=converter_environment)

    model_json = OUTPUT / "model.json"
    if not model_json.exists():
        raise RuntimeError("La conversion no genero model.json")

    print(f"Modelo exportado en: {OUTPUT}")
    print(f"Clases: {CLASS_NAMES}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Error: {error}", file=sys.stderr)
        raise
