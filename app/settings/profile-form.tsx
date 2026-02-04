"use client";

import { useActionState } from "react";
import { updateHandleAction } from "../actions";
import styles from "./settings.module.css";
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
    <form className={styles.form} action={action}>
      <input
        name="handle"
        defaultValue={user.handle}
        className={styles.input}
        placeholder="LeetCode handle"
        required
      />
      <input
        name="email"
        defaultValue={user.email ?? ""}
        className={styles.input}
        placeholder="Email (optional)"
        type="email"
      />
      <SubmitButton className={styles.button}>Save</SubmitButton>
      {!state.ok && state.error && <FormMessage message={state.error} />}
    </form>
  );
}
