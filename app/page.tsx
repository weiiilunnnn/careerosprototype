import {
  BarChart3,
  Bookmark,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Clock3,
  GraduationCap,
  LineChart,
  PanelTop,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import Link from "next/link";

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
  ["BI Analyst", "Fintech Company", "Kuala Lumpur", "Hybrid", "81% Match"],
  ["Junior BI Analyst", "Consulting Firm", "Kuala Lumpur", "On-site", "77% Match"],
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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdfcfa] text-[#111111]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm font-medium text-black/45">
          <span>Explore Careers</span>
          <ChevronRight size={14} />
          <span>Business & Analytics</span>
          <ChevronRight size={14} />
          <span className="text-black/70">BI Analyst</span>
        </div>
        <div className="flex gap-3">
          <button className="flex h-11 items-center gap-2 rounded-md border border-black/10 bg-white px-5 text-sm font-semibold shadow-sm transition hover:border-[#f0184f]/30 hover:text-[#f0184f]">
            <Bookmark size={16} /> Save
          </button>
          <button className="flex h-11 items-center gap-2 rounded-md border border-black/10 bg-white px-5 text-sm font-semibold shadow-sm transition hover:border-[#f0184f]/30 hover:text-[#f0184f]">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div className="pt-2">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#f0184f]">Deep Dive</p>
          <h2 className="mt-4 text-5xl font-black tracking-tight">BI Analyst</h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-black/75">
            People with similar profiles commonly transition into this role.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {[["85%", "Match"], ["Medium", "Difficulty"], ["12-18 months", "Est. Transition"]].map(([value, label]) => (
              <div key={label} className="rounded-md bg-[#fff1f5] px-7 py-5 text-center">
                <p className="text-2xl font-black text-[#f0184f]">{value}</p>
                <p className="mt-1 text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex w-[472px] max-w-full items-center rounded-md bg-[#fff1f5] px-6 py-5 shadow-sm">
            <span className="flex items-center gap-4">
              <UsersRound className="shrink-0 text-[#f0184f]" size={24} />
              <span className="text-sm font-semibold">
                You are ranked in the top 18% of candidates in the Junior BI Analyst pool
              </span>
            </span>
          </div>
        </div>

        <div className="rounded-md border border-black/5 bg-white p-8 shadow-[0_24px_70px_rgba(18,24,40,0.08)]">
          <h3 className="font-bold">Typical Career Path</h3>
          <div className="mt-8 grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-3">
            {careerPath.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="contents">
                  <div className="text-center">
                    <div
                      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                        step.active
                          ? "bg-[#f0184f] text-white shadow-[0_0_35px_rgba(240,24,79,0.45)]"
                          : "bg-[#fff1f5] text-black/70"
                      }`}
                    >
                      <Icon size={28} />
                    </div>
                    <p className={`mt-4 text-sm font-semibold ${step.active ? "text-[#f0184f]" : ""}`}>
                      {step.label}
                    </p>
                  </div>
                  {index < careerPath.length - 1 ? <ChevronRight className="text-black/35" size={20} /> : null}
                </div>
              );
            })}
          </div>
          <div className="mt-8 border-t border-black/8 pt-6">
            <p className="flex gap-3 text-sm leading-7 text-black/75">
              <Sparkles className="mt-1 shrink-0 text-[#f0184f]" size={18} />
              Most similar profiles reach BI Analyst in 1-2 years after their first analytics role.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-md border border-black/5 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold">Career Snapshot</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {snapshots.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="min-h-44 rounded-md border border-black/7 p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f5] text-[#f0184f]">
                  <Icon size={22} />
                </span>
                <p className="mt-7 text-sm font-bold">{item.label}</p>
                <p className="mt-3 text-base font-semibold">{item.value}</p>
                <p className="mt-1 text-sm leading-6 text-black/55">{item.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-9 overflow-hidden rounded-md bg-[#121d2d] p-8 text-white shadow-[0_24px_60px_rgba(18,24,40,0.18)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_.8fr]">
          <div>
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold">Why this matches you</h3>
              <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold">Based on your profile</span>
            </div>
            <div className="mt-8 space-y-4 text-sm font-medium">
              {["SQL proficiency detected", "Analytics internship experience", "Dashboarding affinity detected", "Strong alignment with similar successful profiles"].map((item) => (
                <p key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f0184f] text-xs">?</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="self-center rounded-md border border-white/8 bg-white/7 p-8 text-sm leading-7">
            <Sparkles className="mb-4 text-[#ff4d79]" />
            Most successful BI Analyst transitions from similar profiles involved Power BI adoption within the first year.
          </div>
          <div className="relative hidden min-h-48 items-center justify-center lg:flex">
            <div className="absolute h-44 w-52 rounded-md bg-[#ff4d79]/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-md border border-white/10 shadow-[0_0_50px_rgba(240,24,79,0.28)]">
              <Image
                src="/bi-analyst-dashboard.png"
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
        <div className="rounded-md border border-black/5 bg-white p-7 shadow-sm">
          <h3 className="text-lg font-bold">Skill Gap Analysis</h3>
          <div className="mt-7 grid gap-7 md:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="mb-4 grid grid-cols-[1fr_80px] text-xs font-semibold text-black/55">
                <span>Skill</span>
                <span>Impact</span>
              </div>
              <div className="space-y-5">
                {skillGaps.map(([skill, impact, width]) => (
                  <div key={skill} className="grid grid-cols-[1fr_80px] items-center gap-4 text-sm">
                    <span>{skill}</span>
                    <span className="flex items-center gap-3 text-black/55">
                      <span className="h-2 w-12 rounded-full bg-[#ffe6ed]">
                        <span className={`block h-full rounded-full bg-[#f0184f] ${width}`} />
                      </span>
                      {impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-bold">AI Insights</p>
              <div className="rounded-md bg-[#fff1f5] p-5 text-sm leading-7">
                <Sparkles className="mb-3 text-[#f0184f]" size={17} />
                Candidates with stakeholder-facing projects had significantly higher interview conversion.
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-black/5 bg-white p-7 shadow-sm">
          <h3 className="text-lg font-bold">Timeline & Progression</h3>
          <div className="relative mt-7 space-y-3 before:absolute before:bottom-[30px] before:left-[13px] before:top-[30px] before:z-10 before:w-0.5 before:rounded-full before:bg-black/15">
            {timeline.map((item) => (
              <div key={item.role} className={`relative flex gap-4 rounded-md px-1 py-3 text-sm ${item.active ? "bg-[#fff8fa]" : ""}`}>
                <span className={`relative z-20 mt-2 h-5 w-5 shrink-0 rounded-full bg-white ring-4 ring-white ${item.active ? "shadow-[0_0_20px_rgba(240,24,79,0.65)] after:absolute after:inset-0 after:rounded-full after:bg-[#f0184f]" : "after:absolute after:inset-0 after:rounded-full after:bg-[#bdbdbd]"}`} />
                <div className="relative z-20">
                  <p className={`text-xs font-bold uppercase tracking-wide ${item.active ? "text-[#f0184f]" : "text-black/40"}`}>{item.range}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className={`font-bold ${item.active ? "text-[#f0184f]" : "text-black/70"}`}>{item.role}</p>
                    {item.active ? <span className="rounded-full bg-[#f0184f] px-2 py-0.5 text-[10px] font-bold uppercase text-white">Current path</span> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.8fr]">
        <div className="rounded-md border border-black/5 bg-white p-7 shadow-sm">
          <h3 className="text-lg font-bold">Trade-offs & Considerations</h3>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["Communication heavy role", "Frequent reporting", "Continuous upskilling", "Technical ceiling"].map((item) => (
              <div key={item}>
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#fff1f5] text-[#f0184f]">
                  <Target size={21} />
                </span>
                <p className="mt-4 text-sm font-bold">{item}</p>
                <p className="mt-2 text-sm leading-6 text-black/55">Requires ownership, clarity, and ongoing business exposure.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-black/5 bg-white p-7 shadow-sm">
          <h3 className="text-lg font-bold">AI Career Coach</h3>
          <div className="mt-9 flex gap-5">
            <span className="text-5xl font-black text-[#ff8aa6]">&quot;</span>
            <p className="max-w-md text-sm leading-7">
              Your technical alignment is already strong. The largest limiting factor now is stakeholder exposure and dashboard storytelling.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-9 rounded-md border border-black/5 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <h3 className="text-lg font-bold">Top Matching Job Openings</h3>
          <button className="text-sm font-bold text-[#f0184f]">View all jobs</button>
        </div>
        {jobs.map(([role, company, location, mode, match]) => (
          <Link
            key={role}
            href={`/jobs/${role.toLowerCase().replaceAll(" ", "-")}`}
            className="grid gap-4 border-b border-black/5 px-6 py-6 transition hover:bg-[#fff8fa] md:grid-cols-[1fr_1.2fr_.9fr_auto] md:items-center"
          >
            <div className="flex gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-md bg-[#f0184f] text-white">
                <Building2 size={27} />
              </span>
              <div>
                <p className="font-bold">{role}</p>
                <p className="text-sm text-black/55">{company}</p>
                <p className="mt-2 text-xs text-black/50">{location} - {mode}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold">Why matched</p>
              <div className="flex flex-wrap gap-2">
                {["SQL", "Fintech Exposure", "Analytics Experience"].map((tag) => (
                  <span key={tag} className="rounded-full bg-[#fff1f5] px-3 py-1 text-xs font-semibold">{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold">Potential gap</p>
              <span className="rounded-full bg-[#fff1f5] px-3 py-1 text-xs font-semibold">Power BI Reporting</span>
            </div>
            <span className="rounded-md bg-[#fff1f5] px-4 py-2 text-center text-sm font-bold text-[#f0184f]">{match}</span>
          </Link>
        ))}
      </section>

      <section className="mt-9 rounded-md border border-black/5 bg-white p-7 shadow-sm">
        <h3 className="text-lg font-bold">Recommended Next Steps</h3>
        <div className="mt-6 grid gap-5 lg:grid-cols-4">
          {nextSteps.map(([title, detail], index) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-[#fff1f5] text-[#f0184f]">
                {index === 1 ? <UsersRound /> : index === 2 ? <LineChart /> : index === 3 ? <Target /> : <BookOpen />}
              </span>
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-black/55">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-9 mb-4 flex flex-wrap items-center justify-between gap-5 rounded-md bg-[#fff1f5] px-8 py-7">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#f0184f]">
            <UsersRound size={30} />
          </span>
          <div>
            <h3 className="text-xl font-black">Your career is evolving. Keep building.</h3>
            <p className="mt-1 text-sm text-black/55">Update your profile and track your progress over time.</p>
          </div>
        </div>
        <button className="rounded-md bg-[#f0184f] px-7 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(240,24,79,0.25)] transition hover:bg-[#d91445]">
          Upload New Achievement
        </button>
      </section>
      </main>
    </div>
  );
}
