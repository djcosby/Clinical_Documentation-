
import { GoogleGenAI, Type } from "@google/genai";
import { Client, NoteType, Selections, GeneratedNote, Document, Program, Partner, AssessmentType, AssessmentData, GeneratedAssessment, ClientInfoForAssessment } from "../types";
import { INITIAL_ASSESSMENT_SECTIONS, COMPREHENSIVE_ASSESSMENT_SECTIONS, DAP_TEMPLATE } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const NOTE_GENERATION_SYSTEM_PROMPT = `You are an expert clinical documentation assistant for behavioral health providers in Ohio. Your purpose is to craft defensible and effective progress notes that are simultaneously a faithful narrative of the clinical encounter and a bulletproof shield against the scrutiny of auditors from Medicaid, CARF, and OMHAS. Your documentation is a fundamental component of the clinical service itself.

**The Guiding Philosophy: Documentation as Stewardship**
Your notes are a testament to the work providers do in their community. Each note is a brick building the fortress that protects the agency, validates the work, and chronicles the client's path toward their goals.

---
**Core Traits of a Quality Note (Non-Negotiable Rules)**

**1. The Golden Thread is Visible and Unbroken:**
You MUST ensure a clear, logical connection from the assessment/diagnosis, through the treatment plan, into every progress note. The intervention described in the note must be a logical action taken to address a specific ISP goal/objective mentioned in the client's profile or session data.

**2. Medical Necessity is Explicitly Stated:**
Every note MUST justify why the service was necessary for this client on this day. The note must document symptoms, behaviors, or functional impairments that require intervention. Vague statements are unacceptable. The note must justify the time and expense.

**3. The Client's Voice and Participation are Evident:**
The note must reflect a collaborative process.
- Use direct quotes from the client's report when powerful and relevant.
- Describe the client's reaction to interventions (e.g., "Client appeared relieved...", "Client responded by...").
- Document the client's contribution to the plan ("Client agreed to...").

**4. Language is Objective, Behavioral, and Free of Jargon:**
The note must paint a clear picture for an outside reader.
- **Describe, don't label:** Instead of "Client was angry," write "Client spoke in a raised voice, leaned forward, and stated, 'This is unfair!'"
- **Avoid slang and acronyms:** Write out terms like "Cognitive Behavioral Therapy (CBT)" initially.
- **Separate fact from interpretation:** Use phrases like "Client reported...", "Clinician observed...", "This presentation is consistent with...".

**5. Be Concise Yet Complete:**
The note must be long enough to tell the story and justify the service, but not a word longer. Avoid "note cloning" (copying/pasting from previous notes). Each note must be unique to the specific date of service.

---
**Structure and Language**

**Verbiage:** Use specific, active, and justifiable language.
- Instead of "Discussed coping skills," use "Clinician educated client on 3 positive self-talk statements..."
- Instead of "Provided support," use "Clinician validated the client's stated feelings of..."

**Format:** You MUST use the DAP (Data, Assessment, Plan) format. Adhere strictly to this structure.

---
**Your Task**
Generate a separate and complete DAP note for EACH client provided. Seamlessly integrate the information from the "Session Information," "Clinician's Observations," and the detailed "Client Information" into the narrative of the DAP note. DO NOT just list the checkbox items or profile data. Use them to inform the descriptive language of the note, creating a rich, cohesive story of the session. If Background Knowledge Documents are provided, use them as a primary reference.

The final output MUST be a valid JSON array, where each object represents a client's note.
`;


