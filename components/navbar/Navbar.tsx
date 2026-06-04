"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ChevronDown, Menu, X } from "lucide-react";

const navItems = ["Dashboard", "Explore Careers", "My Growth", "Applications", "Messages"];

export default function Navbar({ initialActiveItem = "Explore Careers" }: { initialActiveItem?: string }) {
  const [activeItem, setActiveItem] = useState(initialActiveItem);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 text-black lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <h1 className="text-2xl font-extrabold tracking-tight">
            Career<span className="text-[#f0184f]">OS</span>
          </h1>

          <div className="relative hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const isActive = item === activeItem;

              return (
                <button
                  key={item}
                  type="button"
                  className={`relative h-20 px-1 text-sm font-semibold transition ${
                    isActive ? "text-[#f0184f]" : "text-black/75 hover:text-black"
                  }`}
                  onClick={() => setActiveItem(item)}
                >
                  {item}
                  {isActive ? (
                    <motion.span
                      layoutId="active-nav-glow"
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#f0184f] shadow-[0_0_22px_rgba(240,24,79,0.9)]"
                      transition={{ type: "spring", stiffness: 430, damping: 32 }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-black/75 transition hover:bg-[#fff1f5] hover:text-[#f0184f]"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f0184f] shadow-[0_0_12px_rgba(240,24,79,0.8)]" />
          </button>

          <button
            type="button"
            className="hidden items-center gap-3 rounded-md px-2 py-1.5 transition hover:bg-[#fff1f5] sm:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5c6b7] text-sm font-bold text-[#8d3c2d]">
              JT
            </span>
            <span className="text-sm font-semibold">Jason Tan</span>
            <ChevronDown size={15} />
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-black/5 bg-white px-5 py-3 lg:hidden">
          <div className="grid gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-md px-3 py-3 text-left text-sm font-semibold ${
                  item === activeItem ? "bg-[#fff1f5] text-[#f0184f]" : "text-black/75"
                }`}
                onClick={() => {
                  setActiveItem(item);
                  setIsMenuOpen(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
