import { useEffect } from 'react';
import { History, MapPinned, Search, Zap, MessageSquare } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Support Ctrl + Cmd/Super (metaKey) OR Ctrl + Alt (altKey) for robust OS/browser compatibility
      const hasModifiers = e.ctrlKey && (e.metaKey || e.altKey);
      
      if (hasModifiers) {
        const key = e.key.toLowerCase();
        const code = e.code;

        if (code === 'KeyA' || key === 'a') {
          e.preventDefault();
          navigate('/');
        } else if (code === 'KeyH' || key === 'h') {
          e.preventDefault();
          navigate('/history');
        } else if (code === 'KeyB' || key === 'b') {
          e.preventDefault();
          navigate('/chat');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className={`app-shell ${isChatPage ? 'app-shell--chat' : ''}`}>
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NavLink to="/" className="brand" aria-label="MarketSite Analyst dashboard">
            <MapPinned size={22} aria-hidden="true" />
            <span>MarketSite Analyst</span>
          </NavLink>
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-link-title">
              <Search size={16} aria-hidden="true" />
              <span>Analyze</span>
            </span>
            <span className="nav-link-keybind" aria-label="shortcut: Command Control A">
              <kbd>⌘</kbd>
              <kbd>⌃</kbd>
              <kbd>A</kbd>
            </span>
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-link-title">
              <History size={16} aria-hidden="true" />
              <span>History</span>
            </span>
            <span className="nav-link-keybind" aria-label="shortcut: Command Control H">
              <kbd>⌘</kbd>
              <kbd>⌃</kbd>
              <kbd>H</kbd>
            </span>
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-link-title">
              <MessageSquare size={16} aria-hidden="true" />
              <span>AI Chat</span>
            </span>
            <span className="nav-link-keybind" aria-label="shortcut: Command Control B">
              <kbd>⌘</kbd>
              <kbd>⌃</kbd>
              <kbd>B</kbd>
            </span>
          </NavLink>
        </nav>
      </header>

      <main className="main-content">
        <AppRoutes />
      </main>

      <footer className="app-footer">
        <Zap size={12} aria-hidden="true" />
        <span>Powered by AI market intelligence</span>
      </footer>
    </div>
  );
}

export default App;
