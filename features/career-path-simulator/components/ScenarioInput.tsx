"use client";

import { Sparkles } from "lucide-react";

const examples = [
  "I want to become a lead data scientist",
  "I want to switch into UX design",
  "I want to jump from senior data scientist to culinary arts",
  "I want to start a business",
  "I want a lower-stress career",
  "Show me the fastest route to management",
];

export default function ScenarioInput({
  value,
  onChange,
  onGenerate,
}: {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
}) {
  return (
    <div className="min-w-0 flex-1">
      <label className="relative block">
        <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E00046]" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onGenerate();
          }}
          placeholder="Ask CareerOS to build a scenario..."
          className="h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm font-semibold text-[#081433] outline-none transition placeholder:text-[#8B95A7] focus:border-[#E00046] focus:ring-2 focus:ring-[#E00046]/10"
          style={{ borderColor: "#E5E8F0" }}
        />
      </label>
      <div className="mt-2 hidden gap-2 overflow-hidden lg:flex">
        {examples.slice(0, 3).map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onChange(example)}
            className="truncate rounded-full bg-[#FFF2F6] px-3 py-1 text-xs font-semibold text-[#E00046] transition hover:bg-[#FDE7EE]"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
