import React, { useEffect, useRef } from 'react';
import type { RunStatistics } from '../game/runStats';
import { useLanguage } from '../i18n/LanguageContext';
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
  const { t, language } = useLanguage();
  const restartButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    restartButtonRef.current?.focus();
  }, []);

  return (
    <section
      className="victory-screen pixel-panel pixel-panel-blood"
      role="region"
      aria-label={t.victoryTitle}
    >
      <div className="victory-banner banner-won pixel-panel">
        <span className="victory-tag">[ {t.victoryTitle} ]</span>
        <h2 className="victory-title">
          {language === 'en'
            ? 'ALL 8 TAVERN ANTES HAVE BEEN CONQUERED'
            : 'TUTTI GLI 8 ANTE DELLA TAVERNA SONO STATI CONQUISTATI'}
        </h2>
        <p className="victory-subtitle">{t.victoryDesc}</p>

        {/* Quadro Statistiche Run */}
        <div className="victory-stats-table pixel-panel">
          <span className="stats-header-title">[ {t.runStatsTitle} ]</span>

          <div className="stat-line">
            <span className="stat-label">
              {language === 'en' ? 'Final Gold in Vault:' : 'Oro Finale nel Forziere:'}
            </span>
            <span className="stat-number status-gold">${money}</span>
          </div>

          <div className="stat-line">
            <span className="stat-label">{t.statsGoldEarned}</span>
            <span className="stat-number status-gold">${stats.totalGoldEarned}</span>
          </div>

          <div className="stat-line">
            <span className="stat-label">
              {language === 'en' ? 'Blinds Conquered:' : 'Blind Conquistati in Combattimento:'}
            </span>
            <span className="stat-number status-gold">{stats.blindsWon}</span>
          </div>

          <div className="stat-line">
            <span className="stat-label">
              {language === 'en' ? 'Blinds Skipped for Tags:' : 'Blind Saltati per Tag:'}
            </span>
            <span className="stat-number">{stats.blindsSkipped}</span>
          </div>

          <div className="stat-line">
            <span className="stat-label">{t.statsHandsPlayed}</span>
            <span className="stat-number">{stats.handsPlayed}</span>
          </div>

          <div className="stat-line">
            <span className="stat-label">{t.statsCardsDiscarded}</span>
            <span className="stat-number">{stats.cardsDiscarded}</span>
          </div>

          <div className="stat-line best-hand-line">
            <span className="stat-label">
              {language === 'en' ? 'Highest Scoring Hand:' : 'Miglior Mano della Partita:'}
            </span>
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
          aria-label={t.newRunBtn}
        >
          {t.newRunBtn}
        </button>
      </div>
    </section>
  );
};
