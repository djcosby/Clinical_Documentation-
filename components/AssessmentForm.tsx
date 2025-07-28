import React from 'react';
import { AssessmentData } from '../types';

interface Field {
    id: string;
    label: string;
    script: string;
}

interface Section {
    id: string;
    title: string;
    fields: Field[];
}

interface AssessmentFormProps {
    sections: Section[];
    data: AssessmentData;
    onChange: React.Dispatch<React.SetStateAction<AssessmentData>>;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ sections, data, onChange }) => {
    
    const handleChange = (sectionId: string, fieldId: string, value: string) => {
        onChange(prevData => ({
            ...prevData,
            [sectionId]: {
                ...prevData[sectionId],
                [fieldId]: value
            }
        }));
    };

    return (
        <div className="space-y-4">
            {sections.map(section => (
                <details key={section.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden" open>
                    <summary className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        {section.title}
                    </summary>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                        {section.fields.map(field => (
                            <div key={field.id}>
                                <label htmlFor={`${section.id}-${field.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    {field.label}
                                </label>
                                <textarea
                                    id={`${section.id}-${field.id}`}
                                    value={data[section.id]?.[field.id] || ''}
                                    onChange={(e) => handleChange(section.id, field.id, e.target.value)}
                                    placeholder={field.script}
                                    rows={3}
                                    className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                />
                            </div>
                        ))}
                    </div>
                </details>
            ))}
        </div>
    );
};

export default AssessmentForm;
