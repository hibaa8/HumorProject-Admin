import { requireSuperadmin } from "@/lib/auth";
import { HumorMixRowForm } from "./forms";

type HumorMixRow = {
  id: number;
  humor_flavor_id: number;
  caption_count: number;
  humor_flavors: { slug: string } | { slug: string }[] | null;
};

export default async function HumorMixPage() {
  const { supabase } = await requireSuperadmin();

  const { data: mixRows, error } = await supabase
    .from("humor_flavor_mix")
    .select("id, humor_flavor_id, caption_count, humor_flavors(slug)")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (mixRows ?? []) as HumorMixRow[];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">Humor mix (read/update)</h2>
        <p className="mt-1 text-sm text-zinc-400">Tune caption_count values in public.humor_flavor_mix.</p>
      </section>

      <section className="space-y-3">
        {rows.map((row) => {
          const flavor = row.humor_flavors && !Array.isArray(row.humor_flavors) ? row.humor_flavors.slug : "unknown";
          return (
            <HumorMixRowForm
              key={row.id}
              row={{ id: row.id, caption_count: row.caption_count, flavorLabel: `Flavor: ${flavor} (id: ${row.humor_flavor_id})` }}
            />
          );
        })}
      </section>
    </div>
  );
}
