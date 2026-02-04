import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const baseStyles = "rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg";
    const interactiveStyles =
      variant === "interactive"
        ? "transition-all hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-800 hover:shadow-xl cursor-pointer"
        : "";

    return (
      <div ref={ref} className={`${baseStyles} ${interactiveStyles} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-xl font-semibold text-white ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
