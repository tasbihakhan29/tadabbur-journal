"use client";

import React, { useState, useRef, useCallback } from "react";
import type { Reflection } from "@/lib/db-reflections";

function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 3v9m0 0l-3-3m3 3l3-3M4 14v1a2 2 0 002 2h8a2 2 0 002-2v-1"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`animate-spin ${className}`}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
    </svg>
  );
}

function getReflectionText(content: string): string {
  return content
    .split("\n")
    .filter((line) => !line.trim().startsWith("~"))
    .join(" ")
    .replace(/^#+\s.*$/gm, "")
    .replace(/[*_~`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function shortenArabic(arabic: string, maxLen = 200): string {
  if (arabic.length <= maxLen) return arabic;
  return arabic.slice(0, maxLen).replace(/\s+\S*$/, "") + " …";
}

function shortenTranslation(translation: string, maxLen = 260): string {
  if (translation.length <= maxLen) return translation;
  return translation.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

/**
 * Calculate font size so the reflection text fills the available height.
 *
 * Available height for reflection text ≈ 936px (1080 - 144 padding)
 * minus fixed sections (arabic, translation, dividers, labels, bottom bar).
 * Fixed sections consume roughly 260px, leaving ~676px for reflection text.
 *
 * Formula:
 *   availableHeight = 676px
 *   lineHeight multiplier = 1.75
 *   charsPerLine ≈ columnWidth / (fontSize * 0.52)   [0.52 = avg char width ratio]
 *   linesNeeded = ceil(charCount / charsPerLine)
 *   fontSize = availableHeight / (linesNeeded * lineHeight)
 *
 * Clamped between 13px (very long text) and 26px (very short text).
 */
function calcFontSize(text: string): number {
  const charCount = text.length;
  const columnWidth = 920;   // 1080 - 160 (80px padding each side)
  const availableHeight = 660;
  const lineHeightMultiplier = 1.75;
  const avgCharWidthRatio = 0.52; // Georgia serif ratio

  // Try sizes from large to small, find the one that fits
  for (let size = 26; size >= 13; size--) {
    const charsPerLine = columnWidth / (size * avgCharWidthRatio);
    const linesNeeded = Math.ceil(charCount / charsPerLine);
    const heightNeeded = linesNeeded * size * lineHeightMultiplier;
    if (heightNeeded <= availableHeight) {
      return size;
    }
  }
  return 13; // minimum
}

export function DownloadAsPost({ reflection }: { reflection: Reflection }) {
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const ayahRef =
    reflection.ayahStart === reflection.ayahEnd
      ? `${reflection.surah}:${reflection.ayahStart}`
      : `${reflection.surah}:${reflection.ayahStart}–${reflection.ayahEnd}`;

  const reflectionText     = getReflectionText(reflection.content);
  const arabicDisplay      = shortenArabic(reflection.arabic);
  const translationDisplay = shortenTranslation(reflection.translation);
  const fontSize           = calcFontSize(reflectionText);

  const handleDownload = useCallback(async () => {
    if (loading || !cardRef.current) return;
    setLoading(true);
    try {
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
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 rounded-full border border-hairline bg-paper-raised px-5 py-2.5 font-ui text-sm text-ink-soft transition-colors hover:border-gold-soft hover:text-emerald disabled:opacity-60"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {loading
          ? <SpinnerIcon className="h-4 w-4 text-gold" />
          : <DownloadIcon className="h-4 w-4" />}
        {loading ? "Generating…" : "Download as Post"}
      </button>

      {/* Off-screen 1080×1080 card */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed", top: "-9999px", left: "-9999px",
          width: "1080px", height: "1080px",
          pointerEvents: "none", zIndex: -1,
        }}
      >
        <div
          ref={cardRef}
          style={{
            width: "1080px",
            height: "1080px",
            background: "#FAF7F2",
            display: "flex",
            flexDirection: "column",
            padding: "72px 80px",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Watermark star */}
          <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" style={{
            position: "absolute", right: "-60px", bottom: "-60px",
            width: "380px", height: "380px", opacity: 0.04, pointerEvents: "none",
          }}>
            <path
              d="M100 10 L112 70 L180 50 L130 90 L190 100 L130 110 L180 150 L112 130 L100 190 L88 130 L20 150 L70 110 L10 100 L70 90 L20 50 L88 70 Z"
              stroke="#1B4332" strokeWidth="1" strokeLinejoin="round" fill="none"
            />
            <circle cx="100" cy="100" r="60" stroke="#1B4332" strokeWidth="0.6" fill="none" />
          </svg>

          {/* Corner ornaments */}
          {([
            { left: "36px",  top: "36px",    transform: "none"         },
            { right: "36px", top: "36px",    transform: "scaleX(-1)"   },
            { left: "36px",  bottom: "36px", transform: "scaleY(-1)"   },
            { right: "36px", bottom: "36px", transform: "scale(-1,-1)" },
          ] as React.CSSProperties[]).map((s, i) => (
            <svg key={i} viewBox="0 0 48 48" fill="none"
              style={{ position: "absolute", width: "34px", height: "34px", opacity: 0.4, ...s }}>
              <path d="M2 24 V8 a6 6 0 0 1 6-6 H24" stroke="#B08D57" strokeWidth="1.2" fill="none" />
              <circle cx="10" cy="10" r="2.5" stroke="#B08D57" strokeWidth="1" fill="none" />
            </svg>
          ))}

          {/* ① Top gold rule */}
          <div style={{
            height: "1px", flexShrink: 0, marginBottom: "28px",
            background: "linear-gradient(to right, transparent, #DDC8A0 20%, #B08D57 50%, #DDC8A0 80%, transparent)",
          }} />

          {/* ② Surah reference */}
          <div style={{
            flexShrink: 0, marginBottom: "14px",
            fontFamily: "Georgia, serif",
            fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#B08D57",
          }}>
            {reflection.surahName}&nbsp;&nbsp;·&nbsp;&nbsp;{ayahRef}
          </div>

          {/* ③ Arabic ayah */}
          <div style={{
            flexShrink: 0, marginBottom: "12px",
            direction: "rtl", textAlign: "right",
            fontFamily: "'Amiri', 'Traditional Arabic', 'Arial Unicode MS', serif",
            fontSize: "20px", lineHeight: 1.8,
            color: "#1B4332",
          }}>
            {arabicDisplay}
          </div>

          {/* ④ Translation */}
          <div style={{
            flexShrink: 0, marginBottom: "16px",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: "12.5px", lineHeight: 1.55,
            color: "#5C5752",
          }}>
            &ldquo;{translationDisplay}&rdquo;
          </div>

          {/* ⑤ Divider + star */}
          <div style={{
            flexShrink: 0, marginBottom: "14px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, #DDC8A0)" }} />
            <svg width="14" height="14" viewBox="0 0 40 40" fill="none">
              <path d="M20 2 L24 14 L36 10 L26 18 L38 20 L26 22 L36 30 L24 26 L20 38 L16 26 L4 30 L14 22 L2 20 L14 18 L4 10 L16 14 Z"
                stroke="#B08D57" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
            </svg>
            <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, #DDC8A0)" }} />
          </div>

          {/* ⑥ Reflection label */}
          <div style={{
            flexShrink: 0, marginBottom: "10px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "8.5px", letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#8C857C",
          }}>
            Personal Reflection · Tadabbur
          </div>

          {/* ⑦ Reflection text — dynamically sized, flex:1 fills remaining space */}
          <div style={{
            flex: 1,
            overflow: "hidden",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: `${fontSize}px`,
            lineHeight: 1.75,
            color: "#2B2926",
          }}>
            {reflectionText}
          </div>

          {/* ⑧ Bottom section */}
          <div style={{ flexShrink: 0, marginTop: "16px" }}>

            {reflection.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                {reflection.tags.slice(0, 3).map((tag) => (
                  <span key={tag} style={{
                    background: "#E8EFE9", color: "#1B4332",
                    borderRadius: "999px", padding: "2px 10px",
                    fontFamily: "system-ui, sans-serif", fontSize: "10px",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div style={{
              height: "1px", marginBottom: "14px",
              background: "linear-gradient(to right, transparent, #DDC8A0 20%, #B08D57 50%, #DDC8A0 80%, transparent)",
            }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
                  <path d="M20 6 L23 16 L33 13 L25.5 19 L34 21 L25.5 23 L33 29 L23 26 L20 36 L17 26 L7 29 L14.5 23 L6 21 L14.5 19 L7 13 L17 16 Z"
                    stroke="#1B4332" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
                </svg>
                <span style={{
                  fontFamily: "Georgia, serif", fontSize: "13.5px",
                  fontWeight: "600", color: "#2B2926",
                }}>
                  The Tadabbur Journal
                </span>
              </div>
              <span style={{
                fontFamily: "system-ui, sans-serif", fontSize: "10px",
                color: "#8C857C", letterSpacing: "0.05em",
              }}>
                Personal reflections · Not tafsir
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}