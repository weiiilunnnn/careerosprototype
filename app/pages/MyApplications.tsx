"use client";

import Link from "next/link";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  MapPin,
} from "lucide-react";

const theme = {
  navy: "#081433",
  muted: "#46536D",
  rose: "#E00046",
  soft: "#FFF2F6",
  border: "#E5E8F0",
};

export default function MyApplications() {
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
    <div className="min-h-screen bg-[#fbfbfc]">
      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-black tracking-tight"
            style={{ color: theme.navy }}
          >
            My Applications
          </h1>

          <p
            className="mt-3 max-w-3xl text-base font-medium"
            style={{ color: theme.muted }}
          >
            Track your applications, monitor progress, and manage saved
            opportunities in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-5 grid gap-5 md:grid-cols-2">

          <div
            className="rounded-2xl border bg-white p-5 shadow-sm"
            style={{ borderColor: theme.border }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: theme.soft }}
              >
                <BriefcaseBusiness
                  size={22}
                  style={{ color: theme.rose }}
                />
              </div>

              <div>
                <p
                  className="text-2xl font-black"
                  style={{ color: theme.navy }}
                >
                  18
                </p>

                <p
                  className="text-sm font-medium"
                  style={{ color: theme.muted }}
                >
                  Applications Submitted
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl border bg-white p-5 shadow-sm"
            style={{ borderColor: theme.border }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: theme.soft }}
              >
                <Bookmark
                  size={22}
                  style={{ color: theme.rose }}
                />
              </div>

              <div>
                <p
                  className="text-2xl font-black"
                  style={{ color: theme.navy }}
                >
                  12
                </p>

                <p
                  className="text-sm font-medium"
                  style={{ color: theme.muted }}
                >
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
            className="rounded-2xl border bg-white p-6 shadow-sm"
            style={{ borderColor: theme.border }}
          >
            <div className="mb-5 flex items-center justify-between">

              <h2
                className="text-xl font-black"
                style={{ color: theme.navy }}
              >
                My Applications
              </h2>

              <button
                className="text-sm font-bold"
                style={{ color: theme.rose }}
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {applications.map((job) => (
                <Link
                    key={job.title}
                    href="/?view=track-application"
                    className="block rounded-xl border p-4 transition hover:border-[#E00046]/20 hover:bg-slate-50"
                    style={{ borderColor: theme.border }}
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-4">

                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: theme.rose }}
                      >
                        <Building2 size={22} />
                      </div>

                      <div>
                        <h3
                          className="text-lg font-black"
                          style={{ color: theme.navy }}
                        >
                          {job.title}
                        </h3>

                        <p
                          className="mt-1 text-sm font-semibold"
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
                      </div>
                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className="rounded-lg px-3 py-2 text-xs font-bold"
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
            className="rounded-2xl border bg-white p-6 shadow-sm"
            style={{ borderColor: theme.border }}
          >
            <div className="mb-5 flex items-center justify-between">

              <h2
                className="text-xl font-black"
                style={{ color: theme.navy }}
              >
                Saved Jobs
              </h2>

              <button
                className="text-sm font-bold"
                style={{ color: theme.rose }}
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div
                  key={job.title}
                  className="rounded-xl border p-4"
                  style={{ borderColor: theme.border }}
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-4">

                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: theme.rose }}
                      >
                        <Building2 size={22} />
                      </div>

                      <div>
                        <h3
                          className="text-lg font-black"
                          style={{ color: theme.navy }}
                        >
                          {job.title}
                        </h3>

                        <p
                          className="mt-1 text-sm font-semibold"
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
                      </div>
                    </div>

                    <div className="flex gap-2">


                      <Link
                        href="/?view=jobapplication"
                        className="rounded-lg px-4 py-2 text-sm font-bold text-white"
                        style={{ backgroundColor: theme.rose }}
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