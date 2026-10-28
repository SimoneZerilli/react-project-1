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
            {language === 'en' ? '[ Select 1 to 5 Cards ]' : '[ Seleziona da 1 a 5 Carte ]'}
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
          {language === 'en' ? 'Evaluated Hand' : 'Combinazione Rilevata'}
        </span>
        <h2 className="preview-hand-name">[ {localizedHandName} ]</h2>
      </div>

      <div className="preview-stats">
        <div className="stat-box chips-box">
          <span className="stat-title">
            {language === 'en' ? 'Total Chips' : 'Chips Totali'}
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
            {language === 'en' ? 'Total Mult' : 'Mult Totale'}
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
            {language === 'en' ? 'Estimated Score' : 'Stima Punteggio'}
          </span>
          <span className="stat-val status-gold">{totalScore} PTS</span>
        </div>
      </div>

      <div className="preview-scoring-info">
        <span className="scoring-cards-count">
          {language === 'en'
            ? `Scoring Cards: ${evaluatedHand.scoringCards.length} / ${selectedCount}`
            : `Carte Valide al Punteggio: ${evaluatedHand.scoringCards.length} / ${selectedCount}`}
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
