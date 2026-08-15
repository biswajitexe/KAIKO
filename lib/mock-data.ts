export interface FeaturedItem {
  id: string;
  slug: string;
  title: string;
  japaneseTitle?: string;
  type: "anime" | "manga";
  bannerImage: string;
  coverImage: string;
  synopsis: string;
  genres: string[];
  score: number;
  episodesOrChapters: string;
  seasonOrFormat: string;
  year: number;
  badge?: string;
}

export interface AnimeItem {
  id: string;
  slug: string;
  title: string;
  japaneseTitle?: string;
  coverImage: string;
  bannerImage?: string;
  synopsis?: string;
  score: number;
  episodes: number;
  currentEpisode?: number;
  season: string;
  year: number;
  studio?: string;
  genres: string[];
  status: "AIRING" | "FINISHED" | "UPCOMING";
  format: "TV" | "MOVIE" | "OVA";
}

export interface MangaUpdateItem {
  id: string;
  slug: string;
  title: string;
  japaneseTitle?: string;
  coverImage: string;
  bannerImage?: string;
  synopsis?: string;
  latestChapter: string;
  totalChapters?: number;
  chapterTitle?: string;
  timeAgo: string;
  type: "MANGA" | "MANHWA" | "MANHUA";
  author?: string;
  status?: "ONGOING" | "COMPLETED" | "HIATUS";
  year?: number;
  genres: string[];
  rating: number;
  views?: string;
}

export interface EpisodeDetail {
  id: string;
  number: number;
  title: string;
  thumbnail: string;
  duration: string;
  airDate: string;
  description?: string;
  progressPercentage?: number;
}

export interface ChapterDetail {
  id: string;
  number: number;
  title?: string;
  releaseDate: string;
  scanGroup?: string;
  pageCount?: number;
  isRead?: boolean;
}

export interface ReviewItem {
  id: string;
  username: string;
  avatar: string;
  rating: number;
  date: string;
  review: string;
  helpfulCount: number;
}

export interface AnimeFullDetail extends AnimeItem {
  episodesList: EpisodeDetail[];
  reviews: ReviewItem[];
  related: AnimeItem[];
}

export interface MangaFullDetail extends MangaUpdateItem {
  chaptersList: ChapterDetail[];
  reviews: ReviewItem[];
  related: MangaUpdateItem[];
}

export interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  japaneseTitle?: string;
  mediaType: "anime" | "manga" | "manhwa";
  coverImage: string;
  synopsis: string;
  score: number;
  year: number;
  status: "AIRING" | "ONGOING" | "FINISHED" | "COMPLETED" | "UPCOMING";
  format: string;
  genres: string[];
  episodesOrChapters: string;
}

export interface ContinueMediaItem {
  id: string;
  slug: string;
  title: string;
  mediaType: "anime" | "manga";
  coverImage: string;
  currentNumber: number;
  totalCount: number;
  progressPercentage: number;
  lastAccessed: string;
  resumeHref: string;
}

export interface UserLibraryEntry {
  id: string;
  item: AnimeItem | MangaUpdateItem;
  mediaType: "anime" | "manga";
  userStatus: "watching-reading" | "completed" | "plan-to-watch";
  userRating?: number;
  progress: string;
  updatedAt: string;
}

export const GENRE_LIST = [
  "Action",
  "Adventure",
  "Fantasy",
  "Supernatural",
  "Sci-Fi",
  "Mystery",
  "Drama",
  "Comedy",
  "Sports",
  "Historical",
  "Psychological",
  "Romance",
  "Shounen",
];

export const FEATURED_ITEMS: FeaturedItem[] = [
  {
    id: "frieren-beyond-journeys-end",
    slug: "frieren-beyond-journeys-end",
    title: "Frieren: Beyond Journey's End",
    japaneseTitle: "葬送のフリーレン",
    type: "anime",
    bannerImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    synopsis: "An elf mage reflects on mortality, the passage of decades, and the profound bonds she forged with her companions after defeating the Demon King.",
    genres: ["Fantasy", "Adventure", "Drama"],
    score: 9.38,
    episodesOrChapters: "28 Episodes",
    seasonOrFormat: "Fall 2023",
    year: 2023,
    badge: "Trending #1",
  },
  {
    id: "solo-leveling-season-2",
    slug: "solo-leveling",
    title: "Solo Leveling: Arise from the Shadow",
    japaneseTitle: "나 혼자만 레벨업",
    type: "anime",
    bannerImage: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    synopsis: "After awakening absolute monarch powers in double dungeons, Sung Jinwoo ascends into world-class hunter tier as the Shadow Monarch.",
    genres: ["Action", "Fantasy", "Supernatural"],
    score: 8.84,
    episodesOrChapters: "13 Episodes",
    seasonOrFormat: "Winter 2025",
    year: 2025,
    badge: "Popular This Week",
  },
  {
    id: "jujutsu-kaisen-culling-game",
    slug: "jujutsu-kaisen",
    title: "Jujutsu Kaisen: Culling Game",
    japaneseTitle: "呪術廻戦",
    type: "anime",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop",
    synopsis: "The deadly ritual orchestrated by Noritoshi Kamo begins. Jujutsu sorcerers and ancient resurrected players collide inside sealed colonies.",
    genres: ["Action", "Dark Fantasy", "Supernatural"],
    score: 8.92,
    episodesOrChapters: "Season 3",
    seasonOrFormat: "Upcoming",
    year: 2025,
    badge: "Most Anticipated",
  },
  {
    id: "omniscient-readers-viewpoint",
    slug: "omniscient-readers-viewpoint",
    title: "Omniscient Reader's Viewpoint",
    japaneseTitle: "전지적 독자 시점",
    type: "manga",
    bannerImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
    synopsis: "Dokja was an average office worker whose sole interest was reading web novels. When the world transforms into the novel's apocalypse, he alone knows the ending.",
    genres: ["Action", "Sci-Fi", "Supernatural"],
    score: 9.15,
    episodesOrChapters: "Chapter 238",
    seasonOrFormat: "Weekly Updates",
    year: 2024,
    badge: "Top Manhwa",
  },
];

export const TRENDING_ANIME: AnimeItem[] = [
  {
    id: "frieren",
    slug: "frieren-beyond-journeys-end",
    title: "Frieren: Beyond Journey's End",
    japaneseTitle: "葬送のフリーレン",
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop",
    synopsis: "Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But with the great struggle over, they must all go their separate ways to live a quiet life. But as an elf, Frieren, who is nearly immortal, will long outlive the rest of her former party.",
    score: 9.38,
    episodes: 28,
    season: "Fall",
    year: 2023,
    studio: "Madhouse",
    genres: ["Fantasy", "Adventure", "Drama"],
    status: "FINISHED",
    format: "TV",
  },
  {
    id: "solo-leveling",
    slug: "solo-leveling",
    title: "Solo Leveling: Season 2",
    japaneseTitle: "나 혼자만 레벨업",
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop",
    synopsis: "They say whatever doesn’t kill you makes you stronger, but that’s not the case for the world’s weakest hunter Sung Jinwoo. After being brutally slaughtered by monsters in a high-ranking dungeon, Jinwoo came back with the System, a program only he can see.",
    score: 8.84,
    episodes: 13,
    currentEpisode: 8,
    season: "Winter",
    year: 2025,
    studio: "A-1 Pictures",
    genres: ["Action", "Fantasy", "Supernatural"],
    status: "AIRING",
    format: "TV",
  },
  {
    id: "demon-slayer-infinity-castle",
    slug: "demon-slayer-infinity-castle",
    title: "Demon Slayer: Infinity Castle Arc",
    japaneseTitle: "鬼滅の刃 無限城編",
    coverImage: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1920&auto=format&fit=crop",
    synopsis: "The Demon Slayer Corps plunges into the terrifying, dimension-bending Infinity Castle for the definitive showdown against Muzan Kibutsuji and the Upper Moon demons.",
    score: 9.02,
    episodes: 1,
    season: "Movie Trilogy",
    year: 2025,
    studio: "ufotable",
    genres: ["Action", "Historical", "Supernatural"],
    status: "UPCOMING",
    format: "MOVIE",
  },
  {
    id: "chainsaw-man-reze",
    slug: "chainsaw-man-reze-arc",
    title: "Chainsaw Man: Reze Arc Movie",
    japaneseTitle: "チェンソーマン レゼ篇",
    coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
    synopsis: "Denji encounters the mysterious and charming Reze at a local café, but her sudden appearance drags him into an explosive confrontation with international devil conspirators.",
    score: 8.95,
    episodes: 1,
    season: "Movie",
    year: 2025,
    studio: "MAPPA",
    genres: ["Action", "Supernatural", "Romance"],
    status: "UPCOMING",
    format: "MOVIE",
  },
  {
    id: "dandadan",
    slug: "dandadan",
    title: "DanDaDan Season 1",
    japaneseTitle: "ダンダダン",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1920&auto=format&fit=crop",
    synopsis: "Momo Ayase strikes up an unusual friendship with the school's UFO fanatic, whom she nicknames 'Okarun' because he has a name that shouldn't be said aloud. While Momo believes in spirits, she thinks aliens are utter nonsense.",
    score: 8.68,
    episodes: 12,
    season: "Fall",
    year: 2024,
    studio: "Science SARU",
    genres: ["Supernatural", "Sci-Fi", "Comedy"],
    status: "FINISHED",
    format: "TV",
  },
  {
    id: "apothecary-diaries-s2",
    slug: "the-apothecary-diaries-season-2",
    title: "The Apothecary Diaries Season 2",
    japaneseTitle: "薬屋のひとりごと",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop",
    synopsis: "Maomao continues unraveling insidious palace mysteries, court poisonings, and political assassinations utilizing her vast pharmacological genius.",
    score: 8.91,
    episodes: 24,
    currentEpisode: 6,
    season: "Winter",
    year: 2025,
    studio: "TOHO animation STUDIO / OLM",
    genres: ["Mystery", "Historical", "Drama"],
    status: "AIRING",
    format: "TV",
  },
  {
    id: "blue-lock-vs-u20",
    slug: "blue-lock-vs-u20-japan",
    title: "Blue Lock: Vs. U-20 Japan",
    japaneseTitle: "ブルーロック",
    coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
    score: 8.35,
    episodes: 14,
    season: "Fall",
    year: 2024,
    studio: "Eight Bit",
    genres: ["Sports", "Psychological"],
    status: "FINISHED",
    format: "TV",
  },
  {
    id: "bleach-thousand-year-blood-war",
    slug: "bleach-thousand-year-blood-war-part-3",
    title: "Bleach: Thousand-Year Blood War Pt. 3",
    japaneseTitle: "BLEACH 千年血戦篇",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
    score: 8.89,
    episodes: 13,
    season: "Fall",
    year: 2024,
    studio: "Studio Pierrot",
    genres: ["Action", "Supernatural"],
    status: "FINISHED",
    format: "TV",
  },
];

export const LATEST_MANGA_UPDATES: MangaUpdateItem[] = [
  {
    id: "orv",
    slug: "omniscient-readers-viewpoint",
    title: "Omniscient Reader's Viewpoint",
    japaneseTitle: "전지적 독자 시점",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop",
    synopsis: "Kim Dokja does not consider himself the protagonist of his life. He was the sole reader of an obscure web novel titled 'Three Ways to Survive the Apocalypse'. When the novel turns into real life, his knowledge becomes the only beacon.",
    latestChapter: "Ch. 238",
    totalChapters: 238,
    chapterTitle: "The Incarnation of Giant Body",
    timeAgo: "22m ago",
    type: "MANHWA",
    author: "sing N song / Redice Studio",
    year: 2024,
    status: "ONGOING",
    genres: ["Action", "Fantasy", "Sci-Fi"],
    rating: 9.4,
    views: "1.4M",
  },
  {
    id: "jujutsu-kaisen-manga",
    slug: "jujutsu-kaisen-manga",
    title: "Jujutsu Kaisen",
    japaneseTitle: "呪術廻戦",
    coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
    synopsis: "Yuuji Itadori is a high schooler who swallows a cursed talisman—the rotting finger of Sukuna—and joins Tokyo Metropolitan Magic Technical College to locate the remaining fingers.",
    latestChapter: "Ch. 271 (Final)",
    totalChapters: 271,
    chapterTitle: "From Now On",
    timeAgo: "1h ago",
    type: "MANGA",
    author: "Gege Akutami",
    year: 2024,
    status: "COMPLETED",
    genres: ["Supernatural", "Action", "Drama"],
    rating: 9.1,
    views: "3.2M",
  },
  {
    id: "tower-of-god",
    slug: "tower-of-god",
    title: "Tower of God",
    japaneseTitle: "신의 탑",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop",
    synopsis: "What do you desire? Money and wealth? Honor and pride? Authority and power? Revenge? Or something that transcends them all? Whatever you desire is at the top of the Tower.",
    latestChapter: "Ch. 642",
    totalChapters: 642,
    chapterTitle: "The Sprout of Revolution",
    timeAgo: "3h ago",
    type: "MANHWA",
    author: "SIU",
    year: 2024,
    status: "ONGOING",
    genres: ["Adventure", "Fantasy", "Mystery"],
    rating: 9.2,
    views: "2.1M",
  },
  {
    id: "one-piece-manga",
    slug: "one-piece",
    title: "One Piece",
    japaneseTitle: "ONE PIECE",
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1920&auto=format&fit=crop",
    synopsis: "Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to be king of all pirates. With a course charted for the treacherous waters of the Grand Line, this is one captain who'll never drop anchor until he's claimed the greatest treasure on Earth.",
    latestChapter: "Ch. 1134",
    totalChapters: 1134,
    chapterTitle: "Elbaf: Kingdom of Giants",
    timeAgo: "5h ago",
    type: "MANGA",
    author: "Eiichiro Oda",
    year: 2025,
    status: "ONGOING",
    genres: ["Shounen", "Adventure", "Fantasy"],
    rating: 9.6,
    views: "5.8M",
  },
];

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "r1",
    username: "Kenshiro99",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop",
    rating: 10,
    date: "2 days ago",
    review: "An absolute masterclass in pacing, sound design, and emotional resonance. The philosophical questions about longevity and human mortality hit incredibly deep.",
    helpfulCount: 342,
  },
  {
    id: "r2",
    username: "AnimePurist",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120&auto=format&fit=crop",
    rating: 9.5,
    date: "1 week ago",
    review: "The animation during the magic combat sequences elevates the source material beyond expectations. Studio delivered pure gold.",
    helpfulCount: 189,
  },
  {
    id: "r3",
    username: "WebtoonExplorer",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=120&auto=format&fit=crop",
    rating: 9,
    date: "2 weeks ago",
    review: "Incredible adaptation fidelity. Highly recommended for fans of atmospheric worldbuilding and thoughtful character development.",
    helpfulCount: 97,
  },
];

export const ALL_CATALOG_ITEMS: CatalogItem[] = [
  ...TRENDING_ANIME.map((a) => ({
    id: `anime-${a.id}`,
    slug: a.slug,
    title: a.title,
    japaneseTitle: a.japaneseTitle,
    mediaType: "anime" as const,
    coverImage: a.coverImage,
    synopsis: a.synopsis || "",
    score: a.score,
    year: a.year,
    status: a.status,
    format: a.format,
    genres: a.genres,
    episodesOrChapters: `${a.episodes} Episodes`,
  })),
  ...LATEST_MANGA_UPDATES.map((m) => ({
    id: `manga-${m.id}`,
    slug: m.slug,
    title: m.title,
    japaneseTitle: m.japaneseTitle,
    mediaType: m.type === "MANHWA" ? ("manhwa" as const) : ("manga" as const),
    coverImage: m.coverImage,
    synopsis: m.synopsis || "",
    score: m.rating,
    year: m.year || 2024,
    status: m.status === "COMPLETED" ? ("COMPLETED" as const) : ("ONGOING" as const),
    format: m.type,
    genres: m.genres,
    episodesOrChapters: m.latestChapter,
  })),
];

// User Profile & Creator Information
export const MOCK_USER_PROFILE = {
  username: "zerox.exe",
  handle: "@biswajitexe",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=240&auto=format&fit=crop",
  bio: "Creator & Lead Software Architect of KAIYO Platform. Building high-performance streaming architectures, manga/manhwa readers, and modern media experiences.",
  joinDate: "Founder & Lead Developer • 2026",
  github: "https://github.com/biswajitexe",
  stats: {
    animeWatching: 12,
    animeCompleted: 248,
    animePlanToWatch: 65,
    totalEpisodesWatched: 3420,
    mangaReading: 18,
    mangaCompleted: 112,
    mangaPlanToRead: 45,
    totalChaptersRead: 6850,
  },
};

export const CONTINUE_MEDIA_LIST: ContinueMediaItem[] = [
  {
    id: "c1",
    slug: "solo-leveling",
    title: "Solo Leveling: Season 2",
    mediaType: "anime",
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    currentNumber: 8,
    totalCount: 13,
    progressPercentage: 68,
    lastAccessed: "2 hours ago",
    resumeHref: "/anime/solo-leveling/watch?ep=8",
  },
  {
    id: "c2",
    slug: "omniscient-readers-viewpoint",
    title: "Omniscient Reader's Viewpoint",
    mediaType: "manga",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
    currentNumber: 238,
    totalCount: 238,
    progressPercentage: 45,
    lastAccessed: "Yesterday",
    resumeHref: "/manga/omniscient-readers-viewpoint/read?ch=238&mode=vertical",
  },
  {
    id: "c3",
    slug: "frieren-beyond-journeys-end",
    title: "Frieren: Beyond Journey's End",
    mediaType: "anime",
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    currentNumber: 26,
    totalCount: 28,
    progressPercentage: 92,
    lastAccessed: "3 days ago",
    resumeHref: "/anime/frieren-beyond-journeys-end/watch?ep=26",
  },
  {
    id: "c4",
    slug: "the-apothecary-diaries-season-2",
    title: "The Apothecary Diaries Season 2",
    mediaType: "anime",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop",
    currentNumber: 6,
    totalCount: 24,
    progressPercentage: 30,
    lastAccessed: "5 days ago",
    resumeHref: "/anime/the-apothecary-diaries-season-2/watch?ep=6",
  },
];

