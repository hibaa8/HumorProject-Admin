"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger } from "@/lib/admin/form-utils";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function updateHumorMixAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  const captionCount = parseInteger(formData.get("caption_count"));

  if (!id || captionCount === null) {
    return { status: "error", message: "Mix id and caption_count are required." };
  }

  const { error } = await supabase
    .from("humor_flavor_mix")
    .update({ caption_count: captionCount })
    .eq("id", id);

  if (error) {
    return { status: "error", message: `Could not update humor mix: ${error.message}` };
  }

  revalidatePath("/admin/humor-mix");
  return { status: "success", message: "Humor mix updated." };
}
