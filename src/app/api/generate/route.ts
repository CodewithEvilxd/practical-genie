import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generatePlanFromGemini, type GenerateMode } from "@/lib/gemini";

const bodySchema = z.object({
  mode: z.enum(["practical", "experiment"]).default("practical"),
  question: z.string().min(5),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { mode, question } = bodySchema.parse(json);
    const plan = await generatePlanFromGemini({ mode: mode as GenerateMode, question });
    return NextResponse.json({ ok: true, plan });
  } catch (error: any) {
    console.error("/api/generate error", error);
    return NextResponse.json({ ok: false, error: error?.message || "Unknown error" }, { status: 400 });
  }
}


