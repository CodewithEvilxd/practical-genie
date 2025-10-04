"use client";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Visual Components
const ExperimentFlowchart = () => (
  <svg width="600" height="400" viewBox="0 0 600 400" className="w-full h-auto">
    {/* Title */}
    <rect x="250" y="10" width="100" height="30" fill="#3b82f6" rx="5"/>
    <text x="300" y="28" textAnchor="middle" fill="white" fontSize="12">Experiment</text>

    {/* Input */}
    <rect x="200" y="60" width="80" height="25" fill="#10b981" rx="3"/>
    <text x="240" y="76" textAnchor="middle" fill="white" fontSize="10">Input</text>

    {/* Processing */}
    <rect x="300" y="60" width="80" height="25" fill="#f59e0b" rx="3"/>
    <text x="340" y="76" textAnchor="middle" fill="white" fontSize="10">Process</text>

    {/* Output */}
    <rect x="400" y="60" width="80" height="25" fill="#ef4444" rx="3"/>
    <text x="440" y="76" textAnchor="middle" fill="white" fontSize="10">Output</text>

    {/* Arrows */}
    <path d="M240 85 L240 105" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M340 85 L340 105" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M440 85 L440 105" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)"/>

    {/* Implementation Ideas */}
    <rect x="50" y="120" width="120" height="30" fill="#8b5cf6" rx="5"/>
    <text x="110" y="138" textAnchor="middle" fill="white" fontSize="11">Implementation</text>
    <text x="110" y="150" textAnchor="middle" fill="white" fontSize="11">Ideas</text>

    {/* Presentation Ideas */}
    <rect x="200" y="120" width="120" height="30" fill="#06b6d4" rx="5"/>
    <text x="260" y="138" textAnchor="middle" fill="white" fontSize="11">Presentation</text>
    <text x="260" y="150" textAnchor="middle" fill="white" fontSize="11">Ideas</text>

    {/* Showcase Ideas */}
    <rect x="350" y="120" width="120" height="30" fill="#84cc16" rx="5"/>
    <text x="410" y="138" textAnchor="middle" fill="white" fontSize="11">Showcase</text>
    <text x="410" y="150" textAnchor="middle" fill="white" fontSize="11">Ideas</text>

    {/* Diagram Ideas */}
    <rect x="500" y="120" width="80" height="30" fill="#f97316" rx="5"/>
    <text x="540" y="138" textAnchor="middle" fill="white" fontSize="11">Diagram</text>
    <text x="540" y="150" textAnchor="middle" fill="white" fontSize="11">Ideas</text>

    {/* Arrows to ideas */}
    <path d="M110 150 L110 170" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M260 150 L260 170" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M410 150 L410 170" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)"/>
    <path d="M540 150 L540 170" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)"/>

    {/* Writing Structure */}
    <rect x="250" y="190" width="100" height="30" fill="#ec4899" rx="5"/>
    <text x="300" y="208" textAnchor="middle" fill="white" fontSize="11">Writing</text>
    <text x="300" y="220" textAnchor="middle" fill="white" fontSize="11">Structure</text>

    {/* Viva Questions */}
    <rect x="150" y="240" width="100" height="30" fill="#6366f1" rx="5"/>
    <text x="200" y="258" textAnchor="middle" fill="white" fontSize="11">Viva</text>
    <text x="200" y="270" textAnchor="middle" fill="white" fontSize="11">Questions</text>

    {/* Final Report */}
    <rect x="350" y="240" width="100" height="30" fill="#14b8a6" rx="5"/>
    <text x="400" y="258" textAnchor="middle" fill="white" fontSize="11">Final</text>
    <text x="400" y="270" textAnchor="middle" fill="white" fontSize="11">Report</text>

    {/* Arrow markers */}
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
      </marker>
    </defs>
  </svg>
);


