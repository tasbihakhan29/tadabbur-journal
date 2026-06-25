import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  // If already authenticated, go straight to dashboard
  const authed = await getAdminSession();
  if (authed) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            className="mx-auto mb-4 h-8 w-8 text-emerald"
          >
            <path
              d="M20 6 L23 16 L33 13 L25.5 19 L34 21 L25.5 23 L33 29 L23 26 L20 36 L17 26 L7 29 L14.5 23 L6 21 L14.5 19 L7 13 L17 16 Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <h1 className="font-display text-2xl font-medium text-ink">
            Tadabbur Journal
          </h1>
          <p className="mt-1 font-ui text-sm text-ink-faint">Admin access</p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
