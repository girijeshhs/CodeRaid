"use client";

import { useActionState } from "react";
import { signOutAction } from "../actions";
import { SubmitButton } from "../components/submit-button";

export default function SignOutForm() {
  const [_, action] = useActionState(signOutAction, null);

  return (
    <form action={action}>
      <SubmitButton variant="danger" loadingText="Signing out...">
        Sign out
      </SubmitButton>
    </form>
  );
}
