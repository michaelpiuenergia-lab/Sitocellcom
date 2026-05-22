export type RepairStatusPublic =
  | "ricevuto"
  | "diagnosi"
  | "preventivo"
  | "approvato"
  | "lavorazione"
  | "pronto"
  | "consegnato";

export interface RepairMock {
  ticketNumber: string;
  phoneSuffix: string; // ultime 4-6 cifre per verifica
  status: RepairStatusPublic;
  deviceBrand: string;
  deviceModel: string;
  imei: string;
  defectReported: string;
  statusHistory: {
    status: RepairStatusPublic;
    timestamp: string;
    note: string;
  }[];
}

export const REPAIR_STATUSES: RepairStatusPublic[] = [
  "ricevuto",
  "diagnosi",
  "preventivo",
  "approvato",
  "lavorazione",
  "pronto",
  "consegnato",
];

export const REPAIR_STATUS_LABELS: Record<RepairStatusPublic, string> = {
  ricevuto: "Ricevuto",
  diagnosi: "Diagnosi",
  preventivo: "Preventivo",
  approvato: "Approvato",
  lavorazione: "Lavorazione",
  pronto: "Pronto",
  consegnato: "Consegnato",
};

export const mockRepairs: RepairMock[] = [
  {
    ticketNumber: "TKT-2026-0042",
    phoneSuffix: "4567",
    status: "lavorazione",
    deviceBrand: "Apple",
    deviceModel: "iPhone 15 Pro",
    imei: "351234567890123",
    defectReported: "Schermo rotto, touch non risponde",
    statusHistory: [
      { status: "ricevuto", timestamp: "2026-05-20T09:00:00Z", note: "Dispositivo ricevuto in negozio" },
      { status: "diagnosi", timestamp: "2026-05-20T11:30:00Z", note: "Diagnosi: sostituzione display OLED" },
      { status: "preventivo", timestamp: "2026-05-20T14:00:00Z", note: "Preventivo inviato al cliente: € 189,00" },
      { status: "approvato", timestamp: "2026-05-20T16:15:00Z", note: "Preventivo approvato dal cliente" },
      { status: "lavorazione", timestamp: "2026-05-21T08:00:00Z", note: "In lavorazione — sostituzione in corso" },
    ],
  },
  {
    ticketNumber: "TKT-2026-0038",
    phoneSuffix: "8910",
    status: "pronto",
    deviceBrand: "Samsung",
    deviceModel: "Galaxy S24 Ultra",
    imei: "358765432109876",
    defectReported: "Batteria si scarica in 2 ore",
    statusHistory: [
      { status: "ricevuto", timestamp: "2026-05-18T10:00:00Z", note: "Dispositivo ricevuto" },
      { status: "diagnosi", timestamp: "2026-05-18T12:00:00Z", note: "Diagnosi: batteria degradata" },
      { status: "preventivo", timestamp: "2026-05-18T15:00:00Z", note: "Preventivo: € 89,00" },
      { status: "approvato", timestamp: "2026-05-18T17:00:00Z", note: "Approvato" },
      { status: "lavorazione", timestamp: "2026-05-19T09:00:00Z", note: "Sostituzione batteria" },
      { status: "pronto", timestamp: "2026-05-19T16:00:00Z", note: "Dispositivo pronto per il ritiro" },
    ],
  },
  {
    ticketNumber: "TKT-2026-0051",
    phoneSuffix: "1122",
    status: "diagnosi",
    deviceBrand: "Google",
    deviceModel: "Pixel 8 Pro",
    imei: "354321098765432",
    defectReported: "Fotocamera anteriore sfocata",
    statusHistory: [
      { status: "ricevuto", timestamp: "2026-05-22T08:30:00Z", note: "Dispositivo ricevuto" },
      { status: "diagnosi", timestamp: "2026-05-22T10:00:00Z", note: "Diagnosi in corso" },
    ],
  },
];

export function findRepair(ticket: string, phoneSuffix: string): RepairMock | undefined {
  return mockRepairs.find(
    (r) => r.ticketNumber.toLowerCase() === ticket.toLowerCase() && r.phoneSuffix === phoneSuffix
  );
}
