"use client";

import { useEffect, useState } from "react";
import { RequestForm } from "@/components/forms/request-form";
import { OPEN_REQUEST_EVENT, type OpenRequestEventDetail } from "@/lib/chatbot/types";

/**
 * Mount globale che ascolta `window` event "cellcom:open-request"
 * (emesso da useChat() quando il modello chiama openRequestForm) e renderizza
 * <RequestForm/> già esistente, pre-compilato.
 *
 * Il modal vive INDIPENDENTEMENTE dal pannello chat — sta sopra di esso
 * e mostra l'informativa privacy: l'utente spunta da sé il consenso.
 */
export function RequestFormBridge() {
  const [open, setOpen] = useState<OpenRequestEventDetail | null>(null);

  useEffect(() => {
    function onEvt(e: Event) {
      const detail = (e as CustomEvent<OpenRequestEventDetail>).detail;
      if (!detail || !detail.kind) return;
      setOpen(detail);
    }
    window.addEventListener(OPEN_REQUEST_EVENT, onEvt);
    return () => window.removeEventListener(OPEN_REQUEST_EVENT, onEvt);
  }, []);

  if (!open) return null;

  return (
    <RequestForm
      kind={open.kind}
      product={open.product}
      defaultCustomer={open.defaultCustomer}
      hideCompany={open.hideCompany}
      onClose={() => setOpen(null)}
    />
  );
}
