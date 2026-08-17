import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App.jsx';
import { ThemeProvider } from './app/providers/ThemeProvider.jsx';
import { SupabaseProvider } from './app/providers/SupabaseProvider.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SupabaseProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </SupabaseProvider>
    </BrowserRouter>
  </React.StrictMode>
);
