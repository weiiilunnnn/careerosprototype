"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  ClipboardList,
  Gauge,
  Eye,
  FilePlus2,
  FolderOpen,
  MailPlus,
  Medal,
  Menu,
  MapPin,
  MessageSquareText,
  PenLine,
  LogOut,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  UserCog,
  UserPlus,
  UsersRound,
  X,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getWorkAnimal,
  supervisorGuide,
  topAnimalsForJob,
  workAnimals,
} from "@/lib/workAnimals";
import type { WorkAnimalSlug } from "@/lib/workAnimals";
import {
  initialHiringSettings,
  navItems,
  rolePermissions,
} from "./data";
import {
  candidateLabels,
  candidateScore,
  getNextAction,
  renderEmailTemplate,
  summarizeJob,
} from "./logic";
import { employerPageMap } from "./navigation";
import { createEmployerStore, getEmployerSession, loadEmployerStore, roleFocus, saveEmployerStore } from "./store";
import type {
  ActivityEvent,
  ActivityTone,
  Candidate,
  Company,
  CompanyRole,
  EmployerStore,
  HiringSettings,
  Job,
  JobStatus,
  Page,
  TeamMember,
} from "./types";

const smoothEase = [0.4, 0, 0.2, 1] as const;

const pageMotion = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(4px)" },
  transition: { duration: 0.32, ease: smoothEase },
};

const listContainerMotion = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.04,
    },
  },
};

const listItemMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: smoothEase },
};

const tactileTap = { scale: 0.985 };

function insertTokenAtCursor(
  textarea: HTMLTextAreaElement | null,
  currentValue: string,
  token: string,
  onChange: (value: string) => void
) {
  if (!textarea) {
    onChange(`${currentValue}${currentValue.endsWith(" ") || currentValue.endsWith("\n") ? "" : " "}${token}`);
    return;
  }

  const start = textarea.selectionStart ?? currentValue.length;
  const end = textarea.selectionEnd ?? currentValue.length;
  const nextValue = `${currentValue.slice(0, start)}${token}${currentValue.slice(end)}`;
  onChange(nextValue);

  requestAnimationFrame(() => {
    textarea.focus();
    const cursor = start + token.length;
    textarea.setSelectionRange(cursor, cursor);
  });
}

export function EmployerPrototype() {
  const initialStore = useMemo(() => loadEmployerStore(), []);
  const [hasCompany, setHasCompany] = useState(Boolean(initialStore));
  const [company, setCompany] = useState<Company>(() => initialStore?.company ?? {
    name: "",
    industry: "",
    location: "",
    size: "",
    description: "",
  });
  const [members, setMembers] = useState<TeamMember[]>(() => initialStore?.members ?? []);
  const [currentUserEmail, setCurrentUserEmail] = useState(() => getEmployerSession() || initialStore?.currentUserEmail || initialStore?.members[0]?.email || "");
  const currentUser = useMemo(
    () =>
      members.find((member) => member.email.toLowerCase() === currentUserEmail.toLowerCase()) ??
      members.find((member) => member.role === "Super Admin") ??
      members[0],
    [currentUserEmail, members]
  );
  const [rolePreview, setRole] = useState<CompanyRole>(() => currentUser?.role ?? "Super Admin");
  const [page, setPage] = useState<Page>("dashboard");
  const [jobs, setJobs] = useState<Job[]>(() => initialStore?.jobs ?? []);
  const [activeJobId, setActiveJobId] = useState(() => initialStore?.jobs[0]?.id ?? 1);
  const [candidates, setCandidates] = useState<Candidate[]>(() => initialStore?.candidates ?? []);
  const [settings, setSettings] = useState<HiringSettings>(() => initialStore?.settings ?? initialHiringSettings);
  const [selectedCandidateId, setSelectedCandidateId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageType, setStageType] = useState("Online interview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>(() => initialStore?.activityLog ?? []);
  const [toast, setToast] = useState<{ title: string; body?: string; tone?: ActivityTone } | null>(null);

  useEffect(() => {
    if (!hasCompany || !company.name.trim()) return;
    const store: EmployerStore = {
      company,
      currentUserEmail: currentUser?.email ?? currentUserEmail,
      members,
      jobs,
      candidates,
      settings,
      activityLog,
      createdAt: initialStore?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mode: initialStore?.mode ?? "registered",
    };
    saveEmployerStore(store);
  }, [activityLog, candidates, company, currentUser?.email, currentUserEmail, hasCompany, initialStore?.createdAt, initialStore?.mode, jobs, members, settings]);

  const role = rolePreview;
  const permissions = rolePermissions[role];
  const activeJob = jobs.find((job) => job.id === activeJobId) ?? jobs[0];
  const activeJobCandidates = useMemo(
    () => candidates.filter((candidate) => candidate.jobId === activeJobId),
    [candidates, activeJobId]
  );
  const selectedCandidate =
    activeJobCandidates.find((candidate) => candidate.id === selectedCandidateId) ??
    activeJobCandidates[0] ??
    candidates[0];
  const shortlisted = activeJobCandidates.filter(
    (candidate) => candidate.stage === "Shortlisted" || candidate.stage === "Invited" || candidate.stage === "Hired"
  );
  const hired = activeJobCandidates.filter((candidate) => candidate.stage === "Hired");

  const filteredCandidates = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return activeJobCandidates
      .filter((candidate) => {
        if (!query) return true;
        return [
          candidate.name,
          candidate.title,
          candidate.location,
          candidate.source,
          candidate.stage,
          ...candidateLabels(candidate, settings.scoreWeights),
          ...candidate.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => candidateScore(b, settings.scoreWeights) - candidateScore(a, settings.scoreWeights));
  }, [activeJobCandidates, searchTerm, settings.scoreWeights]);

  const nextAction = getNextAction({
    hasCompany,
    jobs,
    candidates: activeJobCandidates,
    invited: activeJobCandidates.some((candidate) => candidate.stage === "Invited"),
    hiredCount: hired.length,
  });

  function addActivity(label: string, tone: ActivityTone = "pink") {
    if (!settings.validation.logActions) return;
    setActivityLog((current) => [
      { id: Date.now(), label, time: "Just now", tone },
      ...current.slice(0, 5),
    ]);
  }

  function notify(title: string, body?: string, tone: ActivityTone = "pink") {
    setToast({ title, body, tone });
    window.setTimeout(() => setToast(null), 2600);
  }

  function go(nextPage: Page) {
    if (!hasCompany && nextPage !== "personal" && nextPage !== "create-company") {
      setPage("personal");
      return;
    }
    setPage(nextPage);
  }

  function logOut() {
    window.location.assign("/");
  }

  function createCompany() {
    const fallbackStore = createEmployerStore({
      company: {
        name: company.name || "New Company",
        industry: company.industry || "Not specified",
        location: company.location || "Not specified",
        size: company.size || "Not specified",
        description: company.description || "Employer profile created through CareerOS.",
      },
      ownerEmail: currentUserEmail || "admin@company.com",
      ownerName: currentUser?.name || "Company Admin",
    });
    setCompany(fallbackStore.company);
    setMembers(fallbackStore.members);
    setCurrentUserEmail(fallbackStore.currentUserEmail ?? fallbackStore.members[0]?.email ?? "");
    setJobs(fallbackStore.jobs);
    setCandidates(fallbackStore.candidates);
    setSettings(fallbackStore.settings);
    setActivityLog(fallbackStore.activityLog);
    setHasCompany(true);
    setRole("Super Admin");
    setPage("dashboard");
  }

  function syncJobCounts(currentJobs: Job[], nextCandidates: Candidate[]) {
    return currentJobs.map((job) => {
      const summary = summarizeJob(job.id, nextCandidates);
      return {
        ...job,
        applicants: summary.applicants,
        shortlisted: summary.shortlisted,
        hired: summary.hired,
      };
    });
  }

  function updateCandidateWorkflow(
    updater: (candidate: Candidate) => Candidate,
    candidateId: number
  ) {
    setCandidates((currentCandidates) => {
      const nextCandidates = currentCandidates.map((candidate) =>
        candidate.id === candidateId ? updater(candidate) : candidate
      );
      setJobs((currentJobs) => syncJobCounts(currentJobs, nextCandidates));
      return nextCandidates;
    });
  }

  function publishJob(draft: {
    title: string;
    department: string;
    salary: string;
    location: string;
    workMode: string;
    employmentType: string;
    description: string;
    requirements: string;
    deadline: string;
    skills: string[];
    screeningQuestion: string;
    supervisorName: string;
    supervisorAnimal: WorkAnimalSlug | "";
  }) {
    const title = draft.title.trim();
    const department = draft.department.trim().toLowerCase();
    const hasDuplicate = jobs.some(
      (job) =>
        job.status !== "Closed" &&
        job.title.trim().toLowerCase() === title.toLowerCase() &&
        job.department.trim().toLowerCase() === department
    );

    if (settings.validation.requireDepartment && !department) {
      notify("Department required", "Add a department before publishing this job.", "amber");
      return false;
    }

    if (settings.validation.duplicateTitle && hasDuplicate) {
      notify(
        "Duplicate job blocked",
        "A live job with this title already exists in the same department.",
        "amber"
      );
      return false;
    }

    const newJob: Job = {
      id: jobs.length > 0 ? Math.max(...jobs.map((job) => job.id)) + 1 : 1,
      title,
      department,
      status: "Open",
      location: draft.location.trim(),
      workMode: draft.workMode.trim(),
      employmentType: draft.employmentType.trim(),
      salary: draft.salary.trim(),
      description: draft.description.trim(),
      requirements: draft.requirements.trim(),
      deadline: draft.deadline,
      createdBy: currentUser?.name ?? "Current employer",
      skills: draft.skills.map((skill) => skill.trim()).filter(Boolean),
      screeningQuestion: draft.screeningQuestion.trim(),
      applicants: 0,
      shortlisted: 0,
      hired: 0,
      expiresIn: draft.deadline ? Math.max(0, Math.ceil((new Date(draft.deadline).getTime() - Date.now()) / 86400000)) : 30,
      supervisorName: draft.supervisorName.trim(),
      supervisorAnimal: draft.supervisorAnimal || undefined,
    };

    setJobs((currentJobs) => [newJob, ...currentJobs]);
    setActiveJobId(newJob.id);
    addActivity(`${newJob.title} published`, "emerald");
    notify("Job published", `${newJob.title} is now open.`, "emerald");
    setPage("jobs");
    return true;
  }

  function closeActiveJob() {
    if (!activeJob) return;
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === activeJobId ? { ...job, status: "Closed" } : job
      )
    );
    addActivity(`${activeJob.title} closed`, "zinc");
    notify("Job post closed", `${activeJob.title} no longer accepts applicants.`, "zinc");
  }

  function shortlistCandidate(candidateId: number) {
    if (activeJob?.status === "Closed") {
      notify("Job is closed", "Closed jobs are read-only. Reopen or create a new role before changing candidates.", "amber");
      return;
    }
    updateCandidateWorkflow(
      (candidate) => ({ ...candidate, stage: "Shortlisted", type: "Shortlisted", status: "Waiting", appliedToJob: true }),
      candidateId
    );
    setSelectedCandidateId(candidateId);
    addActivity(`${candidates.find((candidate) => candidate.id === candidateId)?.name ?? "Candidate"} added to shortlist`, "pink");
    notify("Candidate shortlisted", "They are now available in the shortlist queue.");
  }

  function approachCandidate(candidateId: number) {
    if (activeJob?.status === "Closed") {
      notify("Job is closed", "Closed jobs are read-only. Candidate outreach is disabled.", "amber");
      return;
    }
    updateCandidateWorkflow(
      (candidate) => ({ ...candidate, stage: "Approached", type: "Potential", status: "New", appliedToJob: false }),
      candidateId
    );
    setSelectedCandidateId(candidateId);
    addActivity(`${candidates.find((candidate) => candidate.id === candidateId)?.name ?? "Candidate"} approached to apply`, "amber");
    notify("Approach recorded", "The candidate is waiting to apply.", "amber");
  }

  function markCandidateApplied(candidateId: number) {
    if (activeJob?.status === "Closed") {
      notify("Job is closed", "Closed jobs are read-only. Candidate updates are disabled.", "amber");
      return;
    }
    updateCandidateWorkflow(
      (candidate) => ({ ...candidate, source: "Applied", stage: "New", type: "Applied", status: "New", appliedToJob: true }),
      candidateId
    );
    setSelectedCandidateId(candidateId);
    addActivity(`${candidates.find((candidate) => candidate.id === candidateId)?.name ?? "Candidate"} applied after approach`, "emerald");
    notify("Candidate marked applied", "Shortlist is now available for this candidate.", "emerald");
  }

  function removeFromShortlist(candidateId: number) {
    if (activeJob?.status === "Closed") {
      notify("Job is closed", "Closed jobs are read-only. Shortlist changes are disabled.", "amber");
      return;
    }
    updateCandidateWorkflow(
      (candidate) => ({ ...candidate, stage: "Rejected", type: "Rejected", status: "Not selected", appliedToJob: candidate.source === "Applied" }),
      candidateId
    );
    addActivity(`${candidates.find((candidate) => candidate.id === candidateId)?.name ?? "Candidate"} marked not selected`, "zinc");
    notify("Candidate not selected", "The candidate was removed from the active shortlist.", "zinc");
  }

  function sendInvite(candidateIds?: number[]) {
    if (activeJob?.status === "Closed") {
      notify("Job is closed", "Closed jobs are read-only. Email sending is disabled.", "amber");
      return;
    }
    const fallbackId = selectedCandidate?.id ?? shortlisted[0]?.id;
    const targetIds = candidateIds?.length ? candidateIds : fallbackId ? [fallbackId] : [];
    if (targetIds.length === 0) return;

    setCandidates((currentCandidates) => {
      const nextCandidates = currentCandidates.map((candidate) =>
        targetIds.includes(candidate.id)
          ? {
              ...candidate,
              stage: "Invited" as const,
              status: "Invited" as const,
              type: "Shortlisted" as const,
              appliedToJob: true,
            }
          : candidate
      );
      setJobs((currentJobs) =>
        syncJobCounts(currentJobs, nextCandidates).map((job) =>
          job.id === activeJobId && job.status !== "Closed"
            ? { ...job, status: "Interviewing" }
            : job
        )
      );
      return nextCandidates;
    });
    addActivity(`Next-stage email sent to ${targetIds.length} candidate${targetIds.length > 1 ? "s" : ""}`, "emerald");
    notify("Email sent", `${targetIds.length} candidate${targetIds.length > 1 ? "s" : ""} moved to invited.`, "emerald");
    setPage("shortlist");
  }

  function markHired(candidateId: number) {
    if (activeJob?.status === "Closed") {
      notify("Job is closed", "Closed jobs are read-only. Hiring updates are disabled.", "amber");
      return;
    }
    const targetCandidate = candidates.find((candidate) => candidate.id === candidateId);
    const interviewComplete = targetCandidate?.stage === "Invited" || targetCandidate?.stage === "Interview scheduled" || targetCandidate?.status === "Invited";
    if (!interviewComplete) {
      notify("Interview required first", "Invite the candidate to interview before marking them hired.", "amber");
      return;
    }
    setCandidates((currentCandidates) => {
      const nextCandidates = currentCandidates.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              stage: "Hired" as const,
              type: "Hired" as const,
              status: "Hired" as const,
            }
          : candidate
      );
      setJobs((currentJobs) =>
        syncJobCounts(currentJobs, nextCandidates).map((job) =>
          job.id === activeJobId
            ? {
                ...job,
                status: settings.expiry.stayOpenAfterHire ? "Hired" : "Closed",
                expiresIn: settings.expiry.stayOpenAfterHire ? settings.expiry.autoCloseAfterHireDays : 0,
              }
            : job
        )
      );
      return nextCandidates;
    });
    addActivity(`${candidates.find((candidate) => candidate.id === candidateId)?.name ?? "Candidate"} marked hired`, "emerald");
    notify("Hire recorded", "The hired count and candidate status were updated.", "emerald");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f7f9] text-zinc-950">
      {hasCompany && (
        <CompanyNav
          active={page}
          role={role}
          collapsed={sidebarCollapsed}
          topOffset={0}
          onCollapsedChange={setSidebarCollapsed}
          onRoleChange={setRole}
          onNavigate={go}
          onLogOut={logOut}
        />
      )}

      <div className={cn(hasCompany && (sidebarCollapsed ? "xl:pl-24" : "xl:pl-72"))}>
      <AnimatePresence mode="wait">
      <motion.div key={`${hasCompany ? "company" : "personal"}-${page}`} {...pageMotion}>
      {!hasCompany && page === "personal" && (
        <PersonalGate onCreate={() => setPage("create-company")} onJoin={createCompany} />
      )}

      {page === "create-company" && (
        <CreateCompanyPage
          company={company}
          onCompanyChange={setCompany}
          onCreate={createCompany}
          onBack={() => setPage("personal")}
        />
      )}

      {hasCompany && page === "dashboard" && (
        <DashboardPage
          company={company}
          activeJob={activeJob}
          candidates={candidates}
          jobs={jobs}
          activityLog={activityLog}
          nextAction={nextAction}
          scoreWeights={settings.scoreWeights}
          showCountdown={settings.expiry.countdown}
          onSelectJob={(jobId) => {
            setActiveJobId(jobId);
            go("job-detail");
          }}
          onNavigate={go}
        />
      )}

      {hasCompany && page === "team" && (
        <TeamPage
          role={role}
          permissions={permissions}
          members={members}
          currentUserEmail={currentUser?.email ?? currentUserEmail}
          onMembersChange={setMembers}
          onRoleChange={setRole}
          onNavigate={go}
          onNotify={notify}
        />
      )}

      {hasCompany && page === "profile" && (
        <CompanyProfilePage company={company} permissions={permissions} onCompanyChange={setCompany} onNotify={notify} onNavigate={go} />
      )}

      {hasCompany && page === "settings" && (
        <CompanySettingsPage
          role={role}
          permissions={permissions}
          settings={settings}
          onSettingsChange={setSettings}
          onNavigate={go}
          onNotify={notify}
          onRemoveWorkspace={() => {
            setHasCompany(false);
            setPage("personal");
            notify("Workspace removed", "Employer access returned to the personal gate.", "zinc");
          }}
        />
      )}

      {hasCompany && page === "jobs" && (
        <JobsPage
          jobs={jobs}
          activeJobId={activeJobId}
          permissions={permissions}
          showCountdown={settings.expiry.countdown}
          onSelectJob={(jobId) => {
            setActiveJobId(jobId);
            setPage("job-detail");
          }}
          onNavigate={go}
        />
      )}

      {hasCompany && page === "job-detail" && (
        <JobDetailPage
          job={activeJob}
          candidates={activeJobCandidates}
          activityLog={activityLog}
          showCountdown={settings.expiry.countdown}
          promptResultUpdate={settings.expiry.promptResult}
          onBack={() => go("jobs")}
          onNavigate={go}
        />
      )}

      {hasCompany && page === "post-job" && (
          <PostJobPage jobs={jobs} settings={settings} permissions={permissions} onPublish={publishJob} onBack={() => go("jobs")} />
      )}

      {hasCompany && page === "candidates" && (
        <CandidateReviewPage
          activeJob={activeJob}
          candidates={filteredCandidates}
          selectedCandidate={selectedCandidate}
          permissions={permissions}
          scoreWeights={settings.scoreWeights}
          searchTerm={searchTerm}
          isClosed={activeJob.status === "Closed"}
          onSearch={setSearchTerm}
          onSelect={setSelectedCandidateId}
          onShortlist={shortlistCandidate}
          onApproach={approachCandidate}
          onMarkApplied={markCandidateApplied}
          onOpenProfile={(candidateId) => {
            setSelectedCandidateId(candidateId);
            setPage("candidate-profile");
          }}
          onNavigate={go}
        />
      )}

      {hasCompany && page === "candidate-profile" && (
        <CandidateProfilePage
          candidate={selectedCandidate}
          permissions={permissions}
          scoreWeights={settings.scoreWeights}
          isClosed={activeJob.status === "Closed"}
          onBack={() => go("candidates")}
          onShortlist={shortlistCandidate}
          onApproach={approachCandidate}
          onMarkApplied={markCandidateApplied}
          onNavigate={go}
        />
      )}

      {hasCompany && page === "shortlist" && (
        <ShortlistPage
          shortlisted={shortlisted}
          activeJob={activeJob}
          scoreWeights={settings.scoreWeights}
          isClosed={activeJob.status === "Closed"}
          onRemove={removeFromShortlist}
          onSend={sendInvite}
          onMarkHired={markHired}
          onOpenInterviewSettings={(candidateId) => {
            setSelectedCandidateId(candidateId);
            setPage("invite");
          }}
          onOpenHiredSettings={(candidateId) => {
            setSelectedCandidateId(candidateId);
            setPage("hire-email");
          }}
          onNavigate={go}
        />
      )}

      {hasCompany && page === "invite" && (
        <InvitePage
          candidate={selectedCandidate}
          activeJob={activeJob}
          company={company}
          settings={settings}
          onSettingsChange={setSettings}
          stageType={stageType}
          onStageTypeChange={setStageType}
          onBack={() => go("shortlist")}
          onNavigate={go}
          onNotify={notify}
        />
      )}

      {hasCompany && page === "hire-email" && (
        <HiredEmailPage
          candidate={selectedCandidate}
          activeJob={activeJob}
          company={company}
          settings={settings}
          onSettingsChange={setSettings}
          onBack={() => go("shortlist")}
          onNavigate={go}
          onNotify={notify}
        />
      )}

      {hasCompany && page === "result" && (
        <ResultPage
          candidates={activeJobCandidates}
          permissions={permissions}
          activeJob={activeJob}
          onCloseJob={closeActiveJob}
          onNavigate={go}
        />
      )}
      </motion.div>
      </AnimatePresence>
      </div>
      <AnimatePresence>
        {toast && <ToastNotice key={toast.title} {...toast} />}
      </AnimatePresence>
    </main>
  );
}

