import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, footer, maxWidth = "max-w-md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-[var(--radius-card)] border border-line shadow-xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-150`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 className="font-display font-semibold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-ink-muted hover:bg-paper-dim hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-line bg-paper-dim/40 rounded-b-[var(--radius-card)]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}