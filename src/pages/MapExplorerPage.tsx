import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { divIcon } from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import { Rating } from "@/components/ui/Rating";
import { BottomSheet } from "@/components/ui/Modal";
import { MapPinIcon, SearchIcon, XCircleIcon } from "@/components/icons";
import { DESTINATIONS, getTripsByDestination } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Destination } from "@/types";

const KURDISTAN_CENTER: [number, number] = [36.2, 44.1];

function destinationIcon(selected: boolean) {
  return divIcon({
    className: "zerrin-marker-host",
    html: `<span class="zerrin-marker${selected ? " is-selected" : ""}"><span></span></span>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export default function MapExplorerPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState("");
  const listRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selected = useMemo(() => DESTINATIONS.find((d) => d.id === selectedId) ?? null, [selectedId]);
  const visibleDestinations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return normalizedQuery
      ? DESTINATIONS.filter((d) => `${d.name} ${d.governorate} ${d.tagline}`.toLocaleLowerCase().includes(normalizedQuery))
      : DESTINATIONS;
  }, [query]);

  function selectDestination(d: Destination) {
    setSelectedId(d.id);
    setSheetOpen(true);
    const el = listRefs.current[d.id];
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className="flex h-[calc(100dvh-8rem)] min-h-[420px] flex-col lg:h-[calc(100dvh-4.5rem)] lg:flex-row">
      <div className="relative min-h-0 flex-1 overflow-hidden bg-(--color-surface-elevated)">
        <MapContainer center={KURDISTAN_CENTER} zoom={7} minZoom={5} maxZoom={17} scrollWheelZoom zoomControl={false} className="size-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
          />
          <ZoomControl position="bottomleft" />
          <MapFollowSelection destination={selected} />
          {visibleDestinations.map((destination) => (
            <Marker
              key={destination.id}
              position={[destination.lat, destination.lng]}
              title={destination.name}
              icon={destinationIcon(selectedId === destination.id)}
              eventHandlers={{ click: () => selectDestination(destination) }}
            >
              <Tooltip direction="top" offset={[0, -16]}>{destination.name}</Tooltip>
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute start-4 top-4 z-[1000] w-[min(22rem,calc(100%-2rem))]">
          <label className="relative block">
            <SearchIcon className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-(--color-text-muted)" />
            <input
              aria-label="گەڕان بۆ شوێن لەسەر نەخشە"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="گەڕان بۆ شوێن یان پارێزگا..."
              className="h-12 w-full rounded-[8px] border border-(--color-border) bg-white/95 ps-10 pe-10 text-sm text-(--color-text-primary) shadow-(--shadow-elevated) outline-none backdrop-blur placeholder:text-(--color-text-muted) focus:border-(--color-primary)"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="سڕینەوەی گەڕان" className="absolute end-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)">
                <XCircleIcon className="size-4" />
              </button>
            )}
          </label>
          {query && (
            <div className="mt-2 overflow-hidden rounded-[8px] border border-(--color-border) bg-white/95 shadow-(--shadow-elevated) backdrop-blur">
              {visibleDestinations.length ? visibleDestinations.slice(0, 5).map((destination) => (
                <button key={destination.id} type="button" onClick={() => selectDestination(destination)} className="flex w-full items-center gap-3 border-b border-(--color-border) px-3 py-2.5 text-start last:border-0 hover:bg-(--color-primary-50)">
                  <MapPinIcon className="size-4 shrink-0 text-(--color-accent-dark)" />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-(--color-text-primary)">{destination.name}</span>
                  <span className="truncate text-xs text-(--color-text-muted)">{destination.governorate}</span>
                </button>
              )) : <p className="px-3 py-3 text-sm text-(--color-text-secondary)">هیچ شوێنێک نەدۆزرایەوە.</p>}
            </div>
          )}
        </div>

        <div className="absolute bottom-4 start-4 z-[1000] flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-xs font-semibold text-(--color-text-secondary) shadow-(--shadow-medium) backdrop-blur">
          <MapPinIcon className="size-4 text-(--color-accent-dark)" />
          {visibleDestinations.length} شوێن
        </div>

        {selected && (
          <div className="absolute bottom-4 end-4 z-[1000] hidden w-72 rounded-[8px] border border-(--color-border) bg-white p-4 shadow-(--shadow-floating) lg:block">
            <button type="button" onClick={() => setSelectedId(null)} aria-label="داخستنی زانیاری شوێن" className="absolute end-3 top-3 text-(--color-text-muted) hover:text-(--color-text-primary)">
              <XCircleIcon className="size-5" />
            </button>
            <MapPreviewCard destination={selected} />
          </div>
        )}
      </div>

      <aside className="hidden w-96 shrink-0 overflow-y-auto border-s border-(--color-border) bg-(--color-surface) lg:block">
        <div className="border-b border-(--color-border) p-4">
          <h1 className="text-lg font-extrabold text-(--color-text-primary)">شوێنەکان لەسەر نەخشە</h1>
          <p className="mt-1 text-sm text-(--color-text-secondary)">{visibleDestinations.length} شوێن لە کوردستان و جیهان</p>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {visibleDestinations.map((d) => (
            <button
              key={d.id}
              type="button"
              ref={(el) => {
                listRefs.current[d.id] = el;
              }}
              onClick={() => selectDestination(d)}
              className={cn(
                "flex w-full gap-3 rounded-[8px] border p-3 text-start transition-colors",
                selectedId === d.id ? "border-(--color-primary) bg-(--color-primary-50)" : "border-transparent hover:bg-(--color-surface-elevated)"
              )}
            >
              <img src={d.images[0]} alt={d.name} className="size-16 shrink-0 rounded-(--radius-sm) object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-(--color-text-primary)">{d.name}</p>
                <p className="text-xs text-(--color-text-muted)">{d.governorate}</p>
                <Rating value={d.rating} reviewCount={d.reviewCount} size="sm" />
              </div>
            </button>
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

function MapFollowSelection({ destination }: { destination: Destination | null }) {
  const map = useMap();

  useEffect(() => {
    if (destination) map.flyTo([destination.lat, destination.lng], Math.max(map.getZoom(), 9), { duration: 0.7 });
  }, [destination, map]);

  return null;
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
