import { EightPointStar } from "@/components/icons/ornaments";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <EightPointStar className="h-8 w-8 animate-spin text-emerald [animation-duration:2s]" />
      <p className="font-ui text-sm text-ink-faint">Loading reflection…</p>
    </div>
  );
}
