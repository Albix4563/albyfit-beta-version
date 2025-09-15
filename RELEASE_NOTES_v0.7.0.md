## Albyfit v0.7.0 [BETA] - 31 Maggio 2025 - Major Update

Questo aggiornamento segna un importante passo avanti per Albyfit, concentrandosi sulla pulizia del codice, l'ottimizzazione e il miglioramento della stabilità generale dell'applicazione.

**Modifiche Principali:**

*   **Refactoring del Codice e Ottimizzazioni:**
    *   **Pulizia Generale:** Identificato e rimosso codice obsoleto e inutilizzato in vari componenti e hook.
    *   **Gestione `reps` negli Esercizi:** Migliorata la gestione del campo `reps` (ripetizioni) all'interno del tipo `Exercise` e nelle funzioni `saveWorkout` e `updateWorkout` in `useSupabaseAuth.tsx`. Ora, il valore stringa delle ripetizioni (es. "10", "8-12") viene correttamente parsato al primo numero intero prima del salvataggio nel database, con un fallback a `10` in caso di fallimento del parsing. Questo assicura una maggiore coerenza e robustezza dei dati.
    *   **Rimozione Import Inutilizzati:** Eliminato l'import `useAuth` non utilizzato dal file `src/pages/Index.tsx`.
*   **Sistema di Autenticazione:**
    *   **Consolidamento Logica di Autenticazione:** Rimossi i file `src/hooks/useAuth.tsx` and `src/components/AuthForm.tsx` che implementavano un sistema di autenticazione locale basato su `localStorage`. Questa funzionalità è stata completamente sostituita dall'integrazione con Supabase, rendendo i vecchi file obsoleti e riducendo la ridondanza nel codice.
*   **Gestione File:**
    *   **Rimozione File Vuoti:** Eliminati i file vuoti `src/hooks/useServiceWorker.tsx` e `src/components/ChangelogNew.tsx` che non avevano alcuna implementazione.
*   **Changelog e Notifiche:**
    *   **Aggiornamento Changelog:** Aggiunta la nuova versione 0.7.0 [BETA] al sistema di changelog.
    *   **Notifiche di Aggiornamento:** Gli utenti riceveranno una notifica per questo major update, invitandoli a consultare le note di rilascio.

**Impatto sugli Utenti:**

*   Gli utenti dovrebbero sperimentare un'applicazione più fluida e stabile.
*   La gestione dei dati relativi agli esercizi, in particolare le ripetizioni, è ora più affidabile.
*   Il processo di autenticazione è ora gestito interamente tramite Supabase, garantendo maggiore sicurezza e coerenza.

Questo aggiornamento pone le basi per future evoluzioni di Albyfit, assicurando una codebase più manutenibile e performante.
