import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus, Send, Bot, User, Sparkles, AlertCircle, History,
  MessageSquare, ChevronRight, X, Mic, MicOff, StopCircle
} from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { sendChatMessage, sendGeneralChatMessage } from '../api/analysisApi.js';

/* ── Markdown parser ────────────────────────────────────────── */
function parseMarkdownToHtml(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>');

  // Bold & italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`(.*?)`/g, '<code class="chat-badge">$1</code>');

  // Markdown tables
  const tableRegex = /\|([^\n]*)\|(\s*\n\s*\|[ :-]*\|[^\n]*\n)([\s\S]*?)(?=\n\n|\n[^\s|]|$)/g;
  html = html.replace(tableRegex, (match, headerLine, alignLine, bodyContent) => {
    const headers = headerLine.split('|').map(h => h.trim()).slice(1, -1);
    const rows = bodyContent.split('\n')
      .map(r => r.trim())
      .filter(r => r.startsWith('|'))
      .map(row => row.split('|').map(c => c.trim()).slice(1, -1));
    const headerHtml = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    const bodyHtml = rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
    return `<div class="chat-table-wrapper"><table class="chat-table"><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table></div>`;
  });

  // Lists
  html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n(?!<\/?ul>|<\/?li>|<\/?div>|<\/?table>|<\/?thead>|<\/?tbody>|<\/?tr>|<h[1-3])/g, '<br />');

  return `<p>${html}</p>`;
}

