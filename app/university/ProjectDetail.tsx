"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  FileText,
  Link2,
  Mail,
  Plus,
  Share2,
  Trophy,
  Upload,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AnimatedCard, AnimatedList, AnimatedRow, AnimatedSection } from "./UniversityMotion";
import { ProjectLogo, projects, statusTone } from "./industryData";

const candidatePool = [
  { name: "Jason Tan", program: "BSc Data Science • Year 3", match: 92 },
  { name: "Sarah Lim", program: "BSc Computer Science • Year 3", match: 89 },
  { name: "Ameer Hakim", program: "BSc Information Systems • Year 3", match: 87 },
  { name: "Yi Xuan Ng", program: "BSc Data Analytics • Year 3", match: 85 },
  { name: "Chloe Lim", program: "BSc Information Systems • Year 3", match: 83 },
  { name: "Marcus Ong", program: "BSc Computer Science • Year 4", match: 80 },
];

const assignedTeamName = "DataViz Squad";

const assignedStudentPool = [
  { name: "Aisyah Humaira", program: "BSc Data Science • Year 3", role: "Project Lead" },
  { name: "Ryan Tan", program: "BSc Software Engineering • Year 2", role: "Data Analyst" },
  { name: "Nur Alya", program: "BSc Cyber Security • Year 3", role: "Research Assistant" },
  { name: "Daniel Wong", program: "BSc Computer Science • Class of 2021", role: "Dashboard Developer" },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={className}>{children}</AnimatedCard>;
}

function TopBar({ project }: { project: (typeof projects)[number] }) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <Link
          href="/university/industry"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#53607b] hover:text-[#5b21f3]"
        >
          <ArrowLeft size={14} />
          Back to Project Hub
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <ProjectLogo type={project.logo} />
          <div>
            <h1 className="text-2xl font-extrabold tracking-normal text-[#070a17] md:text-[28px]">{project.title}</h1>
            <p className="mt-1 text-sm font-bold text-[#53607b]">{project.company}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
        <button aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e8f1] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6b35ff] text-[10px] font-bold text-white">3</span>
        </button>
        <button className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#e6e8f1] bg-white px-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ececf4] bg-white text-base font-black text-[#e11d48]">T</div>
          <span className="text-left">
            <span className="block text-xs font-bold text-[#0b1020]">Dr. Melissa Lim</span>
            <span className="block text-xs font-medium text-[#53607b]">Career &amp; Industry Office</span>
          </span>
          <ChevronDown size={15} className="ml-4" />
        </button>
        <button className="flex h-10 items-center gap-2 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-bold text-[#34415e] shadow-sm">
          <Share2 size={15} />
          Share
        </button>
      </div>
    </header>
  );
}

function OverviewCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusTone[project.status] ?? "bg-[#e8f2ff] text-[#2563eb]"}`}>
          {project.status}
        </span>
        <span className="text-xs font-semibold text-[#53607b]">{project.days}</span>
      </div>
      <p className="mt-4 max-w-3xl text-sm font-medium leading-6 text-[#53607b]">
        {project.longDescription ?? project.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#65718d]">
        <span className="flex items-center gap-1.5">
          <CalendarDays size={13} />
          Posted {project.postedOn}
        </span>
        {project.deadline ? (
          <span className="flex items-center gap-1.5 text-[#f0185b]">
            <CalendarDays size={13} />
            Apply by {project.deadline}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-lg bg-[#f4f3f8] px-2 py-1 text-[11px] font-semibold text-[#53607b]">
            {tag}
          </span>
        ))}
        {project.requirementsDoc ? (
          <a
            href={project.requirementsDoc}
            download
            className="ml-auto flex items-center gap-2 rounded-xl border border-[#e6e8f1] bg-white px-3 py-1.5 text-xs font-bold text-[#5b21f3] transition hover:bg-[#faf7ff]"
          >
            <FileText size={14} />
            Download Requirements (PDF)
          </a>
        ) : null}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-[#edf0f6] p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#efe7ff] text-[#6733f4]">
            <CalendarDays size={17} />
          </span>
          <div>
            <p className="text-xs font-bold text-[#26324d]">{project.duration}</p>
            <p className="text-[11px] font-medium text-[#53607b]">Duration</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#edf0f6] p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f2ff] text-[#2563eb]">
            <Users size={17} />
          </span>
          <div>
            <p className="text-xs font-bold text-[#26324d]">{project.slots} slots</p>
            <p className="text-[11px] font-medium text-[#53607b]">Student capacity</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#edf0f6] p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e1f7eb] text-[#16a34a]">
            <Wallet size={17} />
          </span>
          <div>
            <p className="text-xs font-bold text-[#26324d]">{project.support}</p>
            <p className="text-[11px] font-medium text-[#53607b]">Student support</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CandidateRow({ candidate }: { candidate: (typeof candidatePool)[number] }) {
  const [sent, setSent] = useState(false);

  return (
    <AnimatedRow className="grid grid-cols-[36px_1fr_120px_auto_auto] items-center gap-3 border-b border-[#edf0f6] py-3 last:border-b-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f2ff] text-xs font-black text-[#34415e]">
        {candidate.name[0]}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#090d1b]">{candidate.name}</p>
        <p className="mt-0.5 text-xs font-medium text-[#53607b]">{candidate.program}</p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-[#53607b]">Suitable match</p>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-[#eee7ff]">
            <div className="h-1.5 rounded-full bg-[#8b5cf6]" style={{ width: `${candidate.match}%` }} />
          </div>
          <span className="text-xs font-bold text-[#16a34a]">{candidate.match}%</span>
        </div>
      </div>
      <Link
        href="/university/talent/profile"
        className="rounded-lg bg-[#f6f2ff] px-3 py-2 text-xs font-bold text-[#5b21f3] transition hover:bg-[#efe4ff]"
      >
        Check Profile
      </Link>
      <button
        type="button"
        onClick={() => setSent(true)}
        disabled={sent}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
          sent
            ? "bg-[#e1f7eb] text-[#16a34a]"
            : "border border-[#e6e8f1] bg-white text-[#34415e] hover:bg-[#faf7ff]"
        }`}
      >
        {sent ? <Check size={14} /> : <Mail size={14} />}
        {sent ? "Email Sent" : "Send to Student"}
      </button>
    </AnimatedRow>
  );
}

