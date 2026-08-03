import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-line-strong text-ink-soft hover:bg-paper-dim disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {showEllipsis && <span className="text-ink-muted text-sm px-1">…</span>}
            <button
              onClick={() => onChange(p)}
              className={clsx(
                "h-9 min-w-9 px-2.5 rounded-lg text-sm font-mono transition-colors",
                p === page ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-dim"
              )}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-line-strong text-ink-soft hover:bg-paper-dim disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}