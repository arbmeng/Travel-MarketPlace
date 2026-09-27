import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";
import {
  BellIcon,
  CalendarIcon,
  ChartIcon,
  HomeIcon,
  MenuIcon,
  MessageIcon,
  SettingsIcon,
  StarIcon,
  SupportIcon,
  TicketIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { useState } from "react";

const SIDEBAR_ITEMS = [
  { to: "/agency/dashboard", label: "داشبۆرد", icon: HomeIcon, end: true },
  { to: "/agency/trips", label: "گەشتەکان", icon: TicketIcon },
  { to: "/agency/bookings", label: "حیجزەکان", icon: CalendarIcon },
  { to: "/agency/calendar", label: "ڕۆژژمێر", icon: CalendarIcon },
  { to: "/agency/customers", label: "گەشتیاران", icon: UsersIcon },
  { to: "/agency/messages", label: "پەیامەکان", icon: MessageIcon },
  { to: "/agency/reviews", label: "هەڵسەنگاندنەکان", icon: StarIcon },
  { to: "/agency/payouts", label: "پارەدان", icon: WalletIcon },
  { to: "/agency/analytics", label: "شیکاری", icon: ChartIcon },
  { to: "/agency/profile", label: "پڕۆفایلی ئەژانس", icon: UserIcon },
  { to: "/agency/settings", label: "ڕێکخستنەکان", icon: SettingsIcon },
  { to: "/agency/support", label: "پشتگیری", icon: SupportIcon },
];

const MOBILE_ITEMS = [
  { to: "/agency/dashboard", label: "سەرەکی", icon: HomeIcon, end: true },
  { to: "/agency/bookings", label: "حیجزەکان", icon: CalendarIcon },
  { to: "/agency/calendar", label: "ڕۆژژمێر", icon: CalendarIcon },
  { to: "/agency/messages", label: "پەیامەکان", icon: MessageIcon },
  { to: "/agency/settings", label: "زیاتر", icon: MenuIcon },
];

export function AgencyLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-(--color-bg)">
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 flex-col border-e border-(--color-border) bg-(--color-surface) lg:flex">
        <div className="flex h-20 items-center px-6">
          <Logo />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "mb-1 flex items-center gap-3 rounded-(--radius-md) px-3 py-2.5 text-sm font-semibold transition-colors",
                  isActive ? "bg-(--color-primary-50) text-(--color-primary-dark)" : "text-(--color-text-secondary) hover:bg-(--color-surface-elevated)"
                )
              }
            >
              <item.icon className="size-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-(--color-border) p-4">
          <NavLink to="/" className="text-xs font-semibold text-(--color-text-muted) hover:text-(--color-primary)">
            گەڕانەوە بۆ ماڵپەڕی گەشتیاران
          </NavLink>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ps-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-(--color-border) bg-(--color-surface)/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-surface-elevated) lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="مێنیو"
          >
            <MenuIcon className="size-5" />
          </button>
          <span className="hidden text-sm font-semibold text-(--color-text-muted) lg:block">پەڕەی بەڕێوەبردنی ئەژانس</span>
          <div className="flex items-center gap-2">
            <NavLink to="/agency/notifications" className="relative flex size-9 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-surface-elevated)">
              <BellIcon className="size-5" />
              <span className="absolute end-1 top-1 size-2 rounded-full bg-(--color-error)" />
            </NavLink>
            <img src="https://api.dicebear.com/9.x/shapes/svg?seed=zagros-explorers&backgroundColor=0F3D3E,B5652F" alt="ئەژانس" className="size-9 rounded-full object-cover" />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex w-72 flex-col bg-(--color-surface) p-4">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="داخستن" className="text-(--color-text-muted)">
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {SIDEBAR_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-(--radius-md) px-3 py-2.5 text-sm font-semibold",
                      isActive ? "bg-(--color-primary-50) text-(--color-primary-dark)" : "text-(--color-text-secondary)"
                    )
                  }
                >
                  <item.icon className="size-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-(--color-border) bg-(--color-surface)/95 backdrop-blur lg:hidden">
        {MOBILE_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn("flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold", isActive ? "text-(--color-primary)" : "text-(--color-text-muted)")
            }
          >
            <item.icon className="size-6" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
