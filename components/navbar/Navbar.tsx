"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  FileCheck,
  BotMessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";

const navItems = [
  {
    label: "Career Landscape",
    href: "/?view=career-landscape",
  },
  {
    label: "Living Portfolio",
    href: "/?view=living-portfolio",
  },
  {
    label: "Life Chapter Designer",
    href: "/?view=life-chapter-designer",
  },
  {
    label: "AI Career Coach",
    href: "/?view=ai-career-coach",
  },
  {
    label: "Applications",
    href: "/?view=my-applications",
  },
    {
    label: "Profile",
    href: "/?view=profile",
  }
];

export default function Navbar() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [indicator, setIndicator] = useState({
    x: 0,
    width: 0,
  });

  const activeIndex = useMemo(() => {
    if (
      view === "career-landscape" ||
      view === "deep-dive"
    ) {
      return 0;
    }

    if (view === "living-portfolio") {
      return 1;
    }

    if (view === "life-chapter-designer") {
      return 2;
    }

    if (view === "ai-career-coach") {
      return 3;
    }

    if (
      view === "my-applications" ||
      view === "application-submitted" ||
      view === "jobapplication" ||
      view === "track-application"
    ) {
      return 4;
    }

    return 5;
  }, [view]);

  useLayoutEffect(() => {
    const activeElement = itemRefs.current[activeIndex];
    const container = navRef.current;

    if (!activeElement || !container) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();

    setIndicator({
      x: activeRect.left - containerRect.left,
      width: activeRect.width,
    });
  }, [activeIndex]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);
  
  return (
    <header
      className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur-xl"
      style={{
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">

        {/* Left */}
        <div className="min-w-0 flex items-center gap-3 sm:gap-8">

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 lg:hidden"
            onClick={() =>
              setIsMenuOpen((prev) => !prev)
            }
          >
            {isMenuOpen ? (
              <X size={18} />
            ) : (
              <Menu size={18} />
            )}
          </button>

          <h1 className="cursor-default select-none text-xl font-semibold tracking-normal text-[#081433] sm:text-2xl">
            Career
            <span className="text-[#f0184f]">
              OS
            </span>
          </h1>

          <div
            ref={navRef}
            className="relative hidden items-center gap-5 xl:gap-8 lg:flex"
          >
            {navItems.map((item, index) => {
              const active =
                index === activeIndex;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  ref={(el) => {
                    itemRefs.current[index] =
                      el;
                  }}
                  className={`relative flex h-20 items-center px-1 text-sm font-semibold transition-colors ${
                    active
                      ? "text-[#f0184f]"
                      : "text-black/75 hover:text-black"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <motion.div
              initial={false}
              animate={{
                x: indicator.x,
                width: indicator.width,
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 35,
              }}
              className="absolute bottom-0 h-[2px] rounded-full bg-[#f0184f]"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* Notifications */}
          <div
            ref={bellRef}
            className="relative"
          >
            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-black/75 transition hover:bg-[#fff1f5] hover:text-[#f0184f]"
            >
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f0184f]" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="absolute right-0 top-14 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E5E8F0] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                >
                  <div className="border-b border-[#E5E8F0] px-5 py-4">
                    <h3 className="font-black text-[#081433]">
                      Notifications
                    </h3>
                  </div>

                  <div className="divide-y divide-[#F2F4F8]">

                    <div className="flex gap-4 p-4 hover:bg-[#fafafa]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2F6]">
                        <BotMessageSquare
                          size={18}
                          className="text-[#f0184f]"
                        />
                      </div>

                      <div>
                        <p className="font-bold text-[#081433]">
                          Coach Check-In Ready
                        </p>

                        <p className="mt-1 text-sm text-[#46536D]">
                          Your career coach has a
                          next-step plan based on
                          your latest portfolio
                          signals.
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          Just now
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 hover:bg-[#fafafa]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2F6]">
                        <Sparkles
                          size={18}
                          className="text-[#f0184f]"
                        />
                      </div>

                      <div>
                        <p className="font-bold text-[#081433]">
                          Potential to Update
                          Your Portfolio
                        </p>

                        <p className="mt-1 text-sm text-[#46536D]">
                          New projects and
                          achievements can be
                          added to strengthen
                          your profile.
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          5 minutes ago
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 hover:bg-[#fafafa]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2F6]">
                        <TrendingUp
                          size={18}
                          className="text-[#f0184f]"
                        />
                      </div>

                      <div>
                        <p className="font-bold text-[#081433]">
                          Career Progression
                          Recommendation
                        </p>

                        <p className="mt-1 text-sm text-[#46536D]">
                          Business Intelligence
                          Analyst is now your
                          strongest next-step
                          role.
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          2 hours ago
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 hover:bg-[#fafafa]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2F6]">
                        <FileCheck
                          size={18}
                          className="text-[#f0184f]"
                        />
                      </div>

                      <div>
                        <p className="font-bold text-[#081433]">
                          Application Reviewed
                        </p>

                        <p className="mt-1 text-sm text-[#46536D]">
                          Your BI Analyst
                          application has been
                          reviewed by the hiring
                          team.
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          1 day ago
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div
            ref={profileRef}
            className="relative hidden sm:block"
          >
            <button
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
              className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-[#fff1f5]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5c6b7] text-sm font-bold text-[#8d3c2d]">
                JT
              </span>

              <span className="text-sm font-semibold">
                Jason Tan
              </span>

              <ChevronDown
                size={15}
                className={`transition-transform ${
                  showProfileMenu
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="absolute right-0 top-14 z-50 w-52 overflow-hidden rounded-2xl border border-[#E5E8F0] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                >
                  <Link
                    href="/?view=profile"
                    className="block px-5 py-3 text-sm font-medium text-[#081433] transition hover:bg-[#fff1f5]"
                    onClick={() =>
                      setShowProfileMenu(false)
                    }
                  >
                    View Profile
                  </Link>
                  
                  <Link
                    href="/"
                    className="block px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Log Out
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-black/5 bg-white lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-2 px-4 py-3 sm:px-8">
              {navItems.map((item, index) => {
                const active = index === activeIndex;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[#fff1f5] text-[#f0184f]"
                        : "text-black/75 hover:bg-black/[0.03] hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                Log Out
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
