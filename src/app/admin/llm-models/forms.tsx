"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createLlmModelAction,
  updateLlmModelAction,
  deleteLlmModelAction,
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

type Provider = { id: number; name: string };

export function CreateLlmModelForm({ providers }: { providers: Provider[] }) {
  const [state, formAction] = useActionState(createLlmModelAction, idle);

  return (
    <form action={formAction} className="mt-4 grid gap-3 md:grid-cols-2">
      <input name="name" placeholder="Model display name" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
      <input name="provider_model_id" placeholder="Provider model id" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
      <select name="llm_provider_id" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm">
        <option value="">Select provider</option>
        {providers.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="is_temperature_supported" />
        Temperature supported
      </label>
      <StatusMessage state={state} />
      <PendingButton label="Create model" pendingLabel="Creating..." className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit" />
    </form>
  );
}

type LlmModelRow = {
  id: number;
  name: string;
  provider_model_id: string;
  llm_provider_id: number;
  is_temperature_supported: boolean;
  providerName: string;
};

export function LlmModelRow({ row, providers }: { row: LlmModelRow; providers: Provider[] }) {
  const [updateState, updateAction] = useActionState(updateLlmModelAction, idle);
  const [deleteState, deleteAction] = useActionState(deleteLlmModelAction, idle);

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-zinc-500">ID: {row.id} | Provider: {row.providerName}</p>
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
        <input name="name" defaultValue={row.name} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <input name="provider_model_id" defaultValue={row.provider_model_id} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <select name="llm_provider_id" defaultValue={row.llm_provider_id} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm">
          {providers.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="is_temperature_supported" defaultChecked={row.is_temperature_supported} />
          Temperature supported
        </label>
        <StatusMessage state={updateState} />
        <PendingButton label="Save changes" pendingLabel="Saving..." className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950 md:w-fit" />
      </form>
    </article>
  );
}
