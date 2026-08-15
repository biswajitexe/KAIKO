"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PlusIcon,
  StarIcon,
} from "@/components/icons";
import type { FeaturedItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  items: FeaturedItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-rotation with pause-on-hover
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, items.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  const currentItem = items[currentIndex];
  if (!currentItem) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Media"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative w-full rounded-md overflow-hidden bg-surface border border-border focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none mb-6 group/hero"
    >
      {/* Background Banner Image with Overlays */}
      <div className="relative min-h-[420px] sm:min-h-[360px] md:min-h-0 md:aspect-[21/9] lg:aspect-[24/9] w-full overflow-hidden bg-surface-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentItem.bannerImage}
          alt={currentItem.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-slow group-hover/hero:scale-[1.01]"
        />

        {/* Cinematic Multi-layered Vignette Gradients */}
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
        {/* Left gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/60 to-transparent w-full md:w-3/4" />
        {/* Subtle top vignette */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-bg/40 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-4 sm:p-6 md:p-10 flex flex-col justify-end max-w-2xl pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-2.5">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 text-12 font-medium">
            {currentItem.badge && (
              <span className="px-2 py-0.5 rounded-sm bg-accent text-white font-semibold uppercase tracking-wider text-12">
                {currentItem.badge}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-sm bg-surface-elevated/90 border border-border text-text-primary uppercase tracking-wide">
              {currentItem.type}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-surface-elevated/90 border border-border text-text-primary">
              <StarIcon className="w-3.5 h-3.5 text-accent" />
              <span>{currentItem.score.toFixed(1)}</span>
            </span>
            <span className="text-text-muted">
              {currentItem.year} • {currentItem.episodesOrChapters}
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-20 sm:text-28 md:text-36 font-bold text-text-primary tracking-tight leading-tight line-clamp-2">
              {currentItem.title}
            </h1>
            {currentItem.japaneseTitle && (
              <span className="text-12 text-text-muted font-normal mt-0.5 block">
                {currentItem.japaneseTitle}
              </span>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-14 text-text-secondary line-clamp-2 max-w-xl hidden sm:block leading-relaxed">
            {currentItem.synopsis}
          </p>

          {/* Genre Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {currentItem.genres.map((genre) => (
              <span
                key={genre}
                className="text-12 text-text-muted bg-surface/80 border border-border px-2 py-0.5 rounded-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={
                currentItem.type === "anime"
                  ? `/anime/${currentItem.slug}/watch`
                  : `/manga/${currentItem.slug}/read`
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white font-semibold text-14 hover:bg-accent-hover active:bg-accent-active transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <PlayIcon className="w-4 h-4 fill-current" />
              <span>
                {currentItem.type === "anime" ? "Watch Ep 1" : "Read Ch 1"}
              </span>
            </Link>

            <button
              type="button"
              aria-label={`Add ${currentItem.title} to watchlist`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-surface-elevated border border-border text-text-primary font-medium text-14 hover:border-border-strong hover:bg-surface-active transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Watchlist</span>
            </button>

            <Link
              href={`/${currentItem.type}/${currentItem.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-text-secondary hover:text-text-primary text-14 font-medium transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Manual Arrow Controls (Desktop) */}
      <div className="absolute right-4 bottom-4 z-10 flex items-center gap-1.5">
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
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}: ${item.title}`}
            aria-current={index === currentIndex ? "true" : undefined}
            className={cn(
              "h-1.5 rounded-full transition-all duration-normal focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
              index === currentIndex
                ? "w-6 bg-accent"
                : "w-2 bg-border-strong hover:bg-text-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}
