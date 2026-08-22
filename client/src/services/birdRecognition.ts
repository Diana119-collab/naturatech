import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import type { Destino, Especie } from '../types';
import { getTexto } from '../utils';

export interface BirdPrediction {
  label: string;
  confidence: number;
}

export interface BirdRecognitionResult {
  status: 'bird_identified' | 'bird_not_registered' | 'not_a_bird' | 'uncertain';
  topPrediction: BirdPrediction | null;
  predictions: BirdPrediction[];
  matchedEspecie: Especie | null;
  message: string;
}

const MIN_BIRD_CONFIDENCE = 0.45;

let modelPromise: Promise<mobilenet.MobileNet | null> | null = null;

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const birdLabelTranslations: Record<string, { es: string; en: string; pt: string }> = {
  cock: { es: 'gallo', en: 'cock', pt: 'galo' },
  hen: { es: 'gallina', en: 'hen', pt: 'galinha' },
  ostrich: { es: 'avestruz', en: 'ostrich', pt: 'avestruz' },
  brambling: { es: 'escribano cerillo', en: 'brambling', pt: 'tentilhão' },
  goldfinch: { es: 'jilguero', en: 'goldfinch', pt: 'pintassilgo' },
  'house finch': { es: 'pinzón doméstico', en: 'house finch', pt: 'tentilhão-doméstico' },
  junco: { es: 'junco', en: 'junco', pt: 'tordo-junco' },
  'indigo bunting': { es: 'azulillo índigo', en: 'indigo bunting', pt: 'azulão' },
  robin: { es: 'petirrojo americano', en: 'robin', pt: 'sabiá-americano' },
  bulbul: { es: 'bulbul', en: 'bulbul', pt: 'bulbul' },
  jay: { es: 'arrendajo', en: 'jay', pt: 'gaio' },
  magpie: { es: 'urraca', en: 'magpie', pt: 'pega' },
  chickadee: { es: 'carbonero', en: 'chickadee', pt: 'chapim' },
  dipper: { es: 'mirlo acuático', en: 'dipper', pt: 'melro-d’água' },
  kite: { es: 'milano', en: 'kite', pt: 'milhafre' },
  'bald eagle': { es: 'águila calva', en: 'bald eagle', pt: 'águia-careca' },
  vulture: { es: 'buitre', en: 'vulture', pt: 'abutre' },
  'great grey owl': { es: 'búho gris', en: 'great grey owl', pt: 'coruja-cinzenta' },
  'black grouse': { es: 'gallo lira', en: 'black grouse', pt: 'tetraz-preto' },
  ptarmigan: { es: 'perdiz nival', en: 'ptarmigan', pt: 'lagópode' },
  'ruffed grouse': { es: 'urogallo de collar', en: 'ruffed grouse', pt: 'galo-lira' },
  'prairie chicken': { es: 'gallo de las praderas', en: 'prairie chicken', pt: 'galinha-da-pradaria' },
  peacock: { es: 'pavo real', en: 'peacock', pt: 'pavão' },
  quail: { es: 'codorniz', en: 'quail', pt: 'codorna' },
  partridge: { es: 'perdiz', en: 'partridge', pt: 'perdiz' },
  'african grey': { es: 'loro gris africano', en: 'african grey', pt: 'papagaio-cinzento' },
  macaw: { es: 'guacamayo', en: 'macaw', pt: 'arara' },
  parrot: { es: 'loro', en: 'parrot', pt: 'papagaio' },
  cockatoo: { es: 'cacatúa', en: 'cockatoo', pt: 'cacatua' },
  'sulphur-crested cockatoo': { es: 'cacatúa de cresta amarilla', en: 'sulphur-crested cockatoo', pt: 'cacatua-de-crista-amarela' },
  lorikeet: { es: 'lori', en: 'lorikeet', pt: 'lóris' },
  coucal: { es: 'cucal', en: 'coucal', pt: 'cucal' },
  'bee eater': { es: 'abejaruco', en: 'bee eater', pt: 'abelharuco' },
  hornbill: { es: 'cálao', en: 'hornbill', pt: 'calau' },
  hummingbird: { es: 'colibrí', en: 'hummingbird', pt: 'beija-flor' },
  jacamar: { es: 'jacamar', en: 'jacamar', pt: 'ariramba' },
  toucan: { es: 'tucán', en: 'toucan', pt: 'tucano' },
  drake: { es: 'pato macho', en: 'drake', pt: 'pato macho' },
  goose: { es: 'ganso', en: 'goose', pt: 'ganso' },
  'red-breasted merganser': { es: 'serreta mediana', en: 'red-breasted merganser', pt: 'merganso-de-peito-ruivo' },
  'black swan': { es: 'cisne negro', en: 'black swan', pt: 'cisne-negro' },
  'white stork': { es: 'cigüeña blanca', en: 'white stork', pt: 'cegonha-branca' },
  'black stork': { es: 'cigüeña negra', en: 'black stork', pt: 'cegonha-preta' },
  spoonbill: { es: 'espátula', en: 'spoonbill', pt: 'colhereiro' },
  pelican: { es: 'pelícano', en: 'pelican', pt: 'pelicano' },
  heron: { es: 'garza', en: 'heron', pt: 'garça' },
  'little blue heron': { es: 'garza azul', en: 'little blue heron', pt: 'garça-azul' },
  'american egret': { es: 'garceta grande', en: 'american egret', pt: 'garça-branca-grande' },
  bittern: { es: 'avetoro', en: 'bittern', pt: 'garça-bittern' },
  egret: { es: 'garceta', en: 'egret', pt: 'garça-branca' },
  cormorant: { es: 'cormorán', en: 'cormorant', pt: 'corvo-marinho' },
  gull: { es: 'gaviota', en: 'gull', pt: 'gaivota' },
  flamingo: { es: 'flamenco', en: 'flamingo', pt: 'flamingo' },
  crane: { es: 'grulla', en: 'crane', pt: 'grou' },
  limpkin: { es: 'carrao', en: 'limpkin', pt: 'carão' },
  'american coot': { es: 'focha americana', en: 'american coot', pt: 'galeirão-americano' },
  bustard: { es: 'avutarda', en: 'bustard', pt: 'abetarda' },
  'ruddy turnstone': { es: 'vuelvepiedras rojizo', en: 'ruddy turnstone', pt: 'vira-pedras' },
  redshank: { es: 'archibebe común', en: 'redshank', pt: 'perna-vermelha' },
  dowitcher: { es: 'agachadiza moteada', en: 'dowitcher', pt: 'maçarico' },
  oystercatcher: { es: 'ostrero', en: 'oystercatcher', pt: 'ostraceiro' },
  albatross: { es: 'albatros', en: 'albatross', pt: 'albatroz' },
  'king penguin': { es: 'pingüino rey', en: 'king penguin', pt: 'pinguim-rei' },
  owl: { es: 'búho', en: 'owl', pt: 'coruja' },
  eagle: { es: 'águila', en: 'eagle', pt: 'águia' },
};

