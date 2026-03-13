"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export async function createCaptionExampleAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const imageDescription = parseNullableText(formData.get("image_description"));
  const caption = parseNullableText(formData.get("caption"));
  const explanation = parseNullableText(formData.get("explanation"));

  if (!imageDescription || !caption || !explanation) {
    throw new Error("image_description, caption, and explanation are required.");
  }

  const { error } = await supabase.from("caption_examples").insert({
    image_description: imageDescription,
    caption,
    explanation,
    priority: parseInteger(formData.get("priority")) ?? 0,
    image_id: parseNullableText(formData.get("image_id")),
  });

  if (error) {
    throw new Error(`Could not create caption example: ${error.message}`);
  }

  revalidatePath("/admin/caption-examples");
}

export async function updateCaptionExampleAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    throw new Error("Caption example id is required.");
  }

  const imageDescription = parseNullableText(formData.get("image_description"));
  const caption = parseNullableText(formData.get("caption"));
  const explanation = parseNullableText(formData.get("explanation"));

  if (!imageDescription || !caption || !explanation) {
    throw new Error("image_description, caption, and explanation are required.");
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
    throw new Error(`Could not update caption example: ${error.message}`);
  }

  revalidatePath("/admin/caption-examples");
}

export async function deleteCaptionExampleAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    throw new Error("Caption example id is required.");
  }

  const { error } = await supabase.from("caption_examples").delete().eq("id", id);

  if (error) {
    throw new Error(`Could not delete caption example: ${error.message}`);
  }

  revalidatePath("/admin/caption-examples");
}
