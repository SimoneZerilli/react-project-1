import React from 'react';
import type { Blind } from '../types/game';
import { useLanguage } from '../i18n/LanguageContext';
import './BlindSelect.css';

interface BlindSelectProps {
  ante: number;
  smallBlind: Blind;
  bigBlind: Blind;
  bossBlind: Blind;
  activeBlindType: 'small' | 'big' | 'boss';
  onPlayBlind: (blind: Blind) => void;
  onSkipBlind: (blind: Blind) => void;
}

export const BlindSelect: React.FC<BlindSelectProps> = ({
  ante,
  smallBlind,
  bigBlind,
  bossBlind,
  activeBlindType,
  onPlayBlind,
  onSkipBlind,
}) => {
  const { t } = useLanguage();
  const blinds = [smallBlind, bigBlind, bossBlind];

  const getStatus = (blind: Blind) => {
    if (blind.type === activeBlindType) return 'current';
    if (activeBlindType === 'boss') return 'completed';
    if (activeBlindType === 'big' && blind.type === 'small') return 'completed';
    return 'upcoming';
  };

  const getBlindTitle = (type: string) => {
    switch (type) {
      case 'small':
        return t.smallBlindTitle;
      case 'big':
        return t.bigBlindTitle;
      case 'boss':
        return t.bossBlindTitle;
      default:
        return type.toUpperCase();
    }
  };

  return (
    <div className="blind-select-screen pixel-panel pixel-panel-blood" role="region" aria-label={t.blindSelectTitle}>
      <div className="blind-select-header">
        <span className="ante-badge status-gold">[ {t.ante} {ante} / 8 ]</span>
        <h2 className="blind-select-title">{t.blindSelectTitle}</h2>
        <p className="blind-select-desc">{t.blindSelectSubtitle}</p>
      </div>

      <div className="blinds-grid" role="list" aria-label={t.blindSelectTitle}>
        {blinds.map((b) => {
          const status = getStatus(b);
          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';
          const title = getBlindTitle(b.type);

          const bossRuleInfo = b.bossRule ? (t.bossRules[b.bossRule.id] ?? b.bossRule) : null;
          const skipTagInfo = b.skipTag ? (t.tagRewards[b.skipTag.id] ?? b.skipTag) : null;

          return (
            <article
              key={b.type}
              className={`blind-card pixel-panel ${isCurrent ? 'blind-card-active' : ''} ${
                isCompleted ? 'blind-card-completed' : ''
              } ${b.type === 'boss' ? 'blind-card-boss' : ''}`}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="blind-card-header">
                <span className="blind-tag-label">[{b.type.toUpperCase()}]</span>
                <h3 className="blind-title">{title}</h3>
              </div>

              <div className="blind-stats">
                <div className="blind-stat-row">
                  <span className="stat-name">{t.target}:</span>
                  <span className="stat-val status-blood">{b.scoreTarget} PTS</span>
                </div>
                <div className="blind-stat-row">
                  <span className="stat-name">{t.reward}:</span>
                  <span className="stat-val status-gold">+${b.rewardMoney}</span>
                </div>
              </div>

              {/* Regola Boss */}
              {bossRuleInfo && (
                <div className="boss-rule-box">
                  <span className="boss-rule-tag">[ {t.activeBoss} ]</span>
                  <h4 className="boss-rule-name">{bossRuleInfo.name}</h4>
                  <p className="boss-rule-desc">{bossRuleInfo.description}</p>
                </div>
              )}

              {/* Tag di Skip */}
              {skipTagInfo && b.canSkip && (
                <div className="skip-tag-box">
                  <span className="skip-tag-title">[ {t.tagReward} ]</span>
                  <p className="skip-tag-desc">
                    <strong>{skipTagInfo.name}</strong>: {skipTagInfo.description}
                  </p>
                </div>
              )}

              {/* Azioni del Blind */}
              <div className="blind-actions">
                {isCompleted && (
                  <span className="completed-badge">[ COMPLETED ]</span>
                )}

                {isCurrent && (
                  <>
                    <button
                      type="button"
                      className="pixel-btn pixel-btn-blood btn-play-blind"
                      onClick={() => onPlayBlind(b)}
                      aria-label={`${t.selectBlindBtn} ${title}`}
                    >
                      {t.selectBlindBtn}
                    </button>

                    {b.canSkip && (
                      <button
                        type="button"
                        className="pixel-btn btn-skip-blind"
                        onClick={() => onSkipBlind(b)}
                        aria-label={`${t.skipBlindBtn} ${title}`}
                      >
                        {t.skipBlindBtn}
                      </button>
                    )}
                  </>
                )}

                {!isCurrent && !isCompleted && (
                  <span className="locked-badge">[ LOCKED ]</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
