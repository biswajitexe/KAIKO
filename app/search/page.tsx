import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageView } from "@/components/search/search-page-view";

export const metadata: Metadata = {
  title: "Search Catalog — KAIYO",
  description: "Search all anime, manga, and manhwa titles.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-14 text-text-muted">
          Searching catalog...
        </div>
      }
    >
      <SearchPageView />
    </Suspense>
  );
}
