import React, { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Calendar, StickyNote, FileText } from 'lucide-react';

interface ExerciseNotesProps {
  exerciseName: string;
  onClose: () => void;
}

const ExerciseNotes: React.FC<ExerciseNotesProps> = ({ exerciseName, onClose }) => {
  const { saveExerciseNote, getExerciseNotes } = useSupabaseAuth();
  const { toast } = useToast();
  const [newNote, setNewNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const existingNotes = getExerciseNotes(exerciseName);
  const todayNotes = getExerciseNotes(exerciseName, selectedDate);

  const handleSaveNote = async () => {
    if (!newNote.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci una nota valida",
        variant: "destructive"
      });
      return;
    }

    await saveExerciseNote({
      exercise_name: exerciseName,
      note: newNote.trim(),
      date: selectedDate
    });

    setNewNote('');
    setIsAddingNote(false);
    toast({
      title: "Nota salvata",
      description: "Nota salvata con successo!",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const groupNotesByDate = () => {
    const grouped = existingNotes.reduce((acc, note) => {
      if (!acc[note.date]) {
        acc[note.date] = [];
      }
      acc[note.date].push(note);
      return acc;
    }, {} as Record<string, typeof existingNotes>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-poppins font-bold text-white flex items-center">
            <StickyNote className="mr-2" size={24} />
            Note per {exerciseName}
          </h2>
          <p className="text-slate-400 text-sm">Gestisci le tue note di allenamento</p>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Aggiungi nuova nota */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Aggiungi Nota</h3>
          {!isAddingNote && (
            <button
              onClick={() => setIsAddingNote(true)}
              className="accent-gradient text-white px-4 py-2 rounded-lg font-medium flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Nuova Nota
            </button>
          )}
        </div>

        {isAddingNote && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2 flex items-center">
                <Calendar size={16} className="mr-1" />
                Data
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Nota</label>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Scrivi qui la tua nota sull'esercizio (es. peso utilizzato, sensazioni, miglioramenti, ecc.)"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveNote}
                className="flex-1 accent-gradient text-white py-3 rounded-lg font-medium"
              >
                Salva Nota
              </button>
              <button
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote('');
                }}
                className="flex-1 border border-slate-600 text-slate-300 py-3 rounded-lg font-medium hover:bg-slate-700/30 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        )}        {!isAddingNote && todayNotes.length > 0 && (
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-sm text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Note di oggi ({formatDate(selectedDate)}):
            </p>
            {todayNotes.map((note) => (
              <div key={note.id} className="text-sm text-slate-400 bg-slate-600/50 rounded p-2 mb-2 last:mb-0">
                {note.note}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storico note */}
      {existingNotes.length > 0 && (
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Storico Note</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {groupNotesByDate().map(([date, notes]) => (
              <div key={date} className="border-l-2 border-sky-blue/30 pl-4">
                <div className="flex items-center mb-2">
                  <Calendar size={16} className="text-sky-blue mr-2" />
                  <span className="text-sky-blue font-medium">{formatDate(date)}</span>
                  <span className="text-xs text-slate-400 ml-2">({notes.length} note)</span>
                </div>
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div 
                      key={note.id} 
                      className="bg-slate-700/30 rounded-lg p-3 text-sm text-slate-300"
                    >
                      {note.note}
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(note.created_at).toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {existingNotes.length === 0 && (
        <div className="glass-effect rounded-2xl p-6 text-center">
          <StickyNote className="mx-auto mb-4 text-slate-400" size={48} />
          <h3 className="text-lg font-medium text-white mb-2">Nessuna Nota</h3>
          <p className="text-slate-400">
            Non hai ancora salvato note per questo esercizio.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseNotes;
