import { cn } from "@/lib/utils";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  isDone && "bg-(--color-primary) text-white",
                  isActive && "bg-(--color-primary) text-white ring-4 ring-(--color-primary-50)",
                  !isDone && !isActive && "bg-(--color-surface-elevated) text-(--color-text-muted)"
                )}
              >
                {isDone ? (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4 10 4 4 8-8" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isActive ? "text-(--color-text-primary)" : "text-(--color-text-muted)"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1 rounded-full", isDone ? "bg-(--color-primary)" : "bg-(--color-border)")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-(--radius-pill) bg-(--color-surface-elevated)">
      <div
        className="h-full rounded-(--radius-pill) bg-(--color-primary) transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
