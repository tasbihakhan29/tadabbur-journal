"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";
import type { Reflection } from "@/lib/db-reflections";
import { ReflectionCard } from "./reflection-card";
import { getSurahMeta } from "@/lib/surahs";

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 17l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ArchiveExplorer({
  reflections,
  allTags,
}: {
  reflections: Reflection[];
  allTags: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const fuse = useMemo(
    () =>
      new Fuse(reflections, {
        keys: ["title", "content", "tags", "surahName", "translation"],
        threshold: 0.32,
        ignoreLocation: true,
      }),
    [reflections]
  );

  const filtered = useMemo(() => {
    let results = query.trim() ? fuse.search(query.trim()).map((r) => r.item) : reflections;
    if (activeTags.length > 0) {
      results = results.filter((r) => activeTags.every((t) => r.tags.includes(t)));
    }
    return results;
  }, [query, activeTags, fuse, reflections]);

  const grouped = useMemo(() => {
    const map = new Map<number, Reflection[]>();
    for (const r of filtered) {
      if (!map.has(r.surah)) map.set(r.surah, []);
      map.get(r.surah)!.push(r);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([surah, items]) => ({
        surah,
        items: items.sort((a, b) => a.ayahStart - b.ayahStart),
      }));
  }, [filtered]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div>
      <div className="mb-10 space-y-5">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reflections, ayahs, or themes…"
            className="w-full rounded-full border border-hairline bg-paper-raised py-3.5 pl-11 pr-11 font-ui text-sm text-ink placeholder:text-ink-faint focus:border-emerald"
            style={{ boxShadow: "var(--shadow-card)" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const active = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3.5 py-1.5 font-ui text-xs transition-colors ${
                    active
                      ? "border-emerald bg-emerald text-paper-raised"
                      : "border-hairline bg-paper-raised text-ink-soft hover:border-gold-soft hover:text-ink"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
            {activeTags.length > 0 && (
              <button
                onClick={() => setActiveTags([])}
                className="rounded-full px-3.5 py-1.5 font-ui text-xs text-ink-faint underline-offset-2 hover:text-ink hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        <p className="font-ui text-xs text-ink-faint">
          {filtered.length} reflection{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {grouped.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-dashed border-hairline-strong py-20 text-center"
          >
            <p className="font-display text-lg text-ink-soft">No reflections found</p>
            <p className="mt-2 font-ui text-sm text-ink-faint">
              Try a different search term or clear your filters.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={query + activeTags.join(",")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-16"
          >
            {grouped.map(({ surah, items }) => {
              const meta = getSurahMeta(surah);
              return (
                <div key={surah}>
                  <div className="mb-6 flex items-baseline gap-3 border-b border-hairline pb-4">
                    <h2 className="font-display text-2xl font-medium text-ink">
                      {meta.name}
                    </h2>
                    {meta.arabicName && (
                      <span dir="rtl" className="font-arabic text-xl text-emerald">
                        {meta.arabicName}
                      </span>
                    )}
                    <span className="font-ui text-sm text-ink-faint">
                      Surah {surah}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((r, i) => (
                      <ReflectionCard key={r.slug} reflection={r} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
