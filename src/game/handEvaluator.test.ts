import { describe, it, expect } from 'vitest';
import type { PlayingCard } from './types';
import { evaluateHand } from './handEvaluator';

// Helper per creare carte rapidamente nei test
function makeCard(suit: 'hearts' | 'diamonds' | 'clubs' | 'spades', rank: PlayingCard['rank']): PlayingCard {
  return {
    id: `${suit}-${rank}`,
    suit,
    rank,
  };
}

describe('Hand Evaluator Engine (src/game/handEvaluator.ts)', () => {
  it('dovrebbe gestire una mano vuota', () => {
    const res = evaluateHand([]);
    expect(res.type).toBe('high_card');
    expect(res.baseChips).toBe(0);
    expect(res.baseMult).toBe(0);
    expect(res.scoringCards).toHaveLength(0);
  });

  it('dovrebbe riconoscere High Card con 1 carta e con 5 carte senza combinazioni', () => {
    const single = [makeCard('hearts', 7)];
    const resSingle = evaluateHand(single);
    expect(resSingle.type).toBe('high_card');
    expect(resSingle.scoringCards).toHaveLength(1);
    expect(resSingle.scoringCards[0].rank).toBe(7);

    const fiveCards = [
      makeCard('hearts', 2),
      makeCard('diamonds', 5),
      makeCard('clubs', 8),
      makeCard('spades', 11),
      makeCard('hearts', 14), // Asso
    ];
    const resFive = evaluateHand(fiveCards);
    expect(resFive.type).toBe('high_card');
    expect(resFive.displayName).toBe('High Card');
    expect(resFive.scoringCards).toHaveLength(1);
    expect(resFive.scoringCards[0].rank).toBe(14);
  });

  it('dovrebbe riconoscere Pair e isolare solo le 2 carte della coppia per il punteggio', () => {
    const cards = [
      makeCard('hearts', 9),
      makeCard('diamonds', 9),
      makeCard('clubs', 4),
      makeCard('spades', 6),
      makeCard('hearts', 13),
    ];
    const res = evaluateHand(cards);
    expect(res.type).toBe('pair');
    expect(res.displayName).toBe('Pair');
    expect(res.baseChips).toBe(10);
    expect(res.baseMult).toBe(2);
    expect(res.scoringCards).toHaveLength(2);
    expect(res.scoringCards.every((c) => c.rank === 9)).toBe(true);
  });

  it('dovrebbe riconoscere Two Pair e isolare le 4 carte delle coppie', () => {
    const cards = [
      makeCard('hearts', 6),
      makeCard('diamonds', 6),
      makeCard('clubs', 12),
      makeCard('spades', 12),
      makeCard('hearts', 3),
    ];
    const res = evaluateHand(cards);
    expect(res.type).toBe('two_pair');
    expect(res.displayName).toBe('Two Pair');
    expect(res.baseChips).toBe(20);
    expect(res.baseMult).toBe(2);
    expect(res.scoringCards).toHaveLength(4);
  });

  it('dovrebbe riconoscere Three of a Kind', () => {
    const cards = [
      makeCard('hearts', 10),
      makeCard('diamonds', 10),
      makeCard('spades', 10),
      makeCard('clubs', 2),
      makeCard('hearts', 5),
    ];
    const res = evaluateHand(cards);
    expect(res.type).toBe('three_of_a_kind');
    expect(res.displayName).toBe('Three of a Kind');
    expect(res.baseChips).toBe(30);
    expect(res.baseMult).toBe(3);
    expect(res.scoringCards).toHaveLength(3);
  });

  it('dovrebbe riconoscere Straight regolare e scala con Asso basso (A-2-3-4-5)', () => {
    const regularStraight = [
      makeCard('hearts', 8),
      makeCard('diamonds', 9),
      makeCard('clubs', 10),
      makeCard('spades', 11),
      makeCard('hearts', 12),
    ];
    const resReg = evaluateHand(regularStraight);
    expect(resReg.type).toBe('straight');
    expect(resReg.displayName).toBe('Straight');
    expect(resReg.scoringCards).toHaveLength(5);

    // Asso basso: 2, 3, 4, 5, 14 (Asso)
    const aceLowStraight = [
      makeCard('hearts', 14),
      makeCard('diamonds', 2),
      makeCard('clubs', 3),
      makeCard('spades', 4),
      makeCard('hearts', 5),
    ];
    const resAceLow = evaluateHand(aceLowStraight);
    expect(resAceLow.type).toBe('straight');
    expect(resAceLow.scoringCards).toHaveLength(5);
  });

  it('dovrebbe riconoscere Flush (Colore)', () => {
    const flushCards = [
      makeCard('hearts', 2),
      makeCard('hearts', 6),
      makeCard('hearts', 8),
      makeCard('hearts', 11),
      makeCard('hearts', 13),
    ];
    const res = evaluateHand(flushCards);
    expect(res.type).toBe('flush');
    expect(res.displayName).toBe('Flush');
    expect(res.baseChips).toBe(35);
    expect(res.baseMult).toBe(4);
    expect(res.scoringCards).toHaveLength(5);
  });

  it('dovrebbe riconoscere Full House', () => {
    const fullHouseCards = [
      makeCard('hearts', 7),
      makeCard('diamonds', 7),
      makeCard('clubs', 7),
      makeCard('spades', 11),
      makeCard('hearts', 11),
    ];
    const res = evaluateHand(fullHouseCards);
    expect(res.type).toBe('full_house');
    expect(res.displayName).toBe('Full House');
    expect(res.baseChips).toBe(40);
    expect(res.baseMult).toBe(4);
    expect(res.scoringCards).toHaveLength(5);
  });

  it('dovrebbe riconoscere Four of a Kind (Poker)', () => {
    const fourCards = [
      makeCard('hearts', 5),
      makeCard('diamonds', 5),
      makeCard('clubs', 5),
      makeCard('spades', 5),
      makeCard('hearts', 9),
    ];
    const res = evaluateHand(fourCards);
    expect(res.type).toBe('four_of_a_kind');
    expect(res.displayName).toBe('Four of a Kind');
    expect(res.baseChips).toBe(60);
    expect(res.baseMult).toBe(7);
    expect(res.scoringCards).toHaveLength(4);
  });

  it('dovrebbe riconoscere Straight Flush con priorità massima', () => {
    const straightFlush = [
      makeCard('spades', 6),
      makeCard('spades', 7),
      makeCard('spades', 8),
      makeCard('spades', 9),
      makeCard('spades', 10),
    ];
    const res = evaluateHand(straightFlush);
    expect(res.type).toBe('straight_flush');
    expect(res.displayName).toBe('Straight Flush');
    expect(res.baseChips).toBe(100);
    expect(res.baseMult).toBe(8);
    expect(res.scoringCards).toHaveLength(5);
  });
});
