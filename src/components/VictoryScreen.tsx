import React, { useEffect, useRef } from 'react';
import type { RunStatistics } from '../game/runStats';
import './VictoryScreen.css';

interface VictoryScreenProps {
  money: number;
  stats: RunStatistics;
  onRestart: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  money,
  stats,
  onRestart,
}) => {
  const restartButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    restartButtonRef.current?.focus();
  }, []);

  return (
    <section
      className="victory-screen pixel-panel pixel-panel-blood"
      role="region"
      aria-label="Schermata di Vittoria della Run"
    >
      <div className="victory-banner banner-won pixel-panel">
        <span className="victory-tag">[ TRIONFO SUPREMO ]</span>
        <h2 className="victory-title">TUTTI GLI 8 ANTE DELLA TAVERNA SONO STATI CONQUISTATI</h2>
        <p className="victory-subtitle">
          Hai abbattuto il Tiranno della Taverna e inciso il tuo nome nei registri di sangue di Balcard.
        </p>

        {/* Quadro Statistiche Run */}
        <div className="victory-stats-table pixel-panel">
          <span className="stats-header-title">[ CRONACHE DELLA TUA VITTORIA ]</span>

          <div className="stat-line">
            <span className="stat-label">Oro Finale nel Forziere:</span>
            <span className="stat-number status-gold">${money}</span>
          </div>

          <div className="stat-line">
            <span className="stat-label">Oro Totale Incassato nella Run:</span>
            <span className="stat-number status-gold">${stats.totalGoldEarned}</span>
          </div>

          <div className="stat-line">
            <span className="stat-label">Blind Conquistati in Combattimento:</span>
            <span className="stat-number status-gold">{stats.blindsWon}</span>
          </div>

          <div className="stat-line">
            <span className="stat-label">Blind Saltati per Tag:</span>
            <span className="stat-number">{stats.blindsSkipped}</span>
          </div>

          <div className="stat-line">
            <span className="stat-label">Mani Totali Giocate:</span>
            <span className="stat-number">{stats.handsPlayed}</span>
          </div>

          <div className="stat-line">
            <span className="stat-label">Carte Totali Scartate:</span>
            <span className="stat-number">{stats.cardsDiscarded}</span>
          </div>

          <div className="stat-line best-hand-line">
            <span className="stat-label">Miglior Mano della Partita:</span>
            <span className="stat-number status-blood">
              {stats.bestHandName} (+{stats.bestHandScore} PTS)
            </span>
          </div>
        </div>

        <button
          ref={restartButtonRef}
          type="button"
          className="pixel-btn pixel-btn-blood btn-restart-victory"
          onClick={onRestart}
          aria-label="Inizia una nuova run dall'Ante 1 con tasto Invio"
        >
          [ INIZIA UNA NUOVA RUN (INVIO) ]
        </button>
      </div>
    </section>
  );
};

