export interface RunStatistics {
  handsPlayed: number;
  cardsDiscarded: number;
  totalGoldEarned: number;
  blindsWon: number;
  blindsSkipped: number;
  bestHandScore: number;
  bestHandName: string;
}

export function createInitialRunStats(): RunStatistics {
  return {
    handsPlayed: 0,
    cardsDiscarded: 0,
    totalGoldEarned: 4, // Oro iniziale
    blindsWon: 0,
    blindsSkipped: 0,
    bestHandScore: 0,
    bestHandName: 'Nessuna',
  };
}

export function recordPlayedHand(
  stats: RunStatistics,
  score: number,
  handName: string
): RunStatistics {
  const isNewBest = score > stats.bestHandScore;
  return {
    ...stats,
    handsPlayed: stats.handsPlayed + 1,
    bestHandScore: isNewBest ? score : stats.bestHandScore,
    bestHandName: isNewBest ? handName : stats.bestHandName,
  };
}

export function recordDiscardedCards(
  stats: RunStatistics,
  count: number
): RunStatistics {
  return {
    ...stats,
    cardsDiscarded: stats.cardsDiscarded + count,
  };
}

export function recordGoldEarned(
  stats: RunStatistics,
  amount: number
): RunStatistics {
  if (amount <= 0) return stats;
  return {
    ...stats,
    totalGoldEarned: stats.totalGoldEarned + amount,
  };
}

export function recordBlindWon(stats: RunStatistics): RunStatistics {
  return {
    ...stats,
    blindsWon: stats.blindsWon + 1,
  };
}

export function recordBlindSkipped(stats: RunStatistics): RunStatistics {
  return {
    ...stats,
    blindsSkipped: stats.blindsSkipped + 1,
  };
}

