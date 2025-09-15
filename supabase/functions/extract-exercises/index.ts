
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Testo mancante' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const exercises = parseExercisesFromText(text)
    
    return new Response(
      JSON.stringify({ exercises }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Errore nell\'elaborazione:', error)
    return new Response(
      JSON.stringify({ error: 'Errore nell\'elaborazione del testo' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function parseExercisesFromText(text: string) {
  const exercises: any[] = []
  const lines = text.split('\n').filter(line => line.trim().length > 0)
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.length < 3) continue
    
    // Pattern migliorati per riconoscere diversi formati di esercizi con macchine
    const patterns = [
      // Formato con macchina: "Panca piana chest press 4x8" o "Squat leg press 3x12"
      /^(.+?)\s+(chest press|leg press|lat machine|shoulder press|leg curl|leg extension|cable|smith machine|hack squat|pec deck|seated row|pull down|calf raise machine|abdominal machine|back extension|preacher curl|tricep dip machine|leg abduction|leg adduction)\s+(\d+)\s*[x×]\s*(\d+)(?:\s*-?\s*(\d+(?:\.\d+)?)\s*kg)?(?:\s*-?\s*recupero\s*(\d+)\s*[sm]?)?/i,
      
      // Formato standard: "Panca piana 4x8" o "Panca piana 4 x 8"
      /^(.+?)\s+(\d+)\s*[x×]\s*(\d+)(?:\s*-?\s*(\d+(?:\.\d+)?)\s*kg)?(?:\s*-?\s*recupero\s*(\d+)\s*[sm]?)?/i,
      
      // Formato: "Panca piana serie: 4 rip: 8" 
      /^(.+?)\s*(?:serie?|sets?):?\s*(\d+)(?:\s*(?:rip|ripetizioni|reps?):?\s*(\d+))?(?:\s*peso:?\s*(\d+(?:\.\d+)?)\s*kg)?/i,
      
      // Formato con serie multiple: "Panca piana 1x10, 1x8, 1x6"
      /^(.+?)\s+((?:\d+\s*[x×]\s*\d+(?:\s*,\s*)?)+)(?:\s*-?\s*(\d+(?:\.\d+)?)\s*kg)?/i,
      
      // Formato cardio: "Corsa 20 min" o "Tapis roulant 15 minuti"
      /^(.+?)\s+(\d+)\s*(?:min|minuti|minutes?)(?:\s*-?\s*recupero\s*(\d+)\s*[sm]?)?/i,
      
      // Formato semplice: "Squat 3 serie 12 ripetizioni"
      /^(.+?)\s+(\d+)\s*(?:serie?|sets?)\s+(\d+)\s*(?:rip|ripetizioni|reps?)/i
    ]
    
    let matched = false
    
    for (const pattern of patterns) {
      const match = trimmedLine.match(pattern)
      if (match) {
        matched = true
        
        let exerciseName = '';
        let machine = '';
        let numSets = 1;
        let reps = 10;
        let weight: number | undefined = undefined;
        let restTime = 60;
        
        // Pattern con macchina (primo pattern)
        if (pattern === patterns[0]) {
          exerciseName = match[1].trim();
          machine = match[2].trim();
          numSets = parseInt(match[3]);
          reps = parseInt(match[4]);
          if (match[5]) weight = parseFloat(match[5]);
          if (match[6]) restTime = parseInt(match[6]);
        }
        // Se è un pattern con serie multiple (quarto pattern)
        else if (pattern === patterns[3]) {
          exerciseName = match[1].trim();
          const setsString = match[2];
          weight = match[3] ? parseFloat(match[3]) : undefined;
          
          // Parsing delle serie multiple: "1x10, 1x8, 1x6"
          const setsMatches = setsString.match(/(\d+)\s*[x×]\s*(\d+)/g);
          if (setsMatches) {
            const sets = setsMatches.map((setMatch, index) => {
              const setData = setMatch.match(/(\d+)\s*[x×]\s*(\d+)/);
              if (setData) {
                return {
                  id: `${Date.now()}-${index}`,
                  set_number: index + 1,
                  reps: parseInt(setData[2]),
                  target_weight: weight,
                  notes: undefined
                };
              }
              return null;
            }).filter(set => set !== null);
            
            if (sets.length > 0) {
              exercises.push({
                id: `${Date.now()}-${exercises.length}`,
                name: exerciseName,
                machine: extractMachineFromName(exerciseName),
                sets: sets,
                rest_time: 60,
                notes: ''
              });
            }
          }
          continue;
        }
        // Pattern cardio (quinto pattern)
        else if (pattern === patterns[4]) {
          exerciseName = match[1].trim();
          const duration = parseInt(match[2]);
          restTime = match[3] ? parseInt(match[3]) : 120;
          
          exercises.push({
            id: `${Date.now()}-${exercises.length}`,
            name: exerciseName,
            machine: extractMachineFromName(exerciseName),
            sets: [{
              id: `${Date.now()}-0`,
              set_number: 1,
              reps: duration,
              target_weight: undefined,
              notes: 'min'
            }],
            rest_time: restTime,
            notes: 'Cardio'
          });
          continue;
        }
        // Altri pattern standard
        else {
          exerciseName = match[1].trim();
          if (match[2]) numSets = parseInt(match[2]);
          if (match[3]) reps = parseInt(match[3]);
          if (match[4]) weight = parseFloat(match[4]);
          if (match[5]) restTime = parseInt(match[5]);
          
          // Estrai macchina dal nome dell'esercizio
          machine = extractMachineFromName(exerciseName);
        }
        
        // Crea le serie individuali per esercizi non-cardio non già processati
        if (pattern !== patterns[3] && pattern !== patterns[4]) {
          const sets = [];
          for (let i = 1; i <= numSets; i++) {
            sets.push({
              id: `${Date.now()}-${i}`,
              set_number: i,
              reps: reps,
              target_weight: weight,
              notes: undefined
            });
          }
          
          exercises.push({
            id: `${Date.now()}-${exercises.length}`,
            name: exerciseName,
            machine: machine,
            sets: sets,
            rest_time: restTime,
            notes: ''
          });
        }
        break;
      }
    }
    
    // Se nessun pattern ha funzionato, prova a estrarre almeno il nome
    if (!matched) {
      const cleanLine = trimmedLine.replace(/[^\w\sàáâäèéêëìíîïòóôöùúûüñç]/gi, '').trim();
      if (cleanLine.length > 2) {
        exercises.push({
          id: `${Date.now()}-${exercises.length}`,
          name: cleanLine,
          machine: extractMachineFromName(cleanLine),
          sets: [{
            id: `${Date.now()}-0`,
            set_number: 1,
            reps: 10,
            target_weight: undefined,
            notes: undefined
          }],
          rest_time: 60,
          notes: ''
        });
      }
    }
  }
  
  return exercises;
}

function extractMachineFromName(exerciseName: string): string {
  const name = exerciseName.toLowerCase();
  
  // Mapping delle macchine comuni
  const machineKeywords = {
    'chest press': 'Chest Press',
    'pectoral': 'Chest Press',
    'pec deck': 'Pec Deck',
    'leg press': 'Leg Press',
    'leg curl': 'Leg Curl',
    'leg extension': 'Leg Extension',
    'lat machine': 'Lat Machine',
    'lat pulldown': 'Lat Pulldown',
    'pull down': 'Lat Pulldown',
    'seated row': 'Seated Row',
    'shoulder press': 'Shoulder Press',
    'smith machine': 'Smith Machine',
    'hack squat': 'Hack Squat',
    'calf raise': 'Calf Raise Machine',
    'cable': 'Cable Machine',
    'preacher': 'Preacher Bench',
    'tricep dip': 'Tricep Dip Machine',
    'leg abduction': 'Leg Abduction Machine',
    'leg adduction': 'Leg Adduction Machine',
    'tapis roulant': 'Tapis Roulant',
    'cyclette': 'Cyclette',
    'ellittica': 'Ellittica',
    'rowing': 'Rowing Machine',
    'back extension': 'Back Extension Machine',
    'abdominal': 'Abdominal Machine'
  };
  
  // Cerca le keyword nella stringa dell'esercizio
  for (const [keyword, machine] of Object.entries(machineKeywords)) {
    if (name.includes(keyword)) {
      return machine;
    }
  }
  
  // Se non trova nessuna corrispondenza, ritorna stringa vuota
  return '';
}
