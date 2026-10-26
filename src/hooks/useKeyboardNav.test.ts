import { describe, it, expect } from 'vitest';

describe('Roving Tabindex Math Logic', () => {
  function getNextIndex(current: number, delta: number, total: number, loop = true): number {
    if (total === 0) return 0;
    if (loop) {
      return (current + delta + total) % total;
    }
    return Math.max(0, Math.min(current + delta, total - 1));
  }

  it('dovrebbe calcolare correttamente il prossimo indice con loop', () => {
    expect(getNextIndex(0, 1, 8, true)).toBe(1);
    expect(getNextIndex(7, 1, 8, true)).toBe(0); // Scavalca la fine tornando all'inizio
    expect(getNextIndex(0, -1, 8, true)).toBe(7); // Scavalca l'inizio andando alla fine
  });

  it('dovrebbe calcolare correttamente il prossimo indice senza loop', () => {
    expect(getNextIndex(7, 1, 8, false)).toBe(7);
    expect(getNextIndex(0, -1, 8, false)).toBe(0);
  });
});

