"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  Lightbulb,
  MapPin,
  Medal,
  PanelsTopLeft,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  LucideIcon,
} from "lucide-react";
import { candidateLivingCv } from "@/lib/candidateLivingCvData";

const theme = {
  navy: "#081433",
  deepNavy: "#152238",
  muted: "#46536D",
  rose1: "#F04D7A",
  rose2: "#E00046",
  rose3: "#D81B3F",
  soft: "#FFF2F6",
  soft2: "#FDE7EE",
  line: "#F5CBD6",
  border: "#E5E8F0",
  page: "#fbfbfc",
  dark: "#0f0f0f",
} as const;

const profile = candidateLivingCv;
const careerPaths = candidateLivingCv.careerPaths;
const skills = candidateLivingCv.skills;
const projects = candidateLivingCv.projects;
const timeline = candidateLivingCv.experience;

const projectIcons: LucideIcon[] = [PanelsTopLeft, Target, Trophy];

function SectionCard({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  action?: string;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: theme.border }}
    >
      <div className="flex min-h-[76px] items-center justify-between gap-4 rounded-t-2xl border-b border-[#F1F3F7] bg-white px-7 py-4 shadow-[0_8px_14px_rgba(21,34,56,0.035)]">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.soft }}
          >
            <Icon className="h-5 w-5" style={{ color: theme.rose2 }} />
          </div>

          <h2 className="text-lg font-semibold leading-none text-[#152238]">
            {title}
          </h2>
        </div>

        {action && (
          <button
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold transition hover:opacity-80"
            style={{ color: theme.rose2 }}
          >
            {action}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="px-7 py-5">{children}</div>
    </section>
  );
}

function InfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3"
      style={{ borderColor: theme.border }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: theme.soft }}
      >
        <Icon className="h-5 w-5" style={{ color: theme.rose2 }} />
      </div>

      <div>
        <p className="text-xs font-semibold" style={{ color: theme.muted }}>
          {label}
        </p>
        <p
          className="mt-0.5 text-sm font-semibold"
          style={{ color: theme.navy }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-lg border px-4 py-2 text-xs font-semibold"
      style={{
        borderColor: theme.line,
        backgroundColor: "#FFF7FA",
        color: theme.rose2,
      }}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#F5D9E1]">
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${theme.rose1}, ${theme.rose2})`,
        }}
      />
    </div>
  );
}

function CareerPathCard({
  title,
  match,
  label,
}: {
  title: string;
  match: number;
  label?: string;
}) {
  return (
    <div
      className={`relative rounded-xl border p-5 ${
        label ? "bg-[#FFF7FA]" : "bg-white"
      }`}
      style={{ borderColor: label ? theme.rose1 : theme.border }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold" style={{ color: theme.navy }}>
            {title}
          </h3>
          <p
            className="mt-2 text-sm font-semibold"
            style={{ color: theme.navy }}
          >
            {match}% Match
          </p>
        </div>

        {label && (
          <span
            className="rounded-md px-2.5 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: theme.rose2 }}
          >
            {label}
          </span>
        )}
      </div>

      <ProgressBar value={match} />
    </div>
  );
}

function StrengthRing({ value }: { value: number }) {
  return (
    <div
      className="flex h-full min-h-[210px] flex-col items-center justify-center rounded-xl border bg-white p-5"
      style={{ borderColor: theme.border }}
    >
      <div
        className="flex h-32 w-32 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${theme.rose2} ${
            value * 3.6
          }deg, #F5D9E1 0deg)`,
        }}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white">
          <span
            className="text-2xl font-semibold"
            style={{ color: theme.navy }}
          >
            {value}%
          </span>
        </div>
      </div>

      <p className="mt-5 text-sm font-medium" style={{ color: theme.muted }}>
        Profile Strength
      </p>
      <p className="mt-1 text-base font-semibold" style={{ color: theme.rose2 }}>
        Strong
      </p>
    </div>
  );
}

