import type { Metadata } from "next";
import { getRealAnimeDetail } from "@/lib/data-loader";
import { MediaDetailView } from "@/components/media-detail-view";

interface AnimePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AnimePageProps): Promise<Metadata> {
  const { slug } = await params;
  const anime = await getRealAnimeDetail(slug);

  return {
    title: `${anime.title} — KAIYO Anime`,
    description: anime.synopsis,
  };
}

export default async function AnimeDetailPage({ params }: AnimePageProps) {
  const { slug } = await params;
  const anime = await getRealAnimeDetail(slug);

  return <MediaDetailView type="anime" media={anime} />;
}
