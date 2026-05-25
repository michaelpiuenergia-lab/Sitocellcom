import { NextResponse } from "next/server";
import { optionalB2bSession } from "@/lib/auth/guards";

export async function GET() {
  const ctx = await optionalB2bSession();
  if (!ctx) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sessione non valida" } },
      { status: 401 },
    );
  }
  return NextResponse.json({ customer: ctx.customer });
}
