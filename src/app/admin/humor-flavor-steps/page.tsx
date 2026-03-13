import { requireSuperadmin } from "@/lib/auth";

type FlavorStepRow = {
  id: number;
  humor_flavor_id: number;
  order_by: number;
  llm_model_id: number;
  llm_temperature: number | null;
  description: string | null;
  humor_flavor_step_types: { slug: string } | { slug: string }[] | null;
  humor_flavors: { slug: string } | { slug: string }[] | null;
};

export default async function HumorFlavorStepsPage() {
  const { supabase } = await requireSuperadmin();

  const { data: steps, error } = await supabase
    .from("humor_flavor_steps")
    .select(
      "id, humor_flavor_id, order_by, llm_model_id, llm_temperature, description, humor_flavor_step_types(slug), humor_flavors(slug)"
    )
    .order("humor_flavor_id", { ascending: true })
    .order("order_by", { ascending: true })
    .limit(500);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (steps ?? []) as FlavorStepRow[];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">Humor flavor steps (read-only)</h2>
        <p className="mt-1 text-sm text-zinc-400">Ordered workflow steps from public.humor_flavor_steps.</p>
      </section>

      <section className="space-y-3">
        {rows.map((step) => {
          const flavor = step.humor_flavors && !Array.isArray(step.humor_flavors) ? step.humor_flavors.slug : "unknown";
          const stepType =
            step.humor_flavor_step_types && !Array.isArray(step.humor_flavor_step_types)
              ? step.humor_flavor_step_types.slug
              : "unknown";

          return (
            <article key={step.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-xs text-zinc-400">Flavor: {flavor}</p>
              <p className="mt-2 text-sm font-semibold">Step {step.order_by} ({stepType})</p>
              <p className="mt-2 text-sm text-zinc-300">{step.description ?? "(no description)"}</p>
              <p className="mt-3 text-xs text-zinc-500">Model ID: {step.llm_model_id} | Temp: {step.llm_temperature ?? "n/a"} | Step ID: {step.id}</p>
            </article>
          );
        })}

        {rows.length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-400">No flavor steps found.</p>
        ) : null}
      </section>
    </div>
  );
}
