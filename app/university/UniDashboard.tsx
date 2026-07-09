"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Crown,
  FileText,
  GraduationCap,
  LineChart,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import { AnimatedAIPanel, AnimatedCard, AnimatedSection, useLockBodyScroll } from "./UniversityMotion";

const metrics = [
  {
    label: "Students",
    value: "3,245",
    trend: "8.2%",
    icon: Users,
    tone: "text-[#5b21f3]",
    bg: "bg-[#f0e9ff]",
  },
  {
    label: "Employer Partners",
    value: "285",
    trend: "12.5%",
    icon: Building2,
    tone: "text-[#4338ca]",
    bg: "bg-[#eaf0ff]",
  },
  {
    label: "Industry Projects",
    value: "58",
    trend: "16.0%",
    icon: BriefcaseBusiness,
    tone: "text-[#ec1761]",
    bg: "bg-[#ffe5f1]",
  },
  {
    label: "Employment Rate",
    value: "91%",
    trend: "5.3%",
    icon: TrendingUp,
    tone: "text-[#18b76b]",
    bg: "bg-[#dff8ee]",
  },
];

const briefItems = [
  {
    text: "Communication readiness dropped 7% this semester.",
    icon: LineChart,
    bg: "bg-[#eee9ff]",
    tone: "text-[#6a35f5]",
  },
  {
    text: "2 new employer projects match your students.",
    icon: BriefcaseBusiness,
    bg: "bg-[#fff1ce]",
    tone: "text-[#ff7a00]",
  },
  {
    text: "Curriculum update recommended for review.",
    icon: BookOpen,
    bg: "bg-[#d9f8e8]",
    tone: "text-[#12b76a]",
  },
];

const projects = [
  {
    company: "Microsoft",
    title: "AI Dashboard Challenge",
    duration: "12 weeks",
    students: 24,
    logo: "microsoft",
  },
  {
    company: "Shopee",
    title: "E-commerce Analytics",
    duration: "10 weeks",
    students: 18,
    logo: "shopee",
  },
  {
    company: "Maybank",
    title: "Customer Insights",
    duration: "8 weeks",
    students: 16,
    logo: "maybank",
  },
];

const alerts = [
  {
    title: "Business storytelling is the top missing skill",
    subtitle: "Requested by 67% of employers",
    icon: TriangleAlert,
    bg: "bg-[#fff0d9]",
    tone: "text-[#f59e0b]",
  },
  {
    title: "Demand for Data Analytics roles",
    subtitle: "Increased 14% in the past 3 months",
    icon: LineChart,
    bg: "bg-[#e8f2ff]",
    tone: "text-[#2563eb]",
  },
  {
    title: "42 alumni received promotions",
    subtitle: "This month",
    icon: Users,
    bg: "bg-[#dcf8e9]",
    tone: "text-[#16a34a]",
  },
  {
    title: "Curriculum review suggested",
    subtitle: "AI recommendation available",
    icon: FileText,
    bg: "bg-[#efe2ff]",
    tone: "text-[#7c3aed]",
  },
];

const funnelSteps = [
  { label: "Graduated", value: "3,245", sub: "", icon: GraduationCap },
  { label: "Employed", value: "2,947", sub: "(91%)", icon: BriefcaseBusiness },
  { label: "Promoted", value: "1,271", sub: "(43%)", icon: LineChart },
  { label: "In Leadership", value: "382", sub: "(13%)", icon: Crown },
];

function MicrosoftLogo() {
  return (
    <div className="grid h-9 w-9 grid-cols-2 gap-0.5">
      <span className="bg-[#f25022]" />
      <span className="bg-[#7fba00]" />
      <span className="bg-[#00a4ef]" />
      <span className="bg-[#ffb900]" />
    </div>
  );
}

function ProjectLogo({ type }: { type: string }) {
  if (type === "microsoft") return <MicrosoftLogo />;

  if (type === "shopee") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff4d16] text-xl font-black text-white shadow-sm">
        S
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-[#ffd400] text-[10px] font-black text-black shadow-sm">
      MAY
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <AnimatedCard className={className}>{children}</AnimatedCard>;
}

function Header() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-base font-medium text-[#3f4b68]">Good morning,</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-normal text-[#070a17] md:text-[34px]">
          Taylor&apos;s University
        </h1>
        <p className="mt-2 text-base font-medium text-[#53607b]">
          Here&apos;s your AI briefing for today.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
        <button
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e8f1] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
        >
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6b35ff] text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <button className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#e6e8f1] bg-white px-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ececf4] bg-white text-base font-black text-[#e11d48]">
            T
          </div>
          <span className="text-left">
            <span className="block text-xs font-bold text-[#0b1020]">Dr. Melissa Lim</span>
            <span className="block text-xs font-medium text-[#53607b]">
              Career &amp; Industry Office
            </span>
          </span>
          <ChevronDown size={15} className="ml-4" />
        </button>

        <button className="flex h-10 items-center gap-2.5 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-semibold text-[#34415e] shadow-sm lg:basis-full lg:justify-self-end">
          <CalendarDays size={15} />
          29 June 2025
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}

