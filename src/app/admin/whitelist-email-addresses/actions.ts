"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export async function createWhitelistEmailAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const emailAddress = parseNullableText(formData.get("email_address"));
  if (!emailAddress) {
    throw new Error("email_address is required.");
  }

  const { error } = await supabase.from("whitelist_email_addresses").insert({
    email_address: emailAddress,
  });

  if (error) {
    throw new Error(`Could not create whitelist email: ${error.message}`);
  }

  revalidatePath("/admin/whitelist-email-addresses");
}

export async function updateWhitelistEmailAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  const emailAddress = parseNullableText(formData.get("email_address"));
  if (!id || !emailAddress) {
    throw new Error("id and email_address are required.");
  }

  const { error } = await supabase
    .from("whitelist_email_addresses")
    .update({
      email_address: emailAddress,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not update whitelist email: ${error.message}`);
  }

  revalidatePath("/admin/whitelist-email-addresses");
}

export async function deleteWhitelistEmailAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    throw new Error("id is required.");
  }

  const { error } = await supabase.from("whitelist_email_addresses").delete().eq("id", id);

  if (error) {
    throw new Error(`Could not delete whitelist email: ${error.message}`);
  }

  revalidatePath("/admin/whitelist-email-addresses");
}
