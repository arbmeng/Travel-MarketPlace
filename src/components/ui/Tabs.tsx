import { cn } from "@/lib/utils";

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

export function Tabs({
  items,
  active,
  onChange,
  className,
}: {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-(--color-border)", className)}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={cn(
            "relative shrink-0 whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors cursor-pointer",
            active === item.key ? "text-(--color-primary)" : "text-(--color-text-muted) hover:text-(--color-text-primary)"
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className="ms-1.5 text-xs text-(--color-text-muted)">({item.count})</span>
          )}
          {active === item.key && (
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-(--color-primary)" />
          )}
        </button>
      ))}
    </div>
  );
}

export function PillTabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-(--radius-pill) px-4 py-2 text-sm font-semibold transition-colors cursor-pointer",
            active === item.key
              ? "bg-(--color-primary) text-white"
              : "bg-(--color-surface-elevated) text-(--color-text-secondary) hover:bg-(--color-primary-50)"
          )}
        >
          {item.label}
          {item.count !== undefined && <span className="ms-1.5 opacity-70">({item.count})</span>}
        </button>
      ))}
    </div>
  );
}
