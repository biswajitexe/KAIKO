import type { Metadata } from "next";
import { getAnimeDetails } from "@/lib/mock-data";
import { MediaDetailView } from "@/components/media-detail-view";

interface AnimePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AnimePageProps): Promise<Metadata> {
  const { slug } = await params;
  const anime = getAnimeDetails(slug);

  return {
    title: `${anime.title} — KAIYO Anime`,
    description: anime.synopsis,
  };
}

export default async function AnimeDetailPage({ params }: AnimePageProps) {
  const { slug } = await params;
  const anime = getAnimeDetails(slug);

  return <MediaDetailView type="anime" media={anime} />;
}
