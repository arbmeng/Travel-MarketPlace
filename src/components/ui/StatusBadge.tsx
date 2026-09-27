import { Badge } from "@/components/ui/Badge";
import {
  BOOKING_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  TRIP_STATUS_LABELS,
  type BookingStatus,
  type PaymentStatus,
  type TripStatus,
} from "@/types";

const TRIP_TONE: Record<TripStatus, "neutral" | "primary" | "success" | "warning" | "error"> = {
  draft: "neutral",
  pending_review: "warning",
  published: "success",
  paused: "warning",
  sold_out: "error",
  expired: "neutral",
  rejected: "error",
};

const BOOKING_TONE: Record<BookingStatus, "neutral" | "primary" | "success" | "warning" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  paid: "success",
  upcoming: "primary",
  completed: "success",
  cancelled: "error",
  refunded: "neutral",
};

const PAYMENT_TONE: Record<PaymentStatus, "neutral" | "primary" | "success" | "warning" | "error"> = {
  pending: "warning",
  processing: "primary",
  paid: "success",
  failed: "error",
  refunded: "neutral",
  partially_refunded: "warning",
};

export function TripStatusBadge({ status }: { status: TripStatus }) {
  return <Badge tone={TRIP_TONE[status]}>{TRIP_STATUS_LABELS[status]}</Badge>;
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge tone={BOOKING_TONE[status]}>{BOOKING_STATUS_LABELS[status]}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge tone={PAYMENT_TONE[status]}>{PAYMENT_STATUS_LABELS[status]}</Badge>;
}
