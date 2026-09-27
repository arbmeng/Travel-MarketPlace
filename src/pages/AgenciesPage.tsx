import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Badge";
import { Select, Switch } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/States";
import { AgencyCard } from "@/components/cards/AgencyCard";
import { BriefcaseIcon } from "@/components/icons";
import { AGENCIES, GOVERNORATES, getTripsByAgency } from "@/data/mock";
import { TRIP_CATEGORY_LABELS, type TripCategory } from "@/types";

const CATEGORIES: TripCategory[] = ["nature", "adventure", "family", "romantic", "historical", "camping", "hiking", "food", "luxury"];
const RATING_OPTIONS = [0, 4, 4.5];
const PRICE_BUCKETS = [
  { key: "all", label: "هەموو نرخەکان" },
  { key: "budget", label: "هەرزان (کەمتر لە ١٥٠,٠٠٠)" },
  { key: "mid", label: "مامناوەند (١٥٠,٠٠٠–٢٥٠,٠٠٠)" },
  { key: "premium", label: "لوکس (زیاتر لە ٢٥٠,٠٠٠)" },
] as const;
type PriceBucket = (typeof PRICE_BUCKETS)[number]["key"];

export default function AgenciesPage() {
  const [location, setLocation] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [category, setCategory] = useState<TripCategory | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceBucket, setPriceBucket] = useState<PriceBucket>("all");

  const results = useMemo(() => {
    return AGENCIES.filter((a) => {
      if (location !== "all" && a.location !== location) return false;
      if (a.rating < minRating) return false;
      if (verifiedOnly && !a.verified) return false;
      const trips = getTripsByAgency(a.id);
      if (category !== "all" && !trips.some((t) => t.category === category)) return false;
      if (priceBucket !== "all") {
        const minPrice = Math.min(...trips.map((t) => t.priceIqd), Infinity);
        if (priceBucket === "budget" && !(minPrice < 150000)) return false;
        if (priceBucket === "mid" && !(minPrice >= 150000 && minPrice <= 250000)) return false;
        if (priceBucket === "premium" && !(minPrice > 250000)) return false;
      }
      return true;
    });
  }, [location, minRating, category, verifiedOnly, priceBucket]);

  function reset() {
    setLocation("all");
    setMinRating(0);
    setCategory("all");
    setVerifiedOnly(false);
    setPriceBucket("all");
  }

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">ئەژانسە گەشتیارییەکان</h1>
        <p className="text-(--color-text-secondary)">لەگەڵ باشترین ئەژانسە پشتڕاستکراوەکانی کوردستان گەشتەکەت پلان بکە.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select value={location} onChange={(e) => setLocation(e.target.value)} label="شوێن">
            <option value="all">هەموو شوێنەکان</option>
            {GOVERNORATES.map((g) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value as TripCategory | "all")} label="جۆری گەشت">
            <option value="all">هەموو جۆرەکان</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {TRIP_CATEGORY_LABELS[c]}
              </option>
            ))}
          </Select>
          <Select value={priceBucket} onChange={(e) => setPriceBucket(e.target.value as PriceBucket)} label="نرخ">
            {PRICE_BUCKETS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-(--color-text-muted)">هەڵسەنگاندن:</span>
            {RATING_OPTIONS.map((r) => (
              <Chip key={r} selected={minRating === r} onClick={() => setMinRating(r)}>
                {r === 0 ? "هەمووی" : `${r}+`}
              </Chip>
            ))}
          </div>
          <Switch checked={verifiedOnly} onChange={setVerifiedOnly} label="تەنها پشتڕاستکراوەکان" />
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={<BriefcaseIcon className="size-7" />}
          title="هیچ ئەژانسێک نەدۆزرایەوە"
          description="فلتەرەکانت بگۆڕە یان بیسڕەوە بۆ بینینی هەموو ئەژانسەکان."
          action={
            <button type="button" onClick={reset} className="text-sm font-semibold text-(--color-primary)">
              سڕینەوەی فلتەرەکان
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((a) => (
            <AgencyCard key={a.id} agency={a} />
          ))}
        </div>
      )}
    </div>
  );
}
