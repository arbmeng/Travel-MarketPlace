import { Link } from "react-router-dom";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { GlobeIcon } from "@/components/icons";
import type { Destination } from "@/types";
import { cn } from "@/lib/utils";
import { getTripsByDestination } from "@/data/mock";

export function DestinationCard({ destination, className }: { destination: Destination; className?: string }) {
  const tripCount = getTripsByDestination(destination.id).length;
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className={cn(
        "group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-(--radius-lg) shadow-(--shadow-subtle) transition-shadow hover:shadow-(--shadow-elevated)",
        className
      )}
    >
      <img
        src={destination.images[0]}
        alt={destination.name}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      {destination.scope === "international" && (
        <Badge tone="info" icon={<GlobeIcon className="size-3.5" />} className="absolute end-3 top-3 z-10 bg-white/90 backdrop-blur">
          دەرەوەی وڵات
        </Badge>
      )}
      <div className="relative z-10 flex flex-col gap-1 p-4 text-white">
        <span className="text-xs font-medium text-white/80">{destination.governorate}</span>
        <h3 className="text-xl font-extrabold">{destination.name}</h3>
        <p className="text-sm text-white/85">{destination.tagline}</p>
        <div className="mt-1 flex items-center justify-between text-white">
          <Rating value={destination.rating} reviewCount={destination.reviewCount} size="sm" />
          <span className="text-xs text-white/80">{tripCount} گەشت</span>
        </div>
      </div>
    </Link>
  );
}

export function DestinationChip({ destination }: { destination: Destination }) {
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className="group flex shrink-0 flex-col items-center gap-2 text-center"
    >
      <div className="size-20 overflow-hidden rounded-full ring-2 ring-transparent transition group-hover:ring-(--color-accent) sm:size-24">
        <img src={destination.images[0]} alt={destination.name} className="size-full object-cover transition-transform group-hover:scale-110" />
      </div>
      <span className="text-sm font-semibold text-(--color-text-primary)">{destination.name}</span>
    </Link>
  );
}
