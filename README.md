# Albyfit - Professional Fitness Tracker

**Version**: 0.9.3 [RELEASE CANDIDATE]
**Created by**: Albix4563

## Descrizione

Albyfit è un'applicazione professionale per il tracking degli allenamenti e il monitoraggio dei progressi fitness. L'app offre funzionalità avanzate di intelligenza artificiale per la gestione degli esercizi e un'interfaccia moderna e intuitiva.

## Caratteristiche Principali

- **Gestione Allenamenti**: Crea e gestisci routine di allenamento personalizzate
- **Tracking Progressi**: Monitora i tuoi miglioramenti nel tempo
- **Intelligenza Artificiale**: Analisi automatica di esercizi tramite AI
- **Interfaccia Moderna**: Design professionale con icone Lucide React
- **Autenticazione Sicura**: Sistema di login integrato con Supabase
- **Responsivo**: Ottimizzato per desktop e mobile

## Tecnologie Utilizzate

Questo progetto è costruito con:

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database + Auth)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Installazione e Sviluppo

### Prerequisiti
- Node.js 18+ e npm
- Account Supabase configurato

### Setup Locale

```sh
# Clona il repository
git clone <YOUR_GIT_URL>

# Naviga nella directory del progetto
cd routine-blaze-tracker-76

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
│   ├── ui/             # Componenti UI base (shadcn/ui)
│   ├── Dashboard.tsx   # Dashboard principale
│   ├── WorkoutManager.tsx  # Gestione allenamenti
│   └── ...
├── hooks/              # Custom React hooks
├── integrations/       # Integrazioni esterne (Supabase)
├── lib/               # Utilities e helper
└── pages/             # Pagine principali dell'app
```

## Scripts Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Build di produzione
- `npm run preview` - Preview del build
- `npm run lint` - Linting del codice

## Deployment

L'applicazione può essere deployata su qualsiasi piattaforma che supporta applicazioni React statiche:

- **Vercel** (consigliato)
- **Netlify**
- **GitHub Pages**

## Contribuzioni

Questo progetto è sviluppato e mantenuto da **Albix4563**.

## Licenza

© 2025 Albix4563. Tutti i diritti riservati.