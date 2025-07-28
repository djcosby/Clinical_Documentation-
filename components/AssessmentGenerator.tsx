
import React, { useState, useCallback, useMemo } from 'react';
import { AssessmentType, AssessmentData, GeneratedAssessment, Program } from '../types';
import { ASSESSMENT_TYPES, INITIAL_ASSESSMENT_SECTIONS, COMPREHENSIVE_ASSESSMENT_SECTIONS } from '../constants';
import { generateAssessment } from '../services/geminiService';
import { SparklesIcon, CheckIcon, ClipboardCopyIcon } from './icons';
import AssessmentForm from './AssessmentForm';

interface AssessmentGeneratorProps {
    programs: Program[];
    onBack: () => void;
}

const AssessmentGenerator: React.FC<AssessmentGeneratorProps> = ({ programs, onBack }) => {
    const [programId, setProgramId] = useState<string>(programs.length > 0 ? programs[0].id : '');
    const [clientInfo, setClientInfo] = useState({
        name: '',
        dateOfBirth: '',
        dateOfAssessment: new Date().toISOString().split('T')[0],
        clinicianName: '',
    });
    const [assessmentType, setAssessmentType] = useState<AssessmentType>(AssessmentType.INITIAL);
    const [assessmentData, setAssessmentData] = useState<AssessmentData>({});
    
    const [generatedAssessment, setGeneratedAssessment] = useState<GeneratedAssessment | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [copied, setCopied] = useState(false);

    const assessmentSections = useMemo(() => {
        return assessmentType === AssessmentType.INITIAL ? INITIAL_ASSESSMENT_SECTIONS : COMPREHENSIVE_ASSESSMENT_SECTIONS;
    }, [assessmentType]);

    const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClientInfo(prev => ({...prev, [name]: value}));
    };

    const handleAssessmentTypeChange = (type: AssessmentType) => {
        setAssessmentType(type);
        setGeneratedAssessment(null);
        setError(null);
    }
    
    const isGenerationDisabled = useMemo(() => {
        return isLoading || !programId || !clientInfo.name || Object.keys(assessmentData).length === 0 || Object.values(assessmentData).every(section => Object.values(section).every(value => value === ''));
    }, [isLoading, programId, clientInfo.name, assessmentData]);

    const handleGenerate = useCallback(async () => {
        if (isGenerationDisabled) return;

        setIsLoading(true);
        setError(null);
        setGeneratedAssessment(null);
        setCopied(false);

        try {
            const programName = programs.find(p => p.id === programId)?.name || 'Unknown Program';
            const fullClientInfo = { ...clientInfo, programName };
            const result = await generateAssessment(fullClientInfo, assessmentType, assessmentData);
            setGeneratedAssessment(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred while generating the assessment.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [clientInfo, programId, assessmentType, assessmentData, isGenerationDisabled, programs]);
    
    const handleCopy = () => {
        if (!generatedAssessment?.assessmentText) return;
        navigator.clipboard.writeText(generatedAssessment.assessmentText).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const isFormDisabled = !programId;

    return (
        <div className="max-w-7xl mx-auto">
             <button onClick={onBack} className="mb-6 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
                &larr; Back to Dashboard
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* --- Controls --- */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md space-y-4">
                         <div>
                            <h2 className="block text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">1. Select Program</h2>
                            <select
                                id="program-selection"
                                value={programId}
                                onChange={(e) => setProgramId(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            >
                                <option value="" disabled>-- Choose a program for the new client --</option>
                                {programs.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                         </div>
                    </div>

                    <div className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md space-y-4 transition-opacity duration-300 ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
                        <fieldset disabled={isFormDisabled} className="space-y-4">
                            <div>
                                <h2 className="block text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">2. Client & Assessment Details</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="client-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Client Name</label>
                                        <input type="text" id="client-name" name="name" value={clientInfo.name} onChange={handleClientInfoChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="clinician-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Clinician Name</label>
                                        <input type="text" id="clinician-name" name="clinicianName" value={clientInfo.clinicianName} onChange={handleClientInfoChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="client-dob" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Client Date of Birth</label>
                                        <input type="date" id="client-dob" name="dateOfBirth" value={clientInfo.dateOfBirth} onChange={handleClientInfoChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="assessment-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date of Assessment</label>
                                        <input type="date" id="assessment-date" name="dateOfAssessment" value={clientInfo.dateOfAssessment} onChange={handleClientInfoChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm" />
                                    </div>
                                </div>
                            </div>
                             <div>
                                <h2 className="block text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">3. Select Assessment Type</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {ASSESSMENT_TYPES.map(type => (
                                        <button
                                        key={type}
                                        onClick={() => handleAssessmentTypeChange(type)}
                                        className={`px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-sky-500
                                            ${assessmentType === type ? 'bg-sky-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                                        >
                                        {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    
                    <fieldset disabled={isFormDisabled} className={`transition-opacity duration-300 ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">4. Fill Out Assessment Notes</h3>
                        <div className="mt-4">
                            <AssessmentForm 
                                sections={assessmentSections}
                                data={assessmentData}
                                onChange={setAssessmentData}
                            />
                        </div>
                    </fieldset>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerationDisabled}
                        className="w-full flex justify-center items-center px-6 py-4 text-lg font-bold rounded-md transition-colors text-white
                                    bg-sky-600 hover:bg-sky-700
                                    disabled:bg-slate-400 disabled:text-slate-200 disabled:cursor-not-allowed
                                    dark:disabled:bg-slate-600 dark:disabled:text-slate-400"
                    >
                        <SparklesIcon className="w-6 h-6 mr-3"/>
                        {isLoading ? 'Generating...' : 'Generate Assessment'}
                    </button>
                </div>

                <div className="lg:sticky top-28 self-start">
                     {/* --- Display --- */}
                     <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md min-h-[60vh]">
                        {isLoading && (
                            <div className="w-full h-full flex flex-col justify-center items-center p-8">
                                <SparklesIcon className="w-12 h-12 text-sky-500 animate-pulse" />
                                <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">Generating Assessment...</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">The AI is composing the document. Please wait.</p>
                            </div>
                        )}
                        {error && (
                            <div className="w-full h-full flex justify-center items-center bg-red-50 dark:bg-red-900/20 p-8">
                              <div className="text-center">
                                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Error Generating Assessment</h3>
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                              </div>
                            </div>
                        )}
                        {!isLoading && !error && generatedAssessment && (
                             <div className="overflow-hidden transition-all duration-300">
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                                    <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{generatedAssessment.clientName} - {assessmentType}</h4>
                                    <button
                                        onClick={handleCopy}
                                        className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                        copied
                                            ? 'bg-green-600 text-white'
                                            : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'
                                        }`}
                                    >
                                        {copied ? <CheckIcon className="w-5 h-5 mr-1.5" /> : <ClipboardCopyIcon className="w-5 h-5 mr-1.5" />}
                                        {copied ? 'Copied!' : 'Copy Assessment'}
                                    </button>
                                </div>
                                <div className="p-4 max-h-[80vh] overflow-y-auto">
                                    <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">{generatedAssessment.assessmentText}</pre>
                                </div>
                            </div>
                        )}
                        {!isLoading && !error && !generatedAssessment && (
                             <div className="w-full h-full flex flex-col justify-center items-center text-center p-8">
                                <SparklesIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">Awaiting Input</h3>
                                 <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                                    {isFormDisabled 
                                        ? "Select a program from the dropdown above to begin creating a new assessment."
                                        : "Complete the form and click \"Generate Assessment\" to see the results here."
                                    }
                                </p>
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AssessmentGenerator;