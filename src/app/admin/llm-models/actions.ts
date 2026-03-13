"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseChecked, parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export async function createLlmModelAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const name = parseNullableText(formData.get("name"));
  const providerModelId = parseNullableText(formData.get("provider_model_id"));
  const llmProviderId = parseInteger(formData.get("llm_provider_id"));

  if (!name || !providerModelId || !llmProviderId) {
    throw new Error("name, provider_model_id, and llm_provider_id are required.");
  }

  const { error } = await supabase.from("llm_models").insert({
    name,
    provider_model_id: providerModelId,
    llm_provider_id: llmProviderId,
    is_temperature_supported: parseChecked(formData.get("is_temperature_supported")),
  });

  if (error) {
    throw new Error(`Could not create LLM model: ${error.message}`);
  }

  revalidatePath("/admin/llm-models");
}

export async function updateLlmModelAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  const name = parseNullableText(formData.get("name"));
  const providerModelId = parseNullableText(formData.get("provider_model_id"));
  const llmProviderId = parseInteger(formData.get("llm_provider_id"));

  if (!id || !name || !providerModelId || !llmProviderId) {
    throw new Error("id, name, provider_model_id, and llm_provider_id are required.");
  }

  const { error } = await supabase
    .from("llm_models")
    .update({
      name,
      provider_model_id: providerModelId,
      llm_provider_id: llmProviderId,
      is_temperature_supported: parseChecked(formData.get("is_temperature_supported")),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not update LLM model: ${error.message}`);
  }

  revalidatePath("/admin/llm-models");
}

export async function deleteLlmModelAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    throw new Error("Model id is required.");
  }

  const { error } = await supabase.from("llm_models").delete().eq("id", id);
  if (error) {
    throw new Error(`Could not delete LLM model: ${error.message}`);
  }

  revalidatePath("/admin/llm-models");
}
