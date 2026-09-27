// Agency-side mock data for the "گەشتیارانی زاگرۆس" (a1) dashboard.
// Everything here is derived/invented on top of the read-only src/data/mock.ts —
// never edits it. Dates follow the same opaque Arabic-Indic display-string
// convention used across the app (never parsed with `new Date`).
import { AGENCIES, DESTINATIONS, TRIPS, getAgencyById, getTripsByAgency, getReviewsForAgency } from "@/data/mock";
import { avatar } from "@/data/images";
import { computeAgencyPayout } from "@/lib/pricing";
import type {
  BookingStatus,
  ItineraryDay,
  PaymentStatus,
  Trip,
  TripCategory,
} from "@/types";

export const AGENCY_ID = "a1";
export const agency = getAgencyById(AGENCY_ID)!;

/* ---------------------------------------------------------------------- */
/* Date helpers — produce the same Arabic-Indic digit strings as mock.ts. */
/* ---------------------------------------------------------------------- */
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
function toArabicDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, (c) => ARABIC_DIGITS[Number(c)]);
}
function pad(n: number): string {
  return String(n).padStart(2, "0");
}
export function ymd(y: number, m: number, day: number): string {
  return toArabicDigits(`${y}-${pad(m)}-${pad(day)}`);
}
export function ymdt(y: number, m: number, day: number, hh: number, mm: number): string {
  return toArabicDigits(`${y}-${pad(m)}-${pad(day)}T${pad(hh)}:${pad(mm)}`);
}

/* ---------------------------------------------------------------------- */
/* Extra trips — demonstrate every TripStatus for AgencyTripsPage.        */
/* ---------------------------------------------------------------------- */
function itin(location: string, days: number): ItineraryDay[] {
  return Array.from({ length: days }).map((_, i) => ({
    day: i + 1,
    title: i === 0 ? `گەیشتن و ناسینی ${location}` : i === days - 1 ? "گەڕانەوە" : `ڕۆژی گەشتی ${location}`,
    location,
    activities: i === 0 ? ["وەرگرتن لە خاڵی کۆبوونەوە", "نانی نیوەڕۆ", "گەشتی سەرەتایی"] : ["پیاسە", "وێنەگرتن", "کاتی ئازاد"],
    meals: i === days - 1 ? ["نانی بەیانی"] : ["نانی بەیانی", "نانی نیوەڕۆ"],
    transportation: "پاسی کۆمپانیا",
    accommodation: i < days - 1 ? "گەستخانەی ناوچەیی" : undefined,
  }));
}

function makeTrip(partial: {
  id: string;
  title: string;
  destinationId: string;
  category: TripCategory;
  status: Trip["status"];
  priceIqd: number;
  duration: number;
  spotsRemaining: number;
  maxTravelers: number;
}): Trip {
  const dest = DESTINATIONS.find((d) => d.id === partial.destinationId)!;
  return {
    id: partial.id,
    slug: `${partial.id}-${dest.slug}`,
    title: partial.title,
    destinationId: partial.destinationId,
    agencyId: AGENCY_ID,
    category: partial.category,
    images: dest.images,
    rating: 4.6,
    reviewCount: 0,
    duration: partial.duration,
    difficulty: "moderate",
    minTravelers: 2,
    maxTravelers: partial.maxTravelers,
    spotsRemaining: partial.spotsRemaining,
    priceIqd: partial.priceIqd,
    childPriceIqd: Math.round(partial.priceIqd * 0.6),
    languages: ["کوردی", "ئینگلیزی"],
    transportation: "پاسی کۆمپانیا",
    accommodation: partial.duration > 1 ? "گەستخانەی ناوچەیی" : "-",
    meals: "نانی نیوەڕۆ",
    nextAvailableDate: ymd(2026, 11, 12),
    status: partial.status,
    description: `گەشتێکی نوێ بۆ ${dest.name}، لەلایەن ${agency.name}ەوە ڕێکخراوە.`,
    itinerary: itin(dest.name, partial.duration),
    included: ["گواستنەوە", "ڕابەری گەشت", "نانی نیوەڕۆ"],
    excluded: ["خەرجی کەسی"],
    meetingPoint: `بازاڕی نیشتیمانی ${agency.location}`,
    meetingInstructions: "٢٠ خولەک پێش کاتی دیاریکراو بگە.",
    cancellationPolicy: { freeUntilDays: 3, feePercentAfter: 30 },
    requirements: ["گونجاو بۆ هەموو تەمەنێک"],
    whatToBring: ["پێڵاوی ئاسان", "ئاو", "کامێرا"],
    familyFriendly: true,
    privateAvailable: false,
    scope: "domestic",
  };
}

