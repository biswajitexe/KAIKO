import type { Metadata } from "next";
import { getRealMangaDetail } from "@/lib/data-loader";
import { MediaDetailView } from "@/components/media-detail-view";

interface MangaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: MangaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const manga = await getRealMangaDetail(slug);

  return {
    title: `${manga.title} — KAIYO Manga`,
    description: manga.synopsis,
  };
}

export default async function MangaDetailPage({ params }: MangaPageProps) {
  const { slug } = await params;
  const manga = await getRealMangaDetail(slug);

  return <MediaDetailView type="manga" media={manga} />;
}
