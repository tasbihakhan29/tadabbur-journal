import type { Metadata } from "next";
import { getAllReflections, getAllTags } from "@/lib/db-reflections";
import { ArchiveExplorer } from "@/components/archive-explorer";
import { StarWatermark } from "@/components/icons/ornaments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every reflection, organized by Surah and Ayah.",
};

export default async function ArchivePage() {
  const [reflections, tags] = await Promise.all([getAllReflections(), getAllTags()]);

  return (
    <div className="relative">
      <StarWatermark className="pointer-events-none absolute -right-24 top-0 h-80 w-80 text-emerald opacity-[0.04]" />

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-20">
        <div className="max-w-2xl">
          <span className="font-ui text-xs uppercase tracking-wider text-gold">
            Archive
          </span>
          <h1 className="mt-2 font-display text-4xl font-medium text-ink sm:text-5xl">
            Every reflection
          </h1>
          <p className="mt-4 font-body text-base leading-relaxed text-ink-soft">
            Organized by Surah, then by Ayah — the same order the Qur&rsquo;an itself
            holds them in. Search by theme, or filter by tag to follow a single
            thread of contemplation across the journal.
          </p>
        </div>

        <div className="mt-12">
          <ArchiveExplorer reflections={reflections} allTags={tags} />
        </div>
      </section>
    </div>
  );
}
