"use client";

import Link from "next/link";
import { BookOpenIcon, ClockIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface ChapterData {
  id: string;
  number: number | string;
  title?: string;
  releaseDate: string;
  scanGroup?: string;
  pageCount?: number;
  isRead?: boolean;
  mangaSlug: string;
}

interface ChapterListItemProps {
  chapter?: ChapterData;
  isLoading?: boolean;
  className?: string;
}

export function ChapterListItemSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-md bg-surface border border-border animate-pulse",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-sm bg-surface-elevated" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-32 rounded-sm bg-surface-active" />
          <div className="h-3 w-20 rounded-sm bg-surface-subtle" />
        </div>
      </div>
      <div className="h-3 w-16 rounded-sm bg-surface-subtle" />
    </div>
  );
}

export function ChapterListItem({
  chapter,
  isLoading,
  className,
}: ChapterListItemProps) {
  if (isLoading || !chapter) {
    return <ChapterListItemSkeleton className={className} />;
  }

  const chapterDisplay =
    typeof chapter.number === "number"
      ? `Chapter ${chapter.number}`
      : chapter.number;

  return (
    <Link
      href={`/manga/${chapter.mangaSlug}/read?ch=${chapter.number}`}
      className={cn(
        "group flex items-center justify-between p-3 rounded-md bg-surface border border-border transition-all duration-fast hover:border-accent hover:bg-surface-elevated focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
        chapter.isRead && "opacity-75 bg-surface/50",
        className
      )}
      aria-label={`${chapterDisplay}${chapter.title ? `: ${chapter.title}` : ""}, released ${chapter.releaseDate}`}
    >
      {/* Left: Chapter Number & Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Chapter Icon / Number Capsule */}
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-sm border flex items-center justify-center transition-colors duration-fast",
            chapter.isRead
              ? "bg-surface-subtle border-border-subtle text-text-muted"
              : "bg-surface-elevated border-border text-accent group-hover:border-accent"
          )}
        >
          <BookOpenIcon className="w-4 h-4" />
        </div>

        {/* Title & Scanlation Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-14 font-semibold transition-colors duration-fast",
                chapter.isRead
                  ? "text-text-secondary"
                  : "text-text-primary group-hover:text-accent"
              )}
            >
              {chapterDisplay}
            </span>
            {chapter.isRead && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm bg-surface-subtle text-text-muted border border-border-subtle">
                Read
              </span>
            )}
          </div>

          {chapter.title && (
            <p className="text-12 text-text-muted truncate mt-0.5 max-w-sm">
              {chapter.title}
            </p>
          )}
        </div>
      </div>

      {/* Right: Date & Metadata */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-3 text-12 text-text-muted">
        {chapter.scanGroup && (
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-sm bg-surface-subtle border border-border-subtle text-[11px]">
            {chapter.scanGroup}
          </span>
        )}

        <div className="flex items-center gap-1">
          <ClockIcon className="w-3 h-3" />
          <span>{chapter.releaseDate}</span>
        </div>
      </div>
    </Link>
  );
}
