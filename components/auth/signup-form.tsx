"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AppleIcon,
  DiscordIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
  LogoIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (username.length < 3) {
      setErrorMsg("Username must be at least 3 characters long.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    // Simulate sign-up API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Account created successfully! Welcome to KAIYO.");
    }, 1200);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto py-10 px-4">
      {/* Centered Minimal Card */}
      <div className="p-6 sm:p-8 rounded-lg bg-surface border border-border flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <Link
            href="/"
            className="w-10 h-10 rounded-md bg-surface-elevated border border-border flex items-center justify-center text-accent hover:border-accent transition-colors"
            aria-label="KAIYO Home"
          >
            <LogoIcon className="w-5 h-5" />
          </Link>

          <h1 className="text-20 sm:text-24 font-bold text-text-primary tracking-tight">
            Create your KAIYO account
          </h1>
          <p className="text-14 text-text-secondary">
            Join the community of anime & manga enthusiasts.
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-primary hover:border-border-strong hover:bg-surface-active transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          >
            <GoogleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Google</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-primary hover:border-border-strong hover:bg-surface-active transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          >
            <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
            <span className="hidden sm:inline">Discord</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-surface-elevated border border-border text-12 font-medium text-text-primary hover:border-border-strong hover:bg-surface-active transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          >
            <AppleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-border" />
          <span className="absolute px-3 bg-surface text-12 text-text-muted">
            or register with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          {/* Username Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-12 font-semibold text-text-primary"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              placeholder="e.g. shadow_monarch"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-email"
              className="text-12 font-semibold text-text-primary"
            >
              Email address
            </label>
            <input
              id="signup-email"
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
            <label
              htmlFor="signup-password"
              className="text-12 font-semibold text-text-primary"
            >
              Password (min. 8 characters)
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm-password"
              className="text-12 font-semibold text-text-primary"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-sm bg-surface-elevated border border-border text-14 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          {/* Terms and Privacy Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded-sm accent-accent cursor-pointer bg-surface-elevated border-border"
            />
            <label
              htmlFor="terms"
              className="text-12 text-text-muted cursor-pointer select-none leading-tight"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-text-primary underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-text-primary underline">
                Privacy Policy
              </Link>
              .
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
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-12 text-text-muted border-t border-border pt-4">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="text-accent font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
