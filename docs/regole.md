# Regole del Gioco: Balcard

Benvenuto a **Balcard**, un roguelike di carte a turni a tema medievale dark-pixel ispirato alla meccanica di costruzione e manipolazione del poker.

---

## 1. Obiettivo della Run
L'obiettivo è sopravvivere e trionfare attraverso **8 Ante** (da Ante 1 ad Ante 8).
Ogni Ante è suddiviso in 3 sfide consecutive chiamate **Blind**:
1. **Small Blind**: Sfida introduttiva con target di punteggio base. Può essere saltato per ottenere un *Tag*.
2. **Big Blind**: Sfida con target di punteggio maggiorato (~1.5X). Può essere saltato per ottenere un *Tag*.
3. **Boss Blind**: Sfida decisiva con target di punteggio elevato (2.0X, o 2.5X su Ante 8) e una **Boss Rule** (regola speciale restrittiva obbligatoria). **Non può mai essere saltato**.

Completando con successo il Boss Blind di Ante 8 (*Il Tiranno della Taverna*), la run è vinta con **Trionfo Supremo**. Se in un qualsiasi Blind si esauriscono le **Hands** (mani a disposizione) prima di aver raggiunto la soglia di punteggio richiesta, la run termina immediatamente in **Sconfitta (Game Over)**.

---

## 2. Il Mazzo e la Mano
- **Mazzo Standard**: Composto da 52 carte da gioco tradizionali suddivise in 4 semi:
  - *Cuori* (Hearts)
  - *Quadri* (Diamonds)
  - *Fiori* (Clubs)
  - *Picche* (Spades)
  - Valori da 2 ad Asso (2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace).
- **Mano del Giocatore**: All'inizio di ogni Blind, il mazzo viene mescolato e vengono distribuite **8 carte** al giocatore (o 7 carte sotto la regola *Gabbia di Ferro*).
- **Selezione**: Il giocatore può selezionare da un minimo di 1 a un massimo di **5 carte**.
- **Azioni disponibili**:
  - **Play Hand (`Invio`)**: Gioca la combinazione selezionata. Assegna punti, consuma 1 Hand, invia le carte giocate agli scarti e ripristina la mano a 8 carte pescando dal mazzo.
  - **Discard (`X`)**: Scarta le carte selezionate senza fare punti. Consuma 1 Discard, invia le carte agli scarti e pesca carte sostitutive fino ad avere nuovamente 8 carte in mano.
- **Risorse iniziali per round**:
  - **4 Hands** (3 contro il Boss di Ante 8)
  - **4 Discards** (3 contro il Boss di Ante 2)

---

## 3. Mani di Poker e Calcolo del Punteggio

Ogni volta che si gioca una mano valida, il punteggio viene calcolato secondo la formula fondamentale:
$$\text{Punteggio della Mano} = (\text{Chips Base} + \text{Valore Carte Giocate} + \text{Bonus Chips}) \times (\text{Mult Base} + \text{Bonus Mult}) \times (\text{Moltiplicatori Composti})$$

### Valore delle Carte Giocate:
- Carte numeriche (2–10): Punti pari al valore nominale (es. un 7 conferisce +7 Chips).
- Figure (J, Q, K): +10 Chips ciascuna.
- Asso (A): +11 Chips.

### Mani di Poker riconosciute (Livello 1 Base):
| Mano | Chips Base | Mult Base | Incremento per Livello |
|---|---|---|---|
| **High Card** | 5 | 1X | +10 Chips, +1 Mult |
| **Pair** | 10 | 2X | +15 Chips, +1 Mult |
| **Two Pair** | 20 | 2X | +20 Chips, +1 Mult |
| **Three of a Kind** | 30 | 3X | +20 Chips, +2 Mult |
| **Straight** | 30 | 4X | +30 Chips, +2 Mult |
| **Flush** | 35 | 4X | +15 Chips, +2 Mult |
| **Full House** | 40 | 4X | +25 Chips, +2 Mult |
| **Four of a Kind** | 60 | 7X | +30 Chips, +3 Mult |
| **Straight Flush** | 100 | 8X | +40 Chips, +3 Mult |

I livelli di ciascuna mano possono essere potenziati in modo permanente visitando la **Bottega della Taverna (Shop)** tra i round acquistando le relative pergamene.

---

