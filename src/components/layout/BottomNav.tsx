import { NavLink } from "react-router-dom";
import { CompassIcon, HomeIcon, MapPinIcon, TicketIcon, UserIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "سەرەکی", icon: HomeIcon, end: true },
  { to: "/explore", label: "بگەڕێ", icon: CompassIcon, end: false },
  { to: "/map", label: "نەخشە", icon: MapPinIcon, end: false },
  { to: "/account/trips", label: "گەشتەکان", icon: TicketIcon, end: false },
  { to: "/account", label: "هەژمار", icon: UserIcon, end: false },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-(--color-border) bg-(--color-surface)/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold",
              isActive ? "text-(--color-primary)" : "text-(--color-text-muted)"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn("size-6", isActive && "scale-105")} />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
