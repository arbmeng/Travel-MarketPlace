import { useState } from "react";
import { Link } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { CalendarIcon, MessageIcon, TicketIcon, UsersIcon } from "@/components/icons";
import { MY_BOOKINGS, TRIPS, getAgencyById as getAgency } from "@/data/mock";
import { formatCurrency } from "@/lib/format";
import type { Booking, BookingStatus } from "@/types";

function getTripById(id: string) {
  return TRIPS.find((t) => t.id === id);
}

type TabKey = "upcoming" | "completed" | "cancelled";

const STATUS_FOR_TAB: Record<TabKey, BookingStatus[]> = {
  upcoming: ["upcoming", "confirmed", "paid", "pending"],
  completed: ["completed"],
  cancelled: ["cancelled", "refunded"],
};

const EMPTY_COPY: Record<TabKey, { title: string; description: string }> = {
  upcoming: { title: "هیچ گەشتی داهاتوو نییە", description: "هێشتا هیچ گەشتێکی داهاتووت حیجز نەکردووە." },
  completed: { title: "هیچ گەشتی تەواوبوو نییە", description: "دوای تەواوبوونی یەکەم گەشتت، لێرە دەردەکەوێت." },
  cancelled: { title: "هیچ گەشتی هەڵوەشێنراوە نییە", description: "هیچ حیجزێکت هەڵنەوەشاندووەتەوە." },
};

export default function MyTripsPage() {
  const [tab, setTab] = useState<TabKey>("upcoming");
  const filtered = MY_BOOKINGS.filter((b) => STATUS_FOR_TAB[tab].includes(b.status));

  return (
    <div className="mx-auto max-w-(--breakpoint-lg) px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-1 text-2xl font-extrabold text-(--color-text-primary)">گەشتەکانم</h1>
      <p className="mb-6 text-(--color-text-secondary)">هەموو حیجزەکانت لێرە بەڕێوەببە.</p>

      <Tabs
        className="mb-6"
        items={[
          { key: "upcoming", label: "داهاتوو", count: MY_BOOKINGS.filter((b) => STATUS_FOR_TAB.upcoming.includes(b.status)).length },
          { key: "completed", label: "تەواوبوو", count: MY_BOOKINGS.filter((b) => STATUS_FOR_TAB.completed.includes(b.status)).length },
          { key: "cancelled", label: "هەڵوەشێنراوە", count: MY_BOOKINGS.filter((b) => STATUS_FOR_TAB.cancelled.includes(b.status)).length },
        ]}
        active={tab}
        onChange={(k) => setTab(k as TabKey)}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={<TicketIcon className="size-7" />} title={EMPTY_COPY[tab].title} description={EMPTY_COPY[tab].description} />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((booking) => (
            <BookingRow key={booking.id} booking={booking} tab={tab} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingRow({ booking, tab }: { booking: Booking; tab: TabKey }) {
  const trip = getTripById(booking.tripId);
  const agency = getAgency(booking.agencyId);
  if (!trip) return null;

  return (
    <div className="flex flex-col gap-4 rounded-(--radius-lg) bg-(--color-surface) p-4 shadow-(--shadow-subtle) sm:flex-row sm:items-center">
      <img src={trip.images[0]} alt={trip.title} className="h-32 w-full shrink-0 rounded-(--radius-md) object-cover sm:h-20 sm:w-28" />
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-(--color-text-primary)">{trip.title}</h3>
          <BookingStatusBadge status={booking.status} />
        </div>
        <p className="mt-1 text-xs text-(--color-text-muted)">
          <span className="num">#{booking.bookingNumber}</span> · {agency?.name}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--color-text-secondary)">
          <span className="flex items-center gap-1">
            <CalendarIcon className="size-3.5" /> {booking.date}
          </span>
          <span className="flex items-center gap-1">
            <UsersIcon className="size-3.5" /> <span className="num">{booking.travelers}</span> کەس
          </span>
          <span className="num font-semibold text-(--color-primary-dark)">{formatCurrency(booking.totalIqd)}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Link to={`/account/trips/${booking.id}`} className={buttonClassName("outline", "sm")}>
          بینینی حیجز
        </Link>
        <Link to="/account/messages" className={buttonClassName("ghost", "sm")}>
          <MessageIcon className="size-4" />
          پەیوەندی
        </Link>
        {tab === "upcoming" && (
          <Link to={`/account/trips/${booking.id}/cancel`} className={buttonClassName("ghost", "sm", { className: "text-(--color-error)" })}>
            هەڵوەشاندنەوە
          </Link>
        )}
        {tab === "completed" && (
          <Link to={`/account/trips/${booking.id}/review`} className={buttonClassName("secondary", "sm")}>
            هەڵسەنگاندن بنووسە
          </Link>
        )}
      </div>
    </div>
  );
}
