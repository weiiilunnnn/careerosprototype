"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  GitBranch,
  Maximize2,
  Save,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function SimulatorToolbar({
  onExpandAll,
  onSave,
}: {
  onExpandAll: () => void;
  onSave: () => void;
}) {
  return (
    <header className="border-b border-[#E7EAF1] bg-white/96 px-4 py-3.5 backdrop-blur-xl sm:px-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-[280px]">
          <div className="flex items-center gap-3">
            <Link href="/?view=career-landscape" className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E5E8F0] bg-white text-[#081433] transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046]" aria-label="Back to Career Landscape">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF2F6] text-[#E00046]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-[1.2rem] font-semibold leading-tight text-[#081433]">Career Path Simulator</h1>
              <p className="mt-0.5 text-xs text-[#59657A]">Explore and edit possible career futures</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          <button type="button" onClick={onExpandAll} className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#E5E8F0] bg-white px-3.5 text-sm font-semibold text-[#081433] transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046]">
            <Maximize2 className="h-4 w-4" />
            Expand All
          </button>
          <button type="button" onClick={onSave} className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#E5E8F0] bg-white px-3.5 text-sm font-semibold text-[#081433] transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046]">
            <Save className="h-4 w-4" />
            Save Plan
          </button>
          <Link href="/?view=life-chapter-designer" className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#081433] px-3.5 text-sm font-semibold text-white transition hover:bg-[#152238]">
            <CalendarRange className="h-4 w-4" />
            Life Chapter Designer
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <span className="hidden h-9 items-center gap-2 rounded-xl bg-[#F8FAFC] px-3 text-xs font-semibold text-[#59657A] 2xl:inline-flex">
            <GitBranch className="h-4 w-4 text-[#E00046]" />
            Decision map
          </span>
        </div>
      </div>
    </header>
  );
}
