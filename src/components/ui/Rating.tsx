import { cn } from "@/lib/utils";
import { formatRating } from "@/lib/format";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 1.6 12.6 7l5.9.9-4.3 4.1 1 5.9L10 15.1l-5.2 2.8 1-5.9L1.5 7.9l5.9-.9L10 1.6Z" />
    </svg>
  );
}

export function Rating({
  value,
  reviewCount,
  size = "md",
  showValue = true,
}: {
  value: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}) {
  const iconSize = size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";
  return (
    <span className={cn("inline-flex items-center gap-1", textSize)}>
      <StarIcon className={cn(iconSize, "text-(--color-accent)")} />
      {showValue && <span className="num font-semibold text-(--color-text-primary)">{formatRating(value)}</span>}
      {reviewCount !== undefined && (
        <span className="text-(--color-text-muted)">({reviewCount.toLocaleString("en-US")})</span>
      )}
    </span>
  );
}

export function RatingStars({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5";
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(value);
        return (
          <StarIcon
            key={i}
            className={cn(iconSize, filled ? "text-(--color-accent)" : "text-(--color-border)")}
          />
        );
      })}
    </span>
  );
}
