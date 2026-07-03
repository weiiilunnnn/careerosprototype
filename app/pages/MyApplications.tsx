"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  BriefcaseBusiness,
  ChevronRight,
  MapPin,
  Target,
} from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";

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
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [showAllSavedJobs, setShowAllSavedJobs] = useState(false);
  const applications = [
    {
      title: "BI Analyst",
      company: "Grab",
      location: "Kuala Lumpur",
      salary: "RM4,000 - RM5,500",
      applied: "3 days ago",
      currentStep: "Resume Reviewed",
      nextUpdate: "Waiting for assessment invitation",
      progress: 40,
      statusColor: "#3575FF",
      statusBg: "#EDF4FF",
    },
    {
      title: "Data Analyst",
      company: "Maybank",
      location: "Petaling Jaya",
      salary: "RM3,800 - RM5,000",
      applied: "1 week ago",
      currentStep: "Assessment",
      nextUpdate: "Assessment not completed yet",
      progress: 60,
      statusColor: "#C66A00",
      statusBg: "#FFF6E6",
    },
    {
      title: "Business Intelligence Analyst",
      company: "CIMB",
      location: "Remote",
      salary: "RM4,500 - RM6,000",
      applied: "2 weeks ago",
      currentStep: "Interview",
      nextUpdate: "Waiting for interview scheduling",
      progress: 75,
      statusColor: "#0F8A5F",
      statusBg: "#EAFBF4",
    },
    {
      title: "Junior Data Analyst",
      company: "Shopee",
      location: "Kuala Lumpur",
      salary: "RM3,600 - RM4,800",
      applied: "3 weeks ago",
      currentStep: "Assessment",
      nextUpdate: "Assessment result pending",
      progress: 60,
      statusColor: "#C66A00",
      statusBg: "#FFF6E6",
    },
    {
      title: "Reporting Analyst",
      company: "AirAsia",
      location: "Subang Jaya",
      salary: "RM3,900 - RM5,200",
      applied: "1 month ago",
      currentStep: "Interview",
      nextUpdate: "Waiting for second interview confirmation",
      progress: 75,
      statusColor: "#0F8A5F",
      statusBg: "#EAFBF4",
    },
  ];

  const savedJobs = [
    {
      title: "Data Analyst",
      company: "Maxis",
      location: "Kuala Lumpur",
      salary: "RM4,500 - RM6,000",
      saved: "2 days ago",
      match: 86,
    },
    {
      title: "Product Analyst",
      company: "Grab",
      location: "Kuala Lumpur",
      salary: "RM5,000 - RM7,000",
      saved: "Yesterday",
      match: 78,
    },
    {
      title: "BI Developer",
      company: "Maybank",
      location: "Petaling Jaya",
      salary: "RM4,000 - RM5,500",
      saved: "3 days ago",
      match: 82,
    },
    {
      title: "Analytics Associate",
      company: "Shopee",
      location: "Kuala Lumpur",
      salary: "RM3,700 - RM5,100",
      saved: "4 days ago",
      match: 80,
    },
    {
      title: "Junior Business Analyst",
      company: "CIMB",
      location: "Remote",
      salary: "RM4,200 - RM5,800",
      saved: "1 week ago",
      match: 74,
    },
  ];
  const visibleApplications = showAllApplications
    ? applications
    : applications.slice(0, 3);
  const visibleSavedJobs = showAllSavedJobs ? savedJobs : savedJobs.slice(0, 3);

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
                type="button"
                onClick={() => setShowAllApplications((current) => !current)}
                className="text-sm font-semibold"
                style={{ color: theme.rose2 }}
              >
                {showAllApplications ? "Show Less" : "View All"}
              </button>
            </div>

            <div className="space-y-4">
              {visibleApplications.map((job) => (
                <Link
                    key={job.title}
                    href="/?view=track-application"
                    className="block rounded-xl border p-4 transition hover:border-[#F04D7A] hover:bg-[#FFF7FA]"
                    style={{ borderColor: theme.border }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex min-w-0 gap-4">

                      <CompanyLogo company={job.company} size="md" />

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

                        <div className="mt-4 rounded-xl border border-[#E5E8F0] bg-[#FAFBFC] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-bold uppercase tracking-normal text-[#64748B]">
                              Current step
                            </p>
                            <span className="text-xs font-black text-[#081433]">
                              {job.progress}%
                            </span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8EDF5]">
                            <div
                              className="h-full rounded-full bg-[#E00046]"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <p className="mt-3 text-sm font-bold text-[#081433]">
                            {job.currentStep}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#64748B]">
                            Next update: {job.nextUpdate}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-start">

                      <span
                        className="rounded-lg px-3 py-2 text-xs font-semibold"
                        style={{
                          backgroundColor: job.statusBg,
                          color: job.statusColor,
                        }}
                      >
                        {job.currentStep}
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
                type="button"
                onClick={() => setShowAllSavedJobs((current) => !current)}
                className="text-sm font-semibold"
                style={{ color: theme.rose2 }}
              >
                {showAllSavedJobs ? "Show Less" : "View All"}
              </button>
            </div>

            <div className="space-y-4">
              {visibleSavedJobs.map((job) => (
                <div
                  key={job.title}
                  className="rounded-xl border p-4 transition hover:border-[#F04D7A] hover:bg-[#FFF7FA]"
                  style={{ borderColor: theme.border }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex min-w-0 gap-4">

                      <CompanyLogo company={job.company} size="md" />

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

                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FFF2F6] px-3 py-1.5 text-xs font-semibold text-[#E00046]">
                          <Target className="h-3.5 w-3.5" />
                          {job.match}% matched with your profile
                        </div>
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
