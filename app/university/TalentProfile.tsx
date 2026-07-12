"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Mail,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";

const tabs = ["Overview", "Skills", "Experience", "Projects", "Portfolio", "Achievements", "Education", "Timeline"];
const skills = ["Python", "SQL", "Data Analysis", "Power BI", "Excel", "Machine Learning", "Jupyter", "Tableau", "Git", "VS Code", "MySQL", "Looker Studio", "Communication", "Problem Solving", "Teamwork", "Critical Thinking", "Adaptability"];
const experiences = [
  ["Data Analytics Intern", "ABC Analytics Sdn Bhd", "Jan 2024 - Apr 2024", "Analysed datasets and created dashboards to support business reporting.", "Internship"],
  ["Data Science Project Assistant", "University Data Lab", "Sep 2023 - Dec 2023", "Assisted in data collection, cleaning and model development.", "Part-time"],
  ["Junior Data Analyst", "Campus Analytics Team", "Mar 2023 - Aug 2023", "Supported analysis of student engagement data and reporting.", "Part-time"],
];
const achievements = [
  ["Dean's List", "Semester 2, 2023", "Oct 2023"],
  ["Data Hackathon Winner", "University Data Challenge 2023", "Aug 2023"],
  ["Microsoft Power BI Data Challenge", "Top 10 Finalist", "May 2023"],
  ["Best Final Year Project Award", "Faculty of Computing", "Apr 2024"],
  ["Google Analytics Individual Qualification", "Google", "Jan 2024"],
];
const education = [
  ["Bachelor of Computer Science", "University of Technology Malaysia", "2022 - 2025 (Expected)", "Current"],
  ["Google Data Analytics Certificate", "Google", "Jan 2024", ""],
  ["Microsoft Power BI Data Analyst Associate", "Microsoft", "Nov 2023", ""],
];
const timeline = [
  ["Joined University", "Aug 2022", "Started BSc Computer Science"],
  ["First Project", "Dec 2022", "Built first data analysis project"],
  ["Data Intern", "Jan 2024", "Joined ABC Analytics as intern"],
  ["Hackathon Winner", "Aug 2023", "Won University Data Challenge"],
  ["Skills Growth", "2024", "Advanced in ML & Visualisation"],
  ["Next Goal", "2025", "Secure Data Analyst role"],
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-[#e7e8f0] bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ${className}`}>
      {children}
    </section>
  );
}

