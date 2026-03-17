"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateImageAction, deleteImageAction, type ImageActionState } from "./actions";

const idle: ImageActionState = { status: "idle", message: "" };

function PendingButton({ label, pendingLabel, className }: { label: string; pendingLabel: string; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}>
      {pending ? pendingLabel : label}
    </button>
  );
}

type ImageRow = {
  id: string;
  url: string | null;
  profile_id: string | null;
  is_public: boolean | null;
  is_common_use: boolean | null;
  image_description: string | null;
  additional_context: string | null;
  celebrity_recognition: string | null;
};

export function ImageRowActions({ image }: { image: ImageRow }) {
  const [updateState, updateAction] = useActionState(updateImageAction, idle);
  const [deleteState, deleteAction] = useActionState(deleteImageAction, idle);

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="truncate text-xs text-zinc-400">{image.id}</p>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={image.id} />
          <PendingButton
            label="Delete"
            pendingLabel="Deleting..."
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 hover:shadow-md hover:shadow-red-500/20"
          />
        </form>
      </div>
      {deleteState.status === "error" && (
        <p className="mb-2 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {deleteState.message}
        </p>
      )}

      <form action={updateAction} className="grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={image.id} />
        <input
          name="url"
          defaultValue={image.url ?? ""}
          placeholder="URL"
          className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        />
        <input
          name="profile_id"
          defaultValue={image.profile_id ?? ""}
          placeholder="Profile UUID"
          className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        />
        <input
          name="image_description"
          defaultValue={image.image_description ?? ""}
          placeholder="Description"
          className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        />
        <input
          name="additional_context"
          defaultValue={image.additional_context ?? ""}
          placeholder="Additional context"
          className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        />
        <input
          name="celebrity_recognition"
          defaultValue={image.celebrity_recognition ?? ""}
          placeholder="Celebrity recognition"
          className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-4 text-sm text-zinc-300">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="is_public" defaultChecked={Boolean(image.is_public)} />
            Public
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="is_common_use" defaultChecked={Boolean(image.is_common_use)} />
            Common use
          </label>
        </div>
        {updateState.status === "error" && (
          <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 md:col-span-2">
            {updateState.message}
          </p>
        )}
        {updateState.status === "success" && (
          <p className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 md:col-span-2">
            {updateState.message}
          </p>
        )}
        <PendingButton
          label="Save changes"
          pendingLabel="Saving..."
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:col-span-2 md:w-fit"
        />
      </form>
    </article>
  );
}
