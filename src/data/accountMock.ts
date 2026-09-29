// Read-only extension of src/data/mock.ts for the traveler-account & support surfaces.
// Never edit mock.ts directly — new mock content for these pages lives here instead.
import { avatar } from "@/data/images";
import { MY_BOOKINGS, REVIEWS } from "@/data/mock";

export const CURRENT_TRAVELER = {
  fullName: "ئاراس عەبدوڵا",
  avatar: avatar("aras-traveler"),
  email: "aras.abdulla@example.com",
  phone: "+964 750 987 6543",
  nationality: "کوردستان - عێراق",
  memberSince: "٢٠٢٤",
};

export const TRAVELER_STATS = {
  tripsCompleted: MY_BOOKINGS.filter((b) => b.status === "completed").length,
  destinationsVisited: 3,
  reviewsWritten: REVIEWS.length > 0 ? 2 : 0,
};

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const SUPPORT_CATEGORIES = [
  { id: "booking", label: "حیجزکردن" },
  { id: "payment", label: "پارەدان" },
  { id: "cancellation", label: "هەڵوەشاندنەوە" },
  { id: "trips", label: "گەشتەکان" },
  { id: "account", label: "هەژمار" },
  { id: "safety", label: "سەلامەتی" },
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "f1",
    category: "booking",
    question: "چۆن گەشتێک حیجز بکەم؟",
    answer:
      "گەشتەکەت هەڵبژێرە، پاشان دوگمەی «حیجزکردن» دابگرە. هەنگاو بە هەنگاو بەروار، ژمارەی گەشتیار، زانیاری کەسی و پارەدان تەواو دەکەیت، لە کۆتاییدا پوختەی داواکارییەکەت دەبینیت پێش پشتڕاستکردنەوەی کۆتایی.",
  },
  {
    id: "f2",
    category: "payment",
    question: "چ شێوازەکانی پارەدان بەردەستن؟",
    answer:
      "دەتوانیت بە کارتی بانکی (Visa/Mastercard) یان بە شێوازی پارەدانی ناوخۆیی (وەک زاینکاش) پارە بدەیت. هەموو تێچووەکان — کرێی خزمەتگوزاری و کرێی پرۆسەکردنی پارەدان — پێش پشتڕاستکردنەوە بە ڕوونی نیشان دەدرێن.",
  },
  {
    id: "f3",
    category: "cancellation",
    question: "دەتوانم حیجزەکەم هەڵبوەشێنمەوە؟",
    answer:
      "بەڵێ. هەر گەشتێک یاسای هەڵوەشاندنەوەی تایبەت بە خۆی هەیە کە لە پەڕەی وردەکاری حیجزەکەت دەردەکەوێت. ئەگەر لە ماوەی کاتی بێبەرامبەر هەڵیبوەشێنیتەوە، هەموو پارەکەت دەگەڕێندرێتەوە.",
  },
  {
    id: "f4",
    category: "trips",
    question: "ئایا دەتوانم دوای حیجزکردن ژمارەی گەشتیارەکان بگۆڕم؟",
    answer:
      "بۆ گۆڕانکاری لە ژمارەی گەشتیاران یان زانیاری کەسی، تکایە پەیوەندی بە ئەژانسی گەشتەکە بکە لە ڕێگەی بەشی پەیامەکانەوە پێش کاتی گەشت.",
  },
  {
    id: "f5",
    category: "account",
    question: "چۆن وشەی نهێنیم بگۆڕم؟",
    answer: "لە پەڕەی ڕێکخستنەکان → بەشی تایبەتمەندی و سەلامەتی، دەتوانیت وشەی نهێنیی نوێ دابنێیت.",
  },
  {
    id: "f6",
    category: "safety",
    question: "ئایا ئەژانسەکان پشتڕاستکراون؟",
    answer:
      "هەموو ئەژانسی پشتڕاستکراو ناسنامەیان پشکنراوە و مۆڵەتی کارکردنیان هەیە. ئاماژەی «پشتڕاستکراو» لەلای ناوی هەر ئەژانسێک ئەم پشتڕاستییە نیشان دەدات.",
  },
  {
    id: "f7",
    category: "payment",
    question: "کرێی خزمەتگوزاری بۆ چییە؟",
    answer:
      "کرێی خزمەتگوزاری بۆ پشتگیری گەشتیار، دڵنیایی حیجز، و پاراستنی پارەدان بەکاردێت، وە بە ڕوونی وەک ڕیزێکی جیاواز لە پوختەی نرخدا نیشان دەدرێت.",
  },
  {
    id: "f8",
    category: "booking",
    question: "کە حیجزەکەم پشتڕاست دەکرێت؟",
    answer: "دەستبەجێ دوای تەواوکردنی پارەدان، پەیامی پشتڕاستکردنەوە و بلیتی گەشتەکەت دەبینیت و ئاگادارکردنەوەشت بۆ دەنێردرێت.",
  },
];