const IdeaCategoriesMindMap = () => (
  <svg width="700" height="500" viewBox="0 0 700 500" className="w-full h-auto">
    {/* Center */}
    <circle cx="350" cy="250" r="40" fill="#1f2937"/>
    <text x="350" y="255" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Ideas</text>

    {/* Main branches */}
    <line x1="350" y1="210" x2="200" y2="150" stroke="#3b82f6" strokeWidth="3"/>
    <line x1="350" y1="210" x2="500" y2="150" stroke="#10b981" strokeWidth="3"/>
    <line x1="350" y1="290" x2="200" y2="350" stroke="#f59e0b" strokeWidth="3"/>
    <line x1="350" y1="290" x2="500" y2="350" stroke="#ef4444" strokeWidth="3"/>

    {/* Implementation */}
    <circle cx="150" cy="120" r="35" fill="#3b82f6"/>
    <text x="150" y="125" textAnchor="middle" fill="white" fontSize="10">Implementation</text>
    <text x="150" y="135" textAnchor="middle" fill="white" fontSize="10">Ideas</text>

    {/* Presentation */}
    <circle cx="550" cy="120" r="35" fill="#10b981"/>
    <text x="550" y="125" textAnchor="middle" fill="white" fontSize="10">Presentation</text>
    <text x="550" y="135" textAnchor="middle" fill="white" fontSize="10">Ideas</text>

    {/* Showcase */}
    <circle cx="150" cy="380" r="35" fill="#f59e0b"/>
    <text x="150" y="385" textAnchor="middle" fill="white" fontSize="10">Showcase</text>
    <text x="150" y="395" textAnchor="middle" fill="white" fontSize="10">Ideas</text>

    {/* Diagram */}
    <circle cx="550" cy="380" r="35" fill="#ef4444"/>
    <text x="550" y="385" textAnchor="middle" fill="white" fontSize="10">Diagram</text>
    <text x="550" y="395" textAnchor="middle" fill="white" fontSize="10">Ideas</text>

    {/* Sub-ideas */}
    <circle cx="80" cy="80" r="20" fill="#60a5fa"/>
    <text x="80" y="84" textAnchor="middle" fill="white" fontSize="8">Breadboard</text>

    <circle cx="220" cy="80" r="20" fill="#60a5fa"/>
    <text x="220" y="84" textAnchor="middle" fill="white" fontSize="8">Simulation</text>

    <circle cx="480" cy="80" r="20" fill="#34d399"/>
    <text x="480" y="84" textAnchor="middle" fill="white" fontSize="8">Slides</text>

    <circle cx="620" cy="80" r="20" fill="#34d399"/>
    <text x="620" y="84" textAnchor="middle" fill="white" fontSize="8">Demo</text>

    <circle cx="80" cy="420" r="20" fill="#fbbf24"/>
    <text x="80" y="424" textAnchor="middle" fill="white" fontSize="8">Live Setup</text>

    <circle cx="220" cy="420" r="20" fill="#fbbf24"/>
    <text x="220" y="424" textAnchor="middle" fill="white" fontSize="8">Data Viz</text>

    <circle cx="480" cy="420" r="20" fill="#f87171"/>
    <text x="480" y="424" textAnchor="middle" fill="white" fontSize="8">Circuit</text>

    <circle cx="620" cy="420" r="20" fill="#f87171"/>
    <text x="620" y="424" textAnchor="middle" fill="white" fontSize="8">Graphs</text>
  </svg>
);

