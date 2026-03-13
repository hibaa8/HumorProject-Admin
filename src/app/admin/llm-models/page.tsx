import {
  createLlmModelAction,
  deleteLlmModelAction,
  updateLlmModelAction,
} from "@/app/admin/llm-models/actions";
import { requireSuperadmin } from "@/lib/auth";

type LlmModelRow = {
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

  const modelRows = (rows ?? []) as LlmModelRow[];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-900 bg-emerald-950/20 p-5">
        <h2 className="text-xl font-semibold">LLM models (CRUD)</h2>
        <form action={createLlmModelAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="name" placeholder="Model display name" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input name="provider_model_id" placeholder="Provider model id" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <select name="llm_provider_id" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm">
            <option value="">Select provider</option>
            {(providers ?? []).map((provider) => (
              <option key={provider.id} value={provider.id}>{provider.name}</option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="is_temperature_supported" />
            Temperature supported
          </label>
          <button className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit">Create model</button>
        </form>
      </section>

      <section className="space-y-3">
        {modelRows.map((row) => {
          const providerName = row.llm_providers && !Array.isArray(row.llm_providers) ? row.llm_providers.name : "unknown";

          return (
            <article key={row.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-zinc-500">ID: {row.id} | Provider: {providerName}</p>
                <form action={deleteLlmModelAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
                </form>
              </div>
              <form action={updateLlmModelAction} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={row.id} />
                <input name="name" defaultValue={row.name} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
                <input name="provider_model_id" defaultValue={row.provider_model_id} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
                <select name="llm_provider_id" defaultValue={row.llm_provider_id} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm">
                  {(providers ?? []).map((provider) => (
                    <option key={provider.id} value={provider.id}>{provider.name}</option>
                  ))}
                </select>
                <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                  <input type="checkbox" name="is_temperature_supported" defaultChecked={row.is_temperature_supported} />
                  Temperature supported
                </label>
                <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit">Save changes</button>
              </form>
            </article>
          );
        })}
      </section>
    </div>
  );
}
