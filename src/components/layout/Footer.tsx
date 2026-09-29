import { Link } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";

const COLUMNS = [
  {
    title: "گەڕان",
    links: [
      { to: "/destinations", label: "شوێنەکان" },
      { to: "/explore", label: "گەشتەکان" },
      { to: "/agencies", label: "ئەژانسەکان" },
      { to: "/map", label: "نەخشە" },
    ],
  },
  {
    title: "بۆ ئەژانسەکان",
    links: [
      { to: "/agency/onboarding", label: "ببە بە ئەژانس" },
      { to: "/agency/login", label: "چوونەژوورەوەی ئەژانس" },
      { to: "/agency/pricing", label: "کرێ و کۆمیسیۆن" },
    ],
  },
  {
    title: "پشتگیری",
    links: [
      { to: "/support", label: "ناوەندی یارمەتی" },
      { to: "/support", label: "پەیوەندیمان پێوە بکە" },
      { to: "/legal/cancellation", label: "یاسای هەڵوەشاندنەوە" },
      { to: "/legal/safety", label: "سەلامەتی گەشتیار" },
    ],
  },
  {
    title: "کۆمپانیا",
    links: [
      { to: "/legal/about", label: "دەربارەمان" },
      { to: "/legal/terms", label: "مەرجەکان" },
      { to: "/legal/privacy", label: "تایبەتمەندی" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-(--color-border) bg-(--color-surface-elevated)">
      <div className="mx-auto grid max-w-(--breakpoint-2xl) gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm text-(--color-text-secondary)">
            Zerrin.Travel — دۆزینەوە و حیجزکردنی گەشت و ئەزموون لە کوردستان و جیهان.
          </p>
          <div className="flex items-center gap-3 pt-1 text-(--color-text-muted)">
            {["Instagram", "Facebook", "TikTok", "YouTube"].map((s) => (
              <span key={s} className="flex size-9 items-center justify-center rounded-full bg-(--color-surface) text-xs font-bold shadow-(--shadow-subtle)">
                {s[0]}
              </span>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-(--color-text-primary)">{col.title}</h4>
            {col.links.map((l, i) => (
              <Link key={i} to={l.to} className="text-sm text-(--color-text-secondary) hover:text-(--color-primary)">
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-(--color-border)">
        <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-(--color-text-muted) sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Zerrin.Travel. هەموو مافەکان پارێزراون.</span>
          <div className="flex items-center gap-4">
            <span>کوردی</span>
            <span>IQD (د.ع)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
