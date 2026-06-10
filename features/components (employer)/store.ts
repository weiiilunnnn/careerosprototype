import {
  initialActivity,
  initialCandidates,
  initialCompany,
  initialHiringSettings,
  initialJobs,
  initialMembers,
} from "./data";
import type { Company, EmployerStore, TeamMember } from "./types";

export const EMPLOYER_STORE_KEY = "careeros-employer-store";
export const EMPLOYER_SESSION_KEY = "careeros-employer-session";
export const LEGACY_COMPANY_KEY = "careeros-employer-company";

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
    settings: initialHiringSettings,
    activityLog: seedDemo ? initialActivity : [],
    createdAt: timestamp,
    updatedAt: timestamp,
    mode,
  };
}

export function createDemoEmployerStore() {
  return createEmployerStore({
    company: initialCompany,
    ownerName: "Shihong Wong",
    ownerEmail: "admin@talentbank.com",
    ownerPassword: "careeros",
    mode: "demo",
    seedDemo: true,
  });
}

function normalizeStore(store: EmployerStore): EmployerStore {
  const timestamp = nowLabel();
  const members = store.members?.length ? store.members : initialMembers;
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
    jobs: store.jobs ?? [],
    candidates: store.candidates ?? [],
    settings: store.settings ?? initialHiringSettings,
    activityLog: store.activityLog ?? [],
    createdAt: store.createdAt ?? timestamp,
    updatedAt: store.updatedAt ?? timestamp,
    mode: store.mode ?? "registered",
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
    const stored = window.localStorage.getItem(EMPLOYER_STORE_KEY);
    if (stored) return normalizeStore(JSON.parse(stored) as EmployerStore);

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
  let store = loadEmployerStore();
  const isDemoCredential = normalizedEmail === "admin@talentbank.com" && normalizedPassword === "careeros";

  if (
    isDemoCredential &&
    (!store || !store.members.some((item) => item.email.toLowerCase() === normalizedEmail))
  ) {
    store = createDemoEmployerStore();
    saveEmployerStore(store);
  }

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
