import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-(--color-primary) text-white hover:bg-(--color-primary-dark) active:bg-(--color-primary-dark) disabled:bg-(--color-text-muted)",
  secondary:
    "bg-(--color-secondary) text-white hover:bg-(--color-secondary-dark) active:bg-(--color-secondary-dark) disabled:bg-(--color-text-muted)",
  outline:
    "border border-(--color-border) bg-transparent text-(--color-text-primary) hover:bg-(--color-surface-elevated) active:bg-(--color-surface-elevated)",
  ghost:
    "bg-transparent text-(--color-text-primary) hover:bg-(--color-surface-elevated) active:bg-(--color-surface-elevated)",
  danger:
    "bg-(--color-error) text-white hover:opacity-90 active:opacity-80",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[15px] gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

export function buttonClassName(variant: Variant = "primary", size: Size = "md", opts?: { fullWidth?: boolean; className?: string }) {
  return cn(
    "inline-flex items-center justify-center rounded-(--radius-pill) font-semibold transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    opts?.fullWidth && "w-full",
    opts?.className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, iconLeft, iconRight, fullWidth, disabled, className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-(--radius-pill) font-semibold transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        iconLeft
      )}
      {children}
      {!loading && iconRight}
    </button>
  );
});
