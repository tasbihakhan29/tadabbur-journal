"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Reflection } from "@/lib/db-reflections";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ReflectionCard({
  reflection,
  index = 0,
  featured = false,
}: {
  reflection: Reflection;
  index?: number;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/reflection/${reflection.surah}/${reflection.ayahStart}`}
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-paper-raised transition-all duration-300 hover:-translate-y-1 hover:border-gold-soft ${
          featured ? "p-8 sm:p-10" : "p-6 sm:p-7"
        }`}
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: "var(--shadow-card-hover)" }}
        />

        <div className="flex items-center justify-between gap-3">
          <span className="font-ui text-xs font-medium tracking-wide text-gold">
            {reflection.surahName} · {reflection.surah}:{reflection.ayahStart}
            {reflection.ayahEnd !== reflection.ayahStart ? `–${reflection.ayahEnd}` : ""}
          </span>
          <span className="font-ui text-xs text-ink-faint">
            {reflection.readingTimeMinutes} min read
          </span>
        </div>

        <h3
          className={`mt-4 font-display font-medium leading-snug text-ink transition-colors group-hover:text-emerald ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {reflection.title}
        </h3>

        <p
          className={`mt-3 font-body leading-relaxed text-ink-soft ${
            featured ? "text-base sm:text-[1.05rem]" : "text-sm"
          } ${featured ? "line-clamp-4" : "line-clamp-3"}`}
        >
          {reflection.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          {reflection.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-emerald-soft px-2.5 py-1 font-ui text-[11px] text-emerald"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4">
          <span className="font-ui text-xs text-ink-faint">
            {formatDate(reflection.date)}
          </span>
          <span className="flex items-center gap-1 font-ui text-xs font-medium text-emerald opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
            Read
            <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
