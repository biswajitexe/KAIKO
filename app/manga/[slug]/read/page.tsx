import type { Metadata } from "next";
import { getRealMangaDetail } from "@/lib/data-loader";
import { MangaReaderView } from "@/components/manga-reader/manga-reader-view";

interface ReadPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ch?: string; mode?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: ReadPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { ch } = await searchParams;
  const manga = await getRealMangaDetail(slug);
  const chNum = ch || manga.latestChapter.replace(/[^0-9]/g, "") || "1";

  return {
    title: `Read ${manga.title} Chapter ${chNum} — KAIYO Manga Reader`,
    description: `Read ${manga.title} Chapter ${chNum} online with vertical webtoon scroll or page-flip reader.`,
  };
}

export default async function ReadMangaPage({
  params,
  searchParams,
}: ReadPageProps) {
  const { slug } = await params;
  const { ch, mode } = await searchParams;
  const manga = await getRealMangaDetail(slug);

  const currentChapterNum = ch || manga.chaptersList[0]?.number || 1;
  const initialMode = mode === "vertical" ? "vertical" : mode === "flip" ? "flip" : undefined;

  return (
    <div className="w-full max-w-container mx-auto">
      <MangaReaderView
        manga={manga}
        initialChapterNumber={currentChapterNum}
        initialMode={initialMode}
      />
    </div>
  );
}
