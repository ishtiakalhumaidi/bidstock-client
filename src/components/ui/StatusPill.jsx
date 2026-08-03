import clsx from "clsx";

const TONE_MAP = {
  open: "teal", active: "teal", available: "teal", completed: "teal", accepted: "teal", paid: "teal",
  pending: "amber", suspended: "amber", booked: "amber",
  closed: "muted", inactive: "muted",
  rejected: "red", failed: "red", maintenance: "red", cancelled: "red",
};

const TONE_STYLES = {
  teal: "bg-teal-soft text-teal",
  amber: "bg-amber-soft text-amber-dark",
  red: "bg-red-soft text-red",
  muted: "bg-paper-dim text-ink-muted",
};

export default function StatusPill({ status, label }) {
  const tone = TONE_MAP[String(status).toLowerCase()] || "muted";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-mono font-medium uppercase tracking-wide whitespace-nowrap",
        TONE_STYLES[tone]
      )}
    >
      <span
        className={clsx(
          "h-1.5 w-1.5 rounded-full shrink-0",
          tone === "teal" && "bg-teal",
          tone === "amber" && "bg-amber-dark",
          tone === "red" && "bg-red",
          tone === "muted" && "bg-ink-muted"
        )}
      />
      {label || status}
    </span>
  );
}