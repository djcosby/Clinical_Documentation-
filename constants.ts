
import { Client, NoteType, CheckboxGroup, Program, StageOfChange, MBTIType, HousingStatus, Partner, AssessmentType } from './types';

export const NOTE_TYPES: NoteType[] = [
  NoteType.GROUP,
  NoteType.INDIVIDUAL,
  NoteType.CASE_MANAGEMENT,
  NoteType.PEER_SUPPORT,
];

export const ASSESSMENT_TYPES: AssessmentType[] = [
    AssessmentType.INITIAL,
    AssessmentType.COMPREHENSIVE,
];


const PARTNER_NAMES = ["Miracle House", "Stairway to Recovery", "DJ's Peer Support", "Reach One Recovery Services", "Journey to Resilience", "Monte's Place", "Reach One Clinical Services"];
export const PROGRAM_NAMES = ['Outpatient SUD', 'IOP SUD', 'Peer Support Only'];

export const MOCK_PARTNERS: Partner[] = PARTNER_NAMES.map((name, index) => ({
  id: `partner-${index + 1}`,
  name: name,
}));

export const MOCK_PROGRAMS: Program[] = MOCK_PARTNERS.flatMap((partner, pIndex) => 
  PROGRAM_NAMES.map((progName, progIndex) => ({
    id: `prog-${pIndex + 1}-${progIndex + 1}`,
    name: progName,
    partnerId: partner.id,
  }))
);


export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    programId: 'prog-1-1', // Miracle House - Outpatient SUD
    profile: {
      intakeDate: '2024-05-10',
      expectedDischargeDate: '2024-11-10',
      stageOfChange: StageOfChange.CONTEMPLATION,
      presentingProblem: 'Major Depressive Disorder, recurrent, moderate.',
      strengths: ['Strong family support', 'History of medication compliance'],
      barriers: ['Social isolation', 'Lack of motivation for self-care'],
      historyOfSubstanceUse: true,
      notesOnHistory: 'Occasional substance use (cannabis) as a coping mechanism.'
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    programId: 'prog-1-2', // Miracle House - IOP SUD
    profile: {
      intakeDate: '2024-03-01',
      expectedDischargeDate: '2024-09-01',
      stageOfChange: StageOfChange.ACTION,
      presentingProblem: 'Generalized Anxiety Disorder.',
      strengths: ['Highly motivated for change', 'Recently secured part-time employment'],
      barriers: ['Perfectionism', 'Difficulty with emotional regulation', 'High levels of stress related to work performance'],
      readinessRuler: 8,
    },
  },
  {
    id: '3',
    name: 'Alex Johnson',
    programId: 'prog-2-1', // Stairway to Recovery - Outpatient SUD
    profile: {
      intakeDate: '2023-11-15',
      expectedDischargeDate: '2024-08-15',
      stageOfChange: StageOfChange.MAINTENANCE,
      presentingProblem: 'Opioid Use Disorder, in sustained remission.',
      strengths: ['Actively engaged in 12-step community', 'Strong relapse prevention skills'],
      barriers: ['Chronic pain management', 'Rebuilding trust with family members', 'Financial stressors'],
      supportSystem: ['12-step community'],
    },
  },
  {
    id: '4',
    name: 'Emily White',
    programId: 'prog-7-1', // Reach One Clinical Services - Outpatient SUD
    profile: {
      intakeDate: '2024-06-20',
      expectedDischargeDate: '2024-12-20',
      stageOfChange: StageOfChange.PRECONTEMPLATION,
      presentingProblem: 'Bipolar I Disorder, current episode depressed. Mandated to treatment.',
      strengths: ['Artistic and creative', 'Has a supportive partner'],
      barriers: ['Medication adherence issues', 'History of impulsive behavior', 'Denies severity of symptoms'],
      supportSystem: ['Partner'],
    },
  },
  {
    id: '5',
    name: 'Michael Brown',
    programId: 'prog-3-3', // DJ's Peer Support - Peer Support Only
    profile: {
      intakeDate: '2024-07-01',
      expectedDischargeDate: '2025-01-01',
      stageOfChange: StageOfChange.PREPARATION,
      presentingProblem: 'Alcohol Use Disorder, severe.',
      strengths: ['Intelligent and self-aware'],
      primaryMotivators: 'Expressed a desire to quit drinking for his children.',
      barriers: ['Severe withdrawal risks', 'Lives in an environment with many triggers', 'History of failed quit attempts'],
    },
  },
];

