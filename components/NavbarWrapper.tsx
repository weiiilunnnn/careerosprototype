"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

export default function NavbarWrapper() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const view = searchParams.get("view");

  // Pages that should NOT show the global navbar
  const hiddenViews = [
    null, // Landing Page (/)
    "login",
    "signup",
    "forgot-password",
    "onboarding",
    "employer-onboarding",
  ];

  if (hiddenViews.includes(view)) {
    return null;
  }

  if (pathname.startsWith("/employer")) {
    return null;
  }

  return <Navbar />;
}
