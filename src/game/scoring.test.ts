import { describe, it, expect } from 'vitest';
import type { EvaluatedHand, PlayingCard } from './types';
import { calculateScore } from './scoring';

function makeCard(rank: PlayingCard['rank'], bonusChips = 0): PlayingCard {
  return {
    id: `test-${rank}-${Math.random()}`,
    suit: 'hearts',
    rank,
    bonusChips,
  };
}

describe('Scoring Engine (src/game/scoring.ts)', () => {
  it('dovrebbe calcolare 0 punti per una mano senza carte a punteggio', () => {
    const emptyHand: EvaluatedHand = {
      type: 'high_card',
      displayName: 'Nessuna carta',
      scoringCards: [],
      baseChips: 0,
      baseMult: 0,
    };
    const result = calculateScore(emptyHand);
    expect(result.finalScore).toBe(0);
    expect(result.totalChips).toBe(0);
  });

  it('dovrebbe calcolare correttamente High Card con Asso (11 chip)', () => {
    const aceHand: EvaluatedHand = {
      type: 'high_card',
      displayName: 'High Card',
      scoringCards: [makeCard(14)],
      baseChips: 5,
      baseMult: 1,
    };
    const res = calculateScore(aceHand);
    // Base 5 + 11 = 16 chips. 16 * 1 mult = 16 pts
    expect(res.baseChips).toBe(5);
    expect(res.cardChips).toBe(11);
    expect(res.totalChips).toBe(16);
    expect(res.totalMult).toBe(1);
    expect(res.finalScore).toBe(16);
  });

  it('dovrebbe calcolare correttamente Pair di 9 (Base 10, Mult 2)', () => {
    const pairHand: EvaluatedHand = {
      type: 'pair',
      displayName: 'Pair',
      scoringCards: [makeCard(9), makeCard(9)],
      baseChips: 10,
      baseMult: 2,
    };
    const res = calculateScore(pairHand);
    // Base 10 + (9 + 9 = 18) = 28 chips. 28 * 2 = 56 pts
    expect(res.cardChips).toBe(18);
    expect(res.totalChips).toBe(28);
    expect(res.totalMult).toBe(2);
    expect(res.finalScore).toBe(56);
  });

  it('dovrebbe calcolare correttamente Full House (3 Re + 2 Assi)', () => {
    const fullHouse: EvaluatedHand = {
      type: 'full_house',
      displayName: 'Full House',
      scoringCards: [makeCard(13), makeCard(13), makeCard(13), makeCard(14), makeCard(14)],
      baseChips: 40,
      baseMult: 4,
    };
    const res = calculateScore(fullHouse);
    // Re = 10, 10, 10 -> 30 chips. Asso = 11, 11 -> 22 chips. Totale carte = 52 chips.
    // Totale chips = 40 + 52 = 92. Mult = 4. Final = 92 * 4 = 368 pts.
    expect(res.cardChips).toBe(52);
    expect(res.totalChips).toBe(92);
    expect(res.totalMult).toBe(4);
    expect(res.finalScore).toBe(368);
  });

  it('dovrebbe azzerare i chip delle carte depotenziate da una boss rule', () => {
    const aceHeart: PlayingCard = {
      id: 'h-14',
      suit: 'hearts',
      rank: 14,
    };
    const hand: EvaluatedHand = {
      type: 'high_card',
      displayName: 'High Card',
      scoringCards: [aceHeart],
      baseChips: 5,
      baseMult: 1,
    };
    // Regola Lama del Boia: carte di cuori depotenziate
    const res = calculateScore(hand, (c) => c.suit === 'hearts');
    expect(res.cardChips).toBe(0);
    expect(res.totalChips).toBe(5); // Solo baseChips
    expect(res.finalScore).toBe(5);
  });
});

