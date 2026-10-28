import React, { useEffect, useRef } from 'react';
import type { RunStatistics } from '../game/runStats';
import { useLanguage } from '../i18n/LanguageContext';
import './HomeScreen.css';

interface HomeScreenProps {
  hasSavedRun: boolean;
  savedAnte?: number;
  stats: RunStatistics;
  installPrompt: BeforeInstallPromptEvent | null;
  onStartNewRun: () => void;
  onContinueRun: () => void;
  onOpenHelp: () => void;
  onInstallApp: () => void;
}

// Interfaccia per l'evento di installazione PWA standard del browser
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  hasSavedRun,
  savedAnte = 1,
  stats,
  installPrompt,
  onStartNewRun,
  onContinueRun,
  onOpenHelp,
  onInstallApp,
}) => {
  const { t, language, toggleLanguage } = useLanguage();
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    primaryButtonRef.current?.focus();
  }, []);

  return (
    <main className="home-screen pixel-panel pixel-panel-blood blood-drip-edge" role="main" aria-label="Home Screen Balcard">
      <div className="home-hero">
        <span className="home-crest">[ {t.appSubtitle} ]</span>
        <h1 className="home-title">Balcard</h1>
        <p className="home-lore">{t.homeTavernLore}</p>
        <p className="home-brief">{t.homeRulesBrief}</p>
      </div>

      <nav className="home-actions" aria-label="Menu Principale">
        {hasSavedRun && (
          <button
            ref={primaryButtonRef}
            type="button"
            className="pixel-btn pixel-btn-blood btn-home-action btn-continue"
            onClick={onContinueRun}
            aria-label={`${t.homeContinueRun} - Ante ${savedAnte}`}
          >
            {t.homeContinueRun} (Ante {savedAnte})
          </button>
        )}

        <button
          ref={!hasSavedRun ? primaryButtonRef : undefined}
          type="button"
          className={`pixel-btn ${hasSavedRun ? '' : 'pixel-btn-blood'} btn-home-action btn-start`}
          onClick={onStartNewRun}
          aria-label={t.homeStartRun}
        >
          {t.homeStartRun}
        </button>

        <button
          type="button"
          className="pixel-btn btn-home-action"
          onClick={onOpenHelp}
          aria-label={t.homeHowToPlay}
        >
          {t.homeHowToPlay}
        </button>

        {installPrompt && (
          <button
            type="button"
            className="pixel-btn btn-home-action btn-install"
            onClick={onInstallApp}
            aria-label={t.homeInstallApp}
          >
            {t.homeInstallApp}
          </button>
        )}

        <button
          type="button"
          className="pixel-btn btn-lang-switch btn-home-lang"
          onClick={toggleLanguage}
          aria-label={`Lingua: ${language.toUpperCase()}. Clicca per cambiare.`}
        >
          [ {t.langSwitch} ]
        </button>
      </nav>

      {/* Riquadro Statistiche Carriera */}
      <section className="home-stats-preview pixel-panel" aria-label="Statistiche Carriera">
        <span className="stats-box-tag">[ {t.runStatsTitle} ]</span>
        <div className="home-stats-grid">
          <div className="home-stat-item">
            <span className="home-stat-label">{t.statsHandsPlayed}</span>
            <span className="home-stat-val status-gold">{stats.handsPlayed}</span>
          </div>
          <div className="home-stat-item">
            <span className="home-stat-label">{language === 'it' ? 'Blind Vinti:' : 'Blinds Won:'}</span>
            <span className="home-stat-val status-gold">{stats.blindsWon}</span>
          </div>
          <div className="home-stat-item">
            <span className="home-stat-label">{t.statsGoldEarned}</span>
            <span className="home-stat-val status-gold">${stats.totalGoldEarned}</span>
          </div>
          <div className="home-stat-item">
            <span className="home-stat-label">{language === 'it' ? 'Miglior Mano:' : 'Best Hand:'}</span>
            <span className="home-stat-val status-blood">
              {stats.bestHandName ? `${stats.bestHandName} (+${stats.bestHandScore})` : '-'}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};

