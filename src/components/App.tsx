import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { PlayingCard } from '../types/game';
import { createStandardDeck, shuffleDeck, drawCards, formatRank, getSuitLabel } from '../game/deck';
import { evaluateHand } from '../game/handEvaluator';
import { calculateScore, type ScoreBreakdown } from '../game/scoring';
import { useRovingTabindex } from '../hooks/useKeyboardNav';
import { CardView } from './CardView';
import { HandPreview } from './HandPreview';
import { PlayControls } from './PlayControls';
import { HelpDialog } from './HelpDialog';
import '../styles/pixel-theme.css';
import './App.css';

const DEFAULT_TARGET_SCORE = 300;
const INITIAL_HANDS = 4;
const INITIAL_DISCARDS = 4;

export const App: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // Stato Partita del Blind
  const [score, setScore] = useState<number>(0);
  const [scoreTarget] = useState<number>(DEFAULT_TARGET_SCORE);
  const [handsRemaining, setHandsRemaining] = useState<number>(INITIAL_HANDS);
  const [discardsRemaining, setDiscardsRemaining] = useState<number>(INITIAL_DISCARDS);
  const [roundStatus, setRoundStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [lastPlayedBreakdown, setLastPlayedBreakdown] = useState<ScoreBreakdown | null>(null);

  // Inizializzazione mazzo (44 rimanenti) e mano (8 carte)
  const initialData = useMemo(() => {
    const fullDeck = shuffleDeck(createStandardDeck());
    const { drawn, remaining } = drawCards(fullDeck, 8);
    return { hand: drawn, deck: remaining };
  }, []);

  const [hand, setHand] = useState<PlayingCard[]>(initialData.hand);
  const [deck, setDeck] = useState<PlayingCard[]>(initialData.deck);
  const [discardPile, setDiscardPile] = useState<PlayingCard[]>([]);
  const [announcement, setAnnouncement] = useState(
    'Mano di 8 carte distribuita. Usa le Frecce per scorrere, Spazio per selezionare, Invio per giocare, X per scartare.'
  );

  // Carte attualmente selezionate
  const selectedCards = useMemo(() => {
    return hand.filter((c) => selectedCardIds.includes(c.id));
  }, [hand, selectedCardIds]);

  // Valutazione mano in tempo reale
  const evaluatedHand = useMemo(() => {
    return evaluateHand(selectedCards);
  }, [selectedCards]);

  // Selezione della carta per ID
  const toggleCardSelection = useCallback((cardId: string) => {
    if (roundStatus !== 'playing') return;

    setSelectedCardIds((prev) => {
      const isAlreadySelected = prev.includes(cardId);
      if (isAlreadySelected) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= 5) {
        setAnnouncement('Limite raggiunto: massimo 5 carte selezionabili contemporaneamente.');
        return prev;
      }
      return [...prev, cardId];
    });
  }, [roundStatus]);

  // Selezione della carta per indice (richiamata da tastiera con Spazio tramite Roving Tabindex)
  const handleSelectByIndex = useCallback((index: number) => {
    const targetCard = hand[index];
    if (targetCard) {
      toggleCardSelection(targetCard.id);
      const isSelectedNow = !selectedCardIds.includes(targetCard.id);
      const rank = formatRank(targetCard.rank);
      const suit = getSuitLabel(targetCard.suit);
      setAnnouncement(
        `${rank} di ${suit} ${isSelectedNow ? 'selezionata' : 'deselezionata'}. Totale selezionate: ${
          isSelectedNow ? selectedCardIds.length + 1 : selectedCardIds.length - 1
        } su 5.`
      );
    }
  }, [hand, selectedCardIds, toggleCardSelection]);

  // Hook Roving Tabindex WAI-ARIA
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
    if (selectedCardIds.length === 0 || handsRemaining <= 0 || roundStatus !== 'playing') {
      return;
    }

    const breakdown = calculateScore(evaluatedHand);
    const newScore = score + breakdown.finalScore;
    const newHands = handsRemaining - 1;

    // Rimuovi carte giocate dalla mano e aggiungi agli scarti
    const playedCards = hand.filter((c) => selectedCardIds.includes(c.id));
    const remainingHand = hand.filter((c) => !selectedCardIds.includes(c.id));
    setDiscardPile((prev) => [...prev, ...playedCards]);

    // Ricarica la mano fino a 8 carte pescando dal mazzo
    const cardsNeeded = 8 - remainingHand.length;
    const { drawn, remaining: newDeck } = drawCards(deck, cardsNeeded);
    const newHand = [...remainingHand, ...drawn];

    setHand(newHand);
    setDeck(newDeck);
    setScore(newScore);
    setHandsRemaining(newHands);
    setSelectedCardIds([]);
    setFocusedIndex(0);
    setLastPlayedBreakdown(breakdown);

    if (newScore >= scoreTarget) {
      setRoundStatus('won');
      setAnnouncement(
        `VITTORIA! ${breakdown.displayName} ha fruttato ${breakdown.finalScore} punti. Obiettivo di ${scoreTarget} superato!`
      );
    } else if (newHands === 0) {
      setRoundStatus('lost');
      setAnnouncement(
        `SCONFITTA! Mani esaurite. Punteggio finale: ${newScore} su ${scoreTarget} richiesti.`
      );
    } else {
      setAnnouncement(
        `${breakdown.displayName} giocata: +${breakdown.finalScore} punti. Punteggio totale: ${newScore}/${scoreTarget}. Mani rimaste: ${newHands}.`
      );
    }
  }, [
    selectedCardIds,
    handsRemaining,
    roundStatus,
    evaluatedHand,
    score,
    hand,
    deck,
    scoreTarget,
    setFocusedIndex,
  ]);

  // Azione SCARTA (X)
  const handleDiscard = useCallback(() => {
    if (selectedCardIds.length === 0 || discardsRemaining <= 0 || roundStatus !== 'playing') {
      return;
    }

    const discardedCards = hand.filter((c) => selectedCardIds.includes(c.id));
    const remainingHand = hand.filter((c) => !selectedCardIds.includes(c.id));
    setDiscardPile((prev) => [...prev, ...discardedCards]);

    // Pesca carte sostitutive
    const { drawn, remaining: newDeck } = drawCards(deck, discardedCards.length);
    const newHand = [...remainingHand, ...drawn];

    setHand(newHand);
    setDeck(newDeck);
    setDiscardsRemaining((prev) => prev - 1);
    setSelectedCardIds([]);
    setFocusedIndex(0);
    setAnnouncement(
      `${discardedCards.length} carte scartate. Mano rifornita. Scarti rimasti: ${
        discardsRemaining - 1
      }.`
    );
  }, [
    selectedCardIds,
    discardsRemaining,
    roundStatus,
    hand,
    deck,
    setFocusedIndex,
  ]);

  // Riavvia il round / nuova partita
  const handleResetRound = useCallback(() => {
    const fullDeck = shuffleDeck(createStandardDeck());
    const { drawn, remaining } = drawCards(fullDeck, 8);
    setHand(drawn);
    setDeck(remaining);
    setDiscardPile([]);
    setSelectedCardIds([]);
    setScore(0);
    setHandsRemaining(INITIAL_HANDS);
    setDiscardsRemaining(INITIAL_DISCARDS);
    setRoundStatus('playing');
    setLastPlayedBreakdown(null);
    setFocusedIndex(0);
    setAnnouncement('Nuovo round iniziato. Mazzo mescolato e 8 carte distribuite.');
  }, [setFocusedIndex]);

  // Listener globale per scorciatoie da tastiera: '?', 'Enter', 'x'/'X'
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      // Apri/chiudi aiuto con '?'
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
        return;
      }

      // Se il dialog è aperto non gestire comandi di gioco
      if (isHelpOpen) return;

      // Gioca mano con 'Enter'
      if (e.key === 'Enter') {
        if (selectedCardIds.length > 0 && handsRemaining > 0 && roundStatus === 'playing') {
          e.preventDefault();
          handlePlayHand();
        }
        return;
      }

      // Scarta con 'x' o 'X'
      if (e.key === 'x' || e.key === 'X') {
        if (selectedCardIds.length > 0 && discardsRemaining > 0 && roundStatus === 'playing') {
          e.preventDefault();
          handleDiscard();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [
    isHelpOpen,
    selectedCardIds,
    handsRemaining,
    discardsRemaining,
    roundStatus,
    handlePlayHand,
    handleDiscard,
  ]);

  const scoreProgressPercent = Math.min(100, Math.floor((score / scoreTarget) * 100));

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
            aria-label="Apri registro comandi da tastiera con tasto punto di domanda"
          >
            [?] COMANDI
          </button>
        </nav>
      </header>

      {/* Barra Risorse e Stato */}
      <section className="tavern-status-bar pixel-panel" aria-label="Stato Partita">
        <div className="status-item">
          <span className="status-label">ANTE</span>
          <span className="status-value status-gold">1 / 8</span>
        </div>
        <div className="status-item">
          <span className="status-label">BLIND</span>
          <span className="status-value">Small Blind</span>
        </div>
        <div className="status-item">
          <span className="status-label">PUNTEGGIO / OBIETTIVO</span>
          <span className="status-value status-blood">
            {score} / {scoreTarget} PTS ({scoreProgressPercent}%)
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">ORO</span>
          <span className="status-value status-gold">$4</span>
        </div>
        <div className="status-item">
          <span className="status-label">HANDS</span>
          <span className={`status-value ${handsRemaining <= 1 ? 'status-blood' : ''}`}>
            {handsRemaining}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">DISCARDS</span>
          <span className="status-value">{discardsRemaining}</span>
        </div>
        <div className="status-item">
          <span className="status-label">MAZZO / SCARTI</span>
          <span className="status-value">
            {deck.length} / {discardPile.length}
          </span>
        </div>
      </section>

      {/* Barra Progresso Punti */}
      <div
        className="score-progress-bar-container"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={scoreTarget}
        aria-label="Avanzamento punteggio verso l'obiettivo del Blind"
      >
        <div
          className="score-progress-fill"
          style={{ width: `${scoreProgressPercent}%` }}
        />
      </div>

      {/* Tavolo da Gioco Principale */}
      <main className="tavern-table pixel-panel pixel-panel-blood" id="main-content">
        {/* Banner Esito Round (Vittoria o Sconfitta) */}
        {roundStatus === 'won' && (
          <div className="outcome-banner banner-won pixel-panel pixel-panel-blood" role="alert">
            <h2 className="outcome-title">[ OBIETTIVO RAGGIUNTO! BLIND SUPERATO ]</h2>
            <p>Hai accumulato {score} punti superando la soglia richiesta di {scoreTarget}.</p>
            <button type="button" className="pixel-btn pixel-btn-blood" onClick={handleResetRound}>
              [ GIOCA DI NUOVO IL BLIND ]
            </button>
          </div>
        )}

        {roundStatus === 'lost' && (
          <div className="outcome-banner banner-lost pixel-panel pixel-panel-blood" role="alert">
            <h2 className="outcome-title">[ SCONFITTA! MANI ESAURITE ]</h2>
            <p>La taverna non perdona. Punteggio ottenuto: {score} su {scoreTarget}.</p>
            <button type="button" className="pixel-btn pixel-btn-blood" onClick={handleResetRound}>
              [ RICOMINCIA RUN ]
            </button>
          </div>
        )}

        <div className="table-controls">
          <div className="selection-counter">
            <span>CARTE SELEZIONATE: </span>
            <span className="counter-number status-gold">{selectedCardIds.length} / 5</span>
          </div>
          <button
            type="button"
            className="pixel-btn"
            onClick={handleResetRound}
            aria-label="Ricomincia il round con mazzo nuovo e risorse piene"
          >
            [ RIAVVIA ROUND ]
          </button>
        </div>

        {/* Anteprima Mano di Poker Rilevata in Tempo Reale */}
        <HandPreview
          evaluatedHand={evaluatedHand}
          selectedCount={selectedCardIds.length}
        />

        {/* Gruppo Mano Accessibile WAI-ARIA con Roving Tabindex */}
        <section
          className="hand-container"
          role="group"
          aria-label={`Mano corrente di ${hand.length} carte. Usa freccia sinistra e destra per navigare, Spazio per selezionare, Invio per giocare, X per scartare.`}
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

        {/* Controlli Azione: Play Hand (Invio) e Discard (X) */}
        <PlayControls
          selectedCount={selectedCardIds.length}
          handsRemaining={handsRemaining}
          discardsRemaining={discardsRemaining}
          isRoundOver={roundStatus !== 'playing'}
          lastPlayedBreakdown={lastPlayedBreakdown}
          onPlayHand={handlePlayHand}
          onDiscard={handleDiscard}
        />

        <div className="step-indicator">
          <span>
            PASSO 5 COMPLETATO: MOTORE PUNTEGGIO & AZIONI ATTIVI (INVIO: PLAY HAND, X: DISCARD)
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="tavern-footer">
        <p>
          Navigazione totale da tastiera. Usa <kbd className="pixel-key">&lt;-</kbd>{' '}
          <kbd className="pixel-key">-&gt;</kbd> per scorrere, <kbd className="pixel-key">Spazio</kbd>{' '}
          per selezionare, <kbd className="pixel-key">Invio</kbd> per giocare la mano,{' '}
          <kbd className="pixel-key">X</kbd> per scartare, o <kbd className="pixel-key">?</kbd> per l'aiuto.
        </p>
      </footer>

      {/* Dialog Modale */}
      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
