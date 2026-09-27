import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/Modal";
import { EmptyState, TripCardSkeleton } from "@/components/ui/States";
import { TripCard } from "@/components/cards/TripCard";
import { FilterIcon, MapPinIcon, SearchIcon } from "@/components/icons";
import { DESTINATIONS, GOVERNORATES, TRIPS, getDestinationById } from "@/data/mock";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DIFFICULTY_LABELS, TRIP_CATEGORY_LABELS, type Difficulty, type Trip, type TripCategory } from "@/types";

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

const MAX_PRICE = 350000;
const TRANSPORT_OPTIONS = Array.from(new Set(TRIPS.map((t) => t.transportation)));
const ACCOMMODATION_OPTIONS = Array.from(new Set(TRIPS.map((t) => t.accommodation).filter((a) => a && a !== "-")));
const ACTIVITY_OPTIONS = Array.from(new Set(DESTINATIONS.flatMap((d) => d.activities)));

interface Filters {
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

function sortTrips(list: Trip[], key: SortKey): Trip[] {
  const arr = [...list];
  switch (key) {
    case "popular":
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    case "price_low":
      return arr.sort((a, b) => a.priceIqd - b.priceIqd);
    case "newest":
      return arr.reverse();
    default:
      return arr.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
  }
}

export default function ExplorePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("recommended");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtersKey = JSON.stringify(filters);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  const results = useMemo(() => sortTrips(TRIPS.filter((t) => matchesFilters(t, filters)), sortKey), [filters, sortKey]);

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
    filters.activities.length;

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">بگەڕێ بۆ گەشتەکان</h1>
        <p className="text-(--color-text-secondary)">
          <span className="num font-semibold text-(--color-text-primary)">{results.length}</span> گەشت دۆزرایەوە لە کوردستان
        </p>
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-6 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-(--color-text-primary)">فلتەرەکان</h2>
              {activeFilterCount > 0 && (
                <button type="button" onClick={() => setFilters(DEFAULT_FILTERS)} className="text-xs font-semibold text-(--color-primary)">
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
                <button type="button" onClick={() => setFilters(DEFAULT_FILTERS)} className={buttonClassName("outline", "md")}>
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
            <button type="button" onClick={() => setFilters(DEFAULT_FILTERS)} className={buttonClassName("outline", "md", { fullWidth: true })}>
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

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-(--color-border) pb-5 last:border-0 last:pb-0">
      <h3 className="text-sm font-bold text-(--color-text-primary)">{title}</h3>
      {children}
    </div>
  );
}

function FiltersPanel({ filters, update }: { filters: Filters; update: <K extends keyof Filters>(key: K, value: Filters[K]) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <FilterGroup title="شوێن">
        <Select value={filters.destinationId} onChange={(e) => update("destinationId", e.target.value)}>
          <option value="all">هەموو شوێنەکان</option>
          {DESTINATIONS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup title="پارێزگا">
        <Select value={filters.governorate} onChange={(e) => update("governorate", e.target.value)}>
          <option value="all">هەموو پارێزگاکان</option>
          {GOVERNORATES.map((g) => (
            <option key={g.id} value={g.name}>
              {g.name}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup title="جۆری گەشت">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c} selected={filters.categories.includes(c)} onClick={() => update("categories", toggleInArray(filters.categories, c))}>
              {TRIP_CATEGORY_LABELS[c]}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="ئاستی سەختی">
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <Chip key={d} selected={filters.difficulties.includes(d)} onClick={() => update("difficulties", toggleInArray(filters.difficulties, d))}>
              {DIFFICULTY_LABELS[d]}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="بەروار">
        <div className="flex flex-wrap gap-2">
          {DURATION_BUCKETS.map((d) => (
            <Chip key={d.key} selected={filters.duration === d.key} onClick={() => update("duration", d.key)}>
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
            step={5000}
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