function formatClientProfileForPrompt(client: Client, programs: Program[], partners: Partner[]): string {
  const { name, id, profile, programId } = client;
  if (!profile) return `### Client: ${name} (ID: ${id})\n- Profile data is not available.`;

  const program = programs.find(p => p.id === programId);
  const partner = program ? partners.find(p => p.id === program.partnerId) : undefined;
  
  const sections: Record<string, string[]> = {
    "Core Information": [
      partner && `**Partner:** ${partner.name}`,
      program && `**Program:** ${program.name}`,
      profile.intakeDate && `**Intake Date:** ${profile.intakeDate}`,
      profile.presentingProblem && `**Presenting Problem:** ${profile.presentingProblem}`,
    ],
    "Clinical Framework": [
      profile.stageOfChange && `**Stage of Change:** ${profile.stageOfChange}`,
      profile.primaryMotivators && `**Primary Motivators:** ${profile.primaryMotivators}`,
      profile.readinessRuler && `**Readiness Ruler:** ${profile.readinessRuler}/10`,
      profile.mbti && `**MBTI Type:** ${profile.mbti}`,
    ],
    "Strengths & Supports": [
      profile.strengths?.length && `**Strengths:** ${profile.strengths.join(', ')}`,
      profile.skillsAndHobbies?.length && `**Skills/Hobbies:** ${profile.skillsAndHobbies.join(', ')}`,
      profile.supportSystem?.length && `**Support System:** ${profile.supportSystem.join(', ')}`,
    ],
    "Barriers & Needs": [
      profile.barriers?.length && `**Barriers:** ${profile.barriers.join(', ')}`,
      profile.caseManagementNeeds?.length && `**Case Management Needs:** ${profile.caseManagementNeeds.join(', ')}`,
    ],
    "History": [
      (profile.historyOfTrauma || profile.historyOfSubstanceUse || profile.significantMedicalConditions) && `**Flags:** ${[
          profile.historyOfTrauma && "Trauma",
          profile.historyOfSubstanceUse && "Substance Use",
          profile.significantMedicalConditions && "Medical Conditions"
      ].filter(Boolean).join(', ')}`,
      profile.notesOnHistory && `**Notes on History:** ${profile.notesOnHistory}`,
    ],
  };

  let formattedString = `### Client Information for: ${name} (ID: ${id})\n`;
  for (const sectionTitle in sections) {
    const lines = sections[sectionTitle].filter(Boolean); // Filter out empty lines
    if (lines.length > 0) {
      formattedString += lines.map(line => `- ${line}`).join('\n') + '\n';
    }
  }

  return formattedString;
}


function buildNotePrompt(
  noteType: NoteType,
  clients: Client[],
  programs: Program[],
  partners: Partner[],
  documents: Document[],
  sessionIntervention: string,
  selections: Selections
): string {
  const clientInfo = clients
    .map(c => formatClientProfileForPrompt(c, programs, partners))
    .join("\n\n");

  const selectionDetails = Object.entries(selections.checkboxes)
    .map(([group, checked]) => {
      if (checked.length === 0 && !selections.narratives[group]) return '';
      const narrativeText = selections.narratives[group] ? `\n  - Narrative on ${group}: ${selections.narratives[group]}` : '';
      return `- ${group}: ${checked.join(", ")}${narrativeText}`;
    })
    .filter(Boolean)
    .join("\n");
    
  const documentContext = documents.length > 0 ? `
**Background Knowledge Documents:**
You have access to the following documents. Refer to this information when relevant.
${documents.map(d => `--- Document: ${d.title} ---\n${d.content}`).join('\n\n')}
--- End of Documents ---
` : '';

  // Construct the user-facing part of the prompt
  return `
${documentContext}

**Note Type:** ${noteType}

**Core Session Intervention/Topic:**
${sessionIntervention}

**Clinician's Observations (Checkboxes and Narratives):**
${selectionDetails || 'No specific checkbox observations provided.'}

**Client(s) for this Session:**
${clientInfo}

**DAP Note Template to Follow:**
${DAP_TEMPLATE}

Generate the DAP note(s) now based on all the information provided.
`;
}


function formatAssessmentDataForPrompt(
    data: AssessmentData, 
    assessmentType: AssessmentType
): string {
    const sections = assessmentType === AssessmentType.INITIAL ? INITIAL_ASSESSMENT_SECTIONS : COMPREHENSIVE_ASSESSMENT_SECTIONS;
    let output = '';
    for (const section of sections) {
        const sectionData = data[section.id];
        if (!sectionData || Object.values(sectionData).every(v => !v)) continue;

        output += `\n## ${section.title}\n`;
        let hasDataInSection = false;
        for (const field of section.fields) {
            const value = sectionData[field.id];
            if (value && value.trim()) {
                output += `- **${field.label}**\n  - ${value.trim()}\n`;
                hasDataInSection = true;
            }
        }
    }
    return output;
}

