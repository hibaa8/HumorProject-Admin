import {
  createAllowedSignupDomainAction,
  deleteAllowedSignupDomainAction,
  updateAllowedSignupDomainAction,
} from "@/app/admin/allowed-signup-domains/actions";
import { requireSuperadmin } from "@/lib/auth";

export default async function AllowedSignupDomainsPage() {
  const { supabase } = await requireSuperadmin();

  const { data: rows, error } = await supabase
    .from("allowed_signup_domains")
    .select("id, created_datetime_utc, apex_domain")
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-900 bg-emerald-950/20 p-5">
        <h2 className="text-xl font-semibold">Allowed signup domains (CRUD)</h2>
        <form action={createAllowedSignupDomainAction} className="mt-4 flex gap-3">
          <input name="apex_domain" placeholder="example.edu" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <button className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950">Create</button>
        </form>
      </section>

      <section className="space-y-3">
        {(rows ?? []).map((row) => (
          <article key={row.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-zinc-500">ID: {row.id}</p>
              <form action={deleteAllowedSignupDomainAction}>
                <input type="hidden" name="id" value={row.id} />
                <button className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
              </form>
            </div>
            <form action={updateAllowedSignupDomainAction} className="flex gap-3">
              <input type="hidden" name="id" value={row.id} />
              <input name="apex_domain" defaultValue={row.apex_domain} className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
              <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950">Save</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
