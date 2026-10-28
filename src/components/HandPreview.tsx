import React from 'react';
import type { EvaluatedHand } from '../types/game';
import type { ScoreBreakdown } from '../game/scoring';
import { useLanguage } from '../i18n/LanguageContext';
import './HandPreview.css';

interface HandPreviewProps {
  evaluatedHand: EvaluatedHand;
  selectedCount: number;
  previewBreakdown?: ScoreBreakdown | null;
}

export const HandPreview: React.FC<HandPreviewProps> = ({
  evaluatedHand,
  selectedCount,
  previewBreakdown,
}) => {
  const { t, language } = useLanguage();

  if (selectedCount === 0) {
    return (
      <aside className="hand-preview pixel-panel" aria-label={t.roundScoreLabel}>
        <div className="preview-empty">
          <span className="empty-title">
            {language === 'en' ? '[ SELECT 1 TO 5 CARDS ]' : '[ SELEZIONA DA 1 A 5 CARTE ]'}
          </span>
          <span className="empty-sub">
            {language === 'en'
              ? 'Use Arrow keys to navigate and Space to select cards'
              : 'Usa le Frecce per scorrere e Spazio per comporre la tua mano'}
          </span>
        </div>
      </aside>
    );
  }

  const localizedHandName = t.pokerHands[evaluatedHand.type] ?? evaluatedHand.displayName;
  const baseScore = evaluatedHand.baseChips * evaluatedHand.baseMult;
  const totalScore = previewBreakdown ? previewBreakdown.finalScore : baseScore;
  const totalChips = previewBreakdown ? previewBreakdown.totalChips : evaluatedHand.baseChips;
  const totalMult = previewBreakdown ? previewBreakdown.totalMult : evaluatedHand.baseMult;

  return (
    <aside
      className="hand-preview pixel-panel pixel-panel-blood"
      aria-label={`${t.handType}: ${localizedHandName}`}
    >
      <div className="preview-header">
        <span className="preview-label">
          {language === 'en' ? 'EVALUATED HAND' : 'COMBINAZIONE RILEVATA'}
        </span>
        <h2 className="preview-hand-name">[ {localizedHandName.toUpperCase()} ]</h2>
      </div>

      <div className="preview-stats">
        <div className="stat-box chips-box">
          <span className="stat-title">
            {language === 'en' ? 'TOTAL CHIPS' : 'CHIPS TOTALI'}
          </span>
          <span className="stat-val status-gold">{totalChips}</span>
          {previewBreakdown && previewBreakdown.jokerChips > 0 && (
            <span className="joker-stat-bonus">
              (+{previewBreakdown.jokerChips} {t.badgeJoker})
            </span>
          )}
        </div>

        <span className="stat-operator">X</span>

        <div className="stat-box mult-box">
          <span className="stat-title">
            {language === 'en' ? 'TOTAL MULT' : 'MULT TOTALE'}
          </span>
          <span className="stat-val status-blood">{totalMult}</span>
          {previewBreakdown && previewBreakdown.jokerMult > 0 && (
            <span className="joker-stat-bonus">
              (+{previewBreakdown.jokerMult} {t.badgeJoker})
            </span>
          )}
        </div>

        <span className="stat-operator">=</span>

        <div className="stat-box potential-box">
          <span className="stat-title">
            {language === 'en' ? 'ESTIMATED SCORE' : 'STIMA PUNTEGGIO'}
          </span>
          <span className="stat-val status-gold">{totalScore} PTS</span>
        </div>
      </div>

      <div className="preview-scoring-info">
        <span className="scoring-cards-count">
          {language === 'en'
            ? `SCORING CARDS: ${evaluatedHand.scoringCards.length} / ${selectedCount}`
            : `CARTE VALIDE AL PUNTEGGIO: ${evaluatedHand.scoringCards.length} / ${selectedCount}`}
        </span>
        {previewBreakdown && previewBreakdown.triggeredJokers.length > 0 && (
          <div className="triggered-jokers-list">
            {previewBreakdown.triggeredJokers.map((tj, idx) => (
              <span key={idx} className="joker-tag-pill">
                [{tj.name}: {tj.message}]
              </span>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
