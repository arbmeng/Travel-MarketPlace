import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
}

function FieldLabel({ id, label, required, optional }: { id: string; label?: string; required?: boolean; optional?: boolean }) {
  if (!label) return null;
  return (
    <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-(--color-text-primary)">
      {label}
      {required && <span className="text-(--color-error)">*</span>}
      {optional && <span className="text-xs font-normal text-(--color-text-muted)">(ئیختیاری)</span>}
    </label>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldWrapperProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, required, optional, className, id, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className="w-full">
      <FieldLabel id={fieldId} label={label} required={required} optional={optional} />
      <input
        ref={ref}
        id={fieldId}
        required={required}
        className={cn(
          "h-12 w-full rounded-(--radius-md) border bg-(--color-surface) px-4 text-[15px] text-(--color-text-primary) placeholder:text-(--color-text-muted) transition-colors",
          error ? "border-(--color-error)" : "border-(--color-border) focus:border-(--color-primary)",
          "disabled:bg-(--color-surface-elevated) disabled:text-(--color-text-muted)",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-(--color-error)">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-(--color-text-muted)">{hint}</p>
      ) : null}
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldWrapperProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, required, optional, className, id, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className="w-full">
      <FieldLabel id={fieldId} label={label} required={required} optional={optional} />
      <textarea
        ref={ref}
        id={fieldId}
        required={required}
        className={cn(
          "min-h-28 w-full rounded-(--radius-md) border bg-(--color-surface) px-4 py-3 text-[15px] text-(--color-text-primary) placeholder:text-(--color-text-muted) transition-colors",
          error ? "border-(--color-error)" : "border-(--color-border) focus:border-(--color-primary)",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-(--color-error)">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-(--color-text-muted)">{hint}</p>
      ) : null}
    </div>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldWrapperProps {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, required, optional, className, id, children, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className="w-full">
      <FieldLabel id={fieldId} label={label} required={required} optional={optional} />
      <select
        ref={ref}
        id={fieldId}
        className={cn(
          "h-12 w-full rounded-(--radius-md) border bg-(--color-surface) px-4 text-[15px] text-(--color-text-primary) transition-colors",
          error ? "border-(--color-error)" : "border-(--color-border) focus:border-(--color-primary)",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-(--color-error)">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-(--color-text-muted)">{hint}</p>}
    </div>
  );
});

export function Checkbox({ label, className, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <label htmlFor={fieldId} className={cn("flex items-center gap-2.5 text-sm text-(--color-text-primary) cursor-pointer", className)}>
      <input
        type="checkbox"
        id={fieldId}
        className="size-5 rounded-(--radius-xs) border-(--color-border) text-(--color-primary) focus:ring-(--color-primary)"
        {...props}
      />
      {label}
    </label>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      {label && <span className="text-sm text-(--color-text-primary)">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-(--radius-pill) transition-colors",
          checked ? "bg-(--color-primary)" : "bg-(--color-border)"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 start-0.5 size-5 rounded-full bg-white shadow-(--shadow-subtle) transition-transform",
            checked ? "translate-x-[1.25rem] rtl:-translate-x-[1.25rem]" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
}

export function Radio({ label, className, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <label htmlFor={fieldId} className={cn("flex items-center gap-2.5 text-sm text-(--color-text-primary) cursor-pointer", className)}>
      <input
        type="radio"
        id={fieldId}
        className="size-5 border-(--color-border) text-(--color-primary) focus:ring-(--color-primary)"
        {...props}
      />
      {label}
    </label>
  );
}