function PersonalGate({
  onCreate,
  onJoin,
}: {
  onCreate: () => void;
  onJoin: () => void;
}) {
  return (
    <section className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 overflow-hidden px-5 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
      <div className="min-w-0">
        <Badge className="bg-pink-50 text-pink-700 ring-1 ring-pink-200">
          Personal CareerOS
        </Badge>
        <h1 className="mt-4 max-w-[21rem] break-words text-3xl font-semibold leading-tight tracking-normal sm:max-w-3xl sm:text-4xl md:text-5xl">
          Create a company profile or accept an invite to start hiring.
        </h1>
        <p className="mt-4 max-w-[21rem] break-words text-sm leading-6 text-zinc-600 sm:max-w-2xl">
          Personal career tools stay available, while company hiring features
          unlock only after a business workspace exists.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="h-10" onClick={onCreate}>
            <Building2 />
            Create company
          </Button>
          <Button className="h-10" variant="outline" onClick={onJoin}>
            <UserPlus />
            Join invited company
          </Button>
        </div>
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Hiring unlock logic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Personal user starts without company access.",
            "Creating a company makes the user Super Admin.",
            "Accepting an invite assigns the invited company role.",
            "Employer tools then open in the CareerOS Employer sidebar.",
          ].map((item) => (
            <CheckRow key={item}>{item}</CheckRow>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function CreateCompanyPage({
  company,
  onCompanyChange,
  onCreate,
  onBack,
}: {
  company: Company;
  onCompanyChange: (company: Company) => void;
  onCreate: () => void;
  onBack: () => void;
}) {
  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-8 lg:px-8">
      <BreadcrumbTrail items={["CareerOS", "Company Setup"]} />
      <PageHeader
        eyebrow="Company setup"
        title="Create company profile"
        description="This creates the business workspace and unlocks hiring."
      />
      <Card className="mt-5 rounded-lg">
        <CardContent className="grid gap-4 pt-4 md:grid-cols-2">
          <Field label="Company name">
            <Input value={company.name} onChange={(e) => onCompanyChange({ ...company, name: e.target.value })} />
          </Field>
          <Field label="Industry">
            <Input value={company.industry} onChange={(e) => onCompanyChange({ ...company, industry: e.target.value })} />
          </Field>
          <Field label="Location">
            <Input value={company.location} onChange={(e) => onCompanyChange({ ...company, location: e.target.value })} />
          </Field>
          <Field label="Company size">
            <Input value={company.size} onChange={(e) => onCompanyChange({ ...company, size: e.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Short description">
              <Input value={company.description} onChange={(e) => onCompanyChange({ ...company, description: e.target.value })} />
            </Field>
          </div>
          <div className="rounded-lg border border-dashed p-4 text-sm text-zinc-500 md:col-span-2">
            Logo/banner optional
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onCreate}>
          Create profile
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}

type RolePerformanceMetric = "applicants" | "averageMatch" | "shortlistConversion" | "inviteConversion";

function DashboardPage({
  company,
  activeJob,
  candidates,
  jobs,
  nextAction,
  scoreWeights,
  onSelectJob,
  onNavigate,
}: {
  company: Company;
  activeJob?: Job;
  candidates: Candidate[];
  jobs: Job[];
  activityLog: ActivityEvent[];
  nextAction: { label: string; page: Page; detail: string };
  scoreWeights: HiringSettings["scoreWeights"];
  showCountdown: boolean;
  onSelectJob: (jobId: number) => void;
  onNavigate: (page: Page) => void;
}) {
  const primaryJob = activeJob ?? jobs[0];
  const hasJobs = jobs.length > 0;
  const hasTalent = candidates.length > 0;
  const openJobs = jobs.filter((job) => job.status !== "Closed");
  const bestCandidate = hasTalent ? [...candidates].sort((a, b) => candidateScore(b, scoreWeights) - candidateScore(a, scoreWeights))[0] : null;
  const actionCopy =
    !hasJobs
      ? {
          label: "Post your first job",
          detail: "Create the first role to unlock funnel analytics, candidate quality signals, and hiring outcomes.",
          page: "post-job" as Page,
        }
      : !hasTalent
        ? {
            label: "Pipeline ready",
            detail: `${primaryJob?.title ?? "The active role"} is live. Applicants and sourced talent will appear once candidates enter the pipeline.`,
            page: "jobs" as Page,
          }
        : nextAction;
  const analytics = {
    applicants: 120,
    shortlisted: 42,
    invited: 18,
    hired: 5,
    averageMatch: 84,
    responseRate: 91,
    timeToShortlist: "2.4d",
    newApplicants: 27,
    reengage: 14,
    openJobs: Math.max(openJobs.length, 4),
  };
  const [hoveredFunnelIndex, setHoveredFunnelIndex] = useState(1);
  const [hoveredQualityBand, setHoveredQualityBand] = useState("80-89");
  const [trendRange, setTrendRange] = useState<"7d" | "30d">("7d");
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState(3);
  const [roleMetric, setRoleMetric] = useState<RolePerformanceMetric>("applicants");
  const funnelStages: Array<{
    label: string;
    value: number;
    rate: number;
    previousRate: number;
    dropOff: number;
    detail: string;
    interpretation: string;
    page: Page;
    icon: React.ElementType;
  }> = [
    {
      label: "Applicants",
      value: analytics.applicants,
      rate: 100,
      previousRate: 100,
      dropOff: 0,
      detail: "+27 this week",
      interpretation: "Healthy applicant volume. The role is visible enough to produce a broad candidate pool.",
      page: "candidates",
      icon: UsersRound,
    },
    {
      label: "Shortlisted",
      value: analytics.shortlisted,
      rate: 35,
      previousRate: 35,
      dropOff: analytics.applicants - analytics.shortlisted,
      detail: "35% pass screening",
      interpretation: "42 candidates passed screening, so the pipeline is broad but quality control is selective.",
      page: "candidates",
      icon: ClipboardList,
    },
    {
      label: "Interview",
      value: analytics.invited,
      rate: 15,
      previousRate: 43,
      dropOff: analytics.shortlisted - analytics.invited,
      detail: "43% of shortlist",
      interpretation: "Interview invites are concentrated. This suggests the team is prioritising depth over volume.",
      page: "shortlist",
      icon: CalendarClock,
    },
    {
      label: "Hired",
      value: analytics.hired,
      rate: 4,
      previousRate: 28,
      dropOff: analytics.invited - analytics.hired,
      detail: "28% of interview",
      interpretation: "The final-stage conversion is healthy for selective hiring, with 5 confirmed outcomes.",
      page: "result",
      icon: UserCheck,
    },
  ];
  const dashboardKpis = [
    { icon: UsersRound, label: "Applicants", value: String(analytics.applicants), detail: `${analytics.newApplicants} new applicants` },
    { icon: ClipboardList, label: "Shortlisted", value: String(analytics.shortlisted), detail: "Ready for review" },
    { icon: CalendarClock, label: "Interview", value: String(analytics.invited), detail: "Awaiting decision" },
    { icon: ShieldCheck, label: "Hired", value: String(analytics.hired), detail: "Recorded outcomes", accent: true },
    { icon: Gauge, label: "Avg match", value: `${analytics.averageMatch}%`, detail: "Candidate quality" },
    { icon: MailPlus, label: "Response", value: `${analytics.responseRate}%`, detail: "Email engagement" },
    { icon: Zap, label: "Shortlist time", value: analytics.timeToShortlist, detail: "Median decision speed" },
    { icon: Sparkles, label: "Re-engage", value: String(analytics.reengage), detail: "Warm strong-fit talent", accent: true },
  ];
  const matchDistribution = [
    {
      label: "90-100",
      value: 18,
      tone: "bg-pink-600",
      name: "Strong fit",
      meaning: "Top-fit candidates with strong evidence alignment. This is the group most likely to progress quickly.",
    },
    {
      label: "80-89",
      value: 46,
      tone: "bg-pink-400",
      name: "Good fit",
      meaning: "Most candidates are here, which means the role attracts relevant talent but still needs careful screening.",
    },
    {
      label: "70-79",
      value: 34,
      tone: "bg-violet-400",
      name: "Moderate fit",
      meaning: "Candidates show partial alignment. This group may be useful for adjacent roles or re-engagement.",
    },
    {
      label: "<70",
      value: 22,
      tone: "bg-zinc-300",
      name: "Weak fit",
      meaning: "Lower-fit profiles are present but not dominating the pool, which keeps screening workload manageable.",
    },
  ];
  const applicationTrend = {
    "7d": [
      { day: "Mon", value: 12 },
      { day: "Tue", value: 15 },
      { day: "Wed", value: 18 },
      { day: "Thu", value: 27 },
      { day: "Fri", value: 22 },
      { day: "Sat", value: 11 },
      { day: "Sun", value: 15 },
    ],
    "30d": [
      2, 3, 4, 2, 5, 3, 4, 5, 3, 4, 5, 4, 4, 3, 4, 5, 4, 4, 6, 5, 4, 4, 5, 6, 4, 4, 5, 3, 2, 4,
    ].map((value, index) => ({ day: `D${index + 1}`, value })),
  };
  const jobPerformance = [
    {
      id: jobs[0]?.id ?? 1,
      title: jobs[0]?.title ?? "Senior Product Lead",
      status: jobs[0]?.status ?? "Open" as JobStatus,
      applicants: 31,
      shortlisted: 12,
      invited: 6,
      averageMatch: 88,
      shortlistConversion: 39,
      inviteConversion: 50,
      pattern: "Strong quality with selective progression.",
    },
    {
      id: jobs[1]?.id ?? 2,
      title: jobs[1]?.title ?? "Growth Product Designer",
      status: jobs[1]?.status ?? "Open" as JobStatus,
      applicants: 28,
      shortlisted: 9,
      invited: 4,
      averageMatch: 82,
      shortlistConversion: 32,
      inviteConversion: 44,
      pattern: "Balanced pool with good portfolio alignment.",
    },
    {
      id: 103,
      title: "Product Manager",
      status: "Open" as JobStatus,
      applicants: 38,
      shortlisted: 13,
      invited: 6,
      averageMatch: 84,
      shortlistConversion: 34,
      inviteConversion: 46,
      pattern: "Highest volume, slightly broader fit range.",
    },
    {
      id: 104,
      title: "Data Analyst",
      status: "Interviewing" as JobStatus,
      applicants: 23,
      shortlisted: 8,
      invited: 2,
      averageMatch: 79,
      shortlistConversion: 35,
      inviteConversion: 25,
      pattern: "Useful volume, but interview conversion is thinner.",
    },
  ];
  const activeJobCandidates = primaryJob
    ? candidates.filter((candidate) => candidate.jobId === primaryJob.id)
    : candidates;
  const traitCandidates = activeJobCandidates.filter(
    (candidate) => candidate.livingCvDetails.workAnimalTestCompleted && getWorkAnimal(candidate.livingCvDetails.workAnimal)
  );
  const traitCounts = workAnimals
    .map((animal) => {
      const matchingCandidates = traitCandidates.filter(
        (candidate) => candidate.livingCvDetails.workAnimal === animal.slug
      );
      const totalScore = matchingCandidates.reduce(
        (sum, candidate) => sum + candidateScore(candidate, scoreWeights),
        0
      );

      return {
        animal,
        count: matchingCandidates.length,
        percent: traitCandidates.length
          ? Math.round((matchingCandidates.length / traitCandidates.length) * 100)
          : 0,
        averageScore: matchingCandidates.length ? Math.round(totalScore / matchingCandidates.length) : 0,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || b.averageScore - a.averageScore)
    .slice(0, 4);
  const roleTraitMatches = primaryJob
    ? topAnimalsForJob({
        title: primaryJob.title,
        skills: primaryJob.skills,
        historicalAnimalSlugs: traitCandidates
          .map((candidate) => candidate.livingCvDetails.workAnimal)
          .filter(Boolean) as WorkAnimalSlug[],
      })
    : [];
  const missingTraitProfiles = Math.max(activeJobCandidates.length - traitCandidates.length, 0);
  const reengagementOpportunities = [
    { label: "Past finalist pool", count: 7, detail: "Strong culture fit, available again" },
    { label: "Silver-medal applicants", count: 4, detail: "Missed by narrow score margin" },
    { label: "Portfolio improvers", count: 3, detail: "Uploaded fresh evidence" },
  ];
  const summaryInsights = [
    {
      title: "Pipeline signal",
      detail: "The funnel is broad at the top and selective at screening, with the largest drop-off before shortlist.",
    },
    {
      title: "Candidate quality signal",
      detail: "64 candidates sit at 80%+ match, meaning the pool is relevant without being overly narrow.",
    },
    {
      title: "Role performance pattern",
      detail: "Product Manager has the strongest applicant volume, while Senior Product Lead carries the strongest quality score.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl overflow-hidden px-5 py-6 lg:px-8">
      <div className="career-command-shell relative max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-[2rem] p-5 lg:max-w-none lg:p-7">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white text-pink-700 ring-1 ring-pink-200">
                Hiring analytics command centre
              </Badge>
              <Badge className="bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                {company.industry}
              </Badge>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              Hiring Analytics Command Centre
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-600">
              Track applicant volume, funnel quality, shortlist speed, active role performance, and re-engagement opportunities in one calm hiring cockpit for {company.name}.
            </p>

            <motion.div
              variants={listContainerMotion}
              initial="initial"
              animate="animate"
              className="mt-7 grid gap-3 sm:grid-cols-3"
            >
              <DashboardStage label="Applicants" value={`${analytics.applicants} total`} active />
              <DashboardStage label="Quality signal" value={`${analytics.averageMatch}% avg match`} active />
              <DashboardStage label="Hiring outcome" value={`${analytics.hired} hires`} active />
            </motion.div>
          </div>

          <div className="min-w-0 rounded-[1.35rem] border border-zinc-200 bg-white p-4 text-zinc-950 shadow-xl shadow-pink-950/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-normal text-pink-600">
                  Pipeline intelligence
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-normal">
                  Selective screen, healthy volume
                </h2>
              </div>
              <span className="flex size-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 shadow-sm ring-1 ring-pink-100">
                <Sparkles className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {analytics.shortlisted} of {analytics.applicants} applicants reached shortlist. The largest signal is quality filtering, not candidate volume.
            </p>
            <Button variant="outline" className="mt-5 h-11 w-full" onClick={() => onNavigate(actionCopy.page)}>
              Explore underlying profiles
              <ChevronRight />
            </Button>
            <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-pink-100 bg-pink-50/40 p-3">
              <JobSignal label="Open roles" value={String(analytics.openJobs)} />
              <JobSignal label="Shortlist" value={String(analytics.shortlisted)} />
              <JobSignal label="Invites" value={String(analytics.invited)} />
            </div>
            <div className="mt-3 rounded-2xl border border-zinc-100 bg-white p-3">
              {bestCandidate ? (
                <>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Current top match</span>
                    <span>{candidateScore(bestCandidate, scoreWeights)}%</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-pink-100 text-sm font-semibold text-pink-700">
                      {bestCandidate.name.split(" ").map((part) => part[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{bestCandidate.name}</p>
                      <p className="text-xs text-zinc-500">{bestCandidate.title}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                    <UsersRound className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">No talent yet</p>
                    <p className="text-xs text-zinc-500">Candidates appear here after a live role receives applicants.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        variants={listContainerMotion}
        initial="initial"
        animate="animate"
        className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {dashboardKpis.map((kpi) => (
          <DashboardMetricCard
            key={kpi.label}
            icon={kpi.icon}
            label={kpi.label}
            value={kpi.value}
            detail={kpi.detail}
            accent={kpi.accent}
          />
        ))}
      </motion.div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)]">
        <InteractiveHiringFunnel
          stages={funnelStages}
          activeIndex={hoveredFunnelIndex}
          onActiveIndexChange={setHoveredFunnelIndex}
          onNavigate={onNavigate}
        />

        <CandidateQualityDistribution
          bands={matchDistribution}
          total={analytics.applicants}
          activeBand={hoveredQualityBand}
          onActiveBandChange={setHoveredQualityBand}
          averageMatch={analytics.averageMatch}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <ApplicantActivityTrend
          data={applicationTrend[trendRange]}
          range={trendRange}
          activeIndex={hoveredTrendIndex}
          onRangeChange={setTrendRange}
          onActiveIndexChange={setHoveredTrendIndex}
        />

        <TraitIntelligenceCard
          jobTitle={primaryJob?.title ?? "Active role"}
          traitCounts={traitCounts}
          roleTraitMatches={roleTraitMatches}
          missingTraitProfiles={missingTraitProfiles}
          onReview={() => onNavigate("candidates")}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <RolePerformanceComparison
          roles={jobPerformance}
          selectedMetric={roleMetric}
          onMetricChange={setRoleMetric}
          onSelectJob={onSelectJob}
          onManageJobs={() => onNavigate("jobs")}
        />

        <div className="space-y-4">
          <Card className="career-panel-muted rounded-3xl">
            <CardHeader>
              <CardTitle>Re-engagement opportunities</CardTitle>
              <p className="mt-1 text-sm text-zinc-500">Warm talent that should not be lost between hiring cycles.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {reengagementOpportunities.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-4 ring-1 ring-zinc-100">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-zinc-950">{item.label}</p>
                    <Badge className="bg-pink-50 text-pink-700 ring-1 ring-pink-100">{item.count}</Badge>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="career-clear-card rounded-3xl">
            <CardHeader>
              <CardTitle>Summary insights</CardTitle>
              <p className="mt-1 text-sm text-zinc-500">High-level patterns from the current hiring cycle.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {summaryInsights.map((insight) => (
                <div
                  key={insight.title}
                  className="rounded-2xl border border-zinc-200 bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 ring-1 ring-pink-100">
                      <Sparkles className="size-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-zinc-950">{insight.title}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{insight.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function InteractiveHiringFunnel({
  stages,
  activeIndex,
  onActiveIndexChange,
  onNavigate,
}: {
  stages: Array<{
    label: string;
    value: number;
    rate: number;
    previousRate: number;
    dropOff: number;
    detail: string;
    interpretation: string;
    page: Page;
    icon: React.ElementType;
  }>;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onNavigate: (page: Page) => void;
}) {
  const activeStage = stages[activeIndex] ?? stages[0];
  const largestDrop = stages
    .slice(1)
    .reduce((current, stage, index) => (stage.dropOff > current.stage.dropOff ? { stage, index: index + 1 } : current), {
      stage: stages[1] ?? stages[0],
      index: 1,
    });

  return (
    <Card className="career-clear-card rounded-3xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Interactive hiring funnel</CardTitle>
          <p className="mt-1 text-sm text-zinc-500">Applicants to confirmed hires, with conversion and drop-off signals.</p>
        </div>
        <Badge className="bg-pink-50 text-pink-700 ring-1 ring-pink-100">
          {stages[0]?.value ?? 0} applicants
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const active = index === activeIndex;
            return (
              <button
                key={stage.label}
                type="button"
                onMouseEnter={() => onActiveIndexChange(index)}
                onFocus={() => onActiveIndexChange(index)}
                onClick={() => onNavigate(stage.page)}
                className={cn(
                  "group rounded-2xl border bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-950/5",
                  active ? "border-pink-200 shadow-lg shadow-pink-950/5" : "border-zinc-200"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-2xl ring-1",
                      active ? "bg-pink-50 text-pink-600 ring-pink-100" : "bg-zinc-50 text-zinc-500 ring-zinc-100"
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">
                    {stage.rate}% total
                  </span>
                </div>
                <p className="mt-3 text-xl font-semibold text-zinc-950">{stage.value}</p>
                <p className="mt-1 text-sm font-medium text-zinc-700">{stage.label}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
                  <AnimatedProgress value={stage.rate} delay={index * 0.05} />
                </div>
                <p className="mt-2 text-[11px] leading-4 text-zinc-500">
                  {index === 0 ? stage.detail : `${stage.previousRate}% from previous · -${stage.dropOff}`}
                </p>
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeStage.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: smoothEase }}
          className="rounded-2xl border border-pink-100 bg-pink-50/50 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-zinc-950">{activeStage.label} insight</p>
            <span className="text-xs font-semibold text-pink-700">
              {activeStage.value} · {activeStage.detail}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{activeStage.interpretation}</p>
        </motion.div>

        <p className="text-xs font-medium text-zinc-500">
          Pipeline signal: largest drop-off occurs between {stages[largestDrop.index - 1]?.label} and {largestDrop.stage.label}.
        </p>
      </CardContent>
    </Card>
  );
}

function CandidateQualityDistribution({
  bands,
  total,
  activeBand,
  onActiveBandChange,
  averageMatch,
}: {
  bands: Array<{
    label: string;
    value: number;
    tone: string;
    name: string;
    meaning: string;
  }>;
  total: number;
  activeBand: string;
  onActiveBandChange: (band: string) => void;
  averageMatch: number;
}) {
  const active = bands.find((band) => band.label === activeBand) ?? bands[0];
  const highFit = bands.slice(0, 2).reduce((sum, band) => sum + band.value, 0);
  const maxValue = Math.max(...bands.map((band) => band.value), 1);

  return (
    <Card className="career-panel-muted rounded-3xl">
      <CardHeader>
        <CardTitle>Candidate quality distribution</CardTitle>
        <p className="mt-1 text-sm text-zinc-500">Match score bands across the current talent pool.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-3xl bg-white p-4 ring-1 ring-zinc-100">
          <div className="flex h-48 items-end justify-between gap-3">
            {bands.map((band, index) => {
              const percent = Math.round((band.value / total) * 100);
              const activeBar = band.label === active.label;
              return (
                <button
                  key={band.label}
                  type="button"
                  onMouseEnter={() => onActiveBandChange(band.label)}
                  onFocus={() => onActiveBandChange(band.label)}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2 rounded-2xl p-1 transition hover:bg-pink-50/50"
                >
                  <div className="flex h-full w-full items-end rounded-2xl bg-zinc-50 p-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((band.value / maxValue) * 100, 12)}%` }}
                      transition={{ duration: 0.55, delay: index * 0.04, ease: smoothEase }}
                      className={cn(
                        "w-full rounded-xl transition",
                        band.tone,
                        activeBar ? "opacity-100 shadow-lg shadow-pink-950/10" : "opacity-70"
                      )}
                    />
                  </div>
                  <p className="text-xs font-medium text-zinc-600">{band.label}</p>
                  <p className="text-[11px] text-zinc-400">{band.value} · {percent}%</p>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          key={active.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: smoothEase }}
          className="rounded-2xl border border-zinc-200 bg-white p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {active.name} · {Math.round((active.value / total) * 100)}% of pool
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{active.meaning}</p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2">
          <JobSignal label="Average match" value={`${averageMatch}%`} />
          <JobSignal label="80%+ profiles" value={String(highFit)} />
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicantActivityTrend({
  data,
  range,
  activeIndex,
  onRangeChange,
  onActiveIndexChange,
}: {
  data: Array<{ day: string; value: number }>;
  range: "7d" | "30d";
  activeIndex: number;
  onRangeChange: (range: "7d" | "30d") => void;
  onActiveIndexChange: (index: number) => void;
}) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const total = data.reduce((sum, point) => sum + point.value, 0);
  const peakIndex = data.reduce((best, point, index) => (point.value > data[best].value ? index : best), 0);
  const quietIndex = data.reduce((best, point, index) => (point.value < data[best].value ? index : best), 0);
  const currentActiveIndex = Math.min(activeIndex, data.length - 1);
  const active = data[currentActiveIndex] ?? data[0];
  const chartWidth = 640;
  const chartHeight = 220;
  const paddingX = 34;
  const paddingTop = 24;
  const paddingBottom = 34;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const points = data.map((point, index) => {
    const x = paddingX + (data.length === 1 ? 0 : (index / (data.length - 1)) * plotWidth);
    const y = paddingTop + (1 - point.value / maxValue) * plotHeight;
    return { ...point, x, y };
  });
  const path = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const previous = points[index - 1];
      const midX = (previous.x + point.x) / 2;
      return `C ${midX} ${previous.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(" ");
  const baseline = chartHeight - paddingBottom;
  const areaPath = `${path} L ${points[points.length - 1]?.x ?? paddingX} ${baseline} L ${points[0]?.x ?? paddingX} ${baseline} Z`;
  const activePoint = points[currentActiveIndex] ?? points[0];

  return (
    <Card className="career-clear-card rounded-3xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Applicant activity trend</CardTitle>
          <p className="mt-1 text-sm text-zinc-500">Application movement over the selected range.</p>
        </div>
        <div className="flex rounded-full bg-zinc-100 p-1">
          {(["7d", "30d"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onRangeChange(option);
                onActiveIndexChange(option === "7d" ? 3 : 23);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                range === option ? "bg-white text-pink-700 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
              )}
            >
              {option === "7d" ? "7 days" : "30 days"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-3xl bg-zinc-50 p-4">
          <svg
            className="w-full overflow-visible"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-label="Applicant trend line chart"
          >
            <defs>
              <linearGradient id="applicant-trend-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#E00046" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#E00046" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((line) => (
              <line
                key={line}
                x1={paddingX}
                x2={chartWidth - paddingX}
                y1={paddingTop + plotHeight * line}
                y2={paddingTop + plotHeight * line}
                stroke="#E4E8F0"
                strokeDasharray="4 8"
                strokeWidth="1"
              />
            ))}
            <motion.path
              d={areaPath}
              fill="url(#applicant-trend-fill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: smoothEase }}
            />
            <motion.path
              d={path}
              fill="none"
              stroke="#E00046"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.75, ease: smoothEase }}
            />
            {points.map((point, index) => (
              <g
                key={`${point.day}-${index}`}
                onMouseEnter={() => onActiveIndexChange(index)}
                onFocus={() => onActiveIndexChange(index)}
                tabIndex={0}
              >
                <circle cx={point.x} cy={point.y} r="13" fill="transparent" />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={index === currentActiveIndex ? 7 : index === peakIndex || index === quietIndex ? 5.5 : 4.5}
                  fill={index === peakIndex ? "#E00046" : index === quietIndex ? "#CBD5E1" : "#FFFFFF"}
                  stroke={index === currentActiveIndex ? "#E00046" : "#CBD5E1"}
                  strokeWidth="2.5"
                  className="transition"
                />
              </g>
            ))}
            {activePoint && (
              <g>
                <line
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1={paddingTop}
                  y2={baseline}
                  stroke="#F5CBD6"
                  strokeDasharray="4 8"
                  strokeWidth="1.5"
                />
                <rect
                  x={Math.min(Math.max(activePoint.x - 58, paddingX), chartWidth - paddingX - 116)}
                  y={Math.max(activePoint.y - 42, 8)}
                  width="116"
                  height="30"
                  rx="15"
                  fill="#081433"
                  opacity="0.94"
                />
                <text
                  x={Math.min(Math.max(activePoint.x, paddingX + 58), chartWidth - paddingX - 58)}
                  y={Math.max(activePoint.y - 22, 28)}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="700"
                >
                  {activePoint.day}: {activePoint.value}
                </text>
              </g>
            )}
          </svg>
          <div className="mt-2 flex justify-between text-[11px] font-medium text-zinc-500">
            <span>{data[0]?.day}</span>
            <span>{data[Math.floor(data.length / 2)]?.day}</span>
            <span>{data[data.length - 1]?.day}</span>
          </div>
        </div>

        <motion.div
          key={`${range}-${active?.day}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: smoothEase }}
          className="rounded-2xl border border-zinc-200 bg-white p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-zinc-950">
              {active?.day}: {active?.value} applications
            </p>
            <span className="text-xs font-semibold text-pink-700">{total} total</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Applications peaked on {data[peakIndex].day} and were quietest on {data[quietIndex].day}, suggesting candidate activity is strongest around the middle of the cycle.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function RolePerformanceComparison({
  roles,
  selectedMetric,
  onMetricChange,
  onSelectJob,
  onManageJobs,
}: {
  roles: Array<{
    id: number;
    title: string;
    status: JobStatus;
    applicants: number;
    shortlisted: number;
    invited: number;
    averageMatch: number;
    shortlistConversion: number;
    inviteConversion: number;
    pattern: string;
  }>;
  selectedMetric: RolePerformanceMetric;
  onMetricChange: (metric: RolePerformanceMetric) => void;
  onSelectJob: (jobId: number) => void;
  onManageJobs: () => void;
}) {
  const metricOptions: Array<{ key: RolePerformanceMetric; label: string; suffix: string }> = [
    { key: "applicants", label: "Applicants", suffix: "" },
    { key: "averageMatch", label: "Avg match", suffix: "%" },
    { key: "shortlistConversion", label: "Shortlist", suffix: "%" },
    { key: "inviteConversion", label: "Invite", suffix: "%" },
  ];
  const selected = metricOptions.find((option) => option.key === selectedMetric) ?? metricOptions[0];
  const maxValue = Math.max(...roles.map((role) => role[selectedMetric]), 1);
  const leader = [...roles].sort((a, b) => b[selectedMetric] - a[selectedMetric])[0];

  return (
    <Card className="career-clear-card rounded-3xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Role performance comparison</CardTitle>
          <p className="mt-1 text-sm text-zinc-500">Compare active roles by volume, quality, and conversion.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onManageJobs}>
          Manage jobs
          <ChevronRight />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {metricOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onMetricChange(option.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                selectedMetric === option.key
                  ? "border-pink-200 bg-pink-50 text-pink-700"
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-pink-200 hover:text-pink-700"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-4">
          {roles.map((role, index) => {
            const value = role[selectedMetric];
            const selectable = role.id < 100;
            return (
              <button
                key={role.title}
                type="button"
                onClick={() => {
                  if (selectable) onSelectJob(role.id);
                }}
                className="grid w-full gap-3 rounded-2xl p-2 text-left transition hover:bg-zinc-50 sm:grid-cols-[minmax(150px,0.9fr)_minmax(0,1fr)_70px] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-950">{role.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge status={role.status} />
                    <span className="text-[11px] text-zinc-400">{role.shortlisted}/{role.invited} shortlist/invite</span>
                  </div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
                  <AnimatedProgress
                    value={(value / maxValue) * 100}
                    delay={index * 0.04}
                    className={selectedMetric === "applicants" ? "bg-[linear-gradient(90deg,#f4537c,#df0746)]" : "bg-[linear-gradient(90deg,#a78bfa,#df0746)]"}
                  />
                </div>
                <p className="text-right text-sm font-semibold text-pink-700">
                  {value}{selected.suffix}
                </p>
              </button>
            );
          })}
        </div>

        <motion.div
          key={`${selectedMetric}-${leader.title}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: smoothEase }}
          className="rounded-2xl border border-pink-100 bg-pink-50/50 p-4"
        >
          <p className="text-sm font-semibold text-zinc-950">
            {leader.title} leads on {selected.label.toLowerCase()}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{leader.pattern}</p>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function TraitIntelligenceCard({
  jobTitle,
  traitCounts,
  roleTraitMatches,
  missingTraitProfiles,
  onReview,
}: {
  jobTitle: string;
  traitCounts: Array<{
    animal: NonNullable<ReturnType<typeof getWorkAnimal>>;
    count: number;
    percent: number;
    averageScore: number;
  }>;
  roleTraitMatches: ReturnType<typeof topAnimalsForJob>;
  missingTraitProfiles: number;
  onReview: () => void;
}) {
  const dominantTrait = traitCounts[0];
  const coverage = traitCounts.reduce((sum, item) => sum + item.count, 0);
  const recommendation = dominantTrait
    ? `${dominantTrait.animal.name} is leading this pool, so the shortlist currently leans ${dominantTrait.animal.short.toLowerCase()}`
    : "Trait data will appear once candidates complete the Menagerie Method profile.";

  return (
    <Card className="career-panel-muted rounded-3xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Candidate trait intelligence</CardTitle>
          <p className="mt-1 text-sm text-zinc-500">
            Work-style composition for {jobTitle}.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onReview}>
          Review
          <ChevronRight />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-3xl border border-zinc-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                Pool mix
              </p>
              <p className="mt-1 text-sm font-medium text-zinc-950">
                {coverage} profiled candidates
              </p>
            </div>
            {missingTraitProfiles > 0 && (
              <Badge className="bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200">
                {missingTraitProfiles} pending
              </Badge>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {traitCounts.length > 0 ? (
              traitCounts.map((item) => (
                <div key={item.animal.slug}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-base ring-1 ring-pink-100">
                        {item.animal.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-950">
                          {item.animal.name}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {item.animal.archetype}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-pink-700">{item.percent}%</p>
                      <p className="text-[11px] text-zinc-500">{item.averageScore}% avg</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 0.45, ease: smoothEase }}
                      className="h-full rounded-full bg-pink-500"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
                Ask candidates to complete their work-style profile to unlock trait distribution.
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-100">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              Best-fit traits
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {roleTraitMatches.map((match) => (
                <Badge
                  key={match.animal.slug}
                  className="bg-pink-50 text-pink-700 ring-1 ring-pink-100"
                >
                  {match.animal.emoji} {match.animal.name} {match.score}%
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-100">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              Hiring read
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{recommendation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardStage({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <motion.div
      variants={listItemMotion}
      whileHover={{ y: -2 }}
      whileTap={tactileTap}
      className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-pink-100 hover:shadow-md hover:shadow-pink-950/5"
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-2 rounded-full",
            active ? "career-live-dot bg-pink-500" : "bg-zinc-300"
          )}
        />
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
      <p className="mt-2 text-sm font-medium text-zinc-950">{value}</p>
    </motion.div>
  );
}

function DashboardMetricCard({
  icon: Icon,
  label,
  value,
  detail,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      variants={listItemMotion}
      whileHover={{ y: -2 }}
      whileTap={tactileTap}
      className={cn(
        "career-clear-metric rounded-2xl p-3.5 transition",
        accent && "career-metric-accent"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex size-8 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm ring-1 ring-pink-100">
          <Icon className="size-4" />
        </span>
        <span className="h-1 w-8 rounded-full bg-pink-200/80" />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </p>
      <motion.p
        key={`${label}-${value}`}
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.26, ease: smoothEase }}
        className="mt-1.5 text-2xl font-semibold tracking-normal"
      >
        {value}
      </motion.p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{detail}</p>
    </motion.div>
  );
}

function CommandHero({
  eyebrow,
  accent,
  title,
  description,
  children,
}: {
  eyebrow: string;
  accent?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="career-command-shell relative overflow-hidden rounded-[2rem] p-5 lg:p-7">
      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_410px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-white text-pink-700 ring-1 ring-pink-200">{eyebrow}</Badge>
            {accent && (
              <Badge className="bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                {accent}
              </Badge>
            )}
          </div>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-600">
            {description}
          </p>
        </div>
        {children && <div className="min-w-0">{children}</div>}
      </div>
    </div>
  );
}

function TeamPage({
  role,
  permissions,
  members,
  currentUserEmail,
  onMembersChange,
  onRoleChange,
  onNotify,
}: {
  role: CompanyRole;
  permissions: (typeof rolePermissions)[CompanyRole];
  members: TeamMember[];
  currentUserEmail: string;
  onMembersChange: (members: TeamMember[] | ((current: TeamMember[]) => TeamMember[])) => void;
  onRoleChange: (role: CompanyRole) => void;
  onNavigate: (page: Page) => void;
  onNotify: (title: string, body?: string, tone?: ActivityTone) => void;
}) {
  const roleCards: CompanyRole[] = ["Super Admin", "Admin", "User"];
  const permissionMatrix = [
    ["Use hiring workspace", "Super Admin", "Admin", "User"],
    ["Post and close jobs", "Super Admin", "Admin", "User"],
    ["Approach and shortlist candidates", "Super Admin", "Admin", "User"],
    ["Invite or remove users", "Super Admin", "Admin"],
    ["Add or remove Admins", "Super Admin"],
    ["Transfer Super Admin", "Super Admin"],
  ];
  const [confirmation, setConfirmation] = useState<{
    title: string;
    body: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "User">("User");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [manageMember, setManageMember] = useState<TeamMember | null>(null);

  function inviteMember() {
    if (!permissions.canManageTeam) return;
    setInviteEmail("");
    setInviteRole("User");
    setInvitePassword("");
    setInviteError("");
    setInviteModalOpen(true);
  }

  function submitInvite() {
    const email = inviteEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteError("Enter a valid employer email.");
      return;
    }
    if (members.some((member) => member.email.toLowerCase() === email)) {
      setInviteError("This email is already in the employer team.");
      return;
    }
    if (invitePassword.trim().length < 8) {
      setInviteError("Temporary password must be at least 8 characters.");
      return;
    }
    if (inviteRole === "Admin" && !permissions.canManageAdmins) {
      setInviteError("Only the Super Admin can invite another Admin.");
      return;
    }

    const name = email
      .trim()
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
      .join(" ") || "New Employer";

    onMembersChange((current) => [
      ...current,
      {
        id: current.length > 0 ? Math.max(...current.map((member) => member.id)) + 1 : 1,
        name,
        email,
        role: inviteRole,
        status: "Pending",
        presence: "Offline",
        focus: roleFocus(inviteRole),
        lastActive: "Not active yet",
        password: invitePassword.trim(),
        invitedAt: "Just now",
      },
    ]);
    setInviteModalOpen(false);
    onNotify("Invite created", `${email} was added as a pending ${inviteRole}.`, "emerald");
  }

  function requestMemberAction(member: TeamMember, action: "admin" | "remove" | "transfer") {
    const isCurrentUser = member.email.toLowerCase() === currentUserEmail.toLowerCase();
    const isPending = member.status === "Pending";
    const superAdminCount = members.filter((item) => item.role === "Super Admin").length;
    if (isCurrentUser && action === "remove") {
      onNotify("Action blocked", "You cannot remove your own active employer account.", "amber");
      return;
    }
    if (member.role === "Super Admin" && action === "remove" && superAdminCount <= 1) {
      onNotify("Super Admin required", "Transfer ownership before removing the only Super Admin.", "amber");
      return;
    }
    if (isPending && action !== "remove") {
      onNotify("Invitation pending", "Permission changes are available after the user logs in.", "amber");
      return;
    }
    const isAdminTarget = member.role === "Admin";
    const canManageTarget =
      action === "transfer"
        ? permissions.canTransferSuperAdmin
        : isAdminTarget
          ? permissions.canManageAdmins
          : permissions.canManageTeam;
    if (!canManageTarget) return;

    const copy = {
      admin: {
        title: "Make this user an Admin?",
        body: `${member.name} will be able to manage users and company hiring settings, but only the Super Admin can manage Admin access.`,
        confirmLabel: "Make Admin",
      },
      remove: {
        title: "Remove this employer?",
        body: `${member.name} will lose access to CareerOS Employer for this company.`,
        confirmLabel: "Remove user",
      },
      transfer: {
        title: "Transfer Super Admin?",
        body: `There can only be one Super Admin. Ownership will switch from you to ${member.name}.`,
        confirmLabel: "Transfer ownership",
      },
    }[action];

    setConfirmation({
      ...copy,
      onConfirm: () => {
        if (action === "admin") {
          onMembersChange((current) =>
            current.map((item) =>
              item.email === member.email ? { ...item, role: "Admin", focus: roleFocus("Admin") } : item
            )
          );
          onNotify("Admin access granted", `${member.name} can now manage users.`, "emerald");
        }
        if (action === "remove") {
          onMembersChange((current) => current.filter((item) => item.email !== member.email));
          onNotify("Employer removed", `${member.name} no longer has employer access.`, "zinc");
        }
        if (action === "transfer") {
          onMembersChange((current) =>
            current.map((item) =>
              item.email.toLowerCase() === currentUserEmail.toLowerCase()
                ? { ...item, role: "Admin", focus: roleFocus("Admin") }
                : item.email === member.email
                  ? { ...item, role: "Super Admin", focus: roleFocus("Super Admin") }
                  : item
            )
          );
          onRoleChange("Admin");
          onNotify("Super Admin transferred", `${member.name} is now the only Super Admin.`, "emerald");
        }
        setConfirmation(null);
      },
    });
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
      <CommandHero
        eyebrow="Team access"
        accent="Permissions"
        title="Manage who belongs to this workspace."
        description="Everyone can use the hiring workflow. Admins manage normal users, while the single Super Admin controls Admin access and ownership transfer."
      >
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 text-zinc-950">
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white text-pink-700 ring-1 ring-zinc-200">
              <UserCog className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">{role}</p>
              <p className="text-xs text-zinc-500">{rolePermissions[role].label}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniStat label="Members" value={String(members.length)} />
            <MiniStat label="Online" value={String(members.filter((member) => member.presence === "Online").length)} />
            <MiniStat label="Admins" value={String(members.filter((member) => member.role === "Admin").length)} />
            <MiniStat label="Super Admin" value="1 only" />
          </div>
        </div>
      </CommandHero>

      <div className="mt-5 grid gap-4">
        <div className="space-y-4">
          <Card className="career-clear-card rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team</CardTitle>
              <Button variant="outline" size="sm" disabled={!permissions.canManageTeam} onClick={inviteMember}>
                <SlidersHorizontal />
                Add member
              </Button>
            </CardHeader>
            <CardContent className="space-y-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-0">
              <div className="hidden grid-cols-[minmax(220px,1fr)_112px_104px_140px_96px] gap-3 border-b border-zinc-100 bg-zinc-50/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 xl:grid">
                <span>Member</span>
                <span>Role</span>
                <span>Status</span>
                <span>Last active</span>
                <span className="text-right">Actions</span>
              </div>
              {members.map((member) => {
                const isCurrentUser = member.email.toLowerCase() === currentUserEmail.toLowerCase();
                return (
                <motion.div
                  key={member.email}
                  variants={listItemMotion}
                  initial="initial"
                  animate="animate"
                  whileHover={{ y: -2 }}
                  whileTap={tactileTap}
                  className="grid items-center gap-3 border-b border-zinc-100 px-4 py-3 transition last:border-b-0 hover:bg-zinc-50 xl:grid-cols-[minmax(220px,1fr)_112px_104px_140px_96px]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-xs font-semibold text-white">
                      {member.name.split(" ").map((part) => part[0]).join("")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <p className="truncate font-semibold">{member.name}</p>
                        {isCurrentUser && <Badge variant="outline" className="shrink-0">You</Badge>}
                      </div>
                      <p className="mt-1 truncate text-sm text-zinc-500">{member.email}</p>
                    </div>
                  </div>
                  <Badge className="w-fit shrink-0 bg-pink-50 text-pink-700 ring-1 ring-pink-100">{member.role}</Badge>
                  <Badge variant="outline" className="w-fit shrink-0">{member.status}</Badge>
                  <div className="flex items-center gap-2">
                    <div className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-zinc-200">
                      <span
                        className={cn(
                          "size-2.5 rounded-full",
                          member.presence === "Online" ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" : "bg-zinc-300"
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-800">{member.presence}</p>
                      <p className="text-xs text-zinc-500">{member.presence === "Online" ? "Now" : member.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex justify-start xl:justify-end">
                    {isCurrentUser ? (
                      <span className="rounded-full bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-500 ring-1 ring-zinc-200">Current</span>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setManageMember(member)}>
                        Manage
                      </Button>
                    )}
                  </div>
                </motion.div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="career-panel-muted rounded-2xl">
            <CardHeader>
              <CardTitle>Permission map</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {permissionMatrix.map(([label, ...allowedRoles]) => (
                <div key={label} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {roleCards.map((roleName) => (
                      <PermissionPill key={roleName} label={roleName} enabled={allowedRoles.includes(roleName)} />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
      {confirmation && (
        <ConfirmationDialog
          title={confirmation.title}
          body={confirmation.body}
          confirmLabel={confirmation.confirmLabel}
          onCancel={() => setConfirmation(null)}
          onConfirm={confirmation.onConfirm}
        />
      )}
      {manageMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/35 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase text-pink-600">Member controls</p>
                <h2 className="mt-1 text-2xl font-semibold">{manageMember.name}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{manageMember.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setManageMember(null)}
                className="flex size-9 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-500 ring-1 ring-zinc-200 hover:bg-zinc-100"
                aria-label="Close member controls"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm text-zinc-500">Current role</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge className="bg-pink-50 text-pink-700 ring-1 ring-pink-100">{manageMember.role}</Badge>
                  <span className="text-sm text-zinc-600">{rolePermissions[manageMember.role].label}</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="justify-start"
                disabled={manageMember.status === "Pending" || manageMember.role !== "User" || !permissions.canManageAdmins}
                onClick={() => {
                  setManageMember(null);
                  requestMemberAction(manageMember, "admin");
                }}
              >
                Make Admin
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                disabled={manageMember.status === "Pending" || manageMember.role === "Super Admin" || !permissions.canTransferSuperAdmin}
                onClick={() => {
                  setManageMember(null);
                  requestMemberAction(manageMember, "transfer");
                }}
              >
                Transfer Super Admin
              </Button>
              <Button
                variant="outline"
                className="justify-start border-red-200 text-red-700 hover:bg-red-50"
                disabled={manageMember.role === "Admin" ? !permissions.canManageAdmins : !permissions.canManageTeam}
                onClick={() => {
                  setManageMember(null);
                  requestMemberAction(manageMember, "remove");
                }}
              >
                Remove access
              </Button>
            </div>
          </div>
        </div>
      )}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/35 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase text-pink-600">Team invite</p>
                <h2 className="mt-1 text-2xl font-semibold">Add employer user</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Invite by email and set a temporary password the user can change later.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="flex size-9 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-500 ring-1 ring-zinc-200 hover:bg-zinc-100"
                aria-label="Close invite modal"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              <Field label="Employer email">
                <Input
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="name@company.com"
                />
              </Field>
              <Field label="Role">
                <select
                  value={inviteRole}
                  onChange={(event) => setInviteRole(event.target.value as "Admin" | "User")}
                  className="h-10 w-full rounded-xl border bg-white px-3 text-sm"
                >
                  <option value="User">User</option>
                  <option value="Admin" disabled={!permissions.canManageAdmins}>Admin</option>
                </select>
              </Field>
              <Field label="Temporary password">
                <Input
                  type="text"
                  value={invitePassword}
                  onChange={(event) => setInvitePassword(event.target.value)}
                  placeholder="At least 8 characters"
                />
              </Field>
              {inviteError && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {inviteError}
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setInviteModalOpen(false)}>Cancel</Button>
              <Button className="career-pink-action text-white" onClick={submitInvite}>
                <UserPlus />
                Send invite
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

type EmployerReputationStatus = "Silver" | "Gold" | "Platinum";

const employerReputationProfiles: Record<EmployerReputationStatus, {
  label: string;
  summary: string;
  medalClass: string;
  panelClass: string;
  badgeClass: string;
  nextStatus: string;
  progress: number;
  requirements: string[];
  currentSignals: string[];
}> = {
  Silver: {
    label: "Silver Employer",
    summary: "Verified hiring activity with a consistent candidate experience baseline.",
    medalClass: "from-zinc-100 via-slate-200 to-zinc-50 text-zinc-700 ring-zinc-300",
    panelClass: "border-zinc-200 bg-[linear-gradient(135deg,#ffffff,#f4f4f5)]",
    badgeClass: "bg-zinc-100 text-zinc-700 ring-zinc-200",
    nextStatus: "Gold Employer",
    progress: 31,
    requirements: [
      "25+ verified hires through CareerOS",
      "4.3+ candidate hiring experience score",
      "80%+ response-rate standard",
    ],
    currentSignals: ["31 verified hires", "4.34 / 5 hiring score", "82% response rate"],
  },
  Gold: {
    label: "Gold Employer",
    summary: "High-trust employer with proven hiring volume and strong candidate communication.",
    medalClass: "from-amber-100 via-yellow-300 to-amber-50 text-amber-900 ring-amber-300",
    panelClass: "border-amber-200 bg-[linear-gradient(135deg,#fffaf0,#fff7db)]",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    nextStatus: "Platinum Employer",
    progress: 58,
    requirements: [
      "100+ verified hires through CareerOS",
      "4.6+ candidate hiring experience score",
      "90%+ response-rate standard",
    ],
    currentSignals: ["124 verified hires", "4.62 / 5 hiring score", "91% response rate"],
  },
  Platinum: {
    label: "Platinum Employer",
    summary: "Top-tier hiring reputation with enterprise-level consistency and audited hiring quality.",
    medalClass: "from-slate-100 via-indigo-100 to-white text-slate-900 ring-indigo-200",
    panelClass: "border-indigo-200 bg-[linear-gradient(135deg,#ffffff,#eef2ff)]",
    badgeClass: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    nextStatus: "Elite maintained",
    progress: 100,
    requirements: [
      "300+ verified hires through CareerOS",
      "4.8+ candidate hiring experience score",
      "95%+ response-rate standard",
    ],
    currentSignals: ["318 verified hires", "4.82 / 5 hiring score", "96% response rate"],
  },
};

function EmployerReputationPanel({
  status,
  onStatusChange,
}: {
  status: EmployerReputationStatus;
  onStatusChange: (status: EmployerReputationStatus) => void;
}) {
  const profile = employerReputationProfiles[status];

  return (
    <div className={cn("overflow-hidden rounded-3xl border p-5 shadow-[0_18px_45px_rgba(24,24,27,0.08)]", profile.panelClass)}>
      <div className="flex items-start gap-4">
        <div className={cn("grid size-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br ring-1 shadow-lg shadow-zinc-950/5", profile.medalClass)}>
          <Medal className="size-8" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Employer reputation</p>
            <Badge className={cn("ring-1", profile.badgeClass)}>{profile.label}</Badge>
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-normal text-zinc-950">{profile.label}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{profile.summary}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white/75 p-3 ring-1 ring-white/80">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-zinc-700">Progress toward {profile.nextStatus}</p>
          <span className="text-xs font-bold text-pink-700">{profile.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200/80">
          <div className="h-full rounded-full bg-[#E00046]" style={{ width: `${profile.progress}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-500">
          {(["Silver", "Gold", "Platinum"] as EmployerReputationStatus[]).map((tier) => (
            <span key={tier} className={cn("rounded-full px-2 py-1", tier === status && "bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200")}>
              {tier}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {profile.currentSignals.map((signal) => (
          <div key={signal} className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2.5 text-xs font-semibold text-zinc-700 ring-1 ring-white/80">
            <Check className="size-3.5 text-pink-600" />
            {signal}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/80 bg-white/55 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Earned by</p>
        <ul className="mt-2 space-y-1.5 text-xs leading-5 text-zinc-600">
          {profile.requirements.map((requirement) => (
            <li key={requirement}>• {requirement}</li>
          ))}
        </ul>
      </div>

      <label className="mt-4 flex flex-col gap-1.5 border-t border-white/80 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-semibold text-zinc-500">Preview employer tier</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as EmployerReputationStatus)}
          className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
          aria-label="Preview employer reputation status"
        >
          {Object.keys(employerReputationProfiles).map((tier) => (
            <option key={tier} value={tier}>{tier}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

function CompanyProfilePage({
  company,
  permissions,
  onCompanyChange,
  onNotify,
}: {
  company: Company;
  permissions: (typeof rolePermissions)[CompanyRole];
  onCompanyChange: (company: Company) => void;
  onNotify: (title: string, body?: string, tone?: ActivityTone) => void;
  onNavigate: (page: Page) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftCompany, setDraftCompany] = useState(company);
  const [reputationStatus, setReputationStatus] = useState<EmployerReputationStatus>("Gold");
  const reputationProfile = employerReputationProfiles[reputationStatus];
  const companyInitials =
    company.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "CO";

  function saveProfile() {
    onCompanyChange(draftCompany);
    setEditing(false);
    onNotify("Company profile saved", "Public employer details were updated.", "emerald");
  }

  function uploadBrandAsset() {
    onNotify("Brand asset queued", "Prototype upload complete. The cover/logo preview stays simulated.", "emerald");
  }

  const heroStats = [
    { label: "Profile strength", value: "86%", icon: Gauge },
    { label: "Open roles", value: "1", icon: BriefcaseBusiness },
    { label: "Talent pool", value: "428", icon: UsersRound },
    { label: "Response rate", value: "74%", icon: MessageSquareText },
  ];
  const overviewCards = [
    { label: "Hiring mode", value: "Structured shortlist", detail: "Re-engagement enabled", icon: ClipboardList },
    { label: "Profile owner", value: "Super Admin", detail: "Managed workspace", icon: ShieldCheck },
    { label: "Candidate response", value: "74%", detail: "Average reply rate", icon: MessageSquareText },
    { label: "Public strength", value: "86%", detail: "Profile completed", icon: Gauge },
  ];
  const presenceItems = [
    ["About", "Career discovery and hiring intelligence for modern teams."],
    ["Why candidates respond", "Clear salary bands, fast next-stage emails, and transparent outcome updates."],
    ["Re-engagement promise", "High-fit past shortlist candidates can be approached before the role expires."],
    ["Hiring transparency", "Candidates see clearer stage movement, interview expectations, and next-step context."],
    ["Communication quality", "Response behaviour contributes to employer reputation status over time."],
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/[0.04] lg:p-7">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-center">
          <div className="min-w-0">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-3xl border border-zinc-200 bg-zinc-950 text-2xl font-semibold text-white shadow-sm">
                {companyInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white text-zinc-700 ring-1 ring-zinc-200">Verified company</Badge>
                  <Badge className={cn("gap-1.5 ring-1", reputationProfile.badgeClass)}>
                    <Medal className="size-3.5" />
                    {reputationProfile.label}
                  </Badge>
                </div>
                <h1 className="mt-3 break-words text-3xl font-semibold tracking-normal text-zinc-950 md:text-4xl">{company.name}</h1>
                <div className="mt-3 flex flex-wrap gap-2 text-sm font-medium text-zinc-600">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 ring-1 ring-zinc-200"><Building2 className="size-3.5 text-pink-600" />{company.industry}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 ring-1 ring-zinc-200"><MapPin className="size-3.5 text-pink-600" />{company.location}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 ring-1 ring-zinc-200"><UsersRound className="size-3.5 text-pink-600" />{company.size} employees</span>
                </div>
                <p className="mt-5 max-w-3xl text-sm leading-6 text-zinc-600">{company.description}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50/70 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Public profile</p>
                <p className="mt-1 text-lg font-semibold text-zinc-950">Ready for candidate review</p>
              </div>
              <Button disabled={!permissions.canEditCompany} className="bg-zinc-950 hover:bg-zinc-800" onClick={() => setEditing((current) => !current)}>
                <PenLine />
                {editing ? "Close edit mode" : "Edit profile"}
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {heroStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                      <Icon className="size-3.5 text-pink-600" />
                      {stat.label}
                    </div>
                    <p className="mt-2 text-xl font-semibold text-zinc-950">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_410px]">
        <div className="space-y-4">
          {editing && (
            <Card className="career-clear-card rounded-2xl">
              <CardHeader>
                <CardTitle>Edit public profile</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <Field label="Company name">
                  <Input value={draftCompany.name} onChange={(event) => setDraftCompany((current) => ({ ...current, name: event.target.value }))} />
                </Field>
                <Field label="Industry">
                  <Input value={draftCompany.industry} onChange={(event) => setDraftCompany((current) => ({ ...current, industry: event.target.value }))} />
                </Field>
                <Field label="Location">
                  <Input value={draftCompany.location} onChange={(event) => setDraftCompany((current) => ({ ...current, location: event.target.value }))} />
                </Field>
                <Field label="Company size">
                  <Input value={draftCompany.size} onChange={(event) => setDraftCompany((current) => ({ ...current, size: event.target.value }))} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Description">
                    <Input value={draftCompany.description} onChange={(event) => setDraftCompany((current) => ({ ...current, description: event.target.value }))} />
                  </Field>
                </div>
                <div className="flex flex-wrap gap-2 md:col-span-2">
                  <Button className="career-pink-action text-white" onClick={saveProfile}>Save profile</Button>
                  <Button variant="outline" onClick={() => {
                    setDraftCompany(company);
                    setEditing(false);
                  }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="career-clear-card rounded-2xl">
            <CardHeader>
              <CardTitle>Company overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {overviewCards.map((item) => {
                const Icon = item.icon;
                return (
                <div key={item.label} className="min-h-[116px] rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/[0.02]">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-10 place-items-center rounded-2xl bg-pink-50 text-pink-700 ring-1 ring-pink-100">
                      <Icon className="size-4" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{item.label}</p>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-zinc-950">{item.value}</p>
                  <p className="mt-1 text-sm text-zinc-500">{item.detail}</p>
                </div>
                );
              })}
            </CardContent>
          </Card>
          <Card className="career-panel-muted rounded-2xl">
            <CardHeader>
              <CardTitle>Hiring presence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {presenceItems.map(([label, body], index) => (
                <div key={label} className={cn("rounded-2xl border bg-white p-4 shadow-sm shadow-zinc-950/[0.02]", index === 0 ? "border-pink-100 md:col-span-2" : "border-zinc-200")}>
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-xl bg-pink-50 text-pink-700">
                      {index === 0 ? <Building2 className="size-4" /> : index === 1 ? <MessageSquareText className="size-4" /> : index === 2 ? <UserCheck className="size-4" /> : index === 3 ? <Eye className="size-4" /> : <ShieldCheck className="size-4" />}
                    </span>
                    <p className="font-semibold text-zinc-950">{label}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{body}</p>
                </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <EmployerReputationPanel status={reputationStatus} onStatusChange={setReputationStatus} />
          <Card className="career-clear-card rounded-2xl">
            <CardHeader>
              <CardTitle>Brand assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-6 text-zinc-600">
                Upload public-facing logo and cover assets for the employer profile preview.
              </p>
              <Button variant="outline" className="w-full" disabled={!permissions.canEditCompany} onClick={uploadBrandAsset}>
                <FilePlus2 className="size-4" />
                Upload logo or banner
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}

function CompanySettingsPage({
  role,
  permissions,
  settings,
  onSettingsChange,
  onNavigate,
  onNotify,
  onRemoveWorkspace,
}: {
  role: CompanyRole;
  permissions: (typeof rolePermissions)[CompanyRole];
  settings: HiringSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<HiringSettings>>;
  onNavigate: (page: Page) => void;
  onNotify: (title: string, body?: string, tone?: ActivityTone) => void;
  onRemoveWorkspace: () => void;
}) {
  const [dangerArmed, setDangerArmed] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    body: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  const scoreWeights = settings.scoreWeights;
  const expirySettings = settings.expiry;
  const validationSettings = settings.validation;

  function updateWeight(key: keyof typeof scoreWeights, value: number) {
    onSettingsChange((current) => ({
      ...current,
      scoreWeights: { ...current.scoreWeights, [key]: Math.max(0, Math.min(100, value)) },
    }));
  }

  function requestWorkspaceRemoval() {
    if (!permissions.canRemoveWorkspace) return;
    if (!dangerArmed) {
      setDangerArmed(true);
      return;
    }

    setConfirmation({
      title: "Remove company workspace?",
      body: "This permanently removes the employer workspace from the prototype. This action is intentionally separated from normal settings.",
      confirmLabel: "Remove workspace",
      onConfirm: () => {
        setDangerArmed(false);
        setConfirmation(null);
        onRemoveWorkspace();
      },
    });
  }

  function toggleExpiry(key: "countdown" | "promptResult" | "stayOpenAfterHire") {
    onSettingsChange((current) => {
      const next = { ...current.expiry, [key]: !current.expiry[key] };
      onNotify("Expiry setting updated", "The hiring control changed in this prototype.", "emerald");
      return { ...current, expiry: next };
    });
  }

  function toggleValidation(key: keyof typeof validationSettings) {
    onSettingsChange((current) => {
      const next = { ...current.validation, [key]: !current.validation[key] };
      onNotify("Validation setting updated", "Job posting rules were updated.", "emerald");
      return { ...current, validation: next };
    });
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
      <CommandHero
        eyebrow="Settings"
        accent="Hiring controls"
        title="Hiring controls for this workspace."
        description="Set re-engagement rules, potential-list fit thresholds, duplicate job validation, scoring weights, and expiry behavior."
      >
        <div className="rounded-[1.35rem] border border-zinc-200 bg-white p-4 text-zinc-950 shadow-xl shadow-pink-950/5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-700 ring-1 ring-pink-100">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase text-zinc-500">Current role</p>
              <p className="text-lg font-semibold">{role}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{rolePermissions[role].label}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <MiniStat label="Weights" value="4 active" />
            <MiniStat label="Validation" value={validationSettings.duplicateTitle ? "On" : "Off"} />
          </div>
        </div>
      </CommandHero>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <Card className="career-clear-card rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="size-5 text-pink-600" />
                Job expiry automation
              </CardTitle>
              <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">Active</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow title="Show countdown on each open job" detail="Every job card displays days remaining before expiry." enabled={expirySettings.countdown} onToggle={() => toggleExpiry("countdown")} />
              <ToggleRow title="Prompt result update before expiry" detail="Workspace users see a reminder when the timer is low." enabled={expirySettings.promptResult} onToggle={() => toggleExpiry("promptResult")} />
              <ToggleRow title="Allow jobs to stay open after a hire" detail="A hire records outcome without closing multi-seat roles." enabled={expirySettings.stayOpenAfterHire} onToggle={() => toggleExpiry("stayOpenAfterHire")} />
            </CardContent>
          </Card>

          <Card className="career-section-band rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="size-5 text-pink-600" />
                Re-engagement rules
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <RuleCard label="Score threshold" value="85%+" detail="Flag past shortlist candidates." />
              <RuleCard label="No CV submitted" value="Approach" detail="Ask candidate to apply first." />
              <RuleCard label="CV submitted" value="Shortlist" detail="Move directly to shortlist." />
            </CardContent>
          </Card>

          <Card className="career-clear-card rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-pink-600" />
                Candidate scoring weights
                <HelpTip text="These weights drive the composite candidate fit score used across review and shortlist pages." />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {([
                ["skill", "Skill fit", "Required skills and role keyword fit."],
                ["project", "Project", "Evidence from projects and portfolio."],
                ["experience", "Experience", "Seniority and domain match."],
                ["trajectory", "Trajectory", "Career momentum and growth pattern."],
              ] as const).map(([key, label, detail]) => (
                <WeightSlider
                  key={key}
                  label={label}
                  detail={detail}
                  value={scoreWeights[key]}
                  onChange={(value) => updateWeight(key, value)}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="career-clear-card rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="size-5 text-pink-600" />
                Job posting validation
                <HelpTip text="Duplicate validation blocks an active job from being published with the same title as another active job." />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow
                title="Block duplicate active job titles"
                detail="A company should reuse one active job post for multiple hires instead of opening duplicates."
                enabled={validationSettings.duplicateTitle}
                onToggle={() => toggleValidation("duplicateTitle")}
              />
              <ToggleRow title="Require department before publish" detail="Department still helps reporting and activity history stay organized." enabled={validationSettings.requireDepartment} onToggle={() => toggleValidation("requireDepartment")} />
              <ToggleRow title="Log creator and hiring actions" detail="Created by, shortlisted by, interviewed by, and result updates appear in Hiring Timeline." enabled={validationSettings.logActions} onToggle={() => toggleValidation("logActions")} />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="career-panel-muted rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-pink-600" />
                Role guardrails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ["Use hiring workspace", true],
                ["Post/edit jobs", true],
                ["Approach candidates", true],
                ["Mark hires", true],
                ["Add or remove users", permissions.canManageTeam],
              ].map(([label, enabled]) => (
                <PermissionRow key={label as string} label={label as string} enabled={enabled as boolean} />
              ))}
              <Button className="w-full" disabled={!permissions.canManageTeam} onClick={() => onNavigate("team")}>
                Manage members
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50/70 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-red-900">Danger zone</h2>
            <p className="mt-1 text-sm leading-6 text-red-800/80">
              Workspace removal is restricted to the Super Admin and requires a second confirmation.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-red-300 bg-white text-red-700 hover:bg-red-100"
            disabled={!permissions.canRemoveWorkspace}
            onClick={requestWorkspaceRemoval}
          >
            {dangerArmed ? "Confirm removal" : "Remove workspace"}
          </Button>
        </div>
      </div>
      {confirmation && (
        <ConfirmationDialog
          title={confirmation.title}
          body={confirmation.body}
          confirmLabel={confirmation.confirmLabel}
          tone="danger"
          onCancel={() => {
            setDangerArmed(false);
            setConfirmation(null);
          }}
          onConfirm={confirmation.onConfirm}
        />
      )}
    </section>
  );
}

function JobsPage({
  jobs,
  activeJobId,
  permissions,
  showCountdown,
  onSelectJob,
  onNavigate,
}: {
  jobs: Job[];
  activeJobId: number;
  permissions: (typeof rolePermissions)[CompanyRole];
  showCountdown: boolean;
  onSelectJob: (id: number) => void;
  onNavigate: (page: Page) => void;
}) {
  const [jobFilter, setJobFilter] = useState<"Active" | "Open" | "Interviewing" | "Hired" | "Closed">("Active");
  const openJobs = jobs.filter((job) => job.status !== "Closed").length;
  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0);
  const activeJobs = jobs.filter((job) => job.status !== "Closed");
  const nextExpiry = activeJobs.length > 0 ? Math.min(...activeJobs.map((job) => job.expiresIn)) : 0;
  const visibleJobs = jobs.filter((job) => {
    if (jobFilter === "Active") return job.status === "Open" || job.status === "Interviewing" || job.status === "Hired";
    return job.status === jobFilter;
  });
  const jobNextActionLabel = (job: Job) => {
    if (job.hired > 0) return "View result";
    if (job.shortlisted > 0) return "Review shortlist";
    if (job.applicants > 0) return "Review candidates";
    return "Build pipeline";
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
      <CommandHero
        eyebrow="Jobs"
        accent="Hiring queue"
        title="Open roles, expiry, and candidate movement."
        description="Each job opens into a workspace for applied candidates, re-engagement talent, shortlist, email, and outcome updates."
      >
        <div className="space-y-3">
          {permissions.canManageJobs ? (
            <Button className="career-pink-action h-12 w-full text-white" onClick={() => onNavigate("post-job")}>
              <FilePlus2 />
              Post job
            </Button>
          ) : (
            <Button className="h-12 w-full border-zinc-200 bg-white text-zinc-500" variant="outline" disabled>
              <Eye />
              View only
            </Button>
          )}
          <div className="rounded-[1.35rem] bg-zinc-950 p-4 text-white shadow-xl shadow-zinc-950/15">
            <p className="text-xs uppercase text-white/55">Hiring queue</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <JobSignal label="Open" value={String(openJobs)} dark />
              <JobSignal label="People" value={String(totalApplicants)} dark />
              <JobSignal label="Expiry" value={`${nextExpiry}d`} dark />
            </div>
          </div>
        </div>
      </CommandHero>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["Active", "Open", "Interviewing", "Hired", "Closed"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setJobFilter(filter)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium ring-1 transition",
              jobFilter === filter
                ? "bg-zinc-950 text-white ring-zinc-950"
                : "bg-white text-zinc-600 ring-zinc-200 hover:bg-pink-50 hover:text-pink-700 hover:ring-pink-200"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm shadow-zinc-950/[0.03]">
        {jobs.length > 0 && visibleJobs.length > 0 && (
          <div className="hidden grid-cols-[minmax(220px,1.25fr)_110px_90px_100px_80px_100px_110px_minmax(170px,0.9fr)] gap-3 border-b border-zinc-100 bg-zinc-50/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 xl:grid">
            <span>Role</span>
            <span>Status</span>
            <span>Applicants</span>
            <span>Shortlist</span>
            <span>Hired</span>
            <span>Expiry</span>
            <span>Quality</span>
            <span>Next action</span>
          </div>
        )}
        {jobs.length === 0 ? (
          <div className="p-4">
          <EmptyState
            icon={BriefcaseBusiness}
            title="No jobs posted yet"
            description="Create the first open role to unlock candidate review, shortlist, email, and result workflows."
            actionLabel="Post job"
            onAction={() => onNavigate("post-job")}
          />
          </div>
        ) : visibleJobs.length === 0 ? (
          <div className="p-4">
          <EmptyState
            icon={Search}
            title="No jobs match this filter"
            description="Switch filters or post a new role to continue."
            actionLabel="Clear filter"
            onAction={() => setJobFilter("Active")}
          />
          </div>
        ) : visibleJobs.map((job) => (
          <motion.button
            key={job.id}
            variants={listItemMotion}
            initial="initial"
            animate="animate"
            whileHover={{ y: -4 }}
            whileTap={tactileTap}
            onClick={() => onSelectJob(job.id)}
            className={cn(
              "group grid w-full gap-3 border-b border-zinc-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-pink-50/40 xl:grid-cols-[minmax(220px,1.25fr)_110px_90px_100px_80px_100px_110px_minmax(170px,0.9fr)] xl:items-center",
              activeJobId === job.id && "bg-pink-50/50"
            )}
          >
            <div className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h2 className="truncate text-base font-semibold tracking-normal text-zinc-950">{job.title}</h2>
                <Badge className="bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200 xl:hidden">{job.department}</Badge>
              </div>
              <p className="mt-1 truncate text-sm text-zinc-500">{job.workMode} · {job.location} · {job.salary}</p>
              <div className="mt-2 flex flex-wrap gap-1.5 xl:hidden">
                {job.skills.slice(0, 3).map((skill) => <Badge key={skill} variant="secondary" className="text-[11px]">{skill}</Badge>)}
              </div>
            </div>
            <StatusBadge status={job.status} />
            <CompactMetric value={String(job.applicants)} label="Applicants" />
            <CompactMetric value={String(job.shortlisted)} label="Shortlist" />
            <CompactMetric value={String(job.hired)} label="Hired" />
            <span className="text-sm text-zinc-600">
              {showCountdown && job.status !== "Closed" ? `${job.expiresIn}d` : job.status === "Closed" ? "Closed" : "Hidden"}
            </span>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-pink-700">{Math.min(96, Math.max(62, job.applicants * 4 + job.shortlisted * 8))}%</span>
                <span className="text-xs text-zinc-400">Fit</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <AnimatedProgress value={Math.min(96, Math.max(62, job.applicants * 4 + job.shortlisted * 8))} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm font-medium text-pink-600 xl:justify-start">
              <span>{jobNextActionLabel(job)}</span>
              <ChevronRight className="size-4 transition group-hover:translate-x-0.5" />
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function JobDetailPage({
  job,
  candidates,
  activityLog,
  showCountdown,
  promptResultUpdate,
  onBack,
  onNavigate,
}: {
  job: Job;
  candidates: Candidate[];
  activityLog: ActivityEvent[];
  showCountdown: boolean;
  promptResultUpdate: boolean;
  onBack: () => void;
  onNavigate: (page: Page) => void;
}) {
  const applied = candidates.filter((candidate) => candidate.appliedToJob).length;
  const reengagement = candidates.filter((candidate) => candidate.pastSecondStage && !candidate.appliedToJob).length;
  const shortlisted = candidates.filter((candidate) => candidate.stage === "Shortlisted" || candidate.stage === "Invited" || candidate.stage === "Interview scheduled").length;
  const topAnimalMatches = topAnimalsForJob({
    title: job.title,
    skills: job.skills,
    historicalAnimalSlugs: candidates
      .map((candidate) => candidate.livingCvDetails.workAnimal)
      .filter(Boolean) as WorkAnimalSlug[],
  });
  const managerAnimal = getWorkAnimal(job.supervisorAnimal);
  const managerGuide = supervisorGuide(job.supervisorAnimal);

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
      <WorkflowGuide
        trail={["Jobs"]}
        current="Job workspace"
        onBack={onBack}
        onNavigate={onNavigate}
      />
      <div className="career-clear-shell overflow-hidden rounded-3xl">
        <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
        <div className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={job.status} />
              <Badge className="bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200">{job.department}</Badge>
              <JobCountdownBadge job={job} show={showCountdown} />
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal md:text-4xl">{job.title}</h1>
            <p className="mt-2 text-sm text-zinc-500">{job.workMode} · {job.location} · {job.salary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
          <div className="grid min-w-full grid-cols-3 gap-2 sm:min-w-[360px]">
            <JobSignal label="Applied" value={String(applied)} />
            <JobSignal label="Re-engage" value={String(reengagement)} />
            <JobSignal label="Shortlist" value={String(shortlisted)} />
          </div>
        </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="career-form-panel rounded-2xl">
          <CardHeader>
            <CardTitle>Job workflow</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <button onClick={() => onNavigate("candidates")} className="rounded-xl border bg-white p-4 text-left transition hover:border-pink-200 hover:bg-pink-50">
              <UsersRound className="size-5 text-pink-600" />
              <p className="mt-3 font-medium">Review candidates</p>
              <p className="mt-1 text-sm text-zinc-500">Applied and re-engagement talent.</p>
            </button>
            <button onClick={() => onNavigate("shortlist")} className="rounded-xl border bg-white p-4 text-left transition hover:border-pink-200 hover:bg-pink-50">
              <ClipboardList className="size-5 text-pink-600" />
              <p className="mt-3 font-medium">Shortlist</p>
              <p className="mt-1 text-sm text-zinc-500">Invite, hire, or mark not selected.</p>
            </button>
            <button onClick={() => onNavigate("result")} className="rounded-xl border bg-white p-4 text-left transition hover:border-pink-200 hover:bg-pink-50">
              <ShieldCheck className="size-5 text-pink-600" />
              <p className="mt-3 font-medium">Hiring result</p>
              <p className="mt-1 text-sm text-zinc-500">{promptResultUpdate ? "Expiry prompts a final review." : "View confirmed hires and close the role."}</p>
            </button>
          </CardContent>
        </Card>

        <Card className="career-form-panel rounded-2xl">
          <CardHeader>
            <CardTitle>Hiring Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityLog.length === 0 ? (
              <p className="text-sm text-zinc-500">No hiring activity has been logged yet.</p>
            ) : activityLog.slice(0, 5).map(({ id, label, time, tone }, index) => (
              <TimelineItem
                key={id}
                label={label}
                time={time}
                tone={tone}
                last={index === Math.min(activityLog.length, 5) - 1}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="career-form-panel rounded-2xl">
          <CardHeader>
            <CardTitle>Menagerie role signal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topAnimalMatches.map((match) => (
              <div key={match.animal.slug} className="rounded-2xl bg-white p-3 ring-1 ring-zinc-100">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">
                    <span className="mr-1">{match.animal.emoji}</span>
                    {match.animal.name}
                  </p>
                  <span className="text-sm font-semibold text-pink-700">{match.score}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-pink-50">
                  <div className="h-full rounded-full bg-pink-500" style={{ width: `${match.score}%` }} />
                </div>
                <p className="mt-1 text-xs text-zinc-500">{match.animal.archetype}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-pink-100 bg-pink-50 p-3 text-sm leading-5 text-pink-900">
              AI converts this role and historical successful candidates into a 100% animal-trait breakdown, then highlights the top 3 shares.
            </div>
          </CardContent>
        </Card>

        <Card className="career-form-panel rounded-2xl">
          <CardHeader>
            <CardTitle>Reporting manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-zinc-600">
            <p className="font-semibold text-zinc-950">{job.supervisorName || "Not set"}</p>
            <p>
              {managerAnimal ? `${managerAnimal.emoji} ${managerAnimal.name}, ${managerAnimal.archetype}` : "Animal trait not set"}
            </p>
            <div className="space-y-2">
              <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-100">
                <p className="font-medium text-zinc-900">Candidate guidance</p>
                <p className="mt-1">{managerGuide.candidateResponse}</p>
              </div>
              <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-100">
                <p className="font-medium text-zinc-900">Why it works</p>
                <p className="mt-1">{managerGuide.whyItWorks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PostJobPage({
  jobs,
  settings,
  permissions,
  onPublish,
  onBack,
}: {
  jobs: Job[];
  settings: HiringSettings;
  permissions: (typeof rolePermissions)[CompanyRole];
  onPublish: (draft: {
    title: string;
    department: string;
    salary: string;
    location: string;
    workMode: string;
    employmentType: string;
    description: string;
    requirements: string;
    deadline: string;
    skills: string[];
    screeningQuestion: string;
    supervisorName: string;
    supervisorAnimal: WorkAnimalSlug | "";
  }) => boolean;
  onBack: () => void;
}) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [screeningQuestion, setScreeningQuestion] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorAnimal, setSupervisorAnimal] = useState<WorkAnimalSlug | "">("");
  const [publishAttempted, setPublishAttempted] = useState(false);

  const normalizedTitle = title.trim();
  const normalizedDepartment = department.trim();
  const normalizedSalary = salary.trim();
  const normalizedLocation = location.trim();
  const normalizedEmploymentType = employmentType.trim();
  const normalizedDescription = description.trim();
  const normalizedRequirements = requirements.trim();
  const normalizedQuestion = screeningQuestion.trim();
  const normalizedSupervisorName = supervisorName.trim();
  const cleanSkills = skills.map((skill) => skill.trim()).filter(Boolean);

  const duplicateTitle = jobs.some((job) =>
    job.title.trim().toLowerCase() === normalizedTitle.toLowerCase() &&
    job.department.trim().toLowerCase() === normalizedDepartment.toLowerCase() &&
    job.status !== "Closed"
  );
  const salaryLooksValid = /\d/.test(normalizedSalary) && (/[-–—]/.test(normalizedSalary) || /\bto\b/i.test(normalizedSalary));
  const missingDepartment = settings.validation.requireDepartment && normalizedDepartment.length === 0;
  const checks = [
    {
      label: "Job title entered",
      detail: "Add a clear role title.",
      complete: normalizedTitle.length > 0,
    },
    {
      label: "Department entered",
      detail: "Required for duplicate job validation.",
      complete: !missingDepartment,
    },
    {
      label: "Salary range added",
      detail: "Use a range such as RM 8k-12k.",
      complete: salaryLooksValid,
    },
    {
      label: "Location added",
      detail: "Add a city, country, or remote location.",
      complete: normalizedLocation.length > 0,
    },
    {
      label: "Work mode selected",
      detail: "Choose On site, Hybrid, or Remote.",
      complete: ["On site", "Hybrid", "Remote"].includes(workMode),
    },
    {
      label: "Employment type selected",
      detail: "Choose Full-time, Contract, Part-time, or Internship.",
      complete: ["Full-time", "Contract", "Part-time", "Internship"].includes(employmentType),
    },
    {
      label: "Job description added",
      detail: "Describe what the role owns.",
      complete: normalizedDescription.length >= 20,
    },
    {
      label: "Requirements added",
      detail: "Add the expected experience or requirements.",
      complete: normalizedRequirements.length >= 20,
    },
    {
      label: "Deadline selected",
      detail: "Choose when this post should expire.",
      complete: Boolean(deadline),
    },
    {
      label: "Required skills added",
      detail: "Add at least one skill.",
      complete: cleanSkills.length > 0,
    },
    {
      label: "Screening question added",
      detail: "Add one question for applicants.",
      complete: normalizedQuestion.length > 0,
    },
    {
      label: "Reporting manager animal added",
      detail: "Add who the role reports to and their Menagerie Method animal.",
      complete: normalizedSupervisorName.length > 0 && Boolean(supervisorAnimal),
    },
    {
      label: "No duplicate active job title",
      detail: "This title already exists in the same department.",
      complete: !(settings.validation.duplicateTitle && duplicateTitle),
    },
  ];
  const canPublish =
    permissions.canManageJobs &&
    checks.every((check) => check.complete);

  function addSkill() {
    const nextSkill = skillInput.trim();
    if (!nextSkill) return;
    if (cleanSkills.some((skill) => skill.toLowerCase() === nextSkill.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setSkills((current) => [...current, nextSkill]);
    setSkillInput("");
  }

  function handlePublish() {
    setPublishAttempted(true);
    if (!canPublish) return;
    onPublish({
      title: normalizedTitle,
      department: normalizedDepartment,
      salary: normalizedSalary,
      location: normalizedLocation,
      workMode,
      employmentType: normalizedEmploymentType,
      description: normalizedDescription,
      requirements: normalizedRequirements,
      deadline,
      skills: cleanSkills,
      screeningQuestion: normalizedQuestion,
      supervisorName: normalizedSupervisorName,
      supervisorAnimal,
    });
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-6 lg:px-8">
      <WorkflowGuide
        trail={["Jobs"]}
        current="Post job"
        onBack={onBack}
      />
      <PageHeader
        eyebrow="Post job"
        title="Guided job creation"
        description="Walk through basics, salary, skills, screening questions, and publish."
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="career-form-panel rounded-2xl">
          <CardContent className="space-y-4 pt-4">
            <StepBlock step="1" title="Job basics">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Job title *">
                  <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Senior Product Manager" />
                </Field>
                <Field label="Department *">
                  <Input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="e.g. Product" />
                </Field>
              </div>
              {settings.validation.duplicateTitle && duplicateTitle && (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  A live job with this title already exists in this department. Use the existing post for multiple hires instead of opening a duplicate.
                </div>
              )}
              {missingDepartment && (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Department is required because duplicate validation is tracked by department.
                </div>
              )}
            </StepBlock>
            <StepBlock step="2" title="Salary / location / work mode">
              <div className="grid gap-3 md:grid-cols-3">
                <Field label="Salary range *">
                  <Input value={salary} onChange={(event) => setSalary(event.target.value)} placeholder="e.g. RM 8k-12k" />
                </Field>
                <Field label="Location *">
                  <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Kuala Lumpur" />
                </Field>
                <Field label="Work mode *">
                  <div className="grid grid-cols-3 gap-2">
                    {(["On site", "Hybrid", "Remote"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setWorkMode(mode)}
                        className={cn(
                          "h-10 rounded-xl text-sm font-medium ring-1 transition",
                          workMode === mode
                            ? "bg-zinc-950 text-white ring-zinc-950 shadow-lg shadow-zinc-950/10"
                            : "bg-white text-zinc-600 ring-zinc-200 hover:bg-zinc-50"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Field label="Employment type *">
                  <div className="grid grid-cols-2 gap-2">
                    {(["Full-time", "Contract", "Part-time", "Internship"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEmploymentType(type)}
                        className={cn(
                          "h-10 rounded-xl text-sm font-medium ring-1 transition",
                          employmentType === type
                            ? "bg-pink-600 text-white ring-pink-600 shadow-lg shadow-pink-500/15"
                            : "bg-white text-zinc-600 ring-zinc-200 hover:bg-zinc-50"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Application deadline *">
                  <Input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
                </Field>
              </div>
            </StepBlock>
            <StepBlock step="3" title="Role details">
              <div className="grid gap-3">
                <Field label="Job description *">
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Summarize what this role owns and why it matters."
                    className="min-h-24 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />
                </Field>
                <Field label="Requirements *">
                  <textarea
                    value={requirements}
                    onChange={(event) => setRequirements(event.target.value)}
                    placeholder="Add experience, skills, or working style requirements."
                    className="min-h-24 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />
                </Field>
              </div>
            </StepBlock>
            <StepBlock step="4" title="Required skills">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill, e.g. Discovery"
                  />
                  <Button variant="outline" type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>
                {cleanSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cleanSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => setSkills((current) => current.filter((item) => item !== skill))}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 transition hover:bg-pink-50 hover:text-pink-700"
                        aria-label={`Remove ${skill}`}
                      >
                        {skill} <span className="text-zinc-400">×</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">Add the core skills applicants must match.</p>
                )}
              </div>
            </StepBlock>
            <StepBlock step="5" title="Screening questions">
              <Field label="Screening question *">
                <textarea
                  value={screeningQuestion}
                  onChange={(event) => setScreeningQuestion(event.target.value)}
                  placeholder="Ask one question applicants should answer before review."
                  className="min-h-24 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                />
              </Field>
            </StepBlock>
            <StepBlock step="6" title="Reporting manager fit">
              <div className="grid gap-3 md:grid-cols-[1fr_1.4fr]">
                <Field label="Reports to *">
                  <Input
                    value={supervisorName}
                    onChange={(event) => setSupervisorName(event.target.value)}
                    placeholder="e.g. Sarah Lee"
                  />
                </Field>
                <Field label="Manager work animal *">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {workAnimals.map((animal) => (
                      <button
                        key={animal.slug}
                        type="button"
                        onClick={() => setSupervisorAnimal(animal.slug)}
                        className={cn(
                          "min-h-12 rounded-xl px-3 text-left text-sm font-medium ring-1 transition",
                          supervisorAnimal === animal.slug
                            ? "bg-pink-600 text-white ring-pink-600 shadow-lg shadow-pink-500/15"
                            : "bg-white text-zinc-700 ring-zinc-200 hover:bg-zinc-50"
                        )}
                      >
                        <span className="mr-1">{animal.emoji}</span>
                        {animal.name}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Candidates will see how to prepare for this supervisor&apos;s working style before applying.
              </p>
            </StepBlock>
            {publishAttempted && !canPublish && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Complete the missing publish checks before publishing this job.
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="career-panel-muted rounded-2xl">
          <CardHeader>
            <CardTitle>Publish check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checks.map((check) => (
              <PublishCheckRow key={check.label} complete={check.complete} label={check.label} detail={check.detail} />
            ))}
            <Button className="career-pink-action w-full text-white" disabled={!canPublish} onClick={handlePublish}>
              <Send />
              Publish job
            </Button>
            <Button variant="outline" className="w-full" onClick={onBack}>Back to jobs</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function CandidateReviewPage({
  activeJob,
  candidates,
  selectedCandidate,
  permissions,
  scoreWeights,
  searchTerm,
  isClosed,
  onSearch,
  onSelect,
  onShortlist,
  onApproach,
  onMarkApplied,
  onOpenProfile,
  onNavigate,
}: {
  activeJob: Job;
  candidates: Candidate[];
  selectedCandidate: Candidate;
  permissions: (typeof rolePermissions)[CompanyRole];
  scoreWeights: HiringSettings["scoreWeights"];
  searchTerm: string;
  isClosed: boolean;
  onSearch: (value: string) => void;
  onSelect: (id: number) => void;
  onShortlist: (id: number) => void;
  onApproach: (id: number) => void;
  onMarkApplied: (id: number) => void;
  onOpenProfile: (id: number) => void;
  onNavigate: (page: Page) => void;
}) {
  const [filter, setFilter] = useState<"All" | "Applied" | "Potential" | "Shortlisted">("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const isReviewCandidate = (candidate: Candidate) =>
    !["Shortlisted", "Invited", "Interview scheduled", "Hired", "Rejected"].includes(candidate.stage);
  const isDecisionCandidate = (candidate: Candidate) =>
    ["Shortlisted", "Invited", "Interview scheduled"].includes(candidate.stage);
  const appliedReviewCount = candidates.filter((candidate) => candidate.source === "Applied" && isReviewCandidate(candidate)).length;
  const potentialReviewCount = candidates.filter((candidate) => candidate.source === "Potential" && isReviewCandidate(candidate)).length;
  const shortlistReviewCount = candidates.filter(isDecisionCandidate).length;
  const activeReviewCount = candidates.filter((candidate) => candidate.stage !== "Hired" && candidate.stage !== "Rejected").length;
  const visibleCandidates = candidates.filter((candidate) => {
    if (filter === "All") return candidate.stage !== "Hired" && candidate.stage !== "Rejected";
    if (filter === "Applied") return candidate.source === "Applied" && isReviewCandidate(candidate);
    if (filter === "Potential") return candidate.source === "Potential" && isReviewCandidate(candidate);
    return isDecisionCandidate(candidate);
  });
  const candidateTabs = [
    { label: "All", value: activeReviewCount, type: "All" as const },
    { label: "Applied", value: appliedReviewCount, type: "Applied" as const },
    { label: "Potential", value: potentialReviewCount, type: "Potential" as const },
    { label: "Shortlisted", value: shortlistReviewCount, type: "Shortlisted" as const },
  ];
  const selectedCandidates = candidates.filter((candidate) => selectedIds.includes(candidate.id));
  const selectedCanMoveToShortlist = selectedCandidates.filter(
    (candidate) =>
      candidate.appliedToJob &&
      isReviewCandidate(candidate)
  );

  function toggleSelected(candidateId: number) {
    setSelectedIds((current) =>
      current.includes(candidateId)
        ? current.filter((id) => id !== candidateId)
        : [...current, candidateId]
    );
  }

  function moveSelectedToShortlist() {
    if (isClosed || selectedCanMoveToShortlist.length === 0) return;
    selectedCanMoveToShortlist.forEach((candidate) => onShortlist(candidate.id));
    setSelectedIds([]);
    onNavigate("shortlist");
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-6 lg:flex-row lg:items-start lg:px-8">
      <div className="w-full min-w-0 flex-1 space-y-4">
        <WorkflowGuide
          trail={["Jobs", "Job workspace"]}
          current="Candidate review"
          onBack={() => onNavigate("job-detail")}
          onNavigate={onNavigate}
        />
        <PageHeader
          eyebrow="Candidate review"
          title={activeJob.title}
          description={isClosed ? "This job is closed. Candidate history is read-only." : "Applied candidates can move straight to shortlist. Potential candidates are past second-stage talent who should be approached before they apply."}
          action={
            <Button variant="outline" onClick={() => onNavigate("result")}>
              <ShieldCheck />
              View hiring result
            </Button>
          }
        />
        <div className="sticky top-3 z-20 space-y-3 rounded-2xl border border-zinc-200 bg-white/92 p-3 shadow-lg shadow-zinc-950/[0.04] backdrop-blur">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input value={searchTerm} onChange={(e) => onSearch(e.target.value)} placeholder="Search candidates, skills, type, location" className="h-10 pl-9" />
          </div>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
            {candidateTabs.map(({ label, value, type }) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium ring-1 transition",
                  filter === type
                    ? "bg-zinc-950 text-white ring-zinc-950 shadow-sm"
                    : "bg-white text-zinc-600 ring-zinc-200 hover:bg-zinc-50 hover:text-zinc-950"
                )}
              >
                {label} <span className="ml-1 text-xs opacity-70">{value}</span>
              </button>
            ))}
            </div>
            <Button
              className="career-pink-action text-white"
              disabled={isClosed || selectedCanMoveToShortlist.length === 0}
              onClick={moveSelectedToShortlist}
            >
              <ClipboardList />
              Move selected to shortlist {selectedCanMoveToShortlist.length > 0 ? `(${selectedCanMoveToShortlist.length})` : ""}
            </Button>
          </div>
        </div>
        <div className="grid min-w-0 gap-2">
          {visibleCandidates.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No candidates match this view"
              description="Clear the search or switch filters to review the full talent pool."
              actionLabel="Clear filter"
              onAction={() => {
                setFilter("All");
                onSearch("");
              }}
            />
          ) : visibleCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              active={selectedCandidate.id === candidate.id}
              selected={selectedIds.includes(candidate.id)}
              permissions={permissions}
              scoreWeights={scoreWeights}
              onToggleSelected={toggleSelected}
              onSelect={onSelect}
              onShortlist={onShortlist}
              onApproach={onApproach}
              onMarkApplied={onMarkApplied}
              onOpenProfile={onOpenProfile}
              onNavigate={onNavigate}
              isClosed={isClosed}
            />
          ))}
        </div>
      </div>

      <CandidateEvidence
        candidate={selectedCandidate}
        scoreWeights={scoreWeights}
        open={detailsOpen}
        onToggle={() => setDetailsOpen((current) => !current)}
        onNavigate={onNavigate}
      />
    </section>
  );
}

function CandidateProfilePage({
  candidate,
  permissions,
  scoreWeights,
  isClosed,
  onBack,
  onShortlist,
  onApproach,
  onMarkApplied,
  onNavigate,
}: {
  candidate: Candidate;
  permissions: (typeof rolePermissions)[CompanyRole];
  scoreWeights: HiringSettings["scoreWeights"];
  isClosed: boolean;
  onBack: () => void;
  onShortlist: (id: number) => void;
  onApproach: (id: number) => void;
  onMarkApplied: (id: number) => void;
  onNavigate: (page: Page) => void;
}) {
  const isApproachable = candidate.source === "Potential" && candidate.stage === "New";
  const isApproached = candidate.source === "Potential" && candidate.stage === "Approached";
  const canShortlist = candidate.appliedToJob && !["Shortlisted", "Invited", "Interview scheduled", "Hired", "Rejected"].includes(candidate.stage);
  const livingCv = candidate.livingCvDetails;
  const candidateAnimal = getWorkAnimal(livingCv.workAnimal);
  const secondaryAnimal = getWorkAnimal(livingCv.secondaryWorkAnimal);
  const shadowAnimal = getWorkAnimal(livingCv.shadowWorkAnimal);
  const skillGroups = [
    ["Technical", livingCv.skills.technical],
    ["Tools", livingCv.skills.tools],
    ["Soft skills", livingCv.skills.soft],
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
      <WorkflowGuide
        trail={["Jobs", "Job workspace", "Candidate review"]}
        current="Candidate CV"
        onBack={onBack}
        onNavigate={onNavigate}
      />

      <div className="career-form-panel mt-4 overflow-hidden rounded-3xl">
        <div className="relative h-44 overflow-hidden rounded-t-3xl bg-[linear-gradient(120deg,#fff1f7_0%,#ffdce8_50%,#f6ecff_100%)]">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
          <div className="absolute bottom-5 right-5 hidden rounded-2xl bg-white/30 p-4 text-pink-950 ring-1 ring-white/50 backdrop-blur md:block">
            <p className="text-xs uppercase text-pink-700/70">Composite fit</p>
            <p className="mt-1 text-3xl font-semibold text-pink-700">{candidateScore(candidate, scoreWeights)}%</p>
          </div>
        </div>
        <div className="relative px-5 pb-6 lg:px-7">
          <div className="absolute left-5 top-0 flex size-28 -translate-y-1/2 items-center justify-center rounded-3xl border-4 border-white bg-[linear-gradient(135deg,#df0746,#f4537c)] text-3xl font-semibold text-white shadow-md lg:left-7">
            {livingCv.name.split(" ").map((part) => part[0]).join("")}
          </div>
          <div className="grid gap-4 pt-20 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <div className="min-w-0">
	                <div className="flex flex-wrap items-center gap-2">
	                  <h1 className="text-3xl font-semibold tracking-normal">{livingCv.name}</h1>
                    <WorkAnimalTraitBadge candidate={candidate} />
	                  {candidateLabels(candidate, scoreWeights).map((label) => (
	                    <CandidateLabel key={label} label={label} />
	                  ))}
                </div>
                <p className="mt-1 text-zinc-600">{livingCv.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{livingCv.location}</p>
                <p className="mt-2 text-sm font-medium text-pink-700">{livingCv.trajectory}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {isApproachable ? (
                <Button className="bg-violet-50 text-violet-700 ring-1 ring-violet-100 hover:bg-violet-100" disabled={isClosed || !permissions.canApproach} onClick={() => onApproach(candidate.id)}>
                  <MessageSquareText />
                  Approach
                </Button>
              ) : isApproached ? (
                <Button className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100" disabled={isClosed || !permissions.canApproach} onClick={() => onMarkApplied(candidate.id)}>
                  <UserCheck />
                  Mark applied
                </Button>
              ) : candidate.stage === "Shortlisted" || candidate.stage === "Invited" || candidate.stage === "Interview scheduled" ? (
                <Button variant="outline" onClick={() => onNavigate("shortlist")}>
                  <ClipboardList />
                  Open decision shortlist
                </Button>
              ) : candidate.stage === "Hired" ? (
                <Button className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" disabled>
                  <UserCheck />
                  Hired
                </Button>
              ) : (
                <Button
                  className="career-pink-action text-white"
                  disabled={isClosed || !canShortlist}
                  onClick={() => onShortlist(candidate.id)}
                >
                  <ClipboardList />
                  Shortlist
                </Button>
              )}
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <ScoreBar label="Skill fit" value={candidate.skillFit} />
            <ScoreBar label="Project" value={candidate.projectRelevance} />
            <ScoreBar label="Experience" value={candidate.experience} />
            <ScoreBar label="Trajectory" value={candidate.trajectory} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card className="career-panel-muted rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="size-5 text-pink-600" />
                Living CV summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-zinc-700">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">Career direction</p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-950">{livingCv.direction}</h2>
                <p className="mt-3">{livingCv.summary}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="career-list-row rounded-2xl p-3">
                  <p className="text-xs text-zinc-500">Experience</p>
                  <p className="font-semibold text-zinc-900">{livingCv.experienceLabel}</p>
                </div>
                <div className="career-list-row rounded-2xl p-3">
                  <p className="text-xs text-zinc-500">Education</p>
                  <p className="font-semibold text-zinc-900">{livingCv.educationLabel}</p>
                </div>
                <div className="career-list-row rounded-2xl p-3">
                  <p className="text-xs text-zinc-500">Profile strength</p>
                  <p className="font-semibold text-zinc-900">{livingCv.profileStrength}%</p>
                </div>
              </div>
	              <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4">
	                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">Menagerie Method</p>
	                {livingCv.workAnimalTestCompleted && candidateAnimal ? (
	                  <>
	                    <h3 className="mt-2 text-lg font-semibold text-zinc-950">
	                      {candidateAnimal.emoji} {candidateAnimal.name}, {candidateAnimal.archetype}
	                    </h3>
	                    <p className="mt-2 text-sm leading-6 text-zinc-700">{candidateAnimal.short}</p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        <AnimalTraitMiniCard label="Primary" animal={candidateAnimal} />
                        {secondaryAnimal && <AnimalTraitMiniCard label="Secondary" animal={secondaryAnimal} />}
                        {shadowAnimal && <AnimalTraitMiniCard label="Shadow" animal={shadowAnimal} />}
                      </div>
	                  </>
	                ) : (
                  <p className="mt-2 text-sm leading-6 text-zinc-700">
                    Animal trait is unknown. This candidate profile is incomplete until the test is finished.
                  </p>
                )}
              </div>
              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">
                  Employer evidence
                </p>
                {candidate.evidence.map((item) => (
                  <div key={item} className="flex gap-2 rounded-2xl bg-white p-3 ring-1 ring-zinc-100">
                    <Check className="mt-0.5 size-4 shrink-0 text-pink-600" />
                    <p className="min-w-0 text-sm leading-6 text-zinc-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="career-panel-muted rounded-2xl">
            <CardHeader>
              <CardTitle>Skills from Living CV</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {skillGroups.map(([group, values]) => (
                <div key={group} className="career-list-row rounded-2xl p-4">
                  <p className="text-sm font-semibold">{group}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {values.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="career-panel-muted rounded-2xl">
            <CardHeader>
              <CardTitle>Experience from Living CV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {livingCv.experience.map((item) => (
                <div key={`${item.company}-${item.title}`} className="career-list-row rounded-2xl p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-zinc-600">{item.company} · {item.period}</p>
                    </div>
                    <Badge variant="secondary">{item.duration}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="career-panel-muted rounded-2xl">
            <CardHeader>
              <CardTitle>Projects and evidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {livingCv.projects.map((project) => (
                <div key={project.title} className="career-list-row rounded-2xl p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-600">{project.type}</p>
                      <p className="mt-1 font-semibold">{project.title}</p>
                    </div>
                    <span className="text-sm text-zinc-500">{project.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="career-panel-muted rounded-2xl">
            <CardHeader>
              <CardTitle>Education, certifications, and links</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {livingCv.education.map((item) => (
                <div key={item.qualification} className="career-list-row rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-600">Education</p>
                  <p className="mt-1 font-semibold">{item.qualification}</p>
                  <p className="mt-1 text-sm text-zinc-600">{item.institution} · {item.period}</p>
                  <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
                </div>
              ))}
              {livingCv.certifications.map((item) => (
                <div key={item.name} className="career-list-row rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-600">Certification</p>
                  <p className="mt-1 font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm text-zinc-600">{item.issuer} · {item.date}</p>
                </div>
              ))}
              {livingCv.portfolioLinks.map((item) => (
                <div key={item.label} className="career-list-row rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-600">Portfolio link</p>
                  <p className="mt-1 font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm text-zinc-600">{item.url}</p>
                  <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="career-clear-card rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="size-5 text-pink-600" />
                Fit stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScoreBar label="Skill fit" value={candidate.skillFit} compact />
              <ScoreBar label="Project relevance" value={candidate.projectRelevance} compact />
              <ScoreBar label="Experience" value={candidate.experience} compact />
              <ScoreBar label="Trajectory" value={candidate.trajectory} compact />
            </CardContent>
          </Card>
          <Card className="career-clear-card rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilePlus2 className="size-5 text-pink-600" />
                Uploaded files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {livingCv.uploads.map((upload) => (
                <div key={upload.fileName} className="rounded-2xl bg-zinc-50 p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-zinc-900">{upload.label}</span>
                    <Badge variant="secondary">{upload.status}</Badge>
                  </div>
                  <p className="mt-1 text-zinc-600">{upload.fileName}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="career-clear-card rounded-2xl">
            <CardHeader>
              <CardTitle>Hiring action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-600">
              <p className="leading-6">
                {isClosed
                  ? "This job is closed, so candidate actions are read-only."
                  : candidate.appliedToJob
                  ? "Candidate has submitted CV for this job, so the primary action is Shortlist."
                  : candidate.stage === "Approached"
                    ? "Candidate has been approached. Mark applied in the prototype to show the next step."
                    : "Candidate reached second stage before but has not applied to this job, so the primary action is Approach."}
              </p>
              <Button className="career-pink-action w-full text-white" onClick={() => onNavigate("shortlist")}>Open decision shortlist</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}

function ShortlistPage({
  shortlisted,
  activeJob,
  scoreWeights,
  isClosed,
  onRemove,
  onSend,
  onMarkHired,
  onOpenInterviewSettings,
  onOpenHiredSettings,
  onNavigate,
}: {
  shortlisted: Candidate[];
  activeJob: Job;
  scoreWeights: HiringSettings["scoreWeights"];
  isClosed: boolean;
  onRemove: (id: number) => void;
  onSend: (ids: number[]) => void;
  onMarkHired: (id: number) => void;
  onOpenInterviewSettings: (id: number) => void;
  onOpenHiredSettings: (id: number) => void;
  onNavigate: (page: Page) => void;
}) {
  const [selectedShortlistId, setSelectedShortlistId] = useState<number | null>(shortlisted[0]?.id ?? null);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    body: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);
  const featured =
    shortlisted.find((candidate) => candidate.id === selectedShortlistId) ??
    shortlisted[0];
  const activeShortlist = shortlisted.filter((candidate) => candidate.stage === "Shortlisted" || candidate.stage === "Invited" || candidate.stage === "Hired");
  const reviewCandidates = activeShortlist.filter((candidate) => getShortlistStageLabel(candidate) === "Shortlisted");
  const interviewCandidates = activeShortlist.filter((candidate) => getShortlistStageLabel(candidate) === "Interview");
  const hiredCandidates = activeShortlist.filter((candidate) => getShortlistStageLabel(candidate) === "Hired");

  function confirmSend(candidate: Candidate) {
    if (isClosed) return;

    setConfirmation({
      title: "Send interview invite?",
      body: `Send the saved interview email template to ${candidate.name} and move them into the interview stage for ${activeJob.title}?`,
      confirmLabel: "Send invite",
      onConfirm: () => {
        onSend([candidate.id]);
        setSelectedShortlistId(candidate.id);
        setConfirmation(null);
      },
    });
  }

  function confirmRemove(candidate: Candidate) {
    if (isClosed) return;

    setConfirmation({
      title: "Mark not selected?",
      body: `Mark ${candidate.name} as not selected and remove them from the active shortlist?`,
      confirmLabel: "Not selected",
      onConfirm: () => {
        onRemove(candidate.id);
        setConfirmation(null);
      },
    });
  }

  function confirmHired(candidate: Candidate) {
    if (isClosed) return;

    setConfirmation({
      title: "Mark hired and send email?",
      body: `Mark ${candidate.name} as hired for ${activeJob.title} and send the saved hired email template?`,
      confirmLabel: "Mark hired",
      onConfirm: () => {
        onMarkHired(candidate.id);
        setSelectedShortlistId(candidate.id);
        setConfirmation(null);
      },
    });
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
      <WorkflowGuide
        trail={["Jobs", "Job workspace", "Candidate review"]}
        current="Shortlist"
        onBack={() => onNavigate("candidates")}
        onNavigate={onNavigate}
      />
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge className="bg-pink-50 text-pink-700 ring-1 ring-pink-200">Shortlist review</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal md:text-4xl">Decide who moves forward</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
              {isClosed
                ? `${activeJob.title} is closed. Review final shortlist decisions without changing candidate state.`
              : "Invite candidates to interview first, then decide whether to hire or mark not selected."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => onNavigate("candidates")}>
              <ChevronRight className="rotate-180" />
              Back to review
            </Button>
            <Button variant="outline" onClick={() => onNavigate("result")}>
              <ShieldCheck />
              View hiring result
            </Button>
            <Button variant="outline" onClick={() => onNavigate("candidates")}>
              <Plus />
              Add more candidates
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <ShortlistStageSummary label="Shortlisted" value={reviewCandidates.length} detail="Ready to invite" active />
        <ShortlistStageSummary label="Interview" value={interviewCandidates.length} detail="Awaiting decision" />
        <ShortlistStageSummary label="Hired" value={hiredCandidates.length} detail="Confirmed outcome" />
        <ShortlistStageSummary label="Avg match" value={`${Math.round(activeShortlist.reduce((sum, candidate) => sum + candidateScore(candidate, scoreWeights), 0) / Math.max(activeShortlist.length, 1))}%`} detail="Across shortlist" />
      </div>

      <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,27rem)]">
        <div className="space-y-3">
          <motion.div
            variants={listContainerMotion}
            initial="initial"
            animate="animate"
            className="grid gap-3"
          >
            {activeShortlist.length === 0 && (
              <EmptyState
                icon={ClipboardList}
                title="No shortlisted candidates yet"
                description="Review applicants and re-engagement talent, then add the strongest people here for a final decision."
                actionLabel="Review candidates"
                onAction={() => onNavigate("candidates")}
              />
            )}
            {activeShortlist.map((candidate) => (
              <ShortlistReviewCard
                key={candidate.id}
                candidate={candidate}
                selected={featured?.id === candidate.id}
                score={candidateScore(candidate, scoreWeights)}
                isClosed={isClosed}
                onSelect={() => setSelectedShortlistId(candidate.id)}
                onMoveInterview={() => confirmSend(candidate)}
                onMarkHired={() => confirmHired(candidate)}
                onNotSelected={() => confirmRemove(candidate)}
              />
            ))}
          </motion.div>
        </div>
        {featured && (
          <ShortlistIntelligencePanel
            candidate={featured}
            activeJob={activeJob}
            score={candidateScore(featured, scoreWeights)}
            isClosed={isClosed}
            onMoveInterview={() => confirmSend(featured)}
            onMarkHired={() => confirmHired(featured)}
            onNotSelected={() => confirmRemove(featured)}
            onOpenInterviewSettings={() => onOpenInterviewSettings(featured.id)}
            onOpenHiredSettings={() => onOpenHiredSettings(featured.id)}
          />
        )}
      </div>
      {confirmation && (
        <ConfirmationDialog
          title={confirmation.title}
          body={confirmation.body}
          confirmLabel={confirmation.confirmLabel}
          onCancel={() => setConfirmation(null)}
          onConfirm={confirmation.onConfirm}
        />
      )}
    </section>
  );
}

function ShortlistStageSummary({
  label,
  value,
  detail,
  active = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  active?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-2xl border bg-white p-4 shadow-sm",
      active ? "border-pink-200 shadow-pink-950/5" : "border-zinc-200"
    )}>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}

function getShortlistStageLabel(candidate: Candidate) {
  if (candidate.status === "Hired" || candidate.stage === "Hired") return "Hired";
  if (candidate.status === "Invited" || candidate.stage === "Invited" || candidate.stage === "Interview scheduled") return "Interview";
  return "Shortlisted";
}

function ShortlistReviewCard({
  candidate,
  selected,
  score,
  isClosed,
  onSelect,
  onMoveInterview,
  onMarkHired,
  onNotSelected,
}: {
  candidate: Candidate;
  selected: boolean;
  score: number;
  isClosed: boolean;
  onSelect: () => void;
  onMoveInterview: () => void;
  onMarkHired: () => void;
  onNotSelected: () => void;
}) {
  const stageLabel = getShortlistStageLabel(candidate);
  const isHired = stageLabel === "Hired";
  const isInterview = stageLabel === "Interview";
  const isShortlisted = stageLabel === "Shortlisted";

  return (
    <motion.div
      variants={listItemMotion}
      whileHover={{ y: -1 }}
      whileTap={tactileTap}
      onClick={onSelect}
      className={cn(
        "career-list-row h-fit cursor-pointer rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-pink-200",
        selected && "career-preview-row-active"
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-pink-50 text-sm font-semibold text-pink-700 ring-1 ring-pink-100">
              {candidate.name.split(" ").map((part) => part[0]).join("")}
            </span>
            <div className="min-w-0">
              <h2 className="font-semibold text-zinc-950">{candidate.name}</h2>
              <p className="text-sm text-zinc-500">{candidate.title}</p>
            </div>
            <WorkAnimalTraitBadge candidate={candidate} />
            <span className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
              stageLabel === "Hired" && "bg-emerald-50 text-emerald-700 ring-emerald-200",
              stageLabel === "Interview" && "bg-violet-50 text-violet-700 ring-violet-200",
              stageLabel === "Shortlisted" && "bg-pink-50 text-pink-700 ring-pink-200"
            )}>
              {stageLabel}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {candidate.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[11px]">{tag}</Badge>
            ))}
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">{candidate.evidence[0]}</p>
        </div>

        <div className="w-full space-y-3 lg:w-[220px] lg:shrink-0">
          <ScoreBar label="Match" value={score} compact />
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <Button
              size="sm"
              className={cn(
                !isShortlisted ? "border-zinc-200 bg-white text-zinc-400" : "career-pink-action text-white"
              )}
              variant={!isShortlisted ? "outline" : undefined}
              disabled={isClosed || !isShortlisted}
              onClick={(event) => {
                event.stopPropagation();
                onMoveInterview();
              }}
            >
              <MailPlus />
              {isShortlisted ? "Invite interview" : "Interview sent"}
            </Button>
            <Button
              size="sm"
              className={cn(
                isHired && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
                !isHired && isInterview && "bg-emerald-600 text-white shadow-sm shadow-emerald-950/10 hover:bg-emerald-700",
                !isHired && !isInterview && "border-zinc-200 bg-white text-zinc-400"
              )}
              variant={isHired || isInterview ? undefined : "outline"}
              disabled={isClosed || isHired || !isInterview}
              onClick={(event) => {
                event.stopPropagation();
                onMarkHired();
              }}
            >
              <UserCheck />
              {isHired ? "Hired" : isInterview ? "Mark hired" : "Hire after interview"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isClosed || isHired}
              onClick={(event) => {
                event.stopPropagation();
                onNotSelected();
              }}
            >
              <X className="size-4" />
              Not selected
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ShortlistIntelligencePanel({
  candidate,
  activeJob,
  score,
  isClosed,
  onMoveInterview,
  onMarkHired,
  onNotSelected,
  onOpenInterviewSettings,
  onOpenHiredSettings,
}: {
  candidate: Candidate;
  activeJob: Job;
  score: number;
  isClosed: boolean;
  onMoveInterview: () => void;
  onMarkHired: () => void;
  onNotSelected: () => void;
  onOpenInterviewSettings: () => void;
  onOpenHiredSettings: () => void;
}) {
  const animal = getWorkAnimal(candidate.livingCvDetails.workAnimal);
  const stageLabel = getShortlistStageLabel(candidate);
  const isShortlisted = stageLabel === "Shortlisted";
  const isInterview = stageLabel === "Interview";
  const isHired = stageLabel === "Hired";
  const portfolioEvidence = candidate.livingCvDetails.projects.slice(0, 2).map((project) => project.title);
  const strongestEvidence = candidate.evidence[0] ?? `${candidate.name} has relevant evidence for ${activeJob.title}.`;
  const risk =
    candidate.experience < 86
      ? "Experience depth may need validation. Ask for examples of ownership, ambiguity, and stakeholder pressure."
      : candidate.projectRelevance < 88
        ? "Portfolio relevance is promising but should be checked against the actual role problems."
        : "Main risk is calibration, not capability. Validate expectations, salary range, and decision pace.";
  const nextStage =
    isHired
      ? "Prepare onboarding and keep the hiring outcome recorded."
      : isInterview
        ? "Use the interview to validate risk areas, then decide hire or not selected."
        : "Move to interview with a focused evidence-review prompt.";

  return (
    <aside className="space-y-4 xl:sticky xl:top-6">
      <Card className="career-clear-card rounded-2xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-pink-600">CareerOS Hiring Intelligence</p>
              <CardTitle className="mt-2">{candidate.name}</CardTitle>
              <p className="mt-1 text-sm text-zinc-500">{candidate.title}</p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 ring-1 ring-pink-100">
              <Sparkles className="size-5" />
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <MiniStat label="Match" value={`${score}%`} />
            <MiniStat label="Stage" value={stageLabel} />
          </div>

          {animal && (
            <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-pink-700">Work style</p>
              <p className="mt-1 text-sm font-semibold text-zinc-950">{animal.emoji} {animal.name}, {animal.archetype}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-600">{animal.short}</p>
            </div>
          )}

          <div className="space-y-3">
            <HiringInsightRow
              icon={Check}
              title="Why this candidate fits"
              body={strongestEvidence}
            />
            <HiringInsightRow
              icon={CircleAlert}
              title="Risk / concern"
              body={risk}
            />
            <HiringInsightRow
              icon={MessageSquareText}
              title="Best interview angle"
              body={`Ask them to explain how their ${candidate.tags.slice(0, 2).join(" and ")} evidence would apply to ${activeJob.title}.`}
            />
            <HiringInsightRow
              icon={FolderOpen}
              title="Portfolio evidence to inspect"
              body={portfolioEvidence.length ? portfolioEvidence.join(", ") : candidate.tags.slice(0, 3).join(", ")}
            />
            <HiringInsightRow
              icon={ChevronRight}
              title="Suggested next stage"
              body={nextStage}
            />
          </div>

          <div className="grid gap-2 border-t border-zinc-100 pt-4">
            {isShortlisted && (
              <Button className="career-pink-action text-white" disabled={isClosed} onClick={onMoveInterview}>
                <MailPlus />
                Send interview invite
              </Button>
            )}
            {!isHired && (
              <Button
                className={cn(isInterview && "bg-emerald-600 text-white shadow-sm shadow-emerald-950/10 hover:bg-emerald-700")}
                variant={isInterview ? undefined : "outline"}
                disabled={isClosed || !isInterview}
                onClick={onMarkHired}
              >
                <UserCheck />
                {isInterview ? "Mark hired" : "Hire after interview"}
              </Button>
            )}
            {!isHired && (
              <Button variant="outline" disabled={isClosed} onClick={onNotSelected}>
                <X className="size-4" />
                Not selected
              </Button>
            )}
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <Button variant="outline" className="justify-between" onClick={onOpenInterviewSettings}>
                Edit interview template
                <ChevronRight className="size-4" />
              </Button>
              <Button variant="outline" className="justify-between" onClick={onOpenHiredSettings}>
                Edit hired template
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

function HiringInsightRow({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 ring-1 ring-pink-100">
          <Icon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-zinc-950">{title}</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">{body}</p>
        </div>
      </div>
    </div>
  );
}

function EmailPreview({
  candidate,
  includeLogo,
  headerLabel = "Hiring invitation",
  subject,
  stageType,
  dateTime,
  location,
  metadataLabel = "Location",
  message,
  sender,
}: {
  candidate?: Candidate;
  includeLogo: boolean;
  headerLabel?: string;
  subject: string;
  stageType: string;
  dateTime: string;
  location: string;
  metadataLabel?: string;
  message: string;
  sender: string;
}) {
  return (
    <div className="career-form-panel overflow-hidden rounded-2xl">
      {includeLogo && (
        <div className="bg-[linear-gradient(120deg,#fff1f7,#ffd7e6,#f6d8ff)] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-white font-semibold text-pink-700 shadow-sm">TB</span>
            <div>
              <p className="font-semibold">TalentBank</p>
              <p className="text-xs text-zinc-500">{headerLabel}</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs uppercase text-zinc-500">Previewing</p>
          <p className="mt-1 font-medium">{candidate?.name ?? "Select a candidate"}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-zinc-500">Subject</p>
          <p className="mt-1 font-semibold">{subject}</p>
        </div>
        <div className="grid gap-2 text-sm text-zinc-600">
          <p><span className="font-medium text-zinc-950">Stage:</span> {stageType}</p>
          <p><span className="font-medium text-zinc-950">Time:</span> {dateTime}</p>
          <p><span className="font-medium text-zinc-950">{metadataLabel}:</span> {location}</p>
        </div>
        <div className="whitespace-pre-line rounded-2xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
          {message}
        </div>
        <p className="text-xs text-zinc-500">From {sender}</p>
      </div>
    </div>
  );
}


function InvitePage({
  candidate,
  activeJob,
  company,
  settings,
  onSettingsChange,
  stageType,
  onStageTypeChange,
  onBack,
  onNavigate,
  onNotify,
}: {
  candidate: Candidate;
  activeJob: Job;
  company: Company;
  settings: HiringSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<HiringSettings>>;
  stageType: string;
  onStageTypeChange: (value: string) => void;
  onBack: () => void;
  onNavigate: (page: Page) => void;
  onNotify: (title: string, body?: string, tone?: ActivityTone) => void;
}) {
  const [subject, setSubject] = useState(settings.templates.interview.subject);
  const [dateTime, setDateTime] = useState(settings.templates.interview.dateTime ?? "{{selectedSlot}}");
  const [location, setLocation] = useState(settings.templates.interview.location ?? "{{meetingLink}}");
  const [contactName, setContactName] = useState(settings.templates.interview.sender);
  const [includeLogo, setIncludeLogo] = useState(settings.templates.interview.includeLogo);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState(settings.templates.interview.body);
  const [mobilePane, setMobilePane] = useState<"compose" | "preview">("compose");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const renderedSubject = renderEmailTemplate(subject, candidate, stageType, contactName, {
    job: activeJob,
    company,
    selectedSlot: dateTime,
    meetingLink: location,
    matchScore: candidateScore(candidate, settings.scoreWeights),
  });
  const renderedMessage = renderEmailTemplate(message, candidate, stageType, contactName, {
    job: activeJob,
    company,
    selectedSlot: dateTime,
    meetingLink: location,
    matchScore: candidateScore(candidate, settings.scoreWeights),
  });
  const interviewTokens = ["{{firstName}}", "{{candidateName}}", "{{role}}", "{{stageType}}", "{{selectedSlot}}", "{{meetingLink}}", "{{sender}}"];

  function insertMessageToken(token: string) {
    insertTokenAtCursor(textareaRef.current, message, token, setMessage);
  }

  function saveTemplate() {
    onSettingsChange((current) => ({
      ...current,
      templates: {
        ...current.templates,
        interview: {
          ...current.templates.interview,
          subject,
          body: message,
          sender: contactName,
          includeLogo,
          stageType,
          dateTime,
          location,
        },
      },
    }));
    setSaved(true);
    onNotify("Interview template saved", "Future interview emails will use this template.", "emerald");
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
      <WorkflowGuide
        trail={["Jobs", "Job workspace", "Candidate review", "Shortlist"]}
        current="Interview email"
        onBack={onBack}
        onNavigate={onNavigate}
      />
      <PageHeader
        eyebrow="Next-stage email"
        title="Next-stage email template"
        description="Write one reusable message. This page only saves the default template; the email sends when you invite a candidate from the shortlist."
      />
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-zinc-200 bg-white p-1 lg:hidden">
        {(["compose", "preview"] as const).map((pane) => (
          <button
            key={pane}
            type="button"
            onClick={() => setMobilePane(pane)}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold capitalize transition",
              mobilePane === pane ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-50"
            )}
          >
            {pane}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card className={cn("career-form-panel rounded-2xl", mobilePane !== "compose" && "hidden lg:block")}>
          <CardHeader>
            <CardTitle>Email composer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Stage type">
              <div className="grid grid-cols-2 gap-2">
                {["Online interview", "On-site test", "Technical test", "Portfolio review"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      onStageTypeChange(item);
                    }}
                    className={cn(
                      "rounded-2xl border px-3 py-2 text-left text-sm transition",
                      stageType === item
                        ? "border-pink-300 bg-pink-50 text-pink-700"
                        : "bg-white hover:bg-pink-50"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Subject">
                <Input value={subject} onChange={(event) => setSubject(event.target.value)} />
              </Field>
              <Field label="Sender">
                <Input value={contactName} onChange={(event) => setContactName(event.target.value)} />
              </Field>
              <Field label="Date/time">
                <Input value={dateTime} onChange={(event) => setDateTime(event.target.value)} />
              </Field>
              <Field label="Location/link">
                <Input value={location} onChange={(event) => setLocation(event.target.value)} />
              </Field>
            </div>
            <label className="flex items-center justify-between rounded-2xl border border-pink-100 bg-white p-3 text-sm">
              <span className="font-medium">Include company logo/header</span>
              <input
                type="checkbox"
                checked={includeLogo}
                onChange={(event) => setIncludeLogo(event.target.checked)}
                className="size-4 accent-pink-600"
              />
            </label>
            <div className="rounded-2xl border bg-zinc-50/80 p-3">
              <p className="text-xs font-medium uppercase text-zinc-500">Auto-fill fields</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {interviewTokens.map((token) => (
                  <button
                    type="button"
                    key={token}
                    onClick={() => insertMessageToken(token)}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200 transition hover:bg-zinc-100 hover:text-zinc-950"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Email body">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-h-56 w-full rounded-2xl border bg-white p-3 text-sm leading-6 outline-none ring-pink-200 transition focus:ring-2"
              />
            </Field>
          </CardContent>
        </Card>

        <aside className={cn("space-y-4 lg:sticky lg:top-6", mobilePane !== "preview" && "hidden lg:block")}>
          <Card className="career-panel-muted rounded-2xl">
            <CardHeader>
              <CardTitle>Candidate-facing preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="career-form-panel overflow-hidden rounded-2xl">
                {includeLogo && (
                  <div className="bg-[linear-gradient(120deg,#fff1f7,#ffd7e6,#f6d8ff)] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-2xl bg-white font-semibold text-pink-700 shadow-sm">TB</span>
                      <div>
                        <p className="font-semibold">{company.name}</p>
                        <p className="text-xs text-zinc-500">Hiring invitation</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs uppercase text-zinc-500">Subject</p>
                    <p className="mt-1 font-semibold">{renderedSubject}</p>
                  </div>
                  <div className="grid gap-2 text-sm text-zinc-600">
                    <p><span className="font-medium text-zinc-950">Stage:</span> {stageType}</p>
                    <p><span className="font-medium text-zinc-950">Time:</span> {dateTime}</p>
                    <p><span className="font-medium text-zinc-950">Location:</span> {location}</p>
                  </div>
                  <div className="whitespace-pre-line rounded-2xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
                    {renderedMessage}
                  </div>
                  <p className="text-xs text-zinc-500">From {contactName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="career-clear-card rounded-2xl">
            <CardHeader>
              <CardTitle>Candidate context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-semibold">{candidate.name}</p>
              <p className="text-sm text-zinc-500">{candidate.title}</p>
              <ScoreBar label="Match" value={candidateScore(candidate, settings.scoreWeights)} compact />
              <p className="text-sm leading-6 text-zinc-600">{candidate.evidence[0]}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
      <div className="mt-4 flex flex-col justify-end gap-2 border-t border-zinc-200 pt-4 sm:flex-row">
        <Button
          variant={saved ? undefined : "outline"}
          disabled={saved}
          className={cn(saved && "bg-emerald-600 text-white hover:bg-emerald-600")}
          onClick={saveTemplate}
        >
          {saved ? "✓ Changes Saved" : "Save Template Changes"}
        </Button>
      </div>
    </section>
  );
}

function HiredEmailPage({
  candidate,
  activeJob,
  company,
  settings,
  onSettingsChange,
  onBack,
  onNavigate,
  onNotify,
}: {
  candidate: Candidate;
  activeJob: Job;
  company: Company;
  settings: HiringSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<HiringSettings>>;
  onBack: () => void;
  onNavigate: (page: Page) => void;
  onNotify: (title: string, body?: string, tone?: ActivityTone) => void;
}) {
  const [subject, setSubject] = useState(settings.templates.hired.subject);
  const [startDate, setStartDate] = useState(settings.templates.hired.startDate ?? "{{startDate}}");
  const [nextStep, setNextStep] = useState(settings.templates.hired.nextStep ?? "{{onboardingStep}}");
  const [contactName, setContactName] = useState(settings.templates.hired.sender);
  const [includeLogo, setIncludeLogo] = useState(settings.templates.hired.includeLogo);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState(settings.templates.hired.body);
  const [attachments, setAttachments] = useState(["Offer letter draft.pdf", "Onboarding checklist.pdf"]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const renderedSubject = renderEmailTemplate(subject, candidate, "Hired", contactName, {
    job: activeJob,
    company,
    startDate,
    nextStep,
    matchScore: candidateScore(candidate, settings.scoreWeights),
  });
  const renderedMessage = renderEmailTemplate(message, candidate, "Hired", contactName, {
    job: activeJob,
    company,
    startDate,
    nextStep,
    matchScore: candidateScore(candidate, settings.scoreWeights),
  });
  const hiredTokens = ["{{firstName}}", "{{candidateName}}", "{{role}}", "{{company}}", "{{nextStep}}", "{{startDate}}", "{{sender}}"];

  function insertMessageToken(token: string) {
    insertTokenAtCursor(textareaRef.current, message, token, setMessage);
  }

  function saveTemplate() {
    onSettingsChange((current) => ({
      ...current,
      templates: {
        ...current.templates,
        hired: {
          ...current.templates.hired,
          subject,
          body: message,
          sender: contactName,
          includeLogo,
          startDate,
          nextStep,
        },
      },
    }));
    setSaved(true);
    onNotify("Hired template saved", "Future hired emails will use this template.", "emerald");
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
      <WorkflowGuide
        trail={["Jobs", "Job workspace", "Candidate review", "Shortlist"]}
        current="Hired email"
        onBack={onBack}
        onNavigate={onNavigate}
      />
      <PageHeader
        eyebrow="Hired email"
        title="Hired candidate email settings"
        description="Customize the message used when an interviewed candidate is marked hired. This page saves the template only."
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="career-form-panel rounded-2xl">
          <CardHeader>
            <CardTitle>Hired message composer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Subject">
                <Input value={subject} onChange={(event) => setSubject(event.target.value)} />
              </Field>
              <Field label="Sender">
                <Input value={contactName} onChange={(event) => setContactName(event.target.value)} />
              </Field>
              <Field label="Start date">
                <Input value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </Field>
              <Field label="Next step">
                <Input value={nextStep} onChange={(event) => setNextStep(event.target.value)} />
              </Field>
            </div>
            <label className="flex items-center justify-between rounded-2xl border bg-emerald-50/50 p-3 text-sm">
              <span className="font-medium">Include company logo/header</span>
              <input
                type="checkbox"
                checked={includeLogo}
                onChange={(event) => setIncludeLogo(event.target.checked)}
                className="size-4 accent-emerald-600"
              />
            </label>
            <Field label="Email body">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-h-56 w-full rounded-2xl border bg-white p-3 text-sm leading-6 outline-none ring-emerald-200 transition focus:ring-2"
              />
            </Field>
            <div className="rounded-2xl border bg-zinc-50/80 p-3">
              <p className="text-xs font-medium uppercase text-zinc-500">Auto-fill fields</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {hiredTokens.map((token) => (
                  <button
                    type="button"
                    key={token}
                    onClick={() => insertMessageToken(token)}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200 transition hover:bg-zinc-100 hover:text-zinc-950"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Offer attachments</p>
                  <p className="mt-1 text-xs text-zinc-500">Mock documents included with the hired email.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAttachments((current) => [...current, `Attachment ${current.length + 1}.pdf`])}
                >
                  <Plus />
                  Add mock file
                </Button>
              </div>
              <div className="mt-3 grid gap-2">
                {attachments.map((attachment) => (
                  <div key={attachment} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-zinc-200">
                    <span className="flex min-w-0 items-center gap-2">
                      <ClipboardList className="size-4 shrink-0 text-emerald-600" />
                      <span className="truncate">{attachment}</span>
                    </span>
                    <button
                      type="button"
                      className="text-xs font-medium text-zinc-500 transition hover:text-red-600"
                      onClick={() => setAttachments((current) => current.filter((item) => item !== attachment))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="career-panel-muted rounded-2xl">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <EmailPreview
                candidate={candidate}
                includeLogo={includeLogo}
                headerLabel="Job Offer / Welcome"
                subject={renderedSubject}
                stageType="Hired"
                dateTime={startDate}
                location={nextStep}
                metadataLabel="Onboarding"
                message={renderedMessage}
                sender={contactName}
              />
              {attachments.length > 0 && (
                <div className="mt-3 rounded-2xl border border-emerald-100 bg-white p-3 text-xs text-zinc-600">
                  <p className="font-semibold text-zinc-900">Attachments</p>
                  <p className="mt-1">{attachments.join(", ")}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="career-clear-card rounded-2xl">
            <CardHeader>
              <CardTitle>Candidate context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-semibold">{candidate.name}</p>
              <p className="text-sm text-zinc-500">{candidate.title}</p>
              <ScoreBar label="Match" value={candidateScore(candidate, settings.scoreWeights)} compact />
              <p className="text-sm leading-6 text-zinc-600">{candidate.evidence[0]}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
      <div className="mt-4 flex flex-col justify-end gap-2 border-t border-zinc-200 pt-4 sm:flex-row">
        <Button
          variant={saved ? undefined : "outline"}
          disabled={saved}
          className={cn(saved && "bg-emerald-600 text-white hover:bg-emerald-600")}
          onClick={saveTemplate}
        >
          {saved ? "✓ Changes Saved" : "Save Template Changes"}
        </Button>
      </div>
    </section>
  );
}

function ConfirmationDialog({
  title,
  body,
  confirmLabel,
  tone = "default",
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  tone?: "default" | "danger";
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isDanger = tone === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/35 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1",
            isDanger ? "bg-red-50 text-red-700 ring-red-200" : "bg-pink-50 text-pink-700 ring-pink-100"
          )}>
            {isDanger ? <ShieldCheck className="size-5" /> : <MailPlus className="size-5" />}
          </span>
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button className={cn(isDanger ? "bg-red-600 text-white hover:bg-red-700" : "career-pink-action text-white")} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ToastNotice({
  title,
  body,
  tone = "pink",
}: {
  title: string;
  body?: string;
  tone?: ActivityTone;
}) {
  const toneClass: Record<ActivityTone, string> = {
    pink: "border-pink-200 bg-pink-50 text-pink-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    violet: "border-violet-200 bg-violet-50 text-violet-900",
    zinc: "border-zinc-200 bg-white text-zinc-900",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "fixed bottom-5 right-5 z-[60] w-[min(360px,calc(100vw-2.5rem))] rounded-2xl border p-4 shadow-2xl shadow-zinc-950/10",
        toneClass[tone]
      )}
      role="status"
    >
      <p className="font-semibold">{title}</p>
      {body && <p className="mt-1 text-sm leading-5 opacity-80">{body}</p>}
    </motion.div>
  );
}

function ResultPage({
  candidates,
  permissions,
  activeJob,
  onCloseJob,
  onNavigate,
}: {
  candidates: Candidate[];
  permissions: (typeof rolePermissions)[CompanyRole];
  activeJob: Job;
  onCloseJob: () => void;
  onNavigate: (page: Page) => void;
}) {
  const eligible = candidates.filter((candidate) => candidate.stage === "Invited" || candidate.stage === "Interview scheduled");
  const hired = candidates.filter((candidate) => candidate.stage === "Hired");
  const rejected = candidates.filter((candidate) => candidate.stage === "Rejected" || candidate.status === "Not selected");
  const [confirmation, setConfirmation] = useState<{
    title: string;
    body: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);
  const isClosed = activeJob.status === "Closed";

  function requestCloseJob() {
    if (!permissions.canManageJobs || isClosed) return;
    setConfirmation({
      title: "Close this job post?",
      body: `Close ${activeJob.title}? Candidates and hiring history stay visible, but the job will stop accepting new applicants.`,
      confirmLabel: "Close job post",
      onConfirm: () => {
        onCloseJob();
        setConfirmation(null);
      },
    });
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8">
      <WorkflowGuide
        trail={["Jobs", "Job workspace", "Candidate review", "Shortlist"]}
        current="Hiring result"
        onBack={() => onNavigate("shortlist")}
        onNavigate={onNavigate}
      />
      <PageHeader
        eyebrow="Hiring result"
        title="Hiring result"
        description="A read-only outcome view for candidates already marked hired from the shortlist. Keep the final record visible, then close the job when the role is complete."
        action={
          <Button
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
            disabled={!permissions.canManageJobs || isClosed}
            onClick={requestCloseJob}
          >
            <ShieldCheck />
            {isClosed ? "Job closed" : "Close job post"}
          </Button>
        }
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="career-clear-card rounded-2xl">
          <CardHeader>
            <CardTitle>Hired candidates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {hired.length === 0 ? (
              <EmptyState
                icon={UserCheck}
                title="No hired candidates yet"
                description="Mark an interviewed candidate as hired from the shortlist. Their final outcome will appear here."
                actionLabel="Open decision shortlist"
                onAction={() => onNavigate("shortlist")}
              />
            ) : hired.map((candidate) => (
              <div key={candidate.id} className="career-list-row rounded-2xl p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        {candidate.name.split(" ").map((part) => part[0]).join("")}
                      </span>
                      <div>
                        <p className="font-semibold text-zinc-950">{candidate.name}</p>
                        <p className="text-sm text-zinc-500">{candidate.title}</p>
                      </div>
                      <WorkAnimalTraitBadge candidate={candidate} />
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Hired
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">{candidate.evidence[0]}</p>
                  </div>
                  <div className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 lg:w-56 lg:shrink-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">Outcome</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-900">Hired</p>
                    <p className="mt-1 text-xs leading-5 text-emerald-800">Hired email sent from the saved template.</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="career-panel-muted rounded-2xl">
          <CardHeader>
            <CardTitle>Outcome summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <MiniStat label="Interview" value={String(eligible.length)} />
              <MiniStat label="Hired" value={String(hired.length)} />
              <MiniStat label="Not selected" value={String(rejected.length)} />
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <p className="text-sm font-semibold text-zinc-950">Hired candidates</p>
              <div className="mt-3 space-y-2">
                {hired.length === 0 ? (
                  <p className="text-sm text-zinc-500">No hires recorded yet.</p>
                ) : (
                  hired.map((candidate) => <CheckRow key={candidate.id}>{candidate.name}</CheckRow>)
                )}
              </div>
            </div>
            <Notice
              title="Decision source"
              body="Hiring decisions are made in the shortlist. This page only records confirmed outcomes."
            />
            <Button
              variant="outline"
              className="w-full border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
              disabled={!permissions.canManageJobs || isClosed}
              onClick={requestCloseJob}
            >
              {isClosed ? "Job closed" : "Close job post"}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => onNavigate("candidates")}>Continue reviewing</Button>
          </CardContent>
        </Card>
      </div>
      {confirmation && (
        <ConfirmationDialog
          title={confirmation.title}
          body={confirmation.body}
          confirmLabel={confirmation.confirmLabel}
          onCancel={() => setConfirmation(null)}
          onConfirm={confirmation.onConfirm}
        />
      )}
    </section>
  );
}

function CompanyNav({
  active,
  role,
  collapsed,
  topOffset,
  onCollapsedChange,
  onRoleChange,
  onNavigate,
  onLogOut,
}: {
  active: Page;
  role: CompanyRole;
  collapsed: boolean;
  topOffset: number;
  onCollapsedChange: (collapsed: boolean) => void;
  onRoleChange: (role: CompanyRole) => void;
  onNavigate: (page: Page) => void;
  onLogOut: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection =
    active === "job-detail" || active === "candidates" || active === "candidate-profile" || active === "shortlist" || active === "invite" || active === "hire-email"
      ? "jobs"
      : active;
  const navIcon = {
    dashboard: BriefcaseBusiness,
    jobs: ClipboardList,
    team: UsersRound,
    profile: Building2,
    settings: ShieldCheck,
  } as const;
  const activeItem = navItems.find((item) => item.page === activeSection);

  function handleNavigate(nextPage: Page) {
    setMobileMenuOpen(false);
    onNavigate(nextPage);
  }

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur xl:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-normal text-pink-600">CareerOS Employer</p>
            <p className="mt-0.5 truncate text-xs font-medium text-zinc-500">
              {activeItem?.label ?? "Dashboard"} · {rolePermissions[role].label}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-zinc-800 shadow-sm ring-1 ring-zinc-200 transition hover:bg-pink-50 hover:text-pink-700 hover:ring-pink-200"
            aria-label={mobileMenuOpen ? "Close employer navigation" : "Open employer navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: smoothEase }}
              className="mt-3 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-950/10"
            >
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <SidebarButton
                    key={item.page}
                    active={activeSection === item.page}
                    icon={navIcon[item.page as keyof typeof navIcon]}
                    label={item.label}
                    collapsed={false}
                    onClick={() => handleNavigate(item.page)}
                  />
                ))}
              </div>
              <div className="mt-3 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-100">
                <p className="text-xs font-medium uppercase text-zinc-500">Preview role</p>
                <select
                  value={role}
                  onChange={(e) => onRoleChange(e.target.value as CompanyRole)}
                  className="mt-2 h-10 w-full rounded-xl border bg-white px-3 text-sm"
                  aria-label="Preview role"
                >
                  {Object.keys(rolePermissions).map((roleName) => <option key={roleName}>{roleName}</option>)}
                </select>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-3 w-full justify-center gap-2 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogOut();
                }}
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.aside
        initial={{ x: -18, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.34, ease: smoothEase }}
        style={
          {
            "--sidebar-top": `${topOffset}px`,
          } as React.CSSProperties
        }
        className={cn(
          "z-30 hidden border-b bg-white/95 backdrop-blur transition-[width,top,height] duration-300 xl:fixed xl:left-0 xl:top-[var(--sidebar-top)] xl:block xl:h-[calc(100vh-var(--sidebar-top))] xl:overflow-y-auto xl:border-b-0 xl:border-r xl:shadow-[10px_0_35px_rgba(24,24,27,0.05)]",
          collapsed ? "xl:w-24" : "xl:w-72"
        )}
      >
        <div className={cn("mx-auto flex w-full max-w-7xl flex-col items-start gap-3 px-5 py-3 xl:min-h-full xl:pb-6 xl:pt-4", collapsed ? "xl:px-3" : "xl:px-4")}>
          <div
            className={cn(
              "w-full rounded-3xl border border-pink-100 bg-[linear-gradient(135deg,#fff,#fff7fb)] transition-all",
              collapsed ? "p-3" : "p-4"
            )}
          >
            <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between gap-3")}>
              <div className={cn("min-w-0", collapsed && "sr-only")}>
                <p className="truncate text-2xl font-semibold tracking-normal text-pink-600">CareerOS</p>
                <span className="mt-2 inline-flex rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700 ring-1 ring-pink-100">
                  Employer
                </span>
              </div>
              <button
                type="button"
                onClick={() => onCollapsedChange(!collapsed)}
                className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition hover:bg-pink-50 hover:text-pink-700 hover:ring-pink-200"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronRight className={cn("size-4 transition", !collapsed && "rotate-180")} />
              </button>
            </div>

            {collapsed ? (
              <div className="mt-3 flex justify-center">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-pink-50 text-sm font-semibold text-pink-700 ring-1 ring-pink-100">
                  OS
                </span>
              </div>
            ) : (
              null
            )}
          </div>

          <motion.div
            layout
            className={cn("grid w-full grid-cols-2 gap-2 sm:grid-cols-3 xl:flex xl:flex-col", collapsed && "xl:grid-cols-1")}
          >
            {navItems.map((item) => (
              <SidebarButton
                key={item.page}
                active={activeSection === item.page}
                icon={navIcon[item.page as keyof typeof navIcon]}
                label={item.label}
                collapsed={collapsed}
                onClick={() => onNavigate(item.page)}
              />
            ))}
          </motion.div>

          {collapsed ? (
            <button
              type="button"
              onClick={() => onCollapsedChange(false)}
              className="mt-auto flex w-full items-center justify-center rounded-2xl border bg-white p-3 text-xs font-semibold text-pink-700 shadow-sm ring-1 ring-pink-100 transition hover:bg-pink-50"
              title={`${role}: ${rolePermissions[role].label}`}
            >
              {role.slice(0, 1)}
            </button>
          ) : (
            <div className="w-full xl:mt-auto">
              <div className="career-clear-card w-full rounded-2xl p-3">
              <p className="text-xs font-medium uppercase text-zinc-500">Preview role</p>
              <select
                value={role}
                onChange={(e) => onRoleChange(e.target.value as CompanyRole)}
                className="mt-2 h-10 w-full rounded-xl border bg-white px-3 text-sm"
                aria-label="Preview role"
              >
                {Object.keys(rolePermissions).map((roleName) => <option key={roleName}>{roleName}</option>)}
              </select>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Use this to test what each company role can access.
              </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-3 w-full justify-start gap-2 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                onClick={onLogOut}
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}

function SidebarButton({
  active,
  icon: Icon,
  label,
  collapsed,
  onClick,
}: {
  active: boolean;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      layout
      whileHover={{ x: collapsed ? 0 : 2, y: -1 }}
      whileTap={tactileTap}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "career-sidebar-button flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition lg:w-full",
        collapsed && "lg:justify-center lg:px-0 lg:py-3",
        active
          ? "bg-zinc-950 text-white shadow-[0_12px_24px_rgba(24,24,27,0.14)]"
          : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-pink-50 hover:text-pink-700 hover:ring-pink-200"
      )}
    >
      <Icon className="size-4" />
      <span className={cn(collapsed && "lg:sr-only")}>{label}</span>
    </motion.button>
  );
}

function CandidateCard({
  candidate,
  active,
  selected,
  permissions,
  scoreWeights,
  onToggleSelected,
  onSelect,
  onShortlist,
  onApproach,
  onMarkApplied,
  onOpenProfile,
  onNavigate,
  isClosed,
}: {
  candidate: Candidate;
  active: boolean;
  selected: boolean;
  permissions: (typeof rolePermissions)[CompanyRole];
  scoreWeights: HiringSettings["scoreWeights"];
  onToggleSelected: (id: number) => void;
  onSelect: (id: number) => void;
  onShortlist: (id: number) => void;
  onApproach: (id: number) => void;
  onMarkApplied: (id: number) => void;
  onOpenProfile: (id: number) => void;
  onNavigate: (page: Page) => void;
  isClosed: boolean;
}) {
  const score = candidateScore(candidate, scoreWeights);
  const isApproachable = candidate.source === "Potential" && candidate.stage === "New";
  const isApproached = candidate.source === "Potential" && candidate.stage === "Approached";
  const isShortlisted = candidate.stage === "Shortlisted" || candidate.stage === "Invited" || candidate.stage === "Interview scheduled";
  const canShortlist = candidate.appliedToJob && !["Shortlisted", "Invited", "Interview scheduled", "Hired", "Rejected"].includes(candidate.stage);

  return (
    <motion.div
      variants={listItemMotion}
      initial="initial"
      animate="animate"
      whileHover={{ y: -1 }}
      whileTap={tactileTap}
      className={cn(
      "career-list-row min-w-0 rounded-2xl p-3 transition hover:-translate-y-0.5 hover:border-pink-200",
      active && "career-list-row-active"
    )}>
      <button className="w-full min-w-0 text-left" onClick={() => onSelect(candidate.id)}>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_150px] xl:grid-cols-[minmax(0,1fr)_190px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="checkbox"
                checked={selected}
                onChange={(event) => {
                  event.stopPropagation();
                  onToggleSelected(candidate.id);
                }}
                onClick={(event) => event.stopPropagation()}
                className="career-checkbox size-4 accent-pink-600"
                aria-label={`Select ${candidate.name}`}
              />
              <h2 className="text-base font-semibold">{candidate.name}</h2>
              <WorkAnimalTraitBadge candidate={candidate} />
              {candidateLabels(candidate, scoreWeights).map((label) => (
                <CandidateLabel key={label} label={label} />
              ))}
            </div>
            <p className="mt-1 text-sm text-zinc-600">{candidate.title}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {candidate.tags.slice(0, 4).map((tag) => <Badge key={tag} variant="secondary" className="text-[11px]">{tag}</Badge>)}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase text-zinc-500">Match score</span>
              <span className="text-xl font-semibold text-pink-700">{score}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
              <AnimatedProgress value={score} />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-zinc-500">
              <span>Skill {candidate.skillFit}%</span>
              <span>Project {candidate.projectRelevance}%</span>
              <span>Exp {candidate.experience}%</span>
            </div>
          </div>
        </div>
      </button>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <MapPin className="size-4" />
          {candidate.location}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenProfile(candidate.id)}>
            View CV
          </Button>
          {isApproachable ? (
            <Button size="sm" className="bg-violet-50 text-violet-700 ring-1 ring-violet-100 hover:bg-violet-100" disabled={isClosed || !permissions.canApproach} onClick={() => onApproach(candidate.id)}>
              <MessageSquareText />
              Approach
            </Button>
          ) : isApproached ? (
            <Button size="sm" className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100" disabled={isClosed || !permissions.canApproach} onClick={() => onMarkApplied(candidate.id)}>
              <UserCheck />
              Mark applied
            </Button>
          ) : isShortlisted ? (
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              onClick={() => onNavigate("shortlist")}
            >
              <ClipboardList />
              Open decision shortlist
            </Button>
          ) : (
            <Button
              size="sm"
              className="career-pink-action text-white"
              disabled={isClosed || !canShortlist || (!permissions.canManageJobs && !permissions.canApproach)}
              onClick={() => onShortlist(candidate.id)}
            >
              Shortlist
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function WorkAnimalTraitBadge({ candidate }: { candidate: Candidate }) {
  const livingCv = candidate.livingCvDetails;
  const animal = getWorkAnimal(livingCv.workAnimal);

  if (!livingCv.workAnimalTestCompleted || !animal) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-500 ring-1 ring-zinc-200"
        title="Work animal trait test is incomplete"
      >
        Trait pending
      </span>
    );
  }

  return (
    <span
      className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200"
      title={`${animal.name}: ${animal.short}`}
    >
      <span aria-hidden="true">{animal.emoji}</span>
      <span className="truncate">{animal.name}</span>
      <span className="hidden text-zinc-400 sm:inline">/</span>
      <span className="hidden truncate text-zinc-500 sm:inline">{animal.archetype}</span>
    </span>
  );
}

function AnimalTraitMiniCard({
  label,
  animal,
}: {
  label: string;
  animal: NonNullable<ReturnType<typeof getWorkAnimal>>;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-3 ring-1 ring-pink-100/70">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-pink-600">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-950">
        <span className="mr-1" aria-hidden="true">{animal.emoji}</span>
        {animal.name}
      </p>
      <p className="mt-0.5 text-xs leading-5 text-zinc-500">{animal.archetype}</p>
    </div>
  );
}

function CandidateEvidence({
  candidate,
  scoreWeights,
  open,
  onToggle,
  onNavigate,
}: {
  candidate: Candidate;
  scoreWeights: HiringSettings["scoreWeights"];
  open: boolean;
  onToggle: () => void;
  onNavigate: (page: Page) => void;
}) {
  const livingCv = candidate.livingCvDetails;
  const animal = getWorkAnimal(livingCv.workAnimal);

  return (
    <aside className="w-full min-w-0 space-y-4 lg:sticky lg:top-6 lg:w-[clamp(20rem,28vw,23rem)] lg:shrink-0 lg:grow-0 lg:basis-[clamp(20rem,28vw,23rem)]">
      <Card className="career-section-band rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="size-5 text-pink-600" />
            Decision shortlist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-6 text-zinc-600">
            Shortlisted candidates move here for interview invites, hire decisions, and not-selected outcomes.
          </p>
          <Button
            className="career-pink-action w-full text-white"
            onClick={() => onNavigate("shortlist")}
          >
            Open decision shortlist
            <ChevronRight />
          </Button>
        </CardContent>
      </Card>

      <Card className="career-clear-card rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span>Candidate evidence</span>
            <button
              onClick={onToggle}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-100 hover:bg-pink-50"
            >
              {open ? "Minimize" : "Expand"}
              {open ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
          </CardTitle>
        </CardHeader>
        {open && <CardContent className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{livingCv.name}</h2>
            <p className="text-sm text-zinc-600">{livingCv.title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {candidateLabels(candidate, scoreWeights).map((label) => (
                <CandidateLabel key={label} label={label} />
              ))}
            </div>
          </div>
          <div className="career-clear-metric rounded-2xl p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Composite match</span>
              <span className="font-semibold text-pink-700">{candidateScore(candidate, scoreWeights)}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <AnimatedProgress value={candidateScore(candidate, scoreWeights)} />
            </div>
          </div>
          <div className="rounded-2xl bg-pink-50 p-3 ring-1 ring-pink-100">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-700">Work animal</p>
            <p className="mt-1 text-sm font-semibold text-zinc-950">
              {livingCv.workAnimalTestCompleted && animal
                ? `${animal.emoji} ${animal.name}, ${animal.archetype}`
                : "Unknown - profile incomplete"}
            </p>
          </div>
          <ul className="space-y-2">
            {livingCv.employerEvidence.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-5">
                <Check className="mt-0.5 size-4 shrink-0 text-pink-600" />
                <span className="min-w-0 text-zinc-700">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>}
      </Card>
    </aside>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <Badge className="bg-pink-50 text-pink-700 ring-1 ring-pink-200">{eyebrow}</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{description}</p>
      </div>
      {action}
    </div>
  );
}

function WorkflowGuide({
  trail,
  backLabel,
  current,
  onBack,
  onNavigate,
}: {
  trail?: string[];
  backLabel?: string;
  current: string;
  nextLabel?: string;
  onBack: () => void;
  onNavigate?: (page: Page) => void;
  onNext?: () => void;
}) {
  const items = trail ?? (backLabel ? [backLabel] : []);

  return (
    <nav className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const target = employerPageMap[item];
        const handleClick =
          target && onNavigate
            ? () => onNavigate(target)
            : index === items.length - 1
              ? onBack
              : undefined;

        return (
          <span key={`${item}-${index}`} className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={handleClick}
              disabled={!handleClick}
              className={cn(
                "font-medium text-zinc-500 transition hover:text-zinc-950 disabled:cursor-default disabled:hover:text-zinc-500",
                handleClick && "cursor-pointer"
              )}
            >
              {item}
            </button>
            <ChevronRight className="size-4 shrink-0 text-zinc-300" />
          </span>
        );
      })}
      <span className="truncate rounded-full bg-pink-50 px-3 py-1 font-semibold text-pink-700 ring-1 ring-pink-100">
        {current}
      </span>
    </nav>
  );
}

function BreadcrumbTrail({ items }: { items: string[] }) {
  return (
    <nav className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex min-w-0 items-center gap-2">
          {index > 0 && <ChevronRight className="size-4 shrink-0 text-zinc-300" />}
          <span
            className={cn(
              "truncate",
              index === items.length - 1
                ? "rounded-full bg-pink-50 px-3 py-1 font-semibold text-pink-700 ring-1 ring-pink-100"
                : "font-medium text-zinc-500"
            )}
          >
            {item}
          </span>
        </span>
      ))}
    </nav>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/75 p-6">
      <div className="flex max-w-xl flex-col gap-4 sm:flex-row sm:items-center">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-700 ring-1 ring-pink-100">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button className="sm:ml-auto" variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

function JobSignal({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-3 ring-1",
        dark
          ? "bg-white/8 text-white ring-white/12"
          : "bg-[linear-gradient(180deg,#fff,#fff7fb)] text-zinc-950 ring-pink-100"
      )}
    >
      <p className={cn("text-xs", dark ? "text-white/55" : "text-zinc-500")}>{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-xl font-semibold">{value}</p>
        <span className={cn("h-1.5 w-8 rounded-full", dark ? "bg-pink-300" : "bg-pink-400")} />
      </div>
    </div>
  );
}

function CompactMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2 xl:block">
      <span className="text-sm font-semibold text-zinc-950">{value}</span>
      <span className="text-xs text-zinc-500 xl:hidden">{label}</span>
    </div>
  );
}

function AnimatedProgress({
  value,
  className,
  delay = 0,
}: {
  value: number;
  className?: string;
  delay?: number;
}) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${safeValue}%` }}
      transition={{ duration: 0.75, delay, ease: smoothEase }}
      className={cn(
        "career-progress-fill h-full rounded-full bg-[linear-gradient(90deg,#f4537c,#df0746)]",
        className
      )}
    />
  );
}

function JobCountdownBadge({ job, show = true }: { job: Job; show?: boolean }) {
  if (job.status === "Closed") {
    return (
      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">
        Closed
      </span>
    );
  }

  if (!show) return null;

  const isHired = job.status === "Hired";
  const tone =
    isHired
      ? "bg-pink-50 text-pink-700 ring-pink-200"
      : job.expiresIn <= 7
        ? "bg-red-50 text-red-700 ring-red-200"
        : job.expiresIn <= 21
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-zinc-100 text-zinc-600 ring-zinc-200";

  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium ring-1", tone)}>
      {isHired ? `Auto closes in ${job.expiresIn}d` : `Expires in ${job.expiresIn}d`}
    </span>
  );
}

function TimelineItem({
  label,
  time,
  tone,
  last,
}: {
  label: string;
  time: string;
  tone: ActivityTone;
  last: boolean;
}) {
  const toneMap: Record<ActivityTone, string> = {
    pink: "bg-zinc-400",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    violet: "bg-violet-500",
    zinc: "bg-zinc-300",
  };

  return (
    <div className="grid grid-cols-[20px_minmax(0,1fr)] gap-3">
      <div className="flex flex-col items-center">
        <span className={cn("mt-1 size-2.5 rounded-full", toneMap[tone])} />
        {!last && <span className="mt-1 h-full min-h-8 w-px bg-zinc-200" />}
      </div>
      <div className="pb-4">
        <p className="text-sm font-medium text-zinc-900">{label}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{time}</p>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: number;
  compact?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl border bg-white p-3", compact && "bg-zinc-50/70")}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-700">{label}</p>
        <p className="text-sm font-semibold text-pink-700">{value}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
        <AnimatedProgress value={value} />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}

function StepBlock({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-pink-600 text-xs font-medium text-white">{step}</span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function CheckRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex gap-2 text-sm leading-5", className)}>
      <Check className="mt-0.5 size-4 shrink-0 text-pink-600" />
      <span>{children}</span>
    </div>
  );
}

function PublishCheckRow({ complete, label, detail }: { complete: boolean; label: string; detail: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-zinc-100">
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
          complete ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "bg-zinc-100 text-zinc-400"
        )}
      >
        {complete ? <Check className="size-3.5" /> : <span className="size-1.5 rounded-full bg-current" />}
      </span>
      <span>
        <span className={cn("block text-sm font-medium", complete ? "text-zinc-900" : "text-zinc-500")}>
          {label}
        </span>
        {!complete && <span className="mt-0.5 block text-xs leading-5 text-zinc-500">{detail}</span>}
      </span>
    </div>
  );
}

function HelpTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <span className="flex size-5 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500 ring-1 ring-zinc-200">
        ?
      </span>
      <span className="pointer-events-none absolute left-1/2 top-7 z-20 hidden w-64 -translate-x-1/2 rounded-2xl border bg-white p-3 text-xs font-normal leading-5 text-zinc-600 shadow-xl group-hover:block">
        {text}
      </span>
    </span>
  );
}

function PermissionPill({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        enabled
          ? "bg-pink-50 text-pink-700 ring-pink-100"
          : "bg-white text-zinc-400 ring-zinc-200"
      )}
    >
      {label}
    </span>
  );
}

function ToggleRow({
  title,
  detail,
  enabled,
  onToggle,
}: {
  title: string;
  detail: string;
  enabled: boolean;
  onToggle?: () => void;
}) {
  const Wrapper = onToggle ? "button" : "div";

  return (
    <Wrapper
      type={onToggle ? "button" : undefined}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-2xl border bg-zinc-50/70 p-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 ease-out",
        onToggle && "hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white hover:shadow-sm"
      )}
      aria-pressed={onToggle ? enabled : undefined}
    >
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-zinc-500">{detail}</p>
      </div>
      <span
        className={cn(
          "flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-[background-color,box-shadow] duration-300 ease-out",
          enabled ? "bg-emerald-500" : "bg-zinc-200"
        )}
      >
        <span className={cn("size-5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out", enabled && "translate-x-5 scale-105")} />
      </span>
    </Wrapper>
  );
}

function WeightSlider({
  label,
  detail,
  value,
  onChange,
}: {
  label: string;
  detail: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{label}</p>
          <p className="mt-1 text-xs text-zinc-500">{detail}</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
          <input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="h-9 w-20 rounded-xl border bg-white px-2 text-right"
          />
          %
        </label>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-pink-600"
      />
    </div>
  );
}

function RuleCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <p className="text-xs uppercase text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-2 text-sm leading-5 text-zinc-500">{detail}</p>
    </div>
  );
}

function PermissionRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-white px-3 py-2 text-sm">
      <span>{label}</span>
      <Badge className={enabled ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200"}>
        {enabled ? "Allowed" : "Locked"}
      </Badge>
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <p className="font-medium text-emerald-800">{title}</p>
      <p className="mt-1 text-sm text-emerald-700">{body}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: JobStatus }) {
  const tone = {
    Open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Interviewing: "bg-violet-50 text-violet-700 ring-violet-200",
    Hired: "bg-pink-50 text-pink-700 ring-pink-200",
    Closed: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  }[status];

  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium ring-1", tone)}>{status}</span>;
}

function CandidateLabel({ label }: { label: string }) {
  const tones: Record<string, string> = {
    Applied: "bg-sky-50 text-sky-700 ring-sky-200",
    Potential: "bg-amber-50 text-amber-700 ring-amber-200",
    Approached: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Shortlisted: "bg-violet-50 text-violet-700 ring-violet-200",
    Invited: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Interview: "bg-violet-50 text-violet-700 ring-violet-200",
    Hired: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "Not selected": "bg-zinc-50 text-zinc-600 ring-zinc-200",
    "High fit": "bg-pink-50 text-pink-700 ring-pink-200",
  };
  const tone = tones[label] ?? "bg-zinc-100 text-zinc-600 ring-zinc-200";

  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium ring-1", tone)}>{label}</span>;
}
