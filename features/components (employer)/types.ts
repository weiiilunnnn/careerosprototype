import type { CandidateLivingCv } from "@/lib/candidateLivingCvData";
import type { WorkAnimalSlug } from "@/lib/workAnimals";

export type Page =
  | "dashboard"
  | "team"
  | "jobs"
  | "job-detail"
  | "post-job"
  | "candidates"
  | "candidate-profile"
  | "shortlist"
  | "invite"
  | "hire-email"
  | "result"
  | "talent-pool"
  | "projects"
  | "project-detail"
  | "post-project"
  | "profile"
  | "settings";

/** Sub-tabs inside a single Job workspace — Candidates, Shortlist, Interview, Hired, Result
 * all live under one job instead of as separate top-level destinations. */
export const jobWorkspaceTabs = [
  { page: "job-detail", label: "Overview" },
  { page: "candidates", label: "Candidates" },
  { page: "shortlist", label: "Shortlist" },
  { page: "invite", label: "Interview email" },
  { page: "hire-email", label: "Hired email" },
  { page: "result", label: "Result" },
] as const;

export type CompanyRole = "Super Admin" | "Admin" | "User";
export type JobStatus = "Open" | "Interviewing" | "Hired" | "Closed";
export type CandidateType = "Applied" | "Potential" | "Shortlisted" | "Hired" | "Rejected";
export type CandidateSource = "Applied" | "Potential";
export type CandidateStage =
  | "New"
  | "Approached"
  | "Shortlisted"
  | "Invited"
  | "Interview scheduled"
  | "Hired"
  | "Rejected";
export type ActivityTone = "pink" | "amber" | "emerald" | "violet" | "zinc";

export type EmploymentType = "Full-time" | "Internship" | "Contract" | "Part-time";
/** "open" = public candidates only, "collab" = collaborating universities only, "both" = public + university. */
export type JobVisibility = "open" | "collab" | "both";

export const collabUniversities = [
  "Taylor's University",
  "Asia Pacific University",
  "Sunway University",
  "Swinburne University of Technology Sarawak Campus",
  "INTI International University",
] as const;
export type CollabUniversity = (typeof collabUniversities)[number];

export const projectAreas = [
  "Data Analytics",
  "Software Engineering",
  "UI/UX Design",
  "Automation",
  "Web Development",
  "Artificial Intelligence",
  "Cybersecurity",
  "Digital Marketing",
  "Business Analytics",
  "Product Design",
] as const;

export const projectTypes = [
  "Hackathon / Competition",
  "Client-style Project",
  "Automation Project",
  "Dashboard / Power BI Project",
  "Research Project",
  "Capstone Brief",
  "Case Study Challenge",
  "Product Design Sprint",
  "Data Analysis Challenge",
] as const;

export const projectAudiences = [
  "Data Analytics students",
  "Software Engineering students",
  "UI/UX students",
  "Business students",
  "Marketing students",
  "Final-year students",
  "Open to all suitable students",
] as const;

export const projectDeliverables = [
  "Dashboard prototype",
  "Report",
  "Presentation slides",
  "GitHub repository",
  "Figma prototype",
  "Automation workflow demo",
] as const;

export type ProjectDifficulty = "Beginner" | "Intermediate" | "Advanced";

/** A single point on a project's timeline. `date` is an ISO date (yyyy-mm-dd) string — only used in "fixed" timeline mode.
 * `done` is only used in "ongoing" mode, where milestones are an undated checklist instead of a dated timeline. */
export type ProjectMilestone = {
  label: string;
  date?: string;
  done?: boolean;
};

/** "fixed" = dated timeline with a submission deadline (e.g. a hackathon/competition).
 * "ongoing" = open-ended, project-based work with no fixed deadline — milestones become an undated checklist. */
export type ProjectTimelineMode = "fixed" | "ongoing";

/** Projects are always visible to collaborating universities only — candidates never see projects. */
export type ProjectVisibility = "collab";

/** A university-assigned student, never a "candidate": projects have no hiring pipeline. */
export type ProjectStudent = {
  id: number;
  candidateAccountId?: number;
  name: string;
  program: string;
  role?: string;
  performance?: "High potential" | "Strong" | "Needs review";
};

/** A single university may assign more than one team — never assume one university equals one team. */
export type ProjectTeamStatus =
  | "Confirmed"
  | "In Progress"
  | "Draft Submitted"
  | "Final Submitted"
  | "Reviewed"
  | "Revision Requested"
  | "Accepted";

export const projectTeamStatusOrder: ProjectTeamStatus[] = [
  "Confirmed",
  "In Progress",
  "Draft Submitted",
  "Final Submitted",
  "Reviewed",
  "Revision Requested",
  "Accepted",
];

export type ProjectSubmissionFile = {
  name: string;
  kind: "file" | "link";
};

