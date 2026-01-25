import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_KEY = "coderaid_uid";

export const getSessionUserId = async (): Promise<string | null> => {
  const store = await cookies();
  const value = store.get(COOKIE_KEY)?.value;
  return value ?? null;
};

export const requireUserId = async (): Promise<string> => {
  const userId = await getSessionUserId();
  if (!userId) redirect("/");
  return userId;
};

export const setSessionUserId = async (userId: string) => {
  const store = await cookies();
  store.set(COOKIE_KEY, userId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const clearSession = async () => {
  const store = await cookies();
  store.delete(COOKIE_KEY);
};
