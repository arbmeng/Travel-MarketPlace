import { Link } from "react-router-dom";
import { Rating } from "@/components/ui/Rating";
import { VerifiedBadge } from "@/components/ui/Badge";
import type { Agency } from "@/types";
import { cn } from "@/lib/utils";

export function AgencyCard({ agency, className }: { agency: Agency; className?: string }) {
  return (
    <Link
      to={`/agencies/${agency.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-(--radius-lg) bg-(--color-surface) shadow-(--shadow-subtle) transition-shadow hover:shadow-(--shadow-elevated)",
        className
      )}
    >
      <div className="relative h-28 w-full overflow-hidden">
        <img src={agency.cover} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-col gap-2 p-4 pt-0">
        <img
          src={agency.logo}
          alt={agency.name}
          className="-mt-8 size-16 rounded-(--radius-md) border-4 border-(--color-surface) bg-(--color-surface) object-cover shadow-(--shadow-subtle)"
        />
        <div className="flex items-center gap-1.5">
          <h3 className="font-bold text-(--color-text-primary)">{agency.name}</h3>
          {agency.verified && <VerifiedBadge />}
        </div>
        <Rating value={agency.rating} reviewCount={agency.reviewCount} size="sm" />
        <p className="text-sm text-(--color-text-muted)">{agency.location} · {agency.tripCount} گەشت</p>
        <span className="mt-2 inline-flex h-9 items-center justify-center rounded-(--radius-pill) border border-(--color-border) px-3.5 text-sm font-semibold text-(--color-text-primary) transition-colors group-hover:bg-(--color-surface-elevated)">
          پڕۆفایل ببینە
        </span>
      </div>
    </Link>
  );
}
