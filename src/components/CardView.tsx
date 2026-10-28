import { forwardRef } from 'react';
import type { PlayingCard } from '../types/game';
import { getCardBaseChips, getCardImagePath, getRankFullName } from '../game/deck';
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
  const { t, language } = useLanguage();
  const rankFull = getRankFullName(card.rank, language);
  const suitLabel = t.suits[card.suit] ?? card.suit.toUpperCase();
  const baseChips = getCardBaseChips(card.rank);
  const imagePath = getCardImagePath(card);

  const handleClick = () => {
    onToggle?.(card.id);
  };

  // Screen reader accessible name as requested: "Regina di Cuori, selezionata" / "Queen of Hearts, selected"
  const accessibleName = language === 'it'
    ? `${rankFull} di ${suitLabel}, ${isSelected ? 'selezionata' : 'non selezionata'}. ${baseChips} chip.${isScoring ? ' Valida per il punteggio.' : ''}`
    : `${rankFull} of ${suitLabel}, ${isSelected ? 'selected' : 'not selected'}. ${baseChips} chips.${isScoring ? ' Contributes to scoring.' : ''}`;

  // Seme non comunicato solo dal colore: sigla testuale del seme ('H', 'D', 'C', 'S')
  const suitSymbol = card.suit === 'hearts' ? 'H' : card.suit === 'diamonds' ? 'D' : card.suit === 'clubs' ? 'C' : 'S';

  return (
    <div
      ref={ref}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={accessibleName}
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

      {/* Seme non comunicato solo dal colore: badge testuale seme visibile */}
      <span className="card-suit-badge" aria-hidden="true" title={suitLabel}>
        {suitSymbol}
      </span>

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
