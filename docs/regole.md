# Regole del Gioco: Balcard

Benvenuto a **Balcard**, un roguelike di carte a turni a tema medievale dark-pixel ispirato alla meccanica di costruzione e manipolazione del poker.

---

## 1. Obiettivo della Run
L'obiettivo è sopravvivere e trionfare attraverso **8 Ante** (da Ante 1 ad Ante 8).
Ogni Ante è suddiviso in 3 sfide consecutive chiamate **Blind**:
1. **Small Blind**: Sfida introduttiva con target di punteggio base. Può essere saltato per ottenere un *Tag*.
2. **Big Blind**: Sfida con target di punteggio maggiorato (~1.5×). Può essere saltato per ottenere un *Tag*.
3. **Boss Blind**: Sfida decisiva con target di punteggio elevato (~2×) e una **Boss Rule** (regola speciale restrittiva obbligatoria). **Non può mai essere saltato**.

Completando con successo il Boss Blind di Ante 8, la run è vinta. Se in un qualsiasi Blind si esauriscono le **Hands** (mani a disposizione) prima di aver raggiunto la soglia di punteggio richiesta, la run termina immediatamente in **Sconfitta (Game Over)**.

---

## 2. Il Mazzo e la Mano
- **Mazzo Standard**: Composto da 52 carte da gioco tradizionali suddivise in 4 semi:
  - *Cuori* (Hearts)
  - *Quadri* (Diamonds)
  - *Fiori* (Clubs)
  - *Picche* (Spades)
  - Valori da 2 ad Asso (2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace).
- **Mano del Giocatore**: All'inizio di ogni Blind, il mazzo viene mescolato e vengono distribuite **8 carte** al giocatore.
- **Selezione**: Il giocatore può selezionare da un minimo di 1 a un massimo di **5 carte**.
- **Azioni disponibili**:
  - **Play Hand (`Invio`)**: Gioca la combinazione selezionata. Assegna punti, consuma 1 Hand, invia le carte giocate agli scarti e ripristina la mano a 8 carte pescando dal mazzo.
  - **Discard (`X`)**: Scarta le carte selezionate senza fare punti. Consuma 1 Discard, invia le carte agli scarti e pesca carte sostitutive fino ad avere nuovamente 8 carte in mano.
- **Risorse iniziali per round** (modalità Standard):
  - **4 Hands** (Mani giocabili)
  - **4 Discards** (Scarti disponibili)

---

## 3. Mani di Poker e Calcolo del Punteggio

Ogni volta che si gioca una mano valida, il punteggio viene calcolato secondo la formula fondamentale:
$$\text{Punteggio della Mano} = (\text{Chips Base} + \text{Valore Carte Giocate} + \text{Bonus Chips}) \times (\text{Mult Base} + \text{Bonus Mult})$$

### Valore delle Carte Giocate:
- Carte numeriche (2–10): Punti pari al valore nominale (es. un 7 conferisce +7 Chips).
- Figure (J, Q, K): +10 Chips ciascuna.
- Asso (A): +11 Chips.

### Mani di Poker riconosciute (Livello 1 Base):
| Mano | Chips Base | Mult Base | Descrizione |
|---|---|---|---|
| **High Card** | 5 | 1× | La carta con valore più alto tra quelle giocate |
| **Pair** | 10 | 2× | 2 carte dello stesso rango (es. due 8) |
| **Two Pair** | 20 | 2× | 2 coppie distinte di carte (es. due 5 e due Re) |
| **Three of a Kind** | 30 | 3× | 3 carte dello stesso rango |
| **Straight** | 30 | 4× | 5 carte in sequenza numerica di semi diversi (l'Asso vale sia 1 che 14) |
| **Flush** | 35 | 4× | 5 carte dello stesso seme |
| **Full House** | 40 | 4× | Un Tris e una Coppia contemporaneamente |
| **Four of a Kind** | 60 | 7× | 4 carte dello stesso rango |
| **Straight Flush** | 100 | 8× | 5 carte in sequenza numerica e dello stesso seme |

I livelli di ciascuna mano possono essere potenziati in modo permanente visitando il **Negozio (Shop)** tra i round.

---

## 4. Skip e Tag
Prima di iniziare uno Small Blind o un Big Blind, il giocatore può scegliere di:
- **Affrontare il Blind**: Gioca il round, guadagna denaro e sblocca il negozio.
- **Saltare (Skip Blind)**: Non si affronta il round e non si guadagna la ricompensa in denaro del blind, ma si riscatta all'istante un **Tag** speciale (es. Oro immediato, upgrade gratuito di una mano, Joker garantito nel negozio successivo).

Il Boss Blind **non può mai essere saltato**.

---

## 5. I Joker (I Jolly Medievali)
Il giocatore ha a disposizione **5 slot equipaggiamento** per i Joker.
I Joker modificano le regole, accumulano Chips, moltiplicano il Mult o aumentano i guadagni.
I primi 7 Joker originali disponibili sono:
1. **Il Giullare di Corte**: +4 Mult fisso su qualsiasi mano giocata.
2. **L'Alchimista**: Ogni carta di Quadri (Diamonds) giocata e conteggiata assegna +3 Chips e $1 d'oro.
3. **Il Fabbro Reale**: +15 Chips per ogni carta di Picche (Spades) conteggiata.
4. **Il Monaco Amanuense**: +8 Mult se la mano giocata è una *Straight*.
5. **Il Balestriere Scelto**: Se la mano giocata contiene un *Pair* o *Two Pair*, conferisce +30 Chips.
6. **Il Cavaliere Errante**: Moltiplica il Mult finale per 1.5× se nel round non è ancora stato effettuato alcuno scarto (Discard).
7. **L'Usuraio di Borgo**: Assegna $2 addizionali al termine di ogni Blind se si conclude il round con almeno 1 Hand inutilizzata.

I Joker possono essere venduti in qualsiasi momento per recuperare parte del loro valore in oro.

---

## 6. Economia e Negozio (Shop)
Al superamento di ciascun Blind:
- Si incassa la **Taglia del Blind**:
  - Small Blind: **$3**
  - Big Blind: **$4**
  - Boss Blind: **$5**
- **Bonus Mani Rimanenti**: +$1 per ogni Hand ancora inutilizzata alla vittoria del round.
- **Interesse Taverna**: +$1 ogni $5 posseduti nella borsa del giocatore (fino a un massimo di **+$5** di interesse a round).

Nel Negozio è possibile acquistare:
- Nuovi **Joker** per riempire o sostituire gli slot.
- **Pergamene di Potenziamento** delle mani (aumentano permanentemente Chips e Mult base di una specifica mano).
- **Reroll**: Rinfresca gli articoli in vendita pagando una quota d'oro.

---

## 7. Comandi e Accessibilità da Tastiera

Balcard è interamente navigabile e giocabile senza mouse:

| Tasto | Azione |
|---|---|
| `Freccia Sinistra` / `Freccia Destra` | Scorre il focus tra le carte in mano |
| `Spazio` | Seleziona o deseleziona la carta con il focus (fino a 5) |
| `Invio` | **Play Hand** (gioca la combinazione selezionata) |
| `X` | **Discard** (scarta le carte selezionate) |
| `Tab` / `Shift + Tab` | Navigazione tra le sezioni (Mano, Joker, Azioni, Negozio) |
| `?` | Apre il pannello di aiuto e comandi |
| `Esc` | Chiude qualsiasi finestra modale o dialog |

Tutti gli elementi mantengono un focus visibile ad alto contrasto conforme alle linee guida WAI-ARIA.

