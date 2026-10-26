# Architettura Tecnica: Balcard

Questo documento descrive le scelte architetturali, la struttura dello stato, il flusso di gioco e i principi di accessibilità implementati in **Balcard**.

---

## 1. Principi di Progettazione Fondamentali

1. **Separazione Rigorosa tra Logica e Presentazione**:
   - Tutta la logica di gioco risiede nella cartella `src/game/`.
   - Nessun modulo in `src/game/` può importare React, hook o riferimenti al DOM (`window`, `document`).
   - I file in `src/game/` contengono funzioni pure, deterministiche e serializzabili, coperte da test unitari con **Vitest**.
2. **Stato Immutabile e Prevedibile**:
   - Lo stato globale di gioco è gestito tramite un pattern Reducer puro (`stateReducer.ts`).
   - Ogni azione del giocatore (`SELECT_CARD`, `PLAY_HAND`, `DISCARD`, `BUY_JOKER`, ecc.) produce un nuovo stato immutabile.
3. **Accessibilità come Requisito di Prima Classe**:
   - Conformità alle linee guida **WAI-ARIA 1.2**.
   - Navigazione tastiera completa (Roving Tabindex per la mano di carte).
   - Live regions (`aria-live="polite"`) per annunciare cambi di fase, punteggi e carte pescate agli screen reader.
   - Contrasto visivo rigoroso (minimo 4.5:1 / 7:1) con focus sempre visibile e mai perso.

---

## 2. Struttura dei Moduli

```text
src/
├── game/                    # LOGICA PURA (TESTABILE SENZA BROWSER / SENZA REACT)
│   ├── types.ts             # Interfacce TypeScript, enums e unioni discriminate
│   ├── deck.ts              # Generatore mazzo 52 carte, pescata e Fisher-Yates shuffle
│   ├── handEvaluator.ts     # Riconoscimento mani di poker e carte partecipanti
│   ├── scoring.ts           # Pipeline matematica di punteggio (Chips × Mult)
│   ├── jokers.ts            # Catalogo ed esecuzione trigger dei 7 Joker medievali
│   ├── blinds.ts            # Configurazione Ante 1-8, calcolo target e Boss Rules
│   └── stateReducer.ts      # Reducer dello stato della run
├── components/              # PRESENTAZIONE E UI REACT
│   ├── App.tsx              # Shell dell'applicazione e layout taverna medievale
│   ├── Header.tsx           # Statistiche Ante, Soldi, Obiettivo e Punteggio
│   ├── PlayArea.tsx         # Tavolo con carte in mano e bottoni Play/Discard
│   ├── CardView.tsx         # Componente carta pixel con semantica WAI-ARIA
│   ├── JokerSlots.tsx       # Barra dei 5 Joker equipaggiati
│   ├── ShopView.tsx         # Negozio tra i blind
│   ├── BlindSelect.tsx      # Schermata di selezione o skip del blind
│   └── HelpDialog.tsx       # Modale accessibile scorciatoie tastiera (? / Esc)
├── hooks/
│   ├── useGame.ts           # Facade React che espone lo stato e i dispatcher
│   └── useKeyboardNav.ts    # Gestione delle frecce, scorciatoie globali e focus trap
└── styles/
    ├── variables.css        # Palette medieval pixel (oro, pergamena scura, ferro)
    ├── pixel-theme.css      # Regole grafiche retro pixel e componenti base
    └── main.css             # Layout responsivo
```

---

## 3. Macchina a Stati del Flusso di Gioco

Lo stato di gioco (`GameState.phase`) attraversa le seguenti fasi cicliche:

```text
[select_blind] ──(Skip con Tag)──────────────> [shop]
      │
      ▼ (Gioca Blind)
 [in_blind] <──────────────────────────┐
      │                                │
      ├──(Scarta carte)────────────────┤
      │                                │
      ├──(Gioca mano) ──> [scoring] ───┘
      │                      │
      │           (Target Raggiunto?)
      │           ├── Sì ──> [round_won] ──> [shop] ──> [select_blind (Nuovo Blind)]
      │           └── No & Hands = 0 ──> [game_over]
      │
 (Superato Boss Ante 8) ──> [victory]
```

---

## 4. Pipeline di Calcolo del Punteggio (Scoring Engine)

Quando il giocatore attiva `PLAY_HAND`, la sequenza di calcolo in `src/game/scoring.ts` opera come segue:
1. **Valutazione della Mano**: `evaluateHand(selectedCards)` determina la combinazione più forte (es. *Full House*).
2. **Chips e Mult Base**: Vengono estratti i valori correnti della mano dal registro dei livelli (`handLevels[handType]`).
3. **Punti delle Carte**: Ciascuna carta che concorre al punteggio aggiunge le sue chips nominali (es. Asso = +11, Re = +10, 7 = +7) più eventuali modificatori individuali.
4. **Trigger dei Joker (Fase 1 - Addizione)**: Vengono eseguiti in ordine da sinistra a destra tutti i Joker con trigger `onHandScoring` che aggiungono Chips o Mult (+Chips, +Mult).
5. **Trigger dei Joker (Fase 2 - Moltiplicazione)**: Vengono applicati i moltiplicatori composti (`multiplyMult`).
6. **Calcolo Finale**: `Punteggio = Math.floor(ChipsTotali * MultTotale)`.
7. **Accredito**: Il punteggio della mano si somma al punteggio cumulativo del Blind corrente. Se `score >= scoreTarget`, il round è vinto.

---

## 5. Pattern di Accessibilità WAI-ARIA

- **Mano di Carte (Roving Tabindex)**:
  - Il contenitore della mano usa `role="group"` con `aria-label="Mano di carte corrente"`.
  - Ogni carta usa `role="checkbox"` con `aria-checked="true|false"` e `tabindex="0"` solo per la carta correntemente focalizzata (le altre hanno `tabindex="-1"`).
  - La pressione di `Freccia Destra` e `Freccia Sinistra` sposta il focus all'elemento successivo/precedente aggiornando il `tabindex`.
  - Il tasto `Spazio` inverte `aria-checked` per la carta attiva senza perdere il focus.
- **Finestra di Aiuto (Modal Dialog)**:
  - Implementa `role="dialog"`, `aria-modal="true"`, `aria-labelledby="help-title"`.
  - All'apertura tramite `?`, memorizza l'ultimo elemento focalizzato e porta il focus sul primo elemento interattivo interno.
  - La pressione di `Esc` o del pulsante di chiusura chiude il dialog e ripristina il focus esattamente all'elemento salvato in precedenza.
  - Focus trap attivo: `Tab` cicla unicamente all'interno del dialog mentre è aperto.
- **Annunciatori Vocali (`aria-live`)**:
  - Un elemento invisibile a schermo con `role="status"` e `aria-live="polite"` annuncia cambi di punteggio, passaggio al negozio e notifiche di gioco.

