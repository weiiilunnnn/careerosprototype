"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileBarChart,
  GraduationCap,
  Heart,
  Home,
  LogOut,
  Map,
  Users,
} from "lucide-react";
import { AnimatedCard } from "./UniversityMotion";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/university" },
  { label: "Performance Insights", icon: FileBarChart, href: "/university/outcome" },
  { label: "Talent Readiness", icon: Users, href: "/university/talent" },
  { label: "Project Hub", icon: Map, href: "/university/industry" },
  { label: "Internship Marketplace", icon: Heart, href: "/university/industry/marketplace" },
  { label: "AI Coach", icon: BookOpen, href: "/university/curriculum" },
  { label: "University Profile", icon: Building2, href: "/university/profile" },
];

const filterPaths = new Set(["/university", "/university/outcome"]);

const EXPANDED_WIDTH = "252px";
const COLLAPSED_WIDTH = "84px";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={className}>{children}</AnimatedCard>;
}

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

function matchesRoute(pathname: string, href: string) {
  return href === "/university" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export default function UniversitySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const showFilter = filterPaths.has(pathname);
  const showQuickAccess = pathname === "/university/talent/profile";
  const [collapsed, setCollapsed] = useState(false);

  const activeHref = navItems
    .filter((item) => matchesRoute(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--uni-sidebar-w",
      collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
    );
  }, [collapsed]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 hidden flex-col overflow-hidden border-r border-[#ececf4] bg-white/92 px-4 py-5 shadow-[10px_0_35px_rgba(15,23,42,0.035)] backdrop-blur-xl transition-[width] duration-300 ease-out xl:flex ${
        collapsed ? "w-[84px]" : "w-[252px]"
      }`}
    >
      <div className={`flex items-start ${collapsed ? "justify-center" : "justify-between gap-2"}`}>
        {collapsed ? null : (
          <div className="min-w-0 overflow-hidden">
            <div className="whitespace-nowrap text-[28px] font-extrabold leading-none tracking-normal text-black">
              Career<span className="text-[#f0185b]">OS</span>
            </div>
            <div className="mt-2 inline-flex whitespace-nowrap rounded-full bg-[#eee6ff] px-3.5 py-1 text-xs font-bold text-[#5b21f3]">
              University
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
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href === activeHref;

          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-left text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-[#f0e9ff] text-[#5b21f3] shadow-[0_12px_26px_rgba(91,33,243,0.08)]"
                  : "text-[#18213a] hover:bg-[#faf7ff]"
              }`}
            >
              <Icon size={17} strokeWidth={2.2} className="shrink-0" />
              <Label collapsed={collapsed}>{item.label}</Label>
            </Link>
          );
        })}
      </nav>

      {showFilter && !collapsed ? (
        <Card className="mt-6 p-2.5">
          <div className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-normal text-[#53607b]">
            Program Filter
          </div>
          <button className="mb-2 flex h-9 w-full items-center justify-between rounded-xl border border-[#e3e6ef] bg-white px-3 text-xs font-semibold text-[#18213a]">
            <span className="flex items-center gap-2">
              <GraduationCap size={15} />
              All Programs
            </span>
            <ChevronDown size={14} />
          </button>
          <button className="mb-2 flex h-9 w-full items-center justify-between rounded-xl border border-[#e3e6ef] bg-white px-3 text-xs font-semibold text-[#18213a]">
            <span className="flex items-center gap-2">
              <CalendarDays size={15} />
              2023 - 2024
            </span>
            <ChevronDown size={14} />
          </button>
          <button className="flex h-8 w-full items-center justify-between px-2 text-xs font-medium text-[#53607b]">
            Comparison: vs last year
            <ChevronDown size={14} />
          </button>
        </Card>
      ) : null}

      {showQuickAccess && !collapsed ? (
        <Card className="mt-6 p-3">
          <div className="mb-3 text-xs font-bold text-[#53607b]">Quick Access</div>
          {["Find Top Students", "Find Alumni Talent", "Portfolio Review", "Talent Pool Builder", "Student Skills Map"].map(
            (item) => (
              <button
                key={item}
                className="flex h-9 w-full items-center gap-3 rounded-xl px-2 text-left text-xs font-semibold text-[#26324d] hover:bg-[#faf7ff]"
              >
                <Users size={15} className="shrink-0" />
                <span className="whitespace-nowrap">{item}</span>
              </button>
            ),
          )}
        </Card>
      ) : null}

      <div className="mt-auto space-y-2 pb-1">
        <button
          type="button"
          onClick={() => router.push("/")}
          title={collapsed ? "Log out" : undefined}
          className="flex h-10 w-full items-center gap-3 rounded-xl border border-[#e6e8ef] bg-white px-3.5 text-[13px] font-medium text-[#4b5670] shadow-sm"
        >
          <LogOut size={16} className="shrink-0" />
          <Label collapsed={collapsed}>Log out</Label>
        </button>
      </div>
    </aside>
  );
}
