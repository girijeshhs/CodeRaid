import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Missing Google OAuth env" }, { status: 500 });
  }

  const state = crypto.randomUUID();
  const nonce = crypto.randomUUID();

  const store = await cookies();
  store.set("oauth_state", state, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 10,
  });
  store.set("oauth_nonce", nonce, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 10,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    prompt: "consent",
  });

  return NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}
