"use client";

import dynamic from "next/dynamic";

const EmployerPrototype = dynamic(
  () =>
    import("@/features/components (employer)/EmployerPrototype").then(
      (mod) => mod.EmployerPrototype
    ),
  {
    ssr: false,
    loading: () => (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#fafafa_22%,#f4f4f5_100%)]" />
    ),
  }
);

export default function EmployerClient() {
  return <EmployerPrototype />;
}
