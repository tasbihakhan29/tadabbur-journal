import Link from "next/link";
import { EightPointStar } from "@/components/icons/ornaments";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <EightPointStar className="h-10 w-10 text-gold" />
      <h1 className="mt-6 font-display text-3xl font-medium text-ink">
        This page could not be found
      </h1>
      <p className="mt-3 max-w-sm font-body text-ink-soft">
        The reflection you&rsquo;re looking for may have moved, or may not have been
        written yet.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-emerald px-6 py-3 font-ui text-sm text-paper-raised transition-opacity hover:opacity-90"
      >
        Return home
      </Link>
    </div>
  );
}
