"use client";

import { useActionState } from "react";
import { updateHandleAction } from "../actions";
import { SubmitButton } from "../components/submit-button";
import { FormMessage } from "../components/form-message";

type ProfileFormProps = {
  user: {
    handle: string;
    email: string | null;
  };
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const [state, action] = useActionState(updateHandleAction, { ok: true });

  return (
    <form className="flex flex-col gap-4" action={action}>
      <input
        name="handle"
        defaultValue={user.handle}
        className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        placeholder="LeetCode handle"
        required
      />
      <input
        name="email"
        defaultValue={user.email ?? ""}
        className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        placeholder="Email (optional)"
        type="email"
      />
      <SubmitButton>Save</SubmitButton>
      {!state.ok && state.error && <FormMessage message={state.error} />}
    </form>
  );
}
