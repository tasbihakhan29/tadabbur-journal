import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  getReflectionById,
  updateReflection,
  deleteReflection,
  togglePublished,
} from "@/lib/db-reflections";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function sanitizeString(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, 50000);
}
function sanitizeNumber(n: unknown): number | undefined {
  const num = Number(n);
  return isNaN(num) ? undefined : Math.floor(num);
}
function sanitizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .filter((t) => typeof t === "string")
    .map((t) => (t as string).trim().toLowerCase().slice(0, 60))
    .filter(Boolean)
    .slice(0, 20);
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const authed = await getAdminSession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const reflection = await getReflectionById(id);
  if (!reflection) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ reflection });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const authed = await getAdminSession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // Handle publish toggle shortcut
  if ("published" in body && Object.keys(body).length === 1) {
    const updated = await togglePublished(id, body.published === true);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ reflection: updated });
  }

  // Full update
  const patch: Record<string, unknown> = {};
  if ("surahNumber" in body) patch.surahNumber = sanitizeNumber(body.surahNumber);
  if ("surahName" in body) patch.surahName = sanitizeString(body.surahName);
  if ("arabicSurahName" in body) patch.arabicSurahName = sanitizeString(body.arabicSurahName);
  if ("ayahNumber" in body) patch.ayahNumber = sanitizeNumber(body.ayahNumber);
  if ("ayahEnd" in body) patch.ayahEnd = sanitizeNumber(body.ayahEnd);
  if ("title" in body) patch.title = sanitizeString(body.title);
  if ("arabicText" in body) patch.arabicText = sanitizeString(body.arabicText);
  if ("translation" in body) patch.translation = sanitizeString(body.translation);
  if ("reflection" in body) patch.reflection = sanitizeString(body.reflection);
  if ("tags" in body) patch.tags = sanitizeTags(body.tags);
  if ("published" in body) patch.published = body.published === true;

  try {
    const updated = await updateReflection(id, patch as Parameters<typeof updateReflection>[1]);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ reflection: updated });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
      return NextResponse.json(
        { error: "A reflection for this Surah:Ayah already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const authed = await getAdminSession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deleted = await deleteReflection(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
