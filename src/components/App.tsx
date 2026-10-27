import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Blind, HandLevelInfo, HandType, Joker, PlayingCard, ShopItem } from '../types/game';
import { createStandardDeck, shuffleDeck, drawCards, formatRank, getSuitLabel } from '../game/deck';
import { evaluateHand } from '../game/handEvaluator';
import { calculateScore, type ScoreBreakdown } from '../game/scoring';
import { createAnteBlinds } from '../game/blinds';
import { JOKERS_ROSTER } from '../game/jokers';
import {
  calculateInterest,
  createInitialHandLevels,
  upgradeHandLevel,
  generateShopItems,
} from '../game/shop';
import {
  createInitialRunStats,
  recordPlayedHand,
  recordDiscardedCards,
  recordGoldEarned,
  recordBlindWon,
  recordBlindSkipped,
  type RunStatistics,
} from '../game/runStats';
import { useRovingTabindex } from '../hooks/useKeyboardNav';
import { CardView } from './CardView';
import { HandPreview } from './HandPreview';
import { PlayControls } from './PlayControls';
import { BlindSelect } from './BlindSelect';
import { JokerSlots } from './JokerSlots';
import { ShopView } from './ShopView';
import { VictoryScreen } from './VictoryScreen';
import { HelpDialog } from './HelpDialog';
import '../styles/pixel-theme.css';
import './App.css';

const INITIAL_DISCARDS_COUNT = 4;

interface RoundEarnedSummary {
  blindReward: number;
  handsBonus: number;
  interestBonus: number;
  usuryBonus: number;
  total: number;
}

