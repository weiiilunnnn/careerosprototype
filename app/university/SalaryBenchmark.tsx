"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChevronDown,
  Download,
  Share2,
  Sparkles,
} from "lucide-react";
import { AnimatedCard, AnimatedList, AnimatedProgress, AnimatedRow, AnimatedSection } from "./UniversityMotion";

const salaries = [
  { program: "Computer Science", amount: "RM4,800", change: "+6.8%", width: "92%" },
  { program: "Data Analytics", amount: "RM4,600", change: "+7.1%", width: "82%" },
  { program: "Information Systems", amount: "RM4,200", change: "+5.4%", width: "70%" },
  { program: "Software Engineering", amount: "RM4,100", change: "+5.0%", width: "65%" },
  { program: "Cyber Security", amount: "RM4,000", change: "+4.3%", width: "60%" },
  { program: "Business Analytics", amount: "RM3,900", change: "+4.9%", width: "58%" },
  { program: "Finance", amount: "RM3,700", change: "+3.2%", width: "52%" },
  { program: "Marketing", amount: "RM3,400", change: "+2.6%", width: "45%" },
  { program: "Mechanical Engineering", amount: "RM3,600", change: "+3.8%", width: "50%" },
  { program: "Accounting", amount: "RM3,500", change: "+3.0%", width: "48%" },
];

const percentiles = [
  { label: "25th Percentile", value: "RM3,200" },
  { label: "Median", value: "RM3,900" },
  { label: "75th Percentile", value: "RM4,600" },
  { label: "Top 10%", value: "RM5,800" },
];

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
          Salary Benchmark
        </h1>
        <p className="mt-3 max-w-2xl text-sm font-medium text-[#53607b]">
          Average starting salary by programme, benchmarked against last year. Figures below are illustrative sample data.
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

function PercentileStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {percentiles.map((item) => (
        <Card key={item.label} className="p-4">
          <p className="text-xs font-bold text-[#53607b]">{item.label}</p>
          <p className="mt-2 text-2xl font-extrabold text-[#070a17]">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}

function SalaryTable() {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-extrabold text-[#090d1b]">Average Salary by Programme</h2>
      <div className="mt-5 space-y-4">
        <AnimatedList className="space-y-4">
          {salaries.map((item) => (
            <AnimatedRow key={item.program}>
              <div className="mb-1 flex items-center text-xs font-semibold text-[#26324d]">
                <span className="flex-1">{item.program}</span>
                <span>{item.amount}</span>
                <span className="ml-8 text-[#02b957]">↑ {item.change}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#f0ecff]">
                <AnimatedProgress width={item.width} className="h-1.5 rounded-full bg-[#7c3aed]" />
              </div>
            </AnimatedRow>
          ))}
        </AnimatedList>
      </div>
    </Card>
  );
}

function InsightBanner() {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#efe7ff] text-[#6733f4]">
        <Sparkles size={18} fill="currentColor" />
      </span>
      <p className="text-xs font-semibold leading-5 text-[#172039]">
        Computer Science and Data Analytics graduates continue to command the highest starting salaries, both up more than 6.8% year-on-year.
      </p>
    </Card>
  );
}

export default function SalaryBenchmark() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(111,66,255,0.07),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1200px]">
          <AnimatedSection>
            <TopBar />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-6">
            <PercentileStrip />
          </AnimatedSection>

          <AnimatedSection delay={0.16} className="mt-4">
            <SalaryTable />
          </AnimatedSection>

          <AnimatedSection delay={0.24} className="mt-4">
            <InsightBanner />
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
