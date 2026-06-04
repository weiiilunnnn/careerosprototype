"use client";

import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  FileText,
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
import Navbar from "@/components/navbar/Navbar";

const theme = {
  navy: "#081433",
  muted: "#46536D",
  rose1: "#F04D7A",
  rose2: "#E00046",
  rose3: "#D81B3F",
  soft: "#FFF2F6",
  soft2: "#FDE7EE",
  line: "#F5CBD6",
  border: "#E5E8F0",
  page: "#FFFFFF",
} as const;

const profile = {
  name: "Alex Lee",
  title: "Final Year Computer Science Student",
  direction: "Data & Analytics Professional",
  summary:
    "Analytics leaning computer science student with strong interest in data analysis, dashboard development, and business reporting. The portfolio reflects practical evidence from work experience, projects, certificates, and skills that support a future path in analytics.",
  experience: "1 year 5 months",
  education: "BSc Computer Science",
  location: "Kuala Lumpur",
  profileStrength: 82,
};

const careerPaths = [
  {
    title: "Data Analyst",
    match: 82,
    label: "Best Fit",
  },
  {
    title: "Business Intelligence Analyst",
    match: 76,
  },
  {
    title: "Data Scientist",
    match: 58,
  },
  {
    title: "Analytics Engineer",
    match: 45,
  },
];

const skills = {
  technical: ["Python", "SQL", "Data Analysis", "Power BI", "Excel", "Machine Learning"],
  tools: ["Jupyter", "Tableau", "Power Query", "Google Sheets"],
  soft: ["Communication", "Problem Solving", "Critical Thinking", "Teamwork"],
};

const projects = [
  {
    icon: PanelsTopLeft,
    title: "Sales Performance Dashboard",
    type: "Featured Project",
    date: "May 2025",
    description:
      "Built a Power BI dashboard that visualizes regional sales trends and KPIs to support data driven business decisions.",
    tags: ["Power BI", "DAX", "Data Visualization"],
  },
  {
    icon: Target,
    title: "Customer Segmentation Analysis",
    type: "Analytics Project",
    date: "Feb 2025",
    description:
      "Analyzed customer data using Python and clustering techniques to identify high value customer segments.",
    tags: ["Python", "Pandas", "Scikit Learn"],
  },
  {
    icon: Trophy,
    title: "Hackathon Analytics Challenge",
    type: "Achievement",
    date: "Nov 2024",
    description:
      "Completed an analytics challenge by preparing insights from messy datasets and presenting findings to judges.",
    tags: ["Analytics", "Presentation", "Problem Solving"],
  },
];

