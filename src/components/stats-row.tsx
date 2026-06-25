"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Reflection } from "@/lib/db-reflections";

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function StatsRow({
  totalReflections,
  surahsCovered,
  latest,
}: {
  totalReflections: number;
  surahsCovered: number;
  latest?: Reflection | null;
}) {
  const stats = [
    {
      label: "Reflections written",
      value: String(totalReflections).padStart(2, "0"),
    },
    {
      label: "Surahs covered",
      value: String(surahsCovered).padStart(2, "0"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="rounded-2xl border border-hairline bg-paper-raised px-7 py-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="font-display text-4xl font-medium text-emerald">
            {stat.value}
          </div>
          <div className="mt-1.5 font-ui text-sm text-ink-faint">{stat.label}</div>
        </motion.div>
      ))}

      {latest && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <Link
            href={`/reflection/${latest.surah}/${latest.ayahStart}`}
            className="group flex h-full flex-col justify-between rounded-2xl border border-gold-soft bg-gold-faint px-7 py-6 transition-colors hover:border-gold"
          >
            <div>
              <div className="font-ui text-xs uppercase tracking-wider text-gold">
                Latest reflection
              </div>
              <div className="mt-2 font-display text-lg font-medium leading-snug text-ink group-hover:text-emerald">
                {latest.title}
              </div>
            </div>
            <div className="mt-3 font-ui text-xs text-ink-faint">
              {latest.surahName} {latest.surah}:{latest.ayahStart} ·{" "}
              {formatDate(latest.date)}
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
