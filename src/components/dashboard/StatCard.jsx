/* eslint-disable no-unused-vars */
import clsx from "clsx";

export default function StatCard({ icon: Icon, label, value, tone = "ink", hint, aosDelay = 0 }) {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={aosDelay}
      className="bg-white border border-line rounded-2xl p-5 hover-lift"
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={clsx(
            "h-9 w-9 rounded-xl flex items-center justify-center",
            tone === "amber" && "bg-amber-soft text-amber-dark",
            tone === "teal" && "bg-teal-soft text-teal",
            tone === "ink" && "bg-ink text-amber"
          )}
        >
          <Icon size={16} />
        </span>
      </div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted mb-1.5">{label}</p>
      <p className="font-mono font-tabular font-semibold text-2xl text-ink truncate">{value}</p>
      {hint && <p className="text-xs text-ink-muted mt-1">{hint}</p>}
    </div>
  );
}