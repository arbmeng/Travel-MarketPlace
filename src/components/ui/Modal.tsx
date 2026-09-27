import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-md";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-floating) animate-[modal-in_0.18s_ease-out]",
          sizeClass
        )}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-(--color-text-primary)">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="داخستن"
              className="flex size-8 items-center justify-center rounded-full text-(--color-text-muted) hover:bg-(--color-surface-elevated) cursor-pointer"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4">
                <path strokeLinecap="round" d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
        )}
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-(--radius-xl) bg-(--color-surface) p-5 pb-[env(safe-area-inset-bottom)] shadow-(--shadow-floating) animate-[sheet-in_0.2s_ease-out] md:max-w-md md:rounded-(--radius-xl)">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-(--color-border) md:hidden" />
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-(--color-text-primary)">{title}</h2>
            <button type="button" onClick={onClose} className="flex size-8 items-center justify-center rounded-full text-(--color-text-muted) hover:bg-(--color-surface-elevated) cursor-pointer">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4">
                <path strokeLinecap="round" d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
        )}
        <div>{children}</div>
        {footer && <div className="sticky bottom-0 mt-6 -mx-5 -mb-5 border-t border-(--color-border) bg-(--color-surface) px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
