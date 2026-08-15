"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BellIcon, LogoIcon, SearchIcon, UserIcon } from "@/components/icons";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Anime", href: "/anime" },
  { label: "Manga", href: "/manga" },
  { label: "Browse", href: "/browse" },
  { label: "Schedule", href: "/schedule" },
];

export function TopNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4px focus:py-2 focus:bg-surface-elevated focus:text-text-primary focus:border focus:border-accent focus:rounded-md focus:outline-none text-14 font-medium"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "sticky top-0 z-30 w-full transition-colors duration-normal border-b",
          isScrolled
            ? "bg-bg/90 backdrop-blur-md border-border"
            : "bg-bg/75 backdrop-blur-sm border-border-subtle"
        )}
      >
        <div className="max-w-container mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-md focus-visible:outline-none py-1"
              aria-label="AnimeWeb Home"
            >
              <div className="w-8 h-8 rounded-md bg-surface-elevated border border-border flex items-center justify-center text-accent group-hover:border-accent transition-colors duration-fast">
                <LogoIcon className="w-4 h-4" />
              </div>
              <span className="text-16 font-bold tracking-wide uppercase text-text-primary">
                KAIYO<span className="text-accent">.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main Navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "px-3 py-1.5 text-14 font-medium rounded-md transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                      isActive
                        ? "text-text-primary bg-surface-subtle"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions (Search, Notification, Profile) */}
          <div className="flex items-center gap-2">
            {/* Search Trigger Button */}
            <Link
              href="/browse"
              aria-label="Search anime and manga (Press Ctrl+K to search)"
              className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <SearchIcon className="w-4 h-4" />
              <span className="hidden lg:inline text-14 font-normal text-text-muted">
                Search titles...
              </span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-12 font-mono text-text-muted bg-surface-subtle border border-border rounded-sm">
                ⌘K
              </kbd>
            </Link>

            {/* Notification Button */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent hover:border-border transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <BellIcon className="w-5 h-5" />
              {/* Active unread notification dot */}
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent"
                aria-hidden="true"
              />
            </button>

            {/* Profile Avatar Button */}
            <Link
              href="/profile"
              aria-label="User Account and Profile Settings"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-accent transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ml-1 overflow-hidden"
            >
              <UserIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
