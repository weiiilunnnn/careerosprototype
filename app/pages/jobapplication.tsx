"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CircleAlert,
  FileText,
  Gift,
  GraduationCap,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  compareCandidateToJob,
  getWorkAnimal,
  supervisorGuide,
  topAnimalsForJob,
  type WorkAnimalSlug,
} from "@/lib/workAnimals";
import { candidateLivingCv } from "@/lib/candidateLivingCvData";


const jobs = {
  "bi-analyst": {
    role: "BI Analyst",
    company: "Fintech Company",
    match: "81%",
    salary: "RM4,000 - RM5,500",
    skills: ["SQL", "Analytics Experience", "Fintech Exposure", "Power BI"],
    historicalAnimalSlugs: ["owl", "ant", "fox"] as WorkAnimalSlug[],
    supervisorName: "Amanda Lee",
    supervisorAnimal: "dolphin" as WorkAnimalSlug,
  },
  "junior-bi-analyst": {
    role: "Junior BI Analyst",
    company: "Consulting Firm",
    match: "77%",
    salary: "RM3,500 - RM4,800",
    skills: ["SQL", "Dashboarding", "Stakeholder Communication"],
    historicalAnimalSlugs: ["ant", "horse", "dolphin"] as WorkAnimalSlug[],
    supervisorName: "Victor Chen",
    supervisorAnimal: "ant" as WorkAnimalSlug,
  },
};

type JobSlug = keyof typeof jobs;

