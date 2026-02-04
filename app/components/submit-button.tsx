'use client';

import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { ButtonHTMLAttributes } from "react";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export function SubmitButton({ children, loadingText = "Loading...", variant = "primary", ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      isLoading={pending}
      loadingText={loadingText}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
}