export type ProjectTeam = {
  id: number;
  name: string;
  university: CollabUniversity;
  supervisor?: string;
  students: ProjectStudent[];
  status: ProjectTeamStatus;
  expectedSubmissionDate?: string;
  submittedAt?: string;
  submittedBy?: string;
  files: ProjectSubmissionFile[];
  feedback?: string;
};

export type ProjectFinalOutcome = "Successful" | "Partially successful" | "Needs follow-up" | "";

export type ProjectFeedback = {
  whatWorkedWell?: string;
  whatNeedsImprovement?: string;
  finalComments?: string;
  finalOutcome?: ProjectFinalOutcome;
};

export type ProjectStatus =
  | "Draft"
  | "Published"
  | "Open for Interest"
  | "Team Formed"
  | "In Progress"
  | "Submitted"
  | "Completed"
  | "Closed";

export const projectStatusOrder: ProjectStatus[] = [
  "Draft",
  "Published",
  "Open for Interest",
  "Team Formed",
  "In Progress",
  "Submitted",
  "Completed",
  "Closed",
];

export type Project = {
  id: number;
  title: string;
  projectArea: string;
  projectType: string;
  duration: string;
  goal: string;
  description?: string;
  visibility: ProjectVisibility;
  targetUniversities: CollabUniversity[];
  targetAudience: string[];
  skills: string[];
  tools: string[];
  deliverables: string[];
  difficulty: ProjectDifficulty;
  teamSize?: string;
  timelineMode: ProjectTimelineMode;
  startDate?: string;
  submissionDate?: string;
  milestones: ProjectMilestone[];
  status: ProjectStatus;
  createdAt: string;
  teams: ProjectTeam[];
  feedback?: ProjectFeedback;
};

export type Company = {
  name: string;
  industry: string;
  location: string;
  size: string;
  description: string;
};

export type Job = {
  id: number;
  title: string;
  department: string;
  status: JobStatus;
  location: string;
  workMode: string;
  employmentType?: EmploymentType;
  visibility: JobVisibility;
  targetUniversities: CollabUniversity[];
  salary: string;
  description?: string;
  requirements?: string;
  deadline?: string;
  createdBy?: string;
  skills: string[];
  screeningQuestion: string;
  applicants: number;
  shortlisted: number;
  hired: number;
  expiresIn: number;
  supervisorName?: string;
  supervisorAnimal?: WorkAnimalSlug;
};

export type TeamMemberStatus = "Active" | "Pending" | "Disabled";

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: CompanyRole;
  status: TeamMemberStatus;
  presence: "Online" | "Offline";
  focus: string;
  lastActive: string;
  password: string;
  workAnimal?: WorkAnimalSlug;
  invitedAt?: string;
};

export type ScoringWeights = {
  skill: number;
  project: number;
  experience: number;
  trajectory: number;
};

export type ExpirySettings = {
  countdown: boolean;
  promptResult: boolean;
  stayOpenAfterHire: boolean;
  autoCloseAfterHireDays: number;
};

export type ValidationSettings = {
  duplicateTitle: boolean;
  requireDepartment: boolean;
  logActions: boolean;
};

export type EmailTemplateSettings = {
  subject: string;
  sender: string;
  body: string;
  includeLogo: boolean;
  stageType?: string;
  dateTime?: string;
  location?: string;
  startDate?: string;
  nextStep?: string;
};

export type HiringSettings = {
  scoreWeights: ScoringWeights;
  expiry: ExpirySettings;
  validation: ValidationSettings;
  templates: {
    interview: EmailTemplateSettings;
    hired: EmailTemplateSettings;
  };
};

export type Candidate = {
  id: number;
  jobId: number;
  name: string;
  title: string;
  location: string;
  source: CandidateSource;
  stage: CandidateStage;
  type: CandidateType;
  status: "New" | "Waiting" | "Drafted" | "Invited" | "Interview scheduled" | "Hired" | "Not selected";
  appliedToJob: boolean;
  pastSecondStage: boolean;
  skillFit: number;
  projectRelevance: number;
  experience: number;
  trajectory: number;
  livingCv: "Updated" | "Stale" | "Verified";
  tags: string[];
  evidence: string[];
  livingCvDetails: CandidateLivingCv;
};

export type ActivityEvent = {
  id: number;
  label: string;
  time: string;
  tone: ActivityTone;
};

export type RolePermission = {
  label: string;
  canEditCompany: boolean;
  canManageTeam: boolean;
  canManageAdmins: boolean;
  canTransferSuperAdmin: boolean;
  canManageJobs: boolean;
  canApproach: boolean;
  canMarkHired: boolean;
  canRemoveWorkspace: boolean;
};

export type EmployerStore = {
  company: Company;
  currentUserEmail?: string;
  members: TeamMember[];
  jobs: Job[];
  candidates: Candidate[];
  projects: Project[];
  settings: HiringSettings;
  activityLog: ActivityEvent[];
  talentPoolManualIds?: number[];
  talentPoolHiddenIds?: number[];
  createdAt: string;
  updatedAt: string;
  mode?: "registered" | "demo";
  migrations?: Record<string, boolean>;
};
