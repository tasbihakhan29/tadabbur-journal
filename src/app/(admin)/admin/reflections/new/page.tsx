import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { ReflectionForm } from "@/components/admin/reflection-form";

export const metadata: Metadata = { title: "New Reflection" };

export default async function NewReflectionPage() {
  const authed = await getAdminSession();
  if (!authed) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <header className="border-b border-hairline bg-paper-raised">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2 font-ui text-sm">
            <Link href="/admin" className="text-ink-faint hover:text-emerald">Dashboard</Link>
            <span className="text-ink-faint">/</span>
            <span className="text-ink">New reflection</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <h1 className="font-display text-3xl font-medium text-ink mb-8">
          New reflection
        </h1>
        <ReflectionForm />
      </main>
    </div>
  );
}
