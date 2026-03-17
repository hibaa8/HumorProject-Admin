"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseChecked, parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createLlmModelAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const name = parseNullableText(formData.get("name"));
  const providerModelId = parseNullableText(formData.get("provider_model_id"));
  const llmProviderId = parseInteger(formData.get("llm_provider_id"));

  if (!name || !providerModelId || !llmProviderId) {
    return { status: "error", message: "name, provider_model_id, and llm_provider_id are required." };
  }

  const { error } = await supabase.from("llm_models").insert({
    name,
    provider_model_id: providerModelId,
    llm_provider_id: llmProviderId,
    is_temperature_supported: parseChecked(formData.get("is_temperature_supported")),
  });

  if (error) {
    return { status: "error", message: `Could not create LLM model: ${error.message}` };
  }

  revalidatePath("/admin/llm-models");
  return { status: "success", message: "LLM model created." };
}

export async function updateLlmModelAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  const name = parseNullableText(formData.get("name"));
  const providerModelId = parseNullableText(formData.get("provider_model_id"));
  const llmProviderId = parseInteger(formData.get("llm_provider_id"));

  if (!id || !name || !providerModelId || !llmProviderId) {
    return { status: "error", message: "id, name, provider_model_id, and llm_provider_id are required." };
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
    return { status: "error", message: `Could not update LLM model: ${error.message}` };
  }

  revalidatePath("/admin/llm-models");
  return { status: "success", message: "LLM model updated." };
}

export async function deleteLlmModelAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    return { status: "error", message: "Model id is required." };
  }

  const { error } = await supabase.from("llm_models").delete().eq("id", id);
  if (error) {
    return { status: "error", message: `Could not delete LLM model: ${error.message}` };
  }

  revalidatePath("/admin/llm-models");
  return { status: "success", message: "LLM model deleted." };
}
