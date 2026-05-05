import { GoogleGenAI } from "@google/genai";

async function callGemini(action: string, payload: any) {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to communicate with AI server");
  }

  return await response.json();
}

export async function improveSummary(summary: string, jobTitle: string, targetJob?: string) {
  const result = await callGemini("improveSummary", { summary, jobTitle, targetJob });
  return result.text;
}

export async function improveExperienceDescription(description: string, position: string, targetJob?: string) {
  const result = await callGemini("improveExperience", { description, position, targetJob });
  return result.text;
}

export async function suggestSkills(jobTitle: string, experience: string, targetJob?: string) {
  const result = await callGemini("suggestSkills", { jobTitle, experience, targetJob });
  return result.text?.split(',').map((s: string) => s.trim()) || [];
}

export async function improveEducationDescription(description: string, degree: string, school: string) {
  const result = await callGemini("improveEducation", { description, degree, school });
  return result.text;
}

export async function improveProjectDescription(description: string, name: string) {
  const result = await callGemini("improveProject", { description, name });
  return result.text;
}

export async function analyzeResume(resumeData: any, targetJob?: string) {
  const result = await callGemini("analyzeResume", { resumeData, targetJob });
  return result;
}
