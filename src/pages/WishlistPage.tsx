import { useState } from "react";
import { Link } from "react-router-dom";
import { buttonClassName } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { TripCard } from "@/components/cards/TripCard";
import { HeartIcon, MapPinIcon, BriefcaseIcon } from "@/components/icons";
import { TRIPS } from "@/data/mock";
import { useAppState } from "@/state/AppState";

type TabKey = "trips" | "destinations" | "agencies";

export default function WishlistPage() {
  const { wishlist } = useAppState();
  const [tab, setTab] = useState<TabKey>("trips");

  const savedTrips = TRIPS.filter((t) => wishlist.has(t.id));

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">پاشەکەوتکراوەکان</h1>
        <p className="text-(--color-text-secondary)">ئەو گەشت، شوێن و ئەژانسانەی پاشەکەوتت کردووە.</p>
      </div>

      <Tabs
        className="mb-8"
        items={[
          { key: "trips", label: "گەشتەکان", count: savedTrips.length },
          { key: "destinations", label: "شوێنەکان" },
          { key: "agencies", label: "ئەژانسەکان" },
        ]}
        active={tab}
        onChange={(k) => setTab(k as TabKey)}
      />

      {tab === "trips" &&
        (savedTrips.length === 0 ? (
          <EmptyState
            icon={<HeartIcon className="size-7" />}
            title="هیچ گەشتێکت پاشەکەوت نەکردووە"
            description="گەشتەکانی دڵخوازت پاشەکەوت بکە بۆ ئەوەی بە ئاسانی بگەڕێیتەوە بۆیان."
            action={
              <Link to="/explore" className={buttonClassName("primary", "md")}>
                گەشتەکان بدۆزەرەوە
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedTrips.map((t) => (
              <TripCard key={t.id} trip={t} />
            ))}
          </div>
        ))}

      {tab === "destinations" && (
        <EmptyState
          icon={<MapPinIcon className="size-7" />}
          title="پاشەکەوتکردنی شوێن هێشتا بەردەست نییە"
          description="ئێستا دەتوانیت تەنها گەشتەکان پاشەکەوت بکەیت. پاشەکەوتکردنی شوێن بەم زووانە زیاد دەکرێت."
          action={
            <Link to="/destinations" className={buttonClassName("outline", "md")}>
              گەڕان بەناو شوێنەکان
            </Link>
          }
        />
      )}

      {tab === "agencies" && (
        <EmptyState
          icon={<BriefcaseIcon className="size-7" />}
          title="پاشەکەوتکردنی ئەژانس هێشتا بەردەست نییە"
          description="ئێستا دەتوانیت تەنها گەشتەکان پاشەکەوت بکەیت. پاشەکەوتکردنی ئەژانس بەم زووانە زیاد دەکرێت."
          action={
            <Link to="/agencies" className={buttonClassName("outline", "md")}>
              گەڕان بەناو ئەژانسەکان
            </Link>
          }
        />
      )}
    </div>
  );
}
