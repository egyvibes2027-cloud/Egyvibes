import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { askEgyptAiConcierge, type AiChatMessage } from '../services/aiConcierge';

interface AiConciergeProps {
  open: boolean;
  onToggle: (next: boolean) => void;
  onApplySuggestedPlan: (citySlugs: string[], landmarkIds?: string[]) => void;
}

export const AiConcierge: React.FC<AiConciergeProps> = ({
  open,
  onToggle,
  onApplySuggestedPlan,
}) => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hello! I am your EGYVIBES AI Egypt Concierge. Ask me about 2026 ticket prices, hidden gems in Siwa or Fayoum, partner hotels (3★–7★), authentic Egyptian food, or airport pickup!',
      suggestedPlan: {
        label: 'Build Classic Cairo + Luxor + Aswan Trip →',
        citySlugs: ['cairo-giza', 'luxor', 'aswan'],
        landmarkIds: ['giza-pyramids', 'grand-egyptian-museum', 'valley-of-kings'],
      },
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async (textOverride?: string) => {
    const q = (textOverride ?? input).trim();
    if (!q || loading) return;

    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: q,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!textOverride) setInput('');
    setLoading(true);

    const reply = await askEgyptAiConcierge(q, nextHistory);
    setMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: reply.text,
        suggestedPlan: reply.suggestedPlan,
      },
    ]);
    setLoading(false);
  };

  return (
    <>
      <button
        type="button"
        className="ai-fab"
        onClick={() => onToggle(!open)}
        aria-expanded={open}
        aria-label={t.aiConciergeBtn}
      >
        <Sparkles size={18} />
        <span>{t.aiConciergeBtn}</span>
      </button>

      {open && (
        <div className="ai-drawer" role="dialog" aria-label="EGYVIBES AI Egypt Concierge">
          <div
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={18} />
              <div>
                <div className="tl-title-sm" style={{ color: '#fff' }}>{t.aiConciergeBtn}</div>
                <div className="tl-body-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Smart Egypt Booking Assistant · API-Ready
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close AI Concierge"
              onClick={() => onToggle(false)}
              style={{ color: '#fff', padding: 4 }}
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              padding: 14,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-msg-bubble ${msg.role}`}>
                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                {msg.suggestedPlan && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggle(false);
                      onApplySuggestedPlan(
                        msg.suggestedPlan!.citySlugs,
                        msg.suggestedPlan!.landmarkIds
                      );
                    }}
                    style={{
                      marginTop: 8,
                      padding: '6px 12px',
                      borderRadius: 9999,
                      backgroundColor: 'var(--color-primary)',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 500,
                      display: 'inline-block',
                    }}
                  >
                    {msg.suggestedPlan.label}
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div className="ai-msg-bubble assistant" style={{ opacity: 0.7 }}>
                Checking 2026 Egypt rates &amp; availability...
              </div>
            )}
          </div>

          <div
            style={{
              padding: '8px 12px',
              borderTop: '1px solid var(--color-outline-variant)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              background: 'var(--color-surface-container-low)',
            }}
          >
            {['2026 Ticket prices', 'Hidden gems', '3★–7★ Hotels', 'USD payment'].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSend(chip)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 9999,
                  border: '1px solid var(--color-outline-variant)',
                  background: '#fff',
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: 10,
              borderTop: '1px solid var(--color-outline-variant)',
              display: 'flex',
              gap: 8,
              background: '#fff',
            }}
          >
            <input
              type="text"
              placeholder="Ask about Cairo, Luxor, Siwa, hotels..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 9999,
                padding: '8px 14px',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="tl-btn-primary"
              aria-label="Send message"
              style={{ width: 40, padding: 0 }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
