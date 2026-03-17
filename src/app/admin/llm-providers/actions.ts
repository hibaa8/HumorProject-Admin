"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createLlmProviderAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const name = parseNullableText(formData.get("name"));
  if (!name) {
    return { status: "error", message: "Provider name is required." };
  }

  const { error } = await supabase.from("llm_providers").insert({ name });
  if (error) {
    return { status: "error", message: `Could not create LLM provider: ${error.message}` };
  }

  revalidatePath("/admin/llm-providers");
  return { status: "success", message: "LLM provider created." };
}

export async function updateLlmProviderAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  const name = parseNullableText(formData.get("name"));
  if (!id || !name) {
    return { status: "error", message: "Provider id and name are required." };
  }

  const { error } = await supabase.from("llm_providers").update({ name }).eq("id", id);
  if (error) {
    return { status: "error", message: `Could not update LLM provider: ${error.message}` };
  }

  revalidatePath("/admin/llm-providers");
  return { status: "success", message: "LLM provider updated." };
}

export async function deleteLlmProviderAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    return { status: "error", message: "Provider id is required." };
  }

  const { error } = await supabase.from("llm_providers").delete().eq("id", id);
  if (error) {
    return { status: "error", message: `Could not delete LLM provider: ${error.message}` };
  }

  revalidatePath("/admin/llm-providers");
  return { status: "success", message: "LLM provider deleted." };
}
