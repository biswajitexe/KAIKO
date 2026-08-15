import { NextResponse } from "next/server";
import { getAnimeDetails } from "@/lib/mal-api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const details = await getAnimeDetails(id);
    return NextResponse.json(details);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Anime not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
