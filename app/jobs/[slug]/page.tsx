"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  FolderOpen,
  Gift,
  GraduationCap,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";

const jobs = {
  "bi-analyst": {
    role: "BI Analyst",
    company: "Fintech Company",
    match: "81%",
    salary: "RM4,000 - RM5,500",
  },
  "junior-bi-analyst": {
    role: "Junior BI Analyst",
    company: "Consulting Firm",
    match: "77%",
    salary: "RM3,500 - RM4,800",
  },
};

type JobSlug = keyof typeof jobs;

export default function JobApplicationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const job = jobs[slug as JobSlug] ?? jobs["bi-analyst"];
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdfcfa] text-[#111111]">
      <Navbar initialActiveItem="Applications" />

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-black/65 transition hover:text-[#f0184f]">
            <ArrowLeft size={16} />
            Back to search results
          </Link>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsDescriptionOpen(true)}
              className="flex h-11 items-center gap-2 rounded-md border border-black/10 bg-white px-5 text-sm font-bold transition hover:border-[#f0184f]/30 hover:text-[#f0184f]"
            >
              <FileText size={16} />
              View Job Description
            </button>
            <button className="h-11 rounded-md bg-[#f0184f] px-10 text-sm font-bold text-white shadow-[0_12px_28px_rgba(240,24,79,0.2)] transition hover:bg-[#d91445]">
              Apply Now
            </button>
          </div>
        </div>

        <section className="mt-5 grid gap-6 rounded-md border border-black/5 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_.55fr_1.1fr] lg:items-center">
          <div className="flex gap-5">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-[#f0184f] text-white">
              <Building2 size={38} />
            </span>
            <div>
              <h1 className="text-3xl font-black">{job.role}</h1>
              <p className="mt-1 text-lg font-bold">{job.company}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-black/55">
                <span className="flex items-center gap-1"><MapPin size={14} /> Kuala Lumpur, Malaysia</span>
                <span className="flex items-center gap-1"><BriefcaseBusiness size={14} /> Hybrid</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-black/60">
                <span className="rounded-md bg-black/4 px-3 py-1">Full-time</span>
                <span className="rounded-md bg-black/4 px-3 py-1">{job.salary}</span>
                <span className="rounded-md bg-black/4 px-3 py-1">Posted 3 days ago</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="grid h-32 w-32 place-items-center rounded-full bg-[conic-gradient(#f0184f_0_81%,#ffe6ed_81%_100%)] p-2 shadow-[0_0_22px_rgba(240,24,79,0.12)]">
              <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
                <div>
                  <p className="text-3xl font-black text-[#f0184f]">{job.match}</p>
                  <p className="mt-1 text-xs font-bold">Match Score</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 border-l border-black/8 pl-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-bold">Why you&apos;re a great match</p>
              <div className="mt-4 space-y-3 text-sm">
                {["SQL", "Analytics Experience", "Fintech Exposure"].map((item) => (
                  <p key={item} className="flex items-center gap-2"><Check size={15} /> {item}</p>
                ))}
              </div>
            </div>
            <div className="border-l border-black/8 pl-6">
              <p className="text-sm font-bold">Potential gap</p>
              <p className="mt-4 flex items-center gap-2 text-sm"><CircleAlert className="text-[#f0184f]" size={15} /> Power BI Reporting</p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="rounded-md border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-3 text-lg font-bold"><Sparkles className="text-[#f0184f]" size={20} /> CareerOS Insight</h2>
            <p className="mt-6 text-sm leading-6 text-black/70">
              Your profile closely resembles successful BI Analyst candidates who transitioned from analytics internships into stakeholder-facing reporting roles.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div><p className="text-xs font-bold">Current readiness</p><p className="mt-2 text-2xl font-black text-[#f0184f]">{job.match}</p></div>
              <div><p className="text-xs font-bold">Estimated transition</p><p className="mt-2 text-xl font-black text-[#f0184f]">12 - 18 months</p></div>
            </div>
          </div>

          <div className="rounded-md border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-3 text-lg font-bold"><BriefcaseBusiness className="text-[#f0184f]" size={20} /> Your Application Package</h2>
            <div className="mt-6 space-y-4">
              <PackageRow icon={FileText} title="Resume" note="Product Designer Resume.pdf" attached />
              <PackageRow icon={FolderOpen} title="Portfolio" note="CareerOS Portfolio" attached />
              <PackageRow icon={FileText} title="Certificates" note="3 Included" />
              <PackageRow icon={FolderOpen} title="Projects" note="4 Included" />
            </div>
            <button className="mt-5 w-full rounded-md border border-[#f0184f]/15 bg-[#fff8fa] py-3 text-sm font-bold text-[#f0184f]">Preview Application</button>
          </div>

          <div className="rounded-md border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-3 text-lg font-bold"><Sparkles className="text-[#f0184f]" size={20} /> AI Application Review</h2>
            <div className="mt-5 rounded-md border border-[#f0184f]/12 bg-[#fff8fa] p-5">
              <p className="text-sm font-bold">Application Readiness</p>
              <p className="mt-2 text-3xl font-black text-[#f0184f]">{job.match}</p>
              <p className="mt-5 text-sm font-bold">Suggestions to improve</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-5">
                <li>Highlight your dashboard project experience</li>
                <li>Mention your fintech internship exposure</li>
                <li>Include Power BI certification</li>
              </ul>
            </div>
            <button className="mt-5 flex items-center gap-2 text-sm font-bold text-[#f0184f]">View full review <ArrowRight size={15} /></button>
          </div>
        </section>

        <section className="mt-5 grid gap-3 border-t border-black/8 pt-5 sm:grid-cols-[220px_1fr]">
          <button className="flex h-12 items-center justify-center gap-2 rounded-md border border-black/10 bg-white text-sm font-bold">
            <BookmarkIcon />
            Save For Later
          </button>
          <button className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#f0184f] text-sm font-bold text-white shadow-[0_12px_28px_rgba(240,24,79,0.2)] transition hover:bg-[#d91445]">
            Submit Application <ArrowRight size={16} />
          </button>
        </section>
      </main>

      {isDescriptionOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#121d2d]/55 p-4">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-auto rounded-md bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-black/8 p-7">
              <div>
                <h2 className="text-2xl font-black">{job.role}</h2>
                <p className="mt-1 text-lg font-bold">{job.company}</p>
                <p className="mt-3 text-sm text-black/55">Kuala Lumpur, Malaysia · Hybrid · Full-time · {job.salary}</p>
              </div>
              <button onClick={() => setIsDescriptionOpen(false)} aria-label="Close job description" className="text-black/60 hover:text-[#f0184f]"><X /></button>
            </div>
            <div className="grid gap-7 p-7 lg:grid-cols-[1fr_240px]">
              <div className="space-y-6 text-sm leading-6">
                <div><h3 className="font-bold">About the role</h3><p className="mt-2 text-black/65">As a BI Analyst, you will transform business data into actionable insights through dashboard development and stakeholder reporting. You will work closely with cross-functional teams to understand business needs and deliver data-driven solutions.</p></div>
                <List title="Key responsibilities" items={["Build and maintain dashboards and reports to track business performance", "Analyze data sets to identify trends, patterns and opportunities", "Partner with stakeholders to understand data needs and deliver insights", "Ensure data accuracy, integrity and consistency across reports", "Present findings and recommendations to support business decisions"]} />
                <List title="Requirements" items={["Bachelor's degree in any field", "Strong SQL and Excel skills", "Analytical and problem-solving skills", "Good communication skills", "1+ year experience in data analysis is an advantage"]} />
              </div>
              <div className="space-y-4">
                <aside className="rounded-md bg-[#fff1f5] p-5">
                  <h3 className="font-bold">Benefits</h3>
                  <div className="mt-4 space-y-4 text-sm"><Benefit icon={BriefcaseBusiness} text="Hybrid work arrangement" /><Benefit icon={HeartPulse} text="Medical & insurance coverage" /><Benefit icon={GraduationCap} text="Learning & development allowance" /><Benefit icon={Gift} text="Performance bonus" /></div>
                </aside>
                <aside className="rounded-md border border-black/8 p-5 text-sm">
                  <h3 className="font-bold">Company snapshot</h3>
                  <div className="mt-4 space-y-3 text-black/65"><p>Industry <b className="float-right">Fintech</b></p><p>Company size <b className="float-right">120 employees</b></p><p>Founded <b className="float-right">2018</b></p></div>
                </aside>
              </div>
            </div>
            <div className="border-t border-black/8 p-4 text-center">
              <button onClick={() => setIsDescriptionOpen(false)} className="w-full max-w-md rounded-md bg-[#f0184f] py-3 text-sm font-bold text-white">Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PackageRow({ icon: Icon, title, note, attached = false }: { icon: typeof FileText; title: string; note: string; attached?: boolean }) {
  return <div className="flex items-center gap-3 text-sm"><Icon className="text-[#f0184f]" size={17} /><div className="flex-1"><p className="font-bold">{title}</p><p className="text-xs text-black/50">{note}</p></div>{attached ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">Attached <Check size={15} /></span> : <ChevronRight size={16} />}</div>;
}

function Benefit({ icon: Icon, text }: { icon: typeof BriefcaseBusiness; text: string }) {
  return <p className="flex items-center gap-3"><Icon className="text-[#f0184f]" size={16} /> {text}</p>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return <div><h3 className="font-bold">{title}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-black/65">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function BookmarkIcon() {
  return <ShieldCheck size={16} />;
}
