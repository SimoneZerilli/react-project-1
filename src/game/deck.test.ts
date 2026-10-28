import { describe, it, expect } from 'vitest';
import {
  createStandardDeck,
  shuffleDeck,
  drawCards,
  formatRank,
  getCardBaseChips,
  getSuitLabel,
  getSuitAbbreviation,
  getRankFullName,
  sortCardsByRank,
  sortCardsBySuit,
} from './deck';

describe('Deck Logic (src/game/deck.ts)', () => {
  it('dovrebbe creare un mazzo standard di 52 carte uniche', () => {
    const deck = createStandardDeck();
    expect(deck).toHaveLength(52);

    const ids = new Set(deck.map((c) => c.id));
    expect(ids.size).toBe(52);

    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    for (const suit of suits) {
      const cardsOfSuit = deck.filter((c) => c.suit === suit);
      expect(cardsOfSuit).toHaveLength(13);
    }
  });

  it('dovrebbe formattare correttamente i ranghi e calcolare i chip base', () => {
    expect(formatRank(14)).toBe('A');
    expect(formatRank(13)).toBe('K');
    expect(formatRank(12)).toBe('Q');
    expect(formatRank(11)).toBe('J');
    expect(formatRank(10)).toBe('10');
    expect(formatRank(2)).toBe('2');

    expect(getCardBaseChips(14)).toBe(11); // Asso
    expect(getCardBaseChips(13)).toBe(10); // King
    expect(getCardBaseChips(12)).toBe(10); // Queen
    expect(getCardBaseChips(11)).toBe(10); // Jack
    expect(getCardBaseChips(10)).toBe(10); // 10
    expect(getCardBaseChips(7)).toBe(7);   // 7
    expect(getCardBaseChips(2)).toBe(2);   // 2
  });

  it('dovrebbe restituire etichette e abbreviazioni dei semi senza alcuna emoji', () => {
    expect(getSuitLabel('hearts')).toBe('CUORI');
    expect(getSuitLabel('diamonds')).toBe('QUADRI');
    expect(getSuitLabel('clubs')).toBe('FIORI');
    expect(getSuitLabel('spades')).toBe('PICCHE');

    expect(getSuitAbbreviation('hearts')).toBe('H');
    expect(getSuitAbbreviation('diamonds')).toBe('D');
    expect(getSuitAbbreviation('clubs')).toBe('C');
    expect(getSuitAbbreviation('spades')).toBe('S');
  });

  it('dovrebbe mescolare il mazzo senza alterarne la lunghezza o i duplicati', () => {
    const deck = createStandardDeck();
    // RNG deterministico per test
    let seed = 0.12345;
    const deterministicRng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const shuffled = shuffleDeck(deck, deterministicRng);
    expect(shuffled).toHaveLength(52);
    // Verifica che l'array originale non sia mutato
    expect(deck[0].id).toBe('hearts-2');
    // Verifica che l'ordine sia cambiato
    expect(shuffled.map((c) => c.id)).not.toEqual(deck.map((c) => c.id));
  });

  it('dovrebbe estrarre correttamente la mano di 8 carte e aggiornare il mazzo residuo', () => {
    const deck = createStandardDeck();
    const { drawn, remaining } = drawCards(deck, 8);

    expect(drawn).toHaveLength(8);
    expect(remaining).toHaveLength(44);
    expect(drawn[0].id).toBe(deck[0].id);
    expect(remaining[0].id).toBe(deck[8].id);
  });

  it('dovrebbe gestire in sicurezza estrazioni con richieste superiori al mazzo', () => {
    const deck = createStandardDeck().slice(0, 3);
    const { drawn, remaining } = drawCards(deck, 8);

    expect(drawn).toHaveLength(3);
    expect(remaining).toHaveLength(0);
  });

  it('dovrebbe formattare i nomi dei ranghi per esteso in italiano e inglese', () => {
    expect(getRankFullName(14, 'it')).toBe('Asso');
    expect(getRankFullName(13, 'it')).toBe('Re');
    expect(getRankFullName(12, 'it')).toBe('Regina');
    expect(getRankFullName(11, 'it')).toBe('Fante');
    expect(getRankFullName(10, 'it')).toBe('10');

    expect(getRankFullName(14, 'en')).toBe('Ace');
    expect(getRankFullName(13, 'en')).toBe('King');
    expect(getRankFullName(12, 'en')).toBe('Queen');
    expect(getRankFullName(11, 'en')).toBe('Jack');
  });

  it('dovrebbe ordinare le carte per valore/rango decrescente e seme', () => {
    const hand = [
      { id: 'c1', suit: 'hearts' as const, rank: 5 as const },
      { id: 'c2', suit: 'spades' as const, rank: 14 as const },
      { id: 'c3', suit: 'clubs' as const, rank: 10 as const },
      { id: 'c4', suit: 'hearts' as const, rank: 10 as const },
      { id: 'c5', suit: 'diamonds' as const, rank: 2 as const },
    ];

    const sorted = sortCardsByRank(hand);
    expect(sorted.map((c) => c.rank)).toEqual([14, 10, 10, 5, 2]);
    // Tra i due 10, Cuori viene prima di Fiori
    expect(sorted[1].suit).toBe('hearts');
    expect(sorted[2].suit).toBe('clubs');
  });

  it('dovrebbe ordinare le carte per seme e per rango decrescente', () => {
    const hand = [
      { id: 'c1', suit: 'hearts' as const, rank: 5 as const },
      { id: 'c2', suit: 'spades' as const, rank: 4 as const },
      { id: 'c3', suit: 'hearts' as const, rank: 14 as const },
      { id: 'c4', suit: 'clubs' as const, rank: 10 as const },
      { id: 'c5', suit: 'diamonds' as const, rank: 2 as const },
      { id: 'c6', suit: 'spades' as const, rank: 12 as const },
    ];

    const sorted = sortCardsBySuit(hand);
    expect(sorted.map((c) => c.suit)).toEqual(['spades', 'spades', 'hearts', 'hearts', 'clubs', 'diamonds']);
    expect(sorted[0].rank).toBe(12); // Spades Q
    expect(sorted[1].rank).toBe(4);  // Spades 4
    expect(sorted[2].rank).toBe(14); // Hearts A
    expect(sorted[3].rank).toBe(5);  // Hearts 5
  });
});

