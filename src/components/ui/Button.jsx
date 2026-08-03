import clsx from "clsx";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-ink text-paper hover:bg-ink/90 focus-visible:outline-ink disabled:bg-ink/40",
  accent: "bg-amber text-ink hover:bg-amber-dark hover:text-paper disabled:bg-amber/40",
  outline: "bg-transparent text-ink border border-line-strong hover:border-ink hover:bg-paper-dim disabled:opacity-40",
  ghost: "bg-transparent text-ink-soft hover:bg-paper-dim hover:text-ink disabled:opacity-40",
  danger: "bg-red text-paper hover:bg-red/90 disabled:bg-red/40",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-sm gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-150 press-scale",
        "disabled:cursor-not-allowed disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
}