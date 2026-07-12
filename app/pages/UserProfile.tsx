"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Edit3,
  Eye,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  X,
  LucideIcon,
} from "lucide-react";
import {
  getAnimalRoleInTrio,
  getBlendInterpretation,
  getWorkAnimal,
  type WorkAnimalSlug,
} from "@/lib/workAnimals";

const theme = {
  navy: "#081433",
  deepNavy: "#152238",
  darkerNavy: "#131f33",
  muted: "#46536D",
  rose1: "#F04D7A",
  rose2: "#E00046",
  rose3: "#D81B3F",
  rose4: "#B80039",
  soft: "#FFF2F6",
  soft2: "#FDE7EE",
  line: "#F5CBD6",
  border: "#E5E8F0",
  detailDark: "#0f0f0f",
} as const;

type ModalType =
  | "edit-about"
  | "add-experience"
  | "edit-experience"
  | "add-education"
  | "edit-education"
  | "add-project"
  | "edit-project"
  | "add-skills"
  | "edit-skills"
  | "add-certificate"
  | "edit-certificates"
  | "edit-github"
  | null;

interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  skills: string;
  workEmail: string;
  validationStatus: "Verified employee" | "Verified former employee" | "Pending employer validation" | "Unverified experience";
  logoType: "grab" | "maybank" | "custom";
  fallback: string;
}

interface Education {
  institution: string;
  programme: string;
  period: string;
  detail: string;
  schoolEmail: string;
  validationStatus: "Verified student" | "Verified alumni" | "Pending university validation" | "Unverified education";
}

interface ProjectAchievement {
  title: string;
  type: string;
  date: string;
  description: string;
  tags: string;
}

interface Certificate {
  name: string;
  meta: string;
}

interface ProfileDetails {
  location: string;
  email: string;
  phone: string;
}

type DeleteTarget =
  | { kind: "experience"; index: number }
  | { kind: "education"; index: number }
  | { kind: "project"; index: number }
  | { kind: "skill"; value: string };

function GitHubLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.207 11.387.6.111.82-.26.82-.577 0-.285-.011-1.23-.017-2.232-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.419-1.305.762-1.605-2.665-.304-5.466-1.333-5.466-5.932 0-1.311.469-2.382 1.236-3.222-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.49 11.49 0 0 1 3.006-.404c1.019.005 2.045.138 3.006.404 2.292-1.553 3.298-1.23 3.298-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.222 0 4.61-2.805 5.625-5.478 5.922.43.371.823 1.103.823 2.222 0 1.606-.015 2.9-.015 3.293 0 .32.216.694.825.576C20.565 22.092 24 17.597 24 12.297c0-6.627-5.373-12-12-12Z" />
    </svg>
  );
}

function GrabLogo() {
  return (
    <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border bg-white shadow-sm">
      <span className="text-[13px] font-black tracking-tight text-[#00B14F]">
        Grab
      </span>
    </div>
  );
}

function MaybankLogo() {
  return (
    <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border bg-[#FFC600] shadow-sm">
      <span className="text-[10px] font-black tracking-tight text-[#111111]">
        MAYBANK
      </span>
    </div>
  );
}

function CompanyLogo({
  logoType,
  fallback,
}: {
  logoType: Experience["logoType"];
  fallback: string;
}) {
  if (logoType === "grab") return <GrabLogo />;
  if (logoType === "maybank") return <MaybankLogo />;

  return (
    <div
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${theme.rose1}, ${theme.rose2})`,
      }}
    >
      {fallback}
    </div>
  );
}

function getValidationTone(status: string) {
  if (status.includes("Verified") && !status.includes("former") && !status.includes("alumni")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status.includes("former") || status.includes("alumni")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status.includes("Pending")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function ValidationBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${getValidationTone(status)}`}>
      <ShieldCheck className="h-3 w-3" />
      {status}
    </span>
  );
}

function validateEducationRecord(record: Education): Education {
  const email = record.schoolEmail.trim().toLowerCase();
  const period = record.period.toLowerCase();
  const active = /present|current|ongoing|2026|2027|2028/.test(period);

  const knownDomains = [
    "mail.apu.edu.my",
    "student.apu.edu.my",
    "student.taylors.edu.my",
    "students.taylors.edu.my",
    "imail.sunway.edu.my",
    "student.swinburne.edu.my",
    "student.newinti.edu.my",
  ];

  if (!email) {
    return { ...record, validationStatus: "Unverified education" };
  }

  const matched = knownDomains.some((domain) => email.endsWith(`@${domain}`));

  if (!matched) {
    return { ...record, validationStatus: "Pending university validation" };
  }

  return {
    ...record,
    validationStatus: active ? "Verified student" : "Verified alumni",
  };
}

function validateExperienceRecord(record: Experience): Experience {
  const email = record.workEmail.trim().toLowerCase();
  const period = record.period.toLowerCase();
  const active = /present|current|ongoing/.test(period);
  const knownDomains = ["grab.com", "maybank.com", "microsoft.com", "shopee.com"];

  if (!email) {
    return { ...record, validationStatus: "Unverified experience" };
  }

  const matched = knownDomains.some((domain) => email.endsWith(`@${domain}`));

  if (!matched) {
    return { ...record, validationStatus: "Pending employer validation" };
  }

  return {
    ...record,
    validationStatus: active ? "Verified employee" : "Verified former employee",
  };
}

function PrimaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
      style={{ backgroundColor: theme.rose2 }}
    >
      {children}
    </button>
  );
}

function OutlineButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-[#FFF2F6] hover:shadow-sm active:translate-y-0"
      style={{
        borderColor: theme.line,
        color: theme.rose2,
        backgroundColor: "white",
      }}
    >
      {children}
    </button>
  );
}

function EditIconButton({
  onClick,
  dark = false,
}: {
  onClick?: () => void;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition hover:-translate-y-0.5 active:translate-y-0"
      style={{
        borderColor: dark ? "rgba(255,255,255,0.18)" : theme.line,
        color: dark ? "#FFFFFF" : theme.rose2,
        backgroundColor: dark ? "rgba(255,255,255,0.08)" : "white",
      }}
    >
      <Edit3 className="h-4 w-4" />
    </button>
  );
}

function DeleteIconButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition hover:-translate-y-0.5 active:translate-y-0"
      style={{
        borderColor: theme.rose2,
        color: theme.rose2,
        backgroundColor: "white",
      }}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#152238]">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium text-[#152238] outline-none transition placeholder:text-slate-400 focus:border-[#E00046] focus:ring-1 focus:ring-[#E00046]/30"
        style={{ borderColor: "#CBD5E1" }}
      />
    </label>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#152238]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm font-medium leading-6 text-[#152238] outline-none transition placeholder:text-slate-400 focus:border-[#E00046] focus:ring-1 focus:ring-[#E00046]/30"
        style={{ borderColor: "#CBD5E1" }}
      />
    </label>
  );
}

function Modal({
  title,
  description,
  children,
  onClose,
  onSave,
  saveLabel = "Save changes",
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131f33]/45 px-5 backdrop-blur-sm">
      <div
        className="w-full max-w-xl rounded-[1.5rem] border bg-white p-6 shadow-2xl"
        style={{ borderColor: theme.border }}
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 className="text-xl font-semibold text-[#152238]">{title}</h2>
            <p className="mt-2 text-sm font-normal leading-6 text-[#46536D]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-[#FFF2F6] hover:text-[#E00046]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto pr-1">
          {children}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <OutlineButton onClick={onClose}>Cancel</OutlineButton>
          <PrimaryButton onClick={onSave}>
            <Save className="h-4 w-4" />
            {saveLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function CardHeader({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-[76px] items-center justify-between gap-4 rounded-t-2xl border-b border-[#F1F3F7] bg-white px-7 py-4 shadow-[0_8px_14px_rgba(21,34,56,0.035)]">
      <h2 className="text-lg font-semibold leading-none text-[#152238]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function ProfileSection({
  title,
  children,
  showEdit,
  showAdd,
  onEdit,
  onAdd,
}: {
  title: string;
  children: ReactNode;
  showEdit?: boolean;
  showAdd?: boolean;
  onEdit?: () => void;
  onAdd?: () => void;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: theme.border }}
    >
      <CardHeader title={title}>
        <div className="flex items-center gap-3">
          {showAdd && (
            <OutlineButton onClick={onAdd}>
              <Plus className="h-4 w-4" />
              Add
            </OutlineButton>
          )}

          {showEdit && <EditIconButton onClick={onEdit} />}
        </div>
      </CardHeader>

      <div className="px-7 py-5">{children}</div>
    </section>
  );
}

function ExperienceItem({
  item,
  onEdit,
  onDelete,
}: {
  item: Experience;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-5 border-b pb-5 last:border-b-0 last:pb-0">
      <CompanyLogo logoType={item.logoType} fallback={item.fallback} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[#152238]">
              {item.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#152238]">
              {item.company}
            </p>
            <p className="mt-1 text-sm font-normal text-[#46536D]">
              {item.period} · {item.location}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ValidationBadge status={item.validationStatus} />
              {item.workEmail ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-[#667085]">
                  <Mail className="h-3 w-3" />
                  {item.workEmail}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <EditIconButton onClick={onEdit} />
            <DeleteIconButton onClick={onDelete} />
          </div>
        </div>

        <p className="mt-2 text-sm font-normal leading-6 text-[#152238]">
          {item.description}
        </p>

        <div className="mt-2 flex items-center gap-3 text-sm text-[#152238]">
          <span className="h-2 w-2 rotate-45 rounded-sm bg-[#152238]" />
          <p>
            <span className="font-semibold">Skills:</span> {item.skills}
          </p>
        </div>
      </div>
    </div>
  );
}

function EducationItem({
  item,
  onEdit,
  onDelete,
}: {
  item: Education;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-5 border-b pb-5 last:border-b-0 last:pb-0">
      <div
        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl shadow-sm"
        style={{ backgroundColor: theme.soft }}
      >
        <GraduationCap className="h-6 w-6" style={{ color: theme.rose2 }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[#152238]">
              {item.institution}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#152238]">
              {item.programme}
            </p>
            <p className="mt-1 text-sm font-normal text-[#46536D]">
              {item.period}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ValidationBadge status={item.validationStatus} />
              {item.schoolEmail ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-[#667085]">
                  <Mail className="h-3 w-3" />
                  {item.schoolEmail}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <EditIconButton onClick={onEdit} />
            <DeleteIconButton onClick={onDelete} />
          </div>
        </div>

        <p className="mt-2 text-sm font-normal leading-6 text-[#152238]">
          {item.detail}
        </p>
      </div>
    </div>
  );
}

function ProjectAchievementItem({
  item,
  onEdit,
  onDelete,
}: {
  item: ProjectAchievement;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const tags = item.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <div
      className="rounded-xl border bg-white p-5"
      style={{ borderColor: theme.border }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E00046]">
            {item.type}
          </p>
          <h3 className="mt-2 text-base font-semibold text-[#152238]">
            {item.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-[#46536D]">
            {item.date}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <EditIconButton onClick={onEdit} />
          <DeleteIconButton onClick={onDelete} />
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#46536D]">
        {item.description}
      </p>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-3 py-1.5 text-xs font-semibold"
              style={{
                borderColor: theme.line,
                backgroundColor: theme.soft,
                color: theme.rose2,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PinkAccentItem({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border bg-white p-4 pl-5"
      style={{ borderColor: theme.border }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
        style={{ backgroundColor: theme.rose2 }}
      />
      {children}
    </div>
  );
}

function SideDocumentCard({
  title,
  icon: Icon,
  button,
  showEditButton,
  items,
  onAction,
  onEdit,
}: {
  title: string;
  icon: LucideIcon;
  button: string;
  showEditButton?: boolean;
  items: { name: string; meta: string }[];
  onAction: () => void;
  onEdit?: () => void;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: theme.border }}
    >
      <div className="flex min-h-[76px] items-center justify-between gap-4 rounded-t-2xl border-b border-[#F1F3F7] bg-white px-5 py-4 shadow-[0_8px_14px_rgba(21,34,56,0.035)]">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.soft }}
          >
            <Icon className="h-5 w-5" style={{ color: theme.rose2 }} />
          </div>
          <h2 className="text-base font-semibold leading-none text-[#152238]">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {showEditButton && onEdit && <EditIconButton onClick={onEdit} />}
          <OutlineButton onClick={onAction}>{button}</OutlineButton>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {items.length === 0 ? (
          <div
            className="rounded-xl border border-dashed p-4 text-sm font-medium text-[#46536D]"
            style={{ borderColor: theme.border }}
          >
            No item added yet.
          </div>
        ) : (
          items.map((item) => (
            <PinkAccentItem key={item.name}>
              <div className="flex items-center gap-3">
                <FileText
                  className="h-6 w-6 shrink-0"
                  style={{ color: theme.rose2 }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#152238]">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm font-normal text-[#46536D]">
                    {item.meta}
                  </p>
                </div>
              </div>
            </PinkAccentItem>
          ))
        )}
      </div>
    </section>
  );
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

function getLikelyStruggleRoles(animalSlug?: WorkAnimalSlug) {
  const struggleRoles: Partial<Record<WorkAnimalSlug, string[]>> = {
    lion: ["Consensus Coordinator", "Back-office Clerk", "Pure Research Assistant"],
    eagle: ["Routine Administrator", "Compliance Processor", "Ticket Support Agent"],
    wolf: ["Front Desk Host", "Community Associate", "Group Facilitator"],
    owl: ["HR Partner", "Head of People", "Public Speaker"],
    dolphin: ["Solo Analyst", "Forensic Auditor", "Night Operations Monitor"],
    peacock: ["Data Entry Clerk", "Quality Inspector", "Silent Researcher"],
    elephant: ["Crisis Trader", "Growth Hacker", "Cold Sales Hunter"],
    horse: ["0-1 Founder", "Brand Evangelist", "Venture Scout"],
    ant: ["Celebrity Host", "Improvisational Sales Lead", "Vision Evangelist"],
    cheetah: ["Long-cycle Archivist", "Governance Reviewer", "Policy Maintainer"],
    fox: ["Routine Processor", "Scripted Support Agent", "Manual QA Clerk"],
    octopus: ["Single-task Operator", "Static Compliance Clerk", "Legacy System Custodian"],
  };

  return animalSlug ? struggleRoles[animalSlug] ?? [] : ["Role fit locked", "Clash patterns locked", "Blind spots locked"];
}

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

export default function UserProfile() {
  const [modal, setModal] = useState<ModalType>(null);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<
    number | null
  >(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState<
    number | null
  >(null);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(
    null
  );

  const [about, setAbout] = useState(
    "They say AI is going to replace humans pretty soon.... Well guess jokes on them cause they ain't replacing me any time soon. If me myself does not even know what I'm doing right now, how on earth is AI going to replace me. Visca Barca Visca Catalunya."
  );

  const [details, setDetails] = useState<ProfileDetails>({
    location: "Kuala Lumpur, Malaysia",
    email: "jason.tan@email.com",
    phone: "+60 12-345 6789",
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      title: "Data Analytics Intern",
      company: "Grab",
      period: "Jun 2025 – Aug 2025",
      location: "Kuala Lumpur, Malaysia",
      description:
        "Supported analytics reporting, cleaned operational datasets, and created dashboard views to help teams monitor performance trends.",
      skills: "SQL, Power BI, Excel, Data Cleaning",
      workEmail: "jason.tan@grab.com",
      validationStatus: "Verified former employee",
      logoType: "grab",
      fallback: "GR",
    },
    {
      title: "Business Intelligence Intern",
      company: "Maybank",
      period: "Jan 2025 – Apr 2025",
      location: "Kuala Lumpur, Malaysia",
      description:
        "Prepared reporting datasets and assisted with business insights for internal performance tracking and stakeholder updates.",
      skills: "Python, Reporting, Dashboarding",
      workEmail: "jason.tan@maybank.com",
      validationStatus: "Verified former employee",
      logoType: "maybank",
      fallback: "MB",
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      institution: "Asia Pacific University of Technology and Innovation",
      programme: "BSc Computer Science with Specialism in Data Analytics",
      period: "2023 – 2026",
      detail:
        "Relevant learning includes database systems, data analytics, software development, and machine learning.",
      schoolEmail: "jason.tan@student.apu.edu.my",
      validationStatus: "Verified student",
    },
    {
      institution: "Taylor’s College",
      programme: "Foundation in Computing",
      period: "2022 – 2023",
      detail:
        "Built a foundation in programming, mathematics, communication, and problem solving before progressing into degree studies.",
      schoolEmail: "jason.tan@students.taylors.edu.my",
      validationStatus: "Verified alumni",
    },
  ]);

  const [projects, setProjects] = useState<ProjectAchievement[]>([
    {
      title: "Sales Performance Dashboard",
      type: "Featured Project",
      date: "May 2025",
      description:
        "Built a Power BI dashboard that visualizes regional sales trends and KPIs to support data driven business decisions.",
      tags: "Power BI, DAX, Data Visualization",
    },
    {
      title: "Customer Segmentation Analysis",
      type: "Analytics Project",
      date: "Feb 2025",
      description:
        "Analyzed customer data using Python and clustering techniques to identify high value customer segments.",
      tags: "Python, Pandas, Scikit Learn",
    },
    {
      title: "Hackathon Analytics Challenge",
      type: "Achievement",
      date: "Nov 2024",
      description:
        "Completed an analytics challenge by preparing insights from messy datasets and presenting findings to judges.",
      tags: "Analytics, Presentation, Problem Solving",
    },
  ]);

  const [skills, setSkills] = useState([
    "Python",
    "SQL",
    "Power BI",
    "Excel",
    "Data Analytics",
    "Machine Learning",
    "Dashboard Design",
  ]);

  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      name: "Google Data Analytics Certificate.pdf",
      meta: "PDF · 198 KB",
    },
    {
      name: "Microsoft Power BI Data Analyst.pdf",
      meta: "PDF · 215 KB",
    },
  ]);

  const [githubLink, setGithubLink] = useState("github.com/jasontan");
  const workAnimal: WorkAnimalSlug = "owl";

  const [aboutDraft, setAboutDraft] = useState(about);
  const [detailsDraft, setDetailsDraft] = useState<ProfileDetails>(details);
  const [experienceDraft, setExperienceDraft] = useState<Experience>(
    experiences[0]
  );
  const [educationDraft, setEducationDraft] = useState<Education>(education[0]);
  const [projectDraft, setProjectDraft] = useState<ProjectAchievement>(
    projects[0]
  );
  const [skillsDraft, setSkillsDraft] = useState(skills.join(", "));
  const [certificateDraft, setCertificateDraft] = useState<Certificate>({
    name: "",
    meta: "PDF",
  });
  const [certificateEditDraft, setCertificateEditDraft] =
    useState<Certificate[]>(certificates);
  const [githubDraft, setGithubDraft] = useState(githubLink);

  const closeModal = () => setModal(null);

  const openEditAbout = () => {
    setAboutDraft(about);
    setDetailsDraft(details);
    setModal("edit-about");
  };

  const openAddExperience = () => {
    setEditingExperienceIndex(null);
    setExperienceDraft({
      title: "",
      company: "",
      period: "",
      location: "",
      description: "",
      skills: "",
      workEmail: "",
      validationStatus: "Unverified experience",
      logoType: "custom",
      fallback: "CO",
    });
    setModal("add-experience");
  };

  const openEditExperience = (index: number) => {
    setEditingExperienceIndex(index);
    setExperienceDraft(experiences[index]);
    setModal("edit-experience");
  };

  const deleteExperience = (index: number) => {
    setExperiences((old) => old.filter((_, idx) => idx !== index));
  };

  const openAddEducation = () => {
    setEditingEducationIndex(null);
    setEducationDraft({
      institution: "",
      programme: "",
      period: "",
      detail: "",
      schoolEmail: "",
      validationStatus: "Unverified education",
    });
    setModal("add-education");
  };

  const openEditEducation = (index: number) => {
    setEditingEducationIndex(index);
    setEducationDraft(education[index]);
    setModal("edit-education");
  };

  const deleteEducation = (index: number) => {
    setEducation((old) => old.filter((_, idx) => idx !== index));
  };

  const openAddProject = () => {
    setEditingProjectIndex(null);
    setProjectDraft({
      title: "",
      type: "Project",
      date: "",
      description: "",
      tags: "",
    });
    setModal("add-project");
  };

  const openEditProject = (index: number) => {
    setEditingProjectIndex(index);
    setProjectDraft(projects[index]);
    setModal("edit-project");
  };

  const deleteProject = (index: number) => {
    setProjects((old) => old.filter((_, idx) => idx !== index));
  };

  const openAddSkills = () => {
    setSkillsDraft("");
    setModal("add-skills");
  };

  const openEditSkills = () => {
    setSkillsDraft(skills.join(", "));
    setModal("edit-skills");
  };

  const [pendingDelete, setPendingDelete] = useState<DeleteTarget | null>(null);

  const openDeleteExperience = (index: number) => {
    setPendingDelete({ kind: "experience", index });
  };

  const openDeleteEducation = (index: number) => {
    setPendingDelete({ kind: "education", index });
  };

  const openDeleteProject = (index: number) => {
    setPendingDelete({ kind: "project", index });
  };

  const openDeleteSkill = (skillToDelete: string) => {
    setPendingDelete({ kind: "skill", value: skillToDelete });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;

    if (pendingDelete.kind === "experience") {
      setExperiences((old) => old.filter((_, idx) => idx !== pendingDelete.index));
    } else if (pendingDelete.kind === "education") {
      setEducation((old) => old.filter((_, idx) => idx !== pendingDelete.index));
    } else if (pendingDelete.kind === "project") {
      setProjects((old) => old.filter((_, idx) => idx !== pendingDelete.index));
    } else if (pendingDelete.kind === "skill") {
      setSkills((old) => old.filter((skill) => skill !== pendingDelete.value));
    }

    setPendingDelete(null);
  };

  const cancelDelete = () => {
    setPendingDelete(null);
  };

  const openAddCertificate = () => {
    setCertificateDraft({ name: "", meta: "PDF" });
    setModal("add-certificate");
  };

  const openEditCertificates = () => {
    setCertificateEditDraft(certificates);
    setModal("edit-certificates");
  };

  const openGithubEdit = () => {
    setGithubDraft(githubLink);
    setModal("edit-github");
  };

  const currentAnimal = getWorkAnimal(workAnimal ?? undefined);
  const secondaryAnimal = getWorkAnimal("fox");
  const shadowAnimal = getWorkAnimal("peacock");
  const blend = getBlendInterpretation({
    primary: workAnimal,
    secondary: "fox",
    shadow: "peacock",
  });
  const [showTraitSummary, setShowTraitSummary] = useState(false);
  const completenessItems = [
    {
      label: "Work animal trait",
      complete: Boolean(currentAnimal),
      detail: currentAnimal ? `Completed as ${currentAnimal.name}` : "Complete the work animal trait assessment.",
    },
    {
      label: "Personal information",
      complete: Boolean(about.trim() && details.location.trim() && details.email.trim() && details.phone.trim()),
      detail: "Add about, location, email, and phone number.",
    },
    {
      label: "Working experience",
      complete: experiences.length > 0,
      detail: experiences.length > 0 ? `${experiences.length} experience record added` : "Add at least one work, internship, or leadership experience.",
    },
    {
      label: "Education background",
      complete: education.length > 0,
      detail: education.length > 0 ? `${education.length} education record added` : "Add at least one education background record.",
    },
    {
      label: "Skills",
      complete: skills.length > 0,
      detail: skills.length > 0 ? `${skills.length} skills added` : "Add the skills you want the system to match against jobs.",
    },
    {
      label: "Certificates",
      complete: certificates.length > 0,
      detail: certificates.length > 0 ? `${certificates.length} certificate evidence added` : "Add certificate evidence or learning proof.",
    },
    {
      label: "Projects and achievements",
      complete: projects.length > 0,
      detail: projects.length > 0 ? `${projects.length} project or achievement record added` : "Add at least one project or achievement.",
    },
  ];
  const completedProfileItems = completenessItems.filter((item) => item.complete).length;
  const profileCompleteness = Math.round((completedProfileItems / completenessItems.length) * 100);

  return (
    <div
      className="min-h-screen bg-[#fbfbfc] text-[#152238]"
      style={{
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        {/* Top Profile + About Section */}
        <section
          className="mb-5 rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: theme.border }}
        >
          <div className="grid lg:grid-cols-[360px_1fr]">
            {/* Left profile section */}
            <div className="border-l-4 border-l-[#E00046] bg-white px-5 py-7 shadow-[8px_0_18px_rgba(15,15,15,0.035)] sm:px-8 lg:border-r lg:border-[#E6E6E6]">
              <div className="flex flex-col items-center text-center">
                <div className="h-36 w-36 overflow-hidden rounded-full border-8 border-[#FFF2F6] shadow-sm sm:h-44 sm:w-44">
                  <img
                    src="https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=700&q=80"
                    alt="Jason Tan profile"
                    className="h-full w-full object-cover"
                  />
                </div>

                <h1 className="mt-5 text-3xl font-semibold text-[#152238]">
                  Jason Tan
                </h1>

                <p className="mt-2 text-sm font-normal text-[#46536D]">
                  Final Year Computer Science Student
                </p>

                <Link
                  href="/?view=living-portfolio"
                  className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] active:scale-[0.99]"
                  style={{ backgroundColor: theme.rose2 }}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Portfolio
                </Link>

              </div>
            </div>

            {/* Right section */}
            <div className="bg-white px-5 py-6 sm:px-8 sm:py-8">
              <div
                className="rounded-[1.5rem] px-5 py-6 text-white shadow-[0_16px_34px_rgba(15,15,15,0.16)] sm:px-8 sm:py-7"
                style={{ backgroundColor: theme.detailDark }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-4xl">
                    <p className="text-2xl font-bold leading-tight text-white">
                      About
                    </p>

                    <p className="mt-5 max-w-3xl text-sm font-normal leading-7 text-white/72">
                      {about}
                    </p>
                  </div>

                  <EditIconButton onClick={openEditAbout} dark />
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 shadow-sm backdrop-blur-sm">
                    <div className="mb-3 flex items-center gap-2 text-white/55">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">
                        Location
                      </span>
                    </div>
                    <p className="text-base font-semibold text-white">
                      {details.location}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 shadow-sm backdrop-blur-sm">
                    <div className="mb-3 flex items-center gap-2 text-white/55">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">
                        Email
                      </span>
                    </div>
                    <p className="break-words text-base font-semibold text-white">
                      {details.email}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 shadow-sm backdrop-blur-sm">
                    <div className="mb-3 flex items-center gap-2 text-white/55">
                      <Phone className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">
                        Phone
                      </span>
                    </div>
                    <p className="text-base font-semibold text-white">
                      {details.phone}
                    </p>
                  </div>

                  <div className="group relative isolate z-20 overflow-visible rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 shadow-sm backdrop-blur-sm outline-none ring-white/35 transition hover:border-white/25 focus-within:ring-2">
                    <div className="mb-3 flex items-center gap-2 text-white/55">
                      <Eye className="h-4 w-4" />
                      <span className="break-words text-xs font-medium uppercase tracking-normal">
                        Completeness
                      </span>
                    </div>
                    <button type="button" className="text-left outline-none">
                      <p className="text-base font-semibold text-white">
                        {profileCompleteness}% {profileCompleteness === 100 ? "Complete" : "Incomplete"}
                      </p>
                      <p className="mt-1 text-xs font-medium text-white/45">
                        Hover for breakdown
                      </p>
                    </button>

                    <div className="pointer-events-none absolute right-0 top-full z-[999] mt-3 w-80 max-w-[calc(100vw-3rem)] -translate-y-2 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <div className="rounded-2xl border border-[#E5E8F0] bg-white p-4 text-[#152238] shadow-[0_20px_45px_rgba(15,23,42,0.24)]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#152238]">
                              Completeness breakdown
                            </p>
                            <p className="mt-1 text-xs font-medium leading-5 text-[#667085]">
                              {completedProfileItems} of {completenessItems.length} profile signals are ready.
                            </p>
                          </div>
                          <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-bold text-[#E00046]">
                            {profileCompleteness}%
                          </span>
                        </div>

                        <div className="mt-4 space-y-2">
                          {completenessItems.map((item) => (
                            <div key={item.label} className="flex gap-3 rounded-xl bg-[#F8FAFC] p-3">
                              <span
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                  item.complete ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-[#E00046]"
                                }`}
                              >
                                {item.complete ? <ShieldCheck className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#152238]">
                                  {item.label}
                                </p>
                                <p className="mt-0.5 text-xs leading-5 text-[#667085]">
                                  {item.detail}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Layout */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,32%)]">
          {/* Bottom Left */}
          <section className="space-y-5">
            <ProfileSection title="Work Animal Assessment">
              <div className="grid gap-5 2xl:grid-cols-[1.05fr_.95fr]">
                <div className="relative overflow-hidden rounded-2xl border bg-[#101727] p-6 text-white shadow-[0_18px_38px_rgba(15,23,42,0.18)]">
                  <div className="absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-[#E00046]/20 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-4xl shadow-sm">
                        {currentAnimal?.emoji ?? "?"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                          Your work animal
                        </p>
                        <h3 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                          {currentAnimal ? `The ${currentAnimal.name}` : "Unknown"}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-white/70">
                          {currentAnimal ? `${currentAnimal.archetype} · ${currentAnimal.category}` : "Take the test to complete your profile"}
                        </p>
                        <p className="mt-1 text-xs font-medium text-white/45">
                          {currentAnimal ? "Profile trait ready for job matching" : "Required before trait matching can be trusted"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {dimensionPoles.map((dimension) => {
                        const value = currentAnimal?.dimensions[dimension.key] ?? 0;
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

                    <div className="mt-6 grid gap-3">
                      {[
                        { label: "Primary" as const, animal: currentAnimal },
                        { label: "Secondary" as const, animal: secondaryAnimal },
                        { label: "Shadow" as const, animal: shadowAnimal },
                      ].map(({ label, animal }) => (
                        <div key={label} className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
                              {animal?.emoji ?? "?"}
                            </span>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                                {label}
                              </p>
                              <p className="mt-1 text-lg font-semibold text-white">
                                {animal ? `${animal.name} · ${animal.archetype}` : "Unknown"}
                              </p>
                              <p className="mt-2 text-xs leading-5 text-white/60">
                                {getAnimalRoleInTrio(label)}
                              </p>
                              {animal && (
                                <p className="mt-2 text-xs leading-5 text-white/72">
                                  {animal.short}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-5 text-sm leading-6 text-white/68">
                      {currentAnimal
                        ? `Prototype saved result: ${currentAnimal.short}`
                        : "Your animal trait status is unknown, so CareerOS cannot yet explain where your working style matches a job, differs from it, or how to prepare for a supervisor."}
                    </p>

                    <a
                      href="https://www.yourworkanimal.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E00046] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(224,0,70,0.24)] transition hover:bg-[#D81B3F] sm:w-auto"
                    >
                      <Eye className="h-4 w-4" />
                      Retake test
                    </a>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border bg-white p-5" style={{ borderColor: theme.border }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E00046]">
                      Blend interpretation
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[#152238]">
                      {blend.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#46536D]">
                      {blend.summary}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowTraitSummary((value) => !value)}
                      className="mt-5 inline-flex rounded-xl border border-[#F5CBD6] bg-[#FFF2F6] px-4 py-2.5 text-sm font-semibold text-[#E00046] transition hover:bg-[#FDE7EE]"
                    >
                      {showTraitSummary ? "Hide full trait summary" : "View full trait summary"}
                    </button>
                    {showTraitSummary && (
                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold text-emerald-700">What this gives you</p>
                          <div className="mt-3 space-y-2">
                            {blend.strengths.map((item) => (
                              <p key={item} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm leading-5 text-[#152238]">
                                {item}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-rose-700">What to watch</p>
                          <div className="mt-3 space-y-2">
                            {blend.watchouts.map((item) => (
                              <p key={item} className="rounded-xl bg-rose-50 px-3 py-2 text-sm leading-5 text-[#152238]">
                                {item}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 2xl:grid-cols-2">
                    <div className="rounded-2xl border bg-[#F8FFF9] p-5" style={{ borderColor: "#BBF7D0" }}>
                      <p className="text-sm font-semibold text-emerald-700">You would thrive in</p>
                      <div className="mt-4 space-y-2">
                        {(currentAnimal?.roles.slice(0, 3) ?? ["Complete test to unlock", "Role fit analysis", "Best working environment"]).map((role) => (
                          <p key={role} className="min-w-0 break-words rounded-xl bg-white px-3 py-2 text-sm font-semibold leading-5 text-[#152238] shadow-sm">
                            {role}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-[#FFF7F7] p-5" style={{ borderColor: "#FECACA" }}>
                      <p className="text-sm font-semibold text-rose-700">You may struggle in</p>
                      <div className="mt-4 space-y-2">
                        {getLikelyStruggleRoles(currentAnimal?.slug).map((role) => (
                          <p key={role} className="min-w-0 break-words rounded-xl bg-white px-3 py-2 text-sm font-semibold leading-5 text-[#152238] shadow-sm">
                            {role}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-white p-5" style={{ borderColor: theme.border }}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#152238]">CareerOS interpretation</p>
                      <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">
                        Generated from traits
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-[#F8FAFC] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#46536D]">Core strength</p>
                        <p className="mt-2 text-sm font-semibold text-[#152238]">
                          Patient judgement under complexity
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#46536D]">
                          This means you are strongest when a problem needs careful thinking, evidence, and a decision that holds up.
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#F8FAFC] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#46536D]">Best-fit work</p>
                        <p className="mt-2 text-sm font-semibold text-[#152238]">
                          Research and analysis
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#46536D]">
                          This is a suggested work direction based on the Owl primary trait and Fox strategic influence.
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#F8FAFC] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#46536D]">Growth area</p>
                        <p className="mt-2 text-sm font-semibold text-[#152238]">
                          Show the thinking earlier
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#46536D]">
                          Peacock as shadow suggests visibility and self-promotion may need deliberate practice.
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#F8FAFC] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#46536D]">Used for</p>
                        <p className="mt-2 text-sm font-semibold text-[#152238]">
                          Matching and preparation
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#46536D]">
                          CareerOS uses this to explain job fit, blind spots, team compatibility, and supervisor communication.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ProfileSection>

            <ProfileSection
              title="Working Experience"
              showAdd
              onAdd={openAddExperience}
            >
              <div className="space-y-5">
                {experiences.map((item, index) => (
                  <ExperienceItem
                    key={`${item.company}-${item.title}-${index}`}
                    item={item}
                    onEdit={() => openEditExperience(index)}
                    onDelete={() => openDeleteExperience(index)}
                  />
                ))}
              </div>
            </ProfileSection>

            <ProfileSection
              title="Projects and Achievements"
              showAdd
              onAdd={openAddProject}
            >
              <div className="grid gap-4 2xl:grid-cols-2">
                {projects.map((item, index) => (
                  <ProjectAchievementItem
                    key={`${item.title}-${index}`}
                    item={item}
                    onEdit={() => openEditProject(index)}
                    onDelete={() => openDeleteProject(index)}
                  />
                ))}
              </div>
            </ProfileSection>

            <ProfileSection title="Education Background" showAdd onAdd={openAddEducation}>
              <div className="space-y-5">
                {education.map((item, index) => (
                  <EducationItem
                    key={`${item.institution}-${index}`}
                    item={item}
                    onEdit={() => openEditEducation(index)}
                    onDelete={() => openDeleteEducation(index)}
                  />
                ))}
              </div>
            </ProfileSection>

          </section>

          {/* Bottom Right */}
          <aside className="space-y-5">
            <SideDocumentCard
              title="Certificates"
              icon={ShieldCheck}
              button="Add"
              showEditButton
              items={certificates}
              onAction={openAddCertificate}
              onEdit={openEditCertificates}
            />

            <ProfileSection
              title="Skills"
              showAdd
              showEdit
              onAdd={openAddSkills}
              onEdit={openEditSkills}
            >
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => openDeleteSkill(skill)}
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-[#FFF2F6]"
                    style={{
                      borderColor: theme.line,
                      backgroundColor: theme.soft,
                      color: theme.rose2,
                    }}
                  >
                    <span>{skill}</span>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </ProfileSection>

            <section
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              style={{ borderColor: theme.border }}
            >
              <div className="flex min-h-[76px] items-center justify-between gap-4 rounded-t-2xl border-b border-[#F1F3F7] bg-white px-5 py-4 shadow-[0_8px_14px_rgba(21,34,56,0.035)]">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.soft }}
                  >
                    <GitHubLogo className="h-5 w-5 text-[#152238]" />
                  </div>
                  <h2 className="text-base font-semibold leading-none text-[#152238]">
                    GitHub
                  </h2>
                </div>

                <EditIconButton onClick={openGithubEdit} />
              </div>

              <div className="p-5">
                <PinkAccentItem>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#131f33] text-white">
                      <GitHubLogo className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#152238]">
                        {githubLink}
                      </p>
                      <p className="mt-1 text-xs font-normal text-[#46536D]">
                        Personal portfolio and projects
                      </p>
                    </div>

                    <ExternalLink
                      className="ml-auto h-4 w-4 shrink-0"
                      style={{ color: theme.rose2 }}
                    />
                  </div>
                </PinkAccentItem>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {modal === "edit-about" && (
        <Modal
          title="Edit About and Details"
          description="Update the profile summary and contact details shown in the top section."
          onClose={closeModal}
          onSave={() => {
            setAbout(aboutDraft);
            setDetails(detailsDraft);
            closeModal();
          }}
        >
          <TextAreaInput
            label="About"
            value={aboutDraft}
            onChange={setAboutDraft}
          />
          <TextInput
            label="Location"
            value={detailsDraft.location}
            onChange={(value) =>
              setDetailsDraft((old) => ({ ...old, location: value }))
            }
            placeholder="Kuala Lumpur, Malaysia"
          />
          <TextInput
            label="Email"
            value={detailsDraft.email}
            onChange={(value) =>
              setDetailsDraft((old) => ({ ...old, email: value }))
            }
            placeholder="jason.tan@email.com"
          />
          <TextInput
            label="Phone"
            value={detailsDraft.phone}
            onChange={(value) =>
              setDetailsDraft((old) => ({ ...old, phone: value }))
            }
            placeholder="+60 12-345 6789"
          />
        </Modal>
      )}

      {(modal === "add-experience" || modal === "edit-experience") && (
        <Modal
          title={
            modal === "add-experience" ? "Add Experience" : "Edit Experience"
          }
          description="Add or update work experience details for your career profile."
          onClose={closeModal}
          onSave={() => {
            const validatedExperience = validateExperienceRecord(experienceDraft);

            if (modal === "add-experience") {
              setExperiences((old) => [...old, validatedExperience]);
            } else if (editingExperienceIndex !== null) {
              setExperiences((old) =>
                old.map((item, index) =>
                  index === editingExperienceIndex ? validatedExperience : item
                )
              );
            }

            closeModal();
          }}
        >
          <TextInput
            label="Role title"
            value={experienceDraft.title}
            onChange={(value) =>
              setExperienceDraft((old) => ({ ...old, title: value }))
            }
            placeholder="Data Analytics Intern"
          />
          <TextInput
            label="Company"
            value={experienceDraft.company}
            onChange={(value) =>
              setExperienceDraft((old) => ({ ...old, company: value }))
            }
            placeholder="Grab"
          />
          <TextInput
            label="Period"
            value={experienceDraft.period}
            onChange={(value) =>
              setExperienceDraft((old) => ({ ...old, period: value }))
            }
            placeholder="Jun 2025 – Aug 2025"
          />
          <TextInput
            label="Location"
            value={experienceDraft.location}
            onChange={(value) =>
              setExperienceDraft((old) => ({ ...old, location: value }))
            }
            placeholder="Kuala Lumpur, Malaysia"
          />
          <TextInput
            label="Work email for validation"
            value={experienceDraft.workEmail}
            onChange={(value) =>
              setExperienceDraft((old) => ({ ...old, workEmail: value }))
            }
            placeholder="name@company.com"
          />
          <TextAreaInput
            label="Description"
            value={experienceDraft.description}
            onChange={(value) =>
              setExperienceDraft((old) => ({ ...old, description: value }))
            }
          />
          <TextInput
            label="Skills"
            value={experienceDraft.skills}
            onChange={(value) =>
              setExperienceDraft((old) => ({ ...old, skills: value }))
            }
            placeholder="SQL, Power BI, Excel"
          />
        </Modal>
      )}

      {(modal === "add-education" || modal === "edit-education") && (
        <Modal
          title={modal === "add-education" ? "Add Education" : "Edit Education"}
          description="Add or update education details shown on your user profile."
          onClose={closeModal}
          onSave={() => {
            const validatedEducation = validateEducationRecord(educationDraft);

            if (modal === "add-education") {
              setEducation((old) => [...old, validatedEducation]);
            } else if (editingEducationIndex !== null) {
              setEducation((old) =>
                old.map((item, index) =>
                  index === editingEducationIndex ? validatedEducation : item
                )
              );
            }

            closeModal();
          }}
        >
          <TextInput
            label="Institution"
            value={educationDraft.institution}
            onChange={(value) =>
              setEducationDraft((old) => ({ ...old, institution: value }))
            }
            placeholder="Asia Pacific University"
          />
          <TextInput
            label="Programme"
            value={educationDraft.programme}
            onChange={(value) =>
              setEducationDraft((old) => ({ ...old, programme: value }))
            }
            placeholder="BSc Computer Science"
          />
          <TextInput
            label="Period"
            value={educationDraft.period}
            onChange={(value) =>
              setEducationDraft((old) => ({ ...old, period: value }))
            }
            placeholder="2023 – 2026"
          />
          <TextInput
            label="School email for validation"
            value={educationDraft.schoolEmail}
            onChange={(value) =>
              setEducationDraft((old) => ({ ...old, schoolEmail: value }))
            }
            placeholder="name@student.university.edu"
          />
          <TextAreaInput
            label="Details"
            value={educationDraft.detail}
            onChange={(value) =>
              setEducationDraft((old) => ({ ...old, detail: value }))
            }
          />
        </Modal>
      )}

      {(modal === "add-project" || modal === "edit-project") && (
        <Modal
          title={
            modal === "add-project"
              ? "Add Project or Achievement"
              : "Edit Project or Achievement"
          }
          description="Add or update the project and achievement evidence that appears in your Living Portfolio."
          onClose={closeModal}
          onSave={() => {
            if (modal === "add-project") {
              setProjects((old) => [...old, projectDraft]);
            } else if (editingProjectIndex !== null) {
              setProjects((old) =>
                old.map((item, index) =>
                  index === editingProjectIndex ? projectDraft : item
                )
              );
            }

            closeModal();
          }}
        >
          <TextInput
            label="Title"
            value={projectDraft.title}
            onChange={(value) =>
              setProjectDraft((old) => ({ ...old, title: value }))
            }
            placeholder="Sales Performance Dashboard"
          />
          <TextInput
            label="Type"
            value={projectDraft.type}
            onChange={(value) =>
              setProjectDraft((old) => ({ ...old, type: value }))
            }
            placeholder="Featured Project, Analytics Project, Achievement"
          />
          <TextInput
            label="Date"
            value={projectDraft.date}
            onChange={(value) =>
              setProjectDraft((old) => ({ ...old, date: value }))
            }
            placeholder="May 2025"
          />
          <TextAreaInput
            label="Description"
            value={projectDraft.description}
            onChange={(value) =>
              setProjectDraft((old) => ({ ...old, description: value }))
            }
            placeholder="Describe what you built, achieved, or proved."
          />
          <TextInput
            label="Tags"
            value={projectDraft.tags}
            onChange={(value) =>
              setProjectDraft((old) => ({ ...old, tags: value }))
            }
            placeholder="Power BI, DAX, Data Visualization"
          />
        </Modal>
      )}

      {(modal === "add-skills" || modal === "edit-skills") && (
        <Modal
          title={modal === "add-skills" ? "Add Skills" : "Edit Skills"}
          description="Use commas to separate multiple skills."
          onClose={closeModal}
          onSave={() => {
            const nextSkills = skillsDraft
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean);

            if (modal === "add-skills") {
              setSkills((old) => [...old, ...nextSkills]);
            } else {
              setSkills(nextSkills);
            }

            closeModal();
          }}
        >
          <TextAreaInput
            label="Skills"
            value={skillsDraft}
            onChange={setSkillsDraft}
            placeholder="Python, SQL, Power BI"
          />
        </Modal>
      )}

      {modal === "add-certificate" && (
        <Modal
          title="Add Certificate"
          description="Upload a PDF certificate or achievement proof and save it to your profile."
          onClose={closeModal}
          onSave={() => {
            if (certificateDraft.name.trim()) {
              setCertificates((old) => [...old, certificateDraft]);
            }

            closeModal();
          }}
          saveLabel="Save certificate"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#152238]">
              Upload certificate
            </span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="block w-full cursor-pointer rounded-xl border bg-white px-4 py-3 text-sm font-medium text-[#152238] file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#E00046] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              style={{ borderColor: "#CBD5E1" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (!isPdfFile(file)) {
                  alert("Please upload a PDF file only.");
                  e.target.value = "";
                  return;
                }

                setCertificateDraft({
                  name: file.name,
                  meta: `PDF · ${Math.max(1, Math.round(file.size / 1024))} KB`,
                });
              }}
            />
          </label>
        </Modal>
      )}

      {modal === "edit-certificates" && (
        <Modal
          title="Edit Certificates"
          description="Remove certificates that should no longer appear in your profile."
          onClose={closeModal}
          onSave={() => {
            setCertificates(certificateEditDraft);
            closeModal();
          }}
          saveLabel="Save certificates"
        >
          {certificateEditDraft.length === 0 ? (
            <div
              className="rounded-xl border border-dashed p-4 text-sm font-medium text-[#46536D]"
              style={{ borderColor: theme.border }}
            >
              No certificates left.
            </div>
          ) : (
            certificateEditDraft.map((certificate) => (
              <div
                key={certificate.name}
                className="flex items-center justify-between gap-3 rounded-xl border bg-white p-4"
                style={{ borderColor: theme.border }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText
                    className="h-6 w-6 shrink-0"
                    style={{ color: theme.rose2 }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#152238]">
                      {certificate.name}
                    </p>
                    <p className="mt-1 text-sm font-normal text-[#46536D]">
                      {certificate.meta}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCertificateEditDraft((old) =>
                      old.filter((item) => item.name !== certificate.name)
                    )
                  }
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#FFF2F6] text-[#E00046] transition hover:bg-[#FDE7EE]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </Modal>
      )}

      {modal === "edit-github" && (
        <Modal
          title="Edit GitHub Link"
          description="Update the GitHub profile or portfolio link displayed on your profile."
          onClose={closeModal}
          onSave={() => {
            setGithubLink(githubDraft);
            closeModal();
          }}
        >
          <TextInput
            label="GitHub link"
            value={githubDraft}
            onChange={setGithubDraft}
            placeholder="github.com/yourname"
          />
        </Modal>
      )}

      {pendingDelete && (
        <Modal
          title="Confirm delete"
          description={`Are you sure you want to delete this ${
            pendingDelete.kind === "skill"
              ? "skill"
              : pendingDelete.kind === "experience"
              ? "experience"
              : pendingDelete.kind === "education"
              ? "education"
              : "project"
          } record? This action cannot be undone.`}
          onClose={cancelDelete}
          onSave={confirmDelete}
          saveLabel="Delete"
        >
          <div className="rounded-2xl border border-[#F5CBD6] bg-[#FFF2F6] p-4 text-sm text-[#152238]">
            {pendingDelete.kind === "skill" ? (
              <p>
                You will remove the skill <strong>{pendingDelete.value}</strong> from your profile.
              </p>
            ) : (
              <p>
                This will remove the selected {pendingDelete.kind} record from your profile.
              </p>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
}
