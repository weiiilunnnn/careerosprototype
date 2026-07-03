"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  BellRing,
  BotMessageSquare,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  FileText,
  GraduationCap,
  Lightbulb,
  PanelRightOpen,
  Plus,
  Send,
  Sparkles,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { candidateLivingCv } from "@/lib/candidateLivingCvData";
import { getWorkAnimal } from "@/lib/workAnimals";

type Sender = "coach" | "user";
type Message = {
  id: string;
  sender: Sender;
  text: string;
  meta?: string;
};

type Conversation = {
  id: string;
  title: string;
  source: "Coach initiated" | "User initiated";
  trigger: string;
  updatedAt: string;
  unreadCount: number;
  messages: Message[];
};

type CoachSignal = {
  icon: LucideIcon;
  title: string;
  source: string;
  detail: string;
  status: string;
};

const profile = candidateLivingCv;
const primaryTrait = getWorkAnimal(profile.workAnimal);
const secondaryTrait = getWorkAnimal(profile.secondaryWorkAnimal);

const initialConversations: Conversation[] = [
  {
    id: "ongoing-growth-check",
    title: "Growth Check-In",
    source: "Coach initiated",
    trigger: "Low update activity detected",
    updatedAt: "Now",
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        sender: "coach",
        meta: "Portfolio and role activity scan",
        text:
          "I noticed your Living Portfolio has strong analytics evidence, but there has not been a new project, certification, or work status update for a while. Your next best move is to turn one current skill into fresh proof, then use that proof to support a promotion conversation or a better-fit analyst role.",
      },
      {
        id: "m2",
        sender: "coach",
        text:
          "A practical path for this week: add one Power BI or SQL case study, benchmark three BI Analyst roles, and prepare a short story that connects your dashboard work to business impact.",
      },
    ],
  },
  {
    id: "living-portfolio-sync",
    title: "Portfolio Sync Update",
    source: "Coach initiated",
    trigger: "Living Portfolio changed",
    updatedAt: "12 min ago",
    unreadCount: 3,
    messages: [
      {
        id: "m1",
        sender: "coach",
        meta: "New evidence detected",
        text:
          "Your uploaded certificate evidence makes the BI Analyst path stronger because it adds proof that your analytics interest is not only academic, but supported by recognised learning. I would update your profile summary so it does more than list Power BI, SQL, and Python. It should show that you can take messy data, build dashboards, explain the result to stakeholders, and support business decisions. This also gives you a stronger story for applications: you are not just learning analytics, you are already building the kind of evidence employers expect from a junior BI or data analyst candidate.",
      },
      {
        id: "m2",
        sender: "user",
        text: "How should I update my profile summary?",
      },
      {
        id: "m3",
        sender: "coach",
        text:
          "Use a sharper summary: Analytics-focused computer science student with hands-on Power BI, SQL, and Python evidence, experienced in turning raw data into dashboards and business reporting for decision-making.",
      },
    ],
  },
  {
    id: "trait-collaboration",
    title: "Working With Other Traits",
    source: "User initiated",
    trigger: "Work trait guidance",
    updatedAt: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "As an Owl profile, how should I work better with a Peacock teammate?",
      },
      {
        id: "m2",
        sender: "coach",
        text:
          "Lead with evidence, but do not bury the energy. Bring your careful analysis as three clear points, then invite them to shape how the message lands. You protect accuracy; they help the idea travel.",
      },
    ],
  },
  {
    id: "life-chapter",
    title: "Study Again Decision",
    source: "User initiated",
    trigger: "Life Chapter Designer",
    updatedAt: "2 days ago",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Should I study again before applying for full-time analyst roles?",
      },
      {
        id: "m2",
        sender: "coach",
        text:
          "Before deciding, I would first ask three things: how long will the study take, what qualification are you aiming for, and how much will it affect your income, time, and job-search momentum? If it is a short certification or part-time course that directly supports analyst hiring signals, such as Power BI, SQL, statistics, or business analytics, then do it while applying. It can strengthen your profile without slowing your entry into the market. If it is a longer full-time study path, I would only recommend pausing applications if the qualification clearly unlocks roles you cannot realistically access now, or if your current portfolio is still too weak to compete. Based on your current CareerOS profile, you already have analytics projects, internship evidence, and a BI direction, so my recommendation is not to wait completely. Apply for full-time analyst roles now, keep studying in parallel, and use each new assignment, certificate, or project as fresh Living Portfolio evidence. That way, even if the job search takes a few months, your profile keeps improving instead of staying frozen.",
      },
    ],
  },
];

const coachSignals: CoachSignal[] = [
  {
    icon: CalendarClock,
    title: "No recent profile movement",
    source: "Living Portfolio",
    detail: "No new project, certification, skill, or work status update has been added recently.",
    status: "Coach initiated",
  },
  {
    icon: BriefcaseBusiness,
    title: "Position growth risk",
    source: "Career Landscape",
    detail: "Current trajectory suggests a move toward BI Analyst if growth stays slow in the current position.",
    status: "Action suggested",
  },
  {
    icon: GraduationCap,
    title: "Certification opportunity",
    source: "Market signal",
    detail: "Power BI and analytics credentials are aligned with the strongest matched path.",
    status: "New guidance",
  },
  {
    icon: FileText,
    title: "Portfolio sync detected",
    source: "Uploaded evidence",
    detail: "New evidence can change profile positioning, job fit, and application stories.",
    status: "Auto reviewed",
  },
];

const modulePrompts = [
  "What should I update in my Living Portfolio this week?",
  "What skill gap should I close first for a BI Analyst role?",
  "Should I ask for promotion or start looking for a new job?",
  "Which certification or exam should I take next?",
  "How should my Owl trait work with a Peacock teammate?",
  "How does my Life Chapter plan affect my next career move?",
];

function buildCoachReply(input: string) {
  const normalized = input.toLowerCase();

  if (normalized.includes("skill gap") || normalized.includes("close first")) {
    return "For your BI Analyst direction, close the highest-signal gap first: business storytelling with dashboards. You already show Power BI, SQL, Python, and analytics projects, so the next improvement is not just another tool. Build one case study where you explain the business problem, the metric, the dashboard decision, and the action a stakeholder should take. After that, strengthen SQL window functions and data modelling because those are common BI screening signals.";
  }

  if (normalized.includes("promotion") || normalized.includes("new job")) {
    return "I would compare both paths using evidence. If your current role can give you measurable analytics ownership within the next 60 days, prepare a promotion or scope negotiation. Ask for a clearer analyst scope, one dashboard ownership opportunity, and feedback criteria for moving up. If the role cannot give you that growth, start applying to BI Analyst or Junior Data Analyst roles while continuing to update your Living Portfolio. The key is not to wait passively; either negotiate growth where you are, or create movement through the market.";
  }

  if (normalized.includes("trait") || normalized.includes("owl") || normalized.includes("peacock")) {
    return "Your primary style is careful and evidence-led. When working with a more expressive teammate, bring the logic in a short structure: decision, evidence, risk. Then let them help shape the story, tone, or presentation so the work lands with people as well as it works on paper.";
  }

  if (normalized.includes("cert") || normalized.includes("exam")) {
    return "The strongest certification move is one that creates immediate portfolio proof. For your analytics path, choose a Power BI or SQL-focused credential first because it matches your BI Analyst direction and can be shown through a dashboard case study. I would avoid taking a random certificate only because it looks impressive. Pick one that helps you produce evidence within two weeks: certificate completed, dashboard improved, portfolio story updated, and interview explanation ready.";
  }

  if (normalized.includes("portfolio") || normalized.includes("project")) {
    return "Update one portfolio item into a complete evidence story: problem, dataset or context, tools used, decision supported, and measurable outcome. Your Sales Performance Dashboard is the best candidate because it already connects Power BI, business reporting, and analyst readiness. Make the update specific: add the business question, the KPI choices, before-and-after screenshots, and one paragraph explaining how a manager would use the dashboard to decide what to do next.";
  }

  if (normalized.includes("life") || normalized.includes("chapter")) {
    return "Treat the Life Chapter plan as a constraint map, not a dream board. If study, relocation, savings, or family planning affects timing, we can translate it into career moves that protect income, learning, and portfolio growth at the same time.";
  }

  return "I would start from your current signals: analytics direction, Power BI and SQL evidence, and an Owl-Fox working style. The next useful step is to convert advice into action: one portfolio update, one skill proof, and one career decision you can test this week.";
}