function AIBrief() {
  return (
    <AnimatedAIPanel className="h-full">
      <Card className="relative flex h-full min-h-[260px] flex-col overflow-hidden border-[#f4d8e8] bg-[linear-gradient(135deg,#fff9fc_0%,#fff3fb_48%,#ffffff_100%)] p-4">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute -right-8 top-8 h-40 w-56 rounded-full border-[10px] border-[#f6c9ff]/35 blur-[1px]" />
          <div className="absolute -right-5 bottom-2 h-32 w-64 -rotate-[28deg] rounded-full border-[8px] border-[#b9a7ff]/35" />
          <div className="absolute -bottom-10 right-0 h-44 w-72 rounded-full bg-[radial-gradient(circle_at_55%_55%,rgba(167,139,250,0.28),rgba(244,114,182,0.12)_42%,transparent_72%)] blur-2xl" />
        </div>

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffe3f0] text-[#f0185b]">
          <Sparkles size={18} fill="currentColor" />
        </div>
        <h2 className="text-base font-extrabold tracking-normal text-[#090d1b]">
          University Brief
        </h2>
      </div>

      <div className="relative z-10 mt-5 max-w-[245px] space-y-3.5">
        {briefItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.text} className="flex gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.bg} ${item.tone}`}
              >
                <Icon size={15} strokeWidth={2.4} />
              </span>
              <p className="text-[12px] font-medium leading-5 text-[#172039]">{item.text}</p>
            </div>
          );
        })}
      </div>

      <Link
        href="/university/curriculum"
        className="relative z-10 mt-4 inline-flex h-9 w-fit items-center gap-2 self-start rounded-lg bg-[#ee0e58] px-5 text-xs font-bold text-white shadow-[0_18px_35px_rgba(238,14,88,0.22)] transition hover:-translate-y-0.5"
      >
        View recommendations
        <ArrowRight size={14} />
      </Link>

      <div className="pointer-events-none absolute bottom-2 right-2 hidden h-[170px] w-[210px] md:block">
        <div className="absolute bottom-3 right-12 h-24 w-24 rotate-12 rounded-[28px] bg-[radial-gradient(circle_at_38%_30%,rgba(255,255,255,0.82),rgba(255,128,205,0.36)_42%,rgba(139,92,246,0.22)_76%,transparent_100%)] blur-[6px]" />
        <div className="absolute bottom-7 right-16 h-16 w-16 rotate-12 rounded-[20px] bg-[radial-gradient(circle_at_36%_32%,rgba(255,255,255,0.92),rgba(255,156,221,0.42)_45%,rgba(167,139,250,0.28)_100%)] blur-[2px]" />
        <div className="absolute bottom-1 right-0 h-20 w-44 -rotate-12 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.36),rgba(196,181,253,0.16)_52%,transparent_72%)] blur-[3px]" />
        <div className="absolute bottom-6 right-5 h-24 w-44 -rotate-[28deg] rounded-full border-[7px] border-[#b9a7ff]/30" />
        <div className="absolute bottom-5 right-12 h-20 w-36 -rotate-[15deg] rounded-full border border-[#d8cbff]/45" />
      </div>
      </Card>
    </AnimatedAIPanel>
  );
}

function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
  const Icon = metric.icon;

  return (
    <Card className="p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${metric.bg} ${metric.tone}`}>
        <Icon size={20} strokeWidth={2.4} />
      </div>
      <p className="mt-3 min-h-9 text-sm font-medium leading-5 text-[#34415e]">
        {metric.label}
      </p>
      <p className="mt-1 text-[27px] font-extrabold leading-none tracking-normal text-[#070a17]">
        {metric.value}
      </p>
      <p className="mt-2 text-xs font-bold text-[#02b957]">↑ {metric.trend}</p>
      <p className="mt-0.5 text-xs font-medium text-[#172039]">vs last year</p>
    </Card>
  );
}

