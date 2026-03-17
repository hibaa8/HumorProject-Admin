import { requireSuperadmin } from "@/lib/auth";
import { CreateTermForm, TermRow } from "./forms";

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
        <CreateTermForm />
      </section>

      <section className="space-y-4">
        {(terms ?? []).map((term) => (
          <TermRow key={term.id} row={term} />
        ))}
      </section>
    </div>
  );
}
