"use client";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // Normalize potentially non-array fields coming from the model
  const wsNotes = Array.isArray((plan as any)?.writingStyleNotes)
    ? ((plan as any).writingStyleNotes as string[])
    : (plan as any)?.writingStyleNotes
    ? [String((plan as any).writingStyleNotes)]
    : [];
  const leftImgs = Array.isArray((plan as any)?.leftPaneImages)
    ? ((plan as any).leftPaneImages as { title: string; caption: string; suggestedSearchQuery: string; referenceDiagramDescription?: string }[])
    : [];

  function toBullets(text: string): string[] {
    if (!text) return [];
    const parts = text
      .split(/\n+|[.;]\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts;
  }

  function structureTheory(theory: string): {
    concept: string[];
    principle: string[];
    formulae: string[];
    notes: string[];
  } {
    const bullets = toBullets(theory);
    const concept: string[] = [];
    const principle: string[] = [];
    const formulae: string[] = [];
    const notes: string[] = [];
    for (const b of bullets) {
      const low = b.toLowerCase();
      if (/(definition|define|concept|meaning)\b/.test(low)) {
        concept.push(b);
      } else if (/(principle|law|theorem|rule|basis)\b/.test(low)) {
        principle.push(b);
      } else if (/(=|formula|equation|expression|proportional|∝)/.test(b)) {
        formulae.push(b);
      } else {
        notes.push(b);
      }
    }
    // Fallbacks if empty
    if (concept.length === 0 && bullets[0]) concept.push(bullets[0]);
    if (principle.length === 0 && bullets[1]) principle.push(bullets[1]);
    return { concept, principle, formulae, notes };
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

  // Heuristic guide for where to place images on the left (blank) page
  const imageGuide: { afterSection: string; title: string; caption: string; search: string; draw?: string }[] =
    leftImgs.length
      ? [
          leftImgs[0] && {
            afterSection: "Aim / Materials",
            title: leftImgs[0].title,
            caption: leftImgs[0].caption,
            search: leftImgs[0].suggestedSearchQuery,
            draw: leftImgs[0].referenceDiagramDescription,
          },
          leftImgs[1] && {
            afterSection: "Theory",
            title: leftImgs[1].title,
            caption: leftImgs[1].caption,
            search: leftImgs[1].suggestedSearchQuery,
            draw: leftImgs[1].referenceDiagramDescription,
          },
          leftImgs[2] && {
            afterSection: "Procedure",
            title: leftImgs[2].title,
            caption: leftImgs[2].caption,
            search: leftImgs[2].suggestedSearchQuery,
            draw: leftImgs[2].referenceDiagramDescription,
          },
        ].filter(Boolean) as any
      : [];

  return (
    <main className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Practical & Experiment Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
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
              <CardTitle>Write-up (Right Page)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-semibold">{plan.title}</h2>
                <div className="flex gap-2">
                  <Badge variant="secondary">Notebook</Badge>
                  <Button size="sm" variant="outline" onClick={() => copy(sectionText())}>Copy All</Button>
                </div>
              </div>
              <Separator />
              {wsNotes.length > 0 && (
                <section>
                  <h3 className="font-medium">Write like this</h3>
                  <ul className="list-disc pl-5 text-sm">
                    {wsNotes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </section>
              )}
              <section>
                <h3 className="font-medium">Aim</h3>
                <p>{plan.objectives?.[0] ?? "Write the main aim in one line."}</p>
                {plan.objectives && plan.objectives.slice(1).length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium text-sm">Objectives</h4>
                    <ul className="list-disc pl-5">
                      {plan.objectives.slice(1).map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
              <section>
                <h3 className="font-medium">Materials (Apparatus)</h3>
                <ul className="list-disc pl-5">
                  {plan.materials.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={() => copy(["Apparatus/Materials:", ...plan.materials.map((m, i) => `${i + 1}. ${m}`)].join("\n"))}>Copy</Button>
                </div>
                {imageGuide.find((g) => g.afterSection === "Aim / Materials") && (
                  <div className="mt-3 text-xs text-neutral-600">
                    <p className="font-medium">Left page (blank) image:</p>
                    {(() => {
                      const g = imageGuide.find((x) => x.afterSection === "Aim / Materials")!;
                      return (
                        <ul className="list-disc pl-5">
                          <li>Title: {g.title}</li>
                          <li>Caption: {g.caption}</li>
                          <li>Search this: {g.search}</li>
                          {g.draw ? <li>Draw: {g.draw}</li> : null}
                        </ul>
                      );
                    })()}
                  </div>
                )}
              </section>
              <section>
                <h3 className="font-medium">Theory</h3>
                {(() => {
                  const t = structureTheory(plan.theory);
                  const copyAll = () => {
                    const lines: string[] = ["Theory:"];
                    if (t.concept.length) {
                      lines.push("Definition/Concept:");
                      t.concept.forEach((p) => lines.push(`- ${p}`));
                    }
                    if (t.principle.length) {
                      lines.push("Principle:");
                      t.principle.forEach((p) => lines.push(`- ${p}`));
                    }
                    if (t.formulae.length) {
                      lines.push("Formulae:");
                      t.formulae.forEach((p) => lines.push(`- ${p}`));
                    }
                    if (t.notes.length) {
                      lines.push("Notes:");
                      t.notes.forEach((p) => lines.push(`- ${p}`));
                    }
                    copy(lines.join("\n"));
                  };
                  return (
                    <div className="space-y-3">
                      {t.concept.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Definition/Concept</h4>
                            <Button size="sm" variant="outline" onClick={() => copy(["Definition/Concept:", ...t.concept.map((p) => `- ${p}`)].join("\n"))}>Copy</Button>
                          </div>
                          <ul className="list-disc pl-5">
                            {t.concept.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {t.principle.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Principle</h4>
                            <Button size="sm" variant="outline" onClick={() => copy(["Principle:", ...t.principle.map((p) => `- ${p}`)].join("\n"))}>Copy</Button>
                          </div>
                          <ul className="list-disc pl-5">
                            {t.principle.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {t.formulae.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Formulae</h4>
                            <Button size="sm" variant="outline" onClick={() => copy(["Formulae:", ...t.formulae.map((p) => `- ${p}`)].join("\n"))}>Copy</Button>
                          </div>
                          <ul className="list-disc pl-5">
                            {t.formulae.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {t.notes.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Notes</h4>
                            <Button size="sm" variant="outline" onClick={() => copy(["Notes:", ...t.notes.map((p) => `- ${p}`)].join("\n"))}>Copy</Button>
                          </div>
                          <ul className="list-disc pl-5">
                            {t.notes.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <Button size="sm" onClick={copyAll}>Copy Entire Theory</Button>
                      </div>
                    </div>
                  );
                })()}
                {imageGuide.find((g) => g.afterSection === "Theory") && (
                  <div className="mt-3 text-xs text-neutral-600">
                    <p className="font-medium">Left page (blank) image:</p>
                    {(() => {
                      const g = imageGuide.find((x) => x.afterSection === "Theory")!;
                      return (
                        <ul className="list-disc pl-5">
                          <li>Title: {g.title}</li>
                          <li>Caption: {g.caption}</li>
                          <li>Search this: {g.search}</li>
                          {g.draw ? <li>Draw: {g.draw}</li> : null}
                        </ul>
                      );
                    })()}
                  </div>
                )}
              </section>
              <section>
                <h3 className="font-medium">Procedure</h3>
                <ol className="list-decimal pl-5 space-y-1">
                  {plan.procedure.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={() => copy(["Procedure:", ...plan.procedure.map((p, i) => `Step ${i + 1}: ${p}`)].join("\n"))}>Copy</Button>
                </div>
                {imageGuide.find((g) => g.afterSection === "Procedure") && (
                  <div className="mt-3 text-xs text-neutral-600">
                    <p className="font-medium">Left page (blank) image:</p>
                    {(() => {
                      const g = imageGuide.find((x) => x.afterSection === "Procedure")!;
                      return (
                        <ul className="list-disc pl-5">
                          <li>Title: {g.title}</li>
                          <li>Caption: {g.caption}</li>
                          <li>Search this: {g.search}</li>
                          {g.draw ? <li>Draw: {g.draw}</li> : null}
                        </ul>
                      );
                    })()}
                  </div>
                )}
              </section>
              {plan.observations && plan.observations.length > 0 && (
                <section>
                  <h3 className="font-medium">Observations</h3>
                  <ul className="list-disc pl-5">
                    {plan.observations.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" onClick={() => copy(["Observations:", ...plan.observations!.map((o, i) => `${i + 1}. ${o}`)].join("\n"))}>Copy</Button>
                  </div>
                </section>
              )}
              {plan.results && plan.results.length > 0 && (
                <section>
                  <h3 className="font-medium">Result</h3>
                  <ul className="list-disc pl-5">
                    {plan.results.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" onClick={() => copy(["Result:", ...plan.results!.map((r, i) => `${i + 1}. ${r}`)].join("\n"))}>Copy</Button>
                  </div>
                </section>
              )}
              {plan.presentationTips && plan.presentationTips.length > 0 && (
                <section>
                  <h3 className="font-medium">Presentation Tips</h3>
                  <ul className="list-disc pl-5">
                    {plan.presentationTips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" onClick={() => copy(["Presentation/Viva Tips:", ...plan.presentationTips!.map((t) => `- ${t}`)].join("\n"))}>Copy</Button>
                  </div>
                </section>
              )}
              {plan.vivaQuestions && plan.vivaQuestions.length > 0 && (
                <section>
                  <h3 className="font-medium">Viva Questions & Answers</h3>
                  <div className="space-y-3">
                    {plan.vivaQuestions.map((q, i) => (
                      <div key={i} className="border rounded-md p-3">
                        <div className="font-medium text-sm mb-1">Q{i + 1}: {q}</div>
                        {plan.vivaAnswers && plan.vivaAnswers[i] && (
                          <div className="text-sm text-muted-foreground">A: {plan.vivaAnswers[i]}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
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
              {plan.tables && plan.tables.length > 0 && (
                <section>
                  <h3 className="font-medium">Tables</h3>
                  <div className="space-y-4">
                    {plan.tables.map((tbl, idx) => (
                      <div key={idx} className="border rounded-md overflow-x-auto">
                        <div className="p-2 font-medium border-b">{tbl.title}</div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/40">
                              {tbl.headers.map((h, i) => (
                                <th key={i} className="text-left p-2 border-b">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tbl.rows.map((r, i) => (
                              <tr key={i} className="odd:bg-muted/10">
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
                </section>
              )}
              <Separator />
              <section>
                <h3 className="font-medium">Notebook-ready (Copy all)</h3>
                <pre className="whitespace-pre-wrap text-sm p-3 border rounded-md bg-muted/30">{sectionText()}</pre>
                <div className="mt-2">
                  <Button size="sm" onClick={() => copy(sectionText())}>Copy All</Button>
                </div>
              </section>
              {plan.safetyNotes && plan.safetyNotes.length > 0 && (
                <section>
                  <h3 className="font-medium">Safety</h3>
                  <ul className="list-disc pl-5">
                    {plan.safetyNotes.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </section>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
