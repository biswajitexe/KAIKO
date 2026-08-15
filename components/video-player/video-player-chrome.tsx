"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CheckIcon,
  ChevronLeftIcon,
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PlayIcon,
  RotateCcw10Icon,
  RotateCw10Icon,
  SettingsIcon,
  SkipForwardIcon,
  SubtitlesIcon,
  VolumeHighIcon,
  VolumeMutedIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

interface VideoPlayerChromeProps {
  animeTitle: string;
  animeSlug: string;
  episodeNumber: number;
  episodeTitle: string;
  totalEpisodes: number;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
}

export function VideoPlayerChrome({
  animeTitle,
  animeSlug,
  episodeNumber,
  episodeTitle,
  totalEpisodes,
  onNextEpisode,
}: VideoPlayerChromeProps) {
  // Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(342); // 05:42
  const [duration] = useState(1440); // 24:00 (standard anime duration)
  const [buffered] = useState(900); // 15:00
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [activeServer, setActiveServer] = useState("HD-1 (1080p)");
  const [activeQuality, setActiveQuality] = useState("1080p");
  const [activeSubtitle, setActiveSubtitle] = useState("English [Soft]");
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0x");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [scrubberHoverTime, setScrubberHoverTime] = useState<number | null>(null);
  const [scrubberHoverPos, setScrubberHoverPos] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format time (seconds -> MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Auto-hide controls
  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && !isSettingsOpen) {
      controlsTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 2800);
    }
  };

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    setIsControlsVisible(true);
  }, []);

  const skipTime = useCallback(
    (seconds: number) => {
      setCurrentTime((prev) => Math.max(0, Math.min(duration, prev + seconds)));
      setIsControlsVisible(true);
    },
    [duration]
  );

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key) {
        case " ":
        case "k":
        case "K":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
        case "M":
          e.preventDefault();
          setIsMuted((prev) => !prev);
          break;
        case "j":
        case "J":
          e.preventDefault();
          skipTime(-10);
          break;
        case "l":
        case "L":
          e.preventDefault();
          skipTime(10);
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipTime(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipTime(5);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.05));
          setIsMuted(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.05));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, toggleFullscreen, skipTime]);

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setScrubberHoverTime(percent * duration);
    setScrubberHoverPos(e.clientX - rect.left);
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(percent * duration);
  };

  const progressPercent = (currentTime / duration) * 100;
  const bufferedPercent = (buffered / duration) * 100;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
      className="relative w-full aspect-video max-h-[75vh] min-h-[320px] bg-reader-bg rounded-md overflow-hidden border border-border group select-none flex items-center justify-center"
      tabIndex={0}
      role="region"
      aria-label="Video Player"
    >
      {/* Background Pluggable Video Canvas */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full cursor-pointer flex items-center justify-center bg-gradient-to-br from-[#0c0d12] to-[#12141c]"
      >
        {/* Placeholder Simulated Anime Video Frame */}
        <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
          <span className="text-14 font-mono text-text-muted tracking-wide">
            [VIDEO SOURCE STREAM: {activeServer} • {activeQuality}]
          </span>
          <span className="text-12 text-text-muted/60 mt-1">
            {animeTitle} — EP {episodeNumber}
          </span>
        </div>
      </div>

      {/* Center Big Play/Pause Splash Icon on Click */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute z-20 w-16 h-16 rounded-full bg-accent/90 text-white flex items-center justify-center pl-1 hover:scale-110 transition-transform duration-fast focus-visible:ring-2 focus-visible:ring-accent"
        >
          <PlayIcon className="w-8 h-8 fill-current" />
        </button>
      )}

      {/* =========================================================================
          TOP PLAYER HEADER (Visible with Controls)
          ========================================================================= */}
      <div
        className={cn(
          "absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-bg/95 via-bg/60 to-transparent flex items-center justify-between gap-4 transition-opacity duration-normal",
          isControlsVisible || !isPlaying
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/anime/${animeSlug}`}
            className="p-1.5 rounded-sm bg-surface/80 border border-border text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Back to series details"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h2 className="text-14 font-semibold text-text-primary truncate">
              {animeTitle}
            </h2>
            <p className="text-12 text-text-muted truncate">
              Episode {episodeNumber}: {episodeTitle}
            </p>
          </div>
        </div>

        {/* Right: Server Switcher */}
        <div className="hidden sm:flex items-center gap-1 bg-surface/80 p-1 rounded-sm border border-border text-12">
          {["HD-1 (1080p)", "HD-2 (Multi-Sub)"].map((srv) => (
            <button
              key={srv}
              type="button"
              onClick={() => setActiveServer(srv)}
              className={cn(
                "px-2 py-0.5 rounded-sm font-medium transition-colors duration-fast",
                activeServer === srv
                  ? "bg-accent text-white"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {srv}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          BOTTOM PLAYER CONTROLS (Scrubber + Action Toolbar)
          ========================================================================= */}
      <div
        className={cn(
          "absolute bottom-0 inset-x-0 z-30 px-4 pb-3 pt-8 bg-gradient-to-t from-bg via-bg/85 to-transparent flex flex-col gap-2 transition-opacity duration-normal",
          isControlsVisible || !isPlaying
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Interactive Progress Scrubber */}
        <div
          onClick={handleScrubberClick}
          onMouseMove={handleScrubberMouseMove}
          onMouseLeave={() => setScrubberHoverTime(null)}
          className="relative w-full h-3 group/scrubber cursor-pointer flex items-center"
          role="slider"
          aria-label="Video seek scrubber"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
        >
          {/* Hover Time Tooltip */}
          {scrubberHoverTime !== null && (
            <div
              className="absolute -top-7 px-1.5 py-0.5 rounded-sm bg-surface-elevated border border-border text-12 font-mono text-text-primary pointer-events-none -translate-x-1/2"
              style={{ left: `${scrubberHoverPos}px` }}
            >
              {formatTime(scrubberHoverTime)}
            </div>
          )}

          {/* Scrubber Track */}
          <div className="w-full h-1 group-hover/scrubber:h-2 rounded-full bg-surface-elevated overflow-hidden relative transition-all duration-fast">
            {/* Buffered progress */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-surface-active"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* Played progress */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-accent"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Scrubber Thumb */}
          <div
            className="absolute w-3.5 h-3.5 rounded-full bg-accent text-white shadow-sm -translate-x-1/2 opacity-0 group-hover/scrubber:opacity-100 transition-opacity duration-fast"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center justify-between gap-3 text-text-secondary">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            {/* Play / Pause */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause (Space/K)" : "Play (Space/K)"}
              className="p-1.5 rounded-sm hover:text-text-primary hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent"
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5 fill-current" />
              ) : (
                <PlayIcon className="w-5 h-5 fill-current" />
              )}
            </button>

            {/* Skip -10s */}
            <button
              type="button"
              onClick={() => skipTime(-10)}
              aria-label="Skip backward 10s (J)"
              className="p-1.5 rounded-sm hover:text-text-primary hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent"
            >
              <RotateCcw10Icon className="w-5 h-5" />
            </button>

            {/* Skip +10s */}
            <button
              type="button"
              onClick={() => skipTime(10)}
              aria-label="Skip forward 10s (L)"
              className="p-1.5 rounded-sm hover:text-text-primary hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent"
            >
              <RotateCw10Icon className="w-5 h-5" />
            </button>

            {/* Next Episode Button */}
            {episodeNumber < totalEpisodes && onNextEpisode && (
              <button
                type="button"
                onClick={onNextEpisode}
                aria-label="Next episode"
                className="p-1.5 rounded-sm hover:text-text-primary hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent"
              >
                <SkipForwardIcon className="w-5 h-5" />
              </button>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol ml-0.5 sm:ml-1">
              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                aria-label={isMuted ? "Unmute (M)" : "Mute (M)"}
                className="p-1.5 rounded-sm hover:text-text-primary hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent"
              >
                {isMuted || volume === 0 ? (
                  <VolumeMutedIcon className="w-5 h-5" />
                ) : (
                  <VolumeHighIcon className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="hidden sm:block w-16 h-1 accent-accent bg-surface-elevated rounded-lg cursor-pointer opacity-80 hover:opacity-100"
                aria-label="Volume slider"
              />
            </div>

            {/* Timestamp Counter */}
            <div className="text-[11px] sm:text-12 font-mono text-text-muted ml-1 sm:ml-2">
              <span className="text-text-primary">{formatTime(currentTime)}</span>
              <span> / </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Auto Play Next Toggle */}
            <div className="hidden md:flex items-center gap-2 px-2 py-1 rounded-sm bg-surface/60 border border-border text-12">
              <span className="text-text-muted">Auto Next</span>
              <button
                type="button"
                onClick={() => setAutoPlayNext(!autoPlayNext)}
                aria-label={`Toggle autoplay next episode (Currently ${autoPlayNext ? "On" : "Off"})`}
                className={cn(
                  "w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 focus-visible:ring-1 focus-visible:ring-accent",
                  autoPlayNext ? "bg-accent" : "bg-surface-active"
                )}
              >
                <span
                  className={cn(
                    "w-3 h-3 rounded-full bg-white transition-transform duration-fast",
                    autoPlayNext ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Subtitle Quick Icon */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="Subtitles & Audio"
              className="p-1.5 rounded-sm hover:text-text-primary hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent"
            >
              <SubtitlesIcon className="w-5 h-5" />
            </button>

            {/* Settings Popover Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                aria-label="Playback Settings"
                className={cn(
                  "p-1.5 rounded-sm hover:text-text-primary hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent",
                  isSettingsOpen && "text-accent bg-surface"
                )}
              >
                <SettingsIcon className="w-5 h-5" />
              </button>

              {/* Settings Dropdown Popover */}
              {isSettingsOpen && (
                <div className="absolute right-0 bottom-10 w-64 p-3 rounded-md bg-surface-elevated border border-border shadow-lg flex flex-col gap-3 z-50 text-12">
                  <div className="font-semibold text-text-primary border-b border-border pb-1.5 flex items-center justify-between">
                    <span>Playback Settings</span>
                    <button
                      type="button"
                      onClick={() => setIsSettingsOpen(false)}
                      className="text-text-muted hover:text-text-primary"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Resolution Selector */}
                  <div className="flex flex-col gap-1">
                    <span className="text-text-muted font-medium">Quality</span>
                    <div className="grid grid-cols-4 gap-1">
                      {["1080p", "720p", "480p", "Auto"].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setActiveQuality(q)}
                          className={cn(
                            "py-1 rounded-sm border text-center font-medium transition-colors",
                            activeQuality === q
                              ? "bg-accent border-accent text-white"
                              : "bg-surface border-border text-text-secondary hover:text-text-primary"
                          )}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subtitle Selector */}
                  <div className="flex flex-col gap-1">
                    <span className="text-text-muted font-medium">Subtitles</span>
                    <div className="flex flex-col gap-0.5">
                      {[
                        "English [Soft]",
                        "Spanish [Soft]",
                        "French [Soft]",
                        "Off",
                      ].map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setActiveSubtitle(sub)}
                          className={cn(
                            "flex items-center justify-between px-2 py-1 rounded-sm transition-colors text-left",
                            activeSubtitle === sub
                              ? "bg-surface text-accent font-semibold"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                          )}
                        >
                          <span>{sub}</span>
                          {activeSubtitle === sub && (
                            <CheckIcon className="w-3.5 h-3.5 text-accent" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speed Selector */}
                  <div className="flex flex-col gap-1">
                    <span className="text-text-muted font-medium">Speed</span>
                    <div className="grid grid-cols-4 gap-1">
                      {["0.75x", "1.0x", "1.25x", "1.5x"].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setPlaybackSpeed(spd)}
                          className={cn(
                            "py-1 rounded-sm border text-center font-medium transition-colors",
                            playbackSpeed === spd
                              ? "bg-accent border-accent text-white"
                              : "bg-surface border-border text-text-secondary hover:text-text-primary"
                          )}
                        >
                          {spd}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
              className="p-1.5 rounded-sm hover:text-text-primary hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent"
            >
              {isFullscreen ? (
                <MinimizeIcon className="w-5 h-5" />
              ) : (
                <MaximizeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
