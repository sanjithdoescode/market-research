import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { AnalysisProvider } from './context/AnalysisContext.jsx';
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AnalysisProvider>
          <App />
          <Analytics />
        </AnalysisProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
