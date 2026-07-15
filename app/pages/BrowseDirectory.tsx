"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { companyProfiles, type PublicCompanyProfile } from "@/lib/companyProfileData";
import CompanyLogo from "@/components/CompanyLogo";
import { getWorkAnimal } from "@/lib/workAnimals";
import PublicUniversityProfile from "../university/PublicUniversityProfile";
import { defaultUniversityProfile, type UniversityProfileData } from "../university/universityProfileData";

type DirectoryKind = "university" | "employer";
type Tier = "Platinum" | "Gold" | "Silver";
type AffiliationRelation = "Current student" | "Alumni" | "Current employee" | "Past employee";

type CompareOpportunity = {
  id: string;
  kind: DirectoryKind;
  name: string;
  initials: string;
  logoTone?: string;
  tier: Tier;
  type: string;
  location: string;
  audience: string;
  relation?: AffiliationRelation;
  strength: string;
  bestFor: string;
  matchType: string;
  fit: number;
  network: number;
  growth: number;
  access: number;
  rolePath: string;
  gap: string;
  nextMove: string;
  evidence: string;
  aiVerdict: string;
};

type PlannerSetup = {
  focus: string;
  timeline: string;
  studyPath?: string;
};

type RoadmapStep = {
  time: string;
  title: string;
  action: string;
  output: string;
  evidence: string;
};

type SupportCard = {
  title: string;
  summary: string;
  how: string[];
  prepare: string[];
  examples?: string[];
  aidOptions?: {
    name: string;
    eligibility: string;
    support: string;
    prepare: string;
    timing: string;
  }[];
};

type ConnectionLead = {
  name: string;
  relationship: string;
  currentRole: string;
  relevance: string;
  suggestedAsk: string;
};

type TargetGuide = {
  benchmarkSignals: string[];
  mySignals: string[];
  preparationPlan: RoadmapStep[];
  evidenceProjects: [string, string][];
  supportPlan: SupportCard[];
  connectionLeads: ConnectionLead[];
};

const tierRank: Record<Tier, number> = {
  Platinum: 0,
  Gold: 1,
  Silver: 2,
};

const tierStyles: Record<Tier, string> = {
  Platinum: "border-[#F4BDC8] bg-[#FDE7EE] text-[#9B2335]",
  Gold: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  Silver: "border-[#e5e7eb] bg-[#f8fafc] text-[#475569]",
};

const universities: CompareOpportunity[] = [
  {
    id: "taylors",
    kind: "university",
    name: "Taylor's University",
    initials: "T",
    logoTone: "taylors",
    tier: "Platinum",
    type: "Private University",
    location: "Subang Jaya, Malaysia",
    audience: "24,580 students",
    relation: "Current student",
    strength: "Graduate employability and industry projects",
    bestFor: "Business analytics, employer projects, and polished graduate readiness.",
    matchType: "Best balanced pathway",
    fit: 88,
    network: 94,
    growth: 86,
    access: 91,
    rolePath: "Data Analyst, Business Analyst, Product Operations",
    gap: "Add one dashboard case study with measurable business impact.",
    nextMove: "Compare alumni outcomes with employer partners before applying.",
    evidence: "382 employer partners, 74 industry projects, strong CareerOS verification.",
    aiVerdict: "Strongest overall network for a candidate who wants guided employability and industry exposure.",
  },
  {
    id: "apu",
    kind: "university",
    name: "Asia Pacific University",
    initials: "APU",
    logoTone: "apu",
    tier: "Gold",
    type: "Technology University",
    location: "Kuala Lumpur, Malaysia",
    audience: "13,200 students",
    relation: "Alumni",
    strength: "Computing, data, and digital business pathways",
    bestFor: "Technical depth, software/data roles, and digital business pathways.",
    matchType: "Best technical fit",
    fit: 92,
    network: 84,
    growth: 90,
    access: 86,
    rolePath: "Data Analyst, Software Analyst, AI Project Assistant",
    gap: "Show stronger internship evidence and one production-ready project.",
    nextMove: "Use alumni proof to target technical analyst pathways.",
    evidence: "Technology-led programmes, digital business pathways, computing talent pool.",
    aiVerdict: "Best match when the candidate wants a sharper technical identity and data-focused career path.",
  },
  {
    id: "harvard",
    kind: "university",
    name: "Harvard University",
    initials: "HU",
    logoTone: "harvard",
    tier: "Platinum",
    type: "Highly Selective University",
    location: "Cambridge, United States",
    audience: "Global applicant pool",
    strength: "Academic excellence, leadership evidence, research exposure, and distinctive personal story",
    bestFor: "A highly ambitious candidate targeting elite academic preparation and global networks.",
    matchType: "Highly selective target",
    fit: 63,
    network: 92,
    growth: 98,
    access: 42,
    rolePath: "Research pathway, global leadership track, selective graduate opportunities",
    gap: "Build a distinctive academic story with research evidence, leadership impact, and stronger recommendation signals.",
    nextMove: "Create a 12-month evidence plan around research, leadership, essays, and mentor recommendations.",
    evidence: "Prototype benchmark: admitted profiles usually show exceptional academics, initiative, leadership, and a clear personal narrative.",
    aiVerdict: "Highest aspiration target. CareerOS would treat this as a long preparation journey, not a simple application choice.",
  },
  {
    id: "sunway",
    kind: "university",
    name: "Sunway University",
    initials: "SU",
    logoTone: "sunway",
    tier: "Gold",
    type: "Research University",
    location: "Bandar Sunway, Malaysia",
    audience: "18,000 students",
    strength: "Business, analytics, and sustainability programmes",
    bestFor: "Research-backed analytics, sustainability, and business strategy.",
    matchType: "Best research-led option",
    fit: 79,
    network: 81,
    growth: 84,
    access: 78,
    rolePath: "Research Analyst, ESG Analyst, Business Analytics Associate",
    gap: "Add a business case study that connects analysis to strategic decisions.",
    nextMove: "Compare research strengths against your preferred industry.",
    evidence: "Research-backed learning, business analytics strength, sustainability focus.",
    aiVerdict: "A good option if the candidate wants broader business credibility rather than pure technical depth.",
  },
  {
    id: "swinburne",
    kind: "university",
    name: "Swinburne University of Technology Sarawak Campus",
    initials: "SUTS",
    logoTone: "swinburne",
    tier: "Gold",
    type: "International Branch Campus",
    location: "Kuching, Sarawak",
    audience: "14,000+ students",
    strength: "Australian-linked engineering, computing, business, and design pathways in Sarawak",
    bestFor: "Engineering, computing, and international branch campus exposure.",
    matchType: "Regional growth pathway",
    fit: 77,
    network: 76,
    growth: 82,
    access: 80,
    rolePath: "Engineering Analyst, Systems Analyst, Business Technology Associate",
    gap: "Add one cross-functional technical project with team delivery evidence.",
    nextMove: "Compare regional employer access against KL-based pathways.",
    evidence: "Australian-linked campus, engineering and computing pathways, Sarawak talent pipeline.",
    aiVerdict: "Useful for a candidate who wants technical credibility with regional employer access.",
  },
  {
    id: "inti",
    kind: "university",
    name: "INTI International University",
    initials: "INTI",
    logoTone: "inti",
    tier: "Silver",
    type: "International University",
    location: "Nilai, Malaysia",
    audience: "12,500 students",
    strength: "Practical career readiness and employer-linked learning",
    bestFor: "Practical learning, international exposure, and broad entry pathways.",
    matchType: "Accessible starter pathway",
    fit: 74,
    network: 72,
    growth: 76,
    access: 88,
    rolePath: "Graduate Trainee, Business Associate, Junior Analyst",
    gap: "Build stronger portfolio proof to compete with higher-signal institutions.",
    nextMove: "Use accessible programmes to build evidence faster.",
    evidence: "Career readiness, employer-linked learning, international student community.",
    aiVerdict: "Best if accessibility matters more than prestige or a specialised technical pipeline.",
  },
];

