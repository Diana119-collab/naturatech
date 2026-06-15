export function getTexto(traduccion: { es: string; en: string; pt: string }, lang: string): string {
  if (lang === 'en') return traduccion.en;
  if (lang === 'pt') return traduccion.pt;
  return traduccion.es;
}

export function getPublicAssetUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('/')) return `${import.meta.env.BASE_URL}${url.slice(1)}`;
  return url;
}

export function getPdfUrl(url?: string): string | undefined {
  if (!url) return undefined;
  
  // Agregar timestamp para evitar caché en desarrollo
  const separator = url.includes('?') ? '&' : '?';
  const timestamp = import.meta.env.DEV ? `v=${Date.now()}` : '';
  
  if (url.startsWith('/')) {
    const publicUrl = `${import.meta.env.BASE_URL}${url.slice(1)}`;
    return timestamp ? `${publicUrl}${separator}${timestamp}` : publicUrl;
  }
  
  // Para URLs externas (SharePoint, etc), no agregar timestamp
  return url;
}

export function generateExplorerId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `NT-${num}`;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDate(date: Date, lang: string): string {
  const locale = lang === 'en' ? 'en-US' : lang === 'pt' ? 'pt-BR' : 'es-PE';
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function speakText(text: string, lang: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'en' ? 'en-US' : lang === 'pt' ? 'pt-BR' : 'es-PE';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}
