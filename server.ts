import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Route for Gemini
  app.post("/api/gemini", async (req, res) => {
    const { action, payload } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      let prompt = "";
      
      switch (action) {
        case "improveSummary":
          prompt = `En tant qu'expert en recrutement pour le marché français, améliore ce résumé professionnel pour un profil de "${payload.jobTitle}"${payload.targetJob ? ` pour cibler un poste de "${payload.targetJob}"` : ""}. 
          Rends-le plus percutant, professionnel et optimisé pour les ATS. Utilise un ton formel et convaincant.
          Résumé original : ${payload.summary}
          Réponds uniquement avec le nouveau résumé amélioré.`;
          break;

        case "improveExperience":
          prompt = `En tant qu'expert en recrutement, améliore cette description d'expérience professionnelle pour un poste de "${payload.position}".
          ${payload.targetJob ? `Tout en gardant la vérité sur l'expérience, oriente la description pour être plus attractive pour un recruteur cherchant un "${payload.targetJob}". ` : ""}
          Utilise des verbes d'action forts, quantifie les résultats si possible, et optimise pour les mots-clés ATS du marché français.
          Description originale : ${payload.description}
          Réponds uniquement avec la description améliorée sous forme de liste à puces (bullet points).`;
          break;

        case "suggestSkills":
          prompt = `Basé sur l'intitulé de poste actuel "${payload.jobTitle}"${payload.targetJob ? ` en visant un poste de "${payload.targetJob}"` : ""} et l'expérience suivante : "${payload.experience}", suggère une liste de 10 compétences clés (Soft Skills et Hard Skills) pertinentes pour le marché français.
          Réponds uniquement avec une liste de compétences séparées par des virgules.`;
          break;

        case "improveEducation":
          prompt = `En tant qu'expert en recrutement, améliore cette description de formation pour un diplôme de "${payload.degree}" à "${payload.school}".
          Mets en avant les compétences acquises, les projets majeurs ou les distinctions si mentionnés.
          Description originale : ${payload.description}
          Réponds uniquement avec la description améliorée.`;
          break;

        case "improveProject":
          prompt = `En tant qu'expert en recrutement, améliore cette description de projet personnel pour un projet nommé "${payload.name}".
          Rends-la plus impactante, technique et axée sur les solutions apportées.
          Description originale : ${payload.description}
          Réponds uniquement avec la description améliorée.`;
          break;

        case "analyzeResume":
          prompt = `Analyse ce CV pour le marché français${payload.targetJob ? ` spécifiquement pour une candidature au poste de "${payload.targetJob}"` : ""} et donne des conseils d'amélioration. 
          Vérifie la clarté, l'impact, et l'optimisation ATS.
          données du CV : ${JSON.stringify(payload.resumeData)}
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
          Note: Ne renvoie que le JSON, rien d'autre.`;
          break;

        default:
          return res.status(400).json({ error: "Unknown action" });
      }

      const response = await (ai as any).models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: action === "analyzeResume" ? { responseMimeType: "application/json" } : undefined
      });

      const text = response.text;

      if (action === "analyzeResume") {
        try {
          // The SDK with responseMimeType returns cleaned string or we might need to parse
          return res.json(typeof text === 'string' ? JSON.parse(text) : text);
        } catch (e) {
          return res.json({ markdown: text, suggestedUpdates: {} });
        }
      }

      res.json({ text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to process request with Gemini AI." });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
