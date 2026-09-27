// Configurable marketplace fee model. In production these rates come from the
// platform administrator's configuration, never hard-coded into a screen.
export const FEE_CONFIG = {
  platformCommissionPercent: 10, // charged to the agency, shown to travelers as transparency
  travelerServiceFeePercent: 5,
  paymentProcessingFeePercent: 2,
};

export interface PriceBreakdown {
  basePriceIqd: number;
  travelers: number;
  subtotalIqd: number;
  discountIqd: number;
  travelerServiceFeeIqd: number;
  paymentFeeIqd: number;
  totalIqd: number;
}

export function computeTravelerPrice(params: {
  basePriceIqd: number;
  travelers: number;
  discountIqd?: number;
}): PriceBreakdown {
  const { basePriceIqd, travelers, discountIqd = 0 } = params;
  const subtotalIqd = basePriceIqd * travelers;
  const afterDiscount = Math.max(subtotalIqd - discountIqd, 0);
  const travelerServiceFeeIqd = Math.round((afterDiscount * FEE_CONFIG.travelerServiceFeePercent) / 100);
  const paymentFeeIqd = Math.round(
    ((afterDiscount + travelerServiceFeeIqd) * FEE_CONFIG.paymentProcessingFeePercent) / 100
  );
  const totalIqd = afterDiscount + travelerServiceFeeIqd + paymentFeeIqd;
  return { basePriceIqd, travelers, subtotalIqd, discountIqd, travelerServiceFeeIqd, paymentFeeIqd, totalIqd };
}

export interface AgencyPayout {
  grossBookingIqd: number;
  platformCommissionIqd: number;
  paymentProcessingIqd: number;
  refundIqd: number;
  netPayoutIqd: number;
}

export function computeAgencyPayout(params: { grossBookingIqd: number; refundIqd?: number }): AgencyPayout {
  const { grossBookingIqd, refundIqd = 0 } = params;
  const platformCommissionIqd = Math.round((grossBookingIqd * FEE_CONFIG.platformCommissionPercent) / 100);
  const paymentProcessingIqd = Math.round((grossBookingIqd * FEE_CONFIG.paymentProcessingFeePercent) / 100);
  const netPayoutIqd = grossBookingIqd - platformCommissionIqd - paymentProcessingIqd - refundIqd;
  return { grossBookingIqd, platformCommissionIqd, paymentProcessingIqd, refundIqd, netPayoutIqd };
}

export function computeCancellationRefund(params: {
  paidIqd: number;
  daysUntilTrip: number;
  freeUntilDays: number;
  feePercentAfter: number;
}) {
  const { paidIqd, daysUntilTrip, freeUntilDays, feePercentAfter } = params;
  const isFree = daysUntilTrip >= freeUntilDays;
  const feeIqd = isFree ? 0 : Math.round((paidIqd * feePercentAfter) / 100);
  const refundIqd = paidIqd - feeIqd;
  return { isFree, feeIqd, refundIqd };
}
