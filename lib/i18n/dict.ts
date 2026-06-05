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

  // ─── Navbar ─────────────────────────────────────────────────────────
  "nav.products": string;
  "nav.used": string;
  "nav.repairs": string;
  "nav.resell": string;
  "nav.courses": string;
  "nav.stores": string;
  "nav.about": string;
  "nav.login": string;
  "nav.b2b": string;
  "nav.repairCta": string;
  "nav.customerArea": string;
  "nav.openMenu": string;
  "nav.closeMenu": string;

  // ─── Footer ─────────────────────────────────────────────────────────
  "footer.copyrightGroup": string;
  "footer.legal.privacy": string;
  "footer.legal.cookie": string;
  "footer.legal.terms": string;

  // ─── Hero (homepage) ────────────────────────────────────────────────
  "hero.pillar.buy": string;
  "hero.pillar.repair": string;
  "hero.pillar.resell": string;
  "hero.pillar.learn": string;
  "hero.catalogCta.eyebrow": string;
  "hero.catalogCta.title": string;
  "hero.catalogCta.explore": string;
  "hero.pricesReservedHint": string;
  "hero.newDevicesEyebrow": string;
  "hero.priceOnRequest": string;
  "hero.claim.preItalic": string;
  "hero.claim.italicA": string;
  "hero.claim.between": string;
  "hero.claim.italicB": string;
  "hero.intro.lead": string;
  "hero.intro.boldA": string;
  "hero.intro.bodyA": string;
  "hero.intro.boldB": string;
  "hero.intro.bodyB": string;
  "hero.intro.boldC": string;
  "hero.intro.bodyC": string;

  // ─── Home / Marketing panels ────────────────────────────────────────
  "home.numbers.eyebrow": string;
  "home.numbers.titleA": string;
  "home.numbers.titleB": string;
  "home.numbers.intro": string;
  "home.numbers.stat.brands": string;
  "home.numbers.stat.parts": string;
  "home.numbers.stat.phones": string;
  "home.numbers.stat.accessories": string;
  "home.numbers.cta.catalog": string;
  "home.numbers.cta.about": string;
  "home.b2b.eyebrow": string;
  "home.b2b.titleA": string;
  "home.b2b.titleB": string;
  "home.b2b.intro": string;
  "home.b2b.feature1.title": string;
  "home.b2b.feature1.body": string;
  "home.b2b.feature2.title": string;
  "home.b2b.feature2.body": string;
  "home.b2b.feature3.title": string;
  "home.b2b.feature3.body": string;
  "home.b2b.cta.login": string;
  "home.b2b.cta.contact": string;

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

  "nav.products": "Prodotti",
  "nav.used": "Usato",
  "nav.repairs": "Riparazioni",
  "nav.resell": "Rivendi",
  "nav.courses": "Corsi",
  "nav.stores": "Negozi",
  "nav.about": "Chi siamo",
  "nav.login": "Accedi",
  "nav.b2b": "Area B2B",
  "nav.repairCta": "Ripara ora",
  "nav.customerArea": "Area clienti",
  "nav.openMenu": "Apri menu",
  "nav.closeMenu": "Chiudi menu",

  "footer.copyrightGroup": "Cellcom Group",
  "footer.legal.privacy": "Privacy",
  "footer.legal.cookie": "Cookie",
  "footer.legal.terms": "Termini",

  "hero.pillar.buy": "Compra",
  "hero.pillar.repair": "Ripara",
  "hero.pillar.resell": "Rivendi",
  "hero.pillar.learn": "Impara",
  "hero.catalogCta.eyebrow": "Catalogo completo",
  "hero.catalogCta.title": "Tutti gli smartphone, ricambi, accessori",
  "hero.catalogCta.explore": "Esplora",
  "hero.pricesReservedHint": "Prezzo riservato → accedi",
  "hero.newDevicesEyebrow": "Nuovi in catalogo",
  "hero.priceOnRequest": "Su richiesta",
  "hero.claim.preItalic": "Vendiamo,",
  "hero.claim.italicA": "ripariamo",
  "hero.claim.between": ", riforniamo",
  "hero.claim.italicB": "chi li vende",
  "hero.intro.lead": "Tre attività, un solo magazzino.",
  "hero.intro.boldA": "Vendita al pubblico",
  "hero.intro.bodyA": " di smartphone, accessori e ricambi.",
  "hero.intro.boldB": "Centro assistenza",
  "hero.intro.bodyB": " con laboratorio interno e garanzia 12 mesi.",
  "hero.intro.boldC": "Ingrosso B2B",
  "hero.intro.bodyC": " per rivenditori, centri assistenza e aziende.",

  "home.numbers.eyebrow": "I numeri del gruppo",
  "home.numbers.titleA": "Tre brand. Un solo",
  "home.numbers.titleB": "magazzino.",
  "home.numbers.intro":
    "Cellcom (e-commerce + B2B), Fast-Fix (negozi e riparazioni), ItalianParts (ricambi). Specializzati ognuno nel suo, stesso stock dietro le quinte. I numeri qui sotto arrivano live dal CRM — niente vetrine vuote.",
  "home.numbers.stat.brands": "Brand del gruppo",
  "home.numbers.stat.parts": "Ricambi a stock",
  "home.numbers.stat.phones": "Telefoni in catalogo",
  "home.numbers.stat.accessories": "Accessori disponibili",
  "home.numbers.cta.catalog": "Vai al catalogo",
  "home.numbers.cta.about": "Chi siamo",
  "home.b2b.eyebrow": "Per rivenditori, operatori, aziende",
  "home.b2b.titleA": "Vendi telefoni per mestiere?",
  "home.b2b.titleB": "Il listino giusto cambia tutto.",
  "home.b2b.intro":
    "Stesso stock del pubblico, prezzi a volumi, account manager dedicato, pagamento a 30/60 giorni. Serve solo P.IVA: chiamiamo noi in giornata, credenziali entro 24 ore.",
  "home.b2b.feature1.title": "Listino a tier",
  "home.b2b.feature1.body":
    "Rivenditore, Operatore, VIP — il prezzo scende automatico al volume. Niente da chiedere ogni volta.",
  "home.b2b.feature2.title": "Stock prioritario",
  "home.b2b.feature2.body":
    "Ricambi scarsi riservati prima a chi ha contratto attivo, poi al pubblico.",
  "home.b2b.feature3.title": "Una persona vera",
  "home.b2b.feature3.body":
    "Account manager dedicato. Email diretta, WhatsApp business. Sa chi sei.",
  "home.b2b.cta.login": "Accedi all'area B2B",
  "home.b2b.cta.contact": "Richiedi attivazione",

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

  "nav.products": "Products",
  "nav.used": "Used",
  "nav.repairs": "Repairs",
  "nav.resell": "Resell",
  "nav.courses": "Courses",
  "nav.stores": "Stores",
  "nav.about": "About",
  "nav.login": "Sign in",
  "nav.b2b": "B2B area",
  "nav.repairCta": "Repair now",
  "nav.customerArea": "Customer area",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",

  "footer.copyrightGroup": "Cellcom Group",
  "footer.legal.privacy": "Privacy",
  "footer.legal.cookie": "Cookies",
  "footer.legal.terms": "Terms",

  "hero.pillar.buy": "Buy",
  "hero.pillar.repair": "Repair",
  "hero.pillar.resell": "Resell",
  "hero.pillar.learn": "Learn",
  "hero.catalogCta.eyebrow": "Full catalogue",
  "hero.catalogCta.title": "All smartphones, parts and accessories",
  "hero.catalogCta.explore": "Browse",
  "hero.pricesReservedHint": "Price reserved → sign in",
  "hero.newDevicesEyebrow": "New in catalogue",
  "hero.priceOnRequest": "On request",
  "hero.claim.preItalic": "We sell,",
  "hero.claim.italicA": "we repair",
  "hero.claim.between": ", we supply",
  "hero.claim.italicB": "those who sell them",
  "hero.intro.lead": "Three businesses, one warehouse.",
  "hero.intro.boldA": "Retail sales",
  "hero.intro.bodyA": " of smartphones, accessories and parts.",
  "hero.intro.boldB": "Service centre",
  "hero.intro.bodyB": " with in-house lab and 12-month warranty.",
  "hero.intro.boldC": "B2B wholesale",
  "hero.intro.bodyC": " for resellers, repair shops and businesses.",

  "home.numbers.eyebrow": "The group in numbers",
  "home.numbers.titleA": "Three brands. One",
  "home.numbers.titleB": "warehouse.",
  "home.numbers.intro":
    "Cellcom (e-commerce + B2B), Fast-Fix (stores and repairs), ItalianParts (spare parts). Each one focused on its own thing, same stock behind the scenes. The numbers below come live from the CRM — no empty windows.",
  "home.numbers.stat.brands": "Group brands",
  "home.numbers.stat.parts": "Parts in stock",
  "home.numbers.stat.phones": "Phones in catalogue",
  "home.numbers.stat.accessories": "Accessories available",
  "home.numbers.cta.catalog": "Browse the catalogue",
  "home.numbers.cta.about": "About us",
  "home.b2b.eyebrow": "For resellers, operators, businesses",
  "home.b2b.titleA": "Sell phones for a living?",
  "home.b2b.titleB": "The right price list changes everything.",
  "home.b2b.intro":
    "Same stock as retail, volume pricing, dedicated account manager, net 30/60 payment. We just need your VAT number: we call you the same day, credentials within 24 hours.",
  "home.b2b.feature1.title": "Tiered pricing",
  "home.b2b.feature1.body":
    "Reseller, Operator, VIP — the price drops automatically with volume. Nothing to ask every time.",
  "home.b2b.feature2.title": "Priority stock",
  "home.b2b.feature2.body":
    "Scarce parts go first to active contracts, then to retail.",
  "home.b2b.feature3.title": "A real person",
  "home.b2b.feature3.body":
    "Dedicated account manager. Direct email, business WhatsApp. They know who you are.",
  "home.b2b.cta.login": "Sign into B2B area",
  "home.b2b.cta.contact": "Request activation",

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
