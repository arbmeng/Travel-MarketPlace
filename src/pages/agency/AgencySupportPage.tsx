import { useState } from "react";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { SupportIcon } from "@/components/icons";
import { SUPPORT_CATEGORIES, SUPPORT_TICKETS, type TicketStatus } from "@/data/agencyMock";

const TICKET_LABEL: Record<TicketStatus, string> = { open: "کراوە", in_progress: "لە پرۆسەدایە", resolved: "چارەسەرکراوە" };
const TICKET_TONE: Record<TicketStatus, "neutral" | "primary" | "success" | "warning" | "error"> = {
  open: "warning",
  in_progress: "primary",
  resolved: "success",
};

export default function AgencySupportPage() {
  const [subject, setSubject] = useState("");
  const { push } = useToast();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-(--color-text-primary)">پشتگیری</h1>
        <p className="mt-1 text-(--color-text-secondary)">پرسیارێکت هەیە؟ تیمی پشتگیری Zerrin.Travel یارمەتیت دەدات.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {SUPPORT_CATEGORIES.map((c) => (
          <div key={c} className="flex flex-col items-center gap-2 rounded-(--radius-lg) bg-(--color-surface) p-4 text-center shadow-(--shadow-subtle)">
            <SupportIcon className="size-5 text-(--color-primary)" />
            <span className="text-xs font-semibold text-(--color-text-primary)">{c}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle)">
          <h2 className="font-bold text-(--color-text-primary)">داواکاری پشتگیری نوێ</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              push("داواکارییەکەت نێردرا، بەم زووانە وەڵامت دەدرێتەوە");
              setSubject("");
            }}
            className="flex flex-col gap-4"
          >
            <Select label="جۆری کێشە" required defaultValue="">
              <option value="" disabled>
                جۆرێک هەڵبژێرە
              </option>
              {SUPPORT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Input label="بابەت" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            <Textarea label="وردەکاری کێشەکەت" required />
            <Button type="submit" className="self-start">
              ناردنی داواکاری
            </Button>
          </form>
        </section>

        <section className="rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle)">
          <h2 className="mb-4 font-bold text-(--color-text-primary)">داواکارییەکانت</h2>
          <div className="flex flex-col divide-y divide-(--color-border)">
            {SUPPORT_TICKETS.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-(--color-text-primary)">{t.subject}</p>
                  <p className="text-xs text-(--color-text-muted)">
                    {t.category} · دوایین نوێکردنەوە {t.lastUpdate}
                  </p>
                </div>
                <Badge tone={TICKET_TONE[t.status]}>{TICKET_LABEL[t.status]}</Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