export const EXTRA_AGENCY_TRIPS: Trip[] = [
  makeTrip({ id: "ta1", title: "گەشتی کێوی زۆزان (ڕەشنووس)", destinationId: "d5", category: "nature", status: "draft", priceIqd: 130000, duration: 2, spotsRemaining: 12, maxTravelers: 12 }),
  makeTrip({ id: "ta2", title: "گەشتی سروشتی ئاکرێ", destinationId: "d6", category: "hiking", status: "pending_review", priceIqd: 140000, duration: 1, spotsRemaining: 15, maxTravelers: 15 }),
  makeTrip({ id: "ta3", title: "کەمپینگی شەقڵاوە", destinationId: "d8", category: "camping", status: "paused", priceIqd: 210000, duration: 2, spotsRemaining: 10, maxTravelers: 10 }),
  makeTrip({ id: "ta4", title: "گەشتی زاخۆ و پردی دیلمان", destinationId: "d7", category: "family", status: "sold_out", priceIqd: 160000, duration: 1, spotsRemaining: 0, maxTravelers: 20 }),
  makeTrip({ id: "ta5", title: "گەشتی هاوینی سۆران", destinationId: "d5", category: "adventure", status: "expired", priceIqd: 175000, duration: 1, spotsRemaining: 0, maxTravelers: 18 }),
  makeTrip({ id: "ta6", title: "گەشتی مێژوویی ئامێدی — بەشی دووەم", destinationId: "d4", category: "historical", status: "rejected", priceIqd: 145000, duration: 1, spotsRemaining: 14, maxTravelers: 14 }),
];

export const AGENCY_TRIPS: Trip[] = [...getTripsByAgency(AGENCY_ID), ...EXTRA_AGENCY_TRIPS];
export const PUBLISHED_AGENCY_TRIPS = AGENCY_TRIPS.filter((t) => t.status === "published" || t.status === "sold_out" || t.status === "paused");

export function getAgencyTripById(id: string) {
  return AGENCY_TRIPS.find((t) => t.id === id);
}

/* ---------------------------------------------------------------------- */
/* Customers                                                              */
/* ---------------------------------------------------------------------- */
export interface AgencyCustomer {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string;
  email: string;
  nationality: string;
  bookingsCount: number;
  totalSpentIqd: number;
  lastTripTitle: string;
  lastTripDate: string;
  reviewCount: number;
  joinedAt: string;
}

const CUSTOMER_SEED: { id: string; name: string; phone: string; nat: string }[] = [
  { id: "cu1", name: "ئاڤان محەمەد", phone: "+964 750 111 2233", nat: "کوردستان - عێراق" },
  { id: "cu2", name: "کاروان ڕەشید", phone: "+964 770 222 3344", nat: "کوردستان - عێراق" },
  { id: "cu3", name: "شنە ئازاد", phone: "+964 771 333 4455", nat: "کوردستان - عێراق" },
  { id: "cu4", name: "هێمن سالار", phone: "+964 750 444 5566", nat: "کوردستان - عێراق" },
  { id: "cu5", name: "دلۆڤان کەریم", phone: "+964 780 555 6677", nat: "عێراق" },
  { id: "cu6", name: "ڕۆژان عومەر", phone: "+964 751 666 7788", nat: "کوردستان - عێراق" },
  { id: "cu7", name: "سۆران حەمە", phone: "+964 772 777 8899", nat: "کوردستان - عێراق" },
  { id: "cu8", name: "بەیان تۆفیق", phone: "+964 753 888 9900", nat: "کوردستان - عێراق" },
  { id: "cu9", name: "ئاراس ڕەسوڵ", phone: "+964 781 999 0011", nat: "عێراق" },
  { id: "cu10", name: "نیان فەرهاد", phone: "+964 754 000 1122", nat: "کوردستان - عێراق" },
];

