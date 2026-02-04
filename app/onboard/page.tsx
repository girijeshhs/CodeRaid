import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OnboardingForm from "./onboarding-form";

export default async function OnboardPage() {
  const store = await cookies();
  const email = store.get("oauth_email")?.value;

  if (!email) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-10 shadow-2xl">
        <div className="mb-2 text-2xl font-bold tracking-tight text-white">Link your LeetCode handle</div>
        <p className="mb-8 text-zinc-400">
          Signed in as <span className="font-medium text-white">{email}</span>
        </p>
        <OnboardingForm />
        <p className="mt-6 text-center text-xs text-zinc-500">We only read your public profile.</p>
      </div>
    </div>
  );
}
