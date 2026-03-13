import { requireSuperadmin } from "@/lib/auth";

export default async function CaptionRequestsPage() {
  const { supabase } = await requireSuperadmin();

  const { data: requests, error } = await supabase
    .from("caption_requests")
    .select("id, created_datetime_utc, profile_id, image_id")
    .order("created_datetime_utc", { ascending: false })
    .limit(200);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">Caption requests (read-only)</h2>
        <p className="mt-1 text-sm text-zinc-400">Latest requests from public.caption_requests.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-800 text-sm">
          <thead className="bg-zinc-900 text-left text-zinc-400">
            <tr>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Profile ID</th>
              <th className="px-4 py-3">Image ID</th>
              <th className="px-4 py-3">Request ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-950">
            {(requests ?? []).map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 text-zinc-300">{new Date(row.created_datetime_utc).toLocaleString()}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{row.profile_id}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{row.image_id}</td>
                <td className="px-4 py-3">{row.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
