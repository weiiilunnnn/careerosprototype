import type { Candidate, Company, Job, Page, ScoringWeights } from "./types";

export function renderEmailTemplate(
  template: string,
  candidate: Candidate,
  stageType: string,
  sender: string,
  context?: {
    job?: Job;
    company?: Company;
    selectedSlot?: string;
    meetingLink?: string;
    startDate?: string;
    nextStep?: string;
    matchScore?: number;
  }
) {
  const firstName = candidate.name.split(" ")[0] ?? candidate.name;
  const companyName = context?.company?.name ?? "CareerOS";
  const roleTitle = context?.job?.title ?? "this role";
  const senderName = sender.replaceAll("{{company}}", companyName);

  return template
    .replaceAll("{{firstName}}", firstName)
    .replaceAll("{{candidateName}}", candidate.name)
    .replaceAll("{{role}}", roleTitle)
    .replaceAll("{{stageType}}", stageType)
    .replaceAll("{{sender}}", senderName)
    .replaceAll("{{company}}", companyName)
    .replaceAll("{{selectedSlot}}", context?.selectedSlot ?? "{{selectedSlot}}")
    .replaceAll("{{meetingLink}}", context?.meetingLink ?? "{{meetingLink}}")
    .replaceAll("{{startDate}}", context?.startDate ?? "{{startDate}}")
    .replaceAll("{{nextStep}}", context?.nextStep ?? "{{nextStep}}")
    .replaceAll("{{onboardingStep}}", context?.nextStep ?? "{{onboardingStep}}")
    .replaceAll("{{matchScore}}", context?.matchScore ? `${context.matchScore}%` : "{{matchScore}}");
}

export function candidateScore(
  candidate: Candidate,
  weights: ScoringWeights = { skill: 35, project: 30, experience: 20, trajectory: 15 }
) {
  const total = Math.max(
    1,
    weights.skill + weights.project + weights.experience + weights.trajectory
  );

  return Math.round(
    (candidate.skillFit * weights.skill +
      candidate.projectRelevance * weights.project +
      candidate.experience * weights.experience +
      candidate.trajectory * weights.trajectory) /
      total
  );
}

export function candidateLabels(candidate: Candidate, weights?: ScoringWeights) {
  const labels: string[] = [];

  if (candidate.stage === "Shortlisted") {
    labels.push("Shortlisted");
  } else if (candidate.stage === "Invited") {
    labels.push("Interview");
  } else if (candidate.stage === "Approached") {
    labels.push("Approached");
  } else if (candidate.stage === "Hired") {
    labels.push("Hired");
  } else if (candidate.stage === "Rejected") {
    labels.push("Not selected");
  } else {
    labels.push(candidate.source);
  }

  if (candidateScore(candidate, weights) >= 95) labels.push("High fit");

  return labels;
}

export function summarizeJob(jobId: number, candidates: Candidate[]) {
  const scoped = candidates.filter((candidate) => candidate.jobId === jobId);
  return {
    applicants: scoped.filter((candidate) => candidate.appliedToJob).length,
    shortlisted: scoped.filter((candidate) =>
      ["Shortlisted", "Invited", "Interview scheduled"].includes(candidate.stage)
    ).length,
    hired: scoped.filter((candidate) => candidate.stage === "Hired").length,
  };
}

export function getNextAction({
  hasCompany,
  jobs,
  candidates,
  invited,
  hiredCount,
}: {
  hasCompany: boolean;
  jobs: Job[];
  candidates: Candidate[];
  invited: boolean;
  hiredCount: number;
}): { label: string; page: Page; detail: string } {
  if (!hasCompany) {
    return { label: "Post your first job", page: "post-job", detail: "Post a role to unlock hiring." };
  }
  if (jobs.length === 0) {
    return { label: "Post your first job", page: "post-job", detail: "A job post opens the candidate pipeline." };
  }
  if (candidates.every((candidate) => candidate.stage !== "Shortlisted" && candidate.stage !== "Invited" && candidate.stage !== "Hired")) {
    return { label: "Review candidates", page: "candidates", detail: "Review applied and potential candidates, then build a shortlist." };
  }
  if (!invited) {
    return { label: "Send next-stage invitations", page: "shortlist", detail: "Shortlisted candidates are ready for interview or test invites." };
  }
  if (hiredCount === 0) {
    return { label: "Decide from shortlist", page: "shortlist", detail: "Interviewed candidates can be marked hired or not selected from the shortlist." };
  }
  return { label: "View hiring result", page: "result", detail: "Confirmed hires are recorded in the result page." };
}