const employers: CompareOpportunity[] = [
  ...Object.values(companyProfiles).map((company, index): CompareOpportunity => ({
    id: company.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    kind: "employer" as DirectoryKind,
    name: company.name,
    initials: company.initials,
    tier: company.tier,
    type: company.industry,
    location: company.location,
    audience: company.size,
    strength: company.description,
    bestFor: index === 0 ? "Structured analytics roles and stable graduate growth." : "Commercial problem solving and portfolio-backed early-career roles.",
    matchType: index === 0 ? "Best immediate fit" : "Strong practical match",
    fit: index === 0 ? 88 : 82,
    network: index === 0 ? 86 : 78,
    growth: index === 0 ? 84 : 81,
    access: index === 0 ? 87 : 83,
    rolePath: index === 0 ? "Data Analyst, Banking Analyst, Product Analyst" : "Business Analyst, Operations Analyst, Growth Associate",
    gap: index === 0 ? "Add SQL dashboard evidence and finance-domain analysis." : "Add a concise case study that shows measurable operating impact.",
    nextMove: index === 0 ? "Prioritise applications after strengthening data storytelling." : "Ask AI Coach to tailor your portfolio to this company.",
    evidence: company.description,
    aiVerdict: index === 0 ? "Best near-term fit for a candidate who wants structured growth and stable hiring signals." : "Relevant if the candidate wants practical responsibility and faster project exposure.",
  })),
  {
      id: "microsoft",
      kind: "employer",
      name: "Microsoft",
      initials: "MS",
      tier: "Platinum",
      type: "Cloud and AI",
      location: "Malaysia",
      audience: "10,000+ employees",
      strength: "Enterprise cloud, AI engineering, and digital transformation roles.",
      bestFor: "Ambitious cloud, AI, and enterprise technology careers.",
      matchType: "Long-term stretch",
      fit: 74,
      network: 91,
      growth: 96,
      access: 68,
      rolePath: "Cloud Associate, AI Project Analyst, Technical Consultant",
      gap: "Add cloud deployment evidence and one AI implementation project.",
      nextMove: "Treat as a long-term target while building technical proof.",
      evidence: "Enterprise cloud, AI engineering, and regional digital transformation work.",
      aiVerdict: "Highest long-term ceiling, but the candidate needs stronger technical evidence before it becomes realistic.",
    },
    {
      id: "grab",
      kind: "employer",
      name: "Grab",
      initials: "GR",
      tier: "Silver",
      type: "Mobility and super app",
      location: "Kuala Lumpur",
      audience: "9,000+ employees",
      relation: "Past employee",
      strength: "Data analytics, operations, and product impact in Southeast Asia.",
      bestFor: "Fast-moving product operations and marketplace analytics.",
      matchType: "Reachable stretch",
      fit: 83,
      network: 80,
      growth: 89,
      access: 78,
      rolePath: "Product Operations Analyst, Marketplace Analyst, Business Operations",
      gap: "Add a product analytics case study with experiment or funnel metrics.",
      nextMove: "Use your past relationship to target a focused return pathway.",
      evidence: "Past employee signal, operations context, analytics-friendly roles.",
      aiVerdict: "Strong growth option if the candidate can show product thinking and operating speed.",
    },
    {
      id: "maybank",
      kind: "employer",
      name: "Maybank",
      initials: "MY",
      tier: "Gold",
      type: "Banking",
      location: "Kuala Lumpur",
      audience: "40,000+ employees",
      relation: "Current employee",
      strength: "Finance, analytics, product, and customer operations pathways.",
      bestFor: "Stable analytics growth and credible business-domain experience.",
      matchType: "Best immediate fit",
      fit: 90,
      network: 86,
      growth: 84,
      access: 92,
      rolePath: "Data Analyst, Product Analyst, Customer Insights Analyst",
      gap: "Add a stronger SQL and dashboard artefact to your Living Portfolio.",
      nextMove: "Convert current employee status into internal mobility proof.",
      evidence: "Current employee signal, strong access, structured analytics roles.",
      aiVerdict: "Best immediate option because the candidate already has access and a credible domain pathway.",
    },
    {
      id: "shopee",
      kind: "employer",
      name: "Shopee",
      initials: "SP",
      tier: "Silver",
      type: "E-commerce",
      location: "Kuala Lumpur",
      audience: "Regional teams",
      strength: "Marketplace operations, product analytics, and growth roles.",
      bestFor: "Commercial analytics, marketplace operations, and fast execution.",
      matchType: "Growth stretch",
      fit: 81,
      network: 77,
      growth: 88,
      access: 75,
      rolePath: "Growth Analyst, Marketplace Analyst, Campaign Operations",
      gap: "Show campaign analysis or marketplace performance evidence.",
      nextMove: "Build one commercial analytics project before applying.",
      evidence: "Regional marketplace exposure and performance-driven roles.",
      aiVerdict: "Good growth option if the candidate wants commercial speed and can prove analytics impact.",
    },
];

function toDomainSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

function scoreAverage(item: CompareOpportunity) {
  return Math.round((item.fit + item.network + item.growth + item.access) / 4);
}

function getDefaultSetup(kind: DirectoryKind): PlannerSetup {
  return kind === "university"
    ? {
        focus: "",
        timeline: "Next intake",
        studyPath: "Explore first degree / college",
      }
    : {
        focus: "",
        timeline: "Apply in 2-3 months",
      };
}

const universityTimelineOptions = ["Next intake", "6-12 months", "More than 1 year"];
const employerTimelineOptions = ["Apply in 30 days", "Apply in 2-3 months", "Exploring for later"];
const universityStudyPathOptions = ["Explore first degree / college", "Start a new degree", "Pursue master's study"];

const universityCourseOptions: Record<string, string[]> = {
  taylors: ["Not sure yet - help me explore", "Business Analytics", "Computer Science", "Software Engineering", "International Business", "Mass Communication", "Culinary Arts"],
  apu: ["Not sure yet - help me explore", "Computer Science", "Data Science", "Cyber Security", "Artificial Intelligence", "Software Engineering", "Digital Business"],
  harvard: ["Not sure yet - help me explore", "Computer Science", "Economics", "Government", "Psychology", "Social Studies", "Master in Data Science", "MBA"],
  sunway: ["Not sure yet - help me explore", "Business Analytics", "Data Science", "Accounting and Finance", "Sustainable Development", "Psychology", "MBA"],
  swinburne: ["Not sure yet - help me explore", "Engineering", "Computer Science", "Information and Communication Technology", "Business", "Design", "Master of Information Technology"],
  inti: ["Not sure yet - help me explore", "Business", "Computer Science", "Mass Communication", "Psychology", "Hospitality Management", "MBA"],
};

const universityAidOptions: Record<string, SupportCard["aidOptions"]> = {
  taylors: [
    { name: "Taylor's Merit Scholarship", eligibility: "Strong academic results or high-achievement school record", support: "Partial tuition fee waiver", prepare: "Latest transcript, certificates, activity record, personal statement", timing: "Apply once offer letter or forecast results are available" },
    { name: "Taylor's Sports and Talent Award", eligibility: "State/national-level sport, creative, leadership, or competition achievement", support: "Partial tuition support", prepare: "Achievement proof, portfolio, coach/teacher letter, competition records", timing: "Submit before intake scholarship closing date" },
    { name: "PTPTN / education financing route", eligibility: "Malaysian students who meet programme and financing requirements", support: "Education loan for eligible programmes", prepare: "IC, offer letter, bank account, programme approval check", timing: "Prepare after accepting offer and confirming programme eligibility" },
  ],
  apu: [
    { name: "APU Merit Scholarship", eligibility: "High academic performance in SPM, IGCSE, A-Level, foundation, diploma, or equivalent", support: "Partial tuition fee waiver", prepare: "Academic transcript, certificates, offer letter, scholarship form", timing: "Apply before programme commencement" },
    { name: "APU Talent / Special Achievement Award", eligibility: "Evidence of leadership, competition, innovation, sport, or community achievement", support: "Partial fee support", prepare: "Achievement portfolio, certificates, recommendation note", timing: "Submit with admission or scholarship application" },
    { name: "PTPTN / instalment planning", eligibility: "Depends on nationality, programme approval, and financial profile", support: "Loan or staged payment planning", prepare: "Offer letter, programme details, family income documents", timing: "Check immediately after selecting programme" },
  ],
  harvard: [
    { name: "Need-based financial aid", eligibility: "Family financial need assessed through aid application", support: "Scholarship grant that can cover tuition, housing, meals, and fees depending on need", prepare: "Family income, tax/financial documents, aid forms, household details", timing: "Submit by the university financial aid deadline with the admission cycle" },
    { name: "External scholarship search", eligibility: "Depends on country, citizenship, discipline, leadership, or need", support: "External grant or sponsorship stacked with aid rules", prepare: "Scholarship essays, recommendation letters, activity record, proof of need or merit", timing: "Start 9-12 months before intended intake" },
    { name: "Campus work / student employment planning", eligibility: "Depends on visa, programme, and university work policies", support: "Part-time earning route for living expenses", prepare: "Work eligibility check, CV, schedule estimate", timing: "Plan after admission and visa guidance" },
  ],
  sunway: [
    { name: "Sunway Excellence Scholarship", eligibility: "Strong academic results in recognised entry qualifications", support: "Partial tuition fee waiver", prepare: "Transcript, certificates, offer letter, scholarship application", timing: "Apply during admission before intake deadline" },
    { name: "Sunway Sports / Talent Scholarship", eligibility: "Sports, leadership, performing arts, or competition achievement", support: "Partial tuition support", prepare: "Achievement evidence, portfolio, testimonial, competition record", timing: "Submit with scholarship cycle" },
    { name: "PTPTN / external foundation aid", eligibility: "Programme and applicant eligibility checks required", support: "Loan or external grant support", prepare: "Income proof, offer letter, programme approval, guarantor details if required", timing: "Check after course selection" },
  ],
  swinburne: [
    { name: "Swinburne Sarawak Entrance Grant", eligibility: "New students with qualifying academic results", support: "Entrance grant or partial fee support", prepare: "Academic transcript, offer letter, scholarship form", timing: "Apply before intake confirmation" },
    { name: "Swinburne Academic Excellence Scholarship", eligibility: "High-achieving foundation, diploma, undergraduate, or postgraduate applicants", support: "Partial tuition scholarship", prepare: "Transcript, certificates, CV for postgraduate applicants", timing: "Check scholarship closing date for selected intake" },
    { name: "Sarawak / external education funding", eligibility: "Often depends on residency, discipline, income, or sponsor criteria", support: "External scholarship, grant, or study loan", prepare: "Residency proof if needed, family income, offer letter, academic record", timing: "Shortlist before accepting offer" },
  ],
  inti: [
    { name: "INTI Merit Scholarship", eligibility: "Academic achievement based on entry qualification", support: "Partial tuition waiver", prepare: "Transcript, certificates, application form", timing: "Apply during admission" },
    { name: "INTI Leadership / Talent Award", eligibility: "Leadership, extracurricular, sport, or competition achievement", support: "Partial tuition support", prepare: "Activity record, certificates, testimonial", timing: "Submit before intake scholarship deadline" },
    { name: "PTPTN / payment plan support", eligibility: "Depends on programme approval and applicant financing profile", support: "Education loan or staged payment planning", prepare: "Offer letter, IC, income documents, programme eligibility check", timing: "Check after receiving offer" },
  ],
};

