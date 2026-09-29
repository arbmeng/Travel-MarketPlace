import { useState } from "react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge, Chip, VerifiedBadge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { GlobeIcon } from "@/components/icons";
import { GOVERNORATES } from "@/data/mock";
import { agency } from "@/data/agencyMock";

const LANGUAGE_OPTIONS = ["کوردی", "عەرەبی", "ئینگلیزی", "فارسی", "تورکی"];

export default function AgencyProfileSettingsPage() {
  const [languages, setLanguages] = useState<string[]>(agency.languages);
  const [description, setDescription] = useState(agency.description);
  const { push } = useToast();

  return (
    <div className="mx-auto flex max-w-(--breakpoint-md) flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-(--color-text-primary)">پڕۆفایلی ئەژانس</h1>
        <p className="mt-1 text-(--color-text-secondary)">ئەم زانیارییانە بۆ گەشتیاران لە پڕۆفایلی گشتیت دەردەکەوێت.</p>
      </div>

      <section className="rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle)">
        <h2 className="mb-4 font-bold text-(--color-text-primary)">دۆخی پشتڕاستکردنەوە</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <VerifyRow label="پشتڕاستکردنەوەی بازرگانی" verified={agency.verified} />
          <VerifyRow label="پشتڕاستکردنەوەی پەیوەندی" verified />
          <VerifyRow label="پشتڕاستکردنەوەی پارەدان" verified={agency.verified} />
        </div>
      </section>

      <section className="rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle)">
        <h2 className="mb-4 font-bold text-(--color-text-primary)">لۆگۆ و وێنەی سەرەوە</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center gap-2">
            <img src={agency.logo} alt="لۆگۆ" className="size-24 rounded-(--radius-md) object-cover" />
            <button type="button" className="text-xs font-semibold text-(--color-primary)">
              گۆڕینی لۆگۆ
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-(--radius-md) border-2 border-dashed border-(--color-border) bg-(--color-surface-elevated) py-8 text-center">
            <GlobeIcon className="size-5 text-(--color-text-muted)" />
            <p className="text-xs text-(--color-text-muted)">وێنەی سەرەوە ڕابکێشە یان کلیک بکە</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle)">
        <h2 className="font-bold text-(--color-text-primary)">زانیاری گشتی</h2>
        <Input label="ناوی ئەژانس" defaultValue={agency.name} />
        <Textarea label="وەسف" value={description} onChange={(e) => setDescription(e.target.value)} hint="وەسفێکی ڕاست و بێ زیادەڕۆیی بنووسە." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="شوێن" defaultValue="">
            <option value="" disabled>
              پارێزگا هەڵبژێرە
            </option>
            {GOVERNORATES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
          <Input label="ژمارەی مۆبایل" defaultValue={agency.phone} />
        </div>
        <Input label="ئیمەیل" defaultValue={agency.email} />
        <Input label="ماڵپەڕ" optional placeholder="https://" />
        <Input label="لینکی ئینستاگرام" optional placeholder="@agency" />
        <div>
          <p className="mb-1.5 text-sm font-semibold text-(--color-text-primary)">زمانەکان</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((l) => (
              <Chip key={l} selected={languages.includes(l)} onClick={() => setLanguages((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]))}>
                {l}
              </Chip>
            ))}
          </div>
        </div>
        <Button className="self-start" onClick={() => push("پڕۆفایل پاشەکەوت کرا")}>
          پاشەکەوتکردن
        </Button>
      </section>
    </div>
  );
}

function VerifyRow({ label, verified }: { label: string; verified: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-(--radius-md) bg-(--color-surface-elevated) p-3">
      <span className="text-sm text-(--color-text-primary)">{label}</span>
      {verified ? <VerifiedBadge /> : <Badge tone="warning">چاوەڕوان</Badge>}
    </div>
  );
}
