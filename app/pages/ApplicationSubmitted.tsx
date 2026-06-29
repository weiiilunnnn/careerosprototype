"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ApplicationSubmitted() {
  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6">

      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[15%] h-72 w-72 animate-[float_14s_ease-in-out_infinite] rounded-full bg-[#f0184f]/10 blur-3xl" />

        <div className="absolute right-[12%] top-[18%] h-96 w-96 animate-[float_18s_ease-in-out_infinite] rounded-full bg-[#ff7ba4]/10 blur-3xl" />

        <div className="absolute bottom-[10%] left-[25%] h-80 w-80 animate-[float_22s_ease-in-out_infinite] rounded-full bg-[#f0184f]/8 blur-3xl" />

        <div className="absolute bottom-[15%] right-[20%] h-60 w-60 animate-[float_16s_ease-in-out_infinite] rounded-full bg-[#ffb6cb]/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl text-center">

        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#fff1f5] shadow-[0_0_80px_rgba(240,24,79,0.18)] sm:h-40 sm:w-40">
          <CheckCircle2
            size={80}
            className="text-[#f0184f]"
          />
        </div>

        <h1 className="mt-8 text-3xl font-black tracking-tight sm:mt-10 sm:text-5xl">
          Application Submitted
        </h1>

        <p className="mt-4 text-base text-black/60 sm:text-lg">
          Your application has been successfully submitted.
        </p>



        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2">
          <Link
            href="/?view=my-applications"
            className="rounded-xl border border-black/10 bg-white/80 px-8 py-4 font-bold backdrop-blur-sm transition hover:border-[#f0184f]/30"
          >
            Back To Jobs
          </Link>

          <Link
            href="/?view=career-landscape"
            className="rounded-xl bg-[#f0184f] px-8 py-4 font-bold text-white shadow-[0_12px_30px_rgba(240,24,79,0.25)] transition hover:scale-105"
          >
            Career Landscape
          </Link>
        </div>

      </div>
    </div>
  );
}

