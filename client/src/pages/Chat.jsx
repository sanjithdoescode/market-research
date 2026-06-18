import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Send, Bot, User, Sparkles, AlertCircle, History, MessageSquare, BookOpen, ChevronRight, X } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { sendChatMessage, sendGeneralChatMessage } from '../api/analysisApi.js';

// Markdown table + list parser
function parseMarkdownToHtml(text) {
  if (!text) return '';
  
  // Escape HTML to prevent XSS
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Inline code / badges: `text`
  html = html.replace(/`(.*?)`/g, '<code class="chat-badge">$1</code>');
  
  // Markdown Tables parser
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

  // Format bullet items: * item or - item
  html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');
  
  // Group consecutive <li> elements into <ul>
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  
  // Format paragraphs: double newlines (ignoring tables/lists)
  html = html.replace(/\n\n/g, '</p><p>');
  
  // Single newlines to line breaks (unless adjacent to lists or tables)
  html = html.replace(/\n(?!<\/?ul>|<\/?li>|<\/?div>|<\/?table>|<\/?thead>|<\/?tbody>|<\/?tr>)/g, '<br />');
  
  return `<p>${html}</p>`;
}

// Visual Chart parser and renderer
function VisualChart({ content }) {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const data = lines.map(line => {
    const segments = line.split('|').map(s => s.trim());
    const label = segments[0] || '';
    const val = parseFloat(segments[1]) || 0;
    const color = segments[2] || 'green';
    return { label, val, color };
  });

  const maxVal = Math.max(...data.map(d => d.val), 100);

  return (
    <div className="chat-visual-chart">
      {data.map((item, idx) => {
        const percentage = Math.min((item.val / maxVal) * 100, 100);
        let barColor = 'var(--accent)';
        if (item.color === 'blue') barColor = 'var(--blue)';
        else if (item.color === 'red') barColor = 'var(--red)';
        else if (item.color === 'amber') barColor = 'var(--amber)';
        else if (item.color === 'teal') barColor = 'var(--teal)';
        else if (item.color === 'orange') barColor = 'var(--orange)';
        else if (item.color === 'purple') barColor = 'var(--purple)';

        return (
          <div key={idx} className="chart-bar-row">
            <span className="chart-bar-label">{item.label}</span>
            <div className="chart-bar-wrapper">
              <div 
                className="chart-bar-fill" 
                style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: barColor,
                  boxShadow: `0 0 8px ${barColor}50`
                }} 
              />
              <span className="chart-bar-value">{item.val}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Renders the message content by splitting out chart blocks
function MessageContent({ text }) {
  if (!text) return null;

  const parts = [];
  const regex = /```chart([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }

    parts.push({
      type: 'chart',
      content: match[1]
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }

  return (
    <div className="message-content-wrapper">
      {parts.map((part, index) => {
        if (part.type === 'chart') {
          return <VisualChart key={index} content={part.content} />;
        }
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHtml(part.content)
            }}
          />
        );
      })}
    </div>
  );
}

function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const analysisId = searchParams.get('analysisId');

  const { state, loadHistory, loadAnalysis } = useAnalysis();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    loadHistory().catch(() => undefined);
  }, [loadHistory]);

  // Load report context if ID is specified
  useEffect(() => {
    if (analysisId) {
      setLoading(true);
      setError(null);
      loadAnalysis(analysisId)
        .then((doc) => {
          const businessType = doc?.input?.businessType || 'business';
          const locationName = doc?.input?.location || 'the location';
          setMessages([
            {
              role: 'assistant',
              content: `Hello! I have loaded the context of the report for the proposed **${businessType}** at **${locationName}**.\n\nAsk me anything about local competitors, demand signals, pricing structure, or strategic opportunities. Let's look at the data!`
            }
          ]);
        })
        .catch((err) => {
          setError(`Failed to load report context: ${err.message}`);
          setSearchParams({}); // reset to general mode
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // General Mode
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I am your AI Market Analyst assistant. How can I help you evaluate location ideas, analyze general market demand, or brainstorm startups today?'
        }
      ]);
      setError(null);
    }
  }, [analysisId, loadAnalysis, setSearchParams]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    if (!textToSend) {
      setInputValue('');
    }

    setError(null);
    setLoading(true);

    const userMessage = {
      role: 'user',
      content: text
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const apiMessages = updatedMessages
        .slice(1) // Skip initial assistant greeting
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      let response;
      if (analysisId) {
        // Contextual chat
        response = await sendChatMessage(analysisId, apiMessages);
      } else {
        // General chat
        response = await sendGeneralChatMessage(apiMessages);
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.message
        }
      ]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to communicate with AI server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setSearchParams({});
  };

  const loadContext = (id) => {
    setSearchParams({ analysisId: id });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Default empty state suggestions
  const contextualSuggestions = [
    { title: 'Evaluate Threat', desc: 'Who is the most threatening competitor here?', prompt: 'Who is the most threatening competitor here and what are their strengths?' },
    { title: 'Compare Pricing', desc: 'Show pricing ranges and budget gaps.', prompt: 'Can you show me a comparison table and chart of competitor pricing and point out the sweet spot?' },
    { title: 'Positioning Tips', desc: 'Suggest positioning tactics to stand out.', prompt: 'Suggest strategic positioning tactics and key angles to stand out in this location.' },
    { title: 'Overall Health', desc: 'Is the opportunity score realistic?', prompt: 'Explain the opportunity score here. Do you think this concept has a realistic chance of success?' }
  ];

  const generalSuggestions = [
    { title: 'Austin Cafe', desc: 'Startup margins and competitor gaps in Austin.', prompt: 'What shop/startup can I start in Austin to maximize profits? Show me startup margin estimates in a table.' },
    { title: 'Location Choice', desc: 'Best locations for a fitness studio.', prompt: 'Compare Austin, Denver, and Seattle for opening a new boutique fitness studio. Format details in a table.' },
    { title: 'Standout Factors', desc: 'How to beat local restaurant saturation.', prompt: 'What strategies can a new restaurant use to survive in a highly saturated local market?' },
    { title: 'Demand Trends', desc: 'High demand startup niches in 2026.', prompt: 'What are some high-demand startup niches in growing metro locations? Give a chart of estimated demand levels.' }
  ];

  const suggestions = analysisId ? contextualSuggestions : generalSuggestions;
  const currentContext = state.currentAnalysis;

  return (
    <div className="chat-layout" aria-label="AI Chat Workspace">
      {/* Left Sidebar */}
      <aside className="chat-sidebar">
        <button className="new-chat-button" onClick={startNewChat}>
          <Plus size={16} />
          <span>New Chat (General)</span>
        </button>

        <div className="recent-analyses-section">
          <div className="sidebar-section-header">
            <History size={14} />
            <span>Recent Analyses</span>
          </div>

          <div className="sidebar-list">
            {state.history.length === 0 ? (
              <span className="sidebar-empty">No past analyses</span>
            ) : (
              state.history.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-item ${analysisId === item.id ? 'active' : ''}`}
                  onClick={() => loadContext(item.id)}
                >
                  <MessageSquare size={14} />
                  <div className="sidebar-item-text">
                    <span className="sidebar-item-title">{item.businessType}</span>
                    <span className="sidebar-item-desc">{item.location}</span>
                  </div>
                  <ChevronRight size={14} className="chevron" />
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Right Main Panel */}
      <main className="chat-main-pane">
        {/* Top workspace header bar */}
        <header className="chat-pane-header">
          <div className="chat-context-badge">
            <Sparkles size={16} className="pulse-icon" />
            <div className="badge-details">
              {analysisId && currentContext ? (
                <>
                  <span className="badge-mode">Context Mode</span>
                  <span className="badge-name">{currentContext.input.businessType} in {currentContext.input.location}</span>
                </>
              ) : (
                <>
                  <span className="badge-mode">General Strategist</span>
                  <span className="badge-name">Location & Business Strategy Chat</span>
                </>
              )}
            </div>
            {analysisId && (
              <button 
                className="clear-context-btn" 
                onClick={startNewChat}
                title="Clear Context (Switch to General Mode)"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </header>

        {/* Message area */}
        <div className="chat-messages-area">
          {/* Welcome/Empty state */}
          {messages.length <= 1 && (
            <div className="chat-empty-state">
              <Sparkles size={40} className="empty-sparkle" />
              <h2>How can I help you today?</h2>
              <p>Ask about competitor densities, pricing sweet spots, or brainstorm startup locations.</p>
              
              <div className="chat-suggestions-grid">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    className="chat-sug-card"
                    onClick={() => handleSend(sug.prompt)}
                  >
                    <h3>{sug.title}</h3>
                    <p>{sug.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* List of active messages */}
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message-row chat-message-row--${msg.role}`}>
              <div className="chat-message-avatar">
                {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className="chat-message-body">
                <div className="chat-message-bubble">
                  {msg.role === 'assistant' ? (
                    <MessageContent text={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="chat-message-row chat-message-row--assistant">
              <div className="chat-message-avatar">
                <Bot size={18} />
              </div>
              <div className="chat-message-body">
                <div className="chat-message-bubble chat-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-banner" style={{ margin: '16px 40px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Input */}
        <footer className="chat-input-pane">
          <div className="chat-input-wrapper">
            <form
              className="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <textarea
                ref={inputRef}
                className="chat-prompt-textarea"
                placeholder={analysisId ? "Ask about this analysis report..." : "Ask general location, startup, or market questions..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Prompt text input"
              />
              <button
                type="submit"
                className="chat-prompt-send-btn"
                disabled={!inputValue.trim() || loading}
                aria-label="Submit query"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
          <span className="chat-disclaimer">
            MarketSite AI may generate inaccurate insights. Consider cross-referencing competitor details.
          </span>
        </footer>
      </main>
    </div>
  );
}

export default Chat;
