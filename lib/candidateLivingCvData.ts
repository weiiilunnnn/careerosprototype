import type { WorkAnimalSlug } from "@/lib/workAnimals";

export type CareerPathAlignment = {
  title: string;
  match: number;
  label?: string;
};

export type CandidateProjectEvidence = {
  title: string;
  type: string;
  date: string;
  description: string;
  tags: string[];
};

export type CandidateExperienceItem = {
  title: string;
  company: string;
  period: string;
  duration: string;
  description: string;
};

export type CandidateEducationItem = {
  institution: string;
  qualification: string;
  period: string;
  description: string;
};

export type CandidateCertificationItem = {
  name: string;
  issuer: string;
  date: string;
};

export type CandidatePortfolioLink = {
  label: string;
  url: string;
  description: string;
};

export type CandidateUploadItem = {
  label: string;
  fileName: string;
  status: "Uploaded" | "Verified" | "Pending";
};

export type CandidateLivingCv = {
  name: string;
  title: string;
  role: string;
  direction: string;
  trajectory: string;
  summary: string;
  experienceLabel: string;
  educationLabel: string;
  location: string;
  profileStrength: number;
  workAnimal?: WorkAnimalSlug;
  secondaryWorkAnimal?: WorkAnimalSlug;
  shadowWorkAnimal?: WorkAnimalSlug;
  workAnimalTestCompleted: boolean;
  careerPaths: CareerPathAlignment[];
  skills: {
    technical: string[];
    tools: string[];
    soft: string[];
  };
  projects: CandidateProjectEvidence[];
  experience: CandidateExperienceItem[];
  education: CandidateEducationItem[];
  certifications: CandidateCertificationItem[];
  portfolioLinks: CandidatePortfolioLink[];
  uploads: CandidateUploadItem[];
  employerEvidence: string[];
};

export const candidateLivingCv: CandidateLivingCv = {
  name: "Jason Tan",
  title: "Final Year Computer Science Student",
  role: "Aspiring Data Analyst",
  direction: "Data & Analytics Professional",
  trajectory: "Computer Science Student → Data Analyst → Business Intelligence Analyst",
  summary:
    "Analytics leaning computer science student with strong interest in data analysis, dashboard development, and business reporting. The portfolio reflects practical evidence from work experience, projects, certificates, and skills that support a future path in analytics.",
  experienceLabel: "1 year 5 months",
  educationLabel: "BSc Computer Science",
  location: "Kuala Lumpur",
  profileStrength: 82,
  workAnimal: "owl",
  secondaryWorkAnimal: "fox",
  shadowWorkAnimal: "peacock",
  workAnimalTestCompleted: true,
  careerPaths: [
    {
      title: "Data Analyst",
      match: 82,
      label: "Best Fit",
    },
    {
      title: "Business Intelligence Analyst",
      match: 76,
    },
    {
      title: "Data Scientist",
      match: 58,
    },
    {
      title: "Analytics Engineer",
      match: 45,
    },
  ],
  skills: {
    technical: [
      "Python",
      "SQL",
      "Data Analysis",
      "Power BI",
      "Excel",
      "Machine Learning",
    ],
    tools: ["Jupyter", "Tableau", "Power Query", "Google Sheets"],
    soft: ["Communication", "Problem Solving", "Critical Thinking", "Teamwork"],
  },
  projects: [
    {
      title: "Sales Performance Dashboard",
      type: "Featured Project",
      date: "May 2025",
      description:
        "Built a Power BI dashboard that visualizes regional sales trends and KPIs to support data driven business decisions.",
      tags: ["Power BI", "DAX", "Data Visualization"],
    },
    {
      title: "Customer Segmentation Analysis",
      type: "Analytics Project",
      date: "Feb 2025",
      description:
        "Analyzed customer data using Python and clustering techniques to identify high value customer segments.",
      tags: ["Python", "Pandas", "Scikit Learn"],
    },
    {
      title: "Hackathon Analytics Challenge",
      type: "Achievement",
      date: "Nov 2024",
      description:
        "Completed an analytics challenge by preparing insights from messy datasets and presenting findings to judges.",
      tags: ["Analytics", "Presentation", "Problem Solving"],
    },
  ],
  experience: [
    {
      title: "Junior Data Analyst Intern",
      company: "Grab",
      period: "Jun 2025 - Aug 2025",
      duration: "3 months",
      description:
        "Built dashboards and automated reports to monitor key business metrics.",
    },
    {
      title: "Business Intelligence Intern",
      company: "Maybank",
      period: "Jan 2025 - Apr 2025",
      duration: "4 months",
      description:
        "Supported data cleaning, analysis, and visualization for internal reporting.",
    },
  ],
  education: [
    {
      institution: "Asia Pacific University",
      qualification: "BSc Computer Science",
      period: "2023 - 2026",
      description:
        "Focused on data analytics, programming, databases, machine learning, and software development fundamentals.",
    },
  ],
  certifications: [
    {
      name: "Microsoft Power BI Data Analyst Fundamentals",
      issuer: "Microsoft Learn",
      date: "2025",
    },
    {
      name: "Python for Data Analysis",
      issuer: "Coursera",
      date: "2024",
    },
  ],
  portfolioLinks: [
    {
      label: "GitHub Portfolio",
      url: "github.com/jasontan-data",
      description: "Project repositories for dashboard, analytics, and machine learning work.",
    },
    {
      label: "Dashboard Case Study",
      url: "portfolio.jasontan.dev/sales-dashboard",
      description: "Evidence write-up for the Sales Performance Dashboard project.",
    },
  ],
  uploads: [
    {
      label: "Resume",
      fileName: "Jason_Tan_Resume.pdf",
      status: "Uploaded",
    },
    {
      label: "Certificates",
      fileName: "Jason_Tan_Certificates.pdf",
      status: "Verified",
    },
  ],
  employerEvidence: [
    "Living CV shows a clear analytics direction supported by dashboard, Python, SQL, and Power BI evidence.",
    "Projects and internship experience are aligned with data analyst and business intelligence responsibilities.",
    "Uploaded resume and certificate evidence are available for employer review in the prototype.",
  ],
};

