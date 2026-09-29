import { Link } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { Avatar } from "@/components/ui/Avatar";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { CalendarIcon, ChartIcon, PlusIcon, StarIcon, TicketIcon, UsersIcon, WalletIcon } from "@/components/icons";
import { formatCurrency, formatNumber } from "@/lib/format";
import { REVIEWS } from "@/data/mock";
import { AGENCY_TRIPS, BOOKINGS, CUSTOMERS, agency, dashboardKpis, getAgencyTripById, getCustomerById } from "@/data/agencyMock";

export default function AgencyDashboardPage() {
  const kpis = dashboardKpis();
  const recentBookings = [...BOOKINGS].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);
  const agencyReviews = REVIEWS.filter((r) => AGENCY_TRIPS.some((t) => t.id === r.tripId)).slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-(--color-text-primary)">بەخێربێیت، {agency.name}</h1>
          <p className="mt-1 text-(--color-text-secondary)">کورتەیەکی گشتی لە بارودۆخی ئەژانسەکەت.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/agency/trips/new" className={buttonClassName("primary", "md", { className: "gap-2" })}>
            <PlusIcon className="size-4" />
            گەشتێکی نوێ
          </Link>
          <Link to="/agency/calendar" className={buttonClassName("outline", "md")}>
            ڕۆژژمێر ببینە
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi icon={WalletIcon} label="کۆی داهات" value={formatCurrency(kpis.totalRevenueIqd)} />
        <Kpi icon={CalendarIcon} label="حیجزی داهاتوو" value={formatNumber(kpis.upcomingBookings)} />
        <Kpi icon={TicketIcon} label="گەشتی تەواوبوو" value={formatNumber(kpis.completedTrips)} />
        <Kpi icon={StarIcon} label="نمرەی ناوەند" value={kpis.avgRating.toFixed(1)} />
        <Kpi icon={ChartIcon} label="پارەدانی چاوەڕوان" value={formatCurrency(kpis.pendingPayoutIqd)} tone="accent" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="flex flex-col gap-4 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle) lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-(--color-text-primary)">دوایین حیجزەکان</h2>
            <Link to="/agency/bookings" className="text-sm font-semibold text-(--color-primary)">
              هەموو ببینە
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-(--color-border)">
            {recentBookings.map((b) => {
              const trip = getAgencyTripById(b.tripId);
              const customer = getCustomerById(b.customerId);
              return (
                <Link key={b.id} to={`/agency/bookings/${b.id}`} className="flex items-center gap-3 py-3 hover:bg-(--color-surface-elevated)">
                  <Avatar src={customer?.avatarUrl ?? ""} alt={customer?.name ?? ""} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-(--color-text-primary)">{customer?.name}</p>
                    <p className="truncate text-xs text-(--color-text-muted)">{trip?.title}</p>
                  </div>
                  <span className="num shrink-0 text-sm font-semibold text-(--color-text-primary)">{formatCurrency(b.grossIqd)}</span>
                  <BookingStatusBadge status={b.status} />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-(--color-text-primary)">هەڵسەنگاندنی نوێ</h2>
            <Link to="/agency/reviews" className="text-sm font-semibold text-(--color-primary)">
              هەموو ببینە
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {agencyReviews.length === 0 && <p className="text-sm text-(--color-text-muted)">هەڵسەنگاندنێک نییە.</p>}
            {agencyReviews.map((r) => (
              <div key={r.id} className="flex flex-col gap-1.5 border-b border-(--color-border) pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-(--color-text-primary)">{r.authorName}</p>
                  <Rating value={r.rating} size="sm" />
                </div>
                <p className="line-clamp-2 text-xs text-(--color-text-secondary)">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickLink to="/agency/trips/new" icon={PlusIcon} title="دروستکردنی گەشتی نوێ" body="گەشتێکی نوێ زیاد بکە و بیبڵاوکەرەوە." />
        <QuickLink to="/agency/customers" icon={UsersIcon} title="گەشتیارانت ببینە" body={`${CUSTOMERS.length} گەشتیار تا ئێستا حیجزیان کردووە.`} />
        <QuickLink to="/agency/analytics" icon={ChartIcon} title="شیکاری تەواو" body="ڕەوتی داهات و حیجزەکانت بپشکنە." />
      </section>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: typeof WalletIcon; label: string; value: string; tone?: "accent" }) {
  return (
    <div className="flex flex-col gap-3 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
      <div
        className={`flex size-10 items-center justify-center rounded-full ${tone === "accent" ? "bg-(--color-accent-light)/40 text-(--color-accent-dark)" : "bg-(--color-primary-50) text-(--color-primary)"}`}
      >
        <Icon className="size-5" />
      </div>
      <p className="text-xs font-semibold text-(--color-text-muted)">{label}</p>
      <p className="num text-xl font-extrabold text-(--color-text-primary)">{value}</p>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, body }: { to: string; icon: typeof PlusIcon; title: string; body: string }) {
  return (
    <Link to={to} className="flex flex-col gap-2 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle) transition-shadow hover:shadow-(--shadow-elevated)">
      <div className="flex size-10 items-center justify-center rounded-full bg-(--color-primary-50) text-(--color-primary)">
        <Icon className="size-5" />
      </div>
      <h3 className="font-bold text-(--color-text-primary)">{title}</h3>
      <p className="text-sm text-(--color-text-secondary)">{body}</p>
    </Link>
  );
}
