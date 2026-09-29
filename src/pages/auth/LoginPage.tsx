import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/account");
  }

  return (
    <AuthLayout
      title="بەخێربێیتەوە"
      subtitle="بچۆرەژوورەوە بۆ بەردەوامبوون لە گەشتەکانت."
      footer={
        <span className="text-(--color-text-secondary)">
          هەژمارت نییە؟{" "}
          <Link to="/register" className="font-semibold text-(--color-primary) hover:underline">
            خۆت تۆمار بکە
          </Link>
        </span>
      }
    >
      <div role="group" aria-label="شێوازی چوونەژوورەوە" className="mb-5 grid grid-cols-2 gap-1 rounded-[8px] border border-(--color-border) bg-(--color-surface-elevated) p-1">
        <button
          type="button"
          onClick={() => setMode("email")}
          aria-pressed={mode === "email"}
          className={`min-h-11 rounded-[6px] text-sm font-semibold transition-colors cursor-pointer ${
            mode === "email" ? "bg-white text-(--color-primary-dark) shadow-(--shadow-subtle)" : "text-(--color-text-muted)"
          }`}
        >
          بە ئیمەیل
        </button>
        <button
          type="button"
          onClick={() => setMode("phone")}
          aria-pressed={mode === "phone"}
          className={`min-h-11 rounded-[6px] text-sm font-semibold transition-colors cursor-pointer ${
            mode === "phone" ? "bg-white text-(--color-primary-dark) shadow-(--shadow-subtle)" : "text-(--color-text-muted)"
          }`}
        >
          بە مۆبایل
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={mode === "email" ? "ئیمەیل" : "ژمارەی مۆبایل"}
          required
          type={mode === "email" ? "email" : "tel"}
          autoComplete={mode === "email" ? "email" : "tel"}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={mode === "email" ? "name@example.com" : "+964 7XX XXX XXXX"}
        />
        <div>
          <div className="relative">
            <Input label="وشەی نهێنی" required type={showPassword ? "text" : "password"} autoComplete="current-password" className="pe-20" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-pressed={showPassword} className="absolute end-3 top-[38px] rounded px-2 py-1 text-xs font-semibold text-(--color-text-muted) hover:text-(--color-primary)">
              {showPassword ? "شاردن" : "پیشاندان"}
            </button>
          </div>
          <div className="mt-2 text-end">
            <Link to="/support" className="text-xs font-semibold text-(--color-primary) hover:underline">
              وشەی نهێنیت لەبیرکردووە؟
            </Link>
          </div>
        </div>
        <Button type="submit" fullWidth>
          چوونەژوورەوە
        </Button>
      </form>
    </AuthLayout>
  );
}
