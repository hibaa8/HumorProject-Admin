import { createTermAction, deleteTermAction, updateTermAction } from "@/app/admin/terms/actions";
import { requireSuperadmin } from "@/lib/auth";

export default async function TermsPage() {
  const { supabase } = await requireSuperadmin();

  const { data: terms, error } = await supabase
    .from("terms")
    .select("id, term, definition, example, priority, term_type_id")
    .order("id", { ascending: false })
    .limit(200);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-900 bg-emerald-950/20 p-5">
        <h2 className="text-xl font-semibold">Terms (CRUD)</h2>
        <form action={createTermAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="term" placeholder="Term" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input name="priority" type="number" defaultValue={0} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <textarea name="definition" placeholder="Definition" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
          <textarea name="example" placeholder="Example" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
          <input name="term_type_id" type="number" placeholder="Term type id (optional)" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <button className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit">Create term</button>
        </form>
      </section>

      <section className="space-y-4">
        {(terms ?? []).map((term) => (
          <article key={term.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-zinc-500">ID: {term.id}</p>
              <form action={deleteTermAction}>
                <input type="hidden" name="id" value={term.id} />
                <button className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
              </form>
            </div>
            <form action={updateTermAction} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={term.id} />
              <input name="term" defaultValue={term.term} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
              <input name="priority" type="number" defaultValue={term.priority ?? 0} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
              <textarea name="definition" defaultValue={term.definition} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
              <textarea name="example" defaultValue={term.example} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
              <input name="term_type_id" type="number" defaultValue={term.term_type_id ?? ""} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
              <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit">Save changes</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
