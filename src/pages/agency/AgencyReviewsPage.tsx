import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/Rating";
import { RatingDistribution } from "@/components/cards/ReviewCard";
import { Textarea } from "@/components/ui/Input";
import { Button, buttonClassName } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { getReviewsForAgency } from "@/data/mock";
import { AGENCY_ID } from "@/data/agencyMock";

export default function AgencyReviewsPage() {
  const baseReviews = getReviewsForAgency(AGENCY_ID);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [openReply, setOpenReply] = useState<string | null>(null);
  const { push } = useToast();

  function submitReply(id: string) {
    const text = drafts[id]?.trim();
    if (!text) return;
    setResponses((prev) => ({ ...prev, [id]: text }));
    setOpenReply(null);
    push("وەڵامەکەت بڵاو کرایەوە");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-(--color-text-primary)">هەڵسەنگاندنەکان</h1>
        <p className="mt-1 text-(--color-text-secondary)">بۆچوونی گەشتیارانت لەسەر گەشتەکانت ببینە و وەڵامیان بدەوە.</p>
      </div>

      <section className="rounded-(--radius-lg) bg-(--color-surface) p-6 shadow-(--shadow-subtle)">
        <RatingDistribution reviews={baseReviews} />
      </section>

      <div className="flex flex-col gap-4">
        {baseReviews.map((r) => {
          const response = responses[r.id] ?? r.agencyResponse;
          return (
            <div key={r.id} className="flex flex-col gap-3 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar src={r.authorAvatar} alt={r.authorName} size="sm" />
                  <div>
                    <p className="font-semibold text-(--color-text-primary)">{r.authorName}</p>
                    <p className="text-xs text-(--color-text-muted)">{r.date}</p>
                  </div>
                </div>
                {r.verified && <Badge tone="info">حیجزی پشتڕاستکراو</Badge>}
              </div>
              <RatingStars value={r.rating} size="sm" />
              <p className="text-sm leading-relaxed text-(--color-text-secondary)">{r.text}</p>

              {response && (
                <div className="rounded-(--radius-md) bg-(--color-surface-elevated) p-3 text-sm">
                  <p className="mb-1 font-semibold text-(--color-text-primary)">وەڵامی ئەژانس</p>
                  <p className="text-(--color-text-secondary)">{response}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {!response && (
                  <button
                    type="button"
                    onClick={() => setOpenReply(openReply === r.id ? null : r.id)}
                    className={buttonClassName("outline", "sm")}
                  >
                    وەڵامدانەوە
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => push("ڕاپۆرت نێردرا بۆ تیمی پشتگیری", "info")}
                  className="text-xs font-semibold text-(--color-text-muted) hover:text-(--color-error)"
                >
                  ڕاپۆرتکردنی ناڕەوا
                </button>
              </div>

              {openReply === r.id && (
                <div className="flex flex-col gap-2">
                  <Textarea
                    placeholder="وەڵامی ئەژانس بنووسە..."
                    value={drafts[r.id] ?? ""}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  />
                  <Button size="sm" className="self-start" onClick={() => submitReply(r.id)}>
                    ناردنی وەڵام
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
