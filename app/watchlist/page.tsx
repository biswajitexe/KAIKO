import type { Metadata } from "next";
import { ProfilePageView } from "@/components/profile/profile-page-view";

export const metadata: Metadata = {
  title: "My Watchlist & Reading Library — KAIYO",
  description: "Track all your active anime watchlist and manga reading list items.",
};

export default function WatchlistPage() {
  return <ProfilePageView />;
}
