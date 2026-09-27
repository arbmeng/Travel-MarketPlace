import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { Textarea } from "@/components/ui/Input";
import { Button, buttonClassName } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { CalendarIcon, MapPinIcon, MessageIcon, UsersIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import { FEE_CONFIG } from "@/lib/pricing";
import { bookingPayout, getAgencyTripById, getBookingById, getCustomerById } from "@/data/agencyMock";

export default function AgencyBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const booking = id ? getBookingById(id) : undefined;
  const [notes, setNotes] = useState(booking?.internalNotes ?? "");
  const { push } = useToast();

  if (!booking) {
    return <ErrorState title="حیجز نەدۆزرایەوە" description="ئەم حیجزە بوونی نییە یان سڕدراوەتەوە." />;
  }

  const trip = getAgencyTripById(booking.tripId);
  const customer = getCustomerById(booking.customerId);
  const payout = bookingPayout(booking);
  const isCancelled = booking.status === "cancelled" || booking.status === "refunded";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-(--color-text-primary)">حیجزی #{booking.bookingNumber}</h1>
          <p className="mt-1 text-(--color-text-secondary)">درووستکراوە لە {booking.createdAt}</p>
        </div>
        <div className="flex gap-2">
          <BookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            <h2 className="mb-4 font-bold text-(--color-text-primary)">زانیاری گەشتیار</h2>
            <div className="flex items-center gap-4">
              <Avatar src={customer?.avatarUrl ?? ""} alt={customer?.name ?? ""} size="lg" />
              <div>
                <p className="font-semibold text-(--color-text-primary)">{customer?.name}</p>
                <p className="text-sm text-(--color-text-muted)">{customer?.phone}</p>
                <p className="text-sm text-(--color-text-muted)">{customer?.email}</p>
              </div>
              {customer && (
                <Link to={`/agency/customers/${customer.id}`} className={buttonClassName("outline", "sm", { className: "ms-auto" })}>
                  پڕۆفایلی گەشتیار
                </Link>
              )}
            </div>
          </section>

          <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            <h2 className="mb-4 font-bold text-(--color-text-primary)">زانیاری گەشت</h2>
            <div className="flex gap-4">
              {trip && <img src={trip.images[0]} alt="" className="h-24 w-32 shrink-0 rounded-(--radius-md) object-cover" />}
              <div>
                <p className="font-semibold text-(--color-text-primary)">{trip?.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-(--color-text-muted)">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="size-4" /> {booking.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UsersIcon className="size-4" /> {booking.travelers} کەس
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon className="size-4" /> {trip?.meetingPoint}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            <h2 className="mb-4 font-bold text-(--color-text-primary)">تێبینی ناوخۆیی</h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تێبینییەکانت لێرە بنووسە (تەنها بۆ تیمی ئەژانس دەردەکەوێت)..."
            />
            <Button size="sm" className="mt-3" onClick={() => push("تێبینی پاشەکەوت کرا")}>
              پاشەکەوتکردنی تێبینی
            </Button>
          </section>

          {isCancelled && (
            <section className="rounded-(--radius-lg) bg-(--color-warning-bg) p-5">
              <h2 className="mb-1 font-bold text-(--color-text-primary)">دۆخی هەڵوەشاندنەوە</h2>
              <p className="text-sm text-(--color-text-secondary)">
                ئەم حیجزە هەڵوەشێنراوەتەوە. {booking.refundIqd > 0 ? `${formatCurrency(booking.refundIqd)} گەڕێنراوەتەوە بۆ گەشتیار.` : "هیچ گەڕاندنەوەیەک ئەنجام نەدراوە."}
              </p>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            <h2 className="mb-4 font-bold text-(--color-text-primary)">وردەکاری پارە (لایەنی ئەژانس)</h2>
            <dl className="flex flex-col gap-2.5 text-sm">
              <Row label="کۆی حیجز" value={formatCurrency(payout.grossBookingIqd)} />
              <Row label={`کۆمیسیۆنی بازاڕ (%${FEE_CONFIG.platformCommissionPercent})`} value={`- ${formatCurrency(payout.platformCommissionIqd)}`} muted />
              <Row label={`خەرجی پرۆسەکردن (%${FEE_CONFIG.paymentProcessingFeePercent})`} value={`- ${formatCurrency(payout.paymentProcessingIqd)}`} muted />
              {payout.refundIqd > 0 && <Row label="گەڕاندنەوە" value={`- ${formatCurrency(payout.refundIqd)}`} muted />}
              <div className="my-1 border-t border-dashed border-(--color-border)" />
              <Row label="پارەی وەرگیراوی ئەژانس" value={formatCurrency(payout.netPayoutIqd)} strong />
            </dl>
          </section>

          <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            <h2 className="mb-3 font-bold text-(--color-text-primary)">پەیوەندی</h2>
            <Link to="/agency/messages" className={buttonClassName("outline", "md", { className: "w-full gap-2" })}>
              <MessageIcon className="size-4" /> کردنەوەی چات لەگەڵ گەشتیار
            </Link>
            {customer && customer.reviewCount > 0 && (
              <Badge tone="info" className="mt-3">
                ئەم گەشتیارە {customer.reviewCount} هەڵسەنگاندنی نووسیوە
              </Badge>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={strong ? "font-bold text-(--color-text-primary)" : "text-(--color-text-secondary)"}>{label}</span>
      <span className={`num ${strong ? "text-base font-extrabold text-(--color-primary-dark)" : muted ? "font-semibold text-(--color-error)" : "font-semibold text-(--color-text-primary)"}`}>
        {value}
      </span>
    </div>
  );
}
