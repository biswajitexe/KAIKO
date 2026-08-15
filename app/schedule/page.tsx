"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayIcon, StarIcon, ClockIcon } from "@/components/icons";
import { TRENDING_ANIME, type AnimeItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type DayType = (typeof DAYS)[number];

const SCHEDULE_DATA: Record<
  DayType,
  Array<{ anime: AnimeItem; airTime: string; episode: number }>
> = {
  Monday: [
    { anime: TRENDING_ANIME[0], airTime: "18:30 JST", episode: 28 },
    { anime: TRENDING_ANIME[4], airTime: "22:00 JST", episode: 12 },
  ],
  Tuesday: [
    { anime: TRENDING_ANIME[5], airTime: "23:00 JST", episode: 7 },
  ],
  Wednesday: [
    { anime: TRENDING_ANIME[6], airTime: "20:00 JST", episode: 15 },
  ],
  Thursday: [
    { anime: TRENDING_ANIME[7], airTime: "23:30 JST", episode: 14 },
  ],
  Friday: [
    { anime: TRENDING_ANIME[3], airTime: "21:00 JST", episode: 1 },
  ],
  Saturday: [
    { anime: TRENDING_ANIME[1], airTime: "24:00 JST", episode: 9 },
    { anime: TRENDING_ANIME[2], airTime: "19:00 JST", episode: 1 },
  ],
  Sunday: [
    { anime: TRENDING_ANIME[0], airTime: "17:00 JST", episode: 1 },
    { anime: TRENDING_ANIME[1], airTime: "23:00 JST", episode: 8 },
  ],
};

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<DayType>("Saturday");

  const currentSchedule = SCHEDULE_DATA[selectedDay] || [];

  return (
    <div className="flex flex-col gap-8 max-w-container mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-lg bg-surface border border-border flex flex-col gap-2">
        <span className="text-12 font-mono uppercase tracking-widest text-accent font-semibold">
          BROADCAST CALENDAR
        </span>
        <h1 className="text-24 sm:text-32 font-bold text-text-primary">
          Weekly Anime Release Schedule
        </h1>
        <p className="text-14 text-text-secondary max-w-2xl">
          Track upcoming episode broadcast times, simulcast premiere countdowns, and air dates across the week.
        </p>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border">
        {DAYS.map((day) => {
          const isSelected = day === selectedDay;
          const count = SCHEDULE_DATA[day]?.length || 0;

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={cn(
                "px-4 py-2.5 rounded-sm border font-medium text-14 transition-colors flex items-center gap-2 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent",
                isSelected
                  ? "bg-accent border-accent text-white font-semibold"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border-strong"
              )}
            >
              <span>{day}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full font-mono text-[10px]",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-surface-elevated text-text-muted"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Items for Selected Day */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-18 font-bold text-text-primary">
            {selectedDay}&apos;s Airing Episodes ({currentSchedule.length})
          </h2>
          <span className="text-12 font-mono text-text-muted">
            All times in Japan Standard Time (JST)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSchedule.map(({ anime, airTime, episode }) => (
            <div
              key={`${anime.id}-${selectedDay}-${episode}`}
              className="p-4 rounded-md bg-surface border border-border flex gap-4 items-center justify-between hover:border-accent transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Poster miniature */}
                <div className="w-14 aspect-[2/3] rounded-sm overflow-hidden bg-surface-elevated flex-shrink-0 border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={anime.coverImage}
                    alt={anime.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded-sm bg-accent/20 border border-accent/40 text-accent font-mono font-semibold text-[10px]">
                      EP {episode}
                    </span>
                    <span className="flex items-center gap-1 text-12 font-mono text-text-muted">
                      <ClockIcon className="w-3 h-3 text-text-muted" />
                      {airTime}
                    </span>
                  </div>

                  <h3 className="text-14 font-bold text-text-primary truncate">
                    {anime.title}
                  </h3>

                  <div className="flex items-center gap-2 text-12 text-text-muted">
                    <span className="flex items-center gap-0.5 text-accent font-semibold">
                      <StarIcon className="w-3 h-3 fill-current" />
                      {anime.score.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{anime.studio}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/anime/${anime.slug}/watch?ep=${episode}`}
                className="px-3.5 py-2 rounded-sm bg-surface-elevated border border-border text-text-primary hover:border-accent hover:text-accent font-medium text-12 transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <PlayIcon className="w-3.5 h-3.5 fill-current" />
                <span>Watch</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
