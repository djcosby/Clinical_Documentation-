
import React from 'react';
import { NoteType, Selections, CheckboxGroup } from '../types';
import { DAP_CHECKBOXES, INDIVIDUAL_THERAPY_MODALITY_CHECKBOXES, PEER_SUPPORT_CHECKBOXES } from '../constants';

interface SessionFormProps {
  noteType: NoteType;
  intervention: string;
  onInterventionChange: (value: string) => void;
  selections: Selections;
  onSelectionsChange: (selections: Selections) => void;
}

const renderCheckboxGroup = (group: CheckboxGroup, selections: Selections, handleCheckboxChange: (group: string, option: string) => void, handleNarrativeChange: (group: string, value: string) => void) => (
  <div key={group.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
    <h4 className="font-semibold text-slate-800 dark:text-slate-100">{group.title}</h4>
    {group.description && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{group.description}</p>}
    <div className="space-y-2 mt-2">
      {group.options.map(option => (
        <label key={option.label} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            checked={selections.checkboxes[group.id]?.includes(option.label) ?? false}
            onChange={() => handleCheckboxChange(group.id, option.label)}
          />
          <span className="text-slate-700 dark:text-slate-300">{option.label}</span>
        </label>
      ))}
    </div>
    {group.hasNarrative && (
      <div className="mt-4">
        <label htmlFor={`${group.id}-narrative`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {group.narrativeLabel || 'Narrative Details'}
        </label>
        <textarea
          id={`${group.id}-narrative`}
          rows={2}
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          value={selections.narratives[group.id] || ''}
          onChange={(e) => handleNarrativeChange(group.id, e.target.value)}
        />
      </div>
    )}
  </div>
);

const SessionForm: React.FC<SessionFormProps> = ({ noteType, intervention, onInterventionChange, selections, onSelectionsChange }) => {
  
  const handleCheckboxChange = (group: string, option: string) => {
    const currentSelection = selections.checkboxes[group] || [];
    const newSelection = currentSelection.includes(option)
      ? currentSelection.filter(item => item !== option)
      : [...currentSelection, option];
    onSelectionsChange({
      ...selections,
      checkboxes: { ...selections.checkboxes, [group]: newSelection }
    });
  };

  const handleNarrativeChange = (group: string, value: string) => {
    onSelectionsChange({
      ...selections,
      narratives: { ...selections.narratives, [group]: value }
    });
  };

  const getCheckboxGroups = () => {
    switch(noteType) {
        case NoteType.GROUP:
        case NoteType.CASE_MANAGEMENT:
            return DAP_CHECKBOXES;
        case NoteType.INDIVIDUAL:
            return [...DAP_CHECKBOXES, ...INDIVIDUAL_THERAPY_MODALITY_CHECKBOXES];
        case NoteType.PEER_SUPPORT:
            return PEER_SUPPORT_CHECKBOXES;
        default:
            return [];
    }
  }

  const checkboxGroups = getCheckboxGroups();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
        <label htmlFor="session-intervention" className="block text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Session Intervention / Outline
        </label>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Describe the core intervention(s) provided during the session. This will be the primary guide for the AI.</p>
        <textarea
          id="session-intervention"
          value={intervention}
          onChange={(e) => onInterventionChange(e.target.value)}
          rows={6}
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
          placeholder="e.g., 'Psychoeducation on the cognitive triangle. Explored client's automatic thoughts related to a recent conflict at work. Practiced a thought-challenging exercise...'"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Clinician Observations</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select the relevant observations to help the AI tailor the note for each client. These will be woven into the narrative.</p>
        <div className="space-y-4">
            {checkboxGroups.map(group => renderCheckboxGroup(group, selections, handleCheckboxChange, handleNarrativeChange))}
        </div>
      </div>
    </div>
  );
};

export default SessionForm;
