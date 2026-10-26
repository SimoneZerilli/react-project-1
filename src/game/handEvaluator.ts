import type { EvaluatedHand, HandLevelInfo, HandType, PlayingCard, Rank } from './types';

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

function getHandStats(
  type: HandType,
  handLevels?: Record<HandType, HandLevelInfo>
): { baseChips: number; baseMult: number } {
  if (handLevels && handLevels[type]) {
    return {
      baseChips: handLevels[type].baseChips,
      baseMult: handLevels[type].baseMult,
    };
  }
  return {
    baseChips: BASE_HAND_STATS[type].baseChips,
    baseMult: BASE_HAND_STATS[type].baseMult,
  };
}

function isStraightSequence(sortedUniqueRanks: Rank[]): boolean {
  if (sortedUniqueRanks.length !== 5) return false;

  const isRegular =
    sortedUniqueRanks[1] === sortedUniqueRanks[0] + 1 &&
    sortedUniqueRanks[2] === sortedUniqueRanks[1] + 1 &&
    sortedUniqueRanks[3] === sortedUniqueRanks[2] + 1 &&
    sortedUniqueRanks[4] === sortedUniqueRanks[3] + 1;

  if (isRegular) return true;

  const isAceLow =
    sortedUniqueRanks[0] === 2 &&
    sortedUniqueRanks[1] === 3 &&
    sortedUniqueRanks[2] === 4 &&
    sortedUniqueRanks[3] === 5 &&
    sortedUniqueRanks[4] === 14;

  return isAceLow;
}

/**
 * Valuta un insieme di carte (da 1 a 5) e restituisce la combinazione più forte,
 * tenendo conto dei livelli di potenziamento correnti delle mani.
 */
export function evaluateHand(
  cards: readonly PlayingCard[],
  handLevels?: Record<HandType, HandLevelInfo>
): EvaluatedHand {
  if (cards.length === 0) {
    return {
      type: 'high_card',
      displayName: 'Nessuna carta',
      scoringCards: [],
      baseChips: 0,
      baseMult: 0,
    };
  }

  const rankGroups = new Map<Rank, PlayingCard[]>();
  for (const card of cards) {
    const group = rankGroups.get(card.rank) || [];
    group.push(card);
    rankGroups.set(card.rank, group);
  }

  const sortedGroups = Array.from(rankGroups.entries()).sort((a, b) => {
    if (b[1].length !== a[1].length) {
      return b[1].length - a[1].length;
    }
    return b[0] - a[0];
  });

  const sortedCards = [...cards].sort((a, b) => a.rank - b.rank);
  const uniqueRanks = Array.from(new Set(sortedCards.map((c) => c.rank)));

  const is5Cards = cards.length === 5;
  const isFlush = is5Cards && cards.every((c) => c.suit === cards[0].suit);
  const isStraight = is5Cards && isStraightSequence(uniqueRanks);

  // 1. Straight Flush
  if (isStraight && isFlush) {
    const stats = getHandStats('straight_flush', handLevels);
    return {
      type: 'straight_flush',
      displayName: BASE_HAND_STATS.straight_flush.displayName,
      scoringCards: [...cards],
      baseChips: stats.baseChips,
      baseMult: stats.baseMult,
    };
  }

  // 2. Four of a Kind
  if (sortedGroups[0][1].length === 4) {
    const stats = getHandStats('four_of_a_kind', handLevels);
    return {
      type: 'four_of_a_kind',
      displayName: BASE_HAND_STATS.four_of_a_kind.displayName,
      scoringCards: sortedGroups[0][1],
      baseChips: stats.baseChips,
      baseMult: stats.baseMult,
    };
  }

  // 3. Full House
  if (sortedGroups[0][1].length === 3 && sortedGroups[1]?.[1].length >= 2) {
    const stats = getHandStats('full_house', handLevels);
    return {
      type: 'full_house',
      displayName: BASE_HAND_STATS.full_house.displayName,
      scoringCards: [...sortedGroups[0][1], ...sortedGroups[1][1].slice(0, 2)],
      baseChips: stats.baseChips,
      baseMult: stats.baseMult,
    };
  }

  // 4. Flush
  if (isFlush) {
    const stats = getHandStats('flush', handLevels);
    return {
      type: 'flush',
      displayName: BASE_HAND_STATS.flush.displayName,
      scoringCards: [...cards],
      baseChips: stats.baseChips,
      baseMult: stats.baseMult,
    };
  }

  // 5. Straight
  if (isStraight) {
    const stats = getHandStats('straight', handLevels);
    return {
      type: 'straight',
      displayName: BASE_HAND_STATS.straight.displayName,
      scoringCards: [...cards],
      baseChips: stats.baseChips,
      baseMult: stats.baseMult,
    };
  }

  // 6. Three of a Kind
  if (sortedGroups[0][1].length === 3) {
    const stats = getHandStats('three_of_a_kind', handLevels);
    return {
      type: 'three_of_a_kind',
      displayName: BASE_HAND_STATS.three_of_a_kind.displayName,
      scoringCards: sortedGroups[0][1],
      baseChips: stats.baseChips,
      baseMult: stats.baseMult,
    };
  }

  // 7. Two Pair
  if (sortedGroups[0][1].length === 2 && sortedGroups[1]?.[1].length === 2) {
    const stats = getHandStats('two_pair', handLevels);
    return {
      type: 'two_pair',
      displayName: BASE_HAND_STATS.two_pair.displayName,
      scoringCards: [...sortedGroups[0][1], ...sortedGroups[1][1]],
      baseChips: stats.baseChips,
      baseMult: stats.baseMult,
    };
  }

  // 8. Pair
  if (sortedGroups[0][1].length === 2) {
    const stats = getHandStats('pair', handLevels);
    return {
      type: 'pair',
      displayName: BASE_HAND_STATS.pair.displayName,
      scoringCards: sortedGroups[0][1],
      baseChips: stats.baseChips,
      baseMult: stats.baseMult,
    };
  }

  // 9. High Card
  const stats = getHandStats('high_card', handLevels);
  const highestCard = sortedCards[sortedCards.length - 1];
  return {
    type: 'high_card',
    displayName: BASE_HAND_STATS.high_card.displayName,
    scoringCards: [highestCard],
    baseChips: stats.baseChips,
    baseMult: stats.baseMult,
  };
}
