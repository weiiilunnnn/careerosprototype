"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Calculator,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Coffee,
  FileText,
  FileUser,
  FolderOpen,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  MessageSquareText,
  Mic,
  Palette,
  Pencil,
  PiggyBank,
  Plane,
  Plus,
  RefreshCcw,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Trash2,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const theme = {
  navy: "#081433",
  deepNavy: "#152238",
  muted: "#46536D",
  rose1: "#F04D7A",
  rose2: "#E00046",
  soft: "#FFF2F6",
  soft2: "#FDE7EE",
  line: "#F5CBD6",
  border: "#E5E8F0",
  page: "#fbfbfc",
} as const;

type NodeType = "career" | "life";
type ChapterKind = "goal" | "break";
type StartingPoint =
  | "Final Year Student"
  | "Fresh Graduate"
  | "Junior UX Designer"
  | "Junior Data Analyst"
  | "Marketing Executive";

type TimelineNode = {
  id: string;
  title: string;
  type: NodeType;
  time: string;
  subtitle: string;
  targetYear: number;
  chapterKind?: ChapterKind;
  durationMonths?: number;
  baseYear?: number;
  displayYear?: number;
  lifeGoalKey?: string;
  sourceLifeGoalKey?: string;
  sourceLifeGoalTitle?: string;
  retirementVisionKey?: "travel" | "family" | "business" | "hobbies";
  icon?: LucideIcon;
};

type RetirementRecommendationAction = "insert-goal";

type RetirementRecommendation = {
  id: string;
  title: string;
  summary: string;
  explanation: string;
  actionType: RetirementRecommendationAction;
  targetYear: number;
  durationMonths?: number;
  goalKey?: string;
  selected: boolean;
  applied: boolean;
  supports: string[];
  badge: string;
  sourceVision?: "travel" | "family" | "business" | "hobbies";
};

type CareerTemplate = {
  label: StartingPoint;
  nodes: TimelineNode[];
};

type LifeGoalOption = {
  key: string;
  title: string;
  icon: LucideIcon;
  chapterType: string;
  chapterKind: ChapterKind;
};

type ChapterPlan = {
  title: string;
  eyebrow: string;
  meaning: string;
  focusTitle: string;
  focus: string[];
  skillsTitle: string;
  skills: string[];
  evidenceTitle: string;
  evidence: string[];
  actionTitle: string;
  action: string;
  recommended?: string;
};

const startingOptions: StartingPoint[] = [
  "Final Year Student",
  "Fresh Graduate",
  "Junior UX Designer",
  "Junior Data Analyst",
  "Marketing Executive",
];

const careerTemplates: Record<StartingPoint, CareerTemplate> = {
  "Final Year Student": {
    label: "Final Year Student",
    nodes: [
      career("student", "Final Year Student", 0, "Building portfolio foundation"),
      career("junior-ux", "Junior UX Designer", 1, "First full-time design role"),
      career("ux", "UX Designer", 3, "Owns design tasks and user flows"),
      career("senior-ux", "Senior UX Designer", 7, "Leads product design decisions"),
      career("lead-ux", "Product Design Lead", 12, "Guides design strategy and team direction"),
    ],
  },
  "Fresh Graduate": {
    label: "Fresh Graduate",
    nodes: [
      career("fresh-grad", "Fresh Graduate", 0, "Choosing the first career platform"),
      career("junior-ux", "Junior UX Designer", 1, "First full-time design role"),
      career("ux", "UX Designer", 3, "Owns design tasks and user flows"),
      career("senior-ux", "Senior UX Designer", 7, "Leads product design decisions"),
      career("lead-ux", "Product Design Lead", 12, "Guides design strategy and team direction"),
    ],
  },
  "Junior UX Designer": {
    label: "Junior UX Designer",
    nodes: [
      career("junior-ux", "Junior UX Designer", 0, "First full-time design role"),
      career("ux", "UX Designer", 3, "Owns design tasks and user flows"),
      career("senior-ux", "Senior UX Designer", 7, "Leads product design decisions"),
      career("product-designer", "Product Designer II", 10, "Shapes product direction with evidence"),
      career("lead-ux", "Product Design Lead", 14, "Guides design strategy and team direction"),
    ],
  },
  "Junior Data Analyst": {
    label: "Junior Data Analyst",
    nodes: [
      career("fresh-grad", "Fresh Graduate", 0, "Building employability and tool confidence"),
      career("junior-data", "Junior Data Analyst", 1, "Learns reporting and business context"),
      career("data-analyst", "Data Analyst", 3, "Owns analysis and dashboard delivery"),
      career("senior-data", "Senior Data Analyst", 7, "Leads insight quality and stakeholder decisions"),
      career("analytics-lead", "Analytics Lead", 12, "Guides analytics strategy and team standards"),
    ],
  },
  "Marketing Executive": {
    label: "Marketing Executive",
    nodes: [
      career("marketing-exec", "Marketing Executive", 0, "Runs campaigns and learns audience signals"),
      career("digital-specialist", "Digital Marketing Specialist", 1, "Builds channel expertise and reporting habits"),
      career("growth-analyst", "Growth Marketing Analyst", 3, "Connects campaigns, data, and experiments"),
      career("marketing-manager", "Marketing Manager", 7, "Leads plans, budgets, and campaign teams"),
      career("head-growth", "Head of Growth", 12, "Owns growth strategy and business outcomes"),
    ],
  },
};

const lifeGoalOptions: LifeGoalOption[] = [
  { key: "emergency-savings", title: "Build emergency savings", icon: PiggyBank, chapterType: "Stability Goal", chapterKind: "goal" },
  { key: "family-planning", title: "Get married / family planning", icon: Home, chapterType: "Family Planning Goal", chapterKind: "goal" },
  { key: "investing", title: "Start investing", icon: TrendingUp, chapterType: "Financial Confidence Goal", chapterKind: "goal" },
  { key: "study-again", title: "Study again part-time", icon: GraduationCap, chapterType: "Upskilling Goal", chapterKind: "goal" },
  { key: "relocate", title: "Relocate overseas planning", icon: Plane, chapterType: "Relocation Goal", chapterKind: "goal" },
  { key: "hobbies", title: "Pursue hobbies casually", icon: Palette, chapterType: "Creative Identity Goal", chapterKind: "goal" },
  { key: "retirement", title: "Plan for retirement", icon: Landmark, chapterType: "Long-Range Planning Goal", chapterKind: "goal" },
  { key: "side-business", title: "Build side income while working", icon: Rocket, chapterType: "Side Income Goal", chapterKind: "goal" },
  { key: "buy-house", title: "Buy a house", icon: Home, chapterType: "Housing Goal", chapterKind: "goal" },
  { key: "health-break", title: "Health or burnout break", icon: HeartPulse, chapterType: "Recovery Break", chapterKind: "break" },
  { key: "family-emergency-break", title: "Family emergency break", icon: Users, chapterType: "Family Emergency Break", chapterKind: "break" },
  { key: "care-family", title: "Care for family", icon: Users, chapterType: "Caregiving Break", chapterKind: "break" },
  { key: "study-break", title: "Full-time study break", icon: GraduationCap, chapterType: "Study Break", chapterKind: "break" },
  { key: "business-break", title: "Start a business full-time", icon: Rocket, chapterType: "Business Break", chapterKind: "break" },
  { key: "career-break", title: "Take a 6-month career break", icon: Coffee, chapterType: "Career Break", chapterKind: "break" },
  { key: "sabbatical", title: "Sabbatical", icon: Coffee, chapterType: "Sabbatical Break", chapterKind: "break" },
  { key: "parental-break", title: "Maternity / paternity break", icon: Home, chapterType: "Parental Break", chapterKind: "break" },
  { key: "relocation-break", title: "Relocation break", icon: Plane, chapterType: "Relocation Break", chapterKind: "break" },
  { key: "recovery-period", title: "Recovery period", icon: HeartPulse, chapterType: "Recovery Break", chapterKind: "break" },
  { key: "return-work", title: "Return to work after a break", icon: RefreshCcw, chapterType: "Comeback Break", chapterKind: "break" },
];

const lifePlans: Record<string, Partial<ChapterPlan>> = {
  "study-again": {
    meaning: "Taking time to study may slow short-term job progression, but it can improve long-term specialisation and career mobility.",
    focus: ["Reduced full-time work experience during study period", "Possible income pause", "Skills may become outdated if not applied"],
    skills: ["Maintain one active portfolio project", "Choose study topics that connect to your target role", "Keep your Living Portfolio updated monthly"],
    evidence: ["Coursework project", "Certification", "Case study", "Reflection on new skills"],
    action: "Choose one study-related project and turn it into a portfolio case study.",
    recommended: "Flexible, hybrid, or learning-friendly roles.",
  },
  "emergency-savings": {
    meaning: "This chapter prioritises financial stability before taking career risks such as switching jobs, relocating, or joining a startup.",
    focus: ["Career moves may need stronger salary certainty", "Riskier roles may need to wait until savings are stable"],
    skills: ["Target roles with stable salary, clear benefits, and predictable workload", "Build job-search confidence before making a major move"],
    evidence: ["Updated resume", "Clear salary benchmark notes", "Portfolio project tied to employability"],
    action: "Shortlist three stable roles and compare salary, benefits, learning exposure, and workload.",
    recommended: "Stable entry-level role, graduate programme, or structured corporate environment.",
  },
  "side-business": {
    meaning: "This can build ownership, sales, product, and customer understanding, but may increase time pressure.",
    focus: ["Time pressure can affect full-time performance", "Unclear boundaries may reduce learning energy"],
    skills: ["Choose roles that provide learning, customer exposure, and manageable work-life balance", "Capture business experiments as career evidence"],
    evidence: ["Customer interviews", "Landing page or campaign results", "Revenue or learning metrics"],
    action: "Define one small business experiment that can become portfolio evidence within 30 days.",
    recommended: "Hybrid role, startup-friendly role, product/marketing/customer-facing role.",
  },
};

function career(id: string, title: string, targetYear: number, subtitle: string): TimelineNode {
  return { id, title, time: yearLabel(targetYear), subtitle, targetYear, baseYear: targetYear, displayYear: targetYear, type: "career" };
}

function yearLabel(year: number) {
  if (year === 0) return "Now";
  return `Year ${Number.isInteger(year) ? year : year.toFixed(1)}`;
}

function sortTimelineNodes(nodes: TimelineNode[]) {
  return [...nodes].sort((a, b) => {
    const aYear = a.displayYear ?? a.targetYear;
    const bYear = b.displayYear ?? b.targetYear;
    if (aYear !== bYear) return aYear - bYear;
    const priority = (node: TimelineNode) => {
      const year = node.displayYear ?? node.targetYear;
      if (year === 0 && node.type === "career") return 0;
      if (node.chapterKind === "goal") return 1;
      if (node.chapterKind === "break") return 2;
      if (node.type === "career") return 3;
      return 4;
    };
    const priorityDiff = priority(a) - priority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return 0;
  });
}

function applyTimelineDelays(careerNodes: TimelineNode[], lifeNodes: TimelineNode[]) {
  const breaks = lifeNodes
    .filter((node) => node.chapterKind === "break")
    .sort((a, b) => a.targetYear - b.targetYear);
  const delayedCareers = careerNodes.map((node) => {
    const baseYear = node.baseYear ?? node.targetYear;
    const delayYears = breaks
      .filter((breakNode) => baseYear >= breakNode.targetYear)
      .reduce((total, breakNode) => total + getBreakDelayYears(breakNode.durationMonths ?? getDefaultDurationMonths(breakNode.lifeGoalKey)), 0);
    const displayYear = baseYear + delayYears;

    return {
      ...node,
      baseYear,
      displayYear,
      targetYear: baseYear,
      time: yearLabel(displayYear),
    };
  });
  const life = lifeNodes.map((node) => ({
    ...node,
    baseYear: node.baseYear ?? node.targetYear,
    displayYear: node.targetYear,
    time: yearLabel(node.targetYear),
  }));

  return sortTimelineNodes([...delayedCareers, ...life]);
}

function getBreakDelayYears(durationMonths: number) {
  return durationMonths / 12;
}

function createLifeNode(option: LifeGoalOption, targetYear: number, durationMonths = getDefaultDurationMonths(option.key)): TimelineNode {
  return {
    id: `life-${option.key}`,
    title: option.title,
    type: "life",
    time: yearLabel(targetYear),
    subtitle: option.chapterType,
    targetYear,
    baseYear: targetYear,
    displayYear: targetYear,
    chapterKind: option.chapterKind,
    durationMonths,
    lifeGoalKey: option.key,
    icon: option.icon,
  };
}

function getLifeOption(key?: string) {
  return lifeGoalOptions.find((item) => item.key === key);
}

function getDefaultDurationMonths(key?: string) {
  const durations: Record<string, number> = {
    "study-again": 24,
    "side-business": 12,
    "health-break": 6,
    relocate: 12,
    "care-family": 12,
    hobbies: 6,
    retirement: 60,
    "career-break": 6,
    "family-planning": 12,
    "emergency-savings": 12,
    investing: 12,
    "return-work": 6,
  };

  if (!key || key.startsWith("custom-")) return 12;
  return durations[key] ?? 12;
}

function parseDurationInput(value: string) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.min(120, parsed);
}

function getLifePlan(node: TimelineNode): ChapterPlan {
  const option = getLifeOption(node.lifeGoalKey);
  const mapped = node.lifeGoalKey ? lifePlans[node.lifeGoalKey] : undefined;

  return {
    title: node.title,
    eyebrow: option?.chapterType ?? "Personal Life Chapter",
    meaning: mapped?.meaning ?? "This life goal may change your timing, preferred work environment, risk appetite, and the kind of career evidence you need to keep active.",
    focusTitle: "Risks / challenges",
    focus: mapped?.focus ?? ["Career momentum may become less linear", "Role choices may need more flexibility", "Portfolio evidence can become outdated if ignored"],
    skillsTitle: "Career coping strategy",
    skills: mapped?.skills ?? ["Choose work arrangements that support this chapter", "Keep one active project or learning signal visible", "Plan your return-to-work story before the transition"],
    evidenceTitle: "Evidence to maintain",
    evidence: mapped?.evidence ?? ["Updated Living Portfolio", "Recent project proof", "Reflection on transferable skills"],
    actionTitle: "Next 90-day action",
    action: mapped?.action ?? "Write a one-page chapter plan that connects this goal to your target role, workstyle, and portfolio evidence.",
    recommended: mapped?.recommended ?? "Flexible, supportive roles with clear expectations and room for transition planning.",
  };
}

function formatRm(value: number) {
  return `RM ${Math.round(value).toLocaleString("en-MY")}`;
}

function formatDuration(months: number) {
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = months / 12;
  return `${Number.isInteger(years) ? years : years.toFixed(1)} year${years === 1 ? "" : "s"}`;
}

function formatDurationYears(years: number) {
  if (years <= 0) return "0 years";
  if (years < 1) {
    const months = Math.round(years * 12);
    return `${months} month${months === 1 ? "" : "s"}`;
  }
  return `${Number.isInteger(years) ? years : years.toFixed(1)} year${years === 1 ? "" : "s"}`;
}

function parseTargetYearInput(value: string) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.min(40, parsed);
}

function TimelineNodeItem({
  node,
  index,
  selected,
  active,
  onSelect,
}: {
  node: TimelineNode;
  index: number;
  selected: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  const isLife = node.type === "life";
  const isBreak = node.chapterKind === "break";
  const Icon = isLife ? node.icon ?? Sparkles : BriefcaseBusiness;
  const lifeAccent = isBreak ? "#C86B2B" : theme.rose2;
  const lifeSoft = isBreak ? "#FFF4EA" : theme.soft;
  const lifeLine = isBreak ? "#F4C7A1" : theme.line;
  const activeColor = isLife ? lifeAccent : theme.navy;
  const inactiveBorder = isLife ? lifeLine : "#CBD3E5";

  return (
    <motion.button
      layout
      type="button"
      onClick={onSelect}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: selected ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className="relative z-10 flex w-[190px] shrink-0 flex-col items-center text-center"
      style={{ transformOrigin: "center" }}
    >
      <span
        className={`grid h-14 w-14 place-items-center rounded-full border-4 shadow-lg transition ${
          selected ? "ring-8" : ""
        }`}
        style={{
          background: active
            ? isLife
              ? isBreak
                ? "linear-gradient(135deg,#F1A05F,#C86B2B)"
                : `linear-gradient(135deg, ${theme.rose1}, ${theme.rose2})`
              : `linear-gradient(135deg, ${theme.navy}, ${theme.deepNavy})`
            : "#fff",
          borderColor: active ? "#fff" : inactiveBorder,
          color: active ? "#fff" : activeColor,
          boxShadow: selected
            ? `0 18px 38px ${isLife ? (isBreak ? "rgba(200,107,43,0.22)" : "rgba(224,0,70,0.22)") : "rgba(8,20,51,0.22)"}`
            : active
              ? "0 12px 28px rgba(21, 34, 56, 0.12)"
              : "0 10px 22px rgba(21, 34, 56, 0.08)",
          "--tw-ring-color": isLife ? (isBreak ? "rgba(200,107,43,0.16)" : "rgba(240, 77, 122, 0.16)") : "rgba(8, 20, 51, 0.12)",
        } as React.CSSProperties}
      >
        <Icon className="h-6 w-6" />
      </span>
      <span
        className="mt-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
        style={{
          backgroundColor: active ? (isLife ? theme.soft : "#F7F8FB") : "#fff",
          color: active ? (isLife ? lifeAccent : theme.navy) : theme.muted,
        }}
      >
        {node.time}
      </span>
      <span
        className="mt-2 flex h-10 items-center justify-center overflow-hidden px-1 text-sm font-semibold leading-5 text-[#081433]"
        style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
      >
        <span>{node.title}</span>
      </span>
      <span
        className="mt-1 flex h-9 items-center justify-center overflow-hidden px-1 text-xs leading-4 text-[#46536D]"
        style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
      >
        <span>{node.subtitle}</span>
      </span>
      <span className="mt-2 flex h-7 items-center justify-center">
        {isLife ? (
          <span
            className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold shadow-sm ring-1"
            style={{ color: lifeAccent, backgroundColor: lifeSoft, ["--tw-ring-color" as string]: lifeLine } as React.CSSProperties}
          >
            {node.chapterKind === "break" ? `Break / ${formatDuration(node.durationMonths ?? getDefaultDurationMonths(node.lifeGoalKey))}` : "Goal"}
          </span>
        ) : (
          <span className="invisible rounded-full px-3 py-1 text-[11px] font-semibold">Career</span>
        )}
      </span>
      <span className="mt-1 flex h-5 items-center justify-center">
        {node.sourceLifeGoalTitle ? (
          <span className="rounded-full bg-[#F8F9FB] px-2.5 py-0.5 text-[10px] font-semibold text-[#46536D] ring-1 ring-[#E5E8F0]">
            From {node.sourceLifeGoalTitle}
          </span>
        ) : null}
      </span>
      <span className="mt-1 flex h-4 items-center justify-center text-[11px] font-semibold text-[#C86B2B]">
        {isBreak ? `Shifts future +${formatDurationYears(getBreakDelayYears(node.durationMonths ?? getDefaultDurationMonths(node.lifeGoalKey)))}` : ""}
      </span>
      <span className="sr-only">Milestone {index + 1}</span>
    </motion.button>
  );
}

function AddLifeGoalModal({
  existingTitles,
  editNode,
  onClose,
  onAdd,
  onSave,
}: {
  existingTitles: Set<string>;
  editNode?: TimelineNode | null;
  onClose: () => void;
  onAdd: (goals: TimelineNode[]) => void;
  onSave?: (node: TimelineNode) => void;
}) {
  const isEdit = Boolean(editNode);
  const [activeKind, setActiveKind] = useState<ChapterKind>(editNode?.chapterKind ?? "goal");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState(editNode?.title ?? "");
  const [targetYearInput, setTargetYearInput] = useState(editNode ? String(editNode.targetYear) : "1");
  const [durationInput, setDurationInput] = useState(String(editNode?.durationMonths ?? getDefaultDurationMonths(editNode?.lifeGoalKey)));
  const [chapterTypeKey, setChapterTypeKey] = useState(editNode?.lifeGoalKey ?? lifeGoalOptions.find((option) => option.chapterKind === (editNode?.chapterKind ?? "goal"))?.key ?? "");
  const [message, setMessage] = useState("");
  const previewYear = parseTargetYearInput(targetYearInput);
  const previewDuration = parseDurationInput(durationInput);
  const visibleOptions = lifeGoalOptions.filter((option) => option.chapterKind === activeKind);

  function toggleGoal(key: string) {
    setSelectedKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }

  function handleAdd() {
    if (isEdit && editNode && onSave) {
      const title = customGoal.trim();
      const finalTargetYear = parseTargetYearInput(targetYearInput);
      const finalDuration = parseDurationInput(durationInput);

      if (!title) {
        setMessage("Add a chapter title before saving.");
        return;
      }

      const duplicateTitle = existingTitles.has(title.toLowerCase()) && title.toLowerCase() !== editNode.title.toLowerCase();
      if (duplicateTitle) {
        setMessage("That chapter title is already on your timeline.");
        return;
      }

      const selectedOption = getLifeOption(chapterTypeKey);
      const matchedOption = lifeGoalOptions.find((option) => option.title.toLowerCase() === title.toLowerCase());
      const option = selectedOption ?? matchedOption;
      const nextKind = option?.chapterKind ?? activeKind;

      onSave({
        ...editNode,
        title,
        time: yearLabel(finalTargetYear),
        subtitle: option?.chapterType ?? editNode.subtitle,
        targetYear: finalTargetYear,
        baseYear: finalTargetYear,
        displayYear: finalTargetYear,
        chapterKind: nextKind,
        durationMonths: finalDuration,
        lifeGoalKey: option?.key ?? editNode.lifeGoalKey,
        icon: option?.icon ?? editNode.icon,
      });
      return;
    }

    const finalTargetYear = parseTargetYearInput(targetYearInput);
    const finalDuration = parseDurationInput(durationInput);
    const selectedOptions = selectedKeys
      .map((key) => lifeGoalOptions.find((option) => option.key === key))
      .filter((option): option is LifeGoalOption => Boolean(option));

    const nodes = selectedOptions
      .filter((option) => !existingTitles.has(option.title.toLowerCase()))
      .map((option) => createLifeNode(option, finalTargetYear, finalDuration));

    if (nodes.length === 0) {
      setMessage(selectedOptions.length === 0 ? "Choose at least one predefined chapter." : "That chapter is already on your timeline.");
      return;
    }

    onAdd(nodes);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-end bg-[#081433]/35 p-4 backdrop-blur-sm sm:place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border bg-white shadow-[0_28px_80px_rgba(8,20,51,0.22)]"
        style={{ borderColor: theme.border }}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b bg-white px-6 py-5" style={{ borderColor: theme.border }}>
          <div>
            <h2 className="text-xl font-semibold text-[#081433]">{isEdit ? "Edit life chapter" : "Add a life chapter"}</h2>
            <p className="mt-1 text-sm text-[#46536D]">
              {isEdit ? "Update the chapter details and duration." : "Choose life goals that may affect your career timeline."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-[#46536D] transition hover:bg-[#FFF2F6] hover:text-[#E00046]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="mb-5 flex gap-6 border-b" style={{ borderColor: theme.border }}>
            {(["goal", "break"] as ChapterKind[]).map((kind) => {
              const active = activeKind === kind;
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => {
                    setActiveKind(kind);
                    setSelectedKeys([]);
                    const option = getLifeOption(chapterTypeKey);
                    if (option?.chapterKind !== kind) setChapterTypeKey(lifeGoalOptions.find((item) => item.chapterKind === kind)?.key ?? "");
                  }}
                  className="relative pb-3 text-sm font-semibold transition"
                  style={{ color: active ? (kind === "break" ? "#C86B2B" : theme.rose2) : theme.muted }}
                >
                  {kind === "goal" ? "Goals" : "Breaks"}
                  <span
                    className="absolute bottom-[-1px] left-0 h-0.5 rounded-full transition-all"
                    style={{
                      width: active ? "100%" : "0%",
                      backgroundColor: kind === "break" ? "#C86B2B" : theme.rose2,
                    }}
                  />
                </button>
              );
            })}
          </div>

          {isEdit ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="text-sm font-semibold text-[#081433]">Chapter title</span>
                <input
                  value={customGoal}
                  onChange={(event) => setCustomGoal(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none"
                  style={{ borderColor: theme.border }}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-[#081433]">Chapter type</span>
                <select
                  value={chapterTypeKey}
                  onChange={(event) => {
                    const nextKey = event.target.value;
                    setChapterTypeKey(nextKey);
                    const option = getLifeOption(nextKey);
                    if (option) setActiveKind(option.chapterKind);
                    if (option && !customGoal.trim()) setCustomGoal(option.title);
                    if (option) setDurationInput(String(editNode?.durationMonths ?? getDefaultDurationMonths(option.key)));
                  }}
                  className="mt-2 h-11 w-full rounded-xl border bg-white px-4 text-sm font-semibold text-[#46536D] outline-none"
                  style={{ borderColor: theme.border }}
                >
                  {visibleOptions.map((goal) => (
                    <option key={goal.key} value={goal.key}>{goal.title}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[#081433]">
                  Target year
                  <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">
                    {yearLabel(previewYear)}
                  </span>
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={targetYearInput}
                  onChange={(event) => setTargetYearInput(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border bg-white px-4 text-sm font-semibold text-[#46536D] outline-none"
                  style={{ borderColor: theme.border }}
                />
              </label>
              <label className="block md:col-span-2">
                <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[#081433]">
                  Duration
                  <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">
                    {previewDuration} months
                  </span>
                </span>
                <span className="mt-2 flex h-11 items-center gap-2 rounded-xl border bg-white px-4" style={{ borderColor: theme.border }}>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={durationInput}
                    onChange={(event) => setDurationInput(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#46536D] outline-none"
                  />
                  <span className="text-xs font-semibold text-[#46536D]">months</span>
                </span>
                <p className="mt-2 text-xs leading-5 text-[#46536D]">
                  How long this life chapter is expected to last.
                </p>
              </label>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {visibleOptions.map((goal) => {
                  const Icon = goal.icon;
                  const checked = selectedKeys.includes(goal.key);
                  const accent = goal.chapterKind === "break" ? "#C86B2B" : theme.rose2;
                  const soft = goal.chapterKind === "break" ? "#FFF4EA" : "#FFF7FA";
                  const line = goal.chapterKind === "break" ? "#F4C7A1" : theme.rose1;
                  return (
                    <label
                      key={goal.key}
                      className={`flex min-h-[72px] items-center gap-3 rounded-xl border p-3 transition ${
                        checked ? "" : "bg-white hover:bg-[#FFF9FB]"
                      }`}
                      style={{ borderColor: checked ? line : theme.border, backgroundColor: checked ? soft : undefined }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleGoal(goal.key)}
                        className="career-checkbox h-4 w-4"
                        style={{ accentColor: accent }}
                      />
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: soft, color: accent }}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold leading-5 text-[#081433]">{goal.title}</span>
                        <span className="mt-1 block text-xs font-semibold" style={{ color: accent }}>{goal.chapterKind === "break" ? "Break" : "Goal"}</span>
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[#081433]">
                    Target year
                    <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">
                      {yearLabel(previewYear)}
                    </span>
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={targetYearInput}
                    onChange={(event) => setTargetYearInput(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border bg-white px-4 text-sm font-semibold text-[#46536D] outline-none"
                    style={{ borderColor: theme.border }}
                  />
                  <p className="mt-2 text-xs leading-5 text-[#46536D]">
                    Enter 0 for Now, or any year from 1 to 40.
                  </p>
                </label>
                <label className="block">
                  <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[#081433]">
                    Duration
                    <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">
                      {previewDuration}m
                    </span>
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={durationInput}
                    onChange={(event) => setDurationInput(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border bg-white px-4 text-sm font-semibold text-[#46536D] outline-none"
                    style={{ borderColor: theme.border }}
                  />
                  <p className="mt-2 text-xs leading-5 text-[#46536D]">
                    {activeKind === "break" ? "Break duration shifts future career milestones." : "Stored for planning; does not delay careers."}
                  </p>
                </label>
              </div>
            </>
          )}

          {message && <p className="mt-3 text-sm font-semibold text-[#E00046]">{message}</p>}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t px-6 py-5 sm:flex-row sm:justify-end" style={{ borderColor: theme.border }}>
          <button type="button" onClick={onClose} className="h-11 rounded-xl border px-5 text-sm font-semibold text-[#46536D] transition hover:bg-[#F8F9FB]" style={{ borderColor: theme.border }}>
            Cancel
          </button>
          <button type="button" onClick={handleAdd} className="career-pink-action flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white">
            {isEdit ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isEdit ? "Save Changes" : "Add to Timeline"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ChapterPlanCard({
  node,
  timelineNodes,
  onApplyRetirementRecommendations,
  onAddEmergencySavings,
}: {
  node: TimelineNode;
  timelineNodes: TimelineNode[];
  onApplyRetirementRecommendations: (recommendations: RetirementRecommendation[]) => void;
  onAddEmergencySavings: (selectedBreak: TimelineNode) => void;
}) {
  const isLife = node.type === "life";

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={node.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-2xl border bg-white shadow-sm"
        style={{ borderColor: theme.border }}
      >
        {isLife ? <LifeChapterDashboard node={node} timelineNodes={timelineNodes} onApplyRetirementRecommendations={onApplyRetirementRecommendations} onAddEmergencySavings={onAddEmergencySavings} /> : <CareerMilestoneCard node={node} timelineNodes={timelineNodes} />}
      </motion.article>
    </AnimatePresence>
  );
}

function CareerMilestoneCard({ node, timelineNodes }: { node: TimelineNode; timelineNodes: TimelineNode[] }) {
  const status = getCareerContextStatus(node, timelineNodes);
  const stage = getCareerStageContext(node.title);
  const usedFor = ["Goal Fit", "Break Planning", "Income Stage", "Return Target"];

  return (
    <section className="bg-[linear-gradient(180deg,#F8FAFF_0%,#FFFFFF_48%,#F8F9FB_100%)] p-5 sm:p-6">
      <div className="rounded-[1.8rem] bg-white/90 p-5 shadow-[0_18px_42px_rgba(21,34,56,0.07)] ring-1 ring-[#E5E8F0] backdrop-blur">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#EEF2FF] text-[#4F46E5] ring-1 ring-[#DDE3FF]">
              <BriefcaseBusiness className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4F46E5]">Career Context Marker</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal text-[#081433]">{node.title} / {node.time}</h2>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#46536D]">This role helps CareerOS understand your career stage when analysing nearby goals and breaks.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#4F46E5] ring-1 ring-[#DDE3FF]">{status.label}</span>
            <span className="rounded-full bg-[#F8F9FB] px-3 py-1 text-xs font-semibold text-[#46536D] ring-1 ring-[#E5E8F0]">{stage.label}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.25rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#46536D]">Timeline Status</p>
            <p className="mt-2 text-base font-semibold text-[#081433]">{status.label}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#46536D]">{status.text}</p>
          </div>
          <div className="rounded-[1.25rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#46536D]">Career Stage Summary</p>
            <p className="mt-2 text-base font-semibold text-[#081433]">{stage.label}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#46536D]">{stage.text}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[1.25rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#081433]">Used by CareerOS for</p>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#46536D] ring-1 ring-[#E5E8F0]">Context only</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {usedFor.map((item) => (
              <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#081433] ring-1 ring-[#E5E8F0]">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getCareerContextStatus(node: TimelineNode, timelineNodes: TimelineNode[]) {
  const index = timelineNodes.findIndex((item) => item.id === node.id);
  const year = getGoalYear(node);
  const hasPreviousCareer = timelineNodes.slice(0, Math.max(index, 0)).some(isCareerNode);
  const hasFutureCareer = index >= 0 ? timelineNodes.slice(index + 1).some(isCareerNode) : false;

  if (year <= 0) {
    return {
      label: "Current reached role",
      text: "This role has already been reached in the timeline and can be used as current career context.",
    };
  }

  if (hasPreviousCareer && hasFutureCareer) {
    return {
      label: "Career context marker",
      text: "This role is a reference point between earlier and later career stages in the life plan.",
    };
  }

  if (hasPreviousCareer) {
    return {
      label: "Upcoming role",
      text: "This role appears later in the timeline and should not be treated as current until reached.",
    };
  }

  return {
    label: "Career context marker",
    text: "This role is used as a reference point for nearby goals and breaks.",
  };
}

function getCareerStageContext(title: string) {
  const value = title.toLowerCase();
  if (["student", "final year", "university"].some((term) => value.includes(term))) {
    return { label: "Student Stage", text: "You are still before your first full-time role, so flexibility and cash safety matter more." };
  }
  if (["intern", "trainee", "junior", "assistant", "entry"].some((term) => value.includes(term))) {
    return { label: "Early Career", text: "This stage is usually about skill growth, flexibility, and building financial safety." };
  }
  if (["senior", "lead", "manager", "principal", "head"].some((term) => value.includes(term))) {
    return { label: "Senior / Lead Stage", text: "This stage may support larger life goals, but time pressure and responsibility may increase." };
  }
  if (["designer", "analyst", "engineer", "developer", "executive", "specialist"].some((term) => value.includes(term))) {
    return { label: "Growing Professional", text: "This stage gives stronger income context for planning major goals." };
  }
  return { label: "Career Stage", text: "This role gives CareerOS a career reference point for interpreting nearby life chapters." };
}

function LifeChapterDashboard({
  node,
  timelineNodes,
  onApplyRetirementRecommendations,
  onAddEmergencySavings,
}: {
  node: TimelineNode;
  timelineNodes: TimelineNode[];
  onApplyRetirementRecommendations: (recommendations: RetirementRecommendation[]) => void;
  onAddEmergencySavings: (selectedBreak: TimelineNode) => void;
}) {
  if (node.chapterKind === "goal") {
    return <GoalPlanningCard node={node} timelineNodes={timelineNodes} onApplyRetirementRecommendations={onApplyRetirementRecommendations} />;
  }

  return <BreakSafetyPlanCard node={node} timelineNodes={timelineNodes} onAddEmergencySavings={onAddEmergencySavings} />;
}

type GoalKind =
  | "emergency"
  | "investing"
  | "house"
  | "family"
  | "study"
  | "relocate"
  | "hobbies"
  | "sideIncome"
  | "retirement"
  | "custom";

function GoalPlanningCard({ node, timelineNodes, onApplyRetirementRecommendations }: { node: TimelineNode; timelineNodes: TimelineNode[]; onApplyRetirementRecommendations: (recommendations: RetirementRecommendation[]) => void }) {
  const Icon = node.icon ?? Sparkles;
  const goalKind = detectGoalKind(node);
  const blueprint = getGoalBlueprint(goalKind);
  const takeaway = getGoalTakeaway(goalKind);

  return (
    <>
      <div className="bg-[radial-gradient(circle_at_85%_10%,rgba(240,77,122,0.28),transparent_18rem),linear-gradient(135deg,#081433,#152238)] p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/12 text-[#FFD6E1] ring-1 ring-white/15">
              <Icon className="h-7 w-7" />
            </span>
            <div>
              <span className="rounded-full bg-[#FFF2F6]/14 px-3 py-1 text-xs font-semibold text-white/80">
                Goal planning card
              </span>
              {node.sourceLifeGoalTitle && (
                <span className="ml-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/15">
                  From {node.sourceLifeGoalTitle}
                </span>
              )}
              <h2 className="mt-4 text-2xl font-semibold tracking-normal">{node.title}</h2>
              <p className="mt-2 text-sm text-white/70">{node.subtitle} / {node.time}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">{getGoalPurpose(goalKind)}</p>
            </div>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-right">
            <p className="text-xs font-semibold text-white/60">Timeline effect</p>
            <p className="mt-1 text-sm font-semibold">No career delay</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 bg-[linear-gradient(180deg,#FFF7FA_0%,#FFFFFF_48%,#F8F9FB_100%)] p-5 sm:p-6">
        {shouldShowGoalBlueprint(goalKind) && <GoalBlueprintPath title={blueprint.title} steps={blueprint.steps} outcome={blueprint.outcome} />}
        {renderGoalFeatures(goalKind, node, timelineNodes, onApplyRetirementRecommendations)}
        <div className="rounded-[1.6rem] bg-[#081433] px-5 py-4 text-sm font-semibold leading-6 text-white shadow-[0_18px_42px_rgba(8,20,51,0.18)]">
          CareerOS Takeaway: <span className="text-white/78">{takeaway}</span>
        </div>
      </div>
    </>
  );
}

function detectGoalKind(node: TimelineNode): GoalKind {
  const value = `${node.lifeGoalKey ?? ""} ${node.title}`.toLowerCase();
  if (node.sourceLifeGoalKey === "retirement" || node.retirementVisionKey || value.includes("retirement-")) return "retirement";
  if (value.includes("emergency") || value.includes("saving")) return "emergency";
  if (value.includes("invest")) return "investing";
  if (value.includes("house") || value.includes("home") || value.includes("buy-house")) return "house";
  if (value.includes("married") || value.includes("family-planning")) return "family";
  if (value.includes("study") && (value.includes("part") || value.includes("again"))) return "study";
  if (value.includes("relocate") || value.includes("overseas")) return "relocate";
  if (value.includes("hobby") || value.includes("hobbies")) return "hobbies";
  if (value.includes("side income") || value.includes("side-business") || value.includes("freelance")) return "sideIncome";
  if (value.includes("retirement")) return "retirement";
  return "custom";
}

function getGoalPurpose(kind: GoalKind) {
  const purposes: Record<GoalKind, string> = {
    emergency: "Create financial breathing space so career decisions become less fear-driven.",
    investing: "Build long-term independence while continuing career growth.",
    house: "Understand how home ownership affects career mobility and stability.",
    family: "Balance family planning with career growth, benefits, and flexibility.",
    study: "Upskill while working so learning turns into career leverage.",
    relocate: "Prepare for international career options without losing direction.",
    hobbies: "Protect career sustainability and notice transferable signals from life outside work.",
    sideIncome: "Diversify career risk and create optional future paths while employed.",
    retirement: "Design life after the main career as a transition, not an endpoint.",
    custom: "Connect this goal to career freedom, timing, stability, and future options.",
  };
  return purposes[kind];
}

function getGoalBlueprint(kind: GoalKind) {
  const blueprints: Record<GoalKind, { title: string; steps: { label: string; text: string }[]; outcome: string }> = {
    emergency: {
      title: "Income to Freedom Path",
      steps: [
        { label: "Current Reality", text: "You rely fully on monthly income from your job." },
        { label: "Income Stability", text: "Strengthen your career foundation." },
        { label: "Income Capacity", text: "Grow earning power through career progress." },
        { label: "Financial Buffer", text: "Separate survival from paycheck timing." },
        { label: "Emergency Resilience", text: "Avoid panic career decisions." },
      ],
      outcome: "Financial breathing space -> career flexibility + life stability.",
    },
    investing: {
      title: "Investment Timeline Foundation",
      steps: [
        { label: "Foundation", text: "Protect emergency savings before increasing investing pressure." },
        { label: "Timeline Fit", text: "Check whether nearby goals need flexible cash first." },
        { label: "Small Habit", text: "Use a contribution rhythm that does not crowd out life plans." },
        { label: "Review", text: "Adjust when career, housing, break, or relocation timing changes." },
      ],
      outcome: "Investing starts only when the timeline can support it.",
    },
    house: {
      title: "Stability and Mobility Path",
      steps: [
        { label: "Open Mobility", text: "Relocation and job changes stay flexible." },
        { label: "Location Choice", text: "Career market starts shaping the purchase decision." },
        { label: "Ownership Commitment", text: "Stable income becomes more important." },
        { label: "Long-Term Base", text: "Home location supports your career ecosystem." },
      ],
      outcome: "A home can anchor stability when it matches career direction.",
    },
    family: {
      title: "Family Stability Path",
      steps: [
        { label: "Career Base", text: "Build role stability before responsibilities rise." },
        { label: "Flexibility", text: "Negotiate workload and work arrangement." },
        { label: "Benefits", text: "Prioritise employers with support systems." },
        { label: "Sustainable Growth", text: "Plan growth without burnout." },
      ],
      outcome: "Family planning works best with predictable income and flexible work.",
    },
    study: {
      title: "Learning to Role Lift",
      steps: [
        { label: "Target Role", text: "Choose the career outcome first." },
        { label: "Skill Gap", text: "Find the missing capability." },
        { label: "Study Signal", text: "Turn learning into visible proof." },
        { label: "Promotion Lift", text: "Use new skills to widen role fit." },
      ],
      outcome: "Part-time study becomes career leverage when tied to a target role.",
    },
    relocate: {
      title: "Global Career Path",
      steps: [
        { label: "Country Fit", text: "Compare career factors, not only salary." },
        { label: "Readiness", text: "Build language, portfolio, experience, and network." },
        { label: "Path Shift", text: "Understand how roles evolve by market." },
      ],
      outcome: "Relocation planning creates international options before a move.",
    },
    hobbies: {
      title: "Sustainability Signal Path",
      steps: [
        { label: "Recovery", text: "Create a non-work channel for energy." },
        { label: "Hidden Skills", text: "Notice transferable strengths." },
        { label: "Reflection", text: "Learn what kind of work you prefer." },
      ],
      outcome: "A casual hobby can protect energy and reveal career signals.",
    },
    sideIncome: {
      title: "Single Income to Optionality",
      steps: [
        { label: "Salary Dependent", text: "Most income comes from one employer." },
        { label: "Explore", text: "Test skills in small side offers." },
        { label: "Diversify", text: "Build repeatable income outside salary." },
        { label: "Future Option", text: "Decide if it becomes a full-time break later." },
      ],
      outcome: "Side income reduces dependence on one employer.",
    },
    retirement: {
      title: "Main Career to Second Chapter",
      steps: [
        { label: "Identity", text: "Choose the life you want after full-time work." },
        { label: "Legacy", text: "Name what your career leaves behind." },
        { label: "Second Career", text: "Build relationships and skills before transition." },
      ],
      outcome: "Retirement becomes a designed transition, not an endpoint.",
    },
    custom: {
      title: "Goal to Career Fit",
      steps: [
        { label: "Goal Meaning", text: "Clarify what this goal changes." },
        { label: "Career Effect", text: "Map impact on flexibility, stability, and timing." },
        { label: "Next Move", text: "Choose one career-supporting action." },
      ],
      outcome: "A personal goal becomes stronger when connected to career strategy.",
    },
  };
  return blueprints[kind];
}

function shouldShowGoalBlueprint(kind: GoalKind) {
  return kind === "custom";
}

function renderGoalFeatures(kind: GoalKind, node: TimelineNode, timelineNodes: TimelineNode[], onApplyRetirementRecommendations: (recommendations: RetirementRecommendation[]) => void) {
  if (kind === "emergency") return <DynamicEmergencySavingsStrategy node={node} timelineNodes={timelineNodes} />;
  if (kind === "investing") return <StartInvestingFoundationPlanner node={node} timelineNodes={timelineNodes} />;
  if (kind === "house") return <BuyHouseGoalFeatures node={node} timelineNodes={timelineNodes} />;
  if (kind === "family") return <MarriageReadinessPlanner node={node} timelineNodes={timelineNodes} />;
  if (kind === "study") return <StudyAgainGoalFeatures node={node} timelineNodes={timelineNodes} />;
  if (kind === "relocate") return <RelocateOverseasGoalFeatures node={node} timelineNodes={timelineNodes} />;
  if (kind === "hobbies") return <GrowthHobbyCompass timelineNodes={timelineNodes} node={node} />;
  if (kind === "sideIncome") return <SideCareerBlueprint node={node} timelineNodes={timelineNodes} />;
  if (kind === "retirement") return <GuidedRetirementRoadmapEditor node={node} timelineNodes={timelineNodes} onApplyRecommendations={onApplyRetirementRecommendations} />;
  return <TimelineCompatibility node={node} />;
}

function getGoalTakeaway(kind: GoalKind) {
  const takeaways: Record<GoalKind, string> = {
    emergency: "Emergency savings gives you more freedom to reject poor-fit jobs or handle unexpected life events.",
    investing: "Investing supports future chapters like entrepreneurship, family planning, and semi-retirement.",
    house: "Buying a house can increase stability but may reduce relocation flexibility.",
    family: "Family planning makes stable income, benefits, flexibility, and lower burnout risk more strategic.",
    study: "Part-time study works best when it creates proof for the next role, not just a certificate.",
    relocate: "Overseas planning improves career mobility when readiness, market demand, and path fit align.",
    hobbies: "Hobbies can protect long-term career energy and reveal skills work alone may not show.",
    sideIncome: "Side income creates optionality by reducing dependence on a single employer.",
    retirement: "Retirement planning is stronger when it includes identity, legacy, and a possible second career.",
    custom: "This goal should strengthen career freedom, stability, timing, or future life options.",
  };
  return takeaways[kind];
}

function GoalBlueprintPath({ title, steps, outcome }: { title: string; steps: { label: string; text: string }[]; outcome: string }) {
  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-[0_20px_45px_rgba(21,34,56,0.08)] ring-1 ring-[#E5E8F0]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Goal Path</p>
          <h3 className="mt-1 text-xl font-semibold text-[#081433]">{title}</h3>
        </div>
        <span className="rounded-full bg-[#FFF2F6] px-4 py-2 text-xs font-semibold text-[#E00046]">career-life progression</span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
        {steps.map((step, index) => (
          <div key={step.label} className="relative rounded-[1.5rem] bg-[#FFF7FA] p-4">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-semibold text-[#E00046] shadow-sm">{index + 1}</span>
            <p className="mt-3 text-sm font-semibold text-[#081433]">{step.label}</p>
            <p className="mt-2 text-xs leading-5 text-[#46536D]">{step.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-full bg-[#081433] px-5 py-3 text-sm font-semibold text-white">{outcome}</p>
    </section>
  );
}

function GoalFeaturePanel({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_42px_rgba(21,34,56,0.08)] ring-1 ring-[#E5E8F0]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">{eyebrow ?? "CareerOS Feature"}</p>
      <h3 className="mt-1 text-xl font-semibold text-[#081433]">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full bg-[#F8F9FB] px-5 py-4 shadow-inner">
      <p className="text-xs font-semibold text-[#46536D]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#081433]">{value}</p>
    </div>
  );
}

function ProgressBar({ value, color = theme.rose2 }: { value: number; color?: string }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-[#F7D8E1]">
      <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} animate={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

type SavingsRiskLevel = "Low" | "Medium" | "High";

type SavingsPhase = {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  monthlySaving: number;
  reason: string;
  risk: SavingsRiskLevel;
};

type SavingsFactor = {
  id: string;
  type: "risk" | "support" | "neutral";
  label: string;
  effect: string;
  icon: LucideIcon;
  year?: number;
};

type TimelineSavingsFactors = {
  breakNodes: TimelineNode[];
  totalBreakMonths: number;
  nearestBreakYear: number | null;
  hasLongBreak: boolean;
  hasMultipleBreaks: boolean;
  hasSideIncome: boolean;
  sideIncomeYear: number | null;
  hasInvesting: boolean;
  investingYear: number | null;
  hasHouse: boolean;
  houseYear: number | null;
  hasFamilyPlanning: boolean;
  familyYear: number | null;
  hasRelocation: boolean;
  relocationYear: number | null;
  hasRetirement: boolean;
  retirementYear: number | null;
  factorCards: SavingsFactor[];
};

function DynamicEmergencySavingsStrategy({ node, timelineNodes }: { node: TimelineNode; timelineNodes: TimelineNode[] }) {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const factors = useMemo(() => getTimelineSavingsFactors(timelineNodes), [timelineNodes]);
  const phases = useMemo(() => calculateSavingsPhases(timelineNodes, factors), [timelineNodes, factors]);
  const analysis = useMemo(() => generateSavingsAnalysis(factors, phases), [factors, phases]);
  const highestPhase = phases.reduce((highest, phase) => phase.monthlySaving > highest.monthlySaving ? phase : highest, phases[0]);
  const selectedPhase = phases.find((phase) => phase.id === selectedPhaseId) ?? highestPhase;
  const detected = factors.factorCards.length > 0 ? factors.factorCards.slice(0, 5) : [{ id: "stable", type: "neutral" as const, label: "Continuous employment period", effect: "Supports steady savings growth", icon: BriefcaseBusiness }];
  const runwayReason = getMainSavingsPressureFactor(factors);
  const supportText = getSavingsSupportText(factors);

  return (
    <section className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_42px_rgba(21,34,56,0.08)] ring-1 ring-[#E5E8F0]">
      <div className="relative overflow-hidden bg-[#081433] px-6 py-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(240,77,122,0.30),transparent_18rem),radial-gradient(circle_at_12%_90%,rgba(125,182,255,0.16),transparent_16rem)]" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFD6E1]">Dynamic Emergency Savings Strategy</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-normal">Timeline-linked safety plan</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">Your savings plan adapts automatically as your career and life timeline changes.</p>
          </div>
          <span className="rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/85 ring-1 ring-white/15">
            {node.title} / {node.time}
          </span>
        </div>
      </div>

      <div className="space-y-6 bg-[linear-gradient(180deg,#FFF7FA_0%,#FFFFFF_44%,#F8F9FB_100%)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 rounded-full bg-white/86 px-4 py-3 shadow-sm ring-1 ring-[#E5E8F0]">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25B875]/45" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#25B875]" />
          </span>
          <p className="text-sm font-semibold text-[#081433]">Continuously Updated</p>
          <span className="hidden h-1 w-1 rounded-full bg-[#CBD3E5] sm:inline-flex" />
          <p className="text-sm text-[#46536D]">CareerOS re-analyses your savings strategy whenever your timeline changes.</p>
        </div>

        <section className="rounded-[1.9rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Emergency Savings Runway</p>
              <h4 className="mt-1 text-xl font-semibold text-[#081433]">Savings pressure across your timeline</h4>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#46536D]">Savings pressure rises before risky life chapters and reduces after stability returns.</p>
            </div>
            <div className="rounded-[1.3rem] bg-[#F8F9FB] px-4 py-3 text-right ring-1 ring-[#E5E8F0]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#46536D]">Peak buffer needed</p>
              <p className="mt-1 text-2xl font-semibold text-[#081433]">{formatRm(highestPhase.monthlySaving)}<span className="text-sm text-[#46536D]">/month</span></p>
              <p className="mt-1 text-xs font-semibold text-[#E00046]">{runwayReason}</p>
            </div>
          </div>

          <div className="mt-7 hidden lg:block">
            <div className="relative overflow-x-auto px-1 pb-4 pt-2">
              <div className="relative flex min-w-[920px] items-stretch gap-4">
                <span className="absolute left-8 right-8 top-8 h-px bg-[linear-gradient(90deg,rgba(203,211,229,0.20),rgba(203,211,229,0.85),rgba(203,211,229,0.20))]" />
                {phases.map((phase, index) => {
                  const active = phase.id === selectedPhase.id;
                  return (
                    <motion.button
                      key={phase.id}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -3 }}
                      onClick={() => setSelectedPhaseId(phase.id)}
                      className="relative z-10 min-w-[168px] flex-1 cursor-pointer rounded-[1.25rem] border px-4 py-3 text-left backdrop-blur-md transition"
                      style={{
                        background: "rgba(255,255,255,0.86)",
                        borderColor: active ? "rgba(190,18,60,0.25)" : "rgba(226,232,240,0.90)",
                        boxShadow: active ? "0 20px 45px rgba(190,18,60,0.10)" : "0 10px 28px rgba(15,23,42,0.05)",
                        transform: active ? "translateY(-4px)" : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold" style={{ backgroundColor: active ? getSavingsRiskColor(phase.risk) : getSavingsRiskBg(phase.risk), color: active ? "#fff" : getSavingsRiskColor(phase.risk) }}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="line-clamp-2 text-sm font-semibold leading-5 text-[#081433]">{phase.name}</p>
                      </div>
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#46536D]">Year {phase.startYear}-{phase.endYear}</p>
                      <p className="mt-1 text-base font-semibold text-[#081433]">{formatRm(phase.monthlySaving)}<span className="text-xs text-[#46536D]">/month</span></p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:hidden">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedPhaseId(phase.id)}
                className="relative grid cursor-pointer grid-cols-[3rem_1fr] gap-3 rounded-[1.2rem] border p-3 backdrop-blur-md transition"
                style={{ background: "rgba(255,255,255,0.86)", borderColor: phase.id === selectedPhase.id ? "rgba(190,18,60,0.25)" : "rgba(226,232,240,0.90)", boxShadow: phase.id === selectedPhase.id ? "0 16px 36px rgba(190,18,60,0.09)" : "0 10px 26px rgba(15,23,42,0.05)" }}
              >
                {index < phases.length - 1 && <span className="absolute left-[2.2rem] top-14 h-[calc(100%-1.3rem)] w-px bg-[#CBD3E5]" />}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="grid h-10 w-10 place-items-center rounded-full border-4 border-white text-xs font-semibold shadow-sm" style={{ backgroundColor: phase.id === selectedPhase.id ? getSavingsRiskColor(phase.risk) : getSavingsRiskBg(phase.risk), color: phase.id === selectedPhase.id ? "#fff" : getSavingsRiskColor(phase.risk) }}>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-base font-semibold text-[#081433]">{phase.name}</p>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#46536D]">Year {phase.startYear}-{phase.endYear}</p>
                  <p className="mt-1 text-lg font-semibold text-[#081433]">{formatRm(phase.monthlySaving)}<span className="text-xs text-[#46536D]">/month</span></p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div key={selectedPhase.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-[1.35rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#46536D]">Selected phase</p>
                <h5 className="mt-1 text-lg font-semibold text-[#081433]">{selectedPhase.name}</h5>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#46536D]">Year {selectedPhase.startYear}-{selectedPhase.endYear}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: getSavingsRiskBg(selectedPhase.risk), color: getSavingsRiskColor(selectedPhase.risk) }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: getSavingsRiskColor(selectedPhase.risk) }} />
                Risk: {selectedPhase.risk}
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-[#081433]">{formatRm(selectedPhase.monthlySaving)}<span className="text-sm text-[#46536D]">/month</span></p>
            <p className="mt-3 text-sm leading-6 text-[#46536D]">{selectedPhase.reason}</p>
          </motion.div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[1.35rem] bg-white/88 p-4 shadow-sm ring-1 ring-[#E5E8F0]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Why this plan changed</p>
                <h4 className="mt-1 text-base font-semibold text-[#081433]">Detected timeline impact</h4>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <SavingsImpactRow icon={Coffee} label="Main pressure" value={runwayReason} tone="risk" />
              <SavingsImpactRow icon={TrendingUp} label="Savings response" value={getSavingsChangeSummary(factors)} tone="neutral" />
              <SavingsImpactRow icon={Rocket} label="Support" value={supportText} tone={factors.hasSideIncome || factors.hasInvesting ? "support" : "risk"} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {detected.map((factor) => {
                const Icon = factor.icon;
                return (
                  <div key={factor.id} className="flex max-w-full items-start gap-2 rounded-full px-3 py-2 ring-1" style={{ backgroundColor: getSavingsFactorBg(factor.type), color: getSavingsFactorColor(factor.type), ["--tw-ring-color" as string]: getSavingsFactorRing(factor.type) } as React.CSSProperties}>
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-xs font-semibold text-[#081433]">{factor.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[1.35rem] bg-white/88 p-4 shadow-sm ring-1 ring-[#E5E8F0]">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#FFF7FA] text-[#E00046]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">AI Analysis</p>
                <p className="mt-2 text-sm leading-6 text-[#46536D]">{analysis.text}</p>
                <p className="mt-3 rounded-[0.9rem] bg-[#F8F9FB] px-3 py-2 text-sm font-semibold text-[#081433]">Key takeaway: {analysis.takeaway}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function SavingsImpactRow({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: SavingsFactor["type"] }) {
  return (
    <div className="flex items-start gap-3 rounded-[1rem] px-3 py-2 ring-1" style={{ backgroundColor: getSavingsFactorBg(tone), ["--tw-ring-color" as string]: getSavingsFactorRing(tone) } as React.CSSProperties}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/70" style={{ color: getSavingsFactorColor(tone) }}>
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#46536D]">{label}</span>
        <span className="mt-1 block text-sm font-semibold leading-5 text-[#081433]">{value}</span>
      </span>
    </div>
  );
}

function getMainSavingsPressureFactor(factors: TimelineSavingsFactors) {
  if (factors.breakNodes.length > 0) {
    const longestBreak = Math.max(...factors.breakNodes.map((item) => item.durationMonths ?? getDefaultDurationMonths(item.lifeGoalKey)));
    return `${longestBreak}-month career break planned`;
  }
  if (factors.hasRelocation) return "Overseas relocation goal planned";
  if (factors.hasHouse) return "House purchase goal planned";
  if (factors.hasFamilyPlanning) return "Family planning goal planned";
  if (factors.hasRetirement) return "Long-term retirement planning goal";
  return "No major interruption detected";
}

function getSavingsSupportText(factors: TimelineSavingsFactors) {
  if (factors.hasSideIncome && factors.sideIncomeYear !== null) return `Side income planned from Year ${factors.sideIncomeYear}, reducing pressure after it begins.`;
  if (factors.hasInvesting && factors.investingYear !== null) return `Investing planned from Year ${factors.investingYear}, supporting long-term stability.`;
  if (factors.breakNodes.length > 0) return "No side income detected before break.";
  return "Stable career growth supports a calmer runway.";
}

function getTimelineSavingsFactors(nodes: TimelineNode[]): TimelineSavingsFactors {
  const sorted = sortTimelineNodes(nodes);
  const includes = (node: TimelineNode, terms: string[]) => terms.some((term) => `${node.lifeGoalKey ?? ""} ${node.title}`.toLowerCase().includes(term));
  const yearOf = (node: TimelineNode) => Math.round(node.displayYear ?? node.targetYear);
  const breakNodes = sorted.filter((node) => node.chapterKind === "break" || includes(node, ["break", "sabbatical", "burnout", "care for family", "family emergency"]));
  const totalBreakMonths = breakNodes.reduce((total, item) => total + (item.durationMonths ?? getDefaultDurationMonths(item.lifeGoalKey)), 0);
  const nearestBreakYear = breakNodes.length > 0 ? Math.min(...breakNodes.map(yearOf)) : null;
  const hasLongBreak = breakNodes.some((item) => (item.durationMonths ?? getDefaultDurationMonths(item.lifeGoalKey)) >= 12);
  const sideIncome = sorted.find((node) => includes(node, ["side income", "freelance", "side-business"]));
  const investing = sorted.find((node) => includes(node, ["invest"]));
  const house = sorted.find((node) => includes(node, ["house", "buy-house"]));
  const family = sorted.find((node) => includes(node, ["married", "family planning", "family-planning"]));
  const relocation = sorted.find((node) => includes(node, ["relocate", "overseas", "relocation"]));
  const retirement = sorted.find((node) => includes(node, ["retirement"]));
  const factorCards: SavingsFactor[] = [];

  breakNodes.forEach((item, index) => {
    const months = item.durationMonths ?? getDefaultDurationMonths(item.lifeGoalKey);
    factorCards.push({ id: `break-${item.id}-${index}`, type: "risk", label: `${months}-month break planned`, effect: "Increases savings target", icon: Coffee, year: yearOf(item) });
  });
  if (breakNodes.length > 1) factorCards.push({ id: "multiple-breaks", type: "risk", label: "Multiple breaks detected", effect: "Raises safety buffer", icon: HeartPulse });
  if (house) factorCards.push({ id: "house", type: "risk", label: "House purchase goal", effect: "Increases savings pressure", icon: Home, year: yearOf(house) });
  if (family) factorCards.push({ id: "family", type: "risk", label: "Family planning goal", effect: "Increases fixed responsibility", icon: Users, year: yearOf(family) });
  if (relocation) factorCards.push({ id: "relocation", type: "risk", label: "Overseas relocation", effect: "Adds transition buffer", icon: Plane, year: yearOf(relocation) });
  if (retirement) factorCards.push({ id: "retirement", type: "neutral", label: "Retirement planning", effect: "Monitors long-term readiness", icon: Landmark, year: yearOf(retirement) });
  if (sideIncome) factorCards.push({ id: "side-income", type: "support", label: "Side income planned", effect: `Reduces pressure after Year ${yearOf(sideIncome)}`, icon: Rocket, year: yearOf(sideIncome) });
  if (investing) factorCards.push({ id: "investing", type: "support", label: "Investing goal", effect: `Supports stability after Year ${yearOf(investing)}`, icon: TrendingUp, year: yearOf(investing) });
  if (factorCards.length === 0) factorCards.push({ id: "stable-growth", type: "support", label: "Stable career growth", effect: "Supports steady savings path", icon: BriefcaseBusiness });

  return {
    breakNodes,
    totalBreakMonths,
    nearestBreakYear,
    hasLongBreak,
    hasMultipleBreaks: breakNodes.length > 1,
    hasSideIncome: Boolean(sideIncome),
    sideIncomeYear: sideIncome ? yearOf(sideIncome) : null,
    hasInvesting: Boolean(investing),
    investingYear: investing ? yearOf(investing) : null,
    hasHouse: Boolean(house),
    houseYear: house ? yearOf(house) : null,
    hasFamilyPlanning: Boolean(family),
    familyYear: family ? yearOf(family) : null,
    hasRelocation: Boolean(relocation),
    relocationYear: relocation ? yearOf(relocation) : null,
    hasRetirement: Boolean(retirement),
    retirementYear: retirement ? yearOf(retirement) : null,
    factorCards,
  };
}

function calculateSavingsPhases(nodes: TimelineNode[], factors: TimelineSavingsFactors): SavingsPhase[] {
  const maxYear = Math.max(8, ...nodes.map((item) => Math.ceil(item.displayYear ?? item.targetYear)));
  const phases: Omit<SavingsPhase, "monthlySaving" | "risk" | "reason">[] = [
    { id: "early", name: "Early Career", startYear: 0, endYear: Math.min(3, maxYear) },
    { id: "mid", name: "Mid Career", startYear: 4, endYear: Math.min(6, maxYear) },
  ];

  if (factors.nearestBreakYear !== null) {
    phases.push({ id: "before-break", name: "Before Career Break", startYear: Math.max(0, factors.nearestBreakYear - 2), endYear: factors.nearestBreakYear });
    phases.push({ id: "after-break", name: "After Returning to Work", startYear: factors.nearestBreakYear + Math.ceil(factors.totalBreakMonths / 12), endYear: factors.nearestBreakYear + Math.ceil(factors.totalBreakMonths / 12) + 2 });
  }

  const pressureYears = [factors.houseYear, factors.familyYear, factors.relocationYear].filter((year): year is number => typeof year === "number");
  if (pressureYears.length > 0) {
    const pressureYear = Math.min(...pressureYears);
    phases.push({ id: "commitment", name: "During High Commitment", startYear: Math.max(0, pressureYear - 1), endYear: pressureYear + 1 });
  }

  phases.push({ id: "long-term", name: "Long-Term Stability", startYear: Math.min(7, maxYear), endYear: Math.max(9, maxYear) });

  const unique = phases
    .filter((phase) => phase.endYear >= phase.startYear)
    .filter((phase, index, list) => list.findIndex((item) => item.id === phase.id) === index)
    .sort((a, b) => a.startYear - b.startYear)
    .slice(0, 5);

  return unique.map((phase) => {
    const monthlySaving = calculateRecommendedSavingsForPhase(phase.startYear, phase.endYear, factors);
    const risk: SavingsRiskLevel = monthlySaving >= 1000 ? "High" : monthlySaving >= 700 ? "Medium" : "Low";
    return { ...phase, monthlySaving, risk, reason: getSavingsPhaseReason(phase.name, factors, risk) };
  });
}

function calculateRecommendedSavingsForPhase(startYear: number, endYear: number, factors: TimelineSavingsFactors) {
  let amount = 400;
  const breaksInRange = factors.breakNodes.filter((item) => {
    const year = Math.round(item.displayYear ?? item.targetYear);
    return year >= startYear && year <= endYear + 3;
  });
  amount += breaksInRange.length * 250;
  breaksInRange.forEach((item) => {
    const months = item.durationMonths ?? getDefaultDurationMonths(item.lifeGoalKey);
    amount += months >= 24 ? 600 : months >= 12 ? 300 : 150;
  });
  if (factors.hasHouse && factors.houseYear !== null && factors.houseYear <= endYear + 1 && factors.houseYear >= startYear - 1) amount += 300;
  if (factors.hasFamilyPlanning && factors.familyYear !== null && factors.familyYear <= endYear + 1 && factors.familyYear >= startYear - 1) amount += 250;
  if (factors.hasRelocation && factors.relocationYear !== null && factors.relocationYear <= endYear + 1 && factors.relocationYear >= startYear - 1) amount += 350;
  if (factors.hasRetirement && factors.retirementYear !== null && factors.retirementYear <= endYear + 2 && factors.retirementYear >= startYear - 1) amount += 200;
  if (factors.hasSideIncome && factors.sideIncomeYear !== null && factors.sideIncomeYear <= startYear) amount -= 200;
  if (factors.hasInvesting && factors.investingYear !== null && factors.investingYear <= startYear) amount -= 100;
  return Math.min(2500, Math.max(300, amount));
}

function getSavingsPhaseReason(name: string, factors: TimelineSavingsFactors, risk: SavingsRiskLevel) {
  if (name.includes("Break") && factors.nearestBreakYear !== null) return `A planned break is near Year ${factors.nearestBreakYear}, so CareerOS increases the buffer before that period.`;
  if (name.includes("Returning")) return "Savings pressure decreases after the planned break ends and work stability returns.";
  if (name.includes("Commitment")) return "Major life commitments on the timeline create higher fixed responsibility around this phase.";
  if (factors.hasSideIncome && risk !== "High") return "Side income on the roadmap reduces some savings pressure after it begins.";
  if (factors.breakNodes.length === 0 && !factors.hasHouse && !factors.hasFamilyPlanning && !factors.hasRelocation) return "Continuous employment with no major interruption supports a steady savings target.";
  return "CareerOS balances upcoming life chapters, breaks, and support goals to set this monthly target.";
}

function getSavingsChangeSummary(factors: TimelineSavingsFactors) {
  if (factors.breakNodes.length > 0 && factors.hasSideIncome) return "Your savings strategy increased before the planned break, then eases after your side income begins.";
  if (factors.breakNodes.length > 0) return "Your timeline includes a planned break, so CareerOS increases recommended savings before that period.";
  if (factors.hasHouse || factors.hasFamilyPlanning || factors.hasRelocation) return "Major life commitments on your timeline increase savings pressure before and around those chapters.";
  if (factors.hasSideIncome || factors.hasInvesting) return "Support goals like side income or investing reduce some long-term savings pressure after they begin.";
  return "Your current timeline shows continuous career progression, so CareerOS recommends a steady savings path.";
}

function generateSavingsAnalysis(factors: TimelineSavingsFactors, phases: SavingsPhase[]) {
  const peak = phases.reduce((highest, phase) => phase.monthlySaving > highest.monthlySaving ? phase : highest, phases[0]);
  if (factors.breakNodes.length > 0) {
    return {
      text: `Because you have planned ${factors.hasLongBreak ? "a one-year or longer" : "a"} career break, CareerOS recommends strengthening emergency savings before the break begins.${factors.hasSideIncome ? " Your planned side income helps reduce some financial pressure after it starts." : ""}`,
      takeaway: `Build the strongest buffer during ${peak.name}.`,
    };
  }
  if (factors.hasHouse || factors.hasFamilyPlanning) {
    return {
      text: "Your timeline includes higher-responsibility life chapters, so CareerOS recommends increasing savings before these commitments become active.",
      takeaway: "Raise your emergency buffer before fixed responsibilities increase.",
    };
  }
  return {
    text: "Your current timeline shows continuous employment with no planned interruption. CareerOS recommends a steady savings path focused on flexibility rather than preparing for a major break.",
    takeaway: "Maintain a consistent savings rhythm while your career grows.",
  };
}

function getSavingsRiskColor(risk: SavingsRiskLevel) {
  if (risk === "High") return "#C8003F";
  if (risk === "Medium") return "#A66A00";
  return "#147A55";
}

function getSavingsRiskBg(risk: SavingsRiskLevel) {
  if (risk === "High") return "#FFE8EE";
  if (risk === "Medium") return "#FFF4D8";
  return "#E9F8F1";
}

function getSavingsFactorBg(type: SavingsFactor["type"]) {
  if (type === "risk") return "#FFF4D8";
  if (type === "support") return "#E9F8F1";
  return "#EEF3FA";
}

function getSavingsFactorColor(type: SavingsFactor["type"]) {
  if (type === "risk") return "#8A5A00";
  if (type === "support") return "#147A55";
  return "#46536D";
}

function getSavingsFactorRing(type: SavingsFactor["type"]) {
  if (type === "risk") return "#F2D48B";
  if (type === "support") return "#BCEBD6";
  return "#D7DEEA";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function StabilityGapMeter() {
  const [expenses, setExpenses] = useState(3000);
  const [savings, setSavings] = useState(6000);
  const [coverage, setCoverage] = useState(6);
  const [capacity, setCapacity] = useState(800);
  const target = expenses * coverage;
  const gap = Math.max(0, target - savings);
  const monthsNeeded = capacity > 0 ? Math.ceil(gap / capacity) : 0;
  const currentCoverage = expenses > 0 ? savings / expenses : 0;
  const status = currentCoverage < 1 ? "Fragile" : currentCoverage < 3 ? "Building" : currentCoverage < 6 ? "Stable" : "Flexible";

  return (
    <GoalFeaturePanel title="Stability Gap Meter" eyebrow="Emergency Savings">
      <div className="grid gap-3 md:grid-cols-4">
        <NumberField label="Monthly essentials" prefix="RM" value={expenses} min={1} max={50000} onChange={setExpenses} />
        <NumberField label="Emergency savings" prefix="RM" value={savings} min={0} max={500000} onChange={setSavings} />
        <NumberField label="Target coverage" suffix="months" value={coverage} min={1} max={24} onChange={setCoverage} />
        <NumberField label="Monthly saving capacity" prefix="RM" value={capacity} min={1} max={50000} onChange={setCapacity} />
      </div>
      <div className="mt-5"><ProgressBar value={(currentCoverage / coverage) * 100} /></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniMetric label="Current coverage" value={`${currentCoverage.toFixed(1)} months`} />
        <MiniMetric label="Target fund" value={formatRm(target)} />
        <MiniMetric label="Gap amount" value={formatRm(gap)} />
        <MiniMetric label="Estimated time" value={gap === 0 ? "Unlocked" : `${monthsNeeded} months`} />
      </div>
      <p className="mt-4 rounded-full bg-[#081433] px-5 py-3 text-sm font-semibold text-white">{status}: career flexibility unlocked as coverage improves.</p>
    </GoalFeaturePanel>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CareerFlexibilityUnlocks() {
  const unlocks = ["Reject poor-fit jobs", "Handle small emergencies", "Negotiate salary calmly", "Switch industries", "Support family needs", "Take a short recovery period"];
  return (
    <GoalFeaturePanel title="Career Flexibility Unlocks" eyebrow="Emergency Savings">
      <div className="grid gap-3 md:grid-cols-3">
        {unlocks.map((item, index) => (
          <div key={item} className="rounded-[1.4rem] bg-[#FFF7FA] p-4">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#E00046]">{index < 2 ? "1-3 months" : index < 4 ? "3-6 months" : "6+ months"}</span>
            <p className="mt-3 text-sm font-semibold text-[#081433]">{item}</p>
          </div>
        ))}
      </div>
    </GoalFeaturePanel>
  );
}

function BuyHouseGoalFeatures({ node, timelineNodes }: { node: TimelineNode; timelineNodes: TimelineNode[] }) {
  return <LocationHotspotMap node={node} timelineNodes={timelineNodes} />;
}

type HotspotLocation = "Selangor" | "Kuala Lumpur" | "Penang" | "Johor" | "Perak" | "Sabah" | "Sarawak";

type HouseSectorCard = {
  sector: string;
  score: number;
  level: string;
  explanation: string;
  relevance: string;
  visual: string;
};

type HouseRoleCategory = "design" | "data" | "software" | "business" | "general";

type HouseLocationSuggestion = {
  id: string;
  location: string;
  opportunityFit: string;
  housingPressure: string;
  lifestyleFit: string;
  careerFit: string;
  reason: string;
  bestFor: string;
  visual: string;
};

type HouseStateProfile = {
  careerFit: string;
  housingPressure: string;
  lifestyleFit: string;
  summary: string;
  sectors: HouseSectorCard[];
};

const houseStateProfiles: Record<HotspotLocation, HouseStateProfile> = {
  Selangor: {
    careerFit: "High",
    housingPressure: "High",
    lifestyleFit: "Urban/Suburban",
    summary: "Selangor gives strong career access, especially for tech, corporate, design, and business roles. However, housing pressure is higher, so the system may recommend longer preparation, higher savings buffer, or nearby commuter areas.",
    sectors: [
      { sector: "Technology", score: 5, level: "High", explanation: "Selangor has strong access to tech, digital transformation, SaaS, and corporate innovation roles due to its proximity to KL and major business districts.", relevance: "Strong for software, data, UX, product, and digital roles.", visual: "tech" },
      { sector: "Corporate / Business", score: 5, level: "High", explanation: "Business parks and corporate hubs create steady access to operations, management, sales, and analyst roles.", relevance: "Useful for users building corporate momentum before buying.", visual: "business" },
      { sector: "Design / Product", score: 5, level: "High", explanation: "Agencies, product teams, ecommerce companies, and digital teams make design access stronger than most states.", relevance: "Strong for UX, UI, product design, and content design paths.", visual: "design" },
      { sector: "Manufacturing", score: 4, level: "Medium-High", explanation: "Industrial areas support manufacturing, supply chain, engineering, and process improvement careers.", relevance: "Good for engineering, operations, quality, and logistics-adjacent roles.", visual: "factory" },
      { sector: "Healthcare", score: 3, level: "Medium", explanation: "Private and public healthcare access is solid, especially around urban and suburban growth corridors.", relevance: "Relevant for healthcare, admin, support, and specialist roles.", visual: "health" },
      { sector: "Education", score: 3, level: "Medium", explanation: "Schools, colleges, training providers, and upskilling centres create consistent but competitive education options.", relevance: "Helpful for teaching, training, coaching, and education support careers.", visual: "education" },
    ],
  },
  "Kuala Lumpur": {
    careerFit: "Very High",
    housingPressure: "Very High",
    lifestyleFit: "Urban",
    summary: "Kuala Lumpur offers the strongest access to corporate, finance, tech, consulting, and regional office opportunities. However, housing and living costs are higher, so this location may suit users who prioritise career acceleration and urban convenience.",
    sectors: [
      { sector: "Finance", score: 5, level: "Very High", explanation: "KL is Malaysia's finance centre with strong access to banking, fintech, audit, risk, investment, and corporate finance roles.", relevance: "Strong for finance, fintech, analysis, and regional business paths.", visual: "finance" },
      { sector: "Corporate / Business", score: 5, level: "Very High", explanation: "Regional offices, HQ teams, consulting firms, and large companies create dense business opportunities.", relevance: "Excellent for management, strategy, sales, operations, and analyst careers.", visual: "business" },
      { sector: "Technology", score: 4, level: "High", explanation: "Tech hiring is strong across software, cloud, data, fintech, product, and digital transformation teams.", relevance: "Strong for software, data, UX, product, and digital roles.", visual: "tech" },
      { sector: "Consulting", score: 4, level: "High", explanation: "Consulting and advisory roles are concentrated in KL because clients and corporate headquarters are nearby.", relevance: "Good for users targeting faster exposure and client-facing growth.", visual: "consulting" },
      { sector: "Design / Product", score: 4, level: "High", explanation: "Digital agencies, fintech teams, startups, and corporate product teams provide strong design exposure.", relevance: "Relevant for UX, service design, product design, and research roles.", visual: "design" },
      { sector: "Healthcare", score: 3, level: "Medium", explanation: "Healthcare opportunities are available, though cost and commute pressure may affect lifestyle fit.", relevance: "Useful for health, admin, specialist, and support careers.", visual: "health" },
    ],
  },
  Penang: {
    careerFit: "High",
    housingPressure: "Medium",
    lifestyleFit: "Balanced / Industrial Tech",
    summary: "Penang is strong for manufacturing, semiconductor, engineering, and technology-related careers. It may fit users who want a balance between career opportunity, lower pressure than KL, and access to industrial technology roles.",
    sectors: [
      { sector: "Manufacturing", score: 5, level: "Very High", explanation: "Penang has strong semiconductor, electronics, and advanced manufacturing presence.", relevance: "Strong for engineering, operations, quality, and process roles.", visual: "factory" },
      { sector: "Technology", score: 4, level: "High", explanation: "Technology opportunities are linked to hardware, software, industrial systems, and digital support for manufacturing.", relevance: "Good for technical, data, automation, and product-adjacent careers.", visual: "tech" },
      { sector: "Engineering", score: 4, level: "High", explanation: "Engineering access is strong due to electronics, semiconductor, and industrial employers.", relevance: "Strong for mechanical, electrical, process, and systems careers.", visual: "engineering" },
      { sector: "Logistics", score: 3, level: "Medium", explanation: "Port access and manufacturing supply chains create logistics and coordination roles.", relevance: "Relevant for supply chain, operations, and procurement paths.", visual: "logistics" },
      { sector: "Healthcare", score: 3, level: "Medium", explanation: "Healthcare access is stable, especially in urban centres and medical support services.", relevance: "Useful for healthcare, admin, and support roles.", visual: "health" },
      { sector: "Design / Product", score: 3, level: "Medium", explanation: "Design and product roles exist, but are more specialised than in KL or Selangor.", relevance: "Works best with hybrid, remote, or technical product paths.", visual: "design" },
    ],
  },
  Johor: {
    careerFit: "Medium-High",
    housingPressure: "Medium",
    lifestyleFit: "Cross-border / Industrial",
    summary: "Johor offers access to logistics, manufacturing, property, and cross-border opportunities linked to Singapore. It may fit users who want regional exposure while keeping a lower base cost compared to Singapore.",
    sectors: [
      { sector: "Logistics", score: 4, level: "High", explanation: "Johor benefits from logistics corridors, ports, and cross-border movement.", relevance: "Strong for operations, supply chain, procurement, and regional roles.", visual: "logistics" },
      { sector: "Manufacturing", score: 4, level: "High", explanation: "Industrial parks and manufacturing growth create steady technical and operational roles.", relevance: "Good for engineering, production, quality, and plant operations.", visual: "factory" },
      { sector: "Singapore Access", score: 4, level: "High", explanation: "Proximity to Singapore can widen career access while keeping Malaysia as a lower base-cost home location.", relevance: "Useful for users considering cross-border or regional exposure.", visual: "regional" },
      { sector: "Technology", score: 3, level: "Medium", explanation: "Technology access is emerging, with some support from Singapore-linked demand and local digital growth.", relevance: "Works for users with hybrid, remote, or cross-border tech options.", visual: "tech" },
      { sector: "Corporate / Business", score: 3, level: "Medium", explanation: "Business roles are present, especially around property, operations, logistics, and regional services.", relevance: "Relevant for operations, sales, admin, and management tracks.", visual: "business" },
      { sector: "Healthcare", score: 3, level: "Medium", explanation: "Healthcare access is stable in growing urban areas and private services.", relevance: "Useful for healthcare and support careers.", visual: "health" },
    ],
  },
  Perak: {
    careerFit: "Medium",
    housingPressure: "Low-Medium",
    lifestyleFit: "Slower-paced / Affordable",
    summary: "Perak may suit users who prioritise affordability, family stability, and a lower-pressure lifestyle. Career opportunities may be more limited compared to KL, Selangor, and Penang, so remote or hybrid career options become more important.",
    sectors: [
      { sector: "Education", score: 3, level: "Medium", explanation: "Education and training roles are stable in established towns and community centres.", relevance: "Good for teaching, training, tutoring, and education support careers.", visual: "education" },
      { sector: "Healthcare", score: 3, level: "Medium", explanation: "Healthcare demand remains steady, especially for local community support and public/private services.", relevance: "Useful for healthcare, admin, and care-related roles.", visual: "health" },
      { sector: "Manufacturing", score: 3, level: "Medium", explanation: "Manufacturing options exist, though access is less dense than Penang or Selangor.", relevance: "Relevant for operations, quality, technical, and factory roles.", visual: "factory" },
      { sector: "Tourism", score: 3, level: "Medium", explanation: "Tourism and heritage areas can support hospitality, services, and local business careers.", relevance: "Useful for service, hospitality, and local entrepreneurship paths.", visual: "tourism" },
      { sector: "Technology", score: 2, level: "Low-Medium", explanation: "Technology opportunities may depend more on remote work, hybrid teams, or entrepreneurship.", relevance: "Best for users who can keep remote or flexible tech access.", visual: "tech" },
      { sector: "Corporate / Business", score: 2, level: "Low-Medium", explanation: "Business opportunities exist but are less concentrated than major urban hubs.", relevance: "Works best for local business, operations, or remote corporate roles.", visual: "business" },
    ],
  },
  Sabah: {
    careerFit: "Medium",
    housingPressure: "Medium",
    lifestyleFit: "Nature / Regional",
    summary: "Sabah may support users who value lifestyle, nature, tourism, regional development, and local community connection. Career growth may depend more on sector fit, remote work, entrepreneurship, or public/private regional opportunities.",
    sectors: [
      { sector: "Tourism", score: 4, level: "High", explanation: "Tourism is a major strength, supporting hospitality, operations, marketing, and experience-led businesses.", relevance: "Strong for hospitality, marketing, service design, and local entrepreneurship.", visual: "tourism" },
      { sector: "Healthcare", score: 3, level: "Medium", explanation: "Healthcare access is important for regional support and community needs.", relevance: "Useful for healthcare, care, admin, and public service roles.", visual: "health" },
      { sector: "Education", score: 3, level: "Medium", explanation: "Education roles can support local development, training, and community impact.", relevance: "Good for teaching, training, coaching, and education support.", visual: "education" },
      { sector: "Regional Business", score: 3, level: "Medium", explanation: "Regional business opportunities may come from local services, tourism, trade, and public/private development.", relevance: "Relevant for operations, sales, admin, and entrepreneurship.", visual: "regional" },
      { sector: "Technology", score: 2, level: "Low-Medium", explanation: "Tech growth is more dependent on remote work, local digital adoption, or entrepreneurial paths.", relevance: "Best with remote roles, freelancing, or digital business models.", visual: "tech" },
      { sector: "Logistics", score: 3, level: "Medium", explanation: "Regional geography and trade needs create logistics and coordination work.", relevance: "Useful for operations, supply chain, and coordination careers.", visual: "logistics" },
    ],
  },
  Sarawak: {
    careerFit: "Medium",
    housingPressure: "Medium",
    lifestyleFit: "Regional / Emerging",
    summary: "Sarawak may suit users interested in regional development, energy, public sector, education, healthcare, and emerging digital opportunities. It may offer lifestyle stability, but users should consider whether their career sector has enough local demand.",
    sectors: [
      { sector: "Energy", score: 4, level: "High", explanation: "Energy and regional development create specialist, operational, technical, and public/private sector opportunities.", relevance: "Strong for engineering, operations, project, and regional development roles.", visual: "energy" },
      { sector: "Healthcare", score: 3, level: "Medium", explanation: "Healthcare demand supports public, private, and community service careers.", relevance: "Useful for healthcare, admin, support, and care roles.", visual: "health" },
      { sector: "Education", score: 3, level: "Medium", explanation: "Education access supports training, teaching, upskilling, and public development work.", relevance: "Good for teaching, training, coaching, and education support.", visual: "education" },
      { sector: "Regional Business", score: 3, level: "Medium", explanation: "Regional business opportunities come through services, government-linked work, trade, and local companies.", relevance: "Relevant for operations, sales, admin, and management careers.", visual: "regional" },
      { sector: "Technology", score: 3, level: "Medium", explanation: "Digital opportunities are emerging, especially where technology supports public, business, and regional transformation.", relevance: "Works for digital, data, product, and remote-friendly careers.", visual: "tech" },
      { sector: "Tourism", score: 3, level: "Medium", explanation: "Tourism and culture can support hospitality, marketing, service, and local business work.", relevance: "Useful for service, marketing, experience, and entrepreneurship paths.", visual: "tourism" },
    ],
  },
};

function LocationHotspotMap({ node, timelineNodes }: { node: TimelineNode; timelineNodes: TimelineNode[] }) {
  const states = Object.keys(houseStateProfiles) as HotspotLocation[];
  const [selectedLocation, setSelectedLocation] = useState<HotspotLocation>("Selangor");
  const [activeCard, setActiveCard] = useState(0);
  const currentRole = findCurrentCareerRoleForGoal(node, timelineNodes);
  const roleCategory = getRoleOpportunityCategory(currentRole);
  const suggestions = generateHouseLocationSuggestions(currentRole, selectedLocation);
  const activeSuggestion = suggestions[activeCard] ?? suggestions[0];
  const moveCard = (direction: 1 | -1) => {
    setActiveCard((current) => (current + direction + suggestions.length) % suggestions.length);
  };

  return (
    <GoalFeaturePanel title={`Location Opportunity Preview for ${currentRole}`} eyebrow="Buy a House">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-3xl text-sm font-semibold leading-6 text-[#46536D]">
          CareerOS compares housing areas based on {currentRole} opportunity fit, housing pressure, and lifestyle match around {node.time}.
        </p>
        <span className="rounded-full bg-[#FFF7FA] px-3 py-1 text-xs font-semibold text-[#E00046] ring-1 ring-[#F5CBD6]">
          Current timeline role: {currentRole}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[#081433]">Select a state</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
          {states.map((state) => {
            const active = state === selectedLocation;
            return (
              <button
                key={state}
                type="button"
                onClick={() => {
                  setSelectedLocation(state);
                  setActiveCard(0);
                }}
                className="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  borderColor: active ? theme.rose2 : theme.border,
                  backgroundColor: active ? theme.rose2 : "#fff",
                  color: active ? "#fff" : theme.muted,
                  boxShadow: active ? "0 12px 26px rgba(224,0,70,0.18)" : "0 8px 18px rgba(21,34,56,0.06)",
                }}
              >
                {state}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#081433]">{selectedLocation} role-aware opportunities</p>
            <p className="mt-1 text-xs font-semibold text-[#46536D]">Areas compared against your current {currentRole} path.</p>
          </div>
          <div className="flex gap-2">
            <CarouselArrow label="Previous location" onClick={() => moveCard(-1)} direction="left" />
            <CarouselArrow label="Next location" onClick={() => moveCard(1)} direction="right" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-[#F8F9FB] px-3 py-8 shadow-inner sm:px-6">
          <div className="relative min-h-[430px]">
            {suggestions.map((suggestion, index) => (
              <HouseOpportunityCard
                key={`${selectedLocation}-${suggestion.id}`}
                suggestion={suggestion}
                role={currentRole}
                active={index === activeCard}
                offset={getHouseCarouselOffset(index, activeCard, suggestions.length)}
              />
            ))}
          </div>
          <div className="mt-5 flex justify-center gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                type="button"
                aria-label={`Show ${suggestion.location}`}
                onClick={() => setActiveCard(index)}
                className="h-2.5 rounded-full transition"
                style={{ width: index === activeCard ? 28 : 10, backgroundColor: index === activeCard ? theme.rose2 : "#DDE3EE" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 overflow-hidden rounded-[1.8rem] bg-[#FFF7FA] ring-1 ring-[#F5CBD6]">
        <div className="border-l-4 border-[#E00046] p-5">
          <p className="text-base font-semibold text-[#081433]">Why it may fit your plan</p>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-[#46536D]">
            {activeSuggestion.location} may fit your plan because it gives you {activeSuggestion.opportunityFit.toLowerCase()} access to {currentRole} opportunities, while housing pressure stays {activeSuggestion.housingPressure.toLowerCase()}.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <HouseInsightMetric icon={BriefcaseBusiness} label="Career Fit" value={activeSuggestion.careerFit} text={roleCategory === "general" ? "Matches your current career direction." : `Matches your ${currentRole} opportunity path.`} tone="green" />
            <HouseInsightMetric icon={Home} label="Housing Pressure" value={activeSuggestion.housingPressure} text={activeSuggestion.housingPressure.includes("High") ? "Needs stronger savings preparation." : "Keeps ownership pressure more manageable."} tone="amber" />
            <HouseInsightMetric icon={Compass} label="Lifestyle Fit" value={activeSuggestion.lifestyleFit} text="Balances commute and daily living." tone="blue" />
          </div>
        </div>
      </div>
    </GoalFeaturePanel>
  );
}

function HouseOpportunityCard({
  suggestion,
  role,
  active,
  offset,
}: {
  suggestion: HouseLocationSuggestion;
  role: string;
  active: boolean;
  offset: number;
}) {
  const visible = Math.abs(offset) <= 1;
  return (
    <motion.article
      animate={{
        x: `calc(-50% + ${offset * 340}px)`,
        opacity: active ? 1 : visible ? 0.52 : 0,
        scale: active ? 1 : 0.9,
        y: active ? 0 : 12,
      }}
      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute left-1/2 top-0 min-h-[410px] w-[min(78vw,360px)] overflow-hidden rounded-[1.8rem] bg-white ring-1 ${active ? "shadow-[0_26px_64px_rgba(21,34,56,0.16)] ring-[#F5CBD6]" : "shadow-[0_16px_34px_rgba(21,34,56,0.08)] ring-[#E5E8F0]"}`}
      style={{ zIndex: active ? 2 : visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="h-2 bg-[linear-gradient(90deg,#081433,#F04D7A,#C86B2B)]" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-xl font-semibold text-[#081433]">{suggestion.location}</h4>
          </div>
          <span className="rounded-full bg-[#FFF7FA] px-3 py-1 text-xs font-semibold text-[#E00046] ring-1 ring-[#F5CBD6]">{role} fit</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#081433] px-3 py-1 text-xs font-semibold text-white">{suggestion.careerFit}</span>
          <span className="rounded-full bg-[#F8F9FB] px-3 py-1 text-xs font-semibold text-[#46536D] ring-1 ring-[#E5E8F0]">{suggestion.bestFor}</span>
        </div>

        <div className="mt-5 grid gap-3">
          <HouseMiniMetric label="Opportunity fit" value={suggestion.opportunityFit} />
          <HouseMiniMetric label="Housing pressure" value={suggestion.housingPressure} />
          <HouseMiniMetric label="Lifestyle fit" value={suggestion.lifestyleFit} />
        </div>

        <p className="mt-5 text-sm font-semibold leading-6 text-[#46536D]">{suggestion.reason}</p>
      </div>
      <div className="absolute bottom-4 right-4 h-20 w-20 opacity-70">
        <HouseSectorMotif visual={suggestion.visual} />
      </div>
    </motion.article>
  );
}

function HouseMiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] bg-[#F8F9FB] px-4 py-3 ring-1 ring-[#E5E8F0]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#46536D]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#081433]">{value}</p>
    </div>
  );
}

function HouseInsightMetric({ icon: Icon, label, value, text, tone }: { icon: LucideIcon; label: string; value: string; text: string; tone: "green" | "amber" | "blue" | "rose" }) {
  const styles = {
    green: { bg: "#E9F8F1", color: "#147A55", ring: "#CDECDD" },
    amber: { bg: "#FFF4D8", color: "#8A5A00", ring: "#F3DE9A" },
    blue: { bg: "#EEF2FF", color: "#4F46E5", ring: "#DDE3FF" },
    rose: { bg: "#FFE8EE", color: "#C8003F", ring: "#F7C1CF" },
  }[tone];
  return (
    <div className="rounded-[1.2rem] bg-white p-4 shadow-sm ring-1 ring-[#E5E8F0]">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full ring-1" style={{ backgroundColor: styles.bg, color: styles.color, ["--tw-ring-color" as string]: styles.ring } as React.CSSProperties}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#46536D]">{label}</p>
          <p className="text-lg font-semibold text-[#081433]">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-[#46536D]">{text}</p>
    </div>
  );
}

function getHouseCarouselOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function isCareerNode(node: TimelineNode) {
  return node.type === "career";
}

function getReachedCareerRoleForNode(selectedNode: TimelineNode, allNodes: TimelineNode[]): ReachedCareerRole {
  const selectedIndex = allNodes.findIndex((item) => item.id === selectedNode.id);
  const safeIndex = selectedIndex >= 0 ? selectedIndex : allNodes.findIndex((item) => item.id === selectedNode.id || item.title === selectedNode.title);

  if (isCareerNode(selectedNode)) {
    return { roleTitle: selectedNode.title, roleType: "current", upcomingRoleTitle: allNodes.slice(Math.max(safeIndex, 0) + 1).find(isCareerNode)?.title };
  }

  for (let index = safeIndex - 1; index >= 0; index -= 1) {
    if (isCareerNode(allNodes[index])) {
      return {
        roleTitle: allNodes[index].title,
        roleType: "current",
        upcomingRoleTitle: allNodes.slice(safeIndex + 1).find(isCareerNode)?.title,
      };
    }
  }

  const upcoming = allNodes.slice(Math.max(safeIndex, -1) + 1).find(isCareerNode);
  if (upcoming) return { roleTitle: upcoming.title, roleType: "upcoming", upcomingRoleTitle: upcoming.title };
  return { roleTitle: "your current career direction", roleType: "fallback" };
}

function findCurrentCareerRoleForGoal(selectedGoalNode: TimelineNode, allNodes: TimelineNode[]) {
  return getReachedCareerRoleForNode(selectedGoalNode, allNodes).roleTitle;
}

function getRoleOpportunityCategory(roleTitle: string): HouseRoleCategory {
  const value = roleTitle.toLowerCase();
  if (value.includes("ux") || value.includes("ui") || value.includes("design") || value.includes("product")) return "design";
  if (value.includes("data") || value.includes("analytics") || value.includes("analyst")) return "data";
  if (value.includes("software") || value.includes("engineer") || value.includes("developer") || value.includes("tech")) return "software";
  if (value.includes("marketing") || value.includes("business") || value.includes("growth") || value.includes("sales")) return "business";
  return "general";
}

function generateHouseLocationSuggestions(roleTitle: string, state: HotspotLocation): HouseLocationSuggestion[] {
  const category = getRoleOpportunityCategory(roleTitle);
  const roleCopy = getHouseRoleCopy(category, roleTitle);
  const areas: Record<HotspotLocation, { location: string; pressure: string; lifestyle: string; visual: string; fitBoost: string; bestFor: string }[]> = {
    Selangor: [
      { location: "Petaling Jaya", pressure: "High", lifestyle: "Urban/Suburban", visual: "design", fitBoost: "Strong", bestFor: "Product teams" },
      { location: "Cyberjaya", pressure: "Medium", lifestyle: "Planned township", visual: "tech", fitBoost: "Moderate", bestFor: "Digital roles" },
      { location: "Shah Alam", pressure: "Medium-High", lifestyle: "Suburban", visual: "business", fitBoost: "Good", bestFor: "Stable commute" },
      { location: "Subang Jaya", pressure: "High", lifestyle: "Connected suburb", visual: "regional", fitBoost: "Strong", bestFor: "Hybrid work" },
    ],
    "Kuala Lumpur": [
      { location: "Kuala Lumpur City Centre", pressure: "Very High", lifestyle: "Urban", visual: "finance", fitBoost: "Very strong", bestFor: "Career access" },
      { location: "Bangsar South", pressure: "Very High", lifestyle: "Urban tech corridor", visual: "tech", fitBoost: "Very strong", bestFor: "Corporate teams" },
      { location: "Cheras", pressure: "Medium-High", lifestyle: "Urban/Suburban", visual: "business", fitBoost: "Good", bestFor: "Cost balance" },
      { location: "Mont Kiara", pressure: "Very High", lifestyle: "International urban", visual: "consulting", fitBoost: "Strong", bestFor: "Regional exposure" },
    ],
    Penang: [
      { location: "Bayan Lepas", pressure: "Medium", lifestyle: "Industrial tech", visual: "engineering", fitBoost: "Strong", bestFor: "Tech employers" },
      { location: "George Town", pressure: "Medium-High", lifestyle: "Urban heritage", visual: "design", fitBoost: "Good", bestFor: "Creative access" },
      { location: "Batu Kawan", pressure: "Medium", lifestyle: "Emerging township", visual: "factory", fitBoost: "Moderate", bestFor: "Growth areas" },
      { location: "Tanjung Tokong", pressure: "High", lifestyle: "Coastal urban", visual: "regional", fitBoost: "Good", bestFor: "Lifestyle balance" },
    ],
    Johor: [
      { location: "Iskandar Puteri", pressure: "Medium", lifestyle: "Regional township", visual: "regional", fitBoost: "Good", bestFor: "Regional exposure" },
      { location: "Johor Bahru", pressure: "Medium-High", lifestyle: "Cross-border urban", visual: "logistics", fitBoost: "Strong", bestFor: "Singapore access" },
      { location: "Tebrau", pressure: "Medium", lifestyle: "Suburban", visual: "business", fitBoost: "Moderate", bestFor: "Family stability" },
      { location: "Pasir Gudang", pressure: "Low-Medium", lifestyle: "Industrial", visual: "factory", fitBoost: "Moderate", bestFor: "Operations roles" },
    ],
    Perak: [
      { location: "Ipoh", pressure: "Low-Medium", lifestyle: "Affordable city", visual: "education", fitBoost: "Moderate", bestFor: "Lower pressure" },
      { location: "Taiping", pressure: "Low", lifestyle: "Slower-paced", visual: "health", fitBoost: "Limited", bestFor: "Lifestyle stability" },
      { location: "Seri Iskandar", pressure: "Low-Medium", lifestyle: "Education township", visual: "education", fitBoost: "Moderate", bestFor: "Learning hubs" },
      { location: "Kampar", pressure: "Low", lifestyle: "Student town", visual: "business", fitBoost: "Limited", bestFor: "Affordable base" },
    ],
    Sabah: [
      { location: "Kota Kinabalu", pressure: "Medium", lifestyle: "Regional urban", visual: "tourism", fitBoost: "Moderate", bestFor: "Regional access" },
      { location: "Penampang", pressure: "Medium", lifestyle: "Suburban", visual: "regional", fitBoost: "Moderate", bestFor: "Lifestyle balance" },
      { location: "Sandakan", pressure: "Low-Medium", lifestyle: "Regional", visual: "logistics", fitBoost: "Limited", bestFor: "Lower pressure" },
      { location: "Tuaran", pressure: "Low-Medium", lifestyle: "Nature/Suburban", visual: "tourism", fitBoost: "Limited", bestFor: "Space and calm" },
    ],
    Sarawak: [
      { location: "Kuching", pressure: "Medium", lifestyle: "Regional city", visual: "regional", fitBoost: "Moderate", bestFor: "Regional access" },
      { location: "Miri", pressure: "Medium", lifestyle: "Energy corridor", visual: "energy", fitBoost: "Good", bestFor: "Specialist sectors" },
      { location: "Sibu", pressure: "Low-Medium", lifestyle: "Local business", visual: "business", fitBoost: "Limited", bestFor: "Affordable base" },
      { location: "Bintulu", pressure: "Medium", lifestyle: "Industrial growth", visual: "factory", fitBoost: "Moderate", bestFor: "Industrial access" },
    ],
  };

  return areas[state].map((area, index) => ({
    id: `${state}-${area.location}`,
    location: area.location,
    opportunityFit: area.fitBoost,
    housingPressure: area.pressure,
    lifestyleFit: area.lifestyle,
    careerFit: area.fitBoost === "Very strong" ? "Very High" : area.fitBoost === "Strong" ? "High" : area.fitBoost === "Good" ? "Medium-High" : area.fitBoost,
    reason: buildHouseLocationReason(roleCopy, area),
    bestFor: area.bestFor,
    visual: index === 0 && category === "data" ? "finance" : index === 0 && category === "software" ? "tech" : area.visual,
  }));
}

function getHouseRoleCopy(category: HouseRoleCategory, roleTitle: string) {
  if (category === "design") return { role: roleTitle, opportunity: "design, product, startup, agency, and digital product roles" };
  if (category === "data") return { role: roleTitle, opportunity: "data analyst, business intelligence, reporting, finance, tech, and consulting roles" };
  if (category === "software") return { role: roleTitle, opportunity: "software engineering, tech company, startup, and digital product team roles" };
  if (category === "business") return { role: roleTitle, opportunity: "marketing, campaign, business development, corporate, agency, and client-facing roles" };
  return { role: roleTitle, opportunity: "professional opportunities connected to your current career direction" };
}

function buildHouseLocationReason(roleCopy: { role: string; opportunity: string }, area: { location: string; pressure: string; lifestyle: string; fitBoost: string }) {
  const pressureNote = area.pressure.includes("High") || area.pressure.includes("Very")
    ? "but housing cost may require stronger savings planning"
    : "with more manageable housing pressure than central high-cost areas";
  return `${area.location} gives ${area.fitBoost.toLowerCase()} access to ${roleCopy.opportunity}, ${pressureNote}.`;
}

function CarouselArrow({ label, onClick, direction }: { label: string; onClick: () => void; direction: "left" | "right" }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#E00046] shadow-[0_12px_28px_rgba(21,34,56,0.13)] ring-1 ring-[#E5E8F0] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(21,34,56,0.16)] active:translate-y-0 active:scale-95"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function HouseSectorMotif({ visual }: { visual: string }) {
  if (visual === "finance") {
    return (
      <div className="absolute bottom-6 left-7 right-7 flex h-24 items-end gap-3 rounded-[1.2rem] border border-white/20 bg-white/12 p-4">
        {[34, 52, 42, 68, 82].map((height, index) => <span key={index} className="w-8 rounded-t-full bg-white/55" style={{ height }} />)}
      </div>
    );
  }
  if (visual === "logistics" || visual === "regional") {
    return (
      <div className="absolute bottom-8 left-8 right-8 h-24 rounded-[1.2rem] border border-white/20 bg-white/12">
        <div className="absolute left-5 top-11 h-1 w-[72%] rounded-full bg-white/45" />
        <div className="absolute left-4 top-8 h-7 w-7 rounded-full border-4 border-white/70" />
        <div className="absolute right-8 top-5 h-10 w-10 rounded-full border-4 border-white/70" />
        <div className="absolute bottom-4 left-1/2 h-8 w-8 rounded-full border-4 border-white/55" />
      </div>
    );
  }
  if (visual === "education") {
    return (
      <div className="absolute bottom-7 left-8 right-8 grid h-24 grid-cols-2 gap-3">
        <div className="rounded-l-[1.2rem] border border-white/20 bg-white/22" />
        <div className="rounded-r-[1.2rem] border border-white/20 bg-white/12" />
        <div className="absolute left-1/2 top-2 h-20 w-1 -translate-x-1/2 rounded-full bg-white/45" />
      </div>
    );
  }
  if (visual === "health") {
    return (
      <div className="absolute bottom-8 left-1/2 grid h-24 w-24 -translate-x-1/2 place-items-center rounded-[1.6rem] bg-white/16">
        <div className="h-16 w-5 rounded-full bg-white/70" />
        <div className="absolute h-5 w-16 rounded-full bg-white/70" />
      </div>
    );
  }
  if (visual === "factory" || visual === "engineering" || visual === "energy") {
    return (
      <div className="absolute bottom-6 left-7 right-7 h-24 rounded-[1.2rem] border border-white/20 bg-white/12">
        <div className="absolute bottom-0 left-4 h-14 w-12 rounded-t-lg bg-white/28" />
        <div className="absolute bottom-0 left-20 h-20 w-10 rounded-t-lg bg-white/42" />
        <div className="absolute bottom-0 right-8 h-16 w-16 rounded-t-[1.2rem] bg-white/24" />
        <div className="absolute left-8 top-6 h-2 w-32 rounded-full bg-white/45" />
      </div>
    );
  }
  if (visual === "design") {
    return (
      <div className="absolute bottom-7 left-8 right-8 h-24 rounded-[1.2rem] border border-white/20 bg-white/12">
        <div className="absolute left-5 top-5 h-12 w-12 rounded-full bg-white/40" />
        <div className="absolute left-20 top-8 h-10 w-24 rounded-full bg-white/24" />
        <div className="absolute bottom-5 right-6 h-10 w-10 rotate-45 rounded-lg bg-white/36" />
      </div>
    );
  }
  if (visual === "tourism") {
    return (
      <div className="absolute bottom-7 left-8 right-8 h-24 overflow-hidden rounded-[1.2rem] border border-white/20 bg-white/12">
        <div className="absolute bottom-0 left-0 h-12 w-full rounded-t-[50%] bg-white/24" />
        <div className="absolute right-8 top-5 h-10 w-10 rounded-full bg-white/55" />
        <div className="absolute bottom-7 left-8 h-10 w-16 rounded-t-full bg-white/34" />
      </div>
    );
  }
  return (
    <div className="absolute bottom-6 left-7 right-7 h-24 rounded-[1.2rem] border border-white/20 bg-white/12">
      <div className="absolute bottom-5 left-5 h-12 w-12 rounded-2xl bg-white/30" />
      <div className="absolute bottom-8 left-24 h-2 w-28 rounded-full bg-white/48" />
      <div className="absolute bottom-14 left-24 h-2 w-20 rounded-full bg-white/32" />
      <div className="absolute right-7 top-5 grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, index) => <span key={index} className="h-2 w-2 rounded-full bg-white/45" />)}
      </div>
    </div>
  );
}

type TimelineGoalSignals = {
  year: number;
  currentRole: string;
  roleType: ReachedCareerRole["roleType"];
  upcomingRole?: string;
  hasEmergencyBefore: boolean;
  hasInvestingBefore: boolean;
  hasSideIncomeBefore: boolean;
  hasCareerBeforeOrSame: boolean;
  hasCareerBefore: boolean;
  houseDistance: number | null;
  marriageDistance: number | null;
  breakDistance: number | null;
  studyDistance: number | null;
  relocateDistance: number | null;
  sameYearMajorGoals: TimelineNode[];
};

type PlannerScore = {
  score: number;
  status: string;
  support: string[];
  pressure: string[];
};

type ReachedCareerRole = {
  roleTitle: string;
  roleType: "current" | "upcoming" | "fallback";
  upcomingRoleTitle?: string;
};

type InvestmentPressureSummary = {
  level: "Low" | "Medium" | "High";
  factors: string[];
  suggestion: string;
};

type ContributionRhythm = {
  title: "Observation Rhythm" | "Light Starter Rhythm" | "Stable Monthly Rhythm" | "Growth Rhythm";
  badge: string;
  text: string;
  tone: "green" | "amber" | "rose" | "blue";
  blocks: { title: string; text: string }[];
};

function MarriageReadinessPlanner({ node, timelineNodes }: { node: TimelineNode; timelineNodes: TimelineNode[] }) {
  const signals = getTimelineGoalSignals(node, timelineNodes);
  const readiness = calculateMarriageReadinessScore(signals);
  const pressureCards = generateMarriagePressureMap(signals);
  const actions = generateMarriagePlanningActions(signals);
  const financialPressure = readiness.score >= 80 ? "Low" : readiness.score >= 65 ? "Medium" : readiness.score >= 45 ? "High" : "Very High";
  const housingChip = signals.houseDistance === null ? "No housing plan yet" : Math.abs(signals.houseDistance) <= 1 ? "Housing link detected" : "Housing later";

  return (
    <GoalFeaturePanel title="Marriage Readiness Planner" eyebrow="Getting Married">
      <TimelineAwareGoalHeader
        icon={Home}
        label={`${node.title} / ${yearLabel(signals.year)}`}
        title="Plan shared life commitments without losing career momentum."
        chips={[`Career stage: ${signals.currentRole}`, `Financial pressure: ${financialPressure}`, "Shared planning needed", housingChip]}
        accent="rose"
      />

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <ReadinessScoreCard title="Timeline Readiness Snapshot" score={readiness} meterTone="rose" />
        <PlannerSectionCard eyebrow="Shared Life Pressure Map" title="Where pressure may show up">
          <div className="grid gap-3 sm:grid-cols-2">
            {pressureCards.map((item) => <PressureMiniCard key={item.title} {...item} />)}
          </div>
        </PlannerSectionCard>
      </div>

      <PlannerSectionCard eyebrow="Marriage Planning Actions" title="Practical actions that reduce pressure before and after this chapter" className="mt-5">
        <div className="grid gap-3 lg:grid-cols-3">
          {actions.map((item) => <ActionRecommendationCard key={item.title} {...item} />)}
        </div>
      </PlannerSectionCard>

      <InsightPanel
        title="Career & Lifestyle Fit Insight"
        text={`${node.title} in ${yearLabel(signals.year)} may fit your ${signals.currentRole} path ${signals.hasCareerBeforeOrSame ? "because a career milestone is already in place" : "but it may need stronger career stability first"}, especially if shared costs stay separate from emergency savings.`}
        items={[
          { icon: BriefcaseBusiness, label: "Career Fit", value: signals.hasCareerBeforeOrSame ? "Good" : "Planning needed", text: signals.hasCareerBeforeOrSame ? `Marriage happens around your ${signals.currentRole} stage.` : "Secure a clearer role foundation first.", tone: "green" },
          { icon: PiggyBank, label: "Financial Pressure", value: financialPressure, text: "Wedding and shared-life costs need a separate budget.", tone: "amber" },
          { icon: Home, label: "Lifestyle Stability", value: housingChip, text: "Align housing, commute, and monthly commitments.", tone: "blue" },
        ]}
      />

      <MiniTimelinePlan
        title="First 12 Months After Marriage Plan"
        tone="rose"
        steps={[
          { label: "Month 1", title: "Set shared budget baseline", text: "Agree on recurring commitments and savings protection." },
          { label: "Month 3", title: "Review housing and commute", text: "Clarify whether location choices still fit work rhythm." },
          { label: "Month 6", title: "Protect savings rhythm", text: "Keep emergency savings and investing from being displaced." },
          { label: "Month 12", title: "Review career/life balance", text: "Check workload, flexibility, and the next major goal." },
        ]}
      />
    </GoalFeaturePanel>
  );
}

function StartInvestingFoundationPlanner({ node, timelineNodes }: { node: TimelineNode; timelineNodes: TimelineNode[] }) {
  const signals = getTimelineGoalSignals(node, timelineNodes);
  const reachedRole = getReachedCareerRoleForNode(node, timelineNodes);
  const readiness = calculateInvestmentReadinessSnapshot(signals);
  const pressure = generateTimelinePressureSummary(signals);
  const rhythm = generateRecommendedContributionRhythm(readiness.score, pressure.level, signals);
  const fitInsight = generateRoleBasedInvestingFitInsight(signals, rhythm);
  const roleChipLabel = reachedRole.roleType === "upcoming" ? "Target role" : reachedRole.roleType === "fallback" ? "Career direction" : "Current reached role";

  return (
    <GoalFeaturePanel title="Investment Impact Planner" eyebrow="Start Investing">
      <TimelineAwareGoalHeader
        icon={TrendingUp}
        label={`${node.title} / ${yearLabel(signals.year)}`}
        title="Build an investing habit that fits the career stage you have already reached, not a future role that has not started yet."
        chips={[
          `${roleChipLabel}: ${signals.currentRole}`,
          ...(signals.upcomingRole ? [`Upcoming role: ${signals.upcomingRole}`] : []),
          `Timeline pressure: ${pressure.level}`,
          `Suggested rhythm: ${rhythm.title}`,
        ]}
        accent="green"
      />

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <InvestmentReadinessSnapshotCard readiness={readiness} signals={signals} />
        <RecommendedContributionRhythmCard rhythm={rhythm} signals={signals} />
      </div>

      <TimelinePressureSummaryPanel summary={pressure} />
      <RoleBasedInvestingFitInsightPanel insight={fitInsight} />
    </GoalFeaturePanel>
  );
}

function TimelineAwareGoalHeader({ icon: Icon, label, title, chips, accent }: { icon: LucideIcon; label: string; title: string; chips: string[]; accent: "rose" | "green" }) {
  const glow = accent === "green" ? "rgba(30,158,114,0.24)" : "rgba(240,77,122,0.26)";
  return (
    <section className="relative overflow-hidden rounded-[1.8rem] bg-[linear-gradient(135deg,#081433,#241D45)] p-6 text-white">
      <div className="absolute right-[-5rem] top-[-5rem] h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: glow }} />
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/12 text-[#FFD6E1] ring-1 ring-white/15">
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/78 ring-1 ring-white/15">{label}</span>
            <h3 className="mt-4 max-w-3xl text-2xl font-semibold tracking-normal">{title}</h3>
          </div>
        </div>
        <div className="flex max-w-xl flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/78 ring-1 ring-white/15">{chip}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestmentReadinessSnapshotCard({ readiness, signals }: { readiness: PlannerScore; signals: TimelineGoalSignals }) {
  const color = readiness.score >= 80 ? "#147A55" : readiness.score >= 65 ? "#1E9E72" : readiness.score >= 45 ? "#8A5A00" : "#C8003F";
  const explanation = signals.roleType === "current" && isStudentRole(signals.currentRole)
    ? `You are still at the ${signals.currentRole} stage, so investing should stay light until income becomes more stable.`
    : signals.roleType === "current"
      ? `Your reached timeline role is ${signals.currentRole}, so a small rhythm may fit if emergency savings and near-term goals stay protected.`
      : signals.roleType === "upcoming"
        ? `${signals.currentRole} is still an upcoming role, so this investing chapter should be treated as preparation rather than a full monthly commitment.`
        : "CareerOS needs more career context before treating investing as a stable monthly commitment.";

  return (
    <PlannerSectionCard eyebrow="Investment Readiness Snapshot" title="Is starting now suitable?">
      <div className="rounded-[1.35rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-4xl font-semibold text-[#081433]">{readiness.score}<span className="text-base text-[#46536D]"> / 100</span></p>
            <p className="mt-1 text-sm font-semibold" style={{ color }}>{readiness.status}</p>
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: readiness.score >= 65 ? "#E9F8F1" : "#FFF4D8", color }}>
            {readiness.score >= 65 ? "Suitable with care" : "Prepare first"}
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E5E8F0]">
          <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${readiness.score}%` }} transition={{ duration: 0.7 }} style={{ background: "linear-gradient(90deg,#147A55,#7BDCB5)" }} />
        </div>
        <p className="mt-4 text-sm font-semibold leading-6 text-[#46536D]">{explanation}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[...readiness.support, ...readiness.pressure].slice(0, 5).map((item) => {
          const isPressure = readiness.pressure.includes(item);
          return (
            <span key={item} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: isPressure ? "#FFF4D8" : "#E9F8F1", color: isPressure ? "#8A5A00" : "#147A55" }}>
              {item}
            </span>
          );
        })}
      </div>
    </PlannerSectionCard>
  );
}

function RecommendedContributionRhythmCard({ rhythm, signals }: { rhythm: ContributionRhythm; signals: TimelineGoalSignals }) {
  const styles = getPlannerTone(rhythm.tone);
  return (
    <PlannerSectionCard eyebrow="Recommended Contribution Rhythm" title="One rhythm for this timeline stage">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden rounded-[1.45rem] bg-white shadow-sm ring-1 ring-[#E5E8F0]">
        <div className="bg-[linear-gradient(135deg,#F8FFFB,#FFF7FA)] p-5">
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: styles.bg, color: styles.color }}>{rhythm.badge}</span>
          <h3 className="mt-4 text-2xl font-semibold tracking-normal text-[#081433]">{rhythm.title}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#46536D]">{rhythm.text}</p>
          <p className="mt-4 rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold text-[#081433] ring-1 ring-[#E5E8F0]">
            Best fit for your current reached stage: <span style={{ color: styles.color }}>{signals.currentRole}</span>
          </p>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-3">
          {rhythm.blocks.map((block, index) => (
            <div key={block.title} className="rounded-[1.15rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
              <span className="grid h-8 w-8 place-items-center rounded-full text-xs font-semibold" style={{ backgroundColor: styles.bg, color: styles.color }}>{index + 1}</span>
              <p className="mt-3 text-sm font-semibold text-[#081433]">{block.title}</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#46536D]">{block.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </PlannerSectionCard>
  );
}

function TimelinePressureSummaryPanel({ summary }: { summary: InvestmentPressureSummary }) {
  const tone = summary.level === "High" ? "rose" : summary.level === "Medium" ? "amber" : "green";
  const styles = getPlannerTone(tone);
  const width = summary.level === "High" ? "100%" : summary.level === "Medium" ? "66%" : "34%";
  return (
    <section className="mt-5 overflow-hidden rounded-[1.8rem] bg-[#FFFDFB] ring-1 ring-[#F1E4DE]">
      <div className="border-l-4 p-5" style={{ borderColor: styles.color }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Timeline Pressure Summary</p>
            <h3 className="mt-1 text-xl font-semibold text-[#081433]">What is happening around this investing goal</h3>
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: styles.bg, color: styles.color }}>{summary.level} pressure</span>
        </div>
        <div className="mt-5 rounded-[1.35rem] bg-white p-4 ring-1 ring-[#E5E8F0]">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.12em] text-[#46536D]">
            <span>Low pressure</span>
            <span>Medium pressure</span>
            <span>High pressure</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E5E8F0]">
            <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width }} transition={{ duration: 0.65 }} style={{ background: `linear-gradient(90deg,#7BDCB5,${styles.color})` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.factors.slice(0, 6).map((factor) => (
              <span key={factor} className="rounded-full bg-[#F8F9FB] px-3 py-1 text-xs font-semibold text-[#46536D] ring-1 ring-[#E5E8F0]">{factor}</span>
            ))}
          </div>
          <p className="mt-4 rounded-[1.15rem] px-4 py-3 text-sm font-semibold leading-6" style={{ backgroundColor: styles.bg, color: "#081433" }}>{summary.suggestion}</p>
        </div>
      </div>
    </section>
  );
}

function RoleBasedInvestingFitInsightPanel({ insight }: { insight: { text: string; items: { icon: LucideIcon; label: string; value: string; text: string; tone: "green" | "amber" | "blue" | "rose" }[] } }) {
  return (
    <section className="mt-5 overflow-hidden rounded-[1.8rem] bg-[#F7FFFB] ring-1 ring-[#CDECDD]">
      <div className="border-l-4 border-[#1E9E72] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#147A55]">Role-Based Investing Fit Insight</p>
        <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-[#46536D]">{insight.text}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {insight.items.map((item) => <HouseInsightMetric key={item.label} {...item} />)}
        </div>
      </div>
    </section>
  );
}

function PlannerSectionCard({ eyebrow, title, children, className = "" }: { eyebrow: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[1.7rem] bg-white/85 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] ring-1 ring-[#E5E8F0] backdrop-blur ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">{eyebrow}</p>
      <h3 className="mt-1 text-xl font-semibold text-[#081433]">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ReadinessScoreCard({ title, score, meterTone }: { title: string; score: PlannerScore; meterTone: "rose" | "green" }) {
  const color = score.score >= 80 ? "#147A55" : score.score >= 65 ? "#1E9E72" : score.score >= 45 ? "#8A5A00" : "#C8003F";
  const fill = meterTone === "green" ? "linear-gradient(90deg,#147A55,#7BDCB5)" : "linear-gradient(90deg,#E00046,#F5B971)";
  return (
    <PlannerSectionCard eyebrow="Timeline diagnosis" title={title}>
      <div className="rounded-[1.25rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-4xl font-semibold text-[#081433]">{score.score}<span className="text-base text-[#46536D]"> / 100</span></p>
            <p className="mt-1 text-sm font-semibold" style={{ color }}>{score.status}</p>
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: score.score >= 65 ? "#E9F8F1" : "#FFF4D8", color }}>{score.score >= 65 ? "Supportive" : "Needs prep"}</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E5E8F0]">
          <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${score.score}%` }} transition={{ duration: 0.7 }} style={{ background: fill }} />
        </div>
      </div>
      <PlannerFactorGroup title="Support factors" items={score.support} tone="support" />
      <PlannerFactorGroup title="Pressure factors" items={score.pressure} tone="pressure" />
    </PlannerSectionCard>
  );
}

function PlannerFactorGroup({ title, items, tone }: { title: string; items: string[]; tone: "support" | "pressure" }) {
  const fallback = tone === "support" ? "No major support factor yet" : "No major pressure detected";
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#46536D]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(items.length ? items : [fallback]).slice(0, 5).map((item) => (
          <span key={item} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: tone === "support" ? "#E9F8F1" : "#FFF4D8", color: tone === "support" ? "#147A55" : "#8A5A00" }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function PressureMiniCard({ title, level, text, tone }: { title: string; level: string; text: string; tone: "green" | "amber" | "rose" | "blue" }) {
  const styles = getPlannerTone(tone);
  return (
    <div className="rounded-[1.25rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
      <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: styles.bg, color: styles.color }}>{level}</span>
      <p className="mt-3 font-semibold text-[#081433]">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#46536D]">{text}</p>
    </div>
  );
}

function ActionRecommendationCard({ title, status, text, tone, badge }: { title: string; status: string; text: string; tone: "green" | "amber" | "rose" | "blue"; badge?: string }) {
  const styles = getPlannerTone(tone);
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-[1.25rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: styles.bg, color: styles.color }}>{status}</span>
        {badge ? <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#46536D] ring-1 ring-[#E5E8F0]">{badge}</span> : null}
      </div>
      <p className="mt-3 font-semibold text-[#081433]">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#46536D]">{text}</p>
    </motion.div>
  );
}

function InsightPanel({ title, text, items }: { title: string; text: string; items: { icon: LucideIcon; label: string; value: string; text: string; tone: "green" | "amber" | "blue" | "rose" }[] }) {
  return (
    <section className="mt-5 overflow-hidden rounded-[1.8rem] bg-[#FFF7FA] ring-1 ring-[#F5CBD6]">
      <div className="border-l-4 border-[#E00046] p-5">
        <p className="text-base font-semibold text-[#081433]">{title}</p>
        <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-[#46536D]">{text}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {items.map((item) => <HouseInsightMetric key={item.label} {...item} />)}
        </div>
      </div>
    </section>
  );
}

function MiniTimelinePlan({ title, steps, tone }: { title: string; tone: "rose" | "green"; steps: { label: string; title: string; text: string }[] }) {
  const color = tone === "green" ? "#1E9E72" : "#E00046";
  return (
    <section className="mt-5 rounded-[1.7rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
      <p className="text-xl font-semibold text-[#081433]">{title}</p>
      <div className="relative mt-5 grid gap-4 md:grid-cols-4">
        <span className="absolute left-[8%] right-[8%] top-6 hidden h-px bg-[#E5E8F0] md:block" />
        {steps.map((step, index) => (
          <div key={step.label} className="relative z-10 flex gap-3 md:flex-col md:items-center md:text-center">
            {index < steps.length - 1 && <span className="absolute left-5 top-10 h-[calc(100%+1rem)] w-px bg-[#E5E8F0] md:hidden" />}
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-4 border-white text-white shadow-sm" style={{ backgroundColor: color }}>{index + 1}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color }}>{step.label}</p>
              <p className="mt-1 font-semibold text-[#081433]">{step.title}</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#46536D]">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function getPlannerTone(tone: "green" | "amber" | "rose" | "blue") {
  return {
    green: { bg: "#E9F8F1", color: "#147A55" },
    amber: { bg: "#FFF4D8", color: "#8A5A00" },
    rose: { bg: "#FFE8EE", color: "#C8003F" },
    blue: { bg: "#EEF2FF", color: "#4F46E5" },
  }[tone];
}

function getGoalYear(node: TimelineNode) {
  return node.displayYear ?? node.targetYear;
}

function getTimelineGoalSignals(node: TimelineNode, timelineNodes: TimelineNode[]): TimelineGoalSignals {
  const year = getGoalYear(node);
  const reachedRole = getReachedCareerRoleForNode(node, timelineNodes);
  const selectedIndex = timelineNodes.findIndex((item) => item.id === node.id);
  const before = selectedIndex >= 0 ? timelineNodes.slice(0, selectedIndex) : timelineNodes.filter((item) => getGoalYear(item) < year);
  const textOf = (item: TimelineNode) => `${item.lifeGoalKey ?? ""} ${item.title}`.toLowerCase();
  const findDistance = (keywords: string[]) => {
    const matches = timelineNodes.filter((item) => item.id !== node.id && keywords.some((keyword) => textOf(item).includes(keyword)));
    if (matches.length === 0) return null;
    return matches.map((item) => getGoalYear(item) - year).sort((a, b) => Math.abs(a) - Math.abs(b))[0];
  };

  return {
    year,
    currentRole: reachedRole.roleTitle,
    roleType: reachedRole.roleType,
    upcomingRole: reachedRole.roleType === "upcoming" ? reachedRole.roleTitle : reachedRole.upcomingRoleTitle,
    hasEmergencyBefore: before.some((item) => ["emergency", "savings", "buffer"].some((keyword) => textOf(item).includes(keyword))),
    hasInvestingBefore: before.some((item) => textOf(item).includes("invest")),
    hasSideIncomeBefore: before.some((item) => textOf(item).includes("side income") || textOf(item).includes("freelance") || textOf(item).includes("business")),
    hasCareerBeforeOrSame: reachedRole.roleType === "current",
    hasCareerBefore: before.some(isCareerNode),
    houseDistance: findDistance(["house", "housing", "home", "property"]),
    marriageDistance: findDistance(["married", "marriage", "wedding", "family-planning"]),
    breakDistance: findDistance(["break", "sabbatical", "burnout", "health", "recovery"]),
    studyDistance: findDistance(["study", "degree", "course", "education"]),
    relocateDistance: findDistance(["relocate", "relocation", "overseas", "move"]),
    sameYearMajorGoals: timelineNodes.filter((item) => item.id !== node.id && item.type === "life" && getGoalYear(item) === year),
  };
}

function calculateMarriageReadinessScore(signals: TimelineGoalSignals): PlannerScore {
  let score = 70;
  const support: string[] = [];
  const pressure: string[] = [];
  if (signals.hasEmergencyBefore) { score += 12; support.push("Emergency savings planned before marriage"); } else { score -= 12; pressure.push("No emergency savings before marriage"); }
  if (signals.hasCareerBeforeOrSame) { score += 8; support.push("Stable career milestone before marriage"); } else { score -= 8; pressure.push("Marriage before first career milestone"); }
  if (signals.hasInvestingBefore) { score += 5; support.push("Investing already started"); }
  if (signals.houseDistance !== null && signals.houseDistance > 0) { score += 4; support.push("Housing planned after marriage"); }
  if (signals.hasCareerBefore) { score += 6; support.push("Career foundation already exists"); }
  if (signals.breakDistance === null || Math.abs(signals.breakDistance) > 1) { score += 6; support.push("No major break nearby"); } else { score -= 10; pressure.push("Career break nearby"); }
  if (signals.hasSideIncomeBefore) { score += 6; support.push("Side income before marriage"); }
  if (signals.houseDistance === 0) { score -= 10; pressure.push("Housing goal overlaps"); }
  if (signals.relocateDistance !== null && Math.abs(signals.relocateDistance) <= 1) { score -= 8; pressure.push("Relocation nearby"); }
  if (signals.studyDistance === 0) { score -= 6; pressure.push("Study goal same year"); }
  if (signals.sameYearMajorGoals.length >= 2) { score -= 10; pressure.push("Multiple goals in same year"); }
  if (!signals.hasInvestingBefore && !signals.hasEmergencyBefore && !signals.hasSideIncomeBefore) { score -= 6; pressure.push("No support goal before marriage"); }
  const clamped = Math.max(0, Math.min(100, score));
  return { score: clamped, status: clamped >= 80 ? "Strong foundation" : clamped >= 65 ? "Mostly ready" : clamped >= 45 ? "Needs preparation" : "High pressure", support, pressure };
}

function generateMarriagePressureMap(signals: TimelineGoalSignals) {
  return [
    { title: "Wedding Cost", level: signals.hasEmergencyBefore ? "Medium pressure" : "High pressure", text: signals.hasEmergencyBefore ? "Savings exists, but wedding costs should stay separate." : "Start savings preparation 12-18 months earlier.", tone: signals.hasEmergencyBefore ? "amber" as const : "rose" as const },
    { title: "Housing Direction", level: signals.houseDistance !== null && Math.abs(signals.houseDistance) <= 1 ? "High pressure" : "Medium pressure", text: signals.houseDistance !== null && Math.abs(signals.houseDistance) <= 1 ? "Housing and marriage may compete for savings." : "Housing timing has more room for discussion.", tone: signals.houseDistance !== null && Math.abs(signals.houseDistance) <= 1 ? "rose" as const : "blue" as const },
    { title: "Career Stability", level: signals.hasCareerBeforeOrSame ? "Good" : "Needs planning", text: signals.hasCareerBeforeOrSame ? `${signals.currentRole} gives stronger income stability.` : "Secure a role foundation before scaling commitments.", tone: signals.hasCareerBeforeOrSame ? "green" as const : "amber" as const },
    { title: "Shared Commitments", level: signals.hasEmergencyBefore || signals.hasInvestingBefore ? "Manageable" : "Needs planning", text: "Protect monthly commitments, emergency savings, and future goals.", tone: signals.hasEmergencyBefore || signals.hasInvestingBefore ? "green" as const : "amber" as const },
  ];
}

function generateMarriagePlanningActions(signals: TimelineGoalSignals) {
  return [
    { title: "Protect Emergency Savings", status: signals.hasEmergencyBefore ? "Protected" : "Needs attention", text: signals.hasEmergencyBefore ? "Emergency savings is already planned before this goal, so wedding spending should not replace your safety buffer." : "No emergency savings chapter is detected before marriage. Add a buffer before large shared expenses.", tone: signals.hasEmergencyBefore ? "green" as const : "amber" as const },
    { title: "Separate Wedding Budget", status: "Recommended", text: `Keep wedding costs separate from emergency savings. Suggested preparation window: 12-18 months before ${yearLabel(signals.year)}.`, tone: "blue" as const },
    { title: "Align Housing Timing", status: signals.houseDistance === null ? "Open decision" : Math.abs(signals.houseDistance) <= 1 ? "Caution" : "Good sequence", text: signals.houseDistance === null ? "No housing goal is detected yet. Shared housing direction should be discussed." : Math.abs(signals.houseDistance) <= 1 ? "Buying a house and getting married close together may create high savings pressure." : "Housing is spaced from marriage, giving more time to adjust shared finances first.", tone: signals.houseDistance !== null && Math.abs(signals.houseDistance) <= 1 ? "amber" as const : "green" as const },
  ];
}

function calculateInvestmentReadinessSnapshot(signals: TimelineGoalSignals): PlannerScore {
  let score = 60;
  const support: string[] = [];
  const pressure: string[] = [];
  const currentIsStudent = isStudentRole(signals.currentRole);
  const professionalReached = signals.roleType === "current" && isProfessionalRole(signals.currentRole);
  const expensiveNearby = [signals.houseDistance, signals.marriageDistance, signals.studyDistance, signals.relocateDistance].some((distance) => distance !== null && distance >= 0 && distance <= 1);

  if (signals.hasEmergencyBefore) { score += 15; support.push("Emergency savings ready"); } else { score -= 15; pressure.push("No emergency savings yet"); }
  if (professionalReached) { score += 10; support.push(`${signals.currentRole} already reached`); }
  if (signals.hasSideIncomeBefore) { score += 6; support.push("Side income available"); }
  if (!expensiveNearby) { score += 8; support.push("No major goal nearby"); }
  if (signals.breakDistance === null || signals.breakDistance < 0 || signals.breakDistance > 1) { score += 8; support.push("No break within 1 year"); }
  if (currentIsStudent && signals.upcomingRole && isProfessionalRole(signals.upcomingRole)) { score += 5; support.push(`Upcoming ${signals.upcomingRole} role detected`); }
  if (signals.houseDistance !== null && signals.houseDistance > 2) { score += 6; support.push("House goal more than 2 years away"); }
  if (signals.marriageDistance !== null && signals.marriageDistance > 1) { score += 4; support.push("Marriage goal not immediate"); }

  if (currentIsStudent) { score -= 10; pressure.push("Still at student stage"); }
  if (!professionalReached) { score -= 12; pressure.push("Before first full-time role"); }
  if (signals.houseDistance !== null && signals.houseDistance >= 0 && signals.houseDistance <= 1) { score -= 10; pressure.push("House goal nearby"); }
  if (signals.marriageDistance !== null && signals.marriageDistance >= 0 && signals.marriageDistance <= 1) { score -= 8; pressure.push("Marriage goal nearby"); }
  if (signals.breakDistance !== null && signals.breakDistance >= 0 && signals.breakDistance <= 1) { score -= 12; pressure.push("Career break nearby"); }
  if (signals.studyDistance !== null && signals.studyDistance >= 0 && signals.studyDistance <= 1) { score -= 8; pressure.push("Study goal nearby"); }
  if (signals.relocateDistance !== null && signals.relocateDistance >= 0 && signals.relocateDistance <= 1) { score -= 8; pressure.push("Relocation goal nearby"); }
  if (signals.sameYearMajorGoals.length >= 2) { score -= 10; pressure.push("Multiple goals same year"); }

  const clamped = Math.max(0, Math.min(100, score));
  return { score: clamped, status: clamped >= 80 ? "Strong foundation" : clamped >= 65 ? "Ready, start lightly" : clamped >= 45 ? "Build buffer first" : "Not ideal yet", support, pressure };
}

function generateTimelinePressureSummary(signals: TimelineGoalSignals): InvestmentPressureSummary {
  const factors: string[] = [];
  const currentIsStudent = isStudentRole(signals.currentRole);
  const stableRoleReached = signals.roleType === "current" && isProfessionalRole(signals.currentRole);
  const majorNearby = [signals.houseDistance, signals.marriageDistance, signals.breakDistance, signals.studyDistance, signals.relocateDistance].some((distance) => distance !== null && distance >= 0 && distance <= 1);
  if (currentIsStudent) factors.push("Student stage");
  if (!signals.hasEmergencyBefore) factors.push("No emergency savings");
  if (signals.upcomingRole) factors.push(`Upcoming ${signals.upcomingRole}`);
  if (signals.houseDistance !== null && signals.houseDistance >= 0 && signals.houseDistance <= 2) factors.push("House nearby");
  if (signals.marriageDistance !== null && signals.marriageDistance >= 0 && signals.marriageDistance <= 2) factors.push("Marriage nearby");
  if (signals.breakDistance !== null && signals.breakDistance >= 0 && signals.breakDistance <= 2) factors.push("Break nearby");
  if (signals.studyDistance !== null && signals.studyDistance >= 0 && signals.studyDistance <= 2) factors.push("Study nearby");
  if (signals.relocateDistance !== null && signals.relocateDistance >= 0 && signals.relocateDistance <= 2) factors.push("Relocation nearby");
  if (signals.hasEmergencyBefore) factors.push("Emergency savings ready");
  if (signals.hasSideIncomeBefore) factors.push("Side income support");
  if (!majorNearby) factors.push("No major goal nearby");

  const level: InvestmentPressureSummary["level"] = !signals.hasEmergencyBefore && majorNearby && !stableRoleReached ? "High" : !signals.hasEmergencyBefore || majorNearby || currentIsStudent ? "Medium" : "Low";
  const suggestion = level === "High"
    ? `Because your reached stage is ${signals.currentRole} and multiple pressure factors sit near this chapter, CareerOS suggests keeping investing in observation mode while emergency savings and short-term cash needs are protected.`
    : level === "Medium"
      ? `Because you are at the ${signals.currentRole} stage${signals.upcomingRole ? ` with ${signals.upcomingRole} still ahead` : ""}, CareerOS suggests a light starter rhythm instead of a serious monthly commitment. Increase only after the timeline becomes more stable.`
      : `Because ${signals.currentRole} is already reached, emergency savings is in place, and no major near-term goal is detected, CareerOS suggests a stable monthly rhythm with regular timeline reviews.`;

  return { level, factors, suggestion };
}

function generateRecommendedContributionRhythm(score: number, pressureLevel: InvestmentPressureSummary["level"], signals: TimelineGoalSignals): ContributionRhythm {
  const currentIsStudent = isStudentRole(signals.currentRole);
  const stableRoleReached = signals.roleType === "current" && isProfessionalRole(signals.currentRole);
  const title: ContributionRhythm["title"] = currentIsStudent || (!stableRoleReached && !signals.hasEmergencyBefore) || pressureLevel === "High"
    ? "Observation Rhythm"
    : score < 65 || pressureLevel === "Medium"
      ? "Light Starter Rhythm"
      : score >= 80 && pressureLevel === "Low" && signals.hasEmergencyBefore
        ? "Growth Rhythm"
        : "Stable Monthly Rhythm";
  const tone: ContributionRhythm["tone"] = title === "Growth Rhythm" || title === "Stable Monthly Rhythm" ? "green" : title === "Light Starter Rhythm" ? "amber" : "blue";
  const nextRole = signals.upcomingRole ?? "your next career node";
  const text = title === "Observation Rhythm"
    ? `You are still at the ${signals.currentRole} stage, so this is better treated as a learning and observation phase. Keep investing light until ${nextRole} is actually reached.`
    : title === "Light Starter Rhythm"
      ? `A light starter rhythm fits because your timeline has some pressure. Keep contributions flexible while emergency savings and income stability improve.`
      : title === "Stable Monthly Rhythm"
        ? `A consistent monthly habit can fit your reached ${signals.currentRole} stage if it does not reduce emergency savings or near-term goal cash.`
        : `Your timeline has stronger support for more consistency, but contribution pressure should still be reviewed whenever life goals move.`;

  return {
    title,
    badge: title === "Observation Rhythm" ? "Learn and watch first" : title === "Light Starter Rhythm" ? "Small and flexible" : title === "Stable Monthly Rhythm" ? "Consistent but protected" : "More room to grow",
    text,
    tone,
    blocks: [
      { title: "What to do now", text: title === "Observation Rhythm" ? "Track expenses, learn the basics, and avoid large commitments." : "Keep the habit small enough that goals and savings stay protected." },
      { title: "What to avoid", text: "Do not reduce emergency savings or money needed for job, housing, study, or relocation transitions." },
      { title: "When to increase", text: signals.upcomingRole ? `Review again after ${signals.upcomingRole} is reached.` : "Review after the next career or life chapter changes." },
    ],
  };
}

function generateRoleBasedInvestingFitInsight(signals: TimelineGoalSignals, rhythm: ContributionRhythm) {
  const currentIsStudent = isStudentRole(signals.currentRole);
  const mainText = currentIsStudent && signals.upcomingRole
    ? `Right now, your reached timeline role is ${signals.currentRole}, not ${signals.upcomingRole} yet. That means investing should stay flexible until the income role begins.`
    : signals.roleType === "current"
      ? `Your reached timeline role is ${signals.currentRole}, so ${rhythm.title.toLowerCase()} may be realistic if emergency savings and near-term goals are protected.`
      : `${signals.currentRole} is still a target role, so CareerOS treats this as preparation rather than a fully supported investing stage.`;

  return {
    text: mainText,
    items: [
      { icon: BriefcaseBusiness, label: "Current Reached Stage", value: signals.currentRole, text: currentIsStudent ? "Cash flexibility matters more than contribution size before the first full-time role." : "This role gives the career context for deciding contribution pressure.", tone: currentIsStudent ? "amber" as const : "green" as const },
      { icon: Calendar, label: "Upcoming Career Step", value: signals.upcomingRole ?? "No upcoming role detected", text: signals.upcomingRole ? "Once this node is reached, income stability may improve and the rhythm can be reviewed." : "No later career node is available, so review after your next timeline update.", tone: "blue" as const },
      { icon: TrendingUp, label: "Investing Fit", value: rhythm.title.replace(" Rhythm", ""), text: "This is behaviour planning only, with no product, salary, or return assumption.", tone: rhythm.tone },
    ],
  };
}

function isStudentRole(role: string) {
  const value = role.toLowerCase();
  return value.includes("student") || value.includes("final year") || value.includes("intern");
}

function isProfessionalRole(role: string) {
  if (isStudentRole(role)) return false;
  const value = role.toLowerCase();
  return ["designer", "analyst", "engineer", "developer", "manager", "lead", "senior", "junior", "associate", "specialist", "consultant", "marketer", "executive", "product", "software", "data", "business"].some((keyword) => value.includes(keyword));
}


function StudyAgainGoalFeatures({ node, timelineNodes }: { node: TimelineNode; timelineNodes: TimelineNode[] }) {
  const targetRole = getNextCareerRole(node, timelineNodes);
  const skills = getStudyRadarSkills(targetRole);
  const topGaps = getTopStudySkillGaps(skills);

  return (
    <>
      <StudySkillRadar targetRole={targetRole} skills={skills} topGaps={topGaps} />
      <AIStudyPrescription gaps={topGaps} />
    </>
  );
}

function getNextCareerRole(node: TimelineNode, timelineNodes: TimelineNode[]) {
  const nodeYear = node.displayYear ?? node.targetYear;
  const future = timelineNodes.filter((item) => item.type === "career" && (item.displayYear ?? item.targetYear) > nodeYear);
  return future[0]?.title ?? timelineNodes.filter((item) => item.type === "career").at(-1)?.title ?? "Senior UX Designer";
}

type StudySkill = {
  label: string;
  current: number;
  required: number;
};

type StudySkillGap = StudySkill & {
  gap: number;
};

function getStudyRadarSkills(targetRole: string): StudySkill[] {
  return [
    { label: "Leadership", current: 2, required: targetRole.includes("Senior") ? 4 : 3 },
    { label: "Product Strategy", current: 1, required: 4 },
    { label: "Analytics", current: 3, required: 4 },
    { label: "Communication", current: 3, required: 4 },
    { label: "UX Thinking", current: 4, required: targetRole.includes("UX") ? 5 : 4 },
    { label: "Technical Understanding", current: 2, required: 3 },
    { label: "Business Thinking", current: 2, required: 4 },
  ];
}

function getTopStudySkillGaps(skills: StudySkill[]): StudySkillGap[] {
  return skills
    .map((skill, index) => ({ ...skill, gap: skill.required - skill.current, index }))
    .sort((a, b) => b.gap - a.gap || a.index - b.index)
    .slice(0, 3)
    .map(({ label, current, required, gap }) => ({ label, current, required, gap }));
}

function StudySkillRadar({ targetRole, skills, topGaps }: { targetRole: string; skills: StudySkill[]; topGaps: StudySkillGap[] }) {
  return (
    <GoalFeaturePanel title="Skill Radar Chart" eyebrow="Part-Time Study">
      <p className="mb-4 rounded-full bg-[#FFF2F6] px-4 py-2 text-sm font-semibold text-[#E00046]">Skill gap based on your next timeline role: {targetRole}</p>
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <RadarChart data={skills} seriesA="Current" seriesB="Required" />
        <div className="rounded-[1.4rem] bg-[#F8F9FB] p-4">
          <p className="text-sm font-semibold text-[#081433]">Top 3 Skill Gaps</p>
          <div className="mt-3 grid gap-3">
            {topGaps.map((gap, index) => (
              <div key={gap.label} className="rounded-[1.2rem] bg-white p-4 shadow-sm ring-1 ring-[#E5E8F0]">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FFF2F6] text-xs font-semibold text-[#E00046]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm font-semibold text-[#081433]">{gap.label}</p>
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-[#46536D]">
                  Current {gap.current}/5 Â· Required {gap.required}/5 Â· Gap +{gap.gap}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GoalFeaturePanel>
  );
}

type StudyCourseRecommendation = {
  course: string;
  covers: string;
  why: string;
};

function getStudyCourseRecommendation(skill: string): StudyCourseRecommendation {
  const map: Record<string, StudyCourseRecommendation> = {
    Leadership: {
      course: "Leadership for Designers",
      covers: "leadership, feedback, stakeholder communication",
      why: "Biggest missing skill for senior progression",
    },
    "UX Thinking": {
      course: "UX Research & Design Thinking",
      covers: "user research, problem framing, design validation",
      why: "Strengthens user-centred decision making",
    },
    "Product Strategy": {
      course: "Product Strategy Fundamentals",
      covers: "roadmap thinking, product goals, prioritisation",
      why: "Connects design decisions with business outcomes",
    },
    Analytics: {
      course: "Analytics for Product Decisions",
      covers: "metrics, dashboards, experimentation, A/B testing",
      why: "Helps translate design and product decisions into measurable outcomes",
    },
    Communication: {
      course: "Stakeholder Communication & Storytelling",
      covers: "presentation, design rationale, stakeholder alignment",
      why: "Helps explain decisions clearly and influence cross-functional teams",
    },
    "Technical Understanding": {
      course: "Technical Collaboration for Product Teams",
      covers: "frontend basics, developer handoff, constraints, feasibility",
      why: "Improves collaboration with engineering and reduces implementation friction",
    },
    "Business Thinking": {
      course: "Business Thinking for Product Growth",
      covers: "business models, prioritisation, customer value, growth trade-offs",
      why: "Helps connect user needs with business outcomes",
    },
  };

  return map[skill] ?? {
    course: "Targeted Skill Accelerator",
    covers: "selected skill foundations, applied practice, confidence building",
    why: "Supports the missing capability needed for the next role",
  };
}

function AIStudyPrescription({ gaps }: { gaps: StudySkillGap[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const recommendations = gaps.map((gap) => ({
    gap,
    recommendation: getStudyCourseRecommendation(gap.label),
  }));
  const active = recommendations[activeIndex] ?? recommendations[0];
  const whyLabels = ["Why first", "Why second", "Why third"];

  return (
    <GoalFeaturePanel title="AI Study Prescription" eyebrow="Recommended study sequence based on your top skill gaps.">
      <div className="relative grid gap-5 lg:grid-cols-[minmax(260px,0.85fr)_minmax(320px,1.15fr)]">
        <div className="relative grid gap-4 py-2">
          <div className="absolute bottom-8 left-[1.35rem] top-8 w-px bg-[#DDE3F0]" />
          {recommendations.map(({ gap, recommendation }, index) => {
            const activeNode = index === activeIndex;
            return (
              <button
                key={gap.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative grid grid-cols-[2.7rem_1fr] items-start gap-4 rounded-[1.4rem] p-2 text-left transition duration-200 hover:-translate-y-0.5"
              >
                <motion.span
                  animate={{ scale: activeNode ? 1.08 : 1, backgroundColor: activeNode ? theme.rose2 : "#fff", color: activeNode ? "#fff" : theme.rose2 }}
                  className="z-10 grid h-11 w-11 place-items-center rounded-full border text-xs font-semibold shadow-sm"
                  style={{ borderColor: activeNode ? theme.rose2 : theme.line }}
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>
                <span className={`rounded-[1.2rem] px-4 py-3 transition ${activeNode ? "bg-[#081433] text-white shadow-[0_16px_34px_rgba(8,20,51,0.18)]" : "bg-white text-[#081433] ring-1 ring-[#E5E8F0] group-hover:ring-[#F5CBD6]"}`}>
                  <span className="block text-sm font-semibold">{recommendation.course}</span>
                  <span className={`mt-1 block text-xs font-semibold ${activeNode ? "text-white/62" : "text-[#46536D]"}`}>Matched gap: {gap.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active?.gap.label}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            className="self-center rounded-[1.8rem] bg-white p-5 shadow-[0_22px_50px_rgba(21,34,56,0.10)] ring-1 ring-[#E5E8F0]"
          >
            <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">Prescription {String(activeIndex + 1).padStart(2, "0")}</span>
            <h4 className="mt-4 text-2xl font-semibold text-[#081433]">{active.recommendation.course}</h4>
            <div className="mt-5 grid gap-3">
              <MiniMetric label="Matched gap" value={`${active.gap.label} (+${active.gap.gap})`} />
              <MiniMetric label="Covers" value={active.recommendation.covers} />
              <MiniMetric label={whyLabels[activeIndex]} value={active.recommendation.why} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </GoalFeaturePanel>
  );
}

type RelocationCountry = "Singapore" | "Australia" | "Japan" | "United Kingdom" | "United States" | "Canada";

type ComparisonCriterion = "Career Growth" | "Work-Life Balance" | "Remote Opportunities" | "Visa / Entry Difficulty" | "Cost Pressure" | "Job Market Competition" | "Industry Opportunities";

type RelocationProfile = {
  careerFit: string;
  advantage: string;
  tradeOff: string;
  table: Record<ComparisonCriterion, string>;
  radar: Record<string, number>;
};

const comparisonCriterionIcons: Record<ComparisonCriterion, LucideIcon> = {
  "Career Growth": Rocket,
  "Work-Life Balance": HeartPulse,
  "Remote Opportunities": Home,
  "Visa / Entry Difficulty": Plane,
  "Cost Pressure": PiggyBank,
  "Job Market Competition": Users,
  "Industry Opportunities": BriefcaseBusiness,
};

const malaysiaRelocationProfile: RelocationProfile = {
  careerFit: "Medium-High",
  advantage: "Lower pressure and familiar market",
  tradeOff: "Less regional exposure than larger hubs",
  table: {
    "Career Growth": "Stable growth Â· Familiar market",
    "Work-Life Balance": "Moderate Â· Depends on company",
    "Remote Opportunities": "Growing Â· Mixed availability",
    "Visa / Entry Difficulty": "Local access Â· No visa barrier",
    "Cost Pressure": "Lower pressure Â· More affordable",
    "Job Market Competition": "Moderate Â· Easier entry",
    "Industry Opportunities": "Solid foundation Â· KL/Selangor strongest",
  },
  radar: {
    "Career Growth": 3.5,
    "Work-Life Balance": 3.4,
    "Remote Opportunities": 3.2,
    "Visa Difficulty": 5.0,
    "Cost Pressure": 4.2,
    "Job Market Competition": 3.6,
    "Industry Opportunities": 3.7,
  },
};

const relocationProfiles: Record<RelocationCountry, RelocationProfile> = {
  Singapore: {
    careerFit: "High",
    advantage: "Regional exposure and faster growth",
    tradeOff: "Higher cost pressure and competition",
    table: {
      "Career Growth": "Fast growth Â· Regional exposure",
      "Work-Life Balance": "Competitive Â· Faster pace",
      "Remote Opportunities": "Strong Â· Regional roles",
      "Visa / Entry Difficulty": "Moderate Â· Work pass needed",
      "Cost Pressure": "High pressure Â· High living cost",
      "Job Market Competition": "High Â· Strong talent pool",
      "Industry Opportunities": "Very strong Â· Tech/finance/product",
    },
    radar: { "Career Growth": 4.8, "Work-Life Balance": 3.0, "Remote Opportunities": 4.2, "Visa Difficulty": 3.2, "Cost Pressure": 2.5, "Job Market Competition": 3.0, "Industry Opportunities": 4.8 },
  },
  Australia: {
    careerFit: "High",
    advantage: "Healthier pace and quality roles",
    tradeOff: "Visa pathway and local experience matter",
    table: {
      "Career Growth": "Balanced growth Â· Strong quality roles",
      "Work-Life Balance": "Strong Â· Healthier pace",
      "Remote Opportunities": "Good Â· Hybrid-friendly",
      "Visa / Entry Difficulty": "Harder Â· Visa pathway needed",
      "Cost Pressure": "Medium-high Â· City dependent",
      "Job Market Competition": "Moderate-high Â· Local experience valued",
      "Industry Opportunities": "Strong Â· Tech/design/business",
    },
    radar: { "Career Growth": 4.0, "Work-Life Balance": 4.6, "Remote Opportunities": 4.0, "Visa Difficulty": 2.6, "Cost Pressure": 3.0, "Job Market Competition": 3.2, "Industry Opportunities": 4.0 },
  },
  Japan: {
    careerFit: "Medium",
    advantage: "Structured market with emerging product roles",
    tradeOff: "Language and company culture fit matter",
    table: {
      "Career Growth": "Structured growth Â· Role dependent",
      "Work-Life Balance": "Mixed Â· Company culture matters",
      "Remote Opportunities": "Moderate Â· Improving slowly",
      "Visa / Entry Difficulty": "Moderate-hard Â· Language helps",
      "Cost Pressure": "Medium Â· City dependent",
      "Job Market Competition": "Medium Â· Language barrier",
      "Industry Opportunities": "Good Â· Design/tech/product emerging",
    },
    radar: { "Career Growth": 3.7, "Work-Life Balance": 3.0, "Remote Opportunities": 3.0, "Visa Difficulty": 2.8, "Cost Pressure": 3.3, "Job Market Competition": 3.0, "Industry Opportunities": 3.6 },
  },
  "United Kingdom": {
    careerFit: "High",
    advantage: "Global exposure and mature hybrid market",
    tradeOff: "Sponsorship and London cost pressure",
    table: {
      "Career Growth": "Strong growth Â· Global exposure",
      "Work-Life Balance": "Good Â· Role dependent",
      "Remote Opportunities": "Strong Â· Mature hybrid market",
      "Visa / Entry Difficulty": "Hard Â· Sponsorship needed",
      "Cost Pressure": "High Â· London especially",
      "Job Market Competition": "High Â· Global applicants",
      "Industry Opportunities": "Strong Â· Tech/finance/creative",
    },
    radar: { "Career Growth": 4.2, "Work-Life Balance": 3.8, "Remote Opportunities": 4.3, "Visa Difficulty": 2.4, "Cost Pressure": 2.7, "Job Market Competition": 2.8, "Industry Opportunities": 4.2 },
  },
  "United States": {
    careerFit: "Very High",
    advantage: "Large market and strongest tech/startup depth",
    tradeOff: "Very hard visa access and intense competition",
    table: {
      "Career Growth": "Very high Â· Large market",
      "Work-Life Balance": "Mixed Â· Company dependent",
      "Remote Opportunities": "Very strong Â· Broad market",
      "Visa / Entry Difficulty": "Very hard Â· Sponsorship barrier",
      "Cost Pressure": "High Â· City dependent",
      "Job Market Competition": "Very high Â· Global talent",
      "Industry Opportunities": "Very strong Â· Tech/startups/AI",
    },
    radar: { "Career Growth": 5.0, "Work-Life Balance": 3.2, "Remote Opportunities": 4.7, "Visa Difficulty": 1.8, "Cost Pressure": 2.5, "Job Market Competition": 2.5, "Industry Opportunities": 5.0 },
  },
  Canada: {
    careerFit: "Medium-High",
    advantage: "Lifestyle-friendly market with available pathways",
    tradeOff: "City costs and local fit still matter",
    table: {
      "Career Growth": "Good growth Â· Stable market",
      "Work-Life Balance": "Strong Â· Lifestyle-friendly",
      "Remote Opportunities": "Good Â· Hybrid roles",
      "Visa / Entry Difficulty": "Medium Â· Pathways available",
      "Cost Pressure": "Medium-high Â· City dependent",
      "Job Market Competition": "Moderate Â· Local fit matters",
      "Industry Opportunities": "Good Â· Tech/business/analytics",
    },
    radar: { "Career Growth": 3.9, "Work-Life Balance": 4.3, "Remote Opportunities": 4.0, "Visa Difficulty": 3.2, "Cost Pressure": 3.0, "Job Market Competition": 3.3, "Industry Opportunities": 3.8 },
  },
};

function RelocateOverseasGoalFeatures({ node, timelineNodes }: { node: TimelineNode; timelineNodes: TimelineNode[] }) {
  const [country, setCountry] = useState<RelocationCountry>("Singapore");
  const [open, setOpen] = useState(false);
  const targetRole = getNextCareerRole(node, timelineNodes);
  const reachedRole = getReachedCareerRoleForNode(node, timelineNodes);
  const selected = relocationProfiles[country];
  const options = Object.keys(relocationProfiles) as RelocationCountry[];
  const countryRadar = getCountryRadar(selected);
  const topDifferences = getTopRelocationDifferences(countryRadar, country, reachedRole);

  return (
    <GoalFeaturePanel title="Country Career Comparison" eyebrow="Relocation Planning">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#081433]">Malaysia vs selected country</p>
          <p className="mt-2 rounded-full bg-[#FFF2F6] px-4 py-2 text-sm font-semibold text-[#E00046]">
            Based on your next timeline role: {targetRole}
          </p>
        </div>
        <FlagCountryDropdown country={country} options={options} open={open} onToggle={() => setOpen((value) => !value)} onSelect={(value) => { setCountry(value); setOpen(false); }} />
      </div>

      <div className="mt-6">
        <RadarChart data={countryRadar} seriesA="Malaysia" seriesB={country} />
      </div>

      <TopRelocationDifferencesPanel differences={topDifferences} country={country} />

      <AIRecommendationPanel country={country} profile={selected} role={targetRole} differences={topDifferences} />
    </GoalFeaturePanel>
  );
}

function FlagCountryDropdown({ country, options, open, onToggle, onSelect }: { country: RelocationCountry; options: RelocationCountry[]; open: boolean; onToggle: () => void; onSelect: (country: RelocationCountry) => void }) {
  return (
    <div className="relative w-full sm:w-[320px]">
      <p className="mb-2 text-sm font-semibold text-[#081433]">Choose your country</p>
      <button type="button" onClick={onToggle} className="flex h-14 w-full items-center justify-between rounded-[1rem] border bg-white px-4 text-left shadow-sm transition hover:-translate-y-0.5" style={{ borderColor: open ? theme.rose2 : theme.border, boxShadow: open ? "0 14px 30px rgba(224,0,70,0.14)" : undefined }}>
        <span className="text-base font-semibold text-[#081433]">{country}</span>
        <ChevronDown className={`h-4 w-4 text-[#46536D] transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-[1rem] bg-white shadow-[0_22px_48px_rgba(21,34,56,0.16)] ring-1 ring-[#E5E8F0]">
            {options.map((option) => {
              const active = option === country;
              return (
                <button key={option} type="button" onClick={() => onSelect(option)} className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition hover:bg-[#FFF7FA] ${active ? "bg-[#FFF2F6] text-[#E00046]" : "text-[#081433]"}`}>
                  <span>{option}</span>
                  {active && <span className="text-xs">Selected</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type RelocationRadarFactor = {
  label: string;
  current: number;
  required: number;
};

type TopRelocationDifference = RelocationRadarFactor & {
  difference: number;
  winner: "Malaysia" | RelocationCountry | "Balanced";
  interpretation: string;
};

function TopRelocationDifferencesPanel({ differences, country }: { differences: TopRelocationDifference[]; country: RelocationCountry }) {
  return (
    <section className="mt-6 rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,252,0.88))] p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] ring-1 ring-[#E5E8F0] backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Radar interpretation</p>
          <h4 className="mt-1 text-xl font-semibold text-[#081433]">Top 3 Factor Differences</h4>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#46536D]">
            CareerOS analysed the radar chart and highlighted the biggest trade-offs between Malaysia and {country}.
          </p>
        </div>
        <span className="rounded-full bg-[#F4F1FF] px-4 py-2 text-xs font-semibold text-[#5B3FD6]">Sorted by score gap</span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {differences.map((item, index) => (
          <RelocationDifferenceCard key={item.label} item={item} country={country} index={index} />
        ))}
      </div>
    </section>
  );
}

function RelocationDifferenceCard({ item, country, index }: { item: TopRelocationDifference; country: RelocationCountry; index: number }) {
  const Icon = comparisonCriterionIcons[getComparisonCriterionFromRadarLabel(item.label)];
  const badgeStyle = getRelocationWinnerStyle(item.winner, country);
  const malaysiaWidth = `${Math.max(8, Math.min(100, (item.current / 5) * 100))}%`;
  const countryWidth = `${Math.max(8, Math.min(100, (item.required / 5) * 100))}%`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="rounded-[1.5rem] bg-white/90 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.07)] ring-1 ring-[#E7EBF2] transition-shadow hover:shadow-[0_22px_52px_rgba(15,23,42,0.10)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FFF2F6] text-[#E00046]">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A8496]">{String(index + 1).padStart(2, "0")}</p>
            <h5 className="text-base font-semibold text-[#081433]">{item.label}</h5>
          </div>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={badgeStyle}>{item.winner} advantage</span>
      </div>

      <p className="mt-4 text-sm font-semibold text-[#081433]">+{item.difference.toFixed(1)} point gap</p>
      <div className="mt-4 grid gap-3">
        <MiniRelocationScoreBar label="Malaysia" score={item.current} width={malaysiaWidth} tone="malaysia" />
        <MiniRelocationScoreBar label={country} score={item.required} width={countryWidth} tone={item.winner === country ? "selected" : "neutral"} />
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-[#46536D]">{item.interpretation}</p>
    </motion.article>
  );
}

function MiniRelocationScoreBar({ label, score, width, tone }: { label: string; score: number; width: string; tone: "malaysia" | "selected" | "neutral" }) {
  const fill = tone === "malaysia" ? "linear-gradient(90deg,#27A66C,#BFEAD5)" : tone === "selected" ? "linear-gradient(90deg,#6757D8,#F18AA6)" : "linear-gradient(90deg,#CBD5E1,#E7EBF2)";
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-[#46536D]">
        <span>{label}</span>
        <span>{score.toFixed(1)}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#EEF2F7]">
        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width }} transition={{ duration: 0.45 }} style={{ background: fill }} />
      </div>
    </div>
  );
}

function getTopRelocationDifferences(factors: RelocationRadarFactor[], country: RelocationCountry, reachedRole: ReachedCareerRole): TopRelocationDifference[] {
  return factors
    .map((factor) => {
      const difference = Math.abs(factor.current - factor.required);
      const winner: TopRelocationDifference["winner"] = difference < 0.15 ? "Balanced" : factor.current > factor.required ? "Malaysia" : country;
      return {
        ...factor,
        difference,
        winner,
        interpretation: getRelocationDifferenceInterpretation(factor.label, winner, country, reachedRole),
      };
    })
    .sort((a, b) => b.difference - a.difference)
    .slice(0, 3);
}

function getRelocationDifferenceInterpretation(label: string, winner: TopRelocationDifference["winner"], country: RelocationCountry, reachedRole: ReachedCareerRole) {
  const roleContext = reachedRole.roleType === "current"
    ? `Because your reached role is ${reachedRole.roleTitle}, `
    : reachedRole.roleType === "upcoming"
      ? `Because ${reachedRole.roleTitle} is still upcoming, `
      : "";
  const selectedWins = winner === country;
  const malaysiaWins = winner === "Malaysia";

  if (winner === "Balanced") return "This factor is fairly balanced, so it should not be the main reason for or against relocation.";
  if (label === "Career Growth") return selectedWins
    ? `${country} may offer faster regional exposure and stronger career acceleration.`
    : "Malaysia may offer steadier career growth with lower adjustment pressure.";
  if (label === "Cost") return malaysiaWins
    ? `${roleContext}Malaysia may reduce monthly pressure and make the move easier to support financially.`
    : `${country} may be manageable only if income growth offsets higher living costs.`;
  if (label === "Work-Life") return malaysiaWins
    ? `${roleContext}Malaysia may support a more manageable lifestyle rhythm.`
    : `${country} may offer stronger structure or efficiency, but the pace may feel faster.`;
  if (label === "Visa Access") return malaysiaWins
    ? `${roleContext}Malaysia involves fewer relocation barriers if you are already based there.`
    : `${country} becomes more attractive if work eligibility and hiring pathways are clear.`;
  if (label === "Remote") return selectedWins
    ? `${country} may offer broader hybrid or regional remote opportunities.`
    : "Malaysia may be easier to use as a flexible base while testing remote opportunities.";
  if (label === "Competition") return malaysiaWins
    ? `${roleContext}Malaysia may feel easier to enter while your career proof is still developing.`
    : `${country} may expose you to a stronger talent market, but preparation quality matters more.`;
  if (label === "Industry") return selectedWins
    ? `${country} may offer stronger long-term industry exposure and career mobility.`
    : "Malaysia may be better for long-term comfort and lower financial pressure.";
  return "This factor shows one of the biggest differences between the two countries and should be reviewed before deciding.";
}

function getComparisonCriterionFromRadarLabel(label: string): ComparisonCriterion {
  const map: Record<string, ComparisonCriterion> = {
    "Career Growth": "Career Growth",
    "Work-Life": "Work-Life Balance",
    Remote: "Remote Opportunities",
    "Visa Access": "Visa / Entry Difficulty",
    Cost: "Cost Pressure",
    Competition: "Job Market Competition",
    Industry: "Industry Opportunities",
  };
  return map[label] ?? "Career Growth";
}

function getRelocationWinnerStyle(winner: TopRelocationDifference["winner"], country: RelocationCountry): React.CSSProperties {
  if (winner === "Malaysia") return { backgroundColor: "#E9F8F1", color: "#147A55" };
  if (winner === country) return { backgroundColor: "#F4F1FF", color: "#5B3FD6" };
  return { backgroundColor: "#FFF4D8", color: "#8A5A00" };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RelocationBalanceCard({ criterion, country, profile, index }: { criterion: ComparisonCriterion; country: RelocationCountry; profile: RelocationProfile; index: number }) {
  const Icon = comparisonCriterionIcons[criterion];
  const radarKey = getRelocationRadarKey(criterion);
  const malaysiaScore = malaysiaRelocationProfile.radar[radarKey];
  const countryScore = profile.radar[radarKey];
  const scoreDiff = countryScore - malaysiaScore;
  const indicatorPosition = Math.max(14, Math.min(86, 50 + scoreDiff * 9));
  const balanced = Math.abs(scoreDiff) < 0.25;
  const malaysiaAdvantage = scoreDiff < -0.25;
  const ringColor = balanced ? "#CBD5E1" : malaysiaAdvantage ? "#27A66C" : "#D75A6C";
  const shadowColor = balanced ? "rgba(100,116,139,0.20)" : malaysiaAdvantage ? "rgba(39,166,108,0.25)" : "rgba(215,90,108,0.24)";
  const malaysiaLine = getRelocationShortLine(malaysiaRelocationProfile.table[criterion]);
  const countryLine = getRelocationShortLine(profile.table[criterion]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.035 }}
      whileHover={{ y: -3 }}
      className="overflow-hidden rounded-[1.7rem] border border-[#E8ECF3] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.9))] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur transition-shadow hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] sm:p-6"
    >
      <div className="flex flex-col items-center text-center">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF4F7] text-[#D31850] shadow-[inset_0_0_0_1px_rgba(224,0,70,0.10)]">
          <Icon className="h-5 w-5" />
        </span>
        <h4 className="mt-3 text-lg font-semibold text-[#081433]">{criterion}</h4>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
          <span>Malaysia</span>
          <span>{country}</span>
        </div>
        <div className="relative h-10">
          <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#E9EDF4]" />
          {!balanced && malaysiaAdvantage && (
            <motion.div
              className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,rgba(39,166,108,0.72),rgba(39,166,108,0.18))]"
              initial={{ width: "0%" }}
              animate={{ width: `${indicatorPosition}%` }}
              transition={{ duration: 0.52, ease: "easeOut" }}
            />
          )}
          {!balanced && !malaysiaAdvantage && (
            <motion.div
              className="absolute right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,rgba(215,90,108,0.18),rgba(215,90,108,0.74))]"
              initial={{ width: "0%" }}
              animate={{ width: `${100 - indicatorPosition}%` }}
              transition={{ duration: 0.52, ease: "easeOut" }}
            />
          )}
          <motion.span
            className="absolute top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white"
            style={{ left: `${indicatorPosition}%`, border: `6px solid ${ringColor}`, boxShadow: `0 0 0 8px rgba(255,255,255,0.8), 0 10px 26px ${shadowColor}` }}
            initial={{ scale: 0.72, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.34, delay: 0.08 + index * 0.025 }}
            whileHover={{ scale: 1.08 }}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.15rem] bg-white/78 px-4 py-3 ring-1 ring-[#E8ECF3]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667085]">Malaysia</p>
            <p className="mt-1 text-sm font-semibold text-[#081433]">{malaysiaLine}</p>
          </div>
          <div className="rounded-[1.15rem] bg-white/78 px-4 py-3 ring-1 ring-[#E8ECF3]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667085]">{country}</p>
            <p className="mt-1 text-sm font-semibold text-[#081433]">{countryLine}</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function getRelocationRadarKey(criterion: ComparisonCriterion) {
  const map: Record<ComparisonCriterion, string> = {
    "Career Growth": "Career Growth",
    "Work-Life Balance": "Work-Life Balance",
    "Remote Opportunities": "Remote Opportunities",
    "Visa / Entry Difficulty": "Visa Difficulty",
    "Cost Pressure": "Cost Pressure",
    "Job Market Competition": "Job Market Competition",
    "Industry Opportunities": "Industry Opportunities",
  };
  return map[criterion];
}

function getRelocationShortLine(text: string) {
  return text.replace(/Ã‚Â·|Â·/g, "·").split("·")[0]?.trim() ?? text;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ComparisonCell({ text, highlighted = false }: { text: string; highlighted?: boolean }) {
  const [level, note = ""] = text.split(/\s(?:·|Â·)\s/);
  return (
    <div className={`flex min-h-[92px] flex-col items-center justify-center rounded-[1.1rem] p-4 text-center ${highlighted ? "bg-[#FFF7FA]" : "bg-[#FBFCFE]"}`}>
      <span className="rounded-full px-3 py-1 text-xs font-semibold" style={getComparisonChipStyle(level)}>{level}</span>
      <p className="mt-2 text-xs font-semibold leading-5 text-[#46536D]">{note}</p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CriteriaCell({ criterion }: { criterion: ComparisonCriterion }) {
  const Icon = comparisonCriterionIcons[criterion];
  return (
    <div className="flex min-h-[92px] flex-col items-center justify-center rounded-[1.1rem] bg-white p-4 text-center ring-1 ring-[#E5E8F0]">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF2F6] text-[#E00046]">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#46536D]">{criterion}</p>
    </div>
  );
}

function getComparisonChipStyle(level: string): React.CSSProperties {
  const value = level.toLowerCase();
  if (value.includes("very hard") || value.includes("hard") || value.includes("high pressure")) {
    return { backgroundColor: "#FFE8EE", color: "#C8003F" };
  }
  if (value.includes("very high") || value.includes("fast") || value.includes("structured") || value.includes("growing")) {
    return { backgroundColor: "#EAF0FF", color: "#3658B5" };
  }
  if (value.includes("strong") || value.includes("good") || value.includes("local access") || value.includes("lower pressure") || value.includes("stable growth")) {
    return { backgroundColor: "#E9F8F1", color: "#147A55" };
  }
  if (value.includes("moderate") || value.includes("medium") || value.includes("mixed") || value.includes("competitive") || value.includes("balanced")) {
    return { backgroundColor: "#FFF4D8", color: "#8A5A00" };
  }
  return { backgroundColor: "#EEF3FA", color: "#46536D" };
}

function getCountryRadar(selected: RelocationProfile) {
  const labels = [
    ["Career Growth", "Career Growth"],
    ["Work-Life", "Work-Life Balance"],
    ["Remote", "Remote Opportunities"],
    ["Visa Access", "Visa Difficulty"],
    ["Cost", "Cost Pressure"],
    ["Competition", "Job Market Competition"],
    ["Industry", "Industry Opportunities"],
  ];

  return labels.map(([label, key]) => ({
    label,
    current: malaysiaRelocationProfile.radar[key],
    required: selected.radar[key],
  }));
}

function AIRecommendationPanel({ country, profile, role, differences }: { country: RelocationCountry; profile: RelocationProfile; role: string; differences: TopRelocationDifference[] }) {
  const firstDifference = differences[0];
  const reading = firstDifference
    ? `${country} and Malaysia differ most on ${firstDifference.label.toLowerCase()}. ${firstDifference.winner === country ? `${country} leads here, so relocation may make sense if this is your priority.` : firstDifference.winner === "Malaysia" ? "Malaysia leads here, so staying longer may reduce pressure while you prepare." : "This factor is balanced, so review the next trade-off before deciding."}`
    : `For a ${role}, ${country} may offer ${profile.advantage.toLowerCase()} while Malaysia may remain safer if your timeline has financial pressure.`;

  return (
    <div className="mt-6 rounded-[1.8rem] bg-[radial-gradient(circle_at_94%_12%,rgba(240,77,122,0.18),transparent_13rem),linear-gradient(135deg,#081433,#152238)] p-5 text-white shadow-[0_22px_54px_rgba(8,20,51,0.18)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/78"><Sparkles className="h-3.5 w-3.5" />AI Recommendation</span>
          <h4 className="mt-4 text-2xl font-semibold">Why {country} may fit your plan</h4>
        </div>
        <span className="rounded-full bg-[#FFF2F6] px-4 py-2 text-sm font-semibold text-[#E00046]">Career fit: {profile.careerFit}</span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-[1.2rem] bg-white/10 p-4 ring-1 ring-white/12">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Main advantage</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/86">{profile.advantage}</p>
        </div>
        <div className="rounded-[1.2rem] bg-white/10 p-4 ring-1 ring-white/12">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Main trade-off</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/86">{profile.tradeOff}</p>
        </div>
      </div>
      <p className="mt-5 rounded-[1.2rem] bg-white px-4 py-4 text-sm font-semibold leading-6 text-[#081433]">
        For a {role}, {reading}
      </p>
    </div>
  );
}

function GrowthHobbyCompass({ timelineNodes, node }: { timelineNodes: TimelineNode[]; node: TimelineNode }) {
  const targetRole = getNextCareerRole(node, timelineNodes);
  const hobbies = [
    { name: "Photography", skill: "Visual Judgement", time: "1-2 hours/week", difficulty: "Beginner-friendly", bestFor: "Visual quality growth", why: "Photography trains composition, spacing, contrast, hierarchy, balance, and storytelling.", progression: "As you move toward senior level, sharper visual judgement helps you critique work with more clarity and explain quality decisions with confidence." },
    { name: "Writing", skill: "Design Communication", time: "1 hour/week", difficulty: "Beginner-friendly", bestFor: "Clearer explanation", why: "Writing builds clearer thinking and stronger explanation of decisions.", progression: "As you move toward senior level, concise writing helps you document rationale, align teams, and turn fuzzy ideas into decisions others can act on." },
    { name: "Volunteering", skill: "User Empathy", time: "2 hours/week", difficulty: "Moderate", bestFor: "People-centred growth", why: "Volunteering exposes you to people, constraints, and service situations.", progression: "As you move toward senior level, empathy helps you design with more context, understand diverse users, and make better product decisions." },
    { name: "Sketching", skill: "Creative Direction", time: "1 hour/week", difficulty: "Beginner-friendly", bestFor: "Idea exploration", why: "Sketching improves visual exploration and idea generation.", progression: "As you move toward senior level, quick sketching helps you explore options faster and guide conversations before teams over-invest in one solution." },
    { name: "Public Speaking", skill: "Leadership Confidence", time: "1-2 hours/week", difficulty: "Moderate", bestFor: "Influence building", why: "Speaking builds influence and senior-level communication.", progression: "As you move toward senior level, confident communication helps you frame trade-offs, present design decisions, and lead stakeholder discussions." },
    { name: "Strategy Games", skill: "Systems Thinking", time: "1 hour/week", difficulty: "Easy", bestFor: "Decision practice", why: "Strategy games build trade-off thinking and pattern recognition.", progression: "As you move toward senior level, systems thinking helps you understand dependencies, anticipate consequences, and make stronger product decisions." },
  ];
  const [selected, setSelected] = useState(hobbies[0]);

  return (
    <GoalFeaturePanel title="Growth Hobby Compass" eyebrow="Hobbies">
      <p className="mx-auto max-w-2xl text-center text-sm font-semibold leading-6 text-[#46536D]">
        Hobbies can quietly strengthen the judgement, empathy, and communication skills that support your next stage of career growth.
      </p>
      <div className="mt-7 flex justify-center">
        <div className="relative h-[430px] w-full max-w-[520px] rounded-full bg-[radial-gradient(circle,#FFFFFF_0%,#FFFFFF_24%,#FFF7FA_25%,#FFF7FA_44%,#FFFFFF_45%,#FFFFFF_62%,#F8F9FB_63%,#FFFFFF_100%)] shadow-[inset_0_0_0_1px_rgba(229,232,240,0.9),0_24px_60px_rgba(21,34,56,0.08)]">
          <div className="absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#081433] p-4 text-center text-base font-semibold leading-6 text-white shadow-[0_18px_42px_rgba(8,20,51,0.18)]">{targetRole}</div>
          {hobbies.map((hobby, index) => {
            const angle = (index / hobbies.length) * Math.PI * 2 - Math.PI / 2;
            const active = selected.name === hobby.name;
            return (
              <button
                key={hobby.name}
                type="button"
                onClick={() => setSelected(hobby)}
                className="absolute rounded-full border px-4 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * 178}px)`,
                  top: `calc(50% + ${Math.sin(angle) * 178}px)`,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: active ? theme.rose2 : "#fff",
                  color: active ? "#fff" : theme.navy,
                  borderColor: active ? theme.rose2 : theme.border,
                  boxShadow: active ? "0 16px 34px rgba(224,0,70,0.22), 0 0 0 7px rgba(224,0,70,0.08)" : "0 10px 24px rgba(21,34,56,0.08)",
                }}
              >
                {hobby.name}
              </button>
            );
          })}
        </div>
      </div>
      <SelectedHobbyInsightCard hobby={selected} targetRole={targetRole} />
    </GoalFeaturePanel>
  );
}

function SelectedHobbyInsightCard({ hobby, targetRole }: { hobby: { name: string; skill: string; time: string; difficulty: string; bestFor: string; why: string; progression: string }; targetRole: string }) {
  return (
    <div className="mx-auto mt-7 max-w-3xl rounded-[1.7rem] bg-white p-6 shadow-[0_18px_42px_rgba(21,34,56,0.08)] ring-1 ring-[#E5E8F0]">
      <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">Recommended for your next stage</span>
      <h4 className="mt-4 text-2xl font-semibold text-[#081433]">{hobby.name}</h4>
      <p className="mt-3 text-sm font-semibold text-[#E00046]">Strengthens: {hobby.skill}</p>
      <p className="mt-3 text-sm leading-6 text-[#46536D]">{hobby.why} This helps {targetRole} build stronger judgement, clearer context, and more mature career decision-making.</p>
      <div className="mt-5 rounded-[1.2rem] bg-[#FFF7FA] p-4">
        <p className="text-sm font-semibold text-[#081433]">Why it matters for your progression:</p>
        <p className="mt-2 text-sm leading-6 text-[#46536D]">{hobby.progression}</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MiniMetric label="Time commitment" value={hobby.time} />
        <MiniMetric label="Difficulty" value={hobby.difficulty} />
        <MiniMetric label="Best for" value={hobby.bestFor} />
      </div>
    </div>
  );
}

function SideCareerBlueprint({ node, timelineNodes }: { node: TimelineNode; timelineNodes: TimelineNode[] }) {
  const currentRole = getCurrentCareerRoleForGoal(node, timelineNodes);
  const branches = useMemo(() => getSideCareerBranches(currentRole), [currentRole]);
  const [selectedTitle, setSelectedTitle] = useState(branches[0].title);
  const selected = branches.find((branch) => branch.title === selectedTitle) ?? branches[0];

  return (
    <GoalFeaturePanel title="Side Career Branch Map" eyebrow="Side Income">
      <p className="mb-5 rounded-full bg-[#FFF2F6] px-4 py-2 text-sm font-semibold text-[#E00046]">Current role: {currentRole}</p>
      <div className="relative overflow-hidden rounded-[1.9rem] bg-[linear-gradient(180deg,#FFFFFF,#F8F9FB)] p-5 shadow-inner">
        <div className="pointer-events-none absolute left-1/2 top-[5.5rem] hidden h-px w-[68%] -translate-x-1/2 bg-[#DDE3F0] md:block" />
        <div className="pointer-events-none absolute left-1/2 top-[5.5rem] hidden h-16 w-px -translate-x-1/2 bg-[#DDE3F0] md:block" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mx-auto grid w-full max-w-[300px] place-items-center rounded-[1.4rem] bg-[#081433] px-5 py-4 text-center text-white shadow-[0_18px_42px_rgba(8,20,51,0.16)]">
          <p className="text-xs font-semibold text-white/55">Starting role</p>
          <p className="mt-1 text-lg font-semibold">{currentRole}</p>
        </motion.div>
        <div className="relative z-10 mt-12 grid gap-4 md:grid-cols-4">
          {branches.map((branch, index) => {
            const active = selected.title === branch.title;
            return (
              <motion.button
                key={branch.title}
                type="button"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTitle(branch.title)}
                className="relative rounded-[1.5rem] border bg-white p-4 text-left transition"
                style={{
                  borderColor: active ? theme.rose2 : theme.border,
                  boxShadow: active ? "0 20px 44px rgba(224,0,70,0.16), 0 0 0 6px rgba(224,0,70,0.07)" : "0 12px 28px rgba(21,34,56,0.08)",
                }}
              >
                <span className="absolute -top-8 left-1/2 hidden h-8 w-px -translate-x-1/2 bg-[#DDE3F0] md:block" />
                <p className="text-base font-semibold text-[#081433]">{branch.title}</p>
                <p className="mt-3 text-xs font-semibold text-[#46536D]">{branch.incomeType}</p>
                <div className="mt-4 grid gap-2">
                  <span className="rounded-full bg-[#FFF2F6] px-3 py-2 text-xs font-semibold text-[#E00046]">Fit: {branch.fit}</span>
                  <span className="rounded-full bg-[#F8F9FB] px-3 py-2 text-xs font-semibold text-[#46536D]">Start difficulty: {branch.difficulty}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      <SelectedSideCareerRoadmap branch={selected} />
    </GoalFeaturePanel>
  );
}

type SideCareerBranch = {
  title: string;
  incomeType: string;
  fit: string;
  difficulty: string;
  explanation: string;
  steps: { label: "Goal" | "Action" | "Result"; title: string; text: string; outcome: string; focus: string; effort: string; stage: string }[];
};

function getCurrentCareerRoleForGoal(node: TimelineNode, timelineNodes: TimelineNode[]) {
  return getReachedCareerRoleForNode(node, timelineNodes).roleTitle;
}

function createLaunchSteps(topic: { offer: string; proof: string; package: string; clients: string; feedback: string }) {
  return [
    { label: "Goal" as const, title: "Define your offer", text: topic.offer, outcome: "Clearer offer positioning", focus: "Positioning", effort: "Low", stage: "Early setup" },
    { label: "Action" as const, title: "Build proof", text: topic.proof, outcome: "Credible portfolio signal", focus: "Proof", effort: "Medium", stage: "Validation" },
    { label: "Action" as const, title: "Package the service", text: topic.package, outcome: "Repeatable service scope", focus: "Packaging", effort: "Medium", stage: "Offer design" },
    { label: "Action" as const, title: "Find first clients", text: topic.clients, outcome: "First market conversations", focus: "Outreach", effort: "High", stage: "Launch" },
    { label: "Result" as const, title: "Improve with feedback", text: topic.feedback, outcome: "Sharper offer and delivery", focus: "Iteration", effort: "Medium", stage: "Refinement" },
  ];
}

function getSideCareerBranches(currentRole: string): SideCareerBranch[] {
  const role = currentRole.toLowerCase();
  if (role.includes("data") || role.includes("analyst")) {
    return [
      { title: "Dashboard Freelancer", incomeType: "Project-based income", fit: "High", difficulty: "Medium", explanation: `Dashboard freelancing fits a ${currentRole} because it turns reporting, data cleaning, and visualization skills into clear business deliverables.`, steps: createLaunchSteps({
        offer: "Choose a simple service such as KPI dashboard cleanup, spreadsheet automation, or monthly reporting setup.",
        proof: "Create 2-3 sample dashboards that show raw data, analysis logic, and executive-ready output.",
        package: "Prepare your scope, source data requirements, delivery timeline, and starting price.",
        clients: "Reach out to small businesses, student startups, ecommerce sellers, or teams with messy reporting.",
        feedback: "Use early projects to refine your dashboard templates, metrics menu, and handover process.",
      }) },
      { title: "Analytics Tutor", incomeType: "Session-based income", fit: "Medium-High", difficulty: "Low-Medium", explanation: `Analytics tutoring branches naturally from a ${currentRole} when you can explain SQL, dashboards, and business metrics in practical language.`, steps: createLaunchSteps({
        offer: "Choose a focused tutoring promise such as Excel analytics, SQL basics, dashboard thinking, or portfolio case studies.",
        proof: "Prepare short sample lessons and before/after examples that show how you explain analysis.",
        package: "Create session formats, practice files, learning outcomes, and starter pricing.",
        clients: "Reach out to students, career switchers, junior analysts, or bootcamp communities.",
        feedback: "Use learner questions to improve your curriculum, exercises, and explanation style.",
      }) },
      { title: "Data Consultant", incomeType: "Advisory income", fit: "High", difficulty: "Medium-High", explanation: `Data consulting fits a ${currentRole} because it uses business questioning, metric design, and insight translation to help teams make better decisions.`, steps: createLaunchSteps({
        offer: "Choose a diagnostic service such as reporting audit, metric definition, or analytics workflow review.",
        proof: "Create sample audits that show problems, cleaned metrics, and recommended decisions.",
        package: "Set a clear review method, meeting structure, deliverable format, and timeline.",
        clients: "Approach small teams that track sales, marketing, operations, or product data manually.",
        feedback: "Use each engagement to sharpen your framework, templates, and recommendation quality.",
      }) },
      { title: "Data Template Creator", incomeType: "Productized income", fit: "Medium", difficulty: "Medium", explanation: `Template creation lets a ${currentRole} turn repeatable dashboards, trackers, and analysis workflows into reusable digital products.`, steps: createLaunchSteps({
        offer: "Choose one template such as a KPI tracker, hiring dashboard, campaign report, or budget analysis workbook.",
        proof: "Build a polished demo with realistic dummy data and a clear use case.",
        package: "Prepare instructions, example outputs, pricing, and a simple product page.",
        clients: "Share the template with founders, students, operators, or analyst communities.",
        feedback: "Use downloads and questions to improve usability, documentation, and template variants.",
      }) },
    ];
  }
  if (role.includes("marketing")) {
    return [
      { title: "Content Strategist", incomeType: "Retainer income", fit: "High", difficulty: "Medium", explanation: `Content strategy fits a ${currentRole} because campaign planning, audience insight, and messaging can become a repeatable service.`, steps: createLaunchSteps({ offer: "Choose a focused service such as LinkedIn content planning, newsletter strategy, or campaign messaging.", proof: "Create sample calendars, content audits, and before/after messaging examples.", package: "Prepare monthly scope, deliverables, review cadence, and starter price.", clients: "Reach out to founders, creators, small businesses, or student startups.", feedback: "Use performance data and client feedback to sharpen your strategy templates." }) },
      { title: "SEO Freelancer", incomeType: "Project-based income", fit: "Medium-High", difficulty: "Medium", explanation: `SEO freelancing branches from a ${currentRole} when you can connect content, search intent, and business goals.`, steps: createLaunchSteps({ offer: "Choose a service such as keyword research, content refresh, or SEO audit.", proof: "Build sample audits with search opportunities, page fixes, and content outlines.", package: "Prepare scope, timeline, deliverables, and reporting format.", clients: "Approach small websites, blogs, ecommerce sellers, or service businesses.", feedback: "Use early rankings and traffic results to refine your audit process." }) },
      { title: "Brand Copywriter", incomeType: "Project-based income", fit: "Medium", difficulty: "Low-Medium", explanation: `Copywriting fits a ${currentRole} when audience research and campaign messaging become clear landing pages, ads, or emails.`, steps: createLaunchSteps({ offer: "Choose a service such as landing page copy, email sequence, or ad messaging.", proof: "Create 2-3 rewrite samples that show clearer positioning and calls to action.", package: "Prepare intake questions, revision limits, timeline, and price.", clients: "Reach out to personal brands, small businesses, and early-stage apps.", feedback: "Use response quality and conversion signals to improve your copy process." }) },
      { title: "Campaign Consultant", incomeType: "Advisory income", fit: "High", difficulty: "Medium-High", explanation: `Campaign consulting uses your marketing judgement to help teams plan, diagnose, and improve launches.`, steps: createLaunchSteps({ offer: "Choose a consulting angle such as launch review, funnel audit, or campaign planning.", proof: "Create a sample campaign teardown with issues, opportunities, and recommendations.", package: "Set your review method, deliverable, meeting format, and timeline.", clients: "Approach founders, student startups, creators, or local businesses.", feedback: "Use each project to refine your campaign checklist and recommendation quality." }) },
    ];
  }
  if (role.includes("software") || role.includes("engineer") || role.includes("developer")) {
    return [
      { title: "Website Builder", incomeType: "Project-based income", fit: "High", difficulty: "Medium", explanation: `Website building fits a ${currentRole} because implementation skills can become clear, scoped business outcomes.`, steps: createLaunchSteps({ offer: "Choose a service such as landing page build, portfolio site, or small business website.", proof: "Create 2-3 demo sites showing responsive layout, performance, and clean handoff.", package: "Prepare scope, tech stack, timeline, hosting notes, and starting price.", clients: "Reach out to small businesses, creators, founders, or student startups.", feedback: "Use early builds to refine your components, timeline, and handoff checklist." }) },
      { title: "Automation Freelancer", incomeType: "Project-based income", fit: "High", difficulty: "Medium-High", explanation: `Automation freelancing branches from a ${currentRole} when you can save teams time with scripts, integrations, and workflows.`, steps: createLaunchSteps({ offer: "Choose a service such as workflow automation, report generation, or internal tool cleanup.", proof: "Build demos showing manual process before and automated process after.", package: "Prepare discovery questions, security boundaries, deliverables, and support terms.", clients: "Approach operators, small teams, and businesses doing repetitive manual work.", feedback: "Use early projects to refine reusable scripts, documentation, and maintenance options." }) },
      { title: "Coding Tutor", incomeType: "Session-based income", fit: "Medium-High", difficulty: "Low-Medium", explanation: `Coding tutoring fits a ${currentRole} if you can explain technical concepts clearly to beginners or juniors.`, steps: createLaunchSteps({ offer: "Choose a focused tutoring promise such as React basics, debugging, or portfolio projects.", proof: "Prepare lesson snippets, practice tasks, and simple before/after examples.", package: "Create session length, learning outcomes, homework, and starter pricing.", clients: "Reach out to students, bootcamp learners, or junior developers.", feedback: "Use student questions to improve lesson flow and examples." }) },
      { title: "Technical Consultant", incomeType: "Advisory income", fit: "Medium", difficulty: "High", explanation: `Technical consulting uses your engineering judgement to help teams make better implementation decisions.`, steps: createLaunchSteps({ offer: "Choose a review service such as codebase audit, architecture review, or performance diagnosis.", proof: "Create sample reports showing issues, impact, and recommended fixes.", package: "Define access needs, review scope, deliverable format, and follow-up support.", clients: "Approach early-stage apps, founders, or teams with visible technical debt.", feedback: "Use each engagement to improve your checklist and communication style." }) },
    ];
  }
  return [
    { title: "UI Freelancer", incomeType: "Project-based income", fit: "High", difficulty: "Medium", explanation: `UI freelancing fits a ${currentRole} because it turns screen design, Figma speed, and visual problem-solving into clear project-based services.`, steps: createLaunchSteps({
      offer: "Choose a simple service such as landing page redesign, app screen design, or dashboard UI cleanup.",
      proof: "Create 2-3 sample projects that show your design process and final screens.",
      package: "Prepare your scope, timeline, deliverables, and starting price.",
      clients: "Reach out to small businesses, student startups, personal brands, or early-stage apps.",
      feedback: "Use early conversations and projects to refine your offer and portfolio.",
    }) },
    { title: "UX Mentor", incomeType: "Session-based income", fit: "Medium-High", difficulty: "Low-Medium", explanation: `UX mentoring fits a ${currentRole} when you can translate design process, portfolio thinking, and early-career lessons into practical guidance for juniors.`, steps: [
      { label: "Goal", title: "Define your audience", text: "Choose whether you help students, career switchers, or junior designers.", outcome: "Clearer audience fit", focus: "Positioning", effort: "Low", stage: "Early setup" },
      { label: "Action", title: "Shape your session", text: "Create a 45-60 minute mentoring format around portfolio review, UX process, or interview prep.", outcome: "Repeatable session format", focus: "Offer design", effort: "Medium", stage: "Validation" },
      { label: "Action", title: "Create credibility proof", text: "Prepare examples, testimonials, or short posts that show how you think about design growth.", outcome: "Trust signal", focus: "Proof", effort: "Medium", stage: "Validation" },
      { label: "Action", title: "Find first mentees", text: "Offer a few pilot sessions through design communities, classmates, or LinkedIn.", outcome: "First conversations", focus: "Outreach", effort: "High", stage: "Launch" },
      { label: "Result", title: "Improve with feedback", text: "Use early sessions to refine your structure, pricing, and repeatable mentoring materials.", outcome: "Sharper mentoring product", focus: "Iteration", effort: "Medium", stage: "Refinement" },
    ] },
    { title: "Course Creator", incomeType: "Productized income", fit: "Medium", difficulty: "High", explanation: `Course creation branches from a ${currentRole} when you can package your workflow into lessons, templates, and repeatable learning outcomes.`, steps: [
      { label: "Goal", title: "Pick one focused topic", text: "Choose a narrow course promise such as Figma dashboard design or UX portfolio case studies.", outcome: "Focused course promise", focus: "Positioning", effort: "Low", stage: "Early setup" },
      { label: "Action", title: "Outline the learning path", text: "Break the topic into short modules with exercises and practical outputs.", outcome: "Clear curriculum", focus: "Structure", effort: "Medium", stage: "Offer design" },
      { label: "Action", title: "Build a mini version", text: "Record or write a small pilot lesson to test clarity and demand.", outcome: "Testable lesson", focus: "Proof", effort: "High", stage: "Validation" },
      { label: "Action", title: "Launch to a small audience", text: "Share the pilot with design students, juniors, or career switchers.", outcome: "Early demand signal", focus: "Launch", effort: "High", stage: "Launch" },
      { label: "Result", title: "Improve with feedback", text: "Use completion, questions, and testimonials to refine the course before scaling.", outcome: "Better course-market fit", focus: "Iteration", effort: "Medium", stage: "Refinement" },
    ] },
    { title: "Design Consultant", incomeType: "Advisory income", fit: "High", difficulty: "Medium-High", explanation: `Design consulting fits a ${currentRole} because it uses audit skills, product judgement, and communication to help teams improve user experience decisions.`, steps: [
      { label: "Goal", title: "Define your consulting angle", text: "Choose a service such as UX audit, dashboard redesign review, or onboarding flow improvement.", outcome: "Specific consulting lane", focus: "Positioning", effort: "Low", stage: "Early setup" },
      { label: "Action", title: "Build diagnostic proof", text: "Create sample audits that show problems, reasoning, and recommended fixes.", outcome: "Credibility proof", focus: "Proof", effort: "Medium", stage: "Validation" },
      { label: "Action", title: "Package the engagement", text: "Set a clear scope, review method, deliverable format, and meeting structure.", outcome: "Repeatable advisory offer", focus: "Packaging", effort: "Medium", stage: "Offer design" },
      { label: "Action", title: "Find first clients", text: "Approach small SaaS teams, student startups, or founders with visible UX issues.", outcome: "First advisory leads", focus: "Outreach", effort: "High", stage: "Launch" },
      { label: "Result", title: "Improve with feedback", text: "Use each project to sharpen your framework, pricing, and before/after portfolio proof.", outcome: "Stronger consulting system", focus: "Iteration", effort: "Medium", stage: "Refinement" },
    ] },
  ];
}

function SelectedSideCareerRoadmap({ branch }: { branch: SideCareerBranch }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={branch.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }} className="mt-6 rounded-[1.8rem] bg-white p-5 shadow-[0_18px_42px_rgba(21,34,56,0.08)] ring-1 ring-[#E5E8F0]">
        <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">Selected branch</span>
        <h4 className="mt-4 text-2xl font-semibold text-[#081433]">{branch.title}</h4>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-[#46536D]">{branch.explanation}</p>
        <div className="relative mt-6 grid gap-5">
          <div className="absolute bottom-10 left-[1.25rem] top-8 w-1 rounded-full bg-[linear-gradient(180deg,#F04D7A,#DDE3F0_72%,#F8F9FB)]" />
          {branch.steps.map((step, index) => (
            <div key={step.title} className="relative grid grid-cols-[3rem_1fr] gap-4">
              <div className="relative z-10">
                <span className="grid h-11 w-11 place-items-center rounded-full border-4 border-white bg-[#081433] text-xs font-semibold text-white shadow-[0_0_0_2px_rgba(8,20,51,0.16),0_12px_26px_rgba(8,20,51,0.18)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mx-auto mt-2 block h-2 w-2 rounded-full bg-[#F04D7A]/45" />
              </div>
              <div className="relative rounded-[1.4rem] bg-[#FFF7FA] p-4 shadow-sm ring-1 ring-[#F5CBD6] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(21,34,56,0.10)]">
                <span className="absolute -left-4 top-7 hidden h-px w-4 bg-[#F5CBD6] sm:block" />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#E00046] shadow-sm">{step.label}</span>
                  <span className="rounded-full bg-[#081433] px-3 py-1 text-[11px] font-semibold text-white">Outcome: {step.outcome}</span>
                </div>
                <p className="mt-3 text-base font-semibold text-[#081433]">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#46536D]">{step.text}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#46536D]">Focus: {step.focus}</span>
                  <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#46536D]">Effort: {step.effort}</span>
                  <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#46536D]">Stage: {step.stage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

type RetirementVisionKey = "travel" | "business" | "volunteer" | "mentor" | "family" | "hobbies";

type GuidedRetirementVisionKey = "travel" | "family" | "business" | "hobbies";

type GuidedRetirementCompatibility = {
  status: "Highly Compatible" | "Moderately Compatible" | "Needs Adjustment";
  score: number;
  explanation: string;
  opportunity: string;
  gap: string;
  summary: { title: string; level: string; text: string }[];
};

type GuidedTimelinePreviewItem = {
  year: number;
  title: string;
  status: "Added" | "Shifted" | "Unchanged";
  fromYear?: number;
};

const guidedRetirementVisionOptions: {
  key: GuidedRetirementVisionKey;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
}[] = [
  {
    key: "travel",
    title: "Travel the World",
    subtitle: "Freedom, movement, discovery",
    description: "Build a retirement lifestyle with flexibility, travel, and new experiences.",
    icon: Plane,
    gradient: "linear-gradient(135deg,#F4FAFF 0%,#E7F1FF 50%,#FFF7FA 100%)",
    glow: "rgba(77,140,240,0.20)",
  },
  {
    key: "family",
    title: "Spend Time with Family",
    subtitle: "Presence, relationships, stability",
    description: "Prioritise meaningful time with family, home life, and long-term personal stability.",
    icon: Home,
    gradient: "linear-gradient(135deg,#FFF8EF 0%,#FFF1F6 52%,#F7FAFF 100%)",
    glow: "rgba(240,150,77,0.18)",
  },
  {
    key: "business",
    title: "Start a Passion Business",
    subtitle: "Purpose, ownership, independence",
    description: "Turn a personal interest or long-term dream into a small business after your main career.",
    icon: Rocket,
    gradient: "linear-gradient(135deg,#F7F2FF 0%,#FFF7FA 48%,#F3FFF9 100%)",
    glow: "rgba(224,0,70,0.18)",
  },
  {
    key: "hobbies",
    title: "Pursue Hobbies Full-Time",
    subtitle: "Creativity, enjoyment, personal time",
    description: "Spend more time on personal interests, creative projects, and hobbies without full-time work pressure.",
    icon: Palette,
    gradient: "linear-gradient(135deg,#FFF7FA 0%,#F5F8FF 52%,#FFFBEA 100%)",
    glow: "rgba(120,90,220,0.16)",
  },
];

function getGuidedRetirementRecommendations(vision: GuidedRetirementVisionKey): RetirementRecommendation[] {
  const recommendations: Record<GuidedRetirementVisionKey, RetirementRecommendation[]> = {
    travel: [
      { id: "retirement-side-income", title: "Add extra income support", summary: "Suggested chapter: Build side income while working", explanation: "Extra income can increase flexibility for travel-focused retirement planning using an existing CareerOS goal.", actionType: "insert-goal", goalKey: "side-business", targetYear: 6, durationMonths: 12, selected: true, applied: false, supports: ["Travel the World"], badge: "Add chapter", sourceVision: "travel" },
      { id: "retirement-investing", title: "Strengthen long-term contribution habit", summary: "Suggested chapter: Start investing", explanation: "A light investing chapter can support long-term planning without creating a new retirement-specific chapter.", actionType: "insert-goal", goalKey: "investing", targetYear: 7, durationMonths: 6, selected: true, applied: false, supports: ["Travel the World"], badge: "Add chapter", sourceVision: "travel" },
      { id: "retirement-emergency-savings", title: "Protect travel plans from short-term shocks", summary: "Suggested chapter: Build emergency savings", explanation: "A cash buffer reduces the chance of using long-term savings for short-term problems before retirement.", actionType: "insert-goal", goalKey: "emergency-savings", targetYear: 5, durationMonths: 12, selected: true, applied: false, supports: ["Travel the World"], badge: "Add chapter", sourceVision: "travel" },
    ],
    family: [
      { id: "retirement-emergency-savings", title: "Protect family-centred stability", summary: "Suggested chapter: Build emergency savings", explanation: "A cash buffer keeps family and retirement plans more resilient without adding a new chapter type.", actionType: "insert-goal", goalKey: "emergency-savings", targetYear: 5, durationMonths: 12, selected: true, applied: false, supports: ["Spend Time with Family"], badge: "Add chapter", sourceVision: "family" },
      { id: "retirement-buy-house", title: "Clarify long-term home base", summary: "Suggested chapter: Buy a house", explanation: "If home stability matters for retirement, use the existing housing goal to plan location and ownership pressure.", actionType: "insert-goal", goalKey: "buy-house", targetYear: 7, durationMonths: 12, selected: true, applied: false, supports: ["Spend Time with Family"], badge: "Add chapter", sourceVision: "family" },
      { id: "retirement-family-planning", title: "Align family priorities earlier", summary: "Suggested chapter: Get married / family planning", explanation: "This maps family-centred retirement planning to an existing family chapter instead of creating a new one.", actionType: "insert-goal", goalKey: "family-planning", targetYear: 6, durationMonths: 6, selected: true, applied: false, supports: ["Spend Time with Family"], badge: "Add chapter", sourceVision: "family" },
    ],
    business: [
      { id: "retirement-side-income", title: "Test business ideas before retirement", summary: "Suggested chapter: Build side income while working", explanation: "Side income lets you validate small business ideas while staying inside the existing CareerOS goal system.", actionType: "insert-goal", goalKey: "side-business", targetYear: 6, durationMonths: 12, selected: true, applied: false, supports: ["Start a Passion Business"], badge: "Add chapter", sourceVision: "business" },
      { id: "retirement-study", title: "Build skills for ownership", summary: "Suggested chapter: Study again part-time", explanation: "If the business path needs learning, map it to the existing part-time study chapter instead of a custom certification.", actionType: "insert-goal", goalKey: "study-again", targetYear: 8, durationMonths: 6, selected: true, applied: false, supports: ["Start a Passion Business"], badge: "Add chapter", sourceVision: "business" },
      { id: "retirement-investing", title: "Strengthen long-term contribution habit", summary: "Suggested chapter: Start investing", explanation: "A contribution habit can support future independence while remaining an existing allowed goal chapter.", actionType: "insert-goal", goalKey: "investing", targetYear: 7, durationMonths: 6, selected: true, applied: false, supports: ["Start a Passion Business"], badge: "Add chapter", sourceVision: "business" },
    ],
    hobbies: [
      { id: "retirement-hobbies", title: "Build hobby identity before retirement", summary: "Suggested chapter: Pursue hobbies casually", explanation: "Use the existing hobbies goal to build routines before retirement becomes the first time you explore them.", actionType: "insert-goal", goalKey: "hobbies", targetYear: 5, durationMonths: 6, selected: true, applied: false, supports: ["Pursue Hobbies Full-Time"], badge: "Add chapter", sourceVision: "hobbies" },
      { id: "retirement-emergency-savings", title: "Protect creative freedom with a buffer", summary: "Suggested chapter: Build emergency savings", explanation: "A buffer supports personal freedom without creating a custom retirement savings chapter.", actionType: "insert-goal", goalKey: "emergency-savings", targetYear: 6, durationMonths: 12, selected: true, applied: false, supports: ["Pursue Hobbies Full-Time"], badge: "Add chapter", sourceVision: "hobbies" },
      { id: "retirement-side-income", title: "Create flexible income support", summary: "Suggested chapter: Build side income while working", explanation: "Extra income can make hobby-focused retirement more flexible using an existing side income chapter.", actionType: "insert-goal", goalKey: "side-business", targetYear: 7, durationMonths: 12, selected: true, applied: false, supports: ["Pursue Hobbies Full-Time"], badge: "Add chapter", sourceVision: "hobbies" },
    ],
  };

  return recommendations[vision];
}

function inferGuidedRetirementVisionFromNode(node: TimelineNode): GuidedRetirementVisionKey | null {
  if (node.retirementVisionKey) return node.retirementVisionKey;
  if (node.sourceLifeGoalKey !== "retirement" && !node.lifeGoalKey?.startsWith("retirement-")) return null;

  const value = `${node.lifeGoalKey ?? ""} ${node.title}`.toLowerCase();
  if (value.includes("family") || value.includes("house")) return "family";
  if (value.includes("hobby")) return "hobbies";
  if (value.includes("travel") || value.includes("emergency") || value.includes("invest")) return "travel";
  return "business";
}

function getAllowedRetirementGoalOption(recommendation: RetirementRecommendation) {
  if (!recommendation.goalKey) return null;
  const option = getLifeOption(recommendation.goalKey);
  return option?.chapterKind === "goal" ? option : null;
}

function isRetirementRecommendationAlreadyPlanned(recommendation: RetirementRecommendation, timelineNodes: TimelineNode[]) {
  const option = getAllowedRetirementGoalOption(recommendation);
  if (!option) return false;
  return timelineNodes.some((node) => node.type === "life" && node.chapterKind === "goal" && (node.lifeGoalKey === option.key || node.title.toLowerCase() === option.title.toLowerCase()));
}

function GuidedRetirementRoadmapEditor({ node, timelineNodes, onApplyRecommendations }: { node: TimelineNode; timelineNodes: TimelineNode[]; onApplyRecommendations: (recommendations: RetirementRecommendation[]) => void }) {
  const initialVision = inferGuidedRetirementVisionFromNode(node);
  const [selectedVision, setSelectedVision] = useState<GuidedRetirementVisionKey | null>(initialVision);
  const [activatingVision, setActivatingVision] = useState<GuidedRetirementVisionKey | null>(null);
  const [recommendations, setRecommendations] = useState<RetirementRecommendation[]>(() => initialVision ? getGuidedRetirementRecommendations(initialVision) : []);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const selectedRecommendations = recommendations.filter((item) => item.selected && !item.applied && !isRetirementRecommendationAlreadyPlanned(item, timelineNodes));
  const selectedVisionOption = selectedVision ? guidedRetirementVisionOptions.find((option) => option.key === selectedVision) : null;
  const compatibility = selectedVision ? getGuidedRetirementCompatibility(selectedVision) : null;

  function chooseVision(key: GuidedRetirementVisionKey) {
    setSelectedVision(key);
    setRecommendations(getGuidedRetirementRecommendations(key));
    setShowPreview(false);
    setConfirmation("");
  }

  function stageVisionSelection(key: GuidedRetirementVisionKey) {
    setActivatingVision(key);
    window.setTimeout(() => {
      chooseVision(key);
      setActivatingVision(null);
    }, 220);
  }

  function changeVision() {
    setSelectedVision(null);
    setActivatingVision(null);
    setRecommendations([]);
    setShowPreview(false);
    setConfirmation("");
  }

  function toggleRecommendation(id: string) {
    setRecommendations((current) => current.map((item) => item.id === id ? { ...item, selected: !item.selected } : item));
  }

  function applyRecommendations(items: RetirementRecommendation[]) {
    if (items.length === 0) return;
    onApplyRecommendations(items);
    setRecommendations((current) => current.map((item) => items.some((applied) => applied.id === item.id) ? { ...item, applied: true, selected: false } : item));
    setShowPreview(false);
    setConfirmation("Your Life Chapter timeline has been updated.");
  }

  return (
    <GoalFeaturePanel title="Retirement Vision Roadmap Editor" eyebrow="Plan for Retirement">
      <p className="max-w-3xl text-sm font-semibold leading-6 text-[#46536D]">Design the life you want after your main career, then let CareerOS reshape your roadmap around it.</p>

      <AnimatePresence mode="wait">
        {!selectedVision ? (
          <motion.section
            key="retirement-vision-select"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35 }}
            className="mt-6 overflow-hidden rounded-[2rem] bg-white p-4 shadow-[0_18px_46px_rgba(21,34,56,0.08)] ring-1 ring-[#E5E8F0] sm:p-5"
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E00046]">Choose Your Retirement Vision</p>
              <h3 className="mt-2 text-2xl font-semibold text-[#081433]">What kind of life do you want after your main career?</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#46536D]">Start by choosing the retirement lifestyle that feels closest to your future vision.</p>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {guidedRetirementVisionOptions.map((option, index) => {
                const Icon = option.icon;
                const active = activatingVision === option.key;
                return (
                  <motion.button
                    key={option.key}
                    type="button"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => stageVisionSelection(option.key)}
                    className="group relative min-h-[175px] overflow-hidden rounded-[1.35rem] border bg-white text-left shadow-sm transition"
                    style={{ borderColor: active ? theme.rose2 : "rgba(226,232,240,0.95)", boxShadow: active ? "0 18px 38px rgba(224,0,70,0.18)" : `0 12px 28px ${option.glow}` }}
                  >
                    <div className="relative h-20 overflow-hidden" style={{ background: option.gradient }}>
                      <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
                      <div className="absolute bottom-3 left-4 grid h-11 w-11 place-items-center rounded-[0.9rem] bg-white/90 text-[#E00046] shadow-[0_10px_22px_rgba(21,34,56,0.10)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Icon className="absolute right-4 top-4 h-14 w-14 text-[#081433]/[0.08] transition duration-300 group-hover:scale-110" />
                    </div>
                    {active && <span className="absolute right-4 top-4 rounded-full bg-[#E00046] px-3 py-1 text-xs font-semibold text-white">Selected</span>}
                    <div className="p-4">
                      <p className="text-lg font-semibold leading-6 text-[#081433]">{option.title}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-[#E00046]">{option.subtitle}</p>
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EEF1F6] pt-3">
                        <span className="rounded-full bg-[#FFF7FA] px-2.5 py-1 text-[11px] font-semibold text-[#E00046] ring-1 ring-[#F5CBD6]">Lifestyle fit</span>
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#081433] text-white shadow-sm transition group-hover:translate-x-0.5">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        ) : (
          <motion.div key="retirement-analysis-flow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.38 }}>
            <section className="mt-6 rounded-[1.9rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Retirement Compatibility Analysis</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#081433]">Selected Vision: {selectedVisionOption?.title}</h3>
                </div>
                <button type="button" onClick={changeVision} className="rounded-full bg-[#F8F9FB] px-4 py-2 text-sm font-semibold text-[#081433] shadow-sm ring-1 ring-[#E5E8F0]">Change vision</button>
              </div>

              {compatibility && (
                <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[1.6rem] p-5" style={{ backgroundColor: compatibility.status === "Highly Compatible" ? "#E9F8F1" : compatibility.status === "Moderately Compatible" ? "#FFF4D8" : "#FFE8EE" }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46536D]">Overall Compatibility</p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-2xl font-semibold" style={{ color: getGuidedCompatibilityColor(compatibility.status) }}>{compatibility.status}</p>
                        <p className="mt-1 text-sm font-semibold text-[#46536D]">Compatibility Score: {compatibility.score}%</p>
                      </div>
                      <span className="text-4xl font-semibold" style={{ color: getGuidedCompatibilityColor(compatibility.status) }}>{compatibility.score}%</span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/80">
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${compatibility.score}%` }} transition={{ duration: 0.75, ease: "easeOut" }} style={{ backgroundColor: getGuidedCompatibilityColor(compatibility.status) }} />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[#46536D]">{compatibility.explanation}</p>
                    <div className="mt-4 grid gap-3">
                      <MiniMetric label="Key opportunity" value={compatibility.opportunity} />
                      <MiniMetric label="Key gap" value={compatibility.gap} />
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] bg-[#F8F9FB] p-5">
                    <p className="font-semibold text-[#081433]">Vision Fit Summary</p>
                    <div className="mt-4 grid gap-3">
                      {compatibility.summary.map((item, index) => (
                        <motion.div key={item.title} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} className="rounded-[1.2rem] bg-white p-4 shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold text-[#081433]">{item.title}</p>
                            <span className="rounded-full bg-[#FFF7FA] px-3 py-1 text-xs font-semibold text-[#E00046]">{item.level}</span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#46536D]">{item.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="mt-6 rounded-[1.9rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-[#081433]">AI Recommendation Plan</h3>
                  <p className="mt-1 text-sm font-semibold text-[#46536D]">{recommendations.length} Timeline Updates Ready</p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#46536D]">CareerOS has prepared timeline updates to better align your roadmap with your selected retirement vision.</p>
                </div>
                {confirmation && <span className="rounded-full bg-[#E9F8F1] px-4 py-2 text-xs font-semibold text-[#147A55]">{confirmation}</span>}
              </div>

              <div className="mt-5 grid gap-3">
                {recommendations.map((item, index) => {
                  const option = getAllowedRetirementGoalOption(item);
                  const alreadyPlanned = isRetirementRecommendationAlreadyPlanned(item, timelineNodes);
                  const Icon = option?.icon ?? Sparkles;
                  return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-[1.35rem] border bg-[#F8F9FB] p-4 transition" style={{ borderColor: item.selected ? "#F5CBD6" : "#E5E8F0", boxShadow: item.selected ? "0 16px 34px rgba(224,0,70,0.10)" : "none" }}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <label className="flex flex-1 cursor-pointer items-start gap-3">
                        <input type="checkbox" checked={item.selected} disabled={item.applied || alreadyPlanned} onChange={() => toggleRecommendation(item.id)} className="mt-1 h-4 w-4 accent-[#E00046]" />
                        <span>
                          <span className="block text-base font-semibold text-[#081433]">{item.title}</span>
                          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#E00046] ring-1 ring-[#F5CBD6]">
                            <Icon className="h-3.5 w-3.5" />
                            Suggested chapter: {option?.title ?? "Existing goal chapter"}
                          </span>
                          <span className="mt-2 block text-sm leading-6 text-[#46536D]">{item.explanation}</span>
                        </span>
                      </label>
                    </div>
                  </motion.div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" disabled={selectedRecommendations.length === 0} onClick={() => setShowPreview(true)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#081433] shadow-sm ring-1 ring-[#E5E8F0] disabled:opacity-45">Preview Changes</button>
                <button type="button" disabled={selectedRecommendations.length === 0} onClick={() => applyRecommendations(selectedRecommendations)} className="rounded-full bg-[#E00046] px-5 py-3 text-sm font-semibold text-white disabled:opacity-45">Apply Selected Changes</button>
                <button type="button" disabled={recommendations.every((item) => item.applied || isRetirementRecommendationAlreadyPlanned(item, timelineNodes))} onClick={() => applyRecommendations(recommendations.filter((item) => !item.applied && !isRetirementRecommendationAlreadyPlanned(item, timelineNodes)))} className="rounded-full bg-[#081433] px-5 py-3 text-sm font-semibold text-white disabled:opacity-45">Apply All</button>
              </div>
              {selectedRecommendations.length === 0 && <p className="mt-3 text-sm font-semibold text-[#46536D]">Select at least one recommendation to preview or apply.</p>}
            </section>

            <AnimatePresence>
              {showPreview && <GuidedRetirementTimelinePreview recommendations={selectedRecommendations} onApply={() => applyRecommendations(selectedRecommendations)} onBack={() => setShowPreview(false)} />}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </GoalFeaturePanel>
  );
}

function getGuidedRetirementCompatibility(vision: GuidedRetirementVisionKey): GuidedRetirementCompatibility {
  const insights: Record<GuidedRetirementVisionKey, GuidedRetirementCompatibility> = {
    travel: {
      status: "Moderately Compatible",
      score: 68,
      explanation: "Your career roadmap supports long-term travel flexibility, but stronger income flexibility and remote-friendly planning would improve readiness.",
      opportunity: "Career progression can provide stable income and stronger savings capacity.",
      gap: "You may need more flexible income streams and fewer location-dependent career commitments.",
      summary: [
        { title: "Travel Readiness", level: "Moderate", text: "Your roadmap can support travel, but only if flexibility is planned early." },
        { title: "Lifestyle Alignment", level: "High", text: "This vision fits well with a future that values freedom and movement." },
        { title: "Preparation Need", level: "Medium", text: "Side income and remote-friendly skills would make this goal more realistic." },
      ],
    },
    family: {
      status: "Highly Compatible",
      score: 78,
      explanation: "Your career roadmap generally supports a retirement focused on family, stability, and presence, but workload intensity should be managed earlier.",
      opportunity: "A stable career path can support family-centred retirement planning.",
      gap: "You may need to avoid overextending your career timeline or delaying personal priorities too much.",
      summary: [
        { title: "Family Readiness", level: "High", text: "Your roadmap can support a stable home and family-focused lifestyle." },
        { title: "Lifestyle Alignment", level: "High", text: "This vision fits well with long-term stability and predictable planning." },
        { title: "Preparation Need", level: "Low to Medium", text: "The main preparation need is balancing career growth with time, health, and family priorities." },
      ],
    },
    business: {
      status: "Moderately Compatible",
      score: 64,
      explanation: "Your career path builds useful expertise, but your roadmap needs stronger leadership, business, and entrepreneurial preparation before retirement.",
      opportunity: "Your professional experience can become the foundation for a future business.",
      gap: "There is limited evidence of business-building, leadership, or side income preparation.",
      summary: [
        { title: "Business Readiness", level: "Moderate", text: "You have career expertise, but business preparation needs to start earlier." },
        { title: "Lifestyle Alignment", level: "Medium", text: "This vision fits best if your roadmap includes entrepreneurship exposure before retirement." },
        { title: "Preparation Need", level: "High", text: "You may need leadership experience, business learning, and side income testing before retirement." },
      ],
    },
    hobbies: {
      status: "Highly Compatible",
      score: 74,
      explanation: "Your roadmap can support a hobby-focused retirement if you protect time, health, and financial stability before leaving full-time work.",
      opportunity: "A stable career can provide the foundation for more creative and personal freedom later.",
      gap: "Your roadmap should include space for hobbies earlier, so retirement does not become the first time you explore them seriously.",
      summary: [
        { title: "Hobby Readiness", level: "High", text: "This goal is realistic if financial stability and personal time are protected." },
        { title: "Lifestyle Alignment", level: "High", text: "This vision fits well with a future focused on enjoyment, creativity, and personal freedom." },
        { title: "Preparation Need", level: "Medium", text: "You may need to gradually build hobby routines, creative identity, and financial runway." },
      ],
    },
  };

  return insights[vision];
}

function getGuidedCompatibilityColor(status: GuidedRetirementCompatibility["status"]) {
  if (status === "Highly Compatible") return "#147A55";
  if (status === "Moderately Compatible") return "#A66A00";
  return "#C86B2B";
}

function GuidedRetirementTimelinePreview({ recommendations, onApply, onBack }: { recommendations: RetirementRecommendation[]; onApply: () => void; onBack: () => void }) {
  const updated = buildGuidedRetirementPreviewItems(recommendations);

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mt-6 rounded-[1.9rem] bg-white p-5 shadow-[0_20px_48px_rgba(21,34,56,0.10)] ring-1 ring-[#E5E8F0] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-[#081433]">Preview Timeline Changes</h3>
          <p className="mt-2 text-sm font-semibold text-[#46536D]">Review how your Life Chapter timeline will change before applying updates.</p>
        </div>
        <span className="rounded-full bg-[#F8F9FB] px-3 py-2 text-xs font-semibold text-[#46536D]">Timeline diff view</span>
      </div>
      <div className="mt-5 grid gap-4">
        <GuidedTimelinePreviewColumn title="Current Timeline" items={[{ year: 6, title: "Career", status: "Unchanged" }, { year: 8, title: "Career", status: "Unchanged" }, { year: 10, title: "Career Break", status: "Unchanged" }, { year: 12, title: "Retirement", status: "Unchanged" }]} />
        <GuidedTimelinePreviewColumn title="Updated Timeline" items={updated} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <RetirementPreviewMetric label="Added" value={recommendations.map((item) => `${getAllowedRetirementGoalOption(item)?.title ?? item.title} / Year ${item.targetYear}`).join(", ") || "None"} tone="green" />
        <RetirementPreviewMetric label="Allowed chapters" value="Add Chapter goal templates only" tone="blue" />
        <RetirementPreviewMetric label="Unchanged" value="Retirement stays Year 12" tone="neutral" />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" disabled={recommendations.length === 0} onClick={onApply} className="rounded-full bg-[#E00046] px-5 py-3 text-sm font-semibold text-white disabled:opacity-45">Apply Selected Changes</button>
        <button type="button" onClick={onBack} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#081433] shadow-sm ring-1 ring-[#E5E8F0]">Back to Recommendations</button>
      </div>
    </motion.section>
  );
}

function RetirementPreviewMetric({ label, value, tone }: { label: string; value: string; tone: "green" | "blue" | "neutral" }) {
  const styles = {
    green: { bg: "#E9F8F1", color: "#147A55", ring: "#CDECDD" },
    blue: { bg: "#EEF2FF", color: "#4F46E5", ring: "#DDE3FF" },
    neutral: { bg: "#F8F9FB", color: "#46536D", ring: "#E5E8F0" },
  }[tone];
  return (
    <div className="min-w-0 rounded-[1.15rem] bg-white p-4 shadow-sm ring-1" style={{ ["--tw-ring-color" as string]: styles.ring }}>
      <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: styles.bg, color: styles.color }}>{label}</span>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#081433]">{value}</p>
    </div>
  );
}

function buildGuidedRetirementPreviewItems(recommendations: RetirementRecommendation[]): GuidedTimelinePreviewItem[] {
  return [
    ...recommendations
      .map((item) => ({ year: item.targetYear, title: getAllowedRetirementGoalOption(item)?.title ?? item.title, status: "Added" as const })),
    { year: 10, title: "Career Break", status: "Unchanged" as const },
    { year: 12, title: "Retirement", status: "Unchanged" as const },
  ].sort((a, b) => a.year - b.year);
}

function GuidedTimelinePreviewColumn({ title, items }: { title: string; items: GuidedTimelinePreviewItem[] }) {
  return (
    <div className="rounded-[1.5rem] bg-[#F8F9FB] p-4">
      <p className="font-semibold text-[#081433]">{title}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-[repeat(auto-fit,minmax(130px,1fr))]">
        {items.map((item, index) => (
          <motion.div key={`${item.year}-${item.title}-${item.status}`} initial={{ opacity: 0, y: title.startsWith("Updated") ? 12 : 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="relative rounded-[1.2rem] bg-white p-3 shadow-sm">
            {index < items.length - 1 && <span className="absolute left-[calc(100%-0.2rem)] top-1/2 hidden h-px w-4 bg-[#CBD3E5] lg:block" />}
            <span className="rounded-full bg-[#081433] px-3 py-1 text-xs font-semibold text-white">Year {item.year}</span>
            <p className="mt-3 text-sm font-semibold text-[#081433]">{item.title}</p>
            {item.fromYear && <p className="mt-1 text-xs font-semibold text-[#A66A00]">Year {item.fromYear} to Year {item.year}</p>}
            <span className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: item.status === "Added" ? "#E9F8F1" : item.status === "Shifted" ? "#FFF4D8" : "#EEF3FA", color: item.status === "Added" ? "#147A55" : item.status === "Shifted" ? "#8A5A00" : "#46536D" }}>{item.status}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const retirementVisionOptions: { key: RetirementVisionKey; title: string; description: string; icon: LucideIcon }[] = [
  { key: "travel", title: "Travel the World", description: "Explore new places with flexible time, location freedom, and a lifestyle built around movement.", icon: Plane },
  { key: "business", title: "Start a Passion Business", description: "Build a small business around something meaningful, creative, or personal.", icon: Rocket },
  { key: "volunteer", title: "Volunteer", description: "Contribute to causes, communities, or social impact work using your time and experience.", icon: HeartPulse },
  { key: "mentor", title: "Become a Mentor", description: "Share your knowledge with younger professionals, students, or career switchers.", icon: GraduationCap },
  { key: "family", title: "Spend Time with Family", description: "Prioritise relationships, home life, and long-term stability after your main career.", icon: Home },
  { key: "hobbies", title: "Pursue Hobbies Full-Time", description: "Spend more time on creative, personal, or lifestyle interests without full-time pressure.", icon: Palette },
];

function getDefaultRetirementRecommendations(): RetirementRecommendation[] {
  return [
    { id: "retirement-side-income", title: "Add extra income support", summary: "Suggested chapter: Build side income while working", explanation: "Developing an additional income stream provides greater flexibility and strengthens retirement readiness.", actionType: "insert-goal", goalKey: "side-business", targetYear: 6, durationMonths: 12, selected: true, applied: false, supports: ["Travel the World", "Start a Passion Business"], badge: "Add chapter" },
    { id: "retirement-investing", title: "Strengthen long-term contribution habit", summary: "Suggested chapter: Start investing", explanation: "A contribution habit can support future independence while staying inside existing CareerOS goals.", actionType: "insert-goal", goalKey: "investing", targetYear: 7, durationMonths: 6, selected: true, applied: false, supports: ["Long-term readiness"], badge: "Add chapter" },
    { id: "retirement-emergency-savings", title: "Protect retirement timeline from shocks", summary: "Suggested chapter: Build emergency savings", explanation: "A cash buffer reduces the chance of using long-term savings for short-term problems.", actionType: "insert-goal", goalKey: "emergency-savings", targetYear: 5, durationMonths: 12, selected: true, applied: false, supports: ["Career stability", "Long-term readiness"], badge: "Add chapter" },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RetirementVisionRoadmapEditor({ onApplyRecommendations }: { onApplyRecommendations: (recommendations: RetirementRecommendation[]) => void }) {
  const [selectedVisions, setSelectedVisions] = useState<RetirementVisionKey[]>(["travel", "business", "volunteer"]);
  const [recommendations, setRecommendations] = useState<RetirementRecommendation[]>(() => getDefaultRetirementRecommendations());
  const [showPreview, setShowPreview] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const selectedRecommendations = recommendations.filter((item) => item.selected && !item.applied);
  const selectedVisionOptions = retirementVisionOptions.filter((option) => selectedVisions.includes(option.key));
  const compatibility = getRetirementCompatibility(selectedVisions);
  const profile = getRetirementVisionProfile(selectedVisions);

  function toggleVision(key: RetirementVisionKey) {
    setSelectedVisions((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  function toggleRecommendation(id: string) {
    setRecommendations((current) => current.map((item) => item.id === id ? { ...item, selected: !item.selected } : item));
  }

  function applyRecommendations(items: RetirementRecommendation[]) {
    if (items.length === 0) return;
    onApplyRecommendations(items);
    setRecommendations((current) => current.map((item) => items.some((applied) => applied.id === item.id) ? { ...item, applied: true, selected: false } : item));
    setConfirmation("Your Life Chapter timeline has been updated.");
  }

  return (
    <GoalFeaturePanel title="Retirement Vision Roadmap Editor" eyebrow="Plan for Retirement">
      <p className="max-w-3xl text-sm font-semibold leading-6 text-[#46536D]">Design the life you want after your main career, then let CareerOS reshape your roadmap around it.</p>
      <div className="mt-5 grid gap-2 md:grid-cols-4">
        {["Vision", "Compatibility", "Suggestions", "Apply to Timeline"].map((step, index) => <div key={step} className="rounded-full bg-white px-4 py-3 text-center text-xs font-semibold text-[#081433] shadow-sm ring-1 ring-[#E5E8F0]">Step {index + 1}: {step}</div>)}
      </div>

      <section className="mt-6 rounded-[1.8rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
        <h3 className="text-xl font-semibold text-[#081433]">Choose Your Retirement Vision</h3>
        <p className="mt-2 text-sm font-semibold text-[#46536D]">What would you like your retirement to look like? Select one or more retirement goals.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {retirementVisionOptions.map((option) => {
            const active = selectedVisions.includes(option.key);
            const Icon = option.icon;
            return (
              <motion.button key={option.key} type="button" whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => toggleVision(option.key)} className="relative rounded-[1.5rem] border p-4 text-left transition" style={{ borderColor: active ? theme.rose2 : theme.border, backgroundColor: active ? "#FFF7FA" : "#fff", boxShadow: active ? "0 18px 38px rgba(224,0,70,0.12)" : "0 10px 24px rgba(21,34,56,0.06)" }}>
                {active && <span className="absolute right-4 top-4 rounded-full bg-[#E00046] px-2 py-1 text-[10px] font-semibold text-white">Selected</span>}
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF2F6] text-[#E00046]"><Icon className="h-5 w-5" /></span>
                <p className="mt-4 font-semibold text-[#081433]">{option.title}</p>
                <p className="mt-2 text-xs leading-5 text-[#46536D]">{option.description}</p>
              </motion.button>
            );
          })}
        </div>
        <div className="mt-5 rounded-[1.4rem] bg-[#081433] p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Your retirement vision</p>
          <p className="mt-2 text-2xl font-semibold">{profile.title}</p>
          <p className="mt-2 text-sm leading-6 text-white/70">{profile.meaning}</p>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.8rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
          <h3 className="text-xl font-semibold text-[#081433]">Retirement Compatibility Analysis</h3>
          {selectedVisions.length === 0 ? <p className="mt-4 rounded-[1.2rem] bg-[#FFF7FA] p-4 text-sm font-semibold text-[#46536D]">Select at least one retirement vision to generate compatibility insights.</p> : (
            <>
              <div className="mt-5 rounded-[1.5rem] p-5" style={{ backgroundColor: compatibility.bg }}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46536D]">Overall Compatibility</p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: compatibility.color }}>{compatibility.status}</p>
                <p className="mt-2 text-sm font-semibold text-[#46536D]">Compatibility Score: {compatibility.score}%</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/70"><motion.div className="h-full rounded-full" animate={{ width: `${compatibility.score}%` }} style={{ backgroundColor: compatibility.color }} /></div>
                <p className="mt-4 text-sm leading-6 text-[#46536D]">{compatibility.description}</p>
              </div>
            </>
          )}
        </div>
        <div className="rounded-[1.8rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
          <h3 className="text-xl font-semibold text-[#081433]">Goal Compatibility</h3>
          <div className="mt-4 grid gap-3">
            {selectedVisionOptions.map((option) => {
              const insight = getRetirementGoalInsight(option.key);
              const Icon = option.icon;
              return (
                <div key={option.key} className="rounded-[1.4rem] bg-[#FFF7FA] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-2 font-semibold text-[#081433]"><Icon className="h-4 w-4 text-[#E00046]" />{option.title}</p>
                    <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: insight.level === "High" ? "#E9F8F1" : "#FFF4D8", color: insight.level === "High" ? "#147A55" : "#8A5A00" }}>{insight.level}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#46536D]">{insight.analysis}</p>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    <MiniMetric label="Strength" value={insight.strength} />
                    <MiniMetric label="Gap / Risk" value={insight.gap} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.8rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
        <h3 className="text-xl font-semibold text-[#081433]">AI Career Suggestions</h3>
        <p className="mt-2 text-sm font-semibold text-[#46536D]">CareerOS has identified several improvements that could better align your career plan with your retirement vision.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {recommendations.map((item) => (
            <div key={item.id} className="rounded-[1.5rem] bg-[#FFF7FA] p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-[#081433]">✨ {getRetirementSuggestionTitle(item)}</p>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#E00046]">{item.badge}</span>
              </div>
              <p className="mt-2 text-xs font-semibold text-[#46536D]">Timeline change: {item.summary}</p>
              <p className="mt-3 text-sm leading-6 text-[#46536D]">{item.explanation}</p>
              <div className="mt-3 flex flex-wrap gap-2">{item.supports.map((support) => <span key={support} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#081433]">{support}</span>)}</div>
              <div className="mt-4 flex gap-2"><button type="button" onClick={() => { setRecommendations((current) => current.map((rec) => rec.id === item.id ? { ...rec, selected: true } : rec)); setShowPreview(true); }} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#081433] shadow-sm">Preview</button><button type="button" disabled={item.applied} onClick={() => applyRecommendations([item])} className="rounded-full bg-[#081433] px-4 py-2 text-xs font-semibold text-white disabled:opacity-45">{item.applied ? "Applied" : "Apply"}</button></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-[1.8rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="text-xl font-semibold text-[#081433]">AI Recommendation Plan</h3><p className="mt-1 text-sm font-semibold text-[#46536D]">4 Timeline Updates Ready</p></div>
          {recommendations.every((item) => item.applied) && <span className="rounded-full bg-[#E9F8F1] px-3 py-2 text-xs font-semibold text-[#147A55]">All selected roadmap updates have been applied.</span>}
        </div>
        <div className="mt-5 grid gap-3">
          {recommendations.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.3rem] bg-[#F8F9FB] p-4">
              <label className="flex items-center gap-3"><input type="checkbox" checked={item.selected} disabled={item.applied} onChange={() => toggleRecommendation(item.id)} className="h-4 w-4 accent-[#E00046]" /><span><span className="block text-sm font-semibold text-[#081433]">{item.title}</span><span className="text-xs font-semibold text-[#46536D]">{item.summary}</span></span></label>
              <div className="flex items-center gap-2"><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#46536D]">{item.applied ? "Applied" : item.badge}</span><button type="button" disabled={item.applied} onClick={() => applyRecommendations([item])} className="rounded-full bg-[#081433] px-4 py-2 text-xs font-semibold text-white disabled:opacity-45">{item.applied ? "Applied" : "Apply"}</button></div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" disabled={selectedRecommendations.length === 0} onClick={() => setShowPreview(true)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#081433] shadow-sm ring-1 ring-[#E5E8F0] disabled:opacity-45">Preview Changes</button>
          <button type="button" disabled={selectedRecommendations.length === 0} onClick={() => applyRecommendations(selectedRecommendations)} className="rounded-full bg-[#E00046] px-5 py-3 text-sm font-semibold text-white disabled:opacity-45">Apply Selected Changes</button>
          <button type="button" onClick={() => applyRecommendations(recommendations.filter((item) => !item.applied))} className="rounded-full bg-[#081433] px-5 py-3 text-sm font-semibold text-white">Apply All Changes</button>
        </div>
        {selectedRecommendations.length === 0 && <p className="mt-3 text-sm font-semibold text-[#46536D]">Select at least one recommendation to preview.</p>}
        {confirmation && <p className="mt-4 rounded-[1.2rem] bg-[#E9F8F1] px-4 py-3 text-sm font-semibold text-[#147A55]">{confirmation}</p>}
      </section>

      <AnimatePresence>{showPreview && <RetirementTimelinePreview recommendations={selectedRecommendations} />}</AnimatePresence>
    </GoalFeaturePanel>
  );
}

function getRetirementVisionProfile(selected: RetirementVisionKey[]) {
  if (selected.length === 0) return { title: "Vision not selected", meaning: "Choose one or more retirement goals to generate a roadmap direction." };
  if (selected.includes("travel") && selected.includes("business")) return { title: "Flexible Explorer + Purpose Builder", meaning: "You want a retirement lifestyle that combines freedom, movement, personal meaning, and contribution." };
  if (selected.includes("family")) return { title: "Family-Centred Stability Builder", meaning: "You want retirement to protect relationships, home life, and a calmer long-term rhythm." };
  if (selected.includes("mentor") || selected.includes("volunteer")) return { title: "Purposeful Contributor", meaning: "You want your experience to keep creating value through people, guidance, and community." };
  return { title: "Independent Lifestyle Designer", meaning: "You want a retirement that preserves autonomy, energy, and personal interests." };
}

function getRetirementCompatibility(selected: RetirementVisionKey[]) {
  const score = selected.includes("business") ? 68 : selected.length >= 4 ? 72 : 82;
  const status = score >= 78 ? "Highly Compatible" : score >= 58 ? "Moderately Compatible" : "Needs Adjustment";
  return {
    score,
    status,
    color: status === "Highly Compatible" ? "#147A55" : status === "Moderately Compatible" ? "#A66A00" : "#C8003F",
    bg: status === "Highly Compatible" ? "#E9F8F1" : status === "Moderately Compatible" ? "#FFF4D8" : "#FFE8EE",
    description: status === "Highly Compatible"
      ? "Your current career timeline already supports most parts of your retirement vision."
      : "Your current career timeline supports your retirement goals, but there are several areas where adjustments could better align your career with your desired retirement lifestyle.",
  };
}

function getRetirementGoalInsight(key: RetirementVisionKey) {
  const insights: Record<RetirementVisionKey, { level: "High" | "Moderate"; analysis: string; strength: string; gap: string }> = {
    travel: { level: "High", analysis: "Your continuous career progression and planned side income provide a strong foundation for a retirement focused on travel.", strength: "Flexible income and career stability", gap: "Stronger location freedom planning" },
    business: { level: "Moderate", analysis: "Your current career path builds strong industry expertise, but there are limited opportunities to develop entrepreneurial and leadership experience before retirement.", strength: "Domain knowledge and confidence", gap: "Business, leadership, and side income experience" },
    volunteer: { level: "High", analysis: "Your timeline provides sufficient flexibility for this retirement goal with minimal conflicts.", strength: "Flexible post-career contribution", gap: "Time and health planning" },
    mentor: { level: "High", analysis: "Your growing career experience can become a strong foundation for mentoring younger professionals later.", strength: "Experience and credibility", gap: "Build teaching and coaching proof" },
    family: { level: "High", analysis: "Your roadmap can support family-centred retirement if stability and health remain protected.", strength: "Stable long-term planning", gap: "Protect time and location choices" },
    hobbies: { level: "High", analysis: "Creative and personal interests can fit well after your main career when energy and finances are planned early.", strength: "Identity beyond work", gap: "Sustainable weekly rhythm" },
  };
  return insights[key];
}

function getRetirementSuggestionTitle(item: RetirementRecommendation) {
  if (item.id === "retirement-side-income") return "Add a Side Income in Year 6";
  if (item.id === "retirement-investing") return "Add Start Investing in Year 7";
  return "Add Emergency Savings before retirement pressure grows";
}

function RetirementTimelinePreview({ recommendations }: { recommendations: RetirementRecommendation[] }) {
  const proposed = [
    { year: 6, title: recommendations.some((item) => item.id === "retirement-side-income") ? "Side Income added" : "Career", status: recommendations.some((item) => item.id === "retirement-side-income") ? "Added" : "Unchanged" },
    { year: 7, title: recommendations.some((item) => item.id === "retirement-investing") ? "Start Investing added" : "Career", status: recommendations.some((item) => item.id === "retirement-investing") ? "Added" : "Unchanged" },
    { year: 10, title: "Career Break", status: "Unchanged" },
    { year: 12, title: "Retirement", status: "Unchanged" },
  ];

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mt-6 rounded-[1.8rem] bg-white p-5 shadow-[0_20px_48px_rgba(21,34,56,0.10)] ring-1 ring-[#E5E8F0]">
      <h3 className="text-xl font-semibold text-[#081433]">Preview Changes</h3>
      <p className="mt-2 text-sm font-semibold text-[#46536D]">Before vs after roadmap preview. This preview does not mutate the actual timeline.</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <TimelinePreviewColumn title="Current Roadmap" items={[{ year: 6, title: "Career", status: "Unchanged" }, { year: 8, title: "Career", status: "Unchanged" }, { year: 10, title: "Career Break", status: "Unchanged" }, { year: 12, title: "Retirement", status: "Unchanged" }]} />
        <TimelinePreviewColumn title="Updated Roadmap" items={proposed} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <MiniMetric label="Added" value={recommendations.map((item) => `${getAllowedRetirementGoalOption(item)?.title ?? item.title} in Year ${item.targetYear}`).join(", ") || "None"} />
        <MiniMetric label="Allowed chapters" value="Uses Add Chapter goal templates only" />
        <MiniMetric label="Unchanged" value="Retirement goal remains in place" />
      </div>
    </motion.section>
  );
}

function TimelinePreviewColumn({ title, items }: { title: string; items: { year: number; title: string; status: string }[] }) {
  return (
    <div className="rounded-[1.5rem] bg-[#F8F9FB] p-4">
      <p className="font-semibold text-[#081433]">{title}</p>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <motion.div key={`${item.year}-${item.title}`} initial={{ opacity: 0, x: title.startsWith("Updated") ? 12 : -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="flex items-center gap-3 rounded-[1.2rem] bg-white p-3 shadow-sm">
            <span className="rounded-full bg-[#081433] px-3 py-1 text-xs font-semibold text-white">Year {item.year}</span>
            <span className="flex-1 text-sm font-semibold text-[#081433]">{item.title}</span>
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: item.status === "Added" ? "#E9F8F1" : item.status === "Shifted" ? "#FFF4D8" : "#EEF3FA", color: item.status === "Added" ? "#147A55" : item.status === "Shifted" ? "#8A5A00" : "#46536D" }}>{item.status}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RadarChart({ data, seriesA, seriesB }: { data: { label: string; current: number; required: number }[]; seriesA: string; seriesB: string }) {
  const size = 340;
  const center = size / 2;
  const radius = 112;
  const points = (key: "current" | "required") => data.map((item, index) => {
    const angle = (index / data.length) * Math.PI * 2 - Math.PI / 2;
    const value = (item[key] / 5) * radius;
    return `${center + Math.cos(angle) * value},${center + Math.sin(angle) * value}`;
  }).join(" ");
  return (
    <div className="rounded-[1.6rem] bg-white p-4 shadow-inner">
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-[340px] w-full max-w-[420px]">
        {[1, 2, 3, 4, 5].map((level) => <circle key={level} cx={center} cy={center} r={(radius / 5) * level} fill="none" stroke="#E5E8F0" strokeWidth="1" />)}
        {data.map((item, index) => {
          const angle = (index / data.length) * Math.PI * 2 - Math.PI / 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          const lx = center + Math.cos(angle) * (radius + 34);
          const ly = center + Math.sin(angle) * (radius + 28);
          return <g key={item.label}><line x1={center} y1={center} x2={x} y2={y} stroke="#E5E8F0" /><text x={lx} y={ly} textAnchor="middle" className="fill-[#46536D] text-[10px] font-semibold">{item.label}</text></g>;
        })}
        <polygon points={points("required")} fill="rgba(224,0,70,0.12)" stroke="#E00046" strokeWidth="2" />
        <polygon points={points("current")} fill="rgba(8,20,51,0.10)" stroke="#081433" strokeWidth="2" />
      </svg>
      <div className="flex justify-center gap-4 text-xs font-semibold text-[#46536D]"><span>{seriesA}</span><span className="text-[#E00046]">{seriesB}</span></div>
    </div>
  );
}

function TimelineCompatibility({ node }: { node: TimelineNode }) {
  const year = node.targetYear;
  const note = year <= 2 ? "Early goal timing. Check whether it overlaps with learning, relocation, or break plans." : year <= 5 ? "No major conflicts detected. Keep career mobility in view." : "Later timing may preserve flexibility while your career direction matures.";
  return <GoalFeaturePanel title="Timeline Compatibility" eyebrow="Career Timing"><p className="rounded-[1.5rem] bg-[#FFF7FA] p-4 text-sm font-semibold leading-6 text-[#081433]">{note}</p></GoalFeaturePanel>;
}

type LifeFeatureKey = "impact" | "finance" | "return";
type NavigatorStepKey = "prepare" | "finance" | "return";

type FinancialPlan = {
  savings: number;
  monthlyCost: number;
  duration: number;
  oneTimeCost: number;
  emergencyMonths: number;
};

type ReturnReadinessPlan = {
  absenceMonths: number;
  plannedReturnMonth: number;
  targetRole: string;
  prepLeadMonths: number;
};

type BreakImpactLevel = "Low Impact" | "Medium Impact" | "High Impact";
type BreakSafetyStatus = "Safe to take" | "Manageable" | "Needs preparation" | "High risk";

type AffectedMilestone = {
  id: string;
  title: string;
  originalYear: number;
  newYear: number;
  shiftYears: number;
  note: string;
};

type BreakSafetyResult = {
  score: number;
  status: BreakSafetyStatus;
  riskFactors: string[];
  supportFactors: string[];
};

type ReturnWindowStep = {
  label: string;
  timing: string;
  helper: string;
  icon: LucideIcon;
};

type BreakTimelineSignals = {
  breakYear: number;
  previousCareer?: TimelineNode;
  nextCareer?: TimelineNode;
  hasEmergencySavings: boolean;
  hasSideIncome: boolean;
  hasInvesting: boolean;
  hasReturnWork: boolean;
};

type BreakTimingAnalysis = {
  status: "Suitable Timing" | "Needs Caution" | "Risky Timing";
  headline: string;
  current: string;
  suggested: string;
  reasoning: string;
};

type ReturnProofPacket = {
  targetRole: string;
  targetReason: string;
  previousRole: string;
  returnWindow: string;
  explanationDraft: string;
  proofTargets: string[];
  skillTargets: string[];
  talkingPoints: string[];
};

type ReturnPhaseKey = "start" | "checkin" | "prepare" | "return";

type ReturnPhase = {
  key: ReturnPhaseKey;
  label: string;
  month: number;
  purpose: string;
};

type ProofTask = {
  id: string;
  area: string;
  title: string;
  output: string;
  why: string;
  roleLink?: string;
  status: "Ready" | "Recommended" | "Needs proof" | "Missing" | "Needs prep";
  icon: LucideIcon;
  draftText?: string;
};

function BreakSafetyPlanCard({ node, timelineNodes, onAddEmergencySavings }: { node: TimelineNode; timelineNodes: TimelineNode[]; onAddEmergencySavings: (selectedBreak: TimelineNode) => void }) {
  const Icon = node.icon ?? Coffee;
  const duration = node.durationMonths ?? getDefaultDurationMonths(node.lifeGoalKey);
  const affectedMilestones = getAffectedMilestones(node, timelineNodes);
  const impactLevel = getBreakImpactLevel(node, affectedMilestones);
  const safety = calculateBreakSafetyScore(node, timelineNodes, affectedMilestones);
  const signals = getBreakTimelineSignals(node, timelineNodes);
  const timing = getBreakTimingAnalysis(node, timelineNodes, affectedMilestones, signals);
  const proofPacket = generateReturnProofPacket(node, timelineNodes);
  const isReturnChapter = isReturnToWorkBreak(node);
  const totalDelay = formatDurationYears(getBreakDelayYears(duration));

  if (isReturnChapter) {
    return <ReturnAfterBreakPlanCard node={node} timelineNodes={timelineNodes} />;
  }

  return (
    <section className="break-safety-plan animate-soft-enter overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_48px_rgba(21,34,56,0.09)] ring-1 ring-[#E5E8F0]">
      <div className="animate-stagger-item relative overflow-hidden bg-[radial-gradient(circle_at_86%_10%,rgba(251,113,133,0.28),transparent_18rem),linear-gradient(135deg,#081433,#241D45)] p-6 text-white" style={{ "--delay": "0ms" } as React.CSSProperties}>
        <div className="break-header-glow pointer-events-none absolute right-[-5rem] top-[-5rem] h-72 w-72 rounded-full bg-[#F04D7A]/30 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/12 text-[#FFD6E1] ring-1 ring-white/15">
              <Icon className="h-7 w-7" />
            </span>
            <div>
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/78 ring-1 ring-white/15">
                Break Safety Plan
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-normal">{node.title} / {node.time} / {formatDuration(duration)}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Understand what this break delays, what risks it creates, and how to return safely.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[390px]">
            <BreakHeaderMetric label="Affected milestones" value={String(affectedMilestones.length)} />
            <BreakHeaderMetric label="Total delay" value={`+${totalDelay}`} />
            <BreakHeaderMetric label="Impact level" value={impactLevel.replace(" Impact", "")} />
          </div>
        </div>
        <div className="relative z-10 mt-5 rounded-[1.25rem] px-4 py-3 text-sm font-semibold leading-6" style={{ backgroundColor: getBreakImpactSoftBg(impactLevel), color: getBreakImpactColor(impactLevel) }}>
          This break shifts {affectedMilestones.length} future career milestone{affectedMilestones.length === 1 ? "" : "s"} by {totalDelay}.
        </div>
      </div>

      <div className="space-y-5 bg-[linear-gradient(180deg,#FFF7FA_0%,#FFFFFF_42%,#F8F9FB_100%)] p-5 sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <AnimatedSection delay={80}>
            <CareerPauseImpactForecast milestones={affectedMilestones} impactLevel={impactLevel} />
          </AnimatedSection>
          <AnimatedSection delay={120}>
            <BreakSafetyScorePanel safety={safety} />
          </AnimatedSection>
        </div>

        <AnimatedSection delay={180}>
          <BreakProtectionActions
            selectedBreak={node}
            signals={signals}
            timing={timing}
            affectedMilestones={affectedMilestones}
            onAddEmergencySavings={onAddEmergencySavings}
          />
        </AnimatedSection>
        <AnimatedSection delay={240}>
          <ReturnProofBuilder packet={proofPacket} selectedBreak={node} />
        </AnimatedSection>
      </div>
    </section>
  );
}

function AnimatedSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`animate-stagger-item ${className}`} style={{ "--delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}

function BreakHeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="break-metric-card rounded-[1.1rem] bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/48">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function CareerPauseImpactForecast({ milestones, impactLevel }: { milestones: AffectedMilestone[]; impactLevel: BreakImpactLevel }) {
  return (
    <section className="rounded-[1.7rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Career Pause Impact Forecast</p>
          <h3 className="mt-1 text-xl font-semibold text-[#081433]">Future milestones affected</h3>
          <p className="mt-2 text-sm leading-6 text-[#46536D]">See which future milestones move because of this break.</p>
        </div>
        <BreakImpactBadge level={impactLevel} />
      </div>
      <div className="mt-5 grid gap-3">
        {milestones.length === 0 ? (
          <div className="animate-stagger-item rounded-[1.35rem] bg-[#EEF8FF] p-4 ring-1 ring-[#D7E8F7]">
            <p className="font-semibold text-[#081433]">No future milestones delayed</p>
            <p className="mt-2 text-sm leading-6 text-[#46536D]">This break does not currently delay any future career milestones.</p>
          </div>
        ) : milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            className="shift-card rounded-[1.35rem] bg-[#FFF8F4] p-4 ring-1 ring-[#F4D7C4]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#C86B2B] shadow-sm">
                  <BriefcaseBusiness className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-[#081433]">{milestone.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#46536D]">{milestone.note}</p>
                </div>
              </div>
              <div className="shrink-0 rounded-[1.1rem] bg-white px-4 py-3 text-right shadow-sm">
                <p className="text-sm font-semibold text-[#081433]">
                  <span className="animate-stagger-item inline-block" style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}>Year {formatYearValue(milestone.originalYear)}</span>
                  <span className="shift-arrow mx-2 inline-block" style={{ "--arrow-delay": `${120 + index * 60}ms` } as React.CSSProperties}>to</span>
                  <span className="animate-stagger-item inline-block" style={{ "--delay": `${180 + index * 60}ms` } as React.CSSProperties}>Year {formatYearValue(milestone.newYear)}</span>
                </p>
                <p className="animate-stagger-item mt-1 text-xs font-semibold text-[#C86B2B]" style={{ "--delay": `${240 + index * 60}ms` } as React.CSSProperties}>Shift +{formatDurationYears(milestone.shiftYears)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BreakSafetyScorePanel({ safety }: { safety: BreakSafetyResult }) {
  const color = getBreakSafetyColor(safety.status);
  return (
    <section className="rounded-[1.7rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Safety Score</p>
      <h3 className="mt-1 text-xl font-semibold text-[#081433]">Break Safety Score</h3>
      <p className="mt-2 text-sm leading-6 text-[#46536D]">Calculated from your timeline context.</p>
      <div className="mt-5 rounded-[1.25rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-4xl font-semibold text-[#081433]">{safety.score}<span className="text-base text-[#46536D]"> / 100</span></p>
            <p className="mt-1 text-sm font-semibold" style={{ color }}>{safety.status}</p>
          </div>
          <span className={`animate-stagger-item rounded-full px-3 py-1 text-xs font-semibold ${safety.status === "Needs preparation" || safety.status === "High risk" ? "status-soft-pulse" : ""}`} style={{ backgroundColor: getBreakSafetySoftBg(safety.status), color, "--delay": "180ms" } as React.CSSProperties}>Timeline diagnosis</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E5E8F0]">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${safety.score}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      <BreakFactorGroup title="Support factors" items={safety.supportFactors} tone="support" />
      <BreakFactorGroup title="Risk factors" items={safety.riskFactors} tone="risk" />
    </section>
  );
}

function BreakFactorGroup({ title, items, tone }: { title: string; items: string[]; tone: "support" | "risk" }) {
  const display = items.length > 0 ? items.slice(0, 4) : [tone === "support" ? "No support factor detected yet" : "No major risk factor detected"];
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#46536D]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {display.map((item, index) => (
          <span key={item} className="break-factor-chip animate-stagger-item rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: tone === "support" ? "#E9F8F1" : "#FFF4D8", color: tone === "support" ? "#147A55" : "#8A5A00", "--delay": `${index * 45}ms` } as React.CSSProperties}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function BreakProtectionActions({
  selectedBreak,
  signals,
  timing,
  affectedMilestones,
  onAddEmergencySavings,
}: {
  selectedBreak: TimelineNode;
  signals: BreakTimelineSignals;
  timing: BreakTimingAnalysis;
  affectedMilestones: AffectedMilestone[];
  onAddEmergencySavings: (selectedBreak: TimelineNode) => void;
}) {
  const incomeProtected = signals.hasEmergencySavings;
  const sideSupport = signals.hasSideIncome || signals.hasInvesting;
  const timingTone = timing.status === "Suitable Timing" ? "support" : timing.status === "Needs Caution" ? "caution" : "risk";
  return (
    <section className="rounded-[1.7rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Break Protection Actions</p>
      <h3 className="mt-1 text-xl font-semibold text-[#081433]">Actions and checks that reduce this pause risk</h3>
      <p className="mt-2 text-sm leading-6 text-[#46536D]">CareerOS checks the support chapters and timing around this selected break.</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <motion.div whileHover={{ y: -3 }} className="protection-card rounded-[1.45rem] bg-[#F8F9FB] p-5 ring-1 ring-[#E5E8F0]">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#E00046] shadow-sm">
              <PiggyBank className="h-5 w-5" />
            </span>
            <BreakStatusPill label={incomeProtected ? "Protected" : "Needs attention"} tone={incomeProtected ? "support" : "caution"} />
          </div>
          <h4 className="mt-4 text-lg font-semibold text-[#081433]">Income Protection</h4>
          <p className="mt-2 text-sm leading-6 text-[#46536D]">
            {incomeProtected
              ? `Emergency savings is already planned before this break, giving Year ${formatYearValue(signals.breakYear)} stronger income protection.`
              : `No emergency savings chapter is detected before this break, so Year ${formatYearValue(signals.breakYear)} may create financial pressure.`}
          </p>
          {sideSupport ? (
            <p className="mt-3 rounded-[1rem] bg-[#E9F8F1] px-3 py-2 text-xs font-semibold leading-5 text-[#147A55]">
              {signals.hasSideIncome ? "Side income before this break may reduce some pressure." : "Investing before this break adds a secondary support signal."}
            </p>
          ) : null}
          {!incomeProtected ? (
            <button type="button" onClick={() => onAddEmergencySavings(selectedBreak)} className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-[#081433] px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#152238]">
              <Plus className="h-4 w-4" />
              Add Emergency Savings Chapter
            </button>
          ) : null}
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="protection-card rounded-[1.45rem] bg-[#F8F9FB] p-5 ring-1 ring-[#E5E8F0]">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#C86B2B] shadow-sm">
              <Calculator className="h-5 w-5" />
            </span>
            <BreakStatusPill label={timing.status} tone={timingTone} />
          </div>
          <h4 className="mt-4 text-lg font-semibold text-[#081433]">Break Timing Check</h4>
          <p className="mt-2 text-sm font-semibold text-[#081433]">{timing.headline}</p>
          <p className="mt-2 text-sm leading-6 text-[#46536D]">{timing.reasoning}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1rem] bg-white px-3 py-3 ring-1 ring-[#E5E8F0]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#46536D]">Current timing</p>
              <p className="mt-1 text-sm font-semibold text-[#081433]">{timing.current}</p>
            </div>
            <div className="rounded-[1rem] bg-white px-3 py-3 ring-1 ring-[#DDEFE7]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#147A55]">Suggested timing</p>
              <p className="mt-1 text-sm font-semibold text-[#081433]">{timing.suggested}</p>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold leading-5 text-[#8A5A00]">Timeline signal: {affectedMilestones.length} future milestone{affectedMilestones.length === 1 ? "" : "s"} affected.</p>
        </motion.div>
      </div>
    </section>
  );
}

function BreakStatusPill({ label, tone }: { label: string; tone: "support" | "caution" | "risk" | "neutral" }) {
  const styles = {
    support: { bg: "#E9F8F1", color: "#147A55" },
    caution: { bg: "#FFF4D8", color: "#8A5A00" },
    risk: { bg: "#FFE8EE", color: "#C8003F" },
    neutral: { bg: "#EEF2FF", color: "#4F46E5" },
  }[tone];
  return <span className={`animate-stagger-item rounded-full px-3 py-1 text-xs font-semibold ${tone === "risk" || tone === "caution" ? "status-soft-pulse" : ""}`} style={{ backgroundColor: styles.bg, color: styles.color, "--delay": "160ms" } as React.CSSProperties}>{label}</span>;
}

function ReturnProofBuilder({ packet, selectedBreak }: { packet: ReturnProofPacket; selectedBreak: TimelineNode }) {
  const duration = selectedBreak.durationMonths ?? getDefaultDurationMonths(selectedBreak.lifeGoalKey);
  const phases = generateReturnPhases(duration);
  const [activeReturnPhase, setActiveReturnPhase] = useState<ReturnPhaseKey>("start");
  const activeIndex = Math.max(0, phases.findIndex((phase) => phase.key === activeReturnPhase));
  const activePhase = phases[activeIndex] ?? phases[0];
  const tasks = generateProofTasksForPhase(activePhase.key, selectedBreak, packet);
  const progressPercent = phases.length <= 1 ? 0 : (activeIndex / (phases.length - 1)) * 100;
  const phaseContext = getReturnPhaseContext(activePhase.key, selectedBreak, packet.targetRole);
  const breakTypeLabel = getBreakTypeLabel(selectedBreak);

  return (
    <section className="overflow-hidden rounded-[1.7rem] bg-white shadow-sm ring-1 ring-[#E5E8F0]">
      <div className="relative bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF7FA_48%,#F8F9FB_100%)] p-5">
        <span className="absolute left-0 top-0 h-full w-1 bg-[linear-gradient(180deg,#F04D7A,#C86B2B)]" />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Return Proof Builder</p>
            <h3 className="mt-1 text-xl font-semibold text-[#081433]">Build return-ready proof.</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#E00046] shadow-sm ring-1 ring-[#F5CBD6]">From timeline</span>
            <span className="rounded-full bg-[#081433] px-3 py-1 text-xs font-semibold text-white shadow-sm">Target: {packet.targetRole}</span>
            <span className="rounded-full bg-[#FFF4D8] px-3 py-1 text-xs font-semibold text-[#8A5A00] ring-1 ring-[#F3DE9A]">Month {activePhase.month} active</span>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="rounded-[1.45rem] bg-[#F8F9FB] p-4 ring-1 ring-[#E5E8F0]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#46536D]">Interactive Return Window Map</p>
              <p className="mt-1 text-sm font-semibold text-[#081433]">Click a node to see what proof to prepare.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#46536D] ring-1 ring-[#E5E8F0]">{packet.returnWindow}</span>
          </div>

          <div className="relative mt-7 px-1 pb-2 sm:px-6">
            <span className="absolute left-12 right-12 top-6 hidden h-0.5 rounded-full bg-[#DDE3EE] sm:block" />
            <motion.span
              className="absolute left-12 top-6 hidden h-0.5 rounded-full bg-[linear-gradient(90deg,#081433,#F04D7A,#C86B2B)] sm:block"
              initial={{ width: 0 }}
              animate={{ width: `calc((100% - 6rem) * ${progressPercent / 100})` }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="grid gap-5 sm:grid-cols-4">
              {phases.map((phase, index) => {
                const active = phase.key === activeReturnPhase;
                const completed = index < activeIndex;
                return (
                  <motion.button
                    key={phase.key}
                    type="button"
                    onClick={() => setActiveReturnPhase(phase.key)}
                    whileHover={{ y: -3 }}
                    className="return-phase-node group relative z-10 flex gap-3 text-left sm:flex-col sm:items-center sm:text-center"
                  >
                    {index < phases.length - 1 && <span className={`absolute left-6 top-12 h-[calc(100%+1.25rem)] w-0.5 rounded-full sm:hidden ${completed || active ? "bg-[#F0B68B]" : "bg-[#DDE3EE]"}`} />}
                    <motion.span
                      animate={{ scale: active ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 20 }}
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border-[5px] text-xs font-semibold transition group-hover:shadow-md ${active ? "border-[#FFF0E8] bg-[#C86B2B] text-white shadow-[0_0_0_8px_rgba(200,107,43,0.10)]" : completed ? "border-[#E9F8F1] bg-[#081433] text-white" : "border-white bg-white text-[#8A94A8] ring-1 ring-[#DDE3EE]"}`}
                    >
                      {completed ? (
                        <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                          <Check className="h-4 w-4" />
                        </motion.span>
                      ) : (
                        `M${phase.month}`
                      )}
                    </motion.span>
                    <span className="min-w-0">
                      <span className={`block text-xs font-semibold uppercase tracking-[0.12em] ${active ? "text-[#C86B2B]" : completed ? "text-[#081433]" : "text-[#8A94A8]"}`}>Month {phase.month}</span>
                      <span className={`mt-1 block text-sm font-semibold ${active || completed ? "text-[#081433]" : "text-[#46536D]"}`}>{phase.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-[#46536D]">{phase.purpose}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="rounded-[1.6rem] bg-[#FFF7FA]/75 p-5 shadow-sm ring-1 ring-[#F5CBD6]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-xl font-semibold text-[#081433]">Month {activePhase.month}: {activePhase.label}</h4>
                <p className="mt-1 text-sm font-semibold text-[#46536D]">{getShortPhasePurpose(activePhase.key)}</p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#46536D]">{phaseContext}</p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#081433] ring-1 ring-[#E5E8F0]">Target: {packet.targetRole}</span>
                <span className="rounded-full bg-[#FFF4D8] px-3 py-1 text-xs font-semibold text-[#8A5A00] ring-1 ring-[#F3DE9A]">{breakTypeLabel}</span>
                <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#4F46E5] ring-1 ring-[#DDE3FF]">{tasks.length} proof tasks</span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {tasks.map((task, index) => {
                const TaskIcon = task.icon;
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -3 }}
                    className="proof-task-card rounded-[1.35rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0] transition-shadow hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFF7FA] text-[#E00046] ring-1 ring-[#F5CBD6]">
                          <TaskIcon className="h-[18px] w-[18px]" />
                        </span>
                        <div className="min-w-0">
                          <p className="rounded-full bg-[#F8F9FB] px-3 py-1 text-xs font-semibold text-[#46536D] ring-1 ring-[#E5E8F0]">{task.area}</p>
                        </div>
                      </div>
                      <BreakStatusPill label={task.status} tone={task.status === "Ready" ? "support" : task.status === "Missing" ? "risk" : task.status === "Needs proof" || task.status === "Needs prep" ? "caution" : "neutral"} />
                    </div>
                    <h5 className="mt-4 text-base font-semibold leading-6 text-[#081433]">{task.title}</h5>
                    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[1rem] bg-[#F8F9FB] px-3 py-2 ring-1 ring-[#E5E8F0]">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#46536D]">Output</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#081433] ring-1 ring-[#E5E8F0]">{task.output}</span>
                      {task.draftText ? <span className="rounded-full bg-[#E9F8F1] px-3 py-1 text-xs font-semibold text-[#147A55] ring-1 ring-[#CDECDD]">Draft ready</span> : null}
                    </div>
                    <p className="mt-4 text-sm font-semibold leading-6 text-[#46536D]">{task.why}</p>
                    {task.roleLink ? <p className="mt-3 rounded-[1rem] bg-[#EEF2FF] px-3 py-2 text-xs font-semibold leading-5 text-[#4F46E5] ring-1 ring-[#DDE3FF]">{task.roleLink}</p> : null}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ReturnWindowMap({ steps, note, noteTone, playbookNote }: { steps: ReturnWindowStep[]; note: string; noteTone: "safe" | "medium" | "risk"; playbookNote: string }) {
  return (
    <section className="rounded-[1.7rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Return Window Map</p>
      <h3 className="mt-1 text-xl font-semibold text-[#081433]">Plan the comeback before the break ends</h3>
      <p className="mt-2 text-sm leading-6 text-[#46536D]">A simple return rhythm based on break duration.</p>
      <div className="mt-5 rounded-[1.35rem] bg-[#F8F9FB] p-4">
        <div className="relative grid gap-4 lg:grid-cols-4">
          <span className="return-map-line absolute left-[8%] right-[8%] top-6 hidden h-px bg-[#CBD3E5] lg:block" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="return-map-node relative z-10 flex gap-3 lg:flex-col lg:items-center lg:text-center" style={{ "--delay": `${100 + index * 150}ms` } as React.CSSProperties}>
                {index < steps.length - 1 && <span className="return-map-line-vertical absolute left-5 top-10 h-[calc(100%+1rem)] w-px bg-[#CBD3E5] lg:hidden" />}
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-4 border-[#F8F9FB] bg-[#081433] text-white shadow-sm transition hover:scale-[1.02]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-[#081433]">{step.label}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#E00046]">{step.timing}</p>
                  <p className="mt-2 text-xs leading-5 text-[#46536D]">{step.helper}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <p className="animate-stagger-item rounded-[1.1rem] px-4 py-3 text-sm font-semibold leading-6" style={{ backgroundColor: noteTone === "safe" ? "#E9F8F1" : noteTone === "medium" ? "#FFF4D8" : "#FFE8EE", color: noteTone === "safe" ? "#147A55" : noteTone === "medium" ? "#8A5A00" : "#C8003F", "--delay": "650ms" } as React.CSSProperties}>{note}</p>
        <p className="animate-stagger-item rounded-[1.1rem] bg-[#FFF7FA] px-4 py-3 text-sm font-semibold leading-6 text-[#46536D]" style={{ "--delay": "700ms" } as React.CSSProperties}>{playbookNote}</p>
      </div>
    </section>
  );
}

function ReturnAfterBreakPlanCard({ node, timelineNodes }: { node: TimelineNode; timelineNodes: TimelineNode[] }) {
  const returnMap = generateReturnWindowMap(node);
  const targetRole = timelineNodes.find((item) => item.type === "career" && (item.displayYear ?? item.targetYear) >= node.targetYear)?.title ?? "next suitable role";
  return (
    <section className="break-safety-plan animate-soft-enter overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_48px_rgba(21,34,56,0.09)] ring-1 ring-[#E5E8F0]">
      <div className="animate-stagger-item relative overflow-hidden bg-[radial-gradient(circle_at_86%_10%,rgba(251,113,133,0.24),transparent_18rem),linear-gradient(135deg,#081433,#241D45)] p-6 text-white">
        <div className="break-header-glow pointer-events-none absolute right-[-5rem] top-[-5rem] h-72 w-72 rounded-full bg-[#F04D7A]/30 blur-3xl" />
        <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/78 ring-1 ring-white/15">Break Safety Plan</span>
        <h2 className="mt-4 text-2xl font-semibold">{node.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Focus the next step, rebuild proof, and re-enter with confidence.</p>
      </div>
      <div className="space-y-5 bg-[linear-gradient(180deg,#FFF7FA_0%,#FFFFFF_42%,#F8F9FB_100%)] p-5 sm:p-6">
        <AnimatedSection delay={80}>
          <ReturnWindowMap steps={returnMap.steps} note={returnMap.note} noteTone={returnMap.tone} playbookNote="Choose a realistic first return step instead of trying to recover every career signal at once." />
        </AnimatedSection>
        <section className="animate-stagger-item rounded-[1.7rem] bg-white p-5 shadow-sm ring-1 ring-[#E5E8F0]" style={{ "--delay": "160ms" } as React.CSSProperties}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Return Confidence Builder</p>
          <h3 className="mt-1 text-xl font-semibold text-[#081433]">Re-entry snapshot</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              { label: "Target return", value: node.time },
              { label: "Biggest blocker", value: "Proof gap" },
              { label: "Role to target", value: targetRole },
              { label: "Confidence", value: "Manageable" },
            ].map((item, index) => <div key={item.label} className="animate-stagger-item" style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}><MiniMetric label={item.label} value={item.value} /></div>)}
          </div>
          <p className="mt-4 rounded-[1.1rem] bg-[#FFF7FA] px-4 py-3 text-sm font-semibold leading-6 text-[#081433]">First action: update one portfolio, resume, or proof-of-work item before starting applications.</p>
        </section>
        <section className="grid gap-3 md:grid-cols-3">
          {[
            { title: "Rebuild proof", text: "Create one fresh work sample that shows current capability.", icon: Pencil },
            { title: "Refresh role direction", text: "Choose the role family you are returning toward.", icon: BriefcaseBusiness },
            { title: "Start with bridge role", text: "Use a lower-friction role if the gap feels hard to explain.", icon: RefreshCcw },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="protection-card animate-stagger-item rounded-[1.35rem] bg-white p-4 shadow-sm ring-1 ring-[#E5E8F0]" style={{ "--delay": `${240 + index * 80}ms` } as React.CSSProperties}>
                <Icon className="h-5 w-5 text-[#E00046]" />
                <p className="mt-3 font-semibold text-[#081433]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#46536D]">{item.text}</p>
                <span className="mt-3 inline-flex rounded-full bg-[#FFF7FA] px-3 py-1 text-xs font-semibold text-[#E00046]">Re-entry focus</span>
              </div>
            );
          })}
        </section>
      </div>
    </section>
  );
}

function getAffectedMilestones(selectedBreak: TimelineNode, timelineNodes: TimelineNode[]): AffectedMilestone[] {
  const breakYear = selectedBreak.targetYear;
  return timelineNodes
    .filter((item) => item.type === "career")
    .map((item) => {
      const originalYear = item.baseYear ?? item.targetYear;
      const newYear = item.displayYear ?? item.targetYear;
      return { item, originalYear, newYear, shiftYears: Math.max(0, newYear - originalYear) };
    })
    .filter(({ originalYear, shiftYears }) => originalYear >= breakYear && shiftYears > 0)
    .map(({ item, originalYear, newYear, shiftYears }) => ({
      id: item.id,
      title: item.title,
      originalYear,
      newYear,
      shiftYears,
      note: originalYear === breakYear ? "This milestone moves later because the break starts in the same year." : "This future progression shifts because the break delays the timeline.",
    }));
}

function calculateBreakSafetyScore(selectedBreak: TimelineNode, timelineNodes: TimelineNode[], affectedMilestones: AffectedMilestone[]): BreakSafetyResult {
  const breakYear = selectedBreak.targetYear;
  const duration = selectedBreak.durationMonths ?? getDefaultDurationMonths(selectedBreak.lifeGoalKey);
  const textOf = (node: TimelineNode) => `${node.lifeGoalKey ?? ""} ${node.title}`.toLowerCase();
  const beforeBreak = timelineNodes.filter((item) => (item.displayYear ?? item.targetYear) < breakYear);
  const afterBreak = timelineNodes.filter((item) => (item.displayYear ?? item.targetYear) > breakYear);
  const hasEmergencySavings = beforeBreak.some((item) => textOf(item).includes("emergency") || textOf(item).includes("savings"));
  const hasSideIncome = beforeBreak.some((item) => textOf(item).includes("side income") || textOf(item).includes("freelance") || textOf(item).includes("income while working"));
  const hasInvesting = beforeBreak.some((item) => textOf(item).includes("invest"));
  const hasReturnWork = afterBreak.some((item) => textOf(item).includes("return to work") || textOf(item).includes("return after break"));
  const breakCount = timelineNodes.filter((item) => item.chapterKind === "break").length;
  const careerBefore = timelineNodes.some((item) => item.type === "career" && (item.baseYear ?? item.targetYear) < breakYear);
  const nextCareer = timelineNodes.find((item) => item.type === "career" && (item.baseYear ?? item.targetYear) >= breakYear);
  const uncertain = ["emergency", "burnout", "recovery", "health"].some((term) => textOf(selectedBreak).includes(term));
  let score = 70;
  const riskFactors: string[] = [];
  const supportFactors: string[] = [];

  if (duration > 6) { score -= 8; riskFactors.push(`${duration}-month break`); }
  if (duration > 12) { score -= 10; riskFactors.push("Long break duration"); }
  if (duration > 24) { score -= 10; riskFactors.push("Extended break"); }
  if (breakCount > 1) { score -= 8; riskFactors.push("Multiple breaks in timeline"); }
  if (nextCareer && (nextCareer.baseYear ?? nextCareer.targetYear) <= breakYear + 1) { score -= 8; riskFactors.push("Break before next milestone"); }
  if (affectedMilestones.length >= 3) { score -= 10; riskFactors.push(`Affects ${affectedMilestones.length} milestones`); }
  if (!hasEmergencySavings) { score -= 10; riskFactors.push("No emergency savings before break"); }
  if (!hasSideIncome && !hasInvesting) { score -= 6; riskFactors.push("No income/investing support before break"); }
  if (uncertain) { score -= 6; riskFactors.push("Uncertain break type"); }

  if (hasEmergencySavings) { score += 12; supportFactors.push("Emergency savings planned"); }
  if (hasSideIncome) { score += 8; supportFactors.push("Side income before break"); }
  if (hasInvesting) { score += 5; supportFactors.push("Investing before break"); }
  if (duration <= 6) { score += 5; supportFactors.push("Short break duration"); }
  if (careerBefore) { score += 5; supportFactors.push("Career foundation before break"); }
  if (hasReturnWork) { score += 8; supportFactors.push("Return-to-work chapter exists"); }

  const clamped = Math.max(0, Math.min(100, score));
  return { score: clamped, status: getBreakSafetyStatus(clamped), riskFactors, supportFactors };
}

function getBreakTimelineSignals(selectedBreak: TimelineNode, timelineNodes: TimelineNode[]): BreakTimelineSignals {
  const breakYear = selectedBreak.targetYear;
  const textOf = (node: TimelineNode) => `${node.lifeGoalKey ?? ""} ${node.title}`.toLowerCase();
  const beforeBreak = timelineNodes.filter((item) => (item.displayYear ?? item.targetYear) < breakYear);
  const afterBreak = timelineNodes.filter((item) => (item.displayYear ?? item.targetYear) > breakYear);
  const careers = timelineNodes.filter((item) => item.type === "career");

  return {
    breakYear,
    previousCareer: [...careers].reverse().find((item) => (item.baseYear ?? item.targetYear) < breakYear),
    nextCareer: careers.find((item) => (item.baseYear ?? item.targetYear) >= breakYear),
    hasEmergencySavings: beforeBreak.some((item) => textOf(item).includes("emergency") || textOf(item).includes("savings")),
    hasSideIncome: beforeBreak.some((item) => textOf(item).includes("side income") || textOf(item).includes("freelance") || textOf(item).includes("income while working")),
    hasInvesting: beforeBreak.some((item) => textOf(item).includes("invest")),
    hasReturnWork: afterBreak.some((item) => textOf(item).includes("return to work") || textOf(item).includes("return after break")),
  };
}

function getBreakTimingAnalysis(selectedBreak: TimelineNode, timelineNodes: TimelineNode[], affectedMilestones: AffectedMilestone[], signals: BreakTimelineSignals): BreakTimingAnalysis {
  const duration = selectedBreak.durationMonths ?? getDefaultDurationMonths(selectedBreak.lifeGoalKey);
  const sameYearCareer = timelineNodes.find((item) => item.type === "career" && (item.baseYear ?? item.targetYear) === signals.breakYear);
  const beforeFirstCareer = !signals.previousCareer;
  const nextRole = signals.nextCareer?.title ?? "your next milestone";
  const suggestedYear = signals.nextCareer ? (signals.nextCareer.baseYear ?? signals.nextCareer.targetYear) + 1 : signals.breakYear + 1;
  const supportExists = signals.hasEmergencySavings || signals.hasSideIncome;
  const risky = Boolean(sameYearCareer) || affectedMilestones.length >= 3 || duration > 12 || (beforeFirstCareer && !signals.hasEmergencySavings);
  const suitable = !risky && Boolean(signals.previousCareer) && affectedMilestones.length <= 2 && (duration <= 6 || supportExists);
  const status: BreakTimingAnalysis["status"] = suitable ? "Suitable Timing" : risky ? "Risky Timing" : "Needs Caution";

  if (suitable) {
    return {
      status,
      headline: "Break is placed at a suitable time.",
      current: `${yearLabel(signals.breakYear)}, after ${signals.previousCareer?.title ?? "a career milestone"}`,
      suggested: "Keep current timing",
      reasoning: `This break happens after ${signals.previousCareer?.title ?? "a meaningful milestone"} and your next milestone remains reachable after returning.`,
    };
  }

  return {
    status,
    headline: sameYearCareer ? "This break overlaps a career milestone." : "This break may interrupt your next career milestone.",
    current: `${yearLabel(signals.breakYear)}, before ${nextRole}`,
    suggested: `${yearLabel(suggestedYear)}, after ${nextRole}`,
    reasoning: `This break currently happens before or near ${nextRole}. Moving it after ${yearLabel(suggestedYear)} may reduce disruption because you enter the pause with stronger role evidence.`,
  };
}

function generateReturnProofPacket(selectedBreak: TimelineNode, timelineNodes: TimelineNode[]): ReturnProofPacket {
  const signals = getBreakTimelineSignals(selectedBreak, timelineNodes);
  const duration = selectedBreak.durationMonths ?? getDefaultDurationMonths(selectedBreak.lifeGoalKey);
  const targetRole = signals.nextCareer?.title ?? signals.previousCareer?.title ?? "your next role";
  const previousRole = signals.previousCareer?.title ?? "your latest career stage";
  const targetReason = signals.nextCareer
    ? `CareerOS selected this because ${targetRole} is the next career milestone after your break.`
    : "CareerOS uses your latest career role as the return target because no later milestone exists.";
  const roleProfile = getReturnProofRoleProfile(targetRole);
  const breakProfile = getBreakExplanationProfile(selectedBreak, targetRole);
  const prepMonth = Math.max(1, duration <= 6 ? duration - 1 : duration <= 12 ? duration - 2 : duration - 3);

  return {
    targetRole,
    targetReason,
    previousRole,
    returnWindow: `Month ${prepMonth}-${duration}`,
    explanationDraft: breakProfile,
    proofTargets: roleProfile.proofTargets,
    skillTargets: roleProfile.skillTargets,
    talkingPoints: [
      `I took this break intentionally and prepared for a structured return toward ${targetRole}.`,
      `I stayed connected to my career direction through ${roleProfile.proofTargets[0].replace(/^1 /, "one ")}.`,
      `I am clear about the role I am returning toward and ready to continue from ${previousRole}.`,
    ],
  };
}

function generateReturnPhases(durationMonths: number): ReturnPhase[] {
  const prepareMonth = durationMonths <= 6
    ? durationMonths - 1
    : durationMonths <= 12
      ? durationMonths - 2
      : durationMonths <= 24
        ? durationMonths - 3
        : durationMonths - 4;

  return [
    { key: "start", label: "Start Break", month: 1, purpose: "Set the return direction early" },
    { key: "checkin", label: "Mid-Break Check-in", month: Math.max(2, Math.round(durationMonths / 2)), purpose: "Check whether your career direction still feels right" },
    { key: "prepare", label: "Prepare Return", month: Math.max(1, prepareMonth), purpose: "Prepare proof before applying again" },
    { key: "return", label: "Target Return", month: Math.max(1, durationMonths), purpose: "Use your proof to explain the break confidently" },
  ];
}

function generateProofTasksForPhase(phaseKey: ReturnPhaseKey, selectedBreak: TimelineNode, packet: ReturnProofPacket): ProofTask[] {
  const lightBreak = isLightContinuityBreak(selectedBreak);
  const primarySkill = packet.skillTargets[0] ?? "one core return skill";
  const role = packet.targetRole;
  const roleProof = getRoleAwareProofTask(role);
  const breakNote = getBreakAwareProofNote(selectedBreak);

  if (phaseKey === "start") {
    return [
      {
        id: "start-role",
        area: "Return Direction",
        title: "Confirm your return target role",
        output: "Clear target role",
        why: "Keeps the break connected to your next career step instead of becoming an undefined pause.",
        roleLink: `Useful for returning toward ${role}.`,
        status: "Ready",
        icon: Compass,
      },
      {
        id: "start-requirements",
        area: "Role Requirements",
        title: "Save the requirements for your target role",
        output: "Short role requirement note",
        why: "Helps you know what proof or skills to refresh before returning.",
        roleLink: lightBreak ? "Keep this light. The goal is to stay connected, not overload recovery." : undefined,
        status: "Recommended",
        icon: FileText,
      },
      {
        id: "start-proof",
        area: "Proof Plan",
        title: "Choose one proof asset to build later",
        output: "One planned proof item",
        why: "Gives the break a simple return goal without overloading the early stage.",
        roleLink: breakNote,
        status: "Needs proof",
        icon: FolderOpen,
      },
    ];
  }

  if (phaseKey === "checkin") {
    return [
      {
        id: "checkin-fit",
        area: "Direction Check",
        title: "Review whether the target role still fits",
        output: "Keep or adjust decision",
        why: "Your career goals may feel different after time away, so this prevents returning blindly.",
        roleLink: `Check if ${role} still feels like the right return direction.`,
        status: "Recommended",
        icon: Target,
      },
      {
        id: "checkin-skill",
        area: "Skill Gap",
        title: "Identify one skill to refresh",
        output: "One skill refresh focus",
        why: "A small skill focus is easier to maintain than trying to refresh everything at once.",
        roleLink: lightBreak ? "Keep this light and realistic for your recovery pace." : `Start with ${formatSkillTitle(primarySkill)} if it still matters for ${role}.`,
        status: "Recommended",
        icon: Sparkles,
      },
      {
        id: "checkin-timeline",
        area: "Return Timing",
        title: "Check if the return month still feels realistic",
        output: "Updated return timing note",
        why: "Helps you adjust preparation early if the break needs to be longer or shorter.",
        roleLink: breakNote,
        status: "Needs prep",
        icon: RefreshCcw,
      },
    ];
  }

  if (phaseKey === "prepare") {
    return [
      {
        id: "prepare-proof",
        area: "Role Evidence",
        title: roleProof.task,
        output: roleProof.output,
        why: roleProof.why,
        roleLink: `Useful for returning as ${role}.`,
        status: "Needs proof",
        icon: roleProof.icon,
      },
      {
        id: "prepare-skill",
        area: "Skill Refresh",
        title: "Refresh one key skill for the target role",
        output: "Short learning or practice record",
        why: "Shows that you have stayed connected to the core skills needed for your return role.",
        roleLink: `A focused ${formatSkillTitle(primarySkill)} refresh is enough to start.`,
        status: "Recommended",
        icon: Sparkles,
      },
      {
        id: "prepare-explanation",
        area: "Break Explanation",
        title: "Draft your career break explanation",
        output: "Interview-ready explanation",
        why: "Helps you explain the gap clearly instead of sounding unsure or defensive.",
        roleLink: breakNote,
        status: "Missing",
        icon: MessageSquareText,
        draftText: packet.explanationDraft,
      },
    ];
  }

  return [
    {
      id: "return-explanation",
      area: "Break Explanation",
      title: "Finalise your break explanation",
      output: "Polished explanation draft",
      why: "A clear explanation helps employers understand the break without making it the main concern.",
      roleLink: `Keep it connected to your return toward ${role}.`,
      status: "Needs prep",
      icon: MessageSquareText,
      draftText: packet.explanationDraft,
    },
    {
      id: "return-talking-points",
      area: "Interview Confidence",
      title: "Prepare two return talking points",
      output: "Two interview-ready statements",
      why: "Helps you explain what you learned, how you prepared, and why you are ready now.",
      roleLink: packet.talkingPoints[0],
      status: "Needs prep",
      icon: Mic,
    },
    {
      id: "return-summary",
      area: "Application Proof",
      title: "Update your resume or portfolio summary",
      output: "Updated profile summary",
      why: "Connects your break, proof work, and return target into one clear story.",
      roleLink: roleProof.output,
      status: "Recommended",
      icon: FileUser,
    },
    {
      id: "return-apply",
      area: "Reconnect",
      title: "Start applying or reconnecting with contacts",
      output: "First application or outreach step",
      why: "Turns preparation into action once your return window arrives.",
      roleLink: breakNote,
      status: "Recommended",
      icon: Users,
    },
  ];
}

function getReturnPhaseContext(key: ReturnPhaseKey, selectedBreak: TimelineNode, targetRole: string) {
  if (isLightContinuityBreak(selectedBreak)) {
    return "Keep the tasks realistic for your recovery pace. The goal is to stay connected, not overload the break.";
  }
  const role = targetRole.toLowerCase();
  if (role.includes("ux") || role.includes("design") || role.includes("product")) {
    return "Focus on evidence that shows your design thinking, role readiness, and confidence explaining the break.";
  }
  if (role.includes("data") || role.includes("analytics") || role.includes("analyst")) {
    return "Focus on evidence that shows analytical skill, dashboard or SQL practice, and a clear break explanation.";
  }
  if (role.includes("software") || role.includes("engineer") || role.includes("developer")) {
    return "Focus on evidence that shows coding practice, project proof, and confidence explaining the break.";
  }
  if (key === "start" || key === "checkin") {
    return "Keep the tasks realistic for your current stage and prepare proof gradually before your return window.";
  }
  return "Focus on evidence that connects your break, refreshed skills, and return target role.";
}

function getBreakTypeLabel(selectedBreak: TimelineNode) {
  const value = `${selectedBreak.lifeGoalKey ?? ""} ${selectedBreak.title}`.toLowerCase();
  if (value.includes("burnout") || value.includes("health") || value.includes("recovery")) return "Recovery break";
  if (value.includes("family") || value.includes("care") || value.includes("parental") || value.includes("maternity") || value.includes("paternity")) return "Care break";
  if (value.includes("study")) return "Study break";
  if (value.includes("business")) return "Business break";
  if (value.includes("relocation")) return "Relocation break";
  if (value.includes("sabbatical")) return "Sabbatical";
  return "Career break";
}

function getBreakAwareProofNote(selectedBreak: TimelineNode) {
  const value = `${selectedBreak.lifeGoalKey ?? ""} ${selectedBreak.title}`.toLowerCase();
  if (value.includes("burnout") || value.includes("health") || value.includes("recovery")) return "Keep this light. The goal is to stay connected, not overload recovery.";
  if (value.includes("family") || value.includes("care") || value.includes("parental") || value.includes("maternity") || value.includes("paternity")) return "Choose a small proof task that can be done when responsibilities allow.";
  if (value.includes("study")) return "Use one study assignment or project as return evidence.";
  if (value.includes("business")) return "Document one business decision or customer problem as return evidence.";
  if (value.includes("relocation")) return "Prepare proof that matches expectations in your target market.";
  if (value.includes("sabbatical")) return "Use this planned pause to return with clearer direction.";
  return "Keep the proof small, role-relevant, and easy to explain.";
}

function getRoleAwareProofTask(role: string) {
  const value = role.toLowerCase();
  if (value.includes("ux") || value.includes("design") || value.includes("product")) {
    return {
      task: "Complete one updated UX case study",
      output: "Portfolio-ready case study",
      why: "UX roles need proof that you can explain decisions, trade-offs, and user-centred problem solving.",
      icon: BriefcaseBusiness,
    };
  }
  if (value.includes("data") || value.includes("analytics") || value.includes("analyst")) {
    return {
      task: "Complete one dashboard or analysis project",
      output: "Dashboard or analysis project",
      why: "Analytics roles need proof that you can turn data into clear business insight.",
      icon: Target,
    };
  }
  if (value.includes("software") || value.includes("engineer") || value.includes("developer")) {
    return {
      task: "Complete one GitHub-ready feature build",
      output: "GitHub-ready feature build",
      why: "Tech roles need proof that you can still build, debug, and explain your implementation.",
      icon: FolderOpen,
    };
  }
  if (value.includes("marketing") || value.includes("growth") || value.includes("business")) {
    return {
      task: "Complete one campaign or market analysis",
      output: "Strategy-ready analysis",
      why: "Business roles need proof that you can communicate clearly and show practical judgement.",
      icon: BriefcaseBusiness,
    };
  }
  return {
    task: "Complete one role-relevant proof project",
    output: "Portfolio-ready proof item",
    why: "Employers need clear evidence that you are still prepared for the role after the break.",
    icon: FileText,
  };
}

function getShortPhasePurpose(key: ReturnPhaseKey) {
  if (key === "start") return "Set direction early so the break does not become disconnected.";
  if (key === "checkin") return "Check whether the return direction still makes sense.";
  if (key === "prepare") return "Prepare visible proof before applications begin.";
  return "Use your proof to apply and explain the break confidently.";
}

function formatSkillTitle(skill: string) {
  return skill.replace(/\bone\b|\bcore\b|\breturn\b|\bskill\b/gi, "").trim().replace(/\s+/g, " ") || "Skill";
}

function isLightContinuityBreak(selectedBreak: TimelineNode) {
  const value = `${selectedBreak.lifeGoalKey ?? ""} ${selectedBreak.title}`.toLowerCase();
  return ["burnout", "health", "recovery", "family emergency", "care", "parental", "maternity", "paternity"].some((term) => value.includes(term));
}

function getReturnProofRoleProfile(role: string) {
  const value = role.toLowerCase();
  if (value.includes("ux") || value.includes("design") || value.includes("product")) {
    return {
      proofTargets: ["1 updated UX case study", "1 product thinking reflection", "1 design decision breakdown"],
      skillTargets: value.includes("senior") ? ["design leadership", "product strategy", "research synthesis"] : ["UX research", "product thinking", "stakeholder communication"],
    };
  }
  if (value.includes("data") || value.includes("analytics")) {
    return {
      proofTargets: ["1 dashboard or analysis project", "1 business insight write-up", "1 SQL or Python refresh project"],
      skillTargets: ["SQL", "dashboard storytelling", "business analysis"],
    };
  }
  if (value.includes("software") || value.includes("engineer") || value.includes("developer")) {
    return {
      proofTargets: ["1 small technical project", "1 GitHub-ready feature build", "1 problem-solving write-up"],
      skillTargets: ["coding fundamentals", "system thinking", "project implementation"],
    };
  }
  if (value.includes("marketing") || value.includes("growth") || value.includes("business")) {
    return {
      proofTargets: ["1 campaign analysis", "1 market research write-up", "1 strategy presentation"],
      skillTargets: ["audience research", "campaign analysis", "stakeholder communication"],
    };
  }
  return {
    proofTargets: ["1 role-relevant project or case study", "1 short skills reflection", "1 updated resume proof point"],
    skillTargets: ["refresh one core skill required for the return target role", "stakeholder communication", "role confidence"],
  };
}

function getBreakExplanationProfile(selectedBreak: TimelineNode, targetRole: string) {
  const value = `${selectedBreak.lifeGoalKey ?? ""} ${selectedBreak.title}`.toLowerCase();
  if (value.includes("burnout") || value.includes("health") || value.includes("recovery")) {
    return `I took a planned health-focused break to recover and rebuild a more sustainable approach to work. During this period, I stayed lightly connected to my career direction and prepared to return with stronger clarity around the environment where I can perform well. I am now ready to return to a ${targetRole} role with a more balanced and focused approach.`;
  }
  if (value.includes("family emergency") || value.includes("care")) {
    return `I took time away from work to manage an important family responsibility. During this period, I kept my career direction clear and prepared for a structured return. I am now ready to continue my path toward a ${targetRole} role.`;
  }
  if (value.includes("study")) {
    return `I took a full-time study break to strengthen my knowledge and prepare for the next stage of my career. The experience helped me build stronger foundations that are relevant to my target role. I am now ready to apply those skills as I return toward a ${targetRole} role.`;
  }
  if (value.includes("business")) {
    return `I took time to pursue a business opportunity, which gave me hands-on experience in ownership, decision-making, customer understanding, and problem solving. I am now ready to bring those experiences back into my career path toward a ${targetRole} role.`;
  }
  if (value.includes("parental") || value.includes("maternity") || value.includes("paternity")) {
    return `I took a planned family transition break and used this period to prepare for a realistic and structured return to work. I am now ready to continue my path toward a ${targetRole} role with clearer priorities and a sustainable work arrangement.`;
  }
  if (value.includes("relocation")) {
    return `I took time to manage a relocation and prepare for a new market environment. During this period, I kept my career direction clear and prepared to return with stronger awareness of the local job market. I am now ready to continue toward a ${targetRole} role.`;
  }
  return `I took a planned career break and used the time to prepare for a structured return. During this period, I kept my career direction clear and focused on the proof needed to continue toward a ${targetRole} role.`;
}

function generateReturnWindowMap(selectedBreak: TimelineNode) {
  const duration = selectedBreak.durationMonths ?? getDefaultDurationMonths(selectedBreak.lifeGoalKey);
  const startYear = selectedBreak.targetYear;
  const midMonth = Math.max(1, Math.round(duration / 2));
  const prepMonth = Math.max(1, duration <= 6 ? duration - 1 : duration <= 12 ? duration - 2 : duration - 3);
  const returnYear = startYear + duration / 12;
  const steps: ReturnWindowStep[] = [
    { label: "Start", timing: yearLabel(startYear), helper: "Break begins", icon: Coffee },
    { label: "Check-in", timing: `Month ${midMonth}`, helper: "Review stability and direction", icon: HeartPulse },
    { label: "Prepare Return", timing: `Month ${prepMonth}`, helper: "Start light preparation", icon: Pencil },
    { label: "Return", timing: `Month ${duration} / ${yearLabel(returnYear)}`, helper: "Target comeback point", icon: RefreshCcw },
  ];
  const note = duration <= 6
    ? "Short break. Main focus is timing and explanation."
    : duration <= 12
      ? "Medium break. Start preparing before the final 2 months."
      : duration <= 24
        ? "Longer break. Return planning should begin earlier to reduce re-entry uncertainty."
        : "Extended break. Consider a phased return or bridge role.";
  return { steps, note, tone: duration <= 6 ? "safe" as const : duration <= 12 ? "medium" as const : "risk" as const };
}

function isReturnToWorkBreak(node: TimelineNode) {
  const value = `${node.lifeGoalKey ?? ""} ${node.title}`.toLowerCase();
  return value.includes("return-work") || value.includes("return to work") || value.includes("return after break");
}

function getBreakImpactLevel(node: TimelineNode, milestones: AffectedMilestone[]): BreakImpactLevel {
  const duration = node.durationMonths ?? getDefaultDurationMonths(node.lifeGoalKey);
  if (duration > 12 || milestones.length >= 3) return "High Impact";
  if (duration > 6 || milestones.length >= 2) return "Medium Impact";
  return "Low Impact";
}

function getBreakSafetyStatus(score: number): BreakSafetyStatus {
  if (score >= 80) return "Safe to take";
  if (score >= 65) return "Manageable";
  if (score >= 45) return "Needs preparation";
  return "High risk";
}

function getBreakImpactColor(level: BreakImpactLevel) {
  if (level === "Low Impact") return "#147A55";
  if (level === "Medium Impact") return "#A66A00";
  return "#C8003F";
}

function getBreakImpactSoftBg(level: BreakImpactLevel) {
  if (level === "Low Impact") return "#E9F8F1";
  if (level === "Medium Impact") return "#FFF4D8";
  return "#FFE8EE";
}

function getBreakSafetyColor(status: BreakSafetyStatus) {
  if (status === "Safe to take") return "#147A55";
  if (status === "Manageable") return "#4F46E5";
  if (status === "Needs preparation") return "#A66A00";
  return "#C8003F";
}

function getBreakSafetySoftBg(status: BreakSafetyStatus) {
  if (status === "Safe to take") return "#E9F8F1";
  if (status === "Manageable") return "#EEF2FF";
  if (status === "Needs preparation") return "#FFF4D8";
  return "#FFE8EE";
}

function BreakImpactBadge({ level }: { level: BreakImpactLevel }) {
  return <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: getBreakImpactSoftBg(level), color: getBreakImpactColor(level) }}>{level}</span>;
}

function formatYearValue(year: number) {
  return Number.isInteger(year) ? String(year) : year.toFixed(1);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LifeChapterPlanningCard({ node }: { node: TimelineNode }) {
  const plan = getLifePlan(node);
  const Icon = node.icon ?? Sparkles;
  const duration = node.durationMonths ?? getDefaultDurationMonths(node.lifeGoalKey);
  const features = getLifeChapterFeatures(node);
  const [activeFeature, setActiveFeature] = useState<LifeFeatureKey>("impact");
  const [isNavigatorVisible, setIsNavigatorVisible] = useState(false);
  const cardAreaRef = useRef<HTMLDivElement | null>(null);
  const careerImpactRef = useRef<HTMLElement | null>(null);
  const financialReadinessRef = useRef<HTMLElement | null>(null);
  const returnReadinessRef = useRef<HTMLElement | null>(null);
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan>({
    savings: node.lifeGoalKey === "emergency-savings" ? 8000 : 18000,
    monthlyCost: 3000,
    duration,
    oneTimeCost: getDefaultOneTimeCost(node.lifeGoalKey),
    emergencyMonths: 6,
  });
  const [returnPlan, setReturnPlan] = useState<ReturnReadinessPlan>({
    absenceMonths: duration,
    plannedReturnMonth: duration,
    targetRole: "UX Designer",
    prepLeadMonths: duration > 18 ? 6 : duration > 6 ? 3 : 2,
  });
  const activeStep = getFeatureStep(activeFeature);

  useEffect(() => {
    const sections = [
      careerImpactRef.current,
      financialReadinessRef.current,
      returnReadinessRef.current,
    ].filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const feature = visible?.target.getAttribute("data-feature") as LifeFeatureKey | null;
        if (feature) setActiveFeature(feature);
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: [0.2, 0.45, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [features]);

  useEffect(() => {
    const cardArea = cardAreaRef.current;
    if (!cardArea) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsNavigatorVisible(entry.isIntersecting),
      { rootMargin: "-18% 0px -18% 0px", threshold: [0.04, 0.18] },
    );

    observer.observe(cardArea);
    return () => observer.disconnect();
  }, []);

  const navigatorRefs: Record<NavigatorStepKey, React.RefObject<HTMLElement | null> | null> = {
    prepare: careerImpactRef,
    finance: features.includes("finance") ? financialReadinessRef : null,
    return: features.includes("return") ? returnReadinessRef : null,
  };

  return (
    <>
      <div className="bg-[radial-gradient(circle_at_88%_12%,rgba(240,77,122,0.32),transparent_18rem),linear-gradient(135deg,#081433,#152238)] p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/12 text-[#FFD6E1] ring-1 ring-white/15">
              <Icon className="h-7 w-7" />
            </span>
            <div>
              <span className="rounded-full bg-[#FFF2F6]/14 px-3 py-1 text-xs font-semibold text-white/80">
                Life chapter blueprint
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-normal">{plan.title}</h2>
              <p className="mt-2 text-sm text-white/70">{plan.eyebrow} / {node.time}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                {getChapterPurpose(node.lifeGoalKey)}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-right">
            <p className="text-xs font-semibold text-white/60">Duration</p>
            <p className="mt-1 text-sm font-semibold">{duration} months</p>
          </div>
        </div>
      </div>

      <div ref={cardAreaRef} className="bg-[linear-gradient(180deg,#FFF7FA_0%,#FFFFFF_44%,#F8F9FB_100%)] p-5 sm:p-6">
        {node.chapterKind === "break" && (
          <div className="mb-5 rounded-2xl border bg-[#FFF4EA] px-5 py-4 text-sm font-semibold leading-6 text-[#7A3D12]" style={{ borderColor: "#F4C7A1" }}>
            Your {formatDuration(duration)} {node.title.toLowerCase()} starts at {yearLabel(node.targetYear)} and delays the future timeline by +{formatDuration(duration)}.
          </div>
        )}
        <ChapterProgressRail
          activeStep={activeStep}
          visible={isNavigatorVisible}
          sectionRefs={navigatorRefs}
        />
        <div className="lg:hidden sticky top-3 z-20 mb-4">
          <ChapterProgressRail
            activeStep={activeStep}
            visible
            sectionRefs={navigatorRefs}
            mobile
          />
        </div>
        <div className="space-y-5">
            <FeatureShell id="career-impact-analysis" feature="impact" sectionRef={careerImpactRef}>
              <CareerImpactAnalysis node={node} />
            </FeatureShell>

            {features.includes("finance") && (
              <FeatureShell id="financial-readiness" feature="finance" sectionRef={financialReadinessRef}>
                <FinancialReadinessCalculator plan={financialPlan} onChange={setFinancialPlan} />
              </FeatureShell>
            )}

            {features.includes("return") && (
              <FeatureShell id="return-to-work-readiness" feature="return" sectionRef={returnReadinessRef}>
                <ReturnToWorkReadinessAssessment plan={returnPlan} onChange={setReturnPlan} />
              </FeatureShell>
            )}

            <p className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#46536D] shadow-sm ring-1 ring-[#E5E8F0]">
              This chapter helps you understand what may happen, whether you can afford it, and how difficult returning may be.
            </p>
        </div>
      </div>
    </>
  );
}

function getLifeChapterFeatures(node: TimelineNode): LifeFeatureKey[] {
  const key = node.lifeGoalKey;
  if (key === "investing") return ["impact"];
  if (key === "return-work") return ["impact", "return"];
  if (key === "family-planning" || key === "emergency-savings" || key === "retirement") return ["impact", "finance"];
  return ["impact", "finance", "return"];
}

function getChapterPurpose(key?: string) {
  if (key === "study-again") return "Plan the study chapter without losing career direction or financial control.";
  if (key === "side-business") return "Test the business path while protecting runway and return options.";
  if (key === "family-planning") return "Plan family milestones around stable income, time, and workload.";
  if (key === "emergency-savings") return "Build enough buffer before making higher-risk career moves.";
  if (key === "investing") return "Set a clear review date without turning investing into a separate finance app.";
  if (key === "return-work") return "Choose a practical return window after a break.";
  return "Plan the chapter without losing career direction or financial control.";
}

function getFeatureStep(feature: LifeFeatureKey): NavigatorStepKey {
  if (feature === "finance") return "finance";
  if (feature === "return") return "return";
  return "prepare";
}

function ChapterProgressRail({
  activeStep,
  visible,
  sectionRefs,
  mobile = false,
}: {
  activeStep: NavigatorStepKey;
  visible: boolean;
  sectionRefs: Record<NavigatorStepKey, React.RefObject<HTMLElement | null> | null>;
  mobile?: boolean;
}) {
  const steps: { key: NavigatorStepKey; label: string }[] = [
    { key: "prepare", label: "Prepare" },
    { key: "finance", label: "Finance" },
    { key: "return", label: "Return" },
  ];
  const activeIndex = Math.max(0, steps.findIndex((step) => step.key === activeStep));
  const fillHeight = activeIndex === 0 ? "14%" : activeIndex === 1 ? "50%" : "86%";
  const fillWidth = activeIndex === 0 ? "16%" : activeIndex === 1 ? "50%" : "86%";

  function scrollToStep(step: NavigatorStepKey) {
    const target = sectionRefs[step]?.current;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (mobile) {
    return (
      <nav className="rounded-full border bg-white/95 px-3 py-2 shadow-[0_14px_34px_rgba(8,20,51,0.14)] backdrop-blur" style={{ borderColor: theme.border }} aria-label="Chapter Navigator">
        <div className="relative grid grid-cols-3 gap-2">
          <div className="absolute left-[12%] right-[12%] top-3 h-0.5 rounded-full bg-[#E5E8F0]" />
          <motion.div
            className="absolute left-[12%] top-3 h-0.5 rounded-full bg-[#E00046]"
            animate={{ width: fillWidth }}
            transition={{ type: "spring", stiffness: 150, damping: 24 }}
          />
          {steps.map((step, index) => {
            const disabled = !sectionRefs[step.key]?.current;
            const active = step.key === activeStep;
            const completed = index < activeIndex && !disabled;
            return (
              <button
                key={step.key}
                type="button"
                disabled={disabled}
                aria-disabled={disabled}
                onClick={() => scrollToStep(step.key)}
                className="relative z-10 flex flex-col items-center gap-1 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-35"
                style={{ color: active ? theme.rose2 : completed ? theme.navy : theme.muted }}
              >
                <motion.span
                  animate={{ scale: active ? 1.16 : 1 }}
                  className="h-6 w-6 rounded-full border-2"
                  style={{
                    borderColor: active || completed ? theme.rose2 : "#CBD3E5",
                    backgroundColor: active || completed ? theme.rose2 : "#fff",
                    boxShadow: active ? "0 0 0 5px rgba(240,77,122,0.14)" : "none",
                  }}
                />
                {step.label}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Chapter Navigator"
      className="pointer-events-auto fixed left-4 top-1/2 z-40 hidden w-[170px] -translate-y-1/2 rounded-[1.4rem] border bg-white/95 p-3 text-[#081433] shadow-[0_22px_60px_rgba(8,20,51,0.18)] backdrop-blur transition duration-300 lg:block"
      style={{
        borderColor: theme.border,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(-12px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#46536D]">Chapter Navigator</p>
      <div className="relative space-y-3">
        <div className="absolute bottom-3 left-[15px] top-3 w-0.5 rounded-full bg-[#E5E8F0]" />
        <motion.div
          className="absolute left-[15px] top-3 w-0.5 rounded-full bg-[#E00046]"
          animate={{ height: fillHeight }}
          transition={{ type: "spring", stiffness: 150, damping: 24 }}
        />
        {steps.map((step, index) => {
          const disabled = !sectionRefs[step.key]?.current;
          const completed = index < activeIndex;
          const active = step.key === activeStep;
          return (
            <button
              key={step.key}
              type="button"
              disabled={disabled}
              aria-disabled={disabled}
              onClick={() => scrollToStep(step.key)}
              className="relative flex w-full items-center gap-3 rounded-full px-2 py-1.5 text-left text-xs font-semibold transition hover:bg-[#FFF7FA] disabled:cursor-not-allowed disabled:opacity-35"
              style={{ color: active ? theme.rose2 : completed ? theme.navy : theme.muted }}
            >
              <motion.span
                animate={{ scale: active ? 1.22 : 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="z-10 h-4 w-4 shrink-0 rounded-full border-2"
                style={{
                  borderColor: active || completed ? theme.rose2 : "#CBD3E5",
                  backgroundColor: active || completed ? theme.rose2 : "#fff",
                  boxShadow: active ? "0 0 0 5px rgba(240,77,122,0.14)" : "none",
                }}
              />
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function FeatureShell({
  id,
  feature,
  sectionRef,
  children,
}: {
  id: string;
  feature: LifeFeatureKey;
  sectionRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      ref={sectionRef}
      data-feature={feature}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.32 }}
    >
      {children}
    </motion.section>
  );
}

function CareerImpactAnalysis({ node }: { node: TimelineNode }) {
  const profile = getCareerImpactProfile(node);

  return (
    <section className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_45px_rgba(21,34,56,0.09)] ring-1 ring-[#E5E8F0]">
      <div className="bg-[radial-gradient(circle_at_92%_0%,rgba(240,77,122,0.14),transparent_16rem),linear-gradient(135deg,#FFFFFF,#FFF7FA)] p-5">
        <span className="rounded-full bg-[#081433] px-3 py-1 text-xs font-semibold text-white">Career Impact Analysis</span>
        <h3 className="mt-4 text-xl font-semibold text-[#081433]">What this chapter may change</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#46536D]">
          Compare the likely career trade-offs with the upside this chapter may create.
        </p>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <ImpactColumn title="Potential impacts" tone="risk" items={profile.impacts} />
        <ImpactColumn title="Potential benefits" tone="benefit" items={profile.benefits} />
      </div>
    </section>
  );
}

function ImpactColumn({ title, tone, items }: { title: string; tone: "risk" | "benefit"; items: string[] }) {
  const color = tone === "risk" ? theme.rose2 : "#1E9E72";
  const bg = tone === "risk" ? "#FFF2F6" : "#ECFDF5";

  return (
    <div className="rounded-[1.5rem] bg-[#F8F9FB] p-4">
      <h4 className="text-sm font-semibold text-[#081433]">{title}</h4>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex min-h-11 items-center gap-3 rounded-full px-3 py-2 text-xs font-semibold leading-5 shadow-sm"
            style={{ backgroundColor: bg, color }}
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/80">
              {tone === "risk" ? "!" : "+"}
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCareerImpactProfile(node: TimelineNode) {
  const common = {
    impacts: ["Promotion timing may shift", "Network activity can slow", "Portfolio evidence may age"],
    benefits: ["Clearer priorities", "Stronger life fit", "Transferable perspective"],
    riskScore: 50,
    benefitScore: 58,
  };
  const profiles: Record<string, typeof common> = {
    "study-again": {
      impacts: ["Delayed promotion timeline", "Income may pause", "Skills need applied practice", "Network activity may reduce"],
      benefits: ["New credentials", "Higher specialisation", "Stronger long-term mobility", "Fresh portfolio evidence"],
      riskScore: 55,
      benefitScore: 76,
    },
    "side-business": {
      impacts: ["Split attention", "Energy pressure", "Role performance may fluctuate", "Income can be less predictable"],
      benefits: ["Commercial judgment", "Customer insight", "Ownership signal", "Product and sales evidence"],
      riskScore: 62,
      benefitScore: 74,
    },
    "health-break": {
      impacts: ["Career pace slows", "Re-entry story matters", "Professional visibility may dip"],
      benefits: ["Burnout recovery", "Sustainable work rhythm", "Better long-term clarity"],
      riskScore: 58,
      benefitScore: 70,
    },
    relocate: {
      impacts: ["Market reset", "Local network gap", "Visa or timing uncertainty"],
      benefits: ["International exposure", "New market options", "Broader career identity"],
      riskScore: 64,
      benefitScore: 72,
    },
    "emergency-savings": {
      impacts: ["Riskier moves may wait", "Salary certainty becomes more important"],
      benefits: ["Higher career resilience", "Better negotiating confidence", "More stable decisions"],
      riskScore: 30,
      benefitScore: 66,
    },
    investing: {
      impacts: ["Short-term attention split", "Financial choices may affect risk appetite"],
      benefits: ["Long-term confidence", "Better planning discipline", "More informed career trade-offs"],
      riskScore: 24,
      benefitScore: 55,
    },
    "career-break": {
      impacts: ["Reduced lifetime earnings", "Temporary skill depreciation", "Re-entry challenges", "Network activity drops"],
      benefits: ["Improved work-life balance", "Personal development", "Reduced burnout", "Long-term priority clarity"],
      riskScore: 68,
      benefitScore: 70,
    },
  };

  return node.lifeGoalKey ? profiles[node.lifeGoalKey] ?? common : common;
}

function getDefaultOneTimeCost(key?: string) {
  if (key === "study-again") return 18000;
  if (key === "relocate") return 12000;
  if (key === "family-planning") return 15000;
  if (key === "side-business") return 8000;
  return 5000;
}

function calculateFinancialReadiness(plan: FinancialPlan) {
  const livingCost = plan.monthlyCost * plan.duration;
  const emergencyFund = plan.monthlyCost * plan.emergencyMonths;
  const recommendedSavings = livingCost + plan.oneTimeCost + emergencyFund;
  const gap = plan.savings - recommendedSavings;
  const ratio = plan.savings / Math.max(1, recommendedSavings);
  const status = ratio >= 1 ? "Ready" : ratio >= 0.75 ? "Almost ready" : "Not ready";

  return {
    livingCost,
    emergencyFund,
    recommendedSavings,
    gap,
    status,
    progress: Math.min(100, ratio * 100),
  };
}

function FinancialReadinessCalculator({
  plan,
  onChange,
}: {
  plan: FinancialPlan;
  onChange: (next: FinancialPlan) => void;
}) {
  const result = calculateFinancialReadiness(plan);

  function update<K extends keyof FinancialPlan>(key: K, value: FinancialPlan[K]) {
    onChange({ ...plan, [key]: value });
  }

  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-[0_20px_45px_rgba(21,34,56,0.09)] ring-1 ring-[#E5E8F0]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FFF2F6] text-[#E00046]">
            <Calculator className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00046]">Financial Readiness</p>
            <h3 className="text-xl font-semibold text-[#081433]">Can this chapter be funded?</h3>
          </div>
        </div>
        <StatusPill status={result.status} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-5">
        <NumberField label="Current savings" prefix="RM" value={plan.savings} min={0} max={500000} onChange={(value) => update("savings", value)} />
        <NumberField label="Monthly living cost" prefix="RM" value={plan.monthlyCost} min={1} max={50000} onChange={(value) => update("monthlyCost", value)} />
        <NumberField label="Chapter duration" suffix="months" value={plan.duration} min={1} max={60} onChange={(value) => update("duration", value)} />
        <NumberField label="One-time chapter cost" prefix="RM" value={plan.oneTimeCost} min={0} max={500000} onChange={(value) => update("oneTimeCost", value)} />
        <NumberField label="Emergency fund" suffix="months" value={plan.emergencyMonths} min={1} max={24} onChange={(value) => update("emergencyMonths", value)} />
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#F7D8E1]">
        <motion.div
          className="h-full rounded-full bg-[linear-gradient(90deg,#E00046,#F04D7A)]"
          animate={{ width: `${result.progress}%` }}
          transition={{ type: "spring", stiffness: 130, damping: 22 }}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricBubble label="Estimated living cost" value={formatRm(result.livingCost)} />
        <MetricBubble label="Emergency fund" value={formatRm(result.emergencyFund)} />
        <MetricBubble label="Recommended savings" value={formatRm(result.recommendedSavings)} />
        <MetricBubble label={result.gap < 0 ? "Current gap" : "Current surplus"} value={formatRm(Math.abs(result.gap))} />
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const ready = status === "Ready";
  const almost = status === "Almost ready";
  return (
    <span
      className="rounded-full px-4 py-2 text-sm font-semibold"
      style={{
        backgroundColor: ready ? "#ECFDF5" : almost ? "#FFF7ED" : theme.soft,
        color: ready ? "#1E9E72" : almost ? "#C56A14" : theme.rose2,
      }}
    >
      {status}
    </span>
  );
}

function MetricBubble({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full bg-[#F8F9FB] px-5 py-4 shadow-inner">
      <p className="text-xs font-semibold text-[#46536D]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#081433]">{value}</p>
    </div>
  );
}

function ReturnToWorkReadinessAssessment({
  plan,
  onChange,
}: {
  plan: ReturnReadinessPlan;
  onChange: (next: ReturnReadinessPlan) => void;
}) {
  const result = buildReEntryPlan(plan);

  function update<K extends keyof ReturnReadinessPlan>(key: K, value: ReturnReadinessPlan[K]) {
    onChange({ ...plan, [key]: value });
  }

  return (
    <section className="rounded-[2rem] bg-[#081433] p-5 text-white shadow-[0_24px_60px_rgba(8,20,51,0.18)]">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/12 text-[#FFD6E1]">
          <RefreshCcw className="h-5 w-5" />
        </span>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Return-to-Work Readiness</p>
            <h3 className="text-xl font-semibold">Prepare the re-entry path</h3>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
        {result.requirements.map((item) => (
          <div key={item.area} className="rounded-[1.35rem] bg-white p-4 text-[#081433]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.area}</p>
                <p className="mt-1 text-xs font-semibold text-[#46536D]">{item.status}</p>
              </div>
              <span className="rounded-full bg-[#FFF2F6] px-2.5 py-1 text-xs font-semibold text-[#E00046]">{item.progress}%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F7D8E1]">
              <motion.div
                className="h-full rounded-full bg-[#E00046]"
                initial={{ width: 0 }}
                whileInView={{ width: `${item.progress}%` }}
                viewport={{ once: true }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-[#46536D]">{item.action}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.5rem] bg-white/8 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Action planner</p>
          <div className="mt-3 grid gap-3">
            <DarkNumberField label="Planned return month" value={plan.plannedReturnMonth} min={1} max={120} suffix="month" onChange={(value) => update("plannedReturnMonth", value)} />
            <DarkTextField label="Target role" value={plan.targetRole} onChange={(value) => update("targetRole", value)} />
            <DarkNumberField label="Start preparing" value={plan.prepLeadMonths} min={1} max={12} suffix="months before" onChange={(value) => update("prepLeadMonths", value)} />
          </div>
          <p className="mt-3 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold leading-5 text-white/70">
            {result.riskNote}
          </p>
        </div>
        <div className="rounded-[1.5rem] bg-white p-4 text-[#081433]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46536D]">Preparation timeline</p>
          <div className="mt-3 grid gap-2">
            {result.timeline.map((item) => (
              <div key={`${item.month}-${item.action}`} className="flex gap-3 rounded-2xl bg-[#FFF7FA] px-3 py-2">
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#E00046]">Month {item.month}</span>
                <p className="text-xs font-semibold leading-5 text-[#081433]">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DarkNumberField({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix?: string; onChange: (value: number) => void }) {
  return (
    <label className="rounded-[1.2rem] bg-white/8 p-3">
      <span className="text-xs font-semibold text-white/55">{label}</span>
      <span className="mt-2 flex h-10 items-center gap-2 rounded-full bg-white/10 px-4">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange(Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : min);
          }}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none"
        />
        {suffix && <span className="text-xs font-semibold text-white/45">{suffix}</span>}
      </span>
    </label>
  );
}

function DarkTextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="rounded-[1.2rem] bg-white/8 p-3">
      <span className="text-xs font-semibold text-white/55">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-full border-0 bg-white/10 px-4 text-sm font-semibold text-white outline-none"
      />
    </label>
  );
}

function buildReEntryPlan(plan: ReturnReadinessPlan) {
  const longBreak = plan.absenceMonths > 18;
  const mediumBreak = plan.absenceMonths > 6;
  const startMonth = Math.max(1, plan.plannedReturnMonth - plan.prepLeadMonths);
  const skillProgress = longBreak ? 35 : mediumBreak ? 55 : 72;
  const visibilityProgress = longBreak ? 30 : mediumBreak ? 48 : 64;
  const interviewProgress = mediumBreak ? 50 : 62;
  const timingProgress = plan.prepLeadMonths >= (longBreak ? 6 : mediumBreak ? 3 : 2) ? 78 : 46;

  const requirements = [
    {
      area: "Skill Currency",
      status: longBreak ? "Needs refresh" : mediumBreak ? "Partial" : "Mostly current",
      action: `Complete one short ${plan.targetRole || "role"} refresher course before Month ${Math.max(1, plan.plannedReturnMonth - 1)}.`,
      progress: skillProgress,
    },
    {
      area: "Market Visibility",
      status: longBreak ? "Weak" : "Quiet",
      action: "Attend one industry event or reconnect with 3 professional contacts.",
      progress: visibilityProgress,
    },
    {
      area: "Interview Readiness",
      status: mediumBreak ? "Partial" : "Needs story",
      action: "Prepare one clear explanation for the career break and current work readiness.",
      progress: interviewProgress,
    },
    {
      area: "Availability & Timing",
      status: timingProgress >= 70 ? "Good" : "Tight",
      action: `Start applications ${plan.prepLeadMonths} months before the planned return window.`,
      progress: timingProgress,
    },
  ];

  const timeline = [
    { month: startMonth, action: `Refresh ${plan.targetRole || "target role"} skills and choose one proof-of-work project.` },
    { month: Math.min(plan.plannedReturnMonth, startMonth + 1), action: "Update resume, portfolio, and career break explanation." },
    { month: Math.min(plan.plannedReturnMonth, startMonth + 2), action: "Start applications, networking, and interview practice." },
    { month: plan.plannedReturnMonth, action: "Return target window." },
  ].filter((item, index, list) => index === 0 || item.month >= list[index - 1].month);

  const riskNote = plan.absenceMonths <= 6
    ? "Short break. Main focus is explanation and timing."
    : plan.absenceMonths <= 18
      ? "Medium break. Refresh skills and start preparing early."
      : "Long break. Build a stronger return plan and prepare earlier.";

  return { requirements, timeline, riskNote };
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="rounded-xl border bg-white p-3" style={{ borderColor: theme.border }}>
      <span className="text-xs font-semibold text-[#46536D]">{label}</span>
      <span className="mt-2 flex h-10 items-center gap-2 rounded-xl border bg-white px-3" style={{ borderColor: theme.border }}>
        {prefix && <span className="text-xs font-semibold text-[#46536D]">{prefix}</span>}
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange(Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : min);
          }}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#081433] outline-none"
        />
        {suffix && <span className="text-xs font-semibold text-[#46536D]">{suffix}</span>}
      </span>
    </label>
  );
}

export default function LifeChapterDesigner() {
  const [startingPoint, setStartingPoint] = useState<StartingPoint>("Final Year Student");
  const [lifeNodes, setLifeNodes] = useState<TimelineNode[]>([]);
  const [selectedId, setSelectedId] = useState("student");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const selectedNodeRef = useRef<HTMLDivElement | null>(null);

  const timelineNodes = useMemo(
    () => applyTimelineDelays(careerTemplates[startingPoint].nodes, lifeNodes),
    [startingPoint, lifeNodes],
  );
  const selectedIndex = Math.max(0, timelineNodes.findIndex((node) => node.id === selectedId));
  const selectedNode = timelineNodes[selectedIndex] ?? timelineNodes[0];
  const existingTitles = useMemo(() => new Set(timelineNodes.map((node) => node.title.toLowerCase())), [timelineNodes]);
  const editingNode = editingNodeId ? lifeNodes.find((node) => node.id === editingNodeId) ?? null : null;
  const deleteCandidate = deleteCandidateId ? timelineNodes.find((node) => node.id === deleteCandidateId) ?? null : null;
  const progressPercent = timelineNodes.length <= 1 ? 0 : (selectedIndex / (timelineNodes.length - 1)) * 100;
  const timelineWidth = timelineNodes.length <= 5 ? "100%" : `${timelineNodes.length * 216}px`;

  useEffect(() => {
    selectedNodeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedId, timelineNodes.length]);

  function changeStartingPoint(value: StartingPoint) {
    setStartingPoint(value);
    setLifeNodes([]);
    setSelectedId(careerTemplates[value].nodes[0].id);
  }

  function shiftSelection(direction: -1 | 1) {
    const nextIndex = Math.min(timelineNodes.length - 1, Math.max(0, selectedIndex + direction));
    setSelectedId(timelineNodes[nextIndex].id);
  }

  function addLifeGoals(nodes: TimelineNode[]) {
    const merged = sortTimelineNodes([...lifeNodes, ...nodes]);
    setLifeNodes(merged);
    setSelectedId(nodes[nodes.length - 1].id);
    setIsModalOpen(false);
  }

  function openAddModal() {
    setEditingNodeId(null);
    setIsModalOpen(true);
  }

  function openEditModal(node: TimelineNode) {
    if (node.type !== "life") return;
    setEditingNodeId(node.id);
    setIsModalOpen(true);
  }

  function saveLifeGoal(updatedNode: TimelineNode) {
    setLifeNodes((current) => sortTimelineNodes(current.map((node) => (node.id === updatedNode.id ? updatedNode : node))));
    setSelectedId(updatedNode.id);
    setEditingNodeId(null);
    setIsModalOpen(false);
  }

  function deleteLifeGoal(nodeId: string) {
    const nodeToRemove = timelineNodes.find((node) => node.id === nodeId);
    if (!nodeToRemove || nodeToRemove.type !== "life") return;

    const nodeIndex = timelineNodes.findIndex((node) => node.id === nodeId);
    const remainingTimeline = timelineNodes.filter((node) => node.id !== nodeId);
    const previousNode = remainingTimeline[Math.max(0, nodeIndex - 1)] ?? remainingTimeline[0];

    setLifeNodes((current) => current.filter((node) => node.id !== nodeId));
    setSelectedId(previousNode?.id ?? careerTemplates[startingPoint].nodes[0].id);
    setDeleteCandidateId(null);
  }

  function applyRetirementRecommendations(recommendations: RetirementRecommendation[]) {
    if (recommendations.length === 0) return;

    const lastAllowed = [...recommendations].reverse().map(getAllowedRetirementGoalOption).find((option): option is LifeGoalOption => Boolean(option));
    const existingLast = lastAllowed ? timelineNodes.find((node) => node.type === "life" && node.chapterKind === "goal" && (node.lifeGoalKey === lastAllowed.key || node.title.toLowerCase() === lastAllowed.title.toLowerCase())) : null;
    const lastAppliedId = existingLast?.id ?? (lastAllowed ? `life-${lastAllowed.key}` : selectedId);
    setLifeNodes((current) => {
      const next = [...current];

      recommendations.forEach((recommendation) => {
        const option = getAllowedRetirementGoalOption(recommendation);
        if (!option) return;

        const existing = next.find((node) => node.type === "life" && node.chapterKind === "goal" && (node.lifeGoalKey === option.key || node.title.toLowerCase() === option.title.toLowerCase()));
        if (existing) {
          return;
        }

        const node = createLifeNode(option, recommendation.targetYear, recommendation.durationMonths ?? getDefaultDurationMonths(option.key));
        next.push(node);
      });

      return sortTimelineNodes(next);
    });
    setSelectedId(lastAppliedId);
  }

  function addEmergencySavingsBeforeBreak(selectedBreak: TimelineNode) {
    const existing = timelineNodes.find((node) => node.lifeGoalKey === "emergency-savings" || node.title.toLowerCase().includes("emergency savings"));
    if (existing) {
      setSelectedId(existing.id);
      return;
    }

    const option = getLifeOption("emergency-savings");
    if (!option) return;

    const breakYear = selectedBreak.targetYear;
    const targetYear = Math.max(0, breakYear - (breakYear >= 2 ? 2 : 1));
    const emergencyNode = createLifeNode(option, targetYear, 12);
    setLifeNodes((current) => sortTimelineNodes([...current, emergencyNode]));
    setSelectedId(emergencyNode.id);
  }

  return (
    <main className="min-h-screen bg-[#fbfbfc] text-[#152238]" style={{ fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif" }}>
      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <div className="career-fade-up overflow-hidden rounded-2xl border bg-white shadow-sm" style={{ borderColor: theme.border }}>
          <div className="relative overflow-hidden bg-[#081433] px-7 py-8 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(240,77,122,0.30),transparent_22rem),radial-gradient(circle_at_10%_90%,rgba(125,182,255,0.18),transparent_18rem),linear-gradient(135deg,#081433,#152238)]" />
            <div className="relative z-10 max-w-4xl">
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/78 backdrop-blur-sm">
                Career-life planning module
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-normal text-white md:text-5xl">
                Life Chapter Designer
              </h1>
              <p className="mt-4 text-lg font-medium text-white/82">
                Design your career around real life milestones, not just job titles.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
                Map your career growth path together with savings, study plans, family goals, career breaks, entrepreneurship, and comeback strategies.
              </p>
            </div>
          </div>
        </div>

        <section className="career-fade-up mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm" style={{ borderColor: theme.border, animationDelay: "120ms" }}>
          <div className="flex flex-col gap-4 border-b px-6 py-5 lg:flex-row lg:items-center lg:justify-between" style={{ borderColor: theme.border }}>
            <label className="w-full max-w-xs">
              <span className="text-sm font-semibold text-[#081433]">Starting point</span>
              <span className="relative mt-2 block">
                <select
                  value={startingPoint}
                  onChange={(event) => changeStartingPoint(event.target.value as StartingPoint)}
                  className="h-11 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm font-semibold text-[#46536D] outline-none"
                  style={{ borderColor: theme.border }}
                >
                  {startingOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#46536D]" />
              </span>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046]">
                Selected progress: {selectedIndex + 1}/{timelineNodes.length}
              </span>
              <button
                type="button"
                aria-label="Edit selected life chapter"
                disabled={selectedNode.type !== "life"}
                onClick={() => openEditModal(selectedNode)}
                className="grid h-11 w-11 place-items-center rounded-xl border bg-white text-[#081433] shadow-sm transition hover:bg-[#FFF2F6] disabled:cursor-not-allowed disabled:text-[#A8B0C2] disabled:opacity-45"
                style={{ borderColor: theme.border }}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete selected life chapter"
                disabled={selectedNode.type !== "life"}
                onClick={() => setDeleteCandidateId(selectedNode.id)}
                className="grid h-11 w-11 place-items-center rounded-xl border bg-white text-[#E00046] shadow-sm transition hover:bg-[#FFF2F6] disabled:cursor-not-allowed disabled:text-[#A8B0C2] disabled:opacity-45"
                style={{ borderColor: theme.border }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openAddModal}
                className="career-pink-action flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Add Life Chapter
              </button>
            </div>
          </div>

          <div className="bg-[linear-gradient(135deg,#FFF7FA_0%,#FFFFFF_46%,#FFF2F6_100%)] px-4 py-7 sm:px-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <button type="button" onClick={() => shiftSelection(-1)} disabled={selectedIndex === 0} className="grid h-10 w-10 place-items-center rounded-xl border bg-white text-[#081433] shadow-sm transition hover:bg-[#FFF2F6] disabled:opacity-35" style={{ borderColor: theme.border }}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <p className="text-center text-sm font-semibold text-[#46536D]">
                {selectedNode.title} / {selectedNode.time}
              </p>
              <button type="button" onClick={() => shiftSelection(1)} disabled={selectedIndex === timelineNodes.length - 1} className="grid h-10 w-10 place-items-center rounded-xl border bg-white text-[#081433] shadow-sm transition hover:bg-[#FFF2F6] disabled:opacity-35" style={{ borderColor: theme.border }}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-x-auto px-1 pb-3">
              <div
                className="relative flex min-w-[960px] items-start justify-between px-6 py-5"
                style={{ width: timelineWidth }}
              >
                <div className="absolute left-[calc(1.5rem+95px)] right-[calc(1.5rem+95px)] top-[48px] h-1 rounded-full bg-[#E5E8F0]" />
                <motion.div
                  className="absolute left-[calc(1.5rem+95px)] top-[48px] h-1 rounded-full bg-[linear-gradient(90deg,#081433,#F04D7A)]"
                  animate={{ width: `calc((100% - 3rem - 190px) * ${progressPercent / 100})` }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                />
                <AnimatePresence initial={false}>
                  {timelineNodes.map((node, index) => (
                    <div key={node.id} ref={node.id === selectedNode.id ? selectedNodeRef : null}>
                      <TimelineNodeItem
                        node={node}
                        index={index}
                        selected={node.id === selectedNode.id}
                        active={index <= selectedIndex}
                        onSelect={() => setSelectedId(node.id)}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <AnimatePresence>
            {deleteCandidate?.type === "life" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-3 flex flex-col gap-3 rounded-2xl border bg-[#081433] px-4 py-4 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm font-semibold">Remove this life chapter from your timeline?</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setDeleteCandidateId(null)} className="h-10 rounded-full border border-white/20 px-4 text-sm font-semibold text-white/80 transition hover:bg-white/10">
                    Cancel
                  </button>
                  <button type="button" onClick={() => deleteLifeGoal(deleteCandidate.id)} className="h-10 rounded-full bg-white px-4 text-sm font-semibold text-[#E00046] transition hover:bg-[#FFF2F6]">
                    Remove
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <ChapterPlanCard node={selectedNode} timelineNodes={timelineNodes} onApplyRetirementRecommendations={applyRetirementRecommendations} onAddEmergencySavings={addEmergencySavingsBeforeBreak} />
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <AddLifeGoalModal
            existingTitles={existingTitles}
            editNode={editingNode}
            onClose={() => {
              setIsModalOpen(false);
              setEditingNodeId(null);
            }}
            onAdd={addLifeGoals}
            onSave={saveLifeGoal}
          />
        )}
      </AnimatePresence>
      <style jsx global>{`
        @keyframes softEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes headerGlowDrift {
          from {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.45;
          }
          to {
            transform: translate3d(-16px, 10px, 0) scale(1.08);
            opacity: 0.65;
          }
        }

        @keyframes arrowReveal {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes softPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(223, 47, 88, 0.14);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(223, 47, 88, 0.04);
          }
        }

        @keyframes drawLine {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes drawVerticalLine {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes nodeReveal {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-soft-enter {
          animation: softEnter 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }

        .animate-stagger-item {
          opacity: 0;
          animation: softEnter 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--delay, 0ms);
          will-change: transform, opacity;
        }

        .break-header-glow {
          animation: headerGlowDrift 10s ease-in-out infinite alternate;
        }

        .break-metric-card,
        .shift-card,
        .protection-card {
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }

        .break-metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
        }

        .shift-card:hover,
        .protection-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 35px rgba(15, 23, 42, 0.08);
        }

        .shift-arrow {
          opacity: 0;
          transform: translateX(-4px);
          animation: arrowReveal 260ms ease-out forwards;
          animation-delay: var(--arrow-delay, 120ms);
        }

        .score-ring-progress {
          transition: stroke-dashoffset 1000ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .status-soft-pulse {
          animation: softPulse 2.4s ease-in-out infinite;
        }

        .break-factor-chip {
          transition: transform 180ms ease, filter 180ms ease;
        }

        .break-factor-chip:hover {
          transform: translateY(-1px);
          filter: brightness(1.02);
        }

        .protection-connection-line,
        .return-map-line {
          transform-origin: left;
          animation: drawLine 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .protection-connection-line {
          animation-delay: 180ms;
        }

        .return-map-line-vertical {
          transform-origin: top;
          animation: drawVerticalLine 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .return-map-node {
          opacity: 0;
          transform: scale(0.9);
          animation: nodeReveal 320ms ease-out forwards;
          animation-delay: var(--delay, 0ms);
        }

        @media (prefers-reduced-motion: reduce) {
          .break-safety-plan *,
          .break-safety-plan *::before,
          .break-safety-plan *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }

          .break-safety-plan .animate-stagger-item,
          .break-safety-plan .return-map-node,
          .break-safety-plan .shift-arrow {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}

