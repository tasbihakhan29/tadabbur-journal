/**
 * One-time migration: reads all markdown files from content/
 * and inserts them into MongoDB as published reflections.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node scripts/seed.mjs
 *
 * Safe to run multiple times — skips existing surah:ayah combinations.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../content");
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is required.");
  process.exit(1);
}

const ReflectionSchema = new mongoose.Schema(
  {
    surahNumber: { type: Number, required: true },
    surahName: { type: String, required: true },
    arabicSurahName: { type: String, default: "" },
    ayahNumber: { type: Number, required: true },
    ayahEnd: { type: Number, required: true },
    title: { type: String, required: true },
    arabicText: { type: String, required: true },
    translation: { type: String, required: true },
    reflection: { type: String, required: true },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ReflectionSchema.index({ surahNumber: 1, ayahNumber: 1 }, { unique: true });

const Reflection =
  mongoose.models.Reflection ?? mongoose.model("Reflection", ReflectionSchema);

async function main() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  if (!fs.existsSync(CONTENT_DIR)) {
    console.log("No content directory found. Nothing to seed.");
    process.exit(0);
  }

  const surahDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let inserted = 0;
  let skipped = 0;

  for (const dir of surahDirs) {
    const surahNum = Number(dir);
    if (isNaN(surahNum)) continue;

    const dirPath = path.join(CONTENT_DIR, dir);
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);

      const ayahNumber = data.ayahStart ?? Number(file.replace(/\.md$/, ""));

      // Check for existing
      const existing = await Reflection.findOne({
        surahNumber: surahNum,
        ayahNumber,
      });

      if (existing) {
        console.log(`  SKIP  ${surahNum}:${ayahNumber} — already in DB`);
        skipped++;
        continue;
      }

      await Reflection.create({
        surahNumber: surahNum,
        surahName: data.surahName ?? `Surah ${surahNum}`,
        arabicSurahName: data.arabicSurahName ?? "",
        ayahNumber,
        ayahEnd: data.ayahEnd ?? ayahNumber,
        title: data.title ?? "Untitled",
        arabicText: data.arabic ?? "",
        translation: data.translation ?? "",
        reflection: content.trim(),
        tags: data.tags ?? [],
        published: true,
      });

      console.log(`  INSERT ${surahNum}:${ayahNumber} — "${data.title}"`);
      inserted++;
    }
  }

  console.log(`\nDone. ${inserted} inserted, ${skipped} skipped.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
