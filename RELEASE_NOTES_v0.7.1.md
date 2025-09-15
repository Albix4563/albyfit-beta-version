## Albyfit v0.7.1 [BETA] - 11 Giugno 2025 - Multi-day Workout

Questo aggiornamento introduce la gestione avanzata delle schede di allenamento multi-day, sia per flusso manuale che AI-driven.

**Novità principali:**

* **Schede multi-day:** Ogni scheda può ora essere suddivisa in più giorni, ciascuno con i propri esercizi.
* **Compatibilità AI/manuale:** Gli esercizi possono essere assegnati ai giorni sia manualmente che tramite importazione AI/immagine.
* **UI aggiornata:**
  * Gestione giorni in WorkoutManager ed ExerciseImporter
  * Timer con selezione giorno
* **Schema Supabase:**
  * Tabella `exercises` aggiornata con colonna `day`
  * Migrazione dati legacy opzionale (`UPDATE exercises SET day = 'Giorno 1' WHERE day IS NULL;`)
* **Compatibilità retroattiva:** Le vecchie schede (singolo giorno) sono ancora supportate.

**Impatto sugli utenti:**

* Possibilità di organizzare le schede su più giorni
* Esperienza utente migliorata nella gestione e visualizzazione degli allenamenti

**Prossimi passi:**

* Test utente e QA
* Miglioramenti AI e UX avanzati (drag&drop, riordino giorni, test end-to-end)