function getUniversityCourseOptions(item: CompareOpportunity | null) {
  if (!item || item.kind !== "university") return [];
  return universityCourseOptions[item.id] ?? ["Not sure yet - help me explore", "Business", "Computer Science", "Data Science", "Engineering", "Psychology", "MBA"];
}

function getUniversityAidOptions(item: CompareOpportunity) {
  return (
    universityAidOptions[item.id] ?? [
      { name: "Institution merit scholarship", eligibility: "Strong academic achievement or forecast results", support: "Partial tuition support", prepare: "Transcript, certificates, offer letter, scholarship form", timing: "Apply before intake scholarship deadline" },
      { name: "Need-based or hardship aid", eligibility: "Family income or financial need assessment", support: "Fee reduction, bursary, or emergency support depending on institution policy", prepare: "Income documents, household details, personal statement", timing: "Check once admission offer is available" },
      { name: "External scholarship or education loan", eligibility: "Depends on citizenship, programme, discipline, and sponsor rules", support: "External grant, sponsorship, or loan", prepare: "Offer letter, academic record, essays, recommender details", timing: "Start shortlisting 6-12 months before intake" },
    ]
  );
}

function getGuideContext(item: CompareOpportunity, setup: PlannerSetup) {
  const fallbackFocus =
    item.kind === "university"
      ? item.id === "harvard"
        ? "Economics, Computer Science, or Social Studies"
        : "Data Science / Business Analytics"
      : item.rolePath.split(",")[0];

  return {
    focus: setup.focus.trim() || fallbackFocus,
    timeline: setup.timeline,
    studyPath: setup.studyPath ?? "Explore first degree / college",
  };
}

function getConnectionLeads(item: CompareOpportunity, role: string): ConnectionLead[] {
  if (item.relation === "Current employee") {
    return [
      {
        name: "Alyssa Tan",
        relationship: "Current team collaborator",
        currentRole: `Senior ${role} at ${item.name}`,
        relevance: "Worked with you on internal reporting and can validate your business context.",
        suggestedAsk: "Ask for a 15-minute review of your internal mobility case before applying.",
      },
      {
        name: "Daniel Lim",
        relationship: "Manager-adjacent contact",
        currentRole: "Analytics hiring panel member",
        relevance: "Connected to the target department and can explain what the panel checks first.",
        suggestedAsk: "Ask what project evidence would make your transfer case stronger.",
      },
    ];
  }

  if (item.relation === "Past employee") {
    return [
      {
        name: "Mei Chen",
        relationship: "Former teammate",
        currentRole: `Operations lead at ${item.name}`,
        relevance: "Can compare your previous work habits with the current team expectations.",
        suggestedAsk: "Ask whether your new portfolio proof fits the current role better than your old experience.",
      },
      {
        name: "Ravi Kumar",
        relationship: "Former recruiter contact",
        currentRole: "Talent acquisition partner",
        relevance: "Can confirm whether the target role is open, frozen, or better approached through another team.",
        suggestedAsk: "Ask for role-fit advice first, then request referral only after proof is aligned.",
      },
    ];
  }

  return [
    {
      name: "Nur Aina",
      relationship: "University alumni connection",
      currentRole: `${role} associate at ${item.name}`,
      relevance: "Same university background and currently working in the target pathway.",
      suggestedAsk: "Ask which coursework or project helped most during screening.",
    },
    {
      name: "Jason Lee",
      relationship: "Second-degree connection through past internship mentor",
      currentRole: "Team member in adjacent department",
      relevance: "Not the exact role, but can identify the right recruiter or team contact.",
      suggestedAsk: "Ask for the best person to speak with and share one relevant project link.",
    },
  ];
}

function getScreeningPrep(role: string, employerName: string) {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole.includes("software") || normalizedRole.includes("engineer") || normalizedRole.includes("cloud") || normalizedRole.includes("ai")) {
    return {
      title: "Coding and technical screening",
      summary: `${employerName} may screen technical candidates with coding questions, debugging prompts, cloud fundamentals, or architecture discussion.`,
      how: [
        "Practise 20-30 LeetCode-style easy/medium problems focused on arrays, strings, hash maps, sorting, two pointers, and basic graphs",
        "Prepare one project deep dive where you explain architecture, trade-offs, bugs, and what you would improve",
        "Review role basics such as APIs, databases, authentication, cloud deployment, monitoring, and cost/security trade-offs",
      ],
      prepare: ["LeetCode practice log", "Project architecture diagram", "GitHub repo or demo", "2 technical deep-dive stories"],
      examples: ["For a cloud role: deploy a small app, explain compute/storage/database choices, estimate cost, and describe how you would secure it."],
    };
  }

  if (normalizedRole.includes("data") || normalizedRole.includes("analyst") || normalizedRole.includes("analytics")) {
    return {
      title: "SQL, analytics, and case screening",
      summary: `${employerName} may test whether you can turn raw data into a clear business decision, not just build charts.`,
      how: [
        "Practise SQL joins, grouping, filtering, window functions, and simple data cleaning",
        "Prepare one dashboard case with problem, metric choice, insight, recommendation, and business impact",
        "Practise explaining assumptions, data limitations, and how you would validate the result",
      ],
      prepare: ["SQL query set", "Dashboard screenshot", "Metric definition notes", "Business recommendation slide"],
      examples: ["For banking: segment customers and recommend retention action. For marketplace: analyse demand, conversion, cancellation, or campaign performance."],
    };
  }

  if (normalizedRole.includes("product") || normalizedRole.includes("business") || normalizedRole.includes("operations") || normalizedRole.includes("growth")) {
    return {
      title: "Case interview and take-home task",
      summary: `${employerName} may assess structured thinking through business cases, product metrics, prioritisation, or operational problem solving.`,
      how: [
        "Practise 3 business cases using problem, users, metric, root cause, options, recommendation, and risk",
        "Prepare one product or operations teardown related to the employer",
        "Practise prioritising trade-offs: impact, effort, cost, risk, and speed",
      ],
      prepare: ["Case notes", "Product or operations teardown", "Metric tree", "Recommendation slide"],
      examples: ["For Grab or Shopee: analyse drop-off in a funnel, propose 3 fixes, choose one metric, and explain why that action should come first."],
    };
  }

  return {
    title: "Role-specific screening prep",
    summary: `${employerName} may use a practical task, technical discussion, case interview, or portfolio review depending on the team.`,
    how: [
      "Extract screening clues from job posts and candidate profiles",
      "Practise one task that mirrors the role's daily work",
      "Prepare a project explanation with problem, action, result, and trade-off",
    ],
    prepare: ["Practice task", "Portfolio proof", "Interview story bank", "Follow-up questions"],
    examples: [`For ${role}, prepare one realistic work sample that shows how you think and what output you can produce.`],
  };
}

