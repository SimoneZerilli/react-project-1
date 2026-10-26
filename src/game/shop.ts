import type { HandLevelInfo, HandType, Joker, ShopItem } from './types';
import { BASE_HAND_STATS } from './handEvaluator';
import { ALL_JOKERS } from './jokers';

export const INITIAL_HAND_PROGRESSION: Record<
  HandType,
  { chipPerLevel: number; multPerLevel: number }
> = {
  high_card: { chipPerLevel: 10, multPerLevel: 1 },
  pair: { chipPerLevel: 15, multPerLevel: 1 },
  two_pair: { chipPerLevel: 20, multPerLevel: 1 },
  three_of_a_kind: { chipPerLevel: 20, multPerLevel: 2 },
  straight: { chipPerLevel: 30, multPerLevel: 2 },
  flush: { chipPerLevel: 15, multPerLevel: 2 },
  full_house: { chipPerLevel: 25, multPerLevel: 2 },
  four_of_a_kind: { chipPerLevel: 30, multPerLevel: 3 },
  straight_flush: { chipPerLevel: 40, multPerLevel: 3 },
};

export const HAND_NAMES_IT: Record<HandType, string> = {
  high_card: 'Carta Alta',
  pair: 'Coppia',
  two_pair: 'Doppia Coppia',
  three_of_a_kind: 'Tris',
  straight: 'Scala',
  flush: 'Colore',
  full_house: 'Full',
  four_of_a_kind: 'Poker',
  straight_flush: 'Scala Colore',
};

/**
 * Calcola l'interesse di taverna:
 * +$1 ogni $5 posseduti fino a un massimo di $5.
 */
export function calculateInterest(money: number): number {
  return Math.min(5, Math.floor(Math.max(0, money) / 5));
}

/**
 * Inizializza i livelli di tutte le combinazioni pokeristiche al Livello 1.
 */
export function createInitialHandLevels(): Record<HandType, HandLevelInfo> {
  const levels = {} as Record<HandType, HandLevelInfo>;
  for (const [type, stats] of Object.entries(BASE_HAND_STATS)) {
    const handType = type as HandType;
    const progression = INITIAL_HAND_PROGRESSION[handType];
    levels[handType] = {
      level: 1,
      baseChips: stats.baseChips,
      baseMult: stats.baseMult,
      chipPerLevel: progression.chipPerLevel,
      multPerLevel: progression.multPerLevel,
    };
  }
  return levels;
}

/**
 * Potenzia permanentemente una mano di poker di un livello.
 */
export function upgradeHandLevel(
  levels: Record<HandType, HandLevelInfo>,
  handType: HandType
): Record<HandType, HandLevelInfo> {
  const current = levels[handType];
  const newLevel = current.level + 1;
  return {
    ...levels,
    [handType]: {
      ...current,
      level: newLevel,
      baseChips: current.baseChips + current.chipPerLevel,
      baseMult: current.baseMult + current.multPerLevel,
    },
  };
}

/**
 * Genera l'assortimento del negozio:
 * - 2 Jolly non ancora equipaggiati
 * - 2 Pergamene di potenziamento mano a rotazione
 */
export function generateShopItems(
  equippedJokers: readonly Joker[],
  rng: () => number = Math.random
): ShopItem[] {
  const items: ShopItem[] = [];

  // 1. Selezione di 2 Jolly disponibili
  const availableJokers = ALL_JOKERS.filter(
    (j) => !equippedJokers.some((ej) => ej.id === j.id)
  );

  const shuffledJokers = [...availableJokers].sort(() => rng() - 0.5);
  const selectedJokers = shuffledJokers.slice(0, 2);

  for (const joker of selectedJokers) {
    items.push({
      id: `shop-joker-${joker.id}`,
      type: 'joker',
      name: joker.name,
      cost: joker.cost,
      description: joker.description,
      payload: joker,
    });
  }

  // 2. Selezione di 2 Pergamene di upgrade
  const allHands: HandType[] = [
    'high_card',
    'pair',
    'two_pair',
    'three_of_a_kind',
    'straight',
    'flush',
    'full_house',
    'four_of_a_kind',
  ];

  const shuffledHands = [...allHands].sort(() => rng() - 0.5);
  const selectedHands = shuffledHands.slice(0, 2);

  for (const handType of selectedHands) {
    const progression = INITIAL_HAND_PROGRESSION[handType];
    const name = BASE_HAND_STATS[handType].displayName;
    const itName = HAND_NAMES_IT[handType];

    items.push({
      id: `shop-upgrade-${handType}-${Math.floor(rng() * 1000)}`,
      type: 'hand_upgrade',
      name: `Pergamena: ${name}`,
      cost: 4,
      description: `Aumenta il livello di ${itName}: +${progression.chipPerLevel} Chips e +${progression.multPerLevel} Mult permanenti.`,
      payload: { handType },
    });
  }

  return items;
}

