import React from 'react';
import type { Blind } from '../types/game';
import './BlindSelect.css';

interface BlindSelectProps {
  ante: number;
  smallBlind: Blind;
  bigBlind: Blind;
  bossBlind: Blind;
  activeBlindType: 'small' | 'big' | 'boss';
  onPlayBlind: (blind: Blind) => void;
  onSkipBlind: (blind: Blind) => void;
}

export const BlindSelect: React.FC<BlindSelectProps> = ({
  ante,
  smallBlind,
  bigBlind,
  bossBlind,
  activeBlindType,
  onPlayBlind,
  onSkipBlind,
}) => {
  const blinds = [smallBlind, bigBlind, bossBlind];

  const getStatus = (blind: Blind) => {
    if (blind.type === activeBlindType) return 'current';
    if (activeBlindType === 'boss') return 'completed';
    if (activeBlindType === 'big' && blind.type === 'small') return 'completed';
    return 'upcoming';
  };

  return (
    <div className="blind-select-screen pixel-panel pixel-panel-blood" role="region" aria-label="Selezione Blind">
      <div className="blind-select-header">
        <span className="ante-badge status-gold">[ ANTE {ante} DI 8 ]</span>
        <h2 className="blind-select-title">SCEGLI LA PROSSIMA SFIDA NELLA TAVERNA</h2>
        <p className="blind-select-desc">
          Supera l&apos;obiettivo di ciascun Blind per guadagnare oro ed avanzare.
          Small e Big Blind possono essere saltati per riscattare un Tag istantaneo. Il Boss è obbligatorio.
        </p>
      </div>

      <div className="blinds-grid" role="list" aria-label="Elenco Blind dell'Ante">
        {blinds.map((b) => {
          const status = getStatus(b);
          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';

          return (
            <article
              key={b.type}
              className={`blind-card pixel-panel ${isCurrent ? 'blind-card-active' : ''} ${
                isCompleted ? 'blind-card-completed' : ''
              } ${b.type === 'boss' ? 'blind-card-boss' : ''}`}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="blind-card-header">
                <span className="blind-tag-label">[{b.type.toUpperCase()}]</span>
                <h3 className="blind-title">{b.title}</h3>
              </div>

              <div className="blind-stats">
                <div className="blind-stat-row">
                  <span className="stat-name">OBIETTIVO:</span>
                  <span className="stat-val status-blood">{b.scoreTarget} PTS</span>
                </div>
                <div className="blind-stat-row">
                  <span className="stat-name">RICOMPENSA:</span>
                  <span className="stat-val status-gold">+${b.rewardMoney}</span>
                </div>
              </div>

              {/* Regola Boss */}
              {b.bossRule && (
                <div className="boss-rule-box">
                  <span className="boss-rule-tag">[ REGOLA DEL BOSS ]</span>
                  <h4 className="boss-rule-name">{b.bossRule.name}</h4>
                  <p className="boss-rule-desc">{b.bossRule.description}</p>
                </div>
              )}

              {/* Tag di Skip */}
              {b.skipTag && b.canSkip && (
                <div className="skip-tag-box">
                  <span className="skip-tag-title">[ TAG DISPONIBILE AL SALTO ]</span>
                  <p className="skip-tag-desc">
                    <strong>{b.skipTag.name}</strong>: {b.skipTag.description}
                  </p>
                </div>
              )}

              {/* Azioni del Blind */}
              <div className="blind-actions">
                {isCompleted && (
                  <span className="completed-badge">[ GIA RISOLTO ]</span>
                )}

                {isCurrent && (
                  <>
                    <button
                      type="button"
                      className="pixel-btn pixel-btn-blood btn-play-blind"
                      onClick={() => onPlayBlind(b)}
                      aria-label={`Gioca ${b.title}. Obiettivo ${b.scoreTarget} punti.`}
                    >
                      {b.type === 'boss' ? '[ COMBATTI IL BOSS ]' : '[ GIOCA BLIND ]'}
                    </button>

                    {b.canSkip && (
                      <button
                        type="button"
                        className="pixel-btn btn-skip-blind"
                        onClick={() => onSkipBlind(b)}
                        aria-label={`Salta ${b.title} e riscatta il tag ${b.skipTag?.name}.`}
                      >
                        [ SALTA E PRENDI TAG ]
                      </button>
                    )}
                  </>
                )}

                {!isCurrent && !isCompleted && (
                  <span className="locked-badge">[ BLOCCATO ]</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