function buildAssessmentPrompt(
  clientInfo: ClientInfoForAssessment,
  assessmentType: AssessmentType,
  assessmentData: AssessmentData
): string {
  const clientDetails = `
- **Client Name:** ${clientInfo.name || 'Not Provided'}
- **Date of Birth:** ${clientInfo.dateOfBirth || 'Not Provided'}
- **Date of Assessment:** ${clientInfo.dateOfAssessment || 'Not Provided'}
- **Clinician Name:** ${clientInfo.clinicianName || 'Not Provided'}
- **Program:** ${clientInfo.programName || 'Not Provided'}
  `;
  const formattedData = formatAssessmentDataForPrompt(assessmentData, assessmentType);

  return `
You are an expert clinical writer specializing in comprehensive psychological and substance use assessments. Your task is to synthesize the provided clinician's notes into a formal, narrative-style assessment document. The document must be well-organized, professional, and use appropriate clinical language.

**Client & Assessment Information:**
${clientDetails}

**Assessment Type to Generate:** ${assessmentType}

**Clinician's Notes / Data Points:**
${formattedData}

**Mission Critical Instructions:**
1.  Generate a complete and cohesive **${assessmentType}**.
2.  Use the provided **Clinician's Notes** to construct the assessment. Transform the notes from bullet points or brief statements into full, well-written paragraphs under the appropriate headings.
3.  Structure the output logically, following the standard sections of a clinical assessment (e.g., Presenting Problem, Risk Assessment, Substance Use History, etc.).
4.  Ensure the tone is objective, formal, and clinical.
5.  Do not just repeat the notes. You must integrate them into a flowing, professional narrative.
6.  If a section in the clinician's notes is empty, you may state "Information not provided" or omit the section if appropriate.
7.  The final output must be a single block of formatted text. **DO NOT** use JSON.

Generate the complete assessment document now.
`;
}


export const generateNotes = async (
  noteType: NoteType,
  clients: Client[],
  programs: Program[],
  partners: Partner[],
  documents: Document[],
  sessionIntervention: string,
  selections: Selections
): Promise<GeneratedNote[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is missing. Please set the API_KEY environment variable.");
  }
    
  if (clients.length === 0) {
      return [];
  }

  const userPrompt = buildNotePrompt(noteType, clients, programs, partners, documents, sessionIntervention, selections);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: NOTE_GENERATION_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              clientId: {
                type: Type.STRING,
                description: 'The unique ID of the client.',
              },
              clientName: {
                  type: Type.STRING,
                  description: "The client's full name."
              },
              note: {
                type: Type.STRING,
                description: 'The full, formatted clinical note for the client, strictly following the DAP (Data, Assessment, Plan) format.',
              },
            },
            required: ["clientId", "clientName", "note"],
          },
        },
      },
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText) as GeneratedNote[];
    
    const clientIds = new Set(clients.map(c => c.id));
    return result.filter(note => clientIds.has(note.clientId));

  } catch (error) {
    console.error("Error generating notes:", error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to generate notes from AI: ${error.message}`));
    }
    return Promise.reject(new Error("An unknown error occurred while generating notes."));
  }
};


export const generateAssessment = async (
  clientInfo: ClientInfoForAssessment,
  assessmentType: AssessmentType,
  assessmentData: AssessmentData,
): Promise<GeneratedAssessment> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is missing. Please set the API_KEY environment variable.");
  }
    
  const prompt = buildAssessmentPrompt(clientInfo, assessmentType, assessmentData);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const assessmentText = response.text;
    
    return {
        clientName: clientInfo.name,
        assessmentText: assessmentText,
    };

  } catch (error) {
    console.error("Error generating assessment:", error);
     if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to generate assessment from AI: ${error.message}`));
    }
    return Promise.reject(new Error("An unknown error occurred while generating the assessment."));
  }
};