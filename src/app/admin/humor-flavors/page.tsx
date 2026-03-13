import { requireSuperadmin } from "@/lib/auth";

export default async function HumorFlavorsPage() {
  const { supabase } = await requireSuperadmin();

  const { data: flavors, error } = await supabase
    .from("humor_flavors")
    .select("id, slug, description, created_datetime_utc")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">Humor flavors (read-only)</h2>
        <p className="mt-1 text-sm text-zinc-400">View configured rows in public.humor_flavors.</p>
      </section>

      <section className="space-y-3">
        {(flavors ?? []).map((flavor) => (
          <article key={flavor.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">#{flavor.id}</p>
            <h3 className="mt-2 text-lg font-semibold">{flavor.slug}</h3>
            <p className="mt-2 text-sm text-zinc-300">{flavor.description ?? "(no description)"}</p>
          </article>
        ))}

        {(flavors ?? []).length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-400">No humor flavors found.</p>
        ) : null}
      </section>
    </div>
  );
}
