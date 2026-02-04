"use client";

import { useActionState } from "react";
import { completeOnboardingAction } from "../actions";
import styles from "./page.module.css";
import { SubmitButton } from "../components/submit-button";
import { FormMessage } from "../components/form-message";

export default function OnboardingForm() {
  const [state, action] = useActionState(completeOnboardingAction, { ok: true });

  return (
    <form className={styles.form} action={action}>
      <label className={styles.label} htmlFor="handle">
        LeetCode username
      </label>
      <input
        id="handle"
        name="handle"
        placeholder="leetcode_handle"
        required
        className={styles.input}
      />
      <SubmitButton className={styles.primaryButton}>Continue</SubmitButton>
      {!state.ok && state.error && <FormMessage message={state.error} />}
    </form>
  );
}
