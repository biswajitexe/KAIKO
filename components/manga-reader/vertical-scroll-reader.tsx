"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowUpIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  DoublePageIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

interface VerticalScrollReaderProps {
  mangaTitle: string;
  mangaSlug: string;
  chapterNumber: number | string;
  chapterTitle?: string;
  totalChapters: number;
  totalPages?: number;
  onSwitchMode?: () => void;
}

export function VerticalScrollReader({
  mangaTitle,
  mangaSlug,
  chapterNumber,
  chapterTitle,
  totalChapters,
  totalPages = 42,
  onSwitchMode,
}: VerticalScrollReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentPanel, setCurrentPanel] = useState(1);
  const [panelGap, setPanelGap] = useState(false); // seamless webtoon 0px vs 8px gap
  const [canvasWidth, setCanvasWidth] = useState<"standard" | "wide" | "compact">("standard");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress and current visible panel
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(progress);
        const estimatedPanel = Math.min(
          totalPages,
          Math.max(1, Math.ceil((progress / 100) * totalPages))
        );
        setCurrentPanel(estimatedPanel);
      }
      setShowScrollTop(scrollTop > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalPages]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chNum = Number(chapterNumber) || 1;
  const prevChapterNum = chNum > 1 ? chNum - 1 : null;
  const nextChapterNum = chNum < totalChapters ? chNum + 1 : null;

  // Generate array of page indices
  const panels = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-reader-bg flex flex-col items-center select-none"
      role="region"
      aria-label="Vertical Scroll Manhwa Reader"
    >
      {/* =========================================================================
          TOP FIXED READING PROGRESS BAR
          ========================================================================= */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-surface-elevated z-50 pointer-events-none"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-accent transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 w-full bg-bg/90 backdrop-blur-md border-b border-border py-3 px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/manga/${mangaSlug}`}
            className="p-1.5 rounded-sm bg-surface/80 border border-border text-text-secondary hover:text-text-primary hover:bg-surface transition-colors focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Back to series details"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-14 font-bold text-text-primary truncate">
              {mangaTitle}
            </h1>
            <p className="text-12 text-text-muted truncate">
              Chapter {chapterNumber}
              {chapterTitle ? `: ${chapterTitle}` : ""}
            </p>
          </div>
        </div>

        {/* Right Settings & Mode Switcher */}
        <div className="flex items-center gap-2 text-12">
          {/* Switch to Page Flip Mode */}
          {onSwitchMode && (
            <button
              type="button"
              onClick={onSwitchMode}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
            >
              <DoublePageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Page-Flip View</span>
            </button>
          )}

          {/* Panel Gap Toggle */}
          <button
            type="button"
            onClick={() => setPanelGap(!panelGap)}
            className="px-2 py-1 rounded-sm bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle panel gap"
          >
            {panelGap ? "Seamless: Off" : "Seamless: On"}
          </button>
        </div>
      </header>

      {/* =========================================================================
          CONTINUOUS VERTICAL STRIP READING CANVAS
          ========================================================================= */}
      <main
        className={cn(
          "w-full transition-all duration-normal flex flex-col items-center py-4",
          canvasWidth === "compact" && "max-w-[620px]",
          canvasWidth === "standard" && "max-w-[760px]",
          canvasWidth === "wide" && "max-w-[920px]",
          panelGap ? "gap-4" : "gap-0"
        )}
      >
        {panels.map((panelIndex) => (
          <VerticalManhwaPanel
            key={panelIndex}
            panelIndex={panelIndex}
            totalPages={totalPages}
            mangaTitle={mangaTitle}
            chapterNumber={chapterNumber}
          />
        ))}

        {/* Chapter End Marker & Action */}
        <div className="w-full p-8 my-8 rounded-md bg-surface border border-border text-center flex flex-col items-center gap-4">
          <span className="text-12 font-mono uppercase tracking-widest text-accent">
            End of Chapter {chapterNumber}
          </span>
          <h3 className="text-16 font-bold text-text-primary">
            You have completed Chapter {chapterNumber}!
          </h3>

          <div className="flex items-center gap-3">
            {nextChapterNum ? (
              <Link
                href={`/manga/${mangaSlug}/read?ch=${nextChapterNum}&mode=vertical`}
                className="px-5 py-2 rounded-md bg-accent text-white font-semibold text-14 hover:bg-accent-hover transition-colors"
              >
                Read Next Chapter ({nextChapterNum}) →
              </Link>
            ) : (
              <span className="text-14 text-text-muted">
                You are on the latest chapter!
              </span>
            )}
          </div>
        </div>
      </main>

      {/* =========================================================================
          FLOATING CHAPTER NAVIGATION BAR (Fixed at Bottom)
          ========================================================================= */}
      <aside
        aria-label="Chapter navigation toolbar"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-auto px-4 py-2 rounded-full bg-surface-elevated/95 backdrop-blur-md border border-border shadow-lg flex items-center justify-between gap-3 text-12 font-medium"
      >
        {/* Previous Chapter */}
        {prevChapterNum ? (
          <Link
            href={`/manga/${mangaSlug}/read?ch=${prevChapterNum}&mode=vertical`}
            className="flex items-center gap-1 text-text-secondary hover:text-text-primary px-2 py-1 rounded-sm transition-colors"
          >
            ← Ch {prevChapterNum}
          </Link>
        ) : (
          <span className="text-text-muted/40 px-2 py-1">← Ch Prev</span>
        )}

        {/* Live Reading Progress Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-text-primary font-mono font-semibold">
          <BookOpenIcon className="w-3.5 h-3.5 text-accent" />
          <span>
            {currentPanel}/{totalPages} • {Math.round(scrollProgress)}%
          </span>
        </div>

        {/* Next Chapter */}
        {nextChapterNum ? (
          <Link
            href={`/manga/${mangaSlug}/read?ch=${nextChapterNum}&mode=vertical`}
            className="flex items-center gap-1 text-accent font-semibold hover:text-accent-hover px-2 py-1 rounded-sm transition-colors"
          >
            Ch {nextChapterNum} →
          </Link>
        ) : (
          <span className="text-text-muted/40 px-2 py-1">Ch Next →</span>
        )}

        {/* Scroll To Top Trigger */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="p-1.5 rounded-full bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent transition-colors ml-1"
          >
            <ArrowUpIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </aside>
    </div>
  );
}

