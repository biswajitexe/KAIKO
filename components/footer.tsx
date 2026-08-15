"use client";

import Link from "next/link";
import { LogoIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border mt-16 pb-20 md:pb-12 pt-12">
      <div className="max-w-container mx-auto px-4 md:px-8 flex flex-col gap-10">
        {/* Top Grid: Brand & Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-18 font-bold tracking-wider text-text-primary group"
            >
              <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-white shadow-md">
                <LogoIcon className="w-4 h-4" />
              </div>
              <span className="font-extrabold tracking-tight">KAIYO.</span>
            </Link>

            <p className="text-12 text-text-muted leading-relaxed">
              Next-generation anime streaming archive, manga reader, and Korean manhwa webtoon platform with ultra-high quality visuals.
            </p>

            <div className="flex items-center gap-2 text-12 text-text-muted pt-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-status-success" />
              <span>v2.0 • Ultra HD Streaming</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-12 font-mono uppercase tracking-widest text-text-primary font-bold">
              Media Catalog
            </h4>
            <ul className="flex flex-col gap-2 text-14 text-text-secondary">
              <li>
                <Link href="/anime" className="hover:text-accent transition-colors">
                  Anime Catalog & Simulcasts
                </Link>
              </li>
              <li>
                <Link href="/manga" className="hover:text-accent transition-colors">
                  Manga & Manhwa Webtoons
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-accent transition-colors">
                  Search & Filters Archive
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-accent transition-colors">
                  Weekly Release Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Library & User */}
          <div className="flex flex-col gap-3">
            <h4 className="text-12 font-mono uppercase tracking-widest text-text-primary font-bold">
              User Library
            </h4>
            <ul className="flex flex-col gap-2 text-14 text-text-secondary">
              <li>
                <Link href="/profile" className="hover:text-accent transition-colors">
                  Profile & History
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-accent transition-colors">
                  Personal Watchlist
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-accent transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-accent transition-colors">
                  Create Free Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Community */}
          <div className="flex flex-col gap-3">
            <h4 className="text-12 font-mono uppercase tracking-widest text-text-primary font-bold">
              Platform
            </h4>
            <p className="text-12 text-text-muted leading-relaxed">
              KAIYO provides streaming and reading indexes. All media content is provided by non-affiliated third-party servers.
            </p>
            <div className="flex flex-col gap-1.5 text-12 text-text-secondary pt-1">
              <span className="hover:text-text-primary cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-text-primary cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-text-primary cursor-pointer transition-colors">DMCA & Copyright</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 text-12 text-text-muted">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} KAIYO Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-12">
            <span className="text-text-muted">High-Performance Media Engine</span>
            <span>•</span>
            <span className="font-mono text-accent">1080p Full HD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
