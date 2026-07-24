import { getCandidateLivingCv } from "@/lib/candidateLivingCvData";
import {
  initialActivity,
  initialCandidates,
  initialCompany,
  initialHiringSettings,
  initialJobs,
  initialMembers,
  initialProjects,
} from "./data";
import type { Candidate, Company, EmployerStore, TeamMember } from "./types";

export const EMPLOYER_STORE_KEY = "careeros-employer-store";
export const EMPLOYER_SESSION_KEY = "careeros-employer-session";
export const LEGACY_COMPANY_KEY = "careeros-employer-company";
const SENIOR_PRODUCT_LEAD_OPEN_MIGRATION = "senior-product-lead-open-2026-07-02";
const ALL_POSTED_JOBS_CANDIDATES_MIGRATION = "all-posted-jobs-candidates-2026-07-02";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function nowLabel() {
  return new Date().toISOString();
}

function cleanCompany(company: Partial<Company>): Company {
  return {
    name: company.name?.trim() || "New Company",
    industry: company.industry?.trim() || "Not specified",
    location: company.location?.trim() || "Not specified",
    size: company.size?.trim() || "Not specified",
    description: company.description?.trim() || "Employer profile created through CareerOS.",
  };
}

function memberNameFromEmail(email: string) {
  return (
    email
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
      .join(" ") || "Employer User"
  );
}

export function createEmployerStore({
  company,
  ownerName,
  ownerEmail,
  ownerPassword = "careeros",
  mode = "registered",
  seedDemo = false,
}: {
  company: Partial<Company>;
  ownerName?: string;
  ownerEmail: string;
  ownerPassword?: string;
  mode?: EmployerStore["mode"];
  seedDemo?: boolean;
}): EmployerStore {
  const normalizedEmail = ownerEmail.trim().toLowerCase();
  const owner: TeamMember = {
    id: 1,
    name: ownerName?.trim() || memberNameFromEmail(normalizedEmail),
    email: normalizedEmail,
    role: "Super Admin",
    status: "Active",
    presence: "Online",
    focus: "Workspace owner",
    lastActive: "Now",
    password: ownerPassword.trim() || "careeros",
  };

  const timestamp = nowLabel();
  return {
    company: cleanCompany(company),
    currentUserEmail: normalizedEmail,
    members: seedDemo
      ? initialMembers.map((member, index) => ({
          ...member,
          id: index + 1,
          presence: member.email === normalizedEmail ? "Online" : member.presence,
        }))
      : [owner],
    jobs: seedDemo ? initialJobs : [],
    candidates: seedDemo ? initialCandidates : [],
    projects: seedDemo ? initialProjects : [],
    settings: initialHiringSettings,
    activityLog: seedDemo ? initialActivity : [],
    talentPoolManualIds: [],
    talentPoolHiddenIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    mode,
  };
}

export function createDemoEmployerStore() {
  return normalizeStore(createEmployerStore({
    company: initialCompany,
    ownerName: "Shihong Wong",
    ownerEmail: "admin@talentbank.com",
    ownerPassword: "careeros",
    mode: "demo",
    seedDemo: true,
  }));
}

function normalizeCandidate(candidate: Candidate): Candidate {
  const canonicalLivingCv = getCandidateLivingCv(candidate.id);
  const savedLivingCv = candidate.livingCvDetails;
  const livingCvDetails = {
    ...canonicalLivingCv,
    ...savedLivingCv,
    workAnimal: savedLivingCv?.workAnimal ?? canonicalLivingCv.workAnimal,
    secondaryWorkAnimal: savedLivingCv?.secondaryWorkAnimal ?? canonicalLivingCv.secondaryWorkAnimal,
    shadowWorkAnimal: savedLivingCv?.shadowWorkAnimal ?? canonicalLivingCv.shadowWorkAnimal,
    workAnimalTestCompleted:
      savedLivingCv?.workAnimalTestCompleted || canonicalLivingCv.workAnimalTestCompleted,
  };

  return {
    ...candidate,
    name: livingCvDetails.name,
    title: livingCvDetails.title,
    location: livingCvDetails.location,
    tags: candidate.tags?.length ? candidate.tags : livingCvDetails.skills.technical.slice(0, 4),
    evidence: candidate.evidence?.length ? candidate.evidence : livingCvDetails.employerEvidence,
    livingCvDetails,
  };
}

