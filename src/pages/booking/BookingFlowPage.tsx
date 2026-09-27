import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Stepper } from "@/components/ui/Stepper";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Input, Radio, Select, Switch, Textarea } from "@/components/ui/Input";
import { Badge, Chip } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { CalendarIcon, CheckCircleIcon, UsersIcon, XCircleIcon } from "@/components/icons";
import { getAgencyById, getDestinationById, getTripBySlug } from "@/data/mock";
import { computeTravelerPrice } from "@/lib/pricing";
import { formatCurrency, formatDuration } from "@/lib/format";
import { useAppState } from "@/state/AppState";
import { cn } from "@/lib/utils";
import type { Traveler } from "@/types";

const STEP_LABELS = ["بەروار", "گەشتیاران", "هەڵبژاردنەکان", "زانیاری گەشتیار", "پارەدان", "پێداچوونەوە"];

interface ExtraOption {
  id: string;
  label: string;
  description: string;
  priceIqd: number;
  perTraveler: boolean;
}

const EXTRAS: ExtraOption[] = [
  {
    id: "private-transport",
    label: "گواستنەوەی VIP",
    description: "ون تایبەت بۆ گروپەکەت، بەبێ هاوبەشکردن لەگەڵ گەشتیارانی تر",
    priceIqd: 50000,
    perTraveler: false,
  },
  {
    id: "pro-photos",
    label: "وێنەگری پیشەیی",
    description: "وێنەگرێکی پیشەیی لە درێژایی گەشتەکەدا لەگەڵتان دەبێت، وێنە دیجیتاڵییەکان دوای گەشت پێتان دەگات",
    priceIqd: 35000,
    perTraveler: false,
  },
  {
    id: "vip-meal",
    label: "بەرنامەی خواردنی تایبەت",
    description: "خۆراکی زیادە و تایبەت بۆ هەر گەشتیارێک لە کاتی نانی نیوەڕۆدا",
    priceIqd: 15000,
    perTraveler: true,
  },
];

const DATE_OPTIONS = [
  { id: "d0", label: "نزیکترین بەروار", note: "پێشنیارکراو" },
  { id: "d1", label: "١ هەفتە دواتر", note: undefined },
  { id: "d2", label: "٢ هەفتە دواتر", note: undefined },
  { id: "d3", label: "٣ هەفتە دواتر", note: undefined },
];

interface LeadFormState {
  fullName: string;
  phone: string;
  email: string;
  nationality: string;
  emergencyContact: string;
  specialRequirements: string;
}

