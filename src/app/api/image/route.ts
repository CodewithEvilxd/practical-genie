import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ ok: false, error: "Missing q" }, { status: 400 });
    }
    // Use Wikipedia API to find an image for the query
    const sr = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages|images&piprop=original&generator=search&gsrsearch=${encodeURIComponent(
        query
      )}&gsrlimit=1`
    );
    if (!sr.ok) {
      return NextResponse.json({ ok: false, error: `wiki status ${sr.status}` }, { status: 500 });
    }
    const data = await sr.json();
    const pages = data?.query?.pages ? Object.values<any>(data.query.pages) : [];
    let imageUrl: string | null = null;
    if (pages.length > 0) {
      const p = pages[0] as any;
      imageUrl = p?.original?.source || null;
    }
    if (!imageUrl) {
      return NextResponse.json({ ok: false, error: "No image found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, imageUrl });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "error" }, { status: 500 });
  }
}


