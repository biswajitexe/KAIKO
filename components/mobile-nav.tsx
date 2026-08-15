"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AnimeIcon,
  HomeIcon,
  MangaIcon,
  UserIcon,
  WatchlistIcon,
} from "@/components/icons";

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Anime", href: "/anime", icon: AnimeIcon },
  { label: "Manga", href: "/manga", icon: MangaIcon },
  { label: "Watchlist", href: "/watchlist", icon: WatchlistIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg/90 backdrop-blur-md border-t border-border"
    >
      <div className="flex items-center justify-around h-16 max-w-container mx-auto px-2 pb-[env(safe-area-inset-bottom)]">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] rounded-md transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                isActive
                  ? "text-accent font-medium"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-12 tracking-tight leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
