import {
  createCaptionExampleAction,
  deleteCaptionExampleAction,
  updateCaptionExampleAction,
} from "@/app/admin/caption-examples/actions";
import { requireSuperadmin } from "@/lib/auth";

export default async function CaptionExamplesPage() {
  const { supabase } = await requireSuperadmin();

  const { data: rows, error } = await supabase
    .from("caption_examples")
    .select("id, image_description, caption, explanation, priority, image_id")
    .order("id", { ascending: false })
    .limit(200);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-900 bg-emerald-950/20 p-5">
        <h2 className="text-xl font-semibold">Caption examples (CRUD)</h2>
        <form action={createCaptionExampleAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="image_description" placeholder="Image description" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" />
          <textarea name="caption" placeholder="Caption" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
          <textarea name="explanation" placeholder="Explanation" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
          <input name="priority" type="number" defaultValue={0} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input name="image_id" placeholder="Image UUID (optional)" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <button className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit">Create caption example</button>
        </form>
      </section>

      <section className="space-y-4">
        {(rows ?? []).map((row) => (
          <article key={row.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-zinc-500">ID: {row.id}</p>
              <form action={deleteCaptionExampleAction}>
                <input type="hidden" name="id" value={row.id} />
                <button className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
              </form>
            </div>
            <form action={updateCaptionExampleAction} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={row.id} />
              <input name="image_description" defaultValue={row.image_description} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" />
              <textarea name="caption" defaultValue={row.caption} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
              <textarea name="explanation" defaultValue={row.explanation} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
              <input name="priority" type="number" defaultValue={row.priority ?? 0} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
              <input name="image_id" defaultValue={row.image_id ?? ""} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
              <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit">Save changes</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
