import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 shrink-0", className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0">
        <path d="M2 24 L11 9 L16 17 L20 11 L30 24 Z" fill={light ? "#fff" : "var(--color-primary)"} />
        <circle cx="24" cy="8" r="3" fill="var(--color-accent)" />
      </svg>
      <span className={cn("text-xl font-extrabold tracking-tight", light ? "text-white" : "text-(--color-primary-dark)")}>
        زاگرۆس
      </span>
    </Link>
  );
}
