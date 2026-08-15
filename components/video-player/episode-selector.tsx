"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayIcon, SearchIcon } from "@/components/icons";
import type { EpisodeDetail } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EpisodeSelectorProps {
  animeSlug: string;
  currentEpisode: number;
  episodes: EpisodeDetail[];
  className?: string;
}

export function EpisodeSelector({
  animeSlug,
  currentEpisode,
  episodes,
  className,
}: EpisodeSelectorProps) {
  const [search, setSearch] = useState("");
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const filteredEpisodes = episodes.filter((ep) =>
    search
      ? ep.number.toString().includes(search) ||
        ep.title.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <>
      {/* =========================================================================
          DESKTOP EPISODE SIDEBAR (Hidden on Mobile)
          ========================================================================= */}
      <aside
        className={cn(
          "hidden lg:flex flex-col w-80 xl:w-96 rounded-md bg-surface border border-border overflow-hidden h-[75vh] max-h-[720px] flex-shrink-0",
          className
        )}
        aria-label="Episodes List"
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-border flex flex-col gap-2.5 bg-surface-elevated">
          <div className="flex items-center justify-between">
            <h3 className="text-14 font-bold text-text-primary">
              Episodes ({episodes.length})
            </h3>
            <span className="text-12 text-accent font-semibold">
              Currently: EP {currentEpisode}
            </span>
          </div>

          {/* Episode Filter Input */}
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Find episode number or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-sm bg-surface border border-border text-12 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Scrollable Episode List */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 custom-scrollbar">
          {filteredEpisodes.map((ep) => {
            const isCurrent = ep.number === currentEpisode;

            return (
              <Link
                key={ep.id}
                href={`/anime/${animeSlug}/watch?ep=${ep.number}`}
                className={cn(
                  "group flex gap-2.5 p-2 rounded-sm border transition-all duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                  isCurrent
                    ? "bg-surface-elevated border-accent text-accent"
                    : "bg-surface/50 border-transparent hover:border-border hover:bg-surface-elevated text-text-secondary"
                )}
                aria-current={isCurrent ? "true" : undefined}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-20 flex-shrink-0 rounded-sm overflow-hidden bg-surface-elevated">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ep.thumbnail}
                    alt={ep.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isCurrent ? (
                    <div className="absolute inset-0 bg-accent/30 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-bg/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <PlayIcon className="w-3.5 h-3.5 text-white fill-current" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex items-center justify-between text-12 font-medium">
                      <span className={isCurrent ? "text-accent font-bold" : "text-text-primary"}>
                        EP {ep.number}
                      </span>
                      <span className="text-[11px] text-text-muted">{ep.duration}</span>
                    </div>
                    <p className="text-12 text-text-muted truncate mt-0.5 group-hover:text-text-primary transition-colors">
                      {ep.title}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* =========================================================================
          MOBILE BOTTOM SHEET TRIGGER & DRAWER (Visible on < lg screens)
          ========================================================================= */}
      <div className="lg:hidden w-full">
        {/* Floating trigger bar */}
        <button
          type="button"
          onClick={() => setIsMobileSheetOpen(true)}
          className="w-full py-2.5 px-4 rounded-md bg-surface border border-border flex items-center justify-between text-14 font-medium text-text-primary hover:border-accent transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-accent">EP {currentEpisode}</span>
            <span className="text-text-secondary truncate">
              {episodes.find((e) => e.number === currentEpisode)?.title}
            </span>
          </div>
          <span className="text-12 text-accent font-semibold flex-shrink-0">
            Change Episode ({episodes.length}) ↑
          </span>
        </button>

        {/* Mobile Bottom Sheet Overlay & Drawer */}
        {isMobileSheetOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-bg/80 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div
              className="flex-1 w-full"
              onClick={() => setIsMobileSheetOpen(false)}
            />

            {/* Bottom Sheet Drawer */}
            <div className="w-full max-h-[75vh] bg-surface-elevated border-t border-border rounded-t-xl flex flex-col overflow-hidden pb-6">
              {/* Drag Handle & Header */}
              <div className="p-3 border-b border-border flex flex-col gap-2">
                <div className="w-10 h-1 rounded-full bg-border-strong mx-auto mb-1" />
                <div className="flex items-center justify-between">
                  <h3 className="text-14 font-bold text-text-primary">
                    Select Episode ({episodes.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileSheetOpen(false)}
                    className="p-1 text-text-muted hover:text-text-primary text-14"
                  >
                    Done
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Filter episode..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-sm bg-surface border border-border text-14 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                />
              </div>

              {/* Episode Grid in Mobile Sheet */}
              <div className="overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredEpisodes.map((ep) => {
                  const isCurrent = ep.number === currentEpisode;

                  return (
                    <Link
                      key={ep.id}
                      href={`/anime/${animeSlug}/watch?ep=${ep.number}`}
                      onClick={() => setIsMobileSheetOpen(false)}
                      className={cn(
                        "p-2 rounded-sm border text-left flex flex-col gap-1 transition-colors",
                        isCurrent
                          ? "bg-accent/15 border-accent text-accent font-bold"
                          : "bg-surface border-border text-text-secondary hover:text-text-primary"
                      )}
                    >
                      <div className="flex items-center justify-between text-12">
                        <span>EP {ep.number}</span>
                        <span className="text-[11px] text-text-muted">{ep.duration}</span>
                      </div>
                      <p className="text-12 text-text-primary truncate">{ep.title}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
