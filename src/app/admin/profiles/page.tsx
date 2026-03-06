import { requireSuperadmin } from "@/lib/auth";

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { supabase } = await requireSuperadmin();
  const { q } = await searchParams;

  let query = supabase
    .from("profiles")
    .select("id, email, first_name, last_name, is_superadmin, is_in_study, is_matrix_admin, created_datetime_utc")
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  if (q) {
    query = query.or(`email.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`);
  }

  const { data: profiles, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">Profiles (read-only)</h2>
        <p className="mt-1 text-sm text-zinc-400">Browse user/profile records.</p>

        <form className="mt-4 flex gap-2" method="get">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search email or name"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900">Search</button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-800 text-sm">
          <thead className="bg-zinc-900 text-left text-zinc-400">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Profile ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-950">
            {(profiles ?? []).map((profile) => (
              <tr key={profile.id}>
                <td className="px-4 py-3">{profile.email ?? "(no email)"}</td>
                <td className="px-4 py-3">
                  {[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "(no name)"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 text-xs">
                    {profile.is_superadmin ? <Badge text="superadmin" color="blue" /> : null}
                    {profile.is_matrix_admin ? <Badge text="matrix" color="violet" /> : null}
                    {profile.is_in_study ? <Badge text="in-study" color="emerald" /> : null}
                    {!profile.is_superadmin && !profile.is_matrix_admin && !profile.is_in_study ? (
                      <span className="text-zinc-500">none</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{profile.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: "blue" | "violet" | "emerald" }) {
  const cls =
    color === "blue"
      ? "bg-blue-950 text-blue-300"
      : color === "violet"
        ? "bg-violet-950 text-violet-300"
        : "bg-emerald-950 text-emerald-300";

  return <span className={`rounded px-2 py-1 ${cls}`}>{text}</span>;
}
