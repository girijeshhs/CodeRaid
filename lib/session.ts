import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_KEY = "coderaid_uid";

export const getSessionUserId = (): string | null => {
  const store = cookies();
  const value = store.get(COOKIE_KEY)?.value;
  return value ?? null;
};

export const requireUserId = (): string => {
  const userId = getSessionUserId();
  if (!userId) redirect("/");
  return userId;
};

export const setSessionUserId = (userId: string) => {
  const store = cookies();
  store.set(COOKIE_KEY, userId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const clearSession = () => {
  const store = cookies();
  store.delete(COOKIE_KEY);
};
