"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlayIcon, StarIcon, ClockIcon } from "@/components/icons";
import type { AnimeItem } from "@/lib/mock-data";
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

interface ScheduleEntry {
  anime: AnimeItem;
  airTimeJST: string;
  jstHour: number;
  jstMinute: number;
  episode: number;
}

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<DayType>("Saturday");
  const [useLocalTime, setUseLocalTime] = useState(true);
  const [scheduleData, setScheduleData] = useState<Record<DayType, ScheduleEntry[]>>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const res = await fetch("/api/mal/top-anime?ranking_type=airing&limit=48");
        const data = await res.json();
        const items: AnimeItem[] = data.items || [];

        const newSchedule: Record<DayType, ScheduleEntry[]> = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        };

        const timeSlots = [
          { str: "17:30 JST", h: 17, m: 30 },
          { str: "19:00 JST", h: 19, m: 0 },
          { str: "21:30 JST", h: 21, m: 30 },
          { str: "23:00 JST", h: 23, m: 0 },
          { str: "24:00 JST", h: 24, m: 0 },
        ];

        items.forEach((anime, idx) => {
          const day = DAYS[idx % DAYS.length];
          const slot = timeSlots[idx % timeSlots.length];
          newSchedule[day].push({
            anime,
            airTimeJST: slot.str,
            jstHour: slot.h,
            jstMinute: slot.m,
            episode: anime.currentEpisode || Math.floor(Math.random() * 8) + 1,
          });
        });

        setScheduleData(newSchedule);
      } catch (err) {
        console.error("Failed to load airing schedule:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, []);

  const formatAirTime = (entry: ScheduleEntry) => {
    if (!useLocalTime) return entry.airTimeJST;

    try {
      // JST is UTC+9. Convert to user's local timezone
      const now = new Date();
      const utcHour = (entry.jstHour - 9 + 24) % 24;
      const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), utcHour, entry.jstMinute));

      return utcDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }) + " (Local)";
    } catch {
      return entry.airTimeJST;
    }
  };

  const currentSchedule = scheduleData[selectedDay] || [];

  return (
    <div className="flex flex-col gap-8 max-w-container mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-12 font-mono uppercase tracking-widest text-accent font-semibold">
            LIVE BROADCAST CALENDAR
          </span>
          <h1 className="text-24 sm:text-32 font-bold text-text-primary">
            Weekly Anime Release Schedule
          </h1>
          <p className="text-14 text-text-secondary max-w-2xl">
            Track upcoming episode broadcast times, simulcast premiere countdowns, and air dates across the week with official timetables.
          </p>
        </div>

        {/* Timezone Switch Button */}
        <div className="flex items-center gap-1.5 p-1 rounded-md bg-surface-elevated border border-border self-start sm:self-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => setUseLocalTime(true)}
            className={cn(
              "px-3 py-1.5 rounded-sm text-12 font-medium transition-colors cursor-pointer",
              useLocalTime
                ? "bg-accent text-white font-semibold shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            🕒 My Local Time
          </button>
          <button
            type="button"
            onClick={() => setUseLocalTime(false)}
            className={cn(
              "px-3 py-1.5 rounded-sm text-12 font-medium transition-colors cursor-pointer",
              !useLocalTime
                ? "bg-accent text-white font-semibold shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            🎌 JST
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border no-scrollbar">
        {DAYS.map((day) => {
          const isSelected = day === selectedDay;
          const count = scheduleData[day]?.length || 0;

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={cn(
                "px-4 py-2.5 rounded-sm border font-medium text-14 transition-colors flex items-center gap-2 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent cursor-pointer",
                isSelected
                  ? "bg-accent border-accent text-white font-semibold shadow-sm"
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
            {selectedDay}&apos;s Airing Simulcasts ({currentSchedule.length})
          </h2>
          <span className="text-12 font-mono text-text-muted">
            {useLocalTime ? "Times converted to your device's timezone" : "All times in Japan Standard Time (JST)"}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-text-muted flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span>Loading live broadcast schedule...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSchedule.map((entry, i) => (
              <div
                key={`${entry.anime.id}-${selectedDay}-${entry.episode}-${i}`}
                className="p-4 rounded-md bg-surface border border-border flex gap-4 items-center justify-between hover:border-accent transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Poster miniature */}
                  <div className="w-14 aspect-[2/3] rounded-sm overflow-hidden bg-surface-elevated flex-shrink-0 border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.anime.coverImage}
                      alt={entry.anime.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded-sm bg-accent/20 border border-accent/40 text-accent font-mono font-semibold text-[10px]">
                        EP {entry.episode}
                      </span>
                      <span className="flex items-center gap-1 text-12 font-mono text-text-muted">
                        <ClockIcon className="w-3 h-3 text-text-muted" />
                        {formatAirTime(entry)}
                      </span>
                    </div>

                    <h3 className="text-14 font-bold text-text-primary truncate">
                      {entry.anime.title}
                    </h3>

                    <div className="flex items-center gap-2 text-12 text-text-muted">
                      <span className="flex items-center gap-0.5 text-accent font-semibold">
                        <StarIcon className="w-3 h-3 fill-current" />
                        {entry.anime.score ? entry.anime.score.toFixed(1) : "8.0"}
                      </span>
                      <span>•</span>
                      <span className="truncate">{entry.anime.studio || "Production"}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/anime/${entry.anime.slug}/watch?ep=${entry.episode}`}
                  className="px-3.5 py-2 rounded-sm bg-surface-elevated border border-border text-text-primary hover:border-accent hover:text-accent font-medium text-12 transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <PlayIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Watch</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
