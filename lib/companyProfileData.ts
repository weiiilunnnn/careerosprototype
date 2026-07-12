import type { WorkAnimalSlug } from "@/lib/workAnimals";

export type PublicCompanyProfile = {
  slug: string;
  name: string;
  initials: string;
  industry: string;
  location: string;
  size: string;
  founded: string;
  tier: "Silver" | "Gold" | "Platinum";
  verified: boolean;
  description: string;
  mission: string;
  hiringScore: number;
  responseRate: number;
  averageReply: string;
  hiredThroughCareerOS: number;
  interviewClarity: number;
  teamTraits: Array<{
    slug: WorkAnimalSlug;
    label: string;
    percent: number;
  }>;
  workStyle: Array<{
    label: string;
    value: string;
  }>;
  hiringProcess: Array<{
    step: string;
    detail: string;
  }>;
  openRoles: Array<{
    title: string;
    location: string;
    workMode: string;
    salary: string;
    match: number;
  }>;
  proofPoints: string[];
};

export const companyProfiles: Record<string, PublicCompanyProfile> = {
  "fintech-company": {
    slug: "fintech-company",
    name: "Fintech Company",
    initials: "FC",
    industry: "Fintech",
    location: "Kuala Lumpur",
    size: "101-250 employees",
    founded: "2018",
    tier: "Gold",
    verified: true,
    description:
      "A product-led fintech team building payment, reporting, and business intelligence tools for growing businesses in Southeast Asia.",
    mission:
      "Make financial operations clearer, faster, and more trustworthy for modern teams.",
    hiringScore: 88,
    responseRate: 91,
    averageReply: "2.1 days",
    hiredThroughCareerOS: 34,
    interviewClarity: 86,
    teamTraits: [
      { slug: "owl", label: "Analytical decision makers", percent: 32 },
      { slug: "ant", label: "Structured operators", percent: 26 },
      { slug: "dolphin", label: "Collaborative communicators", percent: 22 },
      { slug: "fox", label: "Strategic problem solvers", percent: 20 },
    ],
    workStyle: [
      { label: "Decision pace", value: "Measured, evidence-led" },
      { label: "Communication", value: "Structured updates and clear rationale" },
      { label: "Team rhythm", value: "Weekly planning, async documentation" },
      { label: "Best fit", value: "Candidates who turn analysis into business action" },
    ],
    hiringProcess: [
      { step: "Portfolio review", detail: "CareerOS Living Portfolio and project evidence are reviewed first." },
      { step: "Hiring manager screen", detail: "A 30-minute conversation about role scope, data problems, and team fit." },
      { step: "Practical task", detail: "Short dashboard or insight exercise using a realistic business scenario." },
      { step: "Final decision", detail: "Feedback and next-step decision usually happen within one week." },
    ],
    openRoles: [
      {
        title: "BI Analyst",
        location: "Kuala Lumpur",
        workMode: "Hybrid",
        salary: "RM4,000 - RM5,500",
        match: 81,
      },
      {
        title: "Product Analyst",
        location: "Kuala Lumpur",
        workMode: "Hybrid",
        salary: "RM5,000 - RM7,000",
        match: 74,
      },
    ],
    proofPoints: [
      "Verified company profile with active CareerOS hiring history.",
      "High response rate across recent candidate conversations.",
      "Strong evidence-based hiring process for analytics and product roles.",
    ],
  },
};

export function getCompanyProfile(slug = "fintech-company") {
  return companyProfiles[slug] ?? companyProfiles["fintech-company"];
}