export const STAGES_OF_CHANGE: StageOfChange[] = Object.values(StageOfChange);
export const MBTI_TYPES: MBTIType[] = ['','ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ', 'Unknown'];
export const HOUSING_STATUSES: HousingStatus[] = Object.values(HousingStatus);
export const CASE_MANAGEMENT_NEEDS_OPTIONS: string[] = ['Housing Assistance', 'Food Security', 'Employment Services', 'Legal Aid', 'Benefits Application (SNAP, Medicaid)', 'Educational Support'];


export const DAP_CHECKBOXES: CheckboxGroup[] = [
    {
        id: 'participation',
        title: '1. Participation',
        description: "This section captures the client's level of engagement in the session.",
        options: [
            { label: 'Active and Engaged' },
            { label: 'Cooperative and Responsive' },
            { label: 'Appropriately Participatory' },
            { label: 'Somewhat Passive/Reserved' },
            { label: 'Guarded or Resistant' },
            { label: 'Distracted or Inattentive' },
            { label: 'Hesitant or Anxious' },
        ],
        hasNarrative: true,
        narrativeLabel: "Narrative Details on Participation",
    },
    {
        id: 'responseToIntervention',
        title: '2. Response to Intervention(s)',
        description: "This assesses how the client reacted to the clinical work done in the session.",
        options: [
            { label: 'Receptive and Insightful' },
            { label: 'Appeared to Benefit' },
            { label: 'Able to Apply Concepts' },
            { label: 'Demonstrated Understanding' },
            { label: 'Processed Material Effectively' },
            { label: 'Struggled to Grasp Concepts' },
            { label: 'Responded with Skepticism' },
            { label: 'Became Emotionally Activated' },
        ],
        hasNarrative: true,
        narrativeLabel: "Narrative on Response",
    },
    {
        id: 'progress',
        title: '3. Progress',
        description: 'This directly addresses movement toward or away from ISP goals.',
        options: [
            { label: 'Made Significant Progress' },
            { label: 'Made Moderate Progress' },
            { label: 'Made Minimal/Limited Progress' },
            { label: 'Maintained Baseline' },
            { label: 'Experienced a Setback / Some Regression' },
            { label: 'Encountered New Barriers' },
            { label: 'Successfully Utilized Skill(s)' },
        ],
        hasNarrative: true,
        narrativeLabel: "Narrative on Progress (MUST link to specific ISP Goal #)",
    },
    {
        id: 'riskAssessment',
        title: '4. Suicidality / Risk Assessment',
        description: 'A mandatory part of the Assessment.',
        options: [
            { label: 'Suicidal ideas or intentions are not in evidence and not expressed. No suicidal plans are present. Client denies SI/HI.' },
            { label: 'Client reported passive suicidal ideation without active intent or plan.' },
            { label: 'Client reported active suicidal ideation.' },
            { label: 'Client reported homicidal ideation.' },
            { label: 'Risk factors were assessed' },
            { label: 'Protective factors were reviewed' },
        ],
        hasNarrative: true,
        narrativeLabel: "Narrative on Risk / Safety Plan Details",
    },
    {
        id: 'plan',
        title: '5. Plan',
        description: 'This outlines what happens next.',
        options: [
            { label: 'Continue with Current Treatment Plan' },
            { label: 'Modify Treatment Plan' },
            { label: 'Focus on Skill-Building in Next Session' },
            { label: 'Focus on Insight/Processing in Next Session' },
            { label: 'Provide Psychoeducation on...' },
            { label: 'Coordinate Care with...' },
            { label: 'Provide Client with Resources for...' },
            { label: 'Next session is scheduled for...' },
            { label: 'Client to call to schedule next session.' },
        ],
        hasNarrative: true,
        narrativeLabel: "Narrative for Plan Specifics (Detail homework, coordination, etc.)",
    },
];

