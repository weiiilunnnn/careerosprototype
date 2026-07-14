"use client";

import { ArrowUpRight, BotMessageSquare, Send, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

const hiddenViews = [
  null,
  "login",
  "signup",
  "forgot-password",
  "onboarding",
  "ai-career-coach",
];

const unreadCoachConversations = 3;

export default function CareerCoachShortcut() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const isTalentReadinessPeopleView =
    pathname === "/university/talent" && (view === "students" || view === "alumni");

  if (
    pathname.startsWith("/employer") ||
    hiddenViews.includes(view) ||
    isTalentReadinessPeopleView
  ) {
    return null;
  }

  function openFullCoach(prompt?: string) {
    const trimmed = prompt?.trim();
    const url = trimmed
      ? `/?view=ai-career-coach&coachSource=shortcut&prompt=${encodeURIComponent(trimmed)}`
      : "/?view=ai-career-coach&coachSource=shortcut&conversation=ongoing-growth-check";

    router.push(url);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    openFullCoach(draft);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      {isOpen && (
        <div className="mb-4 w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-[#E5E8F0] bg-white shadow-[0_22px_70px_rgba(8,20,51,0.18)]">
          <div className="flex items-center justify-between border-b border-[#E5E8F0] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF2F6] text-[#E00046]">
                <BotMessageSquare className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-black text-[#081433]">
                  AI Career Coach
                </h2>
                <p className="text-xs font-semibold text-[#46536D]">
                  Start a new conversation
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#46536D] transition hover:bg-[#F7F8FB]"
              aria-label="Close coach shortcut"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (draft.trim()) openFullCoach(draft);
                }
              }}
              rows={4}
              placeholder="Ask about your portfolio, job fit, skills, applications, work traits, or life plans..."
              className="min-h-[108px] w-full resize-none rounded-xl border border-[#E5E8F0] bg-[#FAFBFC] px-4 py-3 text-sm leading-6 text-[#081433] outline-none transition placeholder:text-[#8A94A6] focus:border-[#F04D7A] focus:bg-white"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => openFullCoach()}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E8F0] px-3 text-sm font-bold text-[#46536D] transition hover:border-[#F04D7A] hover:text-[#E00046]"
              >
                Expand
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <button
                type="submit"
                disabled={!draft.trim()}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#081433] px-4 text-sm font-bold text-white transition hover:bg-[#152238] disabled:bg-[#C9CED8]"
              >
                Start
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Open AI Career Coach shortcut"
        className="relative ml-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f0184f] text-white shadow-[0_16px_40px_rgba(240,24,79,0.32)] transition hover:-translate-y-0.5 hover:bg-[#d80d40] focus:outline-none focus:ring-4 focus:ring-[#f0184f]/20"
      >
        <BotMessageSquare className="h-6 w-6" />
        {unreadCoachConversations > 0 && (
          <span className="absolute -right-1 -top-1 flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-[#081433] px-2 text-xs font-black text-white">
            {unreadCoachConversations}
          </span>
        )}
      </button>
    </div>
  );
}