const timeline = [
  {
    title: "Junior Data Analyst Intern",
    company: "Tech Solutions Sdn Bhd",
    period: "Jan 2025 - Present",
    duration: "7 months",
    description: "Built dashboards and automated reports to monitor key business metrics.",
  },
  {
    title: "Data Analytics Intern",
    company: "Innovatech Malaysia",
    period: "Jun 2024 - Dec 2024",
    duration: "7 months",
    description: "Supported data cleaning, analysis, and visualization for marketing campaigns.",
  },
];

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
      className="rounded-2xl border bg-white p-6 shadow-sm"
      style={{ borderColor: theme.border }}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.soft }}
          >
            <Icon className="h-5 w-5" style={{ color: theme.rose2 }} />
          </div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: theme.navy }}>
            {title}
          </h2>
        </div>

        {action && (
          <button
            className="flex items-center gap-2 text-sm font-bold transition hover:opacity-80"
            style={{ color: theme.rose2 }}
          >
            {action}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {children}
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
        <p className="text-xs font-bold" style={{ color: theme.muted }}>
          {label}
        </p>
        <p className="mt-0.5 text-sm font-black" style={{ color: theme.navy }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-lg border px-4 py-2 text-xs font-extrabold"
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
          <h3 className="text-base font-black" style={{ color: theme.navy }}>
            {title}
          </h3>
          <p className="mt-2 text-sm font-bold" style={{ color: theme.navy }}>
            {match}% Match
          </p>
        </div>

        {label && (
          <span
            className="rounded-md px-2.5 py-1 text-xs font-black text-white"
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

function ProjectItem({
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
      className="flex gap-4 border-b px-1 py-5 last:border-b-0"
      style={{ borderColor: theme.border }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${theme.rose1}, ${theme.rose2})`,
        }}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black" style={{ color: theme.navy }}>
                {title}
              </h3>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-bold"
                style={{ backgroundColor: theme.soft, color: theme.rose2 }}
              >
                {type}
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6" style={{ color: theme.navy }}>
              {description}
            </p>
          </div>

          <p className="text-sm font-semibold" style={{ color: theme.muted }}>
            {date}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: "#F1F3F7", color: theme.muted }}
            >
              {tag}
            </span>
          ))}
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
    <div className="relative flex gap-5 pb-8 last:pb-0">
      {!isLast && (
        <div
          className="absolute left-[7px] top-5 h-full w-px"
          style={{ backgroundColor: theme.line }}
        />
      )}

      <div
        className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full"
        style={{ backgroundColor: theme.rose2 }}
      />

      <div>
        <h3 className="text-base font-black" style={{ color: theme.navy }}>
          {title}
        </h3>
        <p className="mt-1 text-sm font-bold" style={{ color: theme.navy }}>
          {company}
        </p>
        <p className="mt-1 text-sm font-medium" style={{ color: theme.muted }}>
          {period} · {duration}
        </p>
        <p className="mt-2 text-sm font-medium leading-6" style={{ color: theme.navy }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function LivingPortfolio() {
  return (
    <div className="min-h-screen bg-[#fbfbfc] text-[#081433]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight" style={{ color: theme.navy }}>
            Living Portfolio
          </h1>
          <p className="mt-3 max-w-3xl text-base font-medium" style={{ color: theme.muted }}>
            Your career story, always up to date. Profile updates are reflected here to show your
            skills, evidence, growth, and realistic career path alignment.
          </p>
        </div>

        <div className="space-y-5">
          {/* Career Profile Summary */}
          <SectionCard title="Career Profile Summary" icon={UserRound}>
            <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
              <div
                className="rounded-xl border p-5"
                style={{ borderColor: theme.border }}
              >
                <p className="text-sm font-bold" style={{ color: theme.muted }}>
                  Career Direction
                </p>
                <h3 className="mt-2 text-xl font-black" style={{ color: theme.navy }}>
                  {profile.direction}
                </h3>
                <p className="mt-3 max-w-4xl text-sm font-medium leading-7" style={{ color: theme.navy }}>
                  {profile.summary}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoPill
                    icon={BriefcaseBusiness}
                    label="Experience"
                    value={profile.experience}
                  />
                  <InfoPill
                    icon={GraduationCap}
                    label="Education"
                    value={profile.education}
                  />
                  <InfoPill
                    icon={MapPin}
                    label="Location"
                    value={profile.location}
                  />
                  <InfoPill
                    icon={Sparkles}
                    label="Status"
                    value="Growing"
                  />
                </div>
              </div>

              <div
                className="flex flex-col items-center justify-center rounded-xl border p-6 text-center"
                style={{ borderColor: theme.border }}
              >
                <div className="relative grid h-32 w-32 place-items-center rounded-full">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="#F5D9E1"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke={theme.rose2}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${profile.profileStrength * 3.02} 302`}
                    />
                  </svg>
                  <span className="absolute text-2xl font-black" style={{ color: theme.navy }}>
                    {profile.profileStrength}%
                  </span>
                </div>
                <p className="mt-4 text-sm font-bold" style={{ color: theme.muted }}>
                  Profile Strength
                </p>
                <p className="mt-1 text-lg font-black" style={{ color: theme.rose2 }}>
                  Strong
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Career Path Alignment */}
          <SectionCard title="Career Path Alignment" icon={Lightbulb} action="View full analysis">
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

            <div className="mt-5 flex items-center gap-2 text-sm font-medium" style={{ color: theme.muted }}>
              <CircleHelp className="h-4 w-4" />
              <p>
                Scores are based on your skills, experience, uploaded evidence, and similar career trajectories.
              </p>
            </div>
          </SectionCard>

          {/* Two Column Area */}
          <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            {/* Skills Proven */}
            <SectionCard title="Skills Proven" icon={ShieldCheck} action="View all skills">
              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-sm font-black" style={{ color: theme.navy }}>
                    Technical Skills
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {skills.technical.map((skill) => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-black" style={{ color: theme.navy }}>
                    Tools
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {skills.tools.map((skill) => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-black" style={{ color: theme.navy }}>
                    Soft Skills
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {skills.soft.map((skill) => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Experience Timeline */}
            <SectionCard title="Experience Timeline" icon={CalendarDays} action="View full timeline">
              <div className="pl-1">
                {timeline.map((item, index) => (
                  <TimelineItem
                    key={item.title}
                    {...item}
                    isLast={index === timeline.length - 1}
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Projects and Achievements */}
          <SectionCard title="Projects & Achievements" icon={Medal} action="View all">
            <div
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: theme.border }}
            >
              {projects.map((project) => (
                <ProjectItem key={project.title} {...project} />
              ))}
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}