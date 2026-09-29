import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { VerifiedBadge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { TripCard } from "@/components/cards/TripCard";
import { RatingDistribution, ReviewCard } from "@/components/cards/ReviewCard";
import { BriefcaseIcon, ClockIcon, GlobeIcon, MessageIcon, ShareIcon } from "@/components/icons";
import { getAgencyBySlug, getReviewsForAgency, getTripsByAgency } from "@/data/mock";
import { TRIP_CATEGORY_LABELS } from "@/types";

type TabKey = "about" | "trips" | "experiences" | "reviews" | "photos";

export default function AgencyProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const agency = getAgencyBySlug(slug ?? "");
  const [tab, setTab] = useState<TabKey>("about");

  if (!agency) {
    return (
      <div className="mx-auto max-w-(--breakpoint-md) px-4 py-24">
        <EmptyState
          icon={<BriefcaseIcon className="size-7" />}
          title="ئەم ئەژانسە نەدۆزرایەوە"
          description="لەوانەیە ئەم بەستەرە کۆن بێت یان ئەژانسەکە لابراوبێت."
          action={
            <Link to="/agencies" className={buttonClassName("primary", "md")}>
              گەڕانەوە بۆ ئەژانسەکان
            </Link>
          }
        />
      </div>
    );
  }

  const trips = getTripsByAgency(agency.id);
  const reviews = getReviewsForAgency(agency.id);
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    trips.forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + 1));
    return Array.from(map.entries());
  }, [trips]);
  const photos = trips.flatMap((t) => t.images).slice(0, 12);

  return (
    <div>
      {/* Cover + header */}
      <div className="relative h-52 w-full overflow-hidden sm:h-64">
        <img src={agency.cover} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 sm:px-6">
        <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <img src={agency.logo} alt={agency.name} className="size-28 shrink-0 rounded-(--radius-lg) border-4 border-(--color-surface) bg-(--color-surface) object-cover shadow-(--shadow-elevated)" />
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-(--color-text-primary)">{agency.name}</h1>
                {agency.verified && <VerifiedBadge />}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-(--color-text-secondary)">
                <Rating value={agency.rating} reviewCount={agency.reviewCount} />
                <span>{agency.location}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pb-1">
            <button type="button" aria-label="هاوبەشکردن" className="flex size-11 items-center justify-center rounded-full border border-(--color-border) text-(--color-text-secondary)">
              <ShareIcon className="size-4" />
            </button>
            <Link to="/account/messages" className={buttonClassName("primary", "md", { className: "gap-2" })}>
              <MessageIcon className="size-4" />
              پەیوەندی بە ئەژانس بکە
            </Link>
          </div>
        </div>

        <Tabs
          className="mt-8"
          items={[
            { key: "about", label: "دەربارە" },
            { key: "trips", label: "گەشتەکان", count: trips.length },
            { key: "experiences", label: "ئەزموونەکان" },
            { key: "reviews", label: "هەڵسەنگاندن", count: reviews.length },
            { key: "photos", label: "وێنەکان" },
          ]}
          active={tab}
          onChange={(k) => setTab(k as TabKey)}
        />

        <div className="py-8">
          {tab === "about" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
              <p className="leading-relaxed text-(--color-text-secondary)">{agency.description}</p>
              <div className="flex flex-col gap-4 rounded-(--radius-lg) border border-(--color-border) p-5">
                <StatRow icon={<ClockIcon className="size-4" />} label="ساڵانی چالاکی" value={`${agency.yearsActive} ساڵ`} />
                <StatRow icon={<BriefcaseIcon className="size-4" />} label="گەشتی تەواوکراو" value={agency.tripsCompleted.toLocaleString("en-US")} />
                <StatRow icon={<GlobeIcon className="size-4" />} label="زمانەکان" value={agency.languages.join("، ")} />
                <StatRow icon={<ClockIcon className="size-4" />} label="کاتی وەڵامدانەوە" value={agency.responseTime} />
                <div className="border-t border-(--color-border) pt-3 text-sm text-(--color-text-secondary)">
                  <p>{agency.phone}</p>
                  <p>{agency.email}</p>
                </div>
              </div>
            </div>
          )}

          {tab === "trips" &&
            (trips.length === 0 ? (
              <EmptyState title="هێشتا گەشتێک نییە" description="ئەم ئەژانسە هێشتا گەشتی بڵاوکراوەتەوەی نییە." />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((t) => (
                  <TripCard key={t.id} trip={t} />
                ))}
              </div>
            ))}

          {tab === "experiences" &&
            (categoryBreakdown.length === 0 ? (
              <EmptyState title="هێشتا ئەزموونێک تۆمار نەکراوە" />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryBreakdown.map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between rounded-(--radius-lg) border border-(--color-border) p-4">
                    <span className="font-semibold text-(--color-text-primary)">{TRIP_CATEGORY_LABELS[cat as keyof typeof TRIP_CATEGORY_LABELS]}</span>
                    <span className="num text-sm text-(--color-text-muted)">{count} گەشت</span>
                  </div>
                ))}
              </div>
            ))}

          {tab === "reviews" &&
            (reviews.length === 0 ? (
              <EmptyState title="هێشتا هەڵسەنگاندنێک نییە" />
            ) : (
              <div className="flex flex-col gap-8">
                <RatingDistribution reviews={reviews} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              </div>
            ))}

          {tab === "photos" &&
            (photos.length === 0 ? (
              <EmptyState title="هێشتا وێنەیەک نییە" />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {photos.map((p, i) => (
                  <img key={i} src={p} alt="" className="aspect-square w-full rounded-(--radius-md) object-cover" />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-(--color-text-muted)">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-(--color-text-primary)">{value}</span>
    </div>
  );
}
