"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AnimeCard,
  MangaCard,
  SearchIcon,
  XIcon,
} from "@/components";
import type { AnimeItem, MangaUpdateItem } from "@/lib/mock-data";
import {
  SearchFilters,
  type FilterState,
} from "@/components/search/search-filters";
import { cn } from "@/lib/utils";

const INITIAL_FILTERS: FilterState = {
  type: "all",
  genres: [],
  status: "all",
  year: "All",
  minRating: 0,
};

type SortOption = "score-desc" | "year-desc" | "title-asc";

export function SearchPageView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const initialGenre = searchParams.get("genre");
  const initialType = (searchParams.get("type")?.toLowerCase() || "all") as FilterState["type"];

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>("score-desc");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    ...INITIAL_FILTERS,
    type: initialType,
    genres: initialGenre ? [initialGenre] : [],
  });

  const [liveAnimeResults, setLiveAnimeResults] = useState<AnimeItem[]>([]);
  const [liveMangaResults, setLiveMangaResults] = useState<MangaUpdateItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Synchronize URL query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (filters.genres.length > 0) params.set("genre", filters.genres[0]);
    if (filters.type !== "all") params.set("type", filters.type.toUpperCase());
    const queryString = params.toString();
    const newPath = queryString ? `/browse?${queryString}` : "/browse";
    router.replace(newPath, { scroll: false });
  }, [debouncedQuery, filters.genres, filters.type, router]);

  // Fetch real MAL data on query or filter type change
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function loadData() {
      try {
        if (debouncedQuery.trim()) {
          // Live search from MAL
          const res = await fetch(`/api/mal/search?q=${encodeURIComponent(debouncedQuery.trim())}&limit=30`);
          const data = await res.json();
          if (!isCancelled) {
            const rawNodes = data.data?.map((i: { node: any }) => i.node) || [];
            const animeMapped: AnimeItem[] = rawNodes.map((n: any) => ({
              id: `mal-${n.id}`,
              slug: `${n.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")}-${n.id}`,
              title: n.title,
              coverImage: n.main_picture?.large || n.main_picture?.medium || "",
              bannerImage: n.main_picture?.large || n.main_picture?.medium || "",
              synopsis: n.synopsis || "Watch with live MyAnimeList data.",
              score: n.mean || 8.0,
              episodes: n.num_episodes || 12,
              season: "TV Series",
              year: 2024,
              genres: n.genres ? n.genres.map((g: any) => g.name) : ["Action"],
              status: n.status === "currently_airing" ? "AIRING" : "FINISHED",
              format: n.media_type === "movie" ? "MOVIE" : "TV",
            }));
            setLiveAnimeResults(animeMapped);
            setLiveMangaResults([]);
          }
        } else {
          // Load top catalog ranking from MAL
          const [animeRes, mangaRes] = await Promise.all([
            fetch("/api/mal/top-anime?ranking_type=all&limit=24"),
            fetch("/api/mal/top-manga?ranking_type=manga&limit=24"),
          ]);
          const [animeData, mangaData] = await Promise.all([
            animeRes.json(),
            mangaRes.json(),
          ]);

          if (!isCancelled) {
            setLiveAnimeResults(animeData.items || []);
            setLiveMangaResults(mangaData.items || []);
          }
        }
      } catch (err) {
        console.error("Failed to load browse data:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.type !== "all") count++;
    if (filters.genres.length > 0) count += filters.genres.length;
    if (filters.status !== "all") count++;
    if (filters.year !== "All") count++;
    if (filters.minRating > 0) count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setQuery("");
  };

  // Combine and filter items based on user sidebar filters
  const filteredItems = useMemo(() => {
    let animeList = liveAnimeResults;
    let mangaList = liveMangaResults;

    if (filters.genres.length > 0) {
      animeList = animeList.filter((a) =>
        filters.genres.every((g) => a.genres.some((ag) => ag.toLowerCase().includes(g.toLowerCase())))
      );
      mangaList = mangaList.filter((m) =>
        filters.genres.every((g) => m.genres.some((mg) => mg.toLowerCase().includes(g.toLowerCase())))
      );
    }

    if (filters.minRating > 0) {
      animeList = animeList.filter((a) => a.score >= filters.minRating);
      mangaList = mangaList.filter((m) => m.rating >= filters.minRating);
    }

    if (filters.type === "anime") {
      return { anime: animeList, manga: [] };
    }
    if (filters.type === "manga" || filters.type === "manhwa") {
      return { anime: [], manga: mangaList };
    }
    return { anime: animeList, manga: mangaList };
  }, [liveAnimeResults, liveMangaResults, filters]);

  const totalResultsCount = filteredItems.anime.length + filteredItems.manga.length;

  return (
    <div className="flex flex-col gap-6 max-w-container mx-auto pb-12">
      {/* Top Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-4 rounded-md bg-surface border border-border">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search Anime & Manga
          </label>
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            id="search-input"
            type="text"
            placeholder="Search across 25,000+ anime & manga titles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-12 text-text-muted whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-primary focus:border-accent focus:outline-none"
            >
              <option value="score-desc">Highest Rated ★</option>
              <option value="year-desc">Release Date ↓</option>
              <option value="title-asc">Alphabetical A-Z</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-primary"
          >
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-accent text-white font-mono text-[10px]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex gap-8 items-start">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-20">
          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </aside>

        {/* Results Area */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-18 font-bold text-text-primary">
              {debouncedQuery ? (
                <>Search results for &ldquo;{debouncedQuery}&rdquo;</>
              ) : (
                <>Global Catalog ({totalResultsCount})</>
              )}
            </h1>
            {loading && (
              <div className="flex items-center gap-2 text-12 text-accent">
                <span className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span>Loading live MAL data...</span>
              </div>
            )}
          </div>

          {totalResultsCount === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center p-12 rounded-lg bg-surface border border-border text-center gap-3">
              <span className="text-32">🔍</span>
              <h3 className="text-16 font-bold text-text-primary">
                No titles found
              </h3>
              <p className="text-14 text-text-muted max-w-sm">
                Try searching for a different keyword like &ldquo;Naruto&rdquo;, &ldquo;Attack on Titan&rdquo;, or reset your filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-sm bg-accent text-white font-medium text-12 mt-2"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
              {filteredItems.anime.map((anime) => (
                <AnimeCard key={anime.id} item={anime} className="w-full" />
              ))}
              {filteredItems.manga.map((manga) => (
                <MangaCard key={manga.id} item={manga} variant="poster" className="w-full" />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
