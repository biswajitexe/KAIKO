import { NextResponse } from "next/server";
import { fetchTopAnime, malNodeToAnimeItem } from "@/lib/mal-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rankingType = (searchParams.get("ranking_type") || "all") as "all" | "airing" | "upcoming" | "bypopularity" | "favorite" | "movie" | "tv";
  const limit = parseInt(searchParams.get("limit") || "24", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  try {
    const results = await fetchTopAnime(rankingType, limit, offset);
    const items = results.data ? results.data.map((i) => malNodeToAnimeItem(i.node)) : [];
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
