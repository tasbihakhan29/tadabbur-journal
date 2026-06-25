import Link from "next/link";
import type { Reflection } from "@/lib/db-reflections";

function NavArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d={direction === "left" ? "M12 4l-6 6 6 6" : "M8 4l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdjacentNav({
  prev,
  next,
}: {
  prev: Reflection | null;
  next: Reflection | null;
}) {
  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-1 gap-4 border-t border-hairline pt-10 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/reflection/${prev.surah}/${prev.ayahStart}`}
          className="group flex items-center gap-3 rounded-xl border border-hairline bg-paper-raised p-5 transition-colors hover:border-gold-soft"
        >
          <span className="text-ink-faint transition-transform group-hover:-translate-x-1">
            <NavArrow direction="left" />
          </span>
          <div className="min-w-0">
            <div className="font-ui text-xs uppercase tracking-wide text-ink-faint">
              Previous
            </div>
            <div className="mt-1 truncate font-display text-base text-ink group-hover:text-emerald">
              {prev.title}
            </div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/reflection/${next.surah}/${next.ayahStart}`}
          className="group flex items-center justify-end gap-3 rounded-xl border border-hairline bg-paper-raised p-5 text-right transition-colors hover:border-gold-soft"
        >
          <div className="min-w-0">
            <div className="font-ui text-xs uppercase tracking-wide text-ink-faint">
              Next
            </div>
            <div className="mt-1 truncate font-display text-base text-ink group-hover:text-emerald">
              {next.title}
            </div>
          </div>
          <span className="text-ink-faint transition-transform group-hover:translate-x-1">
            <NavArrow direction="right" />
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
