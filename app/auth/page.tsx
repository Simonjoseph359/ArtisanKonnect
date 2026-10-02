"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { Theme } from "@/components/Themes";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

function SignUpForm() {
  const searchParams = useSearchParams();
  const accountType = searchParams.get("type") === "artisan" ? "artisan" : "client";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skill, setSkill] = useState("Electrician");
  const [loading, setLoading] = useState(false);

  // Dynamic destination route based on current account type selection
  const targetRoute = accountType === "artisan" ? "/artisan/dashboard" : "/client/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedEmail = email.trim().toLowerCase();

    try {
      // 1. Save user to Firestore database (with normalized email)
      await addDoc(collection(db, "users"), {
        fullName,
        email: formattedEmail,
        accountType,
        ...(accountType === "artisan" && { skill }),
        createdAt: new Date().toISOString(),
      });

      // 2. Log user into NextAuth credentials session
      const res = await signIn("credentials", {
        email: formattedEmail,
        password,
        name: fullName,
        redirect: false,
      });

      if (res?.ok) {
        window.location.href = targetRoute;
      } else {
        alert("Registration failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setLoading(false);
    }
  };


  // ✅ NEW VERSION
const handleOAuthSignIn = (provider: "google" | "github") => {
  const callbackUrl = accountType === "artisan"
    ? "/artisan/dashboard?accountType=artisan"
    : "/client/dashboard?accountType=client";

  signIn(provider, { callbackUrl });
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="text-3xl font-extrabold tracking-tight">
            Artisan<span style={{ color: Theme.primaryColor }}>Konnect</span>
          </Link>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/signin"
            style={{ color: Theme.primaryColor }}
            className="font-medium hover:opacity-80 transition-opacity"
          >
            Log in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-2xl sm:px-10">
          {/* Account Type Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
            <Link
              href="/auth?type=client"
              className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all ${
                accountType === "client"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              I need services
            </Link>
            <Link
              href="/auth?type=artisan"
              className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all ${
                accountType === "artisan"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              I am an Artisanssss
            </Link>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleOAuthSignIn("google")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FcGoogle className="text-xl" />
              Sign up with Google
            </button>

            <button
              onClick={() => handleOAuthSignIn("github")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FaGithub className="text-xl text-gray-900" />
              Sign up with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm text-gray-900"
                placeholder={
                  accountType === "artisan"
                    ? "e.g. John Doe (or Business Name)"
                    : "John Doe"
                }
              />
            </div>

            {/* Artisan Skill Dropdown */}
            {accountType === "artisan" && (
              <div>
                <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Specialty
                </label>
                <select
                  id="skill"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 sm:text-sm text-gray-900 bg-white"
                >
                  <option value="Electrician">Electrician & Solar</option>
                  <option value="Plumber">Plumbing Repair</option>
                  <option value="AC Technician">AC & Refrigeration</option>
                  <option value="Carpenter">Carpentry & Woodwork</option>
                  <option value="Painter">Interior & Exterior Painter</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm text-gray-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm text-gray-900"
                placeholder="Create a strong password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300"
                style={{ accentColor: Theme.primaryColor }}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{" "}
                <Link href="#" style={{ color: Theme.primaryColor }} className="font-medium hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" style={{ color: Theme.primaryColor }} className="font-medium hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: Theme.primaryColor }}
              >
                {loading
                  ? "Creating Account..."
                  : accountType === "artisan"
                  ? "Register as Artisan"
                  : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}