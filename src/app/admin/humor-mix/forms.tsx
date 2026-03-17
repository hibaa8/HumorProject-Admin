"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateHumorMixAction, type ActionState } from "./actions";

const idle: ActionState = { status: "idle", message: "" };

function PendingButton({ label, pendingLabel, className }: { label: string; pendingLabel: string; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}>
      {pending ? pendingLabel : label}
    </button>
  );
}

type HumorMixRow = {
  id: number;
  caption_count: number;
  flavorLabel: string;
};

export function HumorMixRowForm({ row }: { row: HumorMixRow }) {
  const [state, formAction] = useActionState(updateHumorMixAction, idle);

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{row.flavorLabel}</p>
      <form action={formAction} className="mt-3 flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={row.id} />
        <label className="text-sm text-zinc-300">
          Caption count
          <input
            type="number"
            name="caption_count"
            min={0}
            defaultValue={row.caption_count}
            className="mt-1 block rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </label>
        <PendingButton label="Save" pendingLabel="Saving..." className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-zinc-950" />
        {state.status === "error" && (
          <p className="w-full rounded-md border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {state.message}
          </p>
        )}
        {state.status === "success" && (
          <p className="w-full rounded-md border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            {state.message}
          </p>
        )}
      </form>
    </article>
  );
}
