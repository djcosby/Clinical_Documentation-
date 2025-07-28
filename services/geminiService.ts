
import { GoogleGenAI, Type } from "@google/genai";
import { Client, NoteType, Selections, GeneratedNote, Document, Program, Partner, AssessmentType, AssessmentData, GeneratedAssessment } from "../types";
import { NOTE_TEMPLATES, INITIAL_ASSESSMENT_SECTIONS, COMPREHENSIVE_ASSESSMENT_SECTIONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

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


function buildPrompt(
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
    .join("\n");

  const selectionDetails = Object.entries(selections.checkboxes)
    .map(([group, checked]) => {
      if (checked.length === 0 && !selections.narratives[group]) return '';
      const narrativeText = selections.narratives[group] ? `\n  - **Narrative:** ${selections.narratives[group]}` : '';
      return `- **${group}:** ${checked.join(", ")}${narrativeText}`;
    })
    .join("\n");
    
  const documentContext = documents.length > 0 ? `
**Background Knowledge Documents:**
You have access to the following documents to improve the quality and accuracy of your output. Refer to this information when relevant, especially for following guidelines from Wiley Treatment Planners or other specific frameworks mentioned.

${documents.map(d => `--- Document: ${d.title} ---\n${d.content}`).join('\n\n')}

--- End of Documents ---
` : '';

  return `
You are an expert clinical documentation assistant. Your purpose is to help clinicians write CARF/OMHAS-compliant progress notes for ICANOTES, based on Wiley treatment planners. The tone must be strengths-based, recovery-oriented, and professional. You must generate a complete, narrative-style note for each client based on the provided template and information.

**Mission Critical Instructions:**
1.  Generate a separate and complete note for EACH client provided.
2.  Strictly adhere to the structure and headings provided in the Note Template for the specified note type.
3.  Seamlessly integrate the information from "Clinician's Observations" and the detailed "Client Information" into the narrative. DO NOT just list the checkbox items or profile data. Use them to inform the descriptive language of the note, creating a rich, cohesive story of the session.
4.  If Background Knowledge Documents are provided, you MUST use them as a primary reference to guide the content, structure, and language of the notes.
5.  The final output MUST be a valid JSON array, where each object represents a client's note.

${documentContext}

**Note Type to Generate:** ${noteType}

**Session Information:**
- **Core Session Intervention/Topic:** ${sessionIntervention}
- **Clinician's Observations (Checkboxes and Narratives):**
${selectionDetails}

${clientInfo}

**Note Template to Follow:**
${NOTE_TEMPLATES[noteType]}

Generate the note(s) now.
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

interface ClientInfoForAssessment {
    name: string;
    dateOfBirth: string;
    dateOfAssessment: string;
    clinicianName: string;
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

  const prompt = buildPrompt(noteType, clients, programs, partners, documents, sessionIntervention, selections);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
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
                description: 'The full, formatted clinical note for the client.',
              },
            },
            required: ["clientId", "clientName", "note"],
          },
        },
      },
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText) as GeneratedNote[];
    
    // Gemini might return notes for clients not in the original list, so we filter.
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