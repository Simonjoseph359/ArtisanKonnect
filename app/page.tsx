"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Theme } from "@/components/Themes";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const categories = [
    {
      name: "Plumbing",
      icon: (
        <svg className="w-8 h-8" style={{ color: Theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      count: "1,240 Artisans",
    },
    {
      name: "Electrical",
      icon: (
        <svg className="w-8 h-8" style={{ color: Theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      count: "980 Artisans",
    },
    {
      name: "Carpentry",
      icon: (
        <svg className="w-8 h-8" style={{ color: Theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V4zm-6 8a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2v-1zm12 0a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2v-1z" />
        </svg>
      ),
      count: "750 Artisans",
    },
    {
      name: "Painting",
      icon: (
        <svg className="w-8 h-8" style={{ color: Theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      count: "610 Artisans",
    },
    {
      name: "AC Repair",
      icon: (
        <svg className="w-8 h-8" style={{ color: Theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      count: "430 Artisans",
    },
    {
      name: "Auto Mechanics",
      icon: (
        <svg className="w-8 h-8" style={{ color: Theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      count: "890 Artisans",
    },
  ];

  const featuredArtisans = [
    {
      name: "David Adeleke",
      trade: "Master Electrician",
      rating: 4.9,
      reviews: 128,
      location: "Lagos, NG",
      image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
    {
      name: "Emmanuel Okafor",
      trade: "Certified Plumber",
      rating: 4.8,
      reviews: 95,
      location: "Abuja, NG",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
    {
      name: "Sarah Lawson",
      trade: "Interior & Woodwork Carpenter",
      rating: 5.0,
      reviews: 64,
      location: "Port Harcourt, NG",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

      <main>
        {/* HERO SECTION */}
        <section className="px-6 py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-6">
            <span
              className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full border"
              style={{
                color: Theme.primaryColor,
                borderColor: Theme.primaryColor,
                backgroundColor: `${Theme.primaryColor}10`,
              }}
            >
              ⚡ Guaranteed Verified Professionals
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Find Trusted Artisans Near You
            </h1>

            <p className="text-lg text-gray-600">
              Connect with skilled plumbers, electricians, carpenters, and more in just a few clicks.
            </p>

            {/* SEARCH BAR */}
            <div className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center w-full px-3 py-2">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Location / City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                />
              </div>

              <button
                style={{ backgroundColor: Theme.primaryColor }}
                className="w-full sm:w-auto px-6 py-3 text-white font-medium rounded-xl hover:opacity-90 transition whitespace-nowrap"
              >
                Search
              </button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-5 text-center">
              <Link
                href={"/findartisan"}
                style={{ backgroundColor: Theme.primaryColor }}
                className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition"
              >
                Find an Artisan
              </Link>
              <Link
                href={"/"}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Join as a Pro
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="h-full rounded-2xl flex items-center justify-center relative">
              <img src="/hero.png" alt="Artisan" className="rounded-xl w-full object-cover" />
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section id="categories" className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Popular Services</h2>
                <p className="text-gray-600 mt-2">Explore top categories to find skilled professionals.</p>
              </div>
              <Link href="/categories" style={{ color: Theme.primaryColor }} className="font-semibold hover:underline hidden sm:block">
                View All Categories &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How ArtisanKonnect Works</h2>
            <p className="text-gray-600 mt-3">Simple steps to get your repairs and projects done hassle-free.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center relative">
              <div
                style={{ backgroundColor: `${Theme.primaryColor}15`, color: Theme.primaryColor }}
                className="w-12 h-12 font-bold rounded-full flex items-center justify-center mx-auto mb-6 text-xl"
              >
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Search & Request</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Choose the service you need, enter your location, and browse top-rated artisans nearby.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center relative">
              <div
                style={{ backgroundColor: `${Theme.primaryColor}15`, color: Theme.primaryColor }}
                className="w-12 h-12 font-bold rounded-full flex items-center justify-center mx-auto mb-6 text-xl"
              >
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect & Book</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Compare quotes, check ratings and reviews, and directly message or call your chosen artisan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center relative">
              <div
                style={{ backgroundColor: `${Theme.primaryColor}15`, color: Theme.primaryColor }}
                className="w-12 h-12 font-bold rounded-full flex items-center justify-center mx-auto mb-6 text-xl"
              >
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get It Done & Pay</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enjoy quality work done at your place. Pay securely only after job completion.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURED ARTISANS */}
        <section id="featured" className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Featured Artisans</h2>
              <p className="text-gray-600 mt-2">Meet some of our top-rated, background-checked pros.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredArtisans.map((artisan, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition">
                  <img src={artisan.image} alt={artisan.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span style={{ color: Theme.primaryColor }} className="text-xs font-semibold uppercase tracking-wider">
                        {artisan.trade}
                      </span>
                      {artisan.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">✓ Verified Pro</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">{artisan.name}</h3>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <span className="text-amber-500 font-bold">★ {artisan.rating}</span>
                      <span>({artisan.reviews} reviews)</span>
                      <span>•</span>
                      <span>{artisan.location}</span>
                    </div>

                    <button
                      style={{ backgroundColor: Theme.primaryColor }}
                      className="w-full mt-6 py-2.5 text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRO CTA SECTION */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Are you a skilled Artisan? Grow your business with us!
              </h2>
              <p className="text-slate-300">
                Join thousands of mechanics, plumbers, and technicians getting daily clients near them. No hidden charges.
              </p>
            </div>
            <Link
              href={"/"}
              style={{ backgroundColor: Theme.primaryColor }}
              className="px-8 py-4 text-white font-bold rounded-xl transition shadow-lg whitespace-nowrap hover:opacity-90"
            >
              Become an Artisan Partner
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}