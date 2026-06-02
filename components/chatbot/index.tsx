"use client";

import { ChatProvider } from "./chat-context";
import { ChatFab } from "./chat-fab";
import { ChatPanel } from "./chat-panel";
import { RequestFormBridge } from "./request-form-bridge";

/**
 * Mount pubblico unico — da inserire una volta in app/layout.tsx.
 *
 * Composizione:
 * - ChatProvider: stato condiviso (messages/status/isOpen)
 *   - ChatFab: bottone fluttuante 56x56
 *   - ChatPanel: pannello 380x600 (animato apertura/chiusura)
 * - RequestFormBridge: ascolta cellcom:open-request e monta <RequestForm/>
 *   (vive fuori dal Provider perché il modal va sopra TUTTO, inclusa la chat)
 *
 * NOTA: se l'env var CHATBOT_DISABLED è "true" la route /api/chat ritorna
 * 503 e il FAB renderizza ma non funziona. Per nasconderlo del tutto in
 * quel caso, controllare la env lato server e passare un flag al layout.
 */

export function Chatbot() {
  // CSS keyframes globali per spinner/caret usati nei child bubble
  return (
    <>
      <style jsx global>{`
        @keyframes cellcom-chat-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cellcom-chat-caret {
          0%, 49% { opacity: 0.6; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
      <ChatProvider>
        <ChatFab />
        <ChatPanel />
      </ChatProvider>
      <RequestFormBridge />
    </>
  );
}
