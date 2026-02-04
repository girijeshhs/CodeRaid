type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
};

export function EmptyState({ icon = "📭", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-6xl opacity-50">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-zinc-400">{description}</p>
      {action && (
        <a
          href={action.href}
          className="rounded-md bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-px hover:bg-amber-400 hover:shadow-md"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
