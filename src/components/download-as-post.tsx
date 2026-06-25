"use client";

import React, { useState, useRef, useCallback } from "react";
import type { Reflection } from "@/lib/db-reflections";

function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 3v9m0 0l-3-3m3 3l3-3M4 14v1a2 2 0 002 2h8a2 2 0 002-2v-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`animate-spin ${className}`}>
      <circle
        cx="10" cy="10" r="7"
        stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="32" strokeDashoffset="12"
        strokeLinecap="round"
      />
    </svg>
  );
}

function makeExcerptShort(content: string, maxLen = 180): string {
  const plain = content
    .replace(/^#+\s.*$/gm, "")
    .replace(/[*_~`>]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

function StarSVG() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <path
        d="M20 2 L24 14 L36 10 L26 18 L38 20 L26 22 L36 30 L24 26 L20 38 L16 26 L4 30 L14 22 L2 20 L14 18 L4 10 L16 14 Z"
        stroke="#B08D57"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function DownloadAsPost({ reflection }: { reflection: Reflection }) {
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const ayahRef =
    reflection.ayahStart === reflection.ayahEnd
      ? `${reflection.surah}:${reflection.ayahStart}`
      : `${reflection.surah}:${reflection.ayahStart}–${reflection.ayahEnd}`;

  const excerpt = makeExcerptShort(reflection.content);

  const handleDownload = useCallback(async () => {
    if (loading || !cardRef.current) return;
    setLoading(true);

    try {
      // Dynamically import to keep bundle lean
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 1,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `tadabbur-${reflection.surah}-${reflection.ayahStart}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
      alert("Could not generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, reflection]);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Trigger button */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 rounded-full border border-hairline bg-paper-raised px-5 py-2.5 font-ui text-sm text-ink-soft transition-colors hover:border-gold-soft hover:text-emerald disabled:opacity-60"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {loading ? (
          <SpinnerIcon className="h-4 w-4 text-gold" />
        ) : (
          <DownloadIcon className="h-4 w-4" />
        )}
        {loading ? "Generating…" : "Download as Post"}
      </button>

      {/* Off-screen card rendered at 1080×1080 for capture */}
      <div
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "1080px",
          height: "1080px",
          pointerEvents: "none",
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <div
          ref={cardRef}
          style={{
            width: "1080px",
            height: "1080px",
            background: "#FAF7F2",
            display: "flex",
            flexDirection: "column",
            padding: "80px",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background watermark star */}
          <svg
            viewBox="0 0 200 200"
            fill="none"
            style={{
              position: "absolute",
              right: "-40px",
              bottom: "-40px",
              width: "360px",
              height: "360px",
              opacity: 0.05,
            }}
          >
            <path
              d="M100 10 L112 70 L180 50 L130 90 L190 100 L130 110 L180 150 L112 130 L100 190 L88 130 L20 150 L70 110 L10 100 L70 90 L20 50 L88 70 Z"
              stroke="#1B4332"
              strokeWidth="0.6"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="100" cy="100" r="60" stroke="#1B4332" strokeWidth="0.4" fill="none" />
          </svg>

          {/* Corner ornament top-left */}
          <svg
            viewBox="0 0 48 48"
            fill="none"
            style={{ position: "absolute", left: "40px", top: "40px", width: "40px", height: "40px", opacity: 0.4 }}
          >
            <path d="M2 24 V8 a6 6 0 0 1 6-6 H24" stroke="#B08D57" strokeWidth="1.1" fill="none" />
            <circle cx="10" cy="10" r="2.5" stroke="#B08D57" strokeWidth="1" fill="none" />
          </svg>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            style={{ position: "absolute", right: "40px", top: "40px", width: "40px", height: "40px", opacity: 0.4, transform: "scaleX(-1)" }}
          >
            <path d="M2 24 V8 a6 6 0 0 1 6-6 H24" stroke="#B08D57" strokeWidth="1.1" fill="none" />
            <circle cx="10" cy="10" r="2.5" stroke="#B08D57" strokeWidth="1" fill="none" />
          </svg>

          {/* Gold top rule */}
          <div style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, #DDC8A0 20%, #B08D57 50%, #DDC8A0 80%, transparent)",
            marginBottom: "56px",
            flexShrink: 0,
          }} />

          {/* Surah reference */}
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: "13px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#B08D57",
            marginBottom: "20px",
            flexShrink: 0,
          }}>
            {reflection.surahName} · {ayahRef}
          </div>

          {/* Title */}
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: "42px",
            fontWeight: "600",
            color: "#2B2926",
            lineHeight: 1.2,
            marginBottom: "36px",
            flexShrink: 0,
          }}>
            {reflection.title}
          </div>

          {/* Gold divider with star */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px", flexShrink: 0 }}>
            <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, #DDC8A0)" }} />
            <StarSVG />
            <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, #DDC8A0)" }} />
          </div>

          {/* Excerpt */}
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: "20px",
            lineHeight: 1.75,
            color: "#5C5752",
            flex: 1,
            overflow: "hidden",
          }}>
            {excerpt}
          </div>

          {/* Bottom section */}
          <div style={{ flexShrink: 0 }}>
            {/* Tags */}
            {reflection.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
                {reflection.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "#E8EFE9",
                      color: "#1B4332",
                      borderRadius: "999px",
                      padding: "4px 14px",
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Gold rule */}
            <div style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, #DDC8A0 20%, #B08D57 50%, #DDC8A0 80%, transparent)",
              marginBottom: "24px",
            }} />

            {/* Branding footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                  <path d="M20 6 L23 16 L33 13 L25.5 19 L34 21 L25.5 23 L33 29 L23 26 L20 36 L17 26 L7 29 L14.5 23 L6 21 L14.5 19 L7 13 L17 16 Z" stroke="#1B4332" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
                </svg>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "600", color: "#2B2926" }}>
                  The Tadabbur Journal
                </span>
              </div>
              <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "12px", color: "#8C857C", letterSpacing: "0.04em" }}>
                Personal reflections · Not tafsir
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
