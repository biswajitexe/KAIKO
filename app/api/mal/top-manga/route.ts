import { NextResponse } from "next/server";
import { fetchTopManga, malNodeToMangaItem } from "@/lib/mal-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rankingType = (searchParams.get("ranking_type") || "manga") as "all" | "manga" | "manhwa" | "bypopularity" | "favorite";
  const limit = parseInt(searchParams.get("limit") || "24", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  try {
    const results = await fetchTopManga(rankingType, limit, offset);
    const forceType = rankingType === "manhwa" ? "MANHWA" : "MANGA";
    const items = results.data ? results.data.map((i) => malNodeToMangaItem(i.node, forceType)) : [];
    return NextResponse.json({
      items,
      hasMore: items.length >= limit,
      nextOffset: offset + limit,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message, items: [], hasMore: false }, { status: 500 });
  }
}