function getTargetGuide(item: CompareOpportunity, setup: PlannerSetup): TargetGuide {
  const context = getGuideContext(item, setup);

  if (item.kind === "university") {
    const eliteTarget = item.id === "harvard";
    const studyPath = context.studyPath;
    const exploringFirstDegree = studyPath === "Explore first degree / college";
    const pursuingMasters = studyPath === "Pursue master's study";
    const aidOptions = getUniversityAidOptions(item);
    const connectionLeads: ConnectionLead[] = [
      {
        name: "Sarah Wong",
        relationship: pursuingMasters ? "Postgraduate alumni mentor" : item.relation === "Alumni" ? "Alumni mentor" : "Senior student connection",
        currentRole: pursuingMasters ? `${context.focus} master's graduate` : `${context.focus} student ambassador`,
        relevance: pursuingMasters
          ? `Can explain how master's applicants positioned academic background, research interest, and work experience for ${context.focus}.`
          : `Connected through CareerOS education network and can explain how students in ${context.focus} prepared their application.`,
        suggestedAsk: pursuingMasters
          ? "Ask which research direction, supervisor fit, and academic evidence mattered most."
          : "Ask which subjects, portfolio evidence, modules, and admission documents mattered most.",
      },
      {
        name: "Amir Hakim",
        relationship: exploringFirstDegree ? "Previous school senior" : "Programme peer connection",
        currentRole: `Current student at ${item.name}`,
        relevance: exploringFirstDegree
          ? "Shares a similar school background and can explain subject choice, campus transition, costs, and beginner support."
          : "Can explain workload, module difficulty, admission documents, and student support from inside the programme.",
        suggestedAsk: exploringFirstDegree
          ? "Ask how they chose their course, what they wish they knew at 16-18, and which subjects helped."
          : "Ask for realistic advice on workload, scholarship timing, and first-semester preparation.",
      },
    ];
    const supportPlan: SupportCard[] = [
      ...(exploringFirstDegree
        ? [
            {
              title: "Interest discovery",
              summary: "CareerOS should not assume a young or new applicant already knows the correct course. It starts by matching interests, school subjects, activities, and early strengths.",
              how: ["List favourite school subjects and activities", "Compare them with 3 possible course families", "Review beginner-friendly student profiles from this institution", "Mark courses as explore, shortlist, or avoid"],
              prepare: ["Interest notes", "School subject results", "Activities or competitions", "Questions for counsellor or senior student"],
              examples: ["If the user likes maths and problem solving, compare Data Science, Computer Science, Actuarial Science, and Business Analytics before choosing one."],
            },
          ]
        : []),
      {
        title: pursuingMasters ? "Postgraduate entry fit" : "Admission requirements",
        summary: pursuingMasters
          ? `CareerOS compares degree background, CGPA, work evidence, research interest, and references against master's profiles in ${context.focus} at ${item.name}.`
          : `CareerOS compares your stored transcript, certificates, and profile signals against profiles already studying ${context.focus} at ${item.name}.`,
        how: pursuingMasters
          ? ["Check degree background, CGPA, English requirement, research or work prerequisites", "Map missing academic or professional evidence", "Identify whether coursework, research, or mixed master's route fits better"]
          : ["Check entry grades and English requirements", "Map missing subject prerequisites", "Mark documents as ready, missing, or needs verification"],
        prepare: pursuingMasters
          ? ["Bachelor transcript", "CV", "Statement of purpose", "Research interest paragraph", "Academic or employer references"]
          : ["Latest transcript", "Certificate scans", "Personal statement draft", "Verified education record"],
        examples: pursuingMasters
          ? ["If applying for MSc Data Science from a business degree, prepare Python/statistics proof and explain why the transition is realistic."]
          : ["If math is required for Data Science, add a statistics course certificate or project using regression."],
      },
      {
        title: pursuingMasters ? "Academic and professional evidence" : "Portfolio enhancement",
        summary: pursuingMasters
          ? "The system decides whether to strengthen an existing work/project artefact or create research-oriented proof for postgraduate admission."
          : "The system decides whether to enhance an existing artefact or create a beginner-friendly one based on how much profile evidence exists.",
        how: pursuingMasters
          ? ["Reuse thesis, work project, publication, capstone, or professional case", "Add research question, method, result, limitation, and future direction", "Connect evidence to target modules or supervisor interests"]
          : ["If profile is empty, start with a small guided project", "If profile has evidence, improve screenshots, method, tools, and outcome", "Link the project to specific modules in the course"],
        prepare: pursuingMasters
          ? ["Research summary", "CV evidence section", "Writing sample or portfolio", "Supervisor-fit notes"]
          : ["One beginner project or polished case study", "Project reflection", "Teacher, counsellor, or mentor feedback"],
        examples: pursuingMasters
          ? [`For ${context.focus}, prepare a 2-page research proposal or professional case study showing problem, method, result, and why this master's fits.`]
          : [`For ${context.focus}, prepare a mini research report, dashboard, campaign case, prototype, or analysis notebook.`],
      },
      {
        title: "Financial aid and tuition support",
        summary: `CareerOS shows concrete aid routes connected to ${item.name}, then helps the candidate prepare the right documents for each route.`,
        how: ["Compare merit, need-based, talent, loan, and external funding routes", "Match each aid route to academic results, income profile, achievements, and study pathway", "Track aid deadline beside admission deadline so funding is not prepared too late"],
        prepare: ["Income documents", "Budget sheet", "Scholarship essay", "Academic awards", "Recommender list", "Offer letter or forecast results"],
        examples: ["Prepare one essay version for merit and one version explaining need, contribution, and backup funding plan."],
        aidOptions,
      },
      {
        title: "Interview or essay readiness",
        summary: `CareerOS compares successful ${context.focus} student profiles to help the candidate explain motivation, fit, and readiness with evidence instead of generic achievements.`,
        how: [
          "Write one academic-fit story: what sparked the interest, what subject or project proves it, and which module at this university connects to it",
          "Write one growth story: a challenge, what changed, what skill improved, and how that prepares the candidate for university study",
          "Write one contribution story: what the candidate can bring to class, clubs, research, community, or industry projects",
          "For interviews, practise each answer in 60-90 seconds using context, action, result, reflection, and link to the programme",
          "For essays, turn the same stories into 3 paragraphs: motivation, evidence, and why this institution",
        ],
        prepare: [
          "Academic-fit paragraph",
          "Challenge and growth paragraph",
          "Contribution paragraph",
          `2 specific ${item.name} modules, labs, clubs, projects, or career outcomes`,
          "3 questions to ask admissions or student ambassador",
        ],
        examples: [
          `Weak: I want ${context.focus} because it has good career prospects.`,
          `Stronger: My interest in ${context.focus} started when I built or explored [specific evidence]. At ${item.name}, I want to connect this to [specific module/opportunity], then build toward [career or impact goal].`,
          "Interview answer structure: interest -> evidence -> lesson -> why this university -> what I will do next.",
        ],
      },
      {
        title: "Backup and pathway routes",
        summary: "The guide keeps the main target, but also protects the candidate from one-route risk.",
        how: ["Compare two lower-cost alternatives", "Check credit transfer, foundation, diploma, or twinning routes", "Prepare the same portfolio pack for all applications"],
        prepare: ["Alternative programme list", "Deadline tracker", "Transfer requirement notes"],
      },
    ];

    return {
      benchmarkSignals: eliteTarget
        ? [
            `Strong admits show unusual initiative inside ${context.focus}, not only high grades.`,
            "They usually have research, competition, leadership, or social impact proof.",
            "Their story links academic choice, personal motivation, and future contribution.",
          ]
        : [
            `Strong candidates show projects or activities linked to ${context.focus}.`,
            "They connect coursework with practical career outcomes.",
            "They can explain why this institution fits their next step.",
          ],
      mySignals: eliteTarget
        ? [
            `Your ${context.focus} direction needs a sharper admission story.`,
            "Your portfolio needs one standout proof item with external validation.",
            "Funding, recommendation, and leadership signals should be prepared together.",
          ]
        : [
            `Your ${context.focus} interest is relevant, but the proof needs to be clearer.`,
            "You need more institution-specific motivation and portfolio evidence.",
            "You should prepare admission evidence, financial options, and backup routes together.",
          ],
      preparationPlan: eliteTarget
        ? [
            { time: "Month 1-3", title: pursuingMasters ? "Define postgraduate direction" : exploringFirstDegree ? "Discover academic direction" : "Build the academic story", action: pursuingMasters ? `Choose one ${context.focus} research or professional problem.` : exploringFirstDegree ? "Compare interests, subjects, activities, and beginner course families before choosing a degree." : `Pick one ${context.focus} theme with personal meaning.`, output: pursuingMasters ? "Research-interest note plus 5 academic or industry sources." : exploringFirstDegree ? "Shortlist of 3 suitable course families with reasons." : "1-page problem statement plus 5 credible sources.", evidence: pursuingMasters ? "Research note, CV gap list, supervisor-fit notes." : exploringFirstDegree ? "Interest map, subject match, counsellor questions." : "Reflection, reading notes, and mentor feedback." },
            { time: "Month 4-6", title: pursuingMasters ? "Create postgraduate proof" : "Create standout proof", action: pursuingMasters ? "Build a research proposal, writing sample, capstone extension, or professional case study." : "Complete one substantial research, data, impact, or prototype project.", output: "Clear method, result, screenshots, and measurable outcome.", evidence: pursuingMasters ? "Proposal draft, CV evidence, reference talking points." : "Portfolio case study with external review." },
            { time: "Month 7-9", title: "Strengthen validation", action: pursuingMasters ? "Ask lecturer, supervisor, manager, or industry reviewer to critique the proposal." : "Ask a teacher, mentor, or reviewer to critique the work.", output: "Revised evidence and recommendation talking points.", evidence: "Feedback note, revision log, testimonial." },
            { time: "Month 10-12", title: "Package application", action: pursuingMasters ? "Prepare SOP, CV, references, transcript, proposal, and funding options." : "Convert proof into essays, activities, portfolio links, and interview stories.", output: "Complete application narrative.", evidence: "Final checklist for admission and funding if needed." },
          ]
        : [
            { time: "Stage 1", title: exploringFirstDegree ? "Discover suitable courses" : pursuingMasters ? "Confirm master's fit" : "Confirm programme fit", action: exploringFirstDegree ? "Compare interests, school subjects, career ideas, entry routes, fees, and student profiles." : pursuingMasters ? `Compare ${context.focus} master's modules, supervisor or project fit, entry requirements, fees, and career outcomes.` : `Compare ${context.focus} modules, entry requirements, fees, and graduate outcomes.`, output: exploringFirstDegree ? "3-course shortlist with why, risk, cost, and next subject to strengthen." : "Target-fit note with 3 reasons to apply.", evidence: exploringFirstDegree ? "Interest map and subject-to-course match." : "Requirement checklist and module match." },
            { time: "Stage 2", title: pursuingMasters ? "Build postgraduate proof" : "Build missing proof", action: pursuingMasters ? "Enhance thesis, work project, research idea, or professional case into admission evidence." : `Create one ${context.focus} project aligned to the course.`, output: pursuingMasters ? "SOP evidence paragraph plus research/professional proof." : "Working artefact, screenshots, and short explanation.", evidence: pursuingMasters ? "CV, research summary, writing sample, reference notes." : "Portfolio case study linked to the programme." },
            { time: "Stage 3", title: "Prepare support documents", action: pursuingMasters ? "Collect transcript, CV, SOP, references, proposal if needed, scholarship and backup-route documents." : "Collect admission, scholarship, and backup-route documents together.", output: pursuingMasters ? "Postgraduate application pack plus funding tracker." : "Application pack plus funding tracker.", evidence: pursuingMasters ? "Bachelor transcript, CV, SOP, references, income proof if needed." : "Transcript, certificates, income proof if needed, essay drafts, recommender list." },
            { time: "Stage 4", title: "Final readiness review", action: "Ask AI Coach to check gaps before submission.", output: "Final edits for motivation, portfolio, funding, and requirements.", evidence: "Submission checklist and next-step reminders." },
          ],
      evidenceProjects: eliteTarget
        ? [
            [`${context.focus} research or impact project`, "6-10 page write-up with question, method, findings, limitation, and reflection."],
            ["Leadership proof", "Initiative record with objective, team size, your role, result, and mentor feedback."],
            ["Scholarship and personal narrative", "Funding essay and portfolio page connecting need, merit, academic choices, project work, and future contribution."],
          ]
        : [
            [`${context.focus} project`, "Example: data dashboard, web app, business campaign case, research summary, or design prototype."],
            ["Target-fit brief", "One page explaining why this institution, which modules matter, and what proof you already have."],
            ["Application and aid pack", "Verified education history, deadline tracker, budget sheet, income documents if needed, project feedback, or teacher comment."],
          ],
      supportPlan,
      connectionLeads,
    };
  }

  const role = context.focus;
  const connectionLeads = getConnectionLeads(item, role);
  const screeningPrep = getScreeningPrep(role, item.name);
  const supportPlan: SupportCard[] = [
    {
      title: "Connection tracing",
      summary: `CareerOS checks your education, previous work, mentor, and second-degree graph for people connected to ${item.name}.`,
      how: ["Prioritise people with the closest relationship", "Ask for role-fit advice before asking for referral", "Send one relevant proof link so the contact has context"],
      prepare: ["Target role link", "1-paragraph background", "Best portfolio artefact", "Specific question"],
      examples: connectionLeads.map((lead) => `${lead.name}: ${lead.suggestedAsk}`),
    },
    {
      title: "Portfolio proof",
      summary: `CareerOS compares your current Living Portfolio with profiles working in ${role} roles at ${item.name}.`,
      how: ["Enhance an existing related project if it already shows the right tool", "Create a new proof project if no artefact mirrors the employer's work", "Place the strongest artefact first in resume and portfolio"],
      prepare: ["Problem statement", "Dataset or business context", "Tool stack", "Screenshots", "Measured result"],
      examples: [`For ${item.name}, build a ${role} case study with context, analysis, decision, and result metric.`],
    },
    {
      title: "Skill gap plan",
      summary: "The system identifies which skills are missing from your stored portfolio, then turns one gap into proof.",
      how: [`Extract repeated ${role} skills from job posts`, "Mark each skill as proven, weak, or missing", "Build a 14-day artefact for the highest-impact missing skill"],
      prepare: ["Skill checklist", "Mini task brief", "Before/after evidence", "Portfolio update"],
      examples: ["If SQL is weak, build 8 queries plus one dashboard. If cloud is weak, deploy a small app and document architecture."],
    },
    screeningPrep,
    {
      title: "Technical interview readiness",
      summary: "Interview prep should be role-specific, not just general confidence practice.",
      how: ["Practise technical explanation from your own project", "Prepare trade-off questions", "Prepare debugging, SQL, case, or product prompts depending on role", "Record one answer and improve clarity"],
      prepare: ["6 STAR stories", "2 technical deep dives", "Screening practice log", "Why this employer answer", "Questions for interviewer"],
      examples: [`For ${role}: explain data cleaning, API design, product metric choice, cloud architecture, or business analysis assumptions depending on the role.`],
    },
    {
      title: "Application and follow-up timing",
      summary: "The guide sequences proof, referral, application, and follow-up so the candidate does not apply before evidence is ready.",
      how: ["Finish proof before referral ask", "Send referral message 5-7 days before application", "Apply with tailored resume", "Follow up with a new proof update"],
      prepare: ["Application date", "Referral date", "Recruiter follow-up date", "Interview prep checkpoint"],
    },
  ];

  return {
    benchmarkSignals: [
      `People who get in usually show ${role} evidence before applying.`,
      "Strong profiles translate projects into business outcomes.",
      "They can explain why this employer and why this role with concrete proof.",
    ],
    mySignals: [
      `Your ${role} direction is relevant, but the employer-specific proof needs sharpening.`,
      "Your strongest evidence should be reframed around the target role pathway.",
      "You need warmer access, stronger role proof, and interview stories prepared before applying.",
    ],
    preparationPlan: [
      { time: "Week 1", title: "Decode hiring pattern", action: `Review 3 ${role} job posts and this employer's product or business model.`, output: "Repeated skills, tools, keywords, and business problems.", evidence: "Role requirement map." },
      { time: "Week 2-4", title: "Build matching proof", action: `Create one ${role} case study tied to ${item.name}.`, output: "Project with context, tool, decision, and measurable result.", evidence: "Portfolio case study and GitHub/demo/screenshots." },
      { time: "Week 5-6", title: "Tailor application", action: "Rewrite resume and Living Portfolio around the target role.", output: "Top 3 artefacts match the employer's work.", evidence: "Resume bullets with result metrics." },
      { time: "Week 7-8", title: "Prepare screening and interview", action: "Practise role-specific screening tasks, stories, and complete the support plan below.", output: "Screening practice log, interview answers, outreach, and skill-gap evidence.", evidence: "LeetCode/SQL/case log, story bank, mock feedback, and action tracker." },
    ],
    evidenceProjects: [
      [`${role} employer-style case`, `Example: for Grab, analyse marketplace demand; for Maybank, segment customers; for Microsoft, deploy a cloud AI demo.`],
      ["Role proof pack", "Problem, context, tools, screenshots, result metric, and decision supported."],
      ["Application story", `Why ${item.name}, why ${role}, and which evidence proves readiness.`],
    ],
    supportPlan,
    connectionLeads,
  };
}

