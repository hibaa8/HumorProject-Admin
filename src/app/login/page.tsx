import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto grid w-full max-w-5xl gap-8 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 shadow-2xl backdrop-blur lg:grid-cols-[1.4fr_1fr] lg:p-10">
        <section className="space-y-6">
          <p className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
            Humor Project Admin
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Command center for profiles, images, and captions
            </h1>
            <p className="max-w-2xl text-zinc-300">
              This internal admin app gives superadmins a fast operational view
              of staging data: inspect user records, manage image entries, and
              review caption activity in one place.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <FeatureCard title="Profiles" detail="Read user and role metadata." />
            <FeatureCard title="Images" detail="Create, update, and delete image rows." />
            <FeatureCard title="Captions" detail="Review generated and featured caption content." />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-xl font-semibold">Sign in</h2>
          <p className="text-sm text-zinc-300">
            Continue with Google to access the dashboard.
          </p>

          {!googleClientId ? (
            <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              Missing GOOGLE_OAUTH_CLIENT_ID in environment variables.
            </p>
          ) : null}

          {params.error ? (
            <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              Auth error: {params.error}
            </p>
          ) : null}

          <Link
            href="/auth/signin"
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Continue with Google
          </Link>
          <p className="text-xs text-zinc-500">
            Access is restricted to users in <code>profiles</code> with{" "}
            <code>is_superadmin = true</code>.
          </p>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ title, detail }: { title: string; detail: string }) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="mt-1 text-xs text-zinc-400">{detail}</p>
    </article>
  );
}
