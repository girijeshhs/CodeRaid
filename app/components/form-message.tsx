'use client';

type FormMessageProps = {
  message?: string | null;
  type?: "error" | "success";
};

export function FormMessage({ message, type = "error" }: FormMessageProps) {
  if (!message) return null;

  return (
    <div 
      style={{ 
        color: type === "error" ? "var(--error, #e53e3e)" : "var(--success, #38a169)",
        fontSize: "0.875rem",
        marginTop: "0.5rem" 
      }}
    >
      {message}
    </div>
  );
}
