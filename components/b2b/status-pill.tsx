type Tone = "neutral" | "info" | "warn" | "success" | "danger" | "muted";

const TONES: Record<Tone, { bg: string; color: string; border: string }> = {
  neutral: { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" },
  info: { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" },
  warn: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  success: { bg: "#dcfce7", color: "#15803d", border: "#86efac" },
  danger: { bg: "#fee2e2", color: "#b91c1c", border: "#fecaca" },
  muted: { bg: "#fafaf8", color: "#737373", border: "#ececec" },
};

export function StatusPill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const t = TONES[tone];
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 font-mono uppercase whitespace-nowrap"
      style={{
        backgroundColor: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        fontSize: "10px",
        letterSpacing: "0.14em",
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}

export function orderTone(s: string): Tone {
  if (s === "draft") return "muted";
  if (s === "confirmed") return "info";
  if (s === "shipped") return "warn";
  if (s === "delivered") return "success";
  if (s === "cancelled") return "danger";
  return "neutral";
}
export function quoteTone(s: string): Tone {
  if (s === "draft") return "muted";
  if (s === "sent") return "warn";
  if (s === "accepted") return "success";
  if (s === "declined") return "danger";
  if (s === "expired") return "neutral";
  return "neutral";
}
export function invoiceTone(s: string): Tone {
  if (s === "draft") return "muted";
  if (s === "sent") return "info";
  if (s === "paid") return "success";
  if (s === "partial") return "warn";
  if (s === "overdue") return "danger";
  if (s === "cancelled") return "neutral";
  return "neutral";
}
export function shipmentTone(s: string): Tone {
  if (s === "preparing") return "muted";
  if (s === "shipped" || s === "in_transit" || s === "out_for_delivery") return "info";
  if (s === "delivered") return "success";
  if (s === "returned" || s === "exception") return "danger";
  return "neutral";
}
