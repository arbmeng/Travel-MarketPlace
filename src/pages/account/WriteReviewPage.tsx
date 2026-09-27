import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { StarIcon } from "@/components/icons";
import { MY_BOOKINGS, TRIPS, getAgencyById } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

type CategoryKey = keyof Review["categories"];

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  organization: "ڕێکخستن",
  guide: "ڕابەری گەشت",
  transportation: "گواستنەوە",
  accommodation: "مانەوە",
  experience: "ئەزموونی گشتی",
};

export default function WriteReviewPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { push } = useToast();

  const booking = MY_BOOKINGS.find((b) => b.id === bookingId);

  const [overall, setOverall] = useState(0);
  const [categories, setCategories] = useState<Record<CategoryKey, number>>({
    organization: 0,
    guide: 0,
    transportation: 0,
    accommodation: 0,
    experience: 0,
  });
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  if (!booking) {
    return (
      <div className="mx-auto max-w-(--breakpoint-md) px-4 py-24">
        <ErrorState
          title="ئەم حیجزە نەدۆزرایەوە"
          action={
            <Link to="/account/trips" className={buttonClassName("primary", "md")}>
              گەڕانەوە بۆ گەشتەکانم
            </Link>
          }
        />
      </div>
    );
  }

  const trip = TRIPS.find((t) => t.id === booking.tripId);
  const agency = getAgencyById(booking.agencyId);
  const canSubmit = overall > 0 && text.trim().length > 0;

  function handlePhotoAdd() {
    // Prototype-only placeholder — no real file upload.
    setPhotos((prev) => [...prev, `photo-${prev.length + 1}`]);
  }

  function submit() {
    push("هەڵسەنگاندنەکەت نێردرا، سوپاس!", "success");
    navigate("/account/reviews");
  }

  return (
    <div className="mx-auto max-w-(--breakpoint-sm) px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-1 text-2xl font-extrabold text-(--color-text-primary)">هەڵسەنگاندن بنووسە</h1>
      {trip && (
        <p className="mb-6 text-(--color-text-secondary)">
          {trip.title} · {agency?.name}
        </p>
      )}

      <div className="rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle) sm:p-7">
        {/* Overall rating */}
        <div className="mb-6 flex flex-col items-center gap-2 border-b border-(--color-border) pb-6 text-center">
          <p className="font-semibold text-(--color-text-primary)">هەڵسەنگاندنی گشتیت چۆنە؟</p>
          <StarPicker value={overall} onChange={setOverall} size="lg" />
        </div>

        {/* Category ratings */}
        <div className="mb-6 flex flex-col gap-4 border-b border-(--color-border) pb-6">
          <p className="font-semibold text-(--color-text-primary)">هەڵسەنگاندن بەپێی بەش</p>
          {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <span className="text-sm text-(--color-text-secondary)">{CATEGORY_LABELS[key]}</span>
              <StarPicker value={categories[key]} onChange={(v) => setCategories({ ...categories, [key]: v })} size="sm" />
            </div>
          ))}
        </div>

        {/* Text review */}
        <div className="mb-6 border-b border-(--color-border) pb-6">
          <Textarea
            label="ئەزموونەکەت بنووسە"
            required
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="چۆن گەشتەکەت بوو؟ چی زیاتر بەدڵت بوو؟"
          />
        </div>

        {/* Photo upload placeholder */}
        <div>
          <p className="mb-2 text-sm font-semibold text-(--color-text-primary)">
            وێنە زیاد بکە <span className="text-xs font-normal text-(--color-text-muted)">(ئیختیاری)</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {photos.map((p, i) => (
              <div key={i} className="flex size-20 items-center justify-center rounded-(--radius-md) bg-(--color-surface-elevated) text-xs text-(--color-text-muted)">
                وێنە {i + 1}
              </div>
            ))}
            <button
              type="button"
              onClick={handlePhotoAdd}
              className="flex size-20 flex-col items-center justify-center gap-1 rounded-(--radius-md) border border-dashed border-(--color-border) text-(--color-text-muted) transition-colors hover:border-(--color-primary-light) cursor-pointer"
            >
              <span className="text-xl leading-none">+</span>
              <span className="text-[11px]">زیادکردن</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button fullWidth disabled={!canSubmit} onClick={submit}>
          ناردنی هەڵسەنگاندن
        </Button>
      </div>
    </div>
  );
}

function StarPicker({ value, onChange, size = "md" }: { value: number; onChange: (v: number) => void; size?: "sm" | "lg" }) {
  const starSize = size === "lg" ? "size-9" : "size-6";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} ئەستێرە`} className="cursor-pointer">
          <StarIcon className={cn(starSize, n <= value ? "text-(--color-accent)" : "text-(--color-border)")} />
        </button>
      ))}
    </div>
  );
}
