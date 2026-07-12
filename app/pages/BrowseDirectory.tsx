"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { companyProfiles } from "@/lib/companyProfileData";
import CompanyLogo from "@/components/CompanyLogo";
import PublicUniversityProfile from "../university/PublicUniversityProfile";
import { defaultUniversityProfile, type UniversityProfileData } from "../university/universityProfileData";

type DirectoryKind = "university" | "employer";
type Tier = "Platinum" | "Gold" | "Silver";
type AffiliationRelation =
  | "Current student"
  | "Alumni"
  | "Current employee"
  | "Past employee";

type DirectoryItem = (typeof universities)[number] | (typeof employers)[number] | Affiliation;

interface Affiliation {
  kind: DirectoryKind;
  name: string;
  initials: string;
  logoTone?: string;
  relation: AffiliationRelation;
  tier: Tier;
  type: string;
  location: string;
  audience: string;
  strength: string;
  href?: string;
}

const tierRank: Record<Tier, number> = {
  Platinum: 0,
  Gold: 1,
  Silver: 2,
};

const tierStyles: Record<Tier, string> = {
  Platinum: "border-[#F4BDC8] bg-[#FDE7EE] text-[#9B2335]",
  Gold: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  Silver: "border-[#e5e7eb] bg-[#f8fafc] text-[#475569]",
};

const universities = [
  {
    name: "Taylor's University",
    initials: "T",
    logoTone: "taylors",
    tier: "Platinum" as Tier,
    type: "Private University",
    location: "Subang Jaya, Malaysia",
    audience: "24,580 students",
    strength: "Graduate employability and industry projects",
    profile:
      "Taylor's University is positioned as an industry-connected institution with strong graduate employability, employer partnerships, and practical project pathways across computing, business, and analytics.",
    highlights: ["382 employer partners", "74 industry projects", "92% profile completion"],
  },
  {
    name: "Asia Pacific University",
    initials: "APU",
    logoTone: "apu",
    tier: "Gold" as Tier,
    type: "Technology University",
    location: "Kuala Lumpur, Malaysia",
    audience: "13,200 students",
    strength: "Computing, data, and digital business pathways",
    profile:
      "Asia Pacific University focuses on technology, data, software, and digital business readiness, making it a strong match for candidates looking at technical career pathways.",
    highlights: ["Technology-led programmes", "Digital business pathways", "Strong computing talent pool"],
  },
  {
    name: "Sunway University",
    initials: "SU",
    logoTone: "sunway",
    tier: "Gold" as Tier,
    type: "Research University",
    location: "Bandar Sunway, Malaysia",
    audience: "18,000 students",
    strength: "Business, analytics, and sustainability programmes",
    profile:
      "Sunway University combines research, business, analytics, and sustainability-oriented learning with a strong campus ecosystem for early-career development.",
    highlights: ["Research-backed learning", "Business analytics strength", "Sustainability focus"],
  },
  {
    name: "Swinburne University of Technology Sarawak Campus",
    initials: "SUTS",
    logoTone: "swinburne",
    tier: "Gold" as Tier,
    type: "International Branch Campus",
    location: "Kuching, Sarawak",
    audience: "14,000+ students",
    strength: "Australian-linked engineering, computing, business, and design pathways in Sarawak",
    profile:
      "Swinburne University of Technology Sarawak Campus offers Australian-linked education in Sarawak with practical pathways across engineering, computing, business, design, and industry-ready graduate development.",
    highlights: ["Australian-linked campus", "Engineering and computing pathways", "Sarawak talent pipeline"],
  },
  {
    name: "INTI International University",
    initials: "INTI",
    logoTone: "inti",
    tier: "Silver" as Tier,
    type: "International University",
    location: "Nilai, Malaysia",
    audience: "12,500 students",
    strength: "Practical career readiness and employer-linked learning",
    profile:
      "INTI International University is presented as a practical, career-readiness-focused institution with employer-linked learning and broad undergraduate pathways.",
    highlights: ["Career readiness", "Employer-linked learning", "International student community"],
  },
];

function toDomainSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

function buildPublicUniversityProfile(item: (typeof universities)[number] | Affiliation): UniversityProfileData {
  if (item.name === defaultUniversityProfile.name) {
    return defaultUniversityProfile;
  }

  const domain = toDomainSlug(item.name) || "university";

  return {
    ...defaultUniversityProfile,
    name: item.name,
    type: item.type,
    country: "Malaysia",
    location: item.location,
    studentCountLabel: item.audience,
    tags: [`${item.tier} CareerOS Institution`, "Verified University", item.strength],
    mission: "Prepare future-ready graduates through purposeful learning, industry exposure and measurable career outcomes.",
    vision: "Be a recognised institution for employer collaboration, practical education and long-term graduate success.",
    employability: item.strength,
    industryCollaboration:
      "Connect academic programmes with employer needs through internships, live projects, portfolio evidence and graduate outcome tracking.",
    contacts: {
      careerOffice: `career@${domain}.edu.my`,
      industryOffice: `partners@${domain}.edu.my`,
      admissions: `admissions@${domain}.edu.my`,
      studentAffairs: `studentaffairs@${domain}.edu.my`,
    },
    socials: {
      website: `www.${domain}.edu.my`,
      linkedin: item.name,
      facebook: item.name,
      instagram: `@${domain}`,
      locationLink: "Google Maps",
    },
  };
}