export function createCandidateLivingCv(
  overrides: Partial<CandidateLivingCv> & Pick<CandidateLivingCv, "name" | "title" | "role" | "direction" | "trajectory" | "summary" | "location">
): CandidateLivingCv {
  return {
    ...candidateLivingCv,
    ...overrides,
    careerPaths: overrides.careerPaths ?? candidateLivingCv.careerPaths,
    skills: overrides.skills ?? candidateLivingCv.skills,
    projects: overrides.projects ?? candidateLivingCv.projects,
    experience: overrides.experience ?? candidateLivingCv.experience,
    education: overrides.education ?? candidateLivingCv.education,
    certifications: overrides.certifications ?? candidateLivingCv.certifications,
    portfolioLinks: overrides.portfolioLinks ?? candidateLivingCv.portfolioLinks,
    uploads: overrides.uploads ?? candidateLivingCv.uploads,
    employerEvidence: overrides.employerEvidence ?? candidateLivingCv.employerEvidence,
  };
}

export const candidateLivingCvById: Record<number, CandidateLivingCv> = {
  1: candidateLivingCv,
  2: createCandidateLivingCv({
    name: "Irfan Rahman",
    title: "Senior PM, HR Tech",
    role: "Senior Product Manager",
    direction: "AI Hiring Workflow Product Leader",
    trajectory: "HR Tech PM → AI Workflow Lead → Product Director",
    summary:
      "Product manager with experience building HR technology and AI assisted recruiter workflows. The Living CV highlights enterprise product delivery, workflow design, and measurable time-to-hire improvements.",
    location: "Singapore",
    experienceLabel: "6 years",
    educationLabel: "BSc Information Systems",
    workAnimal: "fox",
    skills: {
      technical: ["Product Strategy", "HR Tech", "AI Workflows", "Enterprise SaaS", "Analytics"],
      tools: ["Jira", "Figma", "Amplitude", "Looker"],
      soft: ["Stakeholder Management", "Leadership", "Communication", "Problem Solving"],
    },
    employerEvidence: [
      "Living CV shows strong HR technology and AI workflow experience.",
      "Enterprise product background aligns with structured recruiter and hiring operations.",
      "Relocation and compensation should be clarified before final panel.",
    ],
  }),
  3: createCandidateLivingCv({
    name: "Alya Hassan",
    title: "Growth Product Designer",
    role: "Growth Product Designer",
    direction: "Activation and Hiring Experience Designer",
    trajectory: "Product Designer → Growth Designer → Design Lead",
    summary:
      "Growth product designer focused on activation, design systems, and research-led hiring experiences. The Living CV shows portfolio evidence around candidate and recruiter workflow improvements.",
    location: "Kuala Lumpur",
    experienceLabel: "4 years",
    educationLabel: "BA Design",
    workAnimal: "peacock",
    skills: {
      technical: ["UX Research", "Activation", "Design Systems", "Prototyping", "Experimentation"],
      tools: ["Figma", "FigJam", "Maze", "Notion"],
      soft: ["User Empathy", "Presentation", "Collaboration", "Critical Thinking"],
    },
    employerEvidence: [
      "Living CV shows activation redesign evidence and strong workflow design thinking.",
      "Past shortlist history makes this candidate suitable for re-engagement.",
      "Portfolio evidence is aligned with candidate and recruiter experience design.",
    ],
  }),
  4: createCandidateLivingCv({
    name: "Daniel Ong",
    title: "Principal Product Manager",
    role: "Principal Product Manager",
    direction: "0-1 Product Discovery Leader",
    trajectory: "Product Manager → Principal PM → Product Strategy Lead",
    summary:
      "Principal product manager with strong discovery, product-led growth, and 0-1 product experience. The Living CV has strong written case studies, but some evidence is older and should be refreshed.",
    location: "Remote",
    experienceLabel: "9 years",
    educationLabel: "BBA Business Analytics",
    workAnimal: "eagle",
    skills: {
      technical: ["Product Discovery", "PLG", "0-1 Product", "Strategy", "User Research"],
      tools: ["Linear", "Figma", "Mixpanel", "Miro"],
      soft: ["Leadership", "Decision Making", "Storytelling", "Prioritisation"],
    },
    employerEvidence: [
      "Living CV shows strong discovery craft and written product case studies.",
      "Evidence is promising but less direct for regulated marketplace requirements.",
      "Availability looks strong, but portfolio freshness should be reviewed.",
    ],
  }),
};

export function getCandidateLivingCv(candidateId: number) {
  return candidateLivingCvById[candidateId] ?? candidateLivingCv;
}
