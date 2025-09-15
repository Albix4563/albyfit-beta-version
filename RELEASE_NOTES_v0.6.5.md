# Albyfit - Release Notes v0.6.5 [BETA]

**Data di rilascio:** 30 Maggio 2025  
**Tipo di rilascio:** Patch - Correzioni e miglioramenti

---

## 📱 Panoramica v0.6.5

Albyfit v0.6.5 è un rilascio **patch** focalizzato sulla correzione di problematiche identificate nella versione 0.6.1, particolarmente relative al sistema di notifiche PWA e alla gestione degli esercizi cardio da parte dell'AI. Questa versione garantisce un'esperienza utente più fluida e prevedibile.

---

## 🔧 Correzioni Principali

### 🔔 Sistema Notifiche PWA
**Problema risolto:** Notifiche ripetute ad ogni login

- **Corretto** loop infinito di notifiche con stessa versione changelog
- **Implementato** tracking per combinazione utente+versione univoca
- **Migliorata** logica localStorage per prevenire notifiche duplicate
- **Assicurata** notifica una sola volta per nuova versione per utente

**Benefici:**
- Eliminata frustrazione utente per notifiche ripetitive
- Esperienza più pulita e professionale
- Sistema di notifiche più affidabile

### 🤖 Gestione AI Auto-Inserimento Cardio
**Problema risolto:** AI che inseriva automaticamente esercizi come cardio

- **Rimossa** auto-categorizzazione cardio basata sul nome esercizio
- **Mantenuta** categorizzazione solo quando esplicitamente richiesta
- **Preservata** funzionalità cardio per import con note "cardio" esplicite
- **Corretta** form di aggiunta manuale esercizi

**Benefici:**
- Controllo completo dell'utente sulla tipologia esercizi
- Prevenzione di categorizzazioni errate automatiche
- Maggiore precisione nella gestione allenamenti

---

## ⚙️ Aggiornamenti Tecnici

### 📈 Versioning
- **Aggiornata** versione app da 0.6.1 a 0.6.5 [BETA]
- **Sincronizzato** cache service worker a 'albyfit-v0.6.5'
- **Allineate** tutte le versioni visualizzate nell'interfaccia
- **Aggiunto** entry v0.6.5 al sistema di changelog notifiche

### 🏗️ Architettura
- **Ottimizzata** logica useChangelogNotifications
- **Migliorata** gestione localStorage per notifiche
- **Raffinata** handleExercisesImported in WorkoutManager
- **Corretta** handleExerciseNameChange per rimuovere auto-detection

---

## 🔍 Dettagli Tecnici delle Correzioni

### Fix Notifiche
```javascript
// Prima (problematico)
notification_sent_${user.id}_${latestVersion}

// Dopo (corretto)
notification_shown_${user.id}_${latestVersion}
```

Logica migliorata con tracking immediato per prevenire loop.

### Fix Auto-Cardio
```javascript
// Prima (auto-detection)
const isCardio = category === 'cardio';

// Dopo (solo esplicito)
const isExplicitCardio = exercise.notes.toLowerCase().includes('cardio');
```

Controllo utente sulla categorizzazione esercizi.

---

## 🎯 Testing e Qualità

### Scenari Testati
- ✅ Login multipli senza notifiche duplicate
- ✅ Importazione esercizi senza auto-cardio
- ✅ Aggiunta manuale esercizi con controllo tipologia
- ✅ Sistema notifiche PWA per nuove versioni reali
- ✅ Cache service worker aggiornato

### Compatibilità
- ✅ Progressive Web App (PWA)
- ✅ Mobile responsive
- ✅ Offline capabilities mantenute
- ✅ Notifiche native mobile

---

## 📋 Changelog Completo

### 🔔 Sistema Notifiche
- Corretto tracking notifiche per combinazione user+version
- Eliminato loop di notifiche ripetute con stessa versione
- Migliorata esperienza utente con notifiche una tantum

### 🤖 Gestione AI
- Rimossa auto-categorizzazione cardio non richiesta
- Preservato controllo utente sulla tipologia esercizi
- Mantenute funzionalità cardio per import espliciti

### ⚡ Performance
- Cache service worker aggiornato per v0.6.5
- Ottimizzazioni localStorage per notifiche
- Sincronizzazione versioni in tutta l'app

---

## 🚀 Prossimi Sviluppi

### In Pianificazione
- Ulteriori miglioramenti sistema importazione AI
- Espansione funzionalità di analisi progressi
- Ottimizzazioni performance mobile
- Nuove integrazioni social e condivisione

---

## 🏆 Conclusioni

Albyfit v0.6.5 consolida la stabilità e l'affidabilità dell'applicazione, risolvendo le principali problematiche segnalate dagli utenti. L'app ora offre un'esperienza più fluida e prevedibile, mantenendo tutte le funzionalità avanzate introdotte nelle versioni precedenti.

**Statistiche del rilascio:**
- 🐛 2 bug critici risolti
- ⚡ 3 miglioramenti UX implementati
- 🔧 4 ottimizzazioni tecniche applicate
- 📱 100% compatibilità PWA mantenuta

---

*Albyfit v0.6.5 - La tua palestra digitale, più stabile che mai* 💪
