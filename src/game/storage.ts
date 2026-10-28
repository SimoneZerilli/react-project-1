import type {
  Blind,
  GamePhase,
  HandLevelInfo,
  HandType,
  PlayingCard,
} from './types';
import type { RunStatistics } from './runStats';
import { JOKERS_ROSTER } from './jokers';

export const STORAGE_KEY = 'balcard_active_run_v2';

export interface SavedRunState {
  version: number;
  ante: number;
  phase: GamePhase;
  activeBlindType: 'small' | 'big' | 'boss';
  money: number;
  handLevels: Record<HandType, HandLevelInfo>;
  equippedJokerIds: string[];
  runStats: RunStatistics;
  currentBlind: Blind;
  score: number;
  handsRemaining: number;
  discardsRemaining: number;
  startingDiscards: number;
  deck: PlayingCard[];
  hand: PlayingCard[];
  discardPile: PlayingCard[];
  pendingBonusDiscards: number;
  pendingBonusHands: number;
}

/**
 * Salva lo stato corrente della run in localStorage.
 * Gestisce in sicurezza eventuali restrizioni o quote superate.
 */
export function saveRunState(state: SavedRunState): boolean {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch {
    return false;
  }
}

/**
 * Carica e convalida lo stato della run da localStorage.
 * Restituisce null se non esiste salvataggio o se i dati sono corrotti.
 */
export function loadRunState(): SavedRunState | null {
  try {
    // Rimuove vecchie versioni obsolete se presenti
    localStorage.removeItem('balcard_active_run_v1');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SavedRunState;
    if (!parsed || parsed.version !== 2 || !parsed.ante || !parsed.handLevels) {
      return null;
    }

    // Ricostruzione sicura: verifica che i Joker salvati esistano nel catalogo
    const validJokerIds = parsed.equippedJokerIds.filter((id) => JOKERS_ROSTER[id] !== undefined);
    parsed.equippedJokerIds = validJokerIds;

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Rimuove il salvataggio locale (usato in caso di Game Over, Vittoria o abbandono partita).
 */
export function clearRunState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('balcard_active_run_v1');
  } catch {
    // Ignora errori di storage non disponibile
  }
}

