import {
  AnimeCard,
  ContentRow,
  HeroCarousel,
  MangaCard,
} from "@/components";
import {
  FEATURED_ITEMS,
  LATEST_MANGA_UPDATES,
  TRENDING_ANIME,
} from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Featured Titles Hero Carousel */}
      <HeroCarousel items={FEATURED_ITEMS} />

      {/* Trending Anime Horizontal Row */}
      <ContentRow
        title="Trending Anime"
        subtitle="Most watched in the community this week"
        viewAllHref="/anime/trending"
      >
        {TRENDING_ANIME.map((anime) => (
          <AnimeCard key={anime.id} item={anime} />
        ))}
      </ContentRow>

      {/* Latest Manga & Manhwa Updates Row */}
      <ContentRow
        title="Latest Manga & Manhwa Updates"
        subtitle="New chapters released today"
        viewAllHref="/manga/latest"
      >
        {LATEST_MANGA_UPDATES.map((manga) => (
          <MangaCard key={manga.id} item={manga} />
        ))}
      </ContentRow>

      {/* Top Airing This Season Row */}
      <ContentRow
        title="Top Airing This Season"
        subtitle="Winter 2025 seasonal highlights"
        viewAllHref="/anime/season"
      >
        {TRENDING_ANIME.slice()
          .reverse()
          .map((anime) => (
            <AnimeCard key={`season-${anime.id}`} item={anime} />
          ))}
      </ContentRow>
    </div>
  );
}
