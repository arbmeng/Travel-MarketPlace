export type CurrencyCode = "IQD" | "USD" | "EUR" | "GBP";

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  IQD: "د.ع",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

// Approximate reference rates against IQD, only used for display conversion —
// the charged currency is always shown separately from any converted estimate.
const IQD_RATES: Record<CurrencyCode, number> = {
  IQD: 1,
  USD: 1310,
  EUR: 1420,
  GBP: 1660,
};

export function convertFromIqd(amountIqd: number, to: CurrencyCode): number {
  return amountIqd / IQD_RATES[to];
}

export function formatCurrency(amountIqd: number, currency: CurrencyCode = "IQD"): string {
  const value = convertFromIqd(amountIqd, currency);
  const rounded = currency === "IQD" ? Math.round(value / 250) * 250 : Math.round(value * 100) / 100;
  const numberPart = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: currency === "IQD" ? 0 : 2,
    maximumFractionDigits: currency === "IQD" ? 0 : 2,
  }).format(rounded);

  if (currency === "IQD") {
    return `${numberPart} ${CURRENCY_SYMBOLS.IQD}`;
  }
  return `${CURRENCY_SYMBOLS[currency]}${numberPart}`;
}

export function formatFromPrice(amountIqd: number, currency: CurrencyCode = "IQD"): string {
  return `لە ${formatCurrency(amountIqd, currency)}`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

const KURDISH_MONTHS = [
  "کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران",
  "تەمووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم",
];

const KURDISH_WEEKDAYS = [
  "یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "هەینی", "شەممە",
];

export function formatKurdishDate(date: Date, opts?: { weekday?: boolean }): string {
  const day = date.getDate();
  const month = KURDISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const weekday = opts?.weekday ? `${KURDISH_WEEKDAYS[date.getDay()]}، ` : "";
  return `${weekday}${day}ی ${month}ی ${year}`;
}

export function formatKurdishDateShort(date: Date): string {
  const day = date.getDate();
  const month = KURDISH_MONTHS[date.getMonth()];
  return `${day}ی ${month}`;
}

export function formatDuration(days: number): string {
  if (days <= 1) return "یەک ڕۆژ";
  if (days === 2) return "٢ ڕۆژ";
  return `${days} ڕۆژ`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
