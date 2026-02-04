"use client";

import { useActionState } from "react";
import { joinPartyAction } from "../actions";
import { SubmitButton } from "../components/submit-button";
import { FormMessage } from "../components/form-message";

export default function JoinPartyForm() {
  const [state, action] = useActionState(joinPartyAction, { ok: true });

  return (
    <form className="flex flex-col gap-4" action={action}>
      <input
        name="code"
        placeholder="Invite code"
        className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        required
      />
      <SubmitButton>Join</SubmitButton>
      {!state.ok && state.error && <FormMessage message={state.error} />}
    </form>
  );
}
