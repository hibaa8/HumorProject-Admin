import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-6">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Sign in</h1>
        <p className="text-zinc-600">
          Sign in with Google, then you will be redirected to the dashboard.
        </p>
      </div>

      {!googleClientId ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Missing GOOGLE_OAUTH_CLIENT_ID in environment variables.
        </p>
      ) : null}

      {params.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Auth error: {params.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Link
          href="/auth/signin"
          className="inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Continue with Google
        </Link>
      </div>
    </main>
  );
}
