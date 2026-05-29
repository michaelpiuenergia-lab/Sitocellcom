import { NextResponse } from "next/server";
import { optionalCustomerSession } from "@/lib/auth/customer-guards";

export async function GET() {
  const ctx = await optionalCustomerSession();
  if (!ctx) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Non autenticato" } },
      { status: 401 },
    );
  }
  return NextResponse.json({ customer: ctx.customer }, { status: 200 });
}
