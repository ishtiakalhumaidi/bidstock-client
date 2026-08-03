import clsx from "clsx";

export function Skeleton({ className }) {
  return <div className={clsx("animate-pulse rounded-md bg-paper-dim", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="border border-line rounded-[var(--radius-card)] p-5 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3">
      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/5" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full shrink-0" />
    </div>
  );
}