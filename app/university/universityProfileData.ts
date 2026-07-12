"use client";

import { useEffect, useState } from "react";

export type UniversityProfileData = {
  name: string;
  type: string;
  country: string;
  established: string;
  location: string;
  studentCountLabel: string;
  tags: string[];
  mission: string;
  vision: string;
  employability: string;
  industryCollaboration: string;
  contacts: {
    careerOffice: string;
    industryOffice: string;
    admissions: string;
    studentAffairs: string;
  };
  socials: {
    website: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    locationLink: string;
  };
};

export const STORAGE_KEY = "careeros-university-profile";

export const defaultUniversityProfile: UniversityProfileData = {
  name: "Taylor's University",
  type: "Private University",
  country: "Malaysia",
  established: "1969",
  location: "Subang Jaya, Malaysia",
  studentCountLabel: "25,000 Students",
  tags: ["Industry Partner", "Graduate Excellence", "AI Ready Institution"],
  mission: "Prepare future-ready graduates through purposeful learning, industry exposure and measurable career outcomes.",
  vision: "Be a regional benchmark for innovative education, employer collaboration and lifelong graduate success.",
  employability: "Embed practical readiness, portfolio evidence and professional confidence into every academic journey.",
  industryCollaboration: "Co-create learning with employers so students solve real market problems before graduation.",
  contacts: {
    careerOffice: "career@taylors.edu.my",
    industryOffice: "partners@taylors.edu.my",
    admissions: "admissions@taylors.edu.my",
    studentAffairs: "studentaffairs@taylors.edu.my",
  },
  socials: {
    website: "www.taylors.edu.my",
    linkedin: "Taylor's University",
    facebook: "Taylor's University",
    instagram: "@taylorsuni",
    locationLink: "Google Maps",
  },
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function loadUniversityProfile(): UniversityProfileData {
  if (!canUseStorage()) return defaultUniversityProfile;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUniversityProfile;
    const parsed = JSON.parse(raw);
    return {
      ...defaultUniversityProfile,
      ...parsed,
      contacts: { ...defaultUniversityProfile.contacts, ...parsed.contacts },
      socials: { ...defaultUniversityProfile.socials, ...parsed.socials },
    };
  } catch {
    return defaultUniversityProfile;
  }
}

export function saveUniversityProfile(data: UniversityProfileData) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useUniversityProfile() {
  const [profile, setProfile] = useState<UniversityProfileData>(defaultUniversityProfile);

  useEffect(() => {
    setProfile(loadUniversityProfile());
  }, []);

  function updateProfile(next: UniversityProfileData) {
    setProfile(next);
    saveUniversityProfile(next);
  }

  return { profile, updateProfile };
}
