"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AnimeCard,
  MangaCard,
  PlayIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  XIcon,
} from "@/components";
import {
  CONTINUE_MEDIA_LIST,
  USER_LIBRARY_ANIME,
  USER_LIBRARY_MANGA,
  type AnimeItem,
  type MangaUpdateItem,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ProfileTab = "watchlist" | "reading-list" | "favorites" | "activity";
type StatusFilter = "all" | "watching-reading" | "completed" | "plan-to-watch";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=240&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=240&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=240&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=240&auto=format&fit=crop",
];

const DEFAULT_PROFILE = {
  username: "ShadowMonarch",
  handle: "@shadow_hunter",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=240&auto=format&fit=crop",
  bio: "Passionate anime & manga enthusiast. Binging seasonal simulcasts, webtoons, and classic series.",
  joinDate: "Member since 2024",
  stats: {
    animeWatching: 8,
    animeCompleted: 156,
    animePlanToWatch: 42,
    totalEpisodesWatched: 2480,
    mangaReading: 14,
    mangaCompleted: 78,
    mangaPlanToRead: 30,
    totalChaptersRead: 4920,
  },
};

export function ProfilePageView() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("watchlist");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editUsername, setEditUsername] = useState(DEFAULT_PROFILE.username);
  const [editHandle, setEditHandle] = useState(DEFAULT_PROFILE.handle);
  const [editBio, setEditBio] = useState(DEFAULT_PROFILE.bio);
  const [editAvatar, setEditAvatar] = useState(DEFAULT_PROFILE.avatar);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kaiyo_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({ ...prev, ...parsed }));
        setEditUsername(parsed.username || prevUsername(parsed));
        setEditHandle(parsed.handle || prevHandle(parsed));
        setEditBio(parsed.bio || prevBio(parsed));
        setEditAvatar(parsed.avatar || prevAvatar(parsed));
      }
    } catch {
      // ignore
    }
  }, []);

  function prevUsername(p: any) { return p.username || DEFAULT_PROFILE.username; }
  function prevHandle(p: any) { return p.handle || DEFAULT_PROFILE.handle; }
  function prevBio(p: any) { return p.bio || DEFAULT_PROFILE.bio; }
  function prevAvatar(p: any) { return p.avatar || DEFAULT_PROFILE.avatar; }

  const handleOpenEditModal = () => {
    setEditUsername(profile.username);
    setEditHandle(profile.handle);
    setEditBio(profile.bio);
    setEditAvatar(profile.avatar);
    setSaveSuccess(false);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      username: editUsername.trim() || profile.username,
      handle: editHandle.startsWith("@") ? editHandle.trim() : `@${editHandle.trim()}`,
      bio: editBio.trim() || profile.bio,
      avatar: editAvatar.trim() || profile.avatar,
    };

    setProfile(updated);
    try {
      localStorage.setItem("kaiyo_user_profile", JSON.stringify(updated));
    } catch {
      // ignore
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSaveSuccess(false);
    }, 600);
  };

  const filteredAnime = USER_LIBRARY_ANIME.filter((entry) =>
    statusFilter === "all" ? true : entry.userStatus === statusFilter
  );

  const filteredManga = USER_LIBRARY_MANGA.filter((entry) =>
    statusFilter === "all" ? true : entry.userStatus === statusFilter
  );

  return (
    <div className="flex flex-col gap-8 max-w-container mx-auto pb-16">
      {/* =========================================================================
          PROFILE HEADER CARD
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-lg bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        {/* User Identity & Avatar */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-accent bg-surface-elevated flex-shrink-0 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar}
              alt={profile.username}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <span
              className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-status-success border-2 border-surface"
              aria-label="Online"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-20 sm:text-24 font-extrabold text-text-primary">
                {profile.username}
              </h1>
              <span className="px-2.5 py-0.5 rounded-sm bg-accent/15 border border-accent/30 text-accent font-semibold text-[11px] uppercase tracking-wider">
                VIP MEMBER
              </span>
            </div>
            <p className="text-12 font-mono text-text-muted">
              {profile.handle} • {profile.joinDate}
            </p>
            <p className="text-14 text-text-secondary max-w-xl mt-1 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleOpenEditModal}
          className="px-5 py-2.5 rounded-md bg-accent text-white hover:bg-accent-hover font-semibold text-14 transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-accent shadow-md shadow-accent/20 cursor-pointer"
        >
          Edit Profile
        </button>
      </div>

      {/* =========================================================================
          STATS METRIC CARDS
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Anime Watching */}
        <div className="p-4 rounded-md bg-surface border border-border flex flex-col gap-1">
          <span className="text-12 text-text-muted font-medium uppercase tracking-wider">
            Watching Anime
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-24 font-bold text-text-primary">
              {profile.stats.animeWatching}
            </span>
            <span className="text-12 text-text-muted">
              / {profile.stats.animeCompleted} completed
            </span>
          </div>
        </div>

        {/* Manga Reading */}
        <div className="p-4 rounded-md bg-surface border border-border flex flex-col gap-1">
          <span className="text-12 text-text-muted font-medium uppercase tracking-wider">
            Reading Manga
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-24 font-bold text-text-primary">
              {profile.stats.mangaReading}
            </span>
            <span className="text-12 text-text-muted">
              / {profile.stats.mangaCompleted} completed
            </span>
          </div>
        </div>

        {/* Planned */}
        <div className="p-4 rounded-md bg-surface border border-border flex flex-col gap-1">
          <span className="text-12 text-text-muted font-medium uppercase tracking-wider">
            Plan to Watch/Read
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-24 font-bold text-text-primary">
              {profile.stats.animePlanToWatch + profile.stats.mangaPlanToRead}
            </span>
            <span className="text-12 text-text-muted">titles queued</span>
          </div>
        </div>

        {/* Total Time / Episodes */}
        <div className="p-4 rounded-md bg-surface border border-border flex flex-col gap-1">
          <span className="text-12 text-text-muted font-medium uppercase tracking-wider">
            Total Consumed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-24 font-bold text-text-primary">
              {profile.stats.totalEpisodesWatched}
            </span>
            <span className="text-12 text-text-muted">eps • {profile.stats.totalChaptersRead} chs</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTINUE WATCHING & READING ROW
          ========================================================================= */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-18 font-bold text-text-primary">
            Jump Back In (Continue)
          </h2>
          <Link
            href="/watchlist"
            className="text-12 text-text-secondary hover:text-accent font-medium transition-colors"
          >
            Full Watchlist →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTINUE_MEDIA_LIST.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-md bg-surface border border-border flex gap-3 items-center group hover:border-accent transition-colors"
            >
              <div className="relative aspect-[2/3] w-14 rounded-sm overflow-hidden bg-surface-elevated flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverImage}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between flex-1 min-w-0 h-full py-0.5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-accent">
                    {item.mediaType === "anime" ? "EPISODE" : "CHAPTER"} {item.currentNumber}
                  </span>
                  <h3 className="text-14 font-bold text-text-primary truncate">
                    {item.title}
                  </h3>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <div className="w-full h-1 bg-surface-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${item.progressPercentage}%` }}
                    />
                  </div>
                  <Link
                    href={item.resumeHref}
                    className="text-11 text-text-muted hover:text-text-primary flex items-center gap-1 font-medium transition-colors"
                  >
                    <PlayIcon className="w-3 h-3 text-accent fill-current" />
                    <span>Resume ({item.lastAccessed})</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          LIBRARY TABS & FILTER BAR
          ========================================================================= */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("watchlist")}
              className={cn(
                "px-4 py-2 rounded-sm font-semibold text-14 transition-colors",
                activeTab === "watchlist"
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              )}
            >
              Anime Library ({filteredAnime.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reading-list")}
              className={cn(
                "px-4 py-2 rounded-sm font-semibold text-14 transition-colors",
                activeTab === "reading-list"
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              )}
            >
              Manga Library ({filteredManga.length})
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-12 overflow-x-auto">
            <span className="text-text-muted whitespace-nowrap mr-1">Status:</span>
            {(["all", "watching-reading", "completed", "plan-to-watch"] as StatusFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={cn(
                    "px-2.5 py-1 rounded-sm border font-medium whitespace-nowrap transition-colors",
                    statusFilter === filter
                      ? "bg-surface-elevated border-accent text-accent font-semibold"
                      : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-border-strong"
                  )}
                >
                  {filter === "all"
                    ? "All"
                    : filter === "watching-reading"
                    ? "In Progress"
                    : filter === "completed"
                    ? "Completed"
                    : "Plan to Watch/Read"}
                </button>
              )
            )}
          </div>
        </div>

        {/* Library Content Grid */}
        {activeTab === "watchlist" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredAnime.map((entry) => (
              <AnimeCard
                key={entry.id}
                item={entry.item as AnimeItem}
                className="w-full"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredManga.map((entry) => (
              <MangaCard
                key={entry.id}
                item={entry.item as MangaUpdateItem}
                variant="poster"
                className="w-full"
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          EDIT PROFILE MODAL DIALOG
          ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-lg rounded-lg bg-surface border border-border shadow-2xl overflow-hidden flex flex-col"
            role="dialog"
            aria-labelledby="edit-profile-title"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-elevated">
              <h3 id="edit-profile-title" className="text-16 font-bold text-text-primary">
                Edit User Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                aria-label="Close edit profile dialog"
                className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="p-5 flex flex-col gap-4">
              {/* Avatar Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-12 font-medium text-text-primary">
                  Profile Avatar
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editAvatar}
                      alt="Avatar Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setEditAvatar(url)}
                        className={cn(
                          "w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer",
                          editAvatar === url ? "border-accent scale-110" : "border-border hover:border-text-muted"
                        )}
                        aria-label={`Select avatar ${idx + 1}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Username Input */}
              <div className="flex flex-col gap-1">
                <label htmlFor="edit-username" className="text-12 font-medium text-text-primary">
                  Display Name
                </label>
                <input
                  id="edit-username"
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Your username"
                  className="w-full px-3.5 py-2 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary focus:border-accent focus:outline-none"
                  required
                />
              </div>

              {/* Handle Input */}
              <div className="flex flex-col gap-1">
                <label htmlFor="edit-handle" className="text-12 font-medium text-text-primary">
                  User Handle
                </label>
                <input
                  id="edit-handle"
                  type="text"
                  value={editHandle}
                  onChange={(e) => setEditHandle(e.target.value)}
                  placeholder="@handle"
                  className="w-full px-3.5 py-2 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary focus:border-accent focus:outline-none"
                  required
                />
              </div>

              {/* Bio Input */}
              <div className="flex flex-col gap-1">
                <label htmlFor="edit-bio" className="text-12 font-medium text-text-primary">
                  Profile Bio
                </label>
                <textarea
                  id="edit-bio"
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell others what you love to watch & read..."
                  className="w-full px-3.5 py-2 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary focus:border-accent focus:outline-none resize-none"
                />
              </div>

              {/* Save Success Banner */}
              {saveSuccess && (
                <div className="p-2.5 rounded-sm bg-status-success/15 border border-status-success/40 text-status-success text-12 font-medium text-center">
                  ✓ Profile updated and saved successfully!
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-sm text-14 text-text-muted hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-accent text-white font-semibold text-14 hover:bg-accent-hover transition-colors shadow-md shadow-accent/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