function normalizeStore(store: EmployerStore): EmployerStore {
  const timestamp = nowLabel();
  const members = store.members?.length ? store.members : initialMembers;
  const migrations = store.migrations ?? {};
  const shouldReopenSeniorProductLead = !migrations[SENIOR_PRODUCT_LEAD_OPEN_MIGRATION];
  const isDemoLikeStore =
    store.mode === "demo" ||
    store.company?.name === initialCompany.name ||
    (store.jobs ?? []).some((job) =>
      initialJobs.some((demoJob) => demoJob.id === job.id && demoJob.title === job.title)
    );
  const shouldSeedAllPostedJobCandidates =
    isDemoLikeStore && !migrations[ALL_POSTED_JOBS_CANDIDATES_MIGRATION];
  const normalizedCandidates = (store.candidates ?? []).map((candidate) => normalizeCandidate(candidate));
  const existingCandidateIds = new Set(normalizedCandidates.map((candidate) => candidate.id));
  const candidates = shouldSeedAllPostedJobCandidates
    ? [
        ...normalizedCandidates,
        ...initialCandidates
          .filter((candidate) => !existingCandidateIds.has(candidate.id))
          .map((candidate) => normalizeCandidate(candidate)),
      ]
    : normalizedCandidates;
  const jobs = (store.jobs ?? []).map((job) =>
    shouldReopenSeniorProductLead && job.title === "Senior Product Lead"
      ? {
          ...job,
          status: "Open" as const,
          expiresIn: job.expiresIn > 0 ? job.expiresIn : 18,
        }
      : job
  ).map((job) => {
    const scopedCandidates = candidates.filter((candidate) => candidate.jobId === job.id);
    if (scopedCandidates.length === 0) return job;

    return {
      ...job,
      applicants: scopedCandidates.filter((candidate) => candidate.appliedToJob).length,
      shortlisted: scopedCandidates.filter((candidate) =>
        ["Shortlisted", "Invited", "Interview scheduled"].includes(candidate.stage)
      ).length,
      hired: scopedCandidates.filter((candidate) => candidate.stage === "Hired").length,
    };
  });

  return {
    company: cleanCompany(store.company ?? initialCompany),
    currentUserEmail: store.currentUserEmail ?? members[0]?.email,
    members: members.map((member, index) => ({
      ...member,
      id: member.id ?? index + 1,
      status: member.status ?? "Active",
      presence: member.presence ?? "Offline",
      password: member.password ?? "careeros",
      focus: member.focus ?? roleFocus(member.role),
      lastActive: member.lastActive ?? "Not active yet",
    })),
    jobs,
    candidates,
    projects: store.projects?.length ? store.projects : (isDemoLikeStore ? initialProjects : []),
    settings: store.settings ?? initialHiringSettings,
    activityLog: store.activityLog ?? [],
    talentPoolManualIds: store.talentPoolManualIds ?? [],
    talentPoolHiddenIds: store.talentPoolHiddenIds ?? [],
    createdAt: store.createdAt ?? timestamp,
    updatedAt: store.updatedAt ?? timestamp,
    mode: store.mode ?? "registered",
    migrations: {
      ...migrations,
      [SENIOR_PRODUCT_LEAD_OPEN_MIGRATION]: true,
      [ALL_POSTED_JOBS_CANDIDATES_MIGRATION]: true,
    },
  };
}

export function roleFocus(role: TeamMember["role"]) {
  if (role === "Super Admin") return "Workspace owner";
  if (role === "Admin") return "Hiring operations";
  return "Hiring access";
}

export function loadEmployerStore(): EmployerStore | null {
  if (!canUseStorage()) return null;

  try {
    const activeSession = window.localStorage.getItem(EMPLOYER_SESSION_KEY) ?? "";
    if (activeSession === "admin@talentbank.com") return createDemoEmployerStore();

    const stored = window.localStorage.getItem(EMPLOYER_STORE_KEY);
    if (stored) {
      const parsedStore = JSON.parse(stored) as EmployerStore;
      if (parsedStore.mode === "demo" || parsedStore.company?.name === initialCompany.name) {
        return createDemoEmployerStore();
      }
      return normalizeStore(parsedStore);
    }

    const legacyCompany = window.localStorage.getItem(LEGACY_COMPANY_KEY);
    if (!legacyCompany) return null;

    const company = JSON.parse(legacyCompany) as Partial<Company>;
    const store = createEmployerStore({
      company,
      ownerEmail: "admin@talentbank.com",
      ownerName: "Company Admin",
    });
    saveEmployerStore(store);
    return store;
  } catch {
    return null;
  }
}

export function saveEmployerStore(store: EmployerStore) {
  if (!canUseStorage()) return;
  if (store.mode === "demo" || store.company?.name === initialCompany.name) {
    window.localStorage.removeItem(EMPLOYER_STORE_KEY);
    return;
  }
  const nextStore = normalizeStore({ ...store, updatedAt: nowLabel() });
  window.localStorage.setItem(EMPLOYER_STORE_KEY, JSON.stringify(nextStore));
}

export function setEmployerSession(email: string) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(EMPLOYER_SESSION_KEY, email.trim().toLowerCase());
}

export function getEmployerSession() {
  if (!canUseStorage()) return "";
  return window.localStorage.getItem(EMPLOYER_SESSION_KEY) ?? "";
}

export function authenticateEmployer(email: string, password: string) {
  if (!canUseStorage()) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  const isDemoCredential = normalizedEmail === "admin@talentbank.com" && normalizedPassword === "careeros";

  if (isDemoCredential) {
    const demoStore = createDemoEmployerStore();
    setEmployerSession(normalizedEmail);
    return {
      store: demoStore,
      member: demoStore.members.find((item) => item.email.toLowerCase() === normalizedEmail) ?? demoStore.members[0],
    };
  }

  const store = loadEmployerStore();

  const member = store?.members.find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === normalizedPassword && item.status !== "Disabled"
  );

  if (!store || !member) return null;

  const nextStore: EmployerStore = {
    ...store,
    currentUserEmail: normalizedEmail,
    members: store.members.map((item) =>
      item.email.toLowerCase() === normalizedEmail
        ? { ...item, status: "Active", presence: "Online", lastActive: "Now" }
        : item
    ),
  };
  saveEmployerStore(nextStore);
  setEmployerSession(normalizedEmail);
  return { store: nextStore, member: nextStore.members.find((item) => item.email.toLowerCase() === normalizedEmail) ?? member };
}
