import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Blind, PlayingCard } from '../types/game';
import { createStandardDeck, shuffleDeck, drawCards, formatRank, getSuitLabel } from '../game/deck';
import { evaluateHand } from '../game/handEvaluator';
import { calculateScore, type ScoreBreakdown } from '../game/scoring';
import { createAnteBlinds } from '../game/blinds';
import { useRovingTabindex } from '../hooks/useKeyboardNav';
import { CardView } from './CardView';
import { HandPreview } from './HandPreview';
import { PlayControls } from './PlayControls';
import { BlindSelect } from './BlindSelect';
import { HelpDialog } from './HelpDialog';
import '../styles/pixel-theme.css';
import './App.css';

export const App: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // Progressione Run
  const [ante, setAnte] = useState<number>(1);
  const [phase, setPhase] = useState<'select_blind' | 'in_blind' | 'round_won' | 'game_over' | 'victory'>('select_blind');
  const [activeBlindType, setActiveBlindType] = useState<'small' | 'big' | 'boss'>('small');
  const [money, setMoney] = useState<number>(4);

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
  const [lastPlayedBreakdown, setLastPlayedBreakdown] = useState<ScoreBreakdown | null>(null);

  // Mazzo e Mano
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [, setDiscardPile] = useState<PlayingCard[]>([]);
  const [announcement, setAnnouncement] = useState('Seleziona il prossimo Blind da affrontare.');

  // Aggiorna currentBlind quando cambia l'activeBlindType o l'ante
  useEffect(() => {
    setCurrentBlind(anteBlinds[activeBlindType]);
  }, [anteBlinds, activeBlindType]);

  // Carte attualmente selezionate
  const selectedCards = useMemo(() => {
    return hand.filter((c) => selectedCardIds.includes(c.id));
  }, [hand, selectedCardIds]);

  // Valutazione della mano
  const evaluatedHand = useMemo(() => {
    return evaluateHand(selectedCards);
  }, [selectedCards]);

  // Regola Boss Debuff (es. Ante 1 Lama del Boia azzera cuori)
  const isCardDebuffed = useCallback((card: PlayingCard): boolean => {
    if (currentBlind.type !== 'boss' || !currentBlind.bossRule) return false;
    if (currentBlind.bossRule.id === 'executioner_blade' && card.suit === 'hearts') return true;
    if (currentBlind.bossRule.id === 'corrupted_blood' && (card.suit === 'diamonds' || card.suit === 'clubs')) return true;
    if (currentBlind.bossRule.id === 'grave_mist' && card.suit === 'spades') return true;
    return false;
  }, [currentBlind]);

  // Avvio di un Blind
  const startBlindSession = useCallback((blindToPlay: Blind) => {
    setCurrentBlind(blindToPlay);

    // Gestione regole speciali Boss all'avvio
    let startingDiscards = 4 + pendingBonusDiscards;
    let startingHands = 4 + pendingBonusHands;
    let handSize = 8;

    if (blindToPlay.type === 'boss' && blindToPlay.bossRule) {
      if (blindToPlay.bossRule.id === 'thorn_shroud') {
        startingDiscards = Math.max(1, startingDiscards - 1);
      }
      if (blindToPlay.bossRule.id === 'iron_cage') {
        handSize = 7;
      }
      if (blindToPlay.bossRule.id === 'tavern_tyrant') {
        startingHands = 3;
      }
    }

    const fullDeck = shuffleDeck(createStandardDeck());
    const { drawn, remaining } = drawCards(fullDeck, handSize);

    setDeck(remaining);
    setHand(drawn);
    setDiscardPile([]);
    setSelectedCardIds([]);
    setScore(0);
    setHandsRemaining(startingHands);
    setDiscardsRemaining(startingDiscards);
    setPendingBonusDiscards(0);
    setPendingBonusHands(0);
    setLastPlayedBreakdown(null);
    setPhase('in_blind');

    setAnnouncement(`Iniziato ${blindToPlay.title}. Obiettivo: ${blindToPlay.scoreTarget} punti.`);
  }, [pendingBonusDiscards, pendingBonusHands]);

  // Salto (Skip) del Blind con Tag
  const handleSkipBlind = useCallback((blindToSkip: Blind) => {
    if (!blindToSkip.canSkip || !blindToSkip.skipTag) return;

    const tag = blindToSkip.skipTag;
    let newMoney = money;

    if (tag.rewardMoney) {
      newMoney += tag.rewardMoney;
      setMoney(newMoney);
    }
    if (tag.bonusDiscards) {
      setPendingBonusDiscards((prev) => prev + tag.bonusDiscards!);
    }
    if (tag.bonusHands) {
      setPendingBonusHands((prev) => prev + tag.bonusHands!);
    }

    // Avanza al blind successivo
    if (blindToSkip.type === 'small') {
      setActiveBlindType('big');
    } else if (blindToSkip.type === 'big') {
      setActiveBlindType('boss');
    }

    setAnnouncement(`Blind saltato! Riscatto ${tag.name}: ${tag.description}`);
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

  // Selezione della carta per indice con tastiera (Spazio)
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

    // Boss Rule: Editto Inquisitorio (Pair e Two Pair bloccate)
    if (
      currentBlind.type === 'boss' &&
      currentBlind.bossRule?.id === 'inquisitor_decree' &&
      (evaluatedHand.type === 'pair' || evaluatedHand.type === 'two_pair')
    ) {
      setAnnouncement('Azione respinta! L\'Editto Inquisitorio vieta Pair e Two Pair.');
      return;
    }

    const breakdown = calculateScore(evaluatedHand, isCardDebuffed);
    const newScore = score + breakdown.finalScore;
    const newHands = handsRemaining - 1;

    // Rimuovi carte giocate
    const playedCards = hand.filter((c) => selectedCardIds.includes(c.id));
    const remainingHand = hand.filter((c) => !selectedCardIds.includes(c.id));
    setDiscardPile((prev) => [...prev, ...playedCards]);

    // Ricarica mano
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
      // Calcolo ricompensa vittoria
      const reward = currentBlind.rewardMoney + newHands;
      setMoney((prev) => prev + reward);
      setPhase('round_won');
      setAnnouncement(
        `VITTORIA DEL BLIND! ${breakdown.displayName} ti porta a ${newScore} punti. Incassi +$${reward}!`
      );
    } else if (newHands === 0) {
      setPhase('game_over');
      setAnnouncement(`SCONFITTA! Mani esaurite senza superare la soglia di ${currentBlind.scoreTarget}.`);
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
    score,
    hand,
    deck,
    setFocusedIndex,
  ]);

  // Azione SCARTA (X)
  const handleDiscard = useCallback(() => {
    if (selectedCardIds.length === 0 || discardsRemaining <= 0 || phase !== 'in_blind') {
      return;
    }

    // Boss Rule: Tassa del Siniscalco (Scarto costa $1)
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

    // Ricarica mano
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

  // Avanza al Blind successivo dopo una vittoria
  const handleContinueAfterWin = useCallback(() => {
    if (activeBlindType === 'small') {
      setActiveBlindType('big');
      setPhase('select_blind');
    } else if (activeBlindType === 'big') {
      setActiveBlindType('boss');
      setPhase('select_blind');
    } else if (activeBlindType === 'boss') {
      // Vittoria del Boss Blind
      if (ante >= 8) {
        setPhase('victory');
        setAnnouncement('TRIONFO SUPREMO! Hai sconfitto tutti gli 8 Ante della Taverna!');
      } else {
        const nextAnte = ante + 1;
        setAnte(nextAnte);
        setActiveBlindType('small');
        setPhase('select_blind');
        setAnnouncement(`Complimenti! Avanzamento ad Ante ${nextAnte}.`);
      }
    }
  }, [activeBlindType, ante]);

  // Ricomincia la Run da zero
  const handleRestartRun = useCallback(() => {
    setAnte(1);
    setActiveBlindType('small');
    setMoney(4);
    setPendingBonusDiscards(0);
    setPendingBonusHands(0);
    setScore(0);
    setPhase('select_blind');
    setSelectedCardIds([]);
    setAnnouncement('Nuova partita avviata. Ante 1 - Scegli il Blind.');
  }, []);

  // Listener globale per scorciatoie
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
          handleContinueAfterWin();
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
    handleContinueAfterWin,
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

      {/* Barra Progresso Punteggio (visibile durante la partita) */}
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

      {/* FASE 1: SCHERMATA SELEZIONE BLIND */}
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

      {/* FASE 2: TAVOLO DI GIOCO (IN BLIND) */}
      {phase === 'in_blind' && (
        <main className="tavern-table pixel-panel pixel-panel-blood" id="main-content">
          {/* Box Regola Boss attiva */}
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

          {/* Anteprima Mano */}
          <HandPreview evaluatedHand={evaluatedHand} selectedCount={selectedCardIds.length} />

          {/* Gruppo Mano con Roving Tabindex */}
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

          {/* Controlli Azione */}
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

      {/* FASE 3: VITTORIA DEL ROUND */}
      {phase === 'round_won' && (
        <section className="outcome-screen pixel-panel pixel-panel-blood" role="region" aria-label="Vittoria Blind">
          <div className="outcome-banner banner-won pixel-panel">
            <h2 className="outcome-title">[ OBIETTIVO RAGGIUNTO! BLIND SUPERATO ]</h2>
            <p className="outcome-desc">
              Punteggio ottenuto: <strong>{score}</strong> su <strong>{currentBlind.scoreTarget}</strong>.
            </p>
            <div className="outcome-rewards">
              <span>Ricompensa Base: +${currentBlind.rewardMoney}</span>
              <span>Bonus Mani Rimanenti: +${handsRemaining}</span>
            </div>
            <button
              type="button"
              className="pixel-btn pixel-btn-blood btn-continue-win"
              onClick={handleContinueAfterWin}
              aria-label="Procedi al prossimo Blind con tasto Invio"
            >
              [ PROCEDI AL PROSSIMO BLIND (INVIO) ]
            </button>
          </div>
        </section>
      )}

      {/* FASE 4: SCONFITTA (GAME OVER) */}
      {phase === 'game_over' && (
        <section className="outcome-screen pixel-panel pixel-panel-blood" role="region" aria-label="Game Over">
          <div className="outcome-banner banner-lost pixel-panel">
            <h2 className="outcome-title">[ SCONFITTA NELLA TAVERNA ]</h2>
            <p className="outcome-desc">
              Le mani sono esaurite e il tributo di {currentBlind.scoreTarget} punti non è stato pagato.
              La run si arresta all&apos;Ante {ante}.
            </p>
            <button type="button" className="pixel-btn pixel-btn-blood" onClick={handleRestartRun}>
              [ RICOMINCIA LA RUN DALL&apos;ANTE 1 ]
            </button>
          </div>
        </section>
      )}

      {/* FASE 5: VITTORIA DELLA RUN (ANTE 8 COMPLETATA) */}
      {phase === 'victory' && (
        <section className="outcome-screen pixel-panel pixel-panel-blood" role="region" aria-label="Vittoria Totale">
          <div className="outcome-banner banner-won pixel-panel">
            <h2 className="outcome-title">[ TRIONFO SUPREMO! RUN COMPLETATA ]</h2>
            <p className="outcome-desc">
              Hai abbattuto il Tiranno della Taverna e trionfato su tutti gli 8 Ante di Balcard!
              Tesoro finale accumulato: <strong>${money} d&apos;oro</strong>.
            </p>
            <button type="button" className="pixel-btn pixel-btn-blood" onClick={handleRestartRun}>
              [ INIZIA UNA NUOVA RUN ]
            </button>
          </div>
        </section>
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
