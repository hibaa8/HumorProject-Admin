import { requireSuperadmin } from "@/lib/auth";
import { CreateLlmProviderForm, LlmProviderRow } from "./forms";

export default async function LlmProvidersPage() {
  const { supabase } = await requireSuperadmin();

  const { data: rows, error } = await supabase
    .from("llm_providers")
    .select("id, name, created_datetime_utc")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-900 bg-emerald-950/20 p-5">
        <h2 className="text-xl font-semibold">LLM providers (CRUD)</h2>
        <CreateLlmProviderForm />
      </section>

      <section className="space-y-3">
        {(rows ?? []).map((row) => (
          <LlmProviderRow key={row.id} row={row} />
        ))}
      </section>
    </div>
  );
}
