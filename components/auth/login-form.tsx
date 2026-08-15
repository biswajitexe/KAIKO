"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AppleIcon,
  DiscordIcon,
  EyeIcon,
  EyeOffIcon,
  GithubIcon,
  GoogleIcon,
  LogoIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both your email address and password.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    // Simulate auth API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Signed in successfully! Redirecting to library...");
    }, 1200);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto py-10 px-4">
      {/* Centered Minimal Card */}
      <div className="p-6 sm:p-8 rounded-lg bg-surface border border-border flex flex-col gap-6">
        {/* Brand & Typography Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <Link
            href="/"
            className="w-10 h-10 rounded-md bg-surface-elevated border border-border flex items-center justify-center text-accent hover:border-accent transition-colors"
            aria-label="KAIYO Home"
          >
            <LogoIcon className="w-5 h-5" />
          </Link>

          <h1 className="text-20 sm:text-24 font-bold text-text-primary tracking-tight">
            Welcome back to KAIYO
          </h1>
          <p className="text-14 text-text-secondary">
            Sign in to access your watchlist, reading history, and bookmarks.
          </p>
        </div>

        {/* OAuth Social Login Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-primary hover:border-border-strong hover:bg-surface-active transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Google</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-primary hover:border-border-strong hover:bg-surface-active transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          >
            <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
            <span>Discord</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-primary hover:border-border-strong hover:bg-surface-active transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          >
            <AppleIcon className="w-4 h-4" />
            <span>Apple</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-primary hover:border-border-strong hover:bg-surface-active transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-border" />
          <span className="absolute px-3 bg-surface text-12 text-text-muted">
            or continue with email
          </span>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Error / Success Feedback Banners */}
          {errorMsg && (
            <div className="p-3 rounded-sm bg-status-error/10 border border-status-error/40 text-status-error text-12 font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-sm bg-status-success/10 border border-status-success/40 text-status-success text-12 font-medium">
              {successMsg}
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-12 font-semibold text-text-primary"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-12 font-semibold text-text-primary"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-12 text-text-muted hover:text-accent transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-sm accent-accent cursor-pointer bg-surface-elevated border-border"
            />
            <label
              htmlFor="remember"
              className="text-12 text-text-secondary cursor-pointer select-none"
            >
              Remember this device for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-2.5 px-4 rounded-md bg-accent text-white font-semibold text-14 transition-colors focus-visible:ring-2 focus-visible:ring-accent mt-2 flex items-center justify-center gap-2",
              isLoading
                ? "opacity-60 cursor-wait"
                : "hover:bg-accent-hover active:bg-accent-active"
            )}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-12 text-text-muted border-t border-border pt-4">
          <span>Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="text-accent font-semibold hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
