import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { VerifiedBadge } from "@/components/ui/Badge";
import { ErrorState, Skeleton } from "@/components/ui/States";
import { ClockIcon, MapPinIcon, SearchIcon, XCircleIcon } from "@/components/icons";
import { AGENCIES, DESTINATIONS, TRIPS } from "@/data/mock";
import { formatFromPrice } from "@/lib/format";
import { TRIP_CATEGORY_LABELS, type TripCategory } from "@/types";

const RECENT_SEARCHES_KEY = "zagros.recentSearches";
const POPULAR_SEARCHES = ["ڕەواندز", "هەورامان", "دوکان", "کەمپینگ", "گەشتی خێزانی", "ئامێدی"];
const CATEGORY_LIST: TripCategory[] = ["nature", "adventure", "family", "romantic", "historical", "camping", "hiking", "food", "luxury"];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function match(haystack: string, needle: string) {
  return normalize(haystack).includes(normalize(needle));
}

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(list.slice(0, 8)));
  } catch {
    /* ignore */
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => readRecent());

  // Simulated network delay + error path: typing the word "کێشە" reproduces a
  // failed-search / network-error state so the ErrorState UI is reachable without a backend.
  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      setErrored(false);
      return;
    }
    setLoading(true);
    setErrored(false);
    const t = setTimeout(() => {
      setLoading(false);
      setErrored(normalize(query) === "کێشە" || normalize(query) === "error");
    }, 420);
    return () => clearTimeout(t);
  }, [query]);

  function commitSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((r) => r !== trimmed)].slice(0, 8);
      saveRecent(next);
      return next;
    });
  }

  const destinations = useMemo(() => (query ? DESTINATIONS.filter((d) => match(d.name, query) || match(d.tagline, query)) : []), [query]);
  const trips = useMemo(() => (query ? TRIPS.filter((t) => match(t.title, query)) : []), [query]);
  const agencies = useMemo(() => (query ? AGENCIES.filter((a) => match(a.name, query)) : []), [query]);
  const experiences = useMemo(
    () => (query ? CATEGORY_LIST.filter((c) => match(TRIP_CATEGORY_LABELS[c], query)) : []),
    [query]
  );
  const hasResults = destinations.length + trips.length + agencies.length + experiences.length > 0;

  return (
    <div className="mx-auto max-w-(--breakpoint-md) px-4 py-8 sm:px-6 lg:py-10">
      <h1 className="mb-5 text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">گەڕان</h1>

      <div className="relative mb-8">
        <SearchIcon className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-(--color-text-muted)" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
          placeholder="بگەڕێ بۆ شوێن، گەشت یان ئەژانس..."
          className="h-13 w-full rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) ps-12 pe-12 text-[15px] text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:border-(--color-primary)"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="سڕینەوە"
            className="absolute end-4 top-1/2 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text-primary)"
          >
            <XCircleIcon className="size-5" />
          </button>
        )}
      </div>

      {!query ? (
        <div className="flex flex-col gap-8">
          {recent.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-(--color-text-primary)">گەڕانە کۆنەکان</h2>
                <button
                  type="button"
                  onClick={() => {
                    setRecent([]);
                    saveRecent([]);
                  }}
                  className="text-xs font-semibold text-(--color-primary)"
                >
                  سڕینەوەی هەموو
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <Chip key={r} onClick={() => setQuery(r)} className="gap-2">
                    <ClockIcon className="size-3.5" />
                    {r}
                  </Chip>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 font-bold text-(--color-text-primary)">گەڕانە بەناوبانگەکان</h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((s) => (
                <Chip key={s} onClick={() => setQuery(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-bold text-(--color-text-primary)">شوێنە بەناوبانگەکان</h2>
            <div className="flex flex-col gap-2">
              {DESTINATIONS.slice(0, 5).map((d) => (
                <Link key={d.id} to={`/destinations/${d.slug}`} className="flex items-center gap-3 rounded-(--radius-md) p-2.5 hover:bg-(--color-surface-elevated)">
                  <img src={d.images[0]} alt={d.name} className="size-12 rounded-(--radius-sm) object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-(--color-text-primary)">{d.name}</p>
                    <p className="text-xs text-(--color-text-muted)">{d.governorate}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : errored ? (
        <ErrorState
          title="کێشەیەک لە پەیوەندیکردن ڕوویدا"
          description="نەمانتوانی گەڕانەکەت بگەیەنین بۆ ڕاژە. تکایە دووبارە هەوڵ بدەرەوە."
          action={
            <button type="button" onClick={() => setQuery((q) => q + " ")} className={buttonClassName("primary", "md")}>
              دووبارە هەوڵدانەوە
            </button>
          }
        />
      ) : !hasResults ? (
        <div className="flex flex-col items-center gap-6 py-10 text-center">
          <SearchIcon className="size-10 text-(--color-text-muted)" />
          <div>
            <h3 className="text-lg font-bold text-(--color-text-primary)">هیچ ئەنجامێک نەدۆزرایەوە بۆ "{query}"</h3>
            <p className="mt-1 text-sm text-(--color-text-secondary)">تاقی بکەرەوە بە وشەیەکی جیاواز، یان یەکێک لەمانە بگەڕێ:</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.map((s) => (
              <Chip key={s} onClick={() => setQuery(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8" onClick={() => commitSearch(query)}>
          {destinations.length > 0 && (
            <ResultSection title="شوێنەکان" count={destinations.length}>
              <div className="flex flex-col gap-2">
                {destinations.map((d) => (
                  <Link key={d.id} to={`/destinations/${d.slug}`} className="flex items-center gap-3 rounded-(--radius-md) p-2.5 hover:bg-(--color-surface-elevated)">
                    <img src={d.images[0]} alt={d.name} className="size-14 rounded-(--radius-sm) object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-(--color-text-primary)">{d.name}</p>
                      <p className="text-xs text-(--color-text-muted)">{d.governorate} · {d.tagline}</p>
                    </div>
                    <Rating value={d.rating} size="sm" showValue={false} />
                  </Link>
                ))}
              </div>
            </ResultSection>
          )}

          {trips.length > 0 && (
            <ResultSection title="گەشتەکان" count={trips.length}>
              <div className="flex flex-col gap-2">
                {trips.map((t) => (
                  <Link key={t.id} to={`/trips/${t.slug}`} className="flex items-center gap-3 rounded-(--radius-md) p-2.5 hover:bg-(--color-surface-elevated)">
                    <img src={t.images[0]} alt={t.title} className="size-14 rounded-(--radius-sm) object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-(--color-text-primary)">{t.title}</p>
                      <p className="num text-xs text-(--color-text-muted)">{formatFromPrice(t.priceIqd)}</p>
                    </div>
                    <Rating value={t.rating} size="sm" />
                  </Link>
                ))}
              </div>
            </ResultSection>
          )}

          {agencies.length > 0 && (
            <ResultSection title="ئەژانسەکان" count={agencies.length}>
              <div className="flex flex-col gap-2">
                {agencies.map((a) => (
                  <Link key={a.id} to={`/agencies/${a.slug}`} className="flex items-center gap-3 rounded-(--radius-md) p-2.5 hover:bg-(--color-surface-elevated)">
                    <img src={a.logo} alt={a.name} className="size-14 rounded-(--radius-sm) object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-(--color-text-primary)">{a.name}</p>
                        {a.verified && <VerifiedBadge />}
                      </div>
                      <p className="text-xs text-(--color-text-muted)">{a.location}</p>
                    </div>
                    <Rating value={a.rating} size="sm" />
                  </Link>
                ))}
              </div>
            </ResultSection>
          )}

          {experiences.length > 0 && (
            <ResultSection title="ئەزموونەکان" count={experiences.length}>
              <div className="flex flex-wrap gap-2">
                {experiences.map((c) => (
                  <Link key={c} to="/explore" className="inline-flex items-center gap-1.5 rounded-(--radius-pill) border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text-secondary) hover:border-(--color-primary-light)">
                    <MapPinIcon className="size-3.5" />
                    {TRIP_CATEGORY_LABELS[c]}
                  </Link>
                ))}
              </div>
            </ResultSection>
          )}
        </div>
      )}
    </div>
  );
}

function ResultSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-bold text-(--color-text-primary)">
        {title} <span className="text-(--color-text-muted)">({count})</span>
      </h2>
      {children}
    </section>
  );
}
