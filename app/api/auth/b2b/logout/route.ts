import { NextResponse } from "next/server";
import { b2bLogout } from "@/lib/crm-client";
import {
  clearB2bSessionCookie,
  readB2bSession,
} from "@/lib/auth/session";

export async function POST() {
  const session = await readB2bSession();
  if (session) {
    try {
      await b2bLogout(session.sessionToken);
    } catch {
      // anche se il CRM non risponde, puliamo il cookie locale comunque
    }
  }
  await clearB2bSessionCookie();
  return new NextResponse(null, { status: 204 });
}
