export type Language = 'en' | 'it';

export interface Translations {
  // Common / Header
  appTitle: string;
  appSubtitle: string;
  ante: string;
  gold: string;
  hands: string;
  discards: string;
  score: string;
  target: string;
  reward: string;
  help: string;
  close: string;
  restart: string;
  restartConfirm: string;
  langSwitch: string;
  commands: string;
  roundWonBanner: string;
  roundLostBanner: string;

  // Home Screen
  homeStartRun: string;
  homeContinueRun: string;
  homeHowToPlay: string;
  homeRulesBrief: string;
  homeTavernLore: string;
  homeInstallApp: string;
  
  // Blind Selection
  blindSelectTitle: string;
  blindSelectSubtitle: string;
  smallBlindTitle: string;
  bigBlindTitle: string;
  bossBlindTitle: string;
  selectBlindBtn: string;
  skipBlindBtn: string;
  upcomingBoss: string;
  activeBoss: string;
  tagReward: string;
  anteProgress: string;

  // Blind Gameplay
  playHandBtn: string;
  discardBtn: string;
  roundScoreLabel: string;
  targetLabel: string;
  handsRemainingLabel: string;
  discardsRemainingLabel: string;
  selectedCardsCount: string;
  debuffedCardNotice: string;
  noDiscardsRemaining: string;
  noHandsRemaining: string;
  cardChips: string;
  cardScoring: string;
  handType: string;
  sortRankBtn: string;
  sortSuitBtn: string;
  sortedByRankAnnounce: string;
  sortedBySuitAnnounce: string;

  // Poker Hands
  pokerHands: Record<string, string>;
  pokerHandLevel: string;

  // Suits
  suits: {
    hearts: string;
    diamonds: string;
    clubs: string;
    spades: string;
  };

  // Jokers Panel
  jokerChestTitle: string;
  activeJokersLabel: string;
  emptySlotLabel: string;
  maxJokersHint: string;
  shopHint: string;
  sellBtn: string;
  rarities: {
    common: string;
    rare: string;
    legendary: string;
  };

  // Shop
  shopMerchantTitle: string;
  shopTitle: string;
  shopSubtitle: string;
  availableGoldLabel: string;
  badgeJoker: string;
  badgeScroll: string;
  currentLevelInfo: string;
  buyBtn: string;
  slotsFullBtn: string;
  insufficientGoldBtn: string;
  rerollBtn: string;
  leaveShopBtn: string;
  scrollPrefix: string;
  scrollDescription: string;

  // Round Won Summary
  blindConqueredTitle: string;
  blindRewardLabel: string;
  handsBonusLabel: string;
  interestBonusLabel: string;
  usuryBonusLabel: string;
  totalEarnedLabel: string;
  goToShopBtn: string;

  // Game Over & Victory
  gameOverTitle: string;
  gameOverDesc: string;
  victoryTitle: string;
  victoryDesc: string;
  newRunBtn: string;
  runStatsTitle: string;
  statsHandsPlayed: string;
  statsCardsDiscarded: string;
  statsGoldEarned: string;

  // Boss Rules
  bossRules: Record<string, { name: string; description: string }>;

  // Tag Rewards
  tagRewards: Record<string, { name: string; description: string }>;

  // Joker Lore
  jokers: Record<string, { name: string; description: string }>;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Balcard',
    appSubtitle: 'Dark Medieval Roguelike Poker',
    ante: 'Ante',
    gold: 'Gold',
    hands: 'Hands',
    discards: 'Discards',
    score: 'Score',
    target: 'Target',
    reward: 'Reward',
    help: 'Guida [?]',
    close: 'Close [Esc]',
    restart: 'Restart',
    restartConfirm: 'Are you sure you want to abandon the current run and start a new one?',
    langSwitch: 'Lang: En',
    commands: 'Commands',
    roundWonBanner: 'Blind conquered!',
    roundLostBanner: 'Defeat!',

