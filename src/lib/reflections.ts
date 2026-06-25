import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getSurahMeta } from "./surahs";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Reflection {
  slug: string; // "49-11"
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

function makeExcerpt(content: string, maxLen = 220): string {
  const plain = content
    .replace(/^#+\s.*$/gm, "")
    .replace(/[*_~`>]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

function readReflectionFile(surahDir: string, file: string): Reflection {
  const fullPath = path.join(CONTENT_DIR, surahDir, file);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const surahNum = Number(surahDir);
  const meta = getSurahMeta(surahNum);
  const ayahStart = data.ayahStart ?? Number(file.replace(/\.md$/, ""));

  return {
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
    readingTimeMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    excerpt: data.excerpt ?? makeExcerpt(content),
  };
}

let _cache: Reflection[] | null = null;

export function getAllReflections(): Reflection[] {
  if (_cache) return _cache;

  if (!fs.existsSync(CONTENT_DIR)) {
    _cache = [];
    return _cache;
  }

  const surahDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const reflections: Reflection[] = [];

  for (const dir of surahDirs) {
    const dirPath = path.join(CONTENT_DIR, dir);
    const files = fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith(".md"));
    for (const file of files) {
      reflections.push(readReflectionFile(dir, file));
    }
  }

  // Sort: surah number ascending, then ayah number ascending
  reflections.sort((a, b) => {
    if (a.surah !== b.surah) return a.surah - b.surah;
    return a.ayahStart - b.ayahStart;
  });

  _cache = reflections;
  return reflections;
}

export function getReflectionBySlug(
  surah: number,
  ayah: number
): Reflection | undefined {
  return getAllReflections().find(
    (r) => r.surah === surah && r.ayahStart === ayah
  );
}

export function getAdjacentReflections(slug: string): {
  prev: Reflection | null;
  next: Reflection | null;
} {
  const all = getAllReflections();
  const idx = all.findIndex((r) => r.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export function getReflectionsBySurah(): Map<number, Reflection[]> {
  const all = getAllReflections();
  const map = new Map<number, Reflection[]>();
  for (const r of all) {
    if (!map.has(r.surah)) map.set(r.surah, []);
    map.get(r.surah)!.push(r);
  }
  return map;
}

export function getAllTags(): string[] {
  const all = getAllReflections();
  const tagSet = new Set<string>();
  for (const r of all) {
    for (const t of r.tags) tagSet.add(t);
  }
  return Array.from(tagSet).sort();
}

export function getStats() {
  const all = getAllReflections();
  const surahsCovered = new Set(all.map((r) => r.surah)).size;
  const latest = [...all].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  return {
    totalReflections: all.length,
    surahsCovered,
    latest,
  };
}
