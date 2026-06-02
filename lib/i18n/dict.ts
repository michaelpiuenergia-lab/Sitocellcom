import type { Lang } from "./lang";

/**
 * Dizionario delle stringhe HUB. Aggiungi solo chiavi davvero usate in UI.
 * Per i contenuti marketing lunghi (hero descriptions, pillar cards, ecc.)
 * meglio file dedicati per pagina invece di una mega-mappa.
 *
 * Convenzione nomi: `area.contesto.elemento` (es. `chat.input.placeholder`).
 */

export type Dict = {
  // ─── Chatbot UI ─────────────────────────────────────────────────────
  "chat.header.title": string;
  "chat.header.statusOnline": string;
  "chat.header.statusStreaming": string;
  "chat.header.closeAria": string;
  "chat.fab.openAria": string;
  "chat.fab.closeAria": string;
  "chat.welcome": string;
  "chat.input.placeholder": string;
  "chat.input.placeholderStreaming": string;
  "chat.input.sendAria": string;
  "chat.input.stopAria": string;
  "chat.input.charsLeft": (n: number) => string;
  "chat.bubble.streamingPolite": string;
  "chat.bubble.errorBadge": string;
  "chat.bubble.abortedBadge": string;
  "chat.bubble.truncatedBadge": string;
  "chat.error.networkFallback": string;
  "chat.error.tooManyRequests": string;
  "chat.quickReply.buyPhone": string;
  "chat.quickReply.repairScreen": string;
  "chat.quickReply.sellUsed": string;
  "chat.quickReply.reseller": string;
  "chat.quickReply.userBuyPhone": string;
  "chat.quickReply.userRepairScreen": string;
  "chat.quickReply.userSellUsed": string;
  "chat.quickReply.userReseller": string;
  "chat.toolLabel.searchProducts": string;
  "chat.toolLabel.getProductBySlug": string;
  "chat.toolLabel.searchUsedDevices": string;
  "chat.toolLabel.lookupRepair": string;
  "chat.toolLabel.listStores": string;
  "chat.toolLabel.openRequestForm": string;
  "chat.toolLabel.getHealth": string;
  "chat.regionAria": string;
  "chat.openAnnounce": string;

  // ─── Language switcher ──────────────────────────────────────────────
  "lang.label": string;
  "lang.it": string;
  "lang.en": string;
  "lang.switchAria": string;

  // ─── Enum labels riusati ovunque ────────────────────────────────────
  "enum.condition.new": string;
  "enum.condition.used": string;
  "enum.condition.refurbished": string;
  "enum.usedCondition.ottimo": string;
  "enum.usedCondition.buono": string;
  "enum.usedCondition.discreto": string;
  "enum.usedCondition.rotto": string;
  "enum.repairStatus.accepted": string;
  "enum.repairStatus.diagnosed": string;
  "enum.repairStatus.in_repair": string;
  "enum.repairStatus.awaiting_parts": string;
  "enum.repairStatus.ready_for_pickup": string;
  "enum.repairStatus.delivered": string;
  "enum.repairStatus.cancelled": string;
};

const IT: Dict = {
  "chat.header.title": "Assistenza Cellcom",
  "chat.header.statusOnline": "Risposta in pochi minuti",
  "chat.header.statusStreaming": "Sta scrivendo…",
  "chat.header.closeAria": "Chiudi chat",
  "chat.fab.openAria": "Apri chat assistenza",
  "chat.fab.closeAria": "Chiudi chat assistenza",
  "chat.welcome":
    "Ciao — sono l'assistente Cellcom. Cerco prodotti, traccio riparazioni, indico negozi e ti apro la richiesta giusta. Da dove vuoi partire?",
  "chat.input.placeholder": "Scrivi un messaggio…",
  "chat.input.placeholderStreaming": "Attendi la risposta…",
  "chat.input.sendAria": "Invia messaggio",
  "chat.input.stopAria": "Ferma la risposta",
  "chat.input.charsLeft": (n) => `${n} caratteri rimasti`,
  "chat.bubble.streamingPolite": "L'assistente sta rispondendo, attendi prima di scrivere",
  "chat.bubble.errorBadge": "Errore — riprova",
  "chat.bubble.abortedBadge": "Risposta interrotta",
  "chat.bubble.truncatedBadge": "Risposta troncata — riformula per continuare",
  "chat.error.networkFallback":
    "Connessione persa. Riprova o apri una richiesta diretta →",
  "chat.error.tooManyRequests": "Troppe richieste, riprova fra qualche minuto",
  "chat.quickReply.buyPhone": "Compra un telefono",
  "chat.quickReply.repairScreen": "Mi si è rotto lo schermo",
  "chat.quickReply.sellUsed": "Vendo il mio usato",
  "chat.quickReply.reseller": "Sono un rivenditore",
  "chat.quickReply.userBuyPhone": "Voglio comprare un telefono",
  "chat.quickReply.userRepairScreen": "Mi si è rotto lo schermo, come si fa?",
  "chat.quickReply.userSellUsed": "Vorrei vendere il mio telefono usato",
  "chat.quickReply.userReseller":
    "Sono un rivenditore, come accedo ai prezzi B2B?",
  "chat.toolLabel.searchProducts": "Cerco nel catalogo…",
  "chat.toolLabel.getProductBySlug": "Apro la scheda prodotto…",
  "chat.toolLabel.searchUsedDevices": "Cerco tra l'usato garantito…",
  "chat.toolLabel.lookupRepair": "Cerco il ticket riparazione…",
  "chat.toolLabel.listStores": "Recupero i negozi…",
  "chat.toolLabel.openRequestForm": "Preparo la richiesta…",
  "chat.toolLabel.getHealth": "Verifico lo stato del sistema…",
  "chat.regionAria": "Chat assistenza Cellcom",
  "chat.openAnnounce": "Chat assistenza aperta",

  "lang.label": "Lingua",
  "lang.it": "Italiano",
  "lang.en": "English",
  "lang.switchAria": "Cambia lingua",

  "enum.condition.new": "Nuovo",
  "enum.condition.used": "Usato",
  "enum.condition.refurbished": "Ricondizionato",
  "enum.usedCondition.ottimo": "Ottimo",
  "enum.usedCondition.buono": "Buono",
  "enum.usedCondition.discreto": "Discreto",
  "enum.usedCondition.rotto": "Rotto / per pezzi",
  "enum.repairStatus.accepted": "Accettato",
  "enum.repairStatus.diagnosed": "Diagnosticato",
  "enum.repairStatus.in_repair": "In lavorazione",
  "enum.repairStatus.awaiting_parts": "Attesa ricambi",
  "enum.repairStatus.ready_for_pickup": "Pronto al ritiro",
  "enum.repairStatus.delivered": "Consegnato",
  "enum.repairStatus.cancelled": "Annullato",
};

