import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Stepper } from "@/components/ui/Stepper";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/Input";
import { Badge, Chip } from "@/components/ui/Badge";
import { CheckCircleIcon, ClockIcon, GlobeIcon, TicketIcon } from "@/components/icons";
import { GOVERNORATES } from "@/data/mock";
import { useToast } from "@/components/ui/Toast";
import type { VerificationStatus } from "@/types";

const STEPS = [
  "هەژمار",
  "زانیاری بازرگانی",
  "پشتڕاستکردنەوە",
  "زانیاری بانکی",
  "پڕۆفایل",
  "یەکەم گەشت",
  "ناردن",
];

const LANGUAGE_OPTIONS = ["کوردی", "عەرەبی", "ئینگلیزی", "فارسی", "تورکی"];

const VERIFICATION_STEPS: { status: VerificationStatus; label: string; body: string }[] = [
  { status: "pending", label: "چاوەڕوان", body: "داواکارییەکەت وەرگیرا و لە ڕیزی پێداچوونەوەدایە." },
  { status: "under_review", label: "لە پێداچوونەوەدایە", body: "تیمی Zerrin.Travel بەڵگەنامەکانت پێداچوونەوەیان بۆ دەکات." },
  { status: "verified", label: "پشتڕاستکراوە", body: "پیرۆزە! ئێستا دەتوانیت گەشتەکانت بڵاو بکەیتەوە." },
  { status: "needs_changes", label: "پێویستی بە گۆڕانکارییە", body: "هەندێک زانیاری پێویستە ڕاست بکرێتەوە، سەیری ئیمەیلەکەت بکە." },
  { status: "rejected", label: "ڕەتکراوەتەوە", body: "داواکارییەکەت لەم قۆناغەدا پەسەند نەکراوە. دەتوانیت پەیوەندیمان پێوە بکەیت." },
];

