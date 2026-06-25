import Link from "next/link";
import { getAllReflections, getStats } from "@/lib/db-reflections";
import { Hero } from "@/components/hero";
import { StatsRow } from "@/components/stats-row";
import { ReflectionCard } from "@/components/reflection-card";
import { StarDivider } from "@/components/icons/ornaments";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [all, stats] = await Promise.all([getAllReflections(), getStats()]);
  const featured = stats.latest ?? all[0] ?? null;
  const recent = all
    .filter((r) => r.slug !== featured?.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <StatsRow
          totalReflections={stats.totalReflections}
          surahsCovered={stats.surahsCovered}
          latest={stats.latest}
        />
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="font-ui text-xs uppercase tracking-wider text-gold">
                Featured
              </span>
              <h2 className="mt-1.5 font-display text-2xl font-medium text-ink sm:text-3xl">
                This week&rsquo;s reflection
              </h2>
            </div>
          </div>
          <ReflectionCard reflection={featured} featured />
        </section>
      )}

      {recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="font-ui text-xs uppercase tracking-wider text-gold">
                Journal
              </span>
              <h2 className="mt-1.5 font-display text-2xl font-medium text-ink sm:text-3xl">
                Recent reflections
              </h2>
            </div>
            <Link
              href="/archive"
              className="hidden font-ui text-sm text-emerald underline-offset-4 hover:underline sm:block"
            >
              View archive →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r, i) => (
              <ReflectionCard key={r.slug} reflection={r} index={i} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/archive"
              className="font-ui text-sm text-emerald underline-offset-4 hover:underline"
            >
              View archive →
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 pb-8 pt-28 text-center sm:px-8">
        <StarDivider className="mb-8" />
        <p dir="rtl" className="font-arabic text-xl text-emerald sm:text-2xl">
          وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ
        </p>
        <p className="mx-auto mt-4 max-w-md font-body italic text-ink-soft">
          &ldquo;And remind, for indeed the reminder benefits the believers.&rdquo;
        </p>
      </section>
    </div>
  );
}
