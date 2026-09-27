import { Avatar } from "@/components/ui/Avatar";
import { RatingStars } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-3 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar src={review.authorAvatar} alt={review.authorName} size="sm" />
          <div>
            <p className="font-semibold text-(--color-text-primary)">{review.authorName}</p>
            <p className="text-xs text-(--color-text-muted)">{review.date}</p>
          </div>
        </div>
        {review.verified && <Badge tone="info">حیجزی پشتڕاستکراو</Badge>}
      </div>
      <RatingStars value={review.rating} size="sm" />
      <p className="text-sm leading-relaxed text-(--color-text-secondary)">{review.text}</p>
      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2">
          {review.photos.map((p, i) => (
            <img key={i} src={p} alt="" className="size-16 rounded-(--radius-sm) object-cover" />
          ))}
        </div>
      )}
      {review.agencyResponse && (
        <div className="rounded-(--radius-md) bg-(--color-surface-elevated) p-3 text-sm">
          <p className="mb-1 font-semibold text-(--color-text-primary)">وەڵامی ئەژانس</p>
          <p className="text-(--color-text-secondary)">{review.agencyResponse}</p>
        </div>
      )}
    </div>
  );
}

export function RatingDistribution({ reviews }: { reviews: Review[] }) {
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const counts = [5, 4, 3, 2, 1].map((star) => reviews.filter((r) => Math.round(r.rating) === star).length);
  const max = Math.max(...counts, 1);

  const categoryAverages = (["organization", "guide", "transportation", "accommodation", "experience"] as const).map(
    (key) => ({
      key,
      value: reviews.length ? reviews.reduce((s, r) => s + r.categories[key], 0) / reviews.length : 0,
    })
  );

  const categoryLabels: Record<string, string> = {
    organization: "ڕێکخستن",
    guide: "ڕابەری گەشت",
    transportation: "گواستنەوە",
    accommodation: "مانەوە",
    experience: "ئەزموونی گشتی",
  };

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <div className="mb-4 flex items-end gap-3">
          <span className="num text-4xl font-extrabold text-(--color-text-primary)">{avg.toFixed(1)}</span>
          <div>
            <RatingStars value={avg} />
            <p className="text-xs text-(--color-text-muted)">{reviews.length} هەڵسەنگاندن</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          {counts.map((count, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-(--color-text-muted)">
              <span className="w-3">{5 - i}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-(--radius-pill) bg-(--color-surface-elevated)">
                <div className="h-full rounded-(--radius-pill) bg-(--color-accent)" style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <span className="w-6 num">{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {categoryAverages.map((c) => (
          <div key={c.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-(--color-text-secondary)">{categoryLabels[c.key]}</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-(--radius-pill) bg-(--color-surface-elevated)">
                <div className="h-full rounded-(--radius-pill) bg-(--color-primary)" style={{ width: `${(c.value / 5) * 100}%` }} />
              </div>
              <span className="num w-6 font-semibold text-(--color-text-primary)">{c.value.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
