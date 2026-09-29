import { Link } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { CheckCircleIcon, ChartIcon, TicketIcon, UsersIcon, WalletIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import { FEE_CONFIG, computeAgencyPayout } from "@/lib/pricing";

const STEPS = [
  { icon: TicketIcon, title: "گەشتەکەت بڵاو بکەرەوە", body: "پرۆفایلی ئەژانس دروست بکە و گەشتەکانت بە وردەکاری زیاد بکە." },
  { icon: UsersIcon, title: "حیجز وەربگرە", body: "گەشتیاران بە ئاسانی حیجز دەکەن و پارەدان بە ئۆنلاین ئەنجام دەدرێت." },
  { icon: CheckCircleIcon, title: "گەشتەکە تەواو بکە", body: "گەشتەکە بەڕێوە ببە و ئەزموونێکی نایاب بۆ گەشتیاران دابین بکە." },
  { icon: WalletIcon, title: "پارەکەت وەربگرە", body: "دوای تەواوبوونی گەشت، پارەی خاوەن پاش کەمکردنەوەی کۆمیسیۆن بۆ حسابی بانکیت دەنێردرێت." },
];

const example = computeAgencyPayout({ grossBookingIqd: 1_000_000 });

export default function AgencyPricingPage() {
  return (
    <div>
      <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-(--color-primary-dark)">
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center text-white">
          <span className="mb-4 inline-flex items-center rounded-(--radius-pill) bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            بۆ ئەژانسە گەشتیارییەکان
          </span>
          <h1 className="text-balance text-3xl font-extrabold leading-tight sm:text-5xl">
            گەشتەکانت بگەیەنە هەزاران گەشتیار
          </h1>
          <p className="mt-4 max-w-lg text-balance text-white/85">
            Zerrin.Travel یارمەتیت دەدات گەشتیاری زیاتر بدۆزیتەوە، بەبێ خەرجی پێشوەختە — تەنها کۆمیسیۆنێکی ڕوون لەسەر هەر حیجزێکی سەرکەوتوو.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/agency/onboarding" className={buttonClassName("secondary", "lg")}>
              ببە بە ئەژانس
            </Link>
            <Link to="/agency/login" className={buttonClassName("outline", "lg", { className: "border-white/40 text-white hover:bg-white/10" })}>
              چوونەژوورەوە
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">چۆن کار دەکات</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col gap-3 rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle)">
              <div className="flex size-11 items-center justify-center rounded-full bg-(--color-primary-50) text-(--color-primary)">
                <step.icon className="size-5" />
              </div>
              <span className="num text-xs font-bold text-(--color-text-muted)">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-bold text-(--color-text-primary)">{step.title}</h3>
              <p className="text-sm text-(--color-text-secondary)">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-(--color-surface-elevated)">
        <div className="mx-auto max-w-(--breakpoint-lg) px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">کۆمیسیۆن و کرێی ڕوون</h2>
            <p className="mt-3 text-(--color-text-secondary)">
              نرخەکانی خوارەوە نموونەیەکی ئێستان و دەتوانرێت بەگوێرەی ڕێککەوتن لەگەڵ تیمی Zerrin.Travel جیاواز بێت. هیچ خەرجی شاراوەیەک نییە — هەموو ڕەقەم لە پەڕەی پارەدانت بە ڕوونی دەردەکەوێت.
            </p>
          </div>

          <div className="mt-10 rounded-(--radius-xl) bg-(--color-surface) p-6 shadow-(--shadow-elevated) sm:p-8">
            <div className="flex items-center justify-between border-b border-(--color-border) pb-4">
              <h3 className="font-bold text-(--color-text-primary)">نموونەی وردەکاری پارەدان</h3>
              <span className="num rounded-(--radius-pill) bg-(--color-primary-50) px-3 py-1 text-xs font-bold text-(--color-primary-dark)">
                حیجزێک بە بڕی {formatCurrency(example.grossBookingIqd)}
              </span>
            </div>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <Row label="کۆی گشتی حیجز" value={formatCurrency(example.grossBookingIqd)} />
              <Row
                label={`کۆمیسیۆنی بازاڕ (%${FEE_CONFIG.platformCommissionPercent})`}
                value={`- ${formatCurrency(example.platformCommissionIqd)}`}
                muted
              />
              <Row
                label={`خەرجی پرۆسەکردنی پارەدان (%${FEE_CONFIG.paymentProcessingFeePercent})`}
                value={`- ${formatCurrency(example.paymentProcessingIqd)}`}
                muted
              />
              <div className="my-1 border-t border-dashed border-(--color-border)" />
              <Row label="پارەی وەرگیراوی ئەژانس" value={formatCurrency(example.netPayoutIqd)} strong />
            </dl>
          </div>

          <p className="mt-6 text-center text-xs text-(--color-text-muted)">
            ڕێژەکانی سەرەوە ڕێکخراون و دەکرێت بەگوێرەی ڕێککەوتنی تایبەت لەگەڵ هەر ئەژانسێک جیاواز بن؛ نرخی نیشانکراو تەنها نموونەیەکی ئێستایە، نەک بڕێکی هەمیشەیی نەگۆڕ.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Feature icon={ChartIcon} title="شیکاریی تەواو" body="ڕاپۆرتی هەفتانە و مانگانەی داهات، حیجز و ڕەفتاری گەشتیاران." />
          <Feature icon={WalletIcon} title="پارەدانی خێرا" body="پارەدانی خۆکار بۆ حسابی بانکیت بەپێی خشتەیەک کە خۆت هەڵدەبژێریت." />
          <Feature icon={UsersIcon} title="پشتگیری تیمی" body="تیمی پشتگیری Zerrin.Travel هەمیشە ئامادەیە بۆ یارمەتیدانت." />
        </div>
      </section>

      <section className="relative mx-4 my-16 overflow-hidden rounded-(--radius-xl) bg-(--color-primary-dark) sm:mx-6">
        <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-16 text-center text-white">
          <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">ئامادەیت دەست پێ بکەیت؟</h2>
          <p className="max-w-md text-white/85">لە چەند خولەکێکدا پرۆفایلی ئەژانسەکەت دروست بکە و یەکەم گەشتت بڵاو بکەرەوە.</p>
          <Link to="/agency/onboarding" className={buttonClassName("secondary", "lg")}>
            ببە بە ئەژانس
          </Link>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={strong ? "font-bold text-(--color-text-primary)" : "text-(--color-text-secondary)"}>{label}</span>
      <span className={`num ${strong ? "text-lg font-extrabold text-(--color-primary-dark)" : muted ? "font-semibold text-(--color-error)" : "font-semibold text-(--color-text-primary)"}`}>
        {value}
      </span>
    </div>
  );
}

function Feature({ icon: Icon, title, body }: { icon: typeof ChartIcon; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-(--radius-lg) bg-(--color-surface) p-6 text-center shadow-(--shadow-subtle)">
      <div className="flex size-11 items-center justify-center rounded-full bg-(--color-primary-50) text-(--color-primary)">
        <Icon className="size-5" />
      </div>
      <h3 className="font-bold text-(--color-text-primary)">{title}</h3>
      <p className="text-sm text-(--color-text-secondary)">{body}</p>
    </div>
  );
}
