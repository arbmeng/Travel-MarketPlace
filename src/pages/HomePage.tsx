import { useState } from "react";
import { Link } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { Chip } from "@/components/ui/Badge";
import { TripCard } from "@/components/cards/TripCard";
import { DestinationCard, DestinationChip } from "@/components/cards/DestinationCard";
import { AgencyCard } from "@/components/cards/AgencyCard";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { CalendarIcon, MapPinIcon, SearchIcon, UsersIcon } from "@/components/icons";
import { AGENCIES, DESTINATIONS, REVIEWS, TRIPS } from "@/data/mock";
import { MOUNTAIN_IMAGES } from "@/data/images";
import { TRIP_CATEGORY_LABELS, type TripCategory } from "@/types";

const CATEGORIES: TripCategory[] = ["nature", "adventure", "family", "romantic", "historical", "camping", "hiking", "food", "luxury"];

export default function HomePage() {
  const [category, setCategory] = useState<TripCategory | null>(null);
  const domesticDestinations = DESTINATIONS.filter((d) => d.scope === "domestic");
  const internationalDestinations = DESTINATIONS.filter((d) => d.scope === "international");
  const internationalTrips = TRIPS.filter((t) => t.scope === "international");
  const featuredDestinations = domesticDestinations.filter((d) => d.featured);
  const trending = [...TRIPS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
  const weekend = TRIPS.filter((t) => t.scope === "domestic" && t.duration <= 2).slice(0, 4);
  const hiddenGems = domesticDestinations.filter((d) => !d.featured);
  const topAgencies = [...AGENCIES].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const filteredTrips = category ? TRIPS.filter((t) => t.category === category) : TRIPS;

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden sm:min-h-[720px]">
        <img src={MOUNTAIN_IMAGES[0]} alt="چیاکانی کوردستان" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-(--color-primary-dark)/90 via-(--color-primary-dark)/40 to-(--color-primary-dark)/20" />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center text-white">
          <span className="mb-4 inline-flex items-center rounded-(--radius-pill) bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            بازاڕی گەشتی کوردستان
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-tight sm:text-6xl">کوردستان بە چاوێکی نوێ ببینە</h1>
          <p className="mt-4 max-w-xl text-balance text-lg text-white/90">گەشت، شوێن و ئەزموونی جیاواز بدۆزەرەوە.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/explore" className={buttonClassName("primary", "lg")}>
              گەشتەکان ببینە
            </Link>
          </div>

          {/* Search module */}
          <div className="mt-10 w-full max-w-2xl rounded-(--radius-xl) bg-white p-2.5 shadow-(--shadow-floating) sm:p-3">
            <div className="flex flex-col divide-y divide-(--color-border) sm:flex-row sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
              <div className="flex flex-1 items-center gap-3 px-4 py-3 text-start">
                <MapPinIcon className="size-5 shrink-0 text-(--color-text-muted)" />
                <div>
                  <p className="text-xs font-semibold text-(--color-text-muted)">شوێن</p>
                  <p className="text-sm font-semibold text-(--color-text-primary)">کوردستان — هەموو شوێنەکان</p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3 px-4 py-3 text-start">
                <CalendarIcon className="size-5 shrink-0 text-(--color-text-muted)" />
                <div>
                  <p className="text-xs font-semibold text-(--color-text-muted)">بەروار</p>
                  <p className="text-sm font-semibold text-(--color-text-primary)">هەر کاتێک</p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3 px-4 py-3 text-start">
                <UsersIcon className="size-5 shrink-0 text-(--color-text-muted)" />
                <div>
                  <p className="text-xs font-semibold text-(--color-text-muted)">ژمارەی کەسان</p>
                  <p className="text-sm font-semibold text-(--color-text-primary)">٢ کەس</p>
                </div>
              </div>
              <div className="p-1.5 sm:flex sm:items-center">
                <Link
                  to="/explore"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-(--radius-lg) bg-(--color-primary) px-6 text-sm font-bold text-white transition-colors hover:bg-(--color-primary-dark) sm:w-auto"
                >
                  <SearchIcon className="size-4" />
                  گەڕان
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <Section title="شوێنە بەناوبانگەکان" subtitle="هەرێمە جوانەکانی کوردستان بناسە">
        <div className="flex gap-6 overflow-x-auto scrollbar-none pb-2">
          {domesticDestinations.map((d) => (
            <DestinationChip key={d.id} destination={d} />
          ))}
        </div>
      </Section>

      {/* Explore by category */}
      <Section title="بەپێی جۆر بگەڕێ" subtitle="ئەزموونی گونجاو بۆ خۆت هەڵبژێرە">
        <div className="mb-6 flex flex-wrap gap-2">
          <Chip selected={category === null} onClick={() => setCategory(null)}>
            هەمووی
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>
              {TRIP_CATEGORY_LABELS[c]}
            </Chip>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredTrips.slice(0, 8).map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </Section>

      {/* Trending trips */}
      <Section title="گەشتە باوەکان" subtitle="ئەو گەشتانەی گەشتیاران زۆرترین حیجزیان بۆ کردوون" tone="elevated">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </Section>

      {/* Featured destination editorial */}
      <Section title="شوێنە دیارەکان">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDestinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </Section>

      {/* Weekend trips */}
      <Section title="گەشتی کۆتایی هەفتە" subtitle="گونجاو بۆ پشوودانێکی کورت" tone="elevated">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {weekend.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </Section>

      {/* Hidden gems */}
      <Section title="شوێنە کەمناسراوەکان" subtitle="شوێنی سەرسوڕهێنەری کوردستان بدۆزەرەوە">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {hiddenGems.map((d) => (
            <DestinationCard key={d.id} destination={d} className="aspect-square" />
          ))}
        </div>
      </Section>

      {/* International trips */}
      <Section title="گەشتی دەرەوەی وڵات" subtitle="جیهان لەگەڵ زاگرۆس بناسە — لە ئیستانبوڵ هەتا دوبەی و قاهیرە" tone="elevated">
        <div className="mb-6 flex gap-4 overflow-x-auto scrollbar-none pb-2">
          {internationalDestinations.map((d) => (
            <DestinationChip key={d.id} destination={d} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {internationalTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/explore?scope=international" className={buttonClassName("outline", "md")}>
            هەموو گەشتەکانی دەرەوەی وڵات ببینە
          </Link>
        </div>
      </Section>

      {/* Top agencies */}
      <Section title="باشترین ئەژانسەکان" subtitle="ئەژانسە پشتڕاستکراوەکانی کوردستان">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topAgencies.map((a) => (
            <AgencyCard key={a.id} agency={a} />
          ))}
        </div>
      </Section>

      {/* Reviews */}
      <Section title="گەشتیاران چی دەڵێن" subtitle="ئەزموونی ڕاستەقینەی گەشتیارانی زاگرۆس">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="relative mx-4 my-16 overflow-hidden rounded-(--radius-xl) sm:mx-6">
        <img src={MOUNTAIN_IMAGES[3]} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-(--color-primary-dark)/70" />
        <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-20 text-center text-white">
          <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">گەشتەکەت لە ئێستا دەست پێ بکە</h2>
          <p className="max-w-md text-white/85">هەزاران گەشتیار ئەزموونی ڕەسەنیان لەگەڵ زاگرۆس دۆزیوەتەوە. تۆش دەست پێ بکە.</p>
          <Link to="/explore" className={buttonClassName("secondary", "lg")}>
            دەستپێکردن
          </Link>
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
  tone = "default",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tone?: "default" | "elevated";
}) {
  return (
    <section className={tone === "elevated" ? "bg-(--color-surface-elevated)" : undefined}>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1.5 text-(--color-text-secondary)">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
