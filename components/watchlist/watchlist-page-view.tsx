"use client";

import { useState } from "react";
import Link from "next/link";
import { useWatchlist } from "@/lib/watchlist-store";
import { PlayIcon, StarIcon, XIcon, PlusIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function WatchlistPageView() {
  const { items, isLoaded, remove } = useWatchlist();
  const [filter, setFilter] = useState<"all" | "anime" | "manga">("all");

  const filtered = items.filter((item) => {
    if (filter === "all") return true;
    return item.mediaType === filter;
  });

  return (
    <div className="flex flex-col gap-8 max-w-container mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-12 font-mono uppercase tracking-widest text-accent font-semibold">
            SAVED TITLES
          </span>
          <h1 className="text-24 sm:text-32 font-bold text-text-primary">
            My Watchlist ({items.length})
          </h1>
          <p className="text-14 text-text-secondary">
            Quickly jump back into your saved anime series, movies, and manga chapters.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-md bg-surface-elevated border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-sm text-12 font-medium transition-colors",
              filter === "all"
                ? "bg-accent text-white font-semibold"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("anime")}
            className={cn(
              "px-3 py-1.5 rounded-sm text-12 font-medium transition-colors",
              filter === "anime"
                ? "bg-accent text-white font-semibold"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Anime ({items.filter((i) => i.mediaType === "anime").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("manga")}
            className={cn(
              "px-3 py-1.5 rounded-sm text-12 font-medium transition-colors",
              filter === "manga"
                ? "bg-accent text-white font-semibold"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Manga ({items.filter((i) => i.mediaType === "manga").length})
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {!isLoaded ? (
        <div className="p-12 text-center text-text-muted flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span>Loading your watchlist...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-lg bg-surface border border-border text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-accent text-24">
            📑
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-18 font-bold text-text-primary">
              Your Watchlist is Empty
            </h3>
            <p className="text-14 text-text-muted max-w-md">
              Click the &ldquo;+ Watchlist&rdquo; button on any anime or manga to bookmark it here for easy access.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/anime"
              className="px-4 py-2 rounded-sm bg-accent text-white font-semibold text-14 hover:bg-accent-hover transition-colors"
            >
              Browse Anime
            </Link>
            <Link
              href="/manga"
              className="px-4 py-2 rounded-sm bg-surface-elevated border border-border text-text-primary font-medium text-14 hover:border-accent transition-colors"
            >
              Explore Manga
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-md overflow-hidden bg-surface border border-border hover:border-accent transition-all duration-normal"
            >
              {/* Poster */}
              <Link
                href={`/${item.mediaType}/${item.slug}`}
                className="relative aspect-[2/3] w-full overflow-hidden bg-surface-elevated block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverImage}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                />

                {/* Score badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-bg/90 backdrop-blur-sm border border-border text-12 font-semibold text-text-primary">
                  <StarIcon className="w-3 h-3 text-accent fill-current" />
                  <span>{item.score.toFixed(1)}</span>
                </div>

                {/* Media Type Badge */}
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-sm bg-bg/90 backdrop-blur-sm border border-border text-[10px] font-bold text-text-secondary uppercase font-mono">
                  {item.mediaType}
                </span>

                {/* Quick Play Hover Overlay */}
                <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="p-3 rounded-full bg-accent text-white shadow-lg">
                    <PlayIcon className="w-5 h-5 fill-current" />
                  </span>
                </div>
              </Link>

              {/* Title & Info */}
              <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                <div>
                  <Link
                    href={`/${item.mediaType}/${item.slug}`}
                    className="text-14 font-bold text-text-primary line-clamp-1 hover:text-accent transition-colors"
                  >
                    {item.title}
                  </Link>
                  <span className="text-12 text-text-muted mt-0.5 block">
                    {item.episodesOrChapters}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Link
                    href={
                      item.mediaType === "anime"
                        ? `/anime/${item.slug}/watch`
                        : `/manga/${item.slug}/read`
                    }
                    className="text-12 font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    <span>{item.mediaType === "anime" ? "Watch Ep 1" : "Read Ch 1"}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Remove ${item.title} from watchlist`}
                    className="p-1 rounded-sm text-text-muted hover:text-status-error hover:bg-surface-elevated transition-colors"
                    title="Remove from Watchlist"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
