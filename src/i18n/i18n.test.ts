import { describe, it, expect } from 'vitest';
import { translations } from './index';

describe('i18n Localization Engine', () => {
  it('dovrebbe includere sia inglese che italiano', () => {
    expect(translations.en).toBeDefined();
    expect(translations.it).toBeDefined();
  });

  it('dovrebbe avere le stesse chiavi principali per entrambe le lingue', () => {
    const enKeys = Object.keys(translations.en).sort();
    const itKeys = Object.keys(translations.it).sort();
    expect(enKeys).toEqual(itKeys);
  });

  it('dovrebbe includere tutte le 9 combinazioni di poker tradotte in EN e IT', () => {
    const hands = [
      'high_card',
      'pair',
      'two_pair',
      'three_of_a_kind',
      'straight',
      'flush',
      'full_house',
      'four_of_a_kind',
      'straight_flush',
    ];

    for (const h of hands) {
      expect(translations.en.pokerHands[h]).toBeDefined();
      expect(translations.it.pokerHands[h]).toBeDefined();
    }
    expect(translations.en.pokerHands['two_pair']).toBe('Two Pair');
    expect(translations.it.pokerHands['two_pair']).toBe('Doppia Coppia');
  });

  it('dovrebbe contenere traduzioni per tutti i 7 Joker per entrambe le lingue', () => {
    const jokerIds = [
      'court_jester',
      'alchemist',
      'royal_blacksmith',
      'monk_scribe',
      'marksman_crossbow',
      'knight_errant',
      'village_usurer',
    ];

    for (const id of jokerIds) {
      expect(translations.en.jokers[id]).toBeDefined();
      expect(translations.en.jokers[id].name.length).toBeGreaterThan(0);
      expect(translations.it.jokers[id]).toBeDefined();
      expect(translations.it.jokers[id].name.length).toBeGreaterThan(0);
    }
  });

  it('dovrebbe contenere traduzioni per tutte le 8 regole dei Boss', () => {
    const bossRuleIds = [
      'executioner_blade',
      'corrupted_blood',
      'grave_mist',
      'rusted_chains',
      'blind_monk',
      'taxman_leech',
      'crimson_needle',
      'abyssal_warden',
    ];

    for (const id of bossRuleIds) {
      expect(translations.en.bossRules[id]).toBeDefined();
      expect(translations.it.bossRules[id]).toBeDefined();
    }
  });
});
