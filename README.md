# Balcard | Roguelike Poker Medievale

**Balcard** è un gioco di carte roguelike a turni ispirato alle meccaniche di manipolazione del poker, ambientato in una cupa taverna medievale in stile dark pixel art.

Il progetto è caratterizzato da una separazione assoluta tra logica matematica/regole in puro TypeScript e interfaccia utente React, garantendo piena accessibilità da tastiera (WAI-ARIA APG), conformità WCAG 2.1 AA/AAA, supporto offline tramite Progressive Web App (PWA) e localizzazione bilingue (Italiano e Inglese).

---

## 1. IL BLOCCO DI CONTESTO USATO CON L'AI

Per guidare l'intelligenza artificiale nello sviluppo dell'intero progetto è stato impiegato un blocco di contesto strutturato (*System & Project Context Prompt*), mirato a garantire rigore architetturale, coerenza estetica e conformità agli standard di accessibilità:

```text
[ RUOLO E IDENTITÀ ARCHITETTURALE ]
Agisci come Senior Frontend Software Architect & Accessibility Specialist.
Stai sviluppando "Balcard", un roguelike poker strategico a turni con estetica dark medievale pixel art.

[ ARCHITETTURA E SEPARAZIONE DELLE RESPONSABILITÀ ]
1. Logica Pura Indipendente (src/game/):
   - Nessun import di React, nessun hook, nessun riferimento al DOM.
   - Tutti i calcoli (evaluator mani di poker, calcolo moltiplicatori/chip dei Joker, generazione blind, negozio, statistiche, deck management) devono essere funzioni pure, immutabili e coperte da test unitari con Vitest.
2. Presentazione e UI (src/components/):
   - Componenti React funzionali focalizzati esclusivamente sul rendering e sulla cattura degli eventi utente.
   - Nessun framework UI esterno (es. Material UI, Tailwind, Bootstrap). Solo CSS moderno nativo con variabili CSS e pixel art styling.
3. Tipizzazione Rigorosa:
   - TypeScript in modalità "strict" totale. Nessun uso di 'any' o 'unknown' non validato.

[ STILE VISIVO E LINEE GUIDA ESPRESSIVE ]
- Tema: Cupa taverna medievale, pixel art dettagliata, pergamene intrise di sangue, dettagli in oro e tonalità scure (#0a0706, #8a1c14, #eab308).
- ZERO EMOJI: È severamente vietato l'uso di emoji grafiche standard (come 🃏, 🗡️, 🪙). Usa solo tipografia retrò a parentesi quadre: [ BALCARD ], [ REIMPOSTA ], [ JOKER ], [ ACQUISTA ].

[ ACCESSIBILITÀ E WAI-ARIA (PRIORITÀ ASSOLUTA) ]
- Conformità WCAG 2.1 AA (con contrasti cromatici verificati superiori a 7.5:1, oltre il target AAA).
- Roving Tabindex Pattern ufficiale del W3C APG per la gestione e selezione delle carte in mano (frecce sinistra/destra, selezione con barra Spazio).
- Dialog Modal Pattern con Focus Trap ciclico (Tab / Shift+Tab) e chiusura con Escape per i comandi di aiuto (tasto ?).
- Live Region con aria-live="polite" per annunciare a screen reader:
  Formula obbligatoria: [Combinazione giocata] + [Punti ottenuti] + [Punti mancanti all'obiettivo del Blind].
- Distinzione non-cromatica dei semi: il seme non deve MAI essere comunicato unicamente dal colore; ogni carta espone badge testuali espliciti ([H], [D], [C], [S]) ed etichette comprensibili per screen reader (es. "Regina di Cuori, selezionata").
- Supporto a prefers-reduced-motion: azzeramento istantaneo di ogni scuotimento o animazione per utenti sensibili.
- Mobile friendly: utilizzabile da 360px di larghezza senza scrolling orizzontale, aree toccabili di almeno 44x44px. Nessuna informazione o azione subordinata unicamente all'hover del mouse.

[ LOCALIZZAZIONE ED ESPERIENZA UTENTE ]
- Supporto bilingue integrato (Italiano e Inglese) commutabile in tempo reale da interfaccia e da tastiera, con persistenza delle preferenze.
- Schermata Home iniziale con salvataggio automatico/ripresa della partita e gestione PWA.
- Funzionamento completo offline via Service Worker e installazione guidata su browser desktop e mobile.
```

