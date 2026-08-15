"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AnimeCard,
  MangaCard,
  PlayIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
} from "@/components";
import {
  MOCK_USER_PROFILE,
  CONTINUE_MEDIA_LIST,
  USER_LIBRARY_ANIME,
  USER_LIBRARY_MANGA,
  type AnimeItem,
  type MangaUpdateItem,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ProfileTab = "watchlist" | "reading-list" | "favorites" | "activity";
type StatusFilter = "all" | "watching-reading" | "completed" | "plan-to-watch";

export function ProfilePageView() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("watchlist");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredAnime = USER_LIBRARY_ANIME.filter((entry) =>
    statusFilter === "all" ? true : entry.userStatus === statusFilter
  );

  const filteredManga = USER_LIBRARY_MANGA.filter((entry) =>
    statusFilter === "all" ? true : entry.userStatus === statusFilter
  );

  return (
    <div className="flex flex-col gap-8 max-w-container mx-auto pb-16">
      {/* =========================================================================
          PROFILE HEADER CARD
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-lg bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* User Identity & Avatar */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-border bg-surface-elevated flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MOCK_USER_PROFILE.avatar}
              alt={MOCK_USER_PROFILE.username}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Online Indicator */}
            <span
              className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-status-success border-2 border-surface"
              aria-label="Online"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-20 sm:text-24 font-bold text-text-primary">
                {MOCK_USER_PROFILE.username}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-semibold text-[11px] uppercase tracking-wider">
                PRO Member
              </span>
            </div>
            <p className="text-12 font-mono text-text-muted">
              {MOCK_USER_PROFILE.handle} • {MOCK_USER_PROFILE.joinDate}
            </p>
            <p className="text-14 text-text-secondary max-w-xl mt-1 leading-relaxed">
              {MOCK_USER_PROFILE.bio}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-surface-elevated border border-border text-14 font-medium text-text-primary hover:border-border-strong hover:bg-surface-active transition-colors duration-fast flex-shrink-0 focus-visible:ring-2 focus-visible:ring-accent"
        >
          Edit Profile
        </button>
      </div>

      {/* =========================================================================
          STATS METRIC CARDS
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Anime Watching */}
        <div className="p-4 rounded-md bg-surface border border-border flex flex-col gap-1">
          <span className="text-12 text-text-muted font-medium uppercase tracking-wider">
            Watching Anime
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-24 font-bold text-text-primary">
              {MOCK_USER_PROFILE.stats.animeWatching}
            </span>
            <span className="text-12 text-text-muted">
              / {MOCK_USER_PROFILE.stats.animeCompleted} completed
            </span>
          </div>
        </div>

        {/* Manga Reading */}
        <div className="p-4 rounded-md bg-surface border border-border flex flex-col gap-1">
          <span className="text-12 text-text-muted font-medium uppercase tracking-wider">
            Reading Manga
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-24 font-bold text-accent">
              {MOCK_USER_PROFILE.stats.mangaReading}
            </span>
            <span className="text-12 text-text-muted">
              / {MOCK_USER_PROFILE.stats.mangaCompleted} completed
            </span>
          </div>
        </div>

        {/* Plan to Watch / Read */}
        <div className="p-4 rounded-md bg-surface border border-border flex flex-col gap-1">
          <span className="text-12 text-text-muted font-medium uppercase tracking-wider">
            Plan to Watch/Read
          </span>
          <span className="text-24 font-bold text-text-primary">
            {MOCK_USER_PROFILE.stats.animePlanToWatch +
              MOCK_USER_PROFILE.stats.mangaPlanToRead}
          </span>
        </div>

        {/* Total Consumed */}
        <div className="p-4 rounded-md bg-surface border border-border flex flex-col gap-1">
          <span className="text-12 text-text-muted font-medium uppercase tracking-wider">
            Total Logged
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-24 font-bold text-text-primary">
              {MOCK_USER_PROFILE.stats.totalEpisodesWatched}
            </span>
            <span className="text-12 text-text-muted">eps • {MOCK_USER_PROFILE.stats.totalChaptersRead} chs</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTINUE WATCHING & READING ROW WITH PROGRESS BARS
          ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-18 font-bold text-text-primary">
              Continue Watching & Reading
            </h2>
            <p className="text-12 text-text-muted">
              Pick up right where you left off
            </p>
          </div>
        </div>

        {/* Horizontal In-Progress Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {CONTINUE_MEDIA_LIST.map((item) => (
            <Link
              key={item.id}
              href={item.resumeHref}
              className="group flex flex-col rounded-md overflow-hidden bg-surface border border-border hover:border-accent hover:-translate-y-0.5 transition-all duration-fast p-3 gap-3"
            >
              <div className="flex gap-3">
                {/* 2:3 Miniature Poster */}
                <div className="relative aspect-[2/3] w-14 flex-shrink-0 rounded-sm overflow-hidden bg-surface-elevated">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-bg/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <PlayIcon className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>

                {/* Title & Meta */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-accent">
                      {item.mediaType === "anime" ? "Anime" : "Manga"}
                    </span>
                    <h3 className="text-14 font-semibold text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-12 text-text-muted mt-0.5">
                      {item.mediaType === "anime"
                        ? `EP ${item.currentNumber} of ${item.totalCount}`
                        : `Ch ${item.currentNumber} of ${item.totalCount}`}
                    </p>
                  </div>

                  <span className="text-[11px] text-text-muted">
                    {item.lastAccessed}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
                  <span>Progress</span>
                  <span className="text-text-primary font-semibold">
                    {item.progressPercentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-normal"
                    style={{ width: `${item.progressPercentage}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          TABBED WATCHLIST & READING LIST GRIDS
          ========================================================================= */}
      <section className="flex flex-col gap-6">
        {/* Main Tabs Header */}
        <div className="flex items-center gap-2 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("watchlist")}
            className={cn(
              "px-4 py-3 text-14 font-semibold border-b-2 -mb-[2px] transition-colors focus-visible:ring-2 focus-visible:ring-accent",
              activeTab === "watchlist"
                ? "border-accent text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            Watchlist ({USER_LIBRARY_ANIME.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reading-list")}
            className={cn(
              "px-4 py-3 text-14 font-semibold border-b-2 -mb-[2px] transition-colors focus-visible:ring-2 focus-visible:ring-accent",
              activeTab === "reading-list"
                ? "border-accent text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            Reading List ({USER_LIBRARY_MANGA.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={cn(
              "px-4 py-3 text-14 font-semibold border-b-2 -mb-[2px] transition-colors focus-visible:ring-2 focus-visible:ring-accent",
              activeTab === "favorites"
                ? "border-accent text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            Favorites
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={cn(
              "px-4 py-3 text-14 font-semibold border-b-2 -mb-[2px] transition-colors focus-visible:ring-2 focus-visible:ring-accent",
              activeTab === "activity"
                ? "border-accent text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            Activity History
          </button>
        </div>

        {/* Sub-status Filter Pills (For Watchlist and Reading List) */}
        {(activeTab === "watchlist" || activeTab === "reading-list") && (
          <div className="flex items-center gap-1.5 text-12">
            {[
              { id: "all", label: "All Titles" },
              {
                id: "watching-reading",
                label: activeTab === "watchlist" ? "Watching" : "Reading",
              },
              { id: "completed", label: "Completed" },
              { id: "plan-to-watch", label: "Plan to Watch/Read" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id as StatusFilter)}
                className={cn(
                  "px-3 py-1.5 rounded-sm border font-medium transition-colors",
                  statusFilter === st.id
                    ? "bg-accent border-accent text-white font-semibold"
                    : "bg-surface border-border text-text-secondary hover:text-text-primary"
                )}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab 1: Watchlist Grid */}
        {activeTab === "watchlist" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
            {filteredAnime.map((entry) => (
              <AnimeCard
                key={entry.id}
                item={entry.item as AnimeItem}
                className="w-full"
              />
            ))}
          </div>
        )}

        {/* Tab 2: Reading List Grid */}
        {activeTab === "reading-list" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
            {filteredManga.map((entry) => (
              <MangaCard
                key={entry.id}
                item={entry.item as MangaUpdateItem}
                variant="poster"
                className="w-full"
              />
            ))}
          </div>
        )}

        {/* Tab 3: Favorites Grid */}
        {activeTab === "favorites" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
            {USER_LIBRARY_ANIME.slice(0, 4).map((entry) => (
              <AnimeCard
                key={entry.id}
                item={entry.item as AnimeItem}
                className="w-full"
              />
            ))}
            {USER_LIBRARY_MANGA.slice(0, 2).map((entry) => (
              <MangaCard
                key={entry.id}
                item={entry.item as MangaUpdateItem}
                variant="poster"
                className="w-full"
              />
            ))}
          </div>
        )}

        {/* Tab 4: Activity History Timeline */}
        {activeTab === "activity" && (
          <div className="flex flex-col gap-3 max-w-2xl">
            {[
              {
                id: "act-1",
                action: "Watched Episode 8 of",
                title: "Solo Leveling: Season 2",
                time: "2 hours ago",
                type: "anime",
              },
              {
                id: "act-2",
                action: "Read Chapter 238 of",
                title: "Omniscient Reader's Viewpoint",
                time: "Yesterday",
                type: "manga",
              },
              {
                id: "act-3",
                action: "Completed series",
                title: "Frieren: Beyond Journey's End (28/28 Episodes)",
                time: "3 days ago",
                type: "anime",
              },
              {
                id: "act-4",
                action: "Rated 10/10 for",
                title: "Demon Slayer: Infinity Castle Arc",
                time: "5 days ago",
                type: "anime",
              },
            ].map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-md bg-surface border border-border flex items-center justify-between gap-3 text-14"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-surface-elevated border border-border flex items-center justify-center text-accent">
                    {act.type === "anime" ? (
                      <PlayIcon className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <BookOpenIcon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <span className="text-text-muted">{act.action} </span>
                    <strong className="text-text-primary">{act.title}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-12 text-text-muted flex-shrink-0">
                  <ClockIcon className="w-3 h-3" />
                  <span>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
