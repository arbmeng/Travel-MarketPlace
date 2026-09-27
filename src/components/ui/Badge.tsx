import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "success" | "warning" | "error" | "info" | "accent";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-(--color-surface-elevated) text-(--color-text-secondary)",
  primary: "bg-(--color-primary-50) text-(--color-primary-dark)",
  success: "bg-(--color-success-bg) text-(--color-success)",
  warning: "bg-(--color-warning-bg) text-(--color-warning)",
  error: "bg-(--color-error-bg) text-(--color-error)",
  info: "bg-(--color-info-bg) text-(--color-info)",
  accent: "bg-(--color-accent-light)/40 text-(--color-accent-dark)",
};

export function Badge({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-(--radius-pill) px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-(--color-info) text-xs font-semibold", className)}>
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0">
        <path
          fillRule="evenodd"
          d="M10 1.5 12.4 3l2.8-.3 1 2.6 2.5 1.2-.6 2.7 1 2.5-2 1.9.2 2.8-2.7.7-1.6 2.3-2.6-.8-2.6.8-1.6-2.3-2.7-.7.2-2.8-2-1.9 1-2.5-.6-2.7 2.5-1.2 1-2.6 2.8.3L10 1.5Zm3.4 6.3-4.2 4.2-1.9-1.9-1.1 1 3 3 5.2-5.2-1-1.1Z"
          clipRule="evenodd"
        />
      </svg>
      پشتڕاستکراو
    </span>
  );
}

export function Chip({
  children,
  selected,
  onClick,
  className,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-(--radius-pill) border px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
        selected
          ? "border-(--color-primary) bg-(--color-primary) text-white"
          : "border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:border-(--color-primary-light)",
        className
      )}
    >
      {children}
    </button>
  );
}
