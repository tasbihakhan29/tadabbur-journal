import { CornerOrnament } from "./icons/ornaments";

export function AyahPanel({
  arabic,
  translation,
  reference,
}: {
  arabic: string;
  translation: string;
  reference: string;
}) {
  return (
    <div className="relative mx-auto max-w-3xl px-2">
      <div className="relative rounded-[2px] border border-gold-soft bg-paper-raised px-6 py-10 sm:px-14 sm:py-14">
        <CornerOrnament className="absolute left-2 top-2 h-7 w-7 text-gold sm:left-3 sm:top-3" />
        <CornerOrnament className="absolute right-2 top-2 h-7 w-7 -scale-x-100 text-gold sm:right-3 sm:top-3" />
        <CornerOrnament className="absolute bottom-2 left-2 h-7 w-7 -scale-y-100 text-gold sm:bottom-3 sm:left-3" />
        <CornerOrnament className="absolute bottom-2 right-2 h-7 w-7 -scale-x-100 -scale-y-100 text-gold sm:bottom-3 sm:right-3" />

        <p
          dir="rtl"
          lang="ar"
          className="font-arabic text-[1.7rem] leading-[2.3] text-ink sm:text-[2.1rem] sm:leading-[2.4]"
        >
          {arabic}
        </p>

        <div className="gold-rule mx-auto my-7 w-20" />

        <p className="text-balance font-body text-[1.05rem] italic leading-relaxed text-ink-soft sm:text-lg">
          &ldquo;{translation}&rdquo;
        </p>

        <p className="mt-5 font-ui text-xs tracking-wide text-gold">{reference}</p>
      </div>
    </div>
  );
}
