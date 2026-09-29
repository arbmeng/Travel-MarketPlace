import { Link } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { EmptyState } from "@/components/ui/States";
import { StarIcon } from "@/components/icons";
import { MY_BOOKINGS, REVIEWS, TRIPS } from "@/data/mock";

export default function ReviewsPage() {
  const myTripIds = new Set(MY_BOOKINGS.map((b) => b.tripId));
  const myReviews = REVIEWS.filter((r) => r.tripId && myTripIds.has(r.tripId));

  const completedWithoutReview = MY_BOOKINGS.filter(
    (b) => b.status === "completed" && !myReviews.some((r) => r.tripId === b.tripId)
  );

  return (
    <div className="mx-auto max-w-(--breakpoint-md) px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-1 text-2xl font-extrabold text-(--color-text-primary)">هەڵسەنگاندنەکانم</h1>
      <p className="mb-6 text-(--color-text-secondary)">هەڵسەنگاندنی نووسراوت لێرەیە.</p>

      {completedWithoutReview.length > 0 && (
        <div className="mb-8 flex flex-col gap-3 rounded-(--radius-lg) border border-dashed border-(--color-primary-light) bg-(--color-primary-50) p-5">
          <h2 className="font-bold text-(--color-text-primary)">چاوەڕوانی هەڵسەنگاندنن</h2>
          {completedWithoutReview.map((b) => {
            const trip = TRIPS.find((t) => t.id === b.tripId);
            if (!trip) return null;
            return (
              <div key={b.id} className="flex items-center justify-between gap-3 rounded-(--radius-md) bg-(--color-surface) p-3">
                <div className="flex items-center gap-3">
                  <img src={trip.images[0]} alt={trip.title} className="size-12 rounded-(--radius-sm) object-cover" />
                  <p className="text-sm font-semibold text-(--color-text-primary)">{trip.title}</p>
                </div>
                <Link to={`/account/trips/${b.id}/review`} className={buttonClassName("secondary", "sm")}>
                  هەڵسەنگاندن بنووسە
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {myReviews.length === 0 ? (
        <EmptyState
          icon={<StarIcon className="size-7" />}
          title="هێشتا هیچ هەڵسەنگاندنێکت نەنووسیوە"
          description="دوای تەواوبوونی گەشتەکانت، دەتوانیت ئەزموونەکەت هاوبەش بکەیت."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {myReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
