"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createAllowedSignupDomainAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const apexDomain = parseNullableText(formData.get("apex_domain"));
  if (!apexDomain) {
    return { status: "error", message: "apex_domain is required." };
  }

  const { error } = await supabase.from("allowed_signup_domains").insert({
    apex_domain: apexDomain,
  });

  if (error) {
    return { status: "error", message: `Could not create domain: ${error.message}` };
  }

  revalidatePath("/admin/allowed-signup-domains");
  return { status: "success", message: "Domain created." };
}

export async function updateAllowedSignupDomainAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  const apexDomain = parseNullableText(formData.get("apex_domain"));
  if (!id || !apexDomain) {
    return { status: "error", message: "id and apex_domain are required." };
  }

  const { error } = await supabase
    .from("allowed_signup_domains")
    .update({ apex_domain: apexDomain })
    .eq("id", id);

  if (error) {
    return { status: "error", message: `Could not update domain: ${error.message}` };
  }

  revalidatePath("/admin/allowed-signup-domains");
  return { status: "success", message: "Domain updated." };
}

export async function deleteAllowedSignupDomainAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    return { status: "error", message: "id is required." };
  }

  const { error } = await supabase.from("allowed_signup_domains").delete().eq("id", id);

  if (error) {
    return { status: "error", message: `Could not delete domain: ${error.message}` };
  }

  revalidatePath("/admin/allowed-signup-domains");
  return { status: "success", message: "Domain deleted." };
}
