import Link from "next/link";

import {
  ArrowLeft,
  Check,
  MapPin,
  Briefcase,
  Clock3,
  ListChecks,
  Target,
} from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";

export default function TrackApplication() {
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

  const jobHighlights = [
    {
      title: "Role focus",
      detail:
        "Transform business data into dashboards, reports, and recommendations for product and operations teams.",
    },
    {
      title: "Why you match",
      detail:
        "Your Power BI, SQL, Python, and dashboard project evidence lines up with the BI Analyst path.",
    },
    {
      title: "Main gap",
      detail:
        "The employer may still want stronger stakeholder reporting examples and assessment performance.",
    },
  ];

  const responsibilities = [
    "Build and maintain dashboards for business performance tracking.",
    "Analyze datasets to identify trends, risks, and opportunities.",
    "Work with stakeholders to translate business questions into reports.",
    "Present findings clearly so teams can make better decisions.",
  ];

  const nextPreparation = [
    {
      title: "Prepare for assessment",
      detail: "Revise SQL joins, dashboard interpretation, and simple business case questions.",
    },
    {
      title: "Strengthen talking points",
      detail: "Use your Sales Performance Dashboard as the main evidence story.",
    },
    {
      title: "Follow-up timing",
      detail: "If there is no update after 5 working days, send a concise follow-up email.",
    },
  ];

  const completedStages = stages.filter(
    (stage) => stage.completed
  ).length;

  const progress = (completedStages / stages.length) * 100;

  return (
    <div className="min-h-screen bg-[#FBFBFC]">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">

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

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

            <CompanyLogo company="Grab" size="lg" />

            <div>
              <h1 className="text-3xl font-black text-[#081433] sm:text-4xl">
                BI Analyst
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-lg font-bold text-[#081433]">
                  Grab
                </p>
                <Link
                  href="/?view=company-profile"
                  className="text-xs font-bold text-[#E00046] transition hover:text-[#C5003E]"
                >
                  View company profile
                </Link>
              </div>

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

          <div className="flex w-full items-stretch gap-3 sm:w-auto">



        <div className="flex h-14 w-full flex-col items-center justify-center rounded-xl border border-[#DCE7FF] bg-[#F7FAFF] px-6 sm:min-w-[190px]">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
            Current Status
        </p>

        <p className="text-base font-black text-[#3575FF]">
            Resume Reviewed
        </p>
        </div>

          </div>

        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">

          {/* LEFT */}
          <div className="space-y-6">

            <div className="rounded-3xl border border-[#E5E8F0] bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-2xl font-black text-[#081433]">
                Job Description
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#64748B]">
                As a BI Analyst, you will transform business data into actionable
                insights through dashboard development and stakeholder reporting.
                You will work closely with cross-functional teams to understand
                business needs and deliver data-driven solutions.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {jobHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#E5E8F0] bg-[#FAFBFC] p-4"
                  >
                    <p className="text-sm font-black text-[#081433]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#64748B]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5E8F0] bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-2xl font-black text-[#081433]">
                Role Requirements
              </h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-black text-[#081433]">
                    <ListChecks className="h-5 w-5 text-[#E00046]" />
                    Key responsibilities
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-[#64748B]">
                    {responsibilities.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#E00046]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-base font-black text-[#081433]">
                    <Target className="h-5 w-5 text-[#E00046]" />
                    What to prepare next
                  </h3>
                  <div className="mt-4 space-y-3">
                    {nextPreparation.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-[#F5CBD6] bg-[#FFF7FA] p-4"
                      >
                        <p className="text-sm font-black text-[#081433]">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#64748B]">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#E5E8F0] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-[#081433]">
                    Application Progress
                  </h2>
                  <p className="mt-2 text-sm text-[#64748B]">
                    Your application is currently waiting for the next assessment step.
                  </p>
                </div>
                <span className="rounded-full bg-[#FFF2F6] px-4 py-2 text-sm font-bold text-[#E00046]">
                  40%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#E8EDF5]">
                <div
                  className="h-full rounded-full bg-[#E00046]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-6 space-y-4">
                {stages.map((stage) => (
                  <div
                    key={stage.title}
                    className="flex items-center gap-3 rounded-2xl border border-[#E5E8F0] p-4"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                        stage.completed
                          ? "border-[#E00046] bg-[#FFF2F6]"
                          : "border-[#CBD5E1] bg-white"
                      }`}
                    >
                      {stage.completed ? (
                        <Check size={16} className="text-[#E00046]" />
                      ) : (
                        <Clock3 size={16} className="text-[#94A3B8]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#081433]">{stage.title}</p>
                      <p className="mt-1 text-sm text-[#64748B]">{stage.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5E8F0] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-6 text-2xl font-black text-[#081433]">
                Application Timeline
              </h2>

              <div className="space-y-6">
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
                  <div key={item.title} className="flex gap-4">
                    <div
                      className={`mt-2 h-4 w-4 rounded-full ${
                        item.complete
                          ? "bg-[#E00046]"
                          : "border-2 border-slate-300"
                      }`}
                    />

                    <div className="flex-1">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-[#081433]">
                          {item.title}
                        </h3>

                        {item.date && (
                          <span className="text-sm text-[#64748B]">
                            {item.date}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-[#64748B]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
