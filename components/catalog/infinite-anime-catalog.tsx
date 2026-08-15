"use client";

import { useState } from "react";
import { AnimeCard } from "@/components/anime-card";
import type { AnimeItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface InfiniteAnimeCatalogProps {
  initialItems: AnimeItem[];
}

const CATEGORIES = [
  { label: "All Top Rated", value: "all" },
  { label: "Top Airing", value: "airing" },
  { label: "Most Popular", value: "bypopularity" },
  { label: "Top Movies", value: "movie" },
  { label: "Most Anticipated", value: "upcoming" },
] as const;

export function InfiniteAnimeCatalog({ initialItems }: InfiniteAnimeCatalogProps) {
  const [items, setItems] = useState<AnimeItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [offset, setOffset] = useState(initialItems.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleCategoryChange = async (cat: string) => {
    if (cat === selectedCategory || loading) return;
    setSelectedCategory(cat);
    setLoading(true);
    setOffset(0);

    try {
      const res = await fetch(`/api/mal/top-anime?ranking_type=${cat}&limit=24&offset=0`);
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
        setOffset(24);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Failed to fetch category:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/mal/top-anime?ranking_type=${selectedCategory}&limit=24&offset=${offset}`
      );
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setItems((prev) => [...prev, ...data.items]);
        setOffset((prev) => prev + data.items.length);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more anime:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => handleCategoryChange(cat.value)}
            disabled={loading}
            className={cn(
              "px-4 py-2 rounded-sm border font-medium text-14 transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent",
              selectedCategory === cat.value
                ? "bg-accent border-accent text-white font-semibold shadow-sm"
                : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border-strong"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Counter Header */}
      <div className="flex items-center justify-between">
        <span className="text-14 text-text-muted font-medium">
          Showing <strong className="text-text-primary">{items.length}</strong> Titles from Global MyAnimeList Catalog
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {items.map((anime, index) => (
          <AnimeCard
            key={`${anime.id}-${index}`}
            item={anime}
            className="w-full"
          />
        ))}
      </div>

      {/* Load More Button & Infinite Action */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 gap-3">
        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 rounded-md bg-surface-elevated border border-border hover:border-accent hover:bg-surface-active text-text-primary font-semibold text-14 transition-all duration-fast flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span>Loading more titles from MyAnimeList...</span>
              </>
            ) : (
              <>
                <span>Load More Anime (+24)</span>
                <span className="text-12 font-mono text-accent">↓</span>
              </>
            )}
          </button>
        ) : (
          <div className="p-4 rounded-md bg-surface border border-border text-text-muted text-14 text-center">
            🎉 You have reached the end of this catalog section!
          </div>
        )}
      </div>
    </div>
  );
}
