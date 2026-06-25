import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { getReflectionById } from "@/lib/db-reflections";
import { ReflectionForm } from "@/components/admin/reflection-form";

export const metadata: Metadata = { title: "Edit Reflection" };
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReflectionPage({ params }: PageProps) {
  const authed = await getAdminSession();
  if (!authed) redirect("/admin/login");

  const { id } = await params;
  const reflection = await getReflectionById(id);
  if (!reflection) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b border-hairline bg-paper-raised">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2 font-ui text-sm">
            <Link href="/admin" className="text-ink-faint hover:text-emerald">Dashboard</Link>
            <span className="text-ink-faint">/</span>
            <span className="text-ink line-clamp-1 max-w-xs">{reflection.title}</span>
          </div>
          <Link
            href={`/reflection/${reflection.surah}/${reflection.ayahStart}`}
            target="_blank"
            className="font-ui text-xs text-ink-faint hover:text-emerald"
          >
            View on site ↗
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex items-start justify-between">
          <h1 className="font-display text-3xl font-medium text-ink">Edit reflection</h1>
          <span
            className={`rounded-full px-3 py-1 font-ui text-xs ${
              reflection.published
                ? "bg-emerald/10 text-emerald"
                : "bg-paper border border-hairline text-ink-faint"
            }`}
          >
            {reflection.published ? "Published" : "Draft"}
          </span>
        </div>
        <ReflectionForm existing={reflection} />
      </main>
    </div>
  );
}
