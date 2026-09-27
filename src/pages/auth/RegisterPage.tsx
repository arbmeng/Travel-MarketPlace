import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [agreed, setAgreed] = useState(false);

  const canSubmit = form.fullName.trim() && (form.email.trim() || form.phone.trim()) && form.password.trim() && agreed;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    navigate("/onboarding");
  }

  return (
    <AuthLayout
      title="هەژمار درووستبکە"
      subtitle="خۆت تۆمار بکە و دەستپێبکە بە دۆزینەوەی گەشتی ڕاستەقینەی کوردستان."
      footer={
        <span className="text-(--color-text-secondary)">
          هەژمارت هەیە؟{" "}
          <Link to="/login" className="font-semibold text-(--color-primary) hover:underline">
            بچۆرەژوورەوە
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="ناوی تەواو"
          required
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="بۆ نموونە: ئاراس عەبدوڵا"
        />
        <Input
          label="ئیمەیل"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="name@example.com"
        />
        <Input
          label="ژمارەی مۆبایل"
          hint="ئیمەیل یان مۆبایل، بەلایەنی کەم یەکێکیان پێویستە"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+964 7XX XXX XXXX"
        />
        <Input
          label="وشەی نهێنی"
          required
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          hint="بەلایەنی کەم ٨ پیت"
        />
        <label className="flex items-start gap-2.5 text-sm text-(--color-text-primary) cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 rounded-(--radius-xs) border-(--color-border) text-(--color-primary) focus:ring-(--color-primary)"
          />
          <span>
            ڕازیم بە{" "}
            <Link to="/legal/terms" className="font-semibold text-(--color-primary) hover:underline">
              مەرجەکانی خزمەتگوزاری
            </Link>{" "}
            و{" "}
            <Link to="/legal/privacy" className="font-semibold text-(--color-primary) hover:underline">
              سیاسەتی تایبەتمەندی
            </Link>
          </span>
        </label>
        <Button type="submit" fullWidth disabled={!canSubmit}>
          خۆتۆمارکردن
        </Button>
      </form>
    </AuthLayout>
  );
}
