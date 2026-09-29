import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/Modal";
import { EmptyState, TripCardSkeleton } from "@/components/ui/States";
import { TripCard } from "@/components/cards/TripCard";
import { CompassIcon, FilterIcon, GlobeIcon, MapPinIcon, SearchIcon, XCircleIcon, ChevronDownIcon } from "@/components/icons";
import { COUNTRIES, DESTINATIONS, GOVERNORATES, TRIPS, getAgencyById, getDestinationById } from "@/data/mock";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DIFFICULTY_LABELS, TRAVEL_SCOPE_LABELS, TRIP_CATEGORY_LABELS, type Difficulty, type Trip, type TravelScope, type TripCategory } from "@/types";

type ScopeFilter = "all" | TravelScope;
const SCOPE_OPTIONS: ScopeFilter[] = ["all", "domestic", "international"];

const CATEGORIES: TripCategory[] = ["nature", "adventure", "family", "romantic", "historical", "camping", "hiking", "food", "luxury"];
const DIFFICULTIES: Difficulty[] = ["easy", "moderate", "hard"];
const DURATION_BUCKETS = [
  { key: "all", label: "هەموو ماوەکان" },
  { key: "1", label: "١ ڕۆژ" },
  { key: "2", label: "٢ ڕۆژ" },
  { key: "3+", label: "٣ ڕۆژ و زیاتر" },
] as const;
type DurationBucket = (typeof DURATION_BUCKETS)[number]["key"];

const RATING_OPTIONS = [
  { key: 0, label: "هەموو هەڵسەنگاندنەکان" },
  { key: 4, label: "٤+ ئەستێرە" },
  { key: 4.5, label: "٤.٥+ ئەستێرە" },
] as const;

type SortKey = "recommended" | "popular" | "rating" | "price_low" | "newest";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "پێشنیارکراو" },
  { key: "popular", label: "بەناوبانگترین" },
  { key: "rating", label: "بەرزترین هەڵسەنگاندن" },
  { key: "price_low", label: "هەرزانترین نرخ" },
  { key: "newest", label: "نوێترین" },
];

const MAX_PRICE = Math.ceil(Math.max(...TRIPS.map((t) => t.priceIqd)) / 50000) * 50000;
const TRANSPORT_OPTIONS = Array.from(new Set(TRIPS.map((t) => t.transportation)));
const ACCOMMODATION_OPTIONS = Array.from(new Set(TRIPS.map((t) => t.accommodation).filter((a) => a && a !== "-")));
const ACTIVITY_OPTIONS = Array.from(new Set(DESTINATIONS.flatMap((d) => d.activities)));

interface Filters {
  scope: ScopeFilter;
  destinationId: string;
  governorate: string;
  categories: TripCategory[];
  difficulties: Difficulty[];
  minPrice: number;
  maxPrice: number;
  duration: DurationBucket;
  minRating: number;
  familyFriendly: boolean;
  privateOnly: boolean;
  transportation: string;
  accommodation: string;
  activities: string[];
}

const DEFAULT_FILTERS: Filters = {
  scope: "all",
  destinationId: "all",
  governorate: "all",
  categories: [],
  difficulties: [],
  minPrice: 0,
  maxPrice: MAX_PRICE,
  duration: "all",
  minRating: 0,
  familyFriendly: false,
  privateOnly: false,
  transportation: "all",
  accommodation: "all",
  activities: [],
};

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function matchesFilters(trip: Trip, filters: Filters): boolean {
  const destination = getDestinationById(trip.destinationId);
  if (filters.scope !== "all" && trip.scope !== filters.scope) return false;
  if (filters.destinationId !== "all" && trip.destinationId !== filters.destinationId) return false;
  if (filters.governorate !== "all" && destination?.governorate !== filters.governorate) return false;
  if (filters.categories.length && !filters.categories.includes(trip.category)) return false;
  if (filters.difficulties.length && !filters.difficulties.includes(trip.difficulty)) return false;
  if (trip.priceIqd < filters.minPrice || trip.priceIqd > filters.maxPrice) return false;
  if (filters.duration === "1" && trip.duration !== 1) return false;
  if (filters.duration === "2" && trip.duration !== 2) return false;
  if (filters.duration === "3+" && trip.duration < 3) return false;
  if (trip.rating < filters.minRating) return false;
  if (filters.familyFriendly && !trip.familyFriendly) return false;
  if (filters.privateOnly && !trip.privateAvailable) return false;
  if (filters.transportation !== "all" && trip.transportation !== filters.transportation) return false;
  if (filters.accommodation !== "all" && trip.accommodation !== filters.accommodation) return false;
  if (filters.activities.length && !(destination && filters.activities.every((a) => destination.activities.includes(a)))) return false;
  return true;
}

