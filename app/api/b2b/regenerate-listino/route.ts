import { NextResponse } from "next/server";
import { b2bRegenerateListino } from "@/lib/crm-client";
import { requireB2bSession } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

export async function POST() {
  const ctx = await requireB2bSession();
  try {
    const result = await b2bRegenerateListino(ctx.sessionToken);
    // Invalida la cache della pagina /b2b/prodotti così il listino nuovo
    // viene visto subito al prossimo render
    try {
      revalidatePath("/b2b/prodotti");
    } catch {
      // ignore
    }
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Errore";
    console.error("[b2b/regenerate-listino]", msg);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL",
          message: "Rigenerazione non riuscita, riprova tra qualche minuto",
        },
      },
      { status: 502 },
    );
  }
}
