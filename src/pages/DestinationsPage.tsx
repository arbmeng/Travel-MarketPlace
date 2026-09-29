import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Chip } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { Rating } from "@/components/ui/Rating";
import { EmptyState } from "@/components/ui/States";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { MapPinIcon, SearchIcon } from "@/components/icons";
import { COUNTRIES, DESTINATIONS, GOVERNORATES, getTripsByDestination } from "@/data/mock";
import { cn } from "@/lib/utils";
import { TRAVEL_SCOPE_LABELS, type TravelScope } from "@/types";

type ViewMode = "grid" | "list" | "map";
type ScopeFilter = "all" | TravelScope;
const SCOPE_OPTIONS: ScopeFilter[] = ["all", "domestic", "international"];
const ACTIVITY_OPTIONS = Array.from(new Set(DESTINATIONS.flatMap((d) => d.activities)));

export default function DestinationsPage() {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [governorate, setGovernorate] = useState("all");
  const [activities, setActivities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [view, setView] = useState<ViewMode>("grid");

  const results = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      if (query && !(`${d.name} ${d.tagline}`.toLowerCase().includes(query.toLowerCase()))) return false;
      if (scope !== "all" && d.scope !== scope) return false;
      if (governorate !== "all" && d.governorate !== governorate) return false;
      if (activities.length && !activities.every((a) => d.activities.includes(a))) return false;
      if (d.rating < minRating) return false;
      return true;
    });
  }, [query, scope, governorate, activities, minRating]);

  function toggleActivity(a: string) {
    setActivities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function resetFilters() {
    setQuery("");
    setScope("all");
    setGovernorate("all");
    setActivities([]);
    setMinRating(0);
  }

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">شوێنە گەشتیارییەکان</h1>
        <p className="text-(--color-text-secondary)">هەرێمەکانی کوردستان و شوێنی دەرەوەی وڵات بدۆزەرەوە، هەریەکە بە تایبەتمەندی خۆیەوە.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {SCOPE_OPTIONS.map((s) => (
          <Chip
            key={s}
            selected={scope === s}
            onClick={() => {
              setScope(s);
              setGovernorate("all");
            }}
          >
            {s === "all" ? "هەموو شوێنەکان" : TRAVEL_SCOPE_LABELS[s]}
          </Chip>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-(--color-text-muted)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بگەڕێ بۆ ناوی شوێن..."
              className="h-11 w-full rounded-(--radius-md) border border-(--color-border) bg-(--color-surface) ps-10 pe-4 text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:border-(--color-primary)"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
              <option value="all">{scope === "international" ? "هەموو وڵاتان" : "هەموو پارێزگاکان"}</option>
              {(scope === "international" ? COUNTRIES : GOVERNORATES).map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex rounded-(--radius-md) border border-(--color-border) p-1">
            {(["grid", "list", "map"] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-(--radius-sm) px-3 text-sm font-semibold transition-colors",
                  view === v ? "bg-(--color-primary) text-white" : "text-(--color-text-secondary) hover:bg-(--color-surface-elevated)"
                )}
              >
                {v === "grid" ? "تۆڕ" : v === "list" ? "لیست" : "نەخشە"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-(--color-text-muted)">هەڵسەنگاندن:</span>
          {[0, 4, 4.5].map((r) => (
            <Chip key={r} selected={minRating === r} onClick={() => setMinRating(r)}>
              {r === 0 ? "هەمووی" : `${r}+`}
            </Chip>
          ))}
          <span className="mx-1 h-4 w-px bg-(--color-border)" />
          {ACTIVITY_OPTIONS.map((a) => (
            <Chip key={a} selected={activities.includes(a)} onClick={() => toggleActivity(a)}>
              {a}
            </Chip>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={<MapPinIcon className="size-7" />}
          title="هیچ شوێنێک نەدۆزرایەوە"
          description="فلتەرەکانت بگۆڕە یان بیسڕەوە بۆ بینینی هەموو شوێنەکان."
          action={
            <button type="button" onClick={resetFilters} className="text-sm font-semibold text-(--color-primary)">
              سڕینەوەی فلتەرەکان
            </button>
          }
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      ) : view === "list" ? (
        <div className="flex flex-col gap-4">
          {results.map((d) => {
            const tripCount = getTripsByDestination(d.id).length;
            return (
              <Link
                key={d.id}
                to={`/destinations/${d.slug}`}
                className="flex flex-col gap-4 rounded-(--radius-lg) bg-(--color-surface) p-3 shadow-(--shadow-subtle) transition-shadow hover:shadow-(--shadow-elevated) sm:flex-row"
              >
                <img src={d.images[0]} alt={d.name} className="h-48 w-full rounded-(--radius-md) object-cover sm:h-auto sm:w-64" />
                <div className="flex flex-1 flex-col gap-2 p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium text-(--color-text-muted)">{d.governorate}</span>
                      <h3 className="text-lg font-extrabold text-(--color-text-primary)">{d.name}</h3>
                    </div>
                    <Rating value={d.rating} reviewCount={d.reviewCount} size="sm" />
                  </div>
                  <p className="text-sm text-(--color-text-secondary)">{d.tagline}</p>
                  <p className="line-clamp-2 text-sm text-(--color-text-muted)">{d.description}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                    {d.activities.slice(0, 3).map((a) => (
                      <span key={a} className="rounded-(--radius-pill) bg-(--color-surface-elevated) px-2.5 py-1 text-xs text-(--color-text-secondary)">
                        {a}
                      </span>
                    ))}
                    <span className="ms-auto text-xs font-semibold text-(--color-primary)">{tripCount} گەشت بەردەستە</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="relative flex h-[520px] items-center justify-center overflow-hidden rounded-(--radius-xl) bg-gradient-to-br from-(--color-primary-50) via-(--color-surface-elevated) to-(--color-accent-light)/30">
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,var(--color-primary-light)_0,transparent_35%),radial-gradient(circle_at_75%_60%,var(--color-secondary-light)_0,transparent_40%)]" />
          <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
            <MapPinIcon className="size-10 text-(--color-primary)" />
            <h3 className="text-xl font-extrabold text-(--color-text-primary)">نەخشەی ئینتەراکتیڤ</h3>
            <p className="max-w-sm text-sm text-(--color-text-secondary)">
              بۆ گەڕان لەسەر نەخشەیەکی تەواو، لەگەڵ هەموو شوێن و گەشتەکان، سەردانی نەخشەی گشتی بکە.
            </p>
            <Link to="/map" className="rounded-(--radius-pill) bg-(--color-primary) px-6 py-3 text-sm font-bold text-white hover:bg-(--color-primary-dark)">
              کردنەوەی نەخشە
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
