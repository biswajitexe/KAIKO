"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayIcon, StarIcon } from "@/components/icons";
import type { AnimeItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  item?: AnimeItem;
  isLoading?: boolean;
  className?: string;
}

export function AnimeCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] rounded-md overflow-hidden bg-surface border border-border animate-pulse",
        className
      )}
      aria-hidden="true"
    >
      {/* 2:3 Aspect Ratio Poster Skeleton */}
      <div className="relative aspect-[2/3] w-full bg-surface-elevated">
        <div className="absolute top-2 left-2 w-10 h-5 rounded-sm bg-surface-active" />
        <div className="absolute top-2 right-2 w-12 h-5 rounded-sm bg-surface-active" />
      </div>

      {/* Info Section Skeleton */}
      <div className="p-3 flex flex-col gap-2 bg-surface">
        <div className="h-4 w-3/4 rounded-sm bg-surface-active" />
        <div className="h-3 w-1/2 rounded-sm bg-surface-subtle" />
      </div>
    </div>
  );
}

export function AnimeCard({ item, isLoading, className }: AnimeCardProps) {
  if (isLoading || !item) {
    return <AnimeCardSkeleton className={className} />;
  }

  const episodeBadgeText =
    item.status === "AIRING"
      ? `EP ${item.currentEpisode || "?"}/${item.episodes}`
      : `${item.episodes} ${item.episodes === 1 ? "Episode" : "Episodes"}`;

  return (
    <Link
      href={`/anime/${item.slug}`}
      className={cn(
        "group relative flex flex-col flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] rounded-md overflow-hidden bg-surface border border-border transition-all duration-normal hover:border-accent hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
        className
      )}
      aria-label={`${item.title}, Rating: ${item.score}, ${episodeBadgeText}`}
    >
      {/* 2:3 Aspect Ratio Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-elevated">
        {/* Lazy-loaded Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.coverImage}
          alt={item.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-slow group-hover:scale-105"
        />

        {/* Top Badges (Always Visible) */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          {/* Score Badge */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-bg-overlay/90 backdrop-blur-sm border border-border text-12 font-semibold text-text-primary">
            <StarIcon className="w-3 h-3 text-accent" />
            <span>{item.score.toFixed(1)}</span>
          </div>

          {/* Format / Status Badge */}
          <span className="px-1.5 py-0.5 rounded-sm bg-surface-elevated/90 backdrop-blur-sm border border-border text-12 font-medium text-text-secondary uppercase">
            {item.format}
          </span>
        </div>

        {/* =========================================================================
            HOVER OVERLAY: Title + Rating + Episode Count + Action Button
            ========================================================================= */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-normal p-3 flex flex-col justify-between z-20">
          {/* Top of hover overlay: Quick play icon */}
          <div className="flex justify-end">
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center pl-0.5 transform scale-75 group-hover:scale-100 transition-transform duration-fast">
              <PlayIcon className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bottom of hover overlay: Detailed metadata */}
          <div className="flex flex-col gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-fast">
            <h3 className="text-14 font-bold text-text-primary line-clamp-2 leading-tight">
              {item.title}
            </h3>

            <div className="flex items-center justify-between text-12 pt-1 border-t border-border-subtle">
              <span className="inline-flex items-center gap-1 font-semibold text-accent">
                <StarIcon className="w-3 h-3" />
                <span>{item.score.toFixed(1)}</span>
              </span>
              <span className="font-medium text-text-primary bg-surface-elevated/90 px-1.5 py-0.2 rounded-sm border border-border text-[11px]">
                {episodeBadgeText}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span>{item.year}</span>
              <span className="truncate max-w-[90px]">
                {item.genres.slice(0, 1).join("")}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Ambient Vignette (Default state) */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-normal" />
      </div>

      {/* Default Card Bottom Info (Visible when not hovered) */}
      <div className="p-3 flex flex-col gap-1 flex-1 justify-between bg-surface group-hover:bg-surface-elevated transition-colors duration-fast">
        <div>
          <h3 className="text-14 font-semibold text-text-primary line-clamp-1 group-hover:text-accent transition-colors duration-fast">
            {item.title}
          </h3>
          <div className="flex items-center justify-between text-12 text-text-muted mt-1">
            <span>{episodeBadgeText}</span>
            <span>{item.year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
