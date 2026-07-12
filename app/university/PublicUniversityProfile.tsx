"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  Check,
  CircleCheck,
  ExternalLink,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { AnimatedCard, AnimatedSection } from "./UniversityMotion";
import { useUniversityProfile, type UniversityProfileData } from "./universityProfileData";
import { achievements, partners, programmes, quickStats, universityLogoUrl } from "./UniversityProfile";

const bannerImageUrl = "https://upload.wikimedia.org/wikipedia/commons/8/87/Taylor%27s_Lakeside_Campus%2C_Subang_Jaya%2C_Malaysia.jpg";

type PublicUniversityProfileProps = {
  profile?: UniversityProfileData;
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  className?: string;
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={`rounded-[24px] border-[#e9eaf2] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.055)] md:p-6 ${className}`}>{children}</AnimatedCard>;
}

export default function PublicUniversityProfile({
  profile: profileOverride,
  backHref = "/university/profile",
  backLabel = "Back to admin view",
  onBack,
  className = "",
}: PublicUniversityProfileProps = {}) {
  const { profile: savedProfile } = useUniversityProfile();
  const profile = profileOverride ?? savedProfile;

  return (
    <main className={`min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(109,94,247,0.08),transparent_28rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17] ${className}`}>
      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-extrabold tracking-normal text-black">
            Career<span className="text-[#f0185b]">OS</span>
          </div>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-[#e6e8f1] bg-white px-3.5 py-1.5 text-xs font-bold text-[#34415e] shadow-sm transition hover:bg-[#faf7ff]"
            >
              {backLabel}
            </button>
          ) : (
            <Link
              href={backHref}
              className="rounded-full border border-[#e6e8f1] bg-white px-3.5 py-1.5 text-xs font-bold text-[#34415e] shadow-sm transition hover:bg-[#faf7ff]"
            >
              {backLabel}
            </Link>
          )}
        </div>

        <div className="mt-6 space-y-5">
          <AnimatedSection>
            <div
              aria-label="Taylor's University Lakeside Campus"
              role="img"
              className="relative h-56 overflow-hidden rounded-[24px] bg-[#eef0f6] bg-cover bg-center shadow-[0_20px_55px_rgba(15,23,42,0.1)] md:h-64"
              style={{ backgroundImage: `url(${bannerImageUrl})` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,27,0.05),rgba(8,12,27,0.55))]" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.04}>
            <Card className="overflow-hidden">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] border border-[#e4e3fb] bg-white shadow-[0_20px_45px_rgba(109,94,247,0.15)]">
                  <div className="absolute inset-3 rounded-[20px] bg-[#f6f2ff]" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={universityLogoUrl} alt="University logo" className="relative h-14 w-14 object-contain" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-extrabold tracking-normal text-[#070a17] md:text-3xl">{profile.name}</h1>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eefcf4] px-3 py-1 text-xs font-bold text-[#15803d]">
                      <ShieldCheck size={14} />
                      Verified on CareerOS
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#4b5670]">
                    <span className="rounded-full bg-[#f4f5fa] px-3 py-1.5">{profile.type}</span>
                    <span className="rounded-full bg-[#f4f5fa] px-3 py-1.5">{profile.country}</span>
                    <span className="rounded-full bg-[#f4f5fa] px-3 py-1.5">Established {profile.established}</span>
                    <span className="flex items-center gap-1.5 rounded-full bg-[#f4f5fa] px-3 py-1.5"><MapPin size={12} /> {profile.location}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-[#dedcff] bg-[#f7f5ff] px-3 py-1.5 text-xs font-bold text-[#5b21f3]">
                        <CircleCheck size={14} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <Card>
              <h2 className="text-xl font-extrabold text-[#070a17]">About {profile.name}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Mission", profile.mission],
                  ["Vision", profile.vision],
                  ["Graduate Employability", profile.employability],
                  ["Industry Collaboration", profile.industryCollaboration],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-4">
                    <h3 className="text-sm font-extrabold text-[#0b1020]">{title}</h3>
                    <p className="mt-2 text-xs font-medium leading-5 text-[#59657f]">{body}</p>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.16}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="p-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bg} ${stat.tone}`}>
                      <Icon size={21} />
                    </div>
                    <p className="mt-3 text-xs font-extrabold text-[#53607b]">{stat.label}</p>
                    <p className="mt-1 text-2xl font-extrabold leading-none text-[#070a17]">{stat.value}</p>
                    <p className="mt-2 text-xs font-semibold text-[#65718d]">{stat.detail}</p>
                  </Card>
                );
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.24}>
            <Card>
              <h2 className="text-xl font-extrabold text-[#070a17]">Top Programmes</h2>
              <div className="mt-4 space-y-3">
                {programmes.map(([name, alignment, graduates, detail]) => (
                  <div key={name} className="grid gap-3 rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-4 md:grid-cols-[1fr_120px_110px] md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-extrabold text-[#070a17]">{name}</h3>
                        <span className="inline-flex text-[#f59e0b]">
                          {[0, 1, 2, 3, 4].map((star) => (
                            <Star key={star} size={12} fill="currentColor" />
                          ))}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium leading-5 text-[#65718d]">{detail}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#65718d]">Industry Alignment</p>
                      <p className="mt-1 text-lg font-extrabold text-[#070a17]">{alignment}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#65718d]">Graduates</p>
                      <p className="mt-1 text-lg font-extrabold text-[#070a17]">{graduates}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.32}>
            <Card>
              <h2 className="text-xl font-extrabold text-[#070a17]">Trusted Employer Network</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {partners.map((partner) => (
                  <div key={partner} className="flex h-16 items-center justify-center rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] text-sm font-black text-[#34415e]">
                    {partner}
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <Card>
              <h2 className="text-xl font-extrabold text-[#070a17]">Recent Achievements</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={achievement.title} className="flex items-center gap-3 rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0e9ff] text-[#6D5EF7]">
                        <Icon size={18} />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-[#070a17]">{achievement.title}</p>
                        <p className="mt-0.5 text-xs font-medium text-[#65718d]">{achievement.year}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.48}>
            <Card>
              <h2 className="text-xl font-extrabold text-[#070a17]">Get in Touch</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Career Office", profile.contacts.careerOffice, Mail],
                  ["Industry Collaboration", profile.contacts.industryOffice, BriefcaseBusiness],
                  ["Admissions", profile.contacts.admissions, GraduationCap],
                  ["Student Affairs", profile.contacts.studentAffairs, Users],
                  ["Website", profile.socials.website, Globe2],
                  ["LinkedIn", profile.socials.linkedin, ExternalLink],
                  ["Facebook", profile.socials.facebook, MessageSquareText],
                  ["Instagram", profile.socials.instagram, Sparkles],
                ].map(([title, detail, Icon]) => (
                  <div key={title as string} className="flex items-center gap-3 rounded-[18px] border border-[#eceef6] bg-[#fbfbfe] p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0e9ff] text-[#6D5EF7]">
                      {typeof Icon === "function" ? <Icon size={18} /> : <Check size={18} />}
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-[#070a17]">{title as string}</p>
                      <p className="mt-0.5 text-xs font-medium text-[#65718d]">{detail as string}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