export const CUSTOMERS: AgencyCustomer[] = CUSTOMER_SEED.map((c, i) => ({
  id: c.id,
  name: c.name,
  avatarUrl: avatar(c.id),
  phone: c.phone,
  email: `${c.id}@example.com`,
  nationality: c.nat,
  bookingsCount: [4, 2, 1, 3, 1, 2, 1, 1, 2, 1][i],
  totalSpentIqd: [1420000, 620000, 175000, 990000, 320000, 540000, 210000, 145000, 700000, 190000][i],
  lastTripTitle: PUBLISHED_AGENCY_TRIPS[i % PUBLISHED_AGENCY_TRIPS.length]?.title ?? "ماجەڕای ڕەواندز",
  lastTripDate: ymd(2026, 8 + (i % 3), 5 + i),
  reviewCount: [2, 1, 0, 1, 0, 1, 0, 0, 1, 0][i],
  joinedAt: ymd(2025, 3 + (i % 9), 10 + i),
}));

export function getCustomerById(id: string) {
  return CUSTOMERS.find((c) => c.id === id);
}

/* ---------------------------------------------------------------------- */
/* Bookings                                                               */
/* ---------------------------------------------------------------------- */
export interface AgencyBooking {
  id: string;
  bookingNumber: string;
  tripId: string;
  customerId: string;
  travelers: number;
  date: string;
  createdAt: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  grossIqd: number;
  refundIqd: number;
  internalNotes?: string;
}

const BOOKING_SEED: Array<[string, string, string, number, BookingStatus, PaymentStatus, number]> = [
  // [tripId, customerId, dateYMD-ish tuple handled below, travelers, status, paymentStatus, refund]
  ["t3", "cu1", "11-05", 2, "upcoming", "paid", 0],
  ["t4", "cu2", "11-12", 4, "confirmed", "paid", 0],
  ["t5", "cu3", "10-20", 1, "completed", "paid", 0],
  ["t3", "cu4", "10-02", 3, "completed", "paid", 0],
  ["t4", "cu5", "12-01", 2, "pending", "pending", 0],
  ["t5", "cu6", "10-15", 6, "completed", "paid", 0],
  ["t3", "cu7", "09-18", 2, "cancelled", "refunded", 100],
  ["t4", "cu8", "11-25", 1, "confirmed", "processing", 0],
  ["t5", "cu9", "10-08", 4, "completed", "paid", 0],
  ["t3", "cu10", "12-10", 2, "upcoming", "paid", 0],
  ["t4", "cu1", "08-14", 3, "completed", "paid", 0],
  ["t5", "cu2", "09-05", 2, "cancelled", "partially_refunded", 50],
  ["t3", "cu6", "08-01", 5, "completed", "paid", 0],
  ["t4", "cu9", "12-18", 2, "pending", "pending", 0],
];

function tripPrice(tripId: string): number {
  return (TRIPS.find((t) => t.id === tripId) ?? AGENCY_TRIPS.find((t) => t.id === tripId))?.priceIqd ?? 150000;
}

export const BOOKINGS: AgencyBooking[] = BOOKING_SEED.map((seed, i) => {
  const [tripId, customerId, md, travelers, status, paymentStatus, refundPercent] = seed;
  const [month, day] = md.split("-").map(Number);
  const gross = tripPrice(tripId) * travelers;
  const refundIqd = refundPercent > 0 ? Math.round((gross * refundPercent) / 100) : 0;
  return {
    id: `bk${i + 1}`,
    bookingNumber: `ZG-${2400 + i}`,
    tripId,
    customerId,
    travelers,
    date: ymd(2026, month, day),
    createdAt: ymd(2026, month === 1 ? 12 : month - 1, Math.max(1, day - 10)),
    status,
    paymentStatus,
    grossIqd: gross,
    refundIqd,
    internalNotes: i % 4 === 0 ? "گەشتیار داوای شوێنی تایبەتی دانیشتنی کرد." : undefined,
  };
});

