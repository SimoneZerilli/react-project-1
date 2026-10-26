import React from 'react';
import type { EvaluatedHand } from '../types/game';
import './HandPreview.css';

interface HandPreviewProps {
  evaluatedHand: EvaluatedHand;
  selectedCount: number;
}

export const HandPreview: React.FC<HandPreviewProps> = ({
  evaluatedHand,
  selectedCount,
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

  const potentialBaseScore = evaluatedHand.baseChips * evaluatedHand.baseMult;

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
          <span className="stat-title">BASE CHIPS</span>
          <span className="stat-val status-gold">{evaluatedHand.baseChips}</span>
        </div>

        <span className="stat-operator">X</span>

        <div className="stat-box mult-box">
          <span className="stat-title">BASE MULT</span>
          <span className="stat-val status-blood">{evaluatedHand.baseMult}</span>
        </div>

        <span className="stat-operator">=</span>

        <div className="stat-box potential-box">
          <span className="stat-title">STIMA BASE</span>
          <span className="stat-val status-gold">{potentialBaseScore} PTS</span>
        </div>
      </div>

      <div className="preview-scoring-info">
        <span className="scoring-cards-count">
          CARTE VALIDE AL PUNTEGGIO: {evaluatedHand.scoringCards.length} / {selectedCount}
        </span>
      </div>
    </aside>
  );
};
