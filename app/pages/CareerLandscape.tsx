import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  CircleUserRound,
  Flag,
  FolderKanban,
  GraduationCap,
  Info,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";

const trajectories = [
  {
    rank: "#1",
    title: "Data Analytics Track",
    description: "Turn data into impact and drive business decisions.",
    match: 92,
    profiles: 742,
    difficulty: "Easy",
    difficultyClass: "bg-emerald-100 text-emerald-700",
    bars: "bg-emerald-500",
    steps: [
      ["Current Profile", "Data Enthusiast"],
      ["Entry Role", "Junior Data Analyst"],
      ["Next Role", "Data Analyst"],
      ["Growth Direction", "Senior Data Analyst / Data Scientist"],
    ],
  },
  {
    rank: "#2",
    title: "Business Analysis Track",
    description: "Bridge business needs and technology solutions.",
    match: 86,
    profiles: 618,
    difficulty: "Moderate",
    difficultyClass: "bg-orange-100 text-orange-700",
    bars: "bg-orange-500",
    steps: [
      ["Current Profile", "Analytical Thinker"],
      ["Entry Role", "Business Analyst"],
      ["Next Role", "Senior Business Analyst"],
      ["Growth Direction", "Product Owner / Business Consultant"],
    ],
  },
  {
    rank: "#3",
    title: "Product Operations Track",
    description: "Optimize operations and scale product impact.",
    match: 81,
    profiles: 529,
    difficulty: "Challenging",
    difficultyClass: "bg-rose-100 text-rose-700",
    bars: "bg-rose-600",
    steps: [
      ["Current Profile", "Detail-Oriented"],
      ["Entry Role", "Product Operations Associate"],
      ["Next Role", "Operations Manager"],
      ["Growth Direction", "Head of Product Operations"],
    ],
  },
];

const matchSignals = [
  {
    icon: Target,
    title: "Skills Overlap",
    text: "Matched based on 24 core skills and competencies.",
  },
  {
    icon: GraduationCap,
    title: "Education Similarity",
    text: "Compared against candidates with similar academic backgrounds.",
  },
  {
    icon: FolderKanban,
    title: "Projects & Portfolio",
    text: "Analyzed 6 projects and practical experience similarities.",
  },
  {
    icon: BarChart3,
    title: "Experience Patterns",
    text: "Looked at career transitions and role progression patterns.",
  },
];

function ProgressRing({ value }: { value: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative grid h-28 w-28 shrink-0 place-items-center">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 104 104" aria-hidden>
        <circle
          cx="52"
          cy="52"
          r={radius}
          className="fill-none stroke-gray-100"
          strokeWidth="8"
        />
        <circle
          cx="52"
          cy="52"
          r={radius}
          className="fill-none stroke-rose-600"
          strokeLinecap="round"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold tracking-normal text-gray-950">
          {value}%
        </p>
        <p className="text-xs text-gray-500">Match</p>
      </div>
    </div>
  );
}

