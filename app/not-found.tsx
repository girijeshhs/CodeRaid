import { Button } from "./components/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-6 text-6xl">🔍</div>
      <h2 className="mb-3 text-2xl font-bold text-white">Page not found</h2>
      <p className="mb-6 max-w-md text-sm text-zinc-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/">
        <Button>Go home</Button>
      </a>
    </div>
  );
}