const employers = Object.values(companyProfiles)
  .map((company) => ({
    name: company.name,
    initials: company.initials,
    tier: company.tier,
    type: company.industry,
    location: company.location,
    audience: company.size,
    strength: company.description,
    href: "/?view=company-profile",
  }))
  .concat([
    {
      name: "Microsoft",
      initials: "MS",
      tier: "Platinum" as Tier,
      type: "Cloud and AI",
      location: "Malaysia",
      audience: "10,000+ employees",
      strength: "Enterprise cloud, AI engineering, and digital transformation roles.",
      href: "/?view=company-profile",
    },
    {
      name: "Grab",
      initials: "GR",
      tier: "Silver" as Tier,
      type: "Mobility and super app",
      location: "Kuala Lumpur",
      audience: "9,000+ employees",
      strength: "Data analytics, operations, and product impact in Southeast Asia.",
      href: "/?view=company-profile",
    },
    {
      name: "Maybank",
      initials: "MY",
      tier: "Gold" as Tier,
      type: "Banking",
      location: "Kuala Lumpur",
      audience: "40,000+ employees",
      strength: "Finance, analytics, product, and customer operations pathways.",
      href: "/?view=company-profile",
    },
    {
      name: "Shopee",
      initials: "SP",
      tier: "Silver" as Tier,
      type: "E-commerce",
      location: "Kuala Lumpur",
      audience: "Regional teams",
      strength: "Marketplace operations, product analytics, and growth roles.",
      href: "/?view=company-profile",
    },
  ]);

const userAffiliations: Affiliation[] = [
  {
    kind: "university",
    name: "Taylor's University",
    initials: "T",
    logoTone: "taylors",
    relation: "Current student",
    tier: "Platinum",
    type: "Private University",
    location: "Subang Jaya, Malaysia",
    audience: "24,580 students",
    strength: "Industry-connected computing and analytics pathways.",
  },
  {
    kind: "university",
    name: "Asia Pacific University",
    initials: "APU",
    logoTone: "apu",
    relation: "Alumni",
    tier: "Gold",
    type: "Technology University",
    location: "Kuala Lumpur, Malaysia",
    audience: "13,200 students",
    strength: "Technology-focused learning with strong digital business outcomes.",
  },
  {
    kind: "employer",
    name: "Grab",
    initials: "GR",
    relation: "Past employee",
    tier: "Silver",
    type: "Mobility and super app",
    location: "Kuala Lumpur, Malaysia",
    audience: "9,000+ employees",
    strength: "Data analytics, operations, and product impact in Southeast Asia.",
    href: "/?view=company-profile",
  },
  {
    kind: "employer",
    name: "Maybank",
    initials: "MY",
    relation: "Current employee",
    tier: "Gold",
    type: "Banking",
    location: "Kuala Lumpur, Malaysia",
    audience: "40,000+ employees",
    strength: "Finance, analytics, and product operations for regional banking.",
    href: "/?view=company-profile",
  },
];

function UniversityLogo({
  item,
}: {
  item: (typeof universities)[number];
}) {
  const styles: Record<string, { background: string; color: string; border: string; label: string }> = {
    taylors: { background: "#ffffff", color: "#E00046", border: "#F5CBD6", label: "T" },
    apu: { background: "#162B75", color: "#ffffff", border: "#CBD5E1", label: "APU" },
    sunway: { background: "#E2231A", color: "#ffffff", border: "#FECACA", label: "SUN" },
    swinburne: { background: "#D71920", color: "#ffffff", border: "#FECACA", label: "SWIN" },
    inti: { background: "#004A98", color: "#ffffff", border: "#BFDBFE", label: "INTI" },
  };
  const config = styles[item.logoTone] ?? styles.taylors;

  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-center text-sm font-black leading-none shadow-sm"
      style={{
        background: config.background,
        color: config.color,
        borderColor: config.border,
      }}
      aria-label={`${item.name} logo`}
      title={item.name}
    >
      {config.label}
    </div>
  );
}

