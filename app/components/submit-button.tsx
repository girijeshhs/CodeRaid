'use client';

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
};

export function SubmitButton({ children, className, loadingText = "Loading..." }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? loadingText : children}
    </button>
  );
}
