import React from 'react';
import type { EvaluatedHand } from '../types/game';
import type { ScoreBreakdown } from '../game/scoring';
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
  if (selectedCount === 0) {
    return (
      <aside className="hand-preview pixel-panel" aria-label="Riconoscimento Mano">
        <div className="preview-empty">
          <span className="empty-title">[ SELEZIONA DA 1 A 5 CARTE ]</span>
          <span className="empty-sub">
            Usa le Frecce per scorrere e Spazio per comporre la tua mano
          </span>
        </div>
      </aside>
    );
  }

  const baseScore = evaluatedHand.baseChips * evaluatedHand.baseMult;
  const totalScore = previewBreakdown ? previewBreakdown.finalScore : baseScore;
  const totalChips = previewBreakdown ? previewBreakdown.totalChips : evaluatedHand.baseChips;
  const totalMult = previewBreakdown ? previewBreakdown.totalMult : evaluatedHand.baseMult;

  return (
    <aside
      className="hand-preview pixel-panel pixel-panel-blood"
      aria-label={`Combinazione rilevata: ${evaluatedHand.displayName}`}
    >
      <div className="preview-header">
        <span className="preview-label">COMBINAZIONE RILEVATA</span>
        <h2 className="preview-hand-name">[ {evaluatedHand.displayName.toUpperCase()} ]</h2>
      </div>

      <div className="preview-stats">
        <div className="stat-box chips-box">
          <span className="stat-title">CHIPS TOTALI</span>
          <span className="stat-val status-gold">{totalChips}</span>
          {previewBreakdown && previewBreakdown.jokerChips > 0 && (
            <span className="joker-stat-bonus">(+{previewBreakdown.jokerChips} Jolly)</span>
          )}
        </div>

        <span className="stat-operator">X</span>

        <div className="stat-box mult-box">
          <span className="stat-title">MULT TOTALE</span>
          <span className="stat-val status-blood">{totalMult}</span>
          {previewBreakdown && previewBreakdown.jokerMult > 0 && (
            <span className="joker-stat-bonus">(+{previewBreakdown.jokerMult} Jolly)</span>
          )}
        </div>

        <span className="stat-operator">=</span>

        <div className="stat-box potential-box">
          <span className="stat-title">STIMA PUNTEGGIO</span>
          <span className="stat-val status-gold">{totalScore} PTS</span>
        </div>
      </div>

      <div className="preview-scoring-info">
        <span className="scoring-cards-count">
          CARTE VALIDE AL PUNTEGGIO: {evaluatedHand.scoringCards.length} / {selectedCount}
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