function DirectoryCard({
  item,
  kind,
  relation,
  isFollowed,
  onToggleFollow,
  onViewUniversityProfile,
}: {
  item: DirectoryItem;
  kind: DirectoryKind;
  relation?: AffiliationRelation;
  isFollowed?: boolean;
  onToggleFollow?: () => void;
  onViewUniversityProfile?: (item: (typeof universities)[number] | Affiliation) => void;
}) {
  const isUniversity = kind === "university";
  const university = item as (typeof universities)[number];
  const content = (
    <>
      {isUniversity ? (
        <UniversityLogo item={university} />
      ) : (
        <CompanyLogo company={item.name} size="md" />
      )}
      <div className="min-w-0">
        <div className="space-y-2">
          <h2 className="text-base font-extrabold text-[#152238]">{item.name}</h2>
          <div className="flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1">
            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${tierStyles[item.tier]}`}>
              <Star size={12} fill="currentColor" />
              {item.tier}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
              <BadgeCheck size={12} />
              Verified
            </span>
            {relation ? (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#F4BDC8] bg-[#FDE7EE] px-2.5 py-1 text-[11px] font-bold text-[#9B2335]">
                {relation}
              </span>
            ) : null}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-[#46536D]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f5fa] px-3 py-1">
            <ShieldCheck size={13} />
            {item.type}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f5fa] px-3 py-1">
            <MapPin size={13} />
            {item.location}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f5fa] px-3 py-1">
            <Users size={13} />
            {item.audience}
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#46536D]">
          {item.strength}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:w-auto">
        {onToggleFollow ? (
          <button
            type="button"
            onClick={onToggleFollow}
            className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition sm:w-44 ${
              isFollowed
                ? "bg-[#FDE7EE] text-[#9B2335] border border-[#F4BDC8] hover:bg-[#F7CAD6]"
                : "bg-[#E00046] text-white hover:bg-[#C7003E]"
            }`}
          >
            {isFollowed ? "Following" : "Follow"}
          </button>
        ) : null}

        {isUniversity ? (
          <button
            type="button"
            onClick={() => onViewUniversityProfile?.(item as (typeof universities)[number] | Affiliation)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E00046] px-4 text-xs font-bold text-white shadow-[0_14px_30px_rgba(224,0,70,0.18)] transition hover:bg-[#C7003E] sm:w-44"
          >
            View profile
            <ArrowRight size={15} />
          </button>
        ) : (
          <Link
            href={
              "href" in item && item.href ? item.href : "/?view=company-profile"
            }
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E00046] px-4 text-xs font-bold text-white shadow-[0_14px_30px_rgba(224,0,70,0.18)] transition hover:bg-[#C7003E] sm:w-44"
          >
            View profile
            <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </>
  );

  return (
    <div className="grid gap-4 rounded-2xl border border-[#E5E8F0] bg-white p-5 shadow-sm transition hover:border-[#F04D7A] hover:bg-[#FFF7FA] sm:grid-cols-[auto_1fr_auto] sm:items-center">
      {content}
    </div>
  );
}

export default function BrowseDirectory({ kind }: { kind: DirectoryKind }) {
  const [query, setQuery] = useState("");
  const [followOnly, setFollowOnly] = useState(false);
  const [followedItems, setFollowedItems] = useState<Record<string, boolean>>({
    "Taylor's University": true,
    "Asia Pacific University": true,
    Grab: true,
    Maybank: true,
  });
  const [showAffiliationModal, setShowAffiliationModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityProfileData | null>(null);
  const isUniversity = kind === "university";
  const searchableItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return (isUniversity ? universities : employers)
      .filter((item) => {
        if (!normalizedQuery) return true;

        return [item.name, item.type, item.location, item.tier, item.strength]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => tierRank[a.tier] - tierRank[b.tier] || a.name.localeCompare(b.name));
  }, [isUniversity, query]);
  const affiliations = useMemo(
    () => userAffiliations.filter((item) => item.kind === kind),
    [kind],
  );
  const followableItems = useMemo(
    () =>
      searchableItems.filter((item) =>
        !followOnly ? true : Boolean(followedItems[item.name]),
      ),
    [searchableItems, followOnly, followedItems],
  );
  const affiliationItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return affiliations.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        [item.name, item.type, item.location, item.relation, item.strength]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesQuery && (!followOnly || Boolean(followedItems[item.name]));
    });
  }, [affiliations, followOnly, followedItems, query]);
  const previewAffiliationItems = affiliationItems.slice(0, 2);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 text-[#152238] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="relative overflow-hidden rounded-2xl border border-[#E5E8F0] shadow-sm">
          <div className="relative min-h-[360px] overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(21,34,56,0.18)]">
            <img
              src={
                isUniversity
                  ? "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1800&q=80"
                  : "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80"
              }
              alt={isUniversity ? "University campus with students walking" : "People talking in a workspace"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#081433]/90 via-[#081433]/70 to-[#081433]/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081433]/60 via-transparent to-transparent" />
            <div className="relative z-10 flex min-h-[360px] flex-col justify-between px-8 py-8 text-white">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                    Candidate directory
                  </span>
                </div>

                <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                  {isUniversity ? "Browse University" : "Browse Employer"}
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
                  Search verified {isUniversity ? "universities" : "employers"} sorted by CareerOS status, from Platinum to Gold to Silver. Verified affiliations are managed from the candidate profile through education and work email validation.
                </p>
              </div>

              <label className="relative block w-full lg:max-w-sm">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8499]" />
                <input
                  type="search"
                  placeholder={`Search ${isUniversity ? "universities" : "employers"}`}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/20 bg-white/95 pl-11 pr-4 text-sm font-semibold text-[#172039] outline-none transition focus:border-[#E00046] focus:bg-white focus:ring-2 focus:ring-[#fde8ef]"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#E5E8F0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E00046]">
                My affiliations
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#152238]">
                {isUniversity ? "Universities I have studied at" : "Employers I have worked with"}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="max-w-2xl text-sm font-medium leading-6 text-[#46536D]">
                Browse institutions and companies where you already have a relationship through study or work history.
              </p>
              <button
                type="button"
                onClick={() => setShowAffiliationModal(true)}
                className="h-11 rounded-full bg-[#E00046] px-5 text-sm font-extrabold text-white transition hover:bg-[#C7003E]"
              >
                View all affiliations
              </button>
            </div>
          </div>

          {previewAffiliationItems.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {previewAffiliationItems.map((item) => (
                <DirectoryCard
                  key={item.name}
                  item={item}
                  kind={kind}
                  relation={item.relation}
                  isFollowed={Boolean(followedItems[item.name])}
                  onViewUniversityProfile={(university) => setSelectedUniversity(buildPublicUniversityProfile(university))}
                  onToggleFollow={() =>
                    setFollowedItems((old) => ({
                      ...old,
                      [item.name]: !old[item.name],
                    }))
                  }
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-[#d1d5db] bg-[#f8fafc] p-5 text-sm font-semibold text-[#46536D]">
              No affiliations found for this view. Add your work and education history to see matching universities or employers here.
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-[#E5E8F0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E00046]">
                {isUniversity ? "All Universities" : "All Employers"}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#152238]">
                Browse all {isUniversity ? "universities" : "employers"}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setFollowOnly((value) => !value)}
                className={`h-11 rounded-full px-4 text-sm font-bold transition ${
                  followOnly
                    ? "bg-[#E00046] text-white"
                    : "border border-[#E00046] bg-white text-[#E00046] hover:bg-[#FDE7EE]"
                }`}
              >
                {followOnly ? "Showing followed" : "Show followed only"}
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {followableItems.length > 0 ? (
              followableItems.map((item) => (
                <DirectoryCard
                  key={item.name}
                  item={item}
                  kind={kind}
                  isFollowed={Boolean(followedItems[item.name])}
                  onViewUniversityProfile={(university) => setSelectedUniversity(buildPublicUniversityProfile(university))}
                  onToggleFollow={() =>
                    setFollowedItems((old) => ({
                      ...old,
                      [item.name]: !old[item.name],
                    }))
                  }
                />
              ))
            ) : (
              <div className="rounded-2xl border border-[#eceef6] bg-white p-6 text-center text-sm font-semibold text-[#46536D]">
                No matching {isUniversity ? "universities" : "employers"} found.
              </div>
            )}
          </div>
        </section>
        {showAffiliationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-5xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl">
              <div className="flex flex-col gap-4 border-b border-[#e5e7eb] bg-[#f8fafc] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E00046]">
                    All affiliations
                  </p>
                  <h2 className="mt-2 text-xl font-extrabold text-[#152238]">
                    Browse all {isUniversity ? "university affiliations" : "employer affiliations"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAffiliationModal(false)}
                  className="h-11 rounded-xl border border-[#d1d5db] bg-white px-4 text-sm font-semibold text-[#152238] transition hover:bg-[#f8f8ff]"
                >
                  Close
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-6">
                {affiliations.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {affiliations.map((item) => (
                      <DirectoryCard
                        key={item.name}
                        item={item}
                        kind={kind}
                        relation={item.relation}
                        isFollowed={Boolean(followedItems[item.name])}
                        onViewUniversityProfile={(university) => setSelectedUniversity(buildPublicUniversityProfile(university))}
                        onToggleFollow={() =>
                          setFollowedItems((old) => ({
                            ...old,
                            [item.name]: !old[item.name],
                          }))
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#d1d5db] bg-[#f8fafc] p-6 text-sm font-semibold text-[#46536D]">
                    No affiliations available.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {selectedUniversity ? (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 p-2 sm:p-6">
            <PublicUniversityProfile
              profile={selectedUniversity}
              backLabel="Back to Browse"
              onBack={() => setSelectedUniversity(null)}
              className="min-h-full rounded-[1.5rem]"
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
