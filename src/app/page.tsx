"use client";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Plan = {
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
    rightPane: { heading: string; content: string }[];
  };
  leftPaneImages?: { title: string; caption: string; suggestedSearchQuery: string; referenceDiagramDescription?: string }[];
  writingStyleNotes?: string[];
  tables?: { title: string; headers: string[]; rows: string[][] }[];
};

export default function Home() {
  const [mode, setMode] = useState<"practical" | "experiment">("practical");
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
        body: JSON.stringify({ mode, question }),
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
  const rawWsNotes = plan ? (plan as unknown as { writingStyleNotes?: unknown }).writingStyleNotes : undefined;
  const wsNotes = Array.isArray(rawWsNotes)
    ? rawWsNotes as string[]
    : rawWsNotes
    ? [String(rawWsNotes)]
    : [];
  const rawLeftImgs = plan ? (plan as unknown as { leftPaneImages?: unknown }).leftPaneImages : undefined;
  const leftImgs = Array.isArray(rawLeftImgs)
    ? rawLeftImgs as { title: string; caption: string; suggestedSearchQuery: string; referenceDiagramDescription?: string }[]
    : [];

  function toBullets(text: string): string[] {
    if (!text) return [];
    const parts = text
      .split(/\n+|[.;]\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts;
  }


  function copy(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  function sectionText(): string {
    if (!plan) return "";
    const aim = plan.objectives?.[0] ? `Aim: ${plan.objectives[0]}` : "Aim: __________";
    const objectives = plan.objectives?.slice(1) ?? [];
    const materials = plan.materials ?? [];
    const theoryBullets = toBullets(plan.theory);
    const procedure = plan.procedure ?? [];
    const observations = plan.observations ?? [];
    const results = plan.results ?? [];
    const tips = plan.presentationTips ?? [];
    const lines: string[] = [];
    lines.push(aim);
    if (objectives.length) {
      lines.push("Objectives:");
      objectives.forEach((o, i) => lines.push(`${i + 1}. ${o}`));
    }
    if (materials.length) {
      lines.push("Apparatus/Materials:");
      materials.forEach((m, i) => lines.push(`${i + 1}. ${m}`));
    }
    if (theoryBullets.length) {
      lines.push("Theory (in simple points):");
      theoryBullets.forEach((t) => lines.push(`- ${t}`));
    }
    if (procedure.length) {
      lines.push("Procedure:");
      procedure.forEach((p, i) => lines.push(`Step ${i + 1}: ${p}`));
    }
    if (observations.length) {
      lines.push("Observations:");
      observations.forEach((o, i) => {
        // Normalize any table-like lines containing pipes into plain text
        if (/\|/.test(o)) {
          const cells = o
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean);
          if (cells.length > 1) {
            lines.push(`${i + 1}. ${cells.join(", ")}`);
            return;
          }
        }
        lines.push(`${i + 1}. ${o}`);
      });
    }
    if (results.length) {
      lines.push("Result:");
      results.forEach((r, i) => lines.push(`${i + 1}. ${r}`));
    }
    if (tips.length) {
      lines.push("Presentation/Viva Tips:");
      tips.forEach((t) => lines.push(`- ${t}`));
    }
    return lines.join("\n");
  }

  

  return (
    <main className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Practical & Experiment Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "practical" | "experiment")}>
            <TabsList>
              <TabsTrigger value="practical">Practical</TabsTrigger>
              <TabsTrigger value="experiment">Experiment</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-2">
            <Label htmlFor="q">Question</Label>
            <Textarea id="q" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter your practical or experiment question" />
          </div>
          <Button onClick={onGenerate} disabled={loading || !question.trim()}>
            {loading ? "Generating..." : "Generate"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {plan && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Notebook (Left Page)</CardTitle>
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
                  <h4 className="font-medium">Suggested diagrams for left (blank) page</h4>
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
              <CardTitle>Complete Practical Report</CardTitle>
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
                  <Badge className="bg-blue-200 text-blue-800 text-xs">For Notebook</Badge>
                </h3>
                <div className="space-y-3">
                  {(plan.diagramImageUrls?.length ?? 0) > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">📐 Main Diagram:</h4>
                      <p className="text-sm text-blue-600">Use this diagram on your left page (blank side)</p>
                    </div>
                  )}

                  {leftImgs.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">🖼️ Additional Images to Add:</h4>
                      <div className="space-y-2">
                        {leftImgs.map((img, i) => (
                          <div key={i} className="bg-white p-2 rounded border text-sm">
                            <div className="font-medium text-blue-800">{img.title}</div>
                            <div className="text-blue-700">{img.caption}</div>
                            <div className="text-blue-600 mt-1">
                              <strong>🔍 Search on Google:</strong> &quot;{img.suggestedSearchQuery}&quot;
                            </div>
                            {img.referenceDiagramDescription && (
                              <div className="text-blue-600 mt-1">
                                <strong>✏️ Or Draw:</strong> {img.referenceDiagramDescription}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(plan.suggestedImageSearchQueries?.length ?? 0) > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">🔍 Google Search Terms:</h4>
                      <ul className="list-disc pl-5 text-sm text-blue-600">
                        {plan.suggestedImageSearchQueries!.map((query, i) => (
                          <li key={i}>&quot;{query}&quot;</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">📓 Notebook Layout:</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div>• <strong>Left Page:</strong> Diagrams and images</div>
                      <div>• <strong>Right Page:</strong> Written content (below)</div>
                      <div>• Search images on Google and paste/print them</div>
                      <div>• Draw diagrams if you can&apos;t find suitable images</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Practical Report Structure */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">📝 What to Write (Complete Report)</h3>

                {/* 1. Aim */}
                <section className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    1️⃣ 📋 Aim & Objectives
                  </h4>
                  <div className="space-y-2">
                    <div className="font-medium">Aim:</div>
                    <div className="ml-4 text-gray-700">{plan.objectives?.[0] ?? "Write the main aim in one line."}</div>
                    {plan.objectives && plan.objectives.slice(1).length > 0 && (
                      <div className="mt-3">
                        <div className="font-medium">Objectives:</div>
                        <ul className="list-disc pl-8 text-gray-700">
                          {plan.objectives.slice(1).map((o, i) => (
                            <li key={i}>{o}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" onClick={() => {
                      const lines = ["Aim:", plan.objectives?.[0] ?? "__________"];
                      if (plan.objectives && plan.objectives.slice(1).length > 0) {
                        lines.push("Objectives:");
                        plan.objectives.slice(1).forEach((o, i) => lines.push(`${i + 1}. ${o}`));
                      }
                      copy(lines.join("\n"));
                    }}>Copy</Button>
                  </div>
                </section>

                {/* 2. Materials */}
                <section className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    2️⃣ 🛠️ Materials (Apparatus)
                  </h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {plan.materials.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" onClick={() => copy(["Apparatus/Materials:", ...plan.materials.map((m, i) => `${i + 1}. ${m}`)].join("\n"))}>Copy</Button>
                  </div>
                </section>

                {/* 3. Theory */}
                <section className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2 text-lg">
                    3️⃣ 🧪 Theory & Background
                    <Badge className="bg-yellow-200 text-yellow-800 text-xs">IMPORTANT</Badge>
                  </h4>
                  <div className="bg-white p-4 rounded border mb-4">
                    <div className="space-y-4">
                      {/* Definition/Concept */}
                      <div className="border-l-4 border-blue-400 pl-3">
                        <h5 className="font-semibold text-blue-800 mb-2">📖 Definition/Concept</h5>
                        <div className="text-sm text-gray-700">
                          <p className="mb-2">Write what the experiment is about and basic concepts:</p>
                          <div className="bg-blue-50 p-2 rounded text-sm">
                            {(() => {
                              const bullets = plan.theory.split(/[.;]\s+/).filter(s => s.trim());
                              const definition = bullets.find(b => /(definition|define|concept|meaning|about)\b/i.test(b)) || bullets[0];
                              return definition || "Define the basic concept and what this experiment demonstrates.";
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Principle/Law */}
                      <div className="border-l-4 border-green-400 pl-3">
                        <h5 className="font-semibold text-green-800 mb-2">⚖️ Principle/Law</h5>
                        <div className="text-sm text-gray-700">
                          <p className="mb-2">Write the scientific principle or law this experiment is based on:</p>
                          <div className="bg-green-50 p-2 rounded text-sm">
                            {(() => {
                              const bullets = plan.theory.split(/[.;]\s+/).filter(s => s.trim());
                              const principle = bullets.find(b => /(principle|law|theorem|rule|basis|states? that)\b/i.test(b)) || bullets[1];
                              return principle || "State the scientific principle or law that governs this experiment.";
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Formulae/Equations */}
                      <div className="border-l-4 border-purple-400 pl-3">
                        <h5 className="font-semibold text-purple-800 mb-2">🔢 Formulae/Equations</h5>
                        <div className="text-sm text-gray-700">
                          <p className="mb-2">Write all relevant formulae with proper symbols:</p>
                          <div className="bg-purple-50 p-2 rounded text-sm">
                            {(() => {
                              const bullets = plan.theory.split(/[.;]\s+/).filter(s => s.trim());
                              const formulae = bullets.filter(b => /=|∝|∝|×|÷|±|formula|equation/i.test(b));
                              return formulae.length > 0 ? formulae.join('\n') : "Write relevant mathematical formulae used in this experiment.";
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Working/Procedure Theory */}
                      <div className="border-l-4 border-orange-400 pl-3">
                        <h5 className="font-semibold text-orange-800 mb-2">⚙️ How It Works</h5>
                        <div className="text-sm text-gray-700">
                          <p className="mb-2">Explain how the experiment works step-by-step theoretically:</p>
                          <div className="bg-orange-50 p-2 rounded text-sm">
                            {(() => {
                              const bullets = plan.theory.split(/[.;]\s+/).filter(s => s.trim());
                              const working = bullets.filter(b => /(work|process|method|technique|procedure)/i.test(b));
                              return working.length > 0 ? working.join('\n') : "Explain the theoretical working principle of the experiment.";
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Applications */}
                      <div className="border-l-4 border-red-400 pl-3">
                        <h5 className="font-semibold text-red-800 mb-2">💡 Applications</h5>
                        <div className="text-sm text-gray-700">
                          <p className="mb-2">Write where this principle is used in real life:</p>
                          <div className="bg-red-50 p-2 rounded text-sm">
                            {(() => {
                              const bullets = plan.theory.split(/[.;]\s+/).filter(s => s.trim());
                              const applications = bullets.filter(b => /(used?|application|real life|practical|everyday)/i.test(b));
                              return applications.length > 0 ? applications.join('\n') : "Mention real-life applications of this principle.";
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-100 p-3 rounded border border-yellow-300 mb-3">
                    <h5 className="font-semibold text-yellow-800 mb-2">📝 What to Write in Your Notebook:</h5>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div>• <strong>Definition:</strong> What is this experiment about?</div>
                      <div>• <strong>Principle:</strong> Which scientific law/principle does it demonstrate?</div>
                      <div>• <strong>Formulae:</strong> All mathematical equations with symbols</div>
                      <div>• <strong>Working:</strong> How does it work theoretically?</div>
                      <div>• <strong>Applications:</strong> Where is this used in real life?</div>
                      <div>• <strong>Assumptions:</strong> What conditions must be true?</div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => {
                      const theoryText = [
                        "THEORY:",
                        "",
                        "Definition/Concept:",
                        (() => {
                          const bullets = plan.theory.split(/[.;]\s+/).filter(s => s.trim());
                          return bullets.find(b => /(definition|define|concept|meaning|about)\b/i.test(b)) || bullets[0] || "__________";
                        })(),
                        "",
                        "Principle/Law:",
                        (() => {
                          const bullets = plan.theory.split(/[.;]\s+/).filter(s => s.trim());
                          return bullets.find(b => /(principle|law|theorem|rule|basis|states? that)\b/i.test(b)) || bullets[1] || "__________";
                        })(),
                        "",
                        "Formulae:",
                        (() => {
                          const bullets = plan.theory.split(/[.;]\s+/).filter(s => s.trim());
                          const formulae = bullets.filter(b => /=|∝|∝|×|÷|±|formula|equation/i.test(b));
                          return formulae.length > 0 ? formulae.join('\n') : "__________";
                        })(),
                        "",
                        "Working Principle:",
                        (() => {
                          const bullets = plan.theory.split(/[.;]\s+/).filter(s => s.trim());
                          const working = bullets.filter(b => /(work|process|method|technique|procedure)/i.test(b));
                          return working.length > 0 ? working.join('\n') : "__________";
                        })(),
                        "",
                        "Applications:",
                        (() => {
                          const bullets = plan.theory.split(/[.;]\s+/).filter(s => s.trim());
                          const applications = bullets.filter(b => /(used?|application|real life|practical|everyday)/i.test(b));
                          return applications.length > 0 ? applications.join('\n') : "__________";
                        })()
                      ].join('\n');
                      copy(theoryText);
                    }}>Copy Complete Theory</Button>
                    <Button size="sm" variant="outline" onClick={() => copy(plan.theory)}>Copy Raw Theory</Button>
                  </div>
                </section>

                {/* 4. Procedure */}
                <section className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                    4️⃣ 📋 Procedure Steps
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                    {plan.procedure.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" onClick={() => copy(["Procedure:", ...plan.procedure.map((p, i) => `Step ${i + 1}: ${p}`)].join("\n"))}>Copy</Button>
                  </div>
                </section>

                {/* 5. Observations */}
                {plan.observations && plan.observations.length > 0 && (
                  <section className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      5️⃣ 📊 Observations & Data
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      {plan.observations.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" onClick={() => copy(["Observations:", ...plan.observations!.map((o, i) => `${i + 1}. ${o}`)].join("\n"))}>Copy</Button>
                    </div>
                  </section>
                )}

                {/* 6. Result */}
                {plan.results && plan.results.length > 0 && (
                  <section className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                      6️⃣ 📈 Result & Calculations
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      {plan.results.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" onClick={() => copy(["Result:", ...plan.results!.map((r, i) => `${i + 1}. ${r}`)].join("\n"))}>Copy</Button>
                    </div>
                  </section>
                )}

                {/* 7. Safety Notes */}
                {plan.safetyNotes && plan.safetyNotes.length > 0 && (
                  <section className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      ⚠️ Safety Precautions
                    </h4>
                    <ul className="list-disc pl-5 text-red-700">
                      {plan.safetyNotes.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Tables */}
                {plan.tables && plan.tables.length > 0 && (
                  <section className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2 text-lg">
                      📊 Data Tables
                      <Badge className="bg-teal-200 text-teal-800 text-xs">For Recording Data</Badge>
                    </h4>

                    <div className="bg-white p-3 rounded border mb-4">
                      <h5 className="font-medium text-teal-800 mb-2">📝 How to Create Tables in Your Notebook:</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div>• Draw neat columns and rows with ruler</div>
                        <div>• Write headings clearly in the first row</div>
                        <div>• Leave space for multiple readings (at least 5-6 rows)</div>
                        <div>• Include units in column headings (e.g., &quot;Length (cm)&quot;)</div>
                        <div>• Use pencil for easy corrections</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {plan.tables.map((tbl, idx) => (
                        <div key={idx} className="border-2 border-teal-300 rounded-lg overflow-hidden bg-white">
                          <div className="p-3 font-semibold border-b-2 border-teal-200 bg-teal-100 text-teal-800 text-sm">
                            {tbl.title}
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-base border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-teal-50 border-b-2 border-teal-200">
                                  {tbl.headers.map((h, i) => (
                                    <th key={i} className="text-left p-3 font-semibold text-black border-r border-teal-200 last:border-r-0">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {tbl.rows.map((r, i) => (
                                  <tr key={i} className="border-b border-gray-200 hover:bg-teal-25">
                                    {r.map((c, j) => (
                                      <td key={j} className="p-3 border-r border-gray-200 last:border-r-0 align-top font-bold text-black">
                                        {c}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                                {/* Add empty rows for students to fill */}
                                {Array.from({ length: 3 }, (_, emptyRowIndex) => (
                                  <tr key={`empty-${emptyRowIndex}`} className="border-b border-gray-200 bg-gray-50">
                                    {tbl.headers.map((_, colIndex) => (
                                      <td key={colIndex} className="p-3 border-r border-gray-200 last:border-r-0 text-black text-center font-bold">
                                        ______
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="p-3 bg-teal-50 border-t border-teal-200">
                            <div className="text-xs text-teal-700 space-y-1">
                              <div><strong>Columns:</strong> {tbl.headers.length} | <strong>Sample Rows:</strong> {tbl.rows.length} | <strong>Empty Rows for Data:</strong> 3</div>
                              <div><em>Copy this table structure to your notebook and fill in your actual readings</em></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-yellow-50 p-3 rounded border border-yellow-300 mt-4">
                      <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes for Data Tables:</h5>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <div>• Take at least 5 readings for each measurement</div>
                        <div>• Record all raw data before calculating averages</div>
                        <div>• Include units for all measurements</div>
                        <div>• Calculate mean, and note any unusual readings</div>
                        <div>• Show your calculations clearly</div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap mt-4">
                      <Button size="sm" variant="outline" onClick={() => {
                        const tableText = plan.tables!.map((tbl, idx) => {
                          const lines = [
                            `Table ${idx + 1}: ${tbl.title}`,
                            "",
                            tbl.headers.join(" | "),
                            "-".repeat(tbl.headers.join(" | ").length),
                            ...tbl.rows.map(r => r.join(" | ")),
                            "",
                            "(Add 3-5 more rows for your actual readings)",
                            ""
                          ];
                          return lines.join("\n");
                        }).join("\n");
                        copy(tableText);
                      }}>Copy All Tables</Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        const instructions = [
                          "DATA TABLES INSTRUCTIONS:",
                          "",
                          "1. Draw neat table with columns and rows",
                          "2. Write headings with units (e.g., Length (cm))",
                          "3. Take 5-6 readings for each measurement",
                          "4. Record raw data first, then calculate averages",
                          "5. Show all calculations clearly",
                          "",
                          "Table Structures:",
                          ...plan.tables!.map((tbl) => `• ${tbl.title} (${tbl.headers.length} columns)`),
                        ].join("\n");
                        copy(instructions);
                      }}>Copy Instructions</Button>
                    </div>
                  </section>
                )}

                {/* Presentation Tips */}
                {plan.presentationTips && plan.presentationTips.length > 0 && (
                  <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      💡 Presentation & Viva Tips
                    </h4>
                    <ul className="list-disc pl-5 text-blue-700">
                      {plan.presentationTips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" onClick={() => copy(["Presentation/Viva Tips:", ...plan.presentationTips!.map((t) => `- ${t}`)].join("\n"))}>Copy</Button>
                    </div>
                  </section>
                )}

                {/* Viva Questions */}
                {plan.vivaQuestions && plan.vivaQuestions.length > 0 && (
                  <section className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      ❓ Viva Questions & Answers
                      <Badge className="bg-red-200 text-red-800 text-xs">Practice These</Badge>
                    </h4>
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
                    <div className="mt-3">
                      <Button size="sm" variant="outline" onClick={() => {
                        const lines = ["Viva Questions & Answers:"];
                        plan.vivaQuestions!.forEach((q, i) => {
                          lines.push(`Q${i + 1}: ${q}`);
                          if (plan.vivaAnswers && plan.vivaAnswers[i]) {
                            lines.push(`A: ${plan.vivaAnswers[i]}`);
                          }
                          lines.push("");
                        });
                        copy(lines.join("\n"));
                      }}>Copy</Button>
                    </div>
                  </section>
                )}
              </div>

              {/* Writing Instructions */}
              {wsNotes.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">📝 Writing Instructions</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {wsNotes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Copy All Section */}
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  📋 Complete Practical Report (Copy Everything)
                  <Badge className="bg-green-200 text-green-800 text-xs">Ready to Copy</Badge>
                </h3>
                <pre className="whitespace-pre-wrap text-sm p-3 border rounded-md bg-white text-gray-800 max-h-60 overflow-y-auto">{sectionText()}</pre>
                <div className="mt-3">
                  <Button size="sm" onClick={() => copy(sectionText())}>Copy Complete Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
