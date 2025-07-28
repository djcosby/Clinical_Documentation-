
import React, { useState } from 'react';
import { Client, NoteType } from '../types';
import { UsersIcon, XCircleIcon, PlusCircleIcon } from './icons';

interface ClientManagerProps {
  selectedClients: Client[];
  onClientsChange: (clients: Client[]) => void;
  noteType: NoteType | null;
  roster: Client[];
}

const ClientManager: React.FC<ClientManagerProps> = ({ 
  selectedClients, 
  onClientsChange, 
  noteType,
  roster,
}) => {
  const handleAddClientToSelection = (clientId: string) => {
    if (!clientId) return;
    const clientToAdd = roster.find(c => c.id === clientId);
    if (!clientToAdd) return;

    if (noteType !== NoteType.GROUP) {
      onClientsChange([clientToAdd]);
    } else {
      if (!selectedClients.find(c => c.id === clientToAdd.id)) {
        onClientsChange([...selectedClients, clientToAdd]);
      }
    }
  };

  const handleRemoveClient = (clientId: string) => {
    onClientsChange(selectedClients.filter(c => c.id !== clientId));
  };
  
  const availableClients = roster.filter(
    (client) => !selectedClients.find((selected) => selected.id === client.id)
  );

  const canAddMoreClients = noteType === NoteType.GROUP || selectedClients.length === 0;

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center">
            <UsersIcon className="w-6 h-6 mr-2 text-sky-600 dark:text-sky-400"/>
            Selected Client(s)
        </h2>
      </div>
      
      {canAddMoreClients && (
        <div className="flex items-center space-x-2 mb-4">
          <select
            onChange={(e) => handleAddClientToSelection(e.target.value)}
            value=""
            className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            aria-label="Select a client to add"
          >
            <option value="" disabled>
              {noteType === NoteType.GROUP ? 'Add a client to the group...' : 'Select a client...'}
            </option>
            {availableClients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <button
            onClick={() => handleAddClientToSelection((document.querySelector('select[aria-label="Select a client to add"]') as HTMLSelectElement)?.value)}
            className="flex-shrink-0 flex items-center px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-all"
          >
            <PlusCircleIcon className="w-5 h-5 mr-1" />
            Add
          </button>
        </div>
      )}

      <div className="space-y-2">
        {selectedClients.length > 0 ? (
          selectedClients.map(client => (
            <div key={client.id} className="bg-slate-100 dark:bg-slate-700 p-3 rounded-md flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{client.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{client.profile.presentingProblem || 'No presenting problem specified.'}</p>
              </div>
              <button
                onClick={() => handleRemoveClient(client.id)}
                className="text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                aria-label={`Remove ${client.name}`}
              >
                <XCircleIcon className="w-6 h-6"/>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-4 px-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
            <p className="text-sm text-slate-500 dark:text-slate-400">No clients selected. Add a client to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManager;
