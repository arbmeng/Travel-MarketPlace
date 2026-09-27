import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-(--radius-lg) border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-16 text-center", className)}>
      {icon && <div className="flex size-16 items-center justify-center rounded-full bg-(--color-surface-elevated) text-(--color-text-muted)">{icon}</div>}
      <h3 className="text-lg font-bold text-(--color-text-primary)">{title}</h3>
      {description && <p className="max-w-sm text-sm text-(--color-text-secondary)">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-(--radius-lg) bg-(--color-error-bg) px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-white text-(--color-error)">
        <svg viewBox="0 0 24 24" fill="none" className="size-7">
          <path d="M12 8v5M12 16.5h.01M10.3 3.8 2.6 17.2c-.6 1 .1 2.3 1.3 2.3h16.2c1.2 0 1.9-1.3 1.3-2.3L13.7 3.8c-.6-1-2-1-2.6 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-(--color-text-primary)">{title}</h3>
      {description && <p className="max-w-sm text-sm text-(--color-text-secondary)">{description}</p>}
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-(--radius-md) bg-(--color-surface-elevated)", className)} />;
}

export function TripCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/3] w-full rounded-(--radius-lg)" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  );
}