function translateBirdLabel(label: string, language: string): string {
  const translation = birdLabelTranslations[normalizeText(label)];
  return translation ? getTexto(translation, language) : label;
}

function isLikelyBirdLabel(label: string): boolean {
  const normalizedLabel = normalizeText(label);
  return birdLabelTranslations[normalizedLabel] !== undefined ||
    normalizedLabel.includes('bird') ||
    normalizedLabel.includes('birdie');
}

function matchesSpeciesName(label: string, especie: Especie): boolean {
  const normalizedLabel = normalizeText(label);
  const candidateNames = [
    getTexto(especie.nombre, 'es'),
    getTexto(especie.nombre, 'en'),
    getTexto(especie.nombre, 'pt'),
    especie.scientificName ?? '',
    especie.id,
    especie.sonido ?? '',
  ]
    .map(normalizeText)
    .filter(Boolean);

  return candidateNames.some((candidate) =>
    normalizedLabel.includes(candidate) || candidate.includes(normalizedLabel)
  );
}

async function loadBirdClassifier(): Promise<mobilenet.MobileNet | null> {
  if (typeof window === 'undefined') return null;

  if (!modelPromise) {
    modelPromise = tf
      .ready()
      .then(async () => {
        const model = await mobilenet.load();
        return model;
      })
      .catch((error) => {
        console.error('No se pudo cargar el modelo de clasificación visual de TensorFlow.js:', error);
        return null;
      });
  }

  return modelPromise;
}

