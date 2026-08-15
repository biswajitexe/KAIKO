import type { Metadata } from "next";
import { MangaCard, ContentRow } from "@/components";
import { LATEST_MANGA_UPDATES } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Manga & Manhwa Webtoon Catalog — KAIYO",
  description: "Read the latest ongoing manga chapters, vertical-scroll manhwa webtoons, and top-rated serializations.",
};

export default function MangaCatalogPage() {
  const manhwaItems = LATEST_MANGA_UPDATES.filter((m) => m.type === "MANHWA");
  const mangaItems = LATEST_MANGA_UPDATES.filter((m) => m.type === "MANGA");

  return (
    <div className="flex flex-col gap-8 max-w-container mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-lg bg-surface border border-border flex flex-col gap-2">
        <span className="text-12 font-mono uppercase tracking-widest text-accent font-semibold">
          MANGA & MANHWA WEBTOONS
        </span>
        <h1 className="text-24 sm:text-32 font-bold text-text-primary">
          Explore Manga & Manhwa
        </h1>
        <p className="text-14 text-text-secondary max-w-2xl">
          Dive into continuous long-strip manhwa, classic weekly manga chapters, and webtoons with full-color reading experiences.
        </p>
      </div>

      {/* Top Korean Manhwa Webtoons */}
      <ContentRow
        title="Trending Korean Manhwa & Webtoons"
        subtitle="Full-color continuous vertical reading"
        viewAllHref="/browse"
      >
        {manhwaItems.map((manhwa) => (
          <MangaCard
            key={manhwa.id}
            item={manhwa}
            variant="poster"
          />
        ))}
      </ContentRow>

      {/* Latest Manga Chapter Releases Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-20 font-bold text-text-primary">
              All Manga & Manhwa Series ({LATEST_MANGA_UPDATES.length})
            </h2>
            <p className="text-12 text-text-muted">
              Updated hourly with high-definition scans and official translations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {LATEST_MANGA_UPDATES.map((manga) => (
            <MangaCard
              key={manga.id}
              item={manga}
              variant="poster"
              className="w-full"
            />
          ))}
        </div>
      </section>

      {/* Popular Japanese Manga */}
      <ContentRow
        title="Popular Japanese Manga"
        subtitle="Shounen, Dark Fantasy, and Action serializations"
        viewAllHref="/browse"
      >
        {mangaItems.map((manga) => (
          <MangaCard
            key={manga.id}
            item={manga}
            variant="list"
          />
        ))}
      </ContentRow>
    </div>
  );
}
