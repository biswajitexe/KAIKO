import type { Metadata } from "next";
import { WatchlistPageView } from "@/components/watchlist/watchlist-page-view";

export const metadata: Metadata = {
  title: "My Watchlist — KAIYO",
  description: "Manage your saved anime series, movies, and manga chapters in one place.",
};

export default function WatchlistPage() {
  return <WatchlistPageView />;
}
