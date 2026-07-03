"use client";

import { Trash2 } from "lucide-react";
import type { CareerNodeData, NodeType } from "../types";

const nodeStyles: Record<NodeType, string> = {
  current: "border-[#081433] bg-[#081433] text-white shadow-[0_18px_40px_rgba(8,20,51,0.22)]",
  recommended: "border-[#CBD2DF] bg-white text-[#081433]",
  selected: "border-[#E00046] bg-white text-[#081433] shadow-[0_0_0_4px_rgba(224,0,70,0.10),0_18px_40px_rgba(224,0,70,0.16)]",
  future: "border-[#E0E5EE] bg-white text-[#081433]",
  skill: "border-emerald-200 bg-[#F1FBF7] text-[#081433]",
  industry: "border-violet-200 bg-[#FBF8FF] text-[#081433]",
  business: "border-violet-200 bg-white text-[#081433]",
  risk: "border-amber-200 bg-[#FFFBEB] text-[#081433]",
  custom: "border-violet-200 bg-white text-[#081433]",
};

const badgeStyles: Record<NodeType, string> = {
  current: "bg-white/15 text-white",
  recommended: "bg-[#FFF2F6] text-[#E00046]",
  selected: "bg-[#FFF2F6] text-[#E00046]",
  future: "bg-[#F4F6FA] text-[#46536D]",
  skill: "bg-emerald-100 text-emerald-700",
  industry: "bg-violet-100 text-violet-700",
  business: "bg-violet-100 text-violet-700",
  risk: "bg-amber-100 text-amber-700",
  custom: "bg-violet-100 text-violet-700",
};

export default function CareerNode({
  node,
  selected,
  active,
  faded,
  expanded,
  title,
  onSelect,
  onToggle,
  onDelete,
}: {
  node: CareerNodeData;
  selected: boolean;
  active: boolean;
  faded: boolean;
  expanded: boolean;
  title: string;
  onSelect: () => void;
  onToggle: () => void;
  onDelete?: () => void;
}) {
  const visualType = selected ? "selected" : node.nodeType;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={`group absolute min-h-[116px] w-[232px] rounded-[18px] border p-3.5 text-left shadow-[0_8px_22px_rgba(8,20,51,0.06)] outline-none transition duration-200 hover:-translate-y-0.5 hover:opacity-100 hover:shadow-[0_16px_34px_rgba(21,34,56,0.10)] focus-visible:ring-4 focus-visible:ring-[#E00046]/12 ${
        active && !selected ? "ring-2 ring-[#E00046]/18" : ""
      } ${faded ? "opacity-38 grayscale-[0.15]" : "opacity-100"} ${nodeStyles[visualType]}`}
      style={{ left: node.x, top: node.y }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`max-w-[150px] truncate rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${badgeStyles[visualType]}`}>
          {node.roleType}
        </span>
        {node.match ? (
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${visualType === "current" ? "bg-white/12 text-white/84" : "bg-[#FFF2F6] text-[#E00046]"}`}>
            {node.match}%
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug">
        {title}
      </h3>

      <div className={`mt-2.5 grid grid-cols-[1fr_auto] gap-2 text-[11px] ${visualType === "current" ? "text-white/68" : "text-[#59657A]"}`}>
        <span className="truncate">{node.timeline}</span>
        <span className="font-semibold">{node.difficulty}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.stopPropagation();
              onToggle();
            }
          }}
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
            visualType === "current"
              ? "bg-white/15 text-white hover:bg-white/20"
              : "bg-[#FFF2F6] text-[#E00046] hover:bg-[#FFE5EE]"
          }`}
        >
          {expanded ? "Collapse" : "Expand"}
        </span>
        {node.isCustom && onDelete ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.stopPropagation();
                onDelete();
              }
            }}
            className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </span>
        ) : null}
      </div>
    </div>
  );
}
