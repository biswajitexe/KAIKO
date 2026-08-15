import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageView } from "@/components/search/search-page-view";
import { MALAnimeSearch } from "@/components/mal-anime-search";

export const metadata: Metadata = {
  title: "Browse & Search Anime & Manga — KAIYO",
  description:
    "Explore, filter, and search the comprehensive catalog of anime, manga, and manhwa titles.",
};

export default function BrowsePage() {
  return (
    <div className="flex flex-col gap-8">
      <Suspense
        fallback={
          <div className="p-12 text-center text-14 text-text-muted">
            Loading catalog...
          </div>
        }
      >
        <SearchPageView />
      </Suspense>

      {/* Live MyAnimeList API Explorer */}
      <section className="max-w-container mx-auto w-full pb-12">
        <MALAnimeSearch />
      </section>
    </div>
  );
}
