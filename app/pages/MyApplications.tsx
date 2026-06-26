"use client";

import Link from "next/link";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  MapPin,
  Sparkles,
} from "lucide-react";
import { candidateLivingCv } from "@/lib/candidateLivingCvData";
import { getWorkAnimal } from "@/lib/workAnimals";

const theme = {
  navy: "#081433",
  deepNavy: "#152238",
  muted: "#46536D",
  rose1: "#F04D7A",
  rose2: "#E00046",
  soft: "#FFF2F6",
  line: "#F5CBD6",
  border: "#E5E8F0",
} as const;

export default function MyApplications() {
  const candidateAnimal = getWorkAnimal(candidateLivingCv.workAnimal);
  const applications = [
    {
      title: "BI Analyst",
      company: "Fintech Company",
      location: "Kuala Lumpur",
      salary: "RM4,000 - RM5,500",
      applied: "3 days ago",
    },
    {
      title: "Data Analyst",
      company: "DataVision Sdn Bhd",
      location: "Petaling Jaya",
      salary: "RM3,800 - RM5,000",
      applied: "1 week ago",
    },
    {
      title: "Business Intelligence Analyst",
      company: "Analytics Plus",
      location: "Remote",
      salary: "RM4,500 - RM6,000",
      applied: "2 weeks ago",
    },
  ];

  const savedJobs = [
    {
      title: "Data Analyst",
      company: "Tech Startup",
      location: "Kuala Lumpur",
      salary: "RM4,500 - RM6,000",
      saved: "2 days ago",
    },
    {
      title: "Product Analyst",
      company: "Fintech Company",
      location: "Kuala Lumpur",
      salary: "RM5,000 - RM7,000",
      saved: "Yesterday",
    },
    {
      title: "BI Developer",
      company: "DataVision Sdn Bhd",
      location: "Petaling Jaya",
      salary: "RM4,000 - RM5,500",
      saved: "3 days ago",
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#fbfbfc] text-[#152238]"
      style={{
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8">

        {/* Header */}
        <div
          className="relative mb-5 overflow-hidden rounded-2xl text-white shadow-[0_18px_40px_rgba(21,34,56,0.18)]"
        >
          <img
            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1800&q=80"
            alt="Application planning desk"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081433]/95 via-[#081433]/82 to-[#081433]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081433]/70 via-transparent to-transparent" />

          <div className="relative z-10 p-5 sm:p-8">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                Application tracker
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                Saved opportunities
              </span>
            </div>
            <h1
              className="text-3xl font-semibold tracking-normal text-white sm:text-4xl md:text-5xl"
            >
              My Applications
            </h1>

            <p
              className="mt-5 max-w-3xl text-sm leading-7 text-white/75 md:text-base"
            >
              Track your applications, monitor progress, and manage saved
              opportunities in one place.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/[0.12] px-4 py-4 shadow-sm backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-white/65">
                  <BriefcaseBusiness className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em]">
                    Submitted
                  </span>
                </div>
                <p className="text-base font-semibold text-white">18</p>
                <p className="mt-1 text-xs font-medium text-white/65">
                  Applications Submitted
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/[0.12] px-4 py-4 shadow-sm backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-white/65">
                  <Bookmark className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em]">
                    Saved
                  </span>
                </div>
                <p className="text-base font-semibold text-white">12</p>
                <p className="mt-1 text-xs font-medium text-white/65">
                  Saved Jobs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-5 xl:grid-cols-2">

          {/* Applications */}
          <section
            className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
            style={{ borderColor: theme.border }}
          >
            <div className="mb-5 flex items-center justify-between">

              <h2
                className="text-xl font-semibold"
                style={{ color: theme.navy }}
              >
                My Applications
              </h2>

              <button
                className="text-sm font-semibold"
                style={{ color: theme.rose2 }}
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {applications.map((job) => (
                <Link
                    key={job.title}
                    href="/?view=track-application"
                    className="block rounded-xl border p-4 transition hover:border-[#F04D7A] hover:bg-[#FFF7FA]"
                    style={{ borderColor: theme.border }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex min-w-0 gap-4">

                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: theme.rose2 }}
                      >
                        <Building2 size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: theme.navy }}
                        >
                          {job.title}
                        </h3>

                        <p
                          className="mt-1 text-sm font-medium"
                          style={{ color: theme.muted }}
                        >
                          {job.company}
                        </p>

                        <div
                          className="mt-3 flex flex-wrap gap-3 text-sm"
                          style={{ color: theme.muted }}
                        >
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location}
                          </span>

                          <span>{job.salary}</span>
                        </div>

                        <p
                          className="mt-3 text-sm"
                          style={{ color: theme.muted }}
                        >
                          Applied {job.applied}
                        </p>

                        {candidateAnimal && (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#FFF2F6] px-3 py-1.5 text-xs font-semibold text-[#E00046]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Your trait: {candidateAnimal.emoji} {candidateAnimal.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-start">

                      <span
                        className="rounded-lg px-3 py-2 text-xs font-semibold"
                        style={{
                          backgroundColor: "#EDF4FF",
                          color: "#3575FF",
                        }}
                      >
                        Applied
                      </span>

                      <ChevronRight
                        size={18}
                        color="#94A3B8"
                      />
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Saved Jobs */}
          <section
            className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
            style={{ borderColor: theme.border }}
          >
            <div className="mb-5 flex items-center justify-between">

              <h2
                className="text-xl font-semibold"
                style={{ color: theme.navy }}
              >
                Saved Jobs
              </h2>

              <button
                className="text-sm font-semibold"
                style={{ color: theme.rose2 }}
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div
                  key={job.title}
                  className="rounded-xl border p-4 transition hover:border-[#F04D7A] hover:bg-[#FFF7FA]"
                  style={{ borderColor: theme.border }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex min-w-0 gap-4">

                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: theme.rose2 }}
                      >
                        <Building2 size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: theme.navy }}
                        >
                          {job.title}
                        </h3>

                        <p
                          className="mt-1 text-sm font-medium"
                          style={{ color: theme.muted }}
                        >
                          {job.company}
                        </p>

                        <div
                          className="mt-3 flex flex-wrap gap-3 text-sm"
                          style={{ color: theme.muted }}
                        >
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location}
                          </span>

                          <span>{job.salary}</span>
                        </div>

                        <p
                          className="mt-3 text-sm"
                          style={{ color: theme.muted }}
                        >
                          Saved {job.saved}
                        </p>

                        {candidateAnimal && (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#FFF2F6] px-3 py-1.5 text-xs font-semibold text-[#E00046]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Your trait: {candidateAnimal.emoji} {candidateAnimal.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2 sm:flex">


                      <Link
                        href="/?view=jobapplication"
                        className="rounded-lg px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_10px_22px_rgba(224,0,70,0.18)]"
                        style={{ backgroundColor: theme.rose2 }}
                      >
                        Apply Now
                      </Link>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </main>
    </div>
  );
}
