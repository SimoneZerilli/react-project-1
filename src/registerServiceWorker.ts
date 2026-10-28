/**
 * Registrazione e gestione del ciclo di vita del Service Worker PWA per Balcard.
 * Gestisce l'aggiornamento automatico della cache e la disponibilità offline.
 */
export function registerServiceWorker(): void {
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    import.meta.env.PROD
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Monitora l'arrivo di aggiornamenti post-deploy
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
              if (
                installingWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                console.info(
                  '[Balcard PWA] Nuova versione dell\'applicazione distribuita con successo.'
                );
              }
            };
          };
        })
        .catch((error) => {
          console.warn('[Balcard PWA] Registrazione Service Worker fallita:', error);
        });
    });
  }
}

