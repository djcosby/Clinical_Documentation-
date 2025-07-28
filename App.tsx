
import React, { useState, useMemo } from 'react';
import { Client, Program, Partner } from './types';
import { MOCK_CLIENTS, MOCK_PROGRAMS, MOCK_PARTNERS, PROGRAM_NAMES } from './constants';
import ClientEditor from './components/ClientEditor';
import CommunityMap from './components/CommunityMap';
import PartnerHomepage from './components/PartnerHomepage';

const App: React.FC = () => {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [programs, setPrograms] = useState<Program[]>(MOCK_PROGRAMS);
  const [roster, setRoster] = useState<Client[]>(MOCK_CLIENTS);

  const [isClientEditorOpen, setIsClientEditorOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);
  const [newClientProgramId, setNewClientProgramId] = useState<string | undefined>(undefined);

  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
  }

  const { filteredPrograms, filteredRoster } = useMemo(() => {
    if (!selectedPartner) {
        return { filteredPrograms: [], filteredRoster: [] };
    }
    const programsForPartner = programs.filter(p => p.partnerId === selectedPartner.id);
    const programIds = new Set(programsForPartner.map(p => p.id));
    const clientsForPartner = roster.filter(c => programIds.has(c.programId));
    return { filteredPrograms: programsForPartner, filteredRoster: clientsForPartner };
  }, [selectedPartner, programs, roster]);


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
    } else { // Adding new client
      const newClient: Client = { ...clientData, id: Date.now().toString() };
      setRoster([...roster, newClient]);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setRoster(roster.filter(c => c.id !== clientId));
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

  if (!selectedPartner) {
    return <CommunityMap partners={partners} onSelectPartner={handleSelectPartner} onAddPartner={handleAddPartner} />;
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                  <span className="text-sky-500 mr-3">{selectedPartner.name}</span>
                </h1>
                <div className="flex items-center space-x-1 sm:space-x-2">
                     <button onClick={() => setSelectedPartner(null)} className="px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
                        Change Partner
                    </button>
                </div>
            </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        <PartnerHomepage
            partner={selectedPartner}
            programs={filteredPrograms}
            roster={filteredRoster}
            allPrograms={programs}
            allPartners={partners}
            onAddNewClient={handleAddNewClientToProgram}
            onEditClient={handleOpenClientEditor}
            onDeleteClient={handleDeleteClient}
        />
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