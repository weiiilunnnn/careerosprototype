"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  ChevronDown,
  Clock,
  Crown,
  Mail,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AnimatedCard, AnimatedSection, universityEase, useLockBodyScroll } from "./UniversityMotion";
import { ProjectLogo, projects } from "./industryData";

type Tier = "Silver" | "Gold" | "Platinum";

const tierTone: Record<Tier, string> = {
  Silver: "bg-[#eef0f4] text-[#53607b]",
  Gold: "bg-[#fff2d9] text-[#b7791f]",
  Platinum: "bg-[#f0e9ff] text-[#5b21f3]",
};

type Student = {
  name: string;
  program: string;
  score: number;
  skills: string[];
  highlight: string;
};

type Candidate = Student & {
  projectTitle?: string;
  projectSlug?: string;
  projectCompany?: string;
  isTopMatch?: boolean;
};

type Posting = {
  slug: string;
  company: string;
  logo: string;
  tier: Tier;
  role: string;
  period: string;
  salary: string;
  suggestedStudents: Candidate[];
  projectHubWinner: Student & { projectTitle: string; projectSlug: string };
};

function findProject(company: string) {
  return projects.find((project) => project.company === company);
}

const postingSeed: Posting[] = [
  {
    slug: "microsoft-swe-intern",
    company: "Microsoft",
    logo: "microsoft",
    tier: "Platinum",
    role: "Software Engineer Intern",
    period: "12 weeks · Jun - Aug 2026",
    salary: "RM 1,500 - RM 2,500 / mo",
    suggestedStudents: [
      {
        name: "Ryan Tan",
        program: "BSc Software Engineering • Year 2",
        score: 86,
        skills: ["C++", "Problem Solving", "Git"],
        highlight: "Shipped a course-project API used by 3 other student teams.",
        projectTitle: findProject("Grab")?.title,
        projectSlug: findProject("Grab")?.slug,
        projectCompany: "Grab",
      },
      { name: "Aisyah Humaira", program: "BSc Data Science • Year 3", score: 79, skills: ["Python", "Machine Learning"], highlight: "Published a customer segmentation model in her final project." },
      { name: "Nur Alya", program: "BSc Cyber Security • Year 3", score: 74, skills: ["Network Security", "Python"], highlight: "Ran a mock incident-response drill for a student hackathon." },
    ],
    projectHubWinner: {
      name: "Marcus Ong",
      program: "BSc Computer Science • Year 4",
      score: 92,
      skills: ["Web Dev", "Java", "React"],
      highlight: "Led a 4-person team to build an e-commerce dashboard.",
      projectTitle: findProject("Microsoft")?.title ?? "AI Dashboard Challenge",
      projectSlug: findProject("Microsoft")?.slug ?? "microsoft",
    },
  },
  {
    slug: "shopee-data-analyst-intern",
    company: "Shopee",
    logo: "shopee",
    tier: "Gold",
    role: "Data Analyst Intern",
    period: "10 weeks · Jul - Sep 2026",
    salary: "RM 1,500 - RM 2,500 / mo",
    suggestedStudents: [
      {
        name: "Marcus Ong",
        program: "BSc Computer Science • Year 4",
        score: 80,
        skills: ["Web Dev", "Java", "React"],
        highlight: "Led a 4-person team to build an e-commerce dashboard.",
        projectTitle: findProject("Microsoft")?.title,
        projectSlug: findProject("Microsoft")?.slug,
        projectCompany: "Microsoft",
      },
      { name: "Ryan Tan", program: "BSc Software Engineering • Year 2", score: 75, skills: ["C++", "Problem Solving"], highlight: "Shipped a course-project API used by 3 other student teams." },
    ],
    projectHubWinner: {
      name: "Chloe Lim",
      program: "BSc Information Systems • Year 3",
      score: 91,
      skills: ["Power BI", "SQL", "Data Storytelling"],
      highlight: "Built a sales dashboard adopted by her campus career office.",
      projectTitle: findProject("Shopee")?.title ?? "E-commerce Analytics Project",
      projectSlug: findProject("Shopee")?.slug ?? "shopee",
    },
  },
  {
    slug: "grab-swe-intern",
    company: "Grab",
    logo: "grab",
    tier: "Platinum",
    role: "Software Engineer Intern",
    period: "10 weeks · Jul - Sep 2026",
    salary: "RM 1,500 - RM 2,500 / mo",
    suggestedStudents: [
      { name: "Marcus Ong", program: "BSc Computer Science • Year 4", score: 83, skills: ["Web Dev", "Java", "React"], highlight: "Led a 4-person team to build an e-commerce dashboard." },
      {
        name: "Aisyah Humaira",
        program: "BSc Data Science • Year 3",
        score: 77,
        skills: ["Python", "Machine Learning"],
        highlight: "Published a customer segmentation model in her final project.",
        projectTitle: findProject("Petronas")?.title,
        projectSlug: findProject("Petronas")?.slug,
        projectCompany: "Petronas",
      },
      { name: "Nur Alya", program: "BSc Cyber Security • Year 3", score: 72, skills: ["Network Security", "Python"], highlight: "Ran a mock incident-response drill for a student hackathon." },
    ],
    projectHubWinner: {
      name: "Ryan Tan",
      program: "BSc Software Engineering • Year 2",
      score: 88,
      skills: ["Java", "Git", "Problem Solving"],
      highlight: "Shipped a course-project API used by 3 other student teams.",
      projectTitle: findProject("Grab")?.title ?? "Mobility Trends Forecasting",
      projectSlug: findProject("Grab")?.slug ?? "grab",
    },
  },
  {
    slug: "petronas-data-scientist-intern",
    company: "Petronas",
    logo: "petronas",
    tier: "Gold",
    role: "Data Scientist Intern",
    period: "12 weeks · Aug - Oct 2026",
    salary: "RM 1,500 - RM 2,500 / mo",
    suggestedStudents: [
      {
        name: "Chloe Lim",
        program: "BSc Information Systems • Year 3",
        score: 78,
        skills: ["Power BI", "SQL"],
        highlight: "Built a sales dashboard adopted by her campus career office.",
        projectTitle: findProject("Shopee")?.title,
        projectSlug: findProject("Shopee")?.slug,
        projectCompany: "Shopee",
      },
      { name: "Nur Alya", program: "BSc Cyber Security • Year 3", score: 71, skills: ["Network Security", "Python"], highlight: "Ran a mock incident-response drill for a student hackathon." },
    ],
    projectHubWinner: {
      name: "Aisyah Humaira",
      program: "BSc Data Science • Year 3",
      score: 85,
      skills: ["Python", "Machine Learning", "Excel"],
      highlight: "Published a customer segmentation model in her final project.",
      projectTitle: findProject("Petronas")?.title ?? "Sustainability Data Analysis",
      projectSlug: findProject("Petronas")?.slug ?? "petronas",
    },
  },
  {
    slug: "maybank-cybersecurity-intern",
    company: "Maybank",
    logo: "maybank",
    tier: "Silver",
    role: "Cybersecurity Intern",
    period: "8 weeks · Sep - Oct 2026",
    salary: "RM 1,500 - RM 2,500 / mo",
    suggestedStudents: [
      {
        name: "Ryan Tan",
        program: "BSc Software Engineering • Year 2",
        score: 76,
        skills: ["Git", "Problem Solving"],
        highlight: "Shipped a course-project API used by 3 other student teams.",
        projectTitle: findProject("Grab")?.title,
        projectSlug: findProject("Grab")?.slug,
        projectCompany: "Grab",
      },
      { name: "Aisyah Humaira", program: "BSc Data Science • Year 3", score: 70, skills: ["Python", "Machine Learning"], highlight: "Published a customer segmentation model in her final project." },
    ],
    projectHubWinner: {
      name: "Nur Alya",
      program: "BSc Cyber Security • Year 3",
      score: 83,
      skills: ["Network Security", "Python", "Linux"],
      highlight: "Ran a mock incident-response drill for a student hackathon.",
      projectTitle: findProject("Maybank")?.title ?? "Customer Insights Dashboard",
      projectSlug: findProject("Maybank")?.slug ?? "maybank",
    },
  },
  {
    slug: "airasia-data-engineering-intern",
    company: "AirAsia",
    logo: "airasia",
    tier: "Silver",
    role: "Data Engineering Intern",
    period: "10 weeks · Ongoing intake",
    salary: "RM 1,500 - RM 2,500 / mo",
    suggestedStudents: [
      { name: "Aisyah Humaira", program: "BSc Data Science • Year 3", score: 74, skills: ["Python", "Machine Learning"], highlight: "Published a customer segmentation model in her final project." },
      {
        name: "Marcus Ong",
        program: "BSc Computer Science • Year 4",
        score: 69,
        skills: ["Web Dev", "Java", "React"],
        highlight: "Led a 4-person team to build an e-commerce dashboard.",
        projectTitle: findProject("Microsoft")?.title,
        projectSlug: findProject("Microsoft")?.slug,
        projectCompany: "Microsoft",
      },
    ],
    projectHubWinner: {
      name: "Daniel Wong",
      program: "BSc Computer Science • Class of 2021",
      score: 87,
      skills: ["Data Engineering", "ETL", "Python"],
      highlight: "Already building pipelines professionally at Grab.",
      projectTitle: findProject("AirAsia")?.title ?? "Flight Data Optimization",
      projectSlug: findProject("AirAsia")?.slug ?? "airasia",
    },
  },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={className}>{children}</AnimatedCard>;
}

