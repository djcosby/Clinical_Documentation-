
import React from 'react';
import { Partner } from '../types';
import { BuildingIcon, PlusCircleIcon } from './icons';

interface CommunityMapProps {
  partners: Partner[];
  onSelectPartner: (partner: Partner) => void;
  onAddPartner: (partnerName: string) => void;
}

const HouseCard: React.FC<{
  partner: Partner;
  onClick: () => void;
}> = ({ partner, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center p-8 border border-slate-200 dark:border-slate-700 group"
  >
    <div className="mb-4 text-sky-500 dark:text-sky-400 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
      <BuildingIcon className="w-20 h-20" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{partner.name}</h3>
    <p className="text-slate-500 dark:text-slate-400 mb-6 flex-grow">
      Click to manage clients, notes, and assessments for this partner.
    </p>
    <span
      className="w-full px-6 py-3 text-base font-bold rounded-lg transition-colors text-white bg-sky-600 group-hover:bg-sky-700"
    >
      Enter Portal
    </span>
  </button>
);

const CommunityMap: React.FC<CommunityMapProps> = ({ partners, onSelectPartner, onAddPartner }) => {
    
    const handleAddPartnerClick = () => {
        const name = prompt("Enter the name for the new Partner organization:");
        if (name && name.trim()) {
            onAddPartner(name.trim());
        }
    };

    return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
          Welcome to the Community
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Select a partner organization from the map below to access their client portal.
        </p>
      </header>
      <main className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {partners.map(partner => (
            <HouseCard
              key={partner.id}
              partner={partner}
              onClick={() => onSelectPartner(partner)}
            />
          ))}
            <button
                onClick={handleAddPartnerClick}
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:border-sky-500 hover:text-sky-500 dark:hover:bg-slate-800/50 dark:hover:border-sky-400 dark:hover:text-sky-400 transition-all duration-300 flex flex-col items-center justify-center p-8 min-h-[280px]"
            >
                <PlusCircleIcon className="w-16 h-16 mb-4" />
                <span className="font-bold text-lg">Add New Partner</span>
            </button>
        </div>
      </main>
       <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Your AI-powered clinical documentation assistant.</p>
        </footer>
    </div>
  );
};

export default CommunityMap;