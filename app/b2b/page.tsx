import { redirect } from "next/navigation";
import { optionalB2bSession } from "@/lib/auth/guards";

/**
 * Entry point /b2b: redirect intelligente.
 * - autenticato → /b2b/prodotti
 * - non autenticato → /b2b/login
 */
export const dynamic = "force-dynamic";

export default async function B2bIndex() {
  const session = await optionalB2bSession();
  redirect(session ? "/b2b/prodotti" : "/b2b/login");
}