function TopBar() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffe3f0] text-[#f0185b]">
            <Building2 size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-normal text-[#070a17] md:text-[28px]">
              Live Internship Marketplace
            </h1>
            <p className="mt-1 text-xs font-medium text-[#53607b]">
              Companies inviting your university to fill open internship positions.
            </p>
          </div>
        </div>
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
      </div>
    </header>
  );
}

function StatsStrip({
  postingsCount,
  contactsSent,
  onOpenContacts,
}: {
  postingsCount: number;
  contactsSent: number;
  onOpenContacts: () => void;
}) {
  const stats = [
    { label: "Students in Pool", value: "2,458", icon: Users, bg: "bg-[#f0e9ff]", tone: "text-[#6733f4]" },
    { label: "Live Internships", value: String(postingsCount), icon: Building2, bg: "bg-[#e8f2ff]", tone: "text-[#2563eb]" },
    { label: "Contacts Sent Today", value: String(contactsSent), icon: Mail, bg: "bg-[#ffe3f0]", tone: "text-[#f0185b]", onClick: onOpenContacts },
    { label: "Avg. Match Score", value: "84%", icon: TrendingUp, bg: "bg-[#e1f7eb]", tone: "text-[#16a34a]" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const content = (
          <>
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${stat.bg} ${stat.tone}`}>
              <Icon size={19} strokeWidth={2.4} />
            </div>
            <p className="mt-3 text-2xl font-extrabold leading-none text-[#070a17]">{stat.value}</p>
            <p className="mt-1.5 text-xs font-medium text-[#53607b]">{stat.label}</p>
          </>
        );

        if (stat.onClick) {
          return (
            <Card key={stat.label} className="p-0">
              <button
                type="button"
                onClick={stat.onClick}
                className="flex w-full flex-col items-start rounded-2xl p-4 text-left transition hover:bg-[#faf7ff]"
              >
                {content}
              </button>
            </Card>
          );
        }

        return (
          <Card key={stat.label} className="p-4">
            {content}
          </Card>
        );
      })}
    </div>
  );
}

function PostingCard({ posting, onOpen }: { posting: Posting; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col rounded-2xl border border-[#e7e8f0] bg-white p-4 text-left shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]"
    >
      <div className="flex items-center justify-between gap-3">
        <ProjectLogo type={posting.logo} />
        <span className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${tierTone[posting.tier]}`}>
          <Crown size={11} />
          {posting.tier}
        </span>
      </div>
      <p className="mt-3 text-sm font-extrabold text-[#090d1b]">{posting.company}</p>
      <p className="mt-0.5 text-xs font-bold text-[#5b21f3]">{posting.role}</p>

      <div className="mt-3 space-y-1.5 text-[11px] font-medium text-[#53607b]">
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          {posting.period}
        </div>
        <div className="flex items-center gap-1.5">
          <Wallet size={12} />
          {posting.salary}
        </div>
      </div>

      <span className="mt-4 flex items-center gap-1 text-xs font-bold text-[#5b21f3]">
        View matches
        <ArrowUpRight size={13} />
      </span>
    </button>
  );
}

function CandidateCard({
  candidate,
  isSent,
  onSend,
  onDecline,
}: {
  candidate: Candidate;
  isSent: boolean;
  onSend: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-[20px] border border-[#f0e0e9] bg-[linear-gradient(135deg,#fff7fb,#fff)] p-4 shadow-[0_30px_70px_rgba(15,23,42,0.16)]">
      {candidate.isTopMatch ? (
        <div className="flex items-center gap-2 text-[#f0185b]">
          <Trophy size={15} fill="currentColor" />
          <p className="text-[10px] font-black uppercase tracking-normal">Project Hub winner &middot; highly matched</p>
        </div>
      ) : null}
      <div className={`flex items-start justify-between gap-3 ${candidate.isTopMatch ? "mt-3" : ""}`}>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[#090d1b]">{candidate.name}</p>
          <p className="text-xs font-medium text-[#53607b]">{candidate.program}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#ffe3f0] px-3 py-1.5 text-xs font-bold text-[#f0185b]">
          <Sparkles size={13} fill="currentColor" />
          {candidate.score}% Match
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-[#53607b]">{candidate.highlight}</p>

      {candidate.projectTitle ? (
        <Link
          href={`/university/industry/${candidate.projectSlug}`}
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#5b21f3] hover:text-[#4318c9]"
        >
          {candidate.isTopMatch
            ? `Won “${candidate.projectTitle}” on Project Hub`
            : `Also won “${candidate.projectTitle}”${candidate.projectCompany ? ` at ${candidate.projectCompany}` : ""} on Project Hub`}
          <ArrowUpRight size={13} />
        </Link>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-1.5">
        {candidate.skills.map((skill) => (
          <span key={skill} className="rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-[#5b4b8a]">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto flex gap-2 pt-4">
        <button
          type="button"
          onClick={onDecline}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5e8f0] bg-white text-sm font-bold text-[#53607b] transition hover:bg-[#faf7ff]"
        >
          <X size={15} />
          Decline
        </button>
        <button
          type="button"
          onClick={onSend}
          className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${
            isSent ? "bg-[#e1f7eb] text-[#16a34a] hover:bg-[#d3f0de]" : "bg-[#081433] text-white hover:bg-[#152238]"
          }`}
        >
          {isSent ? (
            <>
              <Check size={15} />
              Sent &middot; Next
            </>
          ) : (
            <>
              <Mail size={15} />
              Send to Employer
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function CandidateStack({
  candidates,
  isContacted,
  onSendContact,
}: {
  candidates: Candidate[];
  isContacted: (studentName: string) => boolean;
  onSendContact: (studentName: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [exitX, setExitX] = useState(0);

  const current = candidates[index];
  const hasNext = index + 1 < candidates.length;

  function advance(direction: "decline" | "send") {
    setExitX(direction === "decline" ? -280 : 280);
    setIndex((value) => Math.min(value + 1, candidates.length));
  }

  if (!current) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#e0e3ee] bg-white p-6 text-center shadow-[0_30px_70px_rgba(15,23,42,0.16)]">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e1f7eb] text-[#16a34a]">
          <Check size={20} />
        </span>
        <p className="mt-3 text-sm font-extrabold text-[#090d1b]">All caught up</p>
        <p className="mt-1 text-xs text-[#53607b]">You&apos;ve reviewed every suggested match for this role.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-[400px]">
        {hasNext ? (
          <div
            aria-hidden="true"
            className="absolute inset-x-3 top-3 h-full rounded-[20px] border border-[#f0e0e9] bg-white/70"
          />
        ) : null}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.name}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: exitX, transition: { duration: 0.2, ease: "easeOut" } }}
            transition={{ duration: 0.22, ease: universityEase }}
            className="relative h-full"
          >
            <CandidateCard
              candidate={current}
              isSent={isContacted(current.name)}
              onDecline={() => advance("decline")}
              onSend={() => {
                onSendContact(current.name);
                advance("send");
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-3 text-center text-[11px] font-semibold text-[#8a94ab]">
        {Math.min(index + 1, candidates.length)} of {candidates.length} suggested matches
      </p>
    </div>
  );
}

function PostingDetailModal({
  posting,
  isContacted,
  onClose,
  onSendContact,
}: {
  posting: Posting;
  isContacted: (studentName: string) => boolean;
  onClose: () => void;
  onSendContact: (studentName: string) => void;
}) {
  useLockBodyScroll();

  const candidates: Candidate[] = [
    { ...posting.projectHubWinner, isTopMatch: true },
    ...posting.suggestedStudents,
  ];

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#0b0f22]/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: universityEase }}
        className="relative z-10 w-full max-w-4xl p-2"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-0 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#46536D] shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition hover:bg-[#F7F8FB] md:hidden"
        >
          <X size={16} />
        </button>

        <div className="relative grid gap-8 pt-12 md:grid-cols-2 md:gap-12 md:pt-2">
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
            <span className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#f0185b] text-white shadow-[0_10px_26px_rgba(240,24,91,0.35)]">
              <Sparkles size={20} fill="currentColor" />
            </span>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute -bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center justify-center rounded-full bg-[#0b1020] text-white shadow-[0_10px_22px_rgba(11,16,32,0.35)] transition hover:bg-[#1b2540] md:flex h-9 w-9"
          >
            <X size={16} />
          </button>

          <div className="flex h-[400px] flex-col rounded-[22px] border border-[#eceef6] bg-white p-5 shadow-[0_30px_70px_rgba(15,23,42,0.16)]">
            <div className="flex items-center gap-3">
              <ProjectLogo type={posting.logo} />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-extrabold text-[#090d1b]">{posting.company}</p>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${tierTone[posting.tier]}`}>
                    <Crown size={10} />
                    {posting.tier}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#5b21f3]">{posting.role}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs font-medium text-[#53607b]">
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {posting.period}
              </span>
              <span className="flex items-center gap-1.5">
                <Wallet size={13} /> {posting.salary}
              </span>
            </div>

            <p className="mt-4 text-xs leading-6 text-[#53607b]">
              {posting.company} is inviting your university&apos;s top talent to apply directly for this{" "}
              {posting.role.toLowerCase()} placement, based on live hiring demand and skill fit.
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-[#34415e] md:hidden">Suggested student matches</p>
            <CandidateStack candidates={candidates} isContacted={isContacted} onSendContact={onSendContact} />
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

type SentEntry = {
  posting: Posting;
  student: Candidate;
};

function ContactsSentModal({ entries, onClose }: { entries: SentEntry[]; onClose: () => void }) {
  useLockBodyScroll();
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#0b0f22]/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: universityEase }}
        className="relative z-10 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white p-6 shadow-[0_40px_90px_rgba(15,23,42,0.25)] md:p-7"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-[#46536D] transition hover:bg-[#F7F8FB]"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 text-[#f0185b]">
          <Mail size={16} />
          <p className="text-[10px] font-black uppercase tracking-normal">Contacts sent today</p>
        </div>
        <h2 className="mt-2 text-xl font-extrabold text-[#070a17]">
          {entries.length} contact{entries.length === 1 ? "" : "s"} sent to employers
        </h2>

        {entries.length === 0 ? (
          <p className="mt-6 text-sm font-medium text-[#53607b]">
            No contacts sent yet. Open a posting and send a match to get started.
          </p>
        ) : (
          <div className="mt-5 space-y-2.5">
            {entries.map(({ posting, student }) => (
              <div
                key={`${posting.slug}::${student.name}`}
                className="flex items-center gap-3 rounded-2xl border border-[#eceef6] bg-[#faf9fc] p-3"
              >
                <ProjectLogo type={posting.logo} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-[#090d1b]">{student.name}</p>
                  <p className="text-xs font-medium text-[#53607b]">{student.program}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-bold text-[#5b21f3]">{posting.company}</p>
                  <p className="text-[11px] font-medium text-[#53607b]">{posting.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>,
    document.body,
  );
}

export default function InternshipMarketplace() {
  const [postings] = useState<Posting[]>(postingSeed);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [contactedKeys, setContactedKeys] = useState<Set<string>>(new Set());
  const [isContactsOpen, setIsContactsOpen] = useState(false);

  const selectedPosting = useMemo(
    () => postings.find((posting) => posting.slug === selectedSlug) ?? null,
    [postings, selectedSlug],
  );

  const contactKey = (slug: string, studentName: string) => `${slug}::${studentName}`;

  const handleSendContact = (slug: string, studentName: string) => {
    setContactedKeys((prev) => new Set(prev).add(contactKey(slug, studentName)));
  };

  const sentEntries = useMemo<SentEntry[]>(() => {
    return Array.from(contactedKeys)
      .map((key) => {
        const [slug, studentName] = key.split("::");
        const posting = postings.find((item) => item.slug === slug);
        if (!posting) return null;
        const candidates: Candidate[] = [posting.projectHubWinner, ...posting.suggestedStudents];
        const student = candidates.find((item) => item.name === studentName);
        if (!student) return null;
        return { posting, student };
      })
      .filter((entry): entry is SentEntry => entry !== null);
  }, [contactedKeys, postings]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(240,24,91,0.06),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1200px]">
          <AnimatedSection>
            <TopBar />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-6">
            <StatsStrip
              postingsCount={postings.length}
              contactsSent={contactedKeys.size}
              onOpenContacts={() => setIsContactsOpen(true)}
            />
          </AnimatedSection>

          <div className="my-6 h-px w-full bg-[#e7e8f0]" />

          <AnimatedSection delay={0.16}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {postings.map((posting) => (
                <PostingCard key={posting.slug} posting={posting} onOpen={() => setSelectedSlug(posting.slug)} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      <AnimatePresence>
        {selectedPosting ? (
          <PostingDetailModal
            posting={selectedPosting}
            isContacted={(studentName) => contactedKeys.has(contactKey(selectedPosting.slug, studentName))}
            onClose={() => setSelectedSlug(null)}
            onSendContact={(studentName) => handleSendContact(selectedPosting.slug, studentName)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isContactsOpen ? (
          <ContactsSentModal entries={sentEntries} onClose={() => setIsContactsOpen(false)} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
