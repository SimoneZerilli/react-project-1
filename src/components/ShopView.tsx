import React from 'react';
import type { HandLevelInfo, HandType, ShopItem } from '../types/game';
import './ShopView.css';

interface ShopViewProps {
  money: number;
  items: ShopItem[];
  rerollCost: number;
  equippedJokersCount: number;
  maxJokerSlots: number;
  handLevels: Record<HandType, HandLevelInfo>;
  onBuyItem: (item: ShopItem) => void;
  onReroll: () => void;
  onLeaveShop: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  money,
  items,
  rerollCost,
  equippedJokersCount,
  maxJokerSlots,
  handLevels,
  onBuyItem,
  onReroll,
  onLeaveShop,
}) => {
  const canReroll = money >= rerollCost;
  const canEquipMoreJokers = equippedJokersCount < maxJokerSlots;

  return (
    <section className="shop-screen pixel-panel pixel-panel-blood" role="region" aria-label="Negozio della Taverna">
      <div className="shop-header">
        <div className="shop-title-group">
          <span className="shop-crest">[ MERCANTE DELLA TAVERNA ]</span>
          <h2 className="shop-title">LA BOTTEGA DEI RELITTI</h2>
          <p className="shop-subtitle">
            Spendi il tuo oro per acquistare nuovi Jolly o pergamene di potenziamento permanente.
          </p>
        </div>

        <div className="shop-gold-display">
          <span className="gold-label">ORO DISPONIBILE:</span>
          <span className="gold-val status-gold">${money}</span>
        </div>
      </div>

      {/* Griglia Articoli in Vendita */}
      <div className="shop-items-grid" role="list" aria-label="Articoli in vendita">
        {items.map((item) => {
          const isJoker = item.type === 'joker';
          const canAfford = money >= item.cost;
          const isBlocked = isJoker && !canEquipMoreJokers;
          const canBuy = canAfford && !isBlocked;

          let upgradeDetails = '';
          if (!isJoker) {
            const hType = (item.payload as { handType: HandType }).handType;
            const currentInfo = handLevels[hType];
            upgradeDetails = `Livello Attuale: ${currentInfo.level} (${currentInfo.baseChips} Chips X ${currentInfo.baseMult} Mult)`;
          }

          return (
            <article
              key={item.id}
              className={`shop-item-card pixel-panel ${isJoker ? 'shop-item-joker' : 'shop-item-scroll'}`}
              role="listitem"
            >
              <div className="item-header">
                <span className="item-badge">[{isJoker ? 'JOLLY' : 'PERGAMENA'}]</span>
                <span className="item-cost status-gold">${item.cost}</span>
              </div>

              <div className="item-body">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-desc">{item.description}</p>
                {upgradeDetails && <span className="item-level-info">{upgradeDetails}</span>}
              </div>

              <div className="item-action">
                <button
                  type="button"
                  className="pixel-btn pixel-btn-blood btn-buy"
                  disabled={!canBuy}
                  onClick={() => onBuyItem(item)}
                  aria-label={`Acquista ${item.name} per $${item.cost} d'oro`}
                >
                  {isBlocked
                    ? '[ SLOTS PIENI ]'
                    : canAfford
                    ? `[ ACQUISTA ($${item.cost}) ]`
                    : `[ ORO INSUFFICIENTE ($${item.cost}) ]`}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Controlli Inferiori: Reroll ed Esci */}
      <div className="shop-footer-controls">
        <button
          type="button"
          className="pixel-btn btn-reroll"
          disabled={!canReroll}
          onClick={onReroll}
          aria-label={`Rinfresca le merci del negozio per $${rerollCost} d'oro`}
        >
          [ REROLL OFFERTE: ${rerollCost} ]
        </button>

        <button
          type="button"
          className="pixel-btn pixel-btn-blood btn-leave-shop"
          onClick={onLeaveShop}
          aria-label="Esci dalla bottega e procedi al prossimo Blind"
        >
          [ ESCI DALLA BOTTEGA (PROSSIMO BLIND) ]
        </button>
      </div>
    </section>
  );
};
