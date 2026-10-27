# Architettura Tecnica: Balcard

Questo documento descrive le scelte architetturali, la struttura dello stato, il flusso di gioco e i principi di accessibilità implementati in **Balcard**.

---

## 1. Principi di Progettazione Fondamentali

1. **Separazione Rigorosa tra Logica e Presentazione**:
   - Tutta la logica di gioco risiede nella cartella `src/game/`.
   - Nessun modulo in `src/game/` importa React, hook o riferimenti al DOM (`window`, `document`).
   - I file in `src/game/` contengono funzioni pure, deterministiche e serializzabili, coperte da test unitari con **Vitest**.
2. **Stato Immutabile e Prevedibile**:
   - Lo stato globale di gioco è gestito tramite un modello serializzabile immutabile.
   - Ogni azione del giocatore (`PLAY_HAND`, `DISCARD`, `BUY_ITEM`, `SELL_JOKER`, ecc.) produce un nuovo stato senza mutazioni.
3. **Accessibilità come Requisito di Prima Classe**:
   - Conformità alle linee guida **WAI-ARIA 1.2**.
   - Navigazione tastiera completa (Roving Tabindex per la mano di carte).
   - Live regions (`aria-live="polite"`) per annunciare cambi di fase, punteggi e carte pescate agli screen reader.
   - Contrasto visivo rigoroso con focus sempre visibile e mai perso.
4. **Persistenza Locale Trasparente**:
   - Modulo `src/game/storage.ts` con serializzazione sicura, versioning `v1` e recupero automatico in caso di ricaricamento del browser.

---

## 2. Struttura dei Moduli

```text
src/
├── game/                    # LOGICA PURA (TESTABILE SENZA BROWSER / SENZA REACT)
│   ├── types.ts             # Interfacce TypeScript, enums e tipi discriminati
│   ├── deck.ts              # Generatore mazzo 52 carte, pescata e Fisher-Yates shuffle
│   ├── handEvaluator.ts     # Riconoscimento mani di poker e supporto livelli potenziati
│   ├── scoring.ts           # Pipeline matematica di punteggio (Chips X Mult) e debuff boss
│   ├── jokers.ts            # Catalogo ed esecuzione trigger dei 7 Joker medievali
│   ├── blinds.ts            # Configurazione Ante 1-8, calcolo target e 8 Boss Rules
│   ├── shop.ts              # Economia, rendita interesse, upgrade livelli mani e catalogo bottega
│   ├── runStats.ts          # Tracciamento statistiche globali della run e record punteggio
│   └── storage.ts           # Gestione salvataggio, caricamento e reset su localStorage
├── components/              # PRESENTAZIONE E UI REACT
│   ├── App.tsx              # Shell dell'applicazione e layout taverna medievale
│   ├── CardView.tsx         # Componente carta pixel con semantica WAI-ARIA
│   ├── HandPreview.tsx      # Riconoscimento mano e stima punteggio con bonus Jolly
│   ├── PlayControls.tsx     # Pulsanti di gioco (Play Hand / Discard) e resoconto ultima mano
│   ├── BlindSelect.tsx      # Schermata di selezione o skip del blind con dettaglio Boss Rule
│   ├── JokerSlots.tsx       # Barra dei 5 Joker equipaggiati e catalogo per test
│   ├── JokerCard.tsx        # Card singola Jolly con rarità e vendita
│   ├── ShopView.tsx         # Bottega della taverna con pergamene di upgrade e reroll
│   ├── VictoryScreen.tsx    # Schermata di trionfo finale Ante 8 con cronache della vittoria
│   └── HelpDialog.tsx       # Modale accessibile scorciatoie tastiera (? / Esc)
├── hooks/
│   └── useKeyboardNav.ts    # Gestione Roving Tabindex per navigazione con frecce
└── styles/
    ├── variables.css        # Palette medieval pixel (oro, pergamena scura, ferro, sangue)
    └── pixel-theme.css      # Regole grafiche retro pixel e componenti base
```

---

## 3. Macchina a Stati del Flusso di Gioco

Lo stato di gioco (`phase`) attraversa le seguenti fasi cicliche:

```text
[select_blind] ──(Skip con Tag)──────────────> [select_blind (prossimo)]
      │
      ▼ (Gioca Blind)
 [in_blind] <──────────────────────────┐
      │                                │
      ├──(Scarta carte)────────────────┤
      │                                │
      ├──(Gioca mano) ──> [calcolo] ───┘
      │                      │
      │           (Target Raggiunto?)
      │           ├── Sì ──> [round_won] ──> [shop] ──> [select_blind (Nuovo Blind)]
      │           └── No & Hands = 0 ──> [game_over]
      │
 (Superato Boss Ante 8) ──> [victory]
```

---

## 4. Pipeline di Calcolo del Punteggio (Scoring Engine)

Quando il giocatore attiva `PLAY_HAND`, la sequenza in `src/game/scoring.ts` opera come segue:
1. **Valutazione della Mano**: `evaluateHand(selectedCards, handLevels)` determina la combinazione più forte con i chip e mult base aggiornati al livello corrente della mano.
2. **Punti delle Carte**: Ciascuna carta valida aggiunge le sue chips nominali (es. Asso = +11, Re = +10, 7 = +7), a meno che non sia depotenziata da una Boss Rule attiva (es. Cuori contro la *Lama del Boia*).
3. **Trigger dei Joker (Fase 1 - Addizione)**: Vengono eseguiti tutti i Joker con trigger `onHandScoring` che aggiungono Chips o Mult (+Chips, +Mult) e oro istantaneo (es. *L'Alchimista*).
4. **Trigger dei Joker (Fase 2 - Moltiplicazione)**: Vengono applicati i fattori moltiplicativi composti (es. *Il Cavaliere Errante* moltiplica per 1.5X il totale se 0 scarti usati).
5. **Calcolo Finale**: `Punteggio = Math.floor(ChipsTotali * MultTotale)`.
6. **Accredito**: Il punteggio della mano si somma al punteggio cumulativo del Blind. Se `score >= currentBlind.scoreTarget`, il round è vinto.

---

## 5. Pattern di Accessibilità WAI-ARIA

- **Mano di Carte (Roving Tabindex)**:
  - Il contenitore usa `role="group"` con `aria-label`.
  - Ogni carta usa `role="checkbox"` con `aria-checked="true|false"` e `tabindex="0"` solo per la carta attiva (`tabindex="-1"` per le altre).
  - Le frecce `<-` e `->` spostano il focus aggiornando il nodo DOM attivo con `focusItem`.
  - Il tasto `Spazio` inverte la selezione senza perdere il focus.
- **Finestra di Aiuto (Modal Dialog)**:
  - Implementa `role="dialog"`, `aria-modal="true"`, `aria-labelledby="help-title"`.
  - Memorizza il focus precedente all'apertura (`previousFocusRef`) e lo ripristina esattamente alla chiusura con `Esc`.
  - Focus trap che confina `Tab` e `Shift+Tab` all'interno della modale.
- **Annunciatori Vocali (`aria-live`)**:
  - `role="status"` e `aria-live="polite"` annunciano ogni selezione, punteggio ottenuto, acquisto ed esito agli screen reader.