const StepByStepGuide = () => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center font-bold text-xl mb-8">Step-by-Step Experiment Guide</div>

    {/* Step 1 */}
    <div className="flex items-start mb-8">
      <div className="flex flex-col items-center mr-6">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
        <div className="w-0.5 h-16 bg-blue-300 mt-2"></div>
      </div>
      <div className="flex-1">
        <div className="font-semibold text-blue-800 mb-2">📝 Experiment Title & Aim</div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-700 space-y-1">
            <div>• Write a clear, concise title that reflects the experiment&apos;s objective</div>
            <div>• State the main aim in one sentence</div>
            <div>• List 2-3 specific objectives you want to achieve</div>
            <div>• Mention the expected outcome or hypothesis</div>
          </div>
        </div>
      </div>
    </div>

    {/* Step 2 */}
    <div className="flex items-start mb-8">
      <div className="flex flex-col items-center mr-6">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
        <div className="w-0.5 h-16 bg-green-300 mt-2"></div>
      </div>
      <div className="flex-1">
        <div className="font-semibold text-green-800 mb-2">🧪 Theory & Background</div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-700 space-y-1">
            <div>• Explain the basic scientific concepts involved</div>
            <div>• Write down all relevant formulae with proper derivation</div>
            <div>• State the assumptions and conditions for the experiment</div>
            <div>• Include any prerequisite knowledge needed</div>
          </div>
        </div>
      </div>
    </div>

    {/* Step 3 */}
    <div className="flex items-start mb-8">
      <div className="flex flex-col items-center mr-6">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
        <div className="w-0.5 h-16 bg-purple-300 mt-2"></div>
      </div>
      <div className="flex-1">
        <div className="font-semibold text-purple-800 mb-2">🛠️ Materials & Apparatus</div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-700 space-y-1">
            <div>• List all equipment needed with specifications</div>
            <div>• Include quantities and sizes where applicable</div>
            <div>• Mention any special requirements or precautions</div>
            <div>• Group related items together logically</div>
          </div>
        </div>
      </div>
    </div>

    {/* Step 4 */}
    <div className="flex items-start mb-8">
      <div className="flex flex-col items-center mr-6">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
        <div className="w-0.5 h-16 bg-orange-300 mt-2"></div>
      </div>
      <div className="flex-1">
        <div className="font-semibold text-orange-800 mb-2">📋 Procedure Steps</div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-orange-700 space-y-1">
            <div>• Write step-by-step instructions that anyone can follow</div>
            <div>• Include safety precautions and handling instructions</div>
            <div>• Specify measurement techniques and instruments to use</div>
            <div>• Mention how many times to repeat measurements</div>
          </div>
        </div>
      </div>
    </div>

    {/* Step 5 */}
    <div className="flex items-start mb-8">
      <div className="flex flex-col items-center mr-6">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
        <div className="w-0.5 h-16 bg-red-300 mt-2"></div>
      </div>
      <div className="flex-1">
        <div className="font-semibold text-red-800 mb-2">📊 Observations & Data</div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm text-red-700 space-y-1">
            <div>• Create neat tables for recording measurements</div>
            <div>• Record all raw data with proper units</div>
            <div>• Take multiple readings and calculate averages</div>
            <div>• Include any qualitative observations</div>
          </div>
        </div>
      </div>
    </div>

    {/* Step 6 */}
    <div className="flex items-start mb-8">
      <div className="flex flex-col items-center mr-6">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">6</div>
        <div className="w-0.5 h-16 bg-indigo-300 mt-2"></div>
      </div>
      <div className="flex-1">
        <div className="font-semibold text-indigo-800 mb-2">📈 Calculations & Results</div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm text-indigo-700 space-y-1">
            <div>• Show all calculation steps with proper formulae</div>
            <div>• Plot graphs with labeled axes and proper scales</div>
            <div>• Calculate final values and uncertainties</div>
            <div>• Compare results with theoretical expectations</div>
          </div>
        </div>
      </div>
    </div>

    {/* Step 7 */}
    <div className="flex items-start mb-8">
      <div className="flex flex-col items-center mr-6">
        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">7</div>
        <div className="w-0.5 h-16 bg-pink-300 mt-2"></div>
      </div>
      <div className="flex-1">
        <div className="font-semibold text-pink-800 mb-2">💭 Discussion & Analysis</div>
        <div className="bg-pink-50 p-4 rounded-lg">
          <div className="text-sm text-pink-700 space-y-1">
            <div>• Analyze sources of error and their impact</div>
            <div>• Explain discrepancies between theory and experiment</div>
            <div>• Suggest improvements for future experiments</div>
            <div>• Discuss practical applications and limitations</div>
          </div>
        </div>
      </div>
    </div>

    {/* Step 8 */}
    <div className="flex items-start mb-8">
      <div className="flex flex-col items-center mr-6">
        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">8</div>
      </div>
      <div className="flex-1">
        <div className="font-semibold text-teal-800 mb-2">✅ Conclusion & Viva Prep</div>
        <div className="bg-teal-50 p-4 rounded-lg">
          <div className="text-sm text-teal-700 space-y-1">
            <div>• Summarize key findings and whether aims were achieved</div>
            <div>• Prepare answers for 20+ common viva questions</div>
            <div>• Review all diagrams and their explanations</div>
            <div>• Practice explaining concepts and procedures clearly</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

