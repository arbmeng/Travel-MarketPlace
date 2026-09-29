import { useState } from "react";
import { PillTabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { BellIcon, CalendarIcon, MessageIcon, StarIcon, TicketIcon, UsersIcon, WalletIcon } from "@/components/icons";
import { AGENCY_NOTIFICATIONS, type AgencyNotification } from "@/data/agencyMock";

const CATEGORY_ICON: Record<AgencyNotification["category"], typeof BellIcon> = {
  booking: CalendarIcon,
  payment: WalletIcon,
  trip: TicketIcon,
  review: StarIcon,
  message: MessageIcon,
  payout: WalletIcon,
  capacity: UsersIcon,
};

const CATEGORY_LABEL: Record<AgencyNotification["category"], string> = {
  booking: "حیجز",
  payment: "پارەدان",
  trip: "گەشت",
  review: "هەڵسەنگاندن",
  message: "پەیام",
  payout: "پارەدانی ئەژانس",
  capacity: "گونجاندن",
};

const FILTERS: (AgencyNotification["category"] | "all")[] = ["all", "booking", "payment", "trip", "review", "message", "payout", "capacity"];

export default function AgencyNotificationsPage() {
  const [items, setItems] = useState(AGENCY_NOTIFICATIONS);
  const [filter, setFilter] = useState<AgencyNotification["category"] | "all">("all");

  const filtered = filter === "all" ? items : items.filter((n) => n.category === filter);

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-(--color-text-primary)">ئاگادارکردنەوەکان</h1>
          <p className="mt-1 text-(--color-text-secondary)">هەموو چالاکییەکانی ئەژانسەکەت لێرە بەدواداچوونیان بکە.</p>
        </div>
        {items.some((n) => !n.read) && (
          <button
            type="button"
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
            className="text-sm font-semibold text-(--color-primary)"
          >
            هەمووی وەک خوێندراوە نیشان بدە
          </button>
        )}
      </div>

      <PillTabs
        items={FILTERS.map((f) => ({
          key: f,
          label: f === "all" ? "هەمووی" : CATEGORY_LABEL[f],
          count: f === "all" ? items.length : items.filter((n) => n.category === f).length,
        }))}
        active={filter}
        onChange={(k) => setFilter(k as AgencyNotification["category"] | "all")}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={<BellIcon className="size-7" />} title="هیچ ئاگادارکردنەوەیەک نییە" />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((n) => {
            const Icon = CATEGORY_ICON[n.category];
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-3 rounded-(--radius-lg) p-4 text-start shadow-(--shadow-subtle) transition-colors ${
                  n.read ? "bg-(--color-surface)" : "bg-(--color-primary-50)"
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-surface-elevated) text-(--color-primary)">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-(--color-text-primary)">{n.title}</p>
                    {!n.read && <span className="size-2 shrink-0 rounded-full bg-(--color-error)" />}
                  </div>
                  <p className="mt-0.5 text-sm text-(--color-text-secondary)">{n.body}</p>
                  <p className="mt-1 text-xs text-(--color-text-muted)">{n.createdAt}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
