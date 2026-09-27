import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Input";

export default function AgencyLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/agency/dashboard"), 500);
  }

  return (
    <AuthLayout
      title="چوونەژوورەوەی ئەژانس"
      subtitle="بچۆرە ژوورەوە بۆ بەڕێوەبردنی گەشتەکان، حیجزەکان و پارەدانەکانت."
      footer={
        <p className="text-(--color-text-secondary)">
          نوێ لێرەیت؟{" "}
          <Link to="/agency/onboarding" className="font-semibold text-(--color-primary)">
            خۆت وەک ئەژانس تۆمار بکە
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="ئیمەیل یان ژمارەی مۆبایل" type="text" placeholder="info@agency.example" required autoFocus />
        <Input label="وشەی نهێنی" type="password" placeholder="••••••••" required />
        <div className="flex items-center justify-between">
          <Checkbox label="بمهێڵەوە لە ژوورەوە" defaultChecked />
          <button type="button" className="text-sm font-semibold text-(--color-primary)">
            وشەی نهێنیت لەبیرچووە؟
          </button>
        </div>
        <Button type="submit" size="lg" fullWidth loading={loading}>
          چوونەژوورەوە
        </Button>
      </form>
      <div className="mt-8 border-t border-(--color-border) pt-6 text-center">
        <Link to="/agency/pricing" className="text-sm font-semibold text-(--color-text-secondary) hover:text-(--color-primary)">
          زانیاری زیاتر سەبارەت بە کرێ و کۆمیسیۆن
        </Link>
      </div>
    </AuthLayout>
  );
}
