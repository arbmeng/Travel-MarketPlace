import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { CalendarIcon, CheckCircleIcon, MapPinIcon, MessageIcon, ShareIcon, TicketIcon, UsersIcon } from "@/components/icons";
import { getAgencyById, getDestinationById, getTripBySlug } from "@/data/mock";
import { computeTravelerPrice } from "@/lib/pricing";
import { formatCurrency, formatDuration } from "@/lib/format";

export default function ConfirmationPage() {
  const { tripSlug } = useParams<{ tripSlug: string }>();
  const { push } = useToast();
  const trip = tripSlug ? getTripBySlug(tripSlug) : undefined;

  const bookingNumber = useMemo(() => `TR-${Math.floor(1000 + Math.random() * 9000)}`, []);

  if (!tripSlug || !trip) {
    return (
      <div className="mx-auto max-w-(--breakpoint-md) px-4 py-24">
        <ErrorState
          title="ئەم حیجزە نەدۆزرایەوە"
          description="پەیوەندی بەم پەڕەیەوە هەڵەیە."
          action={
            <Link to="/" className={buttonClassName("primary", "md")}>
              گەڕانەوە بۆ سەرەکی
            </Link>
          }
        />
      </div>
    );
  }

  const agency = getAgencyById(trip.agencyId);
  const destination = getDestinationById(trip.destinationId);
  const travelers = Math.max(trip.minTravelers, 2);
  const breakdown = computeTravelerPrice({ basePriceIqd: trip.priceIqd, travelers });

  function shareLink() {
    try {
      navigator.clipboard?.writeText(window.location.href);
    } catch {
      /* ignore */
    }
    push("لینک کۆپی کرا", "success");
  }

  function addToCalendar() {
    push("زیادکرا بۆ ڕۆژژمێرەکەت", "success");
  }

  return (
    <div className="mx-auto max-w-(--breakpoint-md) px-4 py-12 sm:px-6 sm:py-16">
      {/* Success header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-(--color-success-bg) text-(--color-success)">
          <CheckCircleIcon className="size-11" />
        </div>
        <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">حیجزەکەت سەرکەوتوو بوو</h1>
        <p className="max-w-sm text-(--color-text-secondary)">
          پەیامی پشتڕاستکردنەوە بۆ ئیمەیل و مۆبایلەکەت نێردرا. چاوەڕوانی ئەزموونێکی خۆشین لەگەڵ زاگرۆس.
        </p>
        <Badge tone="primary" className="num mt-1 text-sm">
          ژمارەی حیجز: {bookingNumber}
        </Badge>
      </div>

      {/* QR placeholder */}
      <div className="mx-auto mt-8 flex w-full max-w-xs flex-col items-center gap-3 rounded-(--radius-lg) bg-(--color-surface) p-6 text-center shadow-(--shadow-elevated)">
        <div className="grid size-40 grid-cols-5 grid-rows-5 gap-1 rounded-(--radius-md) bg-(--color-text-primary) p-3">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className={i % 3 === 0 || i % 7 === 0 ? "bg-white" : "bg-(--color-text-primary)"} />
          ))}
        </div>
        <p className="text-xs text-(--color-text-muted)">ئەم کۆدە لە کاتی کۆبوونەوەدا پیشان بدە</p>
      </div>

      {/* Trip summary */}
      <div className="mt-8 overflow-hidden rounded-(--radius-lg) bg-(--color-surface) shadow-(--shadow-subtle)">
        <div className="flex items-center gap-4 p-5">
          <img src={trip.images[0]} alt={trip.title} className="size-16 shrink-0 rounded-(--radius-md) object-cover" />
          <div>
            <h2 className="font-bold text-(--color-text-primary)">{trip.title}</h2>
            <p className="text-sm text-(--color-text-secondary)">
              {destination?.name} · {formatDuration(trip.duration)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-(--color-border) p-5 sm:grid-cols-4">
          <Fact icon={<CalendarIcon className="size-4" />} label="بەروار" value={trip.nextAvailableDate} />
          <Fact icon={<UsersIcon className="size-4" />} label="گەشتیار" value={`${travelers} کەس`} />
          <Fact icon={<MapPinIcon className="size-4" />} label="کۆبوونەوە" value={trip.meetingPoint} />
          <Fact icon={<TicketIcon className="size-4" />} label="ئەژانس" value={agency?.name ?? "—"} />
        </div>
        <div className="flex items-center justify-between border-t border-(--color-border) p-5">
          <span className="text-sm text-(--color-text-secondary)">کۆی پارەدراو</span>
          <span className="num text-lg font-extrabold text-(--color-primary-dark)">{formatCurrency(breakdown.totalIqd)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link to="/account/trips" className={buttonClassName("primary", "md", { className: "w-full" })}>
          مشاهدەی بلیت
        </Link>
        <button type="button" onClick={addToCalendar} className={buttonClassName("outline", "md", { className: "w-full" })}>
          زیادکردن بۆ ڕۆژژمێر
        </button>
        <Link to="/account/messages" className={buttonClassName("outline", "md", { className: "w-full" })}>
          <MessageIcon className="size-4" />
          پەیوەندی بە ئەژانس
        </Link>
        <button type="button" onClick={shareLink} className={buttonClassName("outline", "md", { className: "w-full" })}>
          <ShareIcon className="size-4" />
          هاوبەشکردن
        </button>
      </div>

      <div className="mt-6 text-center">
        <Link to={`/trips/${trip.slug}`} className="text-sm font-semibold text-(--color-primary) hover:underline">
          بینینی گەشت
        </Link>
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
      <p className="truncate text-sm font-semibold text-(--color-text-primary)">{value}</p>
    </div>
  );
}
