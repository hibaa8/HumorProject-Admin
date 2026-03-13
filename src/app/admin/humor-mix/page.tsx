import { updateHumorMixAction } from "@/app/admin/humor-mix/actions";
import { requireSuperadmin } from "@/lib/auth";

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
            <article key={row.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm text-zinc-400">Flavor: {flavor} (id: {row.humor_flavor_id})</p>
              <form action={updateHumorMixAction} className="mt-3 flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={row.id} />
                <label className="text-sm text-zinc-300">
                  Caption count
                  <input
                    type="number"
                    name="caption_count"
                    min={0}
                    defaultValue={row.caption_count}
                    className="mt-1 block rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                  />
                </label>
                <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950">Save</button>
              </form>
            </article>
          );
        })}
      </section>
    </div>
  );
}
