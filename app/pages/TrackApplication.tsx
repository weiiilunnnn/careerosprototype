"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Building2,
  Check,
  FileText,
  FolderOpen,
  ChevronRight,
  MapPin,
  Briefcase,
} from "lucide-react";

export default function TrackApplication() {
  const [isDescriptionOpen, setIsDescriptionOpen] =
    useState(false);
  const stages = [
    {
      title: "Applied",
      date: "Jun 5, 2026",
      completed: true,
    },
    {
      title: "Resume Reviewed",
      date: "Jun 6, 2026",
      completed: true,
    },
    {
      title: "Assessment",
      date: "Pending",
      completed: false,
    },
    {
      title: "Interview",
      date: "Pending",
      completed: false,
    },
    {
      title: "Offer",
      date: "Pending",
      completed: false,
    },
  ];

  const documents = [
    {
      title: "Resume",
      subtitle: "alex_resume.pdf",
    },
    {
      title: "Portfolio",
      subtitle: "portfolio.pdf",
    },
    {
      title: "Certificates",
      subtitle: "3 Documents",
    },
    {
      title: "Projects",
      subtitle: "2 Projects Included",
    },
  ];

  const completedStages = stages.filter(
    (stage) => stage.completed
  ).length;

  const progress =
    ((completedStages - 1) / (stages.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#FBFBFC]">
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Back */}
        <Link
          href="/?view=my-applications"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#E00046]"
        >
          <ArrowLeft size={16} />
          Back to My Applications
        </Link>

        {/* Header */}
        <section className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

          <div className="flex items-start gap-5">

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E00046] text-white">
              <Building2 size={36} />
            </div>

            <div>
              <h1 className="text-4xl font-black text-[#081433]">
                BI Analyst
              </h1>

              <p className="mt-1 text-lg font-bold text-[#081433]">
                Fintech Company
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#64748B]">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  Kuala Lumpur
                </span>

                <span className="flex items-center gap-1">
                  <Briefcase size={14} />
                  Hybrid
                </span>

                <span>RM4,000 - RM5,500</span>
              </div>

              <p className="mt-3 text-sm text-[#64748B]">
                Applied 3 days ago • APP-2025-0612
              </p>
            </div>

          </div>

          <div className="flex items-stretch gap-3">



        <div className="flex h-14 min-w-[190px] flex-col items-center justify-center rounded-xl border border-[#DCE7FF] bg-[#F7FAFF] px-6">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
            Current Status
        </p>

        <p className="text-base font-black text-[#3575FF]">
            Resume Reviewed
        </p>
        </div>

          </div>

        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">

          {/* LEFT */}
          <div className="space-y-6">

            {/* Progress */}
            <div className="rounded-3xl border border-[#E5E8F0] bg-white p-7 shadow-sm">

              <div className="mb-10 flex items-center justify-between">

                <h2 className="text-2xl font-black text-[#081433]">
                  Application Progress
                </h2>

                <span className="rounded-full bg-[#FFF2F6] px-4 py-2 text-sm font-bold text-[#E00046]">
                  40% Complete
                </span>

              </div>

            <div className="relative">

            {/* Track */}
            <div
                className="absolute top-5 h-[2px] bg-[#E8EDF5]"
                style={{
                left: "20px",
                right: "20px",
                }}
            />

            {/* Active Track */}
            <div
                className="absolute top-5 h-[2px] bg-[#E00046]"
                style={{
                left: "20px",
                width: `calc(${progress}% - 20px)`,
                }}
            />

            <div className="relative flex justify-between">
                {stages.map((stage) => (
                <div
                    key={stage.title}
                    className="flex flex-col items-center text-center"
                >
                    <div
                    className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white ${
                        stage.completed
                        ? "border-[#E00046]"
                        : "border-[#CBD5E1]"
                    }`}
                    >
                    {stage.completed ? (
                        <Check
                        size={16}
                        className="text-[#E00046]"
                        />
                    ) : (
                        <div className="h-3 w-3 rounded-full bg-[#CBD5E1]" />
                    )}
                    </div>

                    <p className="mt-4 font-bold text-[#081433]">
                    {stage.title}
                    </p>

                    <p className="mt-1 text-sm text-[#64748B]">
                    {stage.date}
                    </p>
                </div>
                ))}
            </div>

            </div>

            </div>

            {/* Timeline */}
            <div className="rounded-3xl border border-[#E5E8F0] bg-white p-7 shadow-sm">

              <h2 className="mb-8 text-2xl font-black text-[#081433]">
                Application Timeline
              </h2>

              <div className="space-y-8">

                {[
                  {
                    title: "Application Submitted",
                    desc: "Your application has been successfully submitted.",
                    date: "Jun 5, 2026",
                    complete: true,
                  },
                  {
                    title: "Resume Reviewed",
                    desc: "Reviewed by hiring manager.",
                    date: "Jun 6, 2026",
                    complete: true,
                  },
                  {
                    title: "Assessment",
                    desc: "Waiting for assessment invitation.",
                    complete: false,
                  },
                  {
                    title: "Interview",
                    desc: "Waiting for interview invitation.",
                    complete: false,
                  },
                  {
                    title: "Offer",
                    desc: "Awaiting final hiring decision.",
                    complete: false,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4"
                  >
                    <div
                      className={`mt-2 h-4 w-4 rounded-full ${
                        item.complete
                          ? "bg-[#E00046]"
                          : "border-2 border-slate-300"
                      }`}
                    />

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-[#081433]">
                          {item.title}
                        </h3>

                        {item.date && (
                          <span className="text-sm text-[#64748B]">
                            {item.date}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-[#64748B]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="rounded-3xl border border-[#E5E8F0] bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">
              <FolderOpen
                size={20}
                className="text-[#E00046]"
              />

              <h2 className="text-2xl font-black text-[#081433]">
                Application Package
              </h2>
            </div>

            <div className="space-y-3">

              {documents.map((doc) => (
                <button
                  key={doc.title}
                  className="flex w-full items-center justify-between rounded-2xl border border-[#E5E8F0] p-4 transition hover:border-[#E00046]/30 hover:bg-[#FFF8FA]"
                >
                  <div className="flex items-stretch gap-3">

                    <FileText
                      size={18}
                      className="text-[#E00046]"
                    />

                    <div className="text-left">
                      <p className="font-bold text-[#081433]">
                        {doc.title}
                      </p>

                      <p className="text-sm text-[#64748B]">
                        {doc.subtitle}
                      </p>
                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-400"
                  />
                </button>
              ))}

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

