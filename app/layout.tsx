import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { TopNavbar } from "@/components/top-navbar";
import { MobileNav } from "@/components/mobile-nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "KAIYO — Anime & Manga Platform",
  description: "Next-generation anime and manga catalog and reader platform built by zerox.exe",
};

export const viewport: Viewport = {
  themeColor: "#0d0e12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg text-text-primary antialiased min-h-screen flex flex-col selection:bg-accent selection:text-white">
        <TopNavbar />
        <main
          id="main-content"
          className="flex-1 w-full max-w-container mx-auto px-4 md:px-8 py-6 pb-12 focus:outline-none"
          tabIndex={-1}
        >
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
