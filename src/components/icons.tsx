// Minimal inline icon set (stroke-based, 24x24 viewbox) to avoid an external icon dependency.
import type { SVGProps } from "react";

function Icon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props} />;
}

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Icon>
);
export const HeartIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M12 20.3s-7.3-4.4-9.8-9C.6 8 2 4.5 5.3 3.7c2-.5 4 .2 5.2 1.9l1.5 2 1.5-2c1.2-1.7 3.2-2.4 5.2-1.9 3.3.8 4.7 4.3 3.1 7.6-2.5 4.6-9.8 9-9.8 9Z" /></Icon>
);
export const BellIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></Icon>
);
export const MessageIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.6-.3-3.7-.9L3 21l1.9-5.8A8.5 8.5 0 1 1 21 11.5Z" /></Icon>
);
export const UserIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" /></Icon>
);
export const HomeIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="m4 11 8-7 8 7" /><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" /></Icon>
);
export const CompassIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="m15 9-4 2-2 4 4-2 2-4Z" /></Icon>
);
export const MapPinIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></Icon>
);
export const TicketIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8Z" /><path d="M10 6v12" strokeDasharray="2 3" /></Icon>
);
export const ChevronDownIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>
);
export const ChevronRightIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>
);
export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>
);
export const CalendarIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></Icon>
);
export const UsersIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 19c1-3.2 3.6-5 6.5-5s5.5 1.8 6.5 5" /><circle cx="17" cy="8" r="2.6" /><path d="M15 11.3c1.9.5 3.4 1.9 4.5 5.2" /></Icon>
);
export const CheckCircleIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.3 2.3L16 10" /></Icon>
);
export const XCircleIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="m9.5 9.5 5 5m0-5-5 5" /></Icon>
);
export const ClockIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></Icon>
);
export const FilterIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M4 6h16M7 12h10M10 18h4" /></Icon>
);
export const ShareIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.3 10.8 7.4-4.2M8.3 13.2l7.4 4.2" /></Icon>
);
export const ChartIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M4 20V10M12 20V4M20 20v-7" /></Icon>
);
export const WalletIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16" cy="14" r="1.3" fill="currentColor" stroke="none" /></Icon>
);
export const SettingsIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 13a7.4 7.4 0 0 0 0-2l2-1.5-2-3.4-2.3.8a7.5 7.5 0 0 0-1.8-1l-.4-2.4h-4l-.3 2.4a7.5 7.5 0 0 0-1.8 1l-2.3-.8-2 3.4L6.6 11a7.4 7.4 0 0 0 0 2l-2 1.5 2 3.4 2.3-.8c.5.4 1.1.8 1.8 1l.3 2.4h4l.4-2.4c.6-.2 1.2-.6 1.8-1l2.3.8 2-3.4-2-1.5Z" /></Icon>
);
export const SupportIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 1-1 1.7v.3M12 17h.01" /></Icon>
);
export const StarIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...p}><path d="M10 1.6 12.6 7l5.9.9-4.3 4.1 1 5.9L10 15.1l-5.2 2.8 1-5.9L1.5 7.9l5.9-.9L10 1.6Z" /></svg>
);
export const ArrowRightIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);
export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>
);
export const BriefcaseIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Icon>
);
export const GlobeIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9Z" /></Icon>
);
