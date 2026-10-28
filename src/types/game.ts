/**
 * Definizioni di tipi TypeScript per Balcard.
 * Nessuna dipendenza esterna o riferimento a React.
 */

// --- SEMI E RANGHI ---
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14; 
// 11 = Jack, 12 = Queen, 13 = King, 14 = Ace

export interface PlayingCard {
  id: string;
  suit: Suit;
  rank: Rank;
  bonusChips?: number;
  bonusMult?: number;
}

// --- MANI DI POKER ---
export type HandType =
  | 'high_card'
  | 'pair'
  | 'two_pair'
  | 'three_of_a_kind'
  | 'straight'
  | 'flush'
  | 'full_house'
  | 'four_of_a_kind'
  | 'straight_flush';

export interface HandLevelInfo {
  level: number;
  baseChips: number;
  baseMult: number;
  chipPerLevel: number;
  multPerLevel: number;
}

export interface EvaluatedHand {
  type: HandType;
  displayName: string;
  scoringCards: PlayingCard[];
  baseChips: number;
  baseMult: number;
}

// --- BLIND E ANTE ---
export type BlindType = 'small' | 'big' | 'boss';

export interface BossRule {
  id: string;
  name: string;
  description: string;
}

export interface BlindTagReward {
  id: string;
  name: string;
  description: string;
  rewardMoney?: number;
  bonusDiscards?: number;
  bonusHands?: number;
}

export interface Blind {
  type: BlindType;
  title: string;
  scoreTarget: number;
  rewardMoney: number;
  canSkip: boolean;
  bossRule?: BossRule;
  skipTag?: BlindTagReward;
}

// --- JOKER ---
export type JokerRarity = 'common' | 'rare' | 'legendary';

export interface JokerScoringContext {
  cards: PlayingCard[];
  evaluatedHand: EvaluatedHand;
  currentChips: number;
  currentMult: number;
  discardsUsedThisRound: number;
  handsRemaining: number;
  money: number;
}

export interface JokerScoringResult {
  addChips?: number;
  addMult?: number;
  multiplyMult?: number;
  addMoney?: number;
  message?: string;
}

export interface JokerBlindWonContext {
  handsRemaining: number;
  discardsRemaining: number;
  money: number;
  ante: number;
}

export interface Joker {
  id: string;
  name: string;
  description: string;
  rarity: JokerRarity;
  cost: number;
  sellValue: number;
  imagePath?: string;
  onHandScoring?: (ctx: JokerScoringContext) => JokerScoringResult | null;
  onBlindWon?: (ctx: JokerBlindWonContext) => { addMoney?: number; message?: string } | null;
}

// --- SHOP ---
export type ShopItemType = 'joker' | 'hand_upgrade' | 'card_pack';

export interface ShopItem {
  id: string;
  type: ShopItemType;
  name: string;
  cost: number;
  description: string;
  payload: Joker | { handType: HandType } | unknown;
}

export interface ShopState {
  items: ShopItem[];
  rerollCost: number;
}

// --- FASI DI GIOCO ---
export type GamePhase =
  | 'home'
  | 'select_blind'
  | 'in_blind'
  | 'scoring_animation'
  | 'round_won'
  | 'shop'
  | 'game_over'
  | 'victory';

// --- STATO GLOBALE ---
export interface GameState {
  ante: number;
  currentBlind: Blind;
  phase: GamePhase;
  money: number;
  score: number;
  handsRemaining: number;
  discardsRemaining: number;
  deck: PlayingCard[];
  discardPile: PlayingCard[];
  hand: PlayingCard[];
  selectedCardIds: string[];
  equippedJokers: Joker[];
  handLevels: Record<HandType, HandLevelInfo>;
  shop: ShopState;
  announcement: string;
  runStats: {
    handsPlayed: number;
    cardsDiscarded: number;
    totalMoneyEarned: number;
  };
}

// --- AZIONI DISCRIMINATE DEL REDUCER ---
export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_BLIND'; blind: Blind }
  | { type: 'SKIP_BLIND' }
  | { type: 'TOGGLE_CARD_SELECTION'; cardId: string }
  | { type: 'PLAY_HAND' }
  | { type: 'DISCARD' }
  | { type: 'BUY_SHOP_ITEM'; itemId: string }
  | { type: 'SELL_JOKER'; jokerId: string }
  | { type: 'REROLL_SHOP' }
  | { type: 'LEAVE_SHOP' }
  | { type: 'SET_ANNOUNCEMENT'; message: string };

