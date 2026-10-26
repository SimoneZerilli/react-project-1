import type { EvaluatedHand, HandType, PlayingCard, Rank } from './types';

export interface HandBaseStats {
  displayName: string;
  baseChips: number;
  baseMult: number;
}

export const BASE_HAND_STATS: Record<HandType, HandBaseStats> = {
  high_card: {
    displayName: 'High Card',
    baseChips: 5,
    baseMult: 1,
  },
  pair: {
    displayName: 'Pair',
    baseChips: 10,
    baseMult: 2,
  },
  two_pair: {
    displayName: 'Two Pair',
    baseChips: 20,
    baseMult: 2,
  },
  three_of_a_kind: {
    displayName: 'Three of a Kind',
    baseChips: 30,
    baseMult: 3,
  },
  straight: {
    displayName: 'Straight',
    baseChips: 30,
    baseMult: 4,
  },
  flush: {
    displayName: 'Flush',
    baseChips: 35,
    baseMult: 4,
  },
  full_house: {
    displayName: 'Full House',
    baseChips: 40,
    baseMult: 4,
  },
  four_of_a_kind: {
    displayName: 'Four of a Kind',
    baseChips: 60,
    baseMult: 7,
  },
  straight_flush: {
    displayName: 'Straight Flush',
    baseChips: 100,
    baseMult: 8,
  },
};

/**
 * Verifica se un array di 5 carte ordinate per rango forma una scala numerica.
 * Gestisce sia scale regolari (es. 9-10-J-Q-K) che la scala minima con Asso (A-2-3-4-5).
 */
function isStraightSequence(sortedUniqueRanks: Rank[]): boolean {
  if (sortedUniqueRanks.length !== 5) return false;

  // Scala regolare: ogni elemento successivo differisce di 1
  const isRegular =
    sortedUniqueRanks[1] === sortedUniqueRanks[0] + 1 &&
    sortedUniqueRanks[2] === sortedUniqueRanks[1] + 1 &&
    sortedUniqueRanks[3] === sortedUniqueRanks[2] + 1 &&
    sortedUniqueRanks[4] === sortedUniqueRanks[3] + 1;

  if (isRegular) return true;

  // Scala con Asso basso: 2, 3, 4, 5, 14 (Asso)
  const isAceLow =
    sortedUniqueRanks[0] === 2 &&
    sortedUniqueRanks[1] === 3 &&
    sortedUniqueRanks[2] === 4 &&
    sortedUniqueRanks[3] === 5 &&
    sortedUniqueRanks[4] === 14;

  return isAceLow;
}

/**
 * Valuta un insieme di carte (da 1 a 5) e restituisce la mano di poker più forte,
 * insieme alle carte effettive che concorrono al calcolo dei punti.
 */
