import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { PillTabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/States";
import { CalendarIcon, SearchIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import { BOOKINGS, getAgencyTripById, getCustomerById } from "@/data/agencyMock";
import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/types";

const FILTERS: (BookingStatus | "all")[] = ["all", "pending", "confirmed", "paid", "upcoming", "completed", "cancelled", "refunded"];

export default function AgencyBookingsPage() {
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return BOOKINGS.filter((b) => {
      if (filter !== "all" && b.status !== filter) return false;
      if (!query.trim()) return true;
      const customer = getCustomerById(b.customerId);
      const q = query.trim().toLowerCase();
      return customer?.name.toLowerCase().includes(q) || b.bookingNumber.toLowerCase().includes(q);
    });
  }, [filter, query]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-(--color-text-primary)">حیجزەکان</h1>
        <p className="mt-1 text-(--color-text-secondary)">هەموو حیجزەکانی گەشتیارانت لێرە بەڕێوە ببە.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PillTabs
          items={FILTERS.map((f) => ({ key: f, label: f === "all" ? "هەمووی" : BOOKING_STATUS_LABELS[f], count: f === "all" ? BOOKINGS.length : BOOKINGS.filter((b) => b.status === f).length }))}
          active={filter}
          onChange={(k) => setFilter(k as BookingStatus | "all")}
        />
        <div className="w-full sm:w-64">
          <Input placeholder="گەڕان بە ناو یان ژمارەی حیجز" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<SearchIcon className="size-7" />} title="هیچ حیجزێک نەدۆزرایەوە" description="فلتەرەکانت بگۆڕە یان وشەیەکی تر تاقی بکەرەوە." />
      ) : (
        <div className="overflow-x-auto rounded-(--radius-lg) bg-(--color-surface) shadow-(--shadow-subtle)">
          <table className="w-full min-w-[820px] text-start text-sm">
            <thead>
              <tr className="border-b border-(--color-border) text-xs font-semibold text-(--color-text-muted)">
                <th className="px-4 py-3 text-start">ژمارەی حیجز</th>
                <th className="px-4 py-3 text-start">گەشتیار</th>
                <th className="px-4 py-3 text-start">گەشت</th>
                <th className="px-4 py-3 text-start">بەروار</th>
                <th className="px-4 py-3 text-start">کەس</th>
                <th className="px-4 py-3 text-start">بڕ</th>
                <th className="px-4 py-3 text-start">دۆخ</th>
                <th className="px-4 py-3 text-start">پارەدان</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const trip = getAgencyTripById(b.tripId);
                const customer = getCustomerById(b.customerId);
                return (
                  <tr key={b.id} className="border-b border-(--color-border) last:border-0 hover:bg-(--color-surface-elevated)">
                    <td className="num px-4 py-3 font-semibold text-(--color-text-primary)">{b.bookingNumber}</td>
                    <td className="px-4 py-3 text-(--color-text-primary)">{customer?.name}</td>
                    <td className="max-w-48 truncate px-4 py-3 text-(--color-text-secondary)">{trip?.title}</td>
                    <td className="px-4 py-3 text-(--color-text-secondary)">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarIcon className="size-3.5" /> {b.date}
                      </span>
                    </td>
                    <td className="num px-4 py-3 text-(--color-text-secondary)">{b.travelers}</td>
                    <td className="num px-4 py-3 font-semibold text-(--color-text-primary)">{formatCurrency(b.grossIqd)}</td>
                    <td className="px-4 py-3">
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={b.paymentStatus} />
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Link to={`/agency/bookings/${b.id}`} className="text-sm font-semibold text-(--color-primary)">
                        وردەکاری
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
