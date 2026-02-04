"use client";

import { useActionState } from "react";
import { createPartyAction } from "../actions";
import { SubmitButton } from "../components/submit-button";
import { FormMessage } from "../components/form-message";

export default function CreatePartyForm() {
  const [state, action] = useActionState(createPartyAction, { ok: true });

  return (
    <form className="flex flex-col gap-4" action={action}>
      <input
        name="name"
        placeholder="Party name"
        className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        required
      />
      <input
        name="description"
        placeholder="Description (optional)"
        className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
      />
      <textarea
        name="userHandles"
        placeholder="User handles to add (comma-separated, e.g. user1, user2, user3)"
        className="min-h-[100px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        rows={3}
      />
      <SubmitButton>Create</SubmitButton>
      {!state.ok && state.error && <FormMessage message={state.error} />}
    </form>
  );
}
