"use client";

import { useState } from "react";
import {
  BarChart3,
  Bell,
  Building2,
  CircleHelp,
  Edit3,
  ExternalLink,
  FileText,
  GraduationCap,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import { Badge } from "@/components/ui/badge";

// ─── Theme ────────────────────────────────────────────────────────────────────

const theme = {
  rose1: "#F04D7A",
  rose2: "#E00046",
  rose4: "#B80039",
  soft: "#FFF2F6",
  line: "#F5CBD6",
} as const;

// ─── Helper components ────────────────────────────────────────────────────────

function GitHubLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.16c-3.2.7-3.88-1.38-3.88-1.38-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18A11.1 11.1 0 0 1 12 6c.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.42-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.18c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function ProfileInfoRow({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-4 text-[#081433]">
      <Icon className="h-5 w-5 shrink-0 text-[#38445C]" />
      <p className="text-sm font-semibold leading-6">{text}</p>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  variant = "ghost",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "ghost" | "outline";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-extrabold transition hover:scale-[1.015] active:scale-[0.985]";

  if (variant === "outline") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} border px-3 py-2 text-xs hover:bg-pink-50`}
        style={{ borderColor: theme.line, color: theme.rose2 }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} px-2 py-1 text-sm hover:bg-pink-50`}
      style={{ color: theme.rose2 }}
    >
      {children}
    </button>
  );
}

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  showEdit?: boolean;
  showAdd?: boolean;
  onEdit?: () => void;
  onAdd?: () => void;
}

