"use client";

import { useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleCheck,
  Copy,
  ExternalLink,
  Globe2,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareText,
  PenLine,
  Plus,
  Rocket,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedAIPanel, AnimatedCard, AnimatedProgress, AnimatedSection, universityEase, useLockBodyScroll } from "./UniversityMotion";
import { courseLevels, initialFaculties, makeCourse, type Course, type CourseLevel, type Faculty } from "./facultyData";
import { useUniversityProfile, type UniversityProfileData } from "./universityProfileData";

type ContactItem = [string, string, LucideIcon];

export const quickStats = [
  { label: "Students", value: "24,580", detail: "Active Students", icon: Users, bg: "bg-[#f0e9ff]", tone: "text-[#6D5EF7]" },
  { label: "Alumni", value: "81,300", detail: "Verified Alumni", icon: GraduationCap, bg: "bg-[#e8f6ee]", tone: "text-[#16a34a]" },
  { label: "Programmes", value: "132", detail: "Across 9 Faculties", icon: BookOpen, bg: "bg-[#fff2df]", tone: "text-[#f59e0b]" },
  { label: "Employer Partners", value: "382", detail: "Active Companies", icon: Building2, bg: "bg-[#edf4ff]", tone: "text-[#2563eb]" },
  { label: "Industry Projects", value: "74", detail: "Live Collaborations", icon: BriefcaseBusiness, bg: "bg-[#ffeaf3]", tone: "text-[#e11d48]" },
];


export const partners = ["Microsoft", "Google", "Shopee", "Petronas", "Intel", "Dell", "Maybank", "AWS"];

export const programmes = [
  ["BSc Computer Science", "94%", "4,250", "AI systems, cloud engineering, software product delivery"],
  ["Bachelor of Data Science", "91%", "3,780", "Machine learning, analytics translation, decision science"],
  ["Business Analytics", "89%", "2,960", "Commercial strategy, data storytelling, operations intelligence"],
];

export const achievements = [
  { title: "Top Employability University", year: "2025", icon: Trophy },
  { title: "Microsoft AI Collaboration", year: "2025", icon: MessageSquareText },
  { title: "QS Top 200", year: "2024", icon: Globe2 },
  { title: "Best Industry Partnership", year: "2024", icon: Award },
];

function buildContactItems(profile: UniversityProfileData): ContactItem[] {
  return [
    ["Career Office", profile.contacts.careerOffice, Mail],
    ["Industry Collaboration Office", profile.contacts.industryOffice, BriefcaseBusiness],
    ["Admissions", profile.contacts.admissions, GraduationCap],
    ["Student Affairs", profile.contacts.studentAffairs, Users],
  ];
}

function buildSocialItems(profile: UniversityProfileData): ContactItem[] {
  return [
    ["Website", profile.socials.website, Globe2],
    ["LinkedIn", profile.socials.linkedin, ExternalLink],
    ["Facebook", profile.socials.facebook, MessageSquareText],
    ["Instagram", profile.socials.instagram, Sparkles],
    ["Location", profile.socials.locationLink, MapPin],
  ];
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={`rounded-[24px] border-[#e9eaf2] bg-white shadow-[0_20px_55px_rgba(15,23,42,0.055)] ${className}`}>{children}</AnimatedCard>;
}


function ShareProfileModal({ onClose, universityName }: { onClose: () => void; universityName: string }) {
  useLockBodyScroll();
  const [copied, setCopied] = useState(false);

  if (typeof document === "undefined") return null;

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/university/profile/public` : "/university/profile/public";
  const shareText = `Check out ${universityName} on CareerOS`;

  const platforms = [
    {
      label: "Copy link",
      icon: copied ? Check : Copy,
      onClick: () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        });
      },
    },
    {
      label: "Email",
      icon: Mail,
      onClick: () => window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`, "_blank"),
    },
    {
      label: "LinkedIn",
      icon: Link2,
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank"),
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, "_blank"),
    },
    {
      label: "X (Twitter)",
      icon: Send,
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank"),
    },
  ];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#0b0f22]/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: universityEase }}
        className="relative z-10 w-full max-w-sm rounded-[24px] bg-white p-6 shadow-[0_40px_90px_rgba(15,23,42,0.25)]"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-[#46536D] transition hover:bg-[#F7F8FB]"
        >
          <X size={16} />
        </button>

        <h2 className="text-lg font-extrabold text-[#070a17]">Share University Profile</h2>
        <p className="mt-1 text-xs font-medium leading-5 text-[#53607b]">
          Share the public {universityName} profile with employers, partners or prospective students.
        </p>

        <div className="mt-5 space-y-2">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.label}
                type="button"
                onClick={platform.onClick}
                className="flex w-full items-center gap-3 rounded-2xl border border-[#eceef6] bg-[#fbfbfe] px-4 py-3 text-left text-sm font-bold text-[#0b1020] transition hover:border-[#d8d3ff] hover:bg-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0e9ff] text-[#6D5EF7]">
                  <Icon size={16} />
                </span>
                {platform.label === "Copy link" && copied ? "Copied!" : platform.label}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

