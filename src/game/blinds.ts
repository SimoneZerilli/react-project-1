import type { Blind, BlindTagReward, BossRule } from './types';

// Curve di punteggio base rilassate per le 8 Ante
export const ANTE_BASE_SCORES: Record<number, number> = {
  1: 300,
  2: 800,
  3: 2000,
  4: 5000,
  5: 11000,
  6: 20000,
  7: 35000,
  8: 50000,
};

// Catalogo Boss Rules originali medievali per Ante 1-8
export const BOSS_RULES: Record<number, BossRule> = {
  1: {
    id: 'executioner_blade',
    name: 'Lama del Boia',
    description: 'Le carte di Cuori sono dissanguate e non conferiscono Chips nominali.',
  },
  2: {
    id: 'thorn_shroud',
    name: 'Cappa di Spine',
    description: 'La taverna stringe la morsa: si inizia il round con 1 Discard in meno.',
  },
  3: {
    id: 'iron_cage',
    name: 'Gabbia di Ferro',
    description: 'Spazio soffocante: la mano iniziale è ridotta a 7 carte invece di 8.',
  },
  4: {
    id: 'inquisitor_decree',
    name: 'Editto Inquisitorio',
    description: 'Le combinazioni semplici Pair e Two Pair non sono permesse.',
  },
  5: {
    id: 'corrupted_blood',
    name: 'Sangue Corrotto',
    description: 'Tutte le carte di Quadri e Fiori hanno il valore in Chips azzerato.',
  },
  6: {
    id: 'taxman_leech',
    name: 'Tassa del Siniscalco',
    description: 'Ogni scarto (Discard) costa $1 dalla borsa del giocatore.',
  },
  7: {
    id: 'grave_mist',
    name: 'Nebbia del Sepolcro',
    description: 'Le carte di Picche sono maledette e annullano i loro Chip.',
  },
  8: {
    id: 'tavern_tyrant',
    name: 'Il Tiranno della Taverna',
    description: 'La sfida finale: obiettivo aumentato a 2.5X e solo 3 Mani giocabili.',
  },
};

// Catalogo Skip Tags originali
export const SKIP_TAGS: BlindTagReward[] = [
  {
    id: 'tag_purse',
    name: 'Tag del Borsello',
    description: 'Ricevi immediatamente +$5 d\'oro nella borsa.',
    rewardMoney: 5,
  },
  {
    id: 'tag_loot',
    name: 'Tag del Saccheggiatore',
    description: 'Ricevi immediatamente +$8 d\'oro nella borsa.',
    rewardMoney: 8,
  },
  {
    id: 'tag_scout',
    name: 'Tag del Ricognitore',
    description: 'Conferisce +1 Discard addizionale per il prossimo Blind.',
    bonusDiscards: 1,
  },
  {
    id: 'tag_captain',
    name: 'Tag del Capitano',
    description: 'Conferisce +1 Hand addizionale per il prossimo Blind.',
    bonusHands: 1,
  },
];

/**
 * Restituisce il punteggio base per un determinato scaglione Ante (1..8).
 */
export function getBaseScoreForAnte(ante: number): number {
  const safeAnte = Math.max(1, Math.min(ante, 8));
  return ANTE_BASE_SCORES[safeAnte] ?? 300 * Math.pow(2.2, safeAnte - 1);
}

/**
 * Genera la terna di Blind per l'Ante corrente:
 * - Small Blind: base * 1.0 (skippabile per Tag)
 * - Big Blind: base * 1.5 (skippabile per Tag)
 * - Boss Blind: base * 2.0 (o 2.5 su Ante 8, non skippabile, con regola speciale)
 */
export function createAnteBlinds(ante: number): {
  small: Blind;
  big: Blind;
  boss: Blind;
} {
  const base = getBaseScoreForAnte(ante);
  const bossMultiplier = ante === 8 ? 2.5 : 2.0;

  // Assegna tag determinati o a rotazione
  const smallTag = SKIP_TAGS[(ante - 1) % SKIP_TAGS.length];
  const bigTag = SKIP_TAGS[(ante + 1) % SKIP_TAGS.length];

  const smallBlind: Blind = {
    type: 'small',
    title: 'Small Blind',
    scoreTarget: Math.round(base),
    rewardMoney: 3,
    canSkip: true,
    skipTag: smallTag,
  };

  const bigBlind: Blind = {
    type: 'big',
    title: 'Big Blind',
    scoreTarget: Math.round(base * 1.5),
    rewardMoney: 4,
    canSkip: true,
    skipTag: bigTag,
  };

  const bossRule = BOSS_RULES[ante] ?? BOSS_RULES[1];
  const bossBlind: Blind = {
    type: 'boss',
    title: `Boss Blind: ${bossRule.name}`,
    scoreTarget: Math.round(base * bossMultiplier),
    rewardMoney: 5,
    canSkip: false,
    bossRule,
  };

  return {
    small: smallBlind,
    big: bigBlind,
    boss: bossBlind,
  };
}

