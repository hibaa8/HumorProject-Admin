"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export async function createLlmProviderAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const name = parseNullableText(formData.get("name"));
  if (!name) {
    throw new Error("Provider name is required.");
  }

  const { error } = await supabase.from("llm_providers").insert({ name });
  if (error) {
    throw new Error(`Could not create LLM provider: ${error.message}`);
  }

  revalidatePath("/admin/llm-providers");
}

export async function updateLlmProviderAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  const name = parseNullableText(formData.get("name"));
  if (!id || !name) {
    throw new Error("Provider id and name are required.");
  }

  const { error } = await supabase.from("llm_providers").update({ name }).eq("id", id);
  if (error) {
    throw new Error(`Could not update LLM provider: ${error.message}`);
  }

  revalidatePath("/admin/llm-providers");
}

export async function deleteLlmProviderAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    throw new Error("Provider id is required.");
  }

  const { error } = await supabase.from("llm_providers").delete().eq("id", id);
  if (error) {
    throw new Error(`Could not delete LLM provider: ${error.message}`);
  }

  revalidatePath("/admin/llm-providers");
}
