"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Crown,
  FileBarChart,
  GraduationCap,
  LineChart,
  Share2,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { AnimatedCard, AnimatedList, AnimatedProgress, AnimatedRow, AnimatedSection } from "./UniversityMotion";

const metrics = [
  { title: "Overall Employment Rate", value: "91%", change: "5.3%", icon: BriefcaseBusiness, bg: "bg-[#efe7ff]", color: "text-[#6733f4]" },
  { title: "Promotion Rate (3 Yrs)", value: "43%", change: "6.7%", icon: TrendingUp, bg: "bg-[#e1f7eb]", color: "text-[#1fb968]" },
  { title: "Leadership Rate", value: "13%", change: "3.1%", icon: Crown, bg: "bg-[#e7f0ff]", color: "text-[#2563eb]" },
  { title: "Average Starting Salary", value: "RM4,200", change: "6.2%", icon: WalletCards, bg: "bg-[#ffe3f1]", color: "text-[#f0185b]" },
];

const funnel = [
  { label: "Graduated", value: "3,245", sub: "100%", icon: GraduationCap, change: "" },
  { label: "Employed", value: "2,947", sub: "91%", icon: BriefcaseBusiness, change: "5.3%" },
  { label: "Promoted", value: "1,271", sub: "43%", icon: LineChart, change: "6.7%" },
  { label: "In Leadership", value: "382", sub: "13%", icon: Crown, change: "3.1%" },
];

const industries = [
  ["Technology / Software", "38%", "#6547f5"],
  ["Financial Services", "20%", "#3b82f6"],
  ["Manufacturing", "12%", "#c051e8"],
  ["Education", "8%", "#fb923c"],
  ["Retail / E-commerce", "7%", "#fbbf24"],
  ["Healthcare", "5%", "#6ee7b7"],
  ["Others", "10%", "#d8d3f7"],
];

const roles = [
  ["Software Engineer", "842", "28.6%", "w-[82%]"],
  ["Data Analyst", "512", "17.4%", "w-[55%]"],
  ["Business Analyst", "387", "13.1%", "w-[42%]"],
  ["System Analyst", "293", "9.9%", "w-[32%]"],
  ["Product Executive", "218", "7.4%", "w-[24%]"],
];

const salaries = [
  ["Computer Science", "RM4,800", "6.8%", "w-[92%]"],
  ["Data Analytics", "RM4,600", "7.1%", "w-[82%]"],
  ["Information Systems", "RM4,200", "5.4%", "w-[70%]"],
  ["Software Engineering", "RM4,100", "5.0%", "w-[65%]"],
  ["Cyber Security", "RM4,000", "4.3%", "w-[60%]"],
];

const insights = [
  { title: "Graduates who completed industry projects", body: "receive promotions 2.1x faster.", icon: TrendingUp, bg: "bg-[#e1f7eb]", color: "text-[#16a34a]" },
  { title: "Communication skills remain the top", body: "reason for interview rejections.", icon: LineChart, bg: "bg-[#e8f2ff]", color: "text-[#2563eb]" },
  { title: "Demand for Data & AI related roles", body: "increased 18% this year.", icon: Sparkles, bg: "bg-[#fff0d9]", color: "text-[#f59e0b]" },
  { title: "Leadership readiness is the key factor", body: "limiting senior role progression.", icon: FileBarChart, bg: "bg-[#efe2ff]", color: "text-[#7c3aed]" },
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
        <div className="flex items-center gap-3">
          <span className="text-[#6733f4]">
            <Sparkles size={27} fill="currentColor" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-normal text-[#070a17] md:text-[34px]">
            Performance Insights
          </h1>
        </div>
        <p className="mt-4 text-sm font-medium text-[#53607b]">
          Understand graduate outcomes and career progression to drive data-informed decisions.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
        <button aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e8f1] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6b35ff] text-[10px] font-bold text-white">3</span>
        </button>
        <button className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#e6e8f1] bg-white px-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ececf4] bg-white text-base font-black text-[#e11d48]">T</div>
          <span className="text-left">
            <span className="block text-xs font-bold text-[#0b1020]">Dr. Melissa Lim</span>
            <span className="block text-xs font-medium text-[#53607b]">Career &amp; Industry Office</span>
          </span>
          <ChevronDown size={15} className="ml-4" />
        </button>
        <button className="flex h-10 items-center gap-2.5 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-semibold text-[#34415e] shadow-sm">
          <CalendarDays size={15} />
          1 Jan 2023 - 30 Jun 2025
          <ChevronDown size={14} />
        </button>
        <button className="flex h-10 items-center gap-2.5 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-semibold text-[#34415e] shadow-sm">
          <Share2 size={15} />
          Share report
        </button>
      </div>
    </header>
  );
}

