import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { cookies } from "next/headers";

type HomeProps = {
  searchParams?: { error?: string } | Promise<{ error?: string }>;
};

const errorMap: Record<string, string> = {
  server: "Server error while finalizing sign-in. Check DATABASE_URL and try again.",
  oauth: "OAuth request was incomplete. Please try signing in again.",
  state: "OAuth state mismatch. Please retry sign-in.",
  token: "Could not exchange OAuth code. Please retry.",
  idtoken: "Missing ID token from Google. Please retry.",
  tokeninfo: "Could not validate Google token. Please retry.",
  email: "Google account email not verified.",
};

export default async function Home({ searchParams }: HomeProps) {
  const sessionUserId = await getSessionUserId();
  if (sessionUserId) {
    redirect("/dashboard");
  }

  const resolvedParams =
    searchParams && typeof (searchParams as Promise<{ error?: string }>).then === "function"
      ? await searchParams
      : searchParams ?? {};

  const store = await cookies();
  const pendingEmail = store.get("oauth_email")?.value;
  const errorKey = resolvedParams.error;
  const errorMessage = errorKey ? errorMap[errorKey] : null;

  return (
    <div className="relative grid min-h-[calc(100vh-64px)]flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
       {/* Ambient background light */}
       <div className="pointer-events-none absolute -left-[10%] -top-[20%] z-[-1] h-[50%] w-[50%] bg-[radial-gradient(circle,rgba(245,158,11,0.08)_0%,transparent_70%)] blur-[80px]"></div>

      <section className="flex flex-col justify-center border-r border-zinc-800 bg-zinc-950/50 px-8 py-20 backdrop-blur-xl lg:px-[10%]">
        <div className="max-w-[540px]">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white-[0.03] px-3 py-1 text-[13px] font-medium tracking-wide text-amber-500">
            CodeRaid
          </div>
          <h1 className="mb-8 bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-5xl font-bold leading-[1.1] tracking-tighter text-transparent sm:text-6xl">
            Track progress with daily structure and clear comparisons.
          </h1>
          <ul className="flex flex-col gap-4 text-base text-zinc-400">
            {[
              "Daily snapshots keep progress measurable.",
              "Weekly analysis surfaces real movement.",
              "Party comparisons make momentum visible.",
              "Structured signals guide improvement.",
            ].map((item, i) => (
              <li key={i} className="relative pl-6">
                <span className="absolute left-0 top-0 font-mono text-amber-500">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex items-center justify-center bg-black/20 p-10">
        <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
          <div className="mb-6 text-center text-xl font-semibold text-white">Sign in</div>
          
          {errorMessage ? (
            <div className="mb-5 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-center text-[13px] text-red-300">
              {errorMessage}
            </div>
          ) : null}

          {pendingEmail ? (
            <div className="mb-5 rounded-md border border-amber-500/20 bg-amber-500/10 p-4">
              <div className="mb-1 text-[13px] font-semibold text-amber-500">Finish setup</div>
              <div className="mb-3 text-[13px] text-zinc-400">
                Signed in as <span className="font-medium text-white">{pendingEmail}</span>
              </div>
              <a 
                className="flex w-full items-center justify-center rounded-md bg-white p-3 text-center font-semibold text-black transition hover:bg-zinc-200 hover:-translate-y-px" 
                href="/onboard"
              >
                Continue to onboarding
              </a>
            </div>
          ) : null}

          <a 
            className="flex w-full items-center justify-center rounded-md bg-white p-3 text-center font-semibold text-black transition hover:bg-zinc-200 hover:-translate-y-px" 
            href="/api/auth/google"
          >
            Continue with Google
          </a>
          
          <div className="my-6 flex items-center text-xs text-zinc-600">
            <div className="h-px flex-1 bg-zinc-800"></div>
            <span className="px-3">Requires Google account</span>
            <div className="h-px flex-1 bg-zinc-800"></div>
          </div>
          
          <div className="mt-4 text-center text-[13px] text-zinc-600">
            You will link your LeetCode handle after sign-in.
          </div>
        </div>
      </section>
    </div>
  );
}
