import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { getAllReflectionsAdmin } from "@/lib/db-reflections";
import { AdminReflectionTable } from "@/components/admin/reflection-table";
import { AdminLogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const authed = await getAdminSession();
  if (!authed) redirect("/admin/login");

  const reflections = await getAllReflectionsAdmin();
  const published = reflections.filter((r) => r.published).length;
  const drafts = reflections.length - published;

  return (
    <div className="min-h-screen">
      {/* Admin header */}
      <header className="border-b border-hairline bg-paper-raised">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" fill="none" className="h-6 w-6 text-emerald">
              <path
                d="M20 6 L23 16 L33 13 L25.5 19 L34 21 L25.5 23 L33 29 L23 26 L20 36 L17 26 L7 29 L14.5 23 L6 21 L14.5 19 L7 13 L17 16 Z"
                stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"
              />
            </svg>
            <div>
              <span className="font-display text-base font-medium text-ink">Tadabbur Journal</span>
              <span className="ml-2 rounded bg-emerald-soft px-2 py-0.5 font-ui text-xs text-emerald">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="font-ui text-sm text-ink-soft hover:text-emerald"
            >
              View site ↗
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Stats row */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: reflections.length },
            { label: "Published", value: published },
            { label: "Drafts", value: drafts },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-hairline bg-paper-raised px-5 py-4"
            >
              <div className="font-display text-3xl font-medium text-emerald">
                {String(s.value).padStart(2, "0")}
              </div>
              <div className="mt-1 font-ui text-xs text-ink-faint">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Header + New button */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-ink">Reflections</h1>
          <Link
            href="/admin/reflections/new"
            className="flex items-center gap-2 rounded-xl bg-emerald px-5 py-2.5 font-ui text-sm font-medium text-paper-raised transition-opacity hover:opacity-90"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            New reflection
          </Link>
        </div>

        <AdminReflectionTable reflections={reflections} />
      </main>
    </div>
  );
}
