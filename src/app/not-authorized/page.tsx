import Link from "next/link";

export default function NotAuthorizedPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-amber-600">Access Restricted</p>
        <h1 className="text-4xl font-bold tracking-tight">You are signed in, but not a superadmin</h1>
        <p className="text-zinc-600">
          This admin area allows only users where
          <code className="mx-1 rounded bg-zinc-100 px-2 py-1 text-xs">profiles.is_superadmin = TRUE</code>.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700">
        <p className="mb-2 font-semibold">How to avoid lockout</p>
        <p>
          Use Supabase SQL Editor once to promote your profile row:
          <code className="mx-1 rounded bg-white px-2 py-1 text-xs">
            update public.profiles set is_superadmin = true where id = &lt;your-auth-user-id&gt;;
          </code>
          Then sign out and sign back in.
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          This keeps RLS policies unchanged while still enforcing app-level access checks.
        </p>
      </section>

      <div className="flex items-center gap-4">
        <Link className="text-sm text-blue-600 underline" href="/login">
          Back to sign in
        </Link>
        <Link className="text-sm text-zinc-500 underline" href="/auth/logout">
          Sign out
        </Link>
      </div>
    </main>
  );
}
