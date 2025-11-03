"use client";

import { useEffect, useState } from "react";

export default function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-10 py-4 sm:py-6 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
          Your Todo List
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
          Stay organized and get things done
        </p>
      </div>
    </header>
  );
}
