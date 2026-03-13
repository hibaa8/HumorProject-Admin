"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export async function createAllowedSignupDomainAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const apexDomain = parseNullableText(formData.get("apex_domain"));
  if (!apexDomain) {
    throw new Error("apex_domain is required.");
  }

  const { error } = await supabase.from("allowed_signup_domains").insert({
    apex_domain: apexDomain,
  });

  if (error) {
    throw new Error(`Could not create domain: ${error.message}`);
  }

  revalidatePath("/admin/allowed-signup-domains");
}

export async function updateAllowedSignupDomainAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  const apexDomain = parseNullableText(formData.get("apex_domain"));
  if (!id || !apexDomain) {
    throw new Error("id and apex_domain are required.");
  }

  const { error } = await supabase
    .from("allowed_signup_domains")
    .update({ apex_domain: apexDomain })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not update domain: ${error.message}`);
  }

  revalidatePath("/admin/allowed-signup-domains");
}

export async function deleteAllowedSignupDomainAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    throw new Error("id is required.");
  }

  const { error } = await supabase.from("allowed_signup_domains").delete().eq("id", id);

  if (error) {
    throw new Error(`Could not delete domain: ${error.message}`);
  }

  revalidatePath("/admin/allowed-signup-domains");
}
