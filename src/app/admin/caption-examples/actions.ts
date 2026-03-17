"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createCaptionExampleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const imageDescription = parseNullableText(formData.get("image_description"));
  const caption = parseNullableText(formData.get("caption"));
  const explanation = parseNullableText(formData.get("explanation"));

  if (!imageDescription || !caption || !explanation) {
    return { status: "error", message: "image_description, caption, and explanation are required." };
  }

  const { error } = await supabase.from("caption_examples").insert({
    image_description: imageDescription,
    caption,
    explanation,
    priority: parseInteger(formData.get("priority")) ?? 0,
    image_id: parseNullableText(formData.get("image_id")),
  });

  if (error) {
    return { status: "error", message: `Could not create caption example: ${error.message}` };
  }

  revalidatePath("/admin/caption-examples");
  return { status: "success", message: "Caption example created." };
}

export async function updateCaptionExampleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    return { status: "error", message: "Caption example id is required." };
  }

  const imageDescription = parseNullableText(formData.get("image_description"));
  const caption = parseNullableText(formData.get("caption"));
  const explanation = parseNullableText(formData.get("explanation"));

  if (!imageDescription || !caption || !explanation) {
    return { status: "error", message: "image_description, caption, and explanation are required." };
  }

  const { error } = await supabase
    .from("caption_examples")
    .update({
      image_description: imageDescription,
      caption,
      explanation,
      priority: parseInteger(formData.get("priority")) ?? 0,
      image_id: parseNullableText(formData.get("image_id")),
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: `Could not update caption example: ${error.message}` };
  }

  revalidatePath("/admin/caption-examples");
  return { status: "success", message: "Caption example updated." };
}

export async function deleteCaptionExampleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    return { status: "error", message: "Caption example id is required." };
  }

  const { error } = await supabase.from("caption_examples").delete().eq("id", id);

  if (error) {
    return { status: "error", message: `Could not delete caption example: ${error.message}` };
  }

  revalidatePath("/admin/caption-examples");
  return { status: "success", message: "Caption example deleted." };
}
