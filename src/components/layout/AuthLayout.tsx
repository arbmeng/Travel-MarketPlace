import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";
import { MOUNTAIN_IMAGES } from "@/data/images";

export function AuthLayout({
  children,
  title,
  subtitle,
  footer,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={MOUNTAIN_IMAGES[1]} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-(--color-primary-dark)/80 via-(--color-primary-dark)/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <Logo light className="mb-6" />
          <h2 className="max-w-md text-3xl font-extrabold leading-tight text-white text-balance">
            کوردستان بە چاوێکی نوێ ببینە
          </h2>
          <p className="mt-3 max-w-sm text-white/85">هەزاران گەشتیار ئەزموونی ڕەسەنیان لەگەڵ زاگرۆس دۆزیوەتەوە.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 flex lg:hidden">
            <Logo />
          </Link>
          <h1 className="text-2xl font-extrabold text-(--color-text-primary)">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-(--color-text-secondary)">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
