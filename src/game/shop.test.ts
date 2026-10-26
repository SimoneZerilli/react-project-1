import { describe, it, expect } from 'vitest';
import {
  calculateInterest,
  createInitialHandLevels,
  upgradeHandLevel,
  generateShopItems,
} from './shop';
import { evaluateHand } from './handEvaluator';
import { JOKERS_ROSTER } from './jokers';
import type { PlayingCard } from './types';

function makeCard(rank: PlayingCard['rank']): PlayingCard {
  return {
    id: `c-${rank}-${Math.random()}`,
    suit: 'hearts',
    rank,
  };
}

describe('Economy and Shop Engine (src/game/shop.ts)', () => {
  it('dovrebbe calcolare correttamente la rendita da interesse (+$1 ogni $5, max $5)', () => {
    expect(calculateInterest(0)).toBe(0);
    expect(calculateInterest(4)).toBe(0);
    expect(calculateInterest(5)).toBe(1);
    expect(calculateInterest(9)).toBe(1);
    expect(calculateInterest(10)).toBe(2);
    expect(calculateInterest(19)).toBe(3);
    expect(calculateInterest(25)).toBe(5);
    expect(calculateInterest(60)).toBe(5); // Cap a $5
  });

  it('dovrebbe inizializzare e potenziare permanentemente i livelli delle combinazioni', () => {
    const levels = createInitialHandLevels();
    expect(levels.pair.level).toBe(1);
    expect(levels.pair.baseChips).toBe(10);
    expect(levels.pair.baseMult).toBe(2);

    const upgraded = upgradeHandLevel(levels, 'pair');
    expect(upgraded.pair.level).toBe(2);
    expect(upgraded.pair.baseChips).toBe(25); // 10 + 15
    expect(upgraded.pair.baseMult).toBe(3);   // 2 + 1
  });

  it('evaluateHand dovrebbe rispecchiare i livelli potenziati', () => {
    let levels = createInitialHandLevels();
    levels = upgradeHandLevel(levels, 'pair'); // Level 2: 25 chips, 3 mult

    const pairCards = [makeCard(8), makeCard(8)];
    const res = evaluateHand(pairCards, levels);
    expect(res.baseChips).toBe(25);
    expect(res.baseMult).toBe(3);
  });

  it('dovrebbe generare merci nel negozio senza proporre Jolly già posseduti', () => {
    const equipped = [JOKERS_ROSTER.court_jester, JOKERS_ROSTER.alchemist];
    const items = generateShopItems(equipped);

    expect(items.length).toBeGreaterThanOrEqual(3);
    const offeredJokerItems = items.filter((i) => i.type === 'joker');
    for (const item of offeredJokerItems) {
      expect(item.payload).not.toBe(JOKERS_ROSTER.court_jester);
      expect(item.payload).not.toBe(JOKERS_ROSTER.alchemist);
    }
  });
});

