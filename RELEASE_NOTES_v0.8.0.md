# Release Notes - Versione 0.8.0 [BETA]
**Data di rilascio**: 16 Giugno 2025

## Panoramica
Questo aggiornamento rivoluziona l'esperienza di inserimento esercizi con validazione migliorata, calcoli matematici automatici, duplicazione rapida e un sistema di notifiche completamente nativo.

---

## Nuove Funzionalità

### **Gestione Esercizi Avanzata**
- **Validazione nomi migliorata**: Ora puoi inserire spazi, virgole, trattini, numeri e caratteri speciali nei nomi degli esercizi
- **Calcoli matematici automatici**: Inserisci espressioni come `10+5`, `20*2`, `50/2` nei campi peso per calcolo automatico
- **Duplicazione rapida**: Nuovo pulsante per duplicare esercizi simili con un click
- **Gestione errori robusta**: Divisione per zero e input non validi gestiti con messaggi chiari

### **Allenamento Dinamico**
- **Modifica pesi durante l'allenamento**: Ora puoi modificare il peso di un esercizio mentre stai facendo l'allenamento
- **Dialog interattivo**: Interfaccia intuitiva per modificare i pesi con supporto per calcoli matematici
- **Stato persistente**: Le modifiche ai pesi rimangono per tutta la durata della sessione di allenamento
- **Aggiornamento in tempo reale**: I valori vengono aggiornati immediatamente nell'interfaccia

### **Sistema Notifiche Nativo**
- **Eliminazione alert() nativi**: Sostituiti tutti gli alert del browser con toast eleganti
- **Dialog React integrati**: Sostituiti tutti i confirm() con componenti stilizzati
- **Toast system**: Notifiche colorate e consistenti con il design dell'app
- **UX moderna**: Feedback visivo immediato per tutte le azioni

---

## Correzioni Bug

### **Dialog e Stato**
- **Dialog fuori contesto**: Risolto problema di dialog di conferma che apparivano su pagine sbagliate
- **Reset automatico stati**: Gli stati ora si resettano automaticamente quando si cambia vista
- **Form persistence**: I form si puliscono automaticamente quando necessario

### **Gestione Allenamenti**
- **Persistenza esercizi**: Risolto bug critico per cui gli esercizi venivano cancellati dopo aver completato un allenamento
- **Stati workout protetti**: Migliorata la gestione degli stati per evitare perdite di dati
- **Reset sicuro**: Il reset degli stati ora avviene solo quando appropriato, preservando i dati degli esercizi

### **Esperienza Utente**
- **Messaggi di errore consistenti**: Tutti i messaggi ora seguono lo stesso design system
- **Stati persistenti**: Eliminati stati che rimanevano attivi tra viste diverse
- **Navigazione fluida**: Migliorata la transizione tra le diverse sezioni dell'app

---

## Miglioramenti Tecnici

### **Architettura**
- **Sistema toast centralizzato**: Hook `useToast` per gestione unificata delle notifiche
- **Componenti React puri**: Eliminata dipendenza da API browser native
- **Type safety**: Tipizzazione completa per tutte le nuove funzionalità
- **Cleanup automatico**: useEffect ottimizzati per pulizia stati

### **Design System**
- **Componenti riutilizzabili**: Dialog e toast modulari
- **Stili consistenti**: Design uniforme per tutti i feedback utente
- **Accessibilità**: Migliorata l'accessibilità dei componenti di notifica

---

## Esempi Pratici

### Calcoli Matematici nei Pesi
```
Input: "10+5"    → Output: 15kg
Input: "20*2"    → Output: 40kg  
Input: "50/2"    → Output: 25kg
Input: "100-20"  → Output: 80kg
```

### Modifica Peso Durante Allenamento
```
1. Durante un allenamento, clicca sull'icona di modifica peso
2. Inserisci il nuovo peso (supporta calcoli: es. "40+5")
3. Conferma per applicare immediatamente la modifica
4. Il peso rimane aggiornato per tutta la sessione
```

### Nomi Esercizi Supportati
```
✓ "Panca piana"
✓ "Curl bicipiti, 21s"
✓ "Push-up (modified)"
✓ "Squat 3x10"
✓ "Leg press 45°"
```

---

## Migrazione
Questo aggiornamento è completamente retrocompatibile. Tutti gli esercizi esistenti continueranno a funzionare normalmente, ma ora beneficeranno delle nuove funzionalità.

---

## Prossimi Passi
- Guida visiva integrata con immagini ed embed YouTube per ogni esercizio
- Ricerca automatica di tutorial per esercizi personalizzati
- Miglioramenti AI per suggerimenti esercizi

---

## Ringraziamenti
Grazie a tutti gli utenti che hanno fornito feedback per migliorare l'esperienza di inserimento esercizi!

---
*Albyfit v0.8.0 [BETA] - Il futuro del fitness è qui!*