function buildSafePrediction(label: string, confidence: number): BirdPrediction {
  return {
    label: label.trim() || `Bird class ${Math.round(confidence * 100)}`,
    confidence,
  };
}

export async function classifyBirdImage(file: File, destino: Destino, language: string): Promise<BirdRecognitionResult | null> {
  if (!file.type.startsWith('image/')) return null;

  const model = await loadBirdClassifier();
  if (!model) return null;

  let imageUrl: string | null = null;
  try {
    imageUrl = URL.createObjectURL(file);
    const currentImageUrl = imageUrl;
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No se pudo procesar la imagen'));
      img.src = currentImageUrl;
    });

    const rawPredictions = await model.classify(image, 5);
    const predictions = rawPredictions
      .map((item) => {
        const rawLabel = item.className.split(',')[0].trim() || 'bird';
        return buildSafePrediction(translateBirdLabel(rawLabel, language), item.probability);
      })
      .filter((item) => item.confidence > 0)
      .slice(0, 5);

    const rawTopLabel = rawPredictions[0]?.className.split(',')[0].trim() ?? '';
    const topPrediction = predictions[0] ?? null;
    const isBird = isLikelyBirdLabel(rawTopLabel);
    const isConfident = Boolean(topPrediction && topPrediction.confidence >= MIN_BIRD_CONFIDENCE);
    const matchedEspecie =
      isBird && isConfident && topPrediction
        ? destino.especies.find((especie) => matchesSpeciesName(rawTopLabel, especie)) ?? null
        : null;

    const status = !isBird
      ? 'not_a_bird'
      : !isConfident
        ? 'uncertain'
        : matchedEspecie
          ? 'bird_identified'
          : 'bird_not_registered';

    const message = status === 'bird_identified'
      ? language === 'en'
        ? `We identified ${getTexto(matchedEspecie!.nombre, language)} with ${(topPrediction!.confidence * 100).toFixed(0)}% confidence.`
        : language === 'pt'
          ? `Identificamos ${getTexto(matchedEspecie!.nombre, language)} com ${(topPrediction!.confidence * 100).toFixed(0)}% de confiança.`
          : `Se identificó ${getTexto(matchedEspecie!.nombre, language)} con ${(topPrediction!.confidence * 100).toFixed(0)}% de confianza.`
      : status === 'not_a_bird'
        ? language === 'en'
          ? `This image does not appear to contain a bird. The model detected ${topPrediction?.label ?? 'an unrecognized object'}.`
          : language === 'pt'
            ? `Esta imagem não parece conter uma ave. Intente novamente.`
            : `Esta imagen no parece contener un ave. Intentalo nuevamente.`
        : status === 'uncertain'
          ? language === 'en'
            ? 'The result is uncertain. Try a clearer photo showing the whole bird.'
            : language === 'pt'
              ? 'O resultado é incerto. Tente uma foto mais nítida mostrando a ave inteira.'
              : 'El resultado es incierto. Intenta con una foto más clara que muestre el ave completa.'
          : language === 'en'
            ? `The image probably shows a ${topPrediction!.label}. This species is not registered in the Coastal Wetland of La Arenilla.`
            : language === 'pt'
              ? `A imagem provavelmente corresponde a ${topPrediction!.label}. Esta espécie não está registrada no Pantanal Costeiro de La Arenilla.`
              : `La imagen corresponde probablemente a un ${topPrediction!.label}. Esta especie no está registrada en el Humedal Costero Poza de La Arenilla.`;

    return {
      status,
      topPrediction,
      predictions,
      matchedEspecie,
      message,
    };
  } catch (error) {
    console.error('Error durante la clasificación de la imagen en TensorFlow.js:', error);
    return null;
  } finally {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }
}
