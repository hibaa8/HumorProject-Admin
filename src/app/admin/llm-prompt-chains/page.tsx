import { requireSuperadmin } from "@/lib/auth";

export default async function LlmPromptChainsPage() {
  const { supabase } = await requireSuperadmin();

  const { data: rows, error } = await supabase
    .from("llm_prompt_chains")
    .select("id, created_datetime_utc, caption_request_id")
    .order("created_datetime_utc", { ascending: false })
    .limit(200);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">LLM prompt chains (read-only)</h2>
        <p className="mt-1 text-sm text-zinc-400">Inspect public.llm_prompt_chains.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-800 text-sm">
          <thead className="bg-zinc-900 text-left text-zinc-400">
            <tr>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Caption Request ID</th>
              <th className="px-4 py-3">Prompt Chain ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-950">
            {(rows ?? []).map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 text-zinc-300">{new Date(row.created_datetime_utc).toLocaleString()}</td>
                <td className="px-4 py-3">{row.caption_request_id}</td>
                <td className="px-4 py-3">{row.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