## 4. Skip e Tag
Prima di iniziare uno Small Blind o un Big Blind, il giocatore può scegliere di:
- **Affrontare il Blind**: Gioca il round, guadagna denaro e accede al negozio.
- **Saltare (Skip Blind)**: Non si affronta il round e non si guadagna la taglia del blind, ma si riscatta all'istante un **Tag** speciale (es. Oro immediato nel forziere o scarti/mani addizionali).

Il Boss Blind **non può mai essere saltato**.

---

## 5. Le 8 Regole Speciali dei Boss (Ante 1 - 8)
1. **Ante 1 - Lama del Boia**: Le carte di Cuori sono dissanguate e non conferiscono Chips nominali.
2. **Ante 2 - Cappa di Spine**: Inizi il round con 1 Discard in meno (3 scarti).
3. **Ante 3 - Gabbia di Ferro**: Spazio soffocante: la mano iniziale è ridotta a 7 carte invece di 8.
4. **Ante 4 - Editto Inquisitorio**: Le combinazioni Pair e Two Pair sono vietate e respinte.
5. **Ante 5 - Sangue Corrotto**: Tutte le carte di Quadri e Fiori hanno il valore in Chips azzerato.
6. **Ante 6 - Tassa del Siniscalco**: Ogni scarto (Discard) costa $1 dalla borsa del giocatore.
7. **Ante 7 - Nebbia del Sepolcro**: Le carte di Picche sono maledette e azzerano i loro Chip.
8. **Ante 8 - Il Tiranno della Taverna**: Obiettivo maggiorato a 2.5X e solo 3 Mani giocabili disponibili.

---

## 6. I 7 Jolly Medievali Originali
Il giocatore dispone di **5 slot equipaggiamento** per i Jolly:
1. **Il Giullare di Corte**: +4 Mult fisso su qualsiasi mano giocata.
2. **L'Alchimista**: Ogni carta di Quadri a punteggio assegna +3 Chips e +$1 d'oro immediato.
3. **Il Fabbro Reale**: +15 Chips per ogni carta di Picche a punteggio.
4. **Il Monaco Amanuense**: +8 Mult se la mano giocata è una Straight o Straight Flush.
5. **Il Balestriere Scelto**: +30 Chips se la mano giocata è una Pair o Two Pair.
6. **Il Cavaliere Errante**: Moltiplica il Mult finale per 1.5X se nel round non è ancora stato effettuato alcuno scarto (Discard).
7. **L'Usuraio di Borgo**: Assegna +$2 d'oro addizionali al termine di ogni Blind per ogni mano non utilizzata.

I Jolly possono essere venduti in qualsiasi momento per recuperare oro.

---

## 7. Economia, Negozio e Interesse
Al superamento di ciascun Blind:
- **Taglia del Blind**: Small ($3), Big ($4), Boss ($5).
- **Bonus Mani Rimanenti**: +$1 per ogni Hand ancora inutilizzata alla vittoria del round.
- **Interesse Taverna**: +$1 ogni $5 posseduti nel forziere (fino a un massimo di **+$5** di interesse a round).
- Nella Bottega della Taverna è possibile:
  - Acquistare Jolly disponibili.
  - Acquistare pergamene di potenziamento permanente per le mani.
  - Pagare una commissione (Reroll) per rinfrescare l'offerta.

---

## 8. Persistenza Locale (Salvataggio della Run)
- La partita attiva viene salvata in modo trasparente e continuo in `localStorage`.
- In caso di ricaricamento o chiusura accidentale del browser, la partita viene ripristinata esattamente dallo stato precedente.
- In caso di Vittoria, Sconfitta o azzeramento manuale (`[ REIMPOSTA RUN ]`), il salvataggio locale viene rimosso.

---

## 9. Comandi e Accessibilità da Tastiera

| Tasto | Azione |
|---|---|
| `<-` / `->` | Scorre il focus tra le carte in mano |
| `Spazio` | Seleziona o deseleziona la carta con il focus (fino a 5) |
| `Invio` | **Play Hand** (in gioco) / Conferma bottoni e avanza |
| `X` | **Discard** (scarta le carte selezionate) |
| `Tab` / `Shift + Tab` | Navigazione tra le sezioni e i pulsanti |
| `?` | Apre il pannello di aiuto e comandi |
| `Esc` | Chiude qualsiasi finestra modale o dialog |
