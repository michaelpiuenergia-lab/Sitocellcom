import { NextResponse } from "next/server";
import { customerLogout } from "@/lib/crm-client";
import {
  readCustomerSession,
  clearCustomerSessionCookie,
} from "@/lib/auth/customer-session";

export async function POST() {
  const session = await readCustomerSession();
  if (session) {
    try {
      await customerLogout(session.sessionToken);
    } catch {
      // best-effort: anche se il CRM fallisce, cancelliamo il cookie locale
    }
  }
  await clearCustomerSessionCookie();
  return NextResponse.json({ ok: true }, { status: 200 });
}
