import { Link } from "react-router-dom";
import { Rating } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { GlobeIcon } from "@/components/icons";
import { formatFromPrice } from "@/lib/format";
import { DIFFICULTY_LABELS, TRIP_CATEGORY_LABELS, type Trip } from "@/types";
import { getAgencyById, getDestinationById } from "@/data/mock";
import { cn } from "@/lib/utils";

export function TripCard({ trip, className }: { trip: Trip; className?: string }) {
  const agency = getAgencyById(trip.agencyId);
  const destination = getDestinationById(trip.destinationId);

  return (
    <Link
      to={`/trips/${trip.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-(--radius-lg) bg-(--color-surface) shadow-(--shadow-subtle) transition-shadow hover:shadow-(--shadow-elevated)",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={trip.images[0]}
          alt={trip.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="neutral" className="bg-white/90 backdrop-blur">
              {TRIP_CATEGORY_LABELS[trip.category]}
            </Badge>
            {trip.scope === "international" && (
              <Badge tone="info" icon={<GlobeIcon className="size-3.5" />} className="bg-white/90 backdrop-blur">
                دەرەوەی وڵات
              </Badge>
            )}
          </div>
          <SaveButton id={trip.id} />
        </div>
        {trip.spotsRemaining <= 5 && (
          <div className="absolute inset-x-3 bottom-3">
            <Badge tone="warning" className="bg-white/95 backdrop-blur">
              تەنها {trip.spotsRemaining} شوێن ماوە
            </Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[15px] font-bold text-(--color-text-primary)">{trip.title}</h3>
          <Rating value={trip.rating} size="sm" />
        </div>
        <p className="text-sm text-(--color-text-secondary)">
          {destination?.name}
          {destination && <span className="text-(--color-text-muted)"> · {destination.governorate}</span>}
        </p>
        {agency && (
          <div className="flex items-center gap-1.5 text-xs text-(--color-text-muted)">
            <span>{agency.name}</span>
            {agency.verified && <VerifiedBadge className="text-(--color-info)" />}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-(--color-text-muted)">
          <span>{trip.duration === 1 ? "یەک ڕۆژ" : `${trip.duration} ڕۆژ`}</span>
          <span>·</span>
          <span>{DIFFICULTY_LABELS[trip.difficulty]}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="num text-base font-extrabold text-(--color-primary-dark)">
            {formatFromPrice(trip.priceIqd)}
          </span>
          <span className="text-xs text-(--color-text-muted)">بۆ هەر کەسێک</span>
        </div>
      </div>
    </Link>
  );
}
