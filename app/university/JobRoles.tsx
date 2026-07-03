"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChevronDown,
  Download,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";
import { AnimatedCard, AnimatedList, AnimatedProgress, AnimatedRow, AnimatedSection } from "./UniversityMotion";

const roles = [
  { role: "Software Engineer", category: "Technology", count: 842 },
  { role: "Data Analyst", category: "Technology", count: 512 },
  { role: "Business Analyst", category: "Business", count: 387 },
  { role: "System Analyst", category: "Technology", count: 293 },
  { role: "Product Executive", category: "Business", count: 218 },
  { role: "Financial Analyst", category: "Finance", count: 176 },
  { role: "Marketing Executive", category: "Business", count: 152 },
  { role: "Cyber Security Analyst", category: "Technology", count: 118 },
  { role: "UX/UI Designer", category: "Technology", count: 96 },
  { role: "Operations Executive", category: "Operations", count: 84 },
  { role: "HR Executive", category: "Business", count: 69 },
  { role: "Accounts Executive", category: "Finance", count: 63 },
  { role: "Supply Chain Executive", category: "Operations", count: 58 },
  { role: "Project Coordinator", category: "Business", count: 52 },
  { role: "Investment Analyst", category: "Finance", count: 44 },
  { role: "Logistics Coordinator", category: "Operations", count: 41 },
  { role: "Customer Success Executive", category: "Business", count: 39 },
];

const categories = ["All Categories", "Technology", "Business", "Finance", "Operations"] as const;

const categoryInsights: Record<(typeof categories)[number], string> = {
  "All Categories":
    "Technology roles make up over 55% of first destinations — Software Engineer and Data Analyst remain the two largest single roles for three years running.",
  Technology:
    "Technology hires are up 6% year-on-year, led by Software Engineer and Data Analyst roles across employer partners.",
  Business:
    "Business roles favour graduates with strong communication and stakeholder skills — Business Analyst is the top single role in this category.",
  Finance:
    "Finance placements stayed steady this year, concentrated mostly in Financial Analyst roles at banking and insurance partners.",
  Operations:
    "Operations roles are the smallest category but grew the fastest of any category this year, up 9% year-on-year.",
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={className}>{children}</AnimatedCard>;
}

function TopBar() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <Link
          href="/university/outcome"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#53607b] hover:text-[#5b21f3]"
        >
          <ArrowLeft size={14} />
          Back to Performance Insights
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-normal text-[#070a17] md:text-[34px]">
          Top Job Roles
        </h1>
        <p className="mt-3 max-w-2xl text-sm font-medium text-[#53607b]">
          The full breakdown of roles your graduates hold across all employed alumni. Figures below are illustrative sample data.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
        <button aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e8f1] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6b35ff] text-[10px] font-bold text-white">3</span>
        </button>
        <button className="flex h-10 items-center gap-2.5 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-semibold text-[#34415e] shadow-sm">
          <CalendarDays size={15} />
          1 Jan 2023 - 30 Jun 2025
          <ChevronDown size={14} />
        </button>
        <button className="flex h-10 items-center gap-2.5 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-semibold text-[#34415e] shadow-sm">
          <Download size={15} />
          Export
        </button>
        <button className="flex h-10 items-center gap-2.5 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-semibold text-[#34415e] shadow-sm">
          <Share2 size={15} />
          Share report
        </button>
      </div>
    </header>
  );
}

const TOTAL_EMPLOYED = 2947;

function RolesTable({
  activeCategory,
  onSelectCategory,
  search,
  onSearchChange,
}: {
  activeCategory: (typeof categories)[number];
  onSelectCategory: (category: (typeof categories)[number]) => void;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const filteredRoles = useMemo(() => {
    const byCategory =
      activeCategory === "All Categories" ? roles : roles.filter((item) => item.category === activeCategory);
    const query = search.trim().toLowerCase();
    const list = query ? byCategory.filter((item) => item.role.toLowerCase().includes(query)) : byCategory;
    const maxCount = Math.max(...list.map((item) => item.count), 1);

    return list.map((item) => ({
      ...item,
      pct: `${((item.count / TOTAL_EMPLOYED) * 100).toFixed(1)}%`,
      width: `${Math.max(6, Math.round((item.count / maxCount) * 100))}%`,
    }));
  }, [activeCategory, search]);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-[#090d1b]">All Employed Graduate Roles</h2>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onSelectCategory(tab)}
              aria-pressed={activeCategory === tab}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                activeCategory === tab
                  ? "bg-[#f0e9ff] text-[#5b21f3]"
                  : "bg-[#f7f7fb] text-[#53607b] hover:bg-[#efeaff] hover:text-[#5b21f3]"
              }`}
            >
              {tab}
            </button>
          ))}
          <label className="flex h-8 w-44 items-center gap-2 rounded-full border border-[#e6e8f1] bg-white px-3 text-xs font-medium text-[#65718d] focus-within:border-[#c9b6ff]">
            <Search size={13} className="shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search roles..."
              className="w-full bg-transparent text-xs font-medium text-[#26324d] outline-none placeholder:text-[#9aa3b8]"
            />
          </label>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-[1.6fr_1fr_1.2fr_0.6fr] text-[11px] font-semibold text-[#65718d]">
          <span>Role</span>
          <span>Category</span>
          <span></span>
          <span className="text-right">% of Employed</span>
        </div>
        <AnimatedList key={`${activeCategory}-${search}`} className="space-y-3">
          {filteredRoles.map((item) => (
            <AnimatedRow
              key={item.role}
              className="grid grid-cols-[1.6fr_1fr_1.2fr_0.6fr] items-center text-xs font-semibold text-[#26324d]"
            >
              <span>
                {item.role}
                <span className="ml-2 font-medium text-[#9aa3b8]">{item.count}</span>
              </span>
              <span className="text-[#53607b]">{item.category}</span>
              <span className="h-1.5 rounded-full bg-[#f0ecff]">
                <AnimatedProgress width={item.width} className="block h-1.5 rounded-full bg-[#b59cff]" />
              </span>
              <span className="text-right">{item.pct}</span>
            </AnimatedRow>
          ))}
        </AnimatedList>
        {filteredRoles.length === 0 ? (
          <p className="py-6 text-center text-xs font-medium text-[#65718d]">
            {search.trim() ? `No roles matching "${search}".` : "No roles found in this category yet."}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

function InsightBanner({ activeCategory }: { activeCategory: (typeof categories)[number] }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#efe7ff] text-[#6733f4]">
        <Sparkles size={18} fill="currentColor" />
      </span>
      <p className="text-xs font-semibold leading-5 text-[#172039]">{categoryInsights[activeCategory]}</p>
    </Card>
  );
}

export default function JobRoles() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All Categories");
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(111,66,255,0.07),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1200px]">
          <AnimatedSection>
            <TopBar />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-6">
            <RolesTable
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              search={search}
              onSearchChange={setSearch}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.16} className="mt-4">
            <InsightBanner activeCategory={activeCategory} />
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
