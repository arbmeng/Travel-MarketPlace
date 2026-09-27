import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";
import { BellIcon, GlobeIcon, HeartIcon, MenuIcon, MessageIcon, SearchIcon, UserIcon } from "@/components/icons";
import { NOTIFICATIONS } from "@/data/mock";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/", label: "سەرەکی" },
  { to: "/explore", label: "بگەڕێ" },
  { to: "/destinations", label: "شوێنەکان" },
  { to: "/agencies", label: "ئەژانسەکان" },
  { to: "/map", label: "نەخشە" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-(--color-surface)/95 backdrop-blur transition-all",
        scrolled ? "border-(--color-border) shadow-(--shadow-subtle)" : "border-transparent"
      )}
    >
      <div className={cn("mx-auto flex max-w-(--breakpoint-2xl) items-center justify-between gap-4 px-4 transition-all sm:px-6", scrolled ? "h-16" : "h-20")}>
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-(--radius-pill) px-4 py-2 text-sm font-semibold transition-colors",
                  isActive ? "bg-(--color-primary-50) text-(--color-primary-dark)" : "text-(--color-text-secondary) hover:bg-(--color-surface-elevated)"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/explore?scope=international"
            className="flex items-center gap-1.5 rounded-(--radius-pill) bg-(--color-secondary)/10 px-4 py-2 text-sm font-semibold text-(--color-secondary-dark) transition-colors hover:bg-(--color-secondary)/20"
          >
            <GlobeIcon className="size-4" />
            دەرەوەی وڵات
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/search"
            aria-label="گەڕان"
            className="flex size-10 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-surface-elevated)"
          >
            <SearchIcon className="size-5" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <CurrencyLanguageSwitcher />
          </div>

          <Link to="/account/notifications" className="relative hidden size-10 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-surface-elevated) sm:flex" aria-label="ئاگادارکردنەوەکان">
            <BellIcon className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute end-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-(--color-error) text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link to="/account/messages" className="hidden size-10 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-surface-elevated) sm:flex" aria-label="پەیامەکان">
            <MessageIcon className="size-5" />
          </Link>
          <Link to="/wishlist" className="hidden size-10 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-surface-elevated) sm:flex" aria-label="پاشەکەوتکراوەکان">
            <HeartIcon className="size-5" />
          </Link>
          <Link
            to="/account"
            className="flex items-center gap-2 rounded-(--radius-pill) border border-(--color-border) py-1 pe-3 ps-1 hover:shadow-(--shadow-subtle)"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-(--color-primary-50) text-(--color-primary-dark)">
              <UserIcon className="size-4" />
            </span>
            <span className="hidden text-sm font-semibold text-(--color-text-primary) md:inline">هەژمار</span>
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-surface-elevated) lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="مێنیو"
          >
            <MenuIcon className="size-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-(--color-border) bg-(--color-surface) px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn("rounded-(--radius-md) px-3 py-2.5 text-sm font-semibold", isActive ? "bg-(--color-primary-50) text-(--color-primary-dark)" : "text-(--color-text-secondary)")
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/explore?scope=international"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5 rounded-(--radius-md) px-3 py-2.5 text-sm font-semibold text-(--color-secondary-dark)"
            >
              <GlobeIcon className="size-4" />
              دەرەوەی وڵات
            </Link>
            <div className="mt-2 border-t border-(--color-border) pt-2">
              <CurrencyLanguageSwitcher />
            </div>
            <Link to="/agency/login" onClick={() => setMobileOpen(false)} className="mt-2 rounded-(--radius-md) px-3 py-2.5 text-sm font-semibold text-(--color-secondary)">
              بۆ ئەژانسەکان
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function CurrencyLanguageSwitcher() {
  return (
    <div className="flex items-center gap-1 text-sm font-semibold text-(--color-text-secondary)">
      <button type="button" className="rounded-(--radius-pill) px-3 py-1.5 hover:bg-(--color-surface-elevated)">
        کوردی
      </button>
      <button type="button" className="rounded-(--radius-pill) px-3 py-1.5 hover:bg-(--color-surface-elevated)">
        IQD
      </button>
    </div>
  );
}
