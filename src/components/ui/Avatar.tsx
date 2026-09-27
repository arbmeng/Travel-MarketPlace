import { cn } from "@/lib/utils";

const sizeMap = { sm: "size-8", md: "size-11", lg: "size-16", xl: "size-24" };

export function Avatar({
  src,
  alt,
  size = "md",
  ring,
  className,
}: {
  src: string;
  alt: string;
  size?: keyof typeof sizeMap;
  ring?: boolean;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        sizeMap[size],
        "rounded-full object-cover bg-(--color-surface-elevated)",
        ring && "ring-2 ring-(--color-surface) shadow-(--shadow-subtle)",
        className
      )}
    />
  );
}

export function AvatarGroup({ avatars, max = 4 }: { avatars: { src: string; alt: string }[]; max?: number }) {
  const shown = avatars.slice(0, max);
  const remaining = avatars.length - shown.length;
  return (
    <div className="flex items-center -space-x-3 rtl:space-x-reverse">
      {shown.map((a, i) => (
        <Avatar key={i} src={a.src} alt={a.alt} size="sm" ring />
      ))}
      {remaining > 0 && (
        <span className="flex size-8 items-center justify-center rounded-full bg-(--color-surface-elevated) text-xs font-semibold text-(--color-text-secondary) ring-2 ring-(--color-surface)">
          +{remaining}
        </span>
      )}
    </div>
  );
}
