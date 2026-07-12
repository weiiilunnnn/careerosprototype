"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Cloud,
  Download,
  GraduationCap,
  LineChart,
  MessageSquareText,
  Printer,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { AnimatedAIPanel, AnimatedCard, AnimatedList, AnimatedRow, AnimatedSection, universityEase, useLockBodyScroll } from "./UniversityMotion";
import { initialFaculties } from "./facultyData";

const currentModules = [
  { label: "Database Systems", status: "covered" },
  { label: "Software Engineering", status: "covered" },
  { label: "Java Programming", status: "covered" },
  { label: "Networking", status: "partial" },
  { label: "Statistics", status: "covered" },
  { label: "Machine Learning", status: "partial" },
  { label: "Business Intelligence", status: "partial" },
];

const industrySkills = [
  { label: "SQL", status: "covered" },
  { label: "Python", status: "covered" },
  { label: "Power BI", status: "partial" },
  { label: "Cloud Computing", status: "partial" },
  { label: "Prompt Engineering", status: "missing" },
  { label: "AI Engineering", status: "missing" },
  { label: "Dashboard Storytelling", status: "missing" },
];

const gaps = [
  {
    title: "Prompt Engineering",
    body: "Not currently covered. Appears in 48% of AI-related graduate roles.",
    priority: "High",
    impact: "High",
    lift: "+8%",
    icon: MessageSquareText,
    tone: "text-[#f0185b]",
    bg: "bg-[#ffe3f1]",
  },
  {
    title: "Cloud Computing",
    body: "Only partially introduced. Employers increasingly expect deployment knowledge.",
    priority: "High",
    impact: "High",
    lift: "+7%",
    icon: Cloud,
    tone: "text-[#2563eb]",
    bg: "bg-[#e7f0ff]",
  },
  {
    title: "Dashboard Storytelling",
    body: "Students build dashboards, but communication and business storytelling are rarely taught.",
    priority: "Medium",
    impact: "High",
    lift: "+6%",
    icon: LineChart,
    tone: "text-[#f59e0b]",
    bg: "bg-[#fff0d9]",
  },
];

const recommendations = [
  {
    label: "Introduce a new module",
    title: "AI Engineering Fundamentals",
    reason: "Growing demand in graduate AI roles and product teams.",
    details: ["Model evaluation basics", "Prompt workflows", "AI product constraints"],
    difficulty: "Medium",
    impact: "High",
    time: "1 semester",
    icon: Sparkles,
  },
  {
    label: "Expand existing module",
    title: "Business Intelligence",
    reason: "Employers need graduates who can explain dashboards to business stakeholders.",
    details: ["Power BI", "Dashboard Storytelling", "Stakeholder Presentation"],
    difficulty: "Easy",
    impact: "High",
    time: "6 weeks",
    icon: LineChart,
  },
  {
    label: "Create employer-led project",
    title: "Partner with Microsoft",
    reason: "Students can build an AI dashboard using real company data and receive employer feedback.",
    details: ["Industry brief", "Real dataset", "Final stakeholder demo"],
    difficulty: "Hard",
    impact: "High",
    time: "12 weeks",
    icon: BriefcaseBusiness,
  },
];

const impactCards = [
  { title: "Current Graduate Readiness", value: "Good", body: "Strong fundamentals, but limited applied AI and deployment exposure.", icon: GraduationCap, color: "text-[#16a34a]", bg: "bg-[#e1f7eb]" },
  { title: "Future Readiness", value: "Excellent", body: "After improvements, students map better to emerging graduate roles.", icon: Target, color: "text-[#6733f4]", bg: "bg-[#efe7ff]" },
];

const improvements = [
  ["Graduate Employability", "+14%", Users],
  ["Industry Alignment", "+21%", Target],
  ["Employer Satisfaction", "+18%", BriefcaseBusiness],
  ["Internship Conversion", "+11%", Zap],
] as const;

const roadmap = [
  ["Semester 1", "Improve Business Intelligence", "Add Power BI storytelling labs and presentation rubrics."],
  ["Semester 2", "Introduce Cloud Fundamentals", "Teach deployment concepts, APIs, and production workflows."],
  ["Semester 3", "Launch AI Engineering", "Add prompt systems, evaluation, governance, and AI product thinking."],
  ["Semester 4", "Review Graduate Outcomes", "Compare placement data with updated employer demand signals."],
];

