import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/pixel-theme.css';
import { LanguageProvider } from './i18n/LanguageContext';
import { App } from './components/App';
import { registerServiceWorker } from './registerServiceWorker';

// Cattura immediata dell'evento di installazione PWA per evitare che vada perso prima del render
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    (window as unknown as { deferredInstallPrompt?: Event }).deferredInstallPrompt = e;
  });
}

registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

