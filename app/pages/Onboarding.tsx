"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  GraduationCap,
  Sparkles,
  BriefcaseBusiness,
  Heart,
  SlidersHorizontal,
  FileText,
  CheckCircle2,
  Link2,
  Plus,
  X,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";

// ─── Theme ────────────────────────────────────────────────────────────────────

const theme = {
  navy: "#07182B",
  rose1: "#F04D7A",
  rose2: "#E00046",
  rose3: "#E94F68",
  rose4: "#D81B3F",
  soft: "#FFF2F6",
  soft2: "#FDE7EE",
  line: "#F5CBD6",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface StepField {
  name: string;
  label: string;
  placeholder?: string;
  repeatable?: boolean;
  type?: "file" | "text";
  helper?: string;
}

interface Step {
  key: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  fields: StepField[];
}

type FormState = Record<string, string | string[]>;

// ─── Steps config ─────────────────────────────────────────────────────────────

const steps: Step[] = [
  {
    key: "education",
    label: "Education",
    title: "Where are you starting from?",
    description: "Share your academic background so CareerOS can understand your foundation.",
    icon: GraduationCap,
    fields: [
      { name: "university", label: "University or institution", placeholder: "Asia Pacific University" },
      { name: "course", label: "Course or programme", placeholder: "Computer Science" },
      { name: "specialisation", label: "Specialisation", placeholder: "Data Analytics" },
    ],
  },
  {
    key: "skills",
    label: "Skills",
    title: "What can you already do?",
    description: "Add technical tools, soft skills, and strengths that represent your current ability.",
    icon: Sparkles,
    fields: [
      { name: "technicalSkills", label: "Technical skills", placeholder: "Python", repeatable: true },
      { name: "tools", label: "Tools", placeholder: "Power BI", repeatable: true },
      { name: "softSkills", label: "Soft skills", placeholder: "Communication", repeatable: true },
    ],
  },
  {
    key: "experience",
    label: "Experience",
    title: "What have you tried or built before?",
    description: "Include internships, projects, hackathons, part time work, or leadership experience.",
    icon: BriefcaseBusiness,
    fields: [
      { name: "internship", label: "Internship or work exposure", placeholder: "Data analyst intern", repeatable: true },
      { name: "projects", label: "Projects", placeholder: "Dashboard project", repeatable: true },
    ],
  },
  {
    key: "interests",
    label: "Interests",
    title: "What kind of work attracts you?",
    description: "CareerOS uses interests to avoid recommending paths based only on skills.",
    icon: Heart,
    fields: [
      { name: "careerFields", label: "Career fields", placeholder: "Data analytics", repeatable: true },
      { name: "roleStyle", label: "Preferred role style", placeholder: "Technical", repeatable: true },
    ],
  },
  {
    key: "preferences",
    label: "Preferences",
    title: "What kind of opportunity fits you?",
    description: "Tell us the work environment and opportunity type that match your current goals.",
    icon: SlidersHorizontal,
    fields: [
      { name: "location", label: "Preferred location", placeholder: "Kuala Lumpur", repeatable: true },
      { name: "workMode", label: "Work mode", placeholder: "Hybrid", repeatable: true },
      { name: "companyType", label: "Company type", placeholder: "MNC", repeatable: true },
      { name: "goal", label: "Current goal", placeholder: "Internship", repeatable: true },
    ],
  },
  {
    key: "uploads",
    label: "Uploads",
    title: "Add evidence to strengthen your profile.",
    description: "Upload or link proof of your skills so your Living Portfolio becomes more credible.",
    icon: Upload,
    fields: [
      { name: "resume", label: "Resume or CV", type: "file", helper: "Upload one or more PDF, DOCX, or image files" },
      { name: "certificates", label: "Certificates", type: "file", helper: "Upload one or more certificates or achievement proofs" },
      { name: "portfolio", label: "Portfolio or GitHub link", type: "text", placeholder: "https://github.com/yourname" },
    ],
  },
];

const starterForm: FormState = steps.reduce<FormState>((acc, step) => {
  step.fields.forEach((field) => {
    if (field.type === "file") acc[field.name] = [];
    else if (field.repeatable) acc[field.name] = [""];
    else acc[field.name] = "";
  });
  return acc;
}, {});

// ─── Decorative shapes (welcome screen only) ──────────────────────────────────

function DecorativeShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full blur-3xl opacity-20" style={{ background: theme.rose1 }} />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full blur-3xl opacity-20" style={{ background: theme.rose2 }} />
      <div className="absolute -left-28 -top-16 h-20 w-96 rotate-[-45deg] rounded-sm opacity-95" style={{ background: theme.rose1 }} />
      <div className="absolute left-8 -top-20 h-20 w-96 rotate-[-45deg] rounded-sm opacity-95" style={{ background: theme.rose3 }} />
      <div className="absolute -bottom-28 right-8 h-24 w-96 rotate-[-45deg] rounded-sm opacity-90" style={{ background: theme.rose4 }} />
      <div className="absolute -bottom-24 right-48 h-24 w-80 rotate-[-45deg] rounded-sm opacity-80" style={{ background: theme.rose1 }} />
      <div className="absolute -bottom-20 right-72 h-20 w-64 rotate-[-45deg] rounded-sm opacity-80" style={{ background: theme.rose2 }} />
    </div>
  );
}