function AssignedStudentRow({
  student,
  badgeTone,
}: {
  student: (typeof assignedStudentPool)[number];
  badgeTone: string;
}) {
  return (
    <AnimatedRow className="grid grid-cols-[36px_1fr_140px_auto] items-center gap-3 border-b border-[#edf0f6] py-3 last:border-b-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f2ff] text-xs font-black text-[#34415e]">
        {student.name[0]}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#090d1b]">{student.name}</p>
        <p className="mt-0.5 text-xs font-medium text-[#53607b]">{student.program}</p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-[#53607b]">Role</p>
        <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeTone}`}>
          {student.role}
        </span>
      </div>
      <Link
        href="/university/talent/profile"
        className="rounded-lg bg-[#f6f2ff] px-3 py-2 text-xs font-bold text-[#5b21f3] transition hover:bg-[#efe4ff]"
      >
        Check Profile
      </Link>
    </AnimatedRow>
  );
}

function AssignedStudents({ project }: { project: (typeof projects)[number] }) {
  const isActive = project.status === "In Progress";
  const badgeLabel = isActive ? "Active" : "Completed";
  const badgeTone = isActive ? "bg-[#e8f2ff] text-[#2563eb]" : "bg-[#e1f7eb] text-[#16a34a]";

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#090d1b]">
            Assigned Students <span className="text-[#6733f4]">— {assignedTeamName}</span>
          </h2>
          <p className="mt-1 text-xs font-medium text-[#53607b]">
            Students {isActive ? "currently working on" : "who worked on"} {project.company}&apos;s {project.title}.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${badgeTone}`}>
          {assignedStudentPool.length} {badgeLabel.toLowerCase()}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[36px_1fr_140px_auto] gap-3 text-[11px] font-semibold text-[#65718d]">
        <span></span>
        <span>Student</span>
        <span>Role</span>
        <span>Profile</span>
      </div>
      <AnimatedList>
        {assignedStudentPool.map((student) => (
          <AssignedStudentRow key={student.name} student={student} badgeTone={badgeTone} />
        ))}
      </AnimatedList>
    </Card>
  );
}

const pitchStages = [
  { label: "Application Submitted", detail: "Team registered and proposal reviewed" },
  { label: "Shortlisted", detail: "Selected among top proposals for the final pitch" },
  { label: "Final Pitch", detail: "Presented the solution live to the employer panel" },
  { label: "Selected — Winner", detail: "Chosen as the winning team for this project" },
];

function PitchJourneyCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#090d1b]">Pitch Journey</h2>
          <p className="mt-1 text-xs font-medium text-[#53607b]">
            {assignedTeamName} was selected from 5 competing student teams across the university for{" "}
            {project.company}&apos;s {project.title}.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-[#fff0d9] px-3 py-1.5 text-xs font-bold text-[#c76a00]">
          <Trophy size={14} />
          Winning Team
        </span>
      </div>

      <div className="relative mt-8 grid gap-6 sm:grid-cols-4">
        <div className="pointer-events-none absolute left-[12%] right-[12%] top-[18px] hidden h-0.5 bg-[#16a34a] sm:block" />
        {pitchStages.map((stage, index) => (
          <div key={stage.label} className="relative z-10 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-[0_10px_22px_rgba(22,163,74,0.28)]">
              <Check size={17} strokeWidth={3} />
            </div>
            <p className="mt-3 text-xs font-bold text-[#090d1b]">{stage.label}</p>
            <p className="mt-1 text-[11px] font-medium leading-4 text-[#53607b]">{stage.detail}</p>
            {index === pitchStages.length - 1 ? (
              <p className="mt-2 text-[10px] font-bold text-[#16a34a]">Completed</p>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

function SubmissionOutcomeCard({ project }: { project: (typeof projects)[number] }) {
  const isCompleted = project.status === "Completed";

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-[#090d1b]">Submission Outcome</h2>
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
            isCompleted ? "bg-[#e1f7eb] text-[#16a34a]" : "bg-[#f4f4f8] text-[#65718d]"
          }`}
        >
          {isCompleted ? "Selected — Project Delivered" : "Not Selected"}
        </span>
      </div>

      {isCompleted ? (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#edf0f6] p-3">
              <p className="text-[11px] font-medium text-[#53607b]">Submitted by</p>
              <p className="mt-1 text-xs font-bold text-[#26324d]">{assignedTeamName}</p>
            </div>
            <div className="rounded-xl border border-[#edf0f6] p-3">
              <p className="text-[11px] font-medium text-[#53607b]">Date submitted</p>
              <p className="mt-1 text-xs font-bold text-[#26324d]">10 March 2025</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-[#edf0f6] p-3">
            <p className="text-[11px] font-medium text-[#53607b]">Deliverable</p>
            <a
              href="#"
              className="mt-1 block truncate text-xs font-bold text-[#2563eb] hover:underline"
            >
              https://drive.google.com/{project.slug}-final-submission
            </a>
          </div>
          <div className="mt-3 rounded-xl bg-[#f6f2ff] p-3 text-xs font-medium leading-5 text-[#47347c]">
            &quot;The final deliverable clearly surfaced actionable insights — great work by the team.&quot; —{" "}
            {project.company} project sponsor
          </div>
        </>
      ) : (
        <p className="mt-4 text-xs font-medium leading-5 text-[#53607b]">
          Applications for this project closed before a student team was matched. No submission was made for{" "}
          {project.company}&apos;s {project.title}.
        </p>
      )}
    </Card>
  );
}

type ProjectSubmission = { link: string; fileName: string | null; notes: string };

function ProjectSubmissionCard({ project }: { project: (typeof projects)[number] }) {
  const [link, setLink] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!link.trim()) return;

    setSubmissions((prev) => [{ link: link.trim(), fileName, notes }, ...prev]);
    setLink("");
    setFileName(null);
    setNotes("");
  };

  const canSubmit = link.trim().length > 0;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#090d1b]">Submit Project Deliverable</h2>
          <p className="mt-1 text-xs font-medium text-[#53607b]">
            Submit progress on {project.company}&apos;s {project.title} for employer review.
          </p>
        </div>
        <span className="rounded-full bg-[#f0e9ff] px-3 py-1.5 text-xs font-bold text-[#5b21f3]">
          Submitting for: {assignedTeamName}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#26324d]">
            Project Link
            <div className="flex h-10 items-center gap-2 rounded-xl border border-[#e6e8f1] bg-white px-3 focus-within:border-[#c9b6ff]">
              <Link2 size={14} className="shrink-0 text-[#65718d]" />
              <input
                type="url"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                placeholder="https://github.com/... or drive link"
                className="w-full bg-transparent text-xs font-medium text-[#26324d] outline-none placeholder:text-[#9aa3b8]"
              />
            </div>
          </label>

          <div className="flex flex-col gap-1.5 text-xs font-semibold text-[#26324d]">
            Package / File
            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#c9b6ff] bg-[#faf7ff] px-3 text-xs font-medium text-[#5b21f3]">
              <Upload size={14} className="shrink-0" />
              <span className="truncate">{fileName ?? "Upload package (.zip, .pdf...)"}</span>
              <input
                type="file"
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#26324d]">
          Notes (optional)
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Summarize what's included in this submission..."
            rows={3}
            className="rounded-xl border border-[#e6e8f1] bg-white px-3 py-2 text-xs font-medium text-[#26324d] outline-none placeholder:text-[#9aa3b8] focus:border-[#c9b6ff]"
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="h-10 rounded-xl bg-[#6733f4] px-5 text-xs font-bold text-white transition hover:bg-[#5b21f3] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Project
        </button>
      </form>

      {submissions.length > 0 ? (
        <div className="mt-4 space-y-2 border-t border-[#edf0f6] pt-4">
          {submissions.map((entry, index) => (
            <div key={`${entry.link}-${index}`} className="flex items-start gap-3 rounded-xl bg-[#f6f2ff] px-3 py-3">
              <Check size={15} className="mt-0.5 shrink-0 text-[#16a34a]" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold text-[#090d1b]">{assignedTeamName}</p>
                  <span className="text-[10px] font-bold text-[#5b21f3]">Submitted for review</span>
                </div>
                <a
                  href={entry.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block truncate text-[11px] font-medium text-[#2563eb] hover:underline"
                >
                  {entry.link}
                </a>
                {entry.fileName ? (
                  <p className="mt-0.5 text-[11px] font-medium text-[#65718d]">Attached: {entry.fileName}</p>
                ) : null}
                {entry.notes ? <p className="mt-1 text-[11px] font-medium text-[#65718d]">{entry.notes}</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

type Teammate = { name: string; position: string };
type GroupApplication = { groupName: string; members: Teammate[]; note: string };

let teammateKeySeed = 0;
function nextTeammateKey() {
  teammateKeySeed += 1;
  return teammateKeySeed;
}

function emptyTeammate() {
  return { key: nextTeammateKey(), name: "", position: "" };
}

function SubmitApplicationCard({ project }: { project: (typeof projects)[number] }) {
  const [groupName, setGroupName] = useState("");
  const [teammates, setTeammates] = useState([emptyTeammate()]);
  const [note, setNote] = useState("");
  const [submissions, setSubmissions] = useState<GroupApplication[]>([]);

  const updateTeammate = (key: number, field: "name" | "position", value: string) => {
    setTeammates((prev) => prev.map((item) => (item.key === key ? { ...item, [field]: value } : item)));
  };

  const addTeammate = () => {
    setTeammates((prev) => [...prev, emptyTeammate()]);
  };

  const removeTeammate = (key: number) => {
    setTeammates((prev) => (prev.length > 1 ? prev.filter((item) => item.key !== key) : prev));
  };

  const filledTeammates = teammates.filter((item) => item.name.trim().length > 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!groupName.trim() || filledTeammates.length === 0) return;

    setSubmissions((prev) => [
      {
        groupName: groupName.trim(),
        members: filledTeammates.map((item) => ({ name: item.name.trim(), position: item.position.trim() })),
        note,
      },
      ...prev,
    ]);
    setGroupName("");
    setTeammates([emptyTeammate()]);
    setNote("");
  };

  const canSubmit = groupName.trim().length > 0 && filledTeammates.length > 0;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-[#090d1b]">Submit Application</h2>
        {project.deadline ? (
          <span className="rounded-full bg-[#ffe3f1] px-3 py-1.5 text-xs font-bold text-[#f0185b]">
            Apply by {project.deadline}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs font-medium text-[#53607b]">
        Register a student group to apply for {project.company}&apos;s {project.title}.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#26324d]">
          Group / Team Name
          <input
            type="text"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="e.g. DataViz Squad"
            className="h-10 rounded-xl border border-[#e6e8f1] bg-white px-3 text-xs font-medium text-[#26324d] outline-none placeholder:text-[#9aa3b8] focus:border-[#c9b6ff]"
          />
        </label>

        <div>
          <p className="text-xs font-semibold text-[#26324d]">Team Members</p>
          <div className="mt-2 space-y-2">
            {teammates.map((teammate, index) => (
              <div key={teammate.key} className="flex items-center gap-2">
                <input
                  type="text"
                  value={teammate.name}
                  onChange={(event) => updateTeammate(teammate.key, "name", event.target.value)}
                  placeholder="Student name"
                  className="h-10 flex-1 rounded-xl border border-[#e6e8f1] bg-white px-3 text-xs font-medium text-[#26324d] outline-none placeholder:text-[#9aa3b8] focus:border-[#c9b6ff]"
                />
                <input
                  type="text"
                  value={teammate.position}
                  onChange={(event) => updateTeammate(teammate.key, "position", event.target.value)}
                  placeholder="Team position (e.g. Team Lead)"
                  className="h-10 flex-1 rounded-xl border border-[#e6e8f1] bg-white px-3 text-xs font-medium text-[#26324d] outline-none placeholder:text-[#9aa3b8] focus:border-[#c9b6ff]"
                />
                <button
                  type="button"
                  onClick={() => removeTeammate(teammate.key)}
                  disabled={teammates.length === 1}
                  aria-label="Remove teammate"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e6e8f1] text-[#65718d] transition hover:bg-[#faf7ff] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTeammate}
            className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#5b21f3] hover:text-[#4318c9]"
          >
            <Plus size={14} />
            Add Teammate
          </button>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#26324d]">
          Motivation / Note (optional)
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Tell the employer why this team is a strong fit..."
            rows={3}
            className="rounded-xl border border-[#e6e8f1] bg-white px-3 py-2 text-xs font-medium text-[#26324d] outline-none placeholder:text-[#9aa3b8] focus:border-[#c9b6ff]"
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="h-10 rounded-xl bg-[#6733f4] px-5 text-xs font-bold text-white transition hover:bg-[#5b21f3] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Application
        </button>
      </form>

      {submissions.length > 0 ? (
        <div className="mt-4 space-y-2 border-t border-[#edf0f6] pt-4">
          {submissions.map((entry, index) => (
            <div key={`${entry.groupName}-${index}`} className="flex items-start gap-3 rounded-xl bg-[#f6f2ff] px-3 py-3">
              <Check size={15} className="mt-0.5 shrink-0 text-[#16a34a]" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold text-[#090d1b]">{entry.groupName}</p>
                  <span className="text-[10px] font-bold text-[#5b21f3]">Application submitted</span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-[#53607b]">
                  {entry.members.map((member) => `${member.name}${member.position ? ` (${member.position})` : ""}`).join(", ")}
                </p>
                {entry.note ? <p className="mt-1 text-[11px] font-medium text-[#65718d]">{entry.note}</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function TalentMatches({ project }: { project: (typeof projects)[number] }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#090d1b]">Potential Talent Matches</h2>
          <p className="mt-1 text-xs font-medium text-[#53607b]">
            Students whose skills align with {project.company}&apos;s {project.title}, ranked by suitability.
          </p>
        </div>
        <span className="rounded-full bg-[#f0e9ff] px-3 py-1.5 text-xs font-bold text-[#5b21f3]">
          {candidatePool.length} matches
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[36px_1fr_120px_auto_auto] gap-3 text-[11px] font-semibold text-[#65718d]">
        <span></span>
        <span>Student</span>
        <span>Suitable Match</span>
        <span>Profile</span>
        <span>Outreach</span>
      </div>
      <AnimatedList>
        {candidatePool.map((candidate) => (
          <CandidateRow key={candidate.name} candidate={candidate} />
        ))}
      </AnimatedList>
    </Card>
  );
}

export default function ProjectDetail({ slug }: { slug: string }) {
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(111,66,255,0.07),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1100px]">
          <AnimatedSection>
            <TopBar project={project} />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-6">
            <OverviewCard project={project} />
          </AnimatedSection>

          {project.status === "Open" ? (
            <>
              <AnimatedSection delay={0.16} className="mt-4">
                <SubmitApplicationCard project={project} />
              </AnimatedSection>
              <AnimatedSection delay={0.24} className="mt-4">
                <TalentMatches project={project} />
              </AnimatedSection>
            </>
          ) : project.status === "In Progress" ? (
            <>
              <AnimatedSection delay={0.16} className="mt-4">
                <ProjectSubmissionCard project={project} />
              </AnimatedSection>
              <AnimatedSection delay={0.24} className="mt-4">
                <AssignedStudents project={project} />
              </AnimatedSection>
            </>
          ) : project.status === "Completed" ? (
            <>
              <AnimatedSection delay={0.16} className="mt-4">
                <PitchJourneyCard project={project} />
              </AnimatedSection>
              <AnimatedSection delay={0.24} className="mt-4">
                <SubmissionOutcomeCard project={project} />
              </AnimatedSection>
              <AnimatedSection delay={0.32} className="mt-4">
                <AssignedStudents project={project} />
              </AnimatedSection>
            </>
          ) : (
            <AnimatedSection delay={0.16} className="mt-4">
              <SubmissionOutcomeCard project={project} />
            </AnimatedSection>
          )}
        </div>
      </div>
    </main>
  );
}
