import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LANG_COOKIE, isLang } from "@/lib/i18n/lang";

/**
 * Set del cookie lingua server-side. Più affidabile di document.cookie
 * lato client (no race con SameSite/HttpOnly, scrittura atomica).
 */

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 anno

export async function POST(req: NextRequest) {
  let body: { lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Body non valido" } },
      { status: 400 },
    );
  }
  if (!isLang(body.lang)) {
    return NextResponse.json(
      { error: { code: "INVALID_LANG", message: "Lingua non supportata" } },
      { status: 400 },
    );
  }
  const store = await cookies();
  store.set({
    name: LANG_COOKIE,
    value: body.lang,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: false, // il client deve poterlo leggere se servisse
    secure: process.env.NODE_ENV === "production",
  });
  return NextResponse.json({ ok: true, lang: body.lang });
}
