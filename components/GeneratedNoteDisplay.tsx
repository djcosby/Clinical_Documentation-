
import React, { useState } from 'react';
import { GeneratedNote } from '../types';
import { ClipboardCopyIcon, CheckIcon, SparklesIcon } from './icons';

interface GeneratedNoteDisplayProps {
  notes: GeneratedNote[];
  isLoading: boolean;
  error: string | null;
}

const NoteCard: React.FC<{ note: GeneratedNote }> = ({ note }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(note.note).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{note.clientName}</h4>
        <button
          onClick={handleCopy}
          className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'
          }`}
        >
          {copied ? (
            <CheckIcon className="w-5 h-5 mr-1.5" />
          ) : (
            <ClipboardCopyIcon className="w-5 h-5 mr-1.5" />
          )}
          {copied ? 'Copied!' : 'Copy Note'}
        </button>
      </div>
      <div className="p-4">
        <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">{note.note}</pre>
      </div>
    </div>
  );
};

const GeneratedNoteDisplay: React.FC<GeneratedNoteDisplayProps> = ({ notes, isLoading, error }) => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-800/50 rounded-lg p-8">
            <SparklesIcon className="w-12 h-12 text-sky-500 animate-pulse" />
            <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">Generating Notes...</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">The AI is crafting the documentation. Please wait.</p>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="w-full h-full flex justify-center items-center bg-red-50 dark:bg-red-900/20 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Error Generating Note</h3>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      );
    }
  
    if (notes.length === 0) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-800/50 rounded-lg p-8 text-center">
            <SparklesIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">Awaiting Input</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Complete the form and click "Generate Note" to see the results here.</p>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Generated Notes</h3>
        {notes.map((note) => (
          <NoteCard key={note.clientId} note={note} />
        ))}
      </div>
    );
};

export default GeneratedNoteDisplay;
