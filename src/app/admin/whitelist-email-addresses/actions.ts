"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createWhitelistEmailAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const emailAddress = parseNullableText(formData.get("email_address"));
  if (!emailAddress) {
    return { status: "error", message: "email_address is required." };
  }

  const { error } = await supabase.from("whitelist_email_addresses").insert({
    email_address: emailAddress,
  });

  if (error) {
    return { status: "error", message: `Could not create whitelist email: ${error.message}` };
  }

  revalidatePath("/admin/whitelist-email-addresses");
  return { status: "success", message: "Email added to whitelist." };
}

export async function updateWhitelistEmailAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  const emailAddress = parseNullableText(formData.get("email_address"));
  if (!id || !emailAddress) {
    return { status: "error", message: "id and email_address are required." };
  }

  const { error } = await supabase
    .from("whitelist_email_addresses")
    .update({
      email_address: emailAddress,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: `Could not update whitelist email: ${error.message}` };
  }

  revalidatePath("/admin/whitelist-email-addresses");
  return { status: "success", message: "Email updated." };
}

export async function deleteWhitelistEmailAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    return { status: "error", message: "id is required." };
  }

  const { error } = await supabase.from("whitelist_email_addresses").delete().eq("id", id);

  if (error) {
    return { status: "error", message: `Could not delete whitelist email: ${error.message}` };
  }

  revalidatePath("/admin/whitelist-email-addresses");
  return { status: "success", message: "Email removed from whitelist." };
}
