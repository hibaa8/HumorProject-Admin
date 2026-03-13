import Link from "next/link";
import { requireSuperadmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireSuperadmin();

  const displayName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    profile.email ||
    "Superadmin";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-blue-300">Humor Project</p>
            <h1 className="text-xl font-semibold">Admin Area</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-300">{displayName}</p>
            <Link className="text-xs text-zinc-400 underline" href="/auth/logout" prefetch={false}>
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-2">
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin" prefetch={false}>
            Dashboard
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/profiles" prefetch={false}>
            Users / Profiles (Read)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/images" prefetch={false}>
            Images (CRUD)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/captions" prefetch={false}>
            Captions (Read)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/caption-requests" prefetch={false}>
            Caption Requests (Read)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/caption-examples" prefetch={false}>
            Caption Examples (CRUD)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/humor-flavors" prefetch={false}>
            Humor Flavors (Read)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/humor-flavor-steps" prefetch={false}>
            Humor Flavor Steps (Read)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/humor-mix" prefetch={false}>
            Humor Mix (Read/Update)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/terms" prefetch={false}>
            Terms (CRUD)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/llm-providers" prefetch={false}>
            LLM Providers (CRUD)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/llm-models" prefetch={false}>
            LLM Models (CRUD)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/llm-prompt-chains" prefetch={false}>
            LLM Prompt Chains (Read)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/llm-responses" prefetch={false}>
            LLM Responses (Read)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/allowed-signup-domains" prefetch={false}>
            Allowed Signup Domains (CRUD)
          </Link>
          <Link className="block rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800" href="/admin/whitelist-email-addresses" prefetch={false}>
            Whitelist Emails (CRUD)
          </Link>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
