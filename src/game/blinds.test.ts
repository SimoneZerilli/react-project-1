import { describe, it, expect } from 'vitest';
import {
  getBaseScoreForAnte,
  createAnteBlinds,
  BOSS_RULES,
  SKIP_TAGS,
} from './blinds';

describe('Blinds and Ante Progression Engine (src/game/blinds.ts)', () => {
  it('dovrebbe calcolare correttamente i punteggi base per le 8 Ante', () => {
    expect(getBaseScoreForAnte(1)).toBe(300);
    expect(getBaseScoreForAnte(2)).toBe(800);
    expect(getBaseScoreForAnte(3)).toBe(2000);
    expect(getBaseScoreForAnte(8)).toBe(50000);
  });

  it('dovrebbe generare i 3 Blind per Ante 1 con i corretti target e ricompense', () => {
    const { small, big, boss } = createAnteBlinds(1);

    // Small Blind
    expect(small.type).toBe('small');
    expect(small.scoreTarget).toBe(300);
    expect(small.rewardMoney).toBe(3);
    expect(small.canSkip).toBe(true);
    expect(small.skipTag).toBeDefined();

    // Big Blind
    expect(big.type).toBe('big');
    expect(big.scoreTarget).toBe(450); // 300 * 1.5
    expect(big.rewardMoney).toBe(4);
    expect(big.canSkip).toBe(true);
    expect(big.skipTag).toBeDefined();

    // Boss Blind
    expect(boss.type).toBe('boss');
    expect(boss.scoreTarget).toBe(600); // 300 * 2.0
    expect(boss.rewardMoney).toBe(5);
    expect(boss.canSkip).toBe(false);
    expect(boss.bossRule?.name).toBe('Lama del Boia');
  });

  it('dovrebbe calcolare il Boss Blind di Ante 8 a 2.5X e applicare il Tiranno della Taverna', () => {
    const { boss } = createAnteBlinds(8);
    expect(boss.scoreTarget).toBe(125000); // 50000 * 2.5
    expect(boss.bossRule?.name).toBe('Il Tiranno della Taverna');
    expect(boss.canSkip).toBe(false);
  });

  it('dovrebbe possedere 8 regole boss uniche per ciascuna delle 8 Ante', () => {
    for (let ante = 1; ante <= 8; ante++) {
      const rule = BOSS_RULES[ante];
      expect(rule).toBeDefined();
      expect(rule.name.length).toBeGreaterThan(0);
      expect(rule.description.length).toBeGreaterThan(0);
    }
  });

  it('dovrebbe possedere Skip Tags con ricompense valide e descrizioni', () => {
    expect(SKIP_TAGS.length).toBeGreaterThanOrEqual(4);
    for (const tag of SKIP_TAGS) {
      expect(tag.name).toBeDefined();
      expect(tag.description).toBeDefined();
      const hasReward = tag.rewardMoney !== undefined || tag.bonusDiscards !== undefined || tag.bonusHands !== undefined;
      expect(hasReward).toBe(true);
    }
  });
});

