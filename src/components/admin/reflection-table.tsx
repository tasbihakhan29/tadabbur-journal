"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminReflection } from "@/lib/db-reflections";

function formatDate(s: string) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function AdminReflectionTable({ reflections: initial }: { reflections: AdminReflection[] }) {
  const router = useRouter();
  const [reflections, setReflections] = useState(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function togglePublish(r: AdminReflection) {
    setLoadingId(r.id);
    try {
      const res = await fetch(`/api/admin/reflections/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !r.published }),
      });
      if (res.ok) {
        const { reflection: updated } = await res.json();
        setReflections((prev) =>
          prev.map((x) => (x.id === r.id ? { ...x, published: updated.published } : x))
        );
        router.refresh();
      }
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(r: AdminReflection) {
    if (!confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    setLoadingId(r.id);
    try {
      const res = await fetch(`/api/admin/reflections/${r.id}`, { method: "DELETE" });
      if (res.ok) {
        setReflections((prev) => prev.filter((x) => x.id !== r.id));
        router.refresh();
      }
    } finally {
      setLoadingId(null);
    }
  }

  if (reflections.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline-strong py-20 text-center">
        <p className="font-display text-lg text-ink-soft">No reflections yet</p>
        <p className="mt-2 font-ui text-sm text-ink-faint">
          Create your first reflection to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-paper-raised">
      <table className="w-full">
        <thead>
          <tr className="border-b border-hairline">
            {["Reference", "Title", "Tags", "Status", "Date", ""].map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left font-ui text-xs font-medium uppercase tracking-wide text-ink-faint"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reflections.map((r) => (
            <tr key={r.id} className="border-b border-hairline last:border-none hover:bg-paper">
              <td className="px-5 py-4 font-ui text-sm text-gold whitespace-nowrap">
                {r.surahName} {r.surah}:{r.ayahStart}
              </td>
              <td className="px-5 py-4">
                <span className="font-body text-sm text-ink line-clamp-1">{r.title}</span>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1">
                  {r.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full bg-emerald-soft px-2 py-0.5 font-ui text-[11px] text-emerald">
                      {t}
                    </span>
                  ))}
                  {r.tags.length > 2 && (
                    <span className="font-ui text-[11px] text-ink-faint">+{r.tags.length - 2}</span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4">
                <button
                  onClick={() => togglePublish(r)}
                  disabled={loadingId === r.id}
                  className={`rounded-full px-3 py-1 font-ui text-xs font-medium transition-colors disabled:opacity-50 ${
                    r.published
                      ? "bg-emerald/10 text-emerald hover:bg-red-50 hover:text-red-600"
                      : "bg-paper text-ink-faint hover:bg-emerald-soft hover:text-emerald"
                  }`}
                >
                  {loadingId === r.id ? "…" : r.published ? "Published" : "Draft"}
                </button>
              </td>
              <td className="px-5 py-4 font-ui text-xs text-ink-faint whitespace-nowrap">
                {formatDate(r.date)}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3 justify-end">
                  <Link
                    href={`/reflection/${r.surah}/${r.ayahStart}`}
                    target="_blank"
                    className="font-ui text-xs text-ink-faint hover:text-emerald"
                    title="View on site"
                  >
                    View ↗
                  </Link>
                  <Link
                    href={`/admin/reflections/${r.id}/edit`}
                    className="font-ui text-xs text-ink-soft hover:text-emerald"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(r)}
                    disabled={loadingId === r.id}
                    className="font-ui text-xs text-ink-faint hover:text-red-500 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
