import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './HelpDialog.css';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === 'Tab' && dialogRef.current) {
          const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="help-dialog-overlay" onClick={onClose} role="presentation">
      <div
        className="help-dialog-content pixel-panel pixel-panel-blood blood-drip-edge"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="help-dialog-header">
          <h2 id="help-title" className="help-title">
            {language === 'en' ? '[ COMMAND ARCHIVE ]' : '[ ARCHIVIO DEI COMANDI ]'}
          </h2>
          <button
            ref={closeButtonRef}
            className="pixel-btn pixel-btn-blood"
            onClick={onClose}
            aria-label={t.close}
          >
            {t.close}
          </button>
        </div>

        <p className="help-description">
          {language === 'en'
            ? 'Balcard is fully playable and accessible using keyboard only:'
            : 'Balcard è interamente navigabile e giocabile da tastiera senza ricorrere al mouse:'}
        </p>

        <table className="help-table" aria-label={t.commands}>
          <thead>
            <tr>
              <th scope="col">{language === 'en' ? 'Key' : 'Tasto'}</th>
              <th scope="col">{language === 'en' ? 'Action' : 'Azione'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><kbd className="pixel-key">&lt;-</kbd> <kbd className="pixel-key">-&gt;</kbd></td>
              <td>
                {language === 'en'
                  ? 'Move card focus horizontally in hand'
                  : 'Scorri il focus tra le carte in mano'}
              </td>
            </tr>
            <tr>
              <td><kbd className="pixel-key">{language === 'en' ? 'Space' : 'Spazio'}</kbd></td>
              <td>
                {language === 'en'
                  ? 'Select or deselect focused card (up to 5)'
                  : 'Seleziona o deseleziona la carta (fino a 5 carte)'}
              </td>
            </tr>
            <tr>
              <td><kbd className="pixel-key">{language === 'en' ? 'Enter' : 'Invio'}</kbd></td>
              <td>
                <strong>Play Hand</strong>:{' '}
                {language === 'en' ? 'Score selected cards' : 'Gioca le carte selezionate'}
              </td>
            </tr>
            <tr>
              <td><kbd className="pixel-key">X</kbd></td>
              <td>
                <strong>Discard</strong>:{' '}
                {language === 'en' ? 'Discard selected cards' : 'Scarta le carte selezionate'}
              </td>
            </tr>
            <tr>
              <td><kbd className="pixel-key">Tab</kbd> / <kbd className="pixel-key">Shift+Tab</kbd></td>
              <td>
                {language === 'en'
                  ? 'Move focus between zones (Hand, Jokers, Shop)'
                  : 'Sposta il focus tra le aree (Mano, Jokers, Negozio)'}
              </td>
            </tr>
            <tr>
              <td><kbd className="pixel-key">?</kbd></td>
              <td>
                {language === 'en' ? 'Open this help register' : 'Apri questo registro dei comandi'}
              </td>
            </tr>
            <tr>
              <td><kbd className="pixel-key">Esc</kbd></td>
              <td>
                {language === 'en' ? 'Close dialogs and modals' : 'Chiudi pannelli e finestre modali'}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="help-dialog-footer">
          <span className="help-tip">
            {language === 'en'
              ? 'Rule: Keyboard focus is never lost and always clearly visible.'
              : 'Regola: Il focus non viene mai perso e rimane sempre visibile.'}
          </span>
        </div>
      </div>
    </div>
  );
};