const curriculumMatchScore = 85;

const statusLabel: Record<string, string> = { covered: "Covered", partial: "Partially Covered", missing: "Missing" };

function SoftCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={`gap-0 rounded-[24px] border-[#e7e8f0] bg-white/90 py-0 shadow-[0_22px_60px_rgba(15,23,42,0.07)] ${className}`}>{children}</AnimatedCard>;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "covered") {
    return <Check size={15} className="text-[#16a34a]" />;
  }
  if (status === "partial") {
    return <span className="h-1.5 w-4 rounded-full bg-[#f59e0b]" />;
  }
  return <X size={15} className="text-[#f0185b]" />;
}

function Pill({ children, tone = "purple" }: { children: React.ReactNode; tone?: "purple" | "green" | "orange" | "red" | "blue" }) {
  const tones = {
    purple: "bg-[#efe7ff] text-[#5b21f3]",
    green: "bg-[#e1f7eb] text-[#16834a]",
    orange: "bg-[#fff0d9] text-[#c76a00]",
    red: "bg-[#ffe3f1] text-[#df185a]",
    blue: "bg-[#e7f0ff] text-[#2563eb]",
  };

  return <Badge className={`h-6 rounded-full border-0 px-2.5 text-[11px] font-bold ${tones[tone]}`}>{children}</Badge>;
}

function TopBar({ onExportClick }: { onExportClick: () => void }) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-[#6733f4]">
            <Sparkles size={27} fill="currentColor" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-normal text-[#070a17] md:text-[34px]">AI Review</h1>
        </div>
        <p className="mt-4 max-w-3xl text-sm font-medium leading-6 text-[#53607b]">
          AI compares your current curriculum with real industry demand and identifies what should be improved before your students graduate.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
        <button aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e8f1] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6b35ff] text-[10px] font-bold text-white">5</span>
        </button>
        <button className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#e6e8f1] bg-white px-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ececf4] bg-white text-base font-black text-[#e11d48]">T</div>
          <span className="text-left">
            <span className="block text-xs font-bold text-[#0b1020]">Dr. Melissa Lim</span>
            <span className="block text-xs font-medium text-[#53607b]">Career &amp; Industry Office</span>
          </span>
          <ChevronDown size={15} className="ml-4" />
        </button>
        <Button
          onClick={onExportClick}
          className="h-10 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-bold text-[#34415e] shadow-sm hover:bg-[#faf7ff]"
          variant="outline"
        >
          <Download size={15} />
          Export Report
        </Button>
      </div>
    </header>
  );
}