function Header({ universityName }: { universityName: string }) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0e9ff] text-[#6D5EF7]">
            <Building2 size={24} />
          </span>
          <h1 className="text-3xl font-extrabold tracking-normal text-[#070a17] md:text-[34px]">University Profile</h1>
        </div>
        <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#53607b]">
          Manage your institution profile, industry partnerships and academic identity across CareerOS.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        <button aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e8f1] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6b35ff] text-[10px] font-bold text-white">5</span>
        </button>
        <Button
          onClick={() => setShareOpen(true)}
          className="h-11 rounded-xl border-[#e6e8f1] bg-white px-4 text-xs font-bold text-[#34415e] shadow-sm hover:bg-[#faf7ff]"
          variant="outline"
        >
          <Share2 size={15} />
          Share University
        </Button>
        <Link href="/university/profile/edit">
          <Button className="h-11 rounded-xl bg-[#6D5EF7] px-5 text-xs font-bold text-white shadow-[0_18px_35px_rgba(109,94,247,0.24)] hover:bg-[#5f50e8]">
            <PenLine size={15} />
            Edit Profile
          </Button>
        </Link>
      </div>

      <AnimatePresence>
        {shareOpen ? <ShareProfileModal onClose={() => setShareOpen(false)} universityName={universityName} /> : null}
      </AnimatePresence>
    </header>
  );
}

export const universityLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/6/69/Logo-Taylors-University.png";

function LogoMark({ initial = "T", logoUrl }: { initial?: string; logoUrl?: string }) {
  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-[32px] border border-[#e4e3fb] bg-white shadow-[0_20px_45px_rgba(109,94,247,0.15)]">
      <div className="absolute inset-3 rounded-[24px] bg-[#f6f2ff]" />
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="University logo" className="relative h-16 w-16 object-contain" />
      ) : (
        <span className="relative text-[54px] font-black leading-none text-[#e11d48]">{initial.toUpperCase()}</span>
      )}
      <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#6D5EF7] text-white shadow-lg">
        <Check size={16} />
      </span>
    </div>
  );
}

