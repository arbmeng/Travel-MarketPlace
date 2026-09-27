import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Rating } from "@/components/ui/Rating";
import { BottomSheet } from "@/components/ui/Modal";
import { MapPinIcon } from "@/components/icons";
import { DESTINATIONS, getTripsByDestination } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Destination } from "@/types";

// Geographic bounding box comfortably containing every destination's lat/lng in mock.ts
// (observed range: lat ≈ 35.2–37.14, lng ≈ 42.68–46.05). This is the ONLY place that knows
// about geographic projection — swapping in a real map SDK (Mapbox/Google Maps) later only
// means replacing `projectLatLng` and the static backdrop below with the SDK's own layer;
// everything else (marker list, selection, popovers) can stay as-is.
const MAP_BOUNDS = { minLat: 35, maxLat: 37.2, minLng: 42.5, maxLng: 46.2 };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function projectLatLng(lat: number, lng: number) {
  const top = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  const left = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  return { top: clamp(top, 4, 94), left: clamp(left, 4, 94) };
}

export default function MapExplorerPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const listRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const selected = useMemo(() => DESTINATIONS.find((d) => d.id === selectedId) ?? null, [selectedId]);

  function selectDestination(d: Destination) {
    setSelectedId(d.id);
    setSheetOpen(true);
    const el = listRefs.current[d.id];
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col lg:flex-row">
      {/* Map canvas */}
      <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-(--color-primary-50) via-(--color-surface-elevated) to-(--color-accent-light)/30">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, var(--color-primary-light) 0, transparent 30%), radial-gradient(circle at 60% 15%, var(--color-secondary-light) 0, transparent 28%), radial-gradient(circle at 80% 70%, var(--color-accent) 0, transparent 32%), radial-gradient(circle at 30% 80%, var(--color-primary) 0, transparent 25%)",
          }}
        />
        <div className="absolute inset-0 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />

        {DESTINATIONS.map((d) => {
          const { top, left } = projectLatLng(d.lat, d.lng);
          const isSelected = selectedId === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => selectDestination(d)}
              style={{ top: `${top}%`, left: `${left}%` }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-full transition-transform",
                isSelected ? "z-20 scale-125" : "z-10 hover:scale-110"
              )}
              aria-label={d.name}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border-2 border-white shadow-(--shadow-elevated)",
                  isSelected ? "bg-(--color-secondary)" : "bg-(--color-primary)"
                )}
              >
                <MapPinIcon className="size-4 text-white" />
              </span>
              <span
                className={cn(
                  "mx-auto mt-1 block w-max max-w-28 truncate rounded-(--radius-pill) bg-(--color-surface)/95 px-2 py-0.5 text-[11px] font-semibold text-(--color-text-primary) shadow-(--shadow-subtle)",
                  isSelected ? "opacity-100" : "opacity-0 lg:opacity-100"
                )}
              >
                {d.name}
              </span>
            </button>
          );
        })}

        {/* Desktop popover for selected marker */}
        {selected && (
          <div
            className="absolute z-30 hidden w-64 -translate-x-1/2 rounded-(--radius-lg) bg-(--color-surface) p-4 shadow-(--shadow-floating) lg:block"
            style={{
              top: `calc(${projectLatLng(selected.lat, selected.lng).top}% + 2.5rem)`,
              left: `${projectLatLng(selected.lat, selected.lng).left}%`,
            }}
          >
            <MapPreviewCard destination={selected} />
          </div>
        )}
      </div>

      {/* Desktop side result list */}
      <aside className="hidden w-96 shrink-0 overflow-y-auto border-s border-(--color-border) bg-(--color-surface) lg:block">
        <div className="border-b border-(--color-border) p-4">
          <h1 className="text-lg font-extrabold text-(--color-text-primary)">شوێنەکان لەسەر نەخشە</h1>
          <p className="text-sm text-(--color-text-secondary)">{DESTINATIONS.length} شوێن لە کوردستان</p>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {DESTINATIONS.map((d) => (
            <div
              key={d.id}
              ref={(el) => {
                listRefs.current[d.id] = el;
              }}
              onClick={() => selectDestination(d)}
              className={cn(
                "flex cursor-pointer gap-3 rounded-(--radius-md) border p-3 transition-colors",
                selectedId === d.id ? "border-(--color-primary) bg-(--color-primary-50)" : "border-transparent hover:bg-(--color-surface-elevated)"
              )}
            >
              <img src={d.images[0]} alt={d.name} className="size-16 shrink-0 rounded-(--radius-sm) object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-(--color-text-primary)">{d.name}</p>
                <p className="text-xs text-(--color-text-muted)">{d.governorate}</p>
                <Rating value={d.rating} reviewCount={d.reviewCount} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile bottom sheet */}
      <BottomSheet open={sheetOpen && !!selected} onClose={() => setSheetOpen(false)}>
        {selected && <MapPreviewCard destination={selected} />}
      </BottomSheet>
    </div>
  );
}

function MapPreviewCard({ destination }: { destination: Destination }) {
  const tripCount = getTripsByDestination(destination.id).length;
  return (
    <div className="flex flex-col gap-3">
      <img src={destination.images[0]} alt={destination.name} className="h-32 w-full rounded-(--radius-md) object-cover" />
      <div>
        <p className="font-bold text-(--color-text-primary)">{destination.name}</p>
        <p className="text-xs text-(--color-text-muted)">{destination.governorate} · {tripCount} گەشت</p>
      </div>
      <Rating value={destination.rating} reviewCount={destination.reviewCount} size="sm" />
      <p className="line-clamp-2 text-sm text-(--color-text-secondary)">{destination.tagline}</p>
      <Link to={`/destinations/${destination.slug}#trips`} className="rounded-(--radius-pill) bg-(--color-primary) px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-(--color-primary-dark)">
        بینینی گەشتەکان
      </Link>
    </div>
  );
}
