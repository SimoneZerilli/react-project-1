import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/pixel-theme.css';
import { LanguageProvider } from './i18n/LanguageContext';
import { App } from './components/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