    homeStartRun: '[ New run ]',
    homeContinueRun: '[ Continue run ]',
    homeHowToPlay: '[ How to play (Help) ]',
    homeRulesBrief: 'Manipulate poker hands, conquer 8 tavern Antes and equip bloody Jokers to overthrow the Blind bosses.',
    homeTavernLore: 'The tavern doors creak in the fog. Enter at your own risk.',
    homeInstallApp: '[ Install app ]',

    blindSelectTitle: 'Choose next Blind',
    blindSelectSubtitle: 'Defeat the Blinds to gather gold and advance through all 8 tavern Antes.',
    smallBlindTitle: 'Small Blind',
    bigBlindTitle: 'Big Blind',
    bossBlindTitle: 'Boss Blind',
    selectBlindBtn: '[ Select Blind ]',
    skipBlindBtn: '[ Skip Blind ]',
    upcomingBoss: 'Upcoming Boss',
    activeBoss: 'Active Boss',
    tagReward: 'Tag reward',
    anteProgress: 'Ante progression',

    playHandBtn: '[ Play hand (Enter) ]',
    discardBtn: '[ Discard (X) ]',
    roundScoreLabel: 'Round score',
    targetLabel: 'Target score',
    handsRemainingLabel: 'Hands left',
    discardsRemainingLabel: 'Discards left',
    selectedCardsCount: 'Selected',
    debuffedCardNotice: '[!] Debuffed by Boss',
    noDiscardsRemaining: 'No discards remaining',
    noHandsRemaining: 'Last hand!',
    cardChips: 'Chips',
    cardScoring: 'Scores chips',
    handType: 'Hand',
    sortRankBtn: '[ Sort: Rank (R) ]',
    sortSuitBtn: '[ Sort: Suit (S) ]',
    sortedByRankAnnounce: 'Hand sorted by rank.',
    sortedBySuitAnnounce: 'Hand sorted by suit.',

    pokerHands: {
      high_card: 'High Card',
      pair: 'Pair',
      two_pair: 'Two Pair',
      three_of_a_kind: 'Three of a Kind',
      straight: 'Straight',
      flush: 'Flush',
      full_house: 'Full House',
      four_of_a_kind: 'Four of a Kind',
      straight_flush: 'Straight Flush',
    },
    pokerHandLevel: 'Level',

    suits: {
      hearts: 'Hearts',
      diamonds: 'Diamonds',
      clubs: 'Clubs',
      spades: 'Spades',
    },

    jokerChestTitle: '[ JOKER CHEST ]',
    activeJokersLabel: 'ACTIVE JOKERS',
    emptySlotLabel: '[ EMPTY SLOT ]',
    maxJokersHint: 'Max 5 Jokers',
    shopHint: 'Purchase them at the Tavern Shop between Blinds',
    sellBtn: 'SELL',
    rarities: {
      common: 'COMMON',
      rare: 'RARE',
      legendary: 'LEGENDARY',
    },

    shopMerchantTitle: '[ TAVERN MERCHANT ]',
    shopTitle: 'THE RELIC SHOP',
    shopSubtitle: 'Spend your gold on new Jokers or permanent hand upgrade scrolls.',
    availableGoldLabel: 'AVAILABLE GOLD:',
    badgeJoker: 'JOKER',
    badgeScroll: 'SCROLL',
    currentLevelInfo: 'Current Level',
    buyBtn: '[ BUY ($',
    slotsFullBtn: '[ SLOTS FULL ]',
    insufficientGoldBtn: '[ NEED MORE GOLD ($',
    rerollBtn: '[ REROLL SHOP ($',
    leaveShopBtn: '[ NEXT BLIND ]',
    scrollPrefix: 'Scroll:',
    scrollDescription: 'Permanently increases hand level:',

    blindConqueredTitle: 'BLIND DEFEATED!',
    blindRewardLabel: 'Blind Base Bounty:',
    handsBonusLabel: 'Unused Hands Bonus:',
    interestBonusLabel: 'Tavern Interest ($1 per $5, max $5):',
    usuryBonusLabel: 'Village Usurer Bounty:',
    totalEarnedLabel: 'Total Gold Acquired:',
    goToShopBtn: '[ ENTER THE SHOP ]',

