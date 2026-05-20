import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { api } from './api';

type Msg = { id: number; from: 'ai' | 'user'; text: string };

const initial: Msg[] = [
  {
    id: 1,
    from: 'ai',
    text: 'Hi Shlomi — ask me to write a luxury listing, draft an Instagram caption, summarize revenue, or find unpaid galleries.',
  },
];

const suggestions = [
  'Write a luxury listing description',
  'Generate an Instagram caption',
  'Show top paying clients',
  'Summarize monthly revenue',
  'Find all unpaid galleries',
];

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    setMessages((p) => [...p, { id: Date.now(), from: 'user', text }]);
    setInput('');
    setBusy(true);
    try {
      const { reply } = await api.ai.ask(text);
      setMessages((p) => [...p, { id: Date.now() + 1, from: 'ai', text: reply }]);
    } catch (e: any) {
      setMessages((p) => [
        ...p,
        { id: Date.now() + 1, from: 'ai', text: `Sorry — ${e.message || 'request failed'}.` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        className="chatToggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle AI assistant"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="chatPanel"
          >
            <div className="chatHead">
              <Sparkles size={18} color="#c4a766" />
              <h4>AI Assistant</h4>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(245,243,239,0.5)' }}>
                Gemini
              </span>
            </div>
            <div className="chatBody">
              {messages.map((m) => (
                <div key={m.id} className={`msg ${m.from === 'ai' ? 'msgAi' : 'msgUser'}`}>
                  {m.text}
                </div>
              ))}
              {busy && (
                <div className="msg msgAi">
                  <Loader2 size={14} /> Thinking…
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {suggestions.map((s) => (
                  <button key={s} className="chip" onClick={() => send(s)} disabled={busy}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <form
              className="chatInput"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                placeholder="Ask the assistant…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={busy}
              />
              <button
                type="submit"
                className="btn"
                style={{ padding: '10px 12px' }}
                disabled={busy}
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