function Funnel() {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <Link
          href="/university/outcome"
          className="flex h-9 items-center gap-2.5 rounded-xl border border-[#e5e7f0] bg-white px-3.5 text-xs font-semibold text-[#1d2740] transition hover:bg-[#faf7ff]"
        >
          View Insights
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="relative mt-5 grid gap-4 md:grid-cols-4">
        <div className="pointer-events-none absolute left-[13%] right-[6%] top-[54px] hidden md:block">
          <div className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(124,58,237,0.15),rgba(124,58,237,0.34),rgba(124,58,237,0.18))]" />
          <div className="absolute -right-1 -top-[5px] h-0 w-0 border-y-[9px] border-l-[16px] border-y-transparent border-l-[#c9b6ff]/70" />
        </div>
        {funnelSteps.map((step) => {
          const Icon = step.icon;

          return (
            <div key={step.label} className="relative z-10 text-center">
              <p className="mb-3 text-xs font-bold text-[#18213a]">{step.label}</p>
              <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-full bg-[#eee7ff] text-[#6733f4] shadow-[0_12px_30px_rgba(103,51,244,0.08)]">
                <Icon size={24} strokeWidth={2.3} />
              </div>
              <p className="mt-2 text-xl font-extrabold leading-none text-[#070a17]">
                {step.value}
              </p>
              {step.sub ? (
                <p className="mt-1 text-sm font-semibold leading-none text-[#18213a]">
                  {step.sub}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Projects() {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold text-[#090d1b]">Top Industry Projects</h2>
      </div>

      <div className="divide-y divide-[#eef0f5]">
        {projects.map((project) => (
          <div
            key={project.company}
            className="grid grid-cols-[auto_1fr] items-center gap-3 py-2.5 md:grid-cols-[auto_1.4fr_0.7fr_0.9fr_auto]"
          >
            <ProjectLogo type={project.logo} />
            <div>
              <p className="text-sm font-extrabold text-[#090d1b]">{project.company}</p>
              <p className="mt-0.5 text-xs font-medium text-[#53607b]">{project.title}</p>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-[#090d1b]">{project.duration}</p>
              <p className="mt-0.5 text-xs font-medium text-[#53607b]">Duration</p>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-[#090d1b]">{project.students}</p>
              <p className="mt-0.5 text-xs font-medium text-[#53607b]">Students matched</p>
            </div>
            <span className="col-span-2 justify-self-start rounded-full bg-[#f0e7ff] px-5 py-1.5 text-xs font-bold text-[#5b21f3] md:col-span-1 md:justify-self-end">
              Active
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/university/industry"
        className="mt-3 flex h-10 w-full items-center justify-center gap-2.5 rounded-xl bg-[#f6f2ff] text-base font-extrabold text-[#5b21f3] transition hover:bg-[#efe4ff]"
      >
        Go to Project Hub
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70">
          <ArrowRight size={16} />
        </span>
      </Link>
    </Card>
  );
}

function AlertRow({ alert }: { alert: (typeof alerts)[number] }) {
  const Icon = alert.icon;

  return (
    <button className="grid min-h-14 w-full grid-cols-[40px_1fr_auto] items-center gap-3 rounded-xl border border-[#edf0f6] bg-white px-3 py-2 text-left shadow-[0_10px_26px_rgba(15,23,42,0.035)]">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${alert.bg} ${alert.tone}`}
      >
        <Icon size={20} strokeWidth={2.4} />
      </span>
      <span>
        <span className="block text-sm font-bold text-[#090d1b]">{alert.title}</span>
        <span className="mt-0.5 block text-xs font-medium text-[#53607b]">{alert.subtitle}</span>
      </span>
      <ChevronRight size={18} className="text-[#34415e]" />
    </button>
  );
}

function AlertsModal({ onClose }: { onClose: () => void }) {
  useLockBodyScroll();
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[#0b1020]/60 backdrop-blur-sm"
      />
      <div className="relative z-10 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#090d1b]">Insights &amp; Alerts</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e6e8f1] text-[#34415e] hover:bg-[#faf7ff]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <AlertRow key={alert.title} alert={alert} />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Alerts() {
  const [showAll, setShowAll] = useState(false);

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold text-[#090d1b]">Insights &amp; Alerts</h2>
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center gap-2 text-sm font-bold text-[#5b21f3]"
        >
          View all
          <ChevronRight size={17} />
        </button>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <AlertRow key={alert.title} alert={alert} />
        ))}
      </div>

      {showAll ? <AlertsModal onClose={() => setShowAll(false)} /> : null}
    </Card>
  );
}

export default function UniDashboard() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(111,66,255,0.07),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1480px]">
          <AnimatedSection>
            <Header />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-5 grid gap-4 2xl:grid-cols-[1.02fr_1.25fr]">
            <AIBrief />
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} />
                ))}
              </div>
              <Funnel />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.16} className="mt-4 grid gap-4 xl:grid-cols-[1.18fr_0.92fr]">
            <Projects />
            <Alerts />
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
