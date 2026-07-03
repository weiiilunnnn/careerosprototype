export type NodeType =
  | "current"
  | "recommended"
  | "selected"
  | "future"
  | "skill"
  | "industry"
  | "business"
  | "risk"
  | "custom";

export type Difficulty = "Low" | "Medium" | "High" | "Very High";
export type RiskLevel = "Low" | "Medium" | "High";

export type CareerNodeData = {
  id: string;
  title: string;
  roleType: string;
  nodeType: NodeType;
  x: number;
  y: number;
  timeline: string;
  difficulty: Difficulty;
  match?: number;
  summary: string;
  suitability: string;
  requiredSkills: string[];
  tools: string[];
  certifications: string[];
  portfolioEvidence: string[];
  transferableSkills: string[];
  missingSkills: string[];
  nextActions: string[];
  criteria?: string;
  skillFocus?: string;
  workStyle?: string;
  careerOutcome?: string;
  tradeOff?: string;
  riskLevel?: RiskLevel;
  isCustom?: boolean;
};

export type CareerEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
  generated?: boolean;
};

export type CareerMapState = {
  nodes: Record<string, CareerNodeData>;
  edges: CareerEdge[];
};

export type NotesByNode = Record<string, string>;
export type TitleOverrides = Record<string, string>;

export type GeneratedScenario = {
  title: string;
  startNodeId: string;
  nodes: CareerNodeData[];
  edges: CareerEdge[];
  note: string;
};
