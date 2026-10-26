import type { EvaluatedHand, HandType } from './types';
import { getCardBaseChips } from './deck';

export interface ScoreBreakdown {
  handType: HandType;
  displayName: string;
  baseChips: number;
  cardChips: number;
  totalChips: number;
  baseMult: number;
  totalMult: number;
  finalScore: number;
}

/**
 * Calcola il punteggio generato da una mano valutata secondo la formula:
 * Punteggio = (Base Chips + Somma Chips Carte Valide) × (Base Mult)
 */
export function calculateScore(evaluatedHand: EvaluatedHand): ScoreBreakdown {
  if (evaluatedHand.scoringCards.length === 0) {
    return {
      handType: evaluatedHand.type,
      displayName: evaluatedHand.displayName,
      baseChips: 0,
      cardChips: 0,
      totalChips: 0,
      baseMult: 0,
      totalMult: 0,
      finalScore: 0,
    };
  }

  // Somma dei chip conferiti da ciascuna carta che concorre alla mano
  const cardChips = evaluatedHand.scoringCards.reduce((sum, card) => {
    const cardBase = getCardBaseChips(card.rank);
    const cardBonus = card.bonusChips ?? 0;
    return sum + cardBase + cardBonus;
  }, 0);

  const totalChips = evaluatedHand.baseChips + cardChips;
  const totalMult = evaluatedHand.baseMult;
  const finalScore = Math.floor(totalChips * totalMult);

  return {
    handType: evaluatedHand.type,
    displayName: evaluatedHand.displayName,
    baseChips: evaluatedHand.baseChips,
    cardChips,
    totalChips,
    baseMult: evaluatedHand.baseMult,
    totalMult,
    finalScore,
  };
}

