"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  Clock,
  GraduationCap,
  Search,
  Share2,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AnimatedCard, AnimatedList, AnimatedRow, AnimatedSection } from "./UniversityMotion";
import { ProjectLogo, projects, statusTone } from "./industryData";

const tabs = [
  { label: "All Projects", statuses: null },
  { label: "Open for Application", statuses: ["Open"] },
  { label: "In Progress", statuses: ["In Progress"] },
  { label: "Completed", statuses: ["Completed"] },
  { label: "Past Projects", statuses: ["Completed", "Closed"] },
] as const;

type ProjectTab = (typeof tabs)[number]["label"];

const matches = [
  ["Jason Tan", "BSc Data Science • Year 3", "92%"],
  ["Sarah Lim", "BSc Computer Science • Year 3", "89%"],
  ["Ameer Hakim", "BSc Information Systems • Year 3", "87%"],
  ["Yi Xuan Ng", "BSc Data Analytics • Year 3", "85%"],
];

const activities: {
  title: string;
  detail: string;
  time: string;
  bg: string;
  icon: LucideIcon;
}[] = [
  { title: "Microsoft posted a new project", detail: "AI Dashboard Challenge", time: "2 hours ago", bg: "bg-[#efe7ff]", icon: BriefcaseBusiness },
  { title: "Shopee shortlisted 15 students", detail: "E-commerce Analytics Project", time: "5 hours ago", bg: "bg-[#ffe7e7]", icon: Users },
  { title: "24 students applied for projects", detail: "Across 3 active projects", time: "1 day ago", bg: "bg-[#e1f7eb]", icon: Users },
  { title: "Maybank completed project evaluation", detail: "Customer Insights Dashboard", time: "1 day ago", bg: "bg-[#fff0d9]", icon: CalendarDays },
  { title: "Petronas confirmed project kickoff", detail: "Sustainability Data Analysis", time: "2 days ago", bg: "bg-[#dbf7f3]", icon: Clock },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={className}>{children}</AnimatedCard>;
}

function TopBar() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-[#6733f4]">
            <Users size={27} />
          </span>
          <h1 className="text-3xl font-extrabold tracking-normal text-[#070a17] md:text-[34px]">Project Hub</h1>
        </div>
        <p className="mt-4 text-sm font-medium text-[#53607b]">
          Connect industry opportunities with the right students and drive real-world impact.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
        <button aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e8f1] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6b35ff] text-[10px] font-bold text-white">3</span>
        </button>
        <button className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#e6e8f1] bg-white px-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ececf4] bg-white text-base font-black text-[#e11d48]">T</div>
          <span className="text-left">
            <span className="block text-xs font-bold text-[#0b1020]">Dr. Melissa Lim</span>
            <span className="block text-xs font-medium text-[#53607b]">Career &amp; Industry Office</span>
          </span>
          <ChevronDown size={15} className="ml-4" />
        </button>
      </div>
    </header>
  );
}

function FilterBar() {
  const filters = ["All Industries", "All Project Types", "All Durations", "Status: All"];

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-normal text-[#53607b]">
            Filter Projects
          </h2>
          <p className="mt-1 text-xs font-medium text-[#65718d]">
            Refine opportunities before browsing active industry projects.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {filters.map((label) => (
            <button
              key={label}
              className="flex h-10 min-w-44 items-center justify-between rounded-xl border border-[#e3e6ef] bg-white px-3 text-xs font-semibold text-[#18213a] shadow-sm"
            >
              <span className="flex items-center gap-2">
                <BriefcaseBusiness size={15} />
                {label}
              </span>
              <ChevronDown size={14} />
            </button>
          ))}
        </div>
        <button className="h-10 rounded-xl bg-[#f6f2ff] px-4 text-xs font-bold text-[#6733f4] 2xl:shrink-0">
          Reset filters
        </button>
      </div>
    </Card>
  );
}