export function getBookingById(id: string) {
  return BOOKINGS.find((b) => b.id === id);
}
export function getBookingsForCustomer(customerId: string) {
  return BOOKINGS.filter((b) => b.customerId === customerId);
}

/* ---------------------------------------------------------------------- */
/* Payouts                                                                 */
/* ---------------------------------------------------------------------- */
export type PayoutStatus = "pending" | "processing" | "paid" | "failed";

export interface Payout {
  id: string;
  date: string;
  status: PayoutStatus;
  bookingIds: string[];
  bankName: string;
  bankLast4: string;
}

export const PAYOUTS: Payout[] = [
  { id: "po1", date: ymd(2026, 8, 5), status: "paid", bookingIds: ["bk11", "bk13"], bankName: "بانکی کوردستان", bankLast4: "4821" },
  { id: "po2", date: ymd(2026, 9, 5), status: "paid", bookingIds: ["bk3", "bk4", "bk6"], bankName: "بانکی کوردستان", bankLast4: "4821" },
  { id: "po3", date: ymd(2026, 9, 20), status: "paid", bookingIds: ["bk9", "bk12"], bankName: "بانکی کوردستان", bankLast4: "4821" },
  { id: "po4", date: ymd(2026, 10, 5), status: "processing", bookingIds: ["bk7"], bankName: "بانکی کوردستان", bankLast4: "4821" },
  { id: "po5", date: ymd(2026, 10, 20), status: "pending", bookingIds: ["bk1", "bk2", "bk10"], bankName: "بانکی کوردستان", bankLast4: "4821" },
];

export function getPayoutById(id: string) {
  return PAYOUTS.find((p) => p.id === id);
}

export function payoutBreakdown(payout: Payout) {
  const bookings = payout.bookingIds.map((id) => getBookingById(id)!).filter(Boolean);
  const grossBookingIqd = bookings.reduce((s, b) => s + b.grossIqd, 0);
  const refundIqd = bookings.reduce((s, b) => s + b.refundIqd, 0);
  return { bookings, ...computeAgencyPayout({ grossBookingIqd, refundIqd }) };
}

export function bookingPayout(booking: AgencyBooking) {
  return computeAgencyPayout({ grossBookingIqd: booking.grossIqd, refundIqd: booking.refundIqd });
}

/* ---------------------------------------------------------------------- */
/* Messages / inbox                                                       */
/* ---------------------------------------------------------------------- */
export interface AgencyMessage {
  id: string;
  from: "traveler" | "agency";
  text: string;
  at: string;
}
export interface AgencyConversation {
  id: string;
  customerId: string;
  tripId?: string;
  bookingId?: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  messages: AgencyMessage[];
}

export const QUICK_REPLY_TEMPLATES: { label: string; text: string }[] = [
  { label: "شوێنی کۆبوونەوە", text: "سڵاو، شوێنی کۆبوونەوەمان لە بازاڕی نیشتیمانییە، تکایە ٢٠ خولەک پێش کاتی دیاریکراو بگە." },
  { label: "کاتی ڕۆیشتن", text: "کاتی ڕۆیشتنی گەشتەکەمان کاتژمێر ٨ی بەیانییە، تکایە لە کاتدا ئامادە بە." },
  { label: "چی بهێنین", text: "تکایە پێڵاوی هەڵکشان، ئاوی پێویست و کلاشی گەرم لەبیرت نەچێت." },
  { label: "یاسای هەڵوەشاندنەوە", text: "دەتوانیت بێ هیچ کێشەیەک تا ٣ ڕۆژ پێش گەشت حیجزەکەت هەڵبوەشێنیتەوە." },
];

