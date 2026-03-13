"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger } from "@/lib/admin/form-utils";

export async function updateHumorMixAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  const captionCount = parseInteger(formData.get("caption_count"));

  if (!id || captionCount === null) {
    throw new Error("Mix id and caption_count are required.");
  }

  const { error } = await supabase
    .from("humor_flavor_mix")
    .update({ caption_count: captionCount })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not update humor mix: ${error.message}`);
  }

  revalidatePath("/admin/humor-mix");
}
