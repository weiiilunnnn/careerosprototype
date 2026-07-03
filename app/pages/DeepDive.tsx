"use client";

import {
  BarChart3,
  Bookmark,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ChevronRight,
  Clock3,
  Gauge,
  GraduationCap,
  LineChart,
  PanelTop,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CompanyLogo from "@/components/CompanyLogo";
import { topAnimalsForJob, type WorkAnimalSlug } from "@/lib/workAnimals";

const theme = {
  navy: "#081433",
  deepNavy: "#152238",
  muted: "#46536D",
  rose1: "#F04D7A",
  rose2: "#E00046",
  soft: "#FFF2F6",
  line: "#F5CBD6",
  border: "#E5E8F0",
  page: "#fbfbfc",
} as const;

const careerPath = [
  { label: "Intern", icon: GraduationCap },
  { label: "Data Analyst", icon: BarChart3 },
  { label: "BI Analyst", icon: PanelTop, active: true },
  { label: "BI Lead", icon: UserRound },
];

const snapshots = [
  { label: "Salary Range", value: "RM 3.5k - 4.8k", note: "Entry level", icon: Sparkles },
  { label: "Growth Potential", value: "High", note: "Strong demand across industries", icon: TrendingUp },
  { label: "Work Nature", value: "Analytics + Reporting", note: "Data insights, dashboards, storytelling", icon: BriefcaseBusiness },
  { label: "Typical Transition Speed", value: "1 - 3 years", note: "From relevant role", icon: Clock3 },
  { label: "Top Industries", value: "Fintech, Consulting", note: "E-commerce, high hiring activity", icon: Building2 },
];

const skillGaps = [
  ["Power BI", "High", "w-11/12"],
  ["Dashboard Storytelling", "High", "w-10/12"],
  ["Stakeholder Communication", "Medium", "w-7/12"],
  ["Data Visualization", "Medium", "w-6/12"],
  ["Advanced Excel", "Low", "w-3/12"],
];

const jobs = [
  {
    role: "BI Analyst",
    company: "Grab",
    location: "Kuala Lumpur",
    mode: "Hybrid",
    match: "81% Match",
    skills: ["SQL", "Analytics Experience", "Fintech Exposure", "Power BI"],
    historicalAnimalSlugs: ["owl", "ant", "fox"] as WorkAnimalSlug[],
  },
  {
    role: "Junior BI Analyst",
    company: "Accenture",
    location: "Kuala Lumpur",
    mode: "On-site",
    match: "77% Match",
    skills: ["SQL", "Dashboarding", "Stakeholder Communication"],
    historicalAnimalSlugs: ["ant", "horse", "dolphin"] as WorkAnimalSlug[],
  },
  {
    role: "Reporting Analyst",
    company: "Maybank",
    location: "Subang Jaya",
    mode: "Hybrid",
    match: "74% Match",
    skills: ["Excel", "SQL", "Dashboard Storytelling"],
    historicalAnimalSlugs: ["owl", "fox", "dolphin"] as WorkAnimalSlug[],
  },
  {
    role: "Analytics Associate",
    company: "Shopee",
    location: "Kuala Lumpur",
    mode: "Remote",
    match: "72% Match",
    skills: ["Data Visualization", "Python", "Business Reporting"],
    historicalAnimalSlugs: ["ant", "owl", "peacock"] as WorkAnimalSlug[],
  },
  {
    role: "Junior Business Analyst",
    company: "CIMB",
    location: "Kuala Lumpur",
    mode: "On-site",
    match: "69% Match",
    skills: ["Stakeholder Communication", "Process Mapping", "SQL"],
    historicalAnimalSlugs: ["fox", "dolphin", "horse"] as WorkAnimalSlug[],
  },
];

const nextSteps = [
  ["Build one dashboard portfolio project", "Showcase your ability to turn data into insights."],
  ["Gain stakeholder-facing presentation exposure", "Practice presenting insights to non-technical audiences."],
  ["Strengthen Power BI storytelling", "Focus on dashboards that drive decisions."],
  ["Re-enter BI Analyst pool with stronger positioning", "Improve match score and unlock better opportunities."],
];

const timeline = [
  { range: "0-6 months", role: "Graduate / Intern" },
  { range: "6-18 months", role: "Junior Data Analyst" },
  { range: "1-3 years", role: "BI Analyst", active: true },
  { range: "3-5 years", role: "BI Lead" },
];

function SectionTitle({
  title,
  icon: Icon,
  light = false,
}: {
  title: string;
  icon: LucideIcon;
  light?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          light ? "bg-white/10 text-[#F04D7A]" : "bg-[#FFF2F6] text-[#E00046]"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3
        className={`text-lg font-semibold ${
          light ? "text-white" : "text-[#081433]"
        }`}
      >
        {title}
      </h3>
    </div>
  );
}

export default function Home() {
  const [isSaved, setIsSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState("Share");
  const [showAllJobs, setShowAllJobs] = useState(false);
  const visibleJobs = showAllJobs ? jobs : jobs.slice(0, 2);

  async function handleShare() {
    const shareUrl = `${window.location.origin}/?view=deep-dive`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "CareerOS BI Analyst path",
          text: "View this CareerOS BI Analyst career path.",
          url: shareUrl,
        });
        setShareStatus("Shared");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("Link copied");
    } catch {
      setShareStatus("Share");
    }

    window.setTimeout(() => setShareStatus("Share"), 1800);
  }

  return (
    <div
      className="min-h-screen bg-[#fbfbfc] text-[#152238]"
      style={{
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm font-medium text-[#46536D]">
          <Link
          href="/?view=career-landscape"
          className="transition hover:text-[#E00046]"
        >
          Career Landscape
        </Link>
          <ChevronRight size={14} />
          <span className="text-[#081433]">BI Analyst</span>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
          <button
            type="button"
            onClick={() => setIsSaved((current) => !current)}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold shadow-sm transition hover:border-[#F04D7A] hover:text-[#E00046] ${
              isSaved ? "bg-[#FFF2F6] text-[#E00046]" : "bg-white"
            }`}
            style={{ borderColor: isSaved ? theme.line : theme.border }}
          >
            <Bookmark size={16} /> {isSaved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border bg-white px-5 text-sm font-semibold shadow-sm transition hover:border-[#F04D7A] hover:text-[#E00046]"
            style={{ borderColor: theme.border }}
          >
            <Share2 size={16} /> {shareStatus}
          </button>
        </div>
      </div>

      <section className="relative grid overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(21,34,56,0.18)] lg:grid-cols-[1fr_1.15fr]">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=80"
          alt="Analytics team reviewing a career dashboard"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#081433]/95 via-[#081433]/84 to-[#081433]/48" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081433]/70 via-transparent to-transparent" />

        <div className="relative z-10 p-5 text-white sm:p-8">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">Deep Dive</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">Career intelligence</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl md:text-5xl">BI Analyst</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/75 md:text-base">
            People with similar profiles commonly transition into this role.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {[["85%", "Match"], ["Medium", "Difficulty"], ["12-18 months", "Est. Transition"]].map(([value, label]) => (
              <div key={label} className="min-w-[8.5rem] flex-1 rounded-2xl border border-white/15 bg-white/[0.12] px-4 py-4 text-center backdrop-blur-md sm:flex-none sm:px-6">
                <p className="text-xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs font-medium text-white/65">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex w-full max-w-[472px] items-center rounded-2xl border border-white/15 bg-white/[0.12] px-4 py-5 shadow-sm backdrop-blur-md sm:px-6">
            <span className="flex items-center gap-4">
              <UsersRound className="shrink-0 text-white" size={24} />
              <span className="text-sm font-semibold">
                You are ranked in the top 18% of candidates in the Junior BI Analyst pool
              </span>
            </span>
          </div>
        </div>

        <div className="relative z-10 m-4 rounded-2xl border border-white/15 bg-white/[0.12] p-5 text-white shadow-sm backdrop-blur-md sm:m-5 sm:p-8">
          <SectionTitle title="Typical Career Path" icon={LineChart} light />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center lg:gap-3">
            {careerPath.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="contents">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left lg:border-0 lg:bg-transparent lg:p-0 lg:text-center">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full lg:mx-auto lg:h-16 lg:w-16 ${
                        step.active
                          ? "bg-[#E00046] text-white shadow-[0_0_35px_rgba(224,0,70,0.35)]"
                          : "bg-white/12 text-white/75"
                      }`}
                    >
                      <Icon size={28} />
                    </div>
                    <p className={`mt-4 text-sm font-semibold ${step.active ? "text-white" : "text-white/70"}`}>
                      {step.label}
                    </p>
                  </div>
                  {index < careerPath.length - 1 ? <ChevronRight className="hidden text-white/45 lg:block" size={20} /> : null}
                </div>
              );
            })}
          </div>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="flex gap-3 text-sm leading-7 text-white/75">
              <Sparkles className="mt-1 shrink-0 text-[#F04D7A]" size={18} />
              Most similar profiles reach BI Analyst in 1-2 years after their first analytics role.
            </p>
          </div>
        </div>
      </section>


      <section className="mt-9 rounded-2xl border bg-white shadow-sm" style={{ borderColor: theme.border }}>
        <div className="flex flex-col gap-3 border-b border-[#F1F3F7] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <SectionTitle title="Top Matching Job Openings" icon={Building2} />
          <button
            type="button"
            onClick={() => setShowAllJobs((current) => !current)}
            className="text-sm font-semibold text-[#E00046]"
          >
            {showAllJobs ? "Show fewer jobs" : "View all jobs"}
          </button>
        </div>
        {visibleJobs.map((job) => {
          const animalMatches = topAnimalsForJob({
            title: job.role,
            skills: job.skills,
            historicalAnimalSlugs: job.historicalAnimalSlugs,
          });

          return (
          <Link
          key={job.role}
          href="/?view=jobapplication"
          scroll={false}
          replace={false}
          prefetch={true}
          className="grid gap-4 border-b border-[#F1F3F7] px-5 py-6 transition-colors hover:bg-[#FFF7FA] md:grid-cols-[1fr_1.1fr_1fr_auto] md:items-center md:px-6"
        >
            <div className="flex gap-4">
              <CompanyLogo company={job.company} size="lg" />
              <div>
                <p className="font-semibold text-[#081433]">{job.role}</p>
                <p className="text-sm text-[#46536D]">{job.company}</p>
                <p className="mt-2 text-xs text-[#46536D]">{job.location} - {job.mode}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-[#081433]">Why matched</p>
              <div className="flex flex-wrap gap-2">
                {["SQL", "Fintech Exposure", "Analytics Experience"].map((tag) => (
                  <span key={tag} className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-[#081433]">Top work animals</p>
              <div className="flex flex-wrap gap-2">
                {animalMatches.map((match) => (
                  <span key={match.animal.slug} className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">
                    {match.animal.emoji} {match.animal.name} {match.score}%
                  </span>
                ))}
              </div>
            </div>
            <span className="w-full rounded-lg bg-[#FFF2F6] px-4 py-2 text-center text-sm font-semibold text-[#E00046] md:w-auto">{job.match}</span>
          </Link>
        )})}
      </section>
      
      <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: theme.border }}>
        <SectionTitle title="Career Snapshot" icon={Gauge} />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {snapshots.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="min-h-44 rounded-xl border p-5" style={{ borderColor: theme.border }}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF2F6] text-[#E00046]">
                  <Icon size={22} />
                </span>
                <p className="mt-7 text-sm font-semibold text-[#081433]">{item.label}</p>
                <p className="mt-3 text-base font-semibold text-[#081433]">{item.value}</p>
                <p className="mt-1 text-sm leading-6 text-[#46536D]">{item.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-9 overflow-hidden rounded-2xl p-5 text-white shadow-[0_24px_60px_rgba(18,24,40,0.18)] sm:p-8" style={{ background: `linear-gradient(135deg, ${theme.navy}, ${theme.deepNavy})` }}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_.8fr]">
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <SectionTitle title="Why this matches you" icon={Sparkles} light />
              <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold">Based on your profile</span>
            </div>
            <div className="mt-8 space-y-4 text-sm font-medium">
              {["SQL proficiency detected", "Analytics internship experience", "Dashboarding affinity detected", "Strong alignment with similar successful profiles"].map((item) => (
                <p key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E00046] text-xs">?</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="self-center rounded-2xl border border-white/10 bg-white/10 p-8 text-sm leading-7">
            <Sparkles className="mb-4 text-[#F04D7A]" />
            Most successful BI Analyst transitions from similar profiles involved Power BI adoption within the first year.
          </div>
          <div className="relative hidden min-h-48 items-center justify-center lg:flex">
            <div className="absolute h-44 w-52 rounded-2xl bg-[#F04D7A]/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(240,24,79,0.28)]">
              <Image
                src="/bi-analyst-dashboard.jpeg"
                alt="BI analyst dashboard with charts and key metrics"
                width={260}
                height={180}
                className="h-40 w-56 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-9 grid gap-5 lg:grid-cols-[1.1fr_.8fr]">
        <div className="rounded-2xl border bg-white p-7 shadow-sm" style={{ borderColor: theme.border }}>
          <SectionTitle title="Skill Gap Analysis" icon={SlidersHorizontal} />
          <div className="mt-7 grid gap-7 md:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="mb-4 grid grid-cols-[1fr_80px] text-xs font-semibold text-[#46536D]">
                <span>Skill</span>
                <span>Impact</span>
              </div>
              <div className="space-y-5">
                {skillGaps.map(([skill, impact, width]) => (
                  <div key={skill} className="grid grid-cols-[1fr_80px] items-center gap-4 text-sm text-[#081433]">
                    <span>{skill}</span>
                    <span className="flex items-center gap-3 text-[#46536D]">
                      <span className="h-2 w-12 rounded-full bg-[#F5D9E1]">
                        <span className={`block h-full rounded-full bg-[#E00046] ${width}`} />
                      </span>
                      {impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-[#081433]">AI Insights</p>
              <div className="rounded-xl bg-[#FFF2F6] p-5 text-sm leading-7 text-[#46536D]">
                <Sparkles className="mb-3 text-[#E00046]" size={17} />
                Candidates with stakeholder-facing projects had significantly higher interview conversion.
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-7 shadow-sm" style={{ borderColor: theme.border }}>
          <SectionTitle title="Timeline & Progression" icon={CalendarClock} />
          <div className="relative mt-7 space-y-3 before:absolute before:bottom-[30px] before:left-[13px] before:top-[30px] before:z-10 before:w-0.5 before:rounded-full before:bg-[#E5E8F0]">
            {timeline.map((item) => (
              <div key={item.role} className={`relative flex gap-4 rounded-xl px-1 py-3 text-sm ${item.active ? "bg-[#FFF7FA]" : ""}`}>
                <span className={`relative z-20 mt-2 h-5 w-5 shrink-0 rounded-full bg-white ring-4 ring-white ${item.active ? "shadow-[0_0_20px_rgba(224,0,70,0.45)] after:absolute after:inset-0 after:rounded-full after:bg-[#E00046]" : "after:absolute after:inset-0 after:rounded-full after:bg-[#CBD5E1]"}`} />
                <div className="relative z-20">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${item.active ? "text-[#E00046]" : "text-[#46536D]"}`}>{item.range}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className={`font-semibold ${item.active ? "text-[#E00046]" : "text-[#081433]"}`}>{item.role}</p>
                    {item.active ? <span className="rounded-full bg-[#E00046] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">Current path</span> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.8fr]">
        <div className="rounded-2xl border bg-white p-7 shadow-sm" style={{ borderColor: theme.border }}>
          <SectionTitle title="Trade-offs & Considerations" icon={Target} />
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["Communication heavy role", "Frequent reporting", "Continuous upskilling", "Technical ceiling"].map((item, index) => (
              <div key={item}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF2F6] text-xs font-semibold text-[#E00046]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-sm font-semibold text-[#081433]">{item}</p>
                <p className="mt-2 text-sm leading-6 text-[#46536D]">Requires ownership, clarity, and ongoing business exposure.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-7 shadow-sm" style={{ borderColor: theme.border }}>
          <SectionTitle title="AI Career Coach" icon={Sparkles} />
          <div className="mt-9 flex gap-5">
            <span className="text-5xl font-semibold text-[#F04D7A]">&quot;</span>
            <p className="max-w-md text-sm leading-7 text-[#46536D]">
              Your technical alignment is already strong. The largest limiting factor now is stakeholder exposure and dashboard storytelling.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-9 rounded-2xl border bg-white p-7 shadow-sm" style={{ borderColor: theme.border }}>
        <SectionTitle title="Recommended Next Steps" icon={BookOpen} />
        <div className="mt-6 grid gap-5 lg:grid-cols-4">
          {nextSteps.map(([title, detail], index) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF2F6] text-sm font-semibold text-[#E00046]">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#081433]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#46536D]">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-9 mb-4 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-[#FFF2F6] px-5 py-7 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#E00046]">
            <UsersRound size={30} />
          </span>
          <div>
            <h3 className="text-xl font-semibold text-[#081433]">Your career is evolving. Keep building.</h3>
            <p className="mt-1 text-sm text-[#46536D]">Update your profile and track your progress over time.</p>
          </div>
        </div>
        <Link
          href="/?view=profile"
          className="w-full rounded-xl bg-[#E00046] px-7 py-3 text-center text-sm font-semibold text-white shadow-[0_12px_28px_rgba(224,0,70,0.22)] transition hover:bg-[#D81B3F] sm:w-auto"
        >
          Upload New Achievement
        </Link>
      </section>
      </main>
    </div>
  );
}
