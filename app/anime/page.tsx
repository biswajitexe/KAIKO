import type { Metadata } from "next";
import { AnimeCard, ContentRow } from "@/components";
import { TRENDING_ANIME } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Anime Catalog & Seasonal Streams — KAIYO",
  description: "Browse trending seasonal anime, top-rated TV series, movies, and upcoming premieres.",
};

export default function AnimeCatalogPage() {
  const airingAnime = TRENDING_ANIME.filter((a) => a.status === "AIRING");
  const upcomingAnime = TRENDING_ANIME.filter((a) => a.status === "UPCOMING");

  return (
    <div className="flex flex-col gap-8 max-w-container mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-lg bg-surface border border-border flex flex-col gap-2">
        <span className="text-12 font-mono uppercase tracking-widest text-accent font-semibold">
          ANIME ARCHIVE & SIMULCASTS
        </span>
        <h1 className="text-24 sm:text-32 font-bold text-text-primary">
          Explore All Anime
        </h1>
        <p className="text-14 text-text-secondary max-w-2xl">
          Watch seasonal broadcast anime, legendary classics, movies, and OVAs in ultra-high quality.
        </p>
      </div>

      {/* Airing This Season */}
      <ContentRow
        title="Airing This Season"
        subtitle="Currently broadcasting weekly simulcasts"
        viewAllHref="/browse"
      >
        {airingAnime.map((anime) => (
          <AnimeCard key={anime.id} item={anime} />
        ))}
      </ContentRow>

      {/* All Anime Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-20 font-bold text-text-primary">
              All Featured Anime ({TRENDING_ANIME.length})
            </h2>
            <p className="text-12 text-text-muted">
              Explore highest rated and trending TV series
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {TRENDING_ANIME.map((anime) => (
            <AnimeCard key={anime.id} item={anime} className="w-full" />
          ))}
        </div>
      </section>

      {/* Most Anticipated Upcoming */}
      <ContentRow
        title="Upcoming & Most Anticipated"
        subtitle="Blockbuster movies and next season premieres"
        viewAllHref="/browse"
      >
        {upcomingAnime.map((anime) => (
          <AnimeCard key={anime.id} item={anime} />
        ))}
      </ContentRow>
    </div>
  );
}
