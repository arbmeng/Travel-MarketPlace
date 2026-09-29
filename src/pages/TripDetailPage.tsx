import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { Rating, RatingStars } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { TripCard } from "@/components/cards/TripCard";
import { ReviewCard, RatingDistribution } from "@/components/cards/ReviewCard";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CompassIcon,
  GlobeIcon,
  MapPinIcon,
  MessageIcon,
  ShareIcon,
  UsersIcon,
  XCircleIcon,
} from "@/components/icons";
import { TRIPS, getAgencyById, getDestinationById, getReviewsForTrip, getTripBySlug } from "@/data/mock";
import { formatDuration, formatFromPrice, formatKurdishDateShort, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DIFFICULTY_LABELS, TRIP_CATEGORY_LABELS } from "@/types";

// Mock date-like strings use Arabic-Indic digits (e.g. "٢٠٢٦-١٠-٠٣") and are not
// directly parseable by `new Date()`. These helpers convert them locally so we can
// derive a couple of synthetic alternate dates for the booking date selector.
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
function toAsciiDigits(str: string) {
  return str.replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));
}
function parseMockDate(str: string): Date | null {
  const [y, m, d] = toAsciiDigits(str).split("T")[0].split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function TripDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const trip = getTripBySlug(slug ?? "");

  if (!trip) {
    return (
      <div className="mx-auto max-w-(--breakpoint-md) px-4 py-24">
        <EmptyState
          icon={<CompassIcon className="size-7" />}
          title="ئەم گەشتە نەدۆزرایەوە"
          description="لەوانەیە ئەم بەستەرە کۆن بێت یان گەشتەکە لابراوبێت."
          action={
            <Link to="/explore" className={buttonClassName("primary", "md")}>
              گەڕانەوە بۆ گەشتەکان
            </Link>
          }
        />
      </div>
    );
  }

  return <TripDetail slug={trip.slug} />;
}

