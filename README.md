# Balcard

**Balcard** è un gioco di carte roguelike a turni ispirato alle meccaniche di manipolazione del poker, ambientato in una cupa taverna medievale in stile dark pixel art.

Il progetto è sviluppato con una separazione assoluta tra logica matematica/regole e interfaccia utente React, garantendo piena accessibilità tramite navigazione da sola tastiera (WAI-ARIA).

---

## STACK TECNOLOGICO
- **Linguaggio**: TypeScript (modalità `strict`, nessun `any`)
- **Framework UI**: React 19.x (solo presentazione e gestione eventi)
- **Build Tool**: Vite 8.x
- **Test Runner**: Vitest (per la suite di test unitari della logica pura)
- **Stile**: CSS3 moderno con variabili native, pixel art borders e zero framework UI esterni

---

## MOTIVAZIONE DELLE DIPENDENZE

Come da specifiche di progetto, ogni singola dipendenza è rigorosamente motivata:

### Dipendenze di Produzione (`dependencies`):
1. **`react`** (`^19.3.1`):
   - *Motivazione*: Libreria per la gestione dei componenti di presentazione e del ciclo di rendering.
2. **`react-dom`** (`^19.3.1`):
   - *Motivazione*: Fornisce il binding di rendering al DOM del browser per l'applicazione React.

### Dipendenze di Sviluppo (`devDependencies`):
1. **`typescript`** (`~6.0.3`):
   - *Motivazione*: Tipizzazione statica rigorosa per prevenire errori a runtime e documentare i contratti dei dati.
2. **`vite`** (`^8.3.4`):
   - *Motivazione*: Bundler moderno ad alte prestazioni con Hot Module Replacement (HMR) istantaneo.
3. **`@vitejs/plugin-react`** (`^6.1.2`):
   - *Motivazione*: Plugin ufficiale per integrare la trasformazione JSX/TSX di React nel compilatore Vite.
4. **`vitest`** (`^5.0.5`):
   - *Motivazione*: Test runner ultra-veloce integrato nativamente con Vite per testare la logica pura in `src/game/` senza configurazioni pesanti.
5. **`@types/react`** & **`@types/react-dom`**:
   - *Motivazione*: Definizioni TypeScript per i tipi di React e degli elementi DOM.
6. **`eslint`**, **`@eslint/js`**, **`typescript-eslint`**, **`eslint-plugin-react-hooks`**, **`eslint-plugin-react-refresh`**:
   - *Motivazione*: Linter per il rispetto delle best practice di codice, regole degli hook e consistenza stilistica.

---

## GUIDA DI SETUP E COMANDI

### Prerequisiti
- Node.js versione 20 o superiore
- npm versione 10 o superiore

### Installazione
```bash
npm install
```

### Avvio in Sviluppo
```bash
npm run dev
```
L'applicazione sarà raggiungibile su `http://localhost:5173`.

### Esecuzione dei Test Unitari
```bash
npm run test
```

### Build di Produzione
```bash
npm run build
```

---

## DEPLOY SU VERCEL

Il progetto è configurato per il deploy continuo e immediato su **Vercel** tramite GitHub:

1. Crea o accedi al tuo account su [Vercel](https://vercel.com).
2. Seleziona **"Add New Project"** e importa il repository GitHub `react-project-1`.
3. Vercel rileverà automaticamente il framework **Vite**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (oppure default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Clicca su **"Deploy"**. Ad ogni push sul ramo `main`, Vercel eseguirà la build e aggiornerà il link pubblico di produzione.

---

## DOCUMENTAZIONE AGGIUNTIVA
- [Regole Complete di Gioco (docs/regole.md)](docs/regole.md)
- [Architettura Tecnica e Accessibilità (docs/architettura.md)](docs/architettura.md)
