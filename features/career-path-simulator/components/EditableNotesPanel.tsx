"use client";

import {
  Clock3,
  Edit3,
  ListChecks,
  Save,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { CareerNodeData } from "../types";

function DetailBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B95A7]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.length ? items.map((item) => (
          <span key={item} className="rounded-full bg-[#FFF2F6] px-2 py-0.5 text-[10px] font-semibold text-[#E00046]">
            {item}
          </span>
        )) : (
          <span className="text-xs text-[#46536D]">No items yet</span>
        )}
      </div>
    </div>
  );
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean))).slice(0, 8);
}

export default function EditableNotesPanel({
  node,
  title,
  notes,
  pathNodes,
  scenarioNotes,
  onTitleChange,
  onNotesChange,
  onSave,
  onClose,
}: {
  node: CareerNodeData;
  title: string;
  notes: string;
  pathNodes: CareerNodeData[];
  scenarioNotes: string[];
  onTitleChange: (title: string) => void;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const previousChoices = pathNodes.slice(0, -1).map((item) => item.title);
  const coveredSkills = unique(pathNodes.flatMap((item) => item.requiredSkills.slice(0, 3)));
  const missingSkills = unique(node.missingSkills);
  const nextActions = node.nextActions.slice(0, 4);
  const pathLabel = pathNodes.map((item) => item.title).join(" -> ");
  const routeTone = node.nodeType === "business"
    ? "client-facing or business-building route"
    : node.nodeType === "industry"
      ? "industry transition route"
      : node.difficulty === "Very High" || node.difficulty === "High"
        ? "technical growth route"
        : "balanced analytics route";
  const pathSummary = `You are exploring a ${routeTone} toward ${title}. This route builds from ${pathNodes[0]?.title ?? "your current profile"} and currently prioritises ${coveredSkills.slice(0, 3).join(", ") || "focused evidence building"}.`;

  return (
    <aside className="flex h-full min-h-0 flex-col rounded-[24px] border border-[#E7EAF1] bg-white/96 text-[13px] shadow-[0_18px_46px_rgba(8,20,51,0.14)] backdrop-blur-xl xl:w-[360px]">
      <div className="flex items-center justify-between border-b border-[#EEF1F6] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF2F6] text-[#E00046]">
            <Edit3 className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-[13px] font-semibold text-[#081433]">Path notes</h2>
            <p className="text-[11px] text-[#46536D]">Editable planner panel</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-xl border bg-white text-[#46536D] transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-4 py-3">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B95A7]">Selected role title</span>
          <input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-[13px] font-semibold text-[#081433] outline-none transition focus:border-[#E00046] focus:ring-2 focus:ring-[#E00046]/10"
            style={{ borderColor: "#E5E8F0" }}
          />
        </label>

        <div className="mt-3 rounded-2xl border border-[#F7CAD8] bg-[#FFF7FA] p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#081433]">
            <Sparkles className="h-4 w-4 text-[#F04D7A]" />
            Active path summary
          </div>
          <p className="mt-2 text-[11px] leading-4 text-[#59657A]">{pathSummary}</p>
          <p className="mt-2 truncate text-[11px] font-semibold text-[#E00046]">{pathLabel}</p>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-xl bg-[#F8FAFC] p-2.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#081433]">
              <Clock3 className="h-4 w-4 text-[#E00046]" />
              Timeline
            </div>
            <p className="mt-1.5 text-[11px] text-[#59657A]">{node.timeline}</p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-2.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#081433]">
              <Target className="h-4 w-4 text-[#E00046]" />
              Difficulty
            </div>
            <p className="mt-1.5 text-[11px] text-[#59657A]">{node.difficulty}{node.riskLevel ? ` · ${node.riskLevel} risk` : ""}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border bg-white p-3" style={{ borderColor: "#E5E8F0" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B95A7]">Current selected role</p>
          <h3 className="mt-2 text-xs font-semibold text-[#081433]">{title}</h3>
          <p className="mt-2 text-[11px] leading-4 text-[#59657A]">{node.suitability}</p>
          <div className="mt-3 grid gap-2 text-[11px] text-[#59657A]">
            <p><span className="font-semibold text-[#081433]">Skill focus:</span> {node.skillFocus ?? node.requiredSkills.slice(0, 3).join(", ")}</p>
            <p><span className="font-semibold text-[#081433]">Work style:</span> {node.workStyle ?? node.summary}</p>
            <p><span className="font-semibold text-[#081433]">Outcome:</span> {node.careerOutcome ?? node.summary}</p>
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          <DetailBlock title="Previous choices made" items={previousChoices.length ? previousChoices : [node.title]} />
          <DetailBlock title="Skills already covered" items={coveredSkills} />
          <DetailBlock title="Missing skills for next step" items={missingSkills} />
          <DetailBlock title="Tools needed" items={node.tools} />
        </div>

        <div className="mt-3 rounded-2xl border bg-white p-3" style={{ borderColor: "#E5E8F0" }}>
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-[#E00046]" />
            <h3 className="text-xs font-semibold text-[#081433]">Recommended next actions</h3>
          </div>
          <div className="mt-3 space-y-2.5">
            {nextActions.map((action, index) => (
              <div key={action} className="flex gap-2 text-[11px] leading-4 text-[#59657A]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFF2F6] text-[10px] font-semibold text-[#E00046]">
                  {index + 1}
                </span>
                {action}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border bg-[#FBFCFE] p-3" style={{ borderColor: "#E5E8F0" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B95A7]">Risks / trade-offs</p>
          <p className="mt-2 text-[11px] leading-4 text-[#59657A]">{node.tradeOff ?? `${node.difficulty} difficulty. Validate the route with portfolio evidence before overcommitting.`}</p>
        </div>

        <div className="mt-3 rounded-2xl border bg-white p-3" style={{ borderColor: "#E5E8F0" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B95A7]">AI scenario notes</p>
          <div className="mt-2 space-y-2">
            {scenarioNotes.length ? scenarioNotes.map((note) => (
              <p key={note} className="text-[11px] leading-4 text-[#59657A]">{note}</p>
            )) : (
              <p className="text-[11px] leading-4 text-[#59657A]">No AI scenario generated yet. Ask CareerOS for a branch to add scenario notes here.</p>
            )}
          </div>
        </div>

        <label className="mt-3 block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B95A7]">Custom notes</span>
          <textarea
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            rows={5}
            className="mt-2 w-full resize-none rounded-xl border bg-white px-3 py-2.5 text-[11px] leading-4 text-[#081433] outline-none transition focus:border-[#E00046] focus:ring-2 focus:ring-[#E00046]/10"
            style={{ borderColor: "#E5E8F0" }}
            placeholder="Write your own plan, risks, questions, or next actions..."
          />
        </label>
      </div>

      <div className="border-t border-[#EEF1F6] px-4 py-2.5">
        <button
          type="button"
          onClick={onSave}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#E00046] text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(224,0,70,0.16)] transition hover:bg-[#D81B3F]"
        >
          <Save className="h-4 w-4" />
          Save notes
        </button>
      </div>
    </aside>
  );
}
