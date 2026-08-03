import clsx from "clsx";

export default function Card({ className, hover = false, aos, aosDelay, children, ...props }) {
  return (
    <div
      data-aos={aos}
      data-aos-delay={aosDelay}
      className={clsx(
        "bg-white border border-line rounded-[var(--radius-card)]",
        hover && "hover-lift cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ eyebrow, title, action, className }) {
  return (
    <div className={clsx("flex items-start justify-between gap-4 p-5 border-b border-line", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted mb-1 truncate">
            {eyebrow}
          </p>
        )}
        {title && <h3 className="font-display font-semibold text-base text-ink truncate">{title}</h3>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={clsx("p-5", className)}>{children}</div>;
}