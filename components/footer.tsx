"use client";

import Link from "next/link";
import {
  LogoIcon,
  GithubIcon,
  DiscordIcon,
  HeartIcon,
} from "@/components/icons";

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border mt-16 pb-20 md:pb-12 pt-12">
      <div className="max-w-container mx-auto px-4 md:px-8 flex flex-col gap-10">
        {/* Top Grid: Brand & Dev Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Brand */}
          <div className="flex flex-col gap-3 md:col-span-1">
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
              <span>v2.0 • Edge Streaming Active</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-12 font-mono uppercase tracking-widest text-text-primary font-bold">
              Explore
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

          {/* Col 3: User & Community */}
          <div className="flex flex-col gap-3">
            <h4 className="text-12 font-mono uppercase tracking-widest text-text-primary font-bold">
              Account & Library
            </h4>
            <ul className="flex flex-col gap-2 text-14 text-text-secondary">
              <li>
                <Link href="/profile" className="hover:text-accent transition-colors">
                  User Profile & Stats
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-accent transition-colors">
                  Personal Watchlist
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-accent transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Lead Developer Profile (zerox.exe) */}
          <div className="flex flex-col gap-3.5 p-4 rounded-lg bg-surface-elevated border border-border">
            <div className="flex items-center justify-between">
              <span className="text-10 font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm bg-accent/20 border border-accent/40 text-accent">
                LEAD DEVELOPER & ARCHITECT
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-accent to-orange-400 flex items-center justify-center text-white font-extrabold text-16 border border-border shadow-md">
                ZX
              </div>
              <div className="flex flex-col">
                <span className="text-14 font-extrabold text-text-primary flex items-center gap-1.5">
                  zerox.exe
                  <span className="w-3.5 h-3.5 rounded-full bg-accent text-white text-[9px] flex items-center justify-center font-bold">✓</span>
                </span>
                <span className="text-12 text-text-muted">Full-Stack & UI/UX Engineer</span>
              </div>
            </div>

            <p className="text-12 text-text-muted leading-relaxed">
              Designed & engineered KAIYO platform with Next.js 15, TypeScript, Tailwind CSS, and custom media readers.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1 border-t border-border/50">
              <a
                href="https://github.com/biswajitexe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-sm bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
                aria-label="zerox.exe GitHub profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href="https://github.com/biswajitexe/KAIKO"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-sm bg-surface border border-border text-12 font-medium text-text-secondary hover:text-text-primary hover:border-accent transition-colors flex items-center gap-1.5"
              >
                <span>GitHub Repository</span>
                <span className="text-accent">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 text-12 text-text-muted">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} KAIYO Platform.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <HeartIcon className="w-3.5 h-3.5 text-accent fill-current" /> by{" "}
              <a
                href="https://github.com/biswajitexe"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-text-primary hover:text-accent transition-colors"
              >
                zerox.exe
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4 text-12">
            <span className="text-text-muted">High-Performance Media Engine</span>
            <span>•</span>
            <span className="font-mono text-accent">React 19 & Next.js 15</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
