import { useState } from "react";
import { Input, Select, Switch } from "@/components/ui/Input";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { TEAM_MEMBERS, type TeamPermissions } from "@/data/agencyMock";

const PERMISSION_LABELS: Record<keyof TeamPermissions, string> = {
  trips: "گەشتەکان",
  bookings: "حیجزەکان",
  messages: "پەیامەکان",
  financials: "دارایی",
  analytics: "شیکاری",
};

const ROLE_LABEL = { owner: "خاوەن", manager: "بەڕێوەبەر", staff: "کارمەند" } as const;

const TABS = [
  { key: "payment", label: "پارەدان" },
  { key: "team", label: "ئەندامانی تیم" },
  { key: "security", label: "ئاسایش" },
];

export default function AgencySettingsPage() {
  const [tab, setTab] = useState("payment");
  const { push } = useToast();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-(--color-text-primary)">ڕێکخستنەکان</h1>
        <p className="mt-1 text-(--color-text-secondary)">زانیاری پارەدان، ئەندامانی تیم و ئاسایشی هەژمار بەڕێوە ببە.</p>
      </div>

      <Tabs items={TABS} active={tab} onChange={setTab} />

      {tab === "payment" && (
        <section className="mx-auto flex w-full max-w-(--breakpoint-md) flex-col gap-4 rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle)">
          <h2 className="font-bold text-(--color-text-primary)">زانیاری بانکی</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="ناوی بانک" defaultValue="بانکی کوردستان" />
            <Input label="ناوی خاوەنی حساب" defaultValue="کاوە ئیبراهیم" />
            <Input label="IBAN / ژمارەی حساب" defaultValue="•••• •••• •••• 4821" hint="تەنها ٤ ژمارەی کۆتایی نیشان دەدرێت." />
            <Select label="خشتەی پارەدان" defaultValue="biweekly">
              <option value="weekly">هەفتانە</option>
              <option value="biweekly">هەردوو هەفتەیەکجار</option>
              <option value="monthly">مانگانە</option>
            </Select>
          </div>
          <Input label="کەمترین بڕی پارەدان" type="number" defaultValue={100000} hint="پارەدان تەنها کاتێک ئەنجام دەدرێت باڵانسەکەت لەم بڕە زیاتر بێت." />
          <Button className="self-start" onClick={() => push("زانیاری پارەدان پاشەکەوت کرا")}>
            پاشەکەوتکردن
          </Button>
        </section>
      )}

      {tab === "team" && (
        <section className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-(--color-text-primary)">ئەندامانی تیم</h2>
            <button type="button" className={buttonClassName("outline", "sm")} onClick={() => push("بانگهێشتنامە نێردرا")}>
              بانگهێشتنی ئەندام
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-start text-sm">
              <thead>
                <tr className="border-b border-(--color-border) text-xs font-semibold text-(--color-text-muted)">
                  <th className="px-3 py-3 text-start">ئەندام</th>
                  <th className="px-3 py-3 text-start">ڕۆڵ</th>
                  {Object.values(PERMISSION_LABELS).map((l) => (
                    <th key={l} className="px-3 py-3 text-start">
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TEAM_MEMBERS.map((m) => (
                  <tr key={m.id} className="border-b border-(--color-border) last:border-0">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={m.avatarUrl} alt={m.name} size="sm" />
                        <div>
                          <p className="font-semibold text-(--color-text-primary)">{m.name}</p>
                          <p className="text-xs text-(--color-text-muted)">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={m.role === "owner" ? "primary" : "neutral"}>{ROLE_LABEL[m.role]}</Badge>
                    </td>
                    {(Object.keys(PERMISSION_LABELS) as (keyof TeamPermissions)[]).map((perm) => (
                      <td key={perm} className="px-3 py-3">
                        <Switch checked={m.permissions[perm]} onChange={() => push(`مۆڵەتی ${PERMISSION_LABELS[perm]} بۆ ${m.name} گۆڕدرا`)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "security" && (
        <section className="mx-auto flex w-full max-w-(--breakpoint-md) flex-col gap-6 rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle)">
          <div>
            <h2 className="mb-4 font-bold text-(--color-text-primary)">گۆڕینی وشەی نهێنی</h2>
            <div className="flex flex-col gap-4">
              <Input label="وشەی نهێنی ئێستا" type="password" />
              <Input label="وشەی نهێنی نوێ" type="password" />
              <Input label="دووپاتکردنەوەی وشەی نهێنی" type="password" />
              <Button className="self-start" onClick={() => push("وشەی نهێنی نوێکرایەوە")}>
                نوێکردنەوەی وشەی نهێنی
              </Button>
            </div>
          </div>
          <div className="border-t border-(--color-border) pt-6">
            <h2 className="mb-3 font-bold text-(--color-text-primary)">ئاگاداریی چوونەژوورەوە</h2>
            <SecuritySwitch label="ئاگاداریی ئیمەیل لە هەر چوونەژوورەوەیەکی نوێ" defaultChecked />
            <SecuritySwitch label="پشتڕاستکردنەوەی دوو هەنگاوی (2FA)" />
          </div>
        </section>
      )}
    </div>
  );
}

function SecuritySwitch({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-(--color-text-primary)">{label}</span>
      <Switch checked={checked} onChange={setChecked} />
    </div>
  );
}
