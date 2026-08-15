import type { Metadata } from "next";
import { MangaCard, ContentRow, InfiniteMangaCatalog } from "@/components";
import { getTopManhwa, getLatestManga } from "@/lib/data-loader";

export const metadata: Metadata = {
  title: "Manga & Manhwa Webtoon Catalog — KAIYO",
  description: "Read the latest ongoing manga chapters, vertical-scroll manhwa webtoons, and top-rated serializations.",
};

export const revalidate = 300;

export default async function MangaCatalogPage() {
  const [manhwaItems, allManga] = await Promise.all([
    getTopManhwa(12),
    getLatestManga(24),
  ]);

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
          Dive into continuous long-strip manhwa, classic weekly manga chapters, and webtoons with high-definition official releases.
        </p>
      </div>

      {/* Top Korean Manhwa Webtoons Row */}
      <ContentRow
        title="Trending Korean Manhwa & Webtoons"
        subtitle="Full-color continuous vertical reading"
        viewAllHref="/browse?type=MANHWA"
      >
        {manhwaItems.map((manhwa) => (
          <MangaCard
            key={manhwa.id}
            item={manhwa}
            variant="poster"
          />
        ))}
      </ContentRow>

      {/* Infinite Paginated Manga & Manhwa Grid */}
      <section className="flex flex-col gap-4">
        <div className="border-b border-border pb-3">
          <h2 className="text-22 font-bold text-text-primary">
            Complete Manga & Manhwa Catalog
          </h2>
          <p className="text-12 text-text-muted">
            Explore Japanese Manga, Korean Manhwa Webtoons, and top-rated serializations with live loading
          </p>
        </div>

        <InfiniteMangaCatalog initialItems={allManga} />
      </section>

      {/* Popular Japanese Manga Row */}
      <ContentRow
        title="Popular Japanese Manga"
        subtitle="Shounen, Dark Fantasy, and Action serializations"
        viewAllHref="/browse?type=MANGA"
      >
        {allManga.slice(0, 10).map((manga) => (
          <MangaCard
            key={`list-${manga.id}`}
            item={manga}
            variant="list"
          />
        ))}
      </ContentRow>
    </div>
  );
}
