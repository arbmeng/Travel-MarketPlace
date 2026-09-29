import { useState } from "react";
import { BottomSheet } from "@/components/ui/Modal";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { ChevronRightIcon, ChevronDownIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import { PUBLISHED_AGENCY_TRIPS } from "@/data/agencyMock";

type DayStatus = "available" | "booked" | "blocked" | "sold_out";

interface DayCell {
  day: number;
  status: DayStatus;
  tripTitle: string;
  remaining: number;
  priceIqd: number;
}

const WEEKDAYS = ["شەممە", "یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "هەینی"];
const MONTH_LABEL = "تشرینی یەکەم ٢٠٢٦";

function buildMonth(): DayCell[] {
  const trip = PUBLISHED_AGENCY_TRIPS[0];
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    let status: DayStatus = "available";
    if ([3, 10, 17, 24].includes(day)) status = "booked";
    else if ([6, 7, 13, 14, 20, 21, 27, 28].includes(day)) status = "blocked";
    else if (day === 15) status = "sold_out";
    return {
      day,
      status,
      tripTitle: trip?.title ?? "گەشتی ڕەواندز",
      remaining: status === "sold_out" ? 0 : status === "booked" ? 4 : trip?.maxTravelers ?? 12,
      priceIqd: trip?.priceIqd ?? 150000,
    };
  });
}

const STATUS_STYLE: Record<DayStatus, string> = {
  available: "bg-(--color-success-bg) text-(--color-success)",
  booked: "bg-(--color-info-bg) text-(--color-info)",
  blocked: "bg-(--color-surface-elevated) text-(--color-text-muted)",
  sold_out: "bg-(--color-error-bg) text-(--color-error)",
};

const STATUS_LABEL: Record<DayStatus, string> = {
  available: "بەردەست",
  booked: "حیجزکراو",
  blocked: "بلۆککراو",
  sold_out: "تەواو فرۆشراو",
};

export default function AgencyCalendarPage() {
  const [month, setMonth] = useState(buildMonth());
  const [selected, setSelected] = useState<DayCell | null>(null);
  const { push } = useToast();

  function applyAction(action: string) {
    if (!selected) return;
    push(`«${action}» بۆ ڕۆژی ${selected.day} پەسەند کرا`);
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-(--color-text-primary)">ڕۆژژمێری بەردەستی</h1>
        <p className="mt-1 text-(--color-text-secondary)">دۆخی هەموو ڕۆژەکانی گەشتەکانت بەڕێوە ببە.</p>
      </div>

      <div className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" className="flex size-9 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-surface-elevated)">
            <ChevronRightIcon className="size-4 rotate-180" />
          </button>
          <h2 className="font-bold text-(--color-text-primary)">{MONTH_LABEL}</h2>
          <button type="button" className="flex size-9 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-surface-elevated)">
            <ChevronRightIcon className="size-4" />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-(--color-text-muted)">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {month.map((cell) => (
            <button
              key={cell.day}
              type="button"
              onClick={() => setSelected(cell)}
              className={`flex flex-col items-center gap-1 rounded-(--radius-sm) p-2 text-sm transition-transform hover:scale-[1.03] ${STATUS_STYLE[cell.status]}`}
            >
              <span className="num font-bold">{cell.day}</span>
              {cell.status !== "blocked" && <span className="num text-[10px]">{cell.remaining}</span>}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-xs text-(--color-text-secondary)">
          {(Object.keys(STATUS_LABEL) as DayStatus[]).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className={`size-3 rounded-(--radius-xs) ${STATUS_STYLE[s]}`} />
              {STATUS_LABEL[s]}
            </span>
          ))}
        </div>
      </div>

      <BottomSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `ڕۆژی ${selected.day}ی ${MONTH_LABEL}` : undefined}
      >
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-(--radius-md) bg-(--color-surface-elevated) p-3">
              <div>
                <p className="text-sm font-semibold text-(--color-text-primary)">{selected.tripTitle}</p>
                <p className="num text-xs text-(--color-text-muted)">{formatCurrency(selected.priceIqd)} بۆ هەر کەسێک</p>
              </div>
              <Badge tone={selected.status === "sold_out" ? "error" : selected.status === "blocked" ? "neutral" : "success"}>
                {STATUS_LABEL[selected.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="گونجاندنی گشتی" type="number" defaultValue={selected.remaining} />
              <Input label="نرخی ئەم ڕۆژە" type="number" defaultValue={selected.priceIqd} />
            </div>
            <Select label="دۆخی ڕۆژ" defaultValue={selected.status}>
              <option value="available">بەردەست</option>
              <option value="blocked">بلۆککردنی ڕۆژ</option>
              <option value="sold_out">نیشاندان وەک تەواو فرۆشراو</option>
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => applyAction("بلۆککردنی ڕۆژ")}>
                بلۆککردن
              </Button>
              <Button variant="outline" onClick={() => applyAction("کردنەوەی ڕۆژ")}>
                کردنەوە
              </Button>
              <Button variant="outline" onClick={() => applyAction("گۆڕینی گونجاندن")}>
                گۆڕینی گونجاندن
              </Button>
              <Button onClick={() => applyAction("گۆڕینی نرخ")}>پاشەکەوتکردنی نرخ</Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