const EN: Dict = {
  "chat.header.title": "Cellcom Assistance",
  "chat.header.statusOnline": "Reply in minutes",
  "chat.header.statusStreaming": "Typing…",
  "chat.header.closeAria": "Close chat",
  "chat.fab.openAria": "Open assistance chat",
  "chat.fab.closeAria": "Close assistance chat",
  "chat.welcome":
    "Hi — I'm the Cellcom assistant. I search products, track repairs, find stores and open the right request for you. Where do you want to start?",
  "chat.input.placeholder": "Write a message…",
  "chat.input.placeholderStreaming": "Wait for the reply…",
  "chat.input.sendAria": "Send message",
  "chat.input.stopAria": "Stop the reply",
  "chat.input.charsLeft": (n) => `${n} characters left`,
  "chat.bubble.streamingPolite":
    "The assistant is replying, wait before writing again",
  "chat.bubble.errorBadge": "Error — retry",
  "chat.bubble.abortedBadge": "Reply interrupted",
  "chat.bubble.truncatedBadge": "Reply truncated — rephrase to continue",
  "chat.error.networkFallback":
    "Connection lost. Retry or open a direct request →",
  "chat.error.tooManyRequests": "Too many requests, try again in a few minutes",
  "chat.quickReply.buyPhone": "Buy a phone",
  "chat.quickReply.repairScreen": "My screen is broken",
  "chat.quickReply.sellUsed": "Sell my used phone",
  "chat.quickReply.reseller": "I'm a reseller",
  "chat.quickReply.userBuyPhone": "I want to buy a phone",
  "chat.quickReply.userRepairScreen": "My screen is broken, how do I fix it?",
  "chat.quickReply.userSellUsed": "I'd like to sell my used phone",
  "chat.quickReply.userReseller":
    "I'm a reseller, how do I access B2B prices?",
  "chat.toolLabel.searchProducts": "Searching the catalogue…",
  "chat.toolLabel.getProductBySlug": "Opening product details…",
  "chat.toolLabel.searchUsedDevices": "Searching warranty-backed used…",
  "chat.toolLabel.lookupRepair": "Looking up repair ticket…",
  "chat.toolLabel.listStores": "Loading stores…",
  "chat.toolLabel.openRequestForm": "Preparing the request…",
  "chat.toolLabel.getHealth": "Checking system status…",
  "chat.regionAria": "Cellcom assistance chat",
  "chat.openAnnounce": "Assistance chat opened",

  "lang.label": "Language",
  "lang.it": "Italiano",
  "lang.en": "English",
  "lang.switchAria": "Switch language",

  "enum.condition.new": "New",
  "enum.condition.used": "Used",
  "enum.condition.refurbished": "Refurbished",
  "enum.usedCondition.ottimo": "Excellent",
  "enum.usedCondition.buono": "Good",
  "enum.usedCondition.discreto": "Fair",
  "enum.usedCondition.rotto": "Faulty / for parts",
  "enum.repairStatus.accepted": "Accepted",
  "enum.repairStatus.diagnosed": "Diagnosed",
  "enum.repairStatus.in_repair": "In repair",
  "enum.repairStatus.awaiting_parts": "Awaiting parts",
  "enum.repairStatus.ready_for_pickup": "Ready for pickup",
  "enum.repairStatus.delivered": "Delivered",
  "enum.repairStatus.cancelled": "Cancelled",
};

const DICTS: Record<Lang, Dict> = { it: IT, en: EN };

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}
