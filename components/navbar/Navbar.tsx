"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Menu,
  UserRound,
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
  useEffect,
} from "react";

const navItems = [
  {
    label: "Career Landscape",
    href: "/?view=career-landscape",
    icon: TrendingUp,
  },
  {
    label: "Living Portfolio",
    href: "/?view=living-portfolio",
    icon: FileText,
  },
  {
    label: "Life Chapter Designer",
    href: "/?view=life-chapter-designer",
    icon: Sparkles,
  },
  {
    label: "AI Career Coach",
    href: "/?view=ai-career-coach",
    icon: BotMessageSquare,
  },
  {
    label: "Browse University",
    href: "/?view=browse-university",
    icon: Building2,
  },
  {
    label: "Browse Employer",
    href: "/?view=browse-employer",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    href: "/?view=my-applications",
    icon: FileCheck,
  },
  {
    label: "Profile",
    href: "/?view=profile",
    icon: UserRound,
  },
];

const EXPANDED_WIDTH = "252px";
const COLLAPSED_WIDTH = "84px";

function Label({ collapsed, children }: { collapsed: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-out ${
        collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"
      }`}
    >
      {children}
    </span>
  );
}

function NotificationPanel({
  className = "",
  hasUnread,
}: {
  className?: string;
  hasUnread: boolean;
}) {
  return (
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
      className={`z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E5E8F0] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#E5E8F0] px-5 py-4">
        <h3 className="font-black text-[#081433]">
          Notifications
        </h3>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            hasUnread
              ? "bg-[#FFF2F6] text-[#E00046]"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {hasUnread ? "Unread" : "Read"}
        </span>
      </div>

      <div className="divide-y divide-[#F2F4F8]">
        <div className="flex gap-4 p-4 hover:bg-[#fafafa]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2F6]">
            <BotMessageSquare size={18} className="text-[#f0184f]" />
          </div>
          <div>
            <p className="font-bold text-[#081433]">Coach Check-In Ready</p>
            <p className="mt-1 text-sm text-[#46536D]">
              Your career coach has a next-step plan based on your latest portfolio signals.
            </p>
            <p className="mt-2 text-xs text-slate-400">Just now</p>
          </div>
        </div>

        <div className="flex gap-4 p-4 hover:bg-[#fafafa]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2F6]">
            <Sparkles size={18} className="text-[#f0184f]" />
          </div>
          <div>
            <p className="font-bold text-[#081433]">Potential to Update Your Portfolio</p>
            <p className="mt-1 text-sm text-[#46536D]">
              New projects and achievements can be added to strengthen your profile.
            </p>
            <p className="mt-2 text-xs text-slate-400">5 minutes ago</p>
          </div>
        </div>

        <div className="flex gap-4 p-4 hover:bg-[#fafafa]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2F6]">
            <TrendingUp size={18} className="text-[#f0184f]" />
          </div>
          <div>
            <p className="font-bold text-[#081433]">Career Progression Recommendation</p>
            <p className="mt-1 text-sm text-[#46536D]">
              Business Intelligence Analyst is now your strongest next-step role.
            </p>
            <p className="mt-2 text-xs text-slate-400">2 hours ago</p>
          </div>
        </div>

        <div className="flex gap-4 p-4 hover:bg-[#fafafa]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2F6]">
            <FileCheck size={18} className="text-[#f0184f]" />
          </div>
          <div>
            <p className="font-bold text-[#081433]">Application Reviewed</p>
            <p className="mt-1 text-sm text-[#46536D]">
              Your BI Analyst application has been reviewed by the hiring team.
            </p>
            <p className="mt-2 text-xs text-slate-400">1 day ago</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const mobileNotificationRef = useRef<HTMLDivElement>(null);
  const desktopNotificationRef = useRef<HTMLDivElement>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const activeIndex = useMemo(() => {
    if (
      view === "career-landscape" ||
      view === "deep-dive" ||
      view === "career-path-simulator"
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

    if (view === "browse-university") {
      return 4;
    }

    if (view === "browse-employer") {
      return 5;
    }

    if (
      view === "my-applications" ||
      view === "application-submitted" ||
      view === "jobapplication" ||
      view === "track-application" ||
      view === "company-profile"
    ) {
      return 6;
    }

    return 7;
  }, [view]);

  useEffect(() => {
    document.body.classList.add("candidate-sidebar-active");

    return () => {
      document.body.classList.remove("candidate-sidebar-active");
      document.documentElement.style.removeProperty("--candidate-sidebar-w");
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--candidate-sidebar-w",
      collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
    );
  }, [collapsed]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const clickedInsideNotifications = [
        mobileNotificationRef,
        desktopNotificationRef,
        notificationPanelRef,
      ].some((ref) => ref.current?.contains(target));

      if (!clickedInsideNotifications) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
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

  function toggleNotifications() {
    setShowNotifications((current) => {
      const next = !current;

      if (next) {
        setHasUnreadNotifications(false);
      }

      return next;
    });
  }
  
  return (
    <>
    <header
      className="sticky top-0 z-30 border-b border-[#ececf4] bg-white/92 backdrop-blur-xl xl:hidden"
      style={{
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">

        {/* Left */}
        <div className="min-w-0 flex items-center gap-3">

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6e6ef] bg-white shadow-sm"
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
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* Notifications */}
          <div
            ref={mobileNotificationRef}
            className="relative"
          >
            <button
              onClick={toggleNotifications}
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-black/75 transition hover:bg-[#fff1f5] hover:text-[#f0184f]"
            >
              <Bell size={18} />

              {hasUnreadNotifications ? (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f0184f]" />
              ) : null}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <NotificationPanel
                  className="absolute right-0 top-14"
                  hasUnread={hasUnreadNotifications}
                />
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
            className="max-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden border-t border-[#ececf4] bg-white xl:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-2 px-4 py-3 sm:px-8">
              {navItems.map((item, index) => {
                const active = index === activeIndex;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[#f0e9ff] text-[#5b21f3]"
                        : "text-[#18213a] hover:bg-[#faf7ff]"
                    }`}
                  >
                    <Icon size={17} />
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
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden flex-col overflow-y-auto overflow-x-hidden border-r border-[#ececf4] bg-white/92 px-4 py-5 shadow-[10px_0_35px_rgba(15,23,42,0.035)] backdrop-blur-xl transition-[width] duration-300 ease-out xl:flex ${
        collapsed ? "w-[84px]" : "w-[252px]"
      }`}
      data-collapsed={collapsed}
      style={{
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >
      <div className={`flex items-start ${collapsed ? "justify-center" : "justify-between gap-2"}`}>
        {collapsed ? null : (
          <div className="min-w-0 overflow-hidden">
            <div className="whitespace-nowrap text-[28px] font-extrabold leading-none tracking-normal text-black">
              Career<span className="text-[#f0185b]">OS</span>
            </div>
            <div className="mt-2 inline-flex whitespace-nowrap rounded-full bg-[#eee6ff] px-3.5 py-1 text-xs font-bold text-[#5b21f3]">
              Candidate
            </div>
          </div>
        )}
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((value) => !value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6e6ef] bg-white text-[#111827] shadow-sm"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="mt-7 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = index === activeIndex;

          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex h-11 w-full items-center rounded-xl text-left text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-[#f0e9ff] text-[#5b21f3] shadow-[0_12px_26px_rgba(91,33,243,0.08)]"
                  : "text-[#18213a] hover:bg-[#faf7ff]"
              } ${collapsed ? "justify-center px-0" : "gap-3 px-3.5"}`}
            >
              <Icon size={17} strokeWidth={2.2} className="shrink-0" />
              <Label collapsed={collapsed}>{item.label}</Label>
            </Link>
          );
        })}
      </nav>

      <div ref={desktopNotificationRef} className="mt-auto space-y-2 pb-1">
        <button
          type="button"
          onClick={toggleNotifications}
          title={collapsed ? "Notifications" : undefined}
          className={`relative flex h-10 w-full items-center rounded-xl border border-[#e6e8ef] bg-white text-[13px] font-medium text-[#4b5670] shadow-sm ${
            collapsed ? "justify-center px-0" : "gap-3 px-3.5"
          }`}
        >
          <Bell size={16} className="shrink-0" />
          <Label collapsed={collapsed}>Notifications</Label>
          {hasUnreadNotifications ? (
            <span className={`absolute top-3 h-2 w-2 rounded-full bg-[#f0184f] ${collapsed ? "right-2" : "right-3"}`} />
          ) : null}
        </button>
        <Link
          href="/"
          title={collapsed ? "Log out" : undefined}
          className={`flex h-10 w-full items-center rounded-xl border border-[#e6e8ef] bg-white text-[13px] font-medium text-red-500 shadow-sm ${
            collapsed ? "justify-center px-0" : "gap-3 px-3.5"
          }`}
        >
          <X size={16} className="shrink-0" />
          <Label collapsed={collapsed}>Log out</Label>
        </Link>
      </div>
    </aside>
    <AnimatePresence>
      {showNotifications && (
        <div
          ref={notificationPanelRef}
          className="fixed bottom-5 z-50 hidden xl:block"
          style={{
            left: "calc(var(--candidate-sidebar-w, 252px) + 1rem)",
          }}
        >
          <NotificationPanel hasUnread={hasUnreadNotifications} />
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
