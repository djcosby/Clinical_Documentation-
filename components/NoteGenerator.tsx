import React, { useState, useCallback, useMemo } from 'react';
import { NoteType, Client, Selections, GeneratedNote, Document, Program, Partner } from '../types';
import { NOTE_TYPES } from '../constants';
import { generateNotes } from '../services/geminiService';
import ClientManager from './ClientManager';
import DocumentManager from './DocumentManager';
import SessionForm from './SessionForm';
import GeneratedNoteDisplay from './GeneratedNoteDisplay';
import { SparklesIcon } from './icons';

interface NoteGeneratorProps {
  partner: Partner;
  programs: Program[];
  partners: Partner[];
  roster: Client[];
  onBack: () => void;
}

const NoteGenerator: React.FC<NoteGeneratorProps> = ({ partner, programs, partners, roster, onBack }) => {
  const [noteType, setNoteType] = useState<NoteType | null>(NoteType.INDIVIDUAL);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [sessionIntervention, setSessionIntervention] = useState('');
  const [selections, setSelections] = useState<Selections>({ checkboxes: {}, narratives: {} });
  const [generatedNotes, setGeneratedNotes] = useState<GeneratedNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNoteTypeChange = (type: NoteType) => {
    setNoteType(type);
    if (type !== NoteType.GROUP) {
      setSelectedClients(sc => sc.length > 1 ? [sc[0]] : sc);
    }
    setGeneratedNotes([]);
    setError(null);
  };
  
  const isGenerationDisabled = useMemo(() => {
    return isLoading || !noteType || selectedClients.length === 0 || !sessionIntervention;
  }, [isLoading, noteType, selectedClients, sessionIntervention]);

  const handleGenerate = useCallback(async () => {
    if (isGenerationDisabled) return;

    setIsLoading(true);
    setError(null);
    setGeneratedNotes([]);

    try {
      const notes = await generateNotes(noteType!, selectedClients, programs, partners, documents, sessionIntervention, selections);
      setGeneratedNotes(notes);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  }, [noteType, selectedClients, programs, partners, documents, sessionIntervention, selections, isGenerationDisabled]);
  
  return (
    <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-6 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
            &larr; Back to Dashboard
        </button>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">1. Select Note Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {NOTE_TYPES.map(type => (
                <button
                key={type}
                onClick={() => handleNoteTypeChange(type)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-sky-500
                    ${noteType === type ? 'bg-sky-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                >
                {type}
                </button>
            ))}
            </div>
        </div>
        
        {noteType && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <ClientManager 
                    selectedClients={selectedClients} 
                    onClientsChange={setSelectedClients} 
                    noteType={noteType}
                    roster={roster}
                />
                <DocumentManager documents={documents} onDocumentsChange={setDocuments} />
                <SessionForm 
                    noteType={noteType}
                    intervention={sessionIntervention}
                    onInterventionChange={setSessionIntervention}
                    selections={selections}
                    onSelectionsChange={setSelections}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isGenerationDisabled}
                    className="w-full flex justify-center items-center px-6 py-4 text-lg font-bold rounded-md transition-colors text-white
                                bg-sky-600 hover:bg-sky-700
                                disabled:bg-slate-400 disabled:text-slate-200 disabled:cursor-not-allowed
                                dark:disabled:bg-slate-600 dark:disabled:text-slate-400"
                >
                    <SparklesIcon className="w-6 h-6 mr-3"/>
                    {isLoading ? 'Generating...' : 'Generate Note(s)'}
                </button>
            </div>
            
            <div className="lg:sticky top-24 self-start">
            <GeneratedNoteDisplay notes={generatedNotes} isLoading={isLoading} error={error}/>
            </div>

        </div>
        )}
    </div>
  );
};

export default NoteGenerator;