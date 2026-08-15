import type { Metadata } from "next";
import { getMangaDetails } from "@/lib/mock-data";
import { MediaDetailView } from "@/components/media-detail-view";

interface MangaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: MangaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const manga = getMangaDetails(slug);

  return {
    title: `${manga.title} — KAIYO Manga`,
    description: manga.synopsis,
  };
}

export default async function MangaDetailPage({ params }: MangaPageProps) {
  const { slug } = await params;
  const manga = getMangaDetails(slug);

  return <MediaDetailView type="manga" media={manga} />;
}
