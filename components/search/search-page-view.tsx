"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AnimeCard,
  MangaCard,
  SearchIcon,
  XIcon,
} from "@/components";
import {
  ALL_CATALOG_ITEMS,
  type CatalogItem,
} from "@/lib/mock-data";
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

  // Search input state with debouncing
  const initialQuery = searchParams.get("q") || "";
  const initialGenre = searchParams.get("genre");

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>("score-desc");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    ...INITIAL_FILTERS,
    genres: initialGenre ? [initialGenre] : [],
  });

  // Debounce query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Synchronize URL query params if needed
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (filters.genres.length > 0) params.set("genre", filters.genres[0]);
    const queryString = params.toString();
    const newPath = queryString ? `/browse?${queryString}` : "/browse";
    router.replace(newPath, { scroll: false });
  }, [debouncedQuery, filters.genres, router]);

  // Active filter count
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

  // Filtered & Sorted Results
  const filteredItems = useMemo(() => {
    return ALL_CATALOG_ITEMS.filter((item: CatalogItem) => {
      // 1. Text Search query (Title / Japanese title / Synopsis / Genre)
      if (debouncedQuery.trim()) {
        const q = debouncedQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchJap = item.japaneseTitle?.toLowerCase().includes(q);
        const matchGenre = item.genres.some((g) => g.toLowerCase().includes(q));
        if (!matchTitle && !matchJap && !matchGenre) {
          return false;
        }
      }

      // 2. Media Type filter
      if (filters.type !== "all") {
        if (filters.type === "anime" && item.mediaType !== "anime") return false;
        if (filters.type === "manga" && item.mediaType !== "manga") return false;
        if (filters.type === "manhwa" && item.mediaType !== "manhwa") return false;
      }

      // 3. Genre filter (must match all selected genres)
      if (filters.genres.length > 0) {
        const hasAllGenres = filters.genres.every((g) => item.genres.includes(g));
        if (!hasAllGenres) return false;
      }

      // 4. Status filter
      if (filters.status !== "all") {
        if (filters.status === "airing-ongoing") {
          if (item.status !== "AIRING" && item.status !== "ONGOING") return false;
        } else if (filters.status === "completed") {
          if (item.status !== "FINISHED" && item.status !== "COMPLETED") return false;
        } else if (filters.status === "upcoming") {
          if (item.status !== "UPCOMING") return false;
        }
      }

      // 5. Year filter
      if (filters.year !== "All") {
        if (filters.year === "Older") {
          if (item.year >= 2022) return false;
        } else {
          if (item.year.toString() !== filters.year) return false;
        }
      }

      // 6. Minimum Rating
      if (filters.minRating > 0 && item.score < filters.minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "score-desc") return b.score - a.score;
      if (sortBy === "year-desc") return b.year - a.year;
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [debouncedQuery, filters, sortBy]);

  return (
    <div className="flex flex-col gap-6 max-w-container mx-auto pb-12">
      {/* =========================================================================
          TOP SEARCH BAR & HEADER
          ========================================================================= */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-4 rounded-md bg-surface border border-border">
        {/* Search Input with Debounce */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search anime, manga, manhwa, genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort selector & Mobile Filter trigger */}
        <div className="flex items-center gap-2">
          {/* Mobile filter button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-sm bg-surface-elevated border border-border text-14 font-medium text-text-secondary"
          >
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-accent text-white font-mono text-12">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-12 flex-shrink-0">
            <span className="hidden sm:inline text-text-muted font-medium">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-sm bg-surface-elevated border border-border text-14 font-medium text-text-primary focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="score-desc">Highest Rated ★</option>
              <option value="year-desc">Release Year (Newest)</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN LAYOUT: FILTER SIDEBAR + RESPONSIVE GRID RESULTS
          ========================================================================= */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Desktop Sidebar (Left) */}
        <SearchFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          activeFilterCount={activeFilterCount}
          className="hidden md:flex w-72 flex-shrink-0 sticky top-20"
        />

        {/* Mobile Drawer (Modal) */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-bg/85 backdrop-blur-sm md:hidden">
            <div
              className="flex-1 w-full"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="w-full max-h-[80vh] bg-surface-elevated border-t border-border rounded-t-xl overflow-y-auto p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-16 font-bold text-text-primary">Filters</h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="px-3 py-1 rounded-sm bg-accent text-white font-semibold text-12"
                >
                  Apply Filters
                </button>
              </div>
              <SearchFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </div>
        )}

        {/* Right Content Area: Results Count + Card Grid */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {/* Results Summary Header */}
          <div className="flex items-center justify-between text-12 text-text-muted">
            <span>
              Showing{" "}
              <strong className="text-text-primary font-bold">
                {filteredItems.length}
              </strong>{" "}
              {filteredItems.length === 1 ? "title" : "titles"}
              {debouncedQuery && (
                <>
                  {" "}
                  for &quot;
                  <span className="text-accent font-medium">
                    {debouncedQuery}
                  </span>
                  &quot;
                </>
              )}
            </span>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-accent hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Results Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {filteredItems.map((item) => {
                if (item.mediaType === "anime") {
                  return (
                    <AnimeCard
                      key={item.id}
                      item={{
                        id: item.id,
                        slug: item.slug,
                        title: item.title,
                        coverImage: item.coverImage,
                        score: item.score,
                        episodes: parseInt(item.episodesOrChapters, 10) || 12,
                        season: "Seasonal",
                        year: item.year,
                        genres: item.genres,
                        status: item.status === "AIRING" ? "AIRING" : "FINISHED",
                        format: item.format as "TV" | "MOVIE" | "OVA",
                      }}
                      className="w-full"
                    />
                  );
                }

                return (
                  <MangaCard
                    key={item.id}
                    item={{
                      id: item.id,
                      slug: item.slug,
                      title: item.title,
                      coverImage: item.coverImage,
                      latestChapter: item.episodesOrChapters,
                      timeAgo: "Recently",
                      type: item.mediaType === "manhwa" ? "MANHWA" : "MANGA",
                      genres: item.genres,
                      rating: item.score,
                    }}
                    variant="poster"
                    className="w-full"
                  />
                );
              })}
            </div>
          ) : (
            /* =========================================================================
                EMPTY STATE DESIGN
                ========================================================================= */
            <div className="p-12 rounded-md bg-surface border border-border text-center flex flex-col items-center justify-center gap-4 my-6">
              <div className="w-16 h-16 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-text-muted">
                <SearchIcon className="w-8 h-8" />
              </div>

              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-16 font-bold text-text-primary">
                  No anime or manga found
                </h3>
                <p className="text-14 text-text-secondary leading-relaxed">
                  We couldn&apos;t find any titles matching &quot;{debouncedQuery}&quot;
                  with your active filter criteria. Try adjusting keywords or
                  resetting filters.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-md bg-accent text-white font-semibold text-14 hover:bg-accent-hover transition-colors duration-fast"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
