"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";

const parseChecked = (value: FormDataEntryValue | null) => value === "on";
const parseNullableText = (value: FormDataEntryValue | null) => {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
};

export type ImageActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createImageAction(
  _prevState: ImageActionState,
  formData: FormData
): Promise<ImageActionState> {
  const { supabase, user } = await requireSuperadmin();

  const profileId = parseNullableText(formData.get("profile_id"));
  const effectiveProfileId = profileId ?? user.id;

  if (profileId && profileId !== user.id) {
    return {
      status: "error",
      message:
        "Creation blocked by row-level security. For now, set Profile UUID to your own user id or leave it empty.",
    };
  }

  const { error } = await supabase.from("images").insert({
    url: parseNullableText(formData.get("url")),
    profile_id: effectiveProfileId,
    image_description: parseNullableText(formData.get("image_description")),
    additional_context: parseNullableText(formData.get("additional_context")),
    celebrity_recognition: parseNullableText(formData.get("celebrity_recognition")),
    is_public: parseChecked(formData.get("is_public")),
    is_common_use: parseChecked(formData.get("is_common_use")),
  });

  if (error) {
    const isRlsError = /row-level security policy/i.test(error.message);
    return {
      status: "error",
      message: isRlsError
        ? "Could not create image due to row-level security. Leave Profile UUID empty to use your own account id."
        : `Could not create image: ${error.message}`,
    };
  }

  revalidatePath("/admin/images");
  revalidatePath("/admin");

  return {
    status: "success",
    message: "Image created successfully.",
  };
}

export async function updateImageAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseNullableText(formData.get("id"));
  if (!id) {
    throw new Error("Image id is required.");
  }

  const profileId = parseNullableText(formData.get("profile_id"));

  const { error } = await supabase
    .from("images")
    .update({
      url: parseNullableText(formData.get("url")),
      profile_id: profileId,
      image_description: parseNullableText(formData.get("image_description")),
      additional_context: parseNullableText(formData.get("additional_context")),
      celebrity_recognition: parseNullableText(formData.get("celebrity_recognition")),
      is_public: parseChecked(formData.get("is_public")),
      is_common_use: parseChecked(formData.get("is_common_use")),
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Update image failed: ${error.message}`);
  }

  revalidatePath("/admin/images");
  revalidatePath("/admin");
}

export async function deleteImageAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseNullableText(formData.get("id"));
  if (!id) {
    throw new Error("Image id is required.");
  }

  const { error } = await supabase.from("images").delete().eq("id", id);

  if (error) {
    throw new Error(`Delete image failed: ${error.message}`);
  }

  revalidatePath("/admin/images");
  revalidatePath("/admin");
}
