"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  Download,
  LineChart,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AnimatedCard, AnimatedList, AnimatedProgress, AnimatedRow, AnimatedSection } from "./UniversityMotion";

const industries = [
  { name: "Technology / Software", share: "38%", grads: 1120, change: "+4.2%", width: "w-[92%]", color: "#6547f5" },
  { name: "Financial Services", share: "20%", grads: 589, change: "+2.1%", width: "w-[70%]", color: "#3b82f6" },
  { name: "Manufacturing", share: "12%", grads: 354, change: "-1.4%", width: "w-[48%]", color: "#c051e8" },
  { name: "Education", share: "8%", grads: 236, change: "+0.6%", width: "w-[34%]", color: "#fb923c" },
  { name: "Retail / E-commerce", share: "7%", grads: 206, change: "+3.8%", width: "w-[28%]", color: "#fbbf24" },
  { name: "Healthcare", share: "5%", grads: 147, change: "+1.1%", width: "w-[20%]", color: "#6ee7b7" },
  { name: "Others", share: "10%", grads: 295, change: "+0.9%", width: "w-[38%]", color: "#d8d3f7" },
];

const topEmployers = [
  ["Microsoft", "Technology / Software", 84],
  ["Maybank", "Financial Services", 61],
  ["Shopee", "Retail / E-commerce", 57],
  ["Petronas", "Manufacturing", 48],
  ["Grab", "Technology / Software", 42],
];

const trends = [
  { title: "Technology roles keep growing", body: "Software and data roles rose 4.2% year-on-year, the fastest of any sector.", icon: TrendingUp, bg: "bg-[#e1f7eb]", color: "text-[#16a34a]" },
  { title: "Manufacturing hiring softened", body: "Automation and slower expansion trimmed manufacturing intake by 1.4%.", icon: LineChart, bg: "bg-[#ffe3f1]", color: "text-[#f0185b]" },
  { title: "Retail & e-commerce accelerating", body: "Seasonal hiring plus new employer partners lifted this sector by 3.8%.", icon: Sparkles, bg: "bg-[#fff0d9]", color: "text-[#f59e0b]" },
];

function barWidth(widthClass: string) {
  return widthClass.replace("w-[", "").replace("]", "");
}

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
          Employment Distribution by Industry
        </h1>
        <p className="mt-3 max-w-2xl text-sm font-medium text-[#53607b]">
          A full breakdown of where your 2,947 employed graduates landed, updated for 1 Jan 2023 – 30 Jun 2025. Figures below are illustrative sample data.
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

function OverviewCard() {
  return (
    <Card className="p-5">
      <div className="grid items-center gap-8 md:grid-cols-[220px_1fr]">
        <div className="relative mx-auto h-44 w-44 rounded-full bg-[conic-gradient(#6547f5_0_38%,#3b82f6_38%_58%,#c051e8_58%_70%,#fb923c_70%_78%,#fbbf24_78%_85%,#6ee7b7_85%_90%,#d8d3f7_90%_100%)]">
          <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-white text-center">
            <p className="text-2xl font-extrabold">2,947</p>
            <p className="mt-1 text-xs font-medium text-[#53607b]">Employed</p>
            <p className="text-xs font-medium text-[#53607b]">Graduates</p>
          </div>
        </div>
        <div className="space-y-4">
          {industries.map((industry) => (
            <div key={industry.name}>
              <div className="mb-1 flex items-center gap-3 text-xs font-semibold text-[#26324d]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: industry.color }} />
                <span className="flex-1">{industry.name}</span>
                <span>{industry.grads.toLocaleString()} grads</span>
                <span className="w-10 text-right">{industry.share}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#f0ecff]">
                <AnimatedProgress
                  width={barWidth(industry.width)}
                  className="h-1.5 rounded-full"
                  style={{ backgroundColor: industry.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function EmployersCard() {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-extrabold text-[#090d1b]">Top Employers by Sector</h2>
      <p className="mt-1 text-xs font-medium text-[#53607b]">Employers hiring the most graduates this period.</p>
      <div className="mt-5 space-y-3">
        <div className="grid grid-cols-[1.4fr_1fr_0.6fr] text-[11px] font-semibold text-[#65718d]">
          <span>Employer</span>
          <span>Sector</span>
          <span className="text-right">Hires</span>
        </div>
        <AnimatedList className="space-y-3">
          {topEmployers.map(([name, sector, hires]) => (
            <AnimatedRow
              key={name as string}
              className="grid grid-cols-[1.4fr_1fr_0.6fr] items-center text-xs font-semibold text-[#26324d]"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#efe7ff] text-[10px] font-black text-[#6733f4]">
                  {(name as string)[0]}
                </span>
                {name}
              </span>
              <span className="text-[#53607b]">{sector}</span>
              <span className="text-right">{hires}</span>
            </AnimatedRow>
          ))}
        </AnimatedList>
      </div>
    </Card>
  );
}

function TrendsCard() {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-extrabold text-[#090d1b]">What&apos;s Changing</h2>
      <div className="mt-4 space-y-2">
        <AnimatedList className="space-y-2">
          {trends.map((trend) => {
            const Icon = trend.icon;

            return (
              <AnimatedRow key={trend.title}>
                <div className="grid min-h-14 w-full grid-cols-[40px_1fr] items-center gap-3 rounded-xl border border-[#edf0f6] bg-white px-3 py-2 shadow-[0_10px_26px_rgba(15,23,42,0.035)]">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${trend.bg} ${trend.color}`}>
                    <Icon size={20} strokeWidth={2.4} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[#090d1b]">{trend.title}</span>
                    <span className="mt-0.5 block text-xs font-medium text-[#53607b]">{trend.body}</span>
                  </span>
                </div>
              </AnimatedRow>
            );
          })}
        </AnimatedList>
      </div>
    </Card>
  );
}

function CTACard() {
  return (
    <Card className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#efe7ff] text-[#6733f4]">
          <Building2 size={22} />
        </span>
        <div>
          <h2 className="text-base font-extrabold text-[#090d1b]">Want a deeper industry breakdown?</h2>
          <p className="mt-1 text-xs font-medium text-[#53607b]">
            Explore live employer projects for these sectors in the Project Hub.
          </p>
        </div>
      </div>
      <Link
        href="/university/industry"
        className="flex h-10 items-center gap-2 rounded-xl bg-[#6733f4] px-5 text-xs font-bold text-white transition hover:-translate-y-0.5"
      >
        Go to Project Hub
        <ArrowRight size={15} />
      </Link>
    </Card>
  );
}

export default function IndustryReport() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(111,66,255,0.07),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1480px]">
          <AnimatedSection>
            <TopBar />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-6">
            <OverviewCard />
          </AnimatedSection>

          <AnimatedSection delay={0.16} className="mt-4 grid gap-4 xl:grid-cols-2">
            <EmployersCard />
            <TrendsCard />
          </AnimatedSection>

          <AnimatedSection delay={0.24} className="mt-4">
            <CTACard />
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