function SignalCard({ signal }: { signal: CoachSignal }) {
  const Icon = signal.icon;

  return (
    <div className="rounded-xl border border-[#E5E8F0] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF2F6] text-[#E00046]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-[#081433]">{signal.title}</h3>
            <span className="rounded-md bg-[#F7F8FB] px-2 py-1 text-[11px] font-bold text-[#46536D]">
              {signal.status}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-[#E00046]">{signal.source}</p>
          <p className="mt-2 text-sm leading-6 text-[#46536D]">{signal.detail}</p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF2F6] text-[#E00046]">
          <BotMessageSquare className="h-5 w-5" />
        </div>
      )}

      <div
        className={`max-w-[min(680px,82%)] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser
            ? "bg-[#081433] text-white"
            : "border border-[#E5E8F0] bg-white text-[#152238]"
        }`}
      >
        {message.meta && (
          <p className="mb-1 text-xs font-bold uppercase tracking-normal text-[#E00046]">
            {message.meta}
          </p>
        )}
        <p>{message.text}</p>
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#081433] text-white">
          <UserRound className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

function CoachTypingIndicator() {
  return (
    <div className="flex justify-start gap-3">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF2F6] text-[#E00046]">
        <BotMessageSquare className="h-5 w-5" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl border border-[#E5E8F0] bg-white px-4 py-4 shadow-sm">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-2 w-2 animate-pulse rounded-full bg-[#E00046]"
            style={{ animationDelay: `${dot * 140}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AICareerCoach() {
  const searchParams = useSearchParams();
  const requestedConversation = searchParams.get("conversation");
  const shortcutPrompt = searchParams.get("prompt")?.trim() || "";
  const shortcutConversation: Conversation | null = shortcutPrompt
    ? {
        id: "shortcut-new-question",
        title: "New Coach Question",
        source: "User initiated",
        trigger: "Shortcut coaching request",
        updatedAt: "Now",
        unreadCount: 0,
        messages: [
          {
            id: "shortcut-user",
            sender: "user",
            text: shortcutPrompt,
          },
          {
            id: "shortcut-coach",
            sender: "coach",
            text: buildCoachReply(shortcutPrompt),
          },
        ],
      }
    : null;
  const initialActiveId = shortcutConversation?.id || requestedConversation || null;
  const [conversations, setConversations] = useState(() =>
    (shortcutConversation
      ? [shortcutConversation, ...initialConversations]
      : initialConversations
    ).map((conversation) =>
      conversation.id === initialActiveId
        ? { ...conversation, unreadCount: 0 }
        : conversation
    )
  );
  const [activeId, setActiveId] = useState<string | null>(initialActiveId);
  const [input, setInput] = useState("");
  const [pendingCoachConversationId, setPendingCoachConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const idCounterRef = useRef(0);
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeConversation = useMemo(
    () =>
      activeId
        ? conversations.find((conversation) => conversation.id === activeId) ?? null
        : null,
    [activeId, conversations]
  );

  const unreadConversationCount = conversations.filter(
    (conversation) => conversation.unreadCount > 0
  ).length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [activeConversation?.id, activeConversation?.messages.length, pendingCoachConversationId]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  function startConversation(prompt?: string) {
    const conversationId = createId("chat");
    const newConversation: Conversation = {
      id: conversationId,
      title: prompt ? "New Coach Question" : "New Conversation",
      source: "User initiated",
      trigger: "Manual coaching request",
      updatedAt: "Now",
      unreadCount: 0,
      messages: prompt
        ? [
            {
              id: createId("u"),
              sender: "user",
              text: prompt,
            },
          ]
        : [
            {
              id: createId("c"),
              sender: "coach",
              text:
                "I am here. Ask me about your portfolio, job fit, applications, work traits, certifications, promotion timing, or life chapter trade-offs.",
            },
          ],
    };

    setConversations((current) => [newConversation, ...current]);
    setActiveId(conversationId);

    if (prompt) {
      queueCoachReply(conversationId, prompt);
    }
  }

  function createId(prefix: string) {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  }

  function selectConversation(conversationId: string) {
    setActiveId(conversationId);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unreadCount: 0 }
          : conversation
      )
    );
  }

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || pendingCoachConversationId) return;
    sendPromptToActiveConversation(trimmed);
    setInput("");
  }

  function sendPromptToActiveConversation(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed || pendingCoachConversationId) return;

    if (!activeConversation) {
      startConversation(trimmed);
      return;
    }

    const userMessage: Message = {
      id: createId("u"),
      sender: "user",
      text: trimmed,
    };
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              updatedAt: "Now",
              unreadCount: 0,
              messages: [...conversation.messages, userMessage],
            }
          : conversation
      )
    );
    queueCoachReply(activeConversation.id, trimmed);
  }

  function queueCoachReply(conversationId: string, prompt: string) {
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }

    setPendingCoachConversationId(conversationId);
    replyTimeoutRef.current = setTimeout(() => {
      const coachMessage: Message = {
        id: createId("c"),
        sender: "coach",
        text: buildCoachReply(prompt),
      };

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                updatedAt: "Now",
                unreadCount: 0,
                messages: [...conversation.messages, coachMessage],
              }
            : conversation
        )
      );
      setPendingCoachConversationId((current) =>
        current === conversationId ? null : current
      );
      replyTimeoutRef.current = null;
    }, 1100);
  }

  return (
    <main
      className="min-h-screen bg-[#fbfbfc] px-4 py-6 sm:px-6 lg:px-8"
      style={{ fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <section className="relative min-h-[360px] overflow-hidden rounded-2xl text-white shadow-[0_18px_40px_rgba(21,34,56,0.18)]">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80"
            alt="Career coaching discussion with planning notes"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081433]/94 via-[#081433]/78 to-[#081433]/38" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081433]/65 via-transparent to-transparent" />

          <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-8">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  Personal guidance
                </span>
              </div>

              <div className="flex max-w-4xl items-start gap-4">
                <div>
                  <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white md:text-5xl">
                    AI Career Coach
                  </h1>
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
                    A connected coach for portfolio updates, career fit, skill gaps,
                    applications, work traits, certifications, promotion timing, and
                    Life Chapter decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid min-h-[720px] items-stretch gap-5 lg:grid-cols-[300px_minmax(0,1fr)_330px]">
          <aside className="flex min-h-[720px] flex-col overflow-hidden rounded-2xl border border-[#E5E8F0] bg-white">
            <div className="flex items-center justify-between border-b border-[#E5E8F0] p-4">
              <div>
                <h2 className="text-base font-black text-[#081433]">Conversations</h2>
                <p className="mt-1 text-xs font-semibold text-[#46536D]">
                  {unreadConversationCount > 0
                    ? `${unreadConversationCount} unread conversations`
                    : activeConversation
                      ? "All conversations read"
                      : "Select a conversation"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => startConversation()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#081433] text-white transition hover:bg-[#152238]"
                aria-label="Start new conversation"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {conversations.map((conversation) => {
                const active = conversation.id === activeId;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => selectConversation(conversation.id)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-[#F04D7A] bg-[#FFF7FA]"
                        : "border-transparent bg-white hover:border-[#E5E8F0] hover:bg-[#FAFBFC]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-[#081433]">
                        {conversation.title}
                      </h3>
                      <div className="flex shrink-0 items-center gap-2">
                        {conversation.unreadCount > 0 && (
                          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#E00046] px-2 text-[11px] font-black text-white">
                            {conversation.unreadCount}
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-[#8A94A6]">
                          {conversation.updatedAt}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold text-[#E00046]">
                        {conversation.source}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                          conversation.unreadCount > 0
                            ? "bg-[#FFF2F6] text-[#E00046]"
                            : "bg-[#F1F5F9] text-[#64748B]"
                        }`}
                      >
                        {conversation.unreadCount > 0 ? "Unread" : "Read"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#46536D]">
                      {conversation.trigger}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="flex min-h-[720px] flex-col overflow-hidden rounded-2xl border border-[#E5E8F0] bg-[#F7F8FB]">
            <div className="border-b border-[#E5E8F0] bg-white p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black text-[#081433]">
                      {activeConversation?.title ?? "No conversation selected"}
                    </h2>
                    {activeConversation && (
                      <span className="rounded-md bg-[#FFF2F6] px-2.5 py-1 text-xs font-bold text-[#E00046]">
                        {activeConversation.source}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#46536D]">
                    {activeConversation?.trigger ??
                      "Choose a chat from the left, or type below to start a new coaching conversation."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6">
              <div className="mt-auto space-y-5">
                {activeConversation ? (
                  <AnimatePresence initial={false}>
                    {activeConversation.messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                      >
                        <MessageBubble message={message} />
                      </motion.div>
                    ))}
                    {pendingCoachConversationId === activeConversation.id && (
                      <motion.div
                        key="coach-typing"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                      >
                        <CoachTypingIndicator />
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <div className="mx-auto mb-8 max-w-md rounded-2xl border border-[#E5E8F0] bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF2F6] text-[#E00046]">
                      <BotMessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-[#081433]">
                      Start with a question
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#46536D]">
                      No conversation is selected yet. Pick a thread from your
                      history, choose a suggested question, or type your own
                      message below.
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-[#E5E8F0] bg-white p-4">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {modulePrompts.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendPromptToActiveConversation(prompt)}
                    disabled={Boolean(pendingCoachConversationId)}
                    className="shrink-0 rounded-lg border border-[#E5E8F0] bg-white px-3 py-2 text-xs font-bold text-[#46536D] transition hover:border-[#F04D7A] hover:text-[#E00046] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex items-end gap-3 rounded-xl border border-[#E5E8F0] bg-[#FAFBFC] p-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={2}
                  placeholder="Ask about portfolio evidence, job fit, skills, traits, certifications, applications, or life planning..."
                  className="min-h-[48px] flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-[#081433] outline-none placeholder:text-[#8A94A6]"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim() || Boolean(pendingCoachConversationId)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#081433] text-white transition hover:bg-[#152238] disabled:cursor-not-allowed disabled:bg-[#C9CED8]"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#E5E8F0] bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF2F6] text-[#E00046]">
                  <BellRing className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-black text-[#081433]">
                    Coach Triggers
                  </h2>
                  <p className="text-xs font-semibold text-[#46536D]">
                    Bidirectional coaching signals
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {coachSignals.map((signal) => (
                  <SignalCard key={signal.title} signal={signal} />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#E5E8F0] bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF2F6] text-[#E00046]">
                  <PanelRightOpen className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-black text-[#081433]">
                    Connected Modules
                  </h2>
                  <p className="text-xs font-semibold text-[#46536D]">
                    CareerOS context layer
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  [FileText, "Living Portfolio", "Evidence, updates, projects, skills"],
                  [Target, "Career Landscape", "Fit, gaps, paths, job moves"],
                  [BadgeCheck, "Applications", "Employer fit and interview story"],
                  [Lightbulb, "Life Chapter Designer", "Career-life trade-off planning"],
                  [CheckCircle2, "Work Traits", "Collaboration and communication advice"],
                ].map(([Icon, title, description]) => {
                  const ModuleIcon = Icon as LucideIcon;

                  return (
                    <div
                      key={title as string}
                      className="flex items-center gap-3 rounded-xl border border-[#E5E8F0] bg-[#FAFBFC] p-3"
                    >
                      <ModuleIcon className="h-5 w-5 shrink-0 text-[#E00046]" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#081433]">
                          {title as string}
                        </p>
                        <p className="text-xs leading-5 text-[#46536D]">
                          {description as string}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </aside>
        </section>
      </div>
    </main>
  );
}
