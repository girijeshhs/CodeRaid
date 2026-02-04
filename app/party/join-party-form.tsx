"use client";

import { useActionState } from "react";
import { joinPartyAction } from "../actions";
import styles from "./party.module.css";
import { SubmitButton } from "../components/submit-button";
import { FormMessage } from "../components/form-message";

export default function JoinPartyForm() {
  const [state, action] = useActionState(joinPartyAction, { ok: true });

  return (
    <form className={styles.formRow} action={action}>
      <input name="code" placeholder="Invite code" className={styles.input} required />
      <SubmitButton className={styles.button}>Join</SubmitButton>
      {!state.ok && state.error && <FormMessage message={state.error} />}
    </form>
  );
}
