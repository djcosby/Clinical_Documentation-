
import React,
{
    useState,
    useEffect
}
from 'react';
import {
    Client,
    ClientProfile,
    Program,
    Partner,
    MBTIType,
    StageOfChange,
    HousingStatus
}
from '../types';
import {
    CASE_MANAGEMENT_NEEDS_OPTIONS,
    HOUSING_STATUSES,
    MBTI_TYPES,
    STAGES_OF_CHANGE
}
from '../constants';

interface ClientFormProps {
    onSave: (clientData: Omit < Client, 'id' > & {
        id ? : string
    }) => void;
    clientToEdit ? : Client;
    programs: Program[];
    partners: Partner[];
    initialProgramId ? : string;
}

const defaultProfile: Partial < ClientProfile > = {
    dateOfBirth: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    housingStatus: HousingStatus.STABLE,
    intakeDate: new Date().toISOString().split('T')[0],
    referralSource: '',
    emergencyContact: '',
    expectedDischargeDate: '',
    presentingProblem: '',
    mbti: '',
    introvertExtrovertScale: 5,
    stageOfChange: StageOfChange.PRECONTEMPLATION,
    primaryMotivators: '',
    readinessRuler: 5,
    strengths: [],
    skillsAndHobbies: [],
    supportSystem: [],
    barriers: [],
    caseManagementNeeds: [],
    historyOfTrauma: false,
    historyOfSubstanceUse: false,
    significantMedicalConditions: false,
    notesOnHistory: '',
};

