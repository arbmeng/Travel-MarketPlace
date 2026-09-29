import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { buttonClassName } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { SearchIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import { CUSTOMERS } from "@/data/agencyMock";

type SortKey = "recent" | "spend" | "bookings";

export default function AgencyCustomersPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  const customers = useMemo(() => {
    let list = CUSTOMERS.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));
    if (sort === "spend") list = [...list].sort((a, b) => b.totalSpentIqd - a.totalSpentIqd);
    if (sort === "bookings") list = [...list].sort((a, b) => b.bookingsCount - a.bookingsCount);
    if (sort === "recent") list = [...list].sort((a, b) => (a.lastTripDate < b.lastTripDate ? 1 : -1));
    return list;
  }, [query, sort]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-(--color-text-primary)">گەشتیارانت</h1>
        <p className="mt-1 text-(--color-text-secondary)">هەموو گەشتیارانی کە حیجزیان لەگەڵ ئەژانسەکەت کردووە.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-72">
          <Input placeholder="گەڕان بە ناوی گەشتیار" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(
            [
              ["recent", "دواتری"],
              ["spend", "زۆرترین خەرجی"],
              ["bookings", "زۆرترین حیجز"],
            ] as [SortKey, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSort(key)}
              className={`rounded-(--radius-pill) px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                sort === key ? "bg-(--color-primary) text-white" : "bg-(--color-surface-elevated) text-(--color-text-secondary)"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {customers.length === 0 ? (
        <EmptyState icon={<SearchIcon className="size-7" />} title="هیچ گەشتیارێک نەدۆزرایەوە" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => (
            <div key={c.id} className="flex flex-col gap-3 rounded-(--radius-lg) bg-(--color-surface) p-5 shadow-(--shadow-subtle)">
              <div className="flex items-center gap-3">
                <Avatar src={c.avatarUrl} alt={c.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-(--color-text-primary)">{c.name}</p>
                  <p className="truncate text-xs text-(--color-text-muted)">{c.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-(--radius-md) bg-(--color-surface-elevated) p-3 text-center">
                <Stat label="حیجز" value={String(c.bookingsCount)} />
                <Stat label="خەرجی" value={formatCurrency(c.totalSpentIqd)} small />
                <Stat label="هەڵسەنگاندن" value={String(c.reviewCount)} />
              </div>
              <p className="text-xs text-(--color-text-muted)">دوایین گەشت: {c.lastTripTitle} · {c.lastTripDate}</p>
              <Link to={`/agency/customers/${c.id}`} className={buttonClassName("outline", "sm")}>
                پڕۆفایل ببینە
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <p className={`num font-bold text-(--color-text-primary) ${small ? "text-xs" : "text-sm"}`}>{value}</p>
      <p className="text-[10px] text-(--color-text-muted)">{label}</p>
    </div>
  );
}
