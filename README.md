# Albyfit - Professional Fitness Tracker

**Version**: 0.9.2[BETA] - Liquid Glass Design
**Created by**: Albix4563

## Descrizione

Albyfit è un'applicazione professionale per il tracking degli allenamenti e il monitoraggio dei progressi fitness. L'app offre funzionalità avanzate di intelligenza artificiale per la gestione degli esercizi e un'interfaccia moderna ispirata a iOS 26 con Liquid Glass Design.

## 🆕 Novità v0.9.2 [BETA] - Liquid Glass Design

### 🎨 **MAJOR DESIGN OVERHAUL**
- **Liquid Glass Design System**: Design completamente rinnovato ispirato a iOS 26
- **Backdrop Blur Effects**: Effetti vetro dinamici con backdrop-blur avanzato
- **Framer Motion Animations**: Animazioni fluide con spring physics per ogni interazione
- **Navigation Dinamica**: Tab Timer condizionale che appare solo durante allenamento
- **Enhanced Contrast**: Contrasto migliorato per massima accessibilità (21:1 ratio)
- **Floating Elements**: Particelle e orbs luminosi per atmosfera immersiva

## Caratteristiche Principali

- **🏋️ Gestione Allenamenti**: Crea e gestisci routine di allenamento personalizzate
- **📈 Tracking Progressi**: Monitora i tuoi miglioramenti nel tempo
- **🤖 Intelligenza Artificiale**: Analisi automatica di esercizi tramite AI
- **🎨 Liquid Glass UI**: Design moderno con effetti vetro e animazioni fluide
- **🔒 Autenticazione Sicura**: Sistema di login integrato con Supabase
- **📱 Fully Responsive**: Ottimizzato per desktop e mobile con touch feedback
- **⚙️ Timer Dinamico**: Timer allenamento con navigazione condizionale
- **🔔 Push Notifications**: Sistema notifiche per aggiornamenti changelog

## Tecnologie Utilizzate

Questo progetto è costruito con:

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion v11.5.4
- **Backend**: Supabase (Database + Auth)
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Design System**: Liquid Glass Components

## Installazione e Sviluppo

### Prerequisiti
- Node.js 18+ e npm
- Account Supabase configurato

### Setup Locale

```sh
# Clona il repository
git clone https://github.com/Albix4563/albyfit-beta-version.git

# Naviga nella directory del progetto
cd albyfit-beta-version

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

### Configurazione Supabase

1. Crea un nuovo progetto su [Supabase](https://supabase.com)
2. Configura le variabili d'ambiente:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Importa lo schema del database da `supabase/`

## Struttura del Progetto

```
src/
├── components/          # Componenti React riutilizzabili
│   ├── ui/             # Componenti UI base (shadcn/ui + Liquid Glass)
│   │   ├── liquid-glass.tsx  # Componente base Liquid Glass
│   │   ├── liquid-button.tsx # Pulsanti con effetti liquid
│   │   └── liquid-card.tsx   # Card con animazioni fluide
│   ├── Dashboard.tsx   # Dashboard principale
│   ├── Navigation.tsx  # Navigation con tab condizionali
│   ├── WorkoutManager.tsx  # Gestione allenamenti
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useChangelogNotifications.tsx  # Sistema notifiche
│   └── ...
├── contexts/           # React contexts
│   └── TimerContext.tsx    # Context per timer allenamento
├── integrations/       # Integrazioni esterne (Supabase)
├── lib/               # Utilities e helper
└── pages/             # Pagine principali dell'app
    └── Index.tsx      # Pagina principale con layout Liquid Glass
```

## Scripts Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Build di produzione
- `npm run preview` - Preview del build
- `npm run lint` - Linting del codice

## Design System - Liquid Glass

### Componenti Liquid Glass
- **LiquidGlass**: Componente base con backdrop-blur e morfing
- **LiquidButton**: Pulsanti con effetti shimmer e animazioni
- **LiquidCard**: Card responsive con particelle fluttuanti
- **Navigation**: Sistema di navigazione dinamico e fluido

### Variabili CSS Personalizzate
```css
--glass-bg: rgba(15, 23, 42, 0.9);
--glass-border: rgba(255, 255, 255, 0.25);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
```

## Deployment

L'applicazione può essere deployata su qualsiasi piattaforma che supporta applicazioni React statiche:

- **Vercel** (consigliato)
- **Netlify**
- **GitHub Pages**

## Changelog

Per vedere tutte le novità e miglioramenti:
- Visita il [CHANGELOG.md](./CHANGELOG.md) completo
- Controlla le notifiche in-app per gli aggiornamenti
- Pannello admin per notifiche push globali

## Contribuzioni

Questo progetto è sviluppato e mantenuto da **Albix4563**.

## Licenza

© 2025 Albix4563. Tutti i diritti riservati.

---

### 🚀 **Migrazione Design v0.8.0 → v0.9.2**
Questa release rappresenta una **trasformazione completa** dell'interfaccia utente, passando da un design classico a un'esperienza **Liquid Glass** premium ispirata a iOS 26.