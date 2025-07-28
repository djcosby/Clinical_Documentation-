import React from 'react';
import { Client } from '../types';
import { XCircleIcon, PencilIcon, TrashIcon, UserPlusIcon } from './icons';

interface ClientRosterProps {
  isOpen: boolean;
  onClose: () => void;
  roster: Client[];
  onAddClientToSelection: (client: Client) => void;
  selectedClientIds: Set<string>;
  onAddNewClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

const ClientRoster: React.FC<ClientRosterProps> = ({ 
    isOpen, 
    onClose, 
    roster,
    onAddClientToSelection, 
    selectedClientIds,
    onAddNewClient,
    onEditClient,
    onDeleteClient,
 }) => {
  if (!isOpen) return null;

  const handleDelete = (clientId: string, clientName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete ${clientName} from the roster?`)) {
      onDeleteClient(clientId);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Client Roster</h2>
                <button 
                    onClick={onAddNewClient}
                    className="flex items-center px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-800 transition-all"
                >
                    <UserPlusIcon className="w-5 h-5 mr-2" />
                    Add New Client
                </button>
            </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          {roster.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {roster.map((client) => (
                <li key={client.id} className="py-3 flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white">{client.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{client.profile.presentingProblem || 'No summary available.'}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <button onClick={() => onEditClient(client)} className="p-1 text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400" aria-label={`Edit ${client.name}`}>
                        <PencilIcon className="w-5 h-5"/>
                    </button>
                    <button onClick={() => handleDelete(client.id, client.name)} className="p-1 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400" aria-label={`Delete ${client.name}`}>
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                    <button
                      onClick={() => onAddClientToSelection(client)}
                      disabled={selectedClientIds.has(client.id)}
                      className="w-20 text-center px-3 py-1 text-sm font-medium rounded-md transition-colors
                                bg-sky-600 text-white hover:bg-sky-700
                                disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed
                                dark:disabled:bg-slate-600 dark:disabled:text-slate-400"
                    >
                      {selectedClientIds.has(client.id) ? 'Added' : 'Add'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
                <p className="text-slate-500 dark:text-slate-400">Your client roster is empty.</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Click "Add New Client" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientRoster;