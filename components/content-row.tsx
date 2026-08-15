"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

interface ContentRowProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  children: React.ReactNode;
}

export function ContentRow({
  title,
  subtitle,
  viewAllHref,
  children,
}: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const current = rowRef.current;
    if (current) {
      current.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (current) current.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    const offset = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative flex flex-col gap-3 py-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-20 font-bold text-text-primary tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <span className="hidden sm:inline text-12 text-text-muted font-normal">
              {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-12 font-medium text-text-secondary hover:text-accent transition-colors duration-fast px-2 py-1 rounded-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              View All
            </Link>
          )}

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label={`Scroll ${title} left`}
              className="p-1.5 rounded-md bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label={`Scroll ${title} right`}
              className="p-1.5 rounded-md bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Content */}
      <div
        ref={rowRef}
        tabIndex={0}
        role="region"
        aria-label={`${title} carousel`}
        className="flex items-stretch gap-3 overflow-x-auto scroll-smooth pb-2 pt-1 no-scrollbar focus-visible:ring-1 focus-visible:ring-accent focus-visible:outline-none -mx-4 px-4 md:-mx-8 md:px-8"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {children}
      </div>
    </section>
  );
}
