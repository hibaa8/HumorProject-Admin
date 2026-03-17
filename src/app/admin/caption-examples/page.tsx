import { requireSuperadmin } from "@/lib/auth";
import { CreateCaptionExampleForm, CaptionExampleRow } from "./forms";

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
        <CreateCaptionExampleForm />
      </section>

      <section className="space-y-4">
        {(rows ?? []).map((row) => (
          <CaptionExampleRow key={row.id} row={row} />
        ))}
      </section>
    </div>
  );
}