function buildPublicUniversityProfile(item: CompareOpportunity): UniversityProfileData {
  if (item.name === defaultUniversityProfile.name) {
    return defaultUniversityProfile;
  }

  const domain = toDomainSlug(item.name) || "university";

  return {
    ...defaultUniversityProfile,
    name: item.name,
    type: item.type,
    country: "Malaysia",
    location: item.location,
    studentCountLabel: item.audience,
    tags: [`${item.tier} CareerOS Institution`, "Verified University", item.strength],
    mission: "Prepare future-ready graduates through purposeful learning, industry exposure and measurable career outcomes.",
    vision: "Be a recognised institution for employer collaboration, practical education and long-term graduate success.",
    employability: item.strength,
    industryCollaboration:
      "Connect academic programmes with employer needs through internships, live projects, portfolio evidence and graduate outcome tracking.",
    contacts: {
      careerOffice: `career@${domain}.edu.my`,
      industryOffice: `partners@${domain}.edu.my`,
      admissions: `admissions@${domain}.edu.my`,
      studentAffairs: `studentaffairs@${domain}.edu.my`,
    },
    socials: {
      website: `www.${domain}.edu.my`,
      linkedin: item.name,
      facebook: item.name,
      instagram: `@${domain}`,
      locationLink: "Google Maps",
    },
  };
}

function buildPublicEmployerProfile(item: CompareOpportunity): PublicCompanyProfile {
  const existingProfile = Object.values(companyProfiles).find(
    (company) => company.name.toLowerCase() === item.name.toLowerCase()
  );

  if (existingProfile) return existingProfile;

  const roleTitles = item.rolePath
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    slug: item.id,
    name: item.name,
    initials: item.initials,
    industry: item.type,
    location: item.location,
    size: item.audience,
    founded: item.id === "microsoft" ? "1975" : item.id === "grab" ? "2012" : item.id === "maybank" ? "1960" : "2015",
    tier: item.tier,
    verified: true,
    description: item.strength,
    mission: `Create strong ${item.rolePath.split(",")[0].toLowerCase()} pathways through practical work, team learning, and measurable candidate growth.`,
    hiringScore: item.fit,
    responseRate: item.access,
    averageReply: item.access >= 85 ? "2.0 days" : "3.4 days",
    hiredThroughCareerOS: Math.max(12, Math.round(item.network / 2)),
    interviewClarity: item.growth,
    teamTraits: [
      { slug: "owl", label: "Analytical decision makers", percent: 34 },
      { slug: "fox", label: "Strategic problem solvers", percent: 26 },
      { slug: "dolphin", label: "Collaborative communicators", percent: 22 },
      { slug: "ant", label: "Structured operators", percent: 18 },
    ],
    workStyle: [
      { label: "Decision pace", value: item.id === "grab" || item.id === "shopee" ? "Fast, experiment-led" : "Structured and evidence-led" },
      { label: "Communication", value: "Clear updates, concise proof, and direct follow-through" },
      { label: "Team rhythm", value: item.id === "microsoft" ? "Cross-functional planning and technical reviews" : "Weekly goals with role-specific checkpoints" },
      { label: "Best fit", value: item.bestFor },
    ],
    hiringProcess: [
      { step: "Profile screen", detail: "CareerOS Living Portfolio, role evidence, and target-fit signals are reviewed first." },
      { step: "Hiring conversation", detail: `A focused discussion on ${item.rolePath.split(",")[0].trim()} readiness, motivation, and team fit.` },
      { step: "Practical assessment", detail: getScreeningPrep(item.rolePath, item.name).summary },
      { step: "Decision and feedback", detail: "Candidate outcome and next-step guidance are shared after the hiring team review." },
    ],
    openRoles: roleTitles.map((role, index) => ({
      title: role,
      location: item.location,
      workMode: index === 0 ? "Hybrid" : "On-site / Hybrid",
      salary: index === 0 ? "Market-aligned graduate package" : "Depends on role and experience",
      match: Math.max(65, item.fit - index * 5),
    })),
    proofPoints: [
      item.evidence,
      item.aiVerdict,
      `CareerOS detected ${item.matchType.toLowerCase()} for candidates preparing for ${item.rolePath}.`,
    ],
  };
}

function getEmployerBannerImage(profile: PublicCompanyProfile) {
  if (profile.slug === "maybank" || profile.name.toLowerCase() === "maybank") {
    return "https://focusmalaysia.my/wp-content/uploads/WhatsApp-Image-2025-09-30-at-13.16.42.jpeg";
  }

  return "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80";
}

