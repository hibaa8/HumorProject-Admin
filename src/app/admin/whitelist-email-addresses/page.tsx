import { requireSuperadmin } from "@/lib/auth";
import { CreateWhitelistEmailForm, WhitelistEmailRow } from "./forms";

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
        <CreateWhitelistEmailForm />
      </section>

      <section className="space-y-3">
        {(rows ?? []).map((row) => (
          <WhitelistEmailRow key={row.id} row={row} />
        ))}
      </section>
    </div>
  );
}
