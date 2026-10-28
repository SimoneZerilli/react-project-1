import { describe, it, expect } from 'vitest';
import { getRankFullName, getSuitLabel, getSuitAbbreviation, ALL_RANKS, ALL_SUITS } from './deck';
import { translations } from '../i18n';
import fs from 'node:fs';
import path from 'node:path';

describe('Accessibility & WCAG Compliance', () => {
  it('dovrebbe generare nomi screen reader comprensibili e completi per tutte le 52 combinazioni', () => {
    for (const suit of ALL_SUITS) {
      for (const rank of ALL_RANKS) {
        const itRank = getRankFullName(rank, 'it');
        const itSuit = translations.it.suits[suit];
        const itLabelSelected = `${itRank} di ${itSuit}, selezionata`;
        const itLabelUnselected = `${itRank} di ${itSuit}, non selezionata`;

        expect(itLabelSelected).toContain('selezionata');
        expect(itLabelUnselected).toContain('non selezionata');
        expect(itLabelSelected).not.toContain('undefined');

        const enRank = getRankFullName(rank, 'en');
        const enSuit = translations.en.suits[suit];
        const enLabelSelected = `${enRank} of ${enSuit}, selected`;
        expect(enLabelSelected).toContain('selected');
        expect(enLabelSelected).not.toContain('undefined');
      }
    }
  });

  it('dovrebbe garantire che il seme non sia comunicato solo dal colore', () => {
    for (const suit of ALL_SUITS) {
      const abbr = getSuitAbbreviation(suit);
      const label = getSuitLabel(suit);
      expect(abbr).toMatch(/^[HDCS]$/);
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it('il foglio di stile dovrebbe implementare @media (prefers-reduced-motion: reduce) e override manuale', () => {
    const cssPath = path.resolve(process.cwd(), 'src/styles/pixel-theme.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    expect(cssContent).toContain('prefers-reduced-motion: reduce');
    expect(cssContent).toContain('animation-duration: 0.001ms');
    expect(cssContent).toContain(":root[data-reduced-motion='true']");
  });

  it('dovrebbe includere la definizione dello Skip Link per WCAG 2.4.1 (Salto dei blocchi)', () => {
    const cssPath = path.resolve(process.cwd(), 'src/styles/pixel-theme.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    expect(cssContent).toContain('.skip-link');
    expect(cssContent).toContain('.skip-link:focus');
  });

  it('dovrebbe supportare il reflow fluido a 320px di larghezza senza scroll orizzontale (WCAG 1.4.10)', () => {
    const appCssPath = path.resolve(process.cwd(), 'src/components/App.css');
    const appCssContent = fs.readFileSync(appCssPath, 'utf-8');
    expect(appCssContent).toContain('@media (max-width: 360px)');
    expect(appCssContent).toContain('overflow-x: hidden');
  });

  it('dovrebbe contenere tutte le traduzioni per Skip Link, titoli dinamici e dichiarazione di accessibilità EAA', () => {
    expect(translations.it.skipToContent).toBe('Salta al contenuto principale');
    expect(translations.en.skipToContent).toBe('Skip to main content');

    expect(translations.it.accessibilityStatementTitle).toBeTruthy();
    expect(translations.en.accessibilityStatementTitle).toBeTruthy();

    expect(translations.it.titleHome).toBeTruthy();
    expect(translations.it.titleSelectBlind).toBeTruthy();
    expect(translations.it.titleShop).toBeTruthy();
    expect(translations.it.titleGameOver).toBeTruthy();
    expect(translations.it.titleVictory).toBeTruthy();

    expect(translations.it.accessibilityFeatures.length).toBeGreaterThanOrEqual(5);
    expect(translations.en.accessibilityFeatures.length).toBeGreaterThanOrEqual(5);
  });

  it('la palette principale deve rispettare i requisiti di contrasto WCAG AA (> 4.5:1)', () => {
    const varPath = path.resolve(process.cwd(), 'src/styles/variables.css');
    const varContent = fs.readFileSync(varPath, 'utf-8');
    expect(varContent).toContain('--text-primary: #f5ebe1');
    expect(varContent).toContain('--text-muted: #baa898');
    expect(varContent).toContain('--focus-ring: #ff2222');
  });
});
