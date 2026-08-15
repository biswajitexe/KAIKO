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
  autoSlideInterval = 6500,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const switchSlide = useCallback((newIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 180);
  }, []);

  const nextSlide = useCallback(() => {
    const nextIdx = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    switchSlide(nextIdx);
  }, [currentIndex, items.length, switchSlide]);

  const prevSlide = useCallback(() => {
    const prevIdx = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    switchSlide(prevIdx);
  }, [currentIndex, items.length, switchSlide]);

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
      className="relative w-full rounded-xl overflow-hidden bg-surface border border-border/80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none mb-8 group/hero shadow-2xl"
    >
      {/* Background Container */}
      <div className="relative min-h-[480px] sm:min-h-[440px] md:aspect-[21/9] lg:aspect-[24/9] w-full overflow-hidden bg-bg">
        {/* Layer 1: Ambient Blurred Glow Layer */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`ambient-${currentItem.id}`}
          src={currentItem.bannerImage || currentItem.coverImage}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center filter blur-3xl scale-125 opacity-35 transition-opacity duration-700 pointer-events-none"
        />

        {/* Layer 2: Main Backdrop Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`main-${currentItem.id}`}
          src={currentItem.bannerImage || currentItem.coverImage}
          alt={currentItem.title}
          referrerPolicy="no-referrer"
          className={cn(
            "w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover/hero:scale-[1.02]",
            isTransitioning ? "opacity-40 scale-[0.99]" : "opacity-85 scale-100"
          )}
        />

        {/* Layer 3: Cinematic Multi-layered Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/75 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg/70 to-transparent" />
      </div>

      {/* Content Overlay Grid */}
      <div className="absolute inset-0 p-5 sm:p-8 md:p-10 lg:p-12 flex items-end justify-between pointer-events-none z-10">
        {/* Left Column: Title & Meta Info */}
        <div
          className={cn(
            "pointer-events-auto flex flex-col gap-3 max-w-2xl transition-all duration-300",
            isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          )}
        >
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 text-12 font-medium">
            {currentItem.badge && (
              <span className="px-2.5 py-0.5 rounded-sm bg-accent text-white font-bold uppercase tracking-wider text-[11px] shadow-md shadow-accent/30">
                {currentItem.badge}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-sm bg-surface-elevated/90 backdrop-blur-md border border-border text-text-primary font-semibold uppercase tracking-wide text-12">
              {currentItem.type}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-surface-elevated/90 backdrop-blur-md border border-border text-text-primary text-12">
              <StarIcon className="w-3.5 h-3.5 text-accent fill-current" />
              <span className="font-bold">{currentItem.score ? currentItem.score.toFixed(1) : "9.0"}</span>
            </span>
            <span className="text-12 font-mono text-text-muted bg-surface/70 px-2 py-0.5 rounded-sm border border-border-subtle backdrop-blur-md">
              {currentItem.seasonOrFormat || `${currentItem.year} • ${currentItem.episodesOrChapters}`}
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-22 sm:text-30 md:text-36 lg:text-40 font-extrabold text-text-primary tracking-tight leading-tight line-clamp-2 drop-shadow-md">
              {currentItem.title}
            </h1>
            {currentItem.japaneseTitle && (
              <span className="text-12 text-text-muted font-normal mt-0.5 block font-mono">
                {currentItem.japaneseTitle}
              </span>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-14 text-text-secondary line-clamp-2 max-w-xl hidden sm:block leading-relaxed drop-shadow-sm">
            {currentItem.synopsis}
          </p>

          {/* Genre Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {currentItem.genres.slice(0, 4).map((genre) => (
              <span
                key={genre}
                className="text-12 text-text-muted bg-surface-elevated/80 backdrop-blur-md border border-border px-2.5 py-0.5 rounded-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={streamHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent text-white font-semibold text-14 hover:bg-accent-hover active:bg-accent-active transition-all duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none shadow-lg shadow-accent/25"
            >
              <PlayIcon className="w-4 h-4 fill-current" />
              <span>
                {currentItem.type === "anime" ? "Watch Ep 1" : "Read Ch 1"}
              </span>
            </Link>

            <button
              type="button"
              aria-label={`Add ${currentItem.title} to watchlist`}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-surface-elevated/90 backdrop-blur-md border border-border text-text-primary font-medium text-14 hover:border-border-strong hover:bg-surface-active transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Watchlist</span>
            </button>

            <Link
              href={targetHref}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-md bg-surface/70 hover:bg-surface-elevated backdrop-blur-md border border-border text-text-secondary hover:text-text-primary text-14 font-medium transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <span>Details</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-text-muted" />
            </Link>
          </div>
        </div>

        {/* Right Column: High-Res Portrait Card Showcase (Desktop) */}
        <div
          className={cn(
            "pointer-events-auto hidden md:flex flex-col flex-shrink-0 w-44 lg:w-52 aspect-[2/3] rounded-lg overflow-hidden border-2 border-border/80 shadow-2xl bg-surface-elevated transition-all duration-500 mb-2 mr-4 hover:scale-105 hover:border-accent",
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentItem.coverImage}
            alt={currentItem.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Manual Arrow Controls (Desktop) */}
      <div className="absolute right-4 bottom-4 z-20 hidden sm:flex items-center gap-1.5">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous featured title"
          className="p-2.5 rounded-md bg-bg/85 backdrop-blur-md border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none shadow-md"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next featured title"
          className="p-2.5 rounded-md bg-bg/85 backdrop-blur-md border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none shadow-md"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Indicator Dots */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20"
        aria-label="Carousel pagination"
      >
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => switchSlide(index)}
              aria-label={`Go to slide ${index + 1}: ${item.title}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all duration-normal focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                isActive
                  ? "w-6 bg-accent shadow-sm shadow-accent/50"
                  : "w-2 bg-white/30 hover:bg-white/50"
              )}
            />
          );
        })}
      </div>
    </section>
  );
}
