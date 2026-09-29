import { useMemo, useState } from "react";
import { PillTabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { BellIcon, CalendarIcon, GlobeIcon, HeartIcon, MessageIcon, TicketIcon } from "@/components/icons";
import { NOTIFICATIONS } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

const CATEGORY_LABELS: Record<Notification["category"], string> = {
  booking: "حیجزکردن",
  reminder: "یادەوەری",
  message: "پەیام",
  promotion: "داشکاندن",
  wishlist: "پاشەکەوتکراو",
  system: "سیستەم",
};

const CATEGORY_ICONS: Record<Notification["category"], React.ComponentType<{ className?: string }>> = {
  booking: TicketIcon,
  reminder: CalendarIcon,
  message: MessageIcon,
  promotion: GlobeIcon,
  wishlist: HeartIcon,
  system: BellIcon,
};

export default function NotificationsPage() {
  const [category, setCategory] = useState<"all" | Notification["category"]>("all");

  const filtered = useMemo(
    () => (category === "all" ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.category === category)),
    [category]
  );

  const today = filtered.slice(0, 1);
  const earlier = filtered.slice(1);

  return (
    <div className="mx-auto max-w-(--breakpoint-md) px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-1 text-2xl font-extrabold text-(--color-text-primary)">ئاگادارکردنەوەکان</h1>
      <p className="mb-6 text-(--color-text-secondary)">هەموو نوێترین هەواڵەکانت لێرەیە.</p>

      <PillTabs
        active={category}
        onChange={(k) => setCategory(k as typeof category)}
        items={[
          { key: "all", label: "هەمووی" },
          ...(Object.keys(CATEGORY_LABELS) as Notification["category"][]).map((c) => ({ key: c, label: CATEGORY_LABELS[c] })),
        ]}
      />

      <div className="mt-6 flex flex-col gap-6">
        {filtered.length === 0 ? (
          <EmptyState icon={<BellIcon className="size-7" />} title="هیچ ئاگادارکردنەوەیەک نییە" description="هیچ ئاگادارکردنەوەیەکی ئەم جۆرە نییە." />
        ) : (
          <>
            {today.length > 0 && <NotificationGroup title="ئەمڕۆ" items={today} />}
            {earlier.length > 0 && <NotificationGroup title="پێشتر" items={earlier} />}
          </>
        )}
      </div>
    </div>
  );
}

function NotificationGroup({ title, items }: { title: string; items: Notification[] }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-bold text-(--color-text-muted)">{title}</h2>
      <div className="flex flex-col gap-2">
        {items.map((n) => {
          const Icon = CATEGORY_ICONS[n.category];
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 rounded-(--radius-lg) p-4 shadow-(--shadow-subtle)",
                n.read ? "bg-(--color-surface)" : "bg-(--color-primary-50)"
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full",
                  n.read ? "bg-(--color-surface-elevated) text-(--color-text-muted)" : "bg-(--color-primary) text-white"
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("font-semibold text-(--color-text-primary)", !n.read && "font-bold")}>{n.title}</p>
                  {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-(--color-primary)" />}
                </div>
                <p className="mt-0.5 text-sm text-(--color-text-secondary)">{n.body}</p>
                <p className="mt-1.5 text-xs text-(--color-text-muted)">{CATEGORY_LABELS[n.category]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
