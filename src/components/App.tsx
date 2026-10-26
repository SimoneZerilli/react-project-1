import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { PlayingCard } from '../types/game';
import { createStandardDeck, shuffleDeck, drawCards, formatRank, getSuitLabel } from '../game/deck';
import { evaluateHand } from '../game/handEvaluator';
import { useRovingTabindex } from '../hooks/useKeyboardNav';
import { CardView } from './CardView';
import { HandPreview } from './HandPreview';
import { HelpDialog } from './HelpDialog';
import '../styles/pixel-theme.css';
import './App.css';

export const App: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // Inizializzazione mazzo e mano di 8 carte
  const initialData = useMemo(() => {
    const fullDeck = shuffleDeck(createStandardDeck());
    const { drawn, remaining } = drawCards(fullDeck, 8);
    return { hand: drawn, deck: remaining };
  }, []);

  const [hand, setHand] = useState<PlayingCard[]>(initialData.hand);
  const [deck, setDeck] = useState<PlayingCard[]>(initialData.deck);
  const [announcement, setAnnouncement] = useState(
    'Mano di 8 carte distribuita. Usa le Frecce Sinistra e Destra per scorrere, Spazio per selezionare.'
  );

  // Carte selezionate e valutazione della mano in tempo reale tramite la funzione pura
  const selectedCards = useMemo(() => {
    return hand.filter((c) => selectedCardIds.includes(c.id));
  }, [hand, selectedCardIds]);

  const evaluatedHand = useMemo(() => {
    return evaluateHand(selectedCards);
  }, [selectedCards]);

  // Selezione della carta per ID
  const toggleCardSelection = useCallback((cardId: string) => {
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
  }, []);

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

  // Ridistribuisce la mano e ripristina il focus
  const handleDealNewHand = () => {
    const freshDeck = shuffleDeck(createStandardDeck());
    const { drawn, remaining } = drawCards(freshDeck, 8);
    setHand(drawn);
    setDeck(remaining);
    setSelectedCardIds([]);
    setFocusedIndex(0);
    setAnnouncement('Nuovo mazzo mescolato e mano di 8 carte distribuita.');
  };

  // Listener globale per aprire il menu di aiuto con '?'
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

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
          <span className="status-label">OBIETTIVO</span>
          <span className="status-value status-blood">300 PTS</span>
        </div>
        <div className="status-item">
          <span className="status-label">ORO</span>
          <span className="status-value status-gold">$4</span>
        </div>
        <div className="status-item">
          <span className="status-label">HANDS</span>
          <span className="status-value">4</span>
        </div>
        <div className="status-item">
          <span className="status-label">DISCARDS</span>
          <span className="status-value">4</span>
        </div>
        <div className="status-item">
          <span className="status-label">MAZZO</span>
          <span className="status-value">{deck.length} / 52</span>
        </div>
      </section>

      {/* Tavolo da Gioco con Mano di Carte e Riconoscimento Combinazioni */}
      <main className="tavern-table pixel-panel pixel-panel-blood" id="main-content">
        <div className="table-controls">
          <div className="selection-counter">
            <span>CARTE SELEZIONATE: </span>
            <span className="counter-number status-gold">{selectedCardIds.length} / 5</span>
          </div>
          <button
            type="button"
            className="pixel-btn"
            onClick={handleDealNewHand}
            aria-label="Rimescola il mazzo e distribuisci 8 carte nuove"
          >
            [ RIDISTRIBUISCI MANO ]
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
          aria-label={`Mano corrente di ${hand.length} carte. Usa freccia sinistra e destra per navigare, e Spazio per selezionare.`}
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

        <div className="step-indicator">
          <span>PASSO 4 COMPLETATO: MOTORE RICONOSCIMENTO MANI DI POKER ATTIVO IN TEMPO REALE</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="tavern-footer">
        <p>
          Navigazione totale da tastiera. Usa <kbd className="pixel-key">&lt;-</kbd> <kbd className="pixel-key">-&gt;</kbd> per scorrere, <kbd className="pixel-key">Spazio</kbd> per selezionare o <kbd className="pixel-key">?</kbd> per l'aiuto.
        </p>
      </footer>

      {/* Dialog Modale */}
      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
