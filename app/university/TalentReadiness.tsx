"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  Download,
  Folder,
  GraduationCap,
  Heart,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { AnimatedCard, AnimatedList, AnimatedRow, AnimatedSection, universityEase } from "./UniversityMotion";

const stats = [
  { label: "Students", value: "2,458", sub: "Active students", action: "Explore students", icon: GraduationCap, bg: "bg-[#efe7ff]", color: "text-[#6733f4]" },
  { label: "Alumni", value: "8,764", sub: "Verified alumni", action: "Explore alumni", icon: Users, bg: "bg-[#e1f7eb]", color: "text-[#16a34a]" },
  { label: "Top Talent", value: "312", sub: "High potential talent", action: "View top talent", icon: Star, bg: "bg-[#fff0d9]", color: "text-[#f59e0b]" },
  { label: "Active Portfolios", value: "1,126", sub: "Student & alumni portfolios", action: "Browse portfolios", icon: Folder, bg: "bg-[#e7f0ff]", color: "text-[#2563eb]" },
  { label: "Hiring Interest", value: "24", sub: "Employers looking now", action: "View opportunities", icon: Heart, bg: "bg-[#ffe3f1]", color: "text-[#f0185b]" },
];

const talentTabs = [
  { label: "Overview", view: "overview", href: "/university/talent" },
  { label: "Students", view: "students", href: "/university/talent?view=students" },
  { label: "Alumni", view: "alumni", href: "/university/talent?view=alumni" },
] as const;

type TalentView = (typeof talentTabs)[number]["view"];

const students = [
  ["Chloe Lim", "BSc Information Systems", "Year 3", "92/100", ["Data Analysis", "Power BI", "SQL"]],
  ["Marcus Ong", "BSc Computer Science", "Year 4", "90/100", ["Web Dev", "Java", "React"]],
  ["Aisyah Humaira", "BSc Data Science", "Year 3", "88/100", ["Python", "Machine Learning", "Excel"]],
  ["Ryan Tan", "BSc Software Engineering", "Year 2", "86/100", ["C++", "Problem Solving", "Git"]],
  ["Nur Alya", "BSc Cyber Security", "Year 3", "85/100", ["Network Security", "Python", "Linux"]],
];

const alumni = [
  ["Daniel Wong", "BSc Computer Science", "Class of 2021", "Data Engineer at Grab", ["Data Engineering", "ETL", "Python"]],
  ["Sarah Lim", "BSc Information Systems", "Class of 2020", "Product Analyst at Shopee", ["Product Analytics", "SQL", "Power BI"]],
  ["Adrian Chong", "BSc Software Engineering", "Class of 2019", "Software Engineer at Microsoft", ["Azure", "C#", ".NET"]],
  ["Jia Wen", "BSc Data Science", "Class of 2022", "Data Scientist at Maybank", ["Machine Learning", "Python", "Statistics"]],
  ["Melissa Teo", "BSc Cyber Security", "Class of 2021", "Security Analyst at Petronas", ["Cyber Security", "SIEM", "Python"]],
];

const updates = [
  ["Marcus Ong updated project", "E-commerce Dashboard", "2h ago", LineChart],
  ["Aisyah Humaira added new case study", "Customer Segmentation ML Model", "5h ago", Sparkles],
  ["Ryan Tan uploaded new certification", "AWS Solutions Architect", "1d ago", ShieldCheck],
  ["Daniel Wong updated portfolio", "Added 3 new projects", "2d ago", Folder],
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={className}>{children}</AnimatedCard>;
}


function TopBar() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-[#6733f4]">
            <Users size={27} />
          </span>
          <h1 className="text-3xl font-extrabold tracking-normal text-[#070a17] md:text-[34px]">Talent Readiness</h1>
        </div>
        <p className="mt-4 text-sm font-medium text-[#53607b]">
          Discover and connect with outstanding students and alumni talent.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
        <label className="flex h-11 min-w-[360px] items-center gap-3 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-medium text-[#65718d] shadow-sm">
          <Search size={16} />
          Search students, alumni, skills, or projects...
        </label>
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
        <button className="flex h-10 items-center gap-2 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-bold text-[#34415e] shadow-sm">
          <Download size={15} />
          Export Directory
        </button>
      </div>
    </header>
  );
}

