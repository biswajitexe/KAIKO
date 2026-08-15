"use client";

import { useState } from "react";
import { PageFlipReader } from "@/components/manga-reader/page-flip-reader";
import { VerticalScrollReader } from "@/components/manga-reader/vertical-scroll-reader";
import type { MangaFullDetail } from "@/lib/mock-data";

interface MangaReaderViewProps {
  manga: MangaFullDetail;
  initialChapterNumber: number | string;
  initialMode?: "flip" | "vertical";
}

export function MangaReaderView({
  manga,
  initialChapterNumber,
  initialMode,
}: MangaReaderViewProps) {
  // Default to vertical scroll for manhwa or if requested, otherwise flip
  const isManhwa = manga.type === "MANHWA";
  const [mode, setMode] = useState<"flip" | "vertical">(
    initialMode || (isManhwa ? "vertical" : "flip")
  );

  const currentChapter = manga.chaptersList.find(
    (c) => c.number.toString() === initialChapterNumber.toString()
  );

  if (mode === "vertical") {
    return (
      <VerticalScrollReader
        mangaTitle={manga.title}
        mangaSlug={manga.slug}
        chapterNumber={initialChapterNumber}
        chapterTitle={currentChapter?.title}
        totalChapters={manga.totalChapters || 150}
        totalPages={currentChapter?.pageCount || 42}
        onSwitchMode={() => setMode("flip")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Quick Mode Switcher Banner */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-sm bg-surface border border-border text-12">
        <span className="text-text-muted">
          Reading Mode: <strong className="text-text-primary">Page-Flip</strong>
        </span>
        <button
          type="button"
          onClick={() => setMode("vertical")}
          className="text-accent font-semibold hover:underline"
        >
          Switch to Vertical Scroll (Webtoon) ↓
        </button>
      </div>

      <PageFlipReader
        mangaTitle={manga.title}
        mangaSlug={manga.slug}
        chapterNumber={initialChapterNumber}
        chapterTitle={currentChapter?.title}
        totalChapters={manga.totalChapters || 150}
        totalPages={currentChapter?.pageCount || 42}
      />
    </div>
  );
}
