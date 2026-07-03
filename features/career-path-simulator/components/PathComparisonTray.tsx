"use client";

import { BarChart3, BriefcaseBusiness, Sparkles } from "lucide-react";
import type { CareerNodeData } from "../types";

export default function PathComparisonTray({
  selectedNode,
  visibleCount,
  totalCount,
}: {
  selectedNode: CareerNodeData;
  visibleCount: number;
  totalCount: number;
}) {
  return (
    <div className="mt-3 rounded-3xl border border-[#E7EAF1] bg-white px-4 py-3 shadow-sm">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] px-4 py-3">
          <Sparkles className="h-4 w-4 text-[#E00046]" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8B95A7]">Selected path</p>
            <p className="text-sm font-semibold text-[#081433]">{selectedNode.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] px-4 py-3">
          <BarChart3 className="h-4 w-4 text-[#E00046]" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8B95A7]">Map scope</p>
            <p className="text-sm font-semibold text-[#081433]">{visibleCount} visible / {totalCount} total nodes</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] px-4 py-3">
          <BriefcaseBusiness className="h-4 w-4 text-[#E00046]" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8B95A7]">Next decision</p>
            <p className="text-sm font-semibold text-[#081433]">Expand, branch, or simulate a scenario</p>
          </div>
        </div>
      </div>
    </div>
  );
}
