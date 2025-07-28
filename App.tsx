import React, { useState, useCallback, useMemo } from 'react';
import { NoteType, Client, Selections, GeneratedNote, Document, Program, Partner } from './types';
import { NOTE_TYPES, MOCK_CLIENTS, MOCK_PROGRAMS, MOCK_PARTNERS, PROGRAM_NAMES } from './constants';
import { generateNotes } from './services/geminiService';
import ClientManager from './components/ClientManager';
import ClientEditor from './components/ClientEditor';
import DocumentManager from './components/DocumentManager';
import SessionForm from './components/SessionForm';
import GeneratedNoteDisplay from './components/GeneratedNoteDisplay';
import RosterView from './components/RosterView';
import AssessmentGenerator from './components/AssessmentGenerator';
import StartPage from './components/StartPage';
import { SparklesIcon, UsersIcon, ClipboardListIcon, HomeIcon } from './components/icons';

type View = 'start' | 'generator' | 'assessment' | 'roster';

const NavButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-sky-500 ${
        isActive
          ? 'bg-sky-600 text-white shadow'
          : 'text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('start');

  const [noteType, setNoteType] = useState<NoteType | null>(null);
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [programs, setPrograms] = useState<Program[]>(MOCK_PROGRAMS);
  const [roster, setRoster] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [sessionIntervention, setSessionIntervention] = useState('');
  const [selections, setSelections] = useState<Selections>({ checkboxes: {}, narratives: {} });
  const [generatedNotes, setGeneratedNotes] = useState<GeneratedNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isClientEditorOpen, setIsClientEditorOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);
  const [newClientProgramId, setNewClientProgramId] = useState<string | undefined>(undefined);

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

  // --- Roster Management ---
  const handleOpenClientEditor = (client?: Client) => {
    setEditingClient(client);
    setNewClientProgramId(undefined);
    setIsClientEditorOpen(true);
  };
  
  const handleAddNewClientToProgram = (programId: string) => {
    setEditingClient(undefined);
    setNewClientProgramId(programId);
    setIsClientEditorOpen(true);
  }

  const handleSaveClient = (clientData: Omit<Client, 'id'> & { id?: string }) => {
    if (clientData.id) { // Editing existing client
      const updatedClient = { ...clientData, id: clientData.id } as Client;
      setRoster(roster.map(c => c.id === updatedClient.id ? updatedClient : c));
      setSelectedClients(prevSelected => prevSelected.map(sc => sc.id === updatedClient.id ? updatedClient : sc));
    } else { // Adding new client
      const newClient: Client = { ...clientData, id: Date.now().toString() };
      setRoster([...roster, newClient]);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setRoster(roster.filter(c => c.id !== clientId));
    setSelectedClients(selectedClients.filter(c => c.id !== clientId));
  };

  const handleAddPartner = (partnerName: string) => {
    const newPartnerId = `partner-${Date.now()}`;
    const newPartner: Partner = { id: newPartnerId, name: partnerName };
    setPartners(prev => [...prev, newPartner]);
    
    // Also create the 3 standard programs for this new partner
    const newProgramsForPartner: Program[] = PROGRAM_NAMES.map((progName, index) => ({
      id: `prog-${newPartnerId}-${index + 1}`,
      name: progName,
      partnerId: newPartnerId,
    }));
    setPrograms(prev => [...prev, ...newProgramsForPartner]);
  }
  // --- End Roster Management ---


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

  if (activeView === 'start') {
    return <StartPage onNavigate={setActiveView} />;
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                  <button onClick={() => setActiveView('start')} className="p-2 -ml-2 mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <HomeIcon className="w-6 h-6 text-sky-500"/>
                  </button>
                  <span className="hidden sm:inline">AI Assistant</span>
                </h1>
                <nav className="flex space-x-1 sm:space-x-2">
                    <NavButton isActive={activeView === 'generator'} onClick={() => setActiveView('generator')}>
                        <SparklesIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline">Note Generator</span>
                    </NavButton>
                    <NavButton isActive={activeView === 'assessment'} onClick={() => setActiveView('assessment')}>
                        <ClipboardListIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline">Assessments</span>
                    </NavButton>
                    <NavButton isActive={activeView === 'roster'} onClick={() => setActiveView('roster')}>
                        <UsersIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline">Client Roster</span>
                    </NavButton>
                </nav>
            </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {activeView === 'generator' && (
            <>
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
            </>
        )}

        {activeView === 'assessment' && (
            <AssessmentGenerator />
        )}


        {activeView === 'roster' && (
            <RosterView
                roster={roster}
                programs={programs}
                partners={partners}
                onAddNewClient={handleAddNewClientToProgram}
                onEditClient={handleOpenClientEditor}
                onDeleteClient={handleDeleteClient}
                onAddPartner={handleAddPartner}
            />
        )}
      </main>

      <ClientEditor 
        isOpen={isClientEditorOpen}
        onClose={() => setIsClientEditorOpen(false)}
        onSave={handleSaveClient}
        clientToEdit={editingClient}
        programs={programs}
        partners={partners}
        programId={newClientProgramId}
      />
    </div>
  );
};

export default App;