// ─── Welcome screen ───────────────────────────────────────────────────────────

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center bg-white px-6 py-8 text-slate-900">
      <DecorativeShapes />
      <section className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em]" style={{ color: theme.rose2 }}>
          Welcome to CareerOS
        </p>
        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
          Build your career profile with CareerOS
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-slate-600 md:text-xl">
          Let&apos;s understand your career profile. CareerOS will use your background, skills, interests, and uploaded evidence to build your first Living Portfolio.
        </p>
        <button
          onClick={onStart}
          className="mt-9 inline-flex items-center gap-3 rounded-xl px-7 py-4 text-base font-extrabold text-white shadow-xl transition hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: theme.rose2 }}
        >
          Start Onboarding
          <ArrowRight className="h-5 w-5" />
        </button>
      </section>
    </div>
  );
}

// ─── Progress dots ────────────────────────────────────────────────────────────

function ProgressDots({ current }: { current: number }) {
  return (
    <div className="mt-auto flex justify-center gap-2.5 pt-5">
      {steps.map((step, index) => (
        <div
          key={step.key}
          className="h-2.5 rounded-full transition-all duration-200"
          style={{
            width: current === index ? 30 : 10,
            background: current === index ? theme.rose2 : "#E8EAF0",
          }}
        />
      ))}
    </div>
  );
}

// ─── Repeatable text field ────────────────────────────────────────────────────

interface RepeatableTextFieldProps {
  field: StepField;
  value: string | string[];
  onChange: (value: string[]) => void;
}

