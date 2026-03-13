import { requireSuperadmin } from "@/lib/auth";

export default async function LlmResponsesPage() {
  const { supabase } = await requireSuperadmin();

  const { data: rows, error } = await supabase
    .from("llm_model_responses")
    .select(
      "id, created_datetime_utc, profile_id, caption_request_id, llm_model_id, humor_flavor_id, processing_time_seconds, llm_model_response"
    )
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">LLM responses (read-only)</h2>
        <p className="mt-1 text-sm text-zinc-400">Recent rows from public.llm_model_responses.</p>
      </section>

      <section className="space-y-3">
        {(rows ?? []).map((row) => (
          <article key={row.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-xs text-zinc-400">Model: {row.llm_model_id} | Flavor: {row.humor_flavor_id} | {row.processing_time_seconds}s</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">{row.llm_model_response ?? "(empty response)"}</p>
            <p className="mt-3 text-xs text-zinc-500">Request: {row.caption_request_id} | Profile: {row.profile_id}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