    gameOverTitle: 'SLAIN IN THE TAVERN',
    gameOverDesc: 'You ran out of hands before satisfying the blind target score.',
    victoryTitle: 'SUPREME ASCENSION!',
    victoryDesc: 'You have vanquished all 8 Antes and claimed the tavern throne!',
    newRunBtn: '[ NEW RUN ]',
    runStatsTitle: 'RUN RECAP',
    statsHandsPlayed: 'Hands Played:',
    statsCardsDiscarded: 'Cards Discarded:',
    statsGoldEarned: 'Total Gold Earned:',

    bossRules: {
      executioner_blade: {
        name: "Executioner's Blade",
        description: 'All Hearts are debuffed and score 0 chips.',
      },
      corrupted_blood: {
        name: 'Corrupted Blood',
        description: 'Diamonds and Clubs are debuffed and score 0 chips.',
      },
      grave_mist: {
        name: 'Grave Mist',
        description: 'All Spades are debuffed and score 0 chips.',
      },
      rusted_chains: {
        name: 'Rusted Chains',
        description: 'Hand size is permanently reduced by 1 card this round.',
      },
      blind_monk: {
        name: 'The Blind Monk',
        description: 'All cards are dealt face-down until selected.',
      },
      taxman_leech: {
        name: "Taxman's Toll",
        description: 'Each discard costs $1 gold.',
      },
      crimson_needle: {
        name: 'The Crimson Needle',
        description: 'Only 1 hand available to defeat this Blind.',
      },
      abyssal_warden: {
        name: 'The Abyssal Warden',
        description: 'Target score is tripled; the final reckoning.',
      },
    },

    tagRewards: {
      gold_pouch: {
        name: 'Gold Pouch',
        description: 'Instantly grants +$15 gold.',
      },
      tactician_quiver: {
        name: "Tactician's Quiver",
        description: 'Grants +2 extra Discards in the next played round.',
      },
      iron_stamina: {
        name: 'Iron Stamina',
        description: 'Grants +1 extra Hand in the next played round.',
      },
    },

