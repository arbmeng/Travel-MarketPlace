import { Link, useParams } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { ErrorState } from "@/components/ui/States";
import { CalendarIcon, CheckCircleIcon, MapPinIcon, MessageIcon, UsersIcon } from "@/components/icons";
import { MY_BOOKINGS, TRIPS, getAgencyById, getDestinationById } from "@/data/mock";
import { formatCurrency } from "@/lib/format";
import type { BookingStatus } from "@/types";

const TIMELINE_STEPS: { key: BookingStatus; label: string }[] = [
  { key: "confirmed", label: "حیجزکرا" },
  { key: "paid", label: "پارە درا" },
  { key: "upcoming", label: "داهاتوو" },
  { key: "completed", label: "تەواو بوو" },
];

function timelineIndex(status: BookingStatus): number {
  if (status === "cancelled" || status === "refunded") return -1;
  if (status === "pending") return -1;
  if (status === "confirmed") return 0;
  if (status === "paid") return 1;
  if (status === "upcoming") return 2;
  if (status === "completed") return 3;
  return -1;
}

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const booking = MY_BOOKINGS.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <div className="mx-auto max-w-(--breakpoint-md) px-4 py-24">
        <ErrorState
          title="ئەم حیجزە نەدۆزرایەوە"
          description="ژمارەی حیجزەکە هەڵەیە یان بوونی نییە."
          action={
            <Link to="/account/trips" className={buttonClassName("primary", "md")}>
              گەڕانەوە بۆ گەشتەکانم
            </Link>
          }
        />
      </div>
    );
  }

  const trip = TRIPS.find((t) => t.id === booking.tripId);
  const agency = getAgencyById(booking.agencyId);
  const destination = trip ? getDestinationById(trip.destinationId) : undefined;
  const currentIndex = timelineIndex(booking.status);
  const isCancelled = booking.status === "cancelled" || booking.status === "refunded";

  return (
    <div className="mx-auto max-w-(--breakpoint-md) px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-(--color-text-muted)">
            ژمارەی حیجز <span className="num font-semibold text-(--color-text-primary)">#{booking.bookingNumber}</span>
          </p>
          <h1 className="text-xl font-extrabold text-(--color-text-primary)">{trip?.title ?? "گەشت"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <BookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>
      </div>

      {trip && <img src={trip.images[0]} alt={trip.title} className="mb-6 h-48 w-full rounded-(--radius-lg) object-cover sm:h-64" />}

      {/* Status timeline */}
      {!isCancelled && (
        <div className="mb-6 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
          <h2 className="mb-4 font-bold text-(--color-text-primary)">پێشکەوتنی حیجز</h2>
          <div className="flex items-center">
            {TIMELINE_STEPS.map((s, i) => {
              const done = i <= currentIndex;
              return (
                <div key={s.key} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={
                        "flex size-8 items-center justify-center rounded-full text-sm font-bold " +
                        (done ? "bg-(--color-primary) text-white" : "bg-(--color-surface-elevated) text-(--color-text-muted)")
                      }
                    >
                      {done ? <CheckCircleIcon className="size-4" /> : i + 1}
                    </div>
                    <span className="hidden text-xs font-medium text-(--color-text-secondary) sm:block">{s.label}</span>
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className={"mx-2 h-0.5 flex-1 rounded-full " + (i < currentIndex ? "bg-(--color-primary)" : "bg-(--color-border)")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="mb-6 rounded-(--radius-lg) bg-(--color-error-bg) p-5 text-sm text-(--color-error)">
          ئەم حیجزە هەڵوەشێنراوەتەوە. {booking.paymentStatus === "refunded" && "پارەکەت گەڕێندراوەتەوە."}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {/* Trip facts */}
          <div className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            <h2 className="mb-4 font-bold text-(--color-text-primary)">وردەکاری گەشت</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Fact icon={<CalendarIcon className="size-4" />} label="بەروار" value={booking.date} />
              <Fact icon={<UsersIcon className="size-4" />} label="گەشتیار" value={`${booking.travelers} کەس`} />
              <Fact icon={<MapPinIcon className="size-4" />} label="شوێن" value={destination?.name ?? "—"} />
              <Fact icon={<MapPinIcon className="size-4" />} label="کۆبوونەوە" value={trip?.meetingPoint ?? "—"} />
            </div>
          </div>

          {/* QR placeholder */}
          <div className="flex flex-col items-center gap-3 rounded-(--radius-lg) bg-(--color-surface) p-6 text-center shadow-(--shadow-subtle)">
            <div className="grid size-32 grid-cols-5 grid-rows-5 gap-1 rounded-(--radius-md) bg-(--color-text-primary) p-3">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={i % 3 === 0 || i % 7 === 0 ? "bg-white" : "bg-(--color-text-primary)"} />
              ))}
            </div>
            <p className="text-xs text-(--color-text-muted)">بلیتی دیجیتاڵ — لە کاتی کۆبوونەوەدا پیشان بدە</p>
          </div>

          {/* Payment breakdown */}
          <div className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            <h2 className="mb-4 font-bold text-(--color-text-primary)">وردەکاری پارەدان</h2>
            <div className="flex flex-col gap-2.5 text-sm">
              <PriceRow label="کۆی گەشت" value={formatCurrency(booking.subtotalIqd)} />
              {booking.discountIqd > 0 && <PriceRow label="داشکاندن" value={`- ${formatCurrency(booking.discountIqd)}`} />}
              <PriceRow label="کرێی خزمەتگوزاری پلاتفۆرم" value={formatCurrency(booking.platformFeeIqd)} />
              <PriceRow label="کرێی پرۆسەکردنی پارەدان" value={formatCurrency(booking.paymentFeeIqd)} />
              <div className="my-1 h-px bg-(--color-border)" />
              <PriceRow label="کۆی گشتی پارەدراو" value={formatCurrency(booking.totalIqd)} bold />
            </div>
          </div>

          {/* Cancellation reminder */}
          {trip && !isCancelled && (
            <div className="rounded-(--radius-lg) border border-dashed border-(--color-border) p-5 text-sm text-(--color-text-secondary)">
              <p className="mb-1 font-semibold text-(--color-text-primary)">یاسای هەڵوەشاندنەوە</p>
              <p>
                هەڵوەشاندنەوەی بێبەرامبەر تا <span className="num">{trip.cancellationPolicy.freeUntilDays}</span> ڕۆژ پێش گەشت. دوای ئەو
                کاتە کرێی <span className="num">{trip.cancellationPolicy.feePercentAfter}%</span> دەبڕدرێت.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          {agency && (
            <div className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
              <h3 className="mb-3 text-sm font-bold text-(--color-text-primary)">ئەژانسی گەشت</h3>
              <div className="flex items-center gap-3">
                <img src={agency.logo} alt={agency.name} className="size-12 rounded-(--radius-md) object-cover" />
                <div>
                  <p className="font-semibold text-(--color-text-primary)">{agency.name}</p>
                  <p className="text-xs text-(--color-text-muted)">{agency.location}</p>
                </div>
              </div>
              <Link to="/account/messages" className={buttonClassName("outline", "sm", { className: "mt-4 w-full", fullWidth: true })}>
                <MessageIcon className="size-4" />
                پەیامنێردن
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-2 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            {booking.status === "upcoming" && (
              <Link to={`/account/trips/${booking.id}/cancel`} className={buttonClassName("outline", "md", { className: "w-full text-(--color-error)" })}>
                هەڵوەشاندنەوەی حیجز
              </Link>
            )}
            {booking.status === "completed" && (
              <Link to={`/account/trips/${booking.id}/review`} className={buttonClassName("secondary", "md", { className: "w-full" })}>
                هەڵسەنگاندن بنووسە
              </Link>
            )}
            <Link to="/support" className={buttonClassName("ghost", "md", { className: "w-full" })}>
              پەیوەندی بە پشتگیری
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-(--color-text-muted)">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold text-(--color-text-primary)">{value}</p>
    </div>
  );
}

function PriceRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-bold text-(--color-text-primary)" : "text-(--color-text-secondary)"}>{label}</span>
      <span className={"num " + (bold ? "text-base font-extrabold text-(--color-primary-dark)" : "font-semibold text-(--color-text-primary)")}>
        {value}
      </span>
    </div>
  );
}
