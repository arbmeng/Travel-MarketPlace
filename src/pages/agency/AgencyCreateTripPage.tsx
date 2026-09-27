import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stepper } from "@/components/ui/Stepper";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge, Chip } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { useToast } from "@/components/ui/Toast";
import { GlobeIcon, MapPinIcon, PlusIcon, UsersIcon } from "@/components/icons";
import { formatFromPrice } from "@/lib/format";
import { DESTINATIONS } from "@/data/mock";
import { AGENCY_TRIPS } from "@/data/agencyMock";
import { DIFFICULTY_LABELS, TRIP_CATEGORY_LABELS, type Difficulty, type ItineraryDay, type Trip, type TripCategory } from "@/types";

const STEPS = [
  "زانیاری بنەڕەتی",
  "میدیا",
  "کاتبەندی",
  "گونجاندن",
  "نرخنان",
  "بەردەستی",
  "پلانی گەشت",
  "لەگەڵ/بەبێ",
  "خاڵی کۆبوونەوە",
  "پێداویستییەکان",
  "یاسای هەڵوەشاندنەوە",
  "پێشبینین",
  "ناردن",
];

interface Draft {
  title: string;
  description: string;
  destinationId: string;
  category: TripCategory;
  images: string[];
  duration: number;
  difficulty: Difficulty;
  departureTime: string;
  minTravelers: number;
  maxTravelers: number;
  priceIqd: number;
  childPriceIqd: number;
  privatePriceIqd: number;
  extras: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  meetingPoint: string;
  meetingInstructions: string;
  requirements: string[];
  whatToBring: string[];
  freeUntilDays: number;
  feePercentAfter: number;
}

function blankDraft(): Draft {
  return {
    title: "",
    description: "",
    destinationId: DESTINATIONS[0].id,
    category: "nature",
    images: [],
    duration: 1,
    difficulty: "easy",
    departureTime: "08:00",
    minTravelers: 2,
    maxTravelers: 12,
    priceIqd: 150000,
    childPriceIqd: 90000,
    privatePriceIqd: 0,
    extras: [],
    itinerary: [{ day: 1, title: "", location: "", activities: [], meals: [], transportation: "" }],
    included: [],
    excluded: [],
    meetingPoint: "",
    meetingInstructions: "",
    requirements: [],
    whatToBring: [],
    freeUntilDays: 3,
    feePercentAfter: 30,
  };
}

function draftFromTrip(trip: Trip): Draft {
  return {
    title: trip.title,
    description: trip.description,
    destinationId: trip.destinationId,
    category: trip.category,
    images: trip.images,
    duration: trip.duration,
    difficulty: trip.difficulty,
    departureTime: "08:00",
    minTravelers: trip.minTravelers,
    maxTravelers: trip.maxTravelers,
    priceIqd: trip.priceIqd,
    childPriceIqd: trip.childPriceIqd ?? 0,
    privatePriceIqd: trip.privatePriceIqd ?? 0,
    extras: [],
    itinerary: trip.itinerary,
    included: trip.included,
    excluded: trip.excluded,
    meetingPoint: trip.meetingPoint,
    meetingInstructions: trip.meetingInstructions,
    requirements: trip.requirements,
    whatToBring: trip.whatToBring,
    freeUntilDays: trip.cancellationPolicy.freeUntilDays,
    feePercentAfter: trip.cancellationPolicy.feePercentAfter,
  };
}

const CATEGORIES: TripCategory[] = ["nature", "adventure", "family", "romantic", "historical", "camping", "hiking", "food", "luxury"];

