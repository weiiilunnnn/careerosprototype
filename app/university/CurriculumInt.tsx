"use client";

import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Cloud,
  Download,
  GraduationCap,
  Lightbulb,
  LineChart,
  MessageSquareText,
  Search,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatedAIPanel, AnimatedCard, AnimatedList, AnimatedRow, AnimatedSection } from "./UniversityMotion";

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

function TopBar() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-[#6733f4]">
            <Sparkles size={27} fill="currentColor" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-normal text-[#070a17] md:text-[34px]">AI Coach</h1>
        </div>
        <p className="mt-4 max-w-3xl text-sm font-medium leading-6 text-[#53607b]">
          AI compares your current curriculum with real industry demand and identifies what should be improved before your students graduate.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
        <div className="relative hidden w-[330px] md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64708b]" size={16} />
          <Input className="h-11 rounded-xl border-[#e5e7f0] bg-white pl-10 text-sm shadow-sm" placeholder="Search skills, modules, industries..." />
        </div>
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
        <Button className="h-10 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-bold text-[#34415e] shadow-sm hover:bg-[#faf7ff]" variant="outline">
          <Download size={15} />
          Export Report
        </Button>
      </div>
    </header>
  );
}

function AISummary() {
  return (
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
              <p>Your Computer Science programme is well aligned with today&apos;s software engineering roles.</p>
              <p>
                However, our analysis found several important gaps between your curriculum and current employer expectations. Students are well prepared in programming fundamentals but have limited exposure to Data Storytelling, Cloud Platforms, Prompt Engineering, and AI Product Development.
              </p>
              <p>If these gaps are addressed, graduate employability is projected to improve significantly.</p>
            </div>
            <Button className="mt-6 h-11 rounded-xl bg-[#f0185b] px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(240,24,91,0.24)] hover:bg-[#d91652]">
              View Full Analysis
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

function AIRecommendations() {
  return (
    <AnimatedAIPanel>
    <SoftCard className="overflow-hidden">
      <CardContent className="relative p-6">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(103,51,244,0.12),transparent_65%)]" />
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
            <Button className="h-10 rounded-xl border-[#d9ccff] bg-white px-4 text-xs font-bold text-[#5b21f3] hover:bg-[#faf7ff]" variant="outline">
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

function InsightStrip({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] border border-[#efe8ff] bg-[#fbf8ff] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6733f4] shadow-sm">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-sm font-extrabold text-[#0b1020]">{title}</div>
        <p className="mt-1 text-sm font-medium leading-6 text-[#53607b]">{body}</p>
      </div>
    </div>
  );
}

export default function CurriculumInt() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(103,51,244,0.12),transparent_34%),linear-gradient(180deg,#ffffff_0%,#fbfaff_42%,#ffffff_100%)] text-[#0b1020]">
      <main className="px-4 py-5 transition-[margin-left] duration-300 ease-out xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7">
        <div className="mx-auto flex max-w-[1540px] flex-col gap-5">
          <AnimatedSection>
            <TopBar />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="grid gap-3 lg:grid-cols-3">
            <InsightStrip icon={BookOpen} title="What are we teaching?" body="Map modules, assessment tasks, and practical exposure against real employer language." />
            <InsightStrip icon={BriefcaseBusiness} title="What is industry asking for?" body="Compare against hiring patterns, project briefs, and graduate role descriptions." />
            <InsightStrip icon={Lightbulb} title="What should we do next?" body="Turn gaps into curriculum updates, employer projects, and measurable improvements." />
          </AnimatedSection>

          <AnimatedSection delay={0.16}><AISummary /></AnimatedSection>
          <AnimatedSection delay={0.24}><CurriculumComparison /></AnimatedSection>
          <AnimatedSection delay={0.32}><KeyGaps /></AnimatedSection>
          <AnimatedSection delay={0.4}><AIRecommendations /></AnimatedSection>
          <AnimatedSection delay={0.48}><CareerImpact /></AnimatedSection>
          <AnimatedSection delay={0.56}><Roadmap /></AnimatedSection>
        </div>
      </main>
    </div>
  );
}
