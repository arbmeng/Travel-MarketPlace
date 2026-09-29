import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Layout, BareLayout } from "@/components/layout/Layout";
import { AgencyLayout } from "@/components/layout/AgencyLayout";

import HomePage from "@/pages/HomePage";
import ExplorePage from "@/pages/ExplorePage";
import SearchPage from "@/pages/SearchPage";
import DestinationsPage from "@/pages/DestinationsPage";
import DestinationDetailPage from "@/pages/DestinationDetailPage";
import TripDetailPage from "@/pages/TripDetailPage";
import AgenciesPage from "@/pages/AgenciesPage";
import AgencyProfilePage from "@/pages/AgencyProfilePage";
import MapExplorerPage from "@/pages/MapExplorerPage";
import WishlistPage from "@/pages/WishlistPage";
import SupportPage from "@/pages/SupportPage";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import OnboardingPage from "@/pages/auth/OnboardingPage";

import BookingFlowPage from "@/pages/booking/BookingFlowPage";
import ConfirmationPage from "@/pages/booking/ConfirmationPage";

import ProfilePage from "@/pages/account/ProfilePage";
import MyTripsPage from "@/pages/account/MyTripsPage";
import BookingDetailPage from "@/pages/account/BookingDetailPage";
import CancellationPage from "@/pages/account/CancellationPage";
import NotificationsPage from "@/pages/account/NotificationsPage";
import MessagesPage from "@/pages/account/MessagesPage";
import ReviewsPage from "@/pages/account/ReviewsPage";
import WriteReviewPage from "@/pages/account/WriteReviewPage";
import SettingsPage from "@/pages/account/SettingsPage";

import LegalPage from "@/pages/legal/LegalPage";

import AgencyLoginPage from "@/pages/agency/AgencyLoginPage";
import AgencyOnboardingPage from "@/pages/agency/AgencyOnboardingPage";
import AgencyPricingPage from "@/pages/agency/AgencyPricingPage";
import AgencyDashboardPage from "@/pages/agency/AgencyDashboardPage";
import AgencyTripsPage from "@/pages/agency/AgencyTripsPage";
import AgencyCreateTripPage from "@/pages/agency/AgencyCreateTripPage";
import AgencyCalendarPage from "@/pages/agency/AgencyCalendarPage";
import AgencyBookingsPage from "@/pages/agency/AgencyBookingsPage";
import AgencyBookingDetailPage from "@/pages/agency/AgencyBookingDetailPage";
import AgencyCustomersPage from "@/pages/agency/AgencyCustomersPage";
import AgencyCustomerDetailPage from "@/pages/agency/AgencyCustomerDetailPage";
import AgencyMessagesPage from "@/pages/agency/AgencyMessagesPage";
import AgencyReviewsPage from "@/pages/agency/AgencyReviewsPage";
import AgencyPayoutsPage from "@/pages/agency/AgencyPayoutsPage";
import AgencyPayoutDetailPage from "@/pages/agency/AgencyPayoutDetailPage";
import AgencyAnalyticsPage from "@/pages/agency/AgencyAnalyticsPage";
import AgencyProfileSettingsPage from "@/pages/agency/AgencyProfileSettingsPage";
import AgencySettingsPage from "@/pages/agency/AgencySettingsPage";
import AgencySupportPage from "@/pages/agency/AgencySupportPage";
import AgencyNotificationsPage from "@/pages/agency/AgencyNotificationsPage";

function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col items-center gap-3 px-4 py-32 text-center">
      <h1 className="text-3xl font-extrabold text-(--color-text-primary)">پەڕەکە نەدۆزرایەوە</h1>
      <p className="text-(--color-text-secondary)">ببورە، ئەم پەڕەیە بوونی نییە.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="destinations/:slug" element={<DestinationDetailPage />} />
          <Route path="trips/:slug" element={<TripDetailPage />} />
          <Route path="agencies" element={<AgenciesPage />} />
          <Route path="agencies/:slug" element={<AgencyProfilePage />} />
          <Route path="map" element={<MapExplorerPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="support" element={<SupportPage />} />

          <Route path="booking/:tripSlug" element={<BookingFlowPage />} />
          <Route path="booking/:tripSlug/confirmation" element={<ConfirmationPage />} />

          <Route path="account" element={<ProfilePage />} />
          <Route path="account/trips" element={<MyTripsPage />} />
          <Route path="account/trips/:bookingId" element={<BookingDetailPage />} />
          <Route path="account/trips/:bookingId/cancel" element={<CancellationPage />} />
          <Route path="account/trips/:bookingId/review" element={<WriteReviewPage />} />
          <Route path="account/notifications" element={<NotificationsPage />} />
          <Route path="account/messages" element={<MessagesPage />} />
          <Route path="account/messages/:conversationId" element={<MessagesPage />} />
          <Route path="account/reviews" element={<ReviewsPage />} />
          <Route path="account/settings" element={<SettingsPage />} />

          <Route path="legal/:slug" element={<LegalPage />} />
          <Route path="agency/pricing" element={<AgencyPricingPage />} />
        </Route>

        <Route element={<BareLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="agency/login" element={<AgencyLoginPage />} />
          <Route path="agency/onboarding" element={<AgencyOnboardingPage />} />
        </Route>

        <Route element={<AgencyLayout />}>
          <Route path="agency/dashboard" element={<AgencyDashboardPage />} />
          <Route path="agency/trips" element={<AgencyTripsPage />} />
          <Route path="agency/trips/new" element={<AgencyCreateTripPage />} />
          <Route path="agency/trips/:id/edit" element={<AgencyCreateTripPage />} />
          <Route path="agency/calendar" element={<AgencyCalendarPage />} />
          <Route path="agency/bookings" element={<AgencyBookingsPage />} />
          <Route path="agency/bookings/:id" element={<AgencyBookingDetailPage />} />
          <Route path="agency/customers" element={<AgencyCustomersPage />} />
          <Route path="agency/customers/:id" element={<AgencyCustomerDetailPage />} />
          <Route path="agency/messages" element={<AgencyMessagesPage />} />
          <Route path="agency/messages/:conversationId" element={<AgencyMessagesPage />} />
          <Route path="agency/reviews" element={<AgencyReviewsPage />} />
          <Route path="agency/payouts" element={<AgencyPayoutsPage />} />
          <Route path="agency/payouts/:id" element={<AgencyPayoutDetailPage />} />
          <Route path="agency/analytics" element={<AgencyAnalyticsPage />} />
          <Route path="agency/profile" element={<AgencyProfileSettingsPage />} />
          <Route path="agency/settings" element={<AgencySettingsPage />} />
          <Route path="agency/support" element={<AgencySupportPage />} />
          <Route path="agency/notifications" element={<AgencyNotificationsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

export default App;
