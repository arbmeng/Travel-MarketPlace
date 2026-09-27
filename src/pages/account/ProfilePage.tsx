import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  BellIcon,
  ChevronRightIcon,
  HeartIcon,
  MessageIcon,
  SettingsIcon,
  StarIcon,
  SupportIcon,
  TicketIcon,
} from "@/components/icons";
import { CURRENT_TRAVELER, TRAVELER_STATS } from "@/data/accountMock";
import { NOTIFICATIONS } from "@/data/mock";

const LINKS = [
  { to: "/wishlist", label: "گەشتە پاشەکەوتکراوەکان", icon: HeartIcon },
  { to: "/account/trips", label: "گەشتەکانم", icon: TicketIcon },
  { to: "/account/reviews", label: "هەڵسەنگاندنەکانم", icon: StarIcon },
  { to: "/account/notifications", label: "ئاگادارکردنەوەکان", icon: BellIcon },
  { to: "/account/messages", label: "پەیامەکان", icon: MessageIcon },
  { to: "/account/settings", label: "ڕێکخستنەکان", icon: SettingsIcon },
  { to: "/support", label: "پشتگیری", icon: SupportIcon },
];

export default function ProfilePage() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-(--breakpoint-md) px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 rounded-(--radius-lg) bg-(--color-surface) p-6 text-center shadow-(--shadow-subtle) sm:flex-row sm:text-start">
        <Avatar src={CURRENT_TRAVELER.avatar} alt={CURRENT_TRAVELER.fullName} size="xl" ring />
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-(--color-text-primary)">{CURRENT_TRAVELER.fullName}</h1>
          <p className="text-sm text-(--color-text-secondary)">{CURRENT_TRAVELER.email}</p>
          <p className="mt-1 text-xs text-(--color-text-muted)">
            ئەندامە لە <span className="num">{CURRENT_TRAVELER.memberSince}</span>ەوە
          </p>
        </div>
        <Link
          to="/account/settings"
          className="flex size-10 items-center justify-center rounded-full border border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-surface-elevated)"
        >
          <SettingsIcon className="size-5" />
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatCard value={TRAVELER_STATS.tripsCompleted} label="گەشتی تەواوبوو" />
        <StatCard value={TRAVELER_STATS.destinationsVisited} label="شوێنی سەردانکراو" />
        <StatCard value={TRAVELER_STATS.reviewsWritten} label="هەڵسەنگاندن" />
      </div>

      {/* Links */}
      <div className="mt-8 overflow-hidden rounded-(--radius-lg) bg-(--color-surface) shadow-(--shadow-subtle)">
        {LINKS.map((link, i) => (
          <Link
            key={link.to}
            to={link.to}
            className={
              "flex items-center gap-3 px-5 py-4 transition-colors hover:bg-(--color-surface-elevated)" +
              (i !== LINKS.length - 1 ? " border-b border-(--color-border)" : "")
            }
          >
            <span className="flex size-10 items-center justify-center rounded-(--radius-md) bg-(--color-primary-50) text-(--color-primary)">
              <link.icon className="size-5" />
            </span>
            <span className="flex-1 font-semibold text-(--color-text-primary)">{link.label}</span>
            {link.to === "/account/notifications" && unreadCount > 0 && (
              <Badge tone="error" className="num">
                {unreadCount}
              </Badge>
            )}
            <ChevronRightIcon className="size-4 text-(--color-text-muted) rtl:rotate-180" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-(--radius-lg) bg-(--color-surface) p-4 text-center shadow-(--shadow-subtle)">
      <p className="num text-2xl font-extrabold text-(--color-primary-dark)">{value}</p>
      <p className="mt-1 text-xs text-(--color-text-secondary)">{label}</p>
    </div>
  );
}
