"use client";

import UniversitySidebar from "./UniversitySidebar";

export default function UniversityLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UniversitySidebar />
      {children}
    </>
  );
}