function ProjectCard({
  icon: Icon,
  title,
  type,
  date,
  description,
  tags,
}: {
  icon: LucideIcon;
  title: string;
  type: string;
  date: string;
  description: string;
  tags: string[];
}) {
  return (
    <div
      className="rounded-xl border bg-white p-5"
      style={{ borderColor: theme.border }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: theme.soft }}
        >
          <Icon className="h-6 w-6" style={{ color: theme.rose2 }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: theme.rose2 }}
              >
                {type}
              </p>
              <h3
                className="mt-1 text-base font-semibold"
                style={{ color: theme.navy }}
              >
                {title}
              </h3>
            </div>

            <p className="text-sm font-medium" style={{ color: theme.muted }}>
              {date}
            </p>
          </div>

          <p className="mt-3 text-sm leading-6" style={{ color: theme.muted }}>
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <SkillTag key={tag}>{tag}</SkillTag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  company,
  period,
  duration,
  description,
  isLast,
}: {
  title: string;
  company: string;
  period: string;
  duration: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-5">
      <div className="flex flex-col items-center">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: theme.soft }}
        >
          <BriefcaseBusiness
            className="h-5 w-5"
            style={{ color: theme.rose2 }}
          />
        </div>

        {!isLast && <div className="mt-3 h-full w-px bg-[#E5E8F0]" />}
      </div>

      <div className="min-w-0 flex-1 pb-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3
              className="text-base font-semibold"
              style={{ color: theme.navy }}
            >
              {title}
            </h3>
            <p
              className="mt-1 text-sm font-medium"
              style={{ color: theme.navy }}
            >
              {company}
            </p>
            <p className="mt-1 text-sm" style={{ color: theme.muted }}>
              {period}
            </p>
          </div>

          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: theme.soft, color: theme.rose2 }}
          >
            {duration}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6" style={{ color: theme.muted }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function LivingPortfolio() {
  return (
    <div
      className="min-h-screen bg-[#fbfbfc] text-[#152238]"
      style={{
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        {/* Top image hero card */}
        <section
          className="mb-5 overflow-hidden rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: theme.border }}
        >
          <div className="relative min-h-[360px] overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(21,34,56,0.18)]">
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80"
              alt="People discussing a job portfolio and career growth"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#081433]/90 via-[#081433]/70 to-[#081433]/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081433]/60 via-transparent to-transparent" />

            <div className="relative z-10 flex min-h-[360px] flex-col justify-between px-8 py-8 text-white">
              <div>
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                    Profile intelligence
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                    Career growth
                  </span>
                </div>

                <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                  Living Portfolio
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
                  Your career story, always up to date. Profile updates are
                  reflected here to show your skills, evidence, growth, and
                  realistic career path alignment.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/[0.12] px-4 py-4 shadow-sm backdrop-blur-md">
                  <div className="mb-2 flex items-center gap-2 text-white/65">
                    <UserRound className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-[0.18em]">
                      Profile
                    </span>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {profile.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.12] px-4 py-4 shadow-sm backdrop-blur-md">
                  <div className="mb-2 flex items-center gap-2 text-white/65">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-[0.18em]">
                      Direction
                    </span>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {profile.direction}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.12] px-4 py-4 shadow-sm backdrop-blur-md">
                  <div className="mb-2 flex items-center gap-2 text-white/65">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-[0.18em]">
                      Strength
                    </span>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {profile.profileStrength}% Strong
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          <SectionCard title="Career Profile Summary" icon={UserRound}>
            <div className="grid gap-5 lg:grid-cols-[1fr_250px]">
              <div
                className="rounded-xl border bg-white p-5"
                style={{ borderColor: theme.border }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme.muted }}
                >
                  Career Direction
                </p>

                <h3
                  className="mt-2 text-xl font-semibold"
                  style={{ color: theme.navy }}
                >
                  {profile.direction}
                </h3>

                <p
                  className="mt-4 text-sm leading-7"
                  style={{ color: theme.navy }}
                >
                  {profile.summary}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoPill
                    icon={BriefcaseBusiness}
                    label="Experience"
                    value={profile.experienceLabel}
                  />
                  <InfoPill
                    icon={GraduationCap}
                    label="Education"
                    value={profile.educationLabel}
                  />
                  <InfoPill
                    icon={MapPin}
                    label="Location"
                    value={profile.location}
                  />
                  <InfoPill icon={Sparkles} label="Status" value="Growing" />
                </div>
              </div>

              <StrengthRing value={profile.profileStrength} />
            </div>
          </SectionCard>

          <SectionCard
            title="Career Path Alignment"
            icon={Lightbulb}
            action="View full analysis"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {careerPaths.map((path) => (
                <CareerPathCard
                  key={path.title}
                  title={path.title}
                  match={path.match}
                  label={path.label}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Skills Proven" icon={Medal}>
            <div className="grid gap-5 lg:grid-cols-3">
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: theme.navy }}
                >
                  Technical Skills
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.technical.map((skill) => (
                    <SkillTag key={skill}>{skill}</SkillTag>
                  ))}
                </div>
              </div>

              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: theme.navy }}
                >
                  Tools
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.tools.map((skill) => (
                    <SkillTag key={skill}>{skill}</SkillTag>
                  ))}
                </div>
              </div>

              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: theme.navy }}
                >
                  Soft Skills
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.soft.map((skill) => (
                    <SkillTag key={skill}>{skill}</SkillTag>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Projects and Achievements" icon={Trophy}>
            <div className="grid gap-4">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  icon={projectIcons[index] ?? PanelsTopLeft}
                  title={project.title}
                  type={project.type}
                  date={project.date}
                  description={project.description}
                  tags={project.tags}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Experience Timeline" icon={CalendarDays}>
            <div>
              {timeline.map((item, index) => (
                <TimelineItem
                  key={`${item.company}-${item.title}`}
                  title={item.title}
                  company={item.company}
                  period={item.period}
                  duration={item.duration}
                  description={item.description}
                  isLast={index === timeline.length - 1}
                />
              ))}
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}