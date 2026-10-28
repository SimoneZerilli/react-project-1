import type { PlayingCard, Rank, Suit } from './types';

export const ALL_SUITS: readonly Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'] as const;

export const ALL_RANKS: readonly Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const;

/**
 * Converte il valore numerico del rango nella stringa visualizzata (es. 14 -> 'A', 11 -> 'J').
 */
export function formatRank(rank: Rank): string {
  switch (rank) {
    case 14:
      return 'A';
    case 13:
      return 'K';
    case 12:
      return 'Q';
    case 11:
      return 'J';
    default:
      return String(rank);
  }
}

/**
 * Restituisce il nome per esteso del rango per lo screen reader (es. 12 -> 'Regina'/'Queen').
 */
export function getRankFullName(rank: Rank, lang: 'en' | 'it' = 'en'): string {
  switch (rank) {
    case 14:
      return lang === 'it' ? 'Asso' : 'Ace';
    case 13:
      return lang === 'it' ? 'Re' : 'King';
    case 12:
      return lang === 'it' ? 'Regina' : 'Queen';
    case 11:
      return lang === 'it' ? 'Fante' : 'Jack';
    default:
      return String(rank);
  }
}

/**
 * Converte il nome del seme in una sigla testuale pulita (senza emoji).
 */
export function getSuitLabel(suit: Suit): string {
  switch (suit) {
    case 'hearts':
      return 'CUORI';
    case 'diamonds':
      return 'QUADRI';
    case 'clubs':
      return 'FIORI';
    case 'spades':
      return 'PICCHE';
  }
}

/**
 * Sigla breve in inglese per il seme (senza emoji).
 */
export function getSuitAbbreviation(suit: Suit): string {
  switch (suit) {
    case 'hearts':
      return 'H';
    case 'diamonds':
      return 'D';
    case 'clubs':
      return 'C';
    case 'spades':
      return 'S';
  }
}

/**
 * Restituisce il percorso dell'immagine ritagliata dallo sprite sheet pixel medievale.
 */
export function getCardImagePath(card: PlayingCard): string {
  return `/cards/${card.suit}-${card.rank}.png`;
}

/**
 * Calcola i chip base conferiti dalla carta in base al suo rango nominale:
 * - 2..10: valore nominale
 * - J, Q, K: 10 chip
 * - Asso: 11 chip
 */
export function getCardBaseChips(rank: Rank): number {
  if (rank === 14) return 11;
  if (rank >= 10) return 10;
  return rank;
}

/**
 * Ordina una mano di carte per valore (rango), dal più alto al più basso.
 * A parità di rango, ordina per seme (Picche, Cuori, Fiori, Quadri).
 */
export function sortCardsByRank(cards: readonly PlayingCard[], descending: boolean = true): PlayingCard[] {
  const suitOrder: Record<Suit, number> = { spades: 4, hearts: 3, clubs: 2, diamonds: 1 };
  return [...cards].sort((a, b) => {
    if (a.rank !== b.rank) {
      return descending ? b.rank - a.rank : a.rank - b.rank;
    }
    return suitOrder[b.suit] - suitOrder[a.suit];
  });
}

/**
 * Ordina una mano di carte per seme (Picche, Cuori, Fiori, Quadri).
 * A parità di seme, ordina per rango decrescente.
 */
export function sortCardsBySuit(cards: readonly PlayingCard[]): PlayingCard[] {
  const suitOrder: Record<Suit, number> = { spades: 1, hearts: 2, clubs: 3, diamonds: 4 };
  return [...cards].sort((a, b) => {
    if (a.suit !== b.suit) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return b.rank - a.rank;
  });
}

/**
 * Genera un mazzo standard ordinato di 52 carte.
 */
export function createStandardDeck(): PlayingCard[] {
  const deck: PlayingCard[] = [];
  for (const suit of ALL_SUITS) {
    for (const rank of ALL_RANKS) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
      });
    }
  }
  return deck;
}

/**
 * Mescola il mazzo usando l'algoritmo Fisher-Yates in modo puramente immutabile.
 * È possibile passare una funzione rng personalizzata per determinismo nei test.
 */
export function shuffleDeck(
  deck: readonly PlayingCard[],
  rng: () => number = Math.random
): PlayingCard[] {
  const result = [...deck];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Estrae fino a `count` carte dalla cima del mazzo.
 * Restituisce le carte pescate e il nuovo mazzo rimanente, senza mutazioni.
 */
export function drawCards(
  deck: readonly PlayingCard[],
  count: number
): { drawn: PlayingCard[]; remaining: PlayingCard[] } {
  const safeCount = Math.max(0, Math.min(count, deck.length));
  const drawn = deck.slice(0, safeCount);
  const remaining = deck.slice(safeCount);
  return { drawn, remaining };
}

