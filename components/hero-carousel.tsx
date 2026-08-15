"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PlusIcon,
  StarIcon,
  ChevronRightIcon as ArrowRightIcon,
} from "@/components/icons";
import type { FeaturedItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  items: FeaturedItem[];
  autoSlideInterval?: number;
}

export function HeroCarousel({
  items,
  autoSlideInterval = 6000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, autoSlideInterval, items.length]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const targetHref = `/${currentItem.type}/${currentItem.slug}`;
  const streamHref =
    currentItem.type === "anime"
      ? `/anime/${currentItem.slug}/watch`
      : `/manga/${currentItem.slug}/read`;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured Titles"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative w-full rounded-lg overflow-hidden bg-surface border border-border focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none mb-8 group/hero shadow-2xl"
    >
      {/* Background Banner Image with Overlays */}
      <div className="relative min-h-[460px] sm:min-h-[420px] md:aspect-[21/9] lg:aspect-[23/9] w-full overflow-hidden bg-surface-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentItem.id}
          src={currentItem.bannerImage || currentItem.coverImage}
          alt={currentItem.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover/hero:scale-[1.02]"
        />

        {/* Cinematic Multi-layered Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/65 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bg/60 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-5 sm:p-8 md:p-12 flex flex-col justify-end max-w-3xl pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-3">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 text-12 font-medium">
            {currentItem.badge && (
              <span className="px-2.5 py-0.5 rounded-sm bg-accent text-white font-bold uppercase tracking-wider text-[11px] shadow-sm">
                {currentItem.badge}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-sm bg-surface-elevated/90 backdrop-blur-sm border border-border text-text-primary font-semibold uppercase tracking-wide text-12">
              {currentItem.type}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-surface-elevated/90 backdrop-blur-sm border border-border text-text-primary text-12">
              <StarIcon className="w-3.5 h-3.5 text-accent fill-current" />
              <span className="font-bold">{currentItem.score ? currentItem.score.toFixed(1) : "9.0"}</span>
            </span>
            <span className="text-12 font-mono text-text-muted bg-surface/60 px-2 py-0.5 rounded-sm border border-border-subtle backdrop-blur-sm">
              {currentItem.seasonOrFormat || `${currentItem.year} • ${currentItem.episodesOrChapters}`}
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-24 sm:text-32 md:text-40 font-extrabold text-text-primary tracking-tight leading-tight line-clamp-2">
              {currentItem.title}
            </h1>
            {currentItem.japaneseTitle && (
              <span className="text-12 text-text-muted font-normal mt-0.5 block font-mono">
                {currentItem.japaneseTitle}
              </span>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-14 text-text-secondary line-clamp-2 max-w-2xl hidden sm:block leading-relaxed">
            {currentItem.synopsis}
          </p>

          {/* Genre Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {currentItem.genres.slice(0, 4).map((genre) => (
              <span
                key={genre}
                className="text-12 text-text-muted bg-surface-elevated/80 backdrop-blur-sm border border-border px-2.5 py-0.5 rounded-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={streamHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent text-white font-semibold text-14 hover:bg-accent-hover active:bg-accent-active transition-all duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none shadow-lg shadow-accent/20"
            >
              <PlayIcon className="w-4 h-4 fill-current" />
              <span>
                {currentItem.type === "anime" ? "Watch Ep 1" : "Read Ch 1"}
              </span>
            </Link>

            <button
              type="button"
              aria-label={`Add ${currentItem.title} to watchlist`}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-surface-elevated border border-border text-text-primary font-medium text-14 hover:border-border-strong hover:bg-surface-active transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Watchlist</span>
            </button>

            <Link
              href={targetHref}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-md bg-surface/60 hover:bg-surface-elevated border border-border text-text-secondary hover:text-text-primary text-14 font-medium transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <span>Details</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-text-muted" />
            </Link>
          </div>
        </div>
      </div>

      {/* Manual Arrow Controls (Desktop) */}
      <div className="absolute right-4 bottom-4 z-10 hidden sm:flex items-center gap-1.5">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous featured title"
          className="p-2 rounded-md bg-bg/80 backdrop-blur-sm border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next featured title"
          className="p-2 rounded-md bg-bg/80 backdrop-blur-sm border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Indicator Dots */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10"
        aria-label="Carousel pagination"
      >
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}: ${item.title}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all duration-normal focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                isActive
                  ? "w-6 bg-accent"
                  : "w-2 bg-white/30 hover:bg-white/50"
              )}
            />
          );
        })}
      </div>
    </section>
  );
}
