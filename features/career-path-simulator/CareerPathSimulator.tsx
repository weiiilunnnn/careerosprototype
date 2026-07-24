"use client";

import { NotebookPen, Printer, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { buildSequentialYears, saveSimulatedCareerPath } from "@/lib/careerPathHandoff";
import {
  baseExpandedNodes,
  generateScenarioBranch,
  getAncestors,
  getChildren,
  initialMapState,
} from "./data";
import type { CareerEdge, CareerMapState, CareerNodeData, NotesByNode, TitleOverrides } from "./types";
import AIPlannerChat from "./components/AIPlannerChat";
import CareerMapCanvas from "./components/CareerMapCanvas";
import EditableNotesPanel from "./components/EditableNotesPanel";
import SimulatorToolbar from "./components/SimulatorToolbar";

function cloneInitialState(): CareerMapState {
  return {
    nodes: { ...initialMapState.nodes },
    edges: [...initialMapState.edges],
  };
}

function collectDescendants(edges: CareerEdge[], startId: string) {
  const result = new Set<string>();
  const queue = [startId];
  while (queue.length) {
    const current = queue.shift();
    if (!current) continue;
    getChildren(edges, current).forEach((child) => {
      if (!result.has(child)) {
        result.add(child);
        queue.push(child);
      }
    });
  }
  return result;
}

function collectSelectedRoute(edges: CareerEdge[], selectedId: string) {
  return ["current", ...Array.from(getAncestors(edges, selectedId)).reverse(), selectedId]
    .filter((id, index, list) => id && list.indexOf(id) === index);
}

function collectSelectedRouteEdges(edges: CareerEdge[], routeIds: string[]) {
  const activeEdges = new Set<string>();
  for (let index = 1; index < routeIds.length; index += 1) {
    const from = routeIds[index - 1];
    const to = routeIds[index];
    const edge = edges.find((item) => item.from === from && item.to === to);
    if (edge) activeEdges.add(edge.id);
  }
  return activeEdges;
}

function scenarioKind(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("lead data scientist")) return "lead-data-scientist";
  if (lower.includes("product management") || lower.includes("product manager")) return "product-management";
  if (lower.includes("safer") || lower.includes("high-growth") || lower.includes("high growth")) return "safe-growth";
  if (lower.includes("pivot into ux") || lower.includes("ux")) return "ux";
  if (lower.includes("consultancy") || lower.includes("own consultancy") || lower.includes("start my own")) return "consultancy";
  if (lower.includes("lower-stress") || lower.includes("lower stress") || lower.includes("less stress")) return "lower-stress";
  if (lower.includes("missing skills")) return "missing-skills";
  return "custom";
}

function createDefaultNotes(node: CareerNodeData) {
  return `Focus note for ${node.title}: ${node.suitability}\n\nNext action: ${node.nextActions[0] ?? "Choose one small experiment and add proof to your portfolio."}`;
}

function printNodeColor(node: CareerNodeData, selected: boolean, active: boolean) {
  if (selected) return { fill: "#FFF7FA", stroke: "#E00046", text: "#081433", badge: "#E00046", badgeFill: "#FFF2F6" };
  if (node.nodeType === "current") return { fill: "#081433", stroke: "#081433", text: "#FFFFFF", badge: "#FFFFFF", badgeFill: "rgba(255,255,255,.16)" };
  if (node.nodeType === "industry" || node.nodeType === "business" || node.nodeType === "custom") return { fill: "#FBF8FF", stroke: active ? "#7C3AED" : "#D8C8FF", text: "#081433", badge: "#7C3AED", badgeFill: "#F1EAFF" };
  if (node.nodeType === "skill") return { fill: "#F1FBF7", stroke: active ? "#059669" : "#BFEBD8", text: "#081433", badge: "#047857", badgeFill: "#DDF8EA" };
  if (node.nodeType === "risk") return { fill: "#FFFBEB", stroke: active ? "#D97706" : "#F5D58B", text: "#081433", badge: "#B45309", badgeFill: "#FEF3C7" };
  return { fill: "#FFFFFF", stroke: active ? "#E00046" : "#DDE3EC", text: "#081433", badge: "#E00046", badgeFill: "#FFF2F6" };
}

