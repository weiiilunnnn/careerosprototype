"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  ChevronDown,
  Heart,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatedCard, AnimatedList, AnimatedRow, AnimatedSection, universityEase } from "./UniversityMotion";
import { ProjectLogo } from "./industryData";

type QueueItem = {
  id: string;
  student: {
    name: string;
    program: string;
    growingInto: string;
    skills: string[];
    highlight: string;
  };
  internship: {
    company: string;
    role: string;
    lookingFor: string;
    culture: string[];
    slug: string;
    logo: string;
  };
  score: number;
};

const queueSeed: QueueItem[] = [
  {
    id: "chloe-shopee",
    student: {
      name: "Chloe Lim",
      program: "BSc Information Systems • Year 3",
      growingInto: "BI & Analytics",
      skills: ["Power BI", "SQL", "Data Storytelling"],
      highlight: "Built a sales dashboard adopted by her campus career office.",
    },
    internship: {
      company: "Shopee",
      role: "Data Analyst Intern",
      lookingFor: "Someone who can turn messy commerce data into a clear story",
      culture: ["Fast-paced", "Data-driven", "Mentorship"],
      slug: "shopee",
      logo: "shopee",
    },
    score: 91,
  },
  {
    id: "ryan-grab",
    student: {
      name: "Ryan Tan",
      program: "BSc Software Engineering • Year 2",
      growingInto: "Backend Engineer",
      skills: ["Java", "Git", "Problem Solving"],
      highlight: "Shipped a course-project API used by 3 other student teams.",
    },
    internship: {
      company: "Grab",
      role: "Software Engineer Intern",
      lookingFor: "A builder who's comfortable owning a service end-to-end",
      culture: ["Ownership", "Scale", "Pair programming"],
      slug: "grab",
      logo: "grab",
    },
    score: 88,
  },
  {
    id: "aisyah-petronas",
    student: {
      name: "Aisyah Humaira",
      program: "BSc Data Science • Year 3",
      growingInto: "ML Engineer",
      skills: ["Python", "Machine Learning", "Excel"],
      highlight: "Published a customer segmentation model in her final project.",
    },
    internship: {
      company: "Petronas",
      role: "Data Scientist Intern",
      lookingFor: "Someone curious about applying ML to real sustainability data",
      culture: ["Research-driven", "Cross-functional", "ESG-focused"],
      slug: "petronas",
      logo: "petronas",
    },
    score: 85,
  },
  {
    id: "alya-maybank",
    student: {
      name: "Nur Alya",
      program: "BSc Cyber Security • Year 3",
      growingInto: "Security Analyst",
      skills: ["Network Security", "Python", "Linux"],
      highlight: "Ran a mock incident-response drill for a student hackathon.",
    },
    internship: {
      company: "Maybank",
      role: "Cybersecurity Intern",
      lookingFor: "A detail-oriented mind who thinks like an attacker",
      culture: ["Compliance-aware", "Structured", "High trust"],
      slug: "maybank",
      logo: "maybank",
    },
    score: 83,
  },
  {
    id: "marcus-microsoft",
    student: {
      name: "Marcus Ong",
      program: "BSc Computer Science • Year 4",
      growingInto: "Full-stack Developer",
      skills: ["Web Dev", "Java", "React"],
      highlight: "Led a 4-person team to build an e-commerce dashboard.",
    },
    internship: {
      company: "Microsoft",
      role: "Software Engineer Intern",
      lookingFor: "A generalist who can move across the stack confidently",
      culture: ["Inclusive", "Growth mindset", "Mentorship"],
      slug: "microsoft",
      logo: "microsoft",
    },
    score: 90,
  },
  {
    id: "daniel-airasia",
    student: {
      name: "Daniel Wong",
      program: "BSc Computer Science • Class of 2021",
      growingInto: "Data Engineer",
      skills: ["Data Engineering", "ETL", "Python"],
      highlight: "Already building pipelines professionally at Grab.",
    },
    internship: {
      company: "AirAsia",
      role: "Data Engineering Intern",
      lookingFor: "Someone who can help modernize flight-ops data pipelines",
      culture: ["Operational", "Pragmatic", "Fast iteration"],
      slug: "airasia",
      logo: "airasia",
    },
    score: 87,
  },
];

