"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  ClockIcon,
  PlayIcon,
  PlusIcon,
  StarIcon,
} from "@/components/icons";
import { AnimeCard, ChapterListItem, MangaCard } from "@/components";
import type {
  AnimeFullDetail,
  AnimeItem,
  MangaFullDetail,
  MangaUpdateItem,
} from "@/lib/mock-data";
import { useWatchlist } from "@/lib/watchlist-store";
import { cn } from "@/lib/utils";

type TabType = "episodes-or-chapters" | "related" | "reviews";

interface MediaDetailViewProps {
  type: "anime" | "manga";
  media: AnimeFullDetail | MangaFullDetail;
}

export function MediaDetailView({ type, media }: MediaDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("episodes-or-chapters");
  const [chapterSortAsc, setChapterSortAsc] = useState(false);
  const [chapterSearch, setChapterSearch] = useState("");
  const { isSaved, toggle } = useWatchlist();

  const isAnime = type === "anime";
  const animeData = isAnime ? (media as AnimeFullDetail) : null;
  const mangaData = !isAnime ? (media as MangaFullDetail) : null;

  // Filtered and sorted chapters if manga
  const chapters = mangaData?.chaptersList
    ? [...mangaData.chaptersList]
        .filter((c) =>
          chapterSearch
            ? c.number.toString().includes(chapterSearch) ||
              c.title?.toLowerCase().includes(chapterSearch.toLowerCase())
            : true
        )
        .sort((a, b) =>
          chapterSortAsc
            ? Number(a.number) - Number(b.number)
            : Number(b.number) - Number(a.number)
        )
    : [];

  const continueHref = isAnime
    ? `/anime/${media.slug}/watch?ep=1`
    : `/manga/${media.slug}/read?ch=${mangaData?.chaptersList[0]?.number || 1}`;

  const continueLabel = isAnime
    ? `Continue Watching • Ep 1`
    : `Continue Reading • Ch ${mangaData?.chaptersList[0]?.number || 1}`;

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* =========================================================================
          HERO BANNER & HEADER
          ========================================================================= */}
      <div className="relative -mx-4 md:-mx-8 -mt-6 rounded-b-lg overflow-hidden bg-surface-elevated border-b border-border">
        {/* Banner image with ambient glow & multi-layered vignette */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] max-h-[460px] w-full overflow-hidden bg-bg">
          {/* Ambient Blurred Glow */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.bannerImage || media.coverImage}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-125 opacity-35 pointer-events-none"
          />
          {/* Main Backdrop */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.bannerImage || media.coverImage}
            alt={media.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-85"
          />
          {/* Deep dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/70 to-transparent w-full lg:w-3/4" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bg/70 to-transparent" />
        </div>

        {/* Content Container positioned over banner */}
        <div className="max-w-container mx-auto px-4 md:px-8 -mt-24 sm:-mt-32 md:-mt-44 relative z-10 pb-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* 2:3 Vertical Poster */}
            <div className="flex-shrink-0 w-36 sm:w-48 md:w-56 aspect-[2/3] rounded-md overflow-hidden bg-surface border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.coverImage}
                alt={media.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Media Information */}
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              {/* Badges & Meta */}
              <div className="flex flex-wrap items-center gap-2 text-12 font-medium">
                <span className="px-2 py-0.5 rounded-sm bg-accent text-white font-semibold uppercase tracking-wider">
                  {isAnime ? animeData?.format || "TV" : mangaData?.type || "MANGA"}
                </span>

                <span className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-surface border border-border text-text-primary">
                  <StarIcon className="w-3.5 h-3.5 text-accent" />
                  <span className="font-bold">
                    {isAnime ? animeData?.score.toFixed(1) : mangaData?.rating.toFixed(1)}
                  </span>
                </span>

                <span className="px-2 py-0.5 rounded-sm bg-surface border border-border text-text-secondary uppercase">
                  {media.status}
                </span>

                <span className="text-text-muted">
                  {isAnime
                    ? `${animeData?.season} ${animeData?.year} • ${animeData?.episodes} Episodes`
                    : `${mangaData?.totalChapters || "Ongoing"} Chapters`}
                </span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-24 sm:text-32 md:text-36 font-bold text-text-primary tracking-tight leading-tight">
                  {media.title}
                </h1>
                {media.japaneseTitle && (
                  <span className="text-14 text-text-muted font-normal mt-0.5 block">
                    {media.japaneseTitle}
                  </span>
                )}
              </div>

              {/* Studio / Author */}
              <div className="text-12 text-text-muted">
                <span>{isAnime ? "Studio: " : "Author: "}</span>
                <span className="text-text-secondary font-medium">
                  {isAnime ? animeData?.studio : mangaData?.author}
                </span>
              </div>

              {/* Genre Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {media.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/browse?genre=${encodeURIComponent(genre)}`}
                    className="text-12 text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-elevated border border-border px-2.5 py-1 rounded-sm transition-colors duration-fast"
                  >
                    {genre}
                  </Link>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-14 text-text-secondary leading-relaxed max-w-3xl pt-2">
                {media.synopsis}
              </p>

              {/* Quick Actions (Desktop primary bar) */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href={continueHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent text-white font-semibold text-14 hover:bg-accent-hover active:bg-accent-active transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  <PlayIcon className="w-4 h-4 fill-current" />
                  <span>{continueLabel}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => toggle(media, isAnime ? "anime" : "manga")}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-md border font-medium text-14 transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none cursor-pointer",
                    isSaved(media.slug) || isSaved(media.id)
                      ? "bg-accent/20 border-accent text-accent font-semibold"
                      : "bg-surface border-border text-text-primary hover:border-border-strong hover:bg-surface-elevated"
                  )}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>{isSaved(media.slug) || isSaved(media.id) ? "✓ In Watchlist" : "Add to Watchlist"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB SWITCHER & CONTENT
          ========================================================================= */}
      <div className="flex flex-col gap-6">
        {/* Tab Switcher Headers */}
        <div className="flex items-center gap-2 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("episodes-or-chapters")}
            className={cn(
              "px-4 py-3 text-14 font-semibold border-b-2 -mb-[2px] transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
              activeTab === "episodes-or-chapters"
                ? "border-accent text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            {isAnime
              ? `Episodes (${animeData?.episodesList.length || 0})`
              : `Chapters (${mangaData?.chaptersList.length || 0})`}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("related")}
            className={cn(
              "px-4 py-3 text-14 font-semibold border-b-2 -mb-[2px] transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
              activeTab === "related"
                ? "border-accent text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            Related & Recommended
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={cn(
              "px-4 py-3 text-14 font-semibold border-b-2 -mb-[2px] transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
              activeTab === "reviews"
                ? "border-accent text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            Reviews ({media.reviews.length})
          </button>
        </div>

        {/* =========================================================================
            TAB 1: EPISODES / CHAPTERS
            ========================================================================= */}
        {activeTab === "episodes-or-chapters" && (
          <div className="flex flex-col gap-4">
            {isAnime ? (
              /* Anime Episodes Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {animeData?.episodesList.map((ep) => (
                  <Link
                    key={ep.id}
                    href={`/anime/${media.slug}/watch?ep=${ep.number}`}
                    className="group flex gap-3 p-2.5 rounded-md bg-surface border border-border hover:border-accent hover:bg-surface-elevated transition-all duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-28 sm:w-32 flex-shrink-0 rounded-sm overflow-hidden bg-surface-elevated">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ep.thumbnail}
                        alt={ep.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal"
                      />
                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 bg-bg/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-fast">
                        <PlayIcon className="w-5 h-5 text-accent fill-current" />
                      </div>
                      {/* Duration badge */}
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded-sm bg-bg/90 backdrop-blur-sm text-[10px] font-mono text-text-primary">
                        {ep.duration}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-center gap-1.5 text-12 font-medium text-accent">
                          <span>EP {ep.number}</span>
                        </div>
                        <h4 className="text-14 font-semibold text-text-primary line-clamp-1 group-hover:text-accent transition-colors duration-fast">
                          {ep.title}
                        </h4>
                      </div>
                      <span className="text-12 text-text-muted">{ep.airDate}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Manga Chapters List with Search and Sort Controls */
              <div className="flex flex-col gap-3">
                {/* Search & Sort Toolbar */}
                <div className="flex items-center justify-between gap-3 p-2 rounded-md bg-surface border border-border">
                  <input
                    type="text"
                    placeholder="Search chapter number or title..."
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    className="w-full max-w-sm px-3 py-1.5 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setChapterSortAsc(!chapterSortAsc)}
                    className="px-3 py-1.5 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-secondary hover:text-text-primary transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    Sort: {chapterSortAsc ? "Oldest First ↑" : "Newest First ↓"}
                  </button>
                </div>

                {/* Chapter Rows */}
                <div className="flex flex-col gap-2">
                  {chapters.map((ch) => (
                    <ChapterListItem
                      key={ch.id}
                      chapter={{
                        ...ch,
                        mangaSlug: media.slug,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: RELATED & RECOMMENDATIONS
            ========================================================================= */}
        {activeTab === "related" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {isAnime
              ? animeData?.related.map((item: AnimeItem) => (
                  <AnimeCard key={item.id} item={item} />
                ))
              : mangaData?.related.map((item: MangaUpdateItem) => (
                  <MangaCard key={item.id} item={item} />
                ))}
          </div>
        )}

        {/* =========================================================================
            TAB 3: REVIEWS
            ========================================================================= */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-4 max-w-3xl">
            {media.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-md bg-surface border border-border flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rev.avatar}
                      alt={rev.username}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                    <div>
                      <span className="text-14 font-semibold text-text-primary">
                        {rev.username}
                      </span>
                      <div className="flex items-center gap-1 text-12 text-text-muted">
                        <ClockIcon className="w-3 h-3" />
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-surface-elevated border border-border text-12 font-bold text-accent">
                    <StarIcon className="w-3.5 h-3.5 fill-current" />
                    <span>{rev.rating}/10</span>
                  </div>
                </div>

                <p className="text-14 text-text-secondary leading-relaxed">
                  {rev.review}
                </p>

                <div className="flex items-center justify-between text-12 text-text-muted pt-2 border-t border-border-subtle">
                  <span>{rev.helpfulCount} users found this review helpful</span>
                  <button
                    type="button"
                    className="hover:text-accent transition-colors duration-fast"
                  >
                    Helpful
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          STICKY BOTTOM BAR (MOBILE & SCROLLED VISIBILITY)
          ========================================================================= */}
      <div className="sticky bottom-16 md:bottom-4 z-20 mx-auto w-full max-w-md p-2 rounded-md bg-surface-elevated/95 backdrop-blur-md border border-border flex items-center justify-between gap-2">
        <Link
          href={continueHref}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-accent text-white font-semibold text-14 hover:bg-accent-hover transition-colors duration-fast"
        >
          {isAnime ? (
            <PlayIcon className="w-4 h-4 fill-current" />
          ) : (
            <BookOpenIcon className="w-4 h-4" />
          )}
          <span className="truncate">{continueLabel}</span>
        </Link>

        <button
          type="button"
          onClick={() => toggle(media, isAnime ? "anime" : "manga")}
          aria-label="Toggle watchlist"
          className={cn(
            "p-2 rounded-sm border transition-colors duration-fast cursor-pointer",
            isSaved(media.slug) || isSaved(media.id)
              ? "bg-accent/20 border-accent text-accent"
              : "bg-surface border-border text-text-secondary hover:text-text-primary"
          )}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