function RepeatableTextField({ field, value, onChange }: RepeatableTextFieldProps) {
  const values = Array.isArray(value) && value.length > 0 ? value : [""];

  const updateItem = (index: number, newValue: string) => {
    const next = [...values];
    next[index] = newValue;
    onChange(next);
  };

  const addItem = () => onChange([...values, ""]);

  const removeItem = (index: number) => {
    if (values.length === 1) return;
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="block text-sm font-bold text-slate-700">{field.label}</span>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold text-white shadow-sm transition hover:scale-[1.01]"
          style={{ background: theme.rose2 }}
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2.5">
        {values.map((item, index) => (
          <div key={`${field.name}-${index}`} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={index === 0 ? field.placeholder : "Others"}
              className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#E00046] focus:ring-1 focus:ring-[#E00046]/30"
              style={{ borderColor: "#CBD5E1" }}
            />
            {values.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="flex w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── File upload field ────────────────────────────────────────────────────────

interface FileUploadFieldProps {
  field: StepField;
  value: string | string[];
  onChange: (value: string[]) => void;
}

function FileUploadField({ field, value, onChange }: FileUploadFieldProps) {
  const files = Array.isArray(value) ? value : [];
  const fileSummary =
    files.length === 0
      ? "No file selected"
      : `${files.length} file${files.length > 1 ? "s" : ""} selected`;
  const inputId = `file-upload-${field.name}`;
  const removeFile = (fileIndex: number) =>
    onChange(files.filter((_, i) => i !== fileIndex));

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{field.label}</span>
      <div
        className="flex items-center justify-between gap-4 rounded-xl border bg-white px-4 py-3.5"
        style={{ borderColor: "#CBD5E1" }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: theme.soft }}>
            <Upload className="h-5 w-5" style={{ color: theme.rose2 }} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">{fileSummary}</p>
            <p className="truncate text-xs font-medium text-slate-400">{field.helper}</p>
          </div>
        </div>
        <label
          htmlFor={inputId}
          className="shrink-0 cursor-pointer rounded-lg px-4 py-2 text-sm font-extrabold text-white"
          style={{ background: theme.rose2 }}
        >
          Upload
        </label>
        <input
          id={inputId}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files ?? []).map((f) => f.name);
            onChange([...files, ...selectedFiles]);
            e.target.value = "";
          }}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((fileName, index) => (
            <div
              key={`${fileName}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border bg-white px-4 py-2.5"
              style={{ borderColor: theme.line }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0" style={{ color: theme.rose2 }} />
                <span className="truncate text-sm font-semibold text-slate-700">{fileName}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Onboarding step ──────────────────────────────────────────────────────────

interface OnboardingStepProps {
  stepIndex: number;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onNext: () => void;
  onBack: () => void;
}

function OnboardingStep({ stepIndex, form, setForm, onNext, onBack }: OnboardingStepProps) {
  const step = steps[stepIndex];
  const Icon = step.icon;
  const completedSteps = steps.slice(0, stepIndex);

  return (
    <div className="bg-white px-6 py-5">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl flex-col">
        <div className="mb-4 flex shrink-0 items-center justify-end">
          <div
            className="rounded-full px-4 py-2 text-xs font-bold text-slate-600"
            style={{ background: theme.soft }}
          >
            Step {stepIndex + 1} of {steps.length}
          </div>
        </div>

        <section className="grid flex-1 items-stretch gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <aside
            className="self-start rounded-[1.6rem] p-6 text-white shadow-xl"
            style={{ background: `linear-gradient(145deg, ${theme.navy}, #0D2846)` }}
          >
            <div
              className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
              style={{ background: `linear-gradient(135deg, ${theme.rose1}, ${theme.rose2})` }}
            >
              <Icon className="h-6 w-6" />
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: theme.rose1 }}>
              {step.label}
            </p>
            <h2 className="text-3xl font-black leading-tight md:text-4xl">{step.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-200 md:text-base">{step.description}</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-slate-200">Career profile building</p>
              <div className="mt-3 space-y-2.5">
                {completedSteps.length === 0 ? (
                  <p className="text-sm font-medium text-slate-400">No section added yet</p>
                ) : (
                  completedSteps.map((s) => (
                    <div key={s.key} className="flex items-center gap-2.5 text-sm font-semibold text-white">
                      <CheckCircle2 className="h-4 w-4" style={{ color: theme.rose1 }} /> {s.label} added
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          <div
            className="flex min-h-0 flex-col rounded-[1.6rem] border bg-white p-6 shadow-xl"
            style={{ borderColor: theme.line }}
          >
            <div className="mb-5 shrink-0">
              <h3 className="text-2xl font-black text-slate-900">{step.label}</h3>
              <p className="mt-1.5 text-sm font-medium text-slate-500">
                Complete this section to improve your first Living Portfolio.
              </p>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              {step.fields.map((field) => {
                if (field.type === "file")
                  return (
                    <FileUploadField
                      key={field.name}
                      field={field}
                      value={form[field.name]}
                      onChange={(val) => setForm((old) => ({ ...old, [field.name]: val }))}
                    />
                  );
                if (field.repeatable)
                  return (
                    <RepeatableTextField
                      key={field.name}
                      field={field}
                      value={form[field.name]}
                      onChange={(val) => setForm((old) => ({ ...old, [field.name]: val }))}
                    />
                  );
                return (
                  <label key={field.name} className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">{field.label}</span>
                    <div className="relative">
                      {field.name === "portfolio" && (
                        <Link2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      )}
                      <input
                        value={form[field.name] as string}
                        onChange={(e) =>
                          setForm((old) => ({ ...old, [field.name]: e.target.value }))
                        }
                        placeholder={field.placeholder}
                        className={`w-full rounded-xl border bg-white py-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#E00046] focus:ring-1 focus:ring-[#E00046]/30 ${
                          field.name === "portfolio" ? "pl-11 pr-4" : "px-4"
                        }`}
                        style={{ borderColor: "#CBD5E1" }}
                      />
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="mt-auto flex gap-3 pt-6">
              {stepIndex !== 0 && (
                <button
                  onClick={onBack}
                  className="flex h-12 items-center justify-center rounded-xl bg-slate-100 px-6 font-bold text-slate-600 transition hover:bg-slate-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              {stepIndex === steps.length - 1 ? (
                <Link
                  href="/?view=profile"
                  className="flex h-12 flex-1 items-center justify-center gap-3 rounded-xl font-extrabold text-white shadow-lg transition hover:scale-[1.005] active:scale-[0.995]"
                  style={{ background: theme.rose4 }}
                >
                  Create User Profile
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <button
                  onClick={onNext}
                  className="flex h-12 flex-1 items-center justify-center gap-3 rounded-xl font-extrabold text-white shadow-lg transition hover:scale-[1.005] active:scale-[0.995]"
                  style={{ background: theme.rose2 }}
                >
                  Next
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
            <ProgressDots current={stepIndex} />
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

type Screen = "welcome" | "onboarding";

export default function Onboarding() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [form, setForm] = useState<FormState>(starterForm);

  const goNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((old) => old + 1);
    } else {
      window.location.href = "/?view=profile";
    }
  };

  const goBack = () => setStepIndex((old) => Math.max(0, old - 1));

  return (
    <>
      <Navbar />
      {screen === "welcome" && (
        <Welcome onStart={() => setScreen("onboarding")} />
      )}
      {screen === "onboarding" && (
        <OnboardingStep
          stepIndex={stepIndex}
          form={form}
          setForm={setForm}
          onNext={goNext}
          onBack={goBack}
        />
      )}
    </>
  );
}
