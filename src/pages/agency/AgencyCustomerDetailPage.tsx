import { useParams } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { ErrorState } from "@/components/ui/States";
import { buttonClassName } from "@/components/ui/Button";
import { CalendarIcon, MessageIcon, StarIcon, WalletIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import { getAgencyTripById, getBookingsForCustomer, getCustomerById } from "@/data/agencyMock";
import { getReviewsForAgency } from "@/data/mock";

export default function AgencyCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const customer = id ? getCustomerById(id) : undefined;

  if (!customer) {
    return <ErrorState title="گەشتیار نەدۆزرایەوە" />;
  }

  const bookings = getBookingsForCustomer(customer.id);
  const reviews = getReviewsForAgency("a1").slice(0, customer.reviewCount);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-4 rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle) sm:flex-row sm:items-center">
        <Avatar src={customer.avatarUrl} alt={customer.name} size="xl" />
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-(--color-text-primary)">{customer.name}</h1>
          <p className="mt-1 text-sm text-(--color-text-muted)">{customer.phone} · {customer.email}</p>
          <p className="mt-1 text-xs text-(--color-text-muted)">لایەنگری زاگرۆس بەرواری {customer.joinedAt}</p>
        </div>
        <a href={`tel:${customer.phone}`} className={buttonClassName("outline", "md", { className: "gap-2" })}>
          <MessageIcon className="size-4" /> پەیوەندیکردن
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi icon={CalendarIcon} label="کۆی حیجزەکان" value={String(customer.bookingsCount)} />
        <Kpi icon={WalletIcon} label="کۆی خەرجی" value={formatCurrency(customer.totalSpentIqd)} />
        <Kpi icon={StarIcon} label="هەڵسەنگاندن" value={String(customer.reviewCount)} />
        <Kpi icon={CalendarIcon} label="دوایین گەشت" value={customer.lastTripDate} />
      </div>

      <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
        <h2 className="mb-4 font-bold text-(--color-text-primary)">مێژووی حیجزەکان</h2>
        <div className="flex flex-col divide-y divide-(--color-border)">
          {bookings.map((b) => {
            const trip = getAgencyTripById(b.tripId);
            return (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-semibold text-(--color-text-primary)">{trip?.title}</p>
                  <p className="text-xs text-(--color-text-muted)">#{b.bookingNumber} · {b.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="num text-sm font-semibold text-(--color-text-primary)">{formatCurrency(b.grossIqd)}</span>
                  <BookingStatusBadge status={b.status} />
                </div>
              </div>
            );
          })}
          {bookings.length === 0 && <p className="py-4 text-sm text-(--color-text-muted)">هیچ حیجزێک نییە.</p>}
        </div>
      </section>

      <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
        <h2 className="mb-4 font-bold text-(--color-text-primary)">مێژووی پەیامەکان</h2>
        <div className="flex flex-col gap-3">
          <div className="max-w-[75%] self-start rounded-(--radius-lg) rounded-ss-sm bg-(--color-surface-elevated) px-4 py-2.5 text-sm text-(--color-text-primary)">
            سڵاو، شوێنی کۆبوونەوە کوێیە؟
          </div>
          <div className="max-w-[75%] self-end rounded-(--radius-lg) rounded-se-sm bg-(--color-primary-50) px-4 py-2.5 text-sm text-(--color-text-primary)">
            سڵاو! بازاڕی نیشتیمانی، کاتژمێر ٧ی بەیانی.
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
          <h2 className="mb-4 font-bold text-(--color-text-primary)">هەڵسەنگاندنەکانی</h2>
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <p key={r.id} className="text-sm text-(--color-text-secondary)">
                “{r.text}”
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: typeof CalendarIcon; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-(--radius-lg) bg-(--color-surface) p-4 shadow-(--shadow-subtle)">
      <Icon className="size-5 text-(--color-primary)" />
      <p className="num font-extrabold text-(--color-text-primary)">{value}</p>
      <p className="text-xs text-(--color-text-muted)">{label}</p>
    </div>
  );
}
