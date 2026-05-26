/**
 * Catalogo tipi riparazione per il wizard /riparazioni.
 *
 * Niente prezzi visibili all'utente — la diagnosi è gratuita e il preventivo
 * arriva dopo che il tecnico ha visto le foto (o ricevuto il dispositivo).
 *
 * I tipi qui sono "categorie diagnostiche" che il tecnico CRM riconosce
 * subito. L'utente fa multi-select e descrive il problema nel form.
 */

export type RepairTypeId =
  | "schermo"
  | "batteria"
  | "vetro-retro"
  | "scocca"
  | "fotocamera"
  | "porta-ricarica"
  | "audio"
  | "acqua"
  | "software"
  | "scheda-madre"
  | "altro";

export type RepairType = {
  id: RepairTypeId;
  label: string;
  /** Frase breve mostrata sotto il titolo nella card */
  description: string;
  /** Categoria iconografica per scegliere l'SVG */
  icon: "screen" | "battery" | "back" | "case" | "camera" | "port" | "audio" | "water" | "software" | "chip" | "other";
};

export const REPAIR_TYPES: RepairType[] = [
  {
    id: "schermo",
    label: "Schermo / Touch",
    description: "Vetro frontale rotto, display nero, touch che non risponde, linee colorate, macchie.",
    icon: "screen",
  },
  {
    id: "batteria",
    label: "Batteria",
    description: "Si scarica velocemente, non tiene la carica, gonfiata, spegnimenti improvvisi.",
    icon: "battery",
  },
  {
    id: "vetro-retro",
    label: "Vetro posteriore",
    description: "Vetro retro rotto o scheggiato, anche se le funzioni sotto sono integre.",
    icon: "back",
  },
  {
    id: "scocca",
    label: "Scocca / Telaio",
    description: "Bordi piegati, telaio storto, pulsanti laterali bloccati, ammaccature gravi.",
    icon: "case",
  },
  {
    id: "fotocamera",
    label: "Fotocamera",
    description: "Lente rotta, foto sfocate, autofocus non funziona, flash spento, video laggati.",
    icon: "camera",
  },
  {
    id: "porta-ricarica",
    label: "Porta di ricarica",
    description: "Non si carica più, cavo non entra, ricarica solo in certe posizioni, perde percentuale.",
    icon: "port",
  },
  {
    id: "audio",
    label: "Audio / Microfono",
    description: "Altoparlante non funziona, vivavoce muto, microfono non registra, capsula auricolare debole.",
    icon: "audio",
  },
  {
    id: "acqua",
    label: "Danno da acqua",
    description: "Caduto in acqua, esposto a pioggia o umidità, schermo con aloni, non accende dopo bagno.",
    icon: "water",
  },
  {
    id: "software",
    label: "Software / Sblocco",
    description: "Telefono bloccato, codice dimenticato, errore iCloud / FRP Samsung, aggiornamento andato male.",
    icon: "software",
  },
  {
    id: "scheda-madre",
    label: "Scheda madre / Recupero dati",
    description: "Non accende per niente, microsaldatura BGA, IC danneggiato, recupero foto/contatti da telefono morto.",
    icon: "chip",
  },
  {
    id: "altro",
    label: "Altro / Diagnosi",
    description: "Non sai cosa hai? Lo scopriamo noi. Diagnosi gratuita, ti chiamiamo dopo.",
    icon: "other",
  },
];

export function findRepairType(id: string): RepairType | null {
  return REPAIR_TYPES.find((r) => r.id === id) ?? null;
}

export type ServiceMode = "in-store" | "ship-to-us" | "at-home" | "pickup-at-home";

export const SERVICE_MODES: Array<{
  id: ServiceMode;
  label: string;
  description: string;
  iconHint: string;
  /** Costo aggiuntivo per la logistica del servizio (non per la riparazione) */
  priceEur: number;
  priceLabel: string;
}> = [
  {
    id: "in-store",
    label: "Porta in negozio",
    description:
      "Scegli il punto vendita più comodo, lo porti quando vuoi. Diagnosi gratuita.",
    iconHint: "store",
    priceEur: 0,
    priceLabel: "Gratis",
  },
  {
    id: "ship-to-us",
    label: "Spedisci tu",
    description:
      "Imballi e spedisci da qualsiasi ufficio postale o Punto Poste — tracciabile a tua scelta. Riparazione in 24-48h dalla ricezione.",
    iconHint: "package",
    priceEur: 15,
    priceLabel: "+15 €",
  },
  {
    id: "pickup-at-home",
    label: "Ritiriamo noi a casa",
    description:
      "Fissi un appuntamento, il corriere passa, lo prende e te lo riporta riparato in 24-48h.",
    iconHint: "truck",
    priceEur: 15,
    priceLabel: "+15 €",
  },
  {
    id: "at-home",
    label: "Riparazione a domicilio",
    description:
      "Per riparazioni standard (schermo, batteria) il tecnico viene a casa tua mentre aspetti. Disponibilità limitata.",
    iconHint: "home",
    priceEur: 49,
    priceLabel: "+49 €",
  },
];
