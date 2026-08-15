"use client";

import { useState, useEffect, useCallback } from "react";
import type { AnimeItem, MangaUpdateItem } from "@/lib/mock-data";

export interface WatchlistEntry {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  score: number;
  episodesOrChapters: string;
  mediaType: "anime" | "manga";
  addedAt: string;
}

const STORAGE_KEY = "kaiyo_user_watchlist";

export function getStoredWatchlist(): WatchlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredWatchlist(items: WatchlistEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("watchlist-updated"));
  } catch {
    // ignore
  }
}

export function toggleWatchlistItem(
  item: {
    id: string;
    slug: string;
    title: string;
    coverImage: string;
    score?: number;
    rating?: number;
    episodes?: number;
    latestChapter?: string;
  },
  mediaType: "anime" | "manga"
): boolean {
  const current = getStoredWatchlist();
  const exists = current.some((e) => e.id === item.id || e.slug === item.slug);

  if (exists) {
    const next = current.filter((e) => e.id !== item.id && e.slug !== item.slug);
    saveStoredWatchlist(next);
    return false;
  } else {
    const entry: WatchlistEntry = {
      id: item.id,
      slug: item.slug,
      title: item.title,
      coverImage: item.coverImage,
      score: item.score || item.rating || 8.5,
      episodesOrChapters:
        mediaType === "anime"
          ? `${item.episodes || 12} Episodes`
          : item.latestChapter || "Latest",
      mediaType,
      addedAt: new Date().toISOString(),
    };
    saveStoredWatchlist([entry, ...current]);
    return true;
  }
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setItems(getStoredWatchlist());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener("watchlist-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("watchlist-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const isSaved = useCallback(
    (idOrSlug: string) => {
      return items.some((i) => i.id === idOrSlug || i.slug === idOrSlug);
    },
    [items]
  );

  const toggle = useCallback((item: any, mediaType: "anime" | "manga") => {
    return toggleWatchlistItem(item, mediaType);
  }, []);

  const remove = useCallback(
    (idOrSlug: string) => {
      const next = items.filter((i) => i.id !== idOrSlug && i.slug !== idOrSlug);
      saveStoredWatchlist(next);
      setItems(next);
    },
    [items]
  );

  return {
    items,
    isLoaded,
    isSaved,
    toggle,
    remove,
  };
}
