"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export async function createTermAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const term = parseNullableText(formData.get("term"));
  const definition = parseNullableText(formData.get("definition"));
  const example = parseNullableText(formData.get("example"));

  if (!term || !definition || !example) {
    throw new Error("term, definition, and example are required.");
  }

  const { error } = await supabase.from("terms").insert({
    term,
    definition,
    example,
    priority: parseInteger(formData.get("priority")) ?? 0,
    term_type_id: parseInteger(formData.get("term_type_id")),
  });

  if (error) {
    throw new Error(`Could not create term: ${error.message}`);
  }

  revalidatePath("/admin/terms");
}

export async function updateTermAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    throw new Error("Term id is required.");
  }

  const term = parseNullableText(formData.get("term"));
  const definition = parseNullableText(formData.get("definition"));
  const example = parseNullableText(formData.get("example"));

  if (!term || !definition || !example) {
    throw new Error("term, definition, and example are required.");
  }

  const { error } = await supabase
    .from("terms")
    .update({
      term,
      definition,
      example,
      priority: parseInteger(formData.get("priority")) ?? 0,
      term_type_id: parseInteger(formData.get("term_type_id")),
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not update term: ${error.message}`);
  }

  revalidatePath("/admin/terms");
}

export async function deleteTermAction(formData: FormData) {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    throw new Error("Term id is required.");
  }

  const { error } = await supabase.from("terms").delete().eq("id", id);

  if (error) {
    throw new Error(`Could not delete term: ${error.message}`);
  }

  revalidatePath("/admin/terms");
}
