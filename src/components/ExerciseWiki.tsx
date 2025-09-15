
import React, { useState } from 'react';
import { 
  Dumbbell, 
  Heart, 
  RotateCcw, 
  Mountain, 
  Zap, 
  Circle,
  Lightbulb,
  AlertTriangle,
  Youtube,
  Image,
  Search
} from 'lucide-react';

const ExerciseWiki: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'tutti', name: 'Tutti', icon: Dumbbell },
    { id: 'petto', name: 'Petto', icon: Heart },
    { id: 'schiena', name: 'Schiena', icon: RotateCcw },
    { id: 'spalle', name: 'Spalle', icon: Mountain },
    { id: 'braccia', name: 'Braccia', icon: Dumbbell },
    { id: 'gambe', name: 'Gambe', icon: Zap },
    { id: 'core', name: 'Core', icon: Circle }
  ];

  const exercises = [
    {
      name: 'Panca Piana',
      category: 'petto',
      muscles: 'Petto, Tricipiti, Spalle',
      difficulty: 'Intermedio',
      description: 'La panca piana è un esercizio fondamentale che coinvolge principalmente i muscoli del petto.',
      tips: ['Mantieni i piedi ben piantati a terra', 'Conserva un leggero arco nella schiena', 'Controlla la discesa'],
      safety: 'Usa sempre uno spotter quando sollevi pesi elevati'
    },
    {
      name: 'Trazioni',
      category: 'schiena',
      muscles: 'Dorsali, Romboidi, Bicipiti',
      difficulty: 'Intermedio',
      description: 'Le trazioni sono un eccellente esercizio per la parte superiore del corpo che coinvolge più gruppi muscolari.',
      tips: ['Inizia da una posizione completamente appesa', 'Porta il petto verso la sbarra', 'Controlla la discesa'],
      safety: 'Assicurati di avere una presa salda e sviluppa gradualmente la forza'
    },
    {
      name: 'Squat',
      category: 'gambe',
      muscles: 'Quadricipiti, Glutei, Femorali',
      difficulty: 'Principiante',
      description: 'Lo squat è il re degli esercizi per la parte inferiore del corpo, coinvolgendo più gruppi muscolari.',
      tips: ['Mantieni il petto alto', 'Le ginocchia seguono la direzione delle punte dei piedi', 'Movimento di cerniera dell\'anca'],
      safety: 'Inizia con il peso corporeo prima di aggiungere carico'
    },
    {
      name: 'Stacco da Terra',
      category: 'schiena',
      muscles: 'Femorali, Glutei, Dorsali, Trapezi',
      difficulty: 'Avanzato',
      description: 'Lo stacco da terra è uno degli esercizi più efficaci per tutto il corpo.',
      tips: ['Mantieni la barra vicina al corpo', 'Colonna vertebrale neutra durante tutto il movimento', 'Spingi attraverso i talloni'],
      safety: 'Padroneggia il movimento prima di aggiungere peso significativo'
    },
    {
      name: 'Plank',
      category: 'core',
      muscles: 'Core, Spalle, Glutei',
      difficulty: 'Principiante',
      description: 'Il plank è un esercizio isometrico che sviluppa forza e stabilità del core.',
      tips: ['Mantieni il corpo in linea retta', 'Contrai il core', 'Respira normalmente'],
      safety: 'Inizia con tenute più brevi e aumenta gradualmente'
    },
    {
      name: 'Military Press',
      category: 'spalle',
      muscles: 'Deltoidi, Tricipiti, Core',
      difficulty: 'Intermedio',
      description: 'Il military press è un esercizio fondamentale per lo sviluppo delle spalle e della forza funzionale.',
      tips: ['Mantieni il core contratto', 'Spingi il bilanciere verso l\'alto in linea retta', 'Non inarcare eccessivamente la schiena'],
      safety: 'Inizia con pesi leggeri per padroneggiare la tecnica'
    },
    {
      name: 'Curl Bicipiti',
      category: 'braccia',
      muscles: 'Bicipiti, Avambracci',
      difficulty: 'Principiante',
      description: 'Il curl per bicipiti è l\'esercizio classico per lo sviluppo della parte anteriore del braccio.',
      tips: ['Mantieni i gomiti fermi', 'Controlla il movimento', 'Concentrati sulla contrazione muscolare'],
      safety: 'Evita di utilizzare lo slancio per sollevare il peso'
    },
    {
      name: 'Dips',
      category: 'braccia',
      muscles: 'Tricipiti, Petto, Spalle',
      difficulty: 'Intermedio',
      description: 'I dips sono un esercizio efficace per tricipiti e petto utilizzando il peso corporeo.',
      tips: ['Mantieni il corpo dritto', 'Scendi fino a sentire un leggero stiramento', 'Spingi con forza verso l\'alto'],
      safety: 'Non scendere troppo per evitare stress alle spalle'
    }
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'tutti' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.muscles.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return 'text-green-400';
      case 'Intermedio': return 'text-yellow-400';
      case 'Avanzato': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const openYouTubeSearch = (exerciseName: string) => {
    const query = encodeURIComponent(`${exerciseName} esercizio forma tutorial`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const openGoogleImageSearch = (exerciseName: string) => {
    const query = encodeURIComponent(`${exerciseName} esercizio fitness muscoli`);
    window.open(`https://www.google.com/search?tbm=isch&q=${query}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-poppins font-bold text-white">Enciclopedia Esercizi</h2>

      {/* Search */}
      <div className="glass-effect rounded-xl p-4">
        <input
          type="text"
          placeholder="Cerca esercizi o gruppi muscolari..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400"
        />
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'accent-gradient text-white'
                : 'text-slate-400 hover:text-white border border-slate-600'
            }`}
          >
            <category.icon className="w-5 h-5" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {filteredExercises.map((exercise, index) => (
          <div key={index} className="glass-effect rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-white">{exercise.name}</h3>
                <p className="text-sm text-slate-400">{exercise.muscles}</p>
              </div>
              <span className={`text-sm font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
            </div>

            <p className="text-slate-300 mb-4">{exercise.description}</p>            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Consigli
                </h4>
                <ul className="space-y-1">
                  {exercise.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-slate-400">• {tip}</li>
                  ))}
                </ul>
              </div>              <div>
                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Sicurezza
                </h4>
                <p className="text-sm text-slate-400">{exercise.safety}</p>
              </div>
            </div>            <div className="flex space-x-3 mt-4">
              <button 
                onClick={() => openYouTubeSearch(exercise.name)}
                className="flex-1 border border-red-500/50 text-red-400 py-2 rounded-lg text-sm hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <Youtube className="w-4 h-4" />
                Tutorial YouTube
              </button>              <button 
                onClick={() => openGoogleImageSearch(exercise.name)}
                className="flex-1 border border-blue-500/50 text-blue-400 py-2 rounded-lg text-sm hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <Image className="w-4 h-4" />
                Immagini Esercizio
              </button>
            </div>
          </div>
        ))}
      </div>      {filteredExercises.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4 flex justify-center">
            <Search className="w-16 h-16 text-slate-400" />
          </div>
          <p className="text-slate-400">Nessun esercizio trovato per la tua ricerca.</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseWiki;
