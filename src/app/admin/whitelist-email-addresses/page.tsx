import {
  createWhitelistEmailAction,
  deleteWhitelistEmailAction,
  updateWhitelistEmailAction,
} from "@/app/admin/whitelist-email-addresses/actions";
import { requireSuperadmin } from "@/lib/auth";

export default async function WhitelistEmailAddressesPage() {
  const { supabase } = await requireSuperadmin();

  const { data: rows, error } = await supabase
    .from("whitelist_email_addresses")
    .select("id, created_datetime_utc, modified_datetime_utc, email_address")
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-900 bg-emerald-950/20 p-5">
        <h2 className="text-xl font-semibold">Whitelisted e-mail addresses (CRUD)</h2>
        <form action={createWhitelistEmailAction} className="mt-4 flex gap-3">
          <input name="email_address" placeholder="student@example.edu" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <button className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950">Create</button>
        </form>
      </section>

      <section className="space-y-3">
        {(rows ?? []).map((row) => (
          <article key={row.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-zinc-500">ID: {row.id}</p>
              <form action={deleteWhitelistEmailAction}>
                <input type="hidden" name="id" value={row.id} />
                <button className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
              </form>
            </div>
            <form action={updateWhitelistEmailAction} className="flex gap-3">
              <input type="hidden" name="id" value={row.id} />
              <input name="email_address" defaultValue={row.email_address} className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
              <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950">Save</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
