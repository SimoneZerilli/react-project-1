import { forwardRef } from 'react';
import type { PlayingCard } from '../types/game';
import { formatRank, getCardBaseChips, getCardImagePath } from '../game/deck';
import { useLanguage } from '../i18n/LanguageContext';
import './CardView.css';

interface CardViewProps {
  card: PlayingCard;
  isSelected?: boolean;
  isFocused?: boolean;
  isScoring?: boolean;
  onToggle?: (cardId: string) => void;
  onFocus?: () => void;
}

export const CardView = forwardRef<HTMLDivElement, CardViewProps>(({
  card,
  isSelected = false,
  isFocused = false,
  isScoring = false,
  onToggle,
  onFocus,
}, ref) => {
  const { t } = useLanguage();
  const rankLabel = formatRank(card.rank);
  const suitLabel = t.suits[card.suit] ?? card.suit.toUpperCase();
  const baseChips = getCardBaseChips(card.rank);
  const imagePath = getCardImagePath(card);

  const handleClick = () => {
    onToggle?.(card.id);
  };

  const statusLabel = isSelected ? t.selectedCardsCount : '';
  const scoringLabel = isScoring ? t.cardScoring : '';

  return (
    <div
      ref={ref}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${rankLabel} ${suitLabel}, ${baseChips} ${t.cardChips}. ${statusLabel}. ${scoringLabel}`}
      tabIndex={isFocused ? 0 : -1}
      className={`pixel-card suit-${card.suit} ${isSelected ? 'is-selected' : ''} ${
        isScoring ? 'is-scoring' : ''
      }`}
      onClick={handleClick}
      onFocus={onFocus}
      data-card-id={card.id}
    >
      {/* Illustrazione Pixel Art della Carta Insanguinata */}
      <img
        src={imagePath}
        alt=""
        aria-hidden="true"
        className="card-sprite-img"
        draggable={false}
      />

      {/* Badge Sovraimpresso Chip Base */}
      <span className="card-chips-badge" aria-hidden="true">
        +{baseChips}
      </span>

      {/* Indicatore Sovraimpresso per Carte Valide al Punteggio */}
      {isScoring && (
        <span className="scoring-indicator" title={t.cardScoring} aria-hidden="true">
          [*]
        </span>
      )}
    </div>
  );
});

CardView.displayName = 'CardView';
