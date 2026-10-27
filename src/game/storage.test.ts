import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveRunState,
  loadRunState,
  clearRunState,
  STORAGE_KEY,
  type SavedRunState,
} from './storage';
import { createInitialHandLevels } from './shop';
import { createInitialRunStats } from './runStats';
import { createAnteBlinds } from './blinds';

describe('Storage Engine (src/game/storage.ts)', () => {
  const dummyState: SavedRunState = {
    version: 1,
    ante: 2,
    phase: 'select_blind',
    activeBlindType: 'small',
    money: 18,
    handLevels: createInitialHandLevels(),
    equippedJokerIds: ['court_jester', 'alchemist'],
    runStats: createInitialRunStats(),
    currentBlind: createAnteBlinds(2).small,
    score: 0,
    handsRemaining: 4,
    discardsRemaining: 4,
    startingDiscards: 4,
    deck: [],
    hand: [],
    discardPile: [],
    pendingBonusDiscards: 0,
    pendingBonusHands: 0,
  };

  beforeEach(() => {
    // Mock di localStorage in ambiente di test
    const store = new Map<string, string>();
    globalThis.localStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      length: store.size,
    };
  });

  it('dovrebbe salvare e ricaricare correttamente una run valida', () => {
    const savedOk = saveRunState(dummyState);
    expect(savedOk).toBe(true);

    const loaded = loadRunState();
    expect(loaded).not.toBeNull();
    expect(loaded?.ante).toBe(2);
    expect(loaded?.money).toBe(18);
    expect(loaded?.equippedJokerIds).toEqual(['court_jester', 'alchemist']);
  });

  it('dovrebbe restituire null se lo storage è vuoto o corrotto', () => {
    expect(loadRunState()).toBeNull();

    localStorage.setItem(STORAGE_KEY, 'invalid-json-string');
    expect(loadRunState()).toBeNull();

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 999 }));
    expect(loadRunState()).toBeNull();
  });

  it('dovrebbe cancellare la run salvata con clearRunState', () => {
    saveRunState(dummyState);
    expect(loadRunState()).not.toBeNull();

    clearRunState();
    expect(loadRunState()).toBeNull();
  });
});
