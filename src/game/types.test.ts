import { describe, it, expect } from 'vitest';
import type { PlayingCard, HandType } from './types';

describe('Balcard Types & Setup Sanity', () => {
  it('dovrebbe supportare la corretta modellazione di una carta da gioco', () => {
    const card: PlayingCard = {
      id: 'hearts-14-1',
      suit: 'hearts',
      rank: 14,
    };
    expect(card.suit).toBe('hearts');
    expect(card.rank).toBe(14);
  });

  it('dovrebbe includere tutti i tipi di mano di poker supportati', () => {
    const hands: HandType[] = [
      'high_card',
      'pair',
      'two_pair',
      'three_of_a_kind',
      'straight',
      'flush',
      'full_house',
      'four_of_a_kind',
      'straight_flush',
    ];
    expect(hands).toHaveLength(9);
  });
});