/**
 * Lazy-loaded Manhwa continuous panel element
 */
function VerticalManhwaPanel({
  panelIndex,
  totalPages,
  mangaTitle,
  chapterNumber,
}: {
  panelIndex: number;
  totalPages: number;
  mangaTitle: string;
  chapterNumber: number | string;
}) {
  return (
    <div
      className="relative w-full aspect-[1/1.5] max-h-[960px] bg-[#0c0d12] border-x border-border/20 flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none"
    >
      {/* Panel header stamp */}
      <div className="flex items-center justify-between text-[10px] font-mono text-text-muted/50 uppercase tracking-widest border-b border-border/20 pb-1">
        <span>{mangaTitle}</span>
        <span>
          CH. {chapterNumber} • PANEL {panelIndex}
        </span>
      </div>

      {/* Simulated High-Res Vertical Webtoon Art Sequence */}
      <div className="flex-1 my-3 flex flex-col justify-between gap-3">
        <div className="p-4 rounded-sm bg-surface-elevated/70 border border-border/30 flex flex-col gap-2 relative">
          <div className="w-28 h-2 bg-accent/30 rounded-full" />
          <div className="text-[12px] text-text-primary font-medium italic">
            「 The constellation &apos;Demon King of Salvation&apos; is looking at the incarnation. 」
          </div>
          <div className="w-3/4 h-2 bg-surface-active rounded-full mt-1" />
        </div>

        <div className="flex-1 rounded-sm bg-surface/60 border border-border/30 flex items-center justify-center p-6 text-center">
          <span className="text-[12px] font-bold tracking-widest text-text-muted/70 uppercase">
            [ Webtoon Long-Strip Frame {panelIndex} of {totalPages} ]
          </span>
        </div>
      </div>

      {/* Panel Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-text-muted/50 border-t border-border/20 pt-1">
        <span>KAIYO WEBTOON CANVAS</span>
        <span className="font-semibold text-text-secondary">
          {panelIndex} / {totalPages}
        </span>
      </div>
    </div>
  );
}
