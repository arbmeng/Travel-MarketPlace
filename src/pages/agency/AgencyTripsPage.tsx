import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { TripStatusBadge } from "@/components/ui/StatusBadge";
import { PillTabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { CalendarIcon, PlusIcon, TicketIcon, UsersIcon } from "@/components/icons";
import { formatFromPrice } from "@/lib/format";
import { DESTINATIONS } from "@/data/mock";
import { AGENCY_TRIPS } from "@/data/agencyMock";
import { TRIP_STATUS_LABELS, type Trip, type TripStatus } from "@/types";

const STATUS_FILTERS: (TripStatus | "all")[] = ["all", "published", "pending_review", "draft", "paused", "sold_out", "expired", "rejected"];

export default function AgencyTripsPage() {
  const [filter, setFilter] = useState<TripStatus | "all">("all");
  const [trips, setTrips] = useState<Trip[]>(AGENCY_TRIPS);
  const [deleteTarget, setDeleteTarget] = useState<Trip | null>(null);
  const { push } = useToast();

  const filtered = useMemo(() => (filter === "all" ? trips : trips.filter((t) => t.status === filter)), [trips, filter]);

  function togglePause(trip: Trip) {
    setTrips((prev) =>
      prev.map((t) => (t.id === trip.id ? { ...t, status: t.status === "paused" ? "published" : t.status === "published" ? "paused" : t.status } : t))
    );
    push(trip.status === "paused" ? "گەشت بڵاوکرایەوە" : "گەشت وەستێنرا");
  }

  function duplicate(trip: Trip) {
    const copy: Trip = { ...trip, id: `${trip.id}-copy-${Date.now()}`, slug: `${trip.slug}-copy`, title: `${trip.title} (کۆپی)`, status: "draft" };
    setTrips((prev) => [copy, ...prev]);
    push("گەشت وەک ڕەشنووس دووبارە کرایەوە");
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setTrips((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    push("گەشت سڕایەوە", "info");
    setDeleteTarget(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-(--color-text-primary)">بەڕێوەبردنی گەشتەکان</h1>
          <p className="mt-1 text-(--color-text-secondary)">هەموو گەشتەکانی ئەژانسەکەت بەڕێوە ببە.</p>
        </div>
        <Link to="/agency/trips/new" className={buttonClassName("primary", "md", { className: "gap-2" })}>
          <PlusIcon className="size-4" />
          گەشتێکی نوێ زیاد بکە
        </Link>
      </div>

      <PillTabs
        items={STATUS_FILTERS.map((s) => ({ key: s, label: s === "all" ? "هەمووی" : TRIP_STATUS_LABELS[s], count: s === "all" ? trips.length : trips.filter((t) => t.status === s).length }))}
        active={filter}
        onChange={(k) => setFilter(k as TripStatus | "all")}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={<TicketIcon className="size-7" />} title="هیچ گەشتێک نییە" description="هیچ گەشتێک بەم دۆخە نییە." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((trip) => {
            const destination = DESTINATIONS.find((d) => d.id === trip.destinationId);
            return (
              <div key={trip.id} className="flex flex-col gap-4 rounded-(--radius-lg) bg-(--color-surface) p-4 shadow-(--shadow-subtle) sm:flex-row sm:items-center">
                <img src={trip.images[0]} alt="" className="h-24 w-full shrink-0 rounded-(--radius-md) object-cover sm:w-32" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-(--color-text-primary)">{trip.title}</h3>
                    <TripStatusBadge status={trip.status} />
                  </div>
                  <p className="mt-1 text-sm text-(--color-text-secondary)">{destination?.name}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--color-text-muted)">
                    <span className="inline-flex items-center gap-1">
                      <UsersIcon className="size-3.5" /> {trip.spotsRemaining}/{trip.maxTravelers} شوێن
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarIcon className="size-3.5" /> {trip.nextAvailableDate}
                    </span>
                    <span className="num font-semibold text-(--color-text-primary)">{formatFromPrice(trip.priceIqd)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
                  <Link to={`/agency/trips/${trip.id}/edit`} className={buttonClassName("outline", "sm")}>
                    دەستکاری
                  </Link>
                  <button type="button" onClick={() => duplicate(trip)} className={buttonClassName("ghost", "sm")}>
                    دووبارەکردنەوە
                  </button>
                  {(trip.status === "published" || trip.status === "paused") && (
                    <button type="button" onClick={() => togglePause(trip)} className={buttonClassName("ghost", "sm")}>
                      {trip.status === "paused" ? "بڵاوکردنەوە" : "وەستاندن"}
                    </button>
                  )}
                  <button type="button" onClick={() => setDeleteTarget(trip)} className={buttonClassName("ghost", "sm", { className: "text-(--color-error)" })}>
                    سڕینەوە
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="سڕینەوەی گەشت"
        footer={
          <>
            <button type="button" onClick={() => setDeleteTarget(null)} className={buttonClassName("outline", "sm")}>
              پاشگەزبوونەوە
            </button>
            <button type="button" onClick={confirmDelete} className={buttonClassName("danger", "sm")}>
              بەڵێ، بیسڕەوە
            </button>
          </>
        }
      >
        <p className="text-sm text-(--color-text-secondary)">
          ئایا دڵنیایت لە سڕینەوەی گەشتی «{deleteTarget?.title}»؟ ئەم کردارە ناتوانرێت پاشگەز بکرێتەوە.
        </p>
      </Modal>
    </div>
  );
}
