import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Clock3,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { getCompanyProfile } from "@/lib/companyProfileData";
import { getWorkAnimal } from "@/lib/workAnimals";

export default function CompanyProfile() {
  const company = getCompanyProfile();

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-[#152238]">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <Link
          href="/?view=jobapplication"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#59657A] transition hover:text-[#E00046]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to job
        </Link>

        <section className="overflow-hidden rounded-[28px] border border-[#E5E8F0] bg-white shadow-[0_24px_70px_rgba(8,20,51,0.08)]">
          <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:p-10">
            <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(110deg,#FFF2F6,#FFFFFF_48%,#EEF4FF)]" />
            <div className="relative z-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-[#081433] text-2xl font-black text-white shadow-[0_18px_34px_rgba(8,20,51,0.18)]">
                  {company.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {company.verified && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified company
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      <Star className="h-3.5 w-3.5" />
                      {company.tier} employer
                    </span>
                  </div>
                  <h1 className="mt-4 text-4xl font-semibold tracking-normal text-[#081433] sm:text-5xl">
                    {company.name}
                  </h1>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-[#59657A]">
                    {company.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium text-[#59657A]">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E8F0] bg-white px-3 py-1.5">
                      <Building2 className="h-4 w-4 text-[#E00046]" />
                      {company.industry}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E8F0] bg-white px-3 py-1.5">
                      <MapPin className="h-4 w-4 text-[#E00046]" />
                      {company.location}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E8F0] bg-white px-3 py-1.5">
                      <UsersRound className="h-4 w-4 text-[#E00046]" />
                      {company.size}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SnapshotCard icon={ShieldCheck} label="Hiring score" value={`${company.hiringScore}%`} />
                <SnapshotCard icon={MessageSquareText} label="Response rate" value={`${company.responseRate}%`} />
                <SnapshotCard icon={Clock3} label="Average reply" value={company.averageReply} />
                <SnapshotCard icon={BriefcaseBusiness} label="CareerOS hires" value={String(company.hiredThroughCareerOS)} />
              </div>
            </div>

            <aside className="relative z-10 rounded-3xl border border-[#E5E8F0] bg-white/90 p-5 shadow-[0_18px_46px_rgba(8,20,51,0.08)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B95A7]">
                Candidate fit insight
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#081433]">
                Strong for analytical builders
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#59657A]">
                Based on your CareerOS profile, this company looks strongest if you enjoy structured analysis, stakeholder reporting, and turning data into product or business decisions.
              </p>
              <div className="mt-5 rounded-2xl border border-[#F5CBD6] bg-[#FFF7FA] p-4">
                <p className="text-sm font-semibold text-[#081433]">Best preparation angle</p>
                <p className="mt-2 text-sm leading-6 text-[#59657A]">
                  Lead with dashboard evidence, SQL confidence, and one example where your analysis changed a decision.
                </p>
              </div>
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Open roles page coming soon"
                className="mt-5 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-2xl border border-[#E5E8F0] bg-[#F1F3F7] px-4 text-sm font-semibold text-[#8B95A7]"
              >
                Open roles coming soon
              </button>
            </aside>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-5">
            <Panel title="About the company">
              <p className="text-sm leading-7 text-[#59657A]">
                {company.name} works on fintech products where business users need clear reporting, dependable workflow, and fast access to financial insight. The team is currently hiring around analytics, product, and operational intelligence.
              </p>
              <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8B95A7]">Mission</p>
                <p className="mt-2 text-sm font-semibold text-[#081433]">{company.mission}</p>
              </div>
            </Panel>

            <Panel title="Hiring process">
              <div className="grid gap-3 md:grid-cols-2">
                {company.hiringProcess.map((item, index) => (
                  <div key={item.step} className="rounded-2xl border border-[#E5E8F0] bg-white p-4">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF2F6] text-xs font-black text-[#E00046]">
                      {index + 1}
                    </span>
                    <p className="mt-3 font-semibold text-[#081433]">{item.step}</p>
                    <p className="mt-2 text-sm leading-6 text-[#59657A]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Open roles">
              <div className="space-y-3">
                {company.openRoles.map((role) => (
                  <Link
                    key={role.title}
                    href="/?view=jobapplication"
                    className="flex flex-col gap-4 rounded-2xl border border-[#E5E8F0] bg-white p-4 transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[#081433]">{role.title}</p>
                      <p className="mt-1 text-sm text-[#59657A]">
                        {role.location} · {role.workMode} · {role.salary}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[#FFF2F6] px-3 py-1 text-sm font-semibold text-[#E00046]">
                        {role.match}% match
                      </span>
                      <ArrowRight className="h-4 w-4 text-[#E00046]" />
                    </div>
                  </Link>
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Team work style">
              <div className="space-y-3">
                {company.workStyle.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-[#F8FAFC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8B95A7]">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-[#081433]">{item.value}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Team trait mix">
              <div className="space-y-4">
                {company.teamTraits.map((trait) => {
                  const animal = getWorkAnimal(trait.slug);
                  return (
                    <div key={trait.slug}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#FFF2F6] text-xl">
                            {animal?.emoji ?? "•"}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#081433]">
                              {animal?.name ?? trait.slug}
                            </p>
                            <p className="truncate text-xs text-[#59657A]">{trait.label}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#E00046]">{trait.percent}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF2F7]">
                        <div className="h-full rounded-full bg-[#E00046]" style={{ width: `${trait.percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <Panel title="Company proof">
              <ul className="space-y-3">
                {company.proofPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-6 text-[#59657A]">
                    <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#E00046]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </section>
      </main>
    </div>
  );
}

function SnapshotCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E8F0] bg-white p-4">
      <Icon className="h-4 w-4 text-[#E00046]" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#8B95A7]">{label}</p>
      <p className="mt-1 text-xl font-semibold text-[#081433]">{value}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-[#E5E8F0] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold text-[#081433]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
