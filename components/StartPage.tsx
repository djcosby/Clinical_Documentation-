import React from 'react';
import { SparklesIcon, ClipboardListIcon } from './icons';

type View = 'start' | 'generator' | 'assessment' | 'roster';

interface StartPageProps {
  onNavigate: (view: View) => void;
}

const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}> = ({ icon, title, description, buttonText, onClick }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center p-8 border border-slate-200 dark:border-slate-700">
    <div className="mb-4 text-sky-500">{icon}</div>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 mb-6 flex-grow">{description}</p>
    <button
      onClick={onClick}
      className="w-full px-6 py-3 text-base font-bold rounded-lg transition-colors text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800"
    >
      {buttonText}
    </button>
  </div>
);

const StartPage: React.FC<StartPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
          Clinical Documentation AI Assistant
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          What would you like to do today? Choose a task to get started.
        </p>
      </header>
      <main className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ActionCard
            icon={<SparklesIcon className="w-16 h-16" />}
            title="Create a Progress Note"
            description="Select clients, choose a note type (Group, Individual, etc.), and use AI to generate CARF/OMHAS-compliant progress notes from your observations."
            buttonText="Start Note Generator"
            onClick={() => onNavigate('generator')}
          />
          <ActionCard
            icon={<ClipboardListIcon className="w-16 h-16" />}
            title="Generate a Clinical Assessment"
            description="Use guided templates for Initial or Comprehensive assessments and let AI synthesize your notes into a formal, narrative-style document."
            buttonText="Start Assessment Generator"
            onClick={() => onNavigate('assessment')}
          />
        </div>
      </main>
       <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Select a tool to begin your AI-assisted documentation.</p>
        </footer>
    </div>
  );
};

export default StartPage;
