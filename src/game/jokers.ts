import type { Joker, JokerScoringContext } from './types';

export const JOKERS_ROSTER: Record<string, Joker> = {
  court_jester: {
    id: 'court_jester',
    name: 'Il Giullare di Corte',
    description: '+4 Mult fisso su qualsiasi mano giocata.',
    rarity: 'common',
    cost: 4,
    sellValue: 2,
    onHandScoring: () => ({
      addMult: 4,
      message: '+4 Mult dal Giullare',
    }),
  },

  alchemist: {
    id: 'alchemist',
    name: "L'Alchimista",
    description: 'Ogni carta di Quadri a punteggio conferisce +3 Chips e +$1 d\'oro immediato.',
    rarity: 'rare',
    cost: 6,
    sellValue: 3,
    onHandScoring: (ctx) => {
      const diamondCount = ctx.evaluatedHand.scoringCards.filter((c) => c.suit === 'diamonds').length;
      if (diamondCount > 0) {
        return {
          addChips: diamondCount * 3,
          addMoney: diamondCount * 1,
          message: `+${diamondCount * 3} Chips e +$${diamondCount} d'oro da trasmutazione`,
        };
      }
      return null;
    },
  },

  royal_blacksmith: {
    id: 'royal_blacksmith',
    name: 'Il Fabbro Reale',
    description: '+15 Chips per ciascuna carta di Picche che concorre al punteggio.',
    rarity: 'common',
    cost: 5,
    sellValue: 2,
    onHandScoring: (ctx) => {
      const spadeCount = ctx.evaluatedHand.scoringCards.filter((c) => c.suit === 'spades').length;
      if (spadeCount > 0) {
        return {
          addChips: spadeCount * 15,
          message: `+${spadeCount * 15} Chips dal Fabbro`,
        };
      }
      return null;
    },
  },

  monk_scribe: {
    id: 'monk_scribe',
    name: 'Il Monaco Amanuense',
    description: '+8 Mult addizionale se la mano giocata è una Straight o Straight Flush.',
    rarity: 'common',
    cost: 5,
    sellValue: 2,
    onHandScoring: (ctx) => {
      if (ctx.evaluatedHand.type === 'straight' || ctx.evaluatedHand.type === 'straight_flush') {
        return {
          addMult: 8,
          message: '+8 Mult dal testo sacro del Monaco',
        };
      }
      return null;
    },
  },

  marksman_crossbow: {
    id: 'marksman_crossbow',
    name: 'Il Balestriere Scelto',
    description: '+30 Chips se la combinazione giocata è una Pair o Two Pair.',
    rarity: 'common',
    cost: 4,
    sellValue: 2,
    onHandScoring: (ctx) => {
      if (ctx.evaluatedHand.type === 'pair' || ctx.evaluatedHand.type === 'two_pair') {
        return {
          addChips: 30,
          message: '+30 Chips dalla mira del Balestriere',
        };
      }
      return null;
    },
  },

  knight_errant: {
    id: 'knight_errant',
    name: 'Il Cavaliere Errante',
    description: 'Moltiplica il Mult per 1.5X se non è stato effettuato alcuno scarto (Discard) nel round.',
    rarity: 'rare',
    cost: 7,
    sellValue: 3,
    onHandScoring: (ctx) => {
      if (ctx.discardsUsedThisRound === 0) {
        return {
          multiplyMult: 1.5,
          message: 'X1.5 Mult per onore cavalleresco (0 scarti)',
        };
      }
      return null;
    },
  },

  village_usurer: {
    id: 'village_usurer',
    name: "L'Usuraio di Borgo",
    description: 'Alla vittoria del Blind assegna +$2 addizionali per ogni mano (Hand) non utilizzata.',
    rarity: 'rare',
    cost: 6,
    sellValue: 3,
    onBlindWon: (ctx) => {
      if (ctx.handsRemaining > 0) {
        const bonus = ctx.handsRemaining * 2;
        return {
          addMoney: bonus,
          message: `+$${bonus} d'oro di usura riscatto (${ctx.handsRemaining} mani inutilizzate)`,
        };
      }
      return null;
    },
  },
};

export const ALL_JOKERS: Joker[] = Object.values(JOKERS_ROSTER);

export interface JokerTriggerDetail {
  id: string;
  name: string;
  message: string;
}

export interface JokerEvaluationResult {
  addedChips: number;
  addedMult: number;
  multipliedMult: number;
  totalChips: number;
  totalMult: number;
  bonusMoney: number;
  triggeredJokers: JokerTriggerDetail[];
}

/**
 * Pipeline in 2 fasi per l'applicazione dei Joker al calcolo del punteggio:
 * Fase 1: Somma di Chips e Mult additivi (+Chips, +Mult) e raccolta di oro istantaneo
 * Fase 2: Applicazione dei fattori moltiplicativi composti (X Mult)
 */
export function evaluateJokers(
  jokers: readonly Joker[],
  initialChips: number,
  initialMult: number,
  context: JokerScoringContext
): JokerEvaluationResult {
  let addedChips = 0;
  let addedMult = 0;
  let multipliedMult = 1.0;
  let bonusMoney = 0;
  const triggeredJokers: JokerTriggerDetail[] = [];

  // Fase 1: Addizione
  for (const joker of jokers) {
    if (!joker.onHandScoring) continue;
    const res = joker.onHandScoring({
      ...context,
      currentChips: initialChips + addedChips,
      currentMult: initialMult + addedMult,
    });

    if (res) {
      if (res.addChips) addedChips += res.addChips;
      if (res.addMult) addedMult += res.addMult;
      if (res.addMoney) bonusMoney += res.addMoney;
      if (res.message) {
        triggeredJokers.push({
          id: joker.id,
          name: joker.name,
          message: res.message,
        });
      }
    }
  }

  // Fase 2: Moltiplicazione composta
  const currentMult = initialMult + addedMult;
  for (const joker of jokers) {
    if (!joker.onHandScoring) continue;
    const res = joker.onHandScoring({
      ...context,
      currentChips: initialChips + addedChips,
      currentMult,
    });

    if (res && res.multiplyMult && res.multiplyMult > 1) {
      multipliedMult *= res.multiplyMult;
    }
  }

  const totalChips = initialChips + addedChips;
  const totalMult = Math.round(currentMult * multipliedMult * 10) / 10;

  return {
    addedChips,
    addedMult,
    multipliedMult,
    totalChips,
    totalMult,
    bonusMoney,
    triggeredJokers,
  };
}

