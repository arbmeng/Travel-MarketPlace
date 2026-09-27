import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Switch } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { WalletIcon } from "@/components/icons";
import { CURRENT_TRAVELER } from "@/data/accountMock";
import { useAppState } from "@/state/AppState";
import type { CurrencyCode } from "@/lib/format";

const LANGUAGE_OPTIONS: { value: "ckb" | "ar" | "en"; label: string }[] = [
  { value: "ckb", label: "کوردی" },
  { value: "ar", label: "عەرەبی" },
  { value: "en", label: "English" },
];

const CURRENCY_OPTIONS: { value: CurrencyCode; label: string }[] = [
  { value: "IQD", label: "IQD — دیناری عێراقی" },
  { value: "USD", label: "USD — دۆلاری ئەمریکی" },
  { value: "EUR", label: "EUR — یۆرۆ" },
  { value: "GBP", label: "GBP — پاوەندی بەریتانی" },
];

export default function SettingsPage() {
  const { currency, setCurrency, language, setLanguage } = useAppState();
  const { push } = useToast();

  const [notifPrefs, setNotifPrefs] = useState({ booking: true, promotions: true, reminders: true, messages: true });
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  function saveGeneral() {
    push("ڕێکخستنەکان پاشەکەوتکران", "success");
  }

  function changePassword() {
    if (!passwords.current || !passwords.next || passwords.next !== passwords.confirm) {
      push("تکایە هەموو خانەکان بە دروستی پڕبکەرەوە", "error");
      return;
    }
    push("وشەی نهێنی نوێ کرایەوە", "success");
    setPasswords({ current: "", next: "", confirm: "" });
  }

  return (
    <div className="mx-auto max-w-(--breakpoint-md) px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-1 text-2xl font-extrabold text-(--color-text-primary)">ڕێکخستنەکان</h1>
      <p className="mb-8 text-(--color-text-secondary)">هەژمار، زمان و شێوازی پارەدانت بەڕێوەببە.</p>

      <div className="flex flex-col gap-6">
        {/* Language & currency */}
        <Section title="زمان و دراو">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="زمانی نیشاندان" value={language} onChange={(e) => setLanguage(e.target.value as typeof language)}>
              {LANGUAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Select label="دراو" value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
              {CURRENCY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <Button className="mt-4" size="sm" onClick={saveGeneral}>
            پاشەکەوتکردن
          </Button>
        </Section>

        {/* Notification preferences */}
        <Section title="ئاگادارکردنەوەکان">
          <div className="flex flex-col gap-4">
            <ToggleRow label="ئاگادارکردنەوەی حیجزکردن" checked={notifPrefs.booking} onChange={(v) => setNotifPrefs({ ...notifPrefs, booking: v })} />
            <ToggleRow label="یادەوەری گەشت" checked={notifPrefs.reminders} onChange={(v) => setNotifPrefs({ ...notifPrefs, reminders: v })} />
            <ToggleRow label="پەیامی ئەژانسەکان" checked={notifPrefs.messages} onChange={(v) => setNotifPrefs({ ...notifPrefs, messages: v })} />
            <ToggleRow label="داشکاندن و بەرنامەی تایبەت" checked={notifPrefs.promotions} onChange={(v) => setNotifPrefs({ ...notifPrefs, promotions: v })} />
          </div>
        </Section>

        {/* Payment methods */}
        <Section title="شێوازەکانی پارەدان">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-(--radius-md) border border-(--color-border) p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-(--radius-sm) bg-(--color-primary-50) text-(--color-primary)">
                  <WalletIcon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-(--color-text-primary)">Visa •••• 4242</p>
                  <p className="text-xs text-(--color-text-muted)">بەسەردەچێت ١٢/٢٧</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-(--color-text-muted)">سەرەکی</span>
            </div>
            <button
              type="button"
              onClick={() => push("لە پرۆتۆتایپدا زیادکردنی کارتی نوێ چالاک نییە", "info")}
              className="rounded-(--radius-md) border border-dashed border-(--color-border) p-4 text-center text-sm font-semibold text-(--color-text-secondary) hover:border-(--color-primary-light) cursor-pointer"
            >
              + زیادکردنی شێوازی پارەدانی نوێ
            </button>
          </div>
        </Section>

        {/* Privacy & security */}
        <Section title="تایبەتمەندی و سەلامەتی">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="وشەی نهێنی ئێستا" type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
            <Input label="وشەی نهێنی نوێ" type="password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
            <Input label="دووبارەکردنەوە" type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
          </div>
          <Button className="mt-4" size="sm" variant="outline" onClick={changePassword}>
            گۆڕینی وشەی نهێنی
          </Button>
          <div className="mt-5 border-t border-(--color-border) pt-5">
            <ToggleRow label="ئاگادارکردنەوە لە چوونەژوورەوەی نوێ" checked={loginAlerts} onChange={setLoginAlerts} />
          </div>
        </Section>

        {/* Account info + logout */}
        <Section title="زانیاری هەژمار">
          <p className="text-sm text-(--color-text-secondary)">
            {CURRENT_TRAVELER.email} · {CURRENT_TRAVELER.phone}
          </p>
          <Button className="mt-4" variant="danger" onClick={() => push("چوونەدەرەوە سەرکەوتوو بوو", "info")}>
            چوونەدەرەوە
          </Button>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle) sm:p-6">
      <h2 className="mb-4 font-bold text-(--color-text-primary)">{title}</h2>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-(--color-text-primary)">{label}</span>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}
