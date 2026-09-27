import { useState } from "react";
import { PillTabs } from "@/components/ui/Tabs";
import { Rating } from "@/components/ui/Rating";
import { formatCurrency, formatNumber } from "@/lib/format";
import { ANALYTICS_SUMMARY, REVENUE_SERIES, TOP_DESTINATIONS, TOP_TRIPS } from "@/data/agencyMock";

const RANGES = [
  { key: "7d", label: "٧ ڕۆژ" },
  { key: "30d", label: "٣٠ ڕۆژ" },
  { key: "90d", label: "٩٠ ڕۆژ" },
  { key: "12m", label: "١٢ مانگ" },
  { key: "custom", label: "بەگوێرەی خۆت" },
];

export default function AgencyAnalyticsPage() {
  const [range, setRange] = useState("12m");
  const maxRevenue = Math.max(...REVENUE_SERIES.map((r) => r.revenueIqd));
  const maxBookings = Math.max(...REVENUE_SERIES.map((r) => r.bookings));

  const points = REVENUE_SERIES.map((r, i) => {
    const x = (i / (REVENUE_SERIES.length - 1)) * 100;
    const y = 100 - (r.revenueIqd / maxRevenue) * 90;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-(--color-text-primary)">شیکاری</h1>
          <p className="mt-1 text-(--color-text-secondary)">ڕەوتی داهات، حیجز و کارایی گەشتەکانت.</p>
        </div>
        <PillTabs items={RANGES.map((r) => ({ key: r.key, label: r.label }))} active={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Metric label="کۆی داهات" value={formatCurrency(REVENUE_SERIES.reduce((s, r) => s + r.revenueIqd, 0))} />
        <Metric label="کۆی حیجزەکان" value={formatNumber(REVENUE_SERIES.reduce((s, r) => s + r.bookings, 0))} />
        <Metric label="ڕێژەی گۆڕین" value={`%${ANALYTICS_SUMMARY.conversionRatePercent}`} />
        <Metric label="ناوەندی نرخی حیجز" value={formatCurrency(ANALYTICS_SUMMARY.avgBookingValueIqd)} />
        <Metric label="گەشتی فرۆشراو" value={formatNumber(ANALYTICS_SUMMARY.tripsSold)} />
        <Metric label="ڕێژەی هەڵوەشاندنەوە" value={`%${ANALYTICS_SUMMARY.cancellationRatePercent}`} />
        <Metric label="گەشتیاری دووبارە" value={`%${ANALYTICS_SUMMARY.repeatCustomerRatePercent}`} />
        <Metric label="ژمارەی هەڵسەنگاندن" value={formatNumber(TOP_TRIPS.reduce((s, t) => s + t.reviewCount, 0))} />
      </div>

      <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
        <h2 className="mb-4 font-bold text-(--color-text-primary)">داهات بەگوێرەی مانگ</h2>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full text-(--color-primary)">
          <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-(--color-text-muted)">
          {REVENUE_SERIES.map((r) => (
            <span key={r.label} className="hidden sm:block">
              {r.label.slice(0, 4)}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
        <h2 className="mb-4 font-bold text-(--color-text-primary)">حیجز بەگوێرەی مانگ</h2>
        <div className="flex h-40 items-end gap-2">
          {REVENUE_SERIES.map((r) => (
            <div key={r.label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-(--radius-xs) bg-(--color-accent)"
                style={{ height: `${(r.bookings / maxBookings) * 100}%` }}
                title={`${r.bookings}`}
              />
              <span className="num hidden text-[9px] text-(--color-text-muted) sm:block">{r.bookings}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
          <h2 className="mb-4 font-bold text-(--color-text-primary)">باشترین گەشتەکان</h2>
          <div className="flex flex-col gap-3">
            {TOP_TRIPS.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className="num flex size-7 shrink-0 items-center justify-center rounded-full bg-(--color-surface-elevated) text-xs font-bold text-(--color-text-secondary)">
                  {i + 1}
                </span>
                <img src={t.images[0]} alt="" className="size-11 shrink-0 rounded-(--radius-sm) object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-(--color-text-primary)">{t.title}</p>
                  <Rating value={t.rating} reviewCount={t.reviewCount} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
          <h2 className="mb-4 font-bold text-(--color-text-primary)">باشترین شوێنەکان</h2>
          <div className="flex flex-col gap-3">
            {TOP_DESTINATIONS.map((d, i) => (
              <div key={d.destination.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="num flex size-7 shrink-0 items-center justify-center rounded-full bg-(--color-surface-elevated) text-xs font-bold text-(--color-text-secondary)">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-(--color-text-primary)">{d.destination.name}</p>
                </div>
                <span className="num text-sm text-(--color-text-muted)">{d.bookingCount} هەڵسەنگاندن</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-(--radius-lg) bg-(--color-surface) p-4 shadow-(--shadow-subtle)">
      <p className="text-xs font-semibold text-(--color-text-muted)">{label}</p>
      <p className="num text-lg font-extrabold text-(--color-text-primary)">{value}</p>
    </div>
  );
}
