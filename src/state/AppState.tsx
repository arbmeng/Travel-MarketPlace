import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CurrencyCode } from "@/lib/format";

interface AppStateValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  language: "ckb" | "ar" | "en";
  setLanguage: (l: "ckb" | "ar" | "en") => void;
  wishlist: Set<string>;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

const AppStateContext = createContext<AppStateValue | null>(null);

const WISHLIST_KEY = "zagros.wishlist";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("IQD");
  const [language, setLanguage] = useState<"ckb" | "ar" | "en">("ckb");
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
    } catch {
      /* ignore */
    }
  }, [wishlist]);

  const value = useMemo<AppStateValue>(
    () => ({
      currency,
      setCurrency,
      language,
      setLanguage,
      wishlist,
      toggleWishlist: (id: string) =>
        setWishlist((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }),
      isWishlisted: (id: string) => wishlist.has(id),
    }),
    [currency, language, wishlist]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