function UniversityLogo({ item, size = "md" }: { item: CompareOpportunity; size?: "sm" | "md" }) {
  const styles: Record<string, { background: string; color: string; border: string; label: string }> = {
    taylors: { background: "#ffffff", color: "#E00046", border: "#F5CBD6", label: "T" },
    apu: { background: "#162B75", color: "#ffffff", border: "#CBD5E1", label: "APU" },
    sunway: { background: "#E2231A", color: "#ffffff", border: "#FECACA", label: "SUN" },
    swinburne: { background: "#D71920", color: "#ffffff", border: "#FECACA", label: "SWIN" },
    inti: { background: "#004A98", color: "#ffffff", border: "#BFDBFE", label: "INTI" },
    harvard: { background: "#A51C30", color: "#ffffff", border: "#F5CBD6", label: "H" },
  };
  const config = styles[item.logoTone ?? "taylors"] ?? styles.taylors;
  const boxSize = size === "sm" ? "h-11 w-11 rounded-xl text-[11px]" : "h-14 w-14 rounded-2xl text-sm";

  return (
    <div
      className={`flex shrink-0 items-center justify-center border text-center font-black leading-none shadow-sm ${boxSize}`}
      style={{ background: config.background, color: config.color, borderColor: config.border }}
      aria-label={`${item.name} logo`}
      title={item.name}
    >
      {config.label}
    </div>
  );
}

function OpportunityLogo({ item, size = "md" }: { item: CompareOpportunity; size?: "sm" | "md" }) {
  if (item.kind === "university") return <UniversityLogo item={item} size={size} />;
  return <CompanyLogo company={item.name} size={size} />;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-bold text-[#46536D]">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-[#eef1f7]">
        <div className="h-full rounded-full bg-[#E00046]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function buildCoachPrompt(item: CompareOpportunity) {
  if (item.kind === "employer") {
    return `Tell me about ${item.name}. I want to prepare for ${item.rolePath}. Analyse my CareerOS profile against people who work there, show my connection/referral opportunities, screening prep, portfolio gaps, and what I should do next.`;
  }

  return `Tell me about ${item.name}. I want to prepare for ${item.rolePath}. Analyse my CareerOS profile against students who study there, show course fit, financial aid, application gaps, connection opportunities, and what I should do next.`;
}

function StatusBadges({ item }: { item: CompareOpportunity }) {
  return (
    <div className="flex max-w-full flex-wrap items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${tierStyles[item.tier]}`}>
        <Star size={12} fill="currentColor" />
        {item.tier}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
        <BadgeCheck size={12} />
        Verified
      </span>
      {item.relation ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F4BDC8] bg-[#FDE7EE] px-2.5 py-1 text-[11px] font-bold text-[#9B2335]">
          {item.relation}
        </span>
      ) : null}
    </div>
  );
}

