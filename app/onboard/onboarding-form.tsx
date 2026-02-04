"use client";

import { useActionState } from "react";
import { completeOnboardingAction } from "../actions";
import { SubmitButton } from "../components/submit-button";
import { FormMessage } from "../components/form-message";

export default function OnboardingForm() {
  const [state, action] = useActionState(completeOnboardingAction, { ok: true });

  return (
    <form className="flex flex-col gap-5" action={action}>
      <label className="mb-[-8px] text-sm font-semibold text-white" htmlFor="handle">
        LeetCode username
      </label>
      <input
        id="handle"
        name="handle"
        placeholder="leetcode_handle"
        required
        className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
      />
      <SubmitButton className="mt-2 w-full rounded-md bg-amber-500 py-3.5 text-center text-sm font-semibold text-black transition-transform hover:-translate-y-px hover:bg-amber-400">Continue</SubmitButton>
      {!state.ok && state.error && <FormMessage message={state.error} />}
    </form>
  );
}
