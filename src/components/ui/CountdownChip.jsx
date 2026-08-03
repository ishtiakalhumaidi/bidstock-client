import { useEffect, useState } from "react";
import clsx from "clsx";
import { Timer } from "lucide-react";

function formatRemaining(endTime) {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return { text: "Closed", expired: true, urgent: false };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const urgent = diff < 1000 * 60 * 60;

  let text;
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    text = `${days}d ${hours % 24}h left`;
  } else if (hours > 0) {
    text = `${hours}h ${minutes}m left`;
  } else {
    text = `${minutes}m ${seconds}s left`;
  }

  return { text, expired: false, urgent };
}

export default function CountdownChip({ endTime, className }) {
  const [state, setState] = useState(() => formatRemaining(endTime));

  useEffect(() => {
    const id = setInterval(() => setState(formatRemaining(endTime)), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-mono font-medium whitespace-nowrap shrink-0",
        state.expired ? "bg-paper-dim text-ink-muted" : state.urgent ? "bg-red-soft text-red animate-pulse" : "bg-amber-soft text-amber-dark",
        className
      )}
    >
      <Timer size={12} />
      {state.text}
    </span>
  );
}