export default function AgencyOnboardingPage() {
  const [step, setStep] = useState(0);
  const [languages, setLanguages] = useState<string[]>(["کوردی"]);
  const navigate = useNavigate();
  const { push } = useToast();

  function next() {
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function prev() {
    setStep((s) => Math.max(0, s - 1));
  }
  function finish() {
    push("داواکارییەکەت نێردرا بۆ پێداچوونەوە");
    navigate("/agency/dashboard");
  }

  return (
    <AuthLayout title="خۆتۆمارکردنی ئەژانس" subtitle="چەند هەنگاوی سادە بۆ دەستپێکردنی گەشتت لەسەر Zerrin.Travel.">
      <div className="mb-8 -mx-2">
        <Stepper steps={STEPS} current={step} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          step === STEPS.length - 1 ? finish() : next();
        }}
        className="flex flex-col gap-5"
      >
        {step === 0 && (
          <>
            <h2 className="text-lg font-bold text-(--color-text-primary)">دروستکردنی هەژمار</h2>
            <Input label="ناوی تەواو" placeholder="کاوە ئیبراهیم" required />
            <Input label="ئیمەیل" type="email" placeholder="info@agency.example" required />
            <Input label="ژمارەی مۆبایل" type="tel" placeholder="+964 750 000 0000" required />
            <Input label="وشەی نهێنی" type="password" required />
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-lg font-bold text-(--color-text-primary)">زانیاری بازرگانی</h2>
            <Input label="ناوی ئەژانس" placeholder="گەشتیارانی زاگرۆس" required />
            <Input label="ژمارەی مۆبایلی گشتی" type="tel" required />
            <Input label="ئیمەیلی گشتی" type="email" required />
            <Select label="پارێزگا" required defaultValue="">
              <option value="" disabled>
                پارێزگا هەڵبژێرە
              </option>
              {GOVERNORATES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Select>
            <Input label="ماڵپەڕ" optional placeholder="https://" />
            <Input label="لینکی سۆشیال میدیا" optional placeholder="@agency" />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-bold text-(--color-text-primary)">پشتڕاستکردنەوەی بازرگانی</h2>
            <p className="text-sm text-(--color-text-secondary)">بەڵگەنامەکان بار بکە بۆ پشتڕاستکردنەوەی ئەژانسەکەت.</p>
            <Dropzone label="بەڵگەی تۆمارکردنی بازرگانی" />
            <Dropzone label="کارتی نیشاندانی خاوەن" />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-bold text-(--color-text-primary)">زانیاری بانکی</h2>
            <Input label="ناوی بانک" placeholder="بانکی کوردستان" required />
            <Input label="ناوی خاوەنی حساب" required />
            <Input label="IBAN / ژمارەی حساب" required />
            <Select label="خشتەی پارەدان" defaultValue="biweekly">
              <option value="weekly">هەفتانە</option>
              <option value="biweekly">هەردوو هەفتەیەکجار</option>
              <option value="monthly">مانگانە</option>
            </Select>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-lg font-bold text-(--color-text-primary)">پڕۆفایلی ئەژانس</h2>
            <Dropzone label="لۆگۆی ئەژانس" />
            <Dropzone label="وێنەی سەرەوە (کەڤەر)" />
            <Textarea label="وەسفی ئەژانس" placeholder="کورتەیەک لەسەر ئەژانسەکەت بنووسە..." required />
            <div>
              <p className="mb-1.5 text-sm font-semibold text-(--color-text-primary)">زمانەکان</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((l) => (
                  <Chip
                    key={l}
                    selected={languages.includes(l)}
                    onClick={() => setLanguages((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]))}
                  >
                    {l}
                  </Chip>
                ))}
              </div>
            </div>
            <Input label="ساڵانی ئەزموون" type="number" min={0} placeholder="٥" />
          </>
        )}

        {step === 5 && (
          <div className="flex flex-col items-center gap-4 rounded-(--radius-lg) bg-(--color-surface-elevated) p-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-(--color-primary-50) text-(--color-primary)">
              <TicketIcon className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-(--color-text-primary)">یەکەم گەشتت دروست بکە</h2>
            <p className="text-sm text-(--color-text-secondary)">
              دەتوانیت لە ئێستادا دەست بکەیت یان دواتر لە داشبۆردی ئەژانس، لە بەشی «گەشتەکان»، یەکەم گەشتت زیاد بکەیت.
            </p>
            <Checkbox label="ئێستا دەستپێبکەم — دواتر لە داشبۆرد گەشتم زیاد دەکەم" defaultChecked />
          </div>
        )}

        {step === 6 && (
          <>
            <h2 className="text-lg font-bold text-(--color-text-primary)">ناردن بۆ پێداچوونەوە</h2>
            <p className="text-sm text-(--color-text-secondary)">دوای ناردن، داواکارییەکەت ئەم قۆناغانە تێدەپەڕێت:</p>
            <div className="flex flex-col gap-2">
              {VERIFICATION_STEPS.map((v) => (
                <div key={v.status} className="flex items-start gap-3 rounded-(--radius-md) border border-(--color-border) p-3">
                  <StatusPill status={v.status} />
                  <div>
                    <p className="text-sm font-semibold text-(--color-text-primary)">{v.label}</p>
                    <p className="text-xs text-(--color-text-secondary)">{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={prev}>
              گەڕانەوە
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" iconRight={step === STEPS.length - 1 ? <CheckCircleIcon className="size-4" /> : undefined}>
            {step === STEPS.length - 1 ? "ناردن بۆ پێداچوونەوە" : "بەردەوامبوون"}
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-(--color-border) pt-6 text-center text-sm">
        <span className="text-(--color-text-secondary)">پێشتر هەژامت هەیە؟ </span>
        <Link to="/agency/login" className="font-semibold text-(--color-primary)">
          بچۆ ژوورەوە
        </Link>
      </div>
    </AuthLayout>
  );
}

function Dropzone({ label }: { label: string }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-(--color-text-primary)">{label}</p>
      <div className="flex flex-col items-center justify-center gap-2 rounded-(--radius-md) border-2 border-dashed border-(--color-border) bg-(--color-surface-elevated) px-4 py-8 text-center">
        <GlobeIcon className="size-6 text-(--color-text-muted)" />
        <p className="text-xs text-(--color-text-muted)">فایل ڕابکێشە یان کلیک بکە بۆ بارکردن (PDF, JPG, PNG)</p>
        <span className={buttonClassName("outline", "sm")}>هەڵبژاردنی فایل</span>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: VerificationStatus }) {
  const tone =
    status === "verified"
      ? "success"
      : status === "rejected"
        ? "error"
        : status === "needs_changes"
          ? "warning"
          : "neutral";
  return (
    <Badge tone={tone} icon={<ClockIcon className="size-3.5" />} className="shrink-0">
      {status === "verified" ? "پشتڕاستکراو" : status === "rejected" ? "ڕەتکراوە" : status === "needs_changes" ? "گۆڕانکاری" : status === "under_review" ? "پێداچوونەوە" : "چاوەڕوان"}
    </Badge>
  );
}