function HeroCard({ profile }: { profile: UniversityProfileData }) {
  const quickInfo = [
    [MapPin, profile.location],
    [Users, profile.studentCountLabel],
  ] as const;

  return (
    <Card className="overflow-hidden p-5 md:p-6">
      <div className="grid gap-7 xl:grid-cols-[1.1fr_0.9fr] xl:items-stretch">
        <div className="flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-5 md:flex-row">
            <LogoMark initial={profile.name.trim().charAt(0) || "U"} logoUrl={universityLogoUrl} />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-extrabold tracking-normal text-[#070a17]">{profile.name}</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eefcf4] px-3 py-1 text-xs font-bold text-[#15803d]">
                  <ShieldCheck size={14} />
                  Verified
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#4b5670]">
                <span className="rounded-full bg-[#f4f5fa] px-3 py-1.5">{profile.type}</span>
                <span className="rounded-full bg-[#f4f5fa] px-3 py-1.5">{profile.country}</span>
                <span className="rounded-full bg-[#f4f5fa] px-3 py-1.5">Established {profile.established}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-[#dedcff] bg-[#f7f5ff] px-3 py-1.5 text-xs font-bold text-[#5b21f3]">
                    <CircleCheck size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {quickInfo.map(([Icon, label]) => (
              <div key={label} className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#eceef6] bg-[#fbfbfe] px-3">
                <Icon size={17} className="text-[#6D5EF7]" />
                <span className="text-xs font-bold text-[#27324a]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          aria-label="Taylor's University Lakeside Campus"
          className="relative min-h-[290px] overflow-hidden rounded-[22px] bg-[#eef0f6] bg-cover bg-center"
          role="img"
          style={{
            backgroundImage:
              "url(https://upload.wikimedia.org/wikipedia/commons/8/87/Taylor%27s_Lakeside_Campus%2C_Subang_Jaya%2C_Malaysia.jpg)",
          }}
        >
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-end gap-3 bg-[linear-gradient(180deg,transparent,rgba(8,12,27,0.72))] p-4 pt-20">
            <div className="rounded-2xl border border-white/20 bg-white/92 px-4 py-3 shadow-xl backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-normal text-[#65718d]">Profile Completion</p>
              <p className="mt-1 text-2xl font-extrabold text-[#070a17]">92%</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/92 px-4 py-3 shadow-xl backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-normal text-[#65718d]">CareerOS Trust Score</p>
              <p className="mt-1 text-2xl font-extrabold text-[#070a17]">98%</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Overview({ profile }: { profile: UniversityProfileData }) {
  const items = [
    ["Mission", profile.mission],
    ["Vision", profile.vision],
    ["Graduate Employability", profile.employability],
    ["Industry Collaboration Philosophy", profile.industryCollaboration],
  ];

  return (
    <Card className="p-5 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-normal text-[#6D5EF7]">Institution Overview</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-normal text-[#070a17]">About {profile.name}</h2>
          <p className="mt-4 text-sm font-medium leading-7 text-[#53607b]">
            {profile.name} is committed to preparing future-ready graduates through industry collaboration, experiential learning and continuous innovation.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map(([title, body]) => (
            <div key={title} className="rounded-[20px] border border-[#eceef6] bg-[#fbfbfe] p-4 transition hover:-translate-y-0.5 hover:border-[#d8d3ff]">
              <h3 className="text-sm font-extrabold text-[#0b1020]">{title}</h3>
              <p className="mt-2 text-xs font-medium leading-5 text-[#59657f]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function StatCard({ item }: { item: (typeof quickStats)[number] }) {
  const Icon = item.icon;

  return (
    <Card className="p-4 transition hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(15,23,42,0.08)]">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.bg} ${item.tone}`}>
        <Icon size={21} />
      </div>
      <p className="mt-4 text-xs font-extrabold text-[#53607b]">{item.label}</p>
      <p className="mt-1 text-3xl font-extrabold leading-none tracking-normal text-[#070a17]">{item.value}</p>
      <p className="mt-2 text-xs font-semibold text-[#65718d]">{item.detail}</p>
    </Card>
  );
}

function ModalShell({
  children,
  onClose,
  maxWidth = "max-w-xl",
}: {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  useLockBodyScroll();
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#0b0f22]/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: universityEase }}
        className={`relative z-10 max-h-[88vh] w-full ${maxWidth} overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_40px_90px_rgba(15,23,42,0.25)] [-ms-overflow-style:none] [scrollbar-width:none] md:p-7 [&::-webkit-scrollbar]:hidden`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-[#46536D] transition hover:bg-[#F7F8FB]"
        >
          <X size={16} />
        </button>
        {children}
      </motion.div>
    </div>,
    document.body,
  );
}

function CourseLevelEditor({
  course,
  onBack,
  onChangeCourse,
}: {
  course: Course;
  onBack: () => void;
  onChangeCourse: (updater: (course: Course) => Course) => void;
}) {
  const [drafts, setDrafts] = useState<Record<CourseLevel, string>>({ "Level 1": "", "Level 2": "", "Level 3": "" });

  function addModule(level: CourseLevel) {
    const value = drafts[level].trim();
    if (!value) return;
    onChangeCourse((current) => ({ ...current, levels: { ...current.levels, [level]: [...current.levels[level], value] } }));
    setDrafts((prev) => ({ ...prev, [level]: "" }));
  }

  function removeModule(level: CourseLevel, moduleName: string) {
    onChangeCourse((current) => ({
      ...current,
      levels: { ...current.levels, [level]: current.levels[level].filter((item) => item !== moduleName) },
    }));
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-[#5b21f3] transition hover:text-[#4318c9]"
      >
        <ArrowLeft size={14} />
        Back to courses
      </button>
      <h2 className="mt-3 text-xl font-extrabold text-[#070a17]">{course.name}</h2>
      <p className="mt-1 text-sm font-medium text-[#53607b]">Manage the modules taught at each level of this course.</p>

      <div className="mt-5 space-y-5">
        {courseLevels.map((level) => (
          <div key={level} className="rounded-2xl border border-[#eceef6] bg-[#fbfbfe] p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-[#6D5EF7]">{level}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {course.levels[level].length === 0 ? (
                <p className="text-xs font-medium text-[#8a94a6]">No modules added yet.</p>
              ) : (
                course.levels[level].map((moduleName) => (
                  <span
                    key={moduleName}
                    className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#34415e] shadow-sm"
                  >
                    {moduleName}
                    <button
                      type="button"
                      aria-label={`Remove ${moduleName}`}
                      onClick={() => removeModule(level, moduleName)}
                      className="text-[#8a94a6] transition hover:text-[#f0185b]"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={drafts[level]}
                onChange={(event) => setDrafts((prev) => ({ ...prev, [level]: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addModule(level);
                  }
                }}
                placeholder={`Add a module to ${level}`}
                className="h-9 flex-1 rounded-lg border border-[#e5e7f0] bg-white px-3 text-xs font-medium outline-none focus:border-[#8b7bf4]"
              />
              <button
                type="button"
                onClick={() => addModule(level)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6D5EF7] text-white transition hover:bg-[#5f50e8]"
                aria-label={`Add module to ${level}`}
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacultyDetailModal({
  faculty,
  onClose,
  onChangeFaculty,
}: {
  faculty: Faculty;
  onClose: () => void;
  onChangeFaculty: (updater: (faculty: Faculty) => Faculty) => void;
}) {
  const [activeCourseSlug, setActiveCourseSlug] = useState<string | null>(null);
  const [newCourseName, setNewCourseName] = useState("");

  const activeCourse = faculty.courses.find((course) => course.slug === activeCourseSlug) ?? null;

  function addCourse() {
    const name = newCourseName.trim();
    if (!name) return;
    onChangeFaculty((current) => ({ ...current, courses: [...current.courses, makeCourse(name)] }));
    setNewCourseName("");
  }

  function removeCourse(slug: string) {
    onChangeFaculty((current) => ({ ...current, courses: current.courses.filter((course) => course.slug !== slug) }));
  }

  function updateActiveCourse(updater: (course: Course) => Course) {
    if (!activeCourseSlug) return;
    onChangeFaculty((current) => ({
      ...current,
      courses: current.courses.map((course) => (course.slug === activeCourseSlug ? updater(course) : course)),
    }));
  }

  return (
    <ModalShell onClose={onClose}>
      {activeCourse ? (
        <CourseLevelEditor course={activeCourse} onBack={() => setActiveCourseSlug(null)} onChangeCourse={updateActiveCourse} />
      ) : (
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0e9ff] text-[#6D5EF7]">
              <GraduationCap size={22} />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-[#070a17]">{faculty.name}</h2>
              <p className="text-xs font-medium text-[#53607b]">{faculty.students} &middot; {faculty.lecturers}</p>
            </div>
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-normal text-[#64708b]">Courses</p>
          <div className="mt-2 space-y-2">
            {faculty.courses.map((course) => (
              <div
                key={course.slug}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#eceef6] bg-white p-3 transition hover:border-[#d8d3ff]"
              >
                <button
                  type="button"
                  onClick={() => setActiveCourseSlug(course.slug)}
                  className="flex flex-1 items-center justify-between gap-2 text-left"
                >
                  <div>
                    <p className="text-sm font-extrabold text-[#0b1020]">{course.name}</p>
                    <p className="text-xs font-medium text-[#65718d]">
                      {courseLevels.reduce((sum, level) => sum + course.levels[level].length, 0)} modules across 3 levels
                    </p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-[#6D5EF7]" />
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${course.name}`}
                  onClick={() => removeCourse(course.slug)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8a94a6] transition hover:bg-[#fff0f5] hover:text-[#f0185b]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {faculty.courses.length === 0 ? (
              <p className="text-xs font-medium text-[#8a94a6]">No courses added yet.</p>
            ) : null}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={newCourseName}
              onChange={(event) => setNewCourseName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addCourse();
                }
              }}
              placeholder="Add a new course"
              className="h-10 flex-1 rounded-xl border border-[#e5e7f0] bg-white px-3 text-sm font-medium outline-none focus:border-[#8b7bf4]"
            />
            <button
              type="button"
              onClick={addCourse}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-[#6D5EF7] px-4 text-xs font-bold text-white transition hover:bg-[#5f50e8]"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}

function ManageFacultiesModal({
  faculties,
  onClose,
  onAddFaculty,
  onRemoveFaculty,
}: {
  faculties: Faculty[];
  onClose: () => void;
  onAddFaculty: (name: string) => void;
  onRemoveFaculty: (slug: string) => void;
}) {
  const [newFacultyName, setNewFacultyName] = useState("");

  function handleAdd() {
    const name = newFacultyName.trim();
    if (!name) return;
    onAddFaculty(name);
    setNewFacultyName("");
  }

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-xl font-extrabold text-[#070a17]">Manage Faculties</h2>
      <p className="mt-1 text-sm font-medium text-[#53607b]">Add new schools/faculties or remove ones that no longer apply.</p>

      <div className="mt-5 space-y-2">
        {faculties.map((faculty) => (
          <div key={faculty.slug} className="flex items-center justify-between gap-3 rounded-2xl border border-[#eceef6] bg-white p-3">
            <div>
              <p className="text-sm font-extrabold text-[#0b1020]">{faculty.name}</p>
              <p className="text-xs font-medium text-[#65718d]">{faculty.students} &middot; {faculty.courses.length} courses</p>
            </div>
            <button
              type="button"
              aria-label={`Remove ${faculty.name}`}
              onClick={() => onRemoveFaculty(faculty.slug)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8a94a6] transition hover:bg-[#fff0f5] hover:text-[#f0185b]"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={newFacultyName}
          onChange={(event) => setNewFacultyName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Add a new faculty"
          className="h-10 flex-1 rounded-xl border border-[#e5e7f0] bg-white px-3 text-sm font-medium outline-none focus:border-[#8b7bf4]"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex h-10 items-center gap-1.5 rounded-xl bg-[#6D5EF7] px-4 text-xs font-bold text-white transition hover:bg-[#5f50e8]"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-[#081433] text-sm font-bold text-white transition hover:bg-[#152238]"
      >
        Done
      </button>
    </ModalShell>
  );
}

function Faculties() {
  const [faculties, setFaculties] = useState<Faculty[]>(initialFaculties);
  const [openFacultySlug, setOpenFacultySlug] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);

  const openFaculty = faculties.find((faculty) => faculty.slug === openFacultySlug) ?? null;

  function updateFaculty(slug: string, updater: (faculty: Faculty) => Faculty) {
    setFaculties((current) => current.map((faculty) => (faculty.slug === slug ? updater(faculty) : faculty)));
  }

  function addFaculty(name: string) {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setFaculties((current) => [
      ...current,
      { slug, name, students: "0 students", lecturers: "0 lecturers", readiness: "0%", courses: [] },
    ]);
  }

  function removeFaculty(slug: string) {
    setFaculties((current) => current.filter((faculty) => faculty.slug !== slug));
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#070a17]">Schools &amp; Faculties</h2>
        <button
          type="button"
          onClick={() => setManageOpen(true)}
          className="flex items-center gap-2 text-xs font-bold text-[#5b21f3]"
        >
          Manage faculties
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {faculties.map((faculty) => (
          <button
            key={faculty.slug}
            type="button"
            onClick={() => setOpenFacultySlug(faculty.slug)}
            className="text-left"
          >
            <Card className="p-5 transition hover:-translate-y-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0e9ff] text-[#6D5EF7]">
                <GraduationCap size={22} />
              </span>
              <h3 className="mt-5 text-base font-extrabold text-[#070a17]">{faculty.name}</h3>
              <div className="mt-4 space-y-2 text-xs font-semibold text-[#53607b]">
                <p>{faculty.students}</p>
                <p>{faculty.lecturers}</p>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#53607b]">AI Readiness</span>
                  <span className="text-[#0b1020]">{faculty.readiness}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#eeeef6]">
                  <AnimatedProgress width={faculty.readiness} />
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openFaculty ? (
          <FacultyDetailModal
            faculty={openFaculty}
            onClose={() => setOpenFacultySlug(null)}
            onChangeFaculty={(updater) => updateFaculty(openFaculty.slug, updater)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {manageOpen ? (
          <ManageFacultiesModal
            faculties={faculties}
            onClose={() => setManageOpen(false)}
            onAddFaculty={addFaculty}
            onRemoveFaculty={removeFaculty}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function PartnerLogo({ name }: { name: string }) {
  const colors: Record<string, string> = {
    Microsoft: "text-[#2563eb]",
    Google: "text-[#dc2626]",
    Shopee: "text-[#f97316]",
    Petronas: "text-[#0f766e]",
    Intel: "text-[#0369a1]",
    Dell: "text-[#1d4ed8]",
    Maybank: "text-[#111827]",
    AWS: "text-[#f59e0b]",
  };

  return (
    <div className="flex h-20 items-center justify-center rounded-[20px] border border-[#eceef6] bg-[#fbfbfe] px-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-[#d8d3ff]">
      <span className={`text-lg font-black tracking-normal ${colors[name]}`}>{name}</span>
    </div>
  );
}

function IndustryPartners() {
  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-normal text-[#6D5EF7]">Industry Partners</p>
          <h2 className="mt-2 text-xl font-extrabold text-[#070a17]">Trusted employer network</h2>
        </div>
        <button className="flex h-10 items-center gap-2 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-bold text-[#34415e] shadow-sm">
          View All Partners
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((partner) => (
          <PartnerLogo key={partner} name={partner} />
        ))}
      </div>
      <div className="mt-5 rounded-[20px] border border-[#ddd8ff] bg-[#f7f5ff] p-4">
        <div className="flex gap-3">
          <Sparkles size={20} className="mt-0.5 shrink-0 text-[#6D5EF7]" fill="currentColor" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-normal text-[#6D5EF7]">CareerOS Insight</p>
            <p className="mt-1 text-sm font-bold leading-6 text-[#172039]">
              Students involved in Microsoft projects have a 37% higher internship conversion rate.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function TopProgrammes() {
  return (
    <Card className="p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#070a17]">Top Programmes</h2>
        <button className="text-xs font-bold text-[#5b21f3]">View all</button>
      </div>
      <div className="mt-4 space-y-3">
        {programmes.map(([name, alignment, graduates, detail]) => (
          <button key={name} className="grid w-full gap-4 rounded-[20px] border border-[#eceef6] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#d8d3ff] md:grid-cols-[1fr_120px_110px_auto] md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#070a17]">{name}</h3>
                <span className="inline-flex text-[#f59e0b]">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} size={13} fill="currentColor" />
                  ))}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium leading-5 text-[#65718d]">{detail}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#65718d]">Industry Alignment</p>
              <p className="mt-1 text-xl font-extrabold text-[#070a17]">{alignment}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#65718d]">Graduates</p>
              <p className="mt-1 text-xl font-extrabold text-[#070a17]">{graduates}</p>
            </div>
            <ChevronRight size={18} className="hidden text-[#6D5EF7] md:block" />
          </button>
        ))}
      </div>
    </Card>
  );
}

function Achievements() {
  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-xl font-extrabold text-[#070a17]">Recent Achievements</h2>
      <div className="mt-5 space-y-0">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;

          return (
            <div key={achievement.title} className="grid grid-cols-[42px_1fr_auto] gap-3">
              <div className="relative flex justify-center">
                <span className="z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0e9ff] text-[#6D5EF7]">
                  <Icon size={19} />
                </span>
                {index < achievements.length - 1 ? <span className="absolute top-10 h-full w-px bg-[#e6e8f1]" /> : null}
              </div>
              <div className="pb-5">
                <h3 className="text-sm font-extrabold text-[#070a17]">{achievement.title}</h3>
                <p className="mt-1 text-xs font-medium text-[#65718d]">Institutional milestone</p>
              </div>
              <span className="pt-2 text-xs font-extrabold text-[#53607b]">{achievement.year}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function AIInsights() {
  return (
    <AnimatedAIPanel>
      <Card className="overflow-hidden border-[#ddd8ff] bg-[linear-gradient(135deg,#ffffff_0%,#f7f5ff_52%,#fff_100%)] p-5 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6D5EF7] text-white shadow-[0_18px_35px_rgba(109,94,247,0.28)]">
              <Sparkles size={23} fill="currentColor" />
            </span>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-normal text-[#6D5EF7]">Generated by CareerOS AI</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-normal text-[#070a17]">CareerOS AI Insights</h2>
          </div>
          <div>
            <p className="text-sm font-medium leading-7 text-[#4b5670]">
              Your university demonstrates exceptional industry engagement and graduate employability. However, there is growing employer demand for AI Engineering, Cloud Computing and Prompt Engineering. CareerOS recommends expanding interdisciplinary AI programmes and increasing employer-led industry projects.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Graduate Employability", "Industry Alignment", "Employer Engagement"].map((impact) => (
                <div key={impact} className="rounded-[18px] border border-[#e2defe] bg-white/80 p-3">
                  <p className="text-xl font-extrabold text-[#16a34a]">↑</p>
                  <p className="mt-1 text-xs font-bold text-[#172039]">{impact}</p>
                </div>
              ))}
            </div>
            <Link href="/university/curriculum">
              <Button className="mt-5 h-11 rounded-xl bg-[#6D5EF7] px-5 text-xs font-bold text-white hover:bg-[#5f50e8]">
                View Recommendations
                <ArrowUpRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </AnimatedAIPanel>
  );
}

function ContactSection({ profile }: { profile: UniversityProfileData }) {
  function ContactRow({ item }: { item: ContactItem }) {
    const [title, detail, Icon] = item;
    return (
      <div className="flex items-center gap-3 rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0e9ff] text-[#6D5EF7]">
          <Icon size={18} />
        </span>
        <div>
          <p className="text-xs font-extrabold text-[#070a17]">{title}</p>
          <p className="mt-0.5 text-xs font-medium text-[#65718d]">{detail}</p>
        </div>
      </div>
    );
  }

  const contacts = buildContactItems(profile);
  const socials = buildSocialItems(profile);

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-xl font-extrabold text-[#070a17]">University Contact</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {contacts.map((item) => (
            <ContactRow key={item[0]} item={item} />
          ))}
        </div>
        <div className="space-y-3">
          {socials.map((item) => (
            <ContactRow key={item[0]} item={item} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function BottomCTA() {
  return (
    <Card className="overflow-hidden border-[#ddd8ff] bg-[linear-gradient(135deg,#ffffff_0%,#f5f2ff_100%)] p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6D5EF7] text-white sm:flex">
            <Rocket size={25} />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold tracking-normal text-[#070a17]">Continue Building Future Talent</h2>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#53607b]">
              CareerOS helps universities continuously improve graduate outcomes through AI-driven curriculum intelligence, employer collaboration and lifelong alumni engagement.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/university/profile/public">
            <Button className="h-11 rounded-xl border-[#e6e8f1] bg-white px-5 text-xs font-bold text-[#34415e] shadow-sm hover:bg-[#faf7ff]" variant="outline">
              <ExternalLink size={15} />
              Preview Public Profile
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default function UniversityProfile() {
  const { profile } = useUniversityProfile();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(109,94,247,0.08),transparent_28rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1480px]">
          <AnimatedSection>
            <Header universityName={profile.name} />
          </AnimatedSection>

          <div className="mt-6 space-y-5">
            <HeroCard profile={profile} />
            <Overview profile={profile} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {quickStats.map((item) => (
                <StatCard key={item.label} item={item} />
              ))}
            </div>
            <Faculties />
            <IndustryPartners />
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <TopProgrammes />
              <Achievements />
            </div>
            <AIInsights />
            <ContactSection profile={profile} />
            <BottomCTA />
          </div>
        </div>
      </div>
    </main>
  );
}
