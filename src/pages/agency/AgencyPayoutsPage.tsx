import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { WalletIcon, CalendarIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import { PAYOUTS, availableBalanceIqd, pendingBalanceIqd, payoutBreakdown, totalPaidOutIqd } from "@/data/agencyMock";
import type { PayoutStatus } from "@/data/agencyMock";

const STATUS_LABEL: Record<PayoutStatus, string> = {
  pending: "چاوەڕوان",
  processing: "لە پرۆسەدایە",
  paid: "پارەدراوە",
  failed: "سەرکەوتوو نەبوو",
};
const STATUS_TONE: Record<PayoutStatus, "neutral" | "primary" | "success" | "warning" | "error"> = {
  pending: "warning",
  processing: "primary",
  paid: "success",
  failed: "error",
};

export default function AgencyPayoutsPage() {
  const nextPending = [...PAYOUTS].find((p) => p.status === "pending");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-(--color-text-primary)">پارەدان</h1>
        <p className="mt-1 text-(--color-text-secondary)">باڵانسی حسابەکەت و مێژووی پارەدانەکانت.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="باڵانسی بەردەست" value={formatCurrency(availableBalanceIqd())} tone="success" />
        <Kpi label="باڵانسی چاوەڕوان" value={formatCurrency(pendingBalanceIqd())} tone="warning" />
        <Kpi label="بەرواری داهاتووی پارەدان" value={nextPending?.date ?? "—"} icon />
        <Kpi label="کۆی پارەدراو" value={formatCurrency(totalPaidOutIqd())} />
      </div>

      <div className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
        <p className="mb-4 text-sm text-(--color-text-secondary)">
          هەموو کۆمیسیۆن و خەرجییەکان بەپێی ڕێژەکانی چالاکی هەژمارکراون؛ سەیری{" "}
          <Link to="/agency/pricing" className="font-semibold text-(--color-primary)">
            وردەکاری کرێ و کۆمیسیۆن
          </Link>{" "}
          بکە.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-start text-sm">
            <thead>
              <tr className="border-b border-(--color-border) text-xs font-semibold text-(--color-text-muted)">
                <th className="px-3 py-3 text-start">ژمارەی پارەدان</th>
                <th className="px-3 py-3 text-start">بەروار</th>
                <th className="px-3 py-3 text-start">کۆی گشتی</th>
                <th className="px-3 py-3 text-start">کۆمیسیۆن</th>
                <th className="px-3 py-3 text-start">خەرجی پرۆسەکردن</th>
                <th className="px-3 py-3 text-start">گەڕاندنەوە</th>
                <th className="px-3 py-3 text-start">پارەی وەرگیراو</th>
                <th className="px-3 py-3 text-start">دۆخ</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map((p) => {
                const b = payoutBreakdown(p);
                return (
                  <tr key={p.id} className="border-b border-(--color-border) last:border-0 hover:bg-(--color-surface-elevated)">
                    <td className="num px-3 py-3 font-semibold text-(--color-text-primary)">{p.id.toUpperCase()}</td>
                    <td className="px-3 py-3 text-(--color-text-secondary)">{p.date}</td>
                    <td className="num px-3 py-3 text-(--color-text-primary)">{formatCurrency(b.grossBookingIqd)}</td>
                    <td className="num px-3 py-3 text-(--color-error)">- {formatCurrency(b.platformCommissionIqd)}</td>
                    <td className="num px-3 py-3 text-(--color-error)">- {formatCurrency(b.paymentProcessingIqd)}</td>
                    <td className="num px-3 py-3 text-(--color-error)">{b.refundIqd > 0 ? `- ${formatCurrency(b.refundIqd)}` : "—"}</td>
                    <td className="num px-3 py-3 font-bold text-(--color-primary-dark)">{formatCurrency(b.netPayoutIqd)}</td>
                    <td className="px-3 py-3">
                      <Badge tone={STATUS_TONE[p.status]}>{STATUS_LABEL[p.status]}</Badge>
                    </td>
                    <td className="px-3 py-3 text-end">
                      <Link to={`/agency/payouts/${p.id}`} className="text-sm font-semibold text-(--color-primary)">
                        وردەکاری
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, tone, icon }: { label: string; value: string; tone?: "success" | "warning"; icon?: boolean }) {
  const toneClass = tone === "success" ? "text-(--color-success)" : tone === "warning" ? "text-(--color-warning)" : "text-(--color-text-primary)";
  return (
    <div className="flex flex-col gap-2 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
      <div className="flex size-9 items-center justify-center rounded-full bg-(--color-primary-50) text-(--color-primary)">
        {icon ? <CalendarIcon className="size-4" /> : <WalletIcon className="size-4" />}
      </div>
      <p className="text-xs font-semibold text-(--color-text-muted)">{label}</p>
      <p className={`num text-lg font-extrabold ${toneClass}`}>{value}</p>
    </div>
  );
}