export default function AgencyCreateTripPage() {
  const { id } = useParams<{ id: string }>();
  const existing = id ? AGENCY_TRIPS.find((t) => t.id === id) : undefined;
  const isEdit = !!existing;
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => (existing ? draftFromTrip(existing) : blankDraft()));
  const navigate = useNavigate();
  const { push } = useToast();

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function next() {
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function prev() {
    setStep((s) => Math.max(0, s - 1));
  }
  function submit() {
    push(isEdit ? "گۆڕانکارییەکان پاشەکەوت کران" : "گەشت نێردرا بۆ پێداچوونەوە");
    navigate("/agency/trips");
  }

  const destination = DESTINATIONS.find((d) => d.id === draft.destinationId);

  return (
    <div className="mx-auto flex max-w-(--breakpoint-lg) flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-(--color-text-primary)">{isEdit ? "دەستکاریکردنی گەشت" : "دروستکردنی گەشتی نوێ"}</h1>
        <p className="mt-1 text-(--color-text-secondary)">هەنگاو {step + 1} لە {STEPS.length}: {STEPS[step]}</p>
      </div>

      <div className="overflow-x-auto pb-2">
        <Stepper steps={STEPS} current={step} />
      </div>

      <div className="rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle)">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Input label="ناونیشانی گەشت" value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="گەشتی هەورامان" required />
            <Textarea label="وەسف" value={draft.description} onChange={(e) => set("description", e.target.value)} required />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="شوێن" value={draft.destinationId} onChange={(e) => set("destinationId", e.target.value)}>
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
              <Select label="جۆر" value={draft.category} onChange={(e) => set("category", e.target.value as TripCategory)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {TRIP_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-(--color-text-primary)">وێنەی سەرەکی (کەڤەر)</p>
            <UploadBox />
            <p className="text-sm font-semibold text-(--color-text-primary)">گالەری وێنەکان</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {(destination?.images ?? []).map((img, i) => (
                <img key={i} src={img} alt="" className="aspect-square w-full rounded-(--radius-md) object-cover" />
              ))}
              <UploadBox compact />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="ماوەی گەشت (بە ڕۆژ)" type="number" min={1} value={draft.duration} onChange={(e) => set("duration", Number(e.target.value))} />
            <Select label="ئاستی سەختی" value={draft.difficulty} onChange={(e) => set("difficulty", e.target.value as Difficulty)}>
              {(["easy", "moderate", "hard"] as Difficulty[]).map((d) => (
                <option key={d} value={d}>
                  {DIFFICULTY_LABELS[d]}
                </option>
              ))}
            </Select>
            <Input label="کاتی دەرچوون" type="time" value={draft.departureTime} onChange={(e) => set("departureTime", e.target.value)} />
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="کەمترین ژمارەی گەشتیار" type="number" min={1} value={draft.minTravelers} onChange={(e) => set("minTravelers", Number(e.target.value))} />
            <Input label="زۆرترین ژمارەی گەشتیار" type="number" min={1} value={draft.maxTravelers} onChange={(e) => set("maxTravelers", Number(e.target.value))} />
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="نرخی سەرەکی (بۆ هەر کەسێک)" type="number" value={draft.priceIqd} onChange={(e) => set("priceIqd", Number(e.target.value))} />
              <Input label="نرخی منداڵ" optional type="number" value={draft.childPriceIqd} onChange={(e) => set("childPriceIqd", Number(e.target.value))} />
              <Input label="نرخی گەشتی تایبەت" optional type="number" value={draft.privatePriceIqd} onChange={(e) => set("privatePriceIqd", Number(e.target.value))} />
            </div>
            <TagEditor label="ئێکستراکانی ئیختیاری (وەک: خۆراکی تایبەت، وێنەگری تایبەت)" values={draft.extras} onChange={(v) => set("extras", v)} />
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="mb-3 text-sm text-(--color-text-secondary)">دۆخی بەردەستی ڕۆژانە بۆ مانگی داهاتوو (نموونە — کلیک بکە بۆ گۆڕین).</p>
            <AvailabilityGrid />
          </div>
        )}

        {step === 6 && (
          <ItineraryEditor days={draft.itinerary} onChange={(v) => set("itinerary", v)} />
        )}

        {step === 7 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TagEditor label="ئەوەی لەگەڵدایە" values={draft.included} onChange={(v) => set("included", v)} placeholder="گواستنەوە" />
            <TagEditor label="ئەوەی لەگەڵ نییە" values={draft.excluded} onChange={(v) => set("excluded", v)} placeholder="خەرجی کەسی" />
          </div>
        )}

        {step === 8 && (
          <div className="flex flex-col gap-4">
            <Input label="ناونیشانی خاڵی کۆبوونەوە" value={draft.meetingPoint} onChange={(e) => set("meetingPoint", e.target.value)} />
            <Textarea label="ڕێنمایی کۆبوونەوە" value={draft.meetingInstructions} onChange={(e) => set("meetingInstructions", e.target.value)} />
            <div className="flex h-40 items-center justify-center rounded-(--radius-md) bg-(--color-surface-elevated) text-(--color-text-muted)">
              <MapPinIcon className="me-2 size-5" /> شوێنی نەخشە لێرە دەردەکەوێت
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TagEditor label="مەرجەکان (تەمەن، تەندروستی، بەڵگەنامە)" values={draft.requirements} onChange={(v) => set("requirements", v)} />
            <TagEditor label="چی پێویستە بهێنرێت" values={draft.whatToBring} onChange={(v) => set("whatToBring", v)} />
          </div>
        )}

        {step === 10 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="هەڵوەشاندنەوەی بێ بەرامبەر (ڕۆژ پێش گەشت)"
              type="number"
              value={draft.freeUntilDays}
              onChange={(e) => set("freeUntilDays", Number(e.target.value))}
            />
            <Input
              label="ڕێژەی سزا لەدوای ئەو ماوەیە (%)"
              type="number"
              value={draft.feePercentAfter}
              onChange={(e) => set("feePercentAfter", Number(e.target.value))}
            />
            <p className="text-sm text-(--color-text-secondary) sm:col-span-2">
              گەشتیار دەتوانێت تا {draft.freeUntilDays} ڕۆژ پێش گەشت بەبێ سزا هەڵیبوەشێنێتەوە، دوای ئەو ماوەیە %{draft.feePercentAfter}ی نرخەکە وەک سزا دەبڕدرێت.
            </p>
          </div>
        )}

        {step === 11 && <PreviewStep draft={draft} destinationName={destination?.name ?? ""} />}

        {step === 12 && (
          <div className="flex flex-col items-center gap-3 rounded-(--radius-lg) bg-(--color-surface-elevated) p-8 text-center">
            <Badge tone="primary">ئامادەیە بۆ ناردن</Badge>
            <h2 className="text-lg font-bold text-(--color-text-primary)">{draft.title || "گەشتی نوێ"}</h2>
            <p className="max-w-md text-sm text-(--color-text-secondary)">
              دوای ناردن، تیمی زاگرۆس گەشتەکەت پێداچوونەوەی بۆ دەکات و لە ماوەی ١-٢ ڕۆژدا وەڵامت دەداتەوە.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-(--color-border) pt-6">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={prev}>
              پێشوو
            </Button>
          ) : (
            <span />
          )}
          {step === STEPS.length - 1 ? (
            <Button type="button" onClick={submit}>
              ناردن بۆ پێداچوونەوە
            </Button>
          ) : (
            <Button type="button" onClick={next}>
              دواتر
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadBox({ compact }: { compact?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 rounded-(--radius-md) border-2 border-dashed border-(--color-border) bg-(--color-surface-elevated) text-center ${compact ? "aspect-square" : "py-10"}`}>
      <GlobeIcon className="size-5 text-(--color-text-muted)" />
      {!compact && <p className="text-xs text-(--color-text-muted)">وێنە ڕابکێشە یان کلیک بکە</p>}
    </div>
  );
}

function TagEditor({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draftValue, setDraftValue] = useState("");
  function add() {
    if (!draftValue.trim()) return;
    onChange([...values, draftValue.trim()]);
    setDraftValue("");
  }
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-(--color-text-primary)">{label}</p>
      <div className="mb-2 flex gap-2">
        <Input
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" onClick={add} className={buttonClassName("outline", "md")}>
          <PlusIcon className="size-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((v, i) => (
          <Chip key={i} onClick={() => onChange(values.filter((_, j) => j !== i))}>
            {v} ✕
          </Chip>
        ))}
      </div>
    </div>
  );
}

function AvailabilityGrid() {
  const [blocked, setBlocked] = useState<Set<number>>(new Set([5, 6, 12, 20]));
  const [soldOut, setSoldOut] = useState<Set<number>>(new Set([15]));
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  function toggle(day: number) {
    setBlocked((prev) => {
      const next = new Set(prev);
      if (soldOut.has(day)) return prev;
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }
  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isBlocked = blocked.has(day);
          const isSoldOut = soldOut.has(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggle(day)}
              className={`num flex aspect-square items-center justify-center rounded-(--radius-sm) text-sm font-semibold transition-colors ${
                isSoldOut
                  ? "bg-(--color-error-bg) text-(--color-error)"
                  : isBlocked
                    ? "bg-(--color-surface-elevated) text-(--color-text-muted) line-through"
                    : "bg-(--color-success-bg) text-(--color-success)"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-(--color-text-secondary)">
        <Legend swatch="bg-(--color-success-bg)" label="بەردەست" />
        <Legend swatch="bg-(--color-surface-elevated)" label="بلۆککراو" />
        <Legend swatch="bg-(--color-error-bg)" label="تەواو فرۆشراو" />
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-3 rounded-(--radius-xs) ${swatch}`} />
      {label}
    </span>
  );
}

function ItineraryEditor({ days, onChange }: { days: ItineraryDay[]; onChange: (v: ItineraryDay[]) => void }) {
  function updateDay(i: number, patch: Partial<ItineraryDay>) {
    onChange(days.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  }
  function addDay() {
    onChange([...days, { day: days.length + 1, title: "", location: "", activities: [], meals: [], transportation: "" }]);
  }
  function removeDay(i: number) {
    onChange(days.filter((_, j) => j !== i).map((d, j) => ({ ...d, day: j + 1 })));
  }
  return (
    <div className="flex flex-col gap-4">
      {days.map((d, i) => (
        <div key={i} className="rounded-(--radius-md) border border-(--color-border) p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-bold text-(--color-text-primary)">ڕۆژی {d.day}</p>
            {days.length > 1 && (
              <button type="button" onClick={() => removeDay(i)} className="text-xs font-semibold text-(--color-error)">
                سڕینەوەی ڕۆژ
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Input label="ناونیشانی ڕۆژ" value={d.title} onChange={(e) => updateDay(i, { title: e.target.value })} />
            <Input label="شوێن" value={d.location} onChange={(e) => updateDay(i, { location: e.target.value })} />
            <Input
              label="چالاکییەکان (بە کۆما جیاکراوەتەوە)"
              value={d.activities.join("، ")}
              onChange={(e) => updateDay(i, { activities: e.target.value.split("،").map((s) => s.trim()).filter(Boolean) })}
            />
            <Input
              label="ژەمەکان (بە کۆما جیاکراوەتەوە)"
              value={d.meals.join("، ")}
              onChange={(e) => updateDay(i, { meals: e.target.value.split("،").map((s) => s.trim()).filter(Boolean) })}
            />
            <Input label="گواستنەوە" value={d.transportation} onChange={(e) => updateDay(i, { transportation: e.target.value })} />
          </div>
        </div>
      ))}
      <button type="button" onClick={addDay} className={buttonClassName("outline", "md", { className: "self-start gap-2" })}>
        <PlusIcon className="size-4" /> زیادکردنی ڕۆژ
      </button>
    </div>
  );
}

function PreviewStep({ draft, destinationName }: { draft: Draft; destinationName: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-(--radius-lg) bg-(--color-surface-elevated)">
        <div className="flex h-48 items-center justify-center bg-(--color-primary-50) text-(--color-text-muted)">
          <span className="text-sm">وێنەی سەرەکی</span>
        </div>
        <div className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-(--color-text-primary)">{draft.title || "ناونیشانی گەشت"}</h2>
            <Rating value={4.8} size="sm" />
          </div>
          <p className="text-sm text-(--color-text-secondary)">{destinationName} · {draft.duration} ڕۆژ · {DIFFICULTY_LABELS[draft.difficulty]}</p>
          <p className="text-sm text-(--color-text-secondary)">{draft.description || "وەسفی گەشت لێرە دەردەکەوێت."}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-(--color-text-muted)">
            <UsersIcon className="size-4" /> {draft.minTravelers}–{draft.maxTravelers} کەس
          </div>
          <span className="num text-lg font-extrabold text-(--color-primary-dark)">{formatFromPrice(draft.priceIqd)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 font-bold text-(--color-text-primary)">پلانی گەشت</h3>
          <ul className="flex flex-col gap-2 text-sm text-(--color-text-secondary)">
            {draft.itinerary.map((d) => (
              <li key={d.day}>
                <span className="font-semibold text-(--color-text-primary)">ڕۆژی {d.day}:</span> {d.title || "—"}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-bold text-(--color-text-primary)">لەگەڵ / بەبێ</h3>
          <p className="text-sm text-(--color-text-secondary)">لەگەڵ: {draft.included.join("، ") || "—"}</p>
          <p className="mt-1 text-sm text-(--color-text-secondary)">بەبێ: {draft.excluded.join("، ") || "—"}</p>
        </div>
      </div>
    </div>
  );
}
