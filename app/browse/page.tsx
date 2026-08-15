import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageView } from "@/components/search/search-page-view";

export const metadata: Metadata = {
  title: "Browse & Search Anime & Manga — KAIYO",
  description:
    "Explore, filter, and search the comprehensive catalog of anime, manga, and manhwa titles.",
};

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-14 text-text-muted">
          Loading catalog...
        </div>
      }
    >
      <SearchPageView />
    </Suspense>
  );
}
