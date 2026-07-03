"use client";

import { ArrowUp, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

const quickPrompts = [
  "I want to become a lead data scientist.",
  "What if I switch to product management?",
  "Show me a safer but still high-growth path.",
  "Can I pivot into UX?",
  "What if I want to start my own consultancy?",
  "I want a lower-stress path.",
  "Show me missing skills.",
];

export default function AIPlannerChat({
  scenario,
  onScenarioChange,
  onGenerate,
  expanded,
  onExpandedChange,
  onAssistantAction,
}: {
  scenario: string;
  onScenarioChange: (value: string) => void;
  onGenerate: () => void;
  expanded: boolean;
  onExpandedChange: (value: boolean) => void;
  onAssistantAction: (action: "risk" | "skills" | "action") => void;
}) {
  if (!expanded) {
    return (
      <div className="w-full max-w-5xl rounded-2xl border border-[#E1E6EF] bg-white/95 p-2 shadow-[0_18px_46px_rgba(8,20,51,0.14)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF2F6] text-[#E00046]">
            <Sparkles className="h-4 w-4" />
          </span>
          <input
            value={scenario}
            onChange={(event) => onScenarioChange(event.target.value)}
            onFocus={() => onExpandedChange(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onGenerate();
            }}
            placeholder="Ask CareerOS to build a scenario..."
            className="h-10 min-w-0 flex-1 bg-transparent px-2 text-sm font-medium text-[#081433] outline-none placeholder:text-[#8B95A7]"
          />
          <button
            type="button"
            onClick={onGenerate}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#E00046] text-white shadow-[0_10px_22px_rgba(224,0,70,0.18)] transition hover:bg-[#D81B3F]"
            aria-label="Generate scenario"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onExpandedChange(true)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E5E8F0] bg-white text-[#46536D] transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046]"
            aria-label="Open AI planner"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-[980px] rounded-[22px] border border-[#E1E6EF] bg-white/96 p-3 shadow-[0_22px_60px_rgba(8,20,51,0.16)] backdrop-blur-xl">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFF2F6] text-[#E00046]">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[#081433]">CareerOS AI planner</h2>
            <p className="text-xs text-[#59657A]">Ask for a branch, compare trade-offs, or generate a scenario.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-[#59657A] md:inline-flex">
            Mock assistant prototype
          </span>
          <button
            type="button"
            onClick={() => onExpandedChange(false)}
            className="grid h-8 w-8 place-items-center rounded-xl border border-[#E5E8F0] bg-white text-[#46536D] transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046]"
            aria-label="Minimise AI planner"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="hidden max-w-full gap-2 overflow-x-auto pb-1 md:flex">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              onScenarioChange(prompt);
              onExpandedChange(true);
            }}
            className="shrink-0 rounded-full border border-[#E7EAF1] bg-white px-3 py-1.5 text-xs font-semibold text-[#46536D] transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046]"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-2.5 flex min-w-0 gap-2 rounded-2xl border border-[#E7EAF1] bg-[#FBFCFE] p-1.5">
        <input
          value={scenario}
          onChange={(event) => onScenarioChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onGenerate();
          }}
          placeholder="Ask CareerOS to build a scenario..."
          className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-[#081433] outline-none placeholder:text-[#9AA3B8]"
        />
        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#E00046] px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(224,0,70,0.18)] transition hover:bg-[#D81B3F]"
        >
          Generate
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {[
          { label: "Compare risk", action: "risk" as const },
          { label: "Show missing skills", action: "skills" as const },
          { label: "Generate first action", action: "action" as const },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onAssistantAction(item.action)}
            className="rounded-full border border-[#E7EAF1] bg-white px-3 py-1.5 text-xs font-semibold text-[#46536D] shadow-sm transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] hover:text-[#E00046]"
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
