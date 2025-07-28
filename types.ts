
export interface Partner {
  id: string;
  name: string;
}

export interface Program {
  id: string;
  name: string;
  partnerId: string;
}

export enum HousingStatus {
  STABLE = 'Stable Housing',
  TRANSITIONAL = 'Transitional',
  HOMELESS = 'Homeless',
  OTHER = 'Other',
}

export enum StageOfChange {
  PRECONTEMPLATION = 'Precontemplation',
  CONTEMPLATION = 'Contemplation',
  PREPARATION = 'Preparation',
  ACTION = 'Action',
  MAINTENANCE = 'Maintenance',
  RELAPSE = 'Relapse/Recurrence',
}

export type MBTIType =
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ'
  | 'Unknown' | '';

export interface ClientProfile {
  // Core Demographics
  dateOfBirth: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  housingStatus: HousingStatus;
  intakeDate: string;
  referralSource: string;
  emergencyContact: string;
  
  // Clinical & Psychosocial Portrait
  presentingProblem: string;
  mbti: MBTIType;
  introvertExtrovertScale: number; // 1-10
  stageOfChange: StageOfChange;
  primaryMotivators: string;
  readinessRuler: number; // 1-10
  strengths: string[];
  skillsAndHobbies: string[];
  supportSystem: string[];
  barriers: string[];
  caseManagementNeeds: string[];
  historyOfTrauma: boolean;
  historyOfSubstanceUse: boolean;
  significantMedicalConditions: boolean;
  notesOnHistory: string; 
}

export interface Client {
  id: string;
  name: string;
  programId: string;
  profile: Partial<ClientProfile>;
}


export enum NoteType {
  GROUP = 'Group Therapy',
  INDIVIDUAL = 'Individual Therapy',
  CASE_MANAGEMENT = 'Case Management',
  PEER_SUPPORT = 'Peer Support',
}

export interface Document {
  id: string;
  title: string;
  content: string;
}

export interface CheckboxOption {
  label: string;
  description?: string;
}

export interface CheckboxGroup {
  id: string;
  title: string;
  description?: string;
  options: CheckboxOption[];
  hasNarrative: boolean;
  narrativeLabel?: string;
}

export interface Selections {
  checkboxes: Record<string, string[]>;
  narratives: Record<string, string>;
}

export interface GeneratedNote {
    clientId: string;
    clientName: string;
    note: string;
}

// --- Assessment Types ---

export enum AssessmentType {
  INITIAL = 'Initial Assessment',
  COMPREHENSIVE = 'Comprehensive Assessment',
}

export interface AssessmentData {
  [sectionId: string]: {
    [fieldId: string]: string;
  };
}

export interface GeneratedAssessment {
  clientName: string;
  assessmentText: string;
}