import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In — KAIYO",
  description: "Sign in to your KAIYO account to sync your watchlist, bookmarks, and reading history.",
};

export default function LoginPage() {
  return (
    <div className="w-full flex items-center justify-center min-h-[75vh]">
      <LoginForm />
    </div>
  );
}
