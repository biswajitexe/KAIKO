import type { Metadata } from "next";
import { ProfilePageView } from "@/components/profile/profile-page-view";

export const metadata: Metadata = {
  title: "User Profile & Library — KAIYO",
  description: "View your anime watchlist, manga reading list, stats, and in-progress media.",
};

export default function ProfilePage() {
  return <ProfilePageView />;
}
