import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { askNaturaAI, SUGERENCIAS } from '../services/naturaAiService';
import { getDestinoBySlug } from '../services/destinoService';
import type { ChatMessage, Destino } from '../types';
import { useProgress } from '../context/ProgressContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Button } from '../components/ui/Button';

export function GuiaIAPage() {
  const { t } = useTranslation('ia');
  const { i18n } = useTranslation();
  const lang = i18n.language as 'es' | 'en' | 'pt';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [destino, setDestino] = useState<Destino | undefined>();
  const { progress } = useProgress();
  const { speak } = useAccessibility();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'greeting',
        role: 'assistant',
        content: t('greeting'),
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [t]);

  useEffect(() => {
    if (progress?.destinoActivo) {
      getDestinoBySlug(progress.destinoActivo).then(setDestino);
    }
  }, [progress?.destinoActivo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    const response = await askNaturaAI(text, i18n.language, destino);
    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, assistantMsg]);
    speak(response, i18n.language);
    setLoading(false);
  };

  const sugerencias = SUGERENCIAS[lang] ?? SUGERENCIAS.es;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="avatar">
          <Bot size={20} />
        </div>
        <div>
          <h2>{t('title')}</h2>
          <p className="text-sm text-gray-600">{t('subtitle')}</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.role === 'user' ? 'user' : ''}`}>
            {msg.role !== 'user' && (
              <div className="message-avatar">
                <Bot size={18} className="text-emerald-600" />
              </div>
            )}
            <div className={`message-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <div className="message-meta">{new Date(msg.timestamp).toLocaleTimeString()}</div>
            </div>
            {msg.role === 'user' && (
              <div className="message-avatar">
                <div className="text-emerald-600">U</div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="message-row">
            <div className="message-avatar">...</div>
            <div className="message-bubble assistant">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="suggestion-row">
        {sugerencias.map((s) => (
          <div key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>
            <div className="chip">{s}</div>
          </div>
        ))}
      </div>

      <div className="chat-input-bar">
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')}
            aria-label={t('placeholder')}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(input); } }}
          />
        </div>
        <Button type="button" onClick={() => sendMessage(input)} className="!px-4 !py-3">
          <Send />
        </Button>
      </div>
    </div>
  );
}
