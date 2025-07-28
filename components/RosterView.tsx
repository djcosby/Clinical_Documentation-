
import React, { useState } from 'react';
import { Client, Program, Partner } from '../types';
import { PencilIcon, TrashIcon, UserPlusIcon, UsersIcon, PlusCircleIcon } from './icons';

interface RosterViewProps {
    roster: Client[];
    programs: Program[];
    partner: Partner;
    onAddNewClient: (programId: string) => void;
    onEditClient: (client: Client) => void;
    onDeleteClient: (clientId: string) => void;
}

const RosterView: React.FC<RosterViewProps> = ({
    roster,
    programs,
    partner,
    onAddNewClient,
    onEditClient,
    onDeleteClient,
}) => {

    const handleDelete = (clientId: string, clientName: string) => {
        if (window.confirm(`Are you sure you want to permanently delete ${clientName} from the roster? This action cannot be undone.`)) {
            onDeleteClient(clientId);
        }
    }
    
    return (
        <div className="max-w-7xl mx-auto space-y-8">
             <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{partner.name} - Client Roster</h3>
                     <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {roster.length} Client(s)
                     </span>
                </div>
                <div className="p-4 sm:p-6 space-y-6 border-t border-slate-200 dark:border-slate-700">
                     {programs.map(program => {
                        const clientsInProgram = roster.filter(c => c.programId === program.id);
                        return (
                            <div key={program.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
                                    <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{program.name}</h4>
                                    <button
                                        onClick={() => onAddNewClient(program.id)}
                                        className="flex items-center px-3 py-1.5 bg-sky-600 text-white text-xs font-medium rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-all"
                                    >
                                        <UserPlusIcon className="w-4 h-4 mr-2" />
                                        Add Client
                                    </button>
                                </div>
                                
                                <div className="flow-root">
                                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                                <thead className="bg-slate-100 dark:bg-slate-700">
                                                    <tr>
                                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 sm:pl-6 w-1/4">Name</th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 w-1/2">Presenting Problem / Summary</th>
                                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 w-1/4">
                                                            <span className="sr-only">Actions</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200 dark:divide-slate-600 bg-white dark:bg-slate-800">
                                                    {clientsInProgram.length > 0 ? clientsInProgram.map((client) => (
                                                        <tr key={client.id}>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-6">{client.name}</td>
                                                            <td className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                                <p className="truncate">{client.profile.presentingProblem || 'No summary available.'}</p>
                                                            </td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                <button onClick={() => onEditClient(client)} className="p-1 text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-200 mr-2" aria-label={`Edit ${client.name}`}>
                                                                    <PencilIcon className="w-5 h-5"/>
                                                                </button>
                                                                <button onClick={() => handleDelete(client.id, client.name)} className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200" aria-label={`Delete ${client.name}`}>
                                                                    <TrashIcon className="w-5 h-5"/>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={3} className="text-center py-6 px-4 text-sm text-slate-500 dark:text-slate-400">
                                                                No clients in this program.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default RosterView;