import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create an Account — KAIYO",
  description: "Create a new KAIYO account to track anime episodes, read manga chapters, and join the community.",
};

export default function SignupPage() {
  return (
    <div className="w-full flex items-center justify-center min-h-[75vh]">
      <SignupForm />
    </div>
  );
}
