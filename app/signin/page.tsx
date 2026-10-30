"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Theme } from "@/components/Themes";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { auth, db } from "@/config/firebase";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formattedEmail = email.trim().toLowerCase();

    try {
      // 1. Authenticate credentials securely via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, formattedEmail, password);
      const user = userCredential.user;

      // 2. Fetch user profile from Firestore using their unique UID
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let accountType = "client";
      if (userSnap.exists()) {
        accountType = userSnap.data().accountType || "client";
      }

      // 3. Route dynamically based on user role
      if (accountType === "artisan") {
        window.location.href = "/artisan/dashboard";
      } else {
        window.location.href = "/client/dashboard";
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      // Display error message and clear password input field so they can try again
      setError("Invalid email or password. Please try again.");
      setPassword("");
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (providerType: "google" | "github") => {
    setError("");
    const provider = providerType === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let accountType = "client";
      if (userSnap.exists()) {
        accountType = userSnap.data().accountType || "client";
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          fullName: user.displayName || "User",
          email: user.email?.toLowerCase() || "",
          accountType: "client",
          image: user.photoURL || "",
          createdAt: new Date().toISOString(),
        });
      }

      window.location.href = accountType === "artisan" ? "/artisan/dashboard" : "/client/dashboard";
    } catch (err: any) {
      console.error("OAuth error:", err);
      setError("Social login failed. Please try again.");
    }
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
          Log in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth"
            style={{ color: Theme.primaryColor }}
            className="font-medium hover:opacity-80 transition-opacity"
          >
            Sign up here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FcGoogle className="text-xl" />
              Log in with Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn("github")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FaGithub className="text-xl text-gray-900" />
              Log in with GitHub
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm text-gray-900"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: Theme.primaryColor }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <Link
                href="#"
                style={{ color: Theme.primaryColor }}
                className="text-sm font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: Theme.primaryColor }}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}