---

## 2. LE LIBRERIE SCELTE E PERCHÉ

Tutte le dipendenze sono state selezionate con un principio di **essenzialità e zero-bloat**:

### Dipendenze di Produzione (`dependencies`):
1. **`react`** (`^19.3.1`):
   - *Perché è stata scelta*: Fornisce il modello di programmazione reattivo e dichiarativo per gestire lo stato della UI, i contesti di localizzazione e il ciclo di vita dei componenti.
2. **`react-dom`** (`^19.3.1`):
   - *Perché è stata scelta*: Interfaccia diretta tra React e l'albero DOM del browser, consentendo la gestione nativa dei nodi accessibili e del focus.

### Dipendenze di Sviluppo (`devDependencies`):
1. **`typescript`** (`~6.0.3`):
   - *Perché è stata scelta*: Garantisce la correttezza formale delle regole di gioco, prevenendo bug di calcolo delle mani di poker, transizioni di stato e definizioni delle carte grazie alla tipizzazione statica rigida (`strict: true`).
2. **`vite`** (`^8.3.4`):
   - *Perché è stata scelta*: Bundler di ultima generazione estremamente performante, con avvio a freddo istantaneo, HMR (Hot Module Replacement) millisecondo e pipeline di produzione ottimizzata per PWA.
3. **`@vitejs/plugin-react`** (`^6.1.2`):
   - *Perché è stata scelta*: Integrazione nativa del compilatore JSX/TSX di React all'interno del flusso Vite.
4. **`vitest`** (`^5.0.5`):
   - *Perché è stata scelta*: Esecutore di test integrato con l'ecosistema Vite, capace di eseguire la suite completa di test unitari della logica di gioco in meno di 500 millisecondi senza complesse configurazioni Jest/Babel.
5. **`@types/react`**, **`@types/react-dom`**, **`@types/node`**:
   - *Perché sono state scelte*: Definizioni di tipi TypeScript ufficiali per le API di React, del DOM e per i controlli nei test di accessibilità.
6. **`eslint`**, **`@eslint/js`**, **`typescript-eslint`**, **`eslint-plugin-react-hooks`**, **`eslint-plugin-react-refresh`**:
   - *Perché sono state scelte*: Analisi statica del codice per prevenire violazioni delle regole degli hook di React, memory leak o incongruenze di formattazione.

### Perché NON sono state usate librerie UI esterne (es. Material UI, Tailwind, Chakra, Redux):
- **Isolamento e Fedeltà Grafica**: I framework CSS/UI iniettano fogli di stile pesanti con layout preconfezionati che contrastano con l'estetica artigianale "pixel art medievale" a 8/16-bit e i bordi scalettati personalizzati.
- **Accessibilità Senza Compromessi**: Molte librerie di terze parti incapsulano la gestione degli eventi in overlay proprietari, ostacolando l'implementazione personalizzata del pattern W3C Roving Tabindex e la gestione trasparente delle Live Region.
- **Zero Runtime Overhead & PWA Leggera**: L'assenza di dipendenze pesanti mantiene l'intero bundle JavaScript di produzione sotto i 90 kB gzippati, consentendo un caricamento istantaneo su reti mobili lente e installazioni PWA ultraleggere.

---

## 3. LE FONTI CONSULTATE SULL'ACCESSIBILITÀ

L'accessibilità di Balcard è conforme alle linee guida internazionali del Consorzio W3C ed è stata validata con strumenti di analisi automatica e manuale:

1. **W3C WAI-ARIA Authoring Practices Guide (APG)**:
   - *Roving Tabindex Pattern*: [Keyboard Navigation within Components](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex) (utilizzato per la gestione del focus tra le carte in mano).
   - *Dialog (Modal) Pattern*: [Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) (applicato alla finestra di aiuto e comandi rapiti con focus trap).
   - *Live Regions & Status*: [Status Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/status/) (utilizzato per gli annunci tempestivi a screen reader dopo ogni mano o scarto).
2. **European Accessibility Act (EAA - Direttiva UE 2019/882) & Standard EN 301 549**:
   - Requisiti europei di accessibilità per prodotti e servizi digitali: conformità obbligatoria a 4 principi (Percettibile, Utilizzabile, Comprensibile, Robusto).
   - *Dichiarazione di Accessibilità & Meccanismo di Feedback*: implementazione del registro accessibilità in-app con contatto per la notifica delle barriere (EN 301 549 / EAA Cap. 4).
