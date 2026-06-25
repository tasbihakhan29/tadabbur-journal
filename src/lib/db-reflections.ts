/**
 * Async data-access layer.
 *
 * PRIMARY: MongoDB Atlas (when MONGODB_URI is set in environment).
 * FALLBACK: Static markdown files in content/ directory (for local dev
 *   without a DB, or as a graceful degradation).
 *
 * Returns the same `Reflection` shape throughout — public pages are
 * completely unaware of which backend is in use.
 */

import readingTime from "reading-time";

// ── Shared types ────────────────────────────────────────────────────────────

export interface Reflection {
  slug: string;
  surah: number;
  surahName: string;
  arabicSurahName: string;
  ayahStart: number;
  ayahEnd: number;
  title: string;
  arabic: string;
  translation: string;
  date: string;
  tags: string[];
  content: string;
  readingTimeMinutes: number;
  excerpt: string;
}

export interface AdminReflection extends Reflection {
  id: string;
  published: boolean;
  updatedAt: string;
}

export interface ReflectionInput {
  surahNumber: number;
  surahName: string;
  arabicSurahName?: string;
  ayahNumber: number;
  ayahEnd?: number;
  title: string;
  arabicText: string;
  translation: string;
  reflection: string;
  tags: string[];
  published: boolean;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeExcerpt(content: string, maxLen = 220): string {
  const plain = content
    .replace(/^#+\s.*$/gm, "")
    .replace(/[*_~`>]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

function calcReadingTime(content: string): number {
  return Math.max(1, Math.ceil(readingTime(content).minutes));
}

// ── MongoDB implementation ───────────────────────────────────────────────────

async function getMongoImpl() {
  const { connectDB } = await import("./db/connection");
  const { ReflectionModel } = await import("./db/reflection-model");
  await connectDB();
  return ReflectionModel;
}

function mongoDocToReflection(doc: Record<string, unknown>): Reflection {
  const surahNumber = doc.surahNumber as number;
  const ayahNumber = doc.ayahNumber as number;
  const content = doc.reflection as string;
  return {
    slug: `${surahNumber}-${ayahNumber}`,
    surah: surahNumber,
    surahName: doc.surahName as string,
    arabicSurahName: (doc.arabicSurahName as string) ?? "",
    ayahStart: ayahNumber,
    ayahEnd: (doc.ayahEnd as number) ?? ayahNumber,
    title: doc.title as string,
    arabic: doc.arabicText as string,
    translation: doc.translation as string,
    date: doc.createdAt
      ? new Date(doc.createdAt as string | Date).toISOString()
      : "",
    tags: (doc.tags as string[]) ?? [],
    content,
    readingTimeMinutes: calcReadingTime(content),
    excerpt: makeExcerpt(content),
  };
}

function mongoDocToAdmin(doc: Record<string, unknown>): AdminReflection {
  return {
    ...mongoDocToReflection(doc),
    id: String(doc._id),
    published: doc.published as boolean,
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt as string | Date).toISOString()
      : "",
  };
}

// ── Markdown fallback implementation ────────────────────────────────────────

let _markdownCache: Reflection[] | null = null;

async function getMarkdownReflections(): Promise<Reflection[]> {
  if (_markdownCache) return _markdownCache;

  // Dynamic imports so Next.js doesn't bundle fs/path into client chunks
  const fs = await import("fs");
  const path = await import("path");
  const matter = (await import("gray-matter")).default;
  const { getSurahMeta } = await import("./surahs");

  const CONTENT_DIR = path.join(process.cwd(), "content");
  if (!fs.existsSync(CONTENT_DIR)) {
    _markdownCache = [];
    return _markdownCache;
  }

  const surahDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d: { isDirectory(): boolean }) => d.isDirectory())
    .map((d: { name: string }) => d.name);

  const reflections: Reflection[] = [];

  for (const dir of surahDirs) {
    const surahNum = Number(dir);
    if (isNaN(surahNum)) continue;
    const dirPath = path.join(CONTENT_DIR, dir);
    const files = fs
      .readdirSync(dirPath)
      .filter((f: string) => f.endsWith(".md"));

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);
      const meta = getSurahMeta(surahNum);
      const ayahStart = data.ayahStart ?? Number(file.replace(/\.md$/, ""));

      reflections.push({
        slug: `${surahNum}-${ayahStart}`,
        surah: surahNum,
        surahName: data.surahName ?? meta.name,
        arabicSurahName: meta.arabicName,
        ayahStart,
        ayahEnd: data.ayahEnd ?? ayahStart,
        title: data.title ?? "Untitled Reflection",
        arabic: data.arabic ?? "",
        translation: data.translation ?? "",
        date: data.date ?? "",
        tags: data.tags ?? [],
        content,
        readingTimeMinutes: calcReadingTime(content),
        excerpt: data.excerpt ?? makeExcerpt(content),
      });
    }
  }

  reflections.sort((a, b) => {
    if (a.surah !== b.surah) return a.surah - b.surah;
    return a.ayahStart - b.ayahStart;
  });

  _markdownCache = reflections;
  return reflections;
}

// ── Public API — checks MONGODB_URI and routes to correct backend ────────────

function usesMongo(): boolean {
  return !!process.env.MONGODB_URI;
}

export async function getAllReflections(): Promise<Reflection[]> {
  if (!usesMongo()) return getMarkdownReflections();

  const Model = await getMongoImpl();
  const docs = await Model.find({ published: true })
    .sort({ surahNumber: 1, ayahNumber: 1 })
    .lean<Record<string, unknown>[]>();
  return docs.map(mongoDocToReflection);
}

export async function getAllReflectionsAdmin(): Promise<AdminReflection[]> {
  if (!usesMongo()) {
    const all = await getMarkdownReflections();
    return all.map((r) => ({
      ...r,
      id: r.slug,
      published: true,
      updatedAt: r.date,
    }));
  }

  const Model = await getMongoImpl();
  const docs = await Model.find({})
    .sort({ surahNumber: 1, ayahNumber: 1 })
    .lean<Record<string, unknown>[]>();
  return docs.map(mongoDocToAdmin);
}

export async function getReflectionBySlug(
  surah: number,
  ayah: number
): Promise<Reflection | null> {
  if (!usesMongo()) {
    const all = await getMarkdownReflections();
    return all.find((r) => r.surah === surah && r.ayahStart === ayah) ?? null;
  }

  const Model = await getMongoImpl();
  const doc = await Model.findOne({
    surahNumber: surah,
    ayahNumber: ayah,
    published: true,
  }).lean<Record<string, unknown>>();
  return doc ? mongoDocToReflection(doc) : null;
}

export async function getAdjacentReflections(slug: string): Promise<{
  prev: Reflection | null;
  next: Reflection | null;
}> {
  const all = await getAllReflections();
  const idx = all.findIndex((r) => r.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export async function getAllTags(): Promise<string[]> {
  if (!usesMongo()) {
    const all = await getMarkdownReflections();
    const tagSet = new Set<string>();
    for (const r of all) for (const t of r.tags) tagSet.add(t);
    return Array.from(tagSet).sort();
  }

  const Model = await getMongoImpl();
  const docs = await Model.find({ published: true })
    .select("tags")
    .lean<{ tags: string[] }[]>();
  const tagSet = new Set<string>();
  for (const doc of docs) for (const t of doc.tags ?? []) tagSet.add(t);
  return Array.from(tagSet).sort();
}

export async function getStats(): Promise<{
  totalReflections: number;
  surahsCovered: number;
  latest: Reflection | null;
}> {
  const all = await getAllReflections();
  const surahsCovered = new Set(all.map((r) => r.surah)).size;
  const latest =
    all.length > 0
      ? [...all].sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0]
      : null;
  return { totalReflections: all.length, surahsCovered, latest };
}

// ── Admin CRUD (MongoDB only) ────────────────────────────────────────────────

export async function getReflectionById(id: string): Promise<AdminReflection | null> {
  const Model = await getMongoImpl();
  const doc = await Model.findById(id).lean<Record<string, unknown>>();
  return doc ? mongoDocToAdmin(doc) : null;
}

export async function createReflection(input: ReflectionInput): Promise<AdminReflection> {
  const Model = await getMongoImpl();
  const doc = await Model.create({
    surahNumber: input.surahNumber,
    surahName: input.surahName,
    arabicSurahName: input.arabicSurahName ?? "",
    ayahNumber: input.ayahNumber,
    ayahEnd: input.ayahEnd ?? input.ayahNumber,
    title: input.title,
    arabicText: input.arabicText,
    translation: input.translation,
    reflection: input.reflection,
    tags: input.tags,
    published: input.published,
  });
  return mongoDocToAdmin(doc.toObject() as unknown as Record<string, unknown>);
}

export async function updateReflection(
  id: string,
  input: Partial<ReflectionInput>
): Promise<AdminReflection | null> {
  const Model = await getMongoImpl();
  const updateData: Record<string, unknown> = { ...input };
  if (input.ayahEnd === undefined && input.ayahNumber !== undefined) {
    updateData.ayahEnd = input.ayahNumber;
  }
  const doc = await Model.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).lean<Record<string, unknown>>();
  return doc ? mongoDocToAdmin(doc) : null;
}

export async function deleteReflection(id: string): Promise<boolean> {
  const Model = await getMongoImpl();
  const result = await Model.findByIdAndDelete(id);
  return !!result;
}

export async function togglePublished(
  id: string,
  published: boolean
): Promise<AdminReflection | null> {
  const Model = await getMongoImpl();
  const doc = await Model.findByIdAndUpdate(
    id,
    { $set: { published } },
    { new: true }
  ).lean<Record<string, unknown>>();
  return doc ? mongoDocToAdmin(doc) : null;
}
