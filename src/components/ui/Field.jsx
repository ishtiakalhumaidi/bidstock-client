import clsx from "clsx";

const baseFieldStyles =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-ink focus:outline-none disabled:bg-paper-dim disabled:text-ink-muted";

function Wrapper({ label, error, hint, required, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-ink-soft">
          {label} {required && <span className="text-red">*</span>}
        </label>
      )}
      {children}
      {error ? <p className="text-xs text-red">{error}</p> : hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function Input({ label, error, hint, required, className, ...props }) {
  return (
    <Wrapper label={label} error={error} hint={hint} required={required}>
      <input className={clsx(baseFieldStyles, error && "border-red", className)} {...props} />
    </Wrapper>
  );
}

export function Textarea({ label, error, hint, required, className, rows = 4, ...props }) {
  return (
    <Wrapper label={label} error={error} hint={hint} required={required}>
      <textarea rows={rows} className={clsx(baseFieldStyles, "resize-none", error && "border-red", className)} {...props} />
    </Wrapper>
  );
}

export function Select({ label, error, hint, required, className, children, ...props }) {
  return (
    <Wrapper label={label} error={error} hint={hint} required={required}>
      <select className={clsx(baseFieldStyles, "appearance-none bg-white", error && "border-red", className)} {...props}>
        {children}
      </select>
    </Wrapper>
  );
}