function TrajectoryCard({
  trajectory,
}: {
  trajectory: (typeof trajectories)[number];
}) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm shadow-gray-200/70">
      <div className="grid gap-5 lg:grid-cols-[120px_1fr_210px]">
        <div className="flex items-center gap-4 lg:block">
          <ProgressRing value={trajectory.match} />
          <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-emerald-600">
            <BadgeCheck className="h-4 w-4" />
            High Confidence
          </p>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-start gap-3">
            <span className="rounded-md bg-rose-50 px-2.5 py-1 text-sm font-bold text-rose-600">
              {trajectory.rank}
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-950">
                {trajectory.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {trajectory.description}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_18px_1fr_18px_1fr_18px_1.4fr]">
            {trajectory.steps.map(([label, value], index) => (
              <div
                className="contents"
                key={`${trajectory.title}-${label}`}
              >
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                      {index === 3 ? (
                        <BriefcaseBusiness className="h-4 w-4" />
                      ) : (
                        <CircleUserRound className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">
                        {label}
                      </p>
                      <p className="mt-1 text-xs leading-4 text-gray-600">
                        {value}
                      </p>
                    </div>
                  </div>
                </div>
                {index < trajectory.steps.length - 1 && (
                  <div className="hidden items-center justify-center text-gray-500 md:flex">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link
            className="mx-auto mt-4 flex w-fit items-center gap-2 text-sm font-bold text-rose-600"
            href="/?view=deep-dive"
          >
            View Path Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-row justify-between gap-4 lg:flex-col lg:items-end">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <UsersRound className="mt-0.5 h-5 w-5 text-gray-900" />
            <span>
              Based on {trajectory.profiles}
              <br />
              similar profiles
            </span>
          </div>
          <div className="text-left lg:text-right">
            <div className="flex items-center gap-2 lg:justify-end">
              <p className="text-sm text-gray-700">Difficulty</p>
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-bold ${trajectory.difficultyClass}`}
              >
                {trajectory.difficulty}
              </span>
            </div>
            <div className="mt-3 flex gap-1 lg:justify-end">
              {Array.from({ length: 6 }).map((_, index) => (
                <span
                  className={`h-1.5 w-5 rounded-full ${
                    index < 4 ? trajectory.bars : "bg-gray-200"
                  }`}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CareerLandscape() {
  return (
    <main className="min-h-screen bg-[#fbfbfc] text-gray-950">

      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-normal text-gray-950">
                Career Landscape
              </h1>
              <Sparkles className="h-7 w-7 text-rose-500" />
            </div>
            <p className="mt-2 text-base text-gray-500">
              AI-matched career blueprints based on similar candidate histories.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-rose-200 bg-gradient-to-r from-white via-rose-50 to-white p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white text-rose-600 ring-8 ring-rose-100">
                <BadgeCheck className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  Trajectory analysis complete
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-700">
                  We matched your profile against similar candidates with
                  related skills, education, and project experience.
                </p>
              </div>
            </div>

            <div className="relative h-28">
              <svg
                className="h-full w-full"
                viewBox="0 0 520 112"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M4 80 C42 62 64 70 92 60 S148 64 178 45 S232 50 260 35 S320 72 360 48 S422 62 454 33 S494 30 516 18"
                  fill="none"
                  stroke="#e11d48"
                  strokeDasharray="4 5"
                  strokeWidth="2"
                />
                <path
                  d="M4 66 C42 42 72 48 104 35 S154 80 190 66 S230 24 268 56 S314 20 354 42 S400 74 436 58 S486 74 516 48"
                  fill="none"
                  stroke="#f9a8b9"
                  strokeDasharray="3 5"
                  strokeWidth="2"
                />
                {[90, 178, 258, 356, 454].map((x, index) => (
                  <circle
                    cx={x}
                    cy={[60, 45, 35, 48, 33][index]}
                    fill="#fff"
                    key={x}
                    r="8"
                    stroke="#e11d48"
                    strokeWidth="3"
                  />
                ))}
              </svg>
              <Flag className="absolute right-6 top-0 h-8 w-8 text-rose-600" />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-600">
                <UsersRound className="h-8 w-8" />
              </span>
              <div>
                <p className="text-sm text-gray-600">
                  Similar Profiles Analyzed
                </p>
                <p className="mt-2 text-2xl font-bold">9,842</p>
                <p className="mt-1 text-sm text-gray-500">
                  <span className="font-bold text-emerald-600">+12%</span> vs
                  last week
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-600">
                <ShieldCheck className="h-8 w-8" />
              </span>
              <div>
                <p className="text-sm text-gray-600">Trajectory Confidence</p>
                <p className="mt-2 text-2xl font-bold">87%</p>
                <span className="mt-1 inline-flex rounded-md bg-rose-100 px-4 py-1 text-xs font-bold text-rose-600">
                  High
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-600">
                <RefreshCw className="h-8 w-8" />
              </span>
              <div>
                <p className="text-sm text-gray-600">Updated from Portfolio</p>
                <p className="mt-2 text-2xl font-bold">2 days ago</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  Auto-sync active
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">
                    Recommended Career Trajectories
                  </h2>
                  <Info className="h-4 w-4 text-gray-500" />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Paths are ranked by match quality and trajectory confidence.
                </p>
              </div>
              <button className="flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm sm:w-56">
                Sort by: Best Match
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {trajectories.map((trajectory) => (
                <TrajectoryCard
                  key={trajectory.title}
                  trajectory={trajectory}
                />
              ))}
            </div>

            <p className="mt-7 flex items-center justify-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="h-4 w-4" />
              Recommendations are based on historical data and AI analysis.
              You&apos;re in control of your career journey.
            </p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-rose-600" />
                <h2 className="text-lg font-bold">How this was matched</h2>
              </div>
              <p className="mt-5 text-sm leading-6 text-gray-700">
                Our AI analyzed your profile and compared it with successful
                candidate journeys.
              </p>

              <div className="mt-5 divide-y divide-gray-100">
                {matchSignals.map((signal) => {
                  const Icon = signal.icon;

                  return (
                    <div className="flex gap-4 py-5" key={signal.title}>
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-950">
                          {signal.title}
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-gray-600">
                          {signal.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-amber-500" />
                <h2 className="font-bold">Important to know</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-700">
                These are AI-generated blueprints from real candidate journeys.
                You have the flexibility to explore, combine, or create your own
                path.
              </p>
              <button className="mt-4 flex items-center gap-2 text-sm font-bold text-rose-600">
                Learn more about matching
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
