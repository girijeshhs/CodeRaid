"use client";

import { useEffect } from "react";
import { Button } from "./components/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-6 text-6xl">⚠️</div>
      <h2 className="mb-3 text-2xl font-bold text-white">Something went wrong</h2>
      <p className="mb-6 max-w-md text-sm text-zinc-400">
        {error.message || "An unexpected error occurred. Our team has been notified."}
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="secondary" onClick={() => window.location.href = "/"}>
          Go home
        </Button>
      </div>
    </div>
  );
}