function ProfileSection({
  title,
  children,
  showEdit = false,
  showAdd = false,
  onEdit,
  onAdd,
}: ProfileSectionProps) {
  return (
    <div className="rounded-2xl border bg-white px-7 py-5 shadow-sm" style={{ borderColor: "#E5E8F0" }}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className="text-xl font-black text-[#081433]">{title}</h2>
        <div className="flex items-center gap-3 text-[#081433]">
          {showAdd && (
            <ActionButton onClick={onAdd ?? (() => {})}>
              <Plus className="h-4 w-4" />
              Add
            </ActionButton>
          )}

          {showEdit && (
            <ActionButton onClick={onEdit ?? (() => {})}>
              <Edit3 className="h-4 w-4" />
              Edit
            </ActionButton>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

interface ExperienceItemProps {
  icon: "chart" | "lab";
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  skills: string;
}

function ExperienceItem({ icon, title, company, period, location, description, skills }: ExperienceItemProps) {
  return (
    <div className="flex gap-5">
      <div
        className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-xl shadow-sm"
        style={{
          background:
            icon === "chart"
              ? "linear-gradient(135deg, #140038, #43227A)"
              : "linear-gradient(135deg, #0A9B8D, #117C72)",
        }}
      >
        {icon === "chart" ? (
          <BarChart3 className="h-7 w-7 text-white" />
        ) : (
          <Sparkles className="h-7 w-7 text-white" />
        )}
      </div>
      <div>
        <h3 className="text-lg font-black text-[#081433]">{title}</h3>
        <p className="mt-1 text-sm font-semibold text-[#081433]">{company}</p>
        <p className="mt-1 text-sm font-medium text-[#081433]">{period} · {location}</p>
        <p className="mt-2 text-sm font-medium leading-6 text-[#081433]">{description}</p>
        <div className="mt-2 flex items-center gap-3 text-sm text-[#081433]">
          <span className="h-2.5 w-2.5 rotate-45 rounded-sm bg-[#081433]" />
          <p><span className="font-black">Skills:</span> {skills}</p>
        </div>
      </div>
    </div>
  );
}

interface SideDocumentCardProps {
  title: string;
  icon: LucideIcon;
  button: string;
  items: { name: string; meta: string }[];
  footer: string;
  onAction: () => void;
}

function SideDocumentCard({ title, icon: Icon, button, items, footer, onAction }: SideDocumentCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#E5E8F0" }}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: theme.soft }}>
            <Icon className="h-5 w-5" style={{ color: theme.rose2 }} />
          </div>
          <h2 className="text-lg font-black text-[#081433]">{title}</h2>
        </div>

        <ActionButton variant="outline" onClick={onAction}>
          {button}
        </ActionButton>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-3 rounded-xl border p-4" style={{ borderColor: "#E5E8F0" }}>
            <FileText className="h-7 w-7 shrink-0" style={{ color: theme.rose2 }} />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#081433]">{item.name}</p>
              <p className="mt-1 text-sm font-medium text-[#46536D]">{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs font-medium text-[#46536D]">{footer}</p>
    </div>
  );
}

function ActionModal({
  title,
  description,
  onClose,
}: {
  title: string;
  description: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-2xl" style={{ borderColor: "#E5E8F0" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#081433]">{title}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-[#46536D]">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-pink-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" style={{ color: theme.rose2 }} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#46536D]">Title</span>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-4 text-sm font-medium outline-none transition focus:border-[#E00046]"
              style={{ borderColor: "#E5E8F0" }}
              placeholder="Enter title"
            />
          </label>

          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#46536D]">Details</span>
            <textarea
              className="mt-2 min-h-28 w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition focus:border-[#E00046]"
              style={{ borderColor: "#E5E8F0" }}
              placeholder="Add profile details here"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-5 py-3 text-sm font-extrabold transition hover:bg-gray-50"
            style={{ borderColor: "#E5E8F0", color: "#081433" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-3 text-sm font-extrabold text-white shadow-lg transition hover:scale-[1.015] active:scale-[0.985]"
            style={{ background: theme.rose2 }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────

export default function UserProfile() {
  const [modal, setModal] = useState<{ title: string; description: string } | null>(null);

  const openModal = (title: string, description: string) => {
    setModal({ title, description });
  };

  const profile = {
    name: "Alex Lee",
    title: "Final Year Computer Science Student",
    email: "alex.lee@email.com",
    phone: "+60 12-345 6789",
    university: "Asia Pacific University",
    course: "Computer Science",
    specialisation: "Data Analytics",
    location: "Kuala Lumpur, Malaysia",
  };

  const skills = [
    "Python", "SQL", "Power BI", "Excel",
    "Data Analysis", "Data Visualization",
    "Communication", "Problem Solving",
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfc] text-[#081433]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr_320px]">

        {/* Left sidebar */}
        <aside>
          <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "#E5E8F0" }}>
            <div className="flex flex-col items-center text-center">
              <div
                className="flex h-36 w-36 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(180deg, #FDE0E8, #FCEEF3)" }}
              >
                <div className="relative h-24 w-24">
                  <div
                    className="absolute left-1/2 top-2 h-14 w-14 -translate-x-1/2 rounded-full"
                    style={{ background: `linear-gradient(180deg, ${theme.rose1}, ${theme.rose2})` }}
                  />
                  <div
                    className="absolute bottom-0 left-1/2 h-14 w-24 -translate-x-1/2 rounded-t-full"
                    style={{ background: `linear-gradient(180deg, ${theme.rose1}, ${theme.rose2})` }}
                  />
                </div>
              </div>
              <h1 className="mt-6 text-3xl font-black tracking-tight text-[#081433]">{profile.name}</h1>
              <p className="mt-2 text-sm font-medium text-[#46536D]">{profile.title}</p>
              <div
                className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold"
                style={{ background: theme.soft, color: theme.rose2 }}
              >
                <UserRound className="h-4 w-4" />
                Candidate Profile
              </div>
            </div>

            <div className="my-6 h-px bg-[#E8ECF2]" />

            <div className="space-y-5">
              <ProfileInfoRow icon={Building2} text={profile.university} />
              <ProfileInfoRow icon={FileText} text={profile.course} />
              <ProfileInfoRow icon={GraduationCap} text={`Specialisation: ${profile.specialisation}`} />
              <ProfileInfoRow icon={MapPin} text={profile.location} />
            </div>

            <div className="my-6 h-px bg-[#E8ECF2]" />

            <div className="space-y-5">
              <ProfileInfoRow icon={Bell} text={profile.email} />
              <ProfileInfoRow icon={CircleHelp} text={profile.phone} />
            </div>

            <Link
              href="/?view=living-portfolio"
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border-2 px-5 py-3.5 text-sm font-extrabold transition hover:scale-[1.015] hover:bg-pink-50 active:scale-[0.985]"
              style={{ borderColor: theme.rose2, color: theme.rose2 }}
            >
              <ExternalLink className="h-4 w-4" />
              View Living Portfolio
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <section className="space-y-3">
          <ProfileSection
            title="About"
            showEdit
            onEdit={() => openModal("Edit About", "Update the personal summary shown on the user profile.")}
          >
            <p className="max-w-4xl text-sm font-medium leading-7 text-[#081433]">
              Enthusiastic final year Computer Science student with a strong interest in data analytics,
              dashboard development, and turning data into actionable insights. Enjoy solving real world
              problems with data and building tools that help drive better decisions.
            </p>
          </ProfileSection>

          <ProfileSection
            title="Experience"
            showEdit
            showAdd
            onEdit={() => openModal("Edit Experience", "Update existing work experience details.")}
            onAdd={() => openModal("Add Experience", "Add a new work experience entry to the profile.")}
          >
            <ExperienceItem
              icon="chart"
              title="Junior Data Analyst Intern"
              company="Nova Insights"
              period="Jun 2025 – Aug 2025"
              location="Kuala Lumpur, Malaysia"
              description="Built dashboard reports and performed data analysis to support business insights."
              skills="SQL, Power BI, Excel"
            />
            <div className="my-4 h-px bg-[#E8ECF2]" />
            <ExperienceItem
              icon="lab"
              title="Research Assistant Intern"
              company="Bright Labs"
              period="Jan 2025 – Apr 2025"
              location="Kuala Lumpur, Malaysia"
              description="Cleaned and prepared datasets and supported analytics tasks for research projects."
              skills="Python, Data Cleaning, Reporting"
            />
          </ProfileSection>

          <ProfileSection
            title="Education"
            showEdit
            showAdd
            onEdit={() => openModal("Edit Education", "Update education details such as university, degree, and graduation date.")}
            onAdd={() => openModal("Add Education", "Add another education record to the profile.")}
          >
            <div className="flex items-center gap-5">
              <div
                className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl"
                style={{ background: theme.soft }}
              >
                <GraduationCap className="h-9 w-9" style={{ color: theme.rose2 }} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#081433]">
                  Asia Pacific University of Technology and Innovation (APU)
                </h3>
                <p className="mt-1 text-sm font-medium text-[#081433]">Bachelor of Computer Science</p>
                <p className="mt-1 text-sm font-medium text-[#081433]">Specialisation: Data Analytics</p>
                <p className="mt-1 text-sm font-medium text-[#081433]">Expected Graduation: May 2026</p>
              </div>
            </div>
          </ProfileSection>

          <ProfileSection
            title="Skills"
            showEdit
            showAdd
            onEdit={() => openModal("Edit Skills", "Update the existing skills shown on the profile.")}
            onAdd={() => openModal("Add Skill", "Add a new skill to strengthen the career profile.")}
          >
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="min-w-[96px] justify-center rounded-lg border px-5 py-2.5 text-xs font-extrabold"
                  style={{ borderColor: theme.line, color: theme.rose2, background: "#FFF7FA" }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </ProfileSection>
        </section>

        {/* Right sidebar */}
        <aside className="space-y-4">
          <SideDocumentCard
            title="Resume / CV"
            icon={FileText}
            button="Update"
            footer="Last updated 2 days ago"
            onAction={() => openModal("Update Resume / CV", "Upload or replace the resume file connected to this profile.")}
            items={[{ name: "Alex_Lee_Resume.pdf", meta: "PDF · 231 KB" }]}
          />
          <SideDocumentCard
            title="Certificates"
            icon={ShieldCheck}
            button="Add Certificate"
            footer="2 certificates added"
            onAction={() => openModal("Add Certificate", "Add a new certificate that can later be reflected in the Living Portfolio.")}
            items={[
              { name: "Google Data Analytics Certificate.pdf", meta: "PDF · 198 KB" },
              { name: "Microsoft Power BI Data Analyst.pdf", meta: "PDF · 215 KB" },
            ]}
          />

          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "#E5E8F0" }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: theme.soft }}>
                  <ExternalLink className="h-5 w-5" style={{ color: theme.rose2 }} />
                </div>
                <h2 className="text-lg font-black text-[#081433]">Portfolio</h2>
              </div>

              <ActionButton
                variant="outline"
                onClick={() => openModal("Edit Portfolio Link", "Update the GitHub or portfolio link connected to this profile.")}
              >
                Edit Link
              </ActionButton>
            </div>
            <div className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: "#E5E8F0" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#081433] text-white">
                  <GitHubLogo className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#081433]">github.com/alexlee</p>
                  <p className="mt-1 text-xs font-medium text-[#46536D]">Personal portfolio and projects</p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4" style={{ color: theme.rose2 }} />
            </div>
          </div>
        </aside>
        </div>
      </main>

      {modal && (
        <ActionModal
          title={modal.title}
          description={modal.description}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