export default function BookingFlowPage() {
  const { tripSlug } = useParams<{ tripSlug: string }>();
  const navigate = useNavigate();
  const { currency } = useAppState();
  const { push } = useToast();
  const trip = tripSlug ? getTripBySlug(tripSlug) : undefined;

  const [step, setStep] = useState(0);

  // Step 1: date
  const [dateId, setDateId] = useState(DATE_OPTIONS[0].id);

  // Step 2: travelers
  const [travelers, setTravelers] = useState(trip?.minTravelers ?? 1);
  const [children, setChildren] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);

  // Step 3: extras
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());

  // Step 4: traveler info
  const [lead, setLead] = useState<LeadFormState>({
    fullName: "",
    phone: "",
    email: "",
    nationality: "",
    emergencyContact: "",
    specialRequirements: "",
  });
  const [otherNames, setOtherNames] = useState<string[]>([]);

  // Step 5: payment
  const [payMethod, setPayMethod] = useState<"card" | "local">("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [simulateFailure, setSimulateFailure] = useState(false);

  if (!tripSlug || !trip) {
    return (
      <div className="mx-auto max-w-(--breakpoint-md) px-4 py-24">
        <ErrorState
          title="ئەم گەشتە نەدۆزرایەوە"
          description="ئەم بەستەرە هەڵەیە یان گەشتەکە نەماوە."
          action={
            <Link to="/explore" className={buttonClassName("primary", "md")}>
              گەڕان بۆ گەشتەکان
            </Link>
          }
        />
      </div>
    );
  }

  const agency = getAgencyById(trip.agencyId);
  const destination = getDestinationById(trip.destinationId);
  const maxTravelers = trip.maxTravelers;
  const minTravelers = trip.minTravelers;

  function updateOtherNamesForCount(count: number) {
    setOtherNames((prev) => {
      const needed = Math.max(count - 1, 0);
      const next = prev.slice(0, needed);
      while (next.length < needed) next.push("");
      return next;
    });
  }

  function setTravelerCount(next: number) {
    const clamped = Math.min(Math.max(next, minTravelers), maxTravelers);
    setTravelers(clamped);
    if (children > clamped) setChildren(clamped);
    updateOtherNamesForCount(clamped);
  }

  const extrasTotal = useMemo(() => {
    let total = 0;
    for (const extra of EXTRAS) {
      if (!selectedExtras.has(extra.id)) continue;
      total += extra.perTraveler ? extra.priceIqd * travelers : extra.priceIqd;
    }
    return total;
  }, [selectedExtras, travelers]);

  const baseSubtotal = useMemo(() => {
    if (isPrivate && trip.privatePriceIqd) return trip.privatePriceIqd;
    const adults = travelers - children;
    const childUnit = trip.childPriceIqd ?? trip.priceIqd;
    return adults * trip.priceIqd + children * childUnit;
  }, [isPrivate, trip, travelers, children]);

  const subtotalWithExtras = baseSubtotal + extrasTotal;

  const priceBreakdown = useMemo(
    () => computeTravelerPrice({ basePriceIqd: subtotalWithExtras, travelers: 1, discountIqd: 0 }),
    [subtotalWithExtras]
  );

  const canGoNext = useMemo(() => {
    if (step === 3) {
      return lead.fullName.trim() && lead.phone.trim() && lead.email.trim() && lead.nationality.trim();
    }
    if (step === 4) {
      return paymentState === "success";
    }
    return true;
  }, [step, lead, paymentState]);

  function goNext() {
    if (step < STEP_LABELS.length - 1) setStep((s) => s + 1);
  }
  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function submitPayment() {
    setPaymentState("processing");
    setTimeout(() => {
      if (simulateFailure) {
        setPaymentState("failed");
        setSimulateFailure(false);
      } else {
        setPaymentState("success");
        push("پارەدان سەرکەوتوو بوو", "success");
      }
    }, 1400);
  }

  function confirmBooking() {
    push("حیجزەکەت تۆمار کرا", "success");
    navigate(`/booking/${tripSlug}/confirmation`);
  }

  const selectedDateLabel = DATE_OPTIONS.find((d) => d.id === dateId)?.label ?? trip.nextAvailableDate;

  return (
    <div className="mx-auto max-w-(--breakpoint-xl) px-4 pb-40 pt-8 sm:px-6 lg:pb-16">
      {/* Trip header */}
      <div className="mb-6 flex items-center gap-4 rounded-(--radius-lg) bg-(--color-surface) p-4 shadow-(--shadow-subtle)">
        <img src={trip.images[0]} alt={trip.title} className="size-16 shrink-0 rounded-(--radius-md) object-cover" />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-(--color-text-primary)">{trip.title}</h1>
          <p className="text-sm text-(--color-text-secondary)">
            {destination?.name} · {formatDuration(trip.duration)} · {agency?.name}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8 overflow-x-auto rounded-(--radius-lg) bg-(--color-surface) p-4 shadow-(--shadow-subtle) sm:p-5">
        <Stepper steps={STEP_LABELS} current={step} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Step content */}
        <div className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle) sm:p-7">
          {step === 0 && (
            <StepDate dateId={dateId} setDateId={setDateId} trip={trip} />
          )}
          {step === 1 && (
            <StepTravelers
              trip={trip}
              travelers={travelers}
              children={children}
              setChildren={setChildren}
              setTravelerCount={setTravelerCount}
              isPrivate={isPrivate}
              setIsPrivate={setIsPrivate}
            />
          )}
          {step === 2 && <StepExtras selectedExtras={selectedExtras} setSelectedExtras={setSelectedExtras} travelers={travelers} />}
          {step === 3 && (
            <StepTravelerInfo
              lead={lead}
              setLead={setLead}
              otherNames={otherNames}
              setOtherNames={setOtherNames}
              travelers={travelers}
            />
          )}
          {step === 4 && (
            <StepPayment
              payMethod={payMethod}
              setPayMethod={setPayMethod}
              card={card}
              setCard={setCard}
              paymentState={paymentState}
              submitPayment={submitPayment}
              simulateFailure={simulateFailure}
              setSimulateFailure={setSimulateFailure}
              total={priceBreakdown.totalIqd}
              currency={currency}
            />
          )}
          {step === 5 && (
            <StepReview
              trip={trip}
              agency={agency}
              dateLabel={selectedDateLabel}
              travelers={travelers}
              isPrivate={isPrivate}
              selectedExtras={selectedExtras}
              breakdown={priceBreakdown}
              currency={currency}
              leadName={lead.fullName}
            />
          )}

          {/* Desktop nav buttons */}
          <div className="mt-8 hidden items-center justify-between border-t border-(--color-border) pt-6 lg:flex">
            <Button variant="outline" onClick={goBack} disabled={step === 0}>
              گەڕانەوە
            </Button>
            {step < STEP_LABELS.length - 1 ? (
              <Button onClick={goNext} disabled={!canGoNext}>
                بەردەوامبوون
              </Button>
            ) : (
              <Button onClick={confirmBooking}>حیجز بکە</Button>
            )}
          </div>
        </div>

        {/* Desktop sticky summary */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-4 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-elevated)">
            <h3 className="font-bold text-(--color-text-primary)">پوختەی نرخ</h3>
            <div className="flex items-center gap-3 border-b border-(--color-border) pb-4">
              <img src={trip.images[0]} alt="" className="size-14 rounded-(--radius-md) object-cover" />
              <div>
                <p className="text-sm font-semibold text-(--color-text-primary)">{trip.title}</p>
                <p className="text-xs text-(--color-text-muted)">{selectedDateLabel} · {travelers} کەس</p>
              </div>
            </div>
            <PriceLines breakdown={priceBreakdown} currency={currency} />
          </div>
        </aside>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-(--color-border) bg-(--color-surface)/97 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-(--color-text-muted)">کۆی گشتی</p>
            <p className="num text-lg font-extrabold text-(--color-primary-dark)">
              {formatCurrency(priceBreakdown.totalIqd, currency)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="outline" size="md" onClick={goBack}>
                گەڕانەوە
              </Button>
            )}
            {step < STEP_LABELS.length - 1 ? (
              <Button size="md" onClick={goNext} disabled={!canGoNext}>
                بەردەوام
              </Button>
            ) : (
              <Button size="md" onClick={confirmBooking}>
                حیجز بکە
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceLines({ breakdown, currency }: { breakdown: ReturnType<typeof computeTravelerPrice>; currency: ReturnType<typeof useAppState>["currency"] }) {
  return (
    <div className="flex flex-col gap-2.5 text-sm">
      <Row label="کۆی گەشت" value={formatCurrency(breakdown.subtotalIqd, currency)} />
      {breakdown.discountIqd > 0 && (
        <Row label="داشکاندن" value={`- ${formatCurrency(breakdown.discountIqd, currency)}`} tone="success" />
      )}
      <Row label="کرێی خزمەتگوزاری گەشتیار" value={formatCurrency(breakdown.travelerServiceFeeIqd, currency)} />
      <Row label="کرێی پرۆسەکردنی پارەدان" value={formatCurrency(breakdown.paymentFeeIqd, currency)} />
      <div className="my-1 h-px bg-(--color-border)" />
      <Row label="کۆی گشتی" value={formatCurrency(breakdown.totalIqd, currency)} bold />
    </div>
  );
}

function Row({ label, value, bold, tone }: { label: string; value: string; bold?: boolean; tone?: "success" }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-(--color-text-secondary)", bold && "font-bold text-(--color-text-primary)")}>{label}</span>
      <span
        className={cn(
          "num",
          bold ? "text-base font-extrabold text-(--color-primary-dark)" : "font-semibold text-(--color-text-primary)",
          tone === "success" && "text-(--color-success)"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ---------- Step 1: date ----------
function StepDate({
  dateId,
  setDateId,
  trip,
}: {
  dateId: string;
  setDateId: (id: string) => void;
  trip: NonNullable<ReturnType<typeof getTripBySlug>>;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-(--color-text-primary)">کام بەروار بۆت گونجاوە؟</h2>
      <p className="mb-6 text-sm text-(--color-text-secondary)">بەرواری گەشتەکەت هەڵبژێرە. شوێنی بەردەست بۆ هەر بەروارێک جیاوازە.</p>
      <div className="flex flex-col gap-3">
        {DATE_OPTIONS.map((opt, i) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setDateId(opt.id)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-(--radius-md) border p-4 text-start transition-colors cursor-pointer",
              dateId === opt.id ? "border-(--color-primary) bg-(--color-primary-50)" : "border-(--color-border) hover:border-(--color-primary-light)"
            )}
          >
            <div className="flex items-center gap-3">
              <CalendarIcon className="size-5 shrink-0 text-(--color-primary)" />
              <div>
                <p className="font-semibold text-(--color-text-primary)">
                  {i === 0 ? trip.nextAvailableDate : opt.label}
                </p>
                <p className="text-xs text-(--color-text-muted)">
                  {i === 0
                    ? `تەنها ${trip.spotsRemaining} شوێن ماوە`
                    : `شوێنی بەردەست: ${trip.spotsRemaining + i * 5} کەس`}
                </p>
              </div>
            </div>
            {opt.note && <Badge tone="accent">{opt.note}</Badge>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Step 2: travelers ----------
function StepTravelers({
  trip,
  travelers,
  children,
  setChildren,
  setTravelerCount,
  isPrivate,
  setIsPrivate,
}: {
  trip: NonNullable<ReturnType<typeof getTripBySlug>>;
  travelers: number;
  children: number;
  setChildren: (n: number) => void;
  setTravelerCount: (n: number) => void;
  isPrivate: boolean;
  setIsPrivate: (v: boolean) => void;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-(--color-text-primary)">چەند کەسن؟</h2>
      <p className="mb-6 text-sm text-(--color-text-secondary)">
        ژمارەی گەشتیاران دیاری بکە (لە نێوان {trip.minTravelers} تا {trip.maxTravelers} کەس).
      </p>

      <div className="flex items-center justify-between rounded-(--radius-md) border border-(--color-border) p-4">
        <div className="flex items-center gap-2.5">
          <UsersIcon className="size-5 text-(--color-primary)" />
          <span className="font-semibold text-(--color-text-primary)">ژمارەی گەشتیاران</span>
        </div>
        <Stepper2 value={travelers} onChange={setTravelerCount} min={trip.minTravelers} max={trip.maxTravelers} />
      </div>

      {trip.childPriceIqd !== undefined && (
        <div className="mt-3 flex items-center justify-between rounded-(--radius-md) border border-(--color-border) p-4">
          <div>
            <p className="font-semibold text-(--color-text-primary)">منداڵ (لە ناو کۆی گەشتیارانەوە)</p>
            <p className="text-xs text-(--color-text-muted)">{formatCurrency(trip.childPriceIqd)} بۆ هەر منداڵێک</p>
          </div>
          <Stepper2 value={children} onChange={setChildren} min={0} max={travelers} />
        </div>
      )}

      {trip.privateAvailable && trip.privatePriceIqd !== undefined && (
        <div className="mt-3 flex items-center justify-between rounded-(--radius-md) border border-(--color-border) p-4">
          <div>
            <p className="font-semibold text-(--color-text-primary)">گەشتی تایبەت (نەک گروپی)</p>
            <p className="text-xs text-(--color-text-muted)">
              نرخی نەک لەسەر هەر کەسێک، بەڵکو نرخێکی جیا بۆ گروپەکەت: {formatCurrency(trip.privatePriceIqd)}
            </p>
          </div>
          <Switch checked={isPrivate} onChange={setIsPrivate} />
        </div>
      )}
    </div>
  );
}

function Stepper2({ value, onChange, min, max }: { value: number; onChange: (n: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className="flex size-9 items-center justify-center rounded-full border border-(--color-border) text-(--color-text-primary) disabled:opacity-30 cursor-pointer"
      >
        −
      </button>
      <span className="num w-6 text-center font-bold text-(--color-text-primary)">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="flex size-9 items-center justify-center rounded-full border border-(--color-border) text-(--color-text-primary) disabled:opacity-30 cursor-pointer"
      >
        +
      </button>
    </div>
  );
}

// ---------- Step 3: extras ----------
function StepExtras({
  selectedExtras,
  setSelectedExtras,
  travelers,
}: {
  selectedExtras: Set<string>;
  setSelectedExtras: (s: Set<string>) => void;
  travelers: number;
}) {
  function toggle(id: string) {
    const next = new Set(selectedExtras);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedExtras(next);
  }
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-(--color-text-primary)">هەڵبژاردنی زیادە</h2>
      <p className="mb-6 text-sm text-(--color-text-secondary)">ئەم هەڵبژاردنانە ئیختیارین و دەکرێت لاببرێن.</p>
      <div className="flex flex-col gap-3">
        {EXTRAS.map((extra) => {
          const active = selectedExtras.has(extra.id);
          return (
            <button
              key={extra.id}
              type="button"
              onClick={() => toggle(extra.id)}
              className={cn(
                "flex items-start justify-between gap-4 rounded-(--radius-md) border p-4 text-start transition-colors cursor-pointer",
                active ? "border-(--color-primary) bg-(--color-primary-50)" : "border-(--color-border) hover:border-(--color-primary-light)"
              )}
            >
              <div>
                <p className="font-semibold text-(--color-text-primary)">{extra.label}</p>
                <p className="mt-1 text-sm text-(--color-text-secondary)">{extra.description}</p>
              </div>
              <div className="shrink-0 text-end">
                <p className="num font-bold text-(--color-primary-dark)">
                  {formatCurrency(extra.perTraveler ? extra.priceIqd * travelers : extra.priceIqd)}
                </p>
                <span
                  className={cn(
                    "mt-2 inline-flex size-5 items-center justify-center rounded-(--radius-xs) border",
                    active ? "border-(--color-primary) bg-(--color-primary) text-white" : "border-(--color-border)"
                  )}
                >
                  {active && (
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4 10 4 4 8-8" />
                    </svg>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Step 4: traveler info ----------
function StepTravelerInfo({
  lead,
  setLead,
  otherNames,
  setOtherNames,
  travelers,
}: {
  lead: LeadFormState;
  setLead: (v: LeadFormState) => void;
  otherNames: string[];
  setOtherNames: (v: string[]) => void;
  travelers: number;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-(--color-text-primary)">زانیاری گەشتیار</h2>
      <p className="mb-6 text-sm text-(--color-text-secondary)">
        زانیاری سەرەکی گەشتیاری پێشەنگ پێویستە. ئەم زانیارییانە بۆ پاراستنی سەلامەتیت بەکاردێن.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="ناوی تەواو"
          required
          value={lead.fullName}
          onChange={(e) => setLead({ ...lead, fullName: e.target.value })}
          placeholder="بۆ نموونە: ئاراس عەبدوڵا"
        />
        <Input
          label="ژمارەی مۆبایل"
          required
          value={lead.phone}
          onChange={(e) => setLead({ ...lead, phone: e.target.value })}
          placeholder="+964 7XX XXX XXXX"
        />
        <Input
          label="ئیمەیل"
          type="email"
          required
          value={lead.email}
          onChange={(e) => setLead({ ...lead, email: e.target.value })}
          placeholder="name@example.com"
        />
        <Input
          label="نەتەوە"
          required
          value={lead.nationality}
          onChange={(e) => setLead({ ...lead, nationality: e.target.value })}
          placeholder="کوردستان - عێراق"
        />
        <Input
          label="پەیوەندیی کاتی فریاگوزاری"
          optional
          value={lead.emergencyContact}
          onChange={(e) => setLead({ ...lead, emergencyContact: e.target.value })}
          placeholder="ناو و ژمارەی مۆبایل"
        />
      </div>
      <div className="mt-4">
        <Textarea
          label="داواکاری تایبەت"
          optional
          value={lead.specialRequirements}
          onChange={(e) => setLead({ ...lead, specialRequirements: e.target.value })}
          placeholder="بۆ نموونە: خۆراکی تایبەت، کۆتوپڕی جووڵە..."
        />
      </div>

      {travelers > 1 && (
        <div className="mt-8 border-t border-(--color-border) pt-6">
          <h3 className="mb-3 font-bold text-(--color-text-primary)">ناوی گەشتیارانی تر</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {otherNames.map((name, i) => (
              <Input
                key={i}
                label={`گەشتیاری ${i + 2}`}
                optional
                value={name}
                onChange={(e) => {
                  const next = [...otherNames];
                  next[i] = e.target.value;
                  setOtherNames(next);
                }}
                placeholder="ناوی تەواو"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Step 5: payment ----------
function StepPayment({
  payMethod,
  setPayMethod,
  card,
  setCard,
  paymentState,
  submitPayment,
  simulateFailure,
  setSimulateFailure,
  total,
  currency,
}: {
  payMethod: "card" | "local";
  setPayMethod: (v: "card" | "local") => void;
  card: { number: string; expiry: string; cvv: string; name: string };
  setCard: (v: { number: string; expiry: string; cvv: string; name: string }) => void;
  paymentState: "idle" | "processing" | "success" | "failed";
  submitPayment: () => void;
  simulateFailure: boolean;
  setSimulateFailure: (v: boolean) => void;
  total: number;
  currency: ReturnType<typeof useAppState>["currency"];
}) {
  if (paymentState === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-(--color-success-bg) text-(--color-success)">
          <CheckCircleIcon className="size-9" />
        </div>
        <h2 className="text-xl font-bold text-(--color-text-primary)">پارەدان سەرکەوتوو بوو</h2>
        <p className="text-sm text-(--color-text-secondary)">{formatCurrency(total, currency)} بە سەرکەوتوویی پارە درا. دەتوانیت بچیتە پێداچوونەوەی کۆتایی.</p>
      </div>
    );
  }

  if (paymentState === "failed") {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-(--color-error-bg) text-(--color-error)">
          <XCircleIcon className="size-9" />
        </div>
        <h2 className="text-xl font-bold text-(--color-text-primary)">کارتەکە ڕەتکرایەوە</h2>
        <p className="max-w-sm text-sm text-(--color-text-secondary)">
          پارەدانەکە سەرکەوتوو نەبوو. تکایە زانیاری کارتەکەت پشکنینەوە بکە یان شێوازێکی تر هەڵبژێرە.
        </p>
        <Button onClick={submitPayment}>دووبارە هەوڵبدەوە</Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-(--color-text-primary)">پارەدان</h2>
      <p className="mb-6 text-sm text-(--color-text-secondary)">پارەدانی سەلامەت — هیچ زانیاری کارتت پاشەکەوت ناکرێت لەم پرۆتۆتایپەدا.</p>

      <div className="mb-5 flex flex-col gap-2.5">
        <Radio name="paymethod" label="پارەدان بە کارتی بانکی" checked={payMethod === "card"} onChange={() => setPayMethod("card")} />
        <Radio name="paymethod" label="شێوازی پارەدانی ناوخۆیی (زاینکاش)" checked={payMethod === "local"} onChange={() => setPayMethod("local")} />
      </div>

      {payMethod === "card" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="ژمارەی کارت"
              required
              value={card.number}
              onChange={(e) => setCard({ ...card, number: e.target.value })}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
            />
          </div>
          <Input
            label="بەرواری بەسەرچوون"
            required
            value={card.expiry}
            onChange={(e) => setCard({ ...card, expiry: e.target.value })}
            placeholder="MM/YY"
          />
          <Input
            label="CVV"
            required
            value={card.cvv}
            onChange={(e) => setCard({ ...card, cvv: e.target.value })}
            placeholder="***"
            inputMode="numeric"
          />
          <div className="sm:col-span-2">
            <Input
              label="ناوی خاوەنی کارت"
              required
              value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value })}
              placeholder="وەک لەسەر کارتەکە نووسراوە"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-(--radius-md) bg-(--color-info-bg) p-4 text-sm text-(--color-info)">
          پاش پشتڕاستکردنەوە، بەستەرێکی پارەدان بۆ ژمارەی مۆبایلەکەت دەنێردرێت بۆ تەواوکردنی پارەدان لە ڕێگەی زاینکاش.
        </div>
      )}

      <div className="mt-6 flex items-center justify-between rounded-(--radius-md) border border-dashed border-(--color-border) p-3">
        <span className="text-xs text-(--color-text-muted)">تاقیکردنەوە: دیمەنی سەرکەوتوونەبوونی پارەدان پیشان بدە</span>
        <Switch checked={simulateFailure} onChange={setSimulateFailure} />
      </div>

      <div className="mt-6">
        <Button fullWidth loading={paymentState === "processing"} onClick={submitPayment}>
          {paymentState === "processing" ? "لە پرۆسەی پارەداندایە..." : `پارە بدە — ${formatCurrency(total, currency)}`}
        </Button>
      </div>
    </div>
  );
}

// ---------- Step 6: review ----------
function StepReview({
  trip,
  agency,
  dateLabel,
  travelers,
  isPrivate,
  selectedExtras,
  breakdown,
  currency,
  leadName,
}: {
  trip: NonNullable<ReturnType<typeof getTripBySlug>>;
  agency: ReturnType<typeof getAgencyById>;
  dateLabel: string;
  travelers: number;
  isPrivate: boolean;
  selectedExtras: Set<string>;
  breakdown: ReturnType<typeof computeTravelerPrice>;
  currency: ReturnType<typeof useAppState>["currency"];
  leadName: string;
}) {
  const extras = EXTRAS.filter((e) => selectedExtras.has(e.id));
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-(--color-text-primary)">پێداچوونەوەی کۆتایی</h2>
      <p className="mb-6 text-sm text-(--color-text-secondary)">پێش پشتڕاستکردنەوە، هەموو وردەکارییەکان پشکنینەوە بکە.</p>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ReviewFact label="گەشت" value={trip.title} />
        <ReviewFact label="ئەژانس" value={agency?.name ?? "—"} />
        <ReviewFact label="بەروار" value={dateLabel} />
        <ReviewFact label="گەشتیار" value={`${travelers} کەس${isPrivate ? " (گەشتی تایبەت)" : ""}`} />
        <ReviewFact label="ناوی پێشەنگ" value={leadName || "—"} />
        <ReviewFact label="خاڵی کۆبوونەوە" value={trip.meetingPoint} />
      </div>

      {extras.length > 0 && (
        <div className="mb-5 rounded-(--radius-md) bg-(--color-surface-elevated) p-4">
          <p className="mb-2 text-sm font-bold text-(--color-text-primary)">زیادکراوەکان</p>
          <ul className="flex flex-col gap-1 text-sm text-(--color-text-secondary)">
            {extras.map((e) => (
              <li key={e.id}>• {e.label}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-(--radius-md) border border-(--color-border) p-4">
        <p className="mb-3 text-sm font-bold text-(--color-text-primary)">وردەکاری نرخ</p>
        <PriceLines breakdown={breakdown} currency={currency} />
      </div>

      <p className="mt-4 text-xs text-(--color-text-muted)">
        بە دوگمەی «حیجز بکە» پشتڕاست دەکەیت کە مەرجەکانی <a href="/legal/terms" className="underline">خزمەتگوزاری</a> و{" "}
        <a href="/legal/cancellation" className="underline">یاسای هەڵوەشاندنەوە</a>ت خوێندووەتەوە و ڕازیت.
      </p>
    </div>
  );
}

function ReviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-(--radius-md) bg-(--color-surface-elevated) p-3">
      <p className="text-xs text-(--color-text-muted)">{label}</p>
      <p className="font-semibold text-(--color-text-primary)">{value}</p>
    </div>
  );
}
