import { describe, it, expect } from 'vitest';
import {
  createInitialRunStats,
  recordPlayedHand,
  recordDiscardedCards,
  recordGoldEarned,
  recordBlindWon,
  recordBlindSkipped,
} from './runStats';

describe('Run Statistics Engine (src/game/runStats.ts)', () => {
  it('dovrebbe inizializzare correttamente le statistiche della run', () => {
    const stats = createInitialRunStats();
    expect(stats.handsPlayed).toBe(0);
    expect(stats.cardsDiscarded).toBe(0);
    expect(stats.totalGoldEarned).toBe(4);
    expect(stats.blindsWon).toBe(0);
    expect(stats.blindsSkipped).toBe(0);
    expect(stats.bestHandScore).toBe(0);
  });

  it('dovrebbe aggiornare le mani giocate e il record di punteggio', () => {
    let stats = createInitialRunStats();
    stats = recordPlayedHand(stats, 150, 'Pair');
    expect(stats.handsPlayed).toBe(1);
    expect(stats.bestHandScore).toBe(150);
    expect(stats.bestHandName).toBe('Pair');

    // Mano successiva inferiore: non sovrascrive il record
    stats = recordPlayedHand(stats, 80, 'High Card');
    expect(stats.handsPlayed).toBe(2);
    expect(stats.bestHandScore).toBe(150);
    expect(stats.bestHandName).toBe('Pair');

    // Mano successiva superiore: nuovo record
    stats = recordPlayedHand(stats, 520, 'Full House');
    expect(stats.handsPlayed).toBe(3);
    expect(stats.bestHandScore).toBe(520);
    expect(stats.bestHandName).toBe('Full House');
  });

  it('dovrebbe accumulare le carte scartate e l\'oro guadagnato', () => {
    let stats = createInitialRunStats();
    stats = recordDiscardedCards(stats, 5);
    stats = recordDiscardedCards(stats, 3);
    expect(stats.cardsDiscarded).toBe(8);

    stats = recordGoldEarned(stats, 12);
    expect(stats.totalGoldEarned).toBe(16); // 4 iniziale + 12
  });

  it('dovrebbe incrementare i blind vinti e saltati', () => {
    let stats = createInitialRunStats();
    stats = recordBlindWon(stats);
    stats = recordBlindWon(stats);
    stats = recordBlindSkipped(stats);

    expect(stats.blindsWon).toBe(2);
    expect(stats.blindsSkipped).toBe(1);
  });
});