type Plan = {
  title: string;
  objectives?: string[];
  materials: string[];
  theory?: string;
  procedure: string[];
  observations?: string[];
  results?: string[];
  safetyNotes?: string[];
  presentationTips?: string[];
  vivaQuestions?: string[];
  vivaAnswers?: string[];
  diagramImageUrls?: string[];
  suggestedImageSearchQueries?: string[];
  notebookLayout?: {
    leftPane: "diagram" | "blank";
    rightPane: { heading: string; content: string }[];
  };
  leftPaneImages?: { title: string; caption: string; suggestedSearchQuery: string; referenceDiagramDescription?: string }[];
  writingStyleNotes?: string[];
  tables?: { title: string; headers: string[]; rows: string[][] }[];
  implementationIdeas?: string[];
  presentationIdeas?: string[];
  showcaseIdeas?: string[];
  diagramIdeas?: string[];
  improvementSuggestions?: string[];
  writingInstructions?: string;
  contentGuidelines?: string[];
};

export default function ExperimentIdeas() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "experiment-ideas", question }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to generate");
      setPlan(data.plan as Plan);
      // Attempt to fetch a left-page image if missing
      const hasImage = (data.plan?.diagramImageUrls?.length ?? 0) > 0;
      const q = data.plan?.leftPaneImages?.[0]?.suggestedSearchQuery || data.plan?.title || question;
      if (!hasImage && q) {
        try {
          const imgRes = await fetch(`/api/image?q=${encodeURIComponent(q)}`);
          const imgData = await imgRes.json();
          if (imgData?.ok && imgData.imageUrl) {
            setFallbackImage(imgData.imageUrl as string);
          } else {
            setFallbackImage(null);
          }
        } catch {
          setFallbackImage(null);
        }
      } else {
        setFallbackImage(null);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // Normalize potentially non-array fields coming from the model
  const rawLeftImgs = plan ? (plan as unknown as { leftPaneImages?: unknown }).leftPaneImages : undefined;
  const leftImgs = Array.isArray(rawLeftImgs)
    ? rawLeftImgs as { title: string; caption: string; suggestedSearchQuery: string; referenceDiagramDescription?: string }[]
    : [];

  return (
    <main className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Experiment Ideas Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="q">Experiment Description</Label>
            <Textarea id="q" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Describe the experiment you want ideas for" />
          </div>
          <Button onClick={onGenerate} disabled={loading || !question.trim()}>
            {loading ? "Generating..." : "Generate Ideas"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {/* Enhanced Visual Structure Guide */}
      <div className="space-y-8">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              🎯 Complete Visual Guide: How Experiment Ideas Work
            </CardTitle>
            <p className="text-blue-100 text-sm mt-2">
              Understand the complete process from idea generation to final report - step by step!
            </p>
          </CardHeader>
          <CardContent className="space-y-8 p-6">

            {/* Introduction Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                🚀 What You&apos;ll Learn Here
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-700 mb-1">📋 Process Flow</div>
                  <div className="text-blue-600">How ideas flow from input to final output</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-semibold text-green-700 mb-1">🧠 Idea Categories</div>
                  <div className="text-green-600">4 types of ideas you need for experiments</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-semibold text-purple-700 mb-1">📝 Step-by-Step Guide</div>
                  <div className="text-purple-600">Complete experiment writing process</div>
                </div>
              </div>
            </div>

            {/* Process Flowchart */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                  🔄 1. Experiment Process Flowchart
                </h3>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  How Ideas Flow
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                This flowchart shows how your experiment description becomes a complete set of ideas:
              </p>
              <div className="flex justify-center mb-4">
                <ExperimentFlowchart />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 What This Shows:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Input:</strong> Your experiment description</li>
                  <li>• <strong>Process:</strong> AI analyzes and generates ideas</li>
                  <li>• <strong>Output:</strong> Complete experiment guidance</li>
                  <li>• <strong>4 Idea Types:</strong> Implementation, Presentation, Showcase, Diagrams</li>
                </ul>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Mind Map */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
                  🧠 2. Idea Categories Mind Map
                </h3>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  4 Types of Ideas
                </span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-green-800 mb-2">🎯 How to Use This Mind Map:</h4>
                <div className="text-sm text-green-700 space-y-2">
                  <p><strong>Step 1:</strong> Look at your experiment description above</p>
                  <p><strong>Step 2:</strong> For each of the 4 idea types below, think about what you need for your specific experiment</p>
                  <p><strong>Step 3:</strong> Use the generated ideas as examples, then create your own versions</p>
                  <p><strong>Step 4:</strong> Make sure you have ideas from ALL 4 categories before starting</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Every great experiment needs these 4 types of ideas working together. Use this as your checklist:
              </p>
              <div className="flex justify-center mb-6">
                <IdeaCategoriesMindMap />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    🔧 Implementation Ideas
                    <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">MUST HAVE</span>
                  </h4>
                  <p className="text-sm text-purple-700 mb-2"><strong>What to think about:</strong></p>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• How will you physically build/setup your experiment?</li>
                    <li>• What equipment do you need and how do you connect it?</li>
                    <li>• What are the exact steps to follow?</li>
                    <li>• What safety measures are required?</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2 italic">Example: For a circuit experiment - how to connect wires, which components to use, step-by-step assembly</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    📊 Presentation Ideas
                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">MUST HAVE</span>
                  </h4>
                  <p className="text-sm text-blue-700 mb-2"><strong>What to think about:</strong></p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• How will you explain your experiment to teachers?</li>
                    <li>• What slides or visual aids will you create?</li>
                    <li>• How will you answer questions about your work?</li>
                    <li>• What key points should you highlight?</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2 italic">Example: Create slides showing your hypothesis, method, results, and conclusion</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                    🎪 Showcase Ideas
                    <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded">MUST HAVE</span>
                  </h4>
                  <p className="text-sm text-orange-700 mb-2"><strong>What to think about:</strong></p>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• How will you make your experiment look impressive?</li>
                    <li>• What visual demonstrations can you include?</li>
                    <li>• How will you show results clearly to others?</li>
                    <li>• What props or displays will engage your audience?</li>
                  </ul>
                  <p className="text-xs text-orange-600 mt-2 italic">Example: Use colored lights, working models, or interactive displays to show your results</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    📐 Diagram Ideas
                    <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded">MUST HAVE</span>
                  </h4>
                  <p className="text-sm text-red-700 mb-2"><strong>What to think about:</strong></p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• What diagrams do you need to draw?</li>
                    <li>• How will you show your circuit/setup visually?</li>
                    <li>• What graphs or charts will display your data?</li>
                    <li>• How will you label and explain your diagrams?</li>
                  </ul>
                  <p className="text-xs text-red-600 mt-2 italic">Example: Circuit diagram, experimental setup diagram, result graphs with proper labels</p>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg mt-4 border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Reminder:</h4>
                <p className="text-sm text-yellow-700">
                  Don&apos;t start your experiment until you have thought through ALL 4 types of ideas.
                  Each type is equally important for a complete and successful experiment!
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Step-by-Step Guide */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
                  📝 3. Step-by-Step Experiment Guide
                </h3>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  Complete Writing Process
                </span>
              </div>
              <p className="text-gray-600 mb-6 text-sm">
                Follow these 8 steps to write a perfect experiment report. Each step shows exactly what to write and how to structure it:
              </p>
              <StepByStepGuide />
              <div className="bg-purple-50 p-4 rounded-lg mt-6">
                <h4 className="font-semibold text-purple-800 mb-2">🎯 Why Follow These Steps?</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• <strong>Logical Flow:</strong> Each step builds on the previous one</li>
                  <li>• <strong>Complete Coverage:</strong> Nothing important is missed</li>
                  <li>• <strong>Teacher Expectations:</strong> Matches what teachers want to see</li>
                  <li>• <strong>Viva Ready:</strong> Prepares you for questions about every part</li>
                </ul>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                💡 Quick Tips for Success
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span className="text-yellow-700">Use the generated ideas as a starting point, then add your own creativity</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span className="text-yellow-700">Practice explaining each diagram before your viva</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span className="text-yellow-700">Draw diagrams neatly with proper labels and legends</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span className="text-yellow-700">Include real values and calculations, not just theory</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span className="text-yellow-700">Connect your results back to the original objectives</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span className="text-yellow-700">Be honest about errors and explain how you minimized them</span>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {plan && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] border bg-white dark:bg-neutral-900 p-3 flex items-center justify-center">
                {plan.diagramImageUrls?.length ? (
                  <Image src={plan.diagramImageUrls[0]} alt="diagram" width={400} height={500} className="object-contain max-h-full" />
                ) : fallbackImage ? (
                  <Image src={fallbackImage} alt="diagram" width={400} height={500} className="object-contain max-h-full" />
                ) : (
                  <div className="text-sm text-neutral-500 space-y-2">
                    <p>No diagram image available.</p>
                    {plan.suggestedImageSearchQueries?.length ? (
                      <div>
                        <p className="font-medium">Try searching:</p>
                        <ul className="list-disc pl-5">
                          {plan.suggestedImageSearchQueries.map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              {leftImgs.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Suggested diagrams</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {leftImgs.map((img, i) => (
                      <li key={i}>
                        <span className="font-medium">{img.title}:</span> {img.caption}
                        {" "}
                        <span className="text-neutral-500">Search:</span> {img.suggestedSearchQuery}
                        {img.referenceDiagramDescription ? (
                          <span className="text-neutral-500"> (Draw: {img.referenceDiagramDescription})</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Complete Experiment Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-2xl font-bold text-blue-800">{plan.title}</h2>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Complete Guide</Badge>
              </div>
              <Separator />

              {/* What to Make Section */}
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  🎨 What to Make (Diagrams & Images)
                  <Badge className="bg-blue-200 text-blue-800 text-xs">Chart Paper: 72x56 cm</Badge>
                </h3>
                <div className="space-y-4">
                  {/* Theory Content for Chart Paper - Exact Format */}
                  <div className="bg-white p-4 rounded border-2 border-blue-300">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-center">
                      📝 EXACT FORMAT TO WRITE ON CHART PAPER
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">COPY THIS PATTERN</span>
                    </h4>

                    {/* Exact Lines Format */}
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm border border-gray-300">
                      <div className="space-y-2">
                        <div className="text-center font-bold text-lg border-b-2 border-blue-400 pb-1 mb-3">
                          [EXPERIMENT TITLE]
                        </div>

                        <div className="space-y-1">
                          <div className="font-bold text-blue-800">OBJECT:</div>
                          <div className="ml-4 text-gray-700">• [Write the main objective/aim here]</div>
                          <div className="ml-4 text-gray-700">• [State what you want to achieve]</div>
                        </div>

                        <div className="space-y-1 mt-3">
                          <div className="font-bold text-green-800">COMPONENT:</div>
                          <div className="ml-4 text-gray-700">• [List all materials/apparatus needed]</div>
                          <div className="ml-4 text-gray-700">• [Include quantities and specifications]</div>
                          <div className="ml-4 text-gray-700">• [Mention any special equipment]</div>
                        </div>

                        <div className="space-y-1 mt-3">
                          <div className="font-bold text-purple-800">REQ:</div>
                          <div className="ml-4 text-gray-700">• [State the requirements/conditions]</div>
                          <div className="ml-4 text-gray-700">• [List any prerequisites needed]</div>
                          <div className="ml-4 text-gray-700">• [Mention safety requirements]</div>
                        </div>

                        <div className="space-y-1 mt-3">
                          <div className="font-bold text-orange-800">THEORY:</div>
                          <div className="ml-4 text-gray-700">• [Write complete theory here]</div>
                          <div className="ml-4 text-gray-700">• [Include all relevant formulae]</div>
                          <div className="ml-4 text-gray-700">• [State assumptions and conditions]</div>
                          <div className="ml-4 text-gray-700">• [Explain basic concepts]</div>
                        </div>

                        <div className="space-y-1 mt-3">
                          <div className="font-bold text-red-800">PROCEDURE:</div>
                          <div className="ml-4 text-gray-700">• [Step-by-step instructions]</div>
                          <div className="ml-4 text-gray-700">• [Safety precautions]</div>
                          <div className="ml-4 text-gray-700">• [Measurement techniques]</div>
                        </div>

                        <div className="space-y-1 mt-3">
                          <div className="font-bold text-indigo-800">CONCLUSION:</div>
                          <div className="ml-4 text-gray-700">• [Summarize key findings]</div>
                          <div className="ml-4 text-gray-700">• [State whether aims were achieved]</div>
                          <div className="ml-4 text-gray-700">• [Mention practical applications]</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-blue-100 rounded text-sm">
                      <strong>📏 Chart Paper Layout (72x56 cm):</strong><br/>
                      • <strong>Left Side:</strong> Write above content in large, clear letters<br/>
                      • <strong>Right Side:</strong> Draw circuit diagrams and images<br/>
                      • <strong>Bottom:</strong> Leave space for conclusion and signatures<br/>
                      • Use black marker, maintain proper spacing between sections
                    </div>
                  </div>

                  {plan.diagramIdeas && plan.diagramIdeas.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">📐 Diagrams to Draw:</h4>
                      <ul className="list-disc pl-5 text-sm text-blue-600">
                        {plan.diagramIdeas.map((idea, i) => (
                          <li key={i}>{idea}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {leftImgs.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">🖼️ Suggested Images:</h4>
                      <ul className="list-disc pl-5 text-sm text-blue-600">
                        {leftImgs.map((img, i) => (
                          <li key={i}>
                            <span className="font-medium">{img.title}:</span> {img.caption}
                            {img.suggestedSearchQuery && (
                              <span className="text-blue-500"> (Search: {img.suggestedSearchQuery})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {plan.showcaseIdeas && plan.showcaseIdeas.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">🎪 Visual Demonstrations:</h4>
                      <ul className="list-disc pl-5 text-sm text-blue-600">
                        {plan.showcaseIdeas.map((idea, i) => (
                          <li key={i}>{idea}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Experiment Report Structure */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">📝 What to Write (Complete Report)</h3>

                {/* 1. Title & Aim */}
                <section className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    1️⃣ 📋 Title & Aim
                  </h4>
                  {plan.objectives && plan.objectives.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Objectives:</p>
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {plan.objectives.map((o, i) => (
                          <li key={i}>{o}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="text-sm text-gray-600 italic">
                    Write a clear title and state your main aim in one sentence
                  </div>
                </section>

                {/* 2. Theory - Prominently Displayed */}
                {plan.theory && (
                  <section className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2 text-lg">
                      2️⃣ 🧪 Theory & Background
                      <Badge className="bg-yellow-200 text-yellow-800 text-xs">IMPORTANT</Badge>
                    </h4>
                    <div className="bg-white p-3 rounded border text-sm">
                      {plan.theory}
                    </div>
                    <div className="mt-2 text-xs text-yellow-700 italic">
                      Include all relevant formulae with proper derivation and state assumptions
                    </div>
                  </section>
                )}

                {/* 3. Materials & Apparatus */}
                <section className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    3️⃣ 🛠️ Materials & Apparatus
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {plan.materials.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                  <div className="mt-2 text-xs text-gray-600 italic">
                    List all equipment with specifications and quantities
                  </div>
                </section>

                {/* 4. Procedure */}
                <section className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                    4️⃣ 📋 Procedure Steps
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-600">
                    {plan.procedure.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                  <div className="mt-2 text-xs text-gray-600 italic">
                    Write step-by-step instructions anyone can follow
                  </div>
                </section>

                {/* 5. Observations & Data */}
                <section className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    5️⃣ 📊 Observations & Data
                  </h4>
                  {plan.tables && plan.tables.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Data Tables:</p>
                      <div className="space-y-3">
                        {plan.tables.map((tbl, idx) => (
                          <div key={idx} className="border rounded-md overflow-x-auto">
                            <div className="p-2 font-medium border-b bg-gray-50 text-sm">{tbl.title}</div>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-gray-100">
                                  {tbl.headers.map((h, i) => (
                                    <th key={i} className="text-left p-2 border-b">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {tbl.rows.map((r, i) => (
                                  <tr key={i} className="odd:bg-gray-50">
                                    {r.map((c, j) => (
                                      <td key={j} className="p-2 border-b align-top">{c}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-600 italic">
                    Record all measurements with units, take multiple readings
                  </div>
                </section>

                {/* 6. Calculations & Results */}
                <section className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                    6️⃣ 📈 Calculations & Results
                  </h4>
                  <div className="text-xs text-gray-600 italic">
                    Show all calculation steps with formulae, plot graphs, compare with theory
                  </div>
                </section>

                {/* 7. Discussion & Analysis */}
                <section className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">
                    7️⃣ 💭 Discussion & Analysis
                  </h4>
                  <div className="text-xs text-gray-600 italic">
                    Analyze errors, explain discrepancies, suggest improvements
                  </div>
                </section>

                {/* 8. Conclusion */}
                <section className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-teal-800 mb-2 flex items-center gap-2">
                    8️⃣ ✅ Conclusion
                  </h4>
                  <div className="text-xs text-gray-600 italic">
                    Summarize findings and whether aims were achieved
                  </div>
                </section>
              </div>

              {/* Implementation & Presentation Ideas */}
              {(plan.implementationIdeas || plan.presentationIdeas || plan.presentationTips) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 How to Do & Present Your Experiment</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {plan.implementationIdeas && plan.implementationIdeas.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">🔧 Implementation Ideas:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          {plan.implementationIdeas.map((idea, i) => (
                            <li key={i}>{idea}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {plan.presentationIdeas && plan.presentationIdeas.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">📊 Presentation Ideas:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          {plan.presentationIdeas.map((idea, i) => (
                            <li key={i}>{idea}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {plan.presentationTips && plan.presentationTips.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-700 mb-2">💬 Presentation Tips:</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {plan.presentationTips.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Improvement Suggestions */}
              {plan.improvementSuggestions && plan.improvementSuggestions.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">🚀 Improvement Suggestions</h3>
                  <ul className="list-disc pl-5 text-sm text-green-700">
                    {plan.improvementSuggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Viva Questions & Answers - At the Bottom */}
              {plan.vivaQuestions && plan.vivaQuestions.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                  <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                    ❓ Viva Questions & Answers
                    <Badge className="bg-red-200 text-red-800 text-xs">Practice These</Badge>
                  </h3>
                  <div className="space-y-3">
                    {plan.vivaQuestions.map((q, i) => (
                      <div key={i} className="border rounded-md p-3 bg-white">
                        <div className="font-medium text-sm mb-2 text-red-800">Q{i + 1}: {q}</div>
                        {plan.vivaAnswers && plan.vivaAnswers[i] && (
                          <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            <strong>A:</strong> {plan.vivaAnswers[i]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Writing Instructions */}
              {plan.writingInstructions && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">📝 Writing Instructions</h3>
                  <p className="text-sm text-blue-700">{plan.writingInstructions}</p>
                </div>
              )}

              {/* Content Guidelines */}
              {plan.contentGuidelines && plan.contentGuidelines.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">📋 What to Include</h3>
                  <ul className="list-disc pl-5 text-sm text-purple-700">
                    {plan.contentGuidelines.map((guideline, i) => (
                      <li key={i}>{guideline}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