function FacultyCourseSelector({
  facultySlug,
  courseSlug,
  onFacultyChange,
  onCourseChange,
}: {
  facultySlug: string;
  courseSlug: string;
  onFacultyChange: (slug: string) => void;
  onCourseChange: (slug: string) => void;
}) {
  const faculty = initialFaculties.find((item) => item.slug === facultySlug) ?? initialFaculties[0];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e7e8f0] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center">
      <p className="text-xs font-bold uppercase tracking-normal text-[#64708b]">Reviewing</p>
      <div className="flex flex-1 flex-col gap-2 sm:flex-row">
        <select
          value={facultySlug}
          onChange={(event) => onFacultyChange(event.target.value)}
          className="h-10 flex-1 rounded-xl border border-[#e5e7f0] bg-white px-3 text-sm font-bold text-[#0b1020] outline-none focus:border-[#8b7bf4]"
        >
          {initialFaculties.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={courseSlug}
          onChange={(event) => onCourseChange(event.target.value)}
          className="h-10 flex-1 rounded-xl border border-[#e5e7f0] bg-white px-3 text-sm font-bold text-[#0b1020] outline-none focus:border-[#8b7bf4]"
        >
          {faculty.courses.map((course) => (
            <option key={course.slug} value={course.slug}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function AnalysisModal({ onClose }: { onClose: () => void }) {
  useLockBodyScroll();
  const targetPercent = curriculumMatchScore;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const duration = 1100;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setPercent(Math.round(progress * targetPercent));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (typeof document === "undefined") return null;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#0b0f22]/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: universityEase }}
        className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_40px_90px_rgba(15,23,42,0.25)] [-ms-overflow-style:none] [scrollbar-width:none] md:p-8 [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-[#46536D] transition hover:bg-[#F7F8FB]"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#efe7ff] px-3 py-1.5 text-xs font-bold text-[#5b21f3]">
            <Bot size={15} />
            CareerOS AI Analysis
          </div>
          <h2 className="mt-3 text-xl font-extrabold text-[#070a17]">Curriculum-to-Industry Match</h2>

          <div className="relative mx-auto mt-6 flex h-[140px] w-[140px] items-center justify-center">
            <svg width={140} height={140} className="-rotate-90">
              <circle cx={70} cy={70} r={radius} fill="none" stroke="#f0edff" strokeWidth={12} />
              <circle
                cx={70}
                cy={70}
                r={radius}
                fill="none"
                stroke="#6733f4"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <span className="absolute text-3xl font-black text-[#070a17]">{percent}%</span>
          </div>
          <p className="mt-2 text-sm font-medium text-[#53607b]">Match between current curriculum and live employer demand.</p>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-normal text-[#64708b]">Top reasons behind this score</p>
          {gaps.map((gap) => {
            const Icon = gap.icon;
            return (
              <div key={gap.title} className="flex items-start gap-3 rounded-2xl border border-[#eceef6] bg-[#faf9fc] p-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${gap.bg} ${gap.tone}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[#0b1020]">{gap.title}</p>
                  <p className="mt-0.5 text-xs font-medium leading-5 text-[#53607b]">{gap.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-[#081433] text-sm font-bold text-white transition hover:bg-[#152238]"
        >
          Close
        </button>
      </motion.div>
    </div>,
    document.body,
  );
}

function ExportReportModal({ onClose, onPrint }: { onClose: () => void; onPrint: () => void }) {
  useLockBodyScroll();
  if (typeof document === "undefined") return null;
  const generatedOn = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#0b0f22]/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: universityEase }}
        className="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white shadow-[0_40px_90px_rgba(15,23,42,0.25)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-[#46536D] transition hover:bg-[#F7F8FB]"
        >
          <X size={16} />
        </button>

        <div className="rounded-t-[28px] bg-[linear-gradient(135deg,#efe7ff,#fff)] p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfff] bg-white/80 px-3 py-1.5 text-xs font-bold text-[#5b21f3] shadow-sm">
            <Bot size={15} />
            CareerOS AI Summary Report
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-[#070a17]">Curriculum Review Report</h2>
          <p className="mt-1 text-xs font-medium text-[#53607b]">Generated on {generatedOn} &middot; Computer Science programme</p>

          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[#eee7ff] bg-white/80 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f0e9ff] text-lg font-black text-[#5b21f3]">
              {curriculumMatchScore}%
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0b1020]">Curriculum-to-Industry Match</p>
              <p className="mt-0.5 text-xs font-medium leading-5 text-[#53607b]">
                Strong fundamentals overall, with a handful of high-impact gaps in applied AI and cloud exposure.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 md:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-[#64708b]">Top skills missing</p>
            <div className="mt-3 space-y-2.5">
              {gaps.map((gap) => {
                const Icon = gap.icon;
                return (
                  <div key={gap.title} className="flex items-start gap-3 rounded-2xl border border-[#eceef6] bg-[#faf9fc] p-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${gap.bg} ${gap.tone}`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-extrabold text-[#0b1020]">{gap.title}</p>
                        <span className="text-xs font-bold text-[#16a34a]">{gap.lift}</span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium leading-5 text-[#53607b]">{gap.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-[#64708b]">Recommended next moves</p>
            <div className="mt-3 space-y-2.5">
              {recommendations.map((item, index) => (
                <div key={item.title} className="rounded-2xl border border-[#eceef6] bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-extrabold text-[#0b1020]">{index + 1}. {item.title}</p>
                    <span className="text-xs font-bold text-[#5b21f3]">{item.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs font-medium leading-5 text-[#53607b]">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-[#64708b]">Suggested roadmap</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {roadmap.map(([term, title, body]) => (
                <div key={term} className="rounded-2xl border border-[#eceef6] bg-[#faf9fc] p-3">
                  <p className="text-[11px] font-bold uppercase text-[#64708b]">{term}</p>
                  <p className="mt-0.5 text-sm font-extrabold text-[#0b1020]">{title}</p>
                  <p className="mt-0.5 text-xs font-medium leading-5 text-[#53607b]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#eef0f6] p-6 sm:flex-row md:px-8">
          <button
            type="button"
            onClick={onPrint}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#081433] text-sm font-bold text-white transition hover:bg-[#152238]"
          >
            <Printer size={16} />
            Print / Save as PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center justify-center rounded-xl border border-[#e6e8f1] bg-white px-5 text-sm font-bold text-[#34415e] transition hover:bg-[#faf7ff]"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

function PrintableCurriculumReport() {
  const generatedOn = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <section className="curriculum-print-sheet hidden">
      <header className="curriculum-print-header">
        <div>
          <p className="curriculum-print-kicker">CareerOS AI Review</p>
          <h1>Curriculum Review Report</h1>
          <p>Generated on {generatedOn} &middot; Computer Science programme</p>
        </div>
        <div className="curriculum-print-score">
          <strong>{curriculumMatchScore}%</strong>
          <span>Match</span>
        </div>
      </header>

      <section className="curriculum-print-card">
        <h2>Current curriculum vs industry skills</h2>
        <div className="curriculum-print-grid">
          <div>
            <h3>Current curriculum</h3>
            <ul>
              {currentModules.map((item) => (
                <li key={item.label}>{item.label} — {statusLabel[item.status]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Industry skills demand</h3>
            <ul>
              {industrySkills.map((item) => (
                <li key={item.label}>{item.label} — {statusLabel[item.status]}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="curriculum-print-card">
        <h2>Top skills missing</h2>
        {gaps.map((gap) => (
          <div key={gap.title} className="curriculum-print-item">
            <h3>{gap.title} <span>{gap.lift}</span></h3>
            <p>{gap.body}</p>
          </div>
        ))}
      </section>

      <section className="curriculum-print-card">
        <h2>Recommended next curriculum moves</h2>
        {recommendations.map((item, index) => (
          <div key={item.title} className="curriculum-print-item">
            <h3>{index + 1}. {item.title} <span>{item.time}</span></h3>
            <p>{item.reason}</p>
          </div>
        ))}
      </section>

      <section className="curriculum-print-card">
        <h2>Expected improvements</h2>
        <ul>
          {improvements.map(([label, value]) => (
            <li key={label}>{label}: {value}</li>
          ))}
        </ul>
      </section>

      <section className="curriculum-print-card">
        <h2>Suggested roadmap</h2>
        {roadmap.map(([term, title, body]) => (
          <div key={term} className="curriculum-print-item">
            <h3>{term}: {title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </section>
    </section>
  );
}

function AISummary({ facultyName, courseName }: { facultyName: string; courseName: string }) {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  return (
    <>
    <AnimatedAIPanel>
    <SoftCard className="overflow-hidden">
      <CardContent className="relative p-6 md:p-8">
        <div className="absolute right-0 top-0 h-48 w-72 rounded-bl-[80px] bg-[radial-gradient(circle_at_center,rgba(240,24,91,0.16),rgba(103,51,244,0.08),transparent_68%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eadfff] bg-white/80 px-3 py-1.5 text-xs font-bold text-[#5b21f3] shadow-sm">
              <Bot size={15} />
              CareerOS AI Summary
            </div>
            <h2 className="text-2xl font-extrabold tracking-normal text-[#070a17] md:text-[30px]">
              Are we teaching what employers actually need?
            </h2>
            <div className="mt-5 space-y-4 text-[15px] font-medium leading-7 text-[#33415f]">
              <p>Your {courseName} course ({facultyName}) is well aligned with today&apos;s software engineering roles.</p>
              <p>
                However, our analysis found several important gaps between your curriculum and current employer expectations. Students are well prepared in programming fundamentals but have limited exposure to Data Storytelling, Cloud Platforms, Prompt Engineering, and AI Product Development.
              </p>
              <p>If these gaps are addressed, graduate employability is projected to improve significantly.</p>
            </div>
            <Button
              onClick={() => setIsAnalysisOpen(true)}
              className="mt-6 h-11 rounded-xl bg-[#f0185b] px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(240,24,91,0.24)] hover:bg-[#d91652]"
            >
              View Analysis
              <ArrowRight size={16} />
            </Button>
          </div>
          <div className="grid min-w-[240px] gap-3 rounded-[22px] border border-[#eee7ff] bg-white/75 p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-normal text-[#53607b]">Signals compared</div>
            {["Live job postings", "Graduate outcomes", "Employer hiring patterns", "Industry reports"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#26324d]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#efe7ff] text-[#6733f4]">
                  <Check size={13} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </SoftCard>
    </AnimatedAIPanel>

    <AnimatePresence>
      {isAnalysisOpen ? <AnalysisModal onClose={() => setIsAnalysisOpen(false)} /> : null}
    </AnimatePresence>
    </>
  );
}

function ModuleList({ title, items, align = "left" }: { title: string; items: typeof currentModules; align?: "left" | "right" }) {
  return (
    <SoftCard className="min-h-full">
      <CardContent className="p-5">
        <h3 className="text-base font-extrabold text-[#0b1020]">{title}</h3>
        <AnimatedList className="mt-4 space-y-2.5">
          {items.map((item) => (
            <AnimatedRow key={item.label} className={`flex items-center justify-between rounded-2xl border border-[#eef0f6] bg-white px-3.5 py-3 text-sm font-semibold text-[#26324d] ${align === "right" ? "flex-row-reverse" : ""}`}>
              <span>{item.label}</span>
              <StatusIcon status={item.status} />
            </AnimatedRow>
          ))}
        </AnimatedList>
      </CardContent>
    </SoftCard>
  );
}

function CurriculumComparison() {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#070a17]">Current Curriculum vs Industry</h2>
          <p className="mt-1 text-sm font-medium text-[#53607b]">What are we teaching, and what is industry asking for?</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill tone="green">Covered</Pill>
          <Pill tone="orange">Partially Covered</Pill>
          <Pill tone="red">Missing</Pill>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_120px_1fr]">
        <ModuleList title="Current Curriculum" items={currentModules} />
        <div className="hidden items-center justify-center lg:flex">
          <div className="relative h-[360px] w-full">
            <div className="absolute left-1/2 top-8 h-[82%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#d8c7ff] to-transparent" />
            {[42, 88, 134, 180, 226, 272, 318].map((top, index) => (
              <div key={top} className="absolute left-1/2 flex w-full -translate-x-1/2 items-center justify-center" style={{ top }}>
                <span className={`h-px flex-1 ${index < 3 ? "bg-[#b9e9ce]" : index < 5 ? "bg-[#ffd89b]" : "bg-[#ffc1d9]"}`} />
                <span className="mx-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e0ff] bg-white text-[#6733f4] shadow-sm">
                  <ArrowRight size={14} />
                </span>
                <span className={`h-px flex-1 ${index < 3 ? "bg-[#b9e9ce]" : index < 5 ? "bg-[#ffd89b]" : "bg-[#ffc1d9]"}`} />
              </div>
            ))}
          </div>
        </div>
        <ModuleList title="Industry Skills" items={industrySkills} align="right" />
      </div>
    </section>
  );
}

function GapCard({ gap }: { gap: (typeof gaps)[number] }) {
  const Icon = gap.icon;
  return (
    <div className="rounded-[20px] border border-[#eceef6] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${gap.bg} ${gap.tone}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold text-[#0b1020]">{gap.title}</h3>
          <p className="mt-1 text-sm font-medium leading-6 text-[#53607b]">{gap.body}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl bg-[#faf8ff] p-3">
          <div className="text-[11px] font-bold uppercase text-[#64708b]">Priority</div>
          <div className="mt-1 text-sm font-extrabold text-[#f0185b]">{gap.priority}</div>
        </div>
        <div className="rounded-2xl bg-[#faf8ff] p-3">
          <div className="text-[11px] font-bold uppercase text-[#64708b]">Industry Impact</div>
          <div className="mt-1 text-sm font-extrabold text-[#6733f4]">{gap.impact}</div>
        </div>
        <div className="rounded-2xl bg-[#faf8ff] p-3">
          <div className="text-[11px] font-bold uppercase text-[#64708b]">Employability</div>
          <div className="mt-1 text-sm font-extrabold text-[#16a34a]">{gap.lift}</div>
        </div>
      </div>
    </div>
  );
}

function KeyGaps() {
  return (
    <SoftCard>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffe3f1] text-[#f0185b]">
            <TriangleAlert size={20} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#070a17]">Top Skills Missing</h2>
            <p className="mt-1 text-sm font-medium text-[#53607b]">These gaps matter because they appear repeatedly in employer requests and graduate role requirements.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {gaps.map((gap) => (
            <GapCard key={gap.title} gap={gap} />
          ))}
        </div>
      </CardContent>
    </SoftCard>
  );
}

function RecommendationCard({ item, index }: { item: (typeof recommendations)[number]; index: number }) {
  const Icon = item.icon;
  return (
    <div className="rounded-[22px] border border-[#eceef6] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#efe7ff] font-black text-[#6733f4]">{index + 1}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={index === 0 ? "purple" : index === 1 ? "green" : "blue"}>{item.label}</Pill>
            <Icon size={16} className="text-[#6733f4]" />
          </div>
          <h3 className="mt-3 text-lg font-extrabold text-[#0b1020]">{item.title}</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-[#53607b]">{item.reason}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.details.map((detail) => (
              <span key={detail} className="rounded-full bg-[#f7f3ff] px-3 py-1 text-xs font-bold text-[#4b5670]">{detail}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-2 border-t border-[#eef0f6] pt-4 sm:grid-cols-3">
        <div>
          <div className="text-[11px] font-bold uppercase text-[#64708b]">Difficulty</div>
          <div className="mt-1 text-sm font-extrabold text-[#0b1020]">{item.difficulty}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase text-[#64708b]">Expected Impact</div>
          <div className="mt-1 text-sm font-extrabold text-[#6733f4]">{item.impact}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase text-[#64708b]">Implementation</div>
          <div className="mt-1 text-sm font-extrabold text-[#16a34a]">{item.time}</div>
        </div>
      </div>
    </div>
  );
}

function ActionPlanModal({ onClose }: { onClose: () => void }) {
  useLockBodyScroll();
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());

  if (typeof document === "undefined") return null;

  function toggleStep(term: string) {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(term)) next.delete(term);
      else next.add(term);
      return next;
    });
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#0b0f22]/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: universityEase }}
        className="relative z-10 max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_40px_90px_rgba(15,23,42,0.25)] [-ms-overflow-style:none] [scrollbar-width:none] md:p-8 [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-[#46536D] transition hover:bg-[#F7F8FB]"
        >
          <X size={16} />
        </button>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#efe7ff] px-3 py-1.5 text-xs font-bold text-[#5b21f3]">
          <Bot size={15} />
          Generated by CareerOS AI
        </div>
        <h2 className="mt-3 text-xl font-extrabold text-[#070a17]">Curriculum Action Plan</h2>
        <p className="mt-1 text-sm font-medium leading-6 text-[#53607b]">
          Track progress on the recommended changes and the suggested rollout sequence.
        </p>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-normal text-[#64708b]">Recommended moves</p>
          <div className="mt-2 space-y-2.5">
            {recommendations.map((item, index) => (
              <div key={item.title} className="rounded-2xl border border-[#eceef6] bg-[#faf9fc] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-[#0b1020]">{index + 1}. {item.title}</p>
                  <Pill tone={index === 0 ? "purple" : index === 1 ? "green" : "blue"}>{item.difficulty}</Pill>
                </div>
                <p className="mt-1 text-xs font-medium leading-5 text-[#53607b]">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-normal text-[#64708b]">Rollout sequence</p>
            <span className="text-xs font-bold text-[#5b21f3]">{checkedSteps.size}/{roadmap.length} started</span>
          </div>
          <div className="mt-2 space-y-2.5">
            {roadmap.map(([term, title, body]) => {
              const checked = checkedSteps.has(term);
              return (
                <button
                  key={term}
                  type="button"
                  onClick={() => toggleStep(term)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                    checked ? "border-[#c7ecd6] bg-[#e1f7eb]" : "border-[#eceef6] bg-white hover:bg-[#faf9fc]"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      checked ? "border-[#16a34a] bg-[#16a34a] text-white" : "border-[#d6dbe6] text-transparent"
                    }`}
                  >
                    <Check size={12} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase text-[#64708b]">{term}</p>
                    <p className="text-sm font-extrabold text-[#0b1020]">{title}</p>
                    <p className="mt-0.5 text-xs font-medium leading-5 text-[#53607b]">{body}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-[#081433] text-sm font-bold text-white transition hover:bg-[#152238]"
        >
          Close
        </button>
      </motion.div>
    </div>,
    document.body,
  );
}

function AIRecommendations() {
  const [isActionPlanOpen, setIsActionPlanOpen] = useState(false);

  return (
    <>
    <AnimatedAIPanel>
    <SoftCard className="overflow-hidden">
      <CardContent className="relative p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(103,51,244,0.12),transparent_55%)]" />
        <div className="relative">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#efe7ff] px-3 py-1.5 text-xs font-bold text-[#5b21f3]">
                <Bot size={15} />
                Generated by CareerOS AI
              </div>
              <h2 className="mt-3 text-xl font-extrabold text-[#070a17]">Recommended next curriculum moves</h2>
              <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-[#53607b]">
                After comparing live job postings, graduate outcomes, employer hiring patterns, and industry reports, CareerOS recommends these changes.
              </p>
            </div>
            <Button
              onClick={() => setIsActionPlanOpen(true)}
              className="h-10 rounded-xl border-[#d9ccff] bg-white px-4 text-xs font-bold text-[#5b21f3] hover:bg-[#faf7ff]"
              variant="outline"
            >
              View Action Plan
              <ArrowRight size={15} />
            </Button>
          </div>
          <AnimatedList className="mt-5 grid gap-4">
            {recommendations.map((item, index) => (
              <AnimatedRow key={item.title}>
                <RecommendationCard item={item} index={index} />
              </AnimatedRow>
            ))}
          </AnimatedList>
        </div>
      </CardContent>
    </SoftCard>
    </AnimatedAIPanel>

    <AnimatePresence>
      {isActionPlanOpen ? <ActionPlanModal onClose={() => setIsActionPlanOpen(false)} /> : null}
    </AnimatePresence>
    </>
  );
}

function CareerImpact() {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4">
        {impactCards.map((card) => {
          const Icon = card.icon;
          return (
            <SoftCard key={card.title}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#53607b]">{card.title}</div>
                  <div className="mt-1 text-2xl font-extrabold text-[#070a17]">{card.value}</div>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#53607b]">{card.body}</p>
                </div>
              </CardContent>
            </SoftCard>
          );
        })}
      </div>
      <SoftCard>
        <CardContent className="p-6">
          <h2 className="text-xl font-extrabold text-[#070a17]">Expected Improvements</h2>
          <p className="mt-1 text-sm font-medium text-[#53607b]">Simple outcomes to watch after the curriculum changes are launched.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {improvements.map(([label, value, Icon]) => (
              <div key={label} className="rounded-[20px] border border-[#eceef6] bg-[#fbfaff] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#6733f4] shadow-sm">
                    <Icon size={19} />
                  </div>
                  <span className="text-lg font-extrabold text-[#16a34a]">{value}</span>
                </div>
                <div className="mt-4 text-sm font-extrabold text-[#0b1020]">{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </SoftCard>
    </section>
  );
}

function Roadmap() {
  return (
    <SoftCard>
      <CardContent className="p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#070a17]">Suggested Roadmap</h2>
            <p className="mt-1 text-sm font-medium text-[#53607b]">A practical sequence for closing curriculum gaps without overwhelming faculty teams.</p>
          </div>
          <Pill tone="purple">4 semester plan</Pill>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {roadmap.map(([term, title, body], index) => (
            <div key={term} className="relative rounded-[22px] border border-[#eceef6] bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#efe7ff] font-black text-[#6733f4]">{index + 1}</div>
              <div className="text-xs font-bold uppercase text-[#64708b]">{term}</div>
              <h3 className="mt-2 text-base font-extrabold text-[#0b1020]">{title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-[#53607b]">{body}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </SoftCard>
  );
}

export default function CurriculumInt() {
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [selectedFacultySlug, setSelectedFacultySlug] = useState(initialFaculties[0].slug);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(initialFaculties[0].courses[0]?.slug ?? "");

  const selectedFaculty = initialFaculties.find((item) => item.slug === selectedFacultySlug) ?? initialFaculties[0];
  const selectedCourse = selectedFaculty.courses.find((item) => item.slug === selectedCourseSlug) ?? selectedFaculty.courses[0];

  function handleFacultyChange(slug: string) {
    setSelectedFacultySlug(slug);
    const nextFaculty = initialFaculties.find((item) => item.slug === slug);
    setSelectedCourseSlug(nextFaculty?.courses[0]?.slug ?? "");
  }

  function handlePrintReport() {
    setShowExportPanel(false);
    window.setTimeout(() => window.print(), 80);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(103,51,244,0.12),transparent_34%),linear-gradient(180deg,#ffffff_0%,#fbfaff_42%,#ffffff_100%)] text-[#0b1020]">
      <main className="px-4 py-5 transition-[margin-left] duration-300 ease-out xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7">
        <div className="mx-auto flex max-w-[1540px] flex-col gap-5">
          <AnimatedSection>
            <TopBar onExportClick={() => setShowExportPanel(true)} />
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <FacultyCourseSelector
              facultySlug={selectedFacultySlug}
              courseSlug={selectedCourseSlug}
              onFacultyChange={handleFacultyChange}
              onCourseChange={setSelectedCourseSlug}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.16}>
            <AISummary facultyName={selectedFaculty.name} courseName={selectedCourse?.name ?? "programme"} />
          </AnimatedSection>
          <AnimatedSection delay={0.24}><CurriculumComparison /></AnimatedSection>
          <AnimatedSection delay={0.32}><KeyGaps /></AnimatedSection>
          <AnimatedSection delay={0.4}><AIRecommendations /></AnimatedSection>
          <AnimatedSection delay={0.48}><CareerImpact /></AnimatedSection>
          <AnimatedSection delay={0.56}><Roadmap /></AnimatedSection>
        </div>
      </main>

      <PrintableCurriculumReport />

      <AnimatePresence>
        {showExportPanel ? (
          <ExportReportModal onClose={() => setShowExportPanel(false)} onPrint={handlePrintReport} />
        ) : null}
      </AnimatePresence>

      <style>{`
        @media print {
          @page {
            margin: 14mm;
          }

          body * {
            visibility: hidden !important;
          }

          .curriculum-print-sheet,
          .curriculum-print-sheet * {
            visibility: visible !important;
          }

          .curriculum-print-sheet {
            display: block !important;
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            background: white !important;
            color: #081433 !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }

          .curriculum-print-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 24px;
            border-bottom: 2px solid #e5e8f0;
            padding-bottom: 14px;
            margin-bottom: 18px;
          }

          .curriculum-print-kicker {
            margin: 0 0 4px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #6733f4;
          }

          .curriculum-print-header h1 {
            margin: 0;
            font-size: 22px;
          }

          .curriculum-print-header p {
            margin: 4px 0 0;
            font-size: 12px;
            color: #53607b;
          }

          .curriculum-print-score {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 72px;
            padding: 10px 14px;
            border-radius: 14px;
            background: #f0e9ff;
            color: #5b21f3;
          }

          .curriculum-print-score strong {
            font-size: 20px;
          }

          .curriculum-print-score span {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .curriculum-print-card {
            break-inside: avoid;
            margin-bottom: 16px;
          }

          .curriculum-print-card h2 {
            margin: 0 0 8px;
            font-size: 14px;
            border-bottom: 1px solid #e5e8f0;
            padding-bottom: 6px;
          }

          .curriculum-print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .curriculum-print-card h3 {
            margin: 0 0 4px;
            font-size: 12px;
          }

          .curriculum-print-card ul {
            margin: 0;
            padding-left: 16px;
            font-size: 12px;
          }

          .curriculum-print-item {
            margin-bottom: 8px;
          }

          .curriculum-print-item h3 {
            margin: 0;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
          }

          .curriculum-print-item p {
            margin: 2px 0 0;
            font-size: 12px;
            color: #53607b;
          }
        }
      `}</style>
    </div>
  );
}
