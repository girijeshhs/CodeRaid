"use client";

import { useActionState } from "react";
import { signOutAction } from "../actions";
import styles from "./settings.module.css";
import { SubmitButton } from "../components/submit-button";

export default function SignOutForm() {
  const [_, action] = useActionState(signOutAction, null);

  return (
    <form action={action}>
      <SubmitButton className={`${styles.button} ${styles.secondary}`} loadingText="Signing out...">
        Sign out
      </SubmitButton>
    </form>
  );
}
