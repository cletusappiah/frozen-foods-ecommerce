"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SLIDES = [
  "from-navy via-navy to-frost",
  "from-coral via-navy to-navy",
  "from-frost via-navy to-coral",
];

export default function AuthBrandPanel({
  heading,
  description,
}: {
  heading: React.ReactNode;
  description: string;
}) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
      {SLIDES.map((gradient, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-1000 ease-in-out ${
            i === slide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <Link href="/" className="font-display text-2xl font-semibold text-white">
          Port-Fresh
        </Link>
      </div>

      <div className="relative z-10">
        <h2 className="font-display text-3xl font-semibold leading-tight text-white">{heading}</h2>
        <p className="mt-3 max-w-sm text-white/70">{description}</p>

        <div className="mt-6 flex gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === slide ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}