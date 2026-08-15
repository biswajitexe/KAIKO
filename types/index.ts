/**
 * Media Platform Domain Types
 */

export type MediaType = "anime" | "manga";

export type MediaStatus = "ongoing" | "completed" | "hiatus" | "upcoming";

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface MediaItem {
  id: string;
  slug: string;
  title: {
    english?: string;
    romaji?: string;
    native?: string;
  };
  type: MediaType;
  status: MediaStatus;
  synopsis: string;
  coverImage: string;
  bannerImage?: string;
  genres: Genre[];
  rating?: number;
  releaseYear?: number;
}

export interface AnimeDetail extends MediaItem {
  type: "anime";
  totalEpisodes?: number;
  episodes: Episode[];
  durationPerEpisode?: number; // in minutes
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  thumbnail?: string;
  duration?: number;
  airDate?: string;
  videoUrl?: string;
}

export interface MangaDetail extends MediaItem {
  type: "manga";
  totalChapters?: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  number: number;
  title?: string;
  releaseDate?: string;
  pages?: string[];
}

export interface ReaderSettings {
  readingDirection: "vertical" | "ltr" | "rtl";
  fitMode: "width" | "height" | "original";
  zoomLevel: number;
  gap: boolean;
}