function MetricCard({ item }: { item: (typeof metrics)[number] }) {
  const Icon = item.icon;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 items-center justify-center rounded-full ${item.bg} ${item.color}`}>
          <Icon size={22} strokeWidth={2.3} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#34415e]">{item.title}</p>
          <p className="mt-2 text-[26px] font-extrabold leading-none text-[#070a17]">{item.value}</p>
          <p className="mt-4 text-xs font-bold text-[#02b957]">↑ {item.change} <span className="font-medium text-[#53607b]">vs last year</span></p>
        </div>
      </div>
      <div className={`ml-auto mt-2 h-8 w-24 ${item.color}`}>
        <svg viewBox="0 0 100 36" className="h-full w-full" aria-hidden="true">
          <polyline points="2,28 18,20 31,23 46,12 62,18 78,7 96,12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Card>
  );
}

function FunnelCard() {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-extrabold text-[#090d1b]">Graduate Journey Funnel</h2>
        <span className="group relative flex h-5 w-5 items-center justify-center rounded-full border border-[#9aa8c4] text-xs font-bold text-[#71809d]">
          i
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-56 -translate-x-1/2 scale-95 rounded-lg bg-[#111827] px-3 py-2 text-[11px] font-medium leading-4 text-white opacity-0 shadow-lg transition-all duration-150 group-hover:scale-100 group-hover:opacity-100">
            Tracks each graduating cohort as they move from graduation to employment, promotion, and leadership roles.
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#111827]" />
          </span>
        </span>
      </div>
      <p className="mt-2 text-xs font-medium text-[#53607b]">Track your graduates&apos; journey from graduation to leadership.</p>

      <div className="relative mt-8 grid gap-4 md:grid-cols-4">
        <div className="pointer-events-none absolute left-[14%] right-[10%] top-[49px] hidden h-4 md:block">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="journeyArrowOutcome" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(124,58,237,0.1)" />
                <stop offset="50%" stopColor="rgba(124,58,237,0.34)" />
                <stop offset="100%" stopColor="rgba(124,58,237,0.14)" />
              </linearGradient>
            </defs>
            <path
              d="M0 7.5 H930 Q958 7.5 982 10 L930 18 V12.5 H0 Z"
              fill="url(#journeyArrowOutcome)"
            />
          </svg>
        </div>
        {funnel.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="relative z-10 text-center">
              <p className="mb-3 min-h-8 text-xs font-bold text-[#18213a]">{step.label}</p>
              <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-full bg-[#eee7ff] text-[#6733f4] shadow-[0_12px_30px_rgba(103,51,244,0.08)]">
                <Icon size={24} strokeWidth={2.3} />
              </div>
              <p className="mt-2 text-xl font-extrabold leading-none text-[#070a17]">{step.value}</p>
              <p className="mt-1 text-xs font-semibold text-[#53607b]">{step.sub}</p>
              {step.change ? <p className="mt-1 text-xs font-bold text-[#02b957]">↑ {step.change}</p> : null}
            </div>
          );
        })}
      </div>

      <div className="mt-7 flex items-center gap-2 rounded-xl bg-[#f4efff] px-4 py-3 text-xs font-semibold text-[#47347c]">
        <Sparkles size={16} className="text-[#6733f4]" fill="currentColor" />
        42% of graduates are promoted within 3 years, 6.7% higher than last year.
      </div>
    </Card>
  );
}

function IndustryCard() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-[#090d1b]">Employment Distribution by Industry</h2>
        <Link
          href="/university/outcome/industry-report"
          className="flex items-center gap-2 text-xs font-bold text-[#5b21f3] transition hover:text-[#4318c9]"
        >
          View full report <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-7 grid items-center gap-8 md:grid-cols-[220px_1fr]">
        <div className="relative mx-auto h-44 w-44 rounded-full bg-[conic-gradient(#6547f5_0_38%,#3b82f6_38%_58%,#c051e8_58%_70%,#fb923c_70%_78%,#fbbf24_78%_85%,#6ee7b7_85%_90%,#d8d3f7_90%_100%)]">
          <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-white text-center">
            <p className="text-2xl font-extrabold">2,947</p>
            <p className="mt-1 text-xs font-medium text-[#53607b]">Employed</p>
            <p className="text-xs font-medium text-[#53607b]">Graduates</p>
          </div>
        </div>
        <div className="space-y-3">
          {industries.map(([name, value, color]) => (
            <div key={name} className="flex items-center gap-3 text-xs font-semibold text-[#26324d]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="flex-1">{name}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function RolesCard() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-[#090d1b]">Top Job Roles</h2>
      </div>
      <div className="mt-5 space-y-3">
        <div className="grid grid-cols-[1.4fr_0.5fr_1fr_0.5fr] text-[11px] font-semibold text-[#65718d]">
          <span>Role</span><span>Number</span><span></span><span>% of Employed</span>
        </div>
        <AnimatedList className="space-y-3">
          {roles.map(([role, count, pct, width]) => (
            <AnimatedRow key={role} className="grid grid-cols-[1.4fr_0.5fr_1fr_0.5fr] items-center text-xs font-semibold text-[#26324d]">
              <span>{role}</span>
              <span>{count}</span>
              <span className="h-1.5 rounded-full bg-[#f0ecff]">
                <AnimatedProgress width={barWidth(width)} className="block h-1.5 rounded-full bg-[#b59cff]" />
              </span>
              <span>{pct}</span>
            </AnimatedRow>
          ))}
        </AnimatedList>
      </div>
      <Link
        href="/university/outcome/roles"
        className="mt-6 flex h-10 w-full items-center justify-center rounded-xl bg-[#f6f2ff] text-sm font-bold text-[#5b21f3] transition hover:bg-[#efe4ff]"
      >
        View more roles
      </Link>
    </Card>
  );
}

function SalaryCard() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-[#090d1b]">Average Salary by Program</h2>
      </div>
      <div className="mt-5 space-y-4">
        {salaries.map(([program, amount, change, width]) => (
          <div key={program}>
            <div className="mb-1 flex items-center text-xs font-semibold text-[#26324d]">
              <span className="flex-1">{program}</span>
              <span>{amount}</span>
              <span className="ml-8 text-[#02b957]">↑ {change}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#f0ecff]">
              <AnimatedProgress width={barWidth(width)} className="h-1.5 rounded-full bg-[#7c3aed]" />
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/university/outcome/salary-benchmark"
        className="mt-6 flex h-10 w-full items-center justify-center rounded-xl bg-[#f6f2ff] text-sm font-bold text-[#5b21f3] transition hover:bg-[#efe4ff]"
      >
        View salary benchmark
      </Link>
    </Card>
  );
}

function InsightsCard() {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-extrabold text-[#090d1b]">Outcome Insights</h2>
      <div className="mt-4 space-y-2">
        <AnimatedList className="space-y-2">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <AnimatedRow key={insight.title}>
                <button className="grid min-h-14 w-full grid-cols-[40px_1fr_auto] items-center gap-3 rounded-xl border border-[#edf0f6] bg-white px-3 py-2 text-left shadow-[0_10px_26px_rgba(15,23,42,0.035)]">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${insight.bg} ${insight.color}`}>
                    <Icon size={20} strokeWidth={2.4} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[#090d1b]">{insight.title}</span>
                    <span className="mt-0.5 block text-xs font-medium text-[#53607b]">{insight.body}</span>
                  </span>
                  <ChevronRight size={18} />
                </button>
              </AnimatedRow>
            );
          })}
        </AnimatedList>
      </div>
      <Link
        href="/university/curriculum"
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#6733f4] text-sm font-bold text-white transition hover:bg-[#5b21f3]"
      >
        Explore recommendations <ArrowRight size={16} />
      </Link>
    </Card>
  );
}

export default function OutcomeInt() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(111,66,255,0.07),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1480px]">
          <AnimatedSection>
            <TopBar />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item) => <MetricCard key={item.title} item={item} />)}
          </AnimatedSection>

          <AnimatedSection delay={0.16} className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.98fr]">
            <FunnelCard />
            <IndustryCard />
          </AnimatedSection>

          <AnimatedSection delay={0.24} className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1fr_1fr]">
            <RolesCard />
            <SalaryCard />
            <InsightsCard />
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
