
import React, { useState, useMemo } from 'react';
import { Client, Program, Partner } from '../types';
import { PencilIcon, TrashIcon, UserPlusIcon, SparklesIcon, ClipboardListIcon } from './icons';
import NoteGenerator from './NoteGenerator';
import AssessmentGenerator from './AssessmentGenerator';

interface PartnerHomepageProps {
    partner: Partner;
    programs: Program[];
    roster: Client[];
    allPrograms: Program[]; // All programs for client editor context
    allPartners: Partner[]; // All partners for client editor context
    onAddNewClient: (programId: string) => void;
    onEditClient: (client: Client) => void;
    onDeleteClient: (clientId: string) => void;
}

const PartnerHomepage: React.FC<PartnerHomepageProps> = ({
    partner,
    programs,
    roster,
    allPrograms,
    allPartners,
    onAddNewClient,
    onEditClient,
    onDeleteClient,
}) => {
    const [activeGenerator, setActiveGenerator] = useState<'none' | 'notes' | 'assessments'>('none');

    const RosterTable: React.FC<{program: Program}> = ({ program }) => {
        const clientsInProgram = roster.filter(c => c.programId === program.id);

        const getInitials = (name: string) => {
            if (!name) return 'N/A';
            const parts = name.split(' ');
            if (parts.length > 1) {
                return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
            }
            return (parts[0][0] || '').toUpperCase();
        };

        const getDaysInProgram = (intakeDate?: string) => {
            if (!intakeDate) return 'N/A';
            const start = new Date(intakeDate).getTime();
            const now = new Date().getTime();
            if (isNaN(start)) return 'N/A';
            const diff = now - start;
            if (diff < 0) return 0;
            return Math.floor(diff / (1000 * 60 * 60 * 24));
        };

        const handleDelete = (clientId: string, clientName: string) => {
            if (window.confirm(`Are you sure you want to permanently delete ${clientName} from this program's roster? This action cannot be undone.`)) {
                onDeleteClient(clientId);
            }
        };

        return (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{program.name}</h4>
                    <button
                        onClick={() => onAddNewClient(program.id)}
                        className="flex items-center px-3 py-1.5 bg-sky-600 text-white text-xs font-medium rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-all"
                    >
                        <UserPlusIcon className="w-4 h-4 mr-2" />
                        Add New Client
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Initials</th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">DOB</th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Days In Program</th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Expected Discharge</th>
                                <th scope="col" className="relative px-3 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-600">
                            {clientsInProgram.length > 0 ? clientsInProgram.map(client => (
                                <tr key={client.id}>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{getInitials(client.name)}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{client.profile.dateOfBirth || 'N/A'}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{getDaysInProgram(client.profile.intakeDate)}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{client.profile.expectedDischargeDate || 'N/A'}</td>
                                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => onEditClient(client)} className="text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-200 p-1"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(client.id, client.name)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">No clients in this program.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    };

    const ActionCard: React.FC<{
        icon: React.ReactNode;
        title: string;
        description: string;
        buttonText: string;
        onClick: () => void;
      }> = ({ icon, title, description, buttonText, onClick }) => (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-start space-x-4">
            <div className="text-sky-500 flex-shrink-0 mt-1">{icon}</div>
            <div>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
                 <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm flex-grow">{description}</p>
            </div>
          </div>
          <button
            onClick={onClick}
            className="mt-auto w-full px-4 py-2 text-sm font-bold rounded-lg transition-colors text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800"
          >
            {buttonText}
          </button>
        </div>
      );

    const Dashboard = () => (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Client Rosters</h2>
                <div className="space-y-6">
                    {programs.length > 0 ? programs.map(program => <RosterTable key={program.id} program={program} />) : <p className="text-slate-500 dark:text-slate-400">No programs found for this partner.</p>}
                </div>
            </div>
            <div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Generators</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ActionCard
                        icon={<SparklesIcon className="w-8 h-8" />}
                        title="Note Generator"
                        description="Generate CARF/OMHAS-compliant DAP notes for individual, group, or case management sessions."
                        buttonText="Create a Progress Note"
                        onClick={() => setActiveGenerator('notes')}
                    />
                    <ActionCard
                        icon={<ClipboardListIcon className="w-8 h-8" />}
                        title="Assessment Generator"
                        description="Use guided templates for Initial or Comprehensive assessments for new clients."
                        buttonText="Create an Assessment"
                        onClick={() => setActiveGenerator('assessments')}
                    />
                </div>
            </div>
        </div>
    );

    if (activeGenerator === 'notes') {
        return <NoteGenerator partner={partner} programs={allPrograms} partners={allPartners} roster={roster} onBack={() => setActiveGenerator('none')} />;
    }
    
    if (activeGenerator === 'assessments') {
        return <AssessmentGenerator programs={programs} onBack={() => setActiveGenerator('none')} />;
    }

    return <Dashboard />;
};

export default PartnerHomepage;
