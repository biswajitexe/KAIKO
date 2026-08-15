"use client";

import { GENRE_LIST } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export interface FilterState {
  type: "all" | "anime" | "manga" | "manhwa";
  genres: string[];
  status: "all" | "airing-ongoing" | "completed" | "upcoming";
  year: string;
  minRating: number;
}

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  activeFilterCount: number;
  className?: string;
}

export function SearchFilters({
  filters,
  onFilterChange,
  onReset,
  activeFilterCount,
  className,
}: SearchFiltersProps) {
  const toggleGenre = (genre: string) => {
    const nextGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];
    onFilterChange({ ...filters, genres: nextGenres });
  };

  return (
    <aside
      className={cn(
        "flex flex-col gap-5 p-4 rounded-md bg-surface border border-border text-12 select-none",
        className
      )}
      aria-label="Filter Catalog"
    >
      {/* Filters Header & Reset */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-14 font-bold text-text-primary">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-accent text-white font-mono font-bold text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-text-muted hover:text-accent transition-colors font-medium text-12"
          >
            Reset All
          </button>
        )}
      </div>

      {/* 1. Media Type Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-12 font-semibold text-text-primary">
          Media Type
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "all", label: "All Formats" },
            { id: "anime", label: "Anime" },
            { id: "manga", label: "Manga" },
            { id: "manhwa", label: "Manhwa" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  type: item.id as FilterState["type"],
                })
              }
              className={cn(
                "px-2.5 py-1.5 rounded-sm border text-center font-medium transition-colors duration-fast",
                filters.type === item.id
                  ? "bg-accent border-accent text-white font-semibold"
                  : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary hover:border-border-strong"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Genre Multi-Select Pills */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-12 font-semibold text-text-primary">
            Genres ({filters.genres.length || "Any"})
          </label>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {GENRE_LIST.map((genre) => {
            const isSelected = filters.genres.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={cn(
                  "px-2 py-1 rounded-sm border text-[11px] font-medium transition-colors duration-fast",
                  isSelected
                    ? "bg-accent/20 border-accent text-accent font-semibold"
                    : "bg-surface-elevated border-border text-text-muted hover:text-text-primary hover:border-border-strong"
                )}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Airing / Publication Status */}
      <div className="flex flex-col gap-2">
        <label className="text-12 font-semibold text-text-primary">
          Status
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "all", label: "Any Status" },
            { id: "airing-ongoing", label: "Ongoing" },
            { id: "completed", label: "Completed" },
            { id: "upcoming", label: "Upcoming" },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  status: st.id as FilterState["status"],
                })
              }
              className={cn(
                "px-2 py-1.5 rounded-sm border text-center font-medium transition-colors duration-fast",
                filters.status === st.id
                  ? "bg-accent border-accent text-white font-semibold"
                  : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary hover:border-border-strong"
              )}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Release Year */}
      <div className="flex flex-col gap-2">
        <label className="text-12 font-semibold text-text-primary">
          Release Year
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {["All", "2025", "2024", "2023", "2022", "Older"].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => onFilterChange({ ...filters, year: yr })}
              className={cn(
                "py-1 rounded-sm border text-center font-medium transition-colors duration-fast",
                filters.year === yr
                  ? "bg-accent border-accent text-white font-semibold"
                  : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary hover:border-border-strong"
              )}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Rating Range */}
      <div className="flex flex-col gap-2">
        <label className="text-12 font-semibold text-text-primary">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { val: 0, label: "Any" },
            { val: 8.0, label: "★ 8.0+" },
            { val: 8.5, label: "★ 8.5+" },
            { val: 9.0, label: "★ 9.0+" },
          ].map((r) => (
            <button
              key={r.val}
              type="button"
              onClick={() => onFilterChange({ ...filters, minRating: r.val })}
              className={cn(
                "py-1 rounded-sm border text-center font-medium transition-colors duration-fast",
                filters.minRating === r.val
                  ? "bg-accent border-accent text-white font-semibold"
                  : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary hover:border-border-strong"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
