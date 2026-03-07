"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createImageAction,
  type ImageActionState,
} from "@/app/admin/images/actions";

export function CreateImageForm() {
  const initialState: ImageActionState = { status: "idle", message: "" };
  const [state, formAction] = useActionState(
    createImageAction,
    initialState
  );

  return (
    <form action={formAction} className="mt-4 grid gap-3 md:grid-cols-2">
      <input
        name="url"
        placeholder="URL"
        className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
      />
      <input
        name="profile_id"
        placeholder="Profile UUID (optional, defaults to your user id)"
        className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
      />
      <input
        name="image_description"
        placeholder="Image description"
        className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
      />
      <input
        name="additional_context"
        placeholder="Additional context"
        className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
      />
      <input
        name="celebrity_recognition"
        placeholder="Celebrity recognition"
        className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
      />
      <div className="flex items-center gap-4 text-sm text-zinc-300">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="is_public" />
          Public
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="is_common_use" />
          Common use
        </label>
      </div>

      {state.status === "error" ? (
        <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 md:col-span-2">
          {state.message}
        </p>
      ) : null}

      {state.status === "success" ? (
        <p className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 md:col-span-2">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 hover:shadow-md hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2 md:w-fit"
    >
      {pending ? "Creating..." : "Create image"}
    </button>
  );
}
