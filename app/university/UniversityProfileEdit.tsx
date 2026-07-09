"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, X } from "lucide-react";
import { AnimatedCard, AnimatedSection } from "./UniversityMotion";
import { useUniversityProfile, type UniversityProfileData } from "./universityProfileData";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <AnimatedCard className={`rounded-[24px] border-[#e9eaf2] bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.055)] md:p-6 ${className}`}>{children}</AnimatedCard>;
}

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-normal text-[#64708b]">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="mt-1.5 w-full resize-none rounded-xl border border-[#e5e7f0] bg-white px-3 py-2.5 text-sm font-medium text-[#0b1020] outline-none focus:border-[#8b7bf4]"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1.5 h-10 w-full rounded-xl border border-[#e5e7f0] bg-white px-3 text-sm font-medium text-[#0b1020] outline-none focus:border-[#8b7bf4]"
        />
      )}
    </label>
  );
}

export default function UniversityProfileEdit() {
  const router = useRouter();
  const { profile, updateProfile } = useUniversityProfile();
  const [draft, setDraft] = useState<UniversityProfileData>(profile);
  const [newTag, setNewTag] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  function set<K extends keyof UniversityProfileData>(key: K, value: UniversityProfileData[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function setContact<K extends keyof UniversityProfileData["contacts"]>(key: K, value: string) {
    setDraft((current) => ({ ...current, contacts: { ...current.contacts, [key]: value } }));
  }

  function setSocial<K extends keyof UniversityProfileData["socials"]>(key: K, value: string) {
    setDraft((current) => ({ ...current, socials: { ...current.socials, [key]: value } }));
  }

  function addTag() {
    const value = newTag.trim();
    if (!value) return;
    set("tags", [...draft.tags, value]);
    setNewTag("");
  }

  function removeTag(tag: string) {
    set("tags", draft.tags.filter((item) => item !== tag));
  }

  function handleSave() {
    updateProfile(draft);
    setSaved(true);
    window.setTimeout(() => router.push("/university/profile"), 500);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_82%_0%,rgba(109,94,247,0.08),transparent_28rem),linear-gradient(180deg,#fff_0%,#fbfaff_34%,#f7f8fb_100%)] text-[#070a17]">
      <div className="px-4 py-5 transition-[margin-left] duration-300 ease-out sm:px-6 lg:px-7 xl:ml-[var(--uni-sidebar-w,252px)] xl:px-7 xl:py-5">
        <div className="mx-auto max-w-[900px]">
          <AnimatedSection>
            <button
              type="button"
              onClick={() => router.push("/university/profile")}
              className="flex items-center gap-1.5 text-xs font-bold text-[#5b21f3] transition hover:text-[#4318c9]"
            >
              <ArrowLeft size={14} />
              Back to profile
            </button>
            <h1 className="mt-3 text-3xl font-extrabold tracking-normal text-[#070a17] md:text-[34px]">Edit University Profile</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#53607b]">
              Update each section of your profile. Changes are reflected on your CareerOS profile and public page once saved.
            </p>
          </AnimatedSection>

          <div className="mt-6 space-y-5">
            <AnimatedSection delay={0.08}>
              <Card>
                <h2 className="text-lg font-extrabold text-[#070a17]">Institution details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="University name" value={draft.name} onChange={(value) => set("name", value)} />
                  <Field label="Type" value={draft.type} onChange={(value) => set("type", value)} />
                  <Field label="Country" value={draft.country} onChange={(value) => set("country", value)} />
                  <Field label="Established year" value={draft.established} onChange={(value) => set("established", value)} />
                  <Field label="Location" value={draft.location} onChange={(value) => set("location", value)} />
                  <Field label="Student count label" value={draft.studentCountLabel} onChange={(value) => set("studentCountLabel", value)} />
                </div>

                <div className="mt-5">
                  <span className="text-xs font-bold uppercase tracking-normal text-[#64708b]">Profile tags</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {draft.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1.5 rounded-full bg-[#f7f5ff] px-3 py-1.5 text-xs font-bold text-[#5b21f3]">
                        {tag}
                        <button type="button" aria-label={`Remove ${tag}`} onClick={() => removeTag(tag)} className="text-[#8a94a6] transition hover:text-[#f0185b]">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={newTag}
                      onChange={(event) => setNewTag(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add a tag"
                      className="h-9 flex-1 rounded-lg border border-[#e5e7f0] bg-white px-3 text-xs font-medium outline-none focus:border-[#8b7bf4]"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6D5EF7] text-white transition hover:bg-[#5f50e8]"
                      aria-label="Add tag"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.16}>
              <Card>
                <h2 className="text-lg font-extrabold text-[#070a17]">Overview</h2>
                <div className="mt-4 grid gap-4">
                  <Field label="Mission" value={draft.mission} onChange={(value) => set("mission", value)} textarea />
                  <Field label="Vision" value={draft.vision} onChange={(value) => set("vision", value)} textarea />
                  <Field label="Graduate employability" value={draft.employability} onChange={(value) => set("employability", value)} textarea />
                  <Field label="Industry collaboration philosophy" value={draft.industryCollaboration} onChange={(value) => set("industryCollaboration", value)} textarea />
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.24}>
              <Card>
                <h2 className="text-lg font-extrabold text-[#070a17]">Contacts</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Career office" value={draft.contacts.careerOffice} onChange={(value) => setContact("careerOffice", value)} />
                  <Field label="Industry collaboration office" value={draft.contacts.industryOffice} onChange={(value) => setContact("industryOffice", value)} />
                  <Field label="Admissions" value={draft.contacts.admissions} onChange={(value) => setContact("admissions", value)} />
                  <Field label="Student affairs" value={draft.contacts.studentAffairs} onChange={(value) => setContact("studentAffairs", value)} />
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.32}>
              <Card>
                <h2 className="text-lg font-extrabold text-[#070a17]">Social &amp; web presence</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Website" value={draft.socials.website} onChange={(value) => setSocial("website", value)} />
                  <Field label="LinkedIn" value={draft.socials.linkedin} onChange={(value) => setSocial("linkedin", value)} />
                  <Field label="Facebook" value={draft.socials.facebook} onChange={(value) => setSocial("facebook", value)} />
                  <Field label="Instagram" value={draft.socials.instagram} onChange={(value) => setSocial("instagram", value)} />
                  <Field label="Location link label" value={draft.socials.locationLink} onChange={(value) => setSocial("locationLink", value)} />
                </div>
              </Card>
            </AnimatedSection>

            <div className="flex flex-wrap items-center gap-3 pb-6">
              <button
                type="button"
                onClick={handleSave}
                className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition ${
                  saved ? "bg-[#16a34a]" : "bg-[#6D5EF7] hover:bg-[#5f50e8]"
                }`}
              >
                {saved ? <Check size={16} /> : null}
                {saved ? "Saved" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/university/profile")}
                className="flex h-11 items-center rounded-xl border border-[#e6e8f1] bg-white px-5 text-sm font-bold text-[#34415e] transition hover:bg-[#faf7ff]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