export const INDIVIDUAL_THERAPY_MODALITY_CHECKBOXES: CheckboxGroup[] = [
    {
        id: 'therapyType',
        title: 'Therapy Type(s) Utilized',
        options: [
            { label: 'Motivational Interviewing (MI)' },
            { label: 'Cognitive Behavioral Therapy (CBT)' },
            { label: 'Dialectical Behavior Therapy (DBT)' },
            { label: 'Choice Theory' },
            { label: 'Polyvagal Theory' },
        ],
        hasNarrative: true,
        narrativeLabel: 'Other/Specifics',
    }
];

export const PEER_SUPPORT_CHECKBOXES: CheckboxGroup[] = [
    {
        id: 'peerStrategies',
        title: 'Peer Support Strategies Implemented',
        options: [
            { label: 'Active Listening' },
            { label: 'Validation and Empathy' },
            { label: 'Encouragement and Celebrating Successes' },
            { label: 'Sharing of Relevant Lived Experience' },
            { label: 'Skill-Building Collaboration' },
            { label: 'Goal Setting Support' },
            { label: 'Resource Connection/Navigation' },
            { label: 'Empowerment/Advocacy Support' },
        ],
        hasNarrative: true,
        narrativeLabel: 'Purpose of sharing lived experience, if applicable',
    },
];

export const DAP_TEMPLATE = `
**D - Data:**
(Client's self-report, clinician's observations, and the specific intervention performed. This section is for factual information.)

**A - Assessment:**
(Clinician's professional interpretation of the data, client's response to the intervention, progress towards goals, and risk assessment.)

**P - Plan:**
(Next steps for the client and clinician, and the date/time of the next scheduled appointment.)
`;


export const INITIAL_ASSESSMENT_SECTIONS = [
    {
        id: 'presentingProblem',
        title: 'I. Presenting Problem',
        fields: [
            { id: 'description', label: "Description (in client's own words)", script: "What brings you in to see us today? Can you describe the problem you're experiencing in your own words?" },
            { id: 'immediateConcerns', label: "Immediate concerns/symptoms", script: "What are your immediate concerns or symptoms related to this problem?" }
        ]
    },
    {
        id: 'riskOfHarm',
        title: 'II. Risk of Harm',
        fields: [
            { id: 'suicidalIdeation', label: "Suicidal ideation (thoughts, plans, intent, access to means)", script: "Have you been having any thoughts of harming yourself? (If yes, explore further: \"What kind of thoughts?\", \"Have you had any specific plans?\", \"Do you have the means to carry out these plans?\", \"What is your intent?\")" },
            { id: 'homicidalIdeation', label: "Homicidal ideation (thoughts, plans, intent, access to means)", script: "Have you been having any thoughts of harming others? (If yes, explore further: \"What kind of thoughts?\", \"Have you had any specific plans?\", \"Do you have the means to carry out these plans?\", \"What is your intent?\")" },
            { id: 'selfHarm', label: "Self-harm behaviors", script: "Have you engaged in any self-harm behaviors recently, such as cutting, burning, or other forms of self-injury? (If yes, explore frequency, severity, and methods)." },
            { id: 'otherRisks', label: "Other risks", script: "Are there any other risks to your safety or the safety of others that we should be aware of? (Explore domestic violence, unsafe living situations, etc.)" }
        ]
    },
    {
        id: 'substanceUse',
        title: 'III. Substance Use',
        fields: [
            { id: 'type', label: "Type of substance", script: "What substances have you been using?" },
            { id: 'frequency', label: "Frequency of use", script: "For each substance, how often do you use it?" },
            { id: 'quantity', label: "Quantity used", script: "For each substance, how much do you typically use at one time?" },
            { id: 'lastUse', label: "Date of last use", script: "When was the last time you used each substance?" }
        ]
    },
    {
        id: 'treatmentHistory',
        title: 'IV. Treatment History',
        fields: [
            { id: 'type', label: "Type of treatment", script: "What type of treatment did you receive? (Inpatient, outpatient, detox, therapy, etc.)" },
            { id: 'provider', label: "Provider", script: "Who was your treatment provider?" },
            { id: 'dates', label: "Dates of treatment", script: "What were the dates of your treatment?" }
        ]
    },
    {
        id: 'medicalHistory',
        title: 'V. Medical History and Exam',
        fields: [
            { id: 'conditions', label: "Current medical conditions", script: "Do you have any current medical conditions?" },
            { id: 'medications', label: "Current medications", script: "Are you currently taking any medications, including prescription, over-the-counter, and herbal supplements?" },
            { id: 'allergies', label: "Allergies", script: "Do you have any allergies to medications, food, or other substances?" },
            { id: 'recentExams', label: "Recent medical exams/hospitalizations", script: "Have you had any recent medical exams or hospitalizations?" },
            { id: 'mse', label: "Mental Status Exam (brief observations)", script: "(Throughout the assessment, observe and document the following): Appearance, Behavior, Mood, Speech, Thought process, Thought content, Cognition, Insight, Judgment." }
        ]
    }
];

