export type TripCategory =
  | "nature"
  | "adventure"
  | "family"
  | "romantic"
  | "historical"
  | "camping"
  | "hiking"
  | "food"
  | "luxury";

export const TRIP_CATEGORY_LABELS: Record<TripCategory, string> = {
  nature: "سروشت",
  adventure: "ماجەرا",
  family: "خێزانی",
  romantic: "ڕۆمانسی",
  historical: "مێژوویی",
  camping: "کەمپینگ",
  hiking: "هەڵکشان",
  food: "خواردن",
  luxury: "لوکس",
};

export type Difficulty = "easy" | "moderate" | "hard";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "ئاسان",
  moderate: "مامناوەند",
  hard: "قورس",
};

export type TripStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "paused"
  | "sold_out"
  | "expired"
  | "rejected";

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  draft: "ڕەشنووس",
  pending_review: "چاوەڕوانی پێداچوونەوە",
  published: "بڵاوکراوەتەوە",
  paused: "وەستێنراوە",
  sold_out: "تەواو فرۆشراوە",
  expired: "بەسەرچووە",
  rejected: "ڕەتکراوەتەوە",
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "upcoming"
  | "completed"
  | "cancelled"
  | "refunded";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "چاوەڕوان",
  confirmed: "پشتڕاستکراوە",
  paid: "پارەدراوە",
  upcoming: "داهاتوو",
  completed: "تەواوبووە",
  cancelled: "هەڵوەشێنراوەتەوە",
  refunded: "پارە گەڕێندراوەتەوە",
};

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "چاوەڕوان",
  processing: "لە پرۆسەدایە",
  paid: "پارەدراوە",
  failed: "سەرکەوتوو نەبوو",
  refunded: "گەڕێندراوەتەوە",
  partially_refunded: "بەشێک گەڕێندراوەتەوە",
};

export type VerificationStatus = "pending" | "under_review" | "verified" | "rejected" | "needs_changes";

export interface Governorate {
  id: string;
  name: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  governorate: string;
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  images: string[];
  activities: string[];
  bestTimeToVisit: string;
  lat: number;
  lng: number;
  featured?: boolean;
}

export interface Agency {
  id: string;
  slug: string;
  name: string;
  logo: string;
  cover: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  location: string;
  tripCount: number;
  responseTime: string;
  languages: string[];
  yearsActive: number;
  tripsCompleted: number;
  description: string;
  phone: string;
  email: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  activities: string[];
  meals: string[];
  transportation: string;
  accommodation?: string;
}

export interface Trip {
  id: string;
  slug: string;
  title: string;
  destinationId: string;
  agencyId: string;
  category: TripCategory;
  images: string[];
  rating: number;
  reviewCount: number;
  duration: number; // days
  difficulty: Difficulty;
  minTravelers: number;
  maxTravelers: number;
  spotsRemaining: number;
  priceIqd: number;
  childPriceIqd?: number;
  privatePriceIqd?: number;
  languages: string[];
  transportation: string;
  accommodation: string;
  meals: string;
  nextAvailableDate: string;
  status: TripStatus;
  description: string;
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  meetingPoint: string;
  meetingInstructions: string;
  cancellationPolicy: {
    freeUntilDays: number;
    feePercentAfter: number;
  };
  requirements: string[];
  whatToBring: string[];
  familyFriendly?: boolean;
  privateAvailable?: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  tripId?: string;
  agencyId?: string;
  rating: number;
  categories: {
    organization: number;
    guide: number;
    transportation: number;
    accommodation: number;
    experience: number;
  };
  text: string;
  date: string;
  verified: boolean;
  photos?: string[];
  agencyResponse?: string;
}

export interface Traveler {
  fullName: string;
  phone: string;
  email: string;
  nationality: string;
  emergencyContact?: string;
  specialRequirements?: string;
}

export interface FeeLine {
  label: string;
  amountIqd: number;
  description?: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  tripId: string;
  agencyId: string;
  date: string;
  travelers: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  subtotalIqd: number;
  discountIqd: number;
  platformFeeIqd: number;
  paymentFeeIqd: number;
  totalIqd: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  category: "booking" | "reminder" | "message" | "promotion" | "wishlist" | "system";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  agencyId: string;
  tripId?: string;
  bookingId?: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  messages: {
    id: string;
    from: "traveler" | "agency";
    text: string;
    at: string;
  }[];
}
