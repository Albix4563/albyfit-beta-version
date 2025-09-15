# Albyfit v0.6.0 [BETA] - Release Notes

**Data di Rilascio:** 30 Maggio 2025

## 🎨 Rinnovamento Completo del Design

### Sostituzione Emoji con Icone Professionali
- **Eliminati completamente** tutti gli emoji dall'applicazione
- **Implementate** icone Lucide React moderne e professionali
- **Aggiornati** tutti i componenti per un aspetto più maturo e professionale

### Componenti Aggiornati:
- ✅ **Navigation.tsx** - Icone Home, Dumbbell, Timer, BarChart3, FileText, User
- ✅ **WorkoutTimer.tsx** - Icone complete per timer, azioni e notifiche
- ✅ **WorkoutManager.tsx** - Icone per gestione, import/export e ricerca
- ✅ **ExerciseWiki.tsx** - Icone per categorie e funzionalità di ricerca
- ✅ **Progress.tsx** - Icona Trophy per achievements
- ✅ **Profile.tsx** - Icone complete per tutte le sezioni
- ✅ **Changelog.tsx** - Sistema di icone strutturato per categorie
- ✅ **Dashboard.tsx** - Icone Check e Rocket per status e motivazione
- ✅ **ExerciseNotes.tsx** - Icona FileText

## 🤖 Intelligenza Artificiale Potenziata

### Riconoscimento Automatico Esercizi Cardio
- **Migliorato** il prompt AI Gemini per categorizzazione intelligente
- **Aggiunta** rilevazione automatica di:
  - Corsa, camminata, jogging
  - Cyclette, bici, spinning
  - Tapis roulant, ellittica
  - Rowing, vogatore
  - HIIT, interval training
  - Burpees, jumping jacks
  - Mountain climbers, step

### Configurazione Automatica Parametri
- **Cardio:** 1 serie, durata in minuti (minimo 8 min)
- **Forza:** 3 serie, ripetizioni numeriche
- **Recupero:** Minimo 60 secondi per tutti gli esercizi

## 💪 Gestione Avanzata Esercizi Cardio

### Riconoscimento Intelligente
- **Implementato** riconoscimento automatico durante l'inserimento
- **Validazione** durata minima 8 minuti (aggiornata da 10)
- **Configurazione** automatica checkbox e parametri

### Timer Specializzato
- **Timer dedicato** per esercizi cardio con conteggio progressivo
- **Visualizzazione** tempo trascorso vs tempo obiettivo
- **Gestione differenziata** workflow cardio vs forza

### Identificazione Visiva
- **Etichette colorate** "CARDIO" per identificazione immediata
- **Icone distintive** nelle liste esercizi
- **Layout specializzato** nel timer di allenamento

## 🚀 Miglioramenti User Experience

### Design System Coerente
- **Uniformità visiva** in tutta l'applicazione
- **Layout ottimizzati** icon-text per migliore leggibilità
- **Interfaccia pulita** senza elementi infantili

### Workflow Ottimizzati
- **Navigazione migliorata** con icone intuitive
- **Controlli coerenti** per tutte le funzionalità
- **Feedback visivo** potenziato per le azioni utente

## 📝 Aggiornamenti Tecnici

### File Modificati
```
src/components/Navigation.tsx ✅
src/components/WorkoutTimer.tsx ✅
src/components/WorkoutManager.tsx ✅
src/components/ExerciseWiki.tsx ✅
src/components/Progress.tsx ✅
src/components/Profile.tsx ✅
src/components/Changelog.tsx ✅
src/components/Dashboard.tsx ✅
src/components/ExerciseNotes.tsx ✅
supabase/functions/extract-exercises/index.ts ✅
package.json ✅ (version: 0.6.0-beta)
```

### Dipendenze
- **Lucide React:** Icone professionali per l'intera UI
- **Mantenimento** compatibilità con tutte le funzionalità esistenti

## 🎯 Obiettivi Raggiunti

1. ✅ **Eliminazione completa** degli emoji dall'applicazione
2. ✅ **Implementazione** icone Lucide React moderne
3. ✅ **Riconoscimento automatico** esercizi cardio migliorato
4. ✅ **Configurazione intelligente** parametri esercizi
5. ✅ **Validazione** durata minima 8 minuti per cardio
6. ✅ **Interface professionale** per utenti seri del fitness

## 🔄 Retrocompatibilità

- ✅ **Tutti i dati esistenti** rimangono compatibili
- ✅ **Workflow esistenti** mantenuti e migliorati
- ✅ **Nessuna perdita** di funzionalità

---

**Prossimi Sviluppi:** Pianificazione v0.7.0 con focus su analytics avanzati e condivisione social professionale.
