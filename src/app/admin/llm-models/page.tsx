import { requireSuperadmin } from "@/lib/auth";
import { CreateLlmModelForm, LlmModelRow } from "./forms";

type LlmModelRow_t = {
  id: number;
  name: string;
  provider_model_id: string;
  llm_provider_id: number;
  is_temperature_supported: boolean;
  llm_providers: { name: string } | { name: string }[] | null;
};

export default async function LlmModelsPage() {
  const { supabase } = await requireSuperadmin();

  const [{ data: rows, error }, { data: providers, error: providerError }] = await Promise.all([
    supabase
      .from("llm_models")
      .select("id, name, provider_model_id, llm_provider_id, is_temperature_supported, llm_providers(name)")
      .order("id", { ascending: true }),
    supabase.from("llm_providers").select("id, name").order("id", { ascending: true }),
  ]);

  if (error) {
    throw new Error(error.message);
  }
  if (providerError) {
    throw new Error(providerError.message);
  }

  const modelRows = (rows ?? []) as LlmModelRow_t[];
  const providerList = providers ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-900 bg-emerald-950/20 p-5">
        <h2 className="text-xl font-semibold">LLM models (CRUD)</h2>
        <CreateLlmModelForm providers={providerList} />
      </section>

      <section className="space-y-3">
        {modelRows.map((row) => {
          const providerName = row.llm_providers && !Array.isArray(row.llm_providers) ? row.llm_providers.name : "unknown";
          return (
            <LlmModelRow
              key={row.id}
              row={{ ...row, providerName }}
              providers={providerList}
            />
          );
        })}
      </section>
    </div>
  );
}