function ProjectRow({ project }: { project: (typeof projects)[number] }) {
  return (
    <AnimatedRow className="grid gap-4 border-b border-[#edf0f6] py-4 lg:grid-cols-[auto_1fr_80px_60px_80px_120px] lg:items-center">
      <ProjectLogo type={project.logo} />
      <div>
        <h3 className="text-sm font-extrabold text-[#090d1b]">{project.company}</h3>
        <p className="mt-1 text-xs font-bold text-[#26324d]">{project.title}</p>
        <p className="mt-2 max-w-xl text-xs font-medium leading-5 text-[#53607b]">{project.description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-lg bg-[#f4f3f8] px-2 py-1 text-[10px] font-semibold text-[#53607b]">{tag}</span>
          ))}
        </div>
      </div>
      <div className="text-xs font-semibold text-[#26324d]"><b>{project.duration}</b><br /><span className="font-medium text-[#53607b]">Duration</span></div>
      <div className="text-xs font-semibold text-[#26324d]"><b>{project.slots}</b><br /><span className="font-medium text-[#53607b]">Slots</span></div>
      <div className="text-xs font-semibold text-[#26324d]"><b>{project.support}</b><br /><span className="font-medium text-[#53607b]">Support</span></div>
      <div className="rounded-xl border border-[#e6e8f1] p-2 text-center">
        <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${statusTone[project.status] ?? "bg-[#e8f2ff] text-[#2563eb]"}`}>{project.status}</span>
        <p className="mt-2 text-[10px] font-medium text-[#53607b]">{project.days}</p>
        <Link
          href={`/university/industry/${project.slug}`}
          className="mt-2 flex h-8 w-full items-center justify-center rounded-lg bg-[#f6f2ff] text-[10px] font-bold text-[#5b21f3] transition hover:bg-[#efe4ff]"
        >
          View Details
        </Link>
      </div>
    </AnimatedRow>
  );
}

function ProjectBoard() {
  const [activeTab, setActiveTab] = useState<ProjectTab>("All Projects");
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    const tab = tabs.find((item) => item.label === activeTab);
    const byStatus = tab?.statuses
      ? projects.filter((project) => (tab.statuses as readonly string[]).includes(project.status))
      : projects;
    const query = search.trim().toLowerCase();

    if (!query) return byStatus;

    return byStatus.filter(
      (project) =>
        project.company.toLowerCase().includes(query) || project.title.toLowerCase().includes(query),
    );
  }, [activeTab, search]);

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 border-b border-[#edf0f6] pb-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-7 text-xs font-bold text-[#53607b]">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(tab.label)}
              aria-pressed={activeTab === tab.label}
              className={`transition ${activeTab === tab.label ? "text-[#5b21f3]" : "hover:text-[#34415e]"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <label className="flex h-9 min-w-[280px] items-center gap-2 rounded-xl border border-[#e6e8f1] bg-white px-3 text-xs font-medium text-[#65718d] focus-within:border-[#c9b6ff]">
            <Search size={15} className="shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects or companies..."
              className="w-full bg-transparent text-xs font-medium text-[#26324d] outline-none placeholder:text-[#65718d]"
            />
          </label>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e6e8f1] bg-white text-[#34415e]">
            <Share2 size={15} />
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <div>
          <AnimatedList key={`${activeTab}-${search}`}>
            {filteredProjects.map((project) => <ProjectRow key={project.company} project={project} />)}
          </AnimatedList>
          {filteredProjects.length === 0 ? (
            <p className="py-8 text-center text-xs font-medium text-[#65718d]">
              {search.trim() ? `No projects matching "${search}".` : "No projects in this view yet."}
            </p>
          ) : null}
        </div>
        <aside className="space-y-4 border-t border-[#edf0f6] pt-4 xl:border-l xl:border-t-0 xl:pl-4">
          <Card className="p-4 shadow-none">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#090d1b]">Recommended Student Matches</h2>
              <button className="text-xs font-bold text-[#5b21f3]">View all</button>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <ProjectLogo type="microsoft" />
              <div>
                <p className="text-sm font-extrabold">AI Dashboard Challenge</p>
                <p className="text-xs font-medium text-[#53607b]">12 weeks • 24 slots</p>
              </div>
              <span className="ml-auto rounded-full bg-[#e1f7eb] px-3 py-1 text-[10px] font-bold text-[#16a34a]">Open</span>
            </div>
            <div className="space-y-3">
              <AnimatedList className="space-y-3">
                {matches.map(([name, meta, score], index) => (
                  <AnimatedRow key={name} className="grid grid-cols-[32px_1fr_90px_80px] items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f2ff] text-xs font-black text-[#34415e]">{name[0]}</div>
                    <div>
                      <p className="text-xs font-bold text-[#090d1b]">{name}</p>
                      <p className="text-[10px] font-medium text-[#53607b]">{meta}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#53607b]">Skill match</p>
                      <div className="mt-1 h-1.5 rounded-full bg-[#eee7ff]"><div className="h-1.5 rounded-full bg-[#8b5cf6]" style={{ width: `${92 - index * 3}%` }} /></div>
                    </div>
                    <button className="h-7 rounded-lg bg-[#f6f2ff] text-[10px] font-bold text-[#5b21f3]">View Profile</button>
                    <span className="col-start-3 text-right text-[10px] font-bold text-[#16a34a]">{score}</span>
                  </AnimatedRow>
                ))}
              </AnimatedList>
            </div>
            <button className="mt-4 h-9 w-full rounded-lg bg-[#f6f2ff] text-xs font-bold text-[#5b21f3]">View All Matching Students</button>
          </Card>

          <Card className="p-4 shadow-none">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#090d1b]">Recent Activity</h2>
              <button className="text-xs font-bold text-[#5b21f3]">View all</button>
            </div>
            <div className="space-y-3">
              <AnimatedList className="space-y-3">
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <AnimatedRow key={activity.title} className="grid grid-cols-[32px_1fr_auto] gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${activity.bg} text-[#6733f4]`}>
                        <Icon size={16} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#090d1b]">{activity.title}</p>
                        <p className="text-[10px] font-medium text-[#53607b]">{activity.detail}</p>
                      </div>
                      <span className="text-[10px] font-medium text-[#53607b]">{activity.time}</span>
                    </AnimatedRow>
                  );
                })}
              </AnimatedList>
            </div>
          </Card>
        </aside>
      </div>
    </Card>
  );
}

function BottomCards() {
  const cards = [
    ["For Employers", "Access top student talent, fresh ideas, and research support for your projects.", "Learn more", Building2],
    ["Success Stories", "See how industry projects created real impact for companies and students.", "View stories", Sparkles],
    ["Partnership Benefits", "Build long-term talent pipelines and strengthen university-industry collaboration.", "Explore benefits", GraduationCap],
  ] as const;

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {cards.map(([title, body, action, Icon]) => (
        <Card key={title} className="p-5">
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#efe7ff] text-[#6733f4]">
              <Icon size={22} />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[#090d1b]">{title}</h3>
              <p className="mt-1 text-xs font-medium leading-5 text-[#53607b]">{body}</p>
              <button className="mt-3 text-xs font-bold text-[#5b21f3]">{action}</button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function IndustryHub() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(111,66,255,0.07),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1480px]">
          <AnimatedSection>
            <TopBar />
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-6">
            <FilterBar />
          </AnimatedSection>

          <AnimatedSection delay={0.16} className="mt-4">
            <ProjectBoard />
          </AnimatedSection>

          <AnimatedSection delay={0.24} className="mt-4">
            <BottomCards />
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
