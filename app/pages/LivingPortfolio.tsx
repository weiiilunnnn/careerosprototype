"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
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
  Printer,
  X,
  LucideIcon,
} from "lucide-react";
import { candidateLivingCv } from "@/lib/candidateLivingCvData";
import CompanyLogo from "@/components/CompanyLogo";
import {
  getAnimalRoleInTrio,
  getBlendInterpretation,
  getWorkAnimal,
} from "@/lib/workAnimals";

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

type PrintTemplateId = "executive" | "ats" | "graduate";

const printTemplates: Array<{
  id: PrintTemplateId;
  label: string;
  title: string;
  description: string;
}> = [
  {
    id: "executive",
    label: "Executive evidence CV",
    title: "Executive evidence CV",
    description:
      "A polished evidence-first CV that keeps the profile summary, career alignment, projects, skills, and experience together.",
  },
  {
    id: "ats",
    label: "ATS classic CV",
    title: "ATS classic CV",
    description:
      "A clean recruiter-friendly print layout with simple borders, high contrast text, and minimal visual styling.",
  },
  {
    id: "graduate",
    label: "Graduate portfolio CV",
    title: "Graduate portfolio CV",
    description:
      "A project-forward graduate CV that gives extra emphasis to portfolio evidence, skills, and early-career potential.",
  },
];

const profile = candidateLivingCv;
const workAnimal = getWorkAnimal(profile.workAnimal);
const secondaryWorkAnimal = getWorkAnimal(profile.secondaryWorkAnimal);
const shadowWorkAnimal = getWorkAnimal(profile.shadowWorkAnimal);
const blend = getBlendInterpretation({
  primary: profile.workAnimal,
  secondary: profile.secondaryWorkAnimal,
  shadow: profile.shadowWorkAnimal,
});
const careerPaths = candidateLivingCv.careerPaths;
const skills = candidateLivingCv.skills;
const projects = candidateLivingCv.projects;
const timeline = candidateLivingCv.experience;

const projectIcons: LucideIcon[] = [PanelsTopLeft, Target, Trophy];

const dimensionPoles = [
  { key: "pace", label: "Pace", left: "Deliberate", right: "Decisive" },
  { key: "purpose", label: "Purpose", left: "Maintainer", right: "Builder" },
  { key: "people", label: "People", left: "Independent", right: "Relational" },
  { key: "perspective", label: "Perspective", left: "Concrete", right: "Visionary" },
] as const;

function getDimensionLean(value: number) {
  const distance = Math.abs(value - 50);

  if (distance >= 30) return "Most lean strongly";
  if (distance >= 18) return "Most lean clearly";
  return "Most lean slightly";
}

function CvSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cv-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function PrintCvDocument({
  templateId,
  preview = false,
}: {
  templateId: PrintTemplateId;
  preview?: boolean;
}) {
  const bestPath = careerPaths[0];
  const workStyleSummary = [
    workAnimal ? `Primary: ${workAnimal.name} - ${workAnimal.short}` : null,
    secondaryWorkAnimal ? `Secondary: ${secondaryWorkAnimal.name}` : null,
    shadowWorkAnimal ? `Shadow: ${shadowWorkAnimal.name}` : null,
  ].filter(Boolean);

  return (
    <article
      className={`living-print-document cv-template-${templateId} ${
        preview ? "is-preview" : ""
      }`}
    >
      <header className="cv-header">
        <div>
          <p className="cv-kicker">
            {templateId === "ats"
              ? profile.role
              : templateId === "graduate"
                ? "Graduate Portfolio CV"
                : "Evidence-Based Career Profile"}
          </p>
          <h1>{profile.name}</h1>
          <p className="cv-role">{profile.direction}</p>
          <p className="cv-contact">
            {profile.location} | {profile.educationLabel} | {profile.experienceLabel} experience
          </p>
        </div>
        <div className="cv-score">
          <strong>{profile.profileStrength}%</strong>
          <span>Profile strength</span>
        </div>
      </header>

      <div className="cv-body">
        <main className="cv-main">
          {templateId === "graduate" ? (
            <CvSection title="Portfolio Projects">
              <div className="cv-list">
                {projects.map((project) => (
                  <div key={project.title} className="cv-item">
                    <div className="cv-item-head">
                      <h3>{project.title}</h3>
                      <span>{project.date}</span>
                    </div>
                    <p className="cv-item-meta">{project.type}</p>
                    <p>{project.description}</p>
                    <p className="cv-tags">{project.tags.join(" | ")}</p>
                  </div>
                ))}
              </div>
            </CvSection>
          ) : null}

          {templateId === "graduate" ? (
            <CvSection title="Skills Evidence">
              <div className="cv-skill-groups">
                <div>
                  <h3>Technical</h3>
                  <p>{skills.technical.join(" | ")}</p>
                </div>
                <div>
                  <h3>Tools</h3>
                  <p>{skills.tools.join(" | ")}</p>
                </div>
                <div>
                  <h3>Soft Skills</h3>
                  <p>{skills.soft.join(" | ")}</p>
                </div>
              </div>
            </CvSection>
          ) : null}

          <CvSection title={templateId === "graduate" ? "Candidate Summary" : "Professional Summary"}>
            <p>{profile.summary}</p>
          </CvSection>

          <CvSection title={templateId === "graduate" ? "Early Career Direction" : "Career Direction"}>
            <div className="cv-list compact">
              <div className="cv-item">
                <h3>{profile.title}</h3>
                <p className="cv-item-meta">{profile.role}</p>
                <p>{profile.trajectory}</p>
              </div>
            </div>
          </CvSection>

          <CvSection title={templateId === "graduate" ? "Best-Fit Pathways" : "Career Path Alignment"}>
            <div className="cv-meter-list">
              {careerPaths.map((path) => (
                <div key={path.title} className="cv-meter-row">
                  <div>
                    <strong>{path.title}</strong>
                    {path.label ? <span>{path.label}</span> : null}
                  </div>
                  <p>{path.match}%</p>
                </div>
              ))}
            </div>
          </CvSection>

          {templateId !== "graduate" ? (
            <CvSection title="Impact Evidence">
              <div className="cv-list">
                {projects.map((project) => (
                  <div key={project.title} className="cv-item">
                    <div className="cv-item-head">
                      <h3>{project.title}</h3>
                      <span>{project.date}</span>
                    </div>
                    <p className="cv-item-meta">{project.type}</p>
                    <p>{project.description}</p>
                    <p className="cv-tags">{project.tags.join(" | ")}</p>
                  </div>
                ))}
              </div>
            </CvSection>
          ) : null}

          <CvSection title="Experience">
            <div className="cv-list">
              {timeline.map((item) => (
                <div key={`${item.company}-${item.title}`} className="cv-item">
                  <div className="cv-item-head">
                    <h3>{item.title}</h3>
                    <span>{item.period}</span>
                  </div>
                  <p className="cv-item-meta">
                    {item.company} | {item.duration}
                  </p>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </CvSection>
        </main>

        <aside className="cv-side">
          <CvSection title="Career Fit">
            <div className="cv-fit">
              <strong>{bestPath?.match ?? profile.profileStrength}%</strong>
              <span>{bestPath?.title ?? profile.role}</span>
            </div>
            <p>{profile.trajectory}</p>
          </CvSection>

          {templateId !== "graduate" ? (
            <>
              <CvSection title="Technical Skills">
                <div className="cv-chip-list">
                  {skills.technical.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </CvSection>

              <CvSection title="Tools">
                <div className="cv-chip-list">
                  {skills.tools.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </CvSection>

              <CvSection title="Soft Skills">
                <div className="cv-chip-list">
                  {skills.soft.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </CvSection>
            </>
          ) : null}

          <CvSection title="Working Style">
            <div className="cv-list compact">
              {workStyleSummary.length > 0 ? (
                workStyleSummary.map((item) => (
                  <p key={item}>{item}</p>
                ))
              ) : (
                <p>Work trait result available in CareerOS.</p>
              )}
              <p>{blend.title}: {blend.summary}</p>
            </div>
          </CvSection>
        </aside>
      </div>
    </article>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: theme.border }}
    >
      <div className="flex min-h-[76px] flex-col items-start justify-between gap-4 rounded-t-2xl border-b border-[#F1F3F7] bg-white px-5 py-4 shadow-[0_8px_14px_rgba(21,34,56,0.035)] sm:flex-row sm:items-center sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.soft }}
          >
            <Icon className="h-5 w-5" style={{ color: theme.rose2 }} />
          </div>

          <h2 className="text-lg font-semibold leading-tight text-[#152238]">
            {title}
          </h2>
        </div>

      </div>

      <div className="px-5 py-5 sm:px-7">{children}</div>
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
        <CompanyLogo company={company} size="sm" />

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
  const [showTraitSummary, setShowTraitSummary] = useState(false);
  const [selectedPrintTemplate, setSelectedPrintTemplate] =
    useState<PrintTemplateId>("executive");
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const activeTemplate =
    printTemplates.find((template) => template.id === selectedPrintTemplate) ??
    printTemplates[0];

  function handlePrint() {
    window.print();
  }

  return (
    <div
      className={`living-portfolio-page living-print-template-${selectedPrintTemplate} min-h-screen bg-[#fbfbfc] text-[#152238]`}
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
                <div className="mb-5 flex flex-wrap items-center gap-2">
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
                    {profile.workAnimalTestCompleted ? `${profile.profileStrength}% Strong` : "Incomplete"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="living-print-control mb-5 rounded-2xl border bg-white p-5 shadow-sm"
          style={{ borderColor: theme.border }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: theme.rose2 }}>
                Formal CV print
              </p>
              <h2 className="mt-2 text-xl font-semibold" style={{ color: theme.navy }}>
                Preview template before printing
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6" style={{ color: theme.muted }}>
                Choose the CV design in a preview window before sending the Living Portfolio to print.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setIsPrintPreviewOpen(true)}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5"
                style={{ backgroundColor: theme.rose2 }}
              >
                <Printer className="h-4 w-4" />
                Print CV
              </button>
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

                <div className="mt-6 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
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

          <SectionCard title="Menagerie Method" icon={Sparkles}>
            <div
              className="rounded-xl border bg-white p-5"
              style={{ borderColor: profile.workAnimalTestCompleted ? theme.line : theme.border }}
            >
              {profile.workAnimalTestCompleted && workAnimal ? (
                <div className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
                  <div className="rounded-2xl bg-[#101727] p-6 text-white">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-4xl">
                        {workAnimal.emoji}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                          Your work animal
                        </p>
                        <h3 className="mt-1 text-3xl font-semibold text-white">
                          The {workAnimal.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-white/70">
                          {workAnimal.archetype} · prototype saved result
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {dimensionPoles.map((dimension) => {
                        const value = workAnimal.dimensions[dimension.key];
                        return (
                        <div key={dimension.key} className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-white/78">{dimension.label}</span>
                            <span className="text-xs font-semibold text-white/45">{getDimensionLean(value)}</span>
                          </div>
                          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/12">
                            <div
                              className="h-full rounded-full bg-[#F04D7A]"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-xs font-semibold text-white/55">
                            <span>{dimension.left}</span>
                            <span>{dimension.right}</span>
                          </div>
                        </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        { label: "Primary" as const, animal: workAnimal },
                        { label: "Secondary" as const, animal: secondaryWorkAnimal },
                        { label: "Shadow" as const, animal: shadowWorkAnimal },
                      ].map(({ label, animal }) => (
                        <div key={label} className="rounded-2xl border border-white/12 bg-white/[0.07] p-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                            {label}
                          </p>
                          <p className="mt-2 text-base font-semibold text-white">
                            {animal ? `${animal.emoji} ${animal.name}` : "Unknown"}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/55">
                            {getAnimalRoleInTrio(label)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-xl border border-white/12 bg-white/[0.07] px-4 py-3 text-sm leading-6 text-white/65">
                      This result is read-only in the Living Portfolio. Retake or update the Menagerie Method from your Profile.
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <p className="text-sm leading-7" style={{ color: theme.muted }}>
                      {workAnimal.short}
                    </p>

                    <div className="rounded-xl border bg-white p-4" style={{ borderColor: theme.border }}>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: theme.rose2 }}>
                        Blend interpretation
                      </p>
                      <h3 className="mt-2 text-lg font-semibold" style={{ color: theme.navy }}>
                        {blend.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7" style={{ color: theme.muted }}>
                        {blend.summary}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowTraitSummary((value) => !value)}
                        className="mt-4 inline-flex rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-[#FDE7EE]"
                        style={{
                          borderColor: theme.line,
                          backgroundColor: theme.soft,
                          color: theme.rose2,
                        }}
                      >
                        {showTraitSummary ? "Hide full trait summary" : "View full trait summary"}
                      </button>
                      {showTraitSummary && (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-sm font-semibold text-emerald-700">What this gives you</p>
                            <div className="mt-2 space-y-2">
                              {blend.strengths.map((item) => (
                                <p key={item} className="rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-5" style={{ color: theme.navy }}>
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-rose-700">What to watch</p>
                            <div className="mt-2 space-y-2">
                              {blend.watchouts.map((item) => (
                                <p key={item} className="rounded-lg bg-rose-50 px-3 py-2 text-sm leading-5" style={{ color: theme.navy }}>
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border bg-[#F8FFF9] p-4" style={{ borderColor: "#BBF7D0" }}>
                        <p className="text-sm font-semibold text-emerald-700">You would thrive in</p>
                        <div className="mt-3 space-y-2">
                          {workAnimal.roles.slice(0, 3).map((role) => (
                            <p key={role} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold" style={{ color: theme.navy }}>
                              {role}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border bg-[#FFF7F7] p-4" style={{ borderColor: "#FECACA" }}>
                        <p className="text-sm font-semibold text-rose-700">You may struggle in</p>
                        <div className="mt-3 space-y-2">
                          {["HR Partner", "Head of People", "Public Speaker"].map((role) => (
                            <p key={role} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold" style={{ color: theme.navy }}>
                              {role}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#FFF2F6] p-4">
                      <p className="text-sm font-semibold" style={{ color: theme.navy }}>
                        CareerOS interpretation
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {[
                          ["Core strength", "Patient judgement under complexity"],
                          ["Best-fit work", "Research and analysis"],
                          ["Growth area", "Show the thinking earlier"],
                          ["Used for", "Job fit, blind spots, team compatibility, and supervisor preparation"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-lg bg-white px-3 py-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: theme.muted }}>
                              {label}
                            </p>
                            <p className="mt-1 text-sm font-semibold leading-5" style={{ color: theme.navy }}>
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-[1fr_220px] lg:items-center">
                  <div>
                    <h3 className="text-xl font-semibold" style={{ color: theme.navy }}>
                      Animal trait unknown
                    </h3>
                    <p className="mt-3 text-sm leading-7" style={{ color: theme.muted }}>
                      Your Living Portfolio is incomplete until the Menagerie Method test is finished. CareerOS will use it to explain role fit, working-style gaps, and supervisor preparation.
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FFF2F6] p-4 text-center">
                    <p className="text-3xl font-semibold" style={{ color: theme.rose2 }}>
                      76%
                    </p>
                    <p className="mt-1 text-sm font-semibold" style={{ color: theme.navy }}>
                      Profile complete
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Career Path Alignment"
            icon={Lightbulb}
          >
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
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

      <PrintCvDocument templateId={selectedPrintTemplate} />

      {isPrintPreviewOpen ? (
        <div className="living-print-control fixed inset-0 z-50 flex items-center justify-center bg-[#081433]/55 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#E5E8F0] bg-white shadow-[0_28px_80px_rgba(8,20,51,0.25)]">
            <div className="flex flex-col gap-4 border-b border-[#E5E8F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: theme.rose2 }}>
                  Print preview
                </p>
                <h2 className="mt-1 text-xl font-semibold" style={{ color: theme.navy }}>
                  Select a CV template
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintPreviewOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E8F0] text-[#46536D] transition hover:bg-[#FFF2F6] hover:text-[#E00046]"
                aria-label="Close print preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[260px_1fr]">
              <div className="space-y-2">
                {printTemplates.map((template) => {
                  const selected = template.id === selectedPrintTemplate;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedPrintTemplate(template.id)}
                      className="w-full rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
                      style={{
                        borderColor: selected ? theme.line : theme.border,
                        backgroundColor: selected ? theme.soft : "#fff",
                      }}
                    >
                      <p
                        className="text-sm font-semibold"
                        style={{ color: selected ? theme.rose2 : theme.navy }}
                      >
                        {template.label}
                      </p>
                      <p className="mt-2 text-xs leading-5" style={{ color: theme.muted }}>
                        {template.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-[#E5E8F0] bg-[#F8FAFC] p-4">
                <PrintCvDocument templateId={selectedPrintTemplate} preview />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-[#46536D]">
                    Selected: <span className="font-bold text-[#081433]">{activeTemplate.label}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5"
                    style={{ backgroundColor: theme.rose2 }}
                  >
                    <Printer className="h-4 w-4" />
                    Print this template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
