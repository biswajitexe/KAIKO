"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpenIcon, StarIcon } from "@/components/icons";
import type { MangaUpdateItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface MangaCardProps {
  item?: MangaUpdateItem;
  isLoading?: boolean;
  className?: string;
  variant?: "poster" | "list";
}

export function MangaCardSkeleton({
  variant = "poster",
  className,
}: {
  variant?: "poster" | "list";
  className?: string;
}) {
  if (variant === "list") {
    return (
      <div
        className={cn(
          "flex flex-shrink-0 w-[260px] sm:w-[300px] md:w-[320px] p-2.5 rounded-md bg-surface border border-border animate-pulse",
          className
        )}
        aria-hidden="true"
      >
        <div className="aspect-[3/4] w-20 flex-shrink-0 rounded-sm bg-surface-elevated" />
        <div className="ml-3 flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-3/4 rounded-sm bg-surface-active" />
            <div className="h-3 w-1/2 rounded-sm bg-surface-subtle" />
          </div>
          <div className="h-4 w-full rounded-sm bg-surface-subtle mt-2" />
        </div>
      </div>
    );
  }

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
        <div className="absolute top-2 right-2 w-14 h-5 rounded-sm bg-surface-active" />
      </div>

      {/* Info Section Skeleton */}
      <div className="p-3 flex flex-col gap-2 bg-surface">
        <div className="h-4 w-3/4 rounded-sm bg-surface-active" />
        <div className="h-3 w-1/2 rounded-sm bg-surface-subtle" />
      </div>
    </div>
  );
}

export function MangaCard({
  item,
  isLoading,
  className,
  variant = "poster",
}: MangaCardProps) {
  if (isLoading || !item) {
    return <MangaCardSkeleton variant={variant} className={className} />;
  }

  // If list variant requested for compact horizontal updates
  if (variant === "list") {
    return (
      <Link
        href={`/manga/${item.slug}`}
        className={cn(
          "group relative flex flex-shrink-0 w-[260px] sm:w-[300px] md:w-[320px] p-2.5 rounded-md bg-surface border border-border transition-all duration-normal hover:border-accent hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
          className
        )}
        aria-label={`${item.title}, ${item.latestChapter}, updated ${item.timeAgo}`}
      >
        <div className="relative aspect-[3/4] w-20 flex-shrink-0 rounded-sm overflow-hidden bg-surface-elevated">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.coverImage}
            alt={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
          />
          <span className="absolute bottom-1 left-1 px-1 py-0.2 text-[10px] font-bold tracking-wider text-text-primary bg-bg/90 backdrop-blur-sm rounded-sm uppercase">
            {item.type}
          </span>
        </div>

        <div className="ml-3 flex flex-col justify-between flex-1 min-w-0">
          <div>
            <h3 className="text-14 font-semibold text-text-primary line-clamp-1 group-hover:text-accent transition-colors duration-fast">
              {item.title}
            </h3>
            <p className="text-12 text-text-muted truncate mt-0.5">
              {item.genres.slice(0, 2).join(" • ")}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-border-subtle flex flex-col gap-1">
            <div className="flex items-center justify-between gap-1">
              <span className="inline-flex items-center gap-1 text-12 font-medium text-accent">
                <BookOpenIcon className="w-3.5 h-3.5" />
                <span>{item.latestChapter}</span>
              </span>
              <span className="text-12 text-text-muted">{item.timeAgo}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default 2:3 Poster Variant with rich hover overlay
  return (
    <Link
      href={`/manga/${item.slug}`}
      className={cn(
        "group relative flex flex-col flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] rounded-md overflow-hidden bg-surface border border-border transition-all duration-normal hover:border-accent hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
        className
      )}
      aria-label={`${item.title}, Rating: ${item.rating}, ${item.latestChapter}`}
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

        {/* Top Badges (Always visible) */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-bg-overlay/90 backdrop-blur-sm border border-border text-12 font-semibold text-text-primary">
            <StarIcon className="w-3 h-3 text-accent" />
            <span>{item.rating.toFixed(1)}</span>
          </div>

          <span className="px-1.5 py-0.5 rounded-sm bg-surface-elevated/90 backdrop-blur-sm border border-border text-12 font-medium text-text-secondary uppercase">
            {item.type}
          </span>
        </div>

        {/* =========================================================================
            HOVER OVERLAY: Title + Rating + Chapter Count Overlay
            ========================================================================= */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-normal p-3 flex flex-col justify-between z-20">
          {/* Top of hover overlay: Quick read icon */}
          <div className="flex justify-end">
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-fast">
              <BookOpenIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Bottom of hover overlay: Metadata */}
          <div className="flex flex-col gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-fast">
            <h3 className="text-14 font-bold text-text-primary line-clamp-2 leading-tight">
              {item.title}
            </h3>

            <div className="flex items-center justify-between text-12 pt-1 border-t border-border-subtle">
              <span className="inline-flex items-center gap-1 font-semibold text-accent">
                <StarIcon className="w-3 h-3" />
                <span>{item.rating.toFixed(1)}</span>
              </span>
              <span className="font-medium text-text-primary bg-surface-elevated/90 px-1.5 py-0.2 rounded-sm border border-border text-[11px]">
                {item.latestChapter}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span>{item.timeAgo}</span>
              <span className="truncate max-w-[80px]">
                {item.genres.slice(0, 1).join("")}
              </span>
            </div>
          </div>
        </div>

        {/* Ambient Vignette for resting state */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-normal" />
      </div>

      {/* Default Resting Info */}
      <div className="p-3 flex flex-col gap-1 flex-1 justify-between bg-surface group-hover:bg-surface-elevated transition-colors duration-fast">
        <div>
          <h3 className="text-14 font-semibold text-text-primary line-clamp-1 group-hover:text-accent transition-colors duration-fast">
            {item.title}
          </h3>
          <div className="flex items-center justify-between text-12 text-text-muted mt-1">
            <span className="text-accent font-medium">{item.latestChapter}</span>
            <span>{item.timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