export default function JobApplicationPage({ slug = "bi-analyst" }: { slug?: JobSlug }) {
  const job = jobs[slug as JobSlug] ?? jobs["bi-analyst"];
  const candidateAnimal = candidateLivingCv.workAnimal;
  const candidateAnimalProfile = getWorkAnimal(candidateAnimal);
  const topAnimalMatches = topAnimalsForJob({
    title: job.role,
    skills: job.skills,
    historicalAnimalSlugs: job.historicalAnimalSlugs,
  });
  const animalComparison = compareCandidateToJob(candidateAnimal, topAnimalMatches);
  const managerAnimal = getWorkAnimal(job.supervisorAnimal);
  const managerGuide = supervisorGuide(job.supervisorAnimal);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdfcfa] text-[#111111]">

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/?view=deep-dive"
            scroll={false}
            prefetch={true}
            replace
            className="flex items-center gap-2 text-sm font-semibold text-black/65 transition-colors hover:text-[#f0184f]"
          >
            <ArrowLeft size={16} />
            Back to search results
          </Link>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setIsDescriptionOpen(true)}
              className="flex h-11 items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#f0184f]/30 hover:text-[#f0184f]"
            >
              <FileText size={16} />
              View Job Description
            </button>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="h-11 rounded-md bg-[#f0184f] px-4 text-sm font-bold text-white shadow-[0_12px_28px_rgba(240,24,79,0.2)] transition hover:bg-[#d91445]"
            >
              Apply Now
            </button>
          </div>
        </div>

        <section className="mt-5 grid gap-6 rounded-md border border-black/5 bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[1.2fr_.55fr_1.1fr] lg:items-center">
          <div className="flex flex-col gap-5 sm:flex-row">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-[#f0184f] text-white sm:h-20 sm:w-20">
              <Building2 size={38} />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-black sm:text-3xl">{job.role}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-lg font-bold">{job.company}</p>
                <Link
                  href="/?view=company-profile"
                  className="text-xs font-bold text-[#f0184f] transition hover:text-[#d91445]"
                >
                  View company profile
                </Link>
              </div>
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

          <div className="grid gap-6 border-t border-black/8 pt-6 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div>
              <p className="text-sm font-bold">Why you&apos;re a great match</p>
              <div className="mt-4 space-y-3 text-sm">
                {["SQL", "Analytics Experience", "Fintech Exposure"].map((item) => (
                  <p key={item} className="flex items-center gap-2"><Check size={15} /> {item}</p>
                ))}
              </div>
            </div>
            <div className="border-t border-black/8 pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <p className="text-sm font-bold">Potential gap</p>
              <p className="mt-4 flex items-center gap-2 text-sm"><CircleAlert className="text-[#f0184f]" size={15} /> Power BI Reporting</p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_.9fr]">
          <div className="rounded-md border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-3 text-lg font-bold"><Sparkles className="text-[#f0184f]" size={20} /> Menagerie Method Fit</h2>
            <p className="mt-3 text-sm leading-6 text-black/60">
              CareerOS converts company hiring history and role requirements into a 100% animal-trait breakdown, then shows the top 3 traits being recruited for this position.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {topAnimalMatches.map((match) => (
                <div key={match.animal.slug} className="rounded-md border border-black/8 bg-[#fff8fa] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-3xl">{match.animal.emoji}</span>
                    <span className="text-sm font-black text-[#f0184f]">{match.score}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ffe1ea]">
                    <div className="h-full rounded-full bg-[#f0184f]" style={{ width: `${match.score}%` }} />
                  </div>
                  <p className="mt-3 font-black">{match.animal.name}</p>
                  <p className="mt-1 text-xs font-bold text-black/55">{match.animal.archetype}</p>
                  <p className="mt-3 text-xs leading-5 text-black/60">{match.reason}</p>
                </div>
              ))}
            </div>
            <div className={`mt-5 rounded-md border p-5 ${animalComparison.status === "unknown" ? "border-amber-200 bg-amber-50 text-amber-900" : animalComparison.status === "match" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-[#f0184f]/15 bg-[#fff8fa] text-black/70"}`}>
              <p className="font-black">{animalComparison.title}</p>
              <p className="mt-2 text-sm leading-6">{animalComparison.body}</p>
              <p className="mt-3 text-xs font-bold">
                Candidate trait: {candidateAnimalProfile ? `${candidateAnimalProfile.emoji} ${candidateAnimalProfile.name}` : "Unknown"}
              </p>
            </div>
          </div>

          <div className="rounded-md border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-3 text-lg font-bold"><BriefcaseBusiness className="text-[#f0184f]" size={20} /> Reporting Manager Guide</h2>
            <div className="mt-5 rounded-md bg-[#fff8fa] p-5">
              <p className="text-sm font-bold text-black/55">Reports to</p>
              <p className="mt-1 text-xl font-black">{job.supervisorName}</p>
              <p className="mt-3 text-sm font-bold text-[#f0184f]">
                {managerAnimal ? `${managerAnimal.emoji} ${managerAnimal.name}, ${managerAnimal.archetype}` : "Animal trait not set"}
              </p>
              <div className="mt-5 space-y-3">
                {[
                  ["Supervisor character", managerGuide.character],
                  ["How they communicate", managerGuide.communication],
                  ["Working style", managerGuide.workingStyle],
                  ["How you should respond", managerGuide.candidateResponse],
                  ["Why this works", managerGuide.whyItWorks],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md bg-white p-4 text-sm shadow-sm ring-1 ring-black/5">
                    <p className="font-black text-black">{label}</p>
                    <p className="mt-2 leading-6 text-black/65">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-md border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-3 text-lg font-bold"><Sparkles className="text-[#f0184f]" size={20} /> CareerOS Insight</h2>
            <p className="mt-6 text-sm leading-6 text-black/70">
              Your profile closely resembles successful BI Analyst candidates who transitioned from analytics internships into stakeholder-facing reporting roles.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div><p className="text-xs font-bold">Current readiness</p><p className="mt-2 text-2xl font-black text-[#f0184f]">{job.match}</p></div>
              <div><p className="text-xs font-bold">Estimated transition</p><p className="mt-2 text-xl font-black text-[#f0184f]">12 - 18 months</p></div>
            </div>
          </div>

          <div className="rounded-md border border-black/5 bg-white p-5 shadow-sm sm:p-6">
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
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#f0184f] text-sm font-bold text-white shadow-[0_12px_28px_rgba(240,24,79,0.2)] transition hover:bg-[#d91445]"
          >
            Submit Application
            <ArrowRight size={16} />
          </button>
        </section>
      </main>

      {isDescriptionOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#121d2d]/55 p-4">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-auto rounded-md bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-black/8 p-5 sm:p-7">
              <div>
                <h2 className="text-xl font-black sm:text-2xl">{job.role}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-lg font-bold">{job.company}</p>
                  <Link
                    href="/?view=company-profile"
                    className="text-xs font-bold text-[#f0184f] transition hover:text-[#d91445]"
                  >
                    Company profile
                  </Link>
                </div>
                <p className="mt-3 text-sm text-black/55">Kuala Lumpur, Malaysia · Hybrid · Full-time · {job.salary}</p>
              </div>
              <button onClick={() => setIsDescriptionOpen(false)} aria-label="Close job description" className="text-black/60 hover:text-[#f0184f]"><X /></button>
            </div>
            <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_240px]">
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
      {isSubmitOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f5]">
              <BriefcaseBusiness
                className="text-[#f0184f]"
                size={30}
              />
            </div>

            <h3 className="mt-6 text-center text-2xl font-black">
              Submit Application?
            </h3>

            <p className="mt-3 text-center text-sm text-black/60">
              Are you sure you want to submit your application for
              <span className="font-bold"> {job.role}</span>?
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setIsSubmitOpen(false)}
                className="rounded-lg border border-black/10 py-3 font-bold"
              >
                Cancel
              </button>

              <Link
                href="/?view=application-submitted"
                className="rounded-lg bg-[#f0184f] py-3 text-center font-bold text-white"
              >
                Submit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