const ClientForm: React.FC < ClientFormProps > = ({
    onSave,
    clientToEdit,
    programs,
    partners,
    initialProgramId
}) => {
    
    const getInitialPartnerId = () => {
        const programId = clientToEdit?.programId || initialProgramId;
        if (programId) {
            return programs.find(p => p.id === programId)?.partnerId || '';
        }
        return partners.length > 0 ? partners[0].id : '';
    };

    const [selectedPartnerId, setSelectedPartnerId] = useState<string>(getInitialPartnerId());

    const [formData, setFormData] = useState < Omit < Client, 'id' > & {
        id ? : string
    } > (
        clientToEdit ? {
            ...clientToEdit,
            profile: { ...defaultProfile, ...clientToEdit.profile }
        } : {
            name: '',
            programId: initialProgramId || '',
            profile: defaultProfile
        }
    );
    
     useEffect(() => {
        const partnerId = getInitialPartnerId();
        setSelectedPartnerId(partnerId);

        const availablePrograms = programs.filter(p => p.partnerId === partnerId);
        const currentProgramId = clientToEdit?.programId || initialProgramId || '';
        const isProgramIdValid = availablePrograms.some(p => p.id === currentProgramId);
        
        if (clientToEdit) {
            setFormData({
                ...clientToEdit,
                programId: isProgramIdValid ? currentProgramId : (availablePrograms[0]?.id || ''),
                profile: { ...defaultProfile, ...clientToEdit.profile }
            });
        } else {
             setFormData({
                name: '',
                programId: isProgramIdValid ? currentProgramId : (availablePrograms[0]?.id || ''),
                profile: defaultProfile
             });
        }
    }, [clientToEdit, initialProgramId, programs, partners]);


    const handlePartnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPartnerId = e.target.value;
        setSelectedPartnerId(newPartnerId);
        // Reset program selection when partner changes
        const firstProgramOfNewPartner = programs.find(p => p.partnerId === newPartnerId);
        setFormData(prev => ({
            ...prev,
            programId: firstProgramOfNewPartner?.id || ''
        }));
    }

    const handleInputChange = (e: React.ChangeEvent < HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement > ) => {
        const {
            name,
            value,
            type
        } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name.startsWith('profile.')) {
            const profileField = name.split('.')[1] as keyof ClientProfile;
            let finalValue: any = type === 'checkbox' ? checked : value;
            if (type === 'range' || (profileField === 'readinessRuler' || profileField === 'introvertExtrovertScale')) {
                finalValue = parseInt(value, 10);
            }

            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [profileField]: finalValue
                },
            }));
        } else {
            setFormData(prev => ({ ...prev,
                [name]: value
            }));
        }
    };

    const handleArrayInputChange = (field: keyof ClientProfile, value: string) => {
        if (Array.isArray(formData.profile[field])) {
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [field]: value.split(',').map(s => s.trim()).filter(Boolean),
                },
            }));
        }
    }

    const handleCheckboxGroupChange = (field: keyof ClientProfile, option: string) => {
        const currentValues = (formData.profile[field] as string[] || []);
        const newValues = currentValues.includes(option) ?
            currentValues.filter(item => item !== option) :
            [...currentValues, option];

        setFormData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                [field]: newValues
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.programId) {
            alert('Client Name, Partner, and Program are required.');
            return;
        }
        onSave(formData);
    };

    const renderInput = (name: string, label: string, type = 'text', required = false) => (
        <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={(formData as any)[name] || ''}
        onChange={handleInputChange}
        required={required}
        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
    </div>
    );
    
    const renderProfileInput = (name: keyof ClientProfile, label: string, type = 'text') => (
        <div>
      <label htmlFor={`profile.${name}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input
        type={type}
        id={`profile.${name}`}
        name={`profile.${name}`}
        value={(formData.profile as any)[name] || ''}
        onChange={handleInputChange}
        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
    </div>
    );

    const renderTextarea = (name: keyof ClientProfile, label: string, rows = 3) => (
        <div>
      <label htmlFor={`profile.${name}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <textarea
        id={`profile.${name}`}
        name={`profile.${name}`}
        value={(formData.profile as any)[name] || ''}
        onChange={handleInputChange}
        rows={rows}
        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
    </div>
    );

    const renderArrayTextarea = (name: keyof ClientProfile, label: string, placeholder: string) => (
         <div>
            <label htmlFor={`profile.${name}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            <textarea
                id={`profile.${name}`}
                name={`profile.${name}`}
                value={((formData.profile as any)[name] || []).join(', ')}
                onChange={(e) => handleArrayInputChange(name, e.target.value)}
                rows={2}
                placeholder={placeholder}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
        </div>
    );

    const renderProfileSelect = (name: keyof ClientProfile, label: string, options: readonly string[]) => (
         <div>
            <label htmlFor={`profile.${name}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            <select
                id={`profile.${name}`}
                name={`profile.${name}`}
                value={(formData.profile as any)[name] || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
    
    const renderSlider = (name: keyof ClientProfile, label: string, min=1, max=10) => (
        <div>
            <label htmlFor={`profile.${name}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}: <span className="font-bold text-sky-600 dark:text-sky-400">{(formData.profile as any)[name]}</span></label>
            <input
                type="range"
                id={`profile.${name}`}
                name={`profile.${name}`}
                min={min}
                max={max}
                value={(formData.profile as any)[name] || 5}
                onChange={handleInputChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
            />
        </div>
    );

    return ( 
    <form onSubmit = {handleSubmit} className = "space-y-8" >
        <fieldset className = "p-4 border rounded-lg dark:border-slate-600" >
            <legend className = "px-2 text-lg font-semibold text-slate-800 dark:text-slate-100" > Core Information </legend> 
            <div className = "grid grid-cols-1 gap-4 mt-4 md:grid-cols-2" > 
                {renderInput('name', 'Full Name', 'text', true)} 
                <div>
                    <label htmlFor="partnerId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Partner</label>
                    <select
                        id="partnerId"
                        name="partnerId"
                        value={selectedPartnerId}
                        onChange={handlePartnerChange}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    >
                        <option value="" disabled>Select a Partner</option>
                        {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="programId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Program</label>
                    <select
                        id="programId"
                        name="programId"
                        value={formData.programId}
                        onChange={handleInputChange}
                        required
                        disabled={!selectedPartnerId}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100 dark:disabled:bg-slate-600"
                    >
                         <option value="" disabled>Select a Program</option>
                         {programs.filter(p => p.partnerId === selectedPartnerId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                {renderProfileInput('dateOfBirth', 'Date of Birth', 'date')}
                {renderProfileInput('intakeDate', 'Intake Date', 'date')}
                {renderProfileInput('expectedDischargeDate', 'Expected Discharge Date', 'date')}
                {renderProfileInput('contactPhone', 'Contact Phone')}
                {renderProfileInput('contactEmail', 'Contact Email', 'email')}
                {renderTextarea('address', 'Address', 2)}
                {renderProfileSelect('housingStatus', 'Housing Status', HOUSING_STATUSES)}
                {renderProfileInput('referralSource', 'Referral Source')}
                {renderProfileInput('emergencyContact', 'Emergency Contact')}
            </div> 
        </fieldset>

        <fieldset className = "p-4 border rounded-lg dark:border-slate-600" >
            <legend className = "px-2 text-lg font-semibold text-slate-800 dark:text-slate-100" > Clinical & Psychosocial Portrait </legend> 
            <div className = "grid grid-cols-1 gap-6 mt-4 md:grid-cols-1" >
                {renderTextarea('presentingProblem', 'Presenting Problem')} 
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {renderProfileSelect('stageOfChange', 'Stage of Change', STAGES_OF_CHANGE)}
                    {renderSlider('readinessRuler', 'Readiness Ruler (1-10)')}
                    {renderProfileSelect('mbti', 'Myers-Briggs Type (MBTI)', MBTI_TYPES)}
                    {renderSlider('introvertExtrovertScale', 'Introvert/Extrovert Scale (1-10)')}
                </div>
                {renderTextarea('primaryMotivators', 'Primary Motivators (The "Why")')}
                {renderArrayTextarea('strengths', 'Identified Strengths', 'Comma-separated, e.g., Resilient, Artistic')}
                {renderArrayTextarea('skillsAndHobbies', 'Skills & Hobbies', 'Comma-separated, e.g., Cooking, Plays Guitar')}
                {renderArrayTextarea('supportSystem', 'Support System', 'Comma-separated, e.g., Family, Sponsor')}
                {renderArrayTextarea('barriers', 'Identified Barriers', 'Comma-separated, e.g., Lack of Transportation')}

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Case Management Needs</label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {CASE_MANAGEMENT_NEEDS_OPTIONS.map(opt => (
                            <label key={opt} className="flex items-center space-x-2">
                                <input type="checkbox" name="profile.caseManagementNeeds" value={opt} checked={formData.profile.caseManagementNeeds?.includes(opt) || false} onChange={() => handleCheckboxGroupChange('caseManagementNeeds', opt)} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-300">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Key History</label>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-4">
                             <label className="flex items-center space-x-2">
                                <input type="checkbox" name="profile.historyOfTrauma" checked={!!formData.profile.historyOfTrauma} onChange={handleInputChange} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-300">History of Trauma?</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" name="profile.historyOfSubstanceUse" checked={!!formData.profile.historyOfSubstanceUse} onChange={handleInputChange} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-300">Substance Use History?</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" name="profile.significantMedicalConditions" checked={!!formData.profile.significantMedicalConditions} onChange={handleInputChange} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-300">Significant Medical Conditions?</span>
                            </label>
                        </div>
                        {renderTextarea('notesOnHistory', 'Brief, Non-Detailed Notes on History')}
                    </div>
                </div>
            </div> 
        </fieldset>

        <div className = "flex justify-end pt-4" >
            <button type = "submit" className = "px-6 py-2 text-base font-medium text-white rounded-md bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500" >
            Save Client 
            </button> 
        </div> 
    </form>
    );
};

export default ClientForm;