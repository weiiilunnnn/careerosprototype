import type { Page } from "./types";

export const employerPageMap: Record<string, Page> = {
  Dashboard: "dashboard",
  Jobs: "jobs",
  "Job workspace": "job-detail",
  "Post job": "post-job",
  "Candidate review": "candidates",
  "Candidate CV": "candidate-profile",
  Shortlist: "shortlist",
  "Interview email": "invite",
  "Hired email": "hire-email",
  "Hiring result": "result",
  Projects: "projects",
  "Project workspace": "project-detail",
  "Post project": "post-project",
  Team: "team",
  Profile: "profile",
  Settings: "settings",
};
