"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createCaptionExampleAction,
  updateCaptionExampleAction,
  deleteCaptionExampleAction,
  type ActionState,
} from "./actions";

const idle: ActionState = { status: "idle", message: "" };

function StatusMessage({ state }: { state: ActionState }) {
  if (state.status === "error")
    return (
      <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 md:col-span-2">
        {state.message}
      </p>
    );
  if (state.status === "success")
    return (
      <p className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 md:col-span-2">
        {state.message}
      </p>
    );
  return null;
}

function PendingButton({ label, pendingLabel, className }: { label: string; pendingLabel: string; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export function CreateCaptionExampleForm() {
  const [state, formAction] = useActionState(createCaptionExampleAction, idle);

  return (
    <form action={formAction} className="mt-4 grid gap-3 md:grid-cols-2">
      <input name="image_description" placeholder="Image description" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" />
      <textarea name="caption" placeholder="Caption" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
      <textarea name="explanation" placeholder="Explanation" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
      <input name="priority" type="number" defaultValue={0} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
      <input name="image_id" placeholder="Image UUID (optional)" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
      <StatusMessage state={state} />
      <PendingButton label="Create caption example" pendingLabel="Creating..." className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit" />
    </form>
  );
}

type CaptionExampleRow = {
  id: number;
  image_description: string;
  caption: string;
  explanation: string;
  priority: number | null;
  image_id: string | null;
};

export function CaptionExampleRow({ row }: { row: CaptionExampleRow }) {
  const [updateState, updateAction] = useActionState(updateCaptionExampleAction, idle);
  const [deleteState, deleteAction] = useActionState(deleteCaptionExampleAction, idle);

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-zinc-500">ID: {row.id}</p>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={row.id} />
          <PendingButton label="Delete" pendingLabel="Deleting..." className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white" />
        </form>
      </div>
      {deleteState.status === "error" && (
        <p className="mb-2 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {deleteState.message}
        </p>
      )}
      <form action={updateAction} className="grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={row.id} />
        <input name="image_description" defaultValue={row.image_description} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" />
        <textarea name="caption" defaultValue={row.caption} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
        <textarea name="explanation" defaultValue={row.explanation} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
        <input name="priority" type="number" defaultValue={row.priority ?? 0} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <input name="image_id" defaultValue={row.image_id ?? ""} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <StatusMessage state={updateState} />
        <PendingButton label="Save changes" pendingLabel="Saving..." className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit" />
      </form>
    </article>
  );
}