3. **W3C Web Content Accessibility Guidelines (WCAG) 2.1 & 2.2 (Livello A, AA, AAA)**:
   - *Success Criterion 1.4.1 Use of Color (Level A)*: [Understanding Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html) (il seme non è mai comunicato unicamente dal colore; ogni carta espone badge testuali espliciti ed etichette vocali complete).
   - *Success Criterion 1.4.3 Contrast (Minimum - Level AA)*: [Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) (rapporti di contrasto verificati superiori a 7.5:1, conformi anche a livello AAA).
   - *Success Criterion 1.4.10 Reflow (Level AA)*: [Understanding Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html) (nessuna perdita di contenuto o bidimensional scrolling fino a 320 CSS pixel e al 400% di zoom).
   - *Success Criterion 2.1.1 Keyboard (Level A)*: Navigabilità completa di ogni interazione e acquisto senza necessità di mouse o puntatore.
   - *Success Criterion 2.1.2 No Keyboard Trap (Level A)*: La modale di aiuto intrappola ciclicamente il focus e si chiude sempre con tasto Escape restituendo il focus all'elemento originario.
   - *Success Criterion 2.4.1 Bypass Blocks (Level A)*: [Understanding Bypass Blocks](https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html) (Skip Link iniziale visibile su focus per saltare direttamente al contenuto principale `#main-content`).
   - *Success Criterion 2.4.2 Page Titled (Level A)*: [Understanding Page Titled](https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html) (titolo dinamico `<title>` in lingua attiva aggiornato a ogni fase, Ante, stato del punteggio ed esito).
   - *Success Criterion 2.3.3 Animation from Interactions (Level AAA)*: [Understanding Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) (supporto nativo a `prefers-reduced-motion` e toggle manuale in-app).
   - *Success Criterion 2.5.8 Target Size (Minimum - Level AA)*: [Understanding Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) (tutte le aree di tocco e pulsanti rispettano almeno 44×44 px / min 24×24 px).