function truncatePrintText(text: string, max = 24) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function PrintableCareerPlan({
  selectedTitle,
  selectedNode,
  visibleNodes,
  visibleEdges,
  activeEdgeIds,
  activePathIds,
  notes,
  scenarioNotes,
  visibleCount,
  totalCount,
}: {
  selectedTitle: string;
  selectedNode: CareerNodeData;
  visibleNodes: CareerNodeData[];
  visibleEdges: CareerEdge[];
  activeEdgeIds: Set<string>;
  activePathIds: Set<string>;
  notes: string;
  scenarioNotes: string[];
  visibleCount: number;
  totalCount: number;
}) {
  const nodeWidth = 232;
  const nodeHeight = 116;
  const printNodes = visibleNodes.length ? visibleNodes : [selectedNode];
  const bounds = printNodes.reduce(
    (current, node) => ({
      minX: Math.min(current.minX, node.x),
      minY: Math.min(current.minY, node.y),
      maxX: Math.max(current.maxX, node.x + nodeWidth),
      maxY: Math.max(current.maxY, node.y + nodeHeight),
    }),
    { minX: printNodes[0].x, minY: printNodes[0].y, maxX: printNodes[0].x + nodeWidth, maxY: printNodes[0].y + nodeHeight },
  );
  const padding = 72;
  const viewBox = `${bounds.minX - padding} ${bounds.minY - padding} ${bounds.maxX - bounds.minX + padding * 2} ${bounds.maxY - bounds.minY + padding * 2}`;
  const nodeMap = new Map(printNodes.map((node) => [node.id, node]));

  return (
    <section className="career-print-sheet hidden">
      <header className="career-print-header">
        <div>
          <p className="career-print-kicker">CareerOS Career Path Simulator</p>
          <h1>Career plan export</h1>
          <p>Selected path: {selectedTitle}</p>
        </div>
        <div className="career-print-score">
          <strong>{selectedNode.match ?? 100}%</strong>
          <span>Match</span>
        </div>
      </header>

      <section className="career-print-card career-print-map">
        <div className="career-print-section-title">
          <h2>Selected route map</h2>
          <span>{visibleCount}/{totalCount} visible nodes</span>
        </div>
        <div className="career-print-canvas">
          <svg className="career-print-map-svg" viewBox={viewBox} role="img" aria-label="Visible career path map">
            <defs>
              <pattern id="career-print-grid" width="34" height="34" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1.1" fill="#DDE3EC" opacity=".8" />
              </pattern>
            </defs>
            <rect x={bounds.minX - padding} y={bounds.minY - padding} width={bounds.maxX - bounds.minX + padding * 2} height={bounds.maxY - bounds.minY + padding * 2} fill="url(#career-print-grid)" />
            {visibleEdges.map((edge) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              const startX = from.x + nodeWidth;
              const startY = from.y + 58;
              const endX = to.x;
              const endY = to.y + 58;
              const curve = Math.max(86, (endX - startX) * 0.42);
              const d = `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;
              const active = activeEdgeIds.has(edge.id);
              return (
                <g key={edge.id} opacity={activePathIds.size > 1 && !active ? 0.18 : 1}>
                  <path d={d} fill="none" stroke={active ? edge.generated ? "#7C3AED" : "#E00046" : edge.generated ? "#A78BFA" : "#DDE3EC"} strokeDasharray={edge.generated ? "8 10" : undefined} strokeLinecap="round" strokeWidth={active ? 5 : 2.4} />
                  <circle cx={endX} cy={endY} r={active ? 6 : 4} fill={active ? edge.generated ? "#7C3AED" : "#E00046" : edge.generated ? "#A78BFA" : "#DDE3EC"} />
                </g>
              );
            })}
            {printNodes.map((node) => {
              const selected = node.id === selectedNode.id;
              const active = activePathIds.has(node.id);
              const colors = printNodeColor(node, selected, active);
              return (
                <g key={node.id} opacity={activePathIds.size > 1 && !active ? 0.3 : 1}>
                  <rect x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx="18" fill={colors.fill} stroke={colors.stroke} strokeWidth={selected ? 3 : active ? 2.4 : 1.8} />
                  <rect x={node.x + 14} y={node.y + 14} width="118" height="22" rx="11" fill={colors.badgeFill} />
                  <text x={node.x + 24} y={node.y + 29} fill={colors.badge} fontSize="10" fontWeight="700" letterSpacing="1.1">
                    {truncatePrintText(node.roleType.toUpperCase(), 18)}
                  </text>
                  {node.match ? (
                    <g>
                      <rect x={node.x + 178} y={node.y + 14} width="40" height="22" rx="11" fill={node.nodeType === "current" ? "rgba(255,255,255,.14)" : "#FFF2F6"} />
                      <text x={node.x + 198} y={node.y + 29} textAnchor="middle" fill={node.nodeType === "current" ? "#FFFFFF" : "#E00046"} fontSize="12" fontWeight="700">{node.match}%</text>
                    </g>
                  ) : null}
                  <text x={node.x + 16} y={node.y + 62} fill={colors.text} fontSize="16" fontWeight="700">
                    {truncatePrintText(node.title, 28)}
                  </text>
                  <text x={node.x + 16} y={node.y + 88} fill={node.nodeType === "current" ? "#C9D0DD" : "#59657A"} fontSize="12">
                    {node.timeline}
                  </text>
                  <text x={node.x + 216} y={node.y + 88} textAnchor="end" fill={node.nodeType === "current" ? "#C9D0DD" : "#59657A"} fontSize="12" fontWeight="700">
                    {node.difficulty}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="career-print-visible">
          <h3>Visible map branches</h3>
          <div>
            {visibleNodes.slice(0, 18).map((node) => (
              <span key={node.id}>{node.title}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="career-print-card career-print-notes">
        <div>
          <h2>Path notes and planner</h2>
          <p className="career-print-guidance">{selectedNode.suitability}</p>
          <pre>{notes}</pre>
        </div>
      </section>

      <div className="career-print-grid">
        <section className="career-print-card">
          <h2>Skills and tools</h2>
          <h3>Required skills</h3>
          <ul>
            {selectedNode.requiredSkills.map((skill) => <li key={skill}>{skill}</li>)}
          </ul>
          <h3>Tools needed</h3>
          <ul>
            {selectedNode.tools.map((tool) => <li key={tool}>{tool}</li>)}
          </ul>
        </section>

        <section className="career-print-card">
          <h2>Next actions</h2>
          <ol>
            {selectedNode.nextActions.map((action) => <li key={action}>{action}</li>)}
          </ol>
          <h3>AI scenario notes</h3>
          {scenarioNotes.length ? (
            <ul>
              {scenarioNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          ) : (
            <p>No AI scenario notes generated yet.</p>
          )}
        </section>
      </div>
    </section>
  );
}

export default function CareerPathSimulator() {
  const [mapState, setMapState] = useState<CareerMapState>(() => cloneInitialState());
  const [selectedNodeId, setSelectedNodeId] = useState("current");
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(() => new Set(baseExpandedNodes));
  const [expandAll, setExpandAll] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [zoom, setZoom] = useState(0.74);
  const [pan, setPan] = useState({ x: 108, y: 150 });
  const [scenario, setScenario] = useState("");
  const [notesByNode, setNotesByNode] = useState<NotesByNode>({});
  const [titleOverrides, setTitleOverrides] = useState<TitleOverrides>({});
  const [branchCount, setBranchCount] = useState(0);
  const [showPrintPanel, setShowPrintPanel] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [aiPlannerOpen, setAiPlannerOpen] = useState(false);
  const [scenarioNotes, setScenarioNotes] = useState<string[]>([]);
  const [, setToast] = useState("Simulator ready. Start by selecting a role or generating a scenario.");

  const nodes = useMemo(() => Object.values(mapState.nodes), [mapState.nodes]);
  const selectedNode = mapState.nodes[selectedNodeId] ?? mapState.nodes.current;
  const activeRouteIds = useMemo(() => collectSelectedRoute(mapState.edges, selectedNodeId), [mapState.edges, selectedNodeId]);
  const activeRouteIdSet = useMemo(() => new Set(activeRouteIds), [activeRouteIds]);
  const activeEdgeIds = useMemo(() => collectSelectedRouteEdges(mapState.edges, activeRouteIds), [activeRouteIds, mapState.edges]);
  const activePathNodes = useMemo(() => activeRouteIds.flatMap((id) => mapState.nodes[id] ? [mapState.nodes[id]] : []), [activeRouteIds, mapState.nodes]);

  const visibleIds = useMemo(() => {
    if (expandAll) return new Set(Object.keys(mapState.nodes));
    if (focusMode) return activeRouteIdSet;

    const visible = new Set<string>(activeRouteIds);
    activeRouteIds.forEach((id) => {
      visible.add(id);
      getAncestors(mapState.edges, id).forEach((ancestor) => visible.add(ancestor));
      if (expandedNodeIds.has(id)) {
        getChildren(mapState.edges, id).forEach((child) => visible.add(child));
      }
    });
    return visible;
  }, [activeRouteIdSet, activeRouteIds, expandAll, expandedNodeIds, focusMode, mapState.edges, mapState.nodes]);
  const visiblePrintNodes = useMemo(
    () => nodes.filter((node) => visibleIds.has(node.id)).sort((a, b) => a.x - b.x || a.y - b.y),
    [nodes, visibleIds],
  );
  const visiblePrintEdges = useMemo(
    () => mapState.edges.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to)),
    [mapState.edges, visibleIds],
  );
  const selectedNotes = notesByNode[selectedNode.id] ?? createDefaultNotes(selectedNode);

  function titleForNode(node: CareerNodeData) {
    return titleOverrides[node.id] ?? node.title;
  }

  // Whenever the candidate settles on a route beyond the starting point, hand
  // it off to the Life Chapter Designer so its career milestones stay in sync
  // with whatever was simulated here.
  useEffect(() => {
    if (selectedNodeId === "current" || activePathNodes.length < 2) return;
    const years = buildSequentialYears(activePathNodes.map((node) => node.timeline));
    saveSimulatedCareerPath(
      activePathNodes.map((node, index) => ({
        id: node.id,
        title: titleOverrides[node.id] ?? node.title,
        subtitle: node.roleType,
        targetYear: years[index],
      })),
    );
  }, [activePathNodes, selectedNodeId, titleOverrides]);

  function selectNode(nodeId: string) {
    if (nodeId === selectedNodeId) {
      setSelectedNodeId("current");
      setExpandedNodeIds(new Set(baseExpandedNodes));
      setToast(expandAll ? "Path selection cleared. All branches remain visible." : "Path selection cleared. Choose another node to inspect a route.");
      return;
    }
    setSelectedNodeId(nodeId);
    setExpandedNodeIds(new Set([...collectSelectedRoute(mapState.edges, nodeId), nodeId]));
  }

  function toggleNode(nodeId: string) {
    setSelectedNodeId(nodeId);
    setExpandedNodeIds((current) => {
      const route = collectSelectedRoute(mapState.edges, nodeId);
      const next = new Set(route);
      if (current.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
    setExpandAll(false);
    setFocusMode(false);
  }

  function appendScenarioBranch(input: ReturnType<typeof generateScenarioBranch>) {
    setMapState((current) => {
      const nextNodes = { ...current.nodes };
      input.nodes.forEach((node) => {
        nextNodes[node.id] = node;
      });
      return {
        nodes: nextNodes,
        edges: [...current.edges, ...input.edges],
      };
    });
    setExpandedNodeIds((current) => new Set([...current, input.startNodeId, ...input.nodes.map((node) => node.id)]));
    setSelectedNodeId(input.nodes[input.nodes.length - 1]?.id ?? input.startNodeId);
    setFocusMode(false);
    setExpandAll(false);
    setToast(input.note);
    setScenarioNotes((current) => [input.note, ...current].slice(0, 4));
  }

  function focusExistingScenario(routeIds: string[], reply: string) {
    const finalNodeId = routeIds[routeIds.length - 1] ?? "current";
    setSelectedNodeId(finalNodeId);
    setExpandedNodeIds(new Set(routeIds));
    setFocusMode(false);
    setExpandAll(false);
    setToast(reply);
    setScenarioNotes((current) => [reply, ...current].slice(0, 4));
  }

  function generatePath() {
    const text = scenario.trim() || "Show me the fastest route to management";
    const kind = scenarioKind(text);

    if (kind === "missing-skills") {
      const reply = `${selectedNode.title} is missing: ${selectedNode.missingSkills.join(", ") || "no major gaps listed"}. Your next useful action is: ${selectedNode.nextActions[0] ?? "build one proof-of-work project"}.`;
      setToast("Missing skills added to the assistant reply.");
      setScenarioNotes((current) => [reply, ...current].slice(0, 4));
      setScenario("");
      setAiPlannerOpen(true);
      return;
    }

    if (kind === "lead-data-scientist") {
      focusExistingScenario(
        ["current", "mlIntern", "juniorDataScientist", "dataScientist", "seniorDataScientist", "leadDataScientist"],
        "CareerOS focused the Lead Data Scientist route: Machine Learning Intern -> Junior Data Scientist -> Data Scientist -> Senior Data Scientist -> Lead Data Scientist.",
      );
      setScenario("");
      setAiPlannerOpen(true);
      return;
    }

    if (kind === "safe-growth") {
      focusExistingScenario(
        ["current", "biAnalyst", "seniorBiAnalyst", "analyticsManager", "headOfData"],
        "CareerOS focused a safer high-growth route: BI Analyst -> Senior BI Analyst -> Analytics Manager -> Head of Data.",
      );
      setScenario("");
      setAiPlannerOpen(true);
      return;
    }

    const lower = text.toLowerCase();
    const anchorNode = kind === "product-management"
      ? mapState.nodes.growthAnalyst
      : kind === "consultancy"
        ? mapState.nodes.dataAnalyst
        : kind === "ux" || kind === "lower-stress"
          ? mapState.nodes.current
          : lower.includes("senior data scientist")
            ? mapState.nodes.seniorDataScientist
            : selectedNode;
    const branch = generateScenarioBranch(text, anchorNode ?? selectedNode, branchCount);
    setBranchCount((count) => count + 1);
    appendScenarioBranch(branch);
    setScenario("");
    setAiPlannerOpen(true);
  }

  function deleteNode(nodeId: string) {
    const descendants = collectDescendants(mapState.edges, nodeId);
    descendants.add(nodeId);
    setMapState((current) => {
      const nextNodes = { ...current.nodes };
      descendants.forEach((id) => {
        if (nextNodes[id]?.isCustom) delete nextNodes[id];
      });
      const removedIds = new Set(Object.keys(current.nodes).filter((id) => !nextNodes[id]));
      return {
        nodes: nextNodes,
        edges: current.edges.filter((edge) => !removedIds.has(edge.from) && !removedIds.has(edge.to)),
      };
    });
    setSelectedNodeId("current");
    setToast("Custom branch removed.");
  }

  function collapseBranches() {
    setExpandedNodeIds(new Set(baseExpandedNodes));
    setExpandAll(false);
    setFocusMode(false);
    setSelectedNodeId("current");
    setToast("Branches collapsed back to the first decision layer.");
  }

  function focusPath() {
    setFocusMode((value) => !value);
    setExpandAll(false);
    setToast(focusMode ? "Focus path off. Sibling branches are visible again." : "Focus path on. Showing the active route only.");
  }

  function backToBasePath() {
    setSelectedNodeId("current");
    setExpandedNodeIds(new Set(baseExpandedNodes));
    setFocusMode(false);
    setExpandAll(false);
    setZoom(0.74);
    setPan({ x: 108, y: 150 });
  }

  function savePlan() {
    setShowPrintPanel(true);
    setToast("Print/export panel opened. Use it to print the current map and path notes.");
  }

  function printPlan() {
    setShowPrintPanel(false);
    setToast("Printing the selected route map and path notes.");
    window.setTimeout(() => window.print(), 80);
  }

  function handleAssistantAction(action: "risk" | "skills" | "action") {
    if (action === "risk") {
      const reply = `${selectedNode.title} carries ${selectedNode.riskLevel ?? selectedNode.difficulty} risk. Trade-off: ${selectedNode.tradeOff ?? "validate the route with portfolio evidence before committing heavily."}`;
      setToast("Risk comparison updated in the AI planner.");
      setScenarioNotes((current) => [reply, ...current].slice(0, 4));
      return;
    }
    if (action === "skills") {
      const reply = `${selectedNode.title} missing skills: ${selectedNode.missingSkills.join(", ") || "no major gaps listed"}. Covered so far: ${activePathNodes.flatMap((node) => node.requiredSkills.slice(0, 2)).slice(0, 6).join(", ")}.`;
      setToast("Missing skills summary updated.");
      setScenarioNotes((current) => [reply, ...current].slice(0, 4));
      return;
    }
    const reply = `First action for ${selectedNode.title}: ${selectedNode.nextActions[0] ?? "run one small validation experiment and record the evidence in your portfolio."}`;
    setToast("First action generated.");
    setScenarioNotes((current) => [reply, ...current].slice(0, 4));
  }

  return (
    <main className="flex h-[calc(100dvh-80px)] min-h-[720px] flex-col overflow-hidden bg-[#F6F7FA] text-[#152238]">
      <PrintableCareerPlan
        selectedTitle={titleForNode(selectedNode)}
        selectedNode={selectedNode}
        visibleNodes={visiblePrintNodes}
        visibleEdges={visiblePrintEdges}
        activeEdgeIds={activeEdgeIds}
        activePathIds={activeRouteIdSet}
        notes={selectedNotes}
        scenarioNotes={scenarioNotes}
        visibleCount={visibleIds.size}
        totalCount={nodes.length}
      />

      <SimulatorToolbar
        onExpandAll={() => {
          setExpandAll(true);
          setFocusMode(false);
          setToast("All paths expanded. Use Focus Path or Collapse Branches to reduce the map.");
        }}
        onSave={savePlan}
      />

      <div className="relative flex min-h-0 flex-1 bg-[#F6F7FA] p-2.5 md:p-3">
        <CareerMapCanvas
          nodes={nodes}
          edges={mapState.edges}
          visibleIds={visibleIds}
          selectedId={selectedNodeId}
          expandedIds={expandedNodeIds}
          titleForNode={titleForNode}
          zoom={zoom}
          pan={pan}
          expandAll={expandAll}
          focusMode={focusMode}
          onZoomChange={setZoom}
          onPanChange={setPan}
          onSelectNode={selectNode}
          onToggleNode={toggleNode}
          onDeleteNode={deleteNode}
          onExpandAll={() => {
            setExpandAll(true);
            setFocusMode(false);
            setToast("All branches are visible. Click any node to highlight its route.");
          }}
          onCollapseBranches={collapseBranches}
          onFocusPath={focusPath}
          onBasePath={backToBasePath}
          selectedNode={selectedNode}
          activePathIds={activeRouteIdSet}
          activeEdgeIds={activeEdgeIds}
          miniMapBottomOffset={aiPlannerOpen ? 210 : 36}
        />

        {notesOpen ? (
          <div
            className="absolute bottom-4 right-4 top-4 z-30 hidden w-[360px] lg:block"
          >
              <EditableNotesPanel
                node={selectedNode}
                title={titleForNode(selectedNode)}
                notes={selectedNotes}
                pathNodes={activePathNodes}
                scenarioNotes={scenarioNotes}
              onTitleChange={(title) => setTitleOverrides((current) => ({ ...current, [selectedNode.id]: title }))}
              onNotesChange={(notes) => setNotesByNode((current) => ({ ...current, [selectedNode.id]: notes }))}
              onSave={savePlan}
              onClose={() => setNotesOpen(false)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setNotesOpen(true)}
            className="absolute right-4 top-4 z-30 hidden max-w-[260px] items-center gap-3 rounded-2xl border border-[#E1E6EF] bg-white/95 px-4 py-3 text-left shadow-[0_14px_34px_rgba(8,20,51,0.12)] backdrop-blur-xl transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] lg:inline-flex"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFF2F6] text-[#E00046]">
              <NotebookPen className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#8B95A7]">Path Notes</span>
              <span className="block truncate text-sm font-semibold text-[#081433]">{titleForNode(selectedNode)}</span>
            </span>
          </button>
        )}

        {notesOpen ? (
          <div className="fixed inset-x-3 bottom-3 z-40 max-h-[78vh] overflow-hidden rounded-[24px] bg-white shadow-[0_-24px_70px_rgba(8,20,51,0.24)] lg:hidden">
            <EditableNotesPanel
              node={selectedNode}
              title={titleForNode(selectedNode)}
              notes={selectedNotes}
              pathNodes={activePathNodes}
              scenarioNotes={scenarioNotes}
              onTitleChange={(title) => setTitleOverrides((current) => ({ ...current, [selectedNode.id]: title }))}
              onNotesChange={(notes) => setNotesByNode((current) => ({ ...current, [selectedNode.id]: notes }))}
              onSave={savePlan}
              onClose={() => setNotesOpen(false)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setNotesOpen(true)}
            className="fixed right-4 top-24 z-30 rounded-2xl border border-[#E1E6EF] bg-white/95 px-4 py-3 text-sm font-semibold text-[#081433] shadow-[0_14px_34px_rgba(8,20,51,0.12)] backdrop-blur-xl transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046] lg:hidden"
          >
            Path Notes
          </button>
        )}

        <div className={`pointer-events-none absolute bottom-6 left-3 z-30 flex justify-center md:bottom-7 ${notesOpen ? "right-3 lg:right-[390px]" : "right-3"}`}>
          <div className="pointer-events-auto flex w-full justify-center">
            <AIPlannerChat
              scenario={scenario}
              onScenarioChange={setScenario}
              onGenerate={generatePath}
              expanded={aiPlannerOpen}
              onExpandedChange={setAiPlannerOpen}
              onAssistantAction={handleAssistantAction}
            />
          </div>
        </div>
      </div>

      {showPrintPanel ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#081433]/30 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-[#E1E6EF] bg-white p-5 shadow-[0_28px_80px_rgba(8,20,51,0.24)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF2F6] text-[#E00046]">
                  <Printer className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#081433]">Print / export career plan</h2>
                  <p className="mt-1 text-sm leading-5 text-[#59657A]">
                    Save Plan now prepares the current map view and path notes for printing. In a backend version, this would also persist the plan to the user roadmap.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintPanel(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E5E8F0] bg-white text-[#46536D] transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046]"
                aria-label="Close print panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 rounded-2xl bg-[#F8FAFC] p-3 text-sm leading-5 text-[#59657A]">
              <p><span className="font-semibold text-[#081433]">Included:</span> selected route, visible map branches, path notes, AI scenario notes, and next actions.</p>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={printPlan}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#E00046] px-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(224,0,70,0.18)] transition hover:bg-[#D81B3F]"
              >
                <Printer className="h-4 w-4" />
                Print map and notes
              </button>
              <button
                type="button"
                onClick={() => setShowPrintPanel(false)}
                className="h-11 rounded-xl border border-[#E5E8F0] bg-white px-4 text-sm font-semibold text-[#46536D] transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 12mm;
          }

          body * {
            visibility: hidden !important;
          }

          .career-print-sheet,
          .career-print-sheet * {
            visibility: visible !important;
          }

          .career-print-sheet {
            display: block !important;
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            background: white !important;
            color: #081433 !important;
            font-family: Arial, Helvetica, sans-serif !important;
            padding: 0 !important;
          }

          .career-print-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 24px;
            border-bottom: 2px solid #E5E8F0;
            padding-bottom: 14px;
            margin-bottom: 16px;
          }

          .career-print-kicker {
            margin: 0 0 6px;
            color: #E00046;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: .14em;
            text-transform: uppercase;
          }

          .career-print-header h1 {
            margin: 0;
            font-size: 26px;
            line-height: 1.15;
          }

          .career-print-header p {
            margin: 6px 0 0;
            color: #46536D;
            font-size: 12px;
          }

          .career-print-score {
            min-width: 88px;
            border: 2px solid #F5CBD6;
            border-radius: 18px;
            padding: 12px;
            text-align: center;
          }

          .career-print-score strong {
            display: block;
            color: #E00046;
            font-size: 24px;
          }

          .career-print-score span {
            color: #46536D;
            font-size: 11px;
            font-weight: 700;
          }

          .career-print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 14px;
            break-inside: avoid;
          }

          .career-print-card {
            border: 1px solid #E5E8F0;
            border-radius: 18px;
            padding: 14px;
            break-inside: avoid;
          }

          .career-print-map {
            margin-bottom: 14px;
          }

          .career-print-notes {
            margin-bottom: 14px;
          }

          .career-print-card h2,
          .career-print-section-title h2 {
            margin: 0;
            font-size: 15px;
          }

          .career-print-card h3 {
            margin: 12px 0 6px;
            color: #46536D;
            font-size: 11px;
            letter-spacing: .08em;
            text-transform: uppercase;
          }

          .career-print-section-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 12px;
          }

          .career-print-section-title span {
            color: #46536D;
            font-size: 11px;
            font-weight: 700;
          }

          .career-print-canvas {
            border: 1px solid #EEF1F6;
            border-radius: 16px;
            background: #FBFCFE;
            overflow: hidden;
          }

          .career-print-map-svg {
            display: block;
            width: 100%;
            height: 330px;
          }

          .career-print-route {
            display: flex;
            flex-wrap: nowrap;
            align-items: stretch;
            gap: 0;
            overflow: hidden;
          }

          .career-print-route-item {
            display: flex;
            min-width: 0;
            align-items: center;
            flex: 1 1 0;
          }

          .career-print-route-item:last-child {
            flex: 0 0 154px;
          }

          .career-print-node {
            width: 154px;
            min-height: 76px;
            border: 1px solid #E5E8F0;
            border-radius: 14px;
            padding: 10px;
            background: #FBFCFE;
            box-shadow: 0 6px 16px rgba(8,20,51,.05);
          }

          .career-print-node.is-selected {
            border-color: #E00046;
            background: #FFF7FA;
          }

          .career-print-node span {
            display: block;
            color: #8B95A7;
            font-size: 8px;
            font-weight: 700;
            letter-spacing: .1em;
            text-transform: uppercase;
          }

          .career-print-node strong {
            display: block;
            margin-top: 6px;
            font-size: 12px;
            line-height: 1.25;
          }

          .career-print-node small {
            display: block;
            margin-top: 7px;
            color: #46536D;
            font-size: 9px;
          }

          .career-print-line {
            height: 2px;
            min-width: 20px;
            flex: 1 1 auto;
            background: #E00046;
            opacity: .78;
          }

          .career-print-visible {
            margin-top: 14px;
            border-top: 1px solid #EEF1F6;
            padding-top: 10px;
          }

          .career-print-visible h3 {
            margin: 0 0 8px;
            color: #46536D;
            font-size: 10px;
            letter-spacing: .1em;
            text-transform: uppercase;
          }

          .career-print-visible div {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .career-print-visible span {
            border-radius: 999px;
            background: #FFF2F6;
            color: #E00046;
            font-size: 9px;
            font-weight: 700;
            padding: 4px 7px;
          }

          .career-print-guidance,
          .career-print-card p,
          .career-print-card li {
            color: #46536D;
            font-size: 11px;
            line-height: 1.55;
          }

          .career-print-card pre {
            margin: 10px 0 0;
            white-space: pre-wrap;
            color: #081433;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            line-height: 1.5;
          }

          .career-print-card ul,
          .career-print-card ol {
            margin: 6px 0 0;
            padding-left: 18px;
          }
        }
      `}</style>

    </main>
  );
}
