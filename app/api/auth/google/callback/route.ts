import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { setSessionUserId, clearSession } from "@/lib/session";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo";

type TokenResponse = {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
};

type TokenInfo = {
  email?: string;
  email_verified?: string;
  sub?: string;
  name?: string;
  picture?: string;
};

export async function GET(req: NextRequest) {
  // Rate limiting
  if (!rateLimit(req)) {
    return rateLimitResponse();
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "Missing Google OAuth env" }, { status: 500 });
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/?error=oauth", req.url));
  }

  const store = await cookies();
  const storedState = store.get("oauth_state")?.value;
  store.delete("oauth_state");
  store.delete("oauth_nonce");

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(new URL("/?error=state", req.url));
  }

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/?error=token", req.url));
  }

  const tokenData = (await tokenRes.json()) as TokenResponse;
  if (!tokenData.id_token) {
    return NextResponse.redirect(new URL("/?error=idtoken", req.url));
  }

  const tokenInfoRes = await fetch(`${TOKENINFO_URL}?id_token=${tokenData.id_token}`);
  if (!tokenInfoRes.ok) {
    return NextResponse.redirect(new URL("/?error=tokeninfo", req.url));
  }

  const tokenInfo = (await tokenInfoRes.json()) as TokenInfo;
  const email = tokenInfo.email;
  const verified = tokenInfo.email_verified === "true";

  if (!email || !verified) {
    return NextResponse.redirect(new URL("/?error=email", req.url));
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await setSessionUserId(user.id);
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    await clearSession();
    store.set("oauth_email", email, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 10,
    });

    return NextResponse.redirect(new URL("/onboard", req.url));
  } catch {
    return NextResponse.redirect(new URL("/?error=server", req.url));
  }
}
