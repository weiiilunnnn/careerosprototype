"use client";

import { Shuffle, X } from "lucide-react";
import { useState } from "react";
import type { CareerNodeData } from "../types";

const targets = ["Culinary Arts", "UX Design", "Education", "Healthcare Analytics", "Climate Tech", "Creative Studio"];

export default function JumpIndustryModal({
  startNode,
  onClose,
  onJump,
}: {
  startNode: CareerNodeData;
  onClose: () => void;
  onJump: (target: string, reason: string) => void;
}) {
  const [target, setTarget] = useState("Culinary Arts");
  const [reason, setReason] = useState("I want to test a major career pivot while preserving my analytical strengths.");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#081433]/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(8,20,51,0.28)]">
        <div className="flex items-center justify-between border-b border-[#EEF1F6] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Shuffle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-[#081433]">Jump Industry</h2>
              <p className="mt-1 text-sm text-[#46536D]">Major pivot from {startNode.title}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border bg-white text-[#46536D] transition hover:bg-[#FFF7FA] hover:text-[#E00046]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <label className="block">
            <span className="text-sm font-semibold text-[#081433]">Jump target</span>
            <select value={target} onChange={(event) => setTarget(event.target.value)} className="mt-2 h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:border-[#E00046]" style={{ borderColor: "#E5E8F0" }}>
              {targets.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[#081433]">Why this pivot?</span>
            <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={5} className="mt-2 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#E00046]" style={{ borderColor: "#E5E8F0" }} />
          </label>
          <div className="rounded-xl bg-[#FFF2F6] p-4 text-sm leading-6 text-[#46536D]">
            CareerOS will create a separate branch showing transferable skills,
            missing skills, entry steps, risk level, and a realistic transition path.
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#EEF1F6] px-6 py-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="h-11 rounded-xl border bg-white px-5 text-sm font-semibold text-[#46536D] transition hover:bg-[#F8FAFC]">
            Cancel
          </button>
          <button type="button" onClick={() => onJump(target, reason)} className="h-11 rounded-xl bg-[#E00046] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(224,0,70,0.18)] transition hover:bg-[#D81B3F]">
            Create Industry Jump
          </button>
        </div>
      </div>
    </div>
  );
}
