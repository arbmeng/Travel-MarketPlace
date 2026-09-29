import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/States";
import { buttonClassName } from "@/components/ui/Button";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { WalletIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import { FEE_CONFIG } from "@/lib/pricing";
import { getAgencyTripById, getCustomerById, getPayoutById, payoutBreakdown } from "@/data/agencyMock";
import { useToast } from "@/components/ui/Toast";

const STATUS_LABEL = { pending: "چاوەڕوان", processing: "لە پرۆسەدایە", paid: "پارەدراوە", failed: "سەرکەوتوو نەبوو" } as const;

export default function AgencyPayoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const payout = id ? getPayoutById(id) : undefined;
  const { push } = useToast();

  if (!payout) {
    return <ErrorState title="پارەدان نەدۆزرایەوە" />;
  }

  const breakdown = payoutBreakdown(payout);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-(--color-text-primary)">پارەدانی #{payout.id.toUpperCase()}</h1>
          <p className="mt-1 text-(--color-text-secondary)">بەروار: {payout.date}</p>
        </div>
        <Badge tone={payout.status === "paid" ? "success" : payout.status === "failed" ? "error" : payout.status === "processing" ? "primary" : "warning"}>
          {STATUS_LABEL[payout.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            <h2 className="mb-4 font-bold text-(--color-text-primary)">حیجزە پەیوەندیدارەکان</h2>
            <div className="flex flex-col divide-y divide-(--color-border)">
              {breakdown.bookings.map((b) => {
                const trip = getAgencyTripById(b.tripId);
                const customer = getCustomerById(b.customerId);
                return (
                  <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                      <p className="text-sm font-semibold text-(--color-text-primary)">{trip?.title}</p>
                      <p className="text-xs text-(--color-text-muted)">
                        #{b.bookingNumber} · {customer?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="num text-sm font-semibold text-(--color-text-primary)">{formatCurrency(b.grossIqd)}</span>
                      <BookingStatusBadge status={b.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            <h2 className="mb-4 font-bold text-(--color-text-primary)">وردەکاری کۆمیسیۆن</h2>
            <dl className="flex flex-col gap-2.5 text-sm">
              <Row label="کۆی گشتی حیجزەکان" value={formatCurrency(breakdown.grossBookingIqd)} />
              <Row label={`کۆمیسیۆنی بازاڕ (%${FEE_CONFIG.platformCommissionPercent})`} value={`- ${formatCurrency(breakdown.platformCommissionIqd)}`} muted />
              <Row label={`خەرجی پرۆسەکردن (%${FEE_CONFIG.paymentProcessingFeePercent})`} value={`- ${formatCurrency(breakdown.paymentProcessingIqd)}`} muted />
              {breakdown.refundIqd > 0 && <Row label="گەڕاندنەوە" value={`- ${formatCurrency(breakdown.refundIqd)}`} muted />}
              <div className="my-1 border-t border-dashed border-(--color-border)" />
              <Row label="پارەی وەرگیراو" value={formatCurrency(breakdown.netPayoutIqd)} strong />
            </dl>
          </section>

          <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
            <h2 className="mb-3 font-bold text-(--color-text-primary)">شوێنی پارەدان</h2>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-(--color-primary-50) text-(--color-primary)">
                <WalletIcon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-(--color-text-primary)">{payout.bankName}</p>
                <p className="num text-xs text-(--color-text-muted)">•••• {payout.bankLast4}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => push("داگرتنی وەسڵ دەستپێکرا")}
              className={buttonClassName("outline", "sm", { className: "mt-4 w-full" })}
            >
              داگرتنی وەسڵ
            </button>
          </section>

          <Link to="/agency/payouts" className="text-center text-sm font-semibold text-(--color-primary)">
            گەڕانەوە بۆ لیستی پارەدانەکان
          </Link>
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
