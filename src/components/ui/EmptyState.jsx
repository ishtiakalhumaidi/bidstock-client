/* eslint-disable no-unused-vars */
import { Inbox } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-line-strong rounded-[var(--radius-card)] bg-paper-dim/40">
      <div className="h-12 w-12 rounded-full bg-white border border-line flex items-center justify-center mb-4">
        <Icon size={20} className="text-ink-muted" />
      </div>
      <h3 className="font-display font-semibold text-ink text-base mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-soft max-w-sm mb-5">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="accent" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}