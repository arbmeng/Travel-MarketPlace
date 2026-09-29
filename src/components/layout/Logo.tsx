import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" aria-label="Zerrin.Travel" className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <svg viewBox="0 0 64 64" className="size-10 shrink-0" aria-hidden="true">
        <circle cx="48" cy="12" r="7" fill="var(--color-accent)" />
        <path d="M4 39 19 21l9-8 10 9 5-5 17 23-18-6-8-7-8 7-9-3z" fill={light ? "#fff" : "var(--color-primary)"} />
        <path d="M11 39c8-7 22-12 27-18 4-5-2-8-9-9 12 0 22 5 18 12-4 7-17 14-25 19-5 4-1 7 7 9l18 5-28-3C7 52 4 45 11 39Z" fill="var(--color-accent)" />
        <path d="M15 38c8-5 18-10 22-15" fill="none" stroke={light ? "var(--color-primary-dark)" : "var(--color-surface)"} strokeLinecap="round" strokeWidth="2.5" />
      </svg>
      <span dir="ltr" className="flex items-baseline gap-1 leading-none">
        <span className={cn("font-serif text-[25px] font-bold", light ? "text-white" : "text-(--color-primary-dark)")}>Zerrin</span>
        <span className="font-latin text-[17px] font-medium text-(--color-accent-dark)">.Travel</span>
      </span>
    </Link>
  );
}
