import { describe, it, expect } from 'vitest';
import type { EvaluatedHand, PlayingCard, JokerScoringContext } from './types';
import { JOKERS_ROSTER, ALL_JOKERS, evaluateJokers } from './jokers';
import { calculateScore } from './scoring';

function makeCard(suit: PlayingCard['suit'], rank: PlayingCard['rank']): PlayingCard {
  return {
    id: `${suit}-${rank}`,
    suit,
    rank,
  };
}

describe('Jokers Engine & Roster (src/game/jokers.ts)', () => {
  it('dovrebbe contenere tutti i 7 Joker con le relative proprietà e costi', () => {
    expect(ALL_JOKERS).toHaveLength(7);
    for (const joker of ALL_JOKERS) {
      expect(joker.id).toBeDefined();
      expect(joker.name).toBeDefined();
      expect(joker.description).toBeDefined();
      expect(joker.cost).toBeGreaterThan(0);
      expect(joker.sellValue).toBeGreaterThan(0);
    }
  });

  it('Il Giullare di Corte dovrebbe conferire +4 Mult a prescindere dalla mano', () => {
    const hand: EvaluatedHand = {
      type: 'high_card',
      displayName: 'High Card',
      scoringCards: [makeCard('hearts', 10)],
      baseChips: 5,
      baseMult: 1,
    };
    const ctx: JokerScoringContext = {
      cards: hand.scoringCards,
      evaluatedHand: hand,
      currentChips: 15,
      currentMult: 1,
      discardsUsedThisRound: 0,
      handsRemaining: 4,
      money: 4,
    };

    const res = evaluateJokers([JOKERS_ROSTER.court_jester], 15, 1, ctx);
    expect(res.addedMult).toBe(4);
    expect(res.totalMult).toBe(5); // 1 + 4
  });

  it("L'Alchimista dovrebbe aggiungere +3 Chips e +$1 per ogni carta di Quadri", () => {
    const hand: EvaluatedHand = {
      type: 'pair',
      displayName: 'Pair',
      scoringCards: [makeCard('diamonds', 8), makeCard('diamonds', 8)],
      baseChips: 10,
      baseMult: 2,
    };
    const ctx: JokerScoringContext = {
      cards: hand.scoringCards,
      evaluatedHand: hand,
      currentChips: 26,
      currentMult: 2,
      discardsUsedThisRound: 0,
      handsRemaining: 4,
      money: 4,
    };

    const res = evaluateJokers([JOKERS_ROSTER.alchemist], 26, 2, ctx);
    expect(res.addedChips).toBe(6); // 2 * 3
    expect(res.bonusMoney).toBe(2); // 2 * $1
  });

  it('Il Fabbro Reale dovrebbe conferire +15 Chips per carta di Picche', () => {
    const hand: EvaluatedHand = {
      type: 'flush',
      displayName: 'Flush',
      scoringCards: [
        makeCard('spades', 2),
        makeCard('spades', 5),
        makeCard('spades', 8),
        makeCard('spades', 11),
        makeCard('spades', 14),
      ],
      baseChips: 35,
      baseMult: 4,
    };
    const ctx: JokerScoringContext = {
      cards: hand.scoringCards,
      evaluatedHand: hand,
      currentChips: 75,
      currentMult: 4,
      discardsUsedThisRound: 0,
      handsRemaining: 4,
      money: 4,
    };

    const res = evaluateJokers([JOKERS_ROSTER.royal_blacksmith], 75, 4, ctx);
    expect(res.addedChips).toBe(75); // 5 * 15
  });

  it('Il Monaco Amanuense dovrebbe dare +8 Mult solo su Straight', () => {
    const straightHand: EvaluatedHand = {
      type: 'straight',
      displayName: 'Straight',
      scoringCards: [makeCard('hearts', 5)],
      baseChips: 30,
      baseMult: 4,
    };
    const ctxStraight: JokerScoringContext = {
      cards: straightHand.scoringCards,
      evaluatedHand: straightHand,
      currentChips: 35,
      currentMult: 4,
      discardsUsedThisRound: 0,
      handsRemaining: 4,
      money: 4,
    };

    const resStraight = evaluateJokers([JOKERS_ROSTER.monk_scribe], 35, 4, ctxStraight);
    expect(resStraight.addedMult).toBe(8);

    // Su Pair non deve attivarsi
    const pairHand: EvaluatedHand = {
      type: 'pair',
      displayName: 'Pair',
      scoringCards: [makeCard('hearts', 5)],
      baseChips: 10,
      baseMult: 2,
    };
    const resPair = evaluateJokers([JOKERS_ROSTER.monk_scribe], 15, 2, { ...ctxStraight, evaluatedHand: pairHand });
    expect(resPair.addedMult).toBe(0);
  });

  it('Il Balestriere Scelto dovrebbe conferire +30 Chips su Pair e Two Pair', () => {
    const pairHand: EvaluatedHand = {
      type: 'pair',
      displayName: 'Pair',
      scoringCards: [makeCard('hearts', 6), makeCard('spades', 6)],
      baseChips: 10,
      baseMult: 2,
    };
    const ctx: JokerScoringContext = {
      cards: pairHand.scoringCards,
      evaluatedHand: pairHand,
      currentChips: 22,
      currentMult: 2,
      discardsUsedThisRound: 0,
      handsRemaining: 4,
      money: 4,
    };

    const res = evaluateJokers([JOKERS_ROSTER.marksman_crossbow], 22, 2, ctx);
    expect(res.addedChips).toBe(30);
  });

  it('Il Cavaliere Errante dovrebbe moltiplicare per 1.5X solo se gli scarti sono 0', () => {
    const hand: EvaluatedHand = {
      type: 'high_card',
      displayName: 'High Card',
      scoringCards: [makeCard('hearts', 10)],
      baseChips: 5,
      baseMult: 2,
    };
    const ctxNoDiscards: JokerScoringContext = {
      cards: hand.scoringCards,
      evaluatedHand: hand,
      currentChips: 15,
      currentMult: 2,
      discardsUsedThisRound: 0,
      handsRemaining: 4,
      money: 4,
    };

    const resHonored = evaluateJokers([JOKERS_ROSTER.knight_errant], 15, 2, ctxNoDiscards);
    expect(resHonored.multipliedMult).toBe(1.5);
    expect(resHonored.totalMult).toBe(3); // 2 * 1.5

    const ctxWithDiscards: JokerScoringContext = {
      ...ctxNoDiscards,
      discardsUsedThisRound: 1,
    };
    const resDishonored = evaluateJokers([JOKERS_ROSTER.knight_errant], 15, 2, ctxWithDiscards);
    expect(resDishonored.multipliedMult).toBe(1);
    expect(resDishonored.totalMult).toBe(2);
  });

  it("L'Usuraio di Borgo dovrebbe conferire +$2 per ogni mano rimanente alla vittoria", () => {
    const usurer = JOKERS_ROSTER.village_usurer;
    const res = usurer.onBlindWon?.({
      handsRemaining: 3,
      discardsRemaining: 2,
      money: 10,
      ante: 1,
    });
    expect(res?.addMoney).toBe(6); // 3 * 2
  });

  it('dovrebbe calcolare correttamente il punteggio combinato con molteplici Joker', () => {
    // Due Joker combinati: Giullare (+4 mult) e Balestriere (+30 chips su Pair)
    const pairHand: EvaluatedHand = {
      type: 'pair',
      displayName: 'Pair',
      scoringCards: [makeCard('clubs', 10), makeCard('spades', 10)], // 10 + 10 = 20
      baseChips: 10,
      baseMult: 2,
    };
    // Base Chips = 10, Carte = 20 -> 30 Chips.
    // Balestriere: +30 Chips -> 60 Chips totali.
    // Base Mult = 2, Giullare: +4 Mult -> 6 Mult totali.
    // Finale: 60 * 6 = 360 Punti.
    const res = calculateScore(pairHand, undefined, [
      JOKERS_ROSTER.marksman_crossbow,
      JOKERS_ROSTER.court_jester,
    ]);

    expect(res.jokerChips).toBe(30);
    expect(res.totalChips).toBe(60);
    expect(res.jokerMult).toBe(4);
    expect(res.totalMult).toBe(6);
    expect(res.finalScore).toBe(360);
  });
});

