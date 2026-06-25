import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAllReflectionsAdmin, createReflection, type ReflectionInput } from "@/lib/db-reflections";

function sanitizeString(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, 50000);
}

function sanitizeNumber(n: unknown): number {
  const num = Number(n);
  return isNaN(num) ? 0 : Math.floor(num);
}

function sanitizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .filter((t) => typeof t === "string")
    .map((t) => (t as string).trim().toLowerCase().slice(0, 60))
    .filter(Boolean)
    .slice(0, 20);
}

export async function GET() {
  const authed = await getAdminSession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const reflections = await getAllReflectionsAdmin();
    return NextResponse.json({ reflections });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authed = await getAdminSession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const surahNumber = sanitizeNumber(body.surahNumber);
    const ayahNumber = sanitizeNumber(body.ayahNumber);
    const title = sanitizeString(body.title);
    const arabicText = sanitizeString(body.arabicText);
    const reflection = sanitizeString(body.reflection);
    const translation = sanitizeString(body.translation);

    if (!surahNumber || !ayahNumber || !title || !arabicText || !reflection || !translation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const input: ReflectionInput = {
      surahNumber,
      surahName: sanitizeString(body.surahName),
      arabicSurahName: sanitizeString(body.arabicSurahName),
      ayahNumber,
      ayahEnd: sanitizeNumber(body.ayahEnd) || ayahNumber,
      title,
      arabicText,
      translation,
      reflection,
      tags: sanitizeTags(body.tags),
      published: body.published === true,
    };

    const created = await createReflection(input);
    return NextResponse.json({ reflection: created }, { status: 201 });
  } catch (err: unknown) {
    // Duplicate key (surah:ayah) → 409
    if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
      return NextResponse.json(
        { error: "A reflection for this Surah:Ayah already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
