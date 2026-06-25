import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getReflectionBySlug,
  getAdjacentReflections,
} from "@/lib/db-reflections";
import { siteConfig } from "@/lib/site-config";
import { AyahPanel } from "@/components/ayah-panel";
import { MarkdownProse } from "@/components/markdown-prose";
import { AdjacentNav } from "@/components/adjacent-nav";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { StarDivider } from "@/components/icons/ornaments";
import { DownloadAsPost } from "@/components/download-as-post";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ surah: string; ayah: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { surah, ayah } = await params;
  const reflection = await getReflectionBySlug(Number(surah), Number(ayah));
  if (!reflection) return {};

  return {
    title: reflection.title,
    description: reflection.excerpt,
    openGraph: {
      title: `${reflection.title} — ${siteConfig.shortName}`,
      description: reflection.excerpt,
      type: "article",
      publishedTime: reflection.date,
      tags: reflection.tags,
    },
  };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ReflectionPage({ params }: PageProps) {
  const { surah, ayah } = await params;
  const surahNum = Number(surah);
  const ayahNum = Number(ayah);
  const reflection = await getReflectionBySlug(surahNum, ayahNum);

  if (!reflection) notFound();

  const { prev, next } = await getAdjacentReflections(reflection.slug);
  const ayahRef =
    reflection.ayahStart === reflection.ayahEnd
      ? `${reflection.surah}:${reflection.ayahStart}`
      : `${reflection.surah}:${reflection.ayahStart}–${reflection.ayahEnd}`;

  return (
    <article className="relative">
      <ReadingProgressBar />

      <div className="mx-auto max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 font-ui text-xs text-ink-faint">
          <Link href="/" className="hover:text-emerald">
            Home
          </Link>
          <span>/</span>
          <Link href="/archive" className="hover:text-emerald">
            Archive
          </Link>
          <span>/</span>
          <span className="text-ink-soft">
            {reflection.surahName} {ayahRef}
          </span>
        </nav>

        {/* Header */}
        <header className="text-center">
          <span className="font-ui text-xs font-medium uppercase tracking-wider text-gold">
            {reflection.surahName}
            {reflection.arabicSurahName ? ` · ${reflection.arabicSurahName}` : ""} ·
            Ayah {ayahRef}
          </span>
          <h1 className="text-balance mt-4 font-display text-3xl font-medium leading-tight text-ink sm:text-5xl">
            {reflection.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 font-ui text-sm text-ink-faint">
            <span>{formatDate(reflection.date)}</span>
            <span aria-hidden="true">·</span>
            <span>{reflection.readingTimeMinutes} min read</span>
          </div>
        </header>

        <div className="my-10">
          <StarDivider />
        </div>

        {/* Ayah panel */}
        <AyahPanel
          arabic={reflection.arabic}
          translation={reflection.translation}
          reference={`Surah ${reflection.surahName} ${ayahRef}`}
        />

        {/* Reflection label */}
        <div className="mx-auto mt-14 mb-8 flex max-w-2xl items-center gap-3">
          <span className="rounded-full bg-emerald-soft px-3 py-1 font-ui text-xs font-medium text-emerald">
            Tadabbur · Personal Reflection
          </span>
          <span className="h-px flex-1 bg-hairline" />
        </div>

        {/* Reflection content */}
        <div className="mx-auto max-w-2xl">
          <MarkdownProse content={reflection.content} />
        </div>

        {/* Tags */}
        {reflection.tags.length > 0 && (
          <div className="mx-auto mt-12 flex max-w-2xl flex-wrap gap-2">
            {reflection.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-hairline px-3 py-1 font-ui text-xs text-ink-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Download as Post */}
        <div className="mx-auto mt-10 max-w-2xl">
          <DownloadAsPost reflection={reflection} />
        </div>

        {/* Disclaimer */}
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-hairline bg-paper-raised px-6 py-5">
          <p className="font-ui text-xs leading-relaxed text-ink-faint">
            This is a personal reflection (tadabbur), not formal tafsir. For a
            comprehensive understanding of this ayah, please consult authentic tafsir
            works and qualified scholars. Read more on{" "}
            <Link href="/about" className="text-emerald underline-offset-2 hover:underline">
              the purpose of this journal
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-2xl">
          <AdjacentNav prev={prev} next={next} />
        </div>
      </div>
    </article>
  );
}
