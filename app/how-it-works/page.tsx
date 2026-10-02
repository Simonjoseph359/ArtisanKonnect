"use client";

import React from "react";
import Link from "next/link";
import { Theme } from "@/components/Themes";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Search & Request",
      description: "Enter the service you need and your location. Browse through a list of verified, top-rated artisans available in your area.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Review & Connect",
      description: "Check their profiles, read past customer reviews, and view their rates. Send a direct message or request a quote for your specific project.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Book & Hire",
      description: "Once you agree on the terms and pricing, officially book the artisan through the platform to secure your appointment and protect your service.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Get It Done & Pay",
      description: "The artisan arrives and completes the job. You only release payment securely through the platform once you are 100% satisfied with the work.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    }
  ];

  const trustFeatures = [
    {
      title: "Vetted Professionals",
      desc: "Every artisan goes through a strict background check and identity verification process.",
    },
    {
      title: "Secure Payments",
      desc: "Your money is held safely until the job is completed to your satisfaction.",
    },
    {
      title: "Verified Reviews",
      desc: "Read honest feedback from real customers in your community before you hire.",
    },
    {
      title: "Dispute Resolution",
      desc: "Our support team is always ready to step in and help resolve any issues fairly.",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <section className="bg-white border-b border-gray-200 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            How ArtisanKonnect Works
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            We&apos;ve made it incredibly simple to find, hire, and pay reliable local professionals for any job, big or small.
          </p>
        </div>
      </section>

      {/* STEP-BY-STEP PROCESS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Steps List */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-6 relative group">
                
                {/* Connecting Line (hidden on last item) */}
                {index !== steps.length - 1 && (
                  <div 
                    className="hidden sm:block absolute left-8 top-16 bottom-[-3rem] w-0.5 border-l-2 border-dashed border-gray-200"
                  ></div>
                )}

                <div 
                  className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm z-10 transition-transform group-hover:scale-105"
                  style={{ 
                    backgroundColor: Theme.primaryColor, 
                    color: "white" 
                  }}
                >
                  {step.icon}
                </div>
                
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span 
                      className="text-lg font-bold opacity-50"
                      style={{ color: Theme.secondaryColor || Theme.primaryColor }}
                    >
                      {step.number}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual/Image Side */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[600px]">
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800" 
              alt="Artisan working" 
              className="w-full h-full object-cover"
            />
            {/* Overlay card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: Theme.primaryColor }}
                >
                  ✓
                </div>
                <div>
                  <p className="font-bold text-gray-900">Job Completed Successfully</p>
                  <p className="text-sm text-gray-500">Payment released to artisan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & SAFETY SECTION */}
      <section className="bg-slate-900 py-20 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Trust & Safety First</h2>
            <p className="text-gray-400">
              We take the risk out of hiring. Here is how we ensure you get the best possible experience every single time.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-slate-500 transition-colors">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${Theme.primaryColor}20`, color: Theme.primaryColor }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-white text-center px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">Ready to get your project done?</h2>
          <p className="text-xl text-gray-600">
            Join thousands of users who trust ArtisanKonnect for their daily repair and maintenance needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/findartisan" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white transition-opacity hover:opacity-90 shadow-lg shadow-gray-200"
              style={{ backgroundColor: Theme.primaryColor }}
            >
              Find an Artisan Now
            </Link>
            <Link 
              href="/auth" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold border-2 text-gray-800 hover:bg-gray-50 transition-colors"
              style={{ borderColor: Theme.secondaryColor || Theme.primaryColor }}
            >
              Create a Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}