"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DoublePageIcon,
  MaximizeIcon,
  MinimizeIcon,
  SinglePageIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

interface PageFlipReaderProps {
  mangaTitle: string;
  mangaSlug: string;
  chapterNumber: number | string;
  chapterTitle?: string;
  totalChapters: number;
  totalPages?: number;
}

export function PageFlipReader({
  mangaTitle,
  mangaSlug,
  chapterNumber,
  chapterTitle,
  totalChapters,
  totalPages = 42,
}: PageFlipReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMode, setPageMode] = useState<"single" | "double">("single");
  const [readingDirection, setReadingDirection] = useState<"rtl" | "ltr">("rtl"); // Default manga RTL
  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);
  const [isChromeVisible, setIsChromeVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls after 2s of inactivity
  const resetInactivityTimer = useCallback(() => {
    setIsChromeVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsChromeVisible(false);
    }, 2000);
  }, []);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetInactivityTimer, currentPage, pageMode, zoomLevel]);

  const step = pageMode === "double" ? 2 : 1;

  // Turn page forward
  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + step));
    resetInactivityTimer();
  }, [totalPages, step, resetInactivityTimer]);

  // Turn page backward
  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - step));
    resetInactivityTimer();
  }, [step, resetInactivityTimer]);

  // Tap navigation based on reading direction
  const handleLeftTap = () => {
    if (readingDirection === "rtl") {
      nextPage();
    } else {
      prevPage();
    }
  };

  const handleRightTap = () => {
    if (readingDirection === "rtl") {
      prevPage();
    } else {
      nextPage();
    }
  };

  const handleCenterTap = () => {
    setIsChromeVisible((prev) => !prev);
  };

  // Zoom on double tap or click
  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
    resetInactivityTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          handleLeftTap();
          break;
        case "ArrowRight":
        case "d":
        case "D":
        case " ":
          e.preventDefault();
          handleRightTap();
          break;
        case "z":
        case "Z":
          e.preventDefault();
          toggleZoom();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          setZoomLevel(1);
          setIsChromeVisible(true);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleLeftTap, handleRightTap, toggleZoom]);

  const chNum = Number(chapterNumber) || 1;
  const prevChapterNum = chNum > 1 ? chNum - 1 : null;
  const nextChapterNum = chNum < totalChapters ? chNum + 1 : null;

  // Active page numbers calculation
  const primaryPage = currentPage;
  const secondaryPage =
    pageMode === "double" && currentPage + 1 <= totalPages
      ? currentPage + 1
      : null;

  return (
    <div
      ref={containerRef}
      onMouseMove={resetInactivityTimer}
      onTouchStart={resetInactivityTimer}
      className="relative w-full h-[88vh] min-h-[580px] bg-reader-bg rounded-md overflow-hidden border border-border select-none flex flex-col justify-between"
      tabIndex={0}
      role="region"
      aria-label="Manga Page-Flip Reader"
    >
      {/* =========================================================================
          TOP MINIMAL CHROME (Auto-Hides)
          ========================================================================= */}
      <header
        className={cn(
          "absolute top-0 inset-x-0 z-30 p-3 bg-gradient-to-b from-bg/95 via-bg/80 to-transparent flex items-center justify-between gap-4 transition-opacity duration-normal border-b border-border/40",
          isChromeVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/manga/${mangaSlug}`}
            className="p-1.5 rounded-sm bg-surface/80 border border-border text-text-secondary hover:text-text-primary hover:bg-surface transition-colors focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Back to series overview"
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

        {/* Right: Reading Direction & Mode */}
        <div className="flex items-center gap-2 text-12">
          {/* RTL / LTR Mode Toggle */}
          <button
            type="button"
            onClick={() =>
              setReadingDirection((prev) => (prev === "rtl" ? "ltr" : "rtl"))
            }
            className="px-2.5 py-1 rounded-sm bg-surface/80 border border-border text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Reading Direction: ${readingDirection.toUpperCase()}`}
          >
            Mode: <span className="text-accent font-semibold">{readingDirection.toUpperCase()}</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN READING CANVAS & TAP NAVIGATION ZONES
          ========================================================================= */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {/* Interactive Tap Zones (Invisible) */}
        <div className="absolute inset-0 z-20 flex">
          {/* Left Zone (30%) */}
          <button
            type="button"
            onClick={handleLeftTap}
            aria-label={readingDirection === "rtl" ? "Next page" : "Previous page"}
            className="w-[30%] h-full cursor-w-resize focus:outline-none focus-visible:bg-accent/5 transition-colors"
          />

          {/* Center Zone (40%) - Toggles Chrome & Double Click Zoom */}
          <button
            type="button"
            onClick={handleCenterTap}
            onDoubleClick={toggleZoom}
            aria-label="Toggle reader controls / Double tap to zoom"
            className="w-[40%] h-full cursor-pointer focus:outline-none focus-visible:bg-accent/5 transition-colors"
          />

          {/* Right Zone (30%) */}
          <button
            type="button"
            onClick={handleRightTap}
            aria-label={readingDirection === "rtl" ? "Previous page" : "Next page"}
            className="w-[30%] h-full cursor-e-resize focus:outline-none focus-visible:bg-accent/5 transition-colors"
          />
        </div>

        {/* Page Spread Display Container */}
        <div
          className={cn(
            "relative max-h-full flex items-center justify-center gap-2 p-2 transition-transform duration-fast",
            zoomLevel > 1 && "cursor-zoom-out"
          )}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Render Pages depending on Reading Direction (RTL: right page is earlier, left page is later) */}
          {readingDirection === "rtl" && secondaryPage ? (
            <>
              {/* Left page (Secondary/Later in RTL) */}
              <MangaPageCanvas
                pageNumber={secondaryPage}
                totalPages={totalPages}
                mangaTitle={mangaTitle}
                chapterNumber={chapterNumber}
              />
              {/* Right page (Primary/Earlier in RTL) */}
              <MangaPageCanvas
                pageNumber={primaryPage}
                totalPages={totalPages}
                mangaTitle={mangaTitle}
                chapterNumber={chapterNumber}
              />
            </>
          ) : (
            <>
              {/* Primary Page */}
              <MangaPageCanvas
                pageNumber={primaryPage}
                totalPages={totalPages}
                mangaTitle={mangaTitle}
                chapterNumber={chapterNumber}
              />
              {/* Secondary Page in LTR */}
              {secondaryPage && (
                <MangaPageCanvas
                  pageNumber={secondaryPage}
                  totalPages={totalPages}
                  mangaTitle={mangaTitle}
                  chapterNumber={chapterNumber}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          BOTTOM MINIMAL CHROME (Auto-Hides)
          ========================================================================= */}
      <footer
        className={cn(
          "absolute bottom-0 inset-x-0 z-30 p-3 bg-gradient-to-t from-bg/95 via-bg/85 to-transparent flex flex-col gap-2 transition-opacity duration-normal border-t border-border/40",
          isChromeVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Page Scrubber Range Slider */}
        <div className="flex items-center gap-3 max-w-xl mx-auto w-full px-2">
          <span className="text-12 font-mono text-text-muted">1</span>
          <input
            type="range"
            min={1}
            max={totalPages}
            step={step}
            value={currentPage}
            onChange={(e) => {
              setCurrentPage(parseInt(e.target.value, 10));
              resetInactivityTimer();
            }}
            className="flex-1 h-1 accent-accent bg-surface-elevated rounded-lg cursor-pointer"
            aria-label="Manga page slider"
          />
          <span className="text-12 font-mono text-text-muted">{totalPages}</span>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 text-text-secondary">
          {/* Left: Chapter Jump */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-12">
            {prevChapterNum ? (
              <Link
                href={`/manga/${mangaSlug}/read?ch=${prevChapterNum}`}
                className="px-2 sm:px-2.5 py-1 rounded-sm bg-surface/80 border border-border text-12 font-medium hover:text-text-primary hover:border-border-strong transition-colors"
              >
                ← <span className="hidden sm:inline">Ch </span>{prevChapterNum}
              </Link>
            ) : (
              <span className="px-2 sm:px-2.5 py-1 rounded-sm bg-surface/40 border border-border-subtle text-12 text-text-muted opacity-40">
                ← <span className="hidden sm:inline">Prev</span>
              </span>
            )}

            {nextChapterNum ? (
              <Link
                href={`/manga/${mangaSlug}/read?ch=${nextChapterNum}`}
                className="px-2 sm:px-2.5 py-1 rounded-sm bg-surface/80 border border-border text-12 font-medium hover:text-text-primary hover:border-border-strong transition-colors"
              >
                <span className="hidden sm:inline">Ch </span>{nextChapterNum} →
              </Link>
            ) : (
              <span className="px-2 sm:px-2.5 py-1 rounded-sm bg-surface/40 border border-border-subtle text-12 text-text-muted opacity-40">
                <span className="hidden sm:inline">Next </span>→
              </span>
            )}
          </div>

          {/* Center: Current Page Counter Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-surface-elevated/90 border border-border text-[11px] sm:text-12 font-mono text-text-primary font-semibold">
            <BookOpenIcon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span>
              {pageMode === "double" && secondaryPage
                ? `${primaryPage}-${secondaryPage}/${totalPages}`
                : `${primaryPage}/${totalPages}`}
            </span>
          </div>

          {/* Right: Mode & Zoom Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Single / Double Page Toggle */}
            <button
              type="button"
              onClick={() => {
                setPageMode((prev) => (prev === "single" ? "double" : "single"));
                resetInactivityTimer();
              }}
              aria-label={`Switch to ${pageMode === "single" ? "double" : "single"} page view`}
              className={cn(
                "p-1.5 rounded-sm border transition-colors",
                pageMode === "double"
                  ? "bg-accent border-accent text-white"
                  : "bg-surface/80 border-border text-text-secondary hover:text-text-primary"
              )}
            >
              {pageMode === "single" ? (
                <SinglePageIcon className="w-4 h-4" />
              ) : (
                <DoublePageIcon className="w-4 h-4" />
              )}
            </button>

            {/* Zoom Toggle */}
            <button
              type="button"
              onClick={toggleZoom}
              aria-label={`Zoom: ${zoomLevel}x`}
              className={cn(
                "flex items-center gap-1 p-1.5 sm:px-2 sm:py-1 rounded-sm border text-12 font-mono transition-colors",
                zoomLevel > 1
                  ? "bg-accent border-accent text-white font-bold"
                  : "bg-surface/80 border-border text-text-secondary hover:text-text-primary"
              )}
            >
              {zoomLevel === 1 ? (
                <ZoomInIcon className="w-3.5 h-3.5" />
              ) : (
                <ZoomOutIcon className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{zoomLevel}x</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
              className="p-1.5 rounded-sm bg-surface/80 border border-border text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent"
            >
              {isFullscreen ? (
                <MinimizeIcon className="w-4 h-4" />
              ) : (
                <MaximizeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * High-fidelity Manga Page Canvas component simulating manga panel artwork
 */
function MangaPageCanvas({
  pageNumber,
  totalPages,
  mangaTitle,
  chapterNumber,
}: {
  pageNumber: number;
  totalPages: number;
  mangaTitle: string;
  chapterNumber: number | string;
}) {
  return (
    <div className="relative aspect-[1/1.42] h-[72vh] max-h-[760px] bg-[#0c0d11] rounded-sm overflow-hidden border border-border flex flex-col justify-between p-4 shadow-sm select-none">
      {/* Top Header of the Manga Page */}
      <div className="flex items-center justify-between text-[10px] font-mono text-text-muted/60 border-b border-border/30 pb-1 uppercase tracking-widest">
        <span>{mangaTitle}</span>
        <span>CH. {chapterNumber}</span>
      </div>

      {/* Simulated High-Contrast Manga Panels */}
      <div className="flex-1 my-2 grid grid-rows-3 gap-2">
        {/* Panel 1 */}
        <div className="rounded-sm bg-surface-elevated/70 border border-border/40 p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="w-20 h-2 bg-text-muted/20 rounded-full" />
          <div className="absolute right-3 top-2 px-2 py-1 rounded-sm bg-bg border border-border text-[10px] text-text-secondary font-medium">
            「 Three Ways to Survive the Apocalypse 」
          </div>
          <div className="w-32 h-2 bg-text-muted/15 rounded-full" />
        </div>

        {/* Panel 2 (Center Action Panel) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-sm bg-surface/80 border border-border/40 p-2 flex items-center justify-center">
            <span className="text-[11px] font-bold text-accent tracking-widest">
              [CRITICAL EVENT DETECTED]
            </span>
          </div>
          <div className="rounded-sm bg-surface-elevated/90 border border-border/40 p-2 flex flex-col justify-end">
            <div className="w-16 h-1.5 bg-text-muted/20 rounded-full mb-1" />
            <div className="w-24 h-1.5 bg-text-muted/15 rounded-full" />
          </div>
        </div>

        {/* Panel 3 */}
        <div className="rounded-sm bg-surface-subtle/80 border border-border/40 p-3 flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <div className="w-40 h-2 bg-text-muted/20 rounded-full" />
            <div className="w-28 h-2 bg-text-muted/15 rounded-full" />
          </div>
          <span className="text-[9px] font-mono text-text-muted">PANEL {pageNumber}.3</span>
        </div>
      </div>

      {/* Bottom Page Number Stamp */}
      <div className="flex items-center justify-between text-[11px] font-mono text-text-muted border-t border-border/30 pt-1">
        <span>KAIYO READER</span>
        <span className="font-bold text-text-primary">
          — {pageNumber} / {totalPages} —
        </span>
      </div>
    </div>
  );
}