export const AGENCY_CONVERSATIONS: AgencyConversation[] = [
  {
    id: "ac1",
    customerId: "cu1",
    tripId: "t3",
    bookingId: "bk1",
    lastMessage: "زۆر سوپاس، بەم زووانە دەگەین.",
    lastMessageAt: ymdt(2026, 9, 25, 18, 10),
    unread: 2,
    messages: [
      { id: "m1", from: "traveler", text: "سڵاو، شوێنی کۆبوونەوە کوێیە؟", at: ymdt(2026, 9, 25, 17, 40) },
      { id: "m2", from: "agency", text: "سڵاو! بازاڕی نیشتیمانی هەولێر، کاتژمێر ٧ی بەیانی.", at: ymdt(2026, 9, 25, 17, 55) },
      { id: "m3", from: "traveler", text: "زۆر سوپاس، بەم زووانە دەگەین.", at: ymdt(2026, 9, 25, 18, 10) },
    ],
  },
  {
    id: "ac2",
    customerId: "cu5",
    tripId: "t4",
    bookingId: "bk5",
    lastMessage: "دەتوانین ژمارەی کەسان بۆ ٣ کەس زیاد بکەین؟",
    lastMessageAt: ymdt(2026, 9, 24, 12, 30),
    unread: 1,
    messages: [
      { id: "m1", from: "traveler", text: "دەتوانین ژمارەی کەسان بۆ ٣ کەس زیاد بکەین؟", at: ymdt(2026, 9, 24, 12, 30) },
    ],
  },
  {
    id: "ac3",
    customerId: "cu9",
    tripId: "t5",
    lastMessage: "سوپاس بۆ گەشتە خۆشەکە!",
    lastMessageAt: ymdt(2026, 9, 10, 9, 0),
    unread: 0,
    messages: [
      { id: "m1", from: "traveler", text: "چالاکییەکانی ڕۆژی یەکەم چین؟", at: ymdt(2026, 9, 9, 20, 0) },
      { id: "m2", from: "agency", text: "پیاسە و ناسینی ئاوڕۆکە و نانی نیوەڕۆی ناوچەیی.", at: ymdt(2026, 9, 9, 20, 20) },
      { id: "m3", from: "traveler", text: "سوپاس بۆ گەشتە خۆشەکە!", at: ymdt(2026, 9, 10, 9, 0) },
    ],
  },
  {
    id: "ac4",
    customerId: "cu8",
    tripId: "t4",
    lastMessage: "پارەدانەکە هێشتا لە پرۆسەدایە؟",
    lastMessageAt: ymdt(2026, 9, 22, 16, 45),
    unread: 1,
    messages: [{ id: "m1", from: "traveler", text: "پارەدانەکە هێشتا لە پرۆسەدایە؟", at: ymdt(2026, 9, 22, 16, 45) }],
  },
];

export function getConversationById(id: string) {
  return AGENCY_CONVERSATIONS.find((c) => c.id === id);
}