    jokers: {
      court_jester: {
        name: 'Court Jester',
        description: '+4 Mult on any played hand.',
      },
      alchemist: {
        name: 'The Alchemist',
        description: 'Each scoring Diamond grants +3 Chips and +$1 gold immediately.',
      },
      royal_blacksmith: {
        name: 'Royal Blacksmith',
        description: '+15 Chips for each Spade contributing to score.',
      },
      monk_scribe: {
        name: 'Monk Scribe',
        description: '+8 Mult if the played hand is a Straight or Straight Flush.',
      },
      marksman_crossbow: {
        name: 'Master Crossbowman',
        description: '+30 Chips if the played hand is a Pair or Two Pair.',
      },
      knight_errant: {
        name: 'Knight Errant',
        description: 'Multiplies Mult by 1.5X if no discards were used this round.',
      },
      village_usurer: {
        name: 'Village Usurer',
        description: 'Upon winning a Blind, grants +$2 gold for each unused hand.',
      },
    },
  },

  it: {
    appTitle: 'Balcard',
    appSubtitle: 'Poker Roguelike Medievale',
    ante: 'Ante',
    gold: 'Oro',
    hands: 'Mani',
    discards: 'Scarti',
    score: 'Punteggio',
    target: 'Obiettivo',
    reward: 'Ricompensa',
    help: 'Guida [?]',
    close: 'Chiudi [Esc]',
    restart: 'Ricomincia',
    restartConfirm: 'Sei sicuro di voler abbandonare la run corrente per iniziarne una nuova?',
    langSwitch: 'Lingua: It',
    commands: 'Comandi',
    roundWonBanner: 'Blind conquistato!',
    roundLostBanner: 'Sconfitta!',

    homeStartRun: '[ Nuova partita ]',
    homeContinueRun: '[ Continua partita ]',
    homeHowToPlay: '[ Guida e comandi ]',
    homeRulesBrief: 'Manipola le mani di poker, sconfiggi gli 8 Ante della taverna ed equipaggia Jolly insanguinati per dominare i Boss.',
    homeTavernLore: 'Le porte della taverna cigolano nella nebbia. Entra a tuo rischio e pericolo.',
    homeInstallApp: '[ Installa app ]',

    blindSelectTitle: 'Scegli il prossimo Blind',
    blindSelectSubtitle: 'Sconfiggi i Blind per accumulare oro e avanzare attraverso tutti gli 8 Ante.',
    smallBlindTitle: 'Piccolo Blind',
    bigBlindTitle: 'Grande Blind',
    bossBlindTitle: 'Blind del Boss',
    selectBlindBtn: '[ Seleziona Blind ]',
    skipBlindBtn: '[ Salta Blind ]',
    upcomingBoss: 'Boss in arrivo',
    activeBoss: 'Boss attivo',
    tagReward: 'Ricompensa Tag',
    anteProgress: 'Progressione Ante',

    playHandBtn: '[ Gioca mano (Enter) ]',
    discardBtn: '[ Scarta (X) ]',
    roundScoreLabel: 'Punteggio round',
    targetLabel: 'Punteggio obiettivo',
    handsRemainingLabel: 'Mani rimaste',
    discardsRemainingLabel: 'Scarti rimasti',
    selectedCardsCount: 'Selezionate',
    debuffedCardNotice: '[!] Depotenziata dal Boss',
    noDiscardsRemaining: 'Scarti esauriti',
    noHandsRemaining: 'Ultima mano!',
    cardChips: 'Chips',
    cardScoring: 'Valida per il punteggio',
    handType: 'Mano',
    sortRankBtn: '[ Ordina: Valore (R) ]',
    sortSuitBtn: '[ Ordina: Seme (S) ]',
    sortedByRankAnnounce: 'Mano ordinata per valore.',
    sortedBySuitAnnounce: 'Mano ordinata per seme.',

    pokerHands: {
      high_card: 'Carta Alta',
      pair: 'Coppia',
      two_pair: 'Doppia Coppia',
      three_of_a_kind: 'Tris',
      straight: 'Scala',
      flush: 'Colore',
      full_house: 'Full',
      four_of_a_kind: 'Poker',
      straight_flush: 'Scala Colore',
    },
    pokerHandLevel: 'Livello',

    suits: {
      hearts: 'Cuori',
      diamonds: 'Quadri',
      clubs: 'Fiori',
      spades: 'Picche',
    },

    jokerChestTitle: '[ FORZIERE DEI JOLLY ]',
    activeJokersLabel: 'JOLLY ATTIVI',
    emptySlotLabel: '[ SLOT VUOTO ]',
    maxJokersHint: 'Max 5 Jolly',
    shopHint: 'Acquistali nella Bottega tra i Blind',
    sellBtn: 'VENDI',
    rarities: {
      common: 'COMUNE',
      rare: 'RARO',
      legendary: 'LEGGENDARIO',
    },

    shopMerchantTitle: '[ MERCANTE DELLA TAVERNA ]',
    shopTitle: 'LA BOTTEGA DEI RELITTI',
    shopSubtitle: 'Spendi il tuo oro per acquistare nuovi Jolly o pergamene di potenziamento permanente.',
    availableGoldLabel: 'ORO DISPONIBILE:',
    badgeJoker: 'JOLLY',
    badgeScroll: 'PERGAMENA',
    currentLevelInfo: 'Livello Attuale',
    buyBtn: '[ ACQUISTA ($',
    slotsFullBtn: '[ SLOTS PIENI ]',
    insufficientGoldBtn: '[ ORO INSUFFICIENTE ($',
    rerollBtn: '[ RINNOVA OFFERTE ($',
    leaveShopBtn: '[ PROSSIMO BLIND ]',
    scrollPrefix: 'Pergamena:',
    scrollDescription: 'Aumenta permanentemente il livello di',

    blindConqueredTitle: 'BLIND SCONFITTO!',
    blindRewardLabel: 'Taglia Base Blind:',
    handsBonusLabel: 'Bonus Mani Inutilizzate:',
    interestBonusLabel: 'Interesse della Taverna ($1 per $5, max $5):',
    usuryBonusLabel: 'Riscatto Usuraio di Borgo:',
    totalEarnedLabel: 'Oro Totale Raccolto:',
    goToShopBtn: '[ ENTRA NELLA BOTTEGA ]',

    gameOverTitle: 'CADUTO NELLA TAVERNA',
    gameOverDesc: 'Hai esaurito le mani prima di raggiungere il punteggio richiesto.',
    victoryTitle: 'TRIONFO SUPREMO!',
    victoryDesc: 'Hai sconfitto tutti gli 8 Ante e conquistato il trono della taverna!',
    newRunBtn: '[ NUOVA PARTITA ]',
    runStatsTitle: 'RESOCONTO DELLA RUN',
    statsHandsPlayed: 'Mani Giocate:',
    statsCardsDiscarded: 'Carte Scartate:',
    statsGoldEarned: 'Oro Totale Guadagnato:',

    bossRules: {
      executioner_blade: {
        name: 'Lama del Boia',
        description: 'Tutte le carte di Cuori sono depotenziate e valgono 0 chip.',
      },
      corrupted_blood: {
        name: 'Sangue Corrotto',
        description: 'Quadri e Fiori sono depotenziati e valgono 0 chip.',
      },
      grave_mist: {
        name: 'Nebbia Tombale',
        description: 'Tutte le carte di Picche sono depotenziate e valgono 0 chip.',
      },
      rusted_chains: {
        name: 'Catene Arrugginite',
        description: 'La mano iniziale è ridotta di 1 carta in questo round.',
      },
      blind_monk: {
        name: 'Il Monaco Cieco',
        description: 'Tutte le carte vengono pescate coperte fino alla selezione.',
      },
      taxman_leech: {
        name: 'Tassa del Siniscalco',
        description: "Ogni scarto costa $1 d'oro.",
      },
      crimson_needle: {
        name: "L'Ago Cremisi",
        description: 'Hai a disposizione una sola mano (1 Hand) per vincere.',
      },
      abyssal_warden: {
        name: 'Il Guardiano Abissale',
        description: 'Punteggio bersaglio triplicato; la resa dei conti finale.',
      },
    },

    tagRewards: {
      gold_pouch: {
        name: "Borsa d'Oro",
        description: "Conferisce immediatamente +$15 d'oro.",
      },
      tactician_quiver: {
        name: 'Faretra del Tattico',
        description: '+2 scarti addizionali nel prossimo round giocato.',
      },
      iron_stamina: {
        name: 'Tempra di Ferro',
        description: '+1 mano addizionale nel prossimo round giocato.',
      },
    },

    jokers: {
      court_jester: {
        name: 'Il Giullare di Corte',
        description: '+4 Mult fisso su qualsiasi mano giocata.',
      },
      alchemist: {
        name: "L'Alchimista",
        description: "Ogni carta di Quadri a punteggio conferisce +3 Chips e +$1 d'oro immediato.",
      },
      royal_blacksmith: {
        name: 'Il Fabbro Reale',
        description: '+15 Chips per ciascuna carta di Picche che concorre al punteggio.',
      },
      monk_scribe: {
        name: 'Il Monaco Amanuense',
        description: '+8 Mult addizionale se la mano giocata è una Straight o Straight Flush.',
      },
      marksman_crossbow: {
        name: 'Il Balestriere Scelto',
        description: '+30 Chips se la combinazione giocata è una Pair o Two Pair.',
      },
      knight_errant: {
        name: 'Il Cavaliere Errante',
        description: 'Moltiplica il Mult per 1.5X se non è stato effettuato alcuno scarto (Discard) nel round.',
      },
      village_usurer: {
        name: "L'Usuraio di Borgo",
        description: 'Alla vittoria del Blind assegna +$2 addizionali per ogni mano (Hand) non utilizzata.',
      },
    },
  },
};
