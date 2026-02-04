"use client";

import { useActionState } from "react";
import { createPartyAction } from "../actions";
import styles from "./party.module.css";
import { SubmitButton } from "../components/submit-button";
import { FormMessage } from "../components/form-message";

export default function CreatePartyForm() {
  const [state, action] = useActionState(createPartyAction, { ok: true });

  return (
    <form className={styles.formRow} action={action}>
      <input name="name" placeholder="Party name" className={styles.input} required />
      <input name="description" placeholder="Description (optional)" className={styles.input} />
      <textarea 
        name="userHandles" 
        placeholder="User handles to add (comma-separated, e.g. user1, user2, user3)" 
        className={styles.textarea}
        rows={3}
      />
      <SubmitButton className={styles.button}>Create</SubmitButton>
      {!state.ok && state.error && <FormMessage message={state.error} />}
    </form>
  );
}
