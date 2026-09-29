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
      <div className="relative h-48 overflow-hidden sm:h-56 lg:sticky lg:top-0 lg:h-screen">
        <img src={MOUNTAIN_IMAGES[1]} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-(--color-primary-dark)/80 via-(--color-primary-dark)/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-12">
          <Logo light className="mb-2 sm:mb-0 lg:mb-6" />
          <h2 className="hidden max-w-md text-3xl font-extrabold leading-tight text-white text-balance lg:block">
            کوردستان بە چاوێکی نوێ ببینە
          </h2>
          <p className="mt-3 hidden max-w-sm text-white/85 lg:block">دۆزینەوەی گەشت و ئەزموونی ڕەسەن لە کوردستان و جیهان، لە Zerrin.Travel.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-5 py-8 sm:px-12 sm:py-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-2xl font-extrabold text-(--color-text-primary)">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-(--color-text-secondary)">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