export const USER_LIBRARY_ANIME: UserLibraryEntry[] = TRENDING_ANIME.map(
  (anime, idx) => ({
    id: `lib-anime-${anime.id}`,
    item: anime,
    mediaType: "anime",
    userStatus:
      idx < 3
        ? "watching-reading"
        : idx < 6
        ? "completed"
        : "plan-to-watch",
    userRating: idx < 6 ? 9 + (idx % 2 === 0 ? 0.5 : 0) : undefined,
    progress:
      idx < 3
        ? `EP ${anime.currentEpisode || 1} / ${anime.episodes}`
        : `${anime.episodes} / ${anime.episodes}`,
    updatedAt: `${idx + 1}d ago`,
  })
);

export const USER_LIBRARY_MANGA: UserLibraryEntry[] = LATEST_MANGA_UPDATES.map(
  (manga, idx) => ({
    id: `lib-manga-${manga.id}`,
    item: manga,
    mediaType: "manga",
    userStatus:
      idx < 2
        ? "watching-reading"
        : idx < 3
        ? "completed"
        : "plan-to-watch",
    userRating: 9.5,
    progress: `Ch ${manga.latestChapter.replace(/[^0-9]/g, "")} / ${manga.totalChapters || 200}`,
    updatedAt: `${idx + 2}h ago`,
  })
);

export function getAnimeDetails(slug: string): AnimeFullDetail {
  const match = TRENDING_ANIME.find((a) => a.slug === slug) || TRENDING_ANIME[0];
  
  const episodesList: EpisodeDetail[] = Array.from(
    { length: match.episodes || 12 },
    (_, i) => {
      const epNum = i + 1;
      return {
        id: `ep-${epNum}`,
        number: epNum,
        title:
          epNum === 1
            ? "The End of the Journey"
            : epNum === 2
            ? "It Didn't Have to Be Magic"
            : epNum === 3
            ? "Killing Magic"
            : `Episode ${epNum}: The Next Step`,
        thumbnail: match.coverImage,
        duration: "24m",
        airDate: `${2023 + Math.floor(i / 12)}-${((i % 12) + 1).toString().padStart(2, "0")}-15`,
        description: `Episode ${epNum} following the main characters as they progress deeper through the continent.`,
        progressPercentage: epNum === 1 ? 85 : epNum === 2 ? 30 : 0,
      };
    }
  );

  return {
    ...match,
    synopsis:
      match.synopsis ||
      "An extraordinary story exploring deep adventures, interpersonal bonds, and high-stakes supernatural trials.",
    episodesList,
    reviews: MOCK_REVIEWS,
    related: TRENDING_ANIME.filter((a) => a.id !== match.id).slice(0, 5),
  };
}

export function getMangaDetails(slug: string): MangaFullDetail {
  const match =
    LATEST_MANGA_UPDATES.find((m) => m.slug === slug) || LATEST_MANGA_UPDATES[0];

  const total = match.totalChapters || 150;
  const chaptersList: ChapterDetail[] = Array.from(
    { length: Math.min(total, 30) },
    (_, i) => {
      const chNum = total - i;
      return {
        id: `ch-${chNum}`,
        number: chNum,
        title: i === 0 && match.chapterTitle ? match.chapterTitle : undefined,
        releaseDate: i === 0 ? match.timeAgo : `${i + 1}d ago`,
        scanGroup: "Asura Scans / Flame Comics",
        pageCount: 42,
        isRead: i > 2, // earlier chapters marked read
      };
    }
  );

  return {
    ...match,
    synopsis:
      match.synopsis ||
      "An apocalyptic regression fantasy tracking the journey of an underdog who knows the secrets of the world.",
    chaptersList,
    reviews: MOCK_REVIEWS,
    related: LATEST_MANGA_UPDATES.filter((m) => m.id !== match.id).slice(0, 5),
  };
}
