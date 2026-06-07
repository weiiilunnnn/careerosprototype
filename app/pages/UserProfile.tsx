"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Edit3,
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
import Navbar from "@/components/navbar/Navbar";

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
  | "add-skills"
  | "edit-skills"
  | "update-resume"
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
  logoType: "grab" | "maybank" | "custom";
  fallback: string;
}

interface Education {
  institution: string;
  programme: string;
  period: string;
  detail: string;
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
}: {
  item: Experience;
  onEdit: () => void;
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
          </div>

          <EditIconButton onClick={onEdit} />
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
}: {
  item: Education;
  onEdit: () => void;
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
          </div>

          <EditIconButton onClick={onEdit} />
        </div>

        <p className="mt-2 text-sm font-normal leading-6 text-[#152238]">
          {item.detail}
        </p>
      </div>
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

export default function UserProfile() {
  const [modal, setModal] = useState<ModalType>(null);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<
    number | null
  >(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState<
    number | null
  >(null);

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
    },
    {
      institution: "Taylor’s College",
      programme: "Foundation in Computing",
      period: "2022 – 2023",
      detail:
        "Built a foundation in programming, mathematics, communication, and problem solving before progressing into degree studies.",
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

  const [resume, setResume] = useState({
    name: "Jason_Tan_Resume.pdf",
    meta: "PDF · 231 KB",
  });

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

  const [aboutDraft, setAboutDraft] = useState(about);
  const [detailsDraft, setDetailsDraft] = useState<ProfileDetails>(details);
  const [experienceDraft, setExperienceDraft] = useState<Experience>(
    experiences[0]
  );
  const [educationDraft, setEducationDraft] = useState<Education>(education[0]);
  const [skillsDraft, setSkillsDraft] = useState(skills.join(", "));
  const [resumeDraft, setResumeDraft] = useState(resume);
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

  const openAddEducation = () => {
    setEditingEducationIndex(null);
    setEducationDraft({
      institution: "",
      programme: "",
      period: "",
      detail: "",
    });
    setModal("add-education");
  };

  const openEditEducation = (index: number) => {
    setEditingEducationIndex(index);
    setEducationDraft(education[index]);
    setModal("edit-education");
  };

  const openAddSkills = () => {
    setSkillsDraft("");
    setModal("add-skills");
  };

  const openEditSkills = () => {
    setSkillsDraft(skills.join(", "));
    setModal("edit-skills");
  };

  const openResumeUpdate = () => {
    setResumeDraft(resume);
    setModal("update-resume");
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

  return (
    <div
      className="min-h-screen bg-[#fbfbfc] text-[#152238]"
      style={{
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        {/* Top Profile + About Section */}
        <section
          className="mb-5 overflow-hidden rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: theme.border }}
        >
          <div className="grid lg:grid-cols-[360px_1fr]">
            {/* Left profile section */}
            <div className="border-r border-[#E6E6E6] border-l-4 border-l-[#E00046] bg-white px-8 py-8 shadow-[8px_0_18px_rgba(15,15,15,0.035)]">
              <div className="flex flex-col items-center text-center">
                <div className="h-44 w-44 overflow-hidden rounded-full border-8 border-[#FFF2F6] shadow-sm">
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
            <div className="bg-white px-8 py-8">
              <div
                className="rounded-[1.5rem] px-8 py-7 text-white shadow-[0_16px_34px_rgba(15,15,15,0.16)]"
                style={{ backgroundColor: theme.detailDark }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-4xl">
                    <p className="text-2xl font-bold leading-none text-white">
                      About
                    </p>

                    <p className="mt-5 max-w-3xl text-sm font-normal leading-7 text-white/72">
                      {about}
                    </p>
                  </div>

                  <EditIconButton onClick={openEditAbout} dark />
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-3">
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
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          {/* Bottom Left */}
          <section className="space-y-5">
            <ProfileSection
              title="Experience"
              showAdd
              onAdd={openAddExperience}
            >
              <div className="space-y-5">
                {experiences.map((item, index) => (
                  <ExperienceItem
                    key={`${item.company}-${item.title}-${index}`}
                    item={item}
                    onEdit={() => openEditExperience(index)}
                  />
                ))}
              </div>
            </ProfileSection>

            <ProfileSection title="Education" showAdd onAdd={openAddEducation}>
              <div className="space-y-5">
                {education.map((item, index) => (
                  <EducationItem
                    key={`${item.institution}-${index}`}
                    item={item}
                    onEdit={() => openEditEducation(index)}
                  />
                ))}
              </div>
            </ProfileSection>

            <ProfileSection
              title="Skills"
              showAdd
              showEdit
              onAdd={openAddSkills}
              onEdit={openEditSkills}
            >
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border px-4 py-2 text-sm font-semibold"
                    style={{
                      borderColor: theme.line,
                      backgroundColor: theme.soft,
                      color: theme.rose2,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ProfileSection>
          </section>

          {/* Bottom Right */}
          <aside className="space-y-5">
            <SideDocumentCard
              title="Resume / CV"
              icon={FileText}
              button="Update"
              items={[resume]}
              onAction={openResumeUpdate}
            />

            <SideDocumentCard
              title="Certificates"
              icon={ShieldCheck}
              button="Add"
              showEditButton
              items={certificates}
              onAction={openAddCertificate}
              onEdit={openEditCertificates}
            />

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
            if (modal === "add-experience") {
              setExperiences((old) => [...old, experienceDraft]);
            } else if (editingExperienceIndex !== null) {
              setExperiences((old) =>
                old.map((item, index) =>
                  index === editingExperienceIndex ? experienceDraft : item
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
            if (modal === "add-education") {
              setEducation((old) => [...old, educationDraft]);
            } else if (editingEducationIndex !== null) {
              setEducation((old) =>
                old.map((item, index) =>
                  index === editingEducationIndex ? educationDraft : item
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
          <TextAreaInput
            label="Details"
            value={educationDraft.detail}
            onChange={(value) =>
              setEducationDraft((old) => ({ ...old, detail: value }))
            }
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

      {modal === "update-resume" && (
        <Modal
          title="Update Resume / CV"
          description="Upload an updated PDF resume and save it to your profile."
          onClose={closeModal}
          onSave={() => {
            setResume(resumeDraft);
            closeModal();
          }}
          saveLabel="Save update"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#152238]">
              Upload updated resume
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

                setResumeDraft({
                  name: file.name,
                  meta: `PDF · ${Math.max(1, Math.round(file.size / 1024))} KB`,
                });
              }}
            />
          </label>
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
    </div>
  );
}