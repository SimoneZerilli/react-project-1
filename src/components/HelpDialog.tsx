import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './HelpDialog.css';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isReducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({
  isOpen,
  onClose,
  isReducedMotion = false,
  onToggleReducedMotion,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'commands' | 'accessibility'>('commands');
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
            {language === 'en' ? '[ Codex & Accessibility ]' : '[ Archivio & Accessibilità ]'}
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

        {/* Tab di navigazione interna */}
        <div className="help-tabs" role="tablist" aria-label="Sezioni del registro">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'commands'}
            aria-controls="panel-commands"
            id="tab-commands"
            className={`pixel-btn help-tab-btn ${activeTab === 'commands' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('commands')}
          >
            [ {t.helpTabCommands} ]
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'accessibility'}
            aria-controls="panel-accessibility"
            id="tab-accessibility"
            className={`pixel-btn help-tab-btn ${activeTab === 'accessibility' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('accessibility')}
          >
            [ {t.helpTabAccessibility} ]
          </button>
        </div>

        {/* Tab 1: Comandi da tastiera */}
        {activeTab === 'commands' && (
          <div id="panel-commands" role="tabpanel" aria-labelledby="tab-commands">
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
                  <td><kbd className="pixel-key">R</kbd></td>
                  <td>
                    <strong>{language === 'en' ? 'Sort by Rank' : 'Ordina per Valore'}</strong>:{' '}
                    {language === 'en' ? 'Sort hand by rank descending' : 'Ordina la mano per valore decrescente'}
                  </td>
                </tr>
                <tr>
                  <td><kbd className="pixel-key">S</kbd></td>
                  <td>
                    <strong>{language === 'en' ? 'Sort by Suit' : 'Ordina per Seme'}</strong>:{' '}
                    {language === 'en' ? 'Sort hand by suit' : 'Ordina la mano per seme'}
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
          </div>
        )}

        {/* Tab 2: Accessibilità & Dichiarazione EAA / WCAG */}
        {activeTab === 'accessibility' && (
          <div id="panel-accessibility" role="tabpanel" aria-labelledby="tab-accessibility" className="accessibility-statement-panel">
            {/* Controllo In-App Animazioni Ridotte */}
            <div className="reduced-motion-control pixel-panel">
              <div className="reduced-motion-info">
                <span className="control-label">[ {t.reducedMotionToggleLabel} ]</span>
                <p className="control-desc">{t.reducedMotionHint}</p>
              </div>
              {onToggleReducedMotion && (
                <button
                  type="button"
                  className={`pixel-btn ${isReducedMotion ? 'pixel-btn-blood is-active' : ''}`}
                  onClick={onToggleReducedMotion}
                  aria-pressed={isReducedMotion}
                  aria-label={`${t.reducedMotionToggleLabel}: ${isReducedMotion ? t.reducedMotionStatusOn : t.reducedMotionStatusOff}`}
                >
                  [ {isReducedMotion ? t.reducedMotionStatusOn : t.reducedMotionStatusOff} ]
                </button>
              )}
            </div>

            <p className="accessibility-compliance-text">
              {t.accessibilityCompliance}
            </p>

            <h3 className="accessibility-subhead">[ {t.accessibilityFeaturesTitle} ]</h3>
            <ul className="accessibility-feature-list">
              {t.accessibilityFeatures.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>

            <div className="accessibility-contact-box">
              <span className="contact-title">[ {t.accessibilityContactTitle} ]</span>
              <p className="contact-text">{t.accessibilityContactText}</p>
            </div>
          </div>
        )}

        <div className="help-dialog-footer">
          <span className="help-tip">
            {language === 'en'
              ? 'WCAG 2.2 AA & EAA: Keyboard focus is never lost and always clearly visible.'
              : 'WCAG 2.2 AA & EAA: Il focus non viene mai perso e rimane sempre visibile.'}
          </span>
        </div>
      </div>
    </div>
  );
};
