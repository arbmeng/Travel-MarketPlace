import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { TripCard } from "@/components/cards/TripCard";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { CalendarIcon, GlobeIcon, MapPinIcon, ShareIcon } from "@/components/icons";
import { DESTINATIONS, REVIEWS, getDestinationBySlug, getTripsByDestination } from "@/data/mock";
import { cn } from "@/lib/utils";

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const destination = getDestinationBySlug(slug ?? "");
  const [activeImage, setActiveImage] = useState(0);

  if (!destination) {
    return (
      <div className="mx-auto max-w-(--breakpoint-md) px-4 py-24">
        <EmptyState
          icon={<MapPinIcon className="size-7" />}
          title="ئەم شوێنە نەدۆزرایەوە"
          description="لەوانەیە ئەم بەستەرە کۆن بێت یان شوێنەکە لابراوبێت."
          action={
            <Link to="/destinations" className={buttonClassName("primary", "md")}>
              گەڕانەوە بۆ شوێنەکان
            </Link>
          }
        />
      </div>
    );
  }

  const trips = getTripsByDestination(destination.id);
  const nearby = DESTINATIONS.filter((d) => d.id !== destination.id && d.governorate === destination.governorate).slice(0, 4);
  const nearbyFallback = nearby.length ? nearby : DESTINATIONS.filter((d) => d.id !== destination.id).slice(0, 4);
  const tripIds = new Set(trips.map((t) => t.id));
  const reviews = REVIEWS.filter((r) => r.tripId && tripIds.has(r.tripId)).slice(0, 4);

  return (
    <div>
      {/* Hero gallery */}
      <section className="relative">
        <div className="relative h-[380px] w-full overflow-hidden sm:h-[480px]">
          <img src={destination.images[activeImage]} alt={destination.name} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-(--breakpoint-2xl) items-end justify-between gap-4 px-4 py-6 sm:px-6">
            <div className="text-white">
              <span className="text-sm font-semibold text-white/80">{destination.governorate}</span>
              <h1 className="text-3xl font-extrabold sm:text-4xl">{destination.name}</h1>
              <div className="mt-2 flex items-center gap-3">
                <Rating value={destination.rating} reviewCount={destination.reviewCount} />
                <span className="text-sm text-white/85">{destination.tagline}</span>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <SaveButton id={destination.id} variant="floating" />
              <button
                type="button"
                aria-label="هاوبەشکردن"
                className="flex size-9 items-center justify-center rounded-full bg-white/90 shadow-(--shadow-subtle) backdrop-blur"
              >
                <ShareIcon className="size-4 text-(--color-text-secondary)" />
              </button>
            </div>
          </div>
        </div>
        {destination.images.length > 1 && (
          <div className="mx-auto flex max-w-(--breakpoint-2xl) gap-2 overflow-x-auto px-4 py-3 scrollbar-none sm:px-6">
            {destination.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "size-16 shrink-0 overflow-hidden rounded-(--radius-sm) border-2 transition-colors",
                  activeImage === i ? "border-(--color-primary)" : "border-transparent opacity-70"
                )}
              >
                <img src={img} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="mx-auto grid max-w-(--breakpoint-2xl) grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-10">
          {/* About */}
          <section>
            <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">دەربارەی {destination.name}</h2>
            <p className="leading-relaxed text-(--color-text-secondary)">{destination.description}</p>
          </section>

          {/* Best time to visit */}
          <section className="flex items-center gap-4 rounded-(--radius-lg) bg-(--color-surface-elevated) p-5">
            <CalendarIcon className="size-6 shrink-0 text-(--color-primary)" />
            <div>
              <h3 className="font-bold text-(--color-text-primary)">باشترین کات بۆ سەردان</h3>
              <p className="text-sm text-(--color-text-secondary)">{destination.bestTimeToVisit}</p>
            </div>
          </section>

          {/* Things to do */}
          <section>
            <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">چالاکییەکان</h2>
            <div className="flex flex-wrap gap-2">
              {destination.activities.map((a) => (
                <span key={a} className="rounded-(--radius-pill) border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text-secondary)">
                  {a}
                </span>
              ))}
            </div>
          </section>

          {/* Visa & passport (international only) */}
          {destination.scope === "international" && destination.visaInfo && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-(--color-text-primary)">
                <GlobeIcon className="size-5 text-(--color-primary)" />
                ڤیزا و پاسپۆرت
              </h2>
              <div className="flex flex-col gap-3 rounded-(--radius-lg) bg-(--color-info-bg) p-5">
                <div className="flex items-center gap-2">
                  <Badge tone={destination.visaInfo.required ? "warning" : "success"}>
                    {destination.visaInfo.required ? "ڤیزا پێویستە" : "بەبێ ڤیزای پێشوەخت"}
                  </Badge>
                  <Badge tone="neutral">پاسپۆرت پێویستە بۆ لانیکەم {destination.visaInfo.passportValidityMonths} مانگ</Badge>
                </div>
                <p className="text-sm leading-relaxed text-(--color-text-primary)">{destination.visaInfo.description}</p>
                <p className="text-xs text-(--color-text-muted)">
                  تێبینی: یاساکانی ڤیزا گۆڕان دەکەن. تکایە پێش گەشت لەگەڵ ئەژانسەکە یان کۆنسولخانەی وڵاتی مەبەست دڵنیابەرەوە.
                </p>
              </div>
            </section>
          )}

          {/* Currency & language (international only) */}
          {destination.scope === "international" && destination.currencyInfo && (
            <section>
              <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">دراو و زمان</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-(--radius-lg) bg-(--color-surface-elevated) p-5">
                  <p className="text-xs font-semibold text-(--color-text-muted)">دراوی ناوخۆیی</p>
                  <p className="mt-1 font-bold text-(--color-text-primary)">
                    {destination.currencyInfo.name} ({destination.currencyInfo.symbol})
                  </p>
                  <p className="mt-1 text-sm text-(--color-text-secondary)">{destination.currencyInfo.exchangeNote}</p>
                </div>
                <div className="rounded-(--radius-lg) bg-(--color-surface-elevated) p-5">
                  <p className="text-xs font-semibold text-(--color-text-muted)">زمانی خۆجێیی</p>
                  <p className="mt-1 font-bold text-(--color-text-primary)">{destination.spokenLanguages?.join("، ")}</p>
                </div>
              </div>
            </section>
          )}

          {/* Popular trips */}
          <section id="trips">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-(--color-text-primary)">گەشتە بەناوبانگەکان</h2>
              <Link to="/explore" className="text-sm font-semibold text-(--color-primary)">
                هەمووی ببینە
              </Link>
            </div>
            {trips.length === 0 ? (
              <EmptyState title="هێشتا گەشتێک نییە بۆ ئەم شوێنە" description="بەم زووانە گەشتی نوێ زیاد دەکرێت." />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {trips.map((t) => (
                  <TripCard key={t.id} trip={t} />
                ))}
              </div>
            )}
          </section>

          {/* Map placeholder */}
          <section>
            <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">شوێنی جوگرافی</h2>
            <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-(--radius-lg) bg-gradient-to-br from-(--color-primary-50) to-(--color-surface-elevated)">
              <div className="flex flex-col items-center gap-2 text-center">
                <MapPinIcon className="size-8 text-(--color-primary)" />
                <p className="text-sm font-semibold text-(--color-text-primary)">{destination.name}, {destination.governorate}</p>
                <Link to="/map" className="text-xs font-semibold text-(--color-primary) underline">
                  بینین لەسەر نەخشەی گشتی
                </Link>
              </div>
            </div>
          </section>

          {/* Travel tips */}
          <section>
            <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">ئامۆژگاری گەشتیاری</h2>
            <ul className="flex flex-col gap-2.5 text-sm text-(--color-text-secondary)">
              <li className="flex gap-2"><span className="text-(--color-primary)">•</span> پێش گەشتەکەت پارچە جل و بەرگی گونجاو بۆ کەش و هەوای شاخاوی هەڵبژێرە.</li>
              <li className="flex gap-2"><span className="text-(--color-primary)">•</span> پێڵاوی پیاسەی پتەو لەبیرت نەچێت، تایبەت بۆ ڕێگا شاخاوییەکان.</li>
              <li className="flex gap-2"><span className="text-(--color-primary)">•</span> پێش ڕۆیشتن لەگەڵ ئەژانسەکە دووپاتی کاتی کۆبوونەوە بکەرەوە.</li>
              <li className="flex gap-2"><span className="text-(--color-primary)">•</span> کامێرات لەبیرت نەچێت — دیمەنەکان لەم شوێنە زۆر جوانن.</li>
            </ul>
          </section>

          {/* Reviews */}
          {reviews.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold text-(--color-text-primary)">ڕای گەشتیاران</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            </section>
          )}

          {/* Nearby destinations */}
          <section>
            <h2 className="mb-4 text-xl font-extrabold text-(--color-text-primary)">شوێنی نزیک</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {nearbyFallback.map((d) => (
                <DestinationCard key={d.id} destination={d} className="aspect-square" />
              ))}
            </div>
          </section>
        </div>

        {/* Side info card */}
        <aside className="h-fit rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5 lg:sticky lg:top-24">
          <h3 className="mb-3 font-bold text-(--color-text-primary)">کورتەی {destination.name}</h3>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-(--color-text-muted)">{destination.scope === "international" ? "وڵات" : "پارێزگا"}</dt>
              <dd className="font-semibold text-(--color-text-primary)">{destination.governorate}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-(--color-text-muted)">هەڵسەنگاندن</dt>
              <dd><Rating value={destination.rating} reviewCount={destination.reviewCount} size="sm" /></dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-(--color-text-muted)">ژمارەی گەشت</dt>
              <dd className="num font-semibold text-(--color-text-primary)">{trips.length}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-(--color-text-muted)">باشترین کات</dt>
              <dd className="font-semibold text-(--color-text-primary)">{destination.bestTimeToVisit}</dd>
            </div>
          </dl>
          <a href="#trips" className={buttonClassName("primary", "md", { fullWidth: true, className: "mt-5" })}>
            گەشتەکانی ئەم شوێنە ببینە
          </a>
        </aside>
      </div>
    </div>
  );
}
