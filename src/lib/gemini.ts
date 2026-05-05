import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function improveSummary(summary: string, jobTitle: string, targetJob?: string) {
  const ai = getAi();
  const targetContext = targetJob ? ` pour cibler un poste de "${targetJob}"` : "";
  const prompt = `En tant qu'expert en recrutement pour le marché français, améliore ce résumé professionnel pour un profil de "${jobTitle}"${targetContext}. 
  Rends-le plus percutant, professionnel et optimisé pour les ATS. 
  Utilise un ton formel et convaincant.
  
  Résumé original : ${summary}
  
  Réponds uniquement avec le nouveau résumé amélioré.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

export async function improveExperienceDescription(description: string, position: string, targetJob?: string) {
  const ai = getAi();
  const targetContext = targetJob ? `Tout en gardant la vérité sur l'expérience, oriente la description pour être plus attractive pour un recruteur cherchant un "${targetJob}". ` : "";
  const prompt = `En tant qu'expert en recrutement, améliore cette description d'expérience professionnelle pour un poste de "${position}".
  ${targetContext}Utilise des verbes d'action forts, quantifie les résultats si possible, et optimise pour les mots-clés ATS du marché français.
  
  Description originale : ${description}
  
  Réponds uniquement avec la description améliorée sous forme de liste à puces (bullet points).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

export async function suggestSkills(jobTitle: string, experience: string, targetJob?: string) {
  const ai = getAi();
  const targetContext = targetJob ? ` en visant un poste de "${targetJob}"` : "";
  const prompt = `Basé sur l'intitulé de poste actuel "${jobTitle}"${targetContext} et l'expérience suivante : "${experience}", suggère une liste de 10 compétences clés (Soft Skills et Hard Skills) pertinentes pour le marché français.
  
  Réponds uniquement avec une liste de compétences séparées par des virgules.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text?.split(',').map(s => s.trim()) || [];
}

export async function improveEducationDescription(description: string, degree: string, school: string) {
  const ai = getAi();
  const prompt = `En tant qu'expert en recrutement, améliore cette description de formation pour un diplôme de "${degree}" à "${school}".
  Mets en avant les compétences acquises, les projets majeurs ou les distinctions si mentionnés.
  
  Description originale : ${description}
  
  Réponds uniquement avec la description améliorée.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

export async function improveProjectDescription(description: string, name: string) {
  const ai = getAi();
  const prompt = `En tant qu'expert en recrutement, améliore cette description de projet personnel pour un projet nommé "${name}".
  Rends-la plus impactante, technique et axée sur les solutions apportées.
  
  Description originale : ${description}
  
  Réponds uniquement avec la description améliorée.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

export async function analyzeResume(resumeData: any, targetJob?: string) {
  const ai = getAi();
  const targetContext = targetJob ? ` spécifiquement pour une candidature au poste de "${targetJob}"` : "";
  const prompt = `Analyse ce CV pour le marché français${targetContext} et donne des conseils d'amélioration. 
  Vérifie la clarté, l'impact, et l'optimisation ATS.
  
  données du CV : ${JSON.stringify(resumeData)}
  
  IMPORTANT : Pour les sections Experience, Education et Projects, tu DOIS utiliser les MÊMES "id" (UUID) que ceux fournis dans les données source. Si tu suggères une amélioration pour une entrée, utilise son ID exact.
  
  Réponds EXCLUSIVEMENT sous le format JSON suivant :
  {
    "markdown": "Ton analyse complète en Markdown (Points forts, Points à améliorer, Score ATS)",
    "suggestedUpdates": {
      "personalInfo": { "summary": "Nouveau résumé amélioré" },
      "skills": ["Liste complète des compétences suggérées (incluant les anciennes et les nouvelles pertinentes)"],
      "experience": [ { "id": "COPIE_L_ID_EXACT_ICI", "description": "Nouvelle description complète améliorée" } ],
      "education": [ { "id": "COPIE_L_ID_EXACT_ICI", "description": "Nouvelle description complète améliorée" } ],
      "projects": [ { "id": "COPIE_L_ID_EXACT_ICI", "description": "Nouvelle description complète améliorée" } ]
    }
  }
  Note: Ne renvoie que le JSON, rien d'autre. Si une section n'a pas besoin d'être mise à jour, tu peux l'omettre de suggestedUpdates. Assure-toi que les descriptions incluent tous les bullet points suggérés.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  try {
    const text = response.text || "";
    // Clean potential markdown code blocks
    const jsonStr = text.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse AI analysis", e);
    return { markdown: response.text, suggestedUpdates: {} };
  }
}
