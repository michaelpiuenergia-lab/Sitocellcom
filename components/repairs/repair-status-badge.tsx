import {
  REPAIR_PUBLIC_STATUS_LABELS,
  type RepairPublicStatus,
} from "@/lib/crm-client/types";

/** Colori per stato — coerenti con REPAIR_STATUS_COLORS del CRM. */
const STATUS_TONE: Record<RepairPublicStatus, { bg: string; color: string }> = {
  accepted: { bg: "#f3f4f6", color: "#374151" },
  diagnosed: { bg: "#e0f2fe", color: "#0369a1" },
  in_repair: { bg: "#fef3c7", color: "#92400e" },
  awaiting_parts: { bg: "#f3e8ff", color: "#7e22ce" },
  ready_for_pickup: { bg: "#dcfce7", color: "#15803d" },
  delivered: { bg: "#e5e7eb", color: "#374151" },
  cancelled: { bg: "#fee2e2", color: "#b91c1c" },
};

export function RepairStatusBadge({ status }: { status: RepairPublicStatus }) {
  const tone = STATUS_TONE[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 font-mono uppercase whitespace-nowrap"
      style={{
        backgroundColor: tone.bg,
        color: tone.color,
        fontSize: "10px",
        letterSpacing: "0.14em",
        fontWeight: 600,
      }}
    >
      {REPAIR_PUBLIC_STATUS_LABELS[status]}
    </span>
  );
}