function matchesSearch(trip: Trip, query: string): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;
  const destination = getDestinationById(trip.destinationId);
  const agency = getAgencyById(trip.agencyId);
  return [trip.title, trip.description, destination?.name, destination?.governorate, agency?.name, agency?.location]
    .some((value) => value?.toLocaleLowerCase().includes(normalizedQuery));
}

function sortTrips(list: Trip[], key: SortKey): Trip[] {
  const arr = [...list];
  const sponsoredFirst = (a: Trip, b: Trip) => Number(Boolean(b.sponsored)) - Number(Boolean(a.sponsored));
  switch (key) {
    case "popular":
      return arr.sort((a, b) => sponsoredFirst(a, b) || b.reviewCount - a.reviewCount);
    case "rating":
      return arr.sort((a, b) => sponsoredFirst(a, b) || b.rating - a.rating);
    case "price_low":
      return arr.sort((a, b) => sponsoredFirst(a, b) || a.priceIqd - b.priceIqd);
    case "newest":
      return arr.reverse().sort(sponsoredFirst);
    default:
      return arr.sort((a, b) => sponsoredFirst(a, b) || b.rating * b.reviewCount - a.rating * a.reviewCount);
  }
}

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => {
    const urlScope = searchParams.get("scope");
    return urlScope === "domestic" || urlScope === "international" ? { ...DEFAULT_FILTERS, scope: urlScope } : DEFAULT_FILTERS;
  });
  const [sortKey, setSortKey] = useState<SortKey>("recommended");
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtersKey = `${JSON.stringify(filters)}|${query}`;
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  const results = useMemo(
    () => sortTrips(TRIPS.filter((trip) => matchesFilters(trip, filters) && matchesSearch(trip, query)), sortKey),
    [filters, query, sortKey]
  );

  const activeFilterCount =
    (filters.destinationId !== "all" ? 1 : 0) +
    (filters.governorate !== "all" ? 1 : 0) +
    filters.categories.length +
    filters.difficulties.length +
    (filters.minPrice > 0 || filters.maxPrice < MAX_PRICE ? 1 : 0) +
    (filters.duration !== "all" ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.familyFriendly ? 1 : 0) +
    (filters.privateOnly ? 1 : 0) +
    (filters.transportation !== "all" ? 1 : 0) +
    (filters.accommodation !== "all" ? 1 : 0) +
    filters.activities.length +
    (query.trim() ? 1 : 0);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
  }

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">بگەڕێ بۆ گەشتەکان</h1>
            <p className="mt-1.5 text-sm text-(--color-text-secondary)">
              <span className="num font-semibold text-(--color-text-primary)">{results.length}</span> گەشت دۆزرایەوە
            </p>
          </div>
          <label className="relative block w-full md:max-w-md">
            <SearchIcon className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-(--color-text-muted)" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ناوی گەشت، شوێن یان ئەژانس بگەڕێ..."
              aria-label="گەڕان لە گەشتەکان"
              className="h-12 w-full rounded-[8px] border border-(--color-border) bg-(--color-surface) ps-11 pe-11 text-sm text-(--color-text-primary) shadow-(--shadow-subtle) placeholder:text-(--color-text-muted) focus:border-(--color-primary)"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="سڕینەوەی گەڕان" className="absolute end-3.5 top-1/2 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text-primary)">
                <XCircleIcon className="size-5" />
              </button>
            )}
          </label>
        </div>
        <div role="group" aria-label="جۆری گەشت" className="grid w-full max-w-2xl grid-cols-3 gap-1 rounded-[8px] border border-(--color-border) bg-(--color-surface-elevated) p-1.5">
          {SCOPE_OPTIONS.map((scope) => {
            const selected = filters.scope === scope;
            const count = scope === "all" ? TRIPS.length : TRIPS.filter((trip) => trip.scope === scope).length;
            const ScopeIcon = scope === "all" ? CompassIcon : scope === "domestic" ? MapPinIcon : GlobeIcon;
            return (
              <button
                key={scope}
                type="button"
                aria-pressed={selected}
                onClick={() => update("scope", scope)}
                className={cn(
                  "flex min-h-12 items-center justify-center gap-2 rounded-[6px] px-2.5 text-sm font-bold transition-colors sm:px-4",
                  selected ? "bg-(--color-primary-dark) text-white shadow-(--shadow-subtle)" : "text-(--color-text-secondary) hover:bg-white/80"
                )}
              >
                <ScopeIcon className="size-4 shrink-0" />
                <span className="truncate">{scope === "all" ? "هەموو گەشتەکان" : TRAVEL_SCOPE_LABELS[scope]}</span>
                <span className={cn("num hidden text-xs sm:inline", selected ? "text-white/70" : "text-(--color-text-muted)")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile sticky filter/sort bar */}
      <div className="sticky top-16 z-30 -mx-4 mb-5 flex items-center gap-2 border-b border-(--color-border) bg-(--color-bg)/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) px-4 py-2.5 text-sm font-semibold text-(--color-text-primary)"
        >
          <FilterIcon className="size-4" />
          فلتەرەکان
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-(--color-primary) text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <div className="flex-1">
          <Select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] xl:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex max-h-[calc(100dvh-7rem)] flex-col gap-4 overflow-y-auto rounded-[8px] border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-subtle)">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FilterIcon className="size-4 text-(--color-primary)" />
                <h2 className="font-bold text-(--color-text-primary)">فلتەرەکان</h2>
                {activeFilterCount > 0 && <span className="num flex size-5 items-center justify-center rounded-full bg-(--color-primary-50) text-[11px] font-bold text-(--color-primary-dark)">{activeFilterCount}</span>}
              </div>
              {activeFilterCount > 0 && (
                <button type="button" onClick={resetFilters} className="text-xs font-semibold text-(--color-secondary-dark) hover:underline">
                  سڕینەوەی هەموو
                </button>
              )}
            </div>
            <FiltersPanel filters={filters} update={update} />
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 hidden items-center justify-between lg:flex">
            <p className="text-sm text-(--color-text-secondary)">پیشاندانی {results.length} گەشت</p>
            <div className="w-56">
              <Select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <TripCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              icon={<SearchIcon className="size-7" />}
              title="هیچ گەشتێک نەدۆزرایەوە"
              description="فلتەرەکانت کەم بکەرەوە یان فلتەرەکان بسڕەوە بۆ بینینی هەموو گەشتەکان."
              action={
                <button type="button" onClick={resetFilters} className={buttonClassName("outline", "md")}>
                  سڕینەوەی فلتەرەکان
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="فلتەرەکان"
        footer={
          <div className="flex w-full gap-3">
            <button type="button" onClick={resetFilters} className={buttonClassName("outline", "md", { fullWidth: true })}>
              سڕینەوەی هەموو
            </button>
            <button type="button" onClick={() => setSheetOpen(false)} className={buttonClassName("primary", "md", { fullWidth: true })}>
              پیشاندانی {results.length} گەشت
            </button>
          </div>
        }
      >
        <FiltersPanel filters={filters} update={update} />
      </BottomSheet>
    </div>
  );
}

function FilterGroup({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-(--color-border) pb-3 last:border-0 last:pb-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 text-[13px] font-bold text-(--color-text-primary)">
        {title}
        <ChevronDownIcon className="size-4 shrink-0 text-(--color-text-muted) transition-transform group-open:rotate-180" />
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

function FiltersPanel({ filters, update }: { filters: Filters; update: <K extends keyof Filters>(key: K, value: Filters[K]) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <FilterGroup title="شوێن" defaultOpen>
        <Select value={filters.destinationId} onChange={(e) => update("destinationId", e.target.value)}>
          <option value="all">هەموو شوێنەکان</option>
          {DESTINATIONS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup title={filters.scope === "international" ? "وڵات" : "پارێزگا"} defaultOpen>
        <Select value={filters.governorate} onChange={(e) => update("governorate", e.target.value)}>
          <option value="all">{filters.scope === "international" ? "هەموو وڵاتان" : "هەموو پارێزگاکان"}</option>
          {(filters.scope === "international" ? COUNTRIES : GOVERNORATES).map((g) => (
            <option key={g.id} value={g.name}>
              {g.name}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup title="جۆری گەشت" defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c} selected={filters.categories.includes(c)} onClick={() => update("categories", toggleInArray(filters.categories, c))} className="w-full justify-start rounded-[6px] px-2.5 text-xs">
              {TRIP_CATEGORY_LABELS[c]}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="ئاستی سەختی">
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((d) => (
            <Chip key={d} selected={filters.difficulties.includes(d)} onClick={() => update("difficulties", toggleInArray(filters.difficulties, d))} className="justify-center rounded-[6px] px-2 text-xs">
              {DIFFICULTY_LABELS[d]}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="بەروار">
        <div className="grid grid-cols-2 gap-2">
          {DURATION_BUCKETS.map((d) => (
            <Chip key={d.key} selected={filters.duration === d.key} onClick={() => update("duration", d.key)} className="w-full justify-start rounded-[6px] px-2.5 text-xs">
              {d.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="نرخ (بۆ هەر کەسێک)">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-(--color-text-muted)">
            <span className="num">{formatNumber(filters.minPrice)} د.ع</span>
            <span className="num">{formatNumber(filters.maxPrice)} د.ع</span>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={25000}
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", Number(e.target.value))}
            className="w-full accent-(--color-primary)"
          />
        </div>
      </FilterGroup>

      <FilterGroup title="هەڵسەنگاندن">
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((r) => (
            <Chip key={r.key} selected={filters.minRating === r.key} onClick={() => update("minRating", r.key)}>
              {r.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="گروپ و خێزان">
        <div className="flex flex-col gap-3">
          <Switch checked={filters.familyFriendly} onChange={(v) => update("familyFriendly", v)} label="گونجاو بۆ خێزان" />
          <Switch checked={filters.privateOnly} onChange={(v) => update("privateOnly", v)} label="تەنها گەشتی تایبەت" />
        </div>
      </FilterGroup>

      <FilterGroup title="گواستنەوە">
        <Select value={filters.transportation} onChange={(e) => update("transportation", e.target.value)}>
          <option value="all">هەموو جۆرەکان</option>
          {TRANSPORT_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup title="مانەوە">
        <Select value={filters.accommodation} onChange={(e) => update("accommodation", e.target.value)}>
          <option value="all">هەموو جۆرەکان</option>
          {ACCOMMODATION_OPTIONS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup title="چالاکییەکان">
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_OPTIONS.map((a) => (
            <Chip key={a} selected={filters.activities.includes(a)} onClick={() => update("activities", toggleInArray(filters.activities, a))}>
              {a}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <Link to="/map" className="flex items-center justify-center gap-2 rounded-(--radius-md) bg-(--color-surface-elevated) px-4 py-3 text-sm font-semibold text-(--color-text-primary)">
        <MapPinIcon className="size-4" />
        بینین لەسەر نەخشە
      </Link>
    </div>
  );
}