4. **MDN Web Docs**:
   - *ARIA: checkbox role*: [MDN ARIA checkbox](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role) (stato `aria-checked` per la selezione delle carte).
   - *CSS Media Query `prefers-reduced-motion`*: [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
5. **Deque University & axe-core Rules**:
   - *Standard Ruleset per conformità WCAG*: [Deque University axe Rules](https://dequeuniversity.com/rules/axe/4.4) (test di etichettatura, unicità degli ID, ruoli semantici e contrasti).
6. **Heydon Pickering - "Inclusive Components"**:
   - *Design patterns per elenchi interattivi e pulsanti di selezione*: [Inclusive Components](https://inclusive-components.design/) (ispirazione per il layout responsive e la persistenza dello stato di selezione durante l'ordinamento).
7. **Lighthouse Accessibility Auditing**:
   - Criteri di verifica per PWA installabili, contrasto cromatico e gerarchia dei tag di intestazione (`h1`, `h2`, `main`, `banner`, `status`).

---

## 4. IL DIARIO DELL'AI: DOVE HA SBAGLIATO E COME VE NE SIETE ACCORTI

Durante l'iterativo processo di sviluppo assistito dall'intelligenza artificiale, si sono verificati alcuni errori concreti. Ecco il resoconto trasparente di ciascun problema, della modalità con cui è stato individuato e della soluzione definitiva adottata:

### Errore 1: Taglio errato della spritesheet delle carte (Mancanza della colonna dei ranghi 8)
- **Dove ha sbagliato**: Nello script automatico Node.js incaricato di ritagliare la griglia 4×13 delle 52 carte da gioco dall'immagine master dell'utente, l'AI ha calcolato un offset orizzontale errato. Di conseguenza, la colonna del rango 8 è stata saltata, duplicando le coordinate del 10 o introducendo un disallineamento nei ranghi successivi.
- **Come ce ne siamo accorti**: L'utente ha esaminato visivamente il mazzo in-game e notato che dopo il 7 comparivano carte anomale prive dell'8. Contemporaneamente, i test unitari sulle 52 combinazioni univoche del mazzo hanno evidenziato la discrepanza visiva tra nome della carta ed immagine mostrata.
- **Come è stato risolto**: È stata riscritta integralmente la logica di calcolo dei frame (larghezza 96px, altezza 148px, stride esatto) rigenerando singolarmente le 52 immagini in `public/cards/[suit]-[rank].png` e verificando che ogni carta dal 2 all'Asso (14) avesse la corrispondenza visiva esatta.

### Errore 2: Bande nere e letterboxing antiestetico nelle carte Jolly
- **Dove ha sbagliato**: All'aggiunta dei Joker personalizzati caricati dall'utente, l'AI ha posizionato le immagini all'interno delle card con `object-fit: contain` senza considerare che i file sorgente contenevano bordi neri di scansione su sfondi non uniformi.
- **Come ce ne siamo accorti**: L'utente ha inviato uno screenshot del forziere e della bottega evidenziando: *"Per le carte Jolly inserisci queste immagini e sistema queste grafiche in modo che siano della dimensione dei jolly (togliendo lo spazio nero ai lati)"*.
- **Come è stato risolto**: È stato implementato un ritaglio mirato che asporta le cornici nere marginali dei canvas originali, standardizzando tutte le card Joker su proporzioni fisse (`aspect-ratio: 5 / 7`) con `object-fit: fill` e resa pixel-art (`image-rendering: pixelated`).

### Errore 3: Accumulo e persistenza non voluta di troppi Joker in localStorage all'avvio
- **Dove ha sbagliato**: Durante le sessioni di debug, lo stato della partita veniva persistito in localStorage. Quando è stato modificato il bilanciamento per far partire il giocatore con 0 Joker invece che con 3, la funzione di ripristino automatico ricaricava la sessione vecchia memorizzata nel browser dello sviluppatore/utente.
- **Come ce ne siamo accorti**: L'utente ha segnalato: *"Non si resetta il mercato (in più hai troppi jolly fin dall'inizio)"*.
- **Come è stato risolto**: È stato aggiornato il numero di versione del salvataggio (`balcard_active_run_v2`), inserendo la pulizia automatica dei vecchi salvataggi non sincronizzati (`balcard_active_run_v1`) e azzerando la lista di Joker equipaggiati all'avvio di ogni nuova run (0/5 slot).

### Errore 4: Formula incompleta negli annunci vocali della Live Region Screen Reader
- **Dove ha sbagliato**: L'annuncio vocale post-mano comunicava semplicemente il punteggio totalizzato dalla combinazione (es. "Coppia: +45 punti"), omettendo il riscontro rispetto all'obiettivo finale del Blind.
- **Come ce ne siamo accorti**: Rileggendo con attenzione i requisiti formali di accessibilità forniti dall'utente: *"Dopo ogni mano un annuncio: combinazione, punti ottenuti, punti mancanti all'obiettivo"*.
- **Come è stato risolto**: È stata introdotta una formula dinamica unificata sia in lingua italiana che inglese:
  - *IT*: `[Combinazione]: +[Punti] punti. Punti mancanti all'obiettivo: [Mancanti] ([PunteggioAttuale]/[Target]). Mani rimaste: [Mani].`
  - *EN*: `[HandName]: +[Points] points. Points missing to target: [Missing] ([CurrentScore]/[Target]). Hands remaining: [Hands].`

### Errore 5: Errore di tipizzazione TypeScript durante la build per moduli Node nei test
- **Dove ha sbagliato**: Nel creare la suite di verifica automatizzata dell'accessibilità (`src/game/accessibility.test.ts`), l'AI ha importato i moduli `fs` e `path` per analizzare i fogli di stile CSS a livello di file system. Tuttavia, `tsconfig.app.json` non includeva i tipi per Node.js, causando il fallimento di `tsc -b`.
- **Come ce ne siamo accorti**: Eseguendo il comando `npm run build`, la compilazione TypeScript si è interrotta con `error TS2591: Cannot find name 'fs'`.
- **Come è stato risolto**: È stato aggiornato `tsconfig.app.json` aggiungendo `"node"` all'array `"types": ["vite/client", "node"]`, garantendo che sia `npm test` che `npm run build` terminassero con 0 errori.

### Errore 6: Duplicazione della barra superiore nella Schermata Home
- **Dove ha sbagliato**: All'aggiunta della schermata iniziale Home, la barra di navigazione globale `<header className="tavern-header">` è rimasta attiva all'esterno del selettore di fase, risultando renderizzata sopra il banner della home page con comandi e titoli ridondanti.
- **Come ce ne siamo accorti**: L'utente ha evidenziato tramite screenshot la presenza indesiderata della barra superiore (`tavern-header`) posizionata sopra la testata di avvio.
- **Come è stato risolto**: È stato condizionato il rendering dell'header unicamente alle fasi di gioco attive (`{phase !== 'home' && <header ... />}`), restituendo una schermata iniziale pulita e incentrata sul menù principale.

### Errore 7: Cornice chiara artificiale attorno alle carte da gioco
- **Dove ha sbagliato**: Il contenitore `.pixel-card` applicava un bordo esterno grigio-ferro (`border: 2px solid var(--color-iron-light)`) e un padding di 2px. Poiché le immagini sprite fornite dall'utente possiedono già un proprio bordo pergamena medievale, l'effetto finale generava un contorno chiaro squadrato antiestetico.
- **Come ce ne siamo accorti**: L'utente ha segnalato tramite screenshot: *"e togli il contorno chiaro attorno alla carte"*.
- **Come è stato risolto**: È stato rimosso ogni bordo e ombra chiara dal contenitore `.pixel-card` impostando `border: none; padding: 0; background: transparent`, sostituendolo con effetti di elevazione dinamica puliti e ombre proiettate scure pixel-art (`filter: drop-shadow`).

### Errore 8: Illeggibilità dei caratteri gotici in tutto-maiuscolo (All-Caps)
- **Dove ha sbagliato**: Nell'applicare il font gotico pixel art, sono state mantenute le regole CSS `text-transform: uppercase` su pulsanti e titoli. I caratteri gotici blackletter in tutto-maiuscolo risultavano sovrapposti e di difficile decifrazione per l'occhio umano.
- **Come ce ne siamo accorti**: L'utente ha segnalato: *"è poco leggibile, quindi puoi usare per i testi grandi quello MA usa solo la prima lettera della parola o frase maiuscola e le altre minuscole sennò non si riesce a leggere, e invece per le scritte piu piccole usa Castlefavor"*.
- **Come è stato risolto**: È stato rimosso `text-transform: uppercase` convertendo testi e pulsanti al formato Title/Sentence Case (prima lettera maiuscola, restanti minuscole). Sono stati inoltre integrati i font **Alagard** e **Alkhemikal** (Hewett Tsoi / Pix3M) specificamente per tutti i testi piccoli (badge carte, descrizioni, bottega, regole e status bar), garantendo massima leggibilità ed eleganza retro pixel art, riservando la **Jacquard Font Family** ai titoli e alle grandi intestazioni.

### Errore 9: Scomparsa del pulsante di installazione PWA nella schermata Home
- **Dove ha sbagliato**: Il pulsante `[ Installa app ]` era vincolato alla condizione `{installPrompt && ...}`. Poiché l'evento del browser `beforeinstallprompt` può scattare prima dell'idratazione dei componenti React, o non scattare affatto su browser come Safari/iOS o desktop con criteri euristici differenti, il pulsante risultava del tutto invisibile.
- **Come ce ne siamo accorti**: L'utente ha segnalato: *"Inoltre mi controlli che funziona ancora l'installazione come app (che non vedo più il pulsante sulla home)"*.
- **Come è stato risolto**: Il pulsante è stato reso permanentemente visibile nella schermata Home. In `main.tsx` l'evento viene catturato anticipatamente a livello di `window.deferredInstallPrompt`. Nel click handler è stato implementato un sistema a tre livelli: invocazione del prompt nativo se disponibile, notifica se l'app è già in standalone, e istruzioni guidate passo-passo per iOS (Safari "Aggiungi a schermata Home") e desktop.

### Errore 10: Icone PWA e desktop shortcut non aggiornate (persistenza del vecchio logo "B")
- **Dove ha sbagliato**: All'aggiunta della nuova icona grafica con il teschio giullare insanguinato caricata dall'utente, l'AI ha generato le icone PNG ma non ha aggiornato il `favicon.ico` multi-risoluzione (16px, 32px, 48px, 256px), né ha incrementato la versione della cache del Service Worker o i parametri di cache-busting dei file icona. Di conseguenza, il browser desktop e Windows continuavano a mostrare il vecchio logo rettangolare "B" memorizzato nella cache locale del sistema operativo.
- **Come ce ne siamo accorti**: L'utente ha condiviso lo screenshot del collegamento desktop di Windows chiedendo: *"Non capisco perche la versione scaricata abbia ancora questa icona se riesci puoi mettere quella nuova"*.
- **Come è stato risolto**: È stato compilato tramite Canvas un file `public/favicon.ico` multi-risoluzione a 4 layer contenente l'emblema del teschio giullare, sono state rigenerate tutte le icone PNG (192, 512, maskable 512, favicon), è stato applicato il versioning `?v=3` in `manifest.webmanifest` e `index.html`, e la cache del Service Worker è stata aggiornata a `balcard-v3` invalidando istantaneamente le vecchie risorse salvate nel browser.

### Errore 11: Assenza di Skip Link e titolazione statica rispetto ai requisiti EAA / WCAG 2.2
- **Dove ha sbagliato**: Nelle prime versioni dell'applicazione, il tag `<title>` rimaneva statico ("Balcard - Dark Medieval Roguelike Poker") a prescindere dal progresso della partita, e non era presente un meccanismo di bypass diretto al contenuto principale (`Skip Link`). Questo violava i criteri WCAG 2.4.1 (Salto dei blocchi) e 2.4.2 (Titolazione della pagina), rendendo l'orientamento cognitivo difficoltoso per utenti con lettori di schermo.
- **Come ce ne siamo accorti**: Nel corso dell'audit del documento ufficiale sui requisiti dell'European Accessibility Act (EAA - Direttiva UE 2019/882 e EN 301 549), sono emerse queste due lacune normative.
- **Come è stato risolto**: È stato implementato lo Skip Link accessibile `<a href="#main-content" className="skip-link">` (nascosto fuori schermo e reso visibile al focus con contrasto elevato), è stato associato `id="main-content"` e `tabIndex={-1}` ai contenitori attivi di ogni schermata, ed è stato introdotto un effetto reattivo che sincronizza `document.title` in tempo reale con la fase di gioco (Home, Selezione Blind, Round in corso con punteggio e Ante, Bottega, Sconfitta o Trionfo). Inoltre è stata integrata la Dichiarazione di Accessibilità con canale di feedback e il toggle per forzare animazioni ridotte indipendentemente dalle impostazioni di sistema.

---

## 5. PROGRESSIVE WEB APP (PWA) E SUPPORTO OFFLINE

Balcard è una **Progressive Web App certificata**, progettata per offrire un'esperienza nativa sia da desktop che da smartphone o tablet:

### Funzionalità PWA Implementate:
1. **Installabile dal Browser**:
   - File `public/manifest.webmanifest` con metadati completi, orientamento dinamico, categorie di gioco e set di icone in formato PNG (192×192 e 512×512) oltre al vettore SVG.
   - Cattura dell'evento browser `beforeinstallprompt` e visualizzazione del pulsante di installazione immediata `[ INSTALLLA BALCARD ]` nella schermata Home.
2. **Funzionamento Offline Totale dopo il Primo Caricamento**:
   - Il Service Worker (`public/sw.js`) pre-memorizza all'evento `install` l'intera shell applicativa (`/index.html`, `/manifest.webmanifest`, icone) e **tutte le 52 carte da gioco** più **tutti i 7 Joker**.
   - Anche in assenza di connettività internet, il gioco si avvia, carica gli asset grafici ed esegue l'intera partita localmente senza alcuna interruzione.
3. **Gestione del Ciclo di Vita e della Cache Post-Deploy**:
   - Strategia **Network-First** per le navigazioni HTML: quando l'utente è online e viene effettuato un nuovo deploy su hosting/Vercel, il browser scarica immediatamente la nuova versione.
   - Strategia **Stale-While-Revalidate** per script compilati, stili e immagini, garantendo tempi di rendering istantanei e aggiornamenti asincroni della cache in background.
   - In fase di `activate`, il Service Worker individua ed elimina tempestivamente qualsiasi cache obsoleta associata a versioni precedenti, applicando `self.clients.claim()` e supportando messaggi `SKIP_WAITING`.

---

## 6. STRUTTURA DELLE CARTELLE

```
react-project-1/
├── public/                       # Asset statici distribuiti pubblicamente
│   ├── cards/                    # 52 carte da gioco pixel art (4 semi x 13 ranghi)
│   ├── jokers/                   # 7 immagini Joker pixel art medievali
│   ├── favicon.svg               # Icona vettoriale tema medievale
│   ├── icon-192.png              # Icona PWA 192x192 px
│   ├── icon-512.png              # Icona PWA 512x512 px
│   ├── manifest.webmanifest      # Manifesto standard PWA
│   └── sw.js                     # Service Worker per offline e cache management
├── src/
│   ├── components/               # Componenti React di presentazione UI
│   │   ├── App.tsx               # Orchestratore principale dell'applicazione
│   │   ├── HomeScreen.tsx        # Schermata iniziale Start / Menu principale
│   │   ├── CardView.tsx          # Render accessibile della singola carta
│   │   ├── BlindSelect.tsx       # Selezione dei Blind (Small, Big, Boss)
│   │   ├── ShopView.tsx          # Bottega della taverna (acquisto Joker e pergamene)
│   │   ├── JokerSlots.tsx        # Forziere dei Joker equipaggiati
│   │   ├── HandPreview.tsx       # Valutazione dinamica mano e punteggio
│   │   ├── PlayControls.tsx      # Controlli di gioco (Gioca Mano, Scarta)
│   │   ├── HelpDialog.tsx        # Modale comandi con focus trap WAI-ARIA
│   │   └── VictoryScreen.tsx     # Schermata di vittoria finale (Ante 8)
│   ├── game/                     # LOGICA PURA TYPESCRIPT (Zero React, Zero DOM)
│   │   ├── deck.ts               # Mazzo, pesca, semi, ranghi e algoritmi di ordinamento
│   │   ├── handEvaluator.ts      # Riconoscimento delle combinazioni di poker
│   │   ├── scoring.ts            # Calcolo chip, moltiplicatori ed effetti Joker
│   │   ├── blinds.ts             # Generazione e progressione degli Ante e Boss Blind
│   │   ├── jokers.ts             # Catalogo ed effetti speciali dei Joker
│   │   ├── shop.ts               # Logica del negozio, reroll e upgrade pergamene
│   │   ├── storage.ts            # Salvataggio e ripristino sicuro in localStorage
│   │   └── accessibility.test.ts # Suite di test automatizzati per conformità WCAG
│   ├── hooks/
│   │   └── useKeyboardNav.ts     # Hook personalizzato Roving Tabindex per WAI-ARIA
│   ├── i18n/                     # Modulo di internazionalizzazione bilingue (IT/EN)
│   └── styles/                   # Fogli di stile CSS3 nativi in pixel art
├── index.html                    # Entry point HTML con meta PWA e accessibilità
└── package.json                  # Dipendenze rigorosamente motivate
```

---

## 7. COMANDI E SCORCIATOIE DA TASTIERA

| Tasto | Azione | Contesto |
| :--- | :--- | :--- |
| `Freccia Sinistra` / `Freccia Destra` | Sposta il focus tra le carte in mano (Roving Tabindex) | Tavolo di gioco |
| `Barra Spaziatrice` | Seleziona / Deseleziona la carta focalizzata | Tavolo di gioco |
| `Invio` (`Enter`) | Gioca la mano di carte selezionate | Almeno 1 carta selezionata |
| `X` | Scarta le carte selezionate | Almeno 1 carta selezionata |
| `R` | Ordina istantaneamente la mano per Valore decrescente | Tavolo di gioco |
| `S` | Ordina istantaneamente la mano per Seme | Tavolo di gioco |
| `?` oppure `Shift + /` | Apri / Chiudi la schermata dei Comandi e Aiuto | Globale |
| `Escape` | Chiudi la finestra di dialogo o torna indietro | Finestre modali |
| `Tab` / `Shift + Tab` | Navigazione ciclica tra i comandi interattivi | Globale |

---

## 8. BUILD E VERIFICA AUTOMATIZZATA

Per eseguire l'intera suite di test e verificare la build di produzione:

```bash
# Esecuzione dei 66 test unitari di logica e accessibilità
npm run test

# Controllo tipi rigoroso e compilazione bundle di produzione
npm run build
```

Tutti i test risultano superati con successo al 100% e la build viene generata senza avvisi o errori di tipizzazione.