export function evaluateHand(cards: readonly PlayingCard[]): EvaluatedHand {
  if (cards.length === 0) {
    return {
      type: 'high_card',
      displayName: 'Nessuna carta',
      scoringCards: [],
      baseChips: 0,
      baseMult: 0,
    };
  }

  // Raggruppa le carte per rango
  const rankGroups = new Map<Rank, PlayingCard[]>();
  for (const card of cards) {
    const group = rankGroups.get(card.rank) || [];
    group.push(card);
    rankGroups.set(card.rank, group);
  }

  // Ordina i gruppi per dimensione decrescente, e a parità per valore di rango decrescente
  const sortedGroups = Array.from(rankGroups.entries()).sort((a, b) => {
    if (b[1].length !== a[1].length) {
      return b[1].length - a[1].length;
    }
    return b[0] - a[0];
  });

  // Ordina le carte selezionate per rango crescente
  const sortedCards = [...cards].sort((a, b) => a.rank - b.rank);
  const uniqueRanks = Array.from(new Set(sortedCards.map((c) => c.rank)));

  const is5Cards = cards.length === 5;
  const isFlush = is5Cards && cards.every((c) => c.suit === cards[0].suit);
  const isStraight = is5Cards && isStraightSequence(uniqueRanks);

  // 1. Straight Flush
  if (isStraight && isFlush) {
    return {
      type: 'straight_flush',
      displayName: BASE_HAND_STATS.straight_flush.displayName,
      scoringCards: [...cards],
      baseChips: BASE_HAND_STATS.straight_flush.baseChips,
      baseMult: BASE_HAND_STATS.straight_flush.baseMult,
    };
  }

  // 2. Four of a Kind (Poker)
  if (sortedGroups[0][1].length === 4) {
    return {
      type: 'four_of_a_kind',
      displayName: BASE_HAND_STATS.four_of_a_kind.displayName,
      scoringCards: sortedGroups[0][1],
      baseChips: BASE_HAND_STATS.four_of_a_kind.baseChips,
      baseMult: BASE_HAND_STATS.four_of_a_kind.baseMult,
    };
  }

  // 3. Full House (Tris + Coppia)
  if (sortedGroups[0][1].length === 3 && sortedGroups[1]?.[1].length >= 2) {
    return {
      type: 'full_house',
      displayName: BASE_HAND_STATS.full_house.displayName,
      scoringCards: [...sortedGroups[0][1], ...sortedGroups[1][1].slice(0, 2)],
      baseChips: BASE_HAND_STATS.full_house.baseChips,
      baseMult: BASE_HAND_STATS.full_house.baseMult,
    };
  }

  // 4. Flush (Colore)
  if (isFlush) {
    return {
      type: 'flush',
      displayName: BASE_HAND_STATS.flush.displayName,
      scoringCards: [...cards],
      baseChips: BASE_HAND_STATS.flush.baseChips,
      baseMult: BASE_HAND_STATS.flush.baseMult,
    };
  }

  // 5. Straight (Scala)
  if (isStraight) {
    return {
      type: 'straight',
      displayName: BASE_HAND_STATS.straight.displayName,
      scoringCards: [...cards],
      baseChips: BASE_HAND_STATS.straight.baseChips,
      baseMult: BASE_HAND_STATS.straight.baseMult,
    };
  }

  // 6. Three of a Kind (Tris)
  if (sortedGroups[0][1].length === 3) {
    return {
      type: 'three_of_a_kind',
      displayName: BASE_HAND_STATS.three_of_a_kind.displayName,
      scoringCards: sortedGroups[0][1],
      baseChips: BASE_HAND_STATS.three_of_a_kind.baseChips,
      baseMult: BASE_HAND_STATS.three_of_a_kind.baseMult,
    };
  }

  // 7. Two Pair (Doppia Coppia)
  if (sortedGroups[0][1].length === 2 && sortedGroups[1]?.[1].length === 2) {
    return {
      type: 'two_pair',
      displayName: BASE_HAND_STATS.two_pair.displayName,
      scoringCards: [...sortedGroups[0][1], ...sortedGroups[1][1]],
      baseChips: BASE_HAND_STATS.two_pair.baseChips,
      baseMult: BASE_HAND_STATS.two_pair.baseMult,
    };
  }

  // 8. Pair (Coppia)
  if (sortedGroups[0][1].length === 2) {
    return {
      type: 'pair',
      displayName: BASE_HAND_STATS.pair.displayName,
      scoringCards: sortedGroups[0][1],
      baseChips: BASE_HAND_STATS.pair.baseChips,
      baseMult: BASE_HAND_STATS.pair.baseMult,
    };
  }

  // 9. High Card (Carta Alta) - conta la carta con il rango più alto
  const highestCard = sortedCards[sortedCards.length - 1];
  return {
    type: 'high_card',
    displayName: BASE_HAND_STATS.high_card.displayName,
    scoringCards: [highestCard],
    baseChips: BASE_HAND_STATS.high_card.baseChips,
    baseMult: BASE_HAND_STATS.high_card.baseMult,
  };
}

