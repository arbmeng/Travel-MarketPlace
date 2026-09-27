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
      <div className="mb-5 flex rounded-(--radius-pill) bg-(--color-surface-elevated) p-1">
        <button
          type="button"
          onClick={() => setMode("email")}
          className={`flex-1 rounded-(--radius-pill) py-2 text-sm font-semibold transition-colors cursor-pointer ${
            mode === "email" ? "bg-(--color-surface) text-(--color-text-primary) shadow-(--shadow-subtle)" : "text-(--color-text-muted)"
          }`}
        >
          بە ئیمەیل
        </button>
        <button
          type="button"
          onClick={() => setMode("phone")}
          className={`flex-1 rounded-(--radius-pill) py-2 text-sm font-semibold transition-colors cursor-pointer ${
            mode === "phone" ? "bg-(--color-surface) text-(--color-text-primary) shadow-(--shadow-subtle)" : "text-(--color-text-muted)"
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
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={mode === "email" ? "name@example.com" : "+964 7XX XXX XXXX"}
        />
        <div>
          <Input label="وشەی نهێنی" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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

      <div className="my-6 flex items-center gap-3 text-xs text-(--color-text-muted)">
        <div className="h-px flex-1 bg-(--color-border)" />
        یان
        <div className="h-px flex-1 bg-(--color-border)" />
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="outline" fullWidth type="button" onClick={() => navigate("/account")}>
          چوونەژوورەوە بە Google
        </Button>
        <Button variant="outline" fullWidth type="button" onClick={() => navigate("/account")}>
          چوونەژوورەوە بە Apple
        </Button>
      </div>
    </AuthLayout>
  );
}
