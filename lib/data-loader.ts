import {
  fetchTopAnime,
  fetchTopManga,
  malNodeToAnimeItem,
  malNodeToMangaItem,
} from "@/lib/mal-api";
import {
  FEATURED_ITEMS,
  TRENDING_ANIME,
  LATEST_MANGA_UPDATES,
  type AnimeItem,
  type MangaUpdateItem,
  type FeaturedItem,
} from "@/lib/mock-data";

/**
 * Loads real Trending Anime from MAL API (falls back to local data if offline or no keys)
 */
export async function getTrendingAnime(limit = 12): Promise<AnimeItem[]> {
  try {
    const res = await fetchTopAnime("all", limit);
    if (res.data && res.data.length > 0) {
      return res.data.map((item) => malNodeToAnimeItem(item.node));
    }
  } catch (err) {
    console.warn("[DataLoader] Failed to fetch top anime from MAL, using fallback:", err);
  }
  return TRENDING_ANIME.slice(0, limit);
}

/**
 * Loads real Airing Seasonal Anime from MAL API
 */
export async function getAiringAnime(limit = 12): Promise<AnimeItem[]> {
  try {
    const res = await fetchTopAnime("airing", limit);
    if (res.data && res.data.length > 0) {
      return res.data.map((item) => malNodeToAnimeItem(item.node));
    }
  } catch (err) {
    console.warn("[DataLoader] Failed to fetch airing anime from MAL, using fallback:", err);
  }
  return TRENDING_ANIME.filter((a) => a.status === "AIRING").slice(0, limit);
}

/**
 * Loads real Upcoming Anime from MAL API
 */
export async function getUpcomingAnime(limit = 12): Promise<AnimeItem[]> {
  try {
    const res = await fetchTopAnime("upcoming", limit);
    if (res.data && res.data.length > 0) {
      return res.data.map((item) => malNodeToAnimeItem(item.node));
    }
  } catch (err) {
    console.warn("[DataLoader] Failed to fetch upcoming anime from MAL, using fallback:", err);
  }
  return TRENDING_ANIME.filter((a) => a.status === "UPCOMING").slice(0, limit);
}

/**
 * Loads real Manga and Manhwa from MAL API
 */
export async function getLatestManga(limit = 12): Promise<MangaUpdateItem[]> {
  try {
    const res = await fetchTopManga("manga", limit);
    if (res.data && res.data.length > 0) {
      return res.data.map((item) => malNodeToMangaItem(item.node, "MANGA"));
    }
  } catch (err) {
    console.warn("[DataLoader] Failed to fetch top manga from MAL, using fallback:", err);
  }
  return LATEST_MANGA_UPDATES.slice(0, limit);
}

/**
 * Loads real Manhwa Webtoons from MAL API
 */
export async function getTopManhwa(limit = 12): Promise<MangaUpdateItem[]> {
  try {
    const res = await fetchTopManga("manhwa", limit);
    if (res.data && res.data.length > 0) {
      return res.data.map((item) => malNodeToMangaItem(item.node, "MANHWA"));
    }
  } catch (err) {
    console.warn("[DataLoader] Failed to fetch manhwa from MAL, using fallback:", err);
  }
  return LATEST_MANGA_UPDATES.filter((m) => m.type === "MANHWA").slice(0, limit);
}

/**
 * Loads Featured Hero Carousel items powered by real MAL data
 */
export async function getFeaturedHeroItems(): Promise<FeaturedItem[]> {
  try {
    const res = await fetchTopAnime("bypopularity", 5);
    if (res.data && res.data.length >= 3) {
      return res.data.slice(0, 5).map((item, index) => {
        const node = item.node;
        const cover = node.main_picture?.large || node.main_picture?.medium || "";
        const slug = `anime/${node.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")}-${node.id}`;

        return {
          id: `hero-mal-${node.id}`,
          slug,
          title: node.title,
          type: "anime",
          bannerImage: cover,
          coverImage: cover,
          synopsis: node.synopsis || "Watch the latest episodes in ultra-high definition.",
          genres: node.genres && node.genres.length > 0 ? node.genres.map((g) => g.name) : ["Action", "Adventure"],
          score: node.mean || 9.0,
          episodesOrChapters: `${node.num_episodes || 24} Episodes`,
          seasonOrFormat: node.start_season ? `${node.start_season.season.toUpperCase()} ${node.start_season.year}` : "TV Series",
          year: node.start_season?.year || 2024,
          badge: index === 0 ? "#1 MOST POPULAR" : `#${index + 1} TRENDING`,
        };
      });
    }
  } catch (err) {
    console.warn("[DataLoader] Failed to fetch hero items from MAL, using fallback:", err);
  }
  return FEATURED_ITEMS;
}
