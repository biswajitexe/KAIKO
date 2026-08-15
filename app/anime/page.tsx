import type { Metadata } from "next";
import { AnimeCard, ContentRow, InfiniteAnimeCatalog } from "@/components";
import {
  getAiringAnime,
  getTrendingAnime,
  getUpcomingAnime,
} from "@/lib/data-loader";

export const metadata: Metadata = {
  title: "Anime Catalog & Seasonal Streams — KAIYO",
  description: "Browse 25,000+ trending seasonal anime, top-rated TV series, movies, and upcoming premieres in ultra-high quality.",
};

export const revalidate = 300;

export default async function AnimeCatalogPage() {
  const [airingAnime, initialAllAnime, upcomingAnime] = await Promise.all([
    getAiringAnime(12),
    getTrendingAnime(24),
    getUpcomingAnime(12),
  ]);

  return (
    <div className="flex flex-col gap-8 max-w-container mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-lg bg-surface border border-border flex flex-col gap-2">
        <span className="text-12 font-mono uppercase tracking-widest text-accent font-semibold">
          GLOBAL STREAMING ARCHIVE
        </span>
        <h1 className="text-24 sm:text-32 font-bold text-text-primary">
          Explore All Anime Catalog
        </h1>
        <p className="text-14 text-text-secondary max-w-2xl">
          Browse thousands of seasonal broadcast anime, legendary classics, blockbuster movies, and OVAs with high-definition multi-source streaming.
        </p>
      </div>

      {/* Airing This Season Row */}
      <ContentRow
        title="Airing This Season"
        subtitle="Currently broadcasting weekly simulcasts"
        viewAllHref="/browse?type=ANIME"
      >
        {airingAnime.map((anime) => (
          <AnimeCard key={anime.id} item={anime} />
        ))}
      </ContentRow>

      {/* Infinite Paginated Grid for All Anime */}
      <section className="flex flex-col gap-4">
        <div className="border-b border-border pb-3">
          <h2 className="text-22 font-bold text-text-primary">
            Complete Anime Archive
          </h2>
          <p className="text-12 text-text-muted">
            Filter by Airing, Popularity, Movies, and load endless titles from KAIYO Archive
          </p>
        </div>

        <InfiniteAnimeCatalog initialItems={initialAllAnime} />
      </section>

      {/* Most Anticipated Upcoming */}
      <ContentRow
        title="Upcoming & Most Anticipated"
        subtitle="Blockbuster movies and next season premieres"
        viewAllHref="/browse?type=ANIME"
      >
        {upcomingAnime.map((anime) => (
          <AnimeCard key={anime.id} item={anime} />
        ))}
      </ContentRow>
    </div>
  );
}