export const COMPREHENSIVE_ASSESSMENT_SECTIONS = [
    {
        id: 'presentingProblem',
        title: 'II-A. Presenting Problem (Expanded)',
        fields: [
            { id: 'contributingFactors', label: "Contributing factors", script: "Let's explore some of the things that might be contributing to [the presenting problem]. Can you tell me more about [specific biological, psychological, social, developmental, or spiritual factors relevant to the client]?" },
            { id: 'symptomsAndSeverity', label: "Specific symptoms and severity", script: "Let's go through each of the symptoms you mentioned. How often have you been experiencing [symptom] lately? How intense has it been? How does it affect your day-to-day life?" },
            { id: 'impactOnLife', label: "Impact on daily life", script: "How is [the presenting problem] impacting your work/school, your relationships, your ability to take care of yourself, and your ability to enjoy things?" },
            { id: 'clientGoals', label: "Client's goals for treatment", script: "We talked about your goals for treatment last time. Are those goals still the same, or have they changed?" },
            { id: 'associatedRisks', label: "Associated risks", script: "Let's revisit your risk assessment. Have you had any thoughts of harming yourself or others since we last met?" }
        ]
    },
    {
        id: 'riskOfHarm',
        title: 'II-B. Risk of Harm to Self and Others (Expanded)',
        fields: [
            { id: 'pastHistory', label: "Past history of suicidal/homicidal behavior", script: "We talked briefly about [past suicide attempts/violent incidents/self-harm] last time. Can you tell me more about each of those times?" },
            { id: 'currentIdeation', label: "Current ideation, plans, intent, access to means", script: "Have you had any thoughts of harming yourself or others recently? (If yes, follow up with detailed risk assessment questions)." },
            { id: 'protectiveFactors', label: "Protective factors", script: "What are some things that help you stay safe when you're feeling overwhelmed or having thoughts of harming yourself/others?" },
            { id: 'contextAndTriggers', label: "Context and triggers for risky behaviors", script: "Let's try to identify specific situations, feelings, or thoughts that tend to trigger these thoughts or behaviors." }
        ]
    },
    {
        id: 'substanceUse',
        title: 'II-C. Use of Alcohol or Drugs (Expanded)',
        fields: [
            { id: 'ageOfOnset', label: "Age of onset", script: "For each substance you've used, how old were you when you first tried it, started using regularly, and felt it became a problem?" },
            { id: 'patternsOfUse', label: "Patterns of use (frequency, quantity, duration)", script: "Can you describe how your use of [substance] has changed over time? How much? How often? How do you use it?" },
            { id: 'periodsOfAbstinence', label: "Periods of abstinence", script: "Have there been times when you've stopped using completely? How long did those periods last? What led you to start again?" },
            { id: 'consequences', label: "Consequences of use", script: "How has your use affected your physical health, mental health, relationships, work/school, finances, or led to legal problems?" },
            { id: 'withdrawalHistory', label: "History of withdrawal symptoms", script: "Have you ever experienced any withdrawal symptoms when you've tried to cut down or stop using?" },
            { id: 'withdrawalRisks', label: "Potential withdrawal risks", script: "(Clinician's assessment of potential withdrawal risks)" }
        ]
    },
     {
        id: 'treatmentHistory',
        title: 'II-D. Treatment History for Mental Illness and/or Substance Use (Expanded)',
        fields: [
            { id: 'typesReceived', label: "Types of treatment received", script: "Let's make a complete list of all the mental health and substance use treatment you've received (therapy, medication, hospitalizations, etc.)." },
            { id: 'providers', label: "Providers", script: "Can you tell me the names and contact information for all of your past and current providers?" },
            { id: 'helpfulUnhelpful', label: "Helpful and unhelpful aspects of past treatment", script: "Thinking back on your past treatment experiences, what did you find most helpful? What was unhelpful?" },
            { id: 'barriers', label: "Barriers to successful treatment", script: "What, if anything, has made it difficult for you to get the help you need or to stick with treatment in the past?" }
        ]
    },
    {
        id: 'medicalHistory',
        title: 'II-E. Medical History (Expanded)',
        fields: [
            { id: 'conditions', label: "Current and past medical conditions", script: "Let's go over your medical history in more detail. Can you tell me about any current or past medical conditions you've had?" },
            { id: 'medications', label: "Medications", script: "Can you give me a complete list of all the medications you're currently taking, including over-the-counter and herbal remedies?" },
            { id: 'allergies', label: "Allergies", script: "Do you have any allergies to medications, foods, or anything in the environment?" },
            { id: 'surgeries', label: "Surgeries", script: "Have you ever had any surgeries? If so, can you tell me when they were and what they were for?" },
            { id: 'hospitalizations', label: "Hospitalizations", script: "Have you ever been hospitalized for any reason, either medical or psychiatric?" },
            { id: 'pregnancy', label: "History of pregnancy", script: "(If applicable) Have you ever been pregnant? What were the outcomes?" },
            { id: 'familyHistory', label: "Relevant family medical history", script: "Does anyone in your family have a history of medical conditions that might be relevant?" }
        ]
    },
    {
        id: 'physicalExam',
        title: 'II-F. Physical Examination (Expanded)',
        fields: [
            { id: 'mse', label: "Mental Status Exam (detailed observations)", script: "Detailed observations of: Appearance, Behavior, Speech, Mood, Affect, Thought process, Thought content, Perception, Cognition, Insight, Judgment." },
            { id: 'referral', label: "Referral for physical examination (if needed)", script: "If indicated, refer the client to a physician for a physical examination and any necessary laboratory tests." }
        ]
    },
    {
        id: 'homeAtmosphere',
        title: 'II-G. Home Atmosphere',
        fields: [
            { id: 'livingSituation', label: "Living situation", script: "Can you describe your current living situation? What type of housing do you live in?" },
            { id: 'relationships', label: "Quality of relationships with household members", script: "Who lives with you? How would you describe your relationships with them?" },
            { id: 'safety', label: "Safety and stability of the environment", script: "Do you feel safe in your home? Are there any weapons, substances, or violence present?" },
            { id: 'stressors', label: "Stressors in the home environment", script: "What are some of the biggest stressors in your home environment (financial, conflicts, etc.)?" }
        ]
    },
    {
        id: 'educationHistory',
        title: 'II-H. Educational History',
        fields: [
            { id: 'level', label: "Highest level of education completed", script: "What is the highest level of school you have finished?" },
            { id: 'disabilities', label: "Learning disabilities", script: "Have you ever been diagnosed with a learning disability or had any difficulties with learning in school?" },
            { id: 'performance', label: "Academic performance", script: "How would you describe your grades, attendance, and behavior in school?" },
            { id: 'experiences', label: "Significant experiences in school", script: "What were some of your positive and negative experiences in school? Relationships with teachers/peers? Bullying?" }
        ]
    },
    {
        id: 'employmentHistory',
        title: 'II-I. Employment History',
        fields: [
            { id: 'status', label: "Current employment status", script: "Are you currently working, a student, retired, or something else?" },
            { id: 'jobTypes', label: "Types of jobs held", script: "Can you tell me about the different jobs you've had?" },
            { id: 'duration', label: "Duration of employment", script: "How long did you work at each job?" },
            { id: 'reasonsForLeaving', label: "Reasons for leaving jobs", script: "Why did you leave each of those jobs?" },
            { id: 'stressors', label: "Work-related stressors", script: "What are some of the biggest stressors you've experienced in your work?" }
        ]
    },
    {
        id: 'militaryHistory',
        title: 'II-J. Military History',
        fields: [
            { id: 'branch', label: "Branch of service", script: "What branch of the military were you in?" },
            { id: 'dates', label: "Dates of service", script: "When did you serve?" },
            { id: 'combat', label: "Combat experience", script: "Did you see combat?" },
            { id: 'trauma', label: "Trauma experienced during service", script: "Did you experience any traumatic events during your service?" },
            { id: 'discharge', label: "Discharge status", script: "What was your discharge status?" }
        ]
    },
    {
        id: 'legalInvolvement',
        title: 'II-K. Legal Involvement',
        fields: [
            { id: 'arrests', label: "Arrests", script: "Have you ever been arrested? If so, can you tell me about the circumstances?" },
            { id: 'convictions', label: "Convictions", script: "Have you ever been convicted of a crime?" },
            { id: 'incarcerations', label: "Incarcerations", script: "Have you ever been incarcerated? If so, when and for how long?" },
            { id: 'probation', label: "Probation/parole", script: "Are you currently on probation or parole? What are the conditions?" }
        ]
    },
    {
        id: 'financial',
        title: 'II-L. Financial and Social Services',
        fields: [
            { id: 'income', label: "Income", script: "What are your sources and amount of income?" },
            { id: 'expenses', label: "Expenses", script: "What are your major monthly expenses?" },
            { id: 'debts', label: "Debts", script: "Do you have any debts (credit card, student loans, medical bills)?" },
            { id: 'resources', label: "Access to resources", script: "Do you feel like you have enough money to meet your basic needs (food, housing, healthcare)?" },
            { id: 'socialServices', label: "Involvement with social services", script: "Are you currently receiving any assistance from social service agencies (welfare, food stamps, etc.)?" }
        ]
    },
    {
        id: 'familyHistoryMH',
        title: 'II-M. Family History of Mental Illness/Substance Use',
        fields: [
            { id: 'mhSuInFamily', label: "Mental illness/substance use in family members", script: "Does anyone in your family have a history of mental health or substance use problems?" },
            { id: 'diagnoses', label: "Specific diagnoses", script: "Do you know the specific diagnoses of any family members?" },
            { id: 'dynamics', label: "Family Dynamics", script: "How would you describe the way your family communicates and resolves conflicts?" }
        ]
    },
    {
        id: 'traumaHistory',
        title: 'II-N. History of Trauma',
        fields: [
            { id: 'types', label: "Types of trauma experienced", script: "(Use a sensitive, trauma-informed approach). Many people have experienced difficult events like abuse, neglect, witnessing violence, accidents, etc. Have you ever experienced anything like that?" },
            { id: 'impact', label: "Impact of trauma on current functioning", script: "How do you think these experiences have affected you (e.g., flashbacks, nightmares, avoidance, relationships)?" }
        ]
    },
    {
        id: 'assets',
        title: "II-O. Client's Assets, Vulnerabilities, and Supports",
        fields: [
            { id: 'strengths', label: "Strengths", script: "What are some things you're proud of about yourself? What are you good at?" },
            { id: 'resources', label: "Resources", script: "Do you have stable housing, transportation, education, employment?" },
            { id: 'copingSkills', label: "Coping skills", script: "What are some things you do to cope with stress or difficult emotions (both healthy and unhealthy)?" },
            { id: 'socialSupports', label: "Social supports", script: "Who are the important people in your life? Who can you rely on for support?" },
            { id: 'vulnerabilities', label: "Vulnerabilities/challenges", script: "What are some of the current biggest challenges you face?" }
        ]
    },
    {
        id: 'summary',
        title: 'II-P. Clinical Impression and Summary',
        fields: [
            { id: 'keyFindings', label: "Key findings", script: "(Clinician's summary of the most important findings from the assessment)." },
            { id: 'dxConsiderations', label: "Diagnostic considerations", script: "(List applicable diagnoses with justification, rule-outs, and differential diagnosis)." },
            { id: 'treatmentNeeds', label: "Potential treatment needs", script: "(Recommended level of care, specific interventions, and referrals)." },
            { id: 'prognosis', label: "Prognosis", script: "(Clinician's assessment of prognosis)." }
        ]
    }
];