import React from 'react';
import type { Joker } from '../types/game';
import { useLanguage } from '../i18n/LanguageContext';
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
  const { t } = useLanguage();
  const localizedInfo = t.jokers[joker.id] ?? {
    name: joker.name,
    description: joker.description,
  };
  const rarityLabel = t.rarities[joker.rarity] ?? joker.rarity.toUpperCase();

  return (
    <div
      className={`pixel-joker-card rarity-${joker.rarity}`}
      role="article"
      aria-label={`${t.badgeJoker}: ${localizedInfo.name}. ${rarityLabel}. ${localizedInfo.description}`}
      tabIndex={0}
    >
      <div className="joker-header">
        <span className="joker-rarity">[{rarityLabel}]</span>
        <span className="joker-cost">${joker.cost}</span>
      </div>

      <div className="joker-art-frame">
        {joker.imagePath ? (
          <img
            src={joker.imagePath}
            alt={localizedInfo.name}
            className="joker-art-img"
            draggable={false}
          />
        ) : (
          <div className="joker-art-placeholder">[ ? ]</div>
        )}
      </div>

      <div className="joker-body">
        <h3 className="joker-name">{localizedInfo.name}</h3>
        <p className="joker-description">{localizedInfo.description}</p>
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
            aria-label={`${t.sellBtn} ${localizedInfo.name} for $${joker.sellValue}`}
          >
            [ {t.sellBtn}: +${joker.sellValue} ]
          </button>
        </div>
      )}
    </div>
  );
};