/* ---------------------------------------------------------------------- */
/* Notifications                                                          */
/* ---------------------------------------------------------------------- */
export interface AgencyNotification {
  id: string;
  category: "booking" | "payment" | "trip" | "review" | "message" | "payout" | "capacity";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export const AGENCY_NOTIFICATIONS: AgencyNotification[] = [
  { id: "an1", category: "booking", title: "حیجزی نوێ وەرگیرا", body: "ئاڤان محەمەد حیجزی نوێی بۆ ماجەڕای ڕەواندز کرد (ZG-2400).", createdAt: ymdt(2026, 9, 26, 9, 30), read: false },
  { id: "an2", category: "payment", title: "پارەدان وەرگیرا", body: "پارەدانی حیجزی ZG-2401 بە تەواوی وەرگیرا.", createdAt: ymdt(2026, 9, 26, 8, 10), read: false },
  { id: "an3", category: "review", title: "هەڵسەنگاندنی نوێ", body: "کاروان ڕەشید هەڵسەنگاندنێکی ٥ ئەستێرەیی نووسی.", createdAt: ymdt(2026, 9, 25, 21, 0), read: false },
  { id: "an4", category: "trip", title: "گەشتەکەت پەسەند کرا", body: "گەشتی «کەمپینگی چۆمان» پەسەند کرا و ئێستا بڵاوکراوەتەوە.", createdAt: ymdt(2026, 9, 24, 11, 0), read: true },
  { id: "an5", category: "message", title: "پەیامی نوێ لە گەشتیارێک", body: "دلۆڤان کەریم پرسیارێکی نوێی نارد سەبارەت بە ژمارەی کەسان.", createdAt: ymdt(2026, 9, 24, 12, 30), read: false },
  { id: "an6", category: "payout", title: "پارەدانی ئەژانس ئەنجامدرا", body: "پارەدانی ١,٤٠٠,٠٠٠ د.ع بۆ حسابی بانکیت نێردرا.", createdAt: ymdt(2026, 9, 20, 10, 0), read: true },
  { id: "an7", category: "capacity", title: "شوێنی کەم ماوە", body: "تەنها ٢ شوێن ماوە بۆ گەشتی «ڕۆژی مێژوویی ئامێدی».", createdAt: ymdt(2026, 9, 19, 15, 0), read: true },
  { id: "an8", category: "trip", title: "گەشتێک ڕەتکرایەوە", body: "گەشتی «ڕۆژی مێژوویی ئامێدی — بەشی دووەم» پێویستی بە زیاتر زانیاریی هەیە.", createdAt: ymdt(2026, 9, 17, 13, 0), read: true },
  { id: "an9", category: "booking", title: "هەڵوەشاندنەوەی حیجز", body: "سۆران حەمە حیجزی ZG-2406ی هەڵوەشاندەوە.", createdAt: ymdt(2026, 9, 15, 17, 0), read: true },
  { id: "an10", category: "review", title: "هەڵسەنگاندن پێویستی وەڵامە", body: "هەڵسەنگاندنێکی ٤ ئەستێرەیی چاوەڕوانی وەڵامدانەوەیە.", createdAt: ymdt(2026, 9, 12, 10, 0), read: true },
];

/* ---------------------------------------------------------------------- */
/* Analytics                                                               */
/* ---------------------------------------------------------------------- */
const MONTH_LABELS = ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەمووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم"];

export const REVENUE_SERIES: { label: string; revenueIqd: number; bookings: number }[] = [
  { label: MONTH_LABELS[9], revenueIqd: 4200000, bookings: 18 },
  { label: MONTH_LABELS[10], revenueIqd: 5100000, bookings: 22 },
  { label: MONTH_LABELS[11], revenueIqd: 3800000, bookings: 15 },
  { label: MONTH_LABELS[0], revenueIqd: 3200000, bookings: 13 },
  { label: MONTH_LABELS[1], revenueIqd: 3600000, bookings: 16 },
  { label: MONTH_LABELS[2], revenueIqd: 4400000, bookings: 19 },
  { label: MONTH_LABELS[3], revenueIqd: 5300000, bookings: 24 },
  { label: MONTH_LABELS[4], revenueIqd: 6100000, bookings: 27 },
  { label: MONTH_LABELS[5], revenueIqd: 7400000, bookings: 33 },
  { label: MONTH_LABELS[6], revenueIqd: 8600000, bookings: 38 },
  { label: MONTH_LABELS[7], revenueIqd: 7900000, bookings: 35 },
  { label: MONTH_LABELS[8], revenueIqd: 6200000, bookings: 29 },
];

export const ANALYTICS_SUMMARY = {
  conversionRatePercent: 34,
  avgBookingValueIqd: 260000,
  tripsSold: 289,
  cancellationRatePercent: 6,
  repeatCustomerRatePercent: 28,
};

export const TOP_TRIPS = [...AGENCY_TRIPS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
export const TOP_DESTINATIONS = DESTINATIONS.filter((d) => AGENCY_TRIPS.some((t) => t.destinationId === d.id))
  .map((d) => ({ destination: d, bookingCount: AGENCY_TRIPS.filter((t) => t.destinationId === d.id).reduce((s, t) => s + t.reviewCount, 0) }))
  .sort((a, b) => b.bookingCount - a.bookingCount);

/* ---------------------------------------------------------------------- */
/* Team members                                                           */
/* ---------------------------------------------------------------------- */
export type TeamRole = "owner" | "manager" | "staff";
export interface TeamPermissions {
  trips: boolean;
  bookings: boolean;
  messages: boolean;
  financials: boolean;
  analytics: boolean;
}
export interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
  role: TeamRole;
  email: string;
  permissions: TeamPermissions;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "tm1", name: "کاوە ئیبراهیم", avatarUrl: avatar("tm1"), role: "owner", email: "kawa@zagrosexplorers.example", permissions: { trips: true, bookings: true, messages: true, financials: true, analytics: true } },
  { id: "tm2", name: "سارا حسێن", avatarUrl: avatar("tm2"), role: "manager", email: "sara@zagrosexplorers.example", permissions: { trips: true, bookings: true, messages: true, financials: false, analytics: true } },
  { id: "tm3", name: "ئاسۆ نوری", avatarUrl: avatar("tm3"), role: "staff", email: "aso@zagrosexplorers.example", permissions: { trips: false, bookings: true, messages: true, financials: false, analytics: false } },
];

