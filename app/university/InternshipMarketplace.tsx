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
import { AnimatedCard, AnimatedList, AnimatedRow, AnimatedSection, universityEase, useLockBodyScroll } from "./UniversityMotion";
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

type Posting = {
  slug: string;
  company: string;
  logo: string;
  tier: Tier;
  role: string;
  period: string;
  salary: string;
  suggestedStudents: Student[];
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
      { name: "Ryan Tan", program: "BSc Software Engineering • Year 2", score: 86, skills: ["C++", "Problem Solving", "Git"], highlight: "Shipped a course-project API used by 3 other student teams." },
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
      { name: "Marcus Ong", program: "BSc Computer Science • Year 4", score: 80, skills: ["Web Dev", "Java", "React"], highlight: "Led a 4-person team to build an e-commerce dashboard." },
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
      { name: "Aisyah Humaira", program: "BSc Data Science • Year 3", score: 77, skills: ["Python", "Machine Learning"], highlight: "Published a customer segmentation model in her final project." },
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
      { name: "Chloe Lim", program: "BSc Information Systems • Year 3", score: 78, skills: ["Power BI", "SQL"], highlight: "Built a sales dashboard adopted by her campus career office." },
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
      { name: "Ryan Tan", program: "BSc Software Engineering • Year 2", score: 76, skills: ["Git", "Problem Solving"], highlight: "Shipped a course-project API used by 3 other student teams." },
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
      { name: "Marcus Ong", program: "BSc Computer Science • Year 4", score: 69, skills: ["Web Dev", "Java", "React"], highlight: "Led a 4-person team to build an e-commerce dashboard." },
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

function StatsStrip({ postingsCount, contactsSent }: { postingsCount: number; contactsSent: number }) {
  const stats = [
    { label: "Students in Pool", value: "2,458", icon: Users, bg: "bg-[#f0e9ff]", tone: "text-[#6733f4]" },
    { label: "Live Internships", value: String(postingsCount), icon: Building2, bg: "bg-[#e8f2ff]", tone: "text-[#2563eb]" },
    { label: "Contacts Sent Today", value: String(contactsSent), icon: Mail, bg: "bg-[#ffe3f0]", tone: "text-[#f0185b]" },
    { label: "Avg. Match Score", value: "84%", icon: TrendingUp, bg: "bg-[#e1f7eb]", tone: "text-[#16a34a]" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${stat.bg} ${stat.tone}`}>
              <Icon size={19} strokeWidth={2.4} />
            </div>
            <p className="mt-3 text-2xl font-extrabold leading-none text-[#070a17]">{stat.value}</p>
            <p className="mt-1.5 text-xs font-medium text-[#53607b]">{stat.label}</p>
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
  if (typeof document === "undefined") return null;

  const winner = posting.projectHubWinner;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#0b0f22]/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: universityEase }}
        className="relative z-10 max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-[0_40px_90px_rgba(15,23,42,0.25)]"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-[#46536D] transition hover:bg-[#F7F8FB]"
        >
          <X size={16} />
        </button>

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

        <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-[#53607b]">
          <span className="flex items-center gap-1.5"><Clock size={13} /> {posting.period}</span>
          <span className="flex items-center gap-1.5"><Wallet size={13} /> {posting.salary}</span>
        </div>

        <div className="mt-5 rounded-2xl border border-[#f0e0e9] bg-[linear-gradient(135deg,#fff7fb,#fff)] p-4">
          <div className="flex items-center gap-2 text-[#f0185b]">
            <Trophy size={16} fill="currentColor" />
            <p className="text-[10px] font-black uppercase tracking-normal">Project Hub winner &middot; highly matched</p>
          </div>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[#090d1b]">{winner.name}</p>
              <p className="text-xs font-medium text-[#53607b]">{winner.program}</p>
              <p className="mt-1.5 text-xs leading-5 text-[#53607b]">{winner.highlight}</p>
              <Link
                href={`/university/industry/${winner.projectSlug}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#5b21f3] hover:text-[#4318c9]"
              >
                Won &ldquo;{winner.projectTitle}&rdquo; on Project Hub
                <ArrowUpRight size={13} />
              </Link>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {winner.skills.map((skill) => (
                  <span key={skill} className="rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-[#5b4b8a]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#ffe3f0] px-3 py-1.5 text-xs font-bold text-[#f0185b]">
              <Sparkles size={13} fill="currentColor" />
              {winner.score}% Match
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSendContact(winner.name)}
            disabled={isContacted(winner.name)}
            className={`mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${
              isContacted(winner.name)
                ? "bg-[#e1f7eb] text-[#16a34a]"
                : "bg-[#081433] text-white hover:bg-[#152238]"
            }`}
          >
            {isContacted(winner.name) ? (
              <>
                <Check size={15} />
                Contact sent to {posting.company}
              </>
            ) : (
              <>
                <Mail size={15} />
                Send Contact to Employer
              </>
            )}
          </button>
        </div>

        <div className="mt-5">
          <p className="text-xs font-bold text-[#34415e]">
            {posting.suggestedStudents.length} more students suggested for this role
          </p>
          <div className="mt-2">
            <AnimatedList>
              {posting.suggestedStudents.map((student) => {
                const sent = isContacted(student.name);
                return (
                  <AnimatedRow
                    key={student.name}
                    className="flex items-center justify-between gap-3 border-b border-[#edf0f6] py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#090d1b]">{student.name}</p>
                      <p className="text-xs font-medium text-[#53607b]">{student.program}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full border-2 border-[#e5e8f0] px-2 py-1 text-xs font-bold text-[#34415e]">
                        {student.score}%
                      </span>
                      <button
                        type="button"
                        onClick={() => onSendContact(student.name)}
                        disabled={sent}
                        aria-label={sent ? `Contact sent for ${student.name}` : `Send contact for ${student.name}`}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          sent
                            ? "bg-[#e1f7eb] text-[#16a34a]"
                            : "bg-[#f6f2ff] text-[#5b21f3] hover:bg-[#ece4ff]"
                        }`}
                      >
                        {sent ? <Check size={14} /> : <Mail size={14} />}
                      </button>
                    </div>
                  </AnimatedRow>
                );
              })}
            </AnimatedList>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

export default function InternshipMarketplace() {
  const [postings] = useState<Posting[]>(postingSeed);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [contactedKeys, setContactedKeys] = useState<Set<string>>(new Set());

  const selectedPosting = useMemo(
    () => postings.find((posting) => posting.slug === selectedSlug) ?? null,
    [postings, selectedSlug],
  );

  const contactKey = (slug: string, studentName: string) => `${slug}::${studentName}`;

  const handleSendContact = (slug: string, studentName: string) => {
    setContactedKeys((prev) => new Set(prev).add(contactKey(slug, studentName)));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(240,24,91,0.06),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1200px]">
          <AnimatedSection>
            <TopBar />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-6">
            <StatsStrip postingsCount={postings.length} contactsSent={contactedKeys.size} />
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
    </main>
  );
}
