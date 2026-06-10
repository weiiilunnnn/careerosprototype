export type Page =
  | "personal"
  | "create-company"
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
  | "profile"
  | "settings";

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
  employmentType?: string;
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
  settings: HiringSettings;
  activityLog: ActivityEvent[];
  createdAt: string;
  updatedAt: string;
  mode?: "registered" | "demo";
};
