import {
  AnimeCard,
  ContentRow,
  HeroCarousel,
  MangaCard,
} from "@/components";
import {
  getFeaturedHeroItems,
  getTrendingAnime,
  getLatestManga,
  getAiringAnime,
} from "@/lib/data-loader";

export const revalidate = 300; // Cache and revalidate every 5 minutes

export default async function HomePage() {
  const [heroItems, trendingAnime, latestManga, airingAnime] = await Promise.all([
    getFeaturedHeroItems(),
    getTrendingAnime(12),
    getLatestManga(12),
    getAiringAnime(12),
  ]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Featured Titles Hero Carousel from MAL */}
      <HeroCarousel items={heroItems} />

      {/* Trending Anime Horizontal Row */}
      <ContentRow
        title="Trending Anime"
        subtitle="Live community ranking & most watched"
        viewAllHref="/browse?type=ANIME"
      >
        {trendingAnime.map((anime) => (
          <AnimeCard key={anime.id} item={anime} />
        ))}
      </ContentRow>

      {/* Latest Manga & Manhwa Updates Row */}
      <ContentRow
        title="Top Rated Manga & Manhwa"
        subtitle="Global serialization highlights"
        viewAllHref="/browse?type=MANGA"
      >
        {latestManga.map((manga) => (
          <MangaCard key={manga.id} item={manga} />
        ))}
      </ContentRow>

      {/* Top Airing This Season Row */}
      <ContentRow
        title="Top Airing This Season"
        subtitle="Currently broadcasting weekly simulcasts"
        viewAllHref="/anime"
      >
        {airingAnime.map((anime) => (
          <AnimeCard key={`season-${anime.id}`} item={anime} />
        ))}
      </ContentRow>
    </div>
  );
}
