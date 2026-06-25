"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminReflection } from "@/lib/db-reflections";

interface FormData {
  surahNumber: string;
  surahName: string;
  arabicSurahName: string;
  ayahNumber: string;
  ayahEnd: string;
  title: string;
  arabicText: string;
  translation: string;
  reflection: string;
  tags: string;
  published: boolean;
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="block font-ui text-sm font-medium text-ink-soft mb-1.5">
      {children}
    </label>
  );
}

function Input({
  id, value, onChange, placeholder, required, type = "text",
}: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <input
      id={id} type={type} value={value} required={required} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-hairline bg-paper px-4 py-3 font-ui text-sm text-ink placeholder:text-ink-faint focus:border-emerald focus:outline-none"
    />
  );
}

function Textarea({
  id, value, onChange, placeholder, rows = 4, dir, className = "",
}: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; dir?: string; className?: string;
}) {
  return (
    <textarea
      id={id} value={value} rows={rows} placeholder={placeholder} dir={dir}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-xl border border-hairline bg-paper px-4 py-3 font-body text-sm text-ink placeholder:text-ink-faint focus:border-emerald focus:outline-none resize-y ${className}`}
    />
  );
}

export function ReflectionForm({
  existing,
}: {
  existing?: AdminReflection;
}) {
  const router = useRouter();
  const isEditing = !!existing;

  const [form, setForm] = useState<FormData>({
    surahNumber: existing?.surah?.toString() ?? "",
    surahName: existing?.surahName ?? "",
    arabicSurahName: existing?.arabicSurahName ?? "",
    ayahNumber: existing?.ayahStart?.toString() ?? "",
    ayahEnd: existing?.ayahEnd?.toString() ?? "",
    title: existing?.title ?? "",
    arabicText: existing?.arabic ?? "",
    translation: existing?.translation ?? "",
    reflection: existing?.content ?? "",
    tags: existing?.tags?.join(", ") ?? "",
    published: existing?.published ?? false,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishMode, setPublishMode] = useState(false);

  function set(key: keyof FormData) {
    return (value: string | boolean) =>
      setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent, publish?: boolean) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const tags = form.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      surahNumber: Number(form.surahNumber),
      surahName: form.surahName.trim(),
      arabicSurahName: form.arabicSurahName.trim(),
      ayahNumber: Number(form.ayahNumber),
      ayahEnd: Number(form.ayahEnd || form.ayahNumber),
      title: form.title.trim(),
      arabicText: form.arabicText.trim(),
      translation: form.translation.trim(),
      reflection: form.reflection.trim(),
      tags,
      published: publish !== undefined ? publish : form.published,
    };

    try {
      const url = isEditing
        ? `/api/admin/reflections/${existing!.id}`
        : "/api/admin/reflections";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to save");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
      setPublishMode(false);
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
      {/* Surah + Ayah reference */}
      <div className="rounded-2xl border border-hairline bg-paper-raised p-6">
        <h2 className="font-display text-base font-medium text-ink mb-5">Reference</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <Label htmlFor="surahNumber">Surah Number *</Label>
            <Input id="surahNumber" type="number" value={form.surahNumber} onChange={set("surahNumber")} placeholder="49" required />
          </div>
          <div>
            <Label htmlFor="surahName">Surah Name *</Label>
            <Input id="surahName" value={form.surahName} onChange={set("surahName")} placeholder="Al-Hujurat" required />
          </div>
          <div>
            <Label htmlFor="arabicSurahName">Arabic Name</Label>
            <Input id="arabicSurahName" value={form.arabicSurahName} onChange={set("arabicSurahName")} placeholder="الحجرات" />
          </div>
          <div>
            <Label htmlFor="ayahNumber">Ayah Number *</Label>
            <Input id="ayahNumber" type="number" value={form.ayahNumber} onChange={set("ayahNumber")} placeholder="11" required />
          </div>
        </div>
        <div className="mt-4 max-w-xs">
          <Label htmlFor="ayahEnd">Ayah End (if range)</Label>
          <Input id="ayahEnd" type="number" value={form.ayahEnd} onChange={set("ayahEnd")} placeholder="Leave blank for single ayah" />
        </div>
      </div>

      {/* Title */}
      <div className="rounded-2xl border border-hairline bg-paper-raised p-6">
        <Label htmlFor="title">Reflection Title *</Label>
        <Input id="title" value={form.title} onChange={set("title")} placeholder="Respect, Dignity, and the Weight of Our Words" required />
      </div>

      {/* Arabic + Translation */}
      <div className="rounded-2xl border border-hairline bg-paper-raised p-6 space-y-5">
        <h2 className="font-display text-base font-medium text-ink">Ayah</h2>
        <div>
          <Label htmlFor="arabicText">Arabic Text *</Label>
          <Textarea
            id="arabicText" value={form.arabicText} onChange={set("arabicText")}
            dir="rtl" rows={4}
            className="font-arabic text-xl leading-loose"
            placeholder="يَا أَيُّهَا الَّذِينَ آمَنُوا…"
          />
        </div>
        <div>
          <Label htmlFor="translation">Translation *</Label>
          <Textarea
            id="translation" value={form.translation} onChange={set("translation")}
            rows={3} placeholder="O believers! …"
          />
        </div>
      </div>

      {/* Reflection content */}
      <div className="rounded-2xl border border-hairline bg-paper-raised p-6">
        <div className="mb-3 flex items-center justify-between">
          <Label htmlFor="reflection">Reflection Content *</Label>
          <span className="font-ui text-xs text-ink-faint">
            Separate paragraphs with a blank line. End with &ldquo;~ Your Name&rdquo; for a signature.
          </span>
        </div>
        <Textarea
          id="reflection" value={form.reflection} onChange={set("reflection")}
          rows={16} placeholder="This morning, as part of my daily habit…"
        />
      </div>

      {/* Tags */}
      <div className="rounded-2xl border border-hairline bg-paper-raised p-6">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags" value={form.tags} onChange={set("tags")}
          placeholder="character, dignity, speech, humility"
        />
        <p className="mt-2 font-ui text-xs text-ink-faint">Comma-separated. Lowercase recommended.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 px-5 py-4 font-ui text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl border border-hairline bg-paper-raised px-6 py-3 font-ui text-sm font-medium text-ink-soft transition-colors hover:border-gold-soft hover:text-ink disabled:opacity-60"
        >
          {saving && !publishMode ? "Saving…" : "Save as draft"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={(e) => {
            setPublishMode(true);
            handleSubmit(e as unknown as React.FormEvent, true);
          }}
          className="rounded-xl bg-emerald px-6 py-3 font-ui text-sm font-medium text-paper-raised transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving && publishMode ? "Publishing…" : isEditing ? "Save & publish" : "Publish"}
        </button>

        {isEditing && existing?.published && (
          <button
            type="button"
            disabled={saving}
            onClick={(e) => {
              handleSubmit(e as unknown as React.FormEvent, false);
            }}
            className="rounded-xl border border-hairline px-6 py-3 font-ui text-sm text-ink-faint hover:text-ink disabled:opacity-60"
          >
            Unpublish
          </button>
        )}

        <a
          href="/admin"
          className="ml-auto font-ui text-sm text-ink-faint underline-offset-2 hover:underline"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
