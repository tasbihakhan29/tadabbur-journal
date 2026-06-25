// Decorative Islamic geometric elements, used sparingly as the site's signature motif.
// An eight-point star (khatim al-anbiya geometric form) rendered only in hairline strokes.

export function StarDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="gold-rule h-px w-16 sm:w-24" />
      <EightPointStar className="h-4 w-4 text-gold shrink-0" />
      <span className="gold-rule h-px w-16 sm:w-24" />
    </div>
  );
}

export function EightPointStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 2 L24 14 L36 10 L26 18 L38 20 L26 22 L36 30 L24 26 L20 38 L16 26 L4 30 L14 22 L2 20 L14 18 L4 10 L16 14 Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Large, very faint watermark star for hero/section backgrounds. */
export function StarWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M100 10 L112 70 L180 50 L130 90 L190 100 L130 110 L180 150 L112 130 L100 190 L88 130 L20 150 L70 110 L10 100 L70 90 L20 50 L88 70 Z"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.4" fill="none" />
    </svg>
  );
}

/** Small corner ornament for manuscript-style framed panels. */
export function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 24 V8 a6 6 0 0 1 6-6 H24"
        stroke="currentColor"
        strokeWidth="1.1"
        fill="none"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M2 16 Q 10 16 16 2" stroke="currentColor" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

export function CrescentMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14.5 3.5A8.5 8.5 0 1 0 14.5 20.5 10 10 0 1 1 14.5 3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
