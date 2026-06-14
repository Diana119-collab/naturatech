import type { Destino } from '../types';

interface RespuestaIA {
  keywords: string[];
  respuesta: { es: string; en: string; pt: string };
}

const RESPUESTAS: RespuestaIA[] = [
  {
    keywords: ['garza', 'blanc', 'egret', 'garça', 'pajaro alto'],
    respuesta: {
      es: 'Probablemente es una garza blanca. Busca en zonas de agua poco profunda del humedal. Permanece muy quieta antes de capturar su presa.',
      en: 'It is probably a great egret. Look in shallow water areas of the wetland. It stays very still before catching its prey.',
      pt: 'Provavelmente é uma garça-branca. Procure em zonas de água rasa do pantanal. Permanece muito quieta antes de capturar a presa.',
    },
  },
  {
    keywords: ['pelícan', 'pelican', 'pico grande', 'beak', 'bolsa gular', 'gular pouch', 'pelicano'],
    respuesta: {
      es: 'Suena como un pelícano peruano. Es endémico del Pacífico sur. Observa su gran pico y bolsa gular en la orilla.',
      en: 'Sounds like a Peruvian pelican. It is endemic to the South Pacific. Watch for its large beak and gular pouch on the shore.',
      pt: 'Parece um pelicano peruano. É endêmico do Pacífico sul. Observe seu grande bico e bolsa gular na orla.',
    },
  },
  {
    keywords: ['ruta', 'camino', 'route', 'path', 'caminho', 'trilha'],
    respuesta: {
      es: 'Te recomiendo comenzar por el Humedal 🌿, luego la Orilla 🌊 y finalmente el Mirador 🔭. Descubre especies en cada zona para desbloquear la siguiente.',
      en: 'I recommend starting at the Wetland 🌿, then the Shore 🌊 and finally the Viewpoint 🔭. Discover species in each zone to unlock the next.',
      pt: 'Recomendo começar pelo Pantanal 🌿, depois a Orla 🌊 e finalmente o Mirante 🔭. Descubra espécies em cada zona para desbloquear a próxima.',
    },
  },
  {
    keywords: ['recomend', 'suggest', 'consejo', 'tip', 'dica', 'observación', 'observation', 'observação'],
    respuesta: {
      es: 'Visita temprano en la mañana cuando las aves son más activas. Lleva binoculares y mantén silencio para no perturbar la fauna.',
      en: 'Visit early in the morning when birds are most active. Bring binoculars and stay quiet to avoid disturbing wildlife.',
      pt: 'Visite cedo pela manhã quando as aves estão mais ativas. Leve binóculos e mantenha silêncio para não perturbar a fauna.',
    },
  },
  {
    keywords: ['ecolog', 'importanc', 'conserv', 'medio ambiente', 'environment', 'humedales', 'wetlands', 'pantanais'],
    respuesta: {
      es: 'Los humedales son filtros naturales del agua y refugio de especies migratorias. Protegerlos es esencial para la biodiversidad del Perú.',
      en: 'Wetlands are natural water filters and refuge for migratory species. Protecting them is essential for Peru\'s biodiversity.',
      pt: 'Os pantanais são filtros naturais da água e refúgio de espécies migratórias. Protegê-los é essencial para a biodiversidade do Peru.',
    },
  },
];

const FALLBACK = {
  es: 'Interesante observación. Explora el mapa del destino, identifica especies y desbloquea nuevas zonas. ¿Puedes darme más detalles sobre lo que viste?',
  en: 'Interesting observation. Explore the destination map, identify species and unlock new zones. Can you give me more details about what you saw?',
  pt: 'Observação interessante. Explore o mapa do destino, identifique espécies e desbloqueie novas zonas. Pode me dar mais detalhes sobre o que viu?',
};

export async function askNaturaAI(
  message: string,
  lang: string,
  destino?: Destino
): Promise<string> {
  await new Promise((r) => setTimeout(r, 800));

  const lower = message.toLowerCase();

  for (const r of RESPUESTAS) {
    if (r.keywords.some((k) => lower.includes(k))) {
      if (lang === 'en') return r.respuesta.en;
      if (lang === 'pt') return r.respuesta.pt;
      return r.respuesta.es;
    }
  }

  if (destino) {
    const destinoMsg = {
      es: `Estás explorando ${destino.nombre.es}. Hay ${destino.especies.length} especies por descubrir. Usa el identificador de especies para avanzar.`,
      en: `You are exploring ${destino.nombre.en}. There are ${destino.especies.length} species to discover. Use the species identifier to progress.`,
      pt: `Você está explorando ${destino.nombre.pt}. Há ${destino.especies.length} espécies para descobrir. Use o identificador de espécies para avançar.`,
    };
    if (lang === 'en') return destinoMsg.en;
    if (lang === 'pt') return destinoMsg.pt;
    return destinoMsg.es;
  }

  if (lang === 'en') return FALLBACK.en;
  if (lang === 'pt') return FALLBACK.pt;
  return FALLBACK.es;
}

export const SUGERENCIAS = {
  es: [
    'Vi un pajaro de cuello alto y plumaje blanco',
    '¿Qué ruta me recomiendas?',
    '¿Por qué son importantes los humedales?',
  ],
  en: [
    'I saw a small bird with bright colors',
    'What route do you recommend?',
    'Why are wetlands important?',
  ],
  pt: [
    'Vi um pássaro pequeno com cores brilhantes',
    'Qual rota você recomenda?',
    'Por que os pantanais são importantes?',
  ],
};