export const App: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // Progressione Run
  const [ante, setAnte] = useState<number>(1);
  const [phase, setPhase] = useState<
    'select_blind' | 'in_blind' | 'round_won' | 'shop' | 'game_over' | 'victory'
  >('select_blind');
  const [activeBlindType, setActiveBlindType] = useState<'small' | 'big' | 'boss'>('small');
  const [money, setMoney] = useState<number>(4);

  // Statistiche della Run
  const [runStats, setRunStats] = useState<RunStatistics>(createInitialRunStats);

  // Livelli permanenti delle combinazioni di poker
  const [handLevels, setHandLevels] = useState<Record<HandType, HandLevelInfo>>(createInitialHandLevels);

  // Equipaggiamento Jolly
  const [equippedJokers, setEquippedJokers] = useState<Joker[]>([JOKERS_ROSTER.court_jester]);

  // Negozio tra i blind
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [rerollCost, setRerollCost] = useState<number>(5);
  const [roundEarnings, setRoundEarnings] = useState<RoundEarnedSummary | null>(null);

  // Modificatori accumulati dai Tag
  const [pendingBonusDiscards, setPendingBonusDiscards] = useState<number>(0);
  const [pendingBonusHands, setPendingBonusHands] = useState<number>(0);

  // Blinds correnti dell'Ante
  const anteBlinds = useMemo(() => createAnteBlinds(ante), [ante]);
  const [currentBlind, setCurrentBlind] = useState<Blind>(anteBlinds.small);

  // Stato del Blind attivo
  const [score, setScore] = useState<number>(0);
  const [handsRemaining, setHandsRemaining] = useState<number>(4);
  const [discardsRemaining, setDiscardsRemaining] = useState<number>(4);
  const [startingDiscards, setStartingDiscards] = useState<number>(INITIAL_DISCARDS_COUNT);
  const [lastPlayedBreakdown, setLastPlayedBreakdown] = useState<ScoreBreakdown | null>(null);

  // Mazzo e Mano
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [, setDiscardPile] = useState<PlayingCard[]>([]);
  const [announcement, setAnnouncement] = useState('Seleziona il prossimo Blind da affrontare.');

  useEffect(() => {
    setCurrentBlind(anteBlinds[activeBlindType]);
  }, [anteBlinds, activeBlindType]);

  // Carte attualmente selezionate
  const selectedCards = useMemo(() => {
    return hand.filter((c) => selectedCardIds.includes(c.id));
  }, [hand, selectedCardIds]);

  // Valutazione mano con i livelli correnti
  const evaluatedHand = useMemo(() => {
    return evaluateHand(selectedCards, handLevels);
  }, [selectedCards, handLevels]);

  // Regole Boss: Debuff Carte
  const isCardDebuffed = useCallback((card: PlayingCard): boolean => {
    if (currentBlind.type !== 'boss' || !currentBlind.bossRule) return false;
    // Ante 1: Cuori azzerati
    if (currentBlind.bossRule.id === 'executioner_blade' && card.suit === 'hearts') return true;
    // Ante 5: Quadri e Fiori azzerati
    if (currentBlind.bossRule.id === 'corrupted_blood' && (card.suit === 'diamonds' || card.suit === 'clubs')) return true;
    // Ante 7: Picche azzerate
    if (currentBlind.bossRule.id === 'grave_mist' && card.suit === 'spades') return true;
    return false;
  }, [currentBlind]);

  const discardsUsedThisRound = Math.max(0, startingDiscards - discardsRemaining);

  // Stima punteggio dinamica
  const previewBreakdown = useMemo(() => {
    if (selectedCards.length === 0) return null;
    return calculateScore(evaluatedHand, isCardDebuffed, equippedJokers, {
      discardsUsedThisRound,
      handsRemaining,
      money,
    });
  }, [selectedCards.length, evaluatedHand, isCardDebuffed, equippedJokers, discardsUsedThisRound, handsRemaining, money]);

  // Gestione equipaggiamento / vendita Jolly
  const handleEquipJoker = useCallback((joker: Joker) => {
    setEquippedJokers((prev) => {
      if (prev.length >= 5 || prev.some((j) => j.id === joker.id)) return prev;
      return [...prev, joker];
    });
    setAnnouncement(`Jolly equipaggiato: ${joker.name}.`);
  }, []);

  const handleSellJoker = useCallback((jokerId: string) => {
    const targetJoker = equippedJokers.find((j) => j.id === jokerId);
    if (!targetJoker) return;

    setEquippedJokers((prev) => prev.filter((j) => j.id !== jokerId));
    setMoney((prev) => prev + targetJoker.sellValue);
    setRunStats((prev) => recordGoldEarned(prev, targetJoker.sellValue));
    setAnnouncement(`Jolly venduto: ${targetJoker.name}. Ricevuti +$${targetJoker.sellValue}.`);
  }, [equippedJokers]);

  // Avvio sessione di gioco per un Blind
  const startBlindSession = useCallback((blindToPlay: Blind) => {
    setCurrentBlind(blindToPlay);

    let roundDiscards = 4 + pendingBonusDiscards;
    let roundHands = 4 + pendingBonusHands;
    let handSize = 8;

    // Regole Boss di inizio round
    if (blindToPlay.type === 'boss' && blindToPlay.bossRule) {
      if (blindToPlay.bossRule.id === 'thorn_shroud') {
        // Ante 2: Cappa di Spine (-1 Discard)
        roundDiscards = Math.max(1, roundDiscards - 1);
      }
      if (blindToPlay.bossRule.id === 'iron_cage') {
        // Ante 3: Gabbia di Ferro (7 carte in mano)
        handSize = 7;
      }
      if (blindToPlay.bossRule.id === 'tavern_tyrant') {
        // Ante 8: Il Tiranno della Taverna (3 Mani)
        roundHands = 3;
      }
    }

    const fullDeck = shuffleDeck(createStandardDeck());
    const { drawn, remaining } = drawCards(fullDeck, handSize);

    setDeck(remaining);
    setHand(drawn);
    setDiscardPile([]);
    setSelectedCardIds([]);
    setScore(0);
    setHandsRemaining(roundHands);
    setDiscardsRemaining(roundDiscards);
    setStartingDiscards(roundDiscards);
    setPendingBonusDiscards(0);
    setPendingBonusHands(0);
    setLastPlayedBreakdown(null);
    setPhase('in_blind');

    setAnnouncement(`Iniziato ${blindToPlay.title}. Obiettivo: ${blindToPlay.scoreTarget} punti.`);
  }, [pendingBonusDiscards, pendingBonusHands]);

  // Salto (Skip) Blind con Tag
  const handleSkipBlind = useCallback((blindToSkip: Blind) => {
    if (!blindToSkip.canSkip || !blindToSkip.skipTag) return;

    const tag = blindToSkip.skipTag;
    let newMoney = money;

    if (tag.rewardMoney) {
      newMoney += tag.rewardMoney;
      setMoney(newMoney);
      setRunStats((prev) => recordGoldEarned(prev, tag.rewardMoney!));
    }
    if (tag.bonusDiscards) {
      setPendingBonusDiscards((prev) => prev + tag.bonusDiscards!);
    }
    if (tag.bonusHands) {
      setPendingBonusHands((prev) => prev + tag.bonusHands!);
    }

    setRunStats((prev) => recordBlindSkipped(prev));

    if (blindToSkip.type === 'small') {
      setActiveBlindType('big');
    } else if (blindToSkip.type === 'big') {
      setActiveBlindType('boss');
    }

    setAnnouncement(`Blind saltato! Riscattato ${tag.name}: ${tag.description}`);
  }, [money]);

  // Selezione della carta per ID
  const toggleCardSelection = useCallback((cardId: string) => {
    if (phase !== 'in_blind') return;

    setSelectedCardIds((prev) => {
      const isAlreadySelected = prev.includes(cardId);
      if (isAlreadySelected) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= 5) {
        setAnnouncement('Limite raggiunto: massimo 5 carte selezionabili.');
        return prev;
      }
      return [...prev, cardId];
    });
  }, [phase]);

  // Selezione tastiera (Spazio)
  const handleSelectByIndex = useCallback((index: number) => {
    const targetCard = hand[index];
    if (targetCard) {
      toggleCardSelection(targetCard.id);
      const isSelectedNow = !selectedCardIds.includes(targetCard.id);
      const rank = formatRank(targetCard.rank);
      const suit = getSuitLabel(targetCard.suit);
      setAnnouncement(
        `${rank} di ${suit} ${isSelectedNow ? 'selezionata' : 'deselezionata'}. Totale: ${
          isSelectedNow ? selectedCardIds.length + 1 : selectedCardIds.length - 1
        } su 5.`
      );
    }
  }, [hand, selectedCardIds, toggleCardSelection]);

  // Hook Roving Tabindex
  const {
    focusedIndex,
    setFocusedIndex,
    setItemRef,
    handleKeyDown: handleHandKeyDown,
  } = useRovingTabindex({
    itemCount: hand.length,
    initialIndex: 0,
    loop: true,
    onSelectCurrent: handleSelectByIndex,
  });

  // Azione GIOCA MANO (Invio)
  const handlePlayHand = useCallback(() => {
    if (selectedCardIds.length === 0 || handsRemaining <= 0 || phase !== 'in_blind') {
      return;
    }

    // Regola Boss Ante 4: Editto Inquisitorio
    if (
      currentBlind.type === 'boss' &&
      currentBlind.bossRule?.id === 'inquisitor_decree' &&
      (evaluatedHand.type === 'pair' || evaluatedHand.type === 'two_pair')
    ) {
      setAnnouncement('Azione bloccata: l\'Editto Inquisitorio vieta categoricamente Pair e Two Pair.');
      return;
    }

    const breakdown = calculateScore(evaluatedHand, isCardDebuffed, equippedJokers, {
      discardsUsedThisRound,
      handsRemaining,
      money,
    });

    const newScore = score + breakdown.finalScore;
    const newHands = handsRemaining - 1;

    let currentGold = money;
    if (breakdown.bonusMoney > 0) {
      currentGold += breakdown.bonusMoney;
      setMoney(currentGold);
      setRunStats((prev) => recordGoldEarned(prev, breakdown.bonusMoney));
    }

    // Aggiorna statistiche run
    setRunStats((prev) => recordPlayedHand(prev, breakdown.finalScore, breakdown.displayName));

    const playedCards = hand.filter((c) => selectedCardIds.includes(c.id));
    const remainingHand = hand.filter((c) => !selectedCardIds.includes(c.id));
    setDiscardPile((prev) => [...prev, ...playedCards]);

    const maxHandSize = currentBlind.type === 'boss' && currentBlind.bossRule?.id === 'iron_cage' ? 7 : 8;
    const cardsNeeded = maxHandSize - remainingHand.length;
    const { drawn, remaining: newDeck } = drawCards(deck, cardsNeeded);
    const newHand = [...remainingHand, ...drawn];

    setHand(newHand);
    setDeck(newDeck);
    setScore(newScore);
    setHandsRemaining(newHands);
    setSelectedCardIds([]);
    setFocusedIndex(0);
    setLastPlayedBreakdown(breakdown);

    if (newScore >= currentBlind.scoreTarget) {
      // Calcolo dell'economia di vittoria
      let bonusUsury = 0;
      for (const j of equippedJokers) {
        if (j.onBlindWon) {
          const res = j.onBlindWon({
            handsRemaining: newHands,
            discardsRemaining,
            money: currentGold,
            ante,
          });
          if (res?.addMoney) bonusUsury += res.addMoney;
        }
      }

      const blindReward = currentBlind.rewardMoney;
      const handsBonus = newHands;
      const interestBonus = calculateInterest(currentGold);
      const totalGain = blindReward + handsBonus + interestBonus + bonusUsury;

      setMoney(currentGold + totalGain);
      setRunStats((prev) => recordGoldEarned(recordBlindWon(prev), totalGain));

      setRoundEarnings({
        blindReward,
        handsBonus,
        interestBonus,
        usuryBonus: bonusUsury,
        total: totalGain,
      });

      setPhase('round_won');
      setAnnouncement(
        `VITTORIA! ${breakdown.displayName}: +${breakdown.finalScore} PTS. Guadagnati +$${totalGain} d'oro (incluso +$${interestBonus} di interesse)!`
      );
    } else if (newHands === 0) {
      setPhase('game_over');
      setAnnouncement(`SCONFITTA! Mani esaurite senza raggiungere ${currentBlind.scoreTarget} punti.`);
    } else {
      setAnnouncement(
        `${breakdown.displayName}: +${breakdown.finalScore} PTS. Totale: ${newScore}/${currentBlind.scoreTarget}. Mani rimaste: ${newHands}.`
      );
    }
  }, [
    selectedCardIds,
    handsRemaining,
    phase,
    currentBlind,
    evaluatedHand,
    isCardDebuffed,
    equippedJokers,
    discardsUsedThisRound,
    money,
    score,
    hand,
    deck,
    discardsRemaining,
    ante,
    setFocusedIndex,
  ]);

  // Azione SCARTA (X)
  const handleDiscard = useCallback(() => {
    if (selectedCardIds.length === 0 || discardsRemaining <= 0 || phase !== 'in_blind') {
      return;
    }

    // Regola Boss Ante 6: Tassa del Siniscalco (Scarto costa $1)
    if (currentBlind.type === 'boss' && currentBlind.bossRule?.id === 'taxman_leech') {
      if (money < 1) {
        setAnnouncement('Non hai abbastanza oro! La Tassa del Siniscalco richiede $1 per scartare.');
        return;
      }
      setMoney((prev) => prev - 1);
    }

    const discardedCards = hand.filter((c) => selectedCardIds.includes(c.id));
    const remainingHand = hand.filter((c) => !selectedCardIds.includes(c.id));
    setDiscardPile((prev) => [...prev, ...discardedCards]);

    // Aggiorna statistiche
    setRunStats((prev) => recordDiscardedCards(prev, discardedCards.length));

    const { drawn, remaining: newDeck } = drawCards(deck, discardedCards.length);
    const newHand = [...remainingHand, ...drawn];

    setHand(newHand);
    setDeck(newDeck);
    setDiscardsRemaining((prev) => prev - 1);
    setSelectedCardIds([]);
    setFocusedIndex(0);
    setAnnouncement(`${discardedCards.length} carte scartate. Mano rifornita.`);
  }, [
    selectedCardIds,
    discardsRemaining,
    phase,
    currentBlind,
    money,
    hand,
    deck,
    setFocusedIndex,
  ]);

  // Transizione al Negozio dopo la vittoria
  const handleGoToShop = useCallback(() => {
    // Se abbiamo appena vinto il Boss Blind dell'Ante 8, trionfo finale immediato!
    if (activeBlindType === 'boss' && ante >= 8) {
      setPhase('victory');
      setAnnouncement('TRIONFO SUPREMO! Hai sconfitto tutti gli 8 Ante della Taverna!');
      return;
    }

    const items = generateShopItems(equippedJokers);
    setShopItems(items);
    setRerollCost(5);
    setPhase('shop');
    setAnnouncement('Sei entrato nella Bottega della Taverna. Acquista Jolly o pergamene.');
  }, [equippedJokers, activeBlindType, ante]);

  // Acquisto articolo nel negozio
  const handleBuyShopItem = useCallback((item: ShopItem) => {
    if (money < item.cost) return;

    if (item.type === 'joker') {
      if (equippedJokers.length >= 5) {
        setAnnouncement('Spazio esaurito: hai già 5 Jolly equipaggiati!');
        return;
      }
      const joker = item.payload as Joker;
      setEquippedJokers((prev) => [...prev, joker]);
    } else if (item.type === 'hand_upgrade') {
      const { handType } = item.payload as { handType: HandType };
      setHandLevels((prev) => upgradeHandLevel(prev, handType));
    }

    setMoney((prev) => prev - item.cost);
    setShopItems((prev) => prev.filter((i) => i.id !== item.id));
    setAnnouncement(`Acquistato: ${item.name} per $${item.cost}.`);
  }, [money, equippedJokers.length]);

  // Reroll delle offerte del negozio
  const handleRerollShop = useCallback(() => {
    if (money < rerollCost) return;

    setMoney((prev) => prev - rerollCost);
    const newItems = generateShopItems(equippedJokers);
    setShopItems(newItems);
    setRerollCost((prev) => prev + 1);
    setAnnouncement('Merci della bottega rinfrescate.');
  }, [money, rerollCost, equippedJokers]);

  // Uscita dal Negozio verso il prossimo Blind
  const handleLeaveShop = useCallback(() => {
    if (activeBlindType === 'small') {
      setActiveBlindType('big');
      setPhase('select_blind');
    } else if (activeBlindType === 'big') {
      setActiveBlindType('boss');
      setPhase('select_blind');
    } else if (activeBlindType === 'boss') {
      const nextAnte = ante + 1;
      setAnte(nextAnte);
      setActiveBlindType('small');
      setPhase('select_blind');
      setAnnouncement(`Complimenti! Avanzamento ad Ante ${nextAnte}.`);
    }
  }, [activeBlindType, ante]);

  // Ricomincia la Run dall'Ante 1
  const handleRestartRun = useCallback(() => {
    setAnte(1);
    setActiveBlindType('small');
    setMoney(4);
    setHandLevels(createInitialHandLevels());
    setEquippedJokers([JOKERS_ROSTER.court_jester]);
    setRunStats(createInitialRunStats());
    setPendingBonusDiscards(0);
    setPendingBonusHands(0);
    setScore(0);
    setPhase('select_blind');
    setSelectedCardIds([]);
    setAnnouncement('Nuova partita avviata. Ante 1 - Scegli il Blind.');
  }, []);

  // Scorciatoie globali
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
        return;
      }

      if (isHelpOpen) return;

      if (phase === 'in_blind') {
        if (e.key === 'Enter') {
          if (selectedCardIds.length > 0 && handsRemaining > 0) {
            e.preventDefault();
            handlePlayHand();
          }
        } else if (e.key === 'x' || e.key === 'X') {
          if (selectedCardIds.length > 0 && discardsRemaining > 0) {
            e.preventDefault();
            handleDiscard();
          }
        }
      } else if (phase === 'round_won') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleGoToShop();
        }
      } else if (phase === 'victory' || phase === 'game_over') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleRestartRun();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [
    isHelpOpen,
    phase,
    selectedCardIds,
    handsRemaining,
    discardsRemaining,
    handlePlayHand,
    handleDiscard,
    handleGoToShop,
    handleRestartRun,
  ]);

  const scoreProgressPercent = Math.min(
    100,
    Math.floor((score / (currentBlind?.scoreTarget || 1)) * 100)
  );

  return (
    <div className="tavern-app">
      {/* Live Region accessibilità WAI-ARIA */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {/* Intestazione */}
      <header className="tavern-header pixel-panel pixel-panel-blood blood-drip-edge" role="banner">
        <div className="tavern-title-group">
          <div className="tavern-crest">[ ROGUELIKE POKER MEDIEVALE ]</div>
          <h1 className="tavern-title">BALCARD</h1>
        </div>

        <nav aria-label="Controlli Rapidi">
          <button
            type="button"
            className="pixel-btn pixel-btn-blood"
            onClick={() => setIsHelpOpen(true)}
            aria-label="Apri registro comandi con tasto punto di domanda"
          >
            [?] COMANDI
          </button>
        </nav>
      </header>

      {/* Barra Risorse e Stato Globale */}
      <section className="tavern-status-bar pixel-panel" aria-label="Stato Partita">
        <div className="status-item">
          <span className="status-label">ANTE</span>
          <span className="status-value status-gold">{ante} / 8</span>
        </div>
        <div className="status-item">
          <span className="status-label">BLIND</span>
          <span className="status-value">{currentBlind.title}</span>
        </div>
        <div className="status-item">
          <span className="status-label">PUNTI / TARGET</span>
          <span className="status-value status-blood">
            {score} / {currentBlind.scoreTarget} PTS ({scoreProgressPercent}%)
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">ORO</span>
          <span className="status-value status-gold">${money}</span>
        </div>
        <div className="status-item">
          <span className="status-label">HANDS</span>
          <span className={`status-value ${handsRemaining <= 1 ? 'status-blood' : ''}`}>
            {phase === 'in_blind' ? handsRemaining : 4 + pendingBonusHands}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">DISCARDS</span>
          <span className="status-value">
            {phase === 'in_blind' ? discardsRemaining : 4 + pendingBonusDiscards}
          </span>
        </div>
      </section>

      {/* Pannello Jolly Equipaggiati */}
      <JokerSlots
        equippedJokers={equippedJokers}
        onSellJoker={handleSellJoker}
        onEquipJoker={handleEquipJoker}
      />

      {/* Barra Progresso Punteggio */}
      {phase === 'in_blind' && (
        <div
          className="score-progress-bar-container"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={currentBlind.scoreTarget}
          aria-label="Avanzamento punteggio verso l'obiettivo del Blind"
        >
          <div className="score-progress-fill" style={{ width: `${scoreProgressPercent}%` }} />
        </div>
      )}

      {/* FASE 1: SELEZIONE BLIND */}
      {phase === 'select_blind' && (
        <BlindSelect
          ante={ante}
          smallBlind={anteBlinds.small}
          bigBlind={anteBlinds.big}
          bossBlind={anteBlinds.boss}
          activeBlindType={activeBlindType}
          onPlayBlind={startBlindSession}
          onSkipBlind={handleSkipBlind}
        />
      )}

      {/* FASE 2: TAVOLO DI GIOCO */}
      {phase === 'in_blind' && (
        <main className="tavern-table pixel-panel pixel-panel-blood" id="main-content">
          {currentBlind.type === 'boss' && currentBlind.bossRule && (
            <aside className="boss-warning-panel pixel-panel" aria-label="Regola del Boss Attiva">
              <span className="boss-warning-title">[ ATTENZIONE: REGOLA DEL BOSS ATTIVA ]</span>
              <p className="boss-warning-text">
                <strong>{currentBlind.bossRule.name}</strong>: {currentBlind.bossRule.description}
              </p>
            </aside>
          )}

          <div className="table-controls">
            <div className="selection-counter">
              <span>CARTE SELEZIONATE: </span>
              <span className="counter-number status-gold">{selectedCardIds.length} / 5</span>
            </div>
            <div className="deck-counter">
              <span>MAZZO: {deck.length} CARTE</span>
            </div>
          </div>

          <HandPreview
            evaluatedHand={evaluatedHand}
            selectedCount={selectedCardIds.length}
            previewBreakdown={previewBreakdown}
          />

          <section
            className="hand-container"
            role="group"
            aria-label={`Mano di ${hand.length} carte`}
            onKeyDown={handleHandKeyDown}
          >
            {hand.map((card, index) => {
              const isSelected = selectedCardIds.includes(card.id);
              const isScoring =
                isSelected && evaluatedHand.scoringCards.some((sc) => sc.id === card.id);

              return (
                <CardView
                  key={card.id}
                  ref={setItemRef(index)}
                  card={card}
                  isSelected={isSelected}
                  isFocused={focusedIndex === index}
                  isScoring={isScoring}
                  onToggle={toggleCardSelection}
                  onFocus={() => setFocusedIndex(index)}
                />
              );
            })}
          </section>

          <PlayControls
            selectedCount={selectedCardIds.length}
            handsRemaining={handsRemaining}
            discardsRemaining={discardsRemaining}
            isRoundOver={false}
            lastPlayedBreakdown={lastPlayedBreakdown}
            onPlayHand={handlePlayHand}
            onDiscard={handleDiscard}
          />
        </main>
      )}

      {/* FASE 3: VITTORIA DEL ROUND CON RESOCONTO ECONOMICO */}
      {phase === 'round_won' && roundEarnings && (
        <section className="outcome-screen pixel-panel pixel-panel-blood" role="region" aria-label="Vittoria Blind">
          <div className="outcome-banner banner-won pixel-panel">
            <h2 className="outcome-title">[ OBIETTIVO RAGGIUNTO! BLIND SUPERATO ]</h2>
            <p className="outcome-desc">
              Punteggio ottenuto: <strong>{score}</strong> su <strong>{currentBlind.scoreTarget}</strong>.
            </p>

            <div className="economic-receipt pixel-panel">
              <span className="receipt-title">[ RESOCONTO BOTTINO DELLA TAVERNA ]</span>
              <div className="receipt-row">
                <span>Taglia Base del Blind:</span>
                <span className="status-gold">+${roundEarnings.blindReward}</span>
              </div>
              <div className="receipt-row">
                <span>Mani Inutilizzate Avanzate:</span>
                <span className="status-gold">+${roundEarnings.handsBonus}</span>
              </div>
              <div className="receipt-row">
                <span>Interesse Taverna ($1 ogni $5):</span>
                <span className="status-gold">+${roundEarnings.interestBonus}</span>
              </div>
              {roundEarnings.usuryBonus > 0 && (
                <div className="receipt-row">
                  <span>Bonus Usuraio di Borgo:</span>
                  <span className="status-gold">+${roundEarnings.usuryBonus}</span>
                </div>
              )}
              <div className="receipt-row total-row">
                <span>Totale Incassato nel Forziere:</span>
                <span className="status-gold">+${roundEarnings.total}</span>
              </div>
            </div>

            <button
              type="button"
              className="pixel-btn pixel-btn-blood btn-continue-win"
              onClick={handleGoToShop}
              aria-label="Entra nella bottega della taverna con tasto Invio"
            >
              [ ENTRA NELLA BOTTEGA DELLA TAVERNA (INVIO) ]
            </button>
          </div>
        </section>
      )}

      {/* FASE 4: BOTTEGA DELLA TAVERNA (SHOP) */}
      {phase === 'shop' && (
        <ShopView
          money={money}
          items={shopItems}
          rerollCost={rerollCost}
          equippedJokersCount={equippedJokers.length}
          maxJokerSlots={5}
          handLevels={handLevels}
          onBuyItem={handleBuyShopItem}
          onReroll={handleRerollShop}
          onLeaveShop={handleLeaveShop}
        />
      )}

      {/* FASE 5: SCONFITTA (GAME OVER) CON STATISTICHE */}
      {phase === 'game_over' && (
        <section className="outcome-screen pixel-panel pixel-panel-blood" role="region" aria-label="Game Over">
          <div className="outcome-banner banner-lost pixel-panel">
            <h2 className="outcome-title">[ SCONFITTA NELLA TAVERNA ]</h2>
            <p className="outcome-desc">
              Le mani sono esaurite e il tributo di {currentBlind.scoreTarget} punti non è stato pagato.
              La tua corsa si arresta all&apos;Ante {ante}.
            </p>

            <div className="economic-receipt pixel-panel">
              <span className="receipt-title">[ CRONACHE DELLA RUN INTERROTTA ]</span>
              <div className="receipt-row">
                <span>Mani Giocate:</span>
                <span className="status-gold">{runStats.handsPlayed}</span>
              </div>
              <div className="receipt-row">
                <span>Blind Conquistati:</span>
                <span className="status-gold">{runStats.blindsWon}</span>
              </div>
              <div className="receipt-row">
                <span>Oro Totale Accumulato:</span>
                <span className="status-gold">${runStats.totalGoldEarned}</span>
              </div>
              <div className="receipt-row">
                <span>Miglior Mano:</span>
                <span className="status-blood">{runStats.bestHandName} (+{runStats.bestHandScore} PTS)</span>
              </div>
            </div>

            <button
              type="button"
              className="pixel-btn pixel-btn-blood"
              onClick={handleRestartRun}
              aria-label="Ricomincia la run dall'Ante 1 con tasto Invio"
            >
              [ RICOMINCIA LA RUN DALL&apos;ANTE 1 (INVIO) ]
            </button>
          </div>
        </section>
      )}

      {/* FASE 6: TRIONFO SUPREMO (ANTE 8 COMPLETATA) */}
      {phase === 'victory' && (
        <VictoryScreen
          money={money}
          stats={runStats}
          onRestart={handleRestartRun}
        />
      )}

      {/* Footer */}
      <footer className="tavern-footer">
        <p>
          Navigazione totale da tastiera. Premi <kbd className="pixel-key">?</kbd> per visualizzare le scorciatoie.
        </p>
      </footer>

      {/* Dialog Modale */}
      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