function TripDetail({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const trip = getTripBySlug(slug)!;
  const destination = getDestinationById(trip.destinationId);
  const agency = getAgencyById(trip.agencyId);
  const reviews = getReviewsForTrip(trip.id);
  const [activeImage, setActiveImage] = useState(0);
  const [travelers, setTravelers] = useState(Math.max(1, trip.minTravelers));

  const dateOptions = useMemo(() => {
    const base = parseMockDate(trip.nextAvailableDate) ?? new Date();
    return [base, addDays(base, 7), addDays(base, 14)].map((d) => formatKurdishDateShort(d));
  }, [trip.nextAvailableDate]);
  const [selectedDate, setSelectedDate] = useState(0);

  const similarTrips = TRIPS.filter(
    (t) => t.id !== trip.id && (t.category === trip.category || t.destinationId === trip.destinationId)
  ).slice(0, 4);

  const total = trip.priceIqd * travelers;
  const urgent = trip.spotsRemaining <= 5;

  function goToBooking() {
    navigate(`/booking/${trip.slug}`);
  }

  return (
    <div>
      {/* Hero gallery */}
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 pt-6 sm:px-6">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-(--radius-lg) sm:col-span-2 sm:row-span-2 sm:aspect-auto">
            <img src={trip.images[activeImage]} alt={trip.title} className="size-full object-cover" />
          </div>
          {trip.images.slice(0, 2).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className="relative hidden aspect-[4/3] overflow-hidden rounded-(--radius-lg) sm:block"
            >
              <img src={img} alt="" className="size-full object-cover transition-transform hover:scale-105" />
            </button>
          ))}
        </div>
      </section>

      <div className="mx-auto grid max-w-(--breakpoint-2xl) grid-cols-1 gap-10 px-4 py-8 pb-28 sm:px-6 lg:grid-cols-[1fr_380px] lg:pb-10">
        <div className="flex flex-col gap-10">
          {/* Title block */}
          <section>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge tone="primary">{TRIP_CATEGORY_LABELS[trip.category]}</Badge>
              {trip.scope === "international" && (
                <Badge tone="info" icon={<GlobeIcon className="size-3.5" />}>
                  دەرەوەی وڵات
                </Badge>
              )}
              {urgent && <Badge tone="warning">تەنها {trip.spotsRemaining} شوێن ماوە</Badge>}
            </div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">{trip.title}</h1>
              <div className="flex shrink-0 gap-2">
                <SaveButton id={trip.id} variant="floating" />
                <button type="button" aria-label="هاوبەشکردن" className="flex size-9 items-center justify-center rounded-full bg-(--color-surface-elevated)">
                  <ShareIcon className="size-4 text-(--color-text-secondary)" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-(--color-text-secondary)">
              {destination && (
                <Link to={`/destinations/${destination.slug}`} className="inline-flex items-center gap-1 font-semibold text-(--color-primary)">
                  <MapPinIcon className="size-4" />
                  {destination.name}
                </Link>
              )}
              <Rating value={trip.rating} reviewCount={trip.reviewCount} />
              {agency && (
                <Link to={`/agencies/${agency.slug}`} className="inline-flex items-center gap-1.5">
                  {agency.name}
                  {agency.verified && <VerifiedBadge />}
                </Link>
              )}
            </div>
          </section>

          {/* Facts row */}
          <section className="grid grid-cols-2 gap-4 rounded-(--radius-lg) border border-(--color-border) p-5 sm:grid-cols-3 lg:grid-cols-4">
            <FactItem icon={<ClockIcon className="size-5" />} label="ماوە" value={formatDuration(trip.duration)} />
            <FactItem icon={<CompassIcon className="size-5" />} label="ئاستی سەختی" value={DIFFICULTY_LABELS[trip.difficulty]} />
            <FactItem icon={<UsersIcon className="size-5" />} label="قەبارەی گروپ" value={`${trip.minTravelers}–${trip.maxTravelers} کەس`} />
            <FactItem icon={<GlobeIcon className="size-5" />} label="زمان" value={trip.languages.join("، ")} />
            <FactItem icon={<CompassIcon className="size-5" />} label="گواستنەوە" value={trip.transportation} />
            <FactItem icon={<CompassIcon className="size-5" />} label="مانەوە" value={trip.accommodation === "-" ? "بێ مانەوە" : trip.accommodation} />
            <FactItem icon={<CompassIcon className="size-5" />} label="ژەمەکان" value={trip.meals} />
          </section>

          {/* Flight details (international only) */}
          {trip.flightInfo && (
            <section>
              <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">زانیاری فڕۆکە</h2>
              <div className="grid grid-cols-2 gap-4 rounded-(--radius-lg) bg-(--color-surface-elevated) p-5 sm:grid-cols-4">
                <FactItem icon={<CompassIcon className="size-5" />} label="بەڕێکەوتن لە" value={trip.flightInfo.departureCity} />
                <FactItem icon={<MapPinIcon className="size-5" />} label="گەیشتن بۆ" value={trip.flightInfo.arrivalCity} />
                <FactItem icon={<GlobeIcon className="size-5" />} label="کۆمپانیای فڕۆکەوانی" value={trip.flightInfo.airline} />
                <FactItem
                  icon={<ClockIcon className="size-5" />}
                  label="ماوەی فڕین"
                  value={trip.flightInfo.layovers > 0 ? `${trip.flightInfo.durationHours} کاتژمێر (${trip.flightInfo.layovers} وەستان)` : `${trip.flightInfo.durationHours} کاتژمێر (ڕاستەوخۆ)`}
                />
              </div>
            </section>
          )}

          {/* Visa, currency & language (international only) */}
          {destination?.scope === "international" && destination.visaInfo && (
            <section>
              <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">ڤیزا، دراو و زمان</h2>
              <div className="flex flex-col gap-4 rounded-(--radius-lg) bg-(--color-info-bg) p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={destination.visaInfo.required ? "warning" : "success"}>
                    {destination.visaInfo.required ? "ڤیزا پێویستە" : "بەبێ ڤیزای پێشوەخت"}
                  </Badge>
                  {destination.currencyInfo && (
                    <Badge tone="neutral">دراو: {destination.currencyInfo.name} ({destination.currencyInfo.symbol})</Badge>
                  )}
                  {destination.spokenLanguages && <Badge tone="neutral">زمان: {destination.spokenLanguages[0]}</Badge>}
                </div>
                <p className="text-sm leading-relaxed text-(--color-text-primary)">{destination.visaInfo.description}</p>
                <Link to={`/destinations/${destination.slug}`} className="text-xs font-semibold text-(--color-primary) underline">
                  زانیاری تەواو سەبارەت بە {destination.name} ببینە
                </Link>
              </div>
            </section>
          )}

          {/* Description */}
          <section>
            <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">دەربارەی گەشتەکە</h2>
            <p className="leading-relaxed text-(--color-text-secondary)">{trip.description}</p>
          </section>

          {/* Itinerary */}
          <section>
            <h2 className="mb-5 text-xl font-extrabold text-(--color-text-primary)">پلانی ڕۆژانەی گەشت</h2>
            <div className="flex flex-col">
              {trip.itinerary.map((day, i) => (
                <div key={day.day} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < trip.itinerary.length - 1 && (
                    <span className="absolute right-[19px] top-10 bottom-0 w-px bg-(--color-border) rtl:right-auto rtl:left-[19px]" />
                  )}
                  <div className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-primary) text-sm font-bold text-white">
                    {day.day}
                  </div>
                  <div className="flex-1 rounded-(--radius-lg) bg-(--color-surface-elevated) p-4">
                    <h3 className="font-bold text-(--color-text-primary)">{day.title}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-(--color-text-muted)">
                      <MapPinIcon className="size-3.5" /> {day.location}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {day.activities.map((a, ai) => (
                        <span key={ai} className="rounded-(--radius-pill) bg-(--color-surface) px-2.5 py-1 text-xs text-(--color-text-secondary)">
                          {a}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-(--color-text-muted)">
                      <span>🍽️ {day.meals.join("، ")}</span>
                      <span>🚌 {day.transportation}</span>
                      {day.accommodation && <span>🏨 {day.accommodation}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Included / excluded */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 font-bold text-(--color-text-primary)">لەخۆدەگرێت</h3>
              <ul className="flex flex-col gap-2">
                {trip.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-(--color-text-secondary)">
                    <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-(--color-success)" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-bold text-(--color-text-primary)">لەخۆناگرێت</h3>
              <ul className="flex flex-col gap-2">
                {trip.excluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-(--color-text-secondary)">
                    <XCircleIcon className="mt-0.5 size-4 shrink-0 text-(--color-error)" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Meeting point */}
          <section>
            <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">خاڵی کۆبوونەوە</h2>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex h-40 flex-1 items-center justify-center overflow-hidden rounded-(--radius-lg) bg-gradient-to-br from-(--color-primary-50) to-(--color-surface-elevated) sm:max-w-56">
                <MapPinIcon className="size-8 text-(--color-primary)" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-(--color-text-primary)">{trip.meetingPoint}</p>
                <p className="mt-1 text-sm text-(--color-text-secondary)">{trip.meetingInstructions}</p>
              </div>
            </div>
          </section>

          {/* Cancellation policy */}
          <section>
            <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">یاسای هەڵوەشاندنەوە</h2>
            <div className="flex flex-col gap-2 rounded-(--radius-lg) bg-(--color-info-bg) p-5 text-sm text-(--color-text-primary)">
              <p>
                دەتوانیت هەتا{" "}
                <span className="num font-bold">{trip.cancellationPolicy.freeUntilDays}</span> ڕۆژ پێش کاتی گەشتەکە، بە
                تەواوی و بەخۆڕایی حیجزەکەت هەڵبوەشێنیتەوە.
              </p>
              <p>
                لە دوای ئەو ماوەیە، <span className="num font-bold">%{trip.cancellationPolicy.feePercentAfter}</span> لە
                گشت نرخی حیجز وەک کرێی هەڵوەشاندنەوە دەبڕدرێت.
              </p>
            </div>
          </section>

          {/* Requirements & what to bring */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 font-bold text-(--color-text-primary)">مەرجەکان</h3>
              <ul className="flex flex-col gap-2 text-sm text-(--color-text-secondary)">
                {trip.requirements.map((r, i) => (
                  <li key={i} className="flex gap-2"><span className="text-(--color-primary)">•</span>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-bold text-(--color-text-primary)">پێویستە لەگەڵ خۆت بیهێنیت</h3>
              <ul className="flex flex-col gap-2 text-sm text-(--color-text-secondary)">
                {trip.whatToBring.map((w, i) => (
                  <li key={i} className="flex gap-2"><span className="text-(--color-primary)">•</span>{w}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Agency card */}
          {agency && (
            <section>
              <h2 className="mb-3 text-xl font-extrabold text-(--color-text-primary)">ئەژانسی گەشتی</h2>
              <div className="flex flex-col gap-4 rounded-(--radius-lg) border border-(--color-border) p-5 sm:flex-row sm:items-center">
                <Link to={`/agencies/${agency.slug}`} className="flex flex-1 items-center gap-4">
                  <img src={agency.logo} alt={agency.name} className="size-16 rounded-(--radius-md) object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-(--color-text-primary)">{agency.name}</h3>
                      {agency.verified && <VerifiedBadge />}
                    </div>
                    <Rating value={agency.rating} reviewCount={agency.reviewCount} size="sm" />
                    <p className="mt-1 text-xs text-(--color-text-muted)">
                      وەڵامدانەوە {agency.responseTime} · {agency.tripCount} گەشت
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => navigate("/account/messages")}
                  className={buttonClassName("outline", "md", { className: "shrink-0 gap-2" })}
                >
                  <MessageIcon className="size-4" />
                  پەیوەندی بە ئەژانسەکە بکە
                </button>
              </div>
            </section>
          )}

          {/* Reviews */}
          <section>
            <h2 className="mb-5 text-xl font-extrabold text-(--color-text-primary)">هەڵسەنگاندنەکان</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-(--color-text-secondary)">هێشتا هەڵسەنگاندن نییە بۆ ئەم گەشتە.</p>
            ) : (
              <>
                <RatingDistribution reviews={reviews} />
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Similar trips */}
          {similarTrips.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold text-(--color-text-primary)">گەشتی هاوشێوە</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {similarTrips.map((t) => (
                  <TripCard key={t.id} trip={t} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Booking panel — desktop sticky sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-5 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-elevated)">
            <div>
              <span className="num text-2xl font-extrabold text-(--color-primary-dark)">{formatFromPrice(trip.priceIqd)}</span>
              <span className="ms-1 text-sm text-(--color-text-muted)">بۆ هەر کەسێک</span>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-(--color-text-primary)">
                <CalendarIcon className="size-4" /> بەرواری گەشت
              </p>
              <div className="flex flex-col gap-2">
                {dateOptions.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(i)}
                    className={cn(
                      "rounded-(--radius-md) border px-3 py-2 text-start text-sm font-medium transition-colors",
                      selectedDate === i ? "border-(--color-primary) bg-(--color-primary-50) text-(--color-primary-dark)" : "border-(--color-border) text-(--color-text-secondary)"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-(--color-text-primary)">
                <UsersIcon className="size-4" /> ژمارەی گەشتیاران
              </p>
              <div className="flex items-center justify-between rounded-(--radius-md) border border-(--color-border) px-4 py-2">
                <button
                  type="button"
                  onClick={() => setTravelers((v) => Math.max(trip.minTravelers, v - 1))}
                  className="flex size-8 items-center justify-center rounded-full bg-(--color-surface-elevated) text-lg font-bold text-(--color-text-primary)"
                >
                  −
                </button>
                <span className="num font-semibold text-(--color-text-primary)">{travelers} کەس</span>
                <button
                  type="button"
                  onClick={() => setTravelers((v) => Math.min(trip.maxTravelers, v + 1))}
                  className="flex size-8 items-center justify-center rounded-full bg-(--color-surface-elevated) text-lg font-bold text-(--color-text-primary)"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-(--color-border) pt-4 text-sm">
              <span className="text-(--color-text-secondary)">کۆی گشتی</span>
              <span className="num text-lg font-extrabold text-(--color-text-primary)">{formatNumber(total)} د.ع</span>
            </div>

            <button type="button" onClick={goToBooking} className={buttonClassName("primary", "lg", { fullWidth: true })}>
              حیجز بکە
            </button>
            <p className="text-center text-xs text-(--color-text-muted)">هێشتا هیچ کرێیەک نابڕدرێت</p>
          </div>
        </aside>
      </div>

      {/* Mobile sticky booking bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 flex items-center justify-between gap-4 border-t border-(--color-border) bg-(--color-surface) px-4 py-3 shadow-(--shadow-elevated) lg:hidden">
        <div>
          <span className="num text-lg font-extrabold text-(--color-primary-dark)">{formatFromPrice(trip.priceIqd)}</span>
          <p className="text-xs text-(--color-text-muted)">بۆ هەر کەسێک</p>
        </div>
        <button type="button" onClick={goToBooking} className={buttonClassName("primary", "lg", { className: "shrink-0" })}>
          حیجز بکە
        </button>
      </div>
    </div>
  );
}

function FactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-(--color-primary)">{icon}</span>
      <div>
        <p className="text-xs text-(--color-text-muted)">{label}</p>
        <p className="text-sm font-semibold text-(--color-text-primary)">{value}</p>
      </div>
    </div>
  );
}
