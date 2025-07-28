
import React from 'react';
import { Client, Program, Partner } from '../types';
import { XCircleIcon } from './icons';
import ClientForm from './ClientForm';

interface ClientEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (clientData: Omit<Client, 'id'> & { id?: string }) => void;
    clientToEdit?: Client;
    programs: Program[];
    partners: Partner[];
    programId?: string; // Pre-selected program when adding new client
}

const ClientEditor: React.FC<ClientEditorProps> = ({ isOpen, onClose, onSave, clientToEdit, programs, partners, programId }) => {
    
    if (!isOpen) return null;

    const handleSave = (clientData: Omit<Client, 'id'> & { id?: string }) => {
        onSave(clientData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                        {clientToEdit ? 'Edit Client Profile' : 'Add New Client'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                        <XCircleIcon className="w-8 h-8" />
                    </button>
                </div>
                <div className="overflow-y-auto p-6">
                    <ClientForm 
                        clientToEdit={clientToEdit}
                        onSave={handleSave}
                        programs={programs}
                        partners={partners}
                        initialProgramId={programId}
                    />
                </div>
                {/* The save/cancel buttons are now within the ClientForm itself */}
            </div>
        </div>
    );
};

export default ClientEditor;