"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchIcon, StarIcon, PlayIcon } from "@/components/icons";
import type { MALAnimeNode } from "@/lib/mal-api";

export function MALAnimeSearch() {
  const [query, setQuery] = useState("Solo Leveling");
  const [results, setResults] = useState<MALAnimeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setErrorMessage(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch(`/api/mal/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();

        if (data.error) {
          setErrorMessage(data.error);
          setResults([]);
        } else {
          setResults(data.data?.map((item: { node: MALAnimeNode }) => item.node) || []);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to fetch from MyAnimeList API";
        setErrorMessage(msg);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex flex-col gap-5 p-6 rounded-lg bg-surface border border-border">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-sm bg-accent/20 border border-accent/40 text-accent font-mono text-[10px] uppercase font-bold">
            LIVE SEARCH EXPLORER
          </span>
          <h3 className="text-18 font-bold text-text-primary">
            Instant Anime Title Search
          </h3>
        </div>
        <p className="text-12 text-text-muted">
          Type any anime or manga title to search across 25,000+ indexed releases
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search by title (e.g. Frieren, Naruto, Bleach, Solo Leveling)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex items-center gap-2 text-12 text-accent font-medium animate-pulse">
          <span className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span>Searching streaming catalog...</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-sm bg-status-error/10 border border-status-error/30 text-status-error text-12">
          {errorMessage}
        </div>
      )}

      {/* Grid Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {results.map((anime) => {
            const slug = `${anime.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")}-${anime.id}`;
            return (
              <Link
                key={anime.id}
                href={`/anime/${slug}`}
                className="group flex flex-col p-2.5 rounded-md bg-surface-elevated border border-border hover:border-accent hover:-translate-y-1 transition-all duration-normal"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] w-full rounded-sm overflow-hidden bg-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={anime.main_picture?.large || anime.main_picture?.medium}
                    alt={anime.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal"
                  />
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-sm bg-bg/90 backdrop-blur-sm border border-border text-[10px] font-bold text-text-secondary uppercase">
                    {anime.media_type || "TV"}
                  </div>
                </div>

                {/* Title & Info */}
                <div className="flex flex-col justify-between flex-1 mt-2.5 gap-1">
                  <h4 className="text-14 font-bold text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
                    {anime.title}
                  </h4>

                  <div className="flex items-center justify-between text-12 text-text-muted pt-1 border-t border-border/50">
                    <span className="flex items-center gap-1 font-semibold text-accent">
                      <StarIcon className="w-3 h-3 fill-current" />
                      {anime.mean ? anime.mean.toFixed(1) : "N/A"}
                    </span>
                    <span>{anime.num_episodes || "?"} eps</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
