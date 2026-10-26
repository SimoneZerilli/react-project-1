import { forwardRef } from 'react';
import type { PlayingCard } from '../types/game';
import { formatRank, getCardBaseChips, getSuitAbbreviation, getSuitLabel } from '../game/deck';
import './CardView.css';

interface CardViewProps {
  card: PlayingCard;
  isSelected?: boolean;
  isFocused?: boolean;
  onToggle?: (cardId: string) => void;
  onFocus?: () => void;
}

export const CardView = forwardRef<HTMLDivElement, CardViewProps>(({
  card,
  isSelected = false,
  isFocused = false,
  onToggle,
  onFocus,
}, ref) => {
  const rankLabel = formatRank(card.rank);
  const suitLabel = getSuitLabel(card.suit);
  const suitShort = getSuitAbbreviation(card.suit);
  const baseChips = getCardBaseChips(card.rank);

  const handleClick = () => {
    onToggle?.(card.id);
  };

  return (
    <div
      ref={ref}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${rankLabel} di ${suitLabel}, vale ${baseChips} chips. ${isSelected ? 'Selezionata' : 'Non selezionata'}`}
      tabIndex={isFocused ? 0 : -1}
      className={`pixel-card suit-${card.suit} ${isSelected ? 'is-selected' : ''}`}
      onClick={handleClick}
      onFocus={onFocus}
      data-card-id={card.id}
    >
      <div className="card-top">
        <span className="card-rank">{rankLabel}</span>
        <span className="card-suit-badge">[{suitShort}]</span>
      </div>

      <div className="card-center">
        <span className="card-center-rank">{rankLabel}</span>
        <span className="card-suit-name">{suitLabel}</span>
      </div>

      <div className="card-bottom">
        <span className="card-chips">+{baseChips}</span>
        <span className="card-suit-badge">[{suitShort}]</span>
      </div>
    </div>
  );
});

CardView.displayName = 'CardView';
