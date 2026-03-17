"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createWhitelistEmailAction,
  updateWhitelistEmailAction,
  deleteWhitelistEmailAction,
  type ActionState,
} from "./actions";

const idle: ActionState = { status: "idle", message: "" };

function StatusMessage({ state }: { state: ActionState }) {
  if (state.status === "error")
    return (
      <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
        {state.message}
      </p>
    );
  if (state.status === "success")
    return (
      <p className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
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

export function CreateWhitelistEmailForm() {
  const [state, formAction] = useActionState(createWhitelistEmailAction, idle);

  return (
    <form action={formAction} className="mt-4 space-y-2">
      <div className="flex gap-3">
        <input name="email_address" placeholder="student@example.edu" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <PendingButton label="Create" pendingLabel="Creating..." className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950" />
      </div>
      <StatusMessage state={state} />
    </form>
  );
}

export function WhitelistEmailRow({ row }: { row: { id: number; email_address: string } }) {
  const [updateState, updateAction] = useActionState(updateWhitelistEmailAction, idle);
  const [deleteState, deleteAction] = useActionState(deleteWhitelistEmailAction, idle);

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-zinc-500">ID: {row.id}</p>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={row.id} />
          <PendingButton label="Delete" pendingLabel="Deleting..." className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white" />
        </form>
      </div>
      {deleteState.status === "error" && <StatusMessage state={deleteState} />}
      <form action={updateAction} className="flex gap-3">
        <input type="hidden" name="id" value={row.id} />
        <input name="email_address" defaultValue={row.email_address} className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <PendingButton label="Save" pendingLabel="Saving..." className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950" />
      </form>
      <StatusMessage state={updateState} />
    </article>
  );
}
