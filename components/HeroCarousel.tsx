"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    heading: "Skip the sunrise trip to the port.",
    body: "Order fish, chicken, seafood and meat sourced straight from the port. We handle the early morning - you just open the door when it arrives.",
    cta: "Shop now",
    ctaHref: "/shop",
    bgClass: "bg-navy",
  },
  {
    heading: "Fresh frozen fish, every week.",
    body: "Tilapia, seafood and more, kept cold from the port to your freezer. No middlemen, no markup.",
    cta: "Browse fish",
    ctaHref: "/shop?category=fish",
    bgClass: "bg-teal",
  },
  {
    heading: "Stock your freezer, save the trip.",
    body: "Chicken, meat and frozen vegetables delivered to your door across Accra.",
    cta: "See all products",
    ctaHref: "/shop",
    bgClass: "bg-frost",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className={`relative overflow-hidden transition-colors duration-700 ${slide.bgClass}`}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero-frozen-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, transparent 20%, black 60%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, transparent 20%, black 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:grid-cols-5 sm:py-24">
        <div key={index} className="hero-rise sm:col-span-3">
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl">
            {slide.heading}
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/70">{slide.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={slide.ctaHref}
              className="rounded-full bg-coral px-7 py-3 font-semibold text-white shadow-lg shadow-coral/20 transition hover:brightness-105"
            >
              {slide.cta}
            </Link>
            <Link href="/signup" className="font-medium text-white/80 underline-offset-4 hover:underline">
              Create an account
            </Link>
          </div>

          <div className="mt-10 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-coral" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="hidden sm:col-span-2 sm:block" />
      </div>
    </section>
  );
}