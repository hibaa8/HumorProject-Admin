import { requireSuperadmin } from "@/lib/auth";
import { CreateAllowedSignupDomainForm, AllowedSignupDomainRow } from "./forms";

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
        <CreateAllowedSignupDomainForm />
      </section>

      <section className="space-y-3">
        {(rows ?? []).map((row) => (
          <AllowedSignupDomainRow key={row.id} row={row} />
        ))}
      </section>
    </div>
  );
}