function PublicEmployerProfile({
  profile,
  onBack,
}: {
  profile: PublicCompanyProfile;
  onBack: () => void;
}) {
  return (
    <main className="min-h-full rounded-[1.5rem] bg-[radial-gradient(circle_at_82%_0%,rgba(224,0,70,0.08),transparent_28rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xl font-extrabold tracking-normal text-black">
            Career<span className="text-[#f0185b]">OS</span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-[#e6e8f1] bg-white px-3.5 py-1.5 text-xs font-bold text-[#34415e] shadow-sm transition hover:bg-[#fff7fb]"
          >
            Back to Planner
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <section
            aria-label={`${profile.name} workplace`}
            role="img"
            className="relative h-56 overflow-hidden rounded-[24px] bg-[#eef0f6] bg-cover bg-center shadow-[0_20px_55px_rgba(15,23,42,0.1)] md:h-64"
            style={{ backgroundImage: `url(${getEmployerBannerImage(profile)})` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,27,0.03),rgba(8,12,27,0.42))]" />
          </section>

          <section className="overflow-hidden rounded-[24px] border border-[#e4e3fb] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.055)] md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <CompanyLogo company={profile.name} size="lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-extrabold tracking-normal text-[#070a17] md:text-3xl">{profile.name}</h1>
                  {profile.verified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eefcf4] px-3 py-1 text-xs font-bold text-[#15803d]">
                      <ShieldCheck size={14} />
                      Verified on CareerOS
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#4b5670]">
                  <span className="rounded-full bg-[#f4f5fa] px-3 py-1.5">{profile.industry}</span>
                  <span className="rounded-full bg-[#f4f5fa] px-3 py-1.5">{profile.size}</span>
                  <span className="rounded-full bg-[#f4f5fa] px-3 py-1.5">Founded {profile.founded}</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#f4f5fa] px-3 py-1.5">
                    <MapPin size={12} />
                    {profile.location}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    `${profile.tier} Employer`,
                    "Read-only Public Profile",
                    "Candidate Fit Insight",
                  ].map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-[#dedcff] bg-[#f7f5ff] px-3 py-1.5 text-xs font-bold text-[#5b21f3]">
                      <CheckCircle2 size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <EmployerStat icon={ShieldCheck} label="Hiring score" value={`${profile.hiringScore}%`} />
            <EmployerStat icon={MessageSquareText} label="Response rate" value={`${profile.responseRate}%`} />
            <EmployerStat icon={Clock3} label="Average reply" value={profile.averageReply} />
            <EmployerStat icon={BriefcaseBusiness} label="CareerOS hires" value={String(profile.hiredThroughCareerOS)} />
          </section>

          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <EmployerPanel title={`About ${profile.name}`}>
                <p className="text-sm font-medium leading-7 text-[#59657f]">
                  {profile.description}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Industry", profile.industry, Building2],
                    ["Location", profile.location, MapPin],
                    ["Company size", profile.size, Users],
                    ["Founded", profile.founded, Star],
                  ].map(([label, value, Icon]) => (
                    <div key={label as string} className="flex gap-3 rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff2f6] text-[#E00046]">
                        {typeof Icon === "function" ? <Icon size={18} /> : <Sparkles size={18} />}
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-[#53607b]">{label as string}</p>
                        <p className="mt-1 text-sm font-semibold leading-5 text-[#070a17]">{value as string}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-4">
                  <p className="text-sm font-extrabold text-[#070a17]">Mission</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#59657f]">{profile.mission}</p>
                </div>
              </EmployerPanel>

              <EmployerPanel title="Hiring Process">
                <div className="grid gap-3 md:grid-cols-2">
                  {profile.hiringProcess.map((item, index) => (
                    <div key={item.step} className="rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-4">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF2F6] text-xs font-black text-[#E00046]">
                        {index + 1}
                      </span>
                      <p className="mt-3 text-sm font-extrabold text-[#070a17]">{item.step}</p>
                      <p className="mt-2 text-xs font-medium leading-5 text-[#65718d]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </EmployerPanel>

              <EmployerPanel title="Open Roles">
                <div className="space-y-3">
                  {profile.openRoles.map((role) => (
                    <div key={role.title} className="grid gap-3 rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-4 md:grid-cols-[1fr_120px_132px] md:items-center">
                      <div>
                        <p className="text-sm font-extrabold text-[#070a17]">{role.title}</p>
                        <p className="mt-1 text-xs font-medium leading-5 text-[#65718d]">
                          {role.location} · {role.workMode} · {role.salary}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#FFF2F6] px-3 py-1.5 text-center text-xs font-bold text-[#E00046]">
                        {role.match}% match
                      </span>
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        title="Application is disabled in read-only browse profile"
                        className="h-10 cursor-not-allowed rounded-xl border border-[#e1e5ee] bg-[#eef1f7] px-3 text-xs font-bold text-[#8B95A7]"
                      >
                        Apply unavailable
                      </button>
                    </div>
                  ))}
                </div>
              </EmployerPanel>
            </div>

            <div className="space-y-5">
              <EmployerPanel title="Candidate Fit Insight">
                <div className="rounded-[18px] border border-[#f4d6df] bg-[#fff8fb] p-4">
                  <p className="text-lg font-extrabold text-[#070a17]">
                    Strong for analytical builders
                  </p>
                  <p className="mt-3 text-sm font-medium leading-6 text-[#59657f]">
                    Based on your CareerOS profile, this company looks strongest if you enjoy structured analysis,
                    stakeholder reporting, and turning data into product or business decisions.
                  </p>
                </div>
                <div className="mt-3 rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-4">
                  <p className="text-sm font-extrabold text-[#070a17]">Best preparation angle</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#59657f]">
                    Lead with dashboard evidence, SQL confidence, and one example where your analysis changed a decision.
                  </p>
                </div>
              </EmployerPanel>

              <EmployerPanel title="Team Work Style">
                <div className="space-y-3">
                  {profile.workStyle.map((item) => (
                    <div key={item.label} className="rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#53607b]">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold leading-5 text-[#070a17]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </EmployerPanel>

              <EmployerPanel title="Team Trait Mix">
                <div className="space-y-4">
                  {profile.teamTraits.map((trait) => {
                    const animal = getWorkAnimal(trait.slug);
                    return (
                      <div key={trait.slug}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#FFF2F6] text-xl">
                              {animal?.emoji ?? "•"}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-extrabold text-[#070a17]">{animal?.name ?? trait.slug}</p>
                              <p className="truncate text-xs font-medium text-[#65718d]">{trait.label}</p>
                            </div>
                          </div>
                          <span className="text-sm font-extrabold text-[#E00046]">{trait.percent}%</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF2F7]">
                          <div className="h-full rounded-full bg-[#E00046]" style={{ width: `${trait.percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </EmployerPanel>

              <EmployerPanel title="Company Proof">
                <ul className="space-y-3">
                  {profile.proofPoints.map((point) => (
                    <li key={point} className="flex gap-3 text-sm font-medium leading-6 text-[#59657f]">
                      <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#E00046]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </EmployerPanel>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function EmployerStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#e9eaf2] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.055)]">
      <Icon className="h-5 w-5 text-[#E00046]" />
      <p className="mt-3 text-xs font-extrabold text-[#53607b]">{label}</p>
      <p className="mt-1 text-2xl font-extrabold leading-none text-[#070a17]">{value}</p>
    </div>
  );
}

function EmployerPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-[#e9eaf2] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.055)] md:p-6">
      <h2 className="text-xl font-extrabold text-[#070a17]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function OpportunityCard({
  item,
  isTarget,
  onSetTarget,
  onViewProfile,
}: {
  item: CompareOpportunity;
  isTarget: boolean;
  onSetTarget: () => void;
  onViewProfile: () => void;
}) {
  const average = scoreAverage(item);

  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm transition ${isTarget ? "border-[#E00046] ring-4 ring-[#fde8ef]" : "border-[#E5E8F0] hover:border-[#F4BDC8]"}`}>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex min-w-0 gap-3">
          <OpportunityLogo item={item} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-extrabold leading-6 text-[#152238]">{item.name}</h3>
              {isTarget ? (
                <span className="inline-flex rounded-full bg-[#E00046] px-2.5 py-1 text-[11px] font-black text-white">
                  Selected target
                </span>
              ) : null}
            </div>
            <div className="mt-2">
              <StatusBadges item={item} />
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-[#46536D]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f5fa] px-3 py-1">
                <ShieldCheck size={13} />
                {item.type}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f5fa] px-3 py-1">
                <MapPin size={13} />
                {item.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f5fa] px-3 py-1">
                <Users size={13} />
                {item.audience}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
          <div className="rounded-xl bg-[#fff2f6] px-3 py-2 text-center sm:w-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B2335]">Readiness</p>
            <p className="text-lg font-black leading-none text-[#E00046]">{average}%</p>
          </div>
          <button
            type="button"
            onClick={onSetTarget}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition sm:w-32 ${
              isTarget
                ? "bg-[#FDE7EE] text-[#9B2335]"
                : "border border-[#E00046] bg-white text-[#E00046] hover:bg-[#FDE7EE]"
            }`}
          >
            <Target size={15} />
            {isTarget ? "Selected" : "Set target"}
          </button>
          <button
            type="button"
            onClick={onViewProfile}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E00046] px-4 text-xs font-bold text-white shadow-[0_14px_30px_rgba(224,0,70,0.18)] transition hover:bg-[#C7003E] sm:w-32"
          >
            View profile
            <ArrowRight size={15} />
          </button>
          <Link
            href={`/?view=ai-career-coach&coachSource=browse-directory&prompt=${encodeURIComponent(buildCoachPrompt(item))}`}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E5E8F0] bg-white px-4 text-xs font-bold text-[#34415e] transition hover:border-[#E00046] hover:text-[#E00046] sm:w-36"
          >
            Ask AI Coach
            <Sparkles size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BrowseDirectory({ kind }: { kind: DirectoryKind }) {
  const [query, setQuery] = useState("");
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [setupDraft, setSetupDraft] = useState<PlannerSetup>(() => getDefaultSetup(kind));
  const [guideSetup, setGuideSetup] = useState<PlannerSetup | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityProfileData | null>(null);
  const [selectedEmployer, setSelectedEmployer] = useState<PublicCompanyProfile | null>(null);
  const isUniversity = kind === "university";
  const items = isUniversity ? universities : employers;
  const activeTarget = activeTargetId ? items.find((item) => item.id === activeTargetId) ?? null : null;
  const targetGuide = activeTarget && guideSetup ? getTargetGuide(activeTarget, guideSetup) : null;
  const activeGuideSetup = guideSetup ?? setupDraft;
  const offeredCourses = isUniversity ? getUniversityCourseOptions(activeTarget) : [];
  const setupOptions = {
    timeline: isUniversity ? universityTimelineOptions : employerTimelineOptions,
  };
  const heroImage = isUniversity
    ? "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1800&q=80"
    : "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80";

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items
      .filter((item) => {
        if (!normalizedQuery) return true;
        return [item.name, item.type, item.location, item.tier, item.strength, item.bestFor, item.rolePath]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => scoreAverage(b) - scoreAverage(a) || tierRank[a.tier] - tierRank[b.tier] || a.name.localeCompare(b.name));
  }, [items, query]);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 text-[#152238] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <section className="relative overflow-hidden rounded-2xl border border-[#E5E8F0] bg-[#081433] shadow-sm">
          <div
            aria-label={isUniversity ? "University campus with students walking" : "People talking in a workspace"}
            role="img"
            className="absolute inset-0 bg-cover bg-center opacity-55"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081433] via-[#081433]/85 to-[#081433]/35" />
          <div className="relative grid min-h-[380px] gap-8 px-6 py-8 text-white md:grid-cols-[1fr_360px] md:items-end lg:px-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur-sm">
                <Target size={14} />
                Target readiness
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                {isUniversity ? "University Readiness Planner" : "Employer Readiness Planner"}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
                Select a target, review your current profile against successful candidates, and focus on the preparation steps that matter before applying.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/12 p-5 backdrop-blur-md">
              {activeTarget ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E00046] text-white">
                      <Sparkles size={22} />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">AI verdict</p>
                      <h2 className="text-lg font-extrabold text-white">{activeTarget.name}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium leading-6 text-white/78">
                    {activeTarget.aiVerdict}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-2 text-center">
                    {[
                      ["Readiness", `${scoreAverage(activeTarget)}%`],
                      ["Timeline", isUniversity ? "12 months" : "8 weeks"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-white/12 px-2 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">{label}</p>
                        <p className="mt-1 line-clamp-2 text-xs font-extrabold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E00046] text-white">
                      <Target size={22} />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Setup required</p>
                      <h2 className="text-lg font-extrabold text-white">Choose a target first</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium leading-6 text-white/78">
                    Select a {isUniversity ? "university" : "employer"} below to generate readiness, benchmark gaps, and preparation steps.
                  </p>
                  <div className="mt-5 space-y-2 text-xs font-bold text-white/80">
                    {["Select target", "Review benchmark", "Follow preparation plan"].map((step, index) => (
                      <div key={step} className="flex items-center gap-2 rounded-xl bg-white/12 px-3 py-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">{index + 1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#E5E8F0] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E00046]">
                Target directory
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#152238]">
                Choose a {isUniversity ? "university" : "employer"} to prepare for
              </h2>
            </div>
            <label className="relative block w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8499]" />
              <input
                type="search"
                placeholder={`Search ${isUniversity ? "universities" : "employers"}`}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full rounded-xl border border-[#E5E8F0] bg-white pl-11 pr-4 text-sm font-semibold text-[#172039] outline-none transition focus:border-[#E00046] focus:ring-2 focus:ring-[#fde8ef]"
              />
            </label>
          </div>

          <div className="mt-5 max-h-[560px] space-y-3 overflow-y-auto pr-2">
            {filteredItems.map((item) => (
              <OpportunityCard
                key={item.id}
                item={item}
                isTarget={activeTarget?.id === item.id}
                onSetTarget={() => {
                  setActiveTargetId(item.id);
                  setSetupDraft(getDefaultSetup(kind));
                  setGuideSetup(null);
                }}
                onViewProfile={() => {
                  if (item.kind === "university") {
                    setSelectedUniversity(buildPublicUniversityProfile(item));
                    return;
                  }
                  setSelectedEmployer(buildPublicEmployerProfile(item));
                }}
              />
            ))}
          </div>
        </section>

        {!activeTarget ? (
          <section className="mt-5 rounded-2xl border border-[#E5E8F0] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E00046]">
                  Start here
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#152238]">
                  Set up your readiness planner
                </h2>
              </div>
              <p className="max-w-2xl text-sm font-medium leading-6 text-[#46536D]">
                Choose the {isUniversity ? "university" : "employer"} you want to prepare for. CareerOS will show the readiness guide after a target is selected.
              </p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ["1", "Choose target", `Pick the ${isUniversity ? "institution" : "company"} you want to pursue.`],
                ["2", "Review benchmark", "Compare your profile with successful candidate patterns."],
                ["3", "Prepare evidence", "Follow focused benchmark gaps and next steps."],
              ].map(([number, title, detail]) => (
                <div key={title} className="rounded-2xl border border-[#eef1f7] bg-[#fbfcff] p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDE7EE] text-sm font-black text-[#9B2335]">
                    {number}
                  </span>
                  <h3 className="mt-4 text-sm font-extrabold text-[#152238]">{title}</h3>
                  <p className="mt-2 text-xs font-semibold leading-5 text-[#66738f]">{detail}</p>
                </div>
              ))}
            </div>
          </section>
        ) : !targetGuide ? (
          <section className="mt-5 rounded-2xl border border-[#E5E8F0] bg-white p-5 shadow-sm">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-[#eef1f7] bg-[#fbfcff] p-5">
                <div className="flex items-start gap-4">
                  <OpportunityLogo item={activeTarget} />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#E00046]">Selected target</p>
                    <h2 className="mt-1 text-2xl font-black leading-tight text-[#152238]">{activeTarget.name}</h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-[#46536D]">{activeTarget.bestFor}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-[#f1d5df] bg-white p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#E00046]">Before CareerOS generates the guide</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#34415e]">
                    Add your exact {isUniversity ? "study pathway, course interest, and intake timeline" : "role and application timeline"} so CareerOS can generate a complete plan across requirements, evidence, support, and next actions.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E8F0] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E00046]">
                  Step 2
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#152238]">
                  Define what you are preparing for
                </h2>

                <div className="mt-5 grid gap-4">
                  {isUniversity ? (
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#7A8499]">Study pathway</p>
                      <div className="mt-2 grid gap-2 md:grid-cols-3">
                        {universityStudyPathOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setSetupDraft((current) => ({ ...current, studyPath: option }))}
                            className={`rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${
                              setupDraft.studyPath === option
                                ? "border-[#E00046] bg-[#FDE7EE] text-[#9B2335]"
                                : "border-[#E5E8F0] bg-white text-[#46536D] hover:border-[#F4BDC8]"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {isUniversity ? (
                    <label className="block">
                      <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#7A8499]">
                        Course offered by {activeTarget.name}
                      </span>
                      <select
                        value={setupDraft.focus}
                        onChange={(event) => setSetupDraft((current) => ({ ...current, focus: event.target.value }))}
                        className="mt-2 h-12 w-full rounded-xl border border-[#E5E8F0] bg-white px-4 text-sm font-semibold text-[#172039] outline-none transition focus:border-[#E00046] focus:ring-2 focus:ring-[#fde8ef]"
                      >
                        <option value="">Select a course offered by this university</option>
                        {offeredCourses.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs font-semibold leading-5 text-[#66738f]">
                        These options represent programmes this university offers in the prototype data. Choose “Not sure yet” if the candidate needs interest discovery first.
                      </p>
                    </label>
                  ) : (
                    <label className="block">
                      <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#7A8499]">
                        Target role or department
                      </span>
                      <input
                        type="text"
                        value={setupDraft.focus}
                        onChange={(event) => setSetupDraft((current) => ({ ...current, focus: event.target.value }))}
                        placeholder="Example: Software Engineer, Data Analyst, Cloud Associate"
                        className="mt-2 h-12 w-full rounded-xl border border-[#E5E8F0] bg-white px-4 text-sm font-semibold text-[#172039] outline-none transition focus:border-[#E00046] focus:ring-2 focus:ring-[#fde8ef]"
                      />
                    </label>
                  )}

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#7A8499]">Timeline</p>
                    <div className="mt-2 grid gap-2 md:grid-cols-3">
                      {setupOptions.timeline.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSetupDraft((current) => ({ ...current, timeline: option }))}
                          className={`rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${
                            setupDraft.timeline === option
                              ? "border-[#E00046] bg-[#FDE7EE] text-[#9B2335]"
                              : "border-[#E5E8F0] bg-white text-[#46536D] hover:border-[#F4BDC8]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#eef1f7] bg-[#fbfcff] p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#7A8499]">
                      Guide will cover
                    </p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {(isUniversity
                        ? ["Interest discovery", "Entry requirements", "Portfolio or academic evidence", "Financial aid", "Interview or essay", "Master's pathway if relevant"]
                        : ["Role proof", "Referral connections", "Skill gaps", "Interview readiness", "Application timing", "Follow-up actions"]
                      ).map((item) => (
                        <div key={item} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#46536D]">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGuideSetup(setupDraft)}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#E00046] px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(224,0,70,0.18)] transition hover:bg-[#C7003E]"
                  >
                    Generate readiness guide
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
        <section className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-[#E5E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <OpportunityLogo item={activeTarget} />
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#E00046]">Selected target</p>
                <h2 className="mt-1 text-2xl font-black leading-tight text-[#152238]">{activeTarget.name}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-[#46536D]">{activeTarget.bestFor}</p>
                <div className="mt-3">
                  <StatusBadges item={activeTarget} />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ScoreBar label="Profile similarity" value={activeTarget.fit} />
              <ScoreBar label="Target benchmark" value={activeTarget.network} />
              <ScoreBar label="Access today" value={activeTarget.access} />
              <ScoreBar label="Growth value" value={activeTarget.growth} />
            </div>

            <div className="mt-5 rounded-2xl border border-[#f1d5df] bg-[#fff8fb] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#E00046]">AI preparation verdict</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#34415e]">{activeTarget.aiVerdict}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E00046]">
              Target benchmark
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#152238]">
              Successful candidates compared with your profile
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#eef1f7] bg-[#fbfcff] p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#7A8499]">
                  Successful profiles show
                </p>
                <div className="mt-4 space-y-3">
                  {targetGuide.benchmarkSignals.map((signal) => (
                    <div key={signal} className="flex gap-3 text-sm font-semibold leading-6 text-[#34415e]">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-[#f1d5df] bg-[#fff8fb] p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#E00046]">
                  Your current gaps
                </p>
                <div className="mt-4 space-y-3">
                  {targetGuide.mySignals.map((signal) => (
                    <div key={signal} className="flex gap-3 text-sm font-semibold leading-6 text-[#34415e]">
                      <Target className="mt-1 h-4 w-4 shrink-0 text-[#E00046]" />
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#E5E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E00046] text-white">
                <TrendingUp size={24} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#E00046]">Preparation roadmap</p>
                <h2 className="mt-1 text-2xl font-black text-[#152238]">
                  What to do before applying
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#66738f]">
                  Built for {isUniversity ? `${activeGuideSetup.studyPath ?? "Explore first degree / college"} - ` : ""}{activeGuideSetup.focus.trim() || (isUniversity ? "your selected course" : "your selected role")} - {activeGuideSetup.timeline}. CareerOS uses your stored portfolio, education, work history, and connection graph to decide what to enhance, add, or prepare next.
                </p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-[#f1d5df] bg-[#fff8fb] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#E00046]">AI analysis basis</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#34415e]">
                Guidance is based on patterns from profiles already studying at this institution or working at this employer, then compared against the candidate&apos;s current CareerOS portfolio records.
              </p>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {targetGuide.preparationPlan.map((step) => (
                <div key={`${step.time}-${step.title}`} className="grid gap-3 rounded-2xl border border-[#eef1f7] bg-[#fbfcff] p-4 sm:grid-cols-[110px_1fr]">
                  <span className="inline-flex h-9 items-center justify-center rounded-full bg-[#FDE7EE] px-3 text-xs font-black text-[#9B2335]">
                    {step.time}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-[#152238]">{step.title}</p>
                    <div className="mt-3 grid gap-2">
                      {[
                        ["Do", step.action],
                        ["Output", step.output],
                        ["Evidence", step.evidence],
                      ].map(([label, detail]) => (
                        <div key={label} className="grid gap-1 rounded-xl bg-white px-3 py-2 sm:grid-cols-[72px_1fr]">
                          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#E00046]">{label}</span>
                          <span className="text-xs font-semibold leading-5 text-[#46536D]">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-[#E5E8F0] bg-white p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#E00046]">
                Complete support coverage
              </p>
              <h3 className="mt-1 text-xl font-black text-[#152238]">
                Support plan for likely questions and blockers
              </h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {targetGuide.supportPlan.map((support) => (
                  <div key={support.title} className="rounded-2xl border border-[#eef1f7] bg-[#fbfcff] p-4">
                    <p className="text-sm font-extrabold text-[#152238]">{support.title}</p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-[#66738f]">{support.summary}</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl bg-white p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#E00046]">How to do it</p>
                        <ul className="mt-2 space-y-2">
                          {support.how.map((item) => (
                            <li key={item} className="flex gap-2 text-xs font-semibold leading-5 text-[#46536D]">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl bg-white p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#E00046]">Prepare exactly</p>
                        <ul className="mt-2 space-y-2">
                          {support.prepare.map((item) => (
                            <li key={item} className="flex gap-2 text-xs font-semibold leading-5 text-[#46536D]">
                              <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E00046]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {support.examples?.length ? (
                      <div className="mt-3 rounded-xl border border-[#f1d5df] bg-white p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9B2335]">Example</p>
                        <div className="mt-2 space-y-2">
                          {support.examples.map((example) => (
                            <p key={example} className="text-xs font-semibold leading-5 text-[#46536D]">{example}</p>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {support.aidOptions?.length ? (
                      <div className="mt-3 rounded-xl border border-[#f1d5df] bg-white p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9B2335]">Aid offered to check</p>
                        <div className="mt-3 grid gap-3">
                          {support.aidOptions.map((aid) => (
                            <div key={aid.name} className="rounded-xl bg-[#fff8fb] p-3">
                              <p className="text-xs font-black text-[#152238]">{aid.name}</p>
                              <div className="mt-2 grid gap-2 text-xs font-semibold leading-5 text-[#46536D] md:grid-cols-2">
                                <p><span className="font-black text-[#E00046]">Who it fits:</span> {aid.eligibility}</p>
                                <p><span className="font-black text-[#E00046]">Support:</span> {aid.support}</p>
                                <p><span className="font-black text-[#E00046]">Prepare:</span> {aid.prepare}</p>
                                <p><span className="font-black text-[#E00046]">Timing:</span> {aid.timing}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-[#E5E8F0] bg-white p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#E00046]">
                Connection trace
              </p>
              <h3 className="mt-1 text-xl font-black text-[#152238]">
                People CareerOS would suggest reaching out to
              </h3>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {targetGuide.connectionLeads.map((lead) => (
                  <div key={lead.name} className="rounded-2xl border border-[#eef1f7] bg-[#fbfcff] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold text-[#152238]">{lead.name}</p>
                        <p className="mt-1 text-xs font-bold text-[#E00046]">{lead.relationship}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#46536D]">
                        Traceable
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-bold leading-5 text-[#34415e]">{lead.currentRole}</p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-[#66738f]">{lead.relevance}</p>
                    <div className="mt-3 rounded-xl bg-white p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#E00046]">Suggested ask</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-[#46536D]">{lead.suggestedAsk}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-[#f1d5df] bg-[#fff8fb] p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#E00046]">Specific evidence to build</p>
              <h3 className="mt-1 text-xl font-black text-[#152238]">Projects and proof that would improve readiness</h3>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {targetGuide.evidenceProjects.map(([title, detail]) => (
                  <div key={title} className="rounded-2xl border border-[#f4d6df] bg-white p-4">
                    <p className="text-sm font-extrabold text-[#152238]">{title}</p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-[#66738f]">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
        </section>
          </>
        )}

        {selectedUniversity ? (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 p-2 sm:p-6">
            <PublicUniversityProfile
              profile={selectedUniversity}
              backLabel="Back to Planner"
              onBack={() => setSelectedUniversity(null)}
              className="min-h-full rounded-[1.5rem]"
            />
          </div>
        ) : null}
        {selectedEmployer ? (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 p-2 sm:p-6">
            <PublicEmployerProfile
              profile={selectedEmployer}
              onBack={() => setSelectedEmployer(null)}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
