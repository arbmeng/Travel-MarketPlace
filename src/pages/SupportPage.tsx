import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  BriefcaseIcon,
  ChevronDownIcon,
  MessageIcon,
  SearchIcon,
  SettingsIcon,
  SupportIcon,
  TicketIcon,
  WalletIcon,
  XCircleIcon,
} from "@/components/icons";
import { FAQ_ITEMS, SUPPORT_CATEGORIES } from "@/data/accountMock";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  booking: TicketIcon,
  payment: WalletIcon,
  cancellation: XCircleIcon,
  trips: BriefcaseIcon,
  account: SettingsIcon,
  safety: SupportIcon,
};

export default function SupportPage() {
  const { push } = useToast();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);
  const [ticket, setTicket] = useState({ subject: "", category: "booking", description: "" });

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((f) => {
      const matchesCategory = activeCategory ? f.category === activeCategory : true;
      const matchesQuery = query.trim()
        ? f.question.includes(query.trim()) || f.answer.includes(query.trim())
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!ticket.subject.trim() || !ticket.description.trim()) {
      push("تکایە بابەت و باسکردنەکە پڕبکەرەوە", "error");
      return;
    }
    push("داواکاریت نێردرا، ڕووماڵی پشتگیریمان بەم زووانە پەیوەندیت پێوە دەکات", "success");
    setTicket({ subject: "", category: "booking", description: "" });
  }

  return (
    <div>
      {/* Hero + search */}
      <section className="bg-(--color-primary-dark) px-4 py-16 text-center text-white sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">ناوەندی یارمەتی</h1>
        <p className="mx-auto mt-3 max-w-lg text-white/85">چۆن دەتوانین یارمەتیت بدەین؟ وەڵامی پرسیارەکانت لێرە بدۆزەرەوە.</p>
        <div className="mx-auto mt-7 flex max-w-lg items-center gap-2 rounded-(--radius-pill) bg-white p-2 shadow-(--shadow-floating)">
          <SearchIcon className="ms-3 size-5 shrink-0 text-(--color-text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="گەڕان بۆ وەڵام..."
            className="h-11 flex-1 bg-transparent px-1 text-sm text-(--color-text-primary) outline-none"
          />
        </div>
      </section>

      <div className="mx-auto max-w-(--breakpoint-lg) px-4 py-12 sm:px-6">
        {/* Categories */}
        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SUPPORT_CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.id] ?? SupportIcon;
            const active = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(active ? null : c.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-(--radius-lg) border p-4 text-center transition-colors cursor-pointer",
                  active ? "border-(--color-primary) bg-(--color-primary-50)" : "border-(--color-border) bg-(--color-surface) hover:border-(--color-primary-light)"
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-(--color-primary-50) text-(--color-primary)">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-(--color-text-primary)">{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* FAQ */}
          <div>
            <h2 className="mb-5 text-xl font-bold text-(--color-text-primary)">پرسیاری دووبارە کراوە</h2>
            {filteredFaqs.length === 0 ? (
              <p className="text-sm text-(--color-text-secondary)">هیچ ئەنجامێک نەدۆزرایەوە. تکایە وشەیەکی تر تاقی بکەرەوە.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredFaqs.map((f) => {
                  const open = openFaq === f.id;
                  return (
                    <div key={f.id} className="overflow-hidden rounded-(--radius-md) border border-(--color-border)">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : f.id)}
                        className="flex w-full items-center justify-between gap-3 p-4 text-start cursor-pointer"
                      >
                        <span className="font-semibold text-(--color-text-primary)">{f.question}</span>
                        <ChevronDownIcon className={cn("size-4 shrink-0 text-(--color-text-muted) transition-transform", open && "rotate-180")} />
                      </button>
                      {open && <p className="border-t border-(--color-border) p-4 text-sm text-(--color-text-secondary)">{f.answer}</p>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Contact options */}
            <h2 className="mb-4 mt-12 text-xl font-bold text-(--color-text-primary)">ڕێگای تری پەیوەندیکردن</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ContactCard icon={<MessageIcon className="size-5" />} title="چات" desc="وەڵامی خێرا لە ماوەی چەند خولەکێکدا" />
              <ContactCard icon={<SupportIcon className="size-5" />} title="تەلەفۆن" desc="+964 750 000 0000" />
              <ContactCard icon={<SupportIcon className="size-5" />} title="ئیمەیل" desc="support@zagros.example" />
            </div>
          </div>

          {/* Ticket form */}
          <div className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle) sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-(--color-text-primary)">داواکارییەک بنێرە</h2>
            <form onSubmit={submitTicket} className="flex flex-col gap-4">
              <Input
                label="بابەت"
                required
                value={ticket.subject}
                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                placeholder="کورت باسی کێشەکەت بکە"
              />
              <Select label="جۆر" value={ticket.category} onChange={(e) => setTicket({ ...ticket, category: e.target.value })}>
                {SUPPORT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
              <Textarea
                label="باسکردن"
                required
                value={ticket.description}
                onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                placeholder="بە وردی کێشەکەت باس بکە..."
              />
              <Button type="submit" fullWidth>
                ناردنی داواکاری
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-(--radius-lg) bg-(--color-surface) p-5 text-center shadow-(--shadow-subtle)">
      <span className="flex size-11 items-center justify-center rounded-full bg-(--color-primary-50) text-(--color-primary)">{icon}</span>
      <p className="font-semibold text-(--color-text-primary)">{title}</p>
      <p className="text-xs text-(--color-text-muted)">{desc}</p>
    </div>
  );
}
