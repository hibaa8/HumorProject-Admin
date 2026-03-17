"use server";

import { revalidatePath } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { parseInteger, parseNullableText } from "@/lib/admin/form-utils";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createTermAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const term = parseNullableText(formData.get("term"));
  const definition = parseNullableText(formData.get("definition"));
  const example = parseNullableText(formData.get("example"));

  if (!term || !definition || !example) {
    return { status: "error", message: "term, definition, and example are required." };
  }

  const { error } = await supabase.from("terms").insert({
    term,
    definition,
    example,
    priority: parseInteger(formData.get("priority")) ?? 0,
    term_type_id: parseInteger(formData.get("term_type_id")),
  });

  if (error) {
    return { status: "error", message: `Could not create term: ${error.message}` };
  }

  revalidatePath("/admin/terms");
  return { status: "success", message: "Term created." };
}

export async function updateTermAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    return { status: "error", message: "Term id is required." };
  }

  const term = parseNullableText(formData.get("term"));
  const definition = parseNullableText(formData.get("definition"));
  const example = parseNullableText(formData.get("example"));

  if (!term || !definition || !example) {
    return { status: "error", message: "term, definition, and example are required." };
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
    return { status: "error", message: `Could not update term: ${error.message}` };
  }

  revalidatePath("/admin/terms");
  return { status: "success", message: "Term updated." };
}

export async function deleteTermAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireSuperadmin();

  const id = parseInteger(formData.get("id"));
  if (!id) {
    return { status: "error", message: "Term id is required." };
  }

  const { error } = await supabase.from("terms").delete().eq("id", id);

  if (error) {
    return { status: "error", message: `Could not delete term: ${error.message}` };
  }

  revalidatePath("/admin/terms");
  return { status: "success", message: "Term deleted." };
}