/* ── Visual Chart ───────────────────────────────────────────── */
function VisualChart({ content }) {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const data = lines.map(line => {
    const segments = line.split('|').map(s => s.trim());
    return { label: segments[0] || '', val: parseFloat(segments[1]) || 0, color: segments[2] || 'green' };
  });
  const maxVal = Math.max(...data.map(d => d.val), 100);

  const colorMap = {
    green: 'var(--accent)', blue: 'var(--blue)', red: 'var(--red)',
    amber: 'var(--amber)', teal: 'var(--teal)', orange: 'var(--orange)', purple: 'var(--purple)'
  };

  return (
    <div className="chat-visual-chart">
      {data.map((item, idx) => {
        const pct = Math.min((item.val / maxVal) * 100, 100);
        const barColor = colorMap[item.color] || 'var(--accent)';
        return (
          <div key={idx} className="chart-bar-row">
            <span className="chart-bar-label">{item.label}</span>
            <div className="chart-bar-wrapper">
              <div className="chart-bar-fill" style={{ width: `${pct}%`, backgroundColor: barColor, boxShadow: `0 0 8px ${barColor}50` }} />
              <span className="chart-bar-value">{item.val}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Message Content ─────────────────────────────────────────── */
function MessageContent({ text }) {
  if (!text) return null;
  const parts = [];
  const regex = /```chart([\s\S]*?)```/g;
  let lastIndex = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    parts.push({ type: 'chart', content: match[1] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push({ type: 'text', content: text.substring(lastIndex) });

  return (
    <div className="message-content-wrapper">
      {parts.map((part, i) =>
        part.type === 'chart'
          ? <VisualChart key={i} content={part.content} />
          : <div key={i} dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(part.content) }} />
      )}
    </div>
  );
}

/* ── Typing dots ─────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="chat-typing-indicator">
      <div className="typing-avatar">
        <Sparkles size={14} />
      </div>
      <div className="typing-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}

/* ── Voice Button ────────────────────────────────────────────── */
function VoiceButton({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const supported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const start = useCallback(() => {
    if (!supported || listening) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onTranscript(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
  }, [supported, listening, onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  if (!supported) return null;

  return (
    <button
      type="button"
      className={`voice-btn ${listening ? 'voice-btn--active' : ''}`}
      onClick={listening ? stop : start}
      disabled={disabled}
      aria-label={listening ? 'Stop voice input' : 'Start voice input'}
      title={listening ? 'Stop recording' : 'Speak your prompt'}
    >
      {listening ? <MicOff size={16} /> : <Mic size={16} />}
      {listening && <span className="voice-ripple" />}
    </button>
  );
}

/* ── Chat Input ──────────────────────────────────────────────── */
function ChatInput({ onSend, loading, placeholder }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [value]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const text = value.trim();
    if (!text || loading) return;
    onSend(text);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setValue(prev => prev ? `${prev} ${transcript}` : transcript);
    textareaRef.current?.focus();
  };

  const canSend = value.trim().length > 0 && !loading;

  return (
    <div className={`chat-input-container ${value ? 'has-text' : ''}`}>
      <form className="chat-input-box" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={1}
          aria-label="Prompt input"
        />
        <div className="chat-input-actions">
          <VoiceButton onTranscript={handleVoiceTranscript} disabled={loading} />
          <button
            type="submit"
            className={`send-btn ${canSend ? 'send-btn--active' : ''}`}
            disabled={!canSend}
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Main Chat Component ─────────────────────────────────────── */
function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const analysisId = searchParams.get('analysisId');

  const { state, loadHistory, loadAnalysis } = useAnalysis();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    loadHistory().catch(() => undefined);
  }, [loadHistory]);

  // Load report context
  useEffect(() => {
    if (analysisId) {
      setLoading(true);
      setError(null);
      loadAnalysis(analysisId)
        .then((doc) => {
          const businessType = doc?.input?.businessType || 'business';
          const locationName = doc?.input?.location || 'the location';
          setMessages([{
            role: 'assistant',
            content: `Hello! I've loaded the report for **${businessType}** at **${locationName}**.\n\nAsk me anything about competitors, demand signals, pricing, or strategic opportunities.`
          }]);
        })
        .catch((err) => {
          setError(`Failed to load report context: ${err.message}`);
          setSearchParams({});
        })
        .finally(() => setLoading(false));
    } else {
      setMessages([{
        role: 'assistant',
        content: 'Hello! I am your AI Market Analyst assistant. How can I help you evaluate location ideas, analyze general market demand, or brainstorm startups today?'
      }]);
      setError(null);
    }
  }, [analysisId, loadAnalysis, setSearchParams]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text) => {
    if (!text || loading) return;
    setError(null);
    setLoading(true);

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const apiMessages = updatedMessages.slice(1).map(msg => ({ role: msg.role, content: msg.content }));
      const response = analysisId
        ? await sendChatMessage(analysisId, apiMessages)
        : await sendGeneralChatMessage(apiMessages);

      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to reach AI server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => setSearchParams({});
  const loadContext = (id) => setSearchParams({ analysisId: id });

  const isEmptyState = messages.length <= 1 && !loading;

  const generalSuggestions = [
    { title: 'Austin Cafe', desc: 'Startup margins and competitor gaps in Austin.', prompt: 'What shop/startup can I start in Austin to maximize profits? Show me startup margin estimates in a table.' },
    { title: 'Location Choice', desc: 'Best locations for a fitness studio.', prompt: 'Compare Austin, Denver, and Seattle for opening a new boutique fitness studio. Format details in a table.' },
    { title: 'Standout Factors', desc: 'How to beat local restaurant saturation.', prompt: 'What strategies can a new restaurant use to survive in a highly saturated local market?' },
    { title: 'Demand Trends', desc: 'High demand startup niches in 2026.', prompt: 'What are some high-demand startup niches in growing metro locations? Give a chart of estimated demand levels.' }
  ];

  const contextualSuggestions = [
    { title: 'Evaluate Threat', desc: 'Who is the most threatening competitor?', prompt: 'Who is the most threatening competitor here and what are their strengths?' },
    { title: 'Compare Pricing', desc: 'Show pricing ranges and budget gaps.', prompt: 'Can you show me a comparison table and chart of competitor pricing and the sweet spot?' },
    { title: 'Positioning Tips', desc: 'Suggest positioning tactics to stand out.', prompt: 'Suggest strategic positioning tactics and key angles to stand out in this location.' },
    { title: 'Overall Health', desc: 'Is the opportunity score realistic?', prompt: 'Explain the opportunity score here. Do you think this concept has a realistic chance of success?' }
  ];

  const suggestions = analysisId ? contextualSuggestions : generalSuggestions;
  const currentContext = state.currentAnalysis;
  const placeholder = analysisId ? 'Ask about this analysis report…' : 'Ask about locations, startups, or market trends…';

  return (
    <div className="chat-shell" aria-label="AI Chat Workspace">
      {/* ── Sidebar ── */}
      <aside className="chat-sidebar-v2">
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={startNewChat}>
            <Plus size={15} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">
            <History size={12} />
            Recent Analyses
          </p>
          <div className="sidebar-items">
            {state.history.length === 0 ? (
              <span className="sidebar-empty-msg">No analyses yet</span>
            ) : (
              state.history.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-item-v2 ${analysisId === item.id ? 'is-active' : ''}`}
                  onClick={() => loadContext(item.id)}
                >
                  <MessageSquare size={13} className="sidebar-icon" />
                  <div className="sidebar-item-text-v2">
                    <span className="item-title">{item.businessType}</span>
                    <span className="item-loc">{item.location}</span>
                  </div>
                  <ChevronRight size={12} className="item-chevron" />
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <main className="chat-main-v2">
        {/* Context badge in header */}
        <header className="chat-header-v2">
          <div className="context-pill">
            <Sparkles size={13} className="context-sparkle" />
            <div className="context-text">
              {analysisId && currentContext ? (
                <>
                  <span className="context-mode">Context Mode</span>
                  <span className="context-name">{currentContext.input.businessType} · {currentContext.input.location}</span>
                </>
              ) : (
                <>
                  <span className="context-mode">General Strategist</span>
                  <span className="context-name">Location &amp; Business Strategy Chat</span>
                </>
              )}
            </div>
            {analysisId && (
              <button className="context-clear-btn" onClick={startNewChat} title="Clear context">
                <X size={12} />
              </button>
            )}
          </div>
        </header>

        {/* Messages area */}
        <div className="chat-messages-v2" ref={messagesAreaRef}>
          {/* Empty / Welcome state */}
          {isEmptyState && (
            <div className="welcome-state">
              <div className="welcome-orb">
                <Sparkles size={28} />
              </div>
              <h2 className="welcome-heading">How can I help you today?</h2>
              <p className="welcome-sub">Ask about competitor densities, pricing sweet spots, or brainstorm startup locations.</p>
              <div className="suggestions-grid">
                {suggestions.map((s, i) => (
                  <button key={i} className="suggestion-card" onClick={() => handleSend(s.prompt)}>
                    <span className="sug-title">{s.title}</span>
                    <span className="sug-desc">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`msg-row msg-row--${msg.role}`}
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              {msg.role === 'assistant' ? (
                <div className="msg-avatar msg-avatar--ai">
                  <Sparkles size={14} />
                </div>
              ) : (
                <div className="msg-avatar msg-avatar--user">
                  <User size={14} />
                </div>
              )}
              <div className="msg-bubble">
                {msg.role === 'assistant'
                  ? <MessageContent text={msg.content} />
                  : <span className="user-text">{msg.content}</span>
                }
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && <TypingIndicator />}

          {/* Error */}
          {error && (
            <div className="chat-error-banner">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <footer className="chat-footer-v2">
          <ChatInput onSend={handleSend} loading={loading} placeholder={placeholder} />
          <p className="chat-disclaimer-v2">
            MarketSite AI may generate inaccurate insights. Cross-reference competitor details independently.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default Chat;
