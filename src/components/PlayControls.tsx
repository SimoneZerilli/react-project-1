import React from 'react';
import type { ScoreBreakdown } from '../game/scoring';
import { useLanguage } from '../i18n/LanguageContext';
import './PlayControls.css';

interface PlayControlsProps {
  selectedCount: number;
  handsRemaining: number;
  discardsRemaining: number;
  isRoundOver: boolean;
  lastPlayedBreakdown: ScoreBreakdown | null;
  onPlayHand: () => void;
  onDiscard: () => void;
}

export const PlayControls: React.FC<PlayControlsProps> = ({
  selectedCount,
  handsRemaining,
  discardsRemaining,
  isRoundOver,
  lastPlayedBreakdown,
  onPlayHand,
  onDiscard,
}) => {
  const { t, language } = useLanguage();
  const canPlay = selectedCount > 0 && handsRemaining > 0 && !isRoundOver;
  const canDiscard = selectedCount > 0 && discardsRemaining > 0 && !isRoundOver;

  return (
    <div className="play-controls-container" aria-label={t.commands}>
      {/* Resoconto Ultima Mano Giocata */}
      {lastPlayedBreakdown && (
        <div
          className="last-hand-banner pixel-panel pixel-panel-blood"
          role="status"
          aria-live="polite"
        >
          <span className="last-hand-tag">
            {language === 'en' ? 'LAST PLAYED HAND:' : 'ULTIMA MANO GIOCATA:'}
          </span>
          <span className="last-hand-details">
            <strong>{lastPlayedBreakdown.displayName}</strong> | (
            {lastPlayedBreakdown.baseChips} Base + {lastPlayedBreakdown.cardChips}{' '}
            {language === 'en' ? 'Cards' : 'Carte'}) X {lastPlayedBreakdown.totalMult} Mult ={' '}
            <span className="status-gold">+{lastPlayedBreakdown.finalScore} PTS</span>
          </span>
        </div>
      )}

      {/* Pulsanti Azione */}
      <div className="action-buttons-group">
        <button
          type="button"
          className="pixel-btn pixel-btn-blood play-btn"
          disabled={!canPlay}
          onClick={onPlayHand}
          aria-label={`${t.playHandBtn}. ${t.handsRemainingLabel}: ${handsRemaining}`}
        >
          {t.playHandBtn}
        </button>

        <button
          type="button"
          className="pixel-btn discard-btn"
          disabled={!canDiscard}
          onClick={onDiscard}
          aria-label={`${t.discardBtn}. ${t.discardsRemainingLabel}: ${discardsRemaining}`}
        >
          {t.discardBtn}
        </button>
      </div>
    </div>
  );
};
