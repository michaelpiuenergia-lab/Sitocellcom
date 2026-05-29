import "server-only";

import type { RepairPublic, RepairQuoteAction } from "./types";
import { findRepairPublic, respondToQuoteMock } from "./mocks/repairs";

export async function lookupRepair(
  ticket: string,
  phoneSuffix: string,
): Promise<RepairPublic | null> {
  return findRepairPublic(ticket, phoneSuffix);
}

export async function respondToQuote(
  ticket: string,
  phoneSuffix: string,
  action: RepairQuoteAction,
  reason?: string | null,
): Promise<RepairPublic> {
  return respondToQuoteMock(ticket, phoneSuffix, action, reason);
}
