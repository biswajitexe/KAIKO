import {
  fetchTopAnime,
  fetchTopManga,
  fetchAnimeList,
  getAnimeDetails as getMalAnimeDetails,
  malNodeToAnimeItem,
  malNodeToMangaItem,
  type MALAnimeDetail,
} from "@/lib/mal-api";
import {
  FEATURED_ITEMS,
  TRENDING_ANIME,
  LATEST_MANGA_UPDATES,
  getAnimeDetails as getMockAnimeDetails,
  getMangaDetails as getMockMangaDetails,
  type AnimeItem,
  type MangaUpdateItem,
  type FeaturedItem,
  type AnimeFullDetail,
  type MangaFullDetail,
  type EpisodeDetail,
  type ChapterDetail,
  type ReviewItem,
} from "@/lib/mock-data";

function cleanSlug(slug: string): string {
  return slug.replace(/^anime\//, "").replace(/^manga\//, "");
}

function extractMalIdFromSlug(slug: string): number | null {
  const cleaned = cleanSlug(slug);
  const parts = cleaned.split("-");
  const lastPart = parts[parts.length - 1];
  const parsed = parseInt(lastPart, 10);
  if (!isNaN(parsed) && parsed > 0) {
    return parsed;
  }
  return null;
}

export function cleanSynopsis(raw?: string): string {
  if (!raw) return "Watch and stream high-definition anime releases with official multi-language subtitles.";
  return raw
    .replace(/\[Written by MAL Rewrite\]/gi, "")
    .replace(/\(Source:[^)]*\)/gi, "")
    .replace(/\[Written by[^\]]*\]/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

/**
 * Loads real Trending Anime from MAL API (falls back to local data if offline)
 */
export async function getTrendingAnime(limit = 12): Promise<AnimeItem[]> {
  try {
    const res = await fetchTopAnime("all", limit);
    if (res.data && res.data.length > 0) {
      return res.data.map((item) => {
        const mapped = malNodeToAnimeItem(item.node);
        return {
          ...mapped,
          synopsis: cleanSynopsis(mapped.synopsis),
        };
      });
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
      return res.data.map((item) => {
        const mapped = malNodeToAnimeItem(item.node);
        return {
          ...mapped,
          synopsis: cleanSynopsis(mapped.synopsis),
        };
      });
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
      return res.data.map((item) => {
        const mapped = malNodeToAnimeItem(item.node);
        return {
          ...mapped,
          synopsis: cleanSynopsis(mapped.synopsis),
        };
      });
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
      return res.data.map((item) => {
        const mapped = malNodeToMangaItem(item.node, "MANGA");
        return {
          ...mapped,
          synopsis: cleanSynopsis(mapped.synopsis),
        };
      });
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
      return res.data.map((item) => {
        const mapped = malNodeToMangaItem(item.node, "MANHWA");
        return {
          ...mapped,
          synopsis: cleanSynopsis(mapped.synopsis),
        };
      });
    }
  } catch (err) {
    console.warn("[DataLoader] Failed to fetch manhwa from MAL, using fallback:", err);
  }
  return LATEST_MANGA_UPDATES.filter((m) => m.type === "MANHWA").slice(0, limit);
}

/**
 * Curated 4K Wide Wallpapers for top anime titles to prevent blurry portrait stretch
 */
const HIGH_RES_WALLPAPERS: Record<string, string> = {
  "frieren": "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop",
  "one-piece": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop",
  "solo-leveling": "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop",
  "jujutsu-kaisen": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
  "bleach": "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop",
  "attack-on-titan": "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1920&auto=format&fit=crop",
  "demon-slayer": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1920&auto=format&fit=crop",
};

/**
 * Loads Featured Hero Carousel items with clean synopses and high-definition imagery
 */
export async function getFeaturedHeroItems(): Promise<FeaturedItem[]> {
  try {
    const res = await fetchTopAnime("bypopularity", 5);
    if (res.data && res.data.length >= 3) {
      return res.data.slice(0, 5).map((item, index) => {
        const node = item.node;
        const cover = node.main_picture?.large || node.main_picture?.medium || "";
        const slug = `${node.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")}-${node.id}`;

        // Find high-res wide wallpaper if matched, or fallback to cover
        const key = Object.keys(HIGH_RES_WALLPAPERS).find((k) =>
          node.title.toLowerCase().includes(k)
        );
        const bannerImage = (key ? HIGH_RES_WALLPAPERS[key] : null) || cover;

        return {
          id: `hero-mal-${node.id}`,
          slug,
          title: node.title,
          type: "anime",
          bannerImage,
          coverImage: cover,
          synopsis: cleanSynopsis(node.synopsis),
          genres: node.genres && node.genres.length > 0 ? node.genres.map((g) => g.name) : ["Action", "Fantasy", "Adventure"],
          score: node.mean || 9.0,
          episodesOrChapters: `${node.num_episodes || 24} Episodes`,
          seasonOrFormat: node.start_season
            ? `${node.start_season.season.toUpperCase()} ${node.start_season.year} • TV SERIES`
            : "TV SERIES",
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

/**
 * Generates realistic episode list based on total episode count
 */
function generateEpisodesList(totalEpisodes: number, coverImage: string, title: string): EpisodeDetail[] {
  const count = Math.max(1, Math.min(totalEpisodes || 12, 100));
  return Array.from({ length: count }, (_, i) => {
    const epNum = i + 1;
    return {
      id: `ep-${epNum}`,
      number: epNum,
      title: totalEpisodes === 1 ? title : `${title} — Episode ${epNum}`,
      thumbnail: coverImage,
      duration: "24m",
      airDate: "Official Simulcast",
      description: `Watch Episode ${epNum} of ${title} in 1080p Full HD with English and multi-language subtitles.`,
      progressPercentage: epNum === 1 ? 65 : 0,
    };
  });
}

/**
 * Generates community reviews
 */
function generateReviews(score: number): ReviewItem[] {
  return [
    {
      id: "rev-1",
      username: "AnimeOtaku99",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
      rating: Math.min(10, Math.round(score)),
      date: "2 days ago",
      review: "The animation quality and pacing in this adaptation are phenomenal! One of the best series of the year without a doubt.",
      helpfulCount: 428,
    },
    {
      id: "rev-2",
      username: "ShadowMonarch",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
      rating: Math.max(8, Math.round(score - 0.5)),
      date: "1 week ago",
      review: "Faithful to the original source material. Sound design and voice acting are top-tier throughout every episode.",
      helpfulCount: 295,
    },
  ];
}

/**
 * Fetches full detail for any Anime by slug or ID from MAL API
 */
export async function getRealAnimeDetail(slug: string): Promise<AnimeFullDetail> {
  const cleaned = cleanSlug(slug);
  let malId = extractMalIdFromSlug(cleaned);

  // If slug is a simple string (e.g. "one-piece", "frieren"), search MAL to find the ID
  if (!malId) {
    try {
      const searchRes = await fetchAnimeList(cleaned.replace(/-/g, " "), 1);
      if (searchRes.data && searchRes.data.length > 0) {
        malId = searchRes.data[0].node.id;
      }
    } catch (e) {
      console.warn("MAL search by slug failed:", e);
    }
  }

  // Fetch from MAL if ID resolved
  if (malId) {
    try {
      const malDetail: MALAnimeDetail = await getMalAnimeDetails(malId);
      if (malDetail && malDetail.title) {
        const cover = malDetail.main_picture?.large || malDetail.main_picture?.medium || "";
        const baseItem = malNodeToAnimeItem(malDetail);

        const episodesList = generateEpisodesList(baseItem.episodes, cover, baseItem.title);
        const reviews = generateReviews(baseItem.score);

        // Convert recommendations to related items
        let related: AnimeItem[] = [];
        if (malDetail.recommendations && malDetail.recommendations.length > 0) {
          related = malDetail.recommendations.slice(0, 5).map((r) => malNodeToAnimeItem(r.node));
        } else if (malDetail.related_anime && malDetail.related_anime.length > 0) {
          related = malDetail.related_anime.slice(0, 5).map((r) => malNodeToAnimeItem(r.node));
        } else {
          related = TRENDING_ANIME.slice(0, 5);
        }

        return {
          ...baseItem,
          slug: cleaned,
          synopsis: cleanSynopsis(malDetail.synopsis),
          japaneseTitle: malDetail.alternative_titles?.ja || baseItem.title,
          episodesList,
          reviews,
          related,
        };
      }
    } catch (err) {
      console.warn(`[DataLoader] Failed to fetch real MAL anime details for ID ${malId}:`, err);
    }
  }

  // Fallback to local getter
  return getMockAnimeDetails(cleaned);
}

/**
 * Fetches full detail for any Manga by slug or ID from MAL API
 */
export async function getRealMangaDetail(slug: string): Promise<MangaFullDetail> {
  const cleaned = cleanSlug(slug);
  const malId = extractMalIdFromSlug(cleaned);

  if (malId) {
    try {
      const topManga = await fetchTopManga("all", 50);
      const match = topManga.data?.find((i) => i.node.id === malId);
      if (match) {
        const baseManga = malNodeToMangaItem(match.node);
        const chaptersCount = Math.max(1, Math.min(match.node.num_chapters || 100, 150));
        const chaptersList: ChapterDetail[] = Array.from({ length: chaptersCount }, (_, i) => ({
          id: `ch-${i + 1}`,
          number: i + 1,
          title: `Chapter ${i + 1}`,
          releaseDate: "Official Release",
          scanGroup: "Official",
          pageCount: 22,
          isRead: false,
        })).reverse();

        return {
          ...baseManga,
          slug: cleaned,
          synopsis: cleanSynopsis(match.node.synopsis),
          chaptersList,
          reviews: generateReviews(baseManga.rating),
          related: LATEST_MANGA_UPDATES.slice(0, 5),
        };
      }
    } catch (err) {
      console.warn(`[DataLoader] Failed to fetch real MAL manga details:`, err);
    }
  }

  return getMockMangaDetails(cleaned);
}
