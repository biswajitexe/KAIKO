import type { Metadata } from "next";
import Link from "next/link";
import { getRealAnimeDetail } from "@/lib/data-loader";
import { VideoPlayerChrome } from "@/components/video-player/video-player-chrome";
import { EpisodeSelector } from "@/components/video-player/episode-selector";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  StarIcon,
} from "@/components/icons";

interface WatchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ep?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: WatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { ep } = await searchParams;
  const anime = await getRealAnimeDetail(slug);
  const epNum = ep ? parseInt(ep, 10) : 1;

  return {
    title: `Watch ${anime.title} Episode ${epNum} — KAIYO`,
    description: `Stream ${anime.title} Episode ${epNum} in 1080p HD with English subtitles.`,
  };
}

export default async function WatchAnimePage({
  params,
  searchParams,
}: WatchPageProps) {
  const { slug } = await params;
  const { ep } = await searchParams;
  const anime = await getRealAnimeDetail(slug);

  const epNumber = ep ? Math.max(1, parseInt(ep, 10) || 1) : 1;
  const currentEpisode =
    anime.episodesList.find((e) => e.number === epNumber) ||
    anime.episodesList[0] || {
      id: `ep-${epNumber}`,
      number: epNumber,
      title: `Episode ${epNumber}`,
      thumbnail: anime.coverImage,
      duration: "24m",
      airDate: "Broadcast",
    };

  const prevEp = epNumber > 1 ? epNumber - 1 : null;
  const nextEp = epNumber < anime.episodesList.length ? epNumber + 1 : null;

  return (
    <div className="flex flex-col gap-6 max-w-container mx-auto">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-12 text-text-muted"
      >
        <Link href="/" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/anime/${anime.slug}`}
          className="hover:text-text-primary transition-colors truncate max-w-[200px]"
        >
          {anime.title}
        </Link>
        <span>/</span>
        <span className="text-text-primary font-medium">Episode {epNumber}</span>
      </nav>

      {/* Main Player & Sidebar Flex Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left/Main Column: Full-width Player + Episode Info */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {/* Full-width Video Player Chrome */}
          <VideoPlayerChrome
            animeTitle={anime.title}
            animeSlug={anime.slug}
            episodeNumber={epNumber}
            episodeTitle={currentEpisode.title}
            totalEpisodes={anime.episodesList.length}
          />

          {/* Episode Quick Jump & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-md bg-surface border border-border">
            <div className="flex items-center gap-2">
              {/* Prev Ep Button */}
              {prevEp ? (
                <Link
                  href={`/anime/${anime.slug}/watch?ep=${prevEp}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface-elevated border border-border text-12 font-semibold text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" />
                  <span>Prev EP</span>
                </Link>
              ) : (
                <span className="px-3 py-1.5 rounded-sm bg-surface-subtle border border-border-subtle text-12 font-medium text-text-muted opacity-40 cursor-not-allowed">
                  Prev EP
                </span>
              )}

              {/* Next Ep Button */}
              {nextEp ? (
                <Link
                  href={`/anime/${anime.slug}/watch?ep=${nextEp}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-accent text-white text-12 font-semibold hover:bg-accent-hover transition-colors"
                >
                  <span>Next EP</span>
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="px-3 py-1.5 rounded-sm bg-surface-subtle border border-border-subtle text-12 font-medium text-text-muted opacity-40 cursor-not-allowed">
                  Next EP
                </span>
              )}
            </div>

            {/* Quick Watchlist & Details */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Add ${anime.title} to watchlist`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Watchlist</span>
              </button>

              <Link
                href={`/anime/${anime.slug}`}
                className="px-3 py-1.5 rounded-sm text-12 font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Series Details →
              </Link>
            </div>
          </div>

          {/* Episode Info & Series Context */}
          <div className="flex flex-col gap-3 p-4 rounded-md bg-surface border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h1 className="text-16 sm:text-20 font-bold text-text-primary">
                  {anime.title} — Episode {epNumber}
                </h1>
                <p className="text-14 text-text-secondary mt-0.5">
                  {currentEpisode.title}
                </p>
              </div>

              <div className="flex items-center gap-2 text-12">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-surface-elevated border border-border text-text-primary font-semibold">
                  <StarIcon className="w-3.5 h-3.5 text-accent" />
                  <span>{anime.score.toFixed(1)}</span>
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-surface-elevated border border-border text-text-muted">
                  {anime.studio}
                </span>
              </div>
            </div>

            <p className="text-14 text-text-secondary leading-relaxed">
              {currentEpisode.description || anime.synopsis}
            </p>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {anime.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 rounded-sm bg-surface-elevated text-12 text-text-muted border border-border"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Episode Selector */}
        <EpisodeSelector
          animeSlug={anime.slug}
          currentEpisode={epNumber}
          episodes={anime.episodesList}
        />
      </div>
    </div>
  );
}
