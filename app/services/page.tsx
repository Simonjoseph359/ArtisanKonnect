"use client";

import React from "react";
import Link from "next/link";
import { Theme } from "@/components/Themes";

export default function Services() {
  const servicesList = [
    {
      id: "plumbing",
      title: "Plumbing",
      description: "Expert solutions for leaks, pipe installations, water heater repairs, and complete bathroom fittings.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      features: ["Leak Detection & Repair", "Pipe Installation", "Drain Cleaning", "Water Heater Servicing"],
    },
    {
      id: "electrical",
      title: "Electrical Services",
      description: "Safe and reliable electrical wiring, lighting installations, fault finding, and panel upgrades.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      features: ["Wiring & Rewiring", "Lighting Installation", "Fault Finding", "Generator Repairs"],
    },
    {
      id: "carpentry",
      title: "Carpentry & Woodwork",
      description: "Custom furniture crafting, cabinet installation, door repairs, and general structural woodwork.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V4zm-6 8a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2v-1zm12 0a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2v-1z" />
        </svg>
      ),
      features: ["Custom Furniture", "Cabinetry", "Roofing Framework", "Door & Window Fitting"],
    },
    {
      id: "hvac",
      title: "AC & Fridge Repair",
      description: "Keep your cooling systems running perfectly with our routine maintenance, gas refilling, and component repairs.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      features: ["AC Installation", "Gas Refilling", "Routine Maintenance", "Refrigerator Repair"],
    },
    {
      id: "painting",
      title: "Painting & Decorating",
      description: "Transform your spaces with professional interior and exterior painting, wallpapering, and surface prep.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      features: ["Interior Painting", "Exterior Painting", "Wallpaper Installation", "Wall Screeding"],
    },
    {
      id: "mechanic",
      title: "Auto Mechanics",
      description: "Trusted mobile mechanics for diagnostics, engine servicing, brake replacements, and emergency repairs.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      features: ["Vehicle Diagnostics", "Engine Servicing", "Brake Replacement", "Battery Jumpstart"],
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* HEADER HERO SECTION */}
      <div className="relative py-24 bg-white border-b border-gray-200 overflow-hidden">
        {/* Subtle background decoration using secondary color */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"
          style={{ backgroundColor: Theme.secondaryColor || Theme.primaryColor }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span 
            className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full border mb-4"
            style={{ 
              color: Theme.primaryColor, 
              borderColor: Theme.primaryColor, 
              backgroundColor: `${Theme.primaryColor}10` 
            }}
          >
            Our Expertise
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Professional Services <br className="hidden sm:block" /> Tailored for You
          </h1>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            From minor repairs to major installations, explore our comprehensive range of services provided by strictly vetted and highly skilled artisans.
          </p>
        </div>
      </div>

      {/* SERVICES GRID */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ 
                  backgroundColor: `${Theme.primaryColor}15`, 
                  color: Theme.primaryColor 
                }}
              >
                {service.icon}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                {service.description}
              </p>
              
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">What&apos;s Included</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <svg 
                        className="w-5 h-5 mr-2 shrink-0 mt-0.5" 
                        style={{ color: Theme.secondaryColor || Theme.primaryColor }} 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={`/findartisan?category=${service.title}`}
                className="block w-full py-3 px-4 rounded-xl text-center font-semibold text-white transition-opacity hover:opacity-90 mt-auto"
                style={{ backgroundColor: Theme.primaryColor }}
              >
                Find a {service.title.split(' ')[0]}
              </Link>
            </div>
          ))}
        </div>
      </main>

      {/* BOTTOM CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Don&apos;t see what you need?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Our network of artisans is constantly growing. Contact our support team to request a specialized service.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/findartisan" 
              className="px-8 py-4 rounded-xl font-bold text-white transition-opacity hover:opacity-90 w-full sm:w-auto"
              style={{ backgroundColor: Theme.primaryColor }}
            >
              Search All Artisans
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 rounded-xl font-bold border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}