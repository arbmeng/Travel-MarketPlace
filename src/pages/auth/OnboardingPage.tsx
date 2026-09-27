import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Badge";
import { Stepper } from "@/components/ui/Stepper";
import { CheckCircleIcon } from "@/components/icons";
import { TRIP_CATEGORY_LABELS, type TripCategory } from "@/types";

const CATEGORIES = Object.keys(TRIP_CATEGORY_LABELS) as TripCategory[];

const BUDGETS = [
  { id: "budget", label: "خۆگونجاو", hint: "تا ١٥٠,٠٠٠ د.ع بۆ هەر کەسێک" },
  { id: "mid", label: "مامناوەند", hint: "١٥٠,٠٠٠ — ٤٠٠,٠٠٠ د.ع" },
  { id: "premium", label: "لوکس", hint: "زیاتر لە ٤٠٠,٠٠٠ د.ع" },
];

const FREQUENCIES = [
  { id: "rare", label: "١ - ٢ جار لە ساڵێکدا" },
  { id: "occasional", label: "٣ - ٥ جار لە ساڵێکدا" },
  { id: "frequent", label: "زیاتر لە ٥ جار لە ساڵێکدا" },
];

const STYLES = [
  { id: "group", label: "گەشتی گروپی" },
  { id: "private", label: "گەشتی تایبەت بە خۆم/خێزانەکەم" },
  { id: "solo", label: "گەشتی تاک" },
];

const STEP_LABELS = ["جۆری گەشت", "بودجە", "کاتی گەشت", "شێواز", "ئامادەیت"];

const STEP_TITLES = [
  "چ جۆرە گەشتێکت خۆشدەوێت؟",
  "بودجەی گەشتت چەندە؟",
  "چەند جار لە ساڵێکدا گەشت دەکەیت؟",
  "شێوازی گەشتکردنت چۆنە؟",
  "ئێستا ئامادەیت بۆ گەشت",
];

const STEP_SUBTITLES = [
  "دەتوانیت چەند جۆرێک هەڵبژێریت — ئەمە یارمەتیمان دەدات باشترین گەشتەکانمان پێشنیار بکەین.",
  "ئەمە یارمەتیمان دەدات گەشتی گونجاوتر لەگەڵ بودجەکەت پێشنیار بکەین.",
  "بۆ ئاشناکردنت بە پێشنیاری گونجاو بۆ کاتی گەشتکردنت.",
  "هەڵبژاردنی شێوازی گەشت یارمەتیمان دەدات گەشتی گونجاوتر پیشانت بدەین.",
  "پێشنیارەکانمان لەسەر بنەمای پرۆفایلی تایبەت بە خۆت ڕێکخراون.",
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<Set<TripCategory>>(new Set());
  const [budget, setBudget] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);

  function toggleCategory(c: TripCategory) {
    const next = new Set(categories);
    if (next.has(c)) next.delete(c);
    else next.add(c);
    setCategories(next);
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <AuthLayout title={STEP_TITLES[step]} subtitle={STEP_SUBTITLES[step]}>
      <div className="mb-6">
        <Stepper steps={STEP_LABELS} current={step} />
      </div>

      {step === 0 && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c} selected={categories.has(c)} onClick={() => toggleCategory(c)}>
              {TRIP_CATEGORY_LABELS[c]}
            </Chip>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-3">
          {BUDGETS.map((b) => (
            <OptionCard key={b.id} selected={budget === b.id} label={b.label} hint={b.hint} onClick={() => setBudget(b.id)} />
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3">
          {FREQUENCIES.map((f) => (
            <OptionCard key={f.id} selected={frequency === f.id} label={f.label} onClick={() => setFrequency(f.id)} />
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-3">
          {STYLES.map((s) => (
            <OptionCard key={s.id} selected={style === s.id} label={s.label} onClick={() => setStyle(s.id)} />
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-(--color-success-bg) text-(--color-success)">
            <CheckCircleIcon className="size-9" />
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && step < STEP_LABELS.length - 1 && (
          <Button variant="outline" onClick={goBack}>
            گەڕانەوە
          </Button>
        )}
        {step < STEP_LABELS.length - 1 ? (
          <Button fullWidth onClick={goNext}>
            بەردەوامبوون
          </Button>
        ) : (
          <Button fullWidth onClick={() => navigate("/")}>
            دەستپێکردنی گەشت
          </Button>
        )}
      </div>
    </AuthLayout>
  );
}

function OptionCard({ selected, label, hint, onClick }: { selected: boolean; label: string; hint?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-(--radius-md) border p-4 text-start transition-colors cursor-pointer ${
        selected ? "border-(--color-primary) bg-(--color-primary-50)" : "border-(--color-border) hover:border-(--color-primary-light)"
      }`}
    >
      <div>
        <p className="font-semibold text-(--color-text-primary)">{label}</p>
        {hint && <p className="text-xs text-(--color-text-muted)">{hint}</p>}
      </div>
      <span
        className={`flex size-5 items-center justify-center rounded-full border ${
          selected ? "border-(--color-primary) bg-(--color-primary)" : "border-(--color-border)"
        }`}
      >
        {selected && <span className="size-2 rounded-full bg-white" />}
      </span>
    </button>
  );
}
