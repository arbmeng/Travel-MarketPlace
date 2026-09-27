import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/state/AppState";

export function SaveButton({
  id,
  saved: savedProp,
  onToggle,
  className,
  variant = "floating",
}: {
  id?: string;
  saved?: boolean;
  onToggle?: (saved: boolean) => void;
  className?: string;
  variant?: "floating" | "inline";
}) {
  const { isWishlisted, toggleWishlist } = useAppState();
  const [localSaved, setLocalSaved] = useState(savedProp ?? false);
  const [pop, setPop] = useState(false);

  const saved = id ? isWishlisted(id) : localSaved;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !saved;
    if (id) toggleWishlist(id);
    else setLocalSaved(next);
    onToggle?.(next);
    if (next) {
      setPop(true);
      setTimeout(() => setPop(false), 300);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? "لابردن لە پاشەکەوتکراوەکان" : "پاشەکەوتکردن"}
      className={cn(
        variant === "floating" &&
          "flex size-9 items-center justify-center rounded-full bg-white/90 shadow-(--shadow-subtle) backdrop-blur transition-transform hover:scale-105",
        variant === "inline" && "flex items-center justify-center",
        "cursor-pointer",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        className={cn(
          "size-5 transition-transform",
          saved ? "text-(--color-error)" : "text-(--color-text-secondary)",
          pop && "scale-125"
        )}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.3s-7.3-4.4-9.8-9C.6 8 2 4.5 5.3 3.7c2-.5 4 .2 5.2 1.9l1.5 2 1.5-2c1.2-1.7 3.2-2.4 5.2-1.9 3.3.8 4.7 4.3 3.1 7.6-2.5 4.6-9.8 9-9.8 9Z"
        />
      </svg>
    </button>
  );
}
