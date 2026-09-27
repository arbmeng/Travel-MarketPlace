import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { CalendarIcon, ClockIcon } from "@/components/icons";
import { MY_BOOKINGS, TRIPS } from "@/data/mock";
import { computeCancellationRefund } from "@/lib/pricing";
import { formatCurrency } from "@/lib/format";

// Dates in mock data use opaque Arabic-Indic strings (see project conventions),
// so for this prototype we assume a plausible fixed "days until trip" for the demo.
const DEMO_DAYS_UNTIL_TRIP = 5;

export default function CancellationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const booking = MY_BOOKINGS.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <div className="mx-auto max-w-(--breakpoint-md) px-4 py-24">
        <ErrorState
          title="ئەم حیجزە نەدۆزرایەوە"
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
  const policy = trip?.cancellationPolicy ?? { freeUntilDays: 3, feePercentAfter: 20 };
  const refund = computeCancellationRefund({
    paidIqd: booking.totalIqd,
    daysUntilTrip: DEMO_DAYS_UNTIL_TRIP,
    freeUntilDays: policy.freeUntilDays,
    feePercentAfter: policy.feePercentAfter,
  });

  function confirmCancel() {
    setConfirmOpen(false);
    push("حیجزەکەت هەڵوەشێنرایەوە", "success");
    navigate("/account/trips");
  }

  return (
    <div className="mx-auto max-w-(--breakpoint-sm) px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-1 text-2xl font-extrabold text-(--color-text-primary)">هەڵوەشاندنەوەی حیجز</h1>
      <p className="mb-6 text-(--color-text-secondary)">
        حیجزی <span className="num font-semibold">#{booking.bookingNumber}</span> {trip && `— ${trip.title}`}
      </p>

      <div className="mb-5 flex items-center gap-3 rounded-(--radius-md) bg-(--color-info-bg) p-4 text-sm text-(--color-info)">
        <ClockIcon className="size-5 shrink-0" />
        <span>
          <span className="num font-bold">{DEMO_DAYS_UNTIL_TRIP}</span> ڕۆژ ماوە بۆ کاتی گەشتەکەت.
        </span>
      </div>

      <div className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
        <h2 className="mb-4 font-bold text-(--color-text-primary)">یاسای هەڵوەشاندنەوە</h2>
        <p className="mb-4 text-sm text-(--color-text-secondary)">
          هەڵوەشاندنەوە بێبەرامبەرە ئەگەر لە ماوەی <span className="num font-semibold">{policy.freeUntilDays}</span> ڕۆژ پێش گەشت بێت. دوای ئەو
          کاتە کرێی هەڵوەشاندنەوەی <span className="num font-semibold">{policy.feePercentAfter}%</span> لە کۆی پارەدراو دەبڕدرێت.
        </p>

        <div className="flex flex-col gap-2.5 rounded-(--radius-md) border border-(--color-border) p-4 text-sm">
          <Row label="کۆی پارەدراو" value={formatCurrency(booking.totalIqd)} />
          <Row
            label={refund.isFree ? "کرێی هەڵوەشاندنەوە (بێبەرامبەر)" : "کرێی هەڵوەشاندنەوە"}
            value={refund.isFree ? formatCurrency(0) : `- ${formatCurrency(refund.feeIqd)}`}
          />
          <div className="my-1 h-px bg-(--color-border)" />
          <Row label="کۆی گەڕاندراوە" value={formatCurrency(refund.refundIqd)} bold />
        </div>

        <p className="mt-4 text-xs text-(--color-text-muted)">
          پارەی گەڕاندراوە لە ماوەی ٥ تا ١٠ ڕۆژی کاری بۆ ئەو شێوازی پارەدانەی بەکارت هێناوە دەگەڕێتەوە.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
        <Button variant="danger" fullWidth onClick={() => setConfirmOpen(true)}>
          بەڵێ، حیجزەکە هەڵدەوەشێنمەوە
        </Button>
        <Link to={`/account/trips/${booking.id}`} className={buttonClassName("outline", "md", { fullWidth: true })}>
          پاشگەزبوونەوە
        </Link>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="پشتڕاستکردنەوەی هەڵوەشاندنەوە"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              گەڕانەوە
            </Button>
            <Button variant="danger" onClick={confirmCancel}>
              دڵنیام، هەڵیبوەشێنەوە
            </Button>
          </>
        }
      >
        <p className="text-sm text-(--color-text-secondary)">
          ئایا دڵنیایت لە هەڵوەشاندنەوەی ئەم حیجزە؟ ئەم کردارە ناگەڕێتەوە. <span className="num font-semibold">{formatCurrency(refund.refundIqd)}</span>{" "}
          بۆت دەگەڕێندرێتەوە.
        </p>
      </Modal>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-bold text-(--color-text-primary)" : "text-(--color-text-secondary)"}>{label}</span>
      <span className={"num " + (bold ? "text-base font-extrabold text-(--color-primary-dark)" : "font-semibold text-(--color-text-primary)")}>
        {value}
      </span>
    </div>
  );
}