function TopActions() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#53607b]">
          <Link href="/university/talent" className="hover:text-[#5b21f3]">Talent Readiness</Link>
          <ChevronRight size={15} />
          <span className="font-bold text-[#172039]">View Profile</span>
        </div>
        <Link href="/university/talent" className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-bold text-[#34415e] shadow-sm">
          <ArrowLeft size={15} />
          Back to Talent Readiness
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-11 min-w-[360px] items-center gap-3 rounded-xl border border-[#e6e8f1] bg-white px-4 text-xs font-medium text-[#65718d] shadow-sm"><Search size={16} />Search students, alumni, skills, or projects...</label>
        <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e8f1] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]"><Bell size={18} /><span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6b35ff] text-[10px] font-bold text-white">5</span></button>
        <button className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#e6e8f1] bg-white px-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ececf4] bg-white text-base font-black text-[#e11d48]">T</div>
          <span className="text-left"><span className="block text-xs font-bold text-[#0b1020]">Dr. Melissa Lim</span><span className="block text-xs font-medium text-[#53607b]">Career & Industry Office</span></span>
          <ChevronDown size={15} className="ml-4" />
        </button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <Card className="mt-5 p-6">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="flex gap-8">
          <div className="text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[linear-gradient(135deg,#dbeafe,#172039)] text-3xl font-black text-white shadow-xl">JT</div>
            <span className="mt-3 inline-flex rounded-full bg-[#e1f7eb] px-3 py-1 text-xs font-bold text-[#16a34a]">Active</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold">Jason Tan</h1>
              <span className="rounded-full bg-[#efe7ff] px-3 py-1 text-xs font-bold text-[#5b21f3]">Top 5% Talent</span>
            </div>
            <p className="mt-2 text-base font-bold text-[#34415e]">Data & Analytics Professional</p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#53607b]">Analytics-leaning computer science student passionate about turning data into insights that drive business decisions and create impact.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                ["Year 3", "BSc Computer Science", GraduationCap],
                ["Kuala Lumpur", "Malaysia", MapPin],
                ["jason.tan@university.edu.my", "Email", Mail],
                ["LinkedIn", "Profile", Users],
              ].map(([top, bottom, Icon]) => (
                <div key={top as string} className="rounded-xl border border-[#e6e8f1] bg-white p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#26324d]"><Icon size={15} className="text-[#f0185b]" />{top as string}</div>
                  <p className="mt-1 text-[10px] text-[#53607b]">{bottom as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5 text-center shadow-none">
            <p className="text-xs font-bold text-[#53607b]">Overall Readiness Score</p>
            <div className="mx-auto mt-4 h-24 w-40 rounded-t-full border-[10px] border-b-0 border-[#f0185b] pt-8 text-2xl font-extrabold">82/100</div>
            <p className="mt-2 text-sm font-bold text-[#16a34a]">Strong</p>
            <p className="mt-2 text-xs text-[#53607b]">Top 18% in Data & Analytics</p>
          </Card>
          <Card className="p-5 shadow-none">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#efe7ff] text-[#6733f4]"><Award size={20} /></span>
              <div>
                <p className="text-xs font-bold text-[#53607b]">Career Direction</p>
                <h2 className="mt-1 text-lg font-extrabold">Data & Analytics Professional</h2>
                <p className="mt-3 text-xs leading-5 text-[#53607b]">Aiming to work in data-driven roles that solve real business problems using analytics and technology.</p>
                <button className="mt-5 rounded-xl bg-[#6733f4] px-5 py-3 text-xs font-bold text-white">View Career Path</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
}

function DetailCards() {
  return (
    <>
      <div className="mt-5 flex gap-8 border-b border-[#edf0f6] px-3 text-xs font-bold text-[#53607b]">
        {tabs.map((tab, index) => <button key={tab} className={`pb-3 ${index === 0 ? "border-b-2 border-[#6733f4] text-[#5b21f3]" : ""}`}>{tab}</button>)}
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_1fr_0.9fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-lg font-extrabold">Profile Summary</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-5">
              {["Experience: 1 year 5 months", "Education: BSc Computer Science", "Location: Kuala Lumpur", "Status: Actively Seeking Internships", "Availability: May 2025 Onwards"].map((item) => <div key={item} className="text-[10px] font-semibold text-[#53607b]">{item}</div>)}
            </div>
            <div className="mt-6 border-t border-[#edf0f6] pt-5">
              <p className="text-xs font-bold">About Jason</p>
              <p className="mt-3 text-xs leading-5 text-[#53607b]">Detail-oriented analytical student with strong skills in data analysis, visualisation, and problem solving. Experienced in building dashboards and predictive models to derive meaningful insights.</p>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Experience Highlights</h2><button className="text-xs font-bold text-[#5b21f3]">View all experience</button></div>
            <div className="mt-4 space-y-4">{experiences.map(([role, org, date, body, type]) => <div key={role} className="grid grid-cols-[42px_1fr_auto] gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f2ff] text-[#2563eb]"><BriefcaseBusiness size={18} /></span><div><p className="text-sm font-bold">{role}</p><p className="text-xs text-[#53607b]">{org}</p><p className="mt-1 text-[10px] text-[#53607b]">{body}</p></div><div className="text-right text-[10px] text-[#53607b]">{date}<br /><span className="mt-2 inline-flex rounded-lg bg-[#f3efff] px-2 py-1 text-[#5b21f3]">{type}</span></div></div>)}</div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Skills Snapshot</h2><button className="text-xs font-bold text-[#5b21f3]">View all skills</button></div>
            <div className="mt-5 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="rounded-lg bg-[#ffe8f1] px-2 py-1 text-[10px] font-bold text-[#f0185b]">{skill}</span>)}</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Achievements & Recognition</h2><button className="text-xs font-bold text-[#5b21f3]">View all</button></div>
            <div className="mt-4 space-y-3">{achievements.map(([title, org, date]) => <div key={title} className="grid grid-cols-[34px_1fr_auto] gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0d9] text-[#f59e0b]"><Star size={16} /></span><div><p className="text-xs font-bold">{title}</p><p className="text-[10px] text-[#53607b]">{org}</p></div><span className="text-[10px] text-[#53607b]">{date}</span></div>)}</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Education & Certifications</h2><button className="text-xs font-bold text-[#5b21f3]">View all</button></div>
            <div className="mt-4 space-y-3">{education.map(([title, org, date, badge]) => <div key={title} className="grid grid-cols-[34px_1fr_auto] gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f2ff] text-[#2563eb]"><GraduationCap size={16} /></span><div><p className="text-xs font-bold">{title}</p><p className="text-[10px] text-[#53607b]">{org}</p></div><span className="text-[10px] text-[#53607b]">{badge || date}</span></div>)}</div>
          </Card>
        </div>
        <Card className="p-5">
          <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Portfolio Highlights</h2><button className="text-xs font-bold text-[#5b21f3]">View full portfolio</button></div>
          <div className="mt-5 space-y-5">
            {["Sales Performance Dashboard", "Customer Segmentation Model", "Data Analysis Report"].map((title, index) => <div key={title} className="grid grid-cols-[120px_1fr] gap-4"><div className={`h-20 rounded-xl ${index === 1 ? "bg-[#111827]" : "bg-[linear-gradient(135deg,#ede7ff,#fff)]"} border border-[#edf0f6]`} /><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-[#53607b]">{index === 0 ? "Interactive dashboard built with Power BI to analyze sales trends and KPIs." : index === 1 ? "Machine learning model to segment customers using clustering techniques." : "Exploratory data analysis on sales dataset with actionable business insights."}</p><span className="mt-2 inline-flex rounded-lg bg-[#f3efff] px-2 py-1 text-[10px] font-bold text-[#5b21f3]">{index === 1 ? "Python" : index === 2 ? "Jupyter Notebook" : "Power BI"}</span></div></div>)}
          </div>
        </Card>
      </div>
      <Card className="mt-4 p-5">
        <h2 className="text-lg font-extrabold">Career Growth Timeline</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-6">{timeline.map(([title, date, body]) => <div key={title} className="relative text-center"><div className="mx-auto h-4 w-4 rounded-full border-2 border-[#6733f4] bg-white" /><p className="mt-4 text-xs font-bold">{title}</p><p className="mt-1 text-[10px] text-[#53607b]">{date}</p><p className="mt-2 text-[10px] leading-4 text-[#53607b]">{body}</p></div>)}</div>
      </Card>
    </>
  );
}

export default function TalentProfile() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(111,66,255,0.07),transparent_26rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[1480px]">
          <TopActions />
          <Hero />
          <DetailCards />
        </div>
      </div>
    </main>
  );
}
