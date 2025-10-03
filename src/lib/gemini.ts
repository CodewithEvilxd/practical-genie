import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerEnv } from "@/lib/env";

let singletonClient: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (singletonClient) return singletonClient;
  const { GEMINI_API_KEY } = getServerEnv();
  singletonClient = new GoogleGenerativeAI(GEMINI_API_KEY);
  return singletonClient;
}

export type GenerateMode = "practical" | "experiment";

export interface GeneratedPlan {
  title: string;
  objectives: string[];
  materials: string[];
  theory: string;
  procedure: string[];
  observations?: string[];
  results?: string[];
  safetyNotes?: string[];
  presentationTips?: string[];
  vivaQuestions?: string[];
  vivaAnswers?: string[];
  diagramImageUrls?: string[];
  suggestedImageSearchQueries?: string[];
  notebookLayout: {
    leftPane: "diagram" | "blank";
    rightPane: Array<{
      heading: string;
      content: string;
    }>;
  };
  leftPaneImages?: Array<{
    title: string;
    caption: string;
    suggestedSearchQuery: string;
    referenceDiagramDescription?: string;
  }>;
  writingStyleNotes?: string[];
  tables?: Array<{
    title: string;
    headers: string[];
    rows: string[][];
  }>;
}

export async function generatePlanFromGemini(params: {
  mode: GenerateMode;
  question: string;
}): Promise<GeneratedPlan> {
  // Try discovery first to find a supported model for this key/region
  const discovered = await discoverModelId();
  const candidateModels = discovered
    ? [discovered]
    : [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-1.5-pro-latest",
        "gemini-1.5-flash-8b",
      ];

  const prompt = `You are an expert lab instructor creating a student-ready practical/experiment notebook plan.
Write in very simple, short sentences that a school/college student can copy into a practical notebook.
Return STRICT JSON only. Do NOT output markdown or code fences. Only pure JSON. Schema:
{
  "title": string,
  "objectives": string[],
  "materials": string[],
  "theory": string,
  "procedure": string[],
  "observations": string[],
  "results": string[],
  "safetyNotes": string[],
  "presentationTips": string[],
   "vivaQuestions": string[],
   "vivaAnswers": string[],
   "diagramImageUrls": string[],
   "suggestedImageSearchQueries": string[],
   "notebookLayout": {
     "leftPane": "diagram" | "blank",
     "rightPane": Array<{"heading": string, "content": string}>
   },
   "leftPaneImages": Array<{"title": string, "caption": string, "suggestedSearchQuery": string, "referenceDiagramDescription"?: string}> ,
   "writingStyleNotes": string[]
   "tables": Array<{"title": string, "headers": string[], "rows": string[][]}>
}

Constraints:
- Align with Indian school/college practical notebook conventions: left page for diagram/blank; right page for write-up (aim/objective, materials, theory, procedure, observations, result, viva/presentation tips).
- If you cannot fetch images, populate suggestedImageSearchQueries with 3-5 specific queries. Provide diagramImageUrls if the model knows reliable public links.
- Keep theory short and clear. Explain terms in 1-2 simple lines.
- Keep procedure step-by-step and actionable (1 step per line, imperative voice).
- Use clear, simple language suitable for students, no jargon. Short sentences.
- Include 2-3 leftPaneImages entries: title, a short caption to write under the diagram, and a very specific Google Images query. Add a one-line description of what to draw if no image is available.
- Organize rightPane items in the exact sequence a student should write on lined page: Objective/Aim → Materials → Theory → Procedure → Observations → Result → Presentation/Viva tips.
- Do NOT use markdown tables or the pipe character '|'. When you need tabular data (e.g., truth tables), fill the "tables" array with a proper JSON structure: title, headers, and rows.
- For vivaQuestions, provide 3-5 common questions a teacher might ask. For vivaAnswers, give simple, student-friendly answers to each question in the same order.

Mode: ${params.mode}
Question: ${params.question}`;

  let lastErr: unknown = null;
  for (const modelName of candidateModels) {
    try {
      const text = await generateViaRestV1(modelName, prompt);
      return parseGeneratedPlan(text);
    } catch (err: unknown) {
      lastErr = err;
      // On 404/unsupported, continue to next model
      const msg = String((err instanceof Error ? err.message : err) || "");
      if (msg.includes("404") || msg.includes("not found") || msg.includes("unsupported") || msg.includes("model")) {
        continue;
      }
      // Other errors: fail fast
      throw err;
    }
  }
  throw lastErr || new Error("No supported Gemini model available for this API key");
}

async function generateViaRestV1(model: string, prompt: string): Promise<string> {
  const { GEMINI_API_KEY } = getServerEnv();
  const url = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`REST v1 error ${res.status}: ${text}`);
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts)
    ? parts.map((p: { text?: string }) => p?.text).filter(Boolean).join("\n")
    : "";
  if (!text) throw new Error("Empty response from REST v1");
  return text;
}

async function discoverModelId(): Promise<string | null> {
  const { GEMINI_API_KEY } = getServerEnv();
  type ModelInfo = { name?: string; supportedGenerationMethods?: string[] };
  // Prefer v1 list
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const models = (data?.models || []) as ModelInfo[];
      const supported = models.filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"));
      const preferredOrder = ["flash", "pro"]; // prefer flash, then pro
      const pick = supported
        .sort((a, b) => {
          const aRank = preferredOrder.findIndex((p) => String(a?.name || "").includes(p));
          const bRank = preferredOrder.findIndex((p) => String(b?.name || "").includes(p));
          return (aRank === -1 ? 99 : aRank) - (bRank === -1 ? 99 : bRank);
        })[0];
      if (pick?.name) return String(pick.name).replace("models/", "");
    }
  } catch {}
  // Fallback: v1beta list
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const models = (data?.models || []) as ModelInfo[];
      const supported = models.filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"));
      const preferredOrder = ["flash", "pro"];
      const pick = supported
        .sort((a, b) => {
          const aRank = preferredOrder.findIndex((p) => String(a?.name || "").includes(p));
          const bRank = preferredOrder.findIndex((p) => String(b?.name || "").includes(p));
          return (aRank === -1 ? 99 : aRank) - (bRank === -1 ? 99 : bRank);
        })[0];
      if (pick?.name) return String(pick.name).replace("models/", "");
    }
  } catch {}
  return null;
}

function parseGeneratedPlan(text: string): GeneratedPlan {
  // Strip common code fences
  let t = text.trim();
  t = t.replace(/^```(json)?/i, "").replace(/```$/i, "").trim();
  // Remove leading markdown/table lines like "- |" or pipes starting lines
  const lines = t.split(/\r?\n/).filter((ln) => !/^\s*\|/.test(ln) && !/^\s*-\s*\|/.test(ln));
  const cleaned = lines.join("\n");
  // Try direct parse
  try {
    return JSON.parse(cleaned) as GeneratedPlan;
  } catch {}
  // Try to find the largest JSON object substring
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    return JSON.parse(match[0]) as GeneratedPlan;
  }
  throw new Error("Failed to parse model response as JSON");
}


