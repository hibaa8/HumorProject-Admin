"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createTermAction,
  updateTermAction,
  deleteTermAction,
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

export function CreateTermForm() {
  const [state, formAction] = useActionState(createTermAction, idle);

  return (
    <form action={formAction} className="mt-4 grid gap-3 md:grid-cols-2">
      <input name="term" placeholder="Term" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
      <input name="priority" type="number" defaultValue={0} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
      <textarea name="definition" placeholder="Definition" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
      <textarea name="example" placeholder="Example" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
      <input name="term_type_id" type="number" placeholder="Term type id (optional)" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
      <StatusMessage state={state} />
      <PendingButton label="Create term" pendingLabel="Creating..." className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit" />
    </form>
  );
}

type TermRow = {
  id: number;
  term: string;
  definition: string;
  example: string;
  priority: number | null;
  term_type_id: number | null;
};

export function TermRow({ row }: { row: TermRow }) {
  const [updateState, updateAction] = useActionState(updateTermAction, idle);
  const [deleteState, deleteAction] = useActionState(deleteTermAction, idle);

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
        <input name="term" defaultValue={row.term} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <input name="priority" type="number" defaultValue={row.priority ?? 0} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <textarea name="definition" defaultValue={row.definition} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
        <textarea name="example" defaultValue={row.example} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" rows={2} />
        <input name="term_type_id" type="number" defaultValue={row.term_type_id ?? ""} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <StatusMessage state={updateState} />
        <PendingButton label="Save changes" pendingLabel="Saving..." className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit" />
      </form>
    </article>
  );
}