function StatCards({ activeView, onTabChange }: { activeView: TalentView; onTabChange: (view: TalentView) => void }) {
  return (
    <Card className="p-4">
      <div className="mb-4 flex gap-8 border-b border-[#edf0f6] text-xs font-bold text-[#53607b]">
        {talentTabs.map((tab) => (
          <Link
            key={tab.view}
            href={tab.href}
            onClick={(event) => {
              event.preventDefault();
              window.history.pushState(null, "", tab.href);
              onTabChange(tab.view);
            }}
            className={`pb-3 ${activeView === tab.view ? "border-b-2 border-[#6733f4] text-[#5b21f3]" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-[#edf0f6] bg-[linear-gradient(135deg,#fff,rgba(250,247,255,0.85))] p-4">
              <span className={`flex h-11 w-11 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
                <Icon size={22} />
              </span>
              <p className="mt-3 text-xs font-bold text-[#34415e]">{stat.label}</p>
              <p className="mt-1 text-2xl font-extrabold">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-[#53607b]">{stat.sub}</p>
              <button className={`mt-4 flex items-center gap-2 text-xs font-bold ${stat.color}`}>{stat.action} <ArrowRight size={14} /></button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PersonRow({ person, alumni = false }: { person: string[]; alumni?: boolean }) {
  const [name, program, year, score, tagsRaw] = person;
  const tags = tagsRaw as unknown as string[];
  return (
    <AnimatedRow className="grid grid-cols-[44px_1fr_auto_auto] items-center gap-4 border-b border-[#edf0f6] py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f2ff] text-sm font-black text-[#34415e]">{name[0]}</div>
      <div>
        <p className="text-sm font-extrabold text-[#090d1b]">{name}</p>
        <p className="mt-0.5 text-xs font-medium text-[#53607b]">{program} • {year}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {tags.map((tag) => <span key={tag} className="rounded-lg bg-[#f3efff] px-2 py-0.5 text-[10px] font-semibold text-[#5b4b8a]">{tag}</span>)}
        </div>
      </div>
      {alumni ? null : <span className="rounded-full border-2 border-[#22c55e] px-2 py-1 text-xs font-bold text-[#16a34a]">{score}</span>}
      <Link href="/university/talent/profile" className="rounded-lg bg-[#f6f2ff] px-3 py-2 text-xs font-bold text-[#5b21f3]">View Profile</Link>
    </AnimatedRow>
  );
}

function TalentLists({ onNavigate }: { onNavigate: (view: TalentView) => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr_350px]">
      <Card className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold">Discover Top Students</h2>
            <p className="text-xs font-medium text-[#53607b]">High potential students based on skills, performance and impact.</p>
          </div>
          <button
            onClick={() => onNavigate("students")}
            className="flex items-center gap-2 text-xs font-bold text-[#5b21f3]"
          >
            View all students <ArrowRight size={14} />
          </button>
        </div>
        <AnimatedList>
          {students.map((student) => <PersonRow key={student[0] as string} person={student as unknown as string[]} />)}
        </AnimatedList>
        <button
          onClick={() => onNavigate("students")}
          className="mt-3 h-9 w-full rounded-xl bg-[#f8f5ff] text-xs font-bold text-[#5b21f3]"
        >
          Explore all students
        </button>
      </Card>

      <Card className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold">Discover Alumni Talent</h2>
            <p className="text-xs font-medium text-[#53607b]">Connect with accomplished alumni making an impact.</p>
          </div>
          <button
            onClick={() => onNavigate("alumni")}
            className="flex items-center gap-2 text-xs font-bold text-[#5b21f3]"
          >
            View all alumni <ArrowRight size={14} />
          </button>
        </div>
        <AnimatedList>
          {alumni.map((person) => <PersonRow key={person[0] as string} person={person as unknown as string[]} alumni />)}
        </AnimatedList>
        <button
          onClick={() => onNavigate("alumni")}
          className="mt-3 h-9 w-full rounded-xl bg-[#f8f5ff] text-xs font-bold text-[#5b21f3]"
        >
          Explore all alumni
        </button>
      </Card>

      <div className="space-y-4">
        <Card className="p-4">
          <h2 className="text-lg font-extrabold">Talent Spotlight</h2>
          <p className="mt-1 text-xs font-medium text-[#53607b]">Featured student portfolio</p>
          <div className="mt-4 rounded-2xl bg-[linear-gradient(135deg,#ede7ff,#fff)] p-4">
            <div className="h-32 rounded-xl bg-[linear-gradient(135deg,#172039,#6d5df6_55%,#f6e9ff)]" />
            <h3 className="mt-4 text-base font-extrabold">Chloe Lim</h3>
            <p className="mt-1 text-xs font-bold text-[#34415e]">Data Analyst & BI Enthusiast</p>
            <p className="mt-2 text-xs leading-5 text-[#53607b]">Passionate about turning data into insights that drive business decisions.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Power BI", "SQL", "Excel", "Python"].map((tag) => <span key={tag} className="rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-[#5b4b8a]">{tag}</span>)}
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Recent Portfolio Updates</h2>
            <button className="text-xs font-bold text-[#5b21f3]">View all</button>
          </div>
          <div className="mt-3 space-y-3">
            <AnimatedList className="space-y-3">
              {updates.map(([title, body, time, Icon]) => (
              <AnimatedRow key={title as string} className="grid grid-cols-[32px_1fr_auto] gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f2ff] text-xs font-black">{String(title)[0]}</div>
                <div>
                  <p className="text-xs font-bold">{title as string}</p>
                  <p className="text-[10px] font-medium text-[#53607b]">{body as string}</p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[10px] text-[#65718d]">
                  <span>{time as string}</span>
                  <Icon size={15} className="text-[#6733f4]" />
                </div>
              </AnimatedRow>
            ))}
            </AnimatedList>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StudentsView() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">Students Directory</h2>
            <p className="mt-1 text-xs font-medium text-[#53607b]">Browse high-potential active students and readiness scores.</p>
          </div>
          <button className="rounded-xl bg-[#6733f4] px-4 py-2 text-xs font-bold text-white">Export Students</button>
        </div>
        <div className="mt-5 grid gap-3">
          <AnimatedList>
            {students.map((student) => <PersonRow key={student[0] as string} person={student as unknown as string[]} />)}
          </AnimatedList>
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="text-lg font-extrabold">Student Filters</h2>
        <div className="mt-4 space-y-3">
          {["Program: All", "Year: All", "Readiness: High", "Skills: Data"].map((filter) => (
            <button key={filter} className="flex h-10 w-full items-center justify-between rounded-xl border border-[#e3e6ef] bg-white px-3 text-xs font-semibold text-[#18213a]">
              {filter}
              <ChevronDown size={14} />
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-[#f6f2ff] p-4">
          <p className="text-sm font-extrabold text-[#5b21f3]">Top readiness signal</p>
          <p className="mt-2 text-xs leading-5 text-[#53607b]">Data analytics, dashboarding, and Python are the strongest student clusters this month.</p>
        </div>
      </Card>
    </div>
  );
}

function AlumniView() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">Alumni Directory</h2>
            <p className="mt-1 text-xs font-medium text-[#53607b]">Connect with verified alumni mentors and industry talent.</p>
          </div>
          <button className="rounded-xl bg-[#6733f4] px-4 py-2 text-xs font-bold text-white">Invite Alumni</button>
        </div>
        <div className="mt-5 grid gap-3">
          <AnimatedList>
            {alumni.map((person) => <PersonRow key={person[0] as string} person={person as unknown as string[]} alumni />)}
          </AnimatedList>
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="text-lg font-extrabold">Alumni Segments</h2>
        <div className="mt-4 space-y-3">
          {["Data & AI Alumni", "Software Engineers", "Product Analysts", "Cybersecurity"].map((segment, index) => (
            <div key={segment} className="flex items-center justify-between rounded-xl border border-[#edf0f6] p-3">
              <span className="text-xs font-bold">{segment}</span>
              <span className="rounded-full bg-[#f3efff] px-2 py-1 text-[10px] font-bold text-[#5b21f3]">{64 - index * 9}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ViewContent({
  activeView,
  onNavigate,
}: {
  activeView: TalentView;
  onNavigate: (view: TalentView) => void;
}) {
  if (activeView === "students") return <StudentsView />;
  if (activeView === "alumni") return <AlumniView />;

  return (
    <>
      <TalentLists onNavigate={onNavigate} />
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4"><Sparkles className="text-[#6733f4]" /><div><h3 className="font-extrabold">Looking for specific talent?</h3><p className="text-xs text-[#53607b]">Post an opportunity or project and let students and alumni find you.</p></div></div>
          <button className="rounded-xl border border-[#b99cff] px-5 py-2 text-xs font-bold text-[#5b21f3]">Post Opportunity</button>
        </Card>
        <Card className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4"><Users className="text-[#6733f4]" /><div><h3 className="font-extrabold">Want to collaborate with faculty?</h3><p className="text-xs text-[#53607b]">Work with academic advisors to identify and nurture top talent.</p></div></div>
          <button className="rounded-xl border border-[#b99cff] px-5 py-2 text-xs font-bold text-[#5b21f3]">Connect with Faculty</button>
        </Card>
      </div>
    </>
  );
}

export default function TalentReadiness({ view }: { view?: string }) {
  const initialView = talentTabs.some((tab) => tab.view === view) ? (view as TalentView) : "overview";
  const [activeView, setActiveView] = useState<TalentView>(initialView);

  const navigateToView = (nextView: TalentView) => {
    const tab = talentTabs.find((item) => item.view === nextView);
    if (tab) window.history.pushState(null, "", tab.href);
    setActiveView(nextView);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(111,66,255,0.07),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1480px]">
          <AnimatedSection>
            <TopBar />
          </AnimatedSection>
          <AnimatedSection delay={0.08} className="mt-5">
            <StatCards activeView={activeView} onTabChange={navigateToView} />
          </AnimatedSection>
          <AnimatedSection delay={0.16} className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: universityEase }}
              >
                <ViewContent activeView={activeView} onNavigate={navigateToView} />
              </motion.div>
            </AnimatePresence>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
