import React from 'react';
import type { HandLevelInfo, HandType, Joker, ShopItem } from '../types/game';
import { useLanguage } from '../i18n/LanguageContext';
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
  const { t } = useLanguage();
  const canReroll = money >= rerollCost;
  const canEquipMoreJokers = equippedJokersCount < maxJokerSlots;

  return (
    <main
      className="shop-screen pixel-panel pixel-panel-blood"
      id="main-content"
      tabIndex={-1}
      role="main"
      aria-label={t.shopTitle}
    >
      <div className="shop-header">
        <div className="shop-title-group">
          <span className="shop-crest">{t.shopMerchantTitle}</span>
          <h2 className="shop-title">{t.shopTitle}</h2>
          <p className="shop-subtitle">{t.shopSubtitle}</p>
        </div>

        <div className="shop-gold-display">
          <span className="gold-label">{t.availableGoldLabel}</span>
          <span className="gold-val status-gold">${money}</span>
        </div>
      </div>

      {/* Griglia Articoli in Vendita */}
      <div className="shop-items-grid" role="list" aria-label={t.shopTitle}>
        {items.map((item) => {
          const isJoker = item.type === 'joker';
          const jokerPayload = isJoker ? (item.payload as Joker) : null;
          const canAfford = money >= item.cost;
          const isBlocked = isJoker && !canEquipMoreJokers;
          const canBuy = canAfford && !isBlocked;

          let displayName = item.name;
          let displayDesc = item.description;
          let upgradeDetails = '';

          if (isJoker && jokerPayload) {
            const loc = t.jokers[jokerPayload.id];
            if (loc) {
              displayName = loc.name;
              displayDesc = loc.description;
            }
          } else {
            const hType = (item.payload as { handType: HandType }).handType;
            const currentInfo = handLevels[hType];
            const handName = t.pokerHands[hType] ?? hType;
            displayName = `${t.scrollPrefix} ${handName}`;
            displayDesc = `${t.scrollDescription} ${handName} (+${currentInfo.chipPerLevel} Chips, +${currentInfo.multPerLevel} Mult).`;
            upgradeDetails = `${t.currentLevelInfo}: ${currentInfo.level} (${currentInfo.baseChips} Chips X ${currentInfo.baseMult} Mult)`;
          }

          return (
            <article
              key={item.id}
              className={`shop-item-card pixel-panel ${isJoker ? 'shop-item-joker' : 'shop-item-scroll'}`}
              role="listitem"
            >
              <div className="item-header">
                <span className="item-badge">[{isJoker ? t.badgeJoker : t.badgeScroll}]</span>
                <span className="item-cost status-gold">${item.cost}</span>
              </div>

              {isJoker && jokerPayload?.imagePath && (
                <div className="shop-item-art-frame">
                  <img
                    src={jokerPayload.imagePath}
                    alt={displayName}
                    className="shop-item-art-img"
                    draggable={false}
                  />
                </div>
              )}

              <div className="item-body">
                <h3 className="item-name">{displayName}</h3>
                <p className="item-desc">{displayDesc}</p>
                {upgradeDetails && <span className="item-level-info">{upgradeDetails}</span>}
              </div>

              <div className="item-action">
                <button
                  type="button"
                  className="pixel-btn pixel-btn-blood btn-buy"
                  disabled={!canBuy}
                  onClick={() => onBuyItem(item)}
                  aria-label={`${t.buyBtn} ${displayName}`}
                >
                  {isBlocked
                    ? t.slotsFullBtn
                    : canAfford
                    ? `${t.buyBtn}${item.cost}) ]`
                    : `${t.insufficientGoldBtn}${item.cost}) ]`}
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
          aria-label={`${t.rerollBtn}${rerollCost}`}
        >
          {`${t.rerollBtn}${rerollCost}) ]`}
        </button>

        <button
          type="button"
          className="pixel-btn pixel-btn-blood btn-leave-shop"
          onClick={onLeaveShop}
          aria-label={t.leaveShopBtn}
        >
          {t.leaveShopBtn}
        </button>
      </div>
    </main>
  );
};
