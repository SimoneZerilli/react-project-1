import React from 'react';
import type { Joker } from '../types/game';
import { useLanguage } from '../i18n/LanguageContext';
import { JokerCard } from './JokerCard';
import './JokerSlots.css';

interface JokerSlotsProps {
  equippedJokers: Joker[];
  maxSlots?: number;
  onSellJoker: (jokerId: string) => void;
}

export const JokerSlots: React.FC<JokerSlotsProps> = ({
  equippedJokers,
  maxSlots = 5,
  onSellJoker,
}) => {
  const { t } = useLanguage();
  const emptySlotsCount = Math.max(0, maxSlots - equippedJokers.length);

  return (
    <section
      className="joker-slots-panel pixel-panel"
      aria-label={`${t.activeJokersLabel}: ${equippedJokers.length} / ${maxSlots}`}
    >
      <div className="joker-slots-header">
        <div className="joker-slots-title-group">
          <span className="joker-panel-tag">{t.jokerChestTitle}</span>
          <h3 className="joker-slots-title">
            {t.activeJokersLabel}: <span className="status-gold">{equippedJokers.length} / {maxSlots}</span>
          </h3>
        </div>
        <span className="joker-slots-hint">{t.shopHint}</span>
      </div>

      {/* Griglia dei 5 slot */}
      <div className="slots-row">
        {equippedJokers.map((joker) => (
          <JokerCard key={joker.id} joker={joker} onSell={onSellJoker} />
        ))}

        {Array.from({ length: emptySlotsCount }).map((_, idx) => (
          <div key={`empty-slot-${idx}`} className="empty-joker-slot" aria-label={t.emptySlotLabel}>
            <span className="empty-slot-label">{t.emptySlotLabel}</span>
            <span className="empty-slot-sub">{t.maxJokersHint}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
