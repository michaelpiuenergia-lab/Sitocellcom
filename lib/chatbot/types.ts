/**
 * Tipi condivisi del chatbot pubblico Cellcom.
 * - Server (app/api/chat) + client (lib/chatbot/use-chat) usano gli stessi
 *   ChatMessage e gli stessi event-name SSE.
 * - Il bridge handoff verso <RequestForm> usa OpenRequestEventDetail.
 */

import type {
  SiteRequestKind,
  SiteRequestProductPayload,
} from "@/lib/crm-client/types";

export type { SiteRequestKind, SiteRequestProductPayload };

export type ChatRole = "user" | "assistant";

/**
 * Un messaggio nella history scambiata col modello.
 * - role: "user" o "assistant"
 * - content: testo finale (per assistant è la concatenazione dei delta)
 * - status (solo lato client): tracciamento UI
 * - toolEvents (solo lato client): bubble di stato "Cerco il modello…"
 */
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  /** Solo client: tracciamento UI (streaming → idle → aborted). */
  status?: "streaming" | "complete" | "aborted" | "error";
  /** Solo client: bubble di stato strumenti durante questo turno. */
  toolEvents?: ChatToolEvent[];
};

export type ChatToolEvent = {
  id: string;
  name: string;
  /** Label italiana per UI (es. "Cerco il modello…"). */
  label: string;
  status: "running" | "ok" | "error";
};

/**
 * Discriminated union degli eventi SSE che la route forwarda al client.
 * Ogni evento è emesso come `event: <type>\ndata: <json>\n\n`.
 */
export type ChatStreamEvent =
  | { type: "text-delta"; text: string }
  | { type: "tool-use-start"; id: string; name: string; label: string }
  | { type: "tool-result"; id: string; name: string; ok: boolean }
  | {
      type: "open-request";
      kind: SiteRequestKind;
      defaultCustomer?: OpenRequestCustomer;
      product?: SiteRequestProductPayload | null;
    }
  | {
      type: "done";
      usage?: {
        inputTokens?: number;
        outputTokens?: number;
        cacheReadTokens?: number;
      };
    }
  | { type: "error"; message: string };

export type OpenRequestCustomer = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
};

/**
 * Detail dell'evento DOM window "cellcom:open-request".
 * Il <RequestFormBridge/> ascolta e monta <RequestForm/> pre-compilato.
 */
export type OpenRequestEventDetail = {
  kind: SiteRequestKind;
  product: SiteRequestProductPayload | null;
  defaultCustomer: OpenRequestCustomer;
  /** Nasconde il campo "Azienda" tranne per i preventivi B2B. */
  hideCompany: boolean;
};

export const OPEN_REQUEST_EVENT = "cellcom:open-request" as const;
