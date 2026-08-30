import { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types/index.js';
import { getChatHistory, clearChatHistory, sendChatMessage, getSessions } from '../services/api.js';
import { Trash2, RadioTower, User, Bot, AlertTriangle, Loader2, Send, Plus, MessageSquare } from 'lucide-react';

const QUICK_PROMPTS = [
  '¿Qué antenas tengo para un enlace de 5 km?',
  'Voy a instalar a un cliente, ¿qué necesito?',
  '¿Cuáles productos tienen stock bajo?',
  'Arma un kit para enlace PtP de 10 km con presupuesto',
  '¿Qué router recomiendas para un cliente residencial?',
];

const AI_MODELS = [
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (OpenAI)' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Anthropic)' },
  { id: 'zhipuai/glm-4', name: 'GLM-4 (ZhipuAI)' },
  { id: 'moonshotai/moonlight-16b-a3b-instruct', name: 'Kimi (Moonshot)' },
];

export function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [currentSession, setCurrentSession] = useState('default');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    loadHistory(currentSession);
  }, [currentSession]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function loadSessions() {
    try {
      const res = await getSessions();
      let s = res.data;
      if (!s.includes('default')) s = ['default', ...s];
      setSessions(s);
    } catch {
      setSessions(['default']);
    }
  }

  async function loadHistory(sessionId: string) {
    try {
      const res = await getChatHistory(sessionId);
      setMessages(res.data);
    } catch {
      setMessages([]);
    }
  }

  function handleNewSession() {
    const newSession = `chat_${Date.now()}`;
    setSessions([...sessions, newSession]);
    setCurrentSession(newSession);
  }

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || isStreaming) return;

    setInput('');
    setError('');
    setIsStreaming(true);

    const userMsg: ChatMessage = { role: 'user', content: msg };
    setMessages((prev) => [...prev, userMsg]);

    const assistantMsg: ChatMessage = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantMsg]);

    await sendChatMessage(
      msg,
      currentSession,
      selectedModel,
      (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: last.content + chunk };
          }
          return updated;
        });
      },
      () => {
        setIsStreaming(false);
        if (!sessions.includes(currentSession)) {
          loadSessions();
        }
      },
      (errMsg) => {
        setError(errMsg);
        setIsStreaming(false);
      },
    );
  }

  async function handleClear() {
    try {
      await clearChatHistory(currentSession);
      setMessages([]);
    } catch {
      setError('Error al limpiar historial');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const showWelcome = messages.length === 0 && !isStreaming;

  return (
    <div className="chat-page" style={{ display: 'flex', flexDirection: 'row', gap: '20px', height: '100%' }}>
      {/* Sidebar for sessions */}
      <div className="chat-sidebar" style={{ width: '250px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '10px' }}>
        <button className="btn btn--primary" onClick={handleNewSession} style={{ width: '100%', justifyContent: 'center' }}>
          <Plus size={16} /> Nuevo Chat
        </button>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {sessions.map(s => (
            <button
              key={s}
              className={`btn ${s === currentSession ? 'btn--secondary' : 'btn--ghost'}`}
              onClick={() => setCurrentSession(s)}
              style={{ justifyContent: 'flex-start', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              <MessageSquare size={16} /> {s === 'default' ? 'Chat Principal' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="page-header" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">Asistente técnico</span>
            <h1>Chat IA + Stock</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="model-selector"
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
            >
              {AI_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            {messages.length > 0 && (
              <button className="btn btn--ghost" onClick={handleClear} disabled={isStreaming}>
                <Trash2 size={16} /> Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="chat-container" ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
          {showWelcome && (
            <div className="chat-welcome">
              <div className="chat-welcome__icon"><RadioTower size={48} color="var(--accent)" /></div>
              <h2>Asistente TiendaWisp</h2>
              <p>
                Pregúntame sobre tu inventario, qué equipos necesitas para un enlace,
                o qué instalar a un cliente. Consulto el stock real antes de responder.
              </p>
              <div className="quick-prompts">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className="quick-prompt-btn"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble chat-bubble--${msg.role}`}>
              <div className="chat-bubble__avatar">
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="chat-bubble__content">
                {msg.content || (isStreaming && i === messages.length - 1 ? (
                  <span className="typing-indicator">
                    <span /><span /><span />
                  </span>
                ) : '')}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="chat-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <form
          className="chat-input-bar"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: Necesito hacer un enlace de 5 km con línea de vista..."
            rows={1}
            disabled={isStreaming}
          />
          <button type="submit" disabled={!input.trim() || isStreaming} className="btn btn--primary">
            {isStreaming ? <Loader2 size={16} className="spinner" /> : <Send size={16} />} Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
