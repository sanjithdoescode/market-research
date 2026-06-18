import { History, MapPinned, Search, Zap, MessageSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="window-dots" aria-hidden="true">
            <span className="window-dot window-dot--close" />
            <span className="window-dot window-dot--minimize" />
            <span className="window-dot window-dot--maximize" />
          </div>

          <NavLink to="/" className="brand" aria-label="MarketSite Analyst dashboard">
            <MapPinned size={22} aria-hidden="true" />
            <span>MarketSite Analyst</span>
          </NavLink>
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Search size={16} aria-hidden="true" />
            <span>Analyze</span>
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <History size={16} aria-hidden="true" />
            <span>History</span>
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <MessageSquare size={16} aria-hidden="true" />
            <span>AI Chat</span>
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
