"use client";

import { useChatState, useChatActions } from "./chat-context";
import { useLang } from "@/lib/i18n/lang-context";

type QuickReplyKey = "buyPhone" | "repairScreen" | "sellUsed" | "reseller";
const QUICK_REPLY_KEYS: QuickReplyKey[] = [
  "buyPhone",
  "repairScreen",
  "sellUsed",
  "reseller",
];

/**
 * 4 pill iniziali mostrate solo quando non c'è history.
 *
 * Fix bug review #21:
 * - role="group" + aria-label sul container per chiarire scopo agli AT.
 * - Tap target ingrandito (gap-2.5, padding più ampio) per evitare mis-tap
 *   tra "Vendo il mio usato" e "Sono un rivenditore" su mobile.
 */
export function ChatQuickReplies() {
  const { status } = useChatState();
  const { send } = useChatActions();
  const { t } = useLang();
  const disabled = status === "streaming";

  return (
    <div
      role="group"
      aria-label={t("chat.regionAria")}
      className="flex flex-wrap gap-2.5 mt-1"
    >
      {QUICK_REPLY_KEYS.map((key) => {
        // Mappature esplicite per soddisfare il type-checker (template literal
        // di TS non riconosce il caps Java-style "userBuyPhone").
        const labelKeyMap = {
          buyPhone: "chat.quickReply.buyPhone",
          repairScreen: "chat.quickReply.repairScreen",
          sellUsed: "chat.quickReply.sellUsed",
          reseller: "chat.quickReply.reseller",
        } as const;
        const userKeyMap = {
          buyPhone: "chat.quickReply.userBuyPhone",
          repairScreen: "chat.quickReply.userRepairScreen",
          sellUsed: "chat.quickReply.userSellUsed",
          reseller: "chat.quickReply.userReseller",
        } as const;
        return (
          <button
            key={key}
            type="button"
            onClick={() => send(t(userKeyMap[key]))}
            disabled={disabled}
            className="rounded-full px-3.5 py-2 transition-colors disabled:opacity-60 hover:border-[#dc2626] hover:text-[#dc2626]"
            style={{
              border: "1px solid #e5e5e5",
              backgroundColor: "#ffffff",
              color: "#0a0a0a",
              fontSize: "12.5px",
              fontWeight: 500,
              minHeight: 36,
            }}
          >
            {t(labelKeyMap[key])}
          </button>
        );
      })}
    </div>
  );
}
