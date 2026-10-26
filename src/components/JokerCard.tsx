import React from 'react';
import type { Joker } from '../types/game';
import './JokerCard.css';

interface JokerCardProps {
  joker: Joker;
  onSell?: (jokerId: string) => void;
  showSellButton?: boolean;
}

export const JokerCard: React.FC<JokerCardProps> = ({
  joker,
  onSell,
  showSellButton = true,
}) => {
  const rarityLabel = joker.rarity === 'legendary' ? 'LEGGENDARIO' : joker.rarity === 'rare' ? 'RARO' : 'COMUNE';

  return (
    <div
      className={`pixel-joker-card rarity-${joker.rarity}`}
      role="article"
      aria-label={`Jolly: ${joker.name}. ${rarityLabel}. ${joker.description}`}
      tabIndex={0}
    >
      <div className="joker-header">
        <span className="joker-rarity">[{rarityLabel}]</span>
        <span className="joker-cost">${joker.cost}</span>
      </div>

      <div className="joker-body">
        <h3 className="joker-name">{joker.name}</h3>
        <p className="joker-description">{joker.description}</p>
      </div>

      {showSellButton && onSell && (
        <div className="joker-footer">
          <button
            type="button"
            className="pixel-btn btn-sell-joker"
            onClick={(e) => {
              e.stopPropagation();
              onSell(joker.id);
            }}
            aria-label={`Vendi ${joker.name} per $${joker.sellValue} d'oro`}
          >
            [ VENDI: +${joker.sellValue} ]
          </button>
        </div>
      )}
    </div>
  );
};