/* ---------------------------------------------------------------------- */
/* Support tickets                                                        */
/* ---------------------------------------------------------------------- */
export type TicketStatus = "open" | "in_progress" | "resolved";
export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
  lastUpdate: string;
}
export const SUPPORT_TICKETS: SupportTicket[] = [
  { id: "sup1", subject: "دواکەوتنی پارەدان بۆ مانگی ئەیلوول", category: "پارەدان", status: "in_progress", createdAt: ymd(2026, 9, 20), lastUpdate: ymd(2026, 9, 25) },
  { id: "sup2", subject: "نەتوانرا وێنەی گەشت باربکرێت", category: "گەشتەکان", status: "resolved", createdAt: ymd(2026, 9, 10), lastUpdate: ymd(2026, 9, 12) },
  { id: "sup3", subject: "پرسیار سەبارەت بە پشتڕاستکردنەوەی بانک", category: "پشتڕاستکردنەوە", status: "open", createdAt: ymd(2026, 9, 26), lastUpdate: ymd(2026, 9, 26) },
];

export const SUPPORT_CATEGORIES = ["هەژمار", "پشتڕاستکردنەوە", "گەشتەکان", "حیجزەکان", "پارەدانەکان", "پارەدان", "تەکنیکی"];

/* ---------------------------------------------------------------------- */
/* Dashboard KPI helpers                                                  */
/* ---------------------------------------------------------------------- */
export function dashboardKpis() {
  const totalRevenueIqd = BOOKINGS.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.grossIqd, 0);
  const upcomingBookings = BOOKINGS.filter((b) => b.status === "upcoming" || b.status === "confirmed").length;
  const completedTrips = BOOKINGS.filter((b) => b.status === "completed").length;
  const reviews = getReviewsForAgency(AGENCY_ID);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : agency.rating;
  const pendingPayoutIqd = PAYOUTS.filter((p) => p.status === "pending" || p.status === "processing").reduce((s, p) => s + payoutBreakdown(p).netPayoutIqd, 0);
  return { totalRevenueIqd, upcomingBookings, completedTrips, avgRating, pendingPayoutIqd };
}

export function availableBalanceIqd() {
  return PAYOUTS.filter((p) => p.status === "paid").reduce((s, p) => s + payoutBreakdown(p).netPayoutIqd, 0) * 0.15;
}
export function pendingBalanceIqd() {
  return PAYOUTS.filter((p) => p.status === "pending" || p.status === "processing").reduce((s, p) => s + payoutBreakdown(p).netPayoutIqd, 0);
}
export function totalPaidOutIqd() {
  return PAYOUTS.filter((p) => p.status === "paid").reduce((s, p) => s + payoutBreakdown(p).netPayoutIqd, 0);
}

export { AGENCIES };