type Stage = "Introduced" | "Interview Scheduled" | "Placed";
type MatchRecord = QueueItem & { stage: Stage };

const stageOrder: Stage[] = ["Introduced", "Interview Scheduled", "Placed"];
const stageTone: Record<Stage, string> = {
  Introduced: "bg-[#f0e9ff] text-[#5b21f3]",
  "Interview Scheduled": "bg-[#e8f2ff] text-[#2563eb]",
  Placed: "bg-[#e1f7eb] text-[#16a34a]",
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={className}>{children}</AnimatedCard>;
}

function TopBar() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <Link
          href="/university/industry"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#53607b] hover:text-[#5b21f3]"
        >
          <ArrowLeft size={14} />
          Back to Project Hub
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffe3f0] text-[#f0185b]">
            <Heart size={22} fill="currentColor" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-normal text-[#070a17] md:text-[28px]">
              Live Internship Marketplace
            </h1>
            <p className="mt-1 text-xs font-medium text-[#53607b]">
              What if internships matched students like dating apps match people?
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

function StatsStrip({ matchesCount, placedCount }: { matchesCount: number; placedCount: number }) {
  const conversion = matchesCount === 0 ? 0 : Math.round((placedCount / matchesCount) * 100);

  const stats = [
    { label: "Students in Pool", value: "2,458", icon: Users, bg: "bg-[#f0e9ff]", tone: "text-[#6733f4]" },
    { label: "Live Internships", value: "74", icon: Building2, bg: "bg-[#e8f2ff]", tone: "text-[#2563eb]" },
    { label: "Matches Made Today", value: String(matchesCount), icon: Heart, bg: "bg-[#ffe3f0]", tone: "text-[#f0185b]" },
    { label: "Placement Conversion", value: `${conversion}%`, icon: TrendingUp, bg: "bg-[#e1f7eb]", tone: "text-[#16a34a]" },
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

function SwipeCard({
  item,
  onDecision,
  isTop,
}: {
  item: QueueItem;
  onDecision: (direction: "left" | "right") => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const likeOpacity = useTransform(x, [20, 140], [0, 1]);
  const passOpacity = useTransform(x, [-140, -20], [1, 0]);

  return (
    <motion.div
      style={{ x, rotate }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onDecision("right");
        else if (info.offset.x < -120) onDecision("left");
      }}
      initial={{ scale: 0.96, opacity: 0, y: 12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25, ease: universityEase }}
      className={`absolute inset-0 ${isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}`}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#e7e8f0] bg-white p-5 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
        <motion.span
          style={{ opacity: likeOpacity }}
          className="absolute right-5 top-5 rounded-lg border-2 border-[#16a34a] px-3 py-1 text-sm font-black text-[#16a34a]"
        >
          INTRODUCE
        </motion.span>
        <motion.span
          style={{ opacity: passOpacity }}
          className="absolute left-5 top-5 rounded-lg border-2 border-[#f0185b] px-3 py-1 text-sm font-black text-[#f0185b]"
        >
          PASS
        </motion.span>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#dbeafe,#172039)] text-base font-black text-white">
              {item.student.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#090d1b]">{item.student.name}</p>
              <p className="text-xs font-medium text-[#53607b]">{item.student.program}</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-[#ffe3f0] px-3 py-1.5 text-xs font-bold text-[#f0185b]">
            <Sparkles size={13} fill="currentColor" />
            {item.score}% Match
          </span>
        </div>

        <div className="mt-4 rounded-2xl bg-[#faf8ff] p-3">
          <p className="text-[10px] font-bold uppercase tracking-normal text-[#6733f4]">Growing into</p>
          <p className="mt-1 text-sm font-bold text-[#090d1b]">{item.student.growingInto}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.student.skills.map((skill) => (
              <span key={skill} className="rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-[#5b4b8a]">
                {skill}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs font-medium leading-5 text-[#53607b]">{item.student.highlight}</p>
        </div>

        <div className="my-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-[#edf0f6]" />
          <Heart size={14} className="text-[#f0185b]" fill="currentColor" />
          <div className="h-px flex-1 bg-[#edf0f6]" />
        </div>

        <div className="rounded-2xl border border-[#edf0f6] p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#efe7ff] text-[10px] font-black text-[#6733f4]">
              {item.internship.company[0]}
            </span>
            <div>
              <p className="text-sm font-extrabold text-[#090d1b]">{item.internship.company}</p>
              <p className="text-xs font-medium text-[#53607b]">{item.internship.role}</p>
            </div>
          </div>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-normal text-[#6733f4]">Looking for</p>
          <p className="mt-1 text-xs font-medium leading-5 text-[#53607b]">{item.internship.lookingFor}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.internship.culture.map((tag) => (
              <span key={tag} className="rounded-lg bg-[#f4f3f8] px-2 py-1 text-[10px] font-semibold text-[#53607b]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => onDecision("left")}
            aria-label="Pass"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f4d0dc] text-[#f0185b] shadow-sm transition hover:bg-[#fff0f5]"
          >
            <X size={20} strokeWidth={2.6} />
          </button>
          <button
            type="button"
            onClick={() => onDecision("right")}
            aria-label="Introduce"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0185b] text-white shadow-[0_14px_30px_rgba(240,24,91,0.28)] transition hover:-translate-y-0.5"
          >
            <Heart size={20} fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MatchDeck({
  queue,
  onDecision,
}: {
  queue: QueueItem[];
  onDecision: (item: QueueItem, direction: "left" | "right") => void;
}) {
  const visible = queue.slice(0, 3);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#090d1b]">Suggested Matches</h2>
          <p className="mt-1 text-xs font-medium text-[#53607b]">
            Swipe or use the buttons — right to introduce, left to pass.
          </p>
        </div>
        <span className="rounded-full bg-[#f0e9ff] px-3 py-1.5 text-xs font-bold text-[#5b21f3]">
          {queue.length} left
        </span>
      </div>

      <div className="relative mx-auto mt-5 h-[520px] max-w-[380px]">
        <AnimatePresence>
          {visible.length > 0 ? (
            visible
              .slice()
              .reverse()
              .map((item, reverseIndex) => {
                const index = visible.length - 1 - reverseIndex;
                return (
                  <div
                    key={item.id}
                    className="absolute inset-0"
                    style={{
                      zIndex: visible.length - index,
                      transform: index === 0 ? "none" : `scale(${1 - index * 0.04}) translateY(${index * 10}px)`,
                    }}
                  >
                    <SwipeCard
                      item={item}
                      isTop={index === 0}
                      onDecision={(direction) => onDecision(item, direction)}
                    />
                  </div>
                );
              })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center rounded-[24px] border border-dashed border-[#e6e8f1] bg-[#faf9fc] text-center"
            >
              <Sparkles size={28} className="text-[#6733f4]" />
              <p className="mt-3 text-sm font-extrabold text-[#090d1b]">You&apos;re all caught up</p>
              <p className="mt-1 max-w-[220px] text-xs font-medium text-[#53607b]">
                New AI-suggested matches will appear here as students and employers update their profiles.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

function MatchRow({ match, onAdvance }: { match: MatchRecord; onAdvance: (id: string) => void }) {
  const isFinal = match.stage === "Placed";

  return (
    <AnimatedRow className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-[#edf0f6] py-3 last:border-b-0 sm:grid-cols-[1.4fr_1fr_auto_auto]">
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#090d1b]">{match.student.name}</p>
        <p className="mt-0.5 text-xs font-medium text-[#53607b]">{match.student.growingInto}</p>
      </div>
      <div className="hidden min-w-0 sm:block">
        <p className="text-xs font-bold text-[#26324d]">{match.internship.company}</p>
        <p className="text-[11px] font-medium text-[#53607b]">{match.internship.role}</p>
      </div>
      <span className={`justify-self-start rounded-full px-2.5 py-1 text-[11px] font-bold sm:justify-self-auto ${stageTone[match.stage]}`}>
        {match.stage}
      </span>
      {isFinal ? (
        <Link
          href={`/university/industry/${match.internship.slug}`}
          className="flex items-center gap-1 justify-self-end text-xs font-bold text-[#16a34a] transition hover:text-[#0f7a3d]"
        >
          View Company
          <ArrowUpRight size={13} />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => onAdvance(match.id)}
          className="flex items-center gap-1 justify-self-end text-xs font-bold text-[#5b21f3] transition hover:text-[#4318c9]"
        >
          Advance
          <ArrowUpRight size={13} />
        </button>
      )}
    </AnimatedRow>
  );
}

function MatchCelebration({ item, onClose }: { item: QueueItem; onClose: () => void }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[#1a0b16]/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: universityEase }}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#3d0f2b,#170a2e)] p-6 text-center text-white shadow-[0_40px_90px_rgba(0,0,0,0.45)]"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(240,24,91,0.35),transparent_70%)]" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.35),transparent_70%)]" />

        <Sparkles size={22} className="relative mx-auto text-[#ffb3d1]" fill="currentColor" />
        <h2 className="relative mt-2 text-2xl font-black tracking-tight">It&apos;s a Match!</h2>
        <p className="relative mt-1 text-xs font-medium text-white/70">
          {item.student.name} &amp; {item.internship.company} are ready to connect.
        </p>

        <div className="relative mt-6 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-[linear-gradient(135deg,#dbeafe,#172039)] text-lg font-black text-white">
            {item.student.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div className="z-10 -mx-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#f0185b] shadow-lg">
            <Heart size={16} fill="currentColor" />
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white">
            <ProjectLogo type={item.internship.logo} />
          </div>
        </div>

        <div className="relative mt-6 flex flex-col gap-2">
          <Link
            href={`/university/industry/${item.internship.slug}`}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#170a2e] transition hover:-translate-y-0.5"
          >
            View {item.internship.company} Project
            <ArrowRight size={15} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center justify-center text-xs font-bold text-white/70 hover:text-white"
          >
            Keep Swiping
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

function MatchesPanel({ matches, onAdvance }: { matches: MatchRecord[]; onAdvance: (id: string) => void }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-[#090d1b]">Matches &amp; Outcomes</h2>
        <span className="rounded-full bg-[#e1f7eb] px-3 py-1.5 text-xs font-bold text-[#16a34a]">
          {matches.filter((match) => match.stage === "Placed").length} placed
        </span>
      </div>
      <p className="mt-1 text-xs font-medium text-[#53607b]">
        Track which introductions turn into interviews and real placements.
      </p>

      {matches.length === 0 ? (
        <p className="mt-6 py-6 text-center text-xs font-medium text-[#65718d]">
          Swipe right on a match to start tracking its outcome here.
        </p>
      ) : (
        <div className="mt-4">
          <AnimatedList>
            {matches.map((match) => (
              <MatchRow key={match.id} match={match} onAdvance={onAdvance} />
            ))}
          </AnimatedList>
        </div>
      )}
    </Card>
  );
}

export default function InternshipMarketplace() {
  const [queue, setQueue] = useState<QueueItem[]>(queueSeed);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [celebration, setCelebration] = useState<QueueItem | null>(null);

  const placedCount = useMemo(() => matches.filter((match) => match.stage === "Placed").length, [matches]);

  const handleDecision = (item: QueueItem, direction: "left" | "right") => {
    setQueue((prev) => prev.filter((entry) => entry.id !== item.id));
    if (direction === "right") {
      setMatches((prev) => [{ ...item, stage: "Introduced" }, ...prev]);
      setCelebration(item);
    }
  };

  const handleAdvance = (id: string) => {
    setMatches((prev) =>
      prev.map((match) => {
        if (match.id !== id) return match;
        const currentIndex = stageOrder.indexOf(match.stage);
        const nextStage = stageOrder[Math.min(currentIndex + 1, stageOrder.length - 1)];
        return { ...match, stage: nextStage };
      }),
    );
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(240,24,91,0.06),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1200px]">
          <AnimatedSection>
            <TopBar />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-6">
            <StatsStrip matchesCount={matches.length} placedCount={placedCount} />
          </AnimatedSection>

          <AnimatedSection delay={0.16} className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
            <MatchDeck queue={queue} onDecision={handleDecision} />
            <MatchesPanel matches={matches} onAdvance={handleAdvance} />
          </AnimatedSection>
        </div>
      </div>

      {celebration ? (
        <MatchCelebration item={celebration} onClose={() => setCelebration(null)} />
      ) : null}
    </main>
  );
}
