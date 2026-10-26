import type { EvaluatedHand, HandType, PlayingCard, Joker, JokerScoringContext } from './types';
import { getCardBaseChips } from './deck';
import { evaluateJokers } from './jokers';

export interface ScoreBreakdown {
  handType: HandType;
  displayName: string;
  baseChips: number;
  cardChips: number;
  jokerChips: number;
  totalChips: number;
  baseMult: number;
  jokerMult: number;
  totalMult: number;
  finalScore: number;
  bonusMoney: number;
  triggeredJokers: Array<{ id: string; name: string; message: string }>;
}

/**
 * Calcola il punteggio generato da una mano valutata secondo la formula:
 * Punteggio = (Base Chips + Somma Chips Carte Valide + Bonus Joker) × (Base Mult + Mult Joker)
 * Supporta una funzione di debuff opzionale (usata dalle Boss Rules) e l'insieme dei Joker equipaggiati.
 */
export function calculateScore(
  evaluatedHand: EvaluatedHand,
  isCardDebuffed?: (card: PlayingCard) => boolean,
  jokers: readonly Joker[] = [],
  jokerContext?: Partial<JokerScoringContext>
): ScoreBreakdown {
  if (evaluatedHand.scoringCards.length === 0) {
    return {
      handType: evaluatedHand.type,
      displayName: evaluatedHand.displayName,
      baseChips: 0,
      cardChips: 0,
      jokerChips: 0,
      totalChips: 0,
      baseMult: 0,
      jokerMult: 0,
      totalMult: 0,
      finalScore: 0,
      bonusMoney: 0,
      triggeredJokers: [],
    };
  }

  // Somma dei chip conferiti da ciascuna carta che concorre alla mano
  const cardChips = evaluatedHand.scoringCards.reduce((sum, card) => {
    if (isCardDebuffed?.(card)) {
      return sum;
    }
    const cardBase = getCardBaseChips(card.rank);
    const cardBonus = card.bonusChips ?? 0;
    return sum + cardBase + cardBonus;
  }, 0);

  const initialChips = evaluatedHand.baseChips + cardChips;
  const initialMult = evaluatedHand.baseMult;

  // Applicazione della pipeline dei Joker
  const fullContext: JokerScoringContext = {
    cards: evaluatedHand.scoringCards,
    evaluatedHand,
    currentChips: initialChips,
    currentMult: initialMult,
    discardsUsedThisRound: jokerContext?.discardsUsedThisRound ?? 0,
    handsRemaining: jokerContext?.handsRemaining ?? 4,
    money: jokerContext?.money ?? 4,
  };

  const jokerResult = evaluateJokers(jokers, initialChips, initialMult, fullContext);

  const totalChips = jokerResult.totalChips;
  const totalMult = jokerResult.totalMult;
  const finalScore = Math.floor(totalChips * totalMult);

  return {
    handType: evaluatedHand.type,
    displayName: evaluatedHand.displayName,
    baseChips: evaluatedHand.baseChips,
    cardChips,
    jokerChips: jokerResult.addedChips,
    totalChips,
    baseMult: evaluatedHand.baseMult,
    jokerMult: jokerResult.addedMult,
    totalMult,
    finalScore,
    bonusMoney: jokerResult.bonusMoney,
    triggeredJokers: jokerResult.triggeredJokers,
  };
}
