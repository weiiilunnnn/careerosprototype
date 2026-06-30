"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Eye, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { authenticateEmployer } from "@/features/components (employer)/store";

const theme = {
  navy: "#081433",
  deepNavy: "#152238",
  muted: "#46536D",
  rose1: "#F04D7A",
  rose2: "#E00046",
  rose3: "#D81B3F",
  soft: "#FFF2F6",
  soft2: "#FDE7EE",
  border: "#F5CBD6",
};

function GoogleLogo() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default function SignInPage() {
  function signInAsExistingEmployer() {
    if (authenticateEmployer("admin@talentbank.com", "careeros")) {
      window.location.href = "/employer";
    }
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (authenticateEmployer(email, password)) {
      window.location.href = "/employer";
      return;
    }

    window.location.href = "/?view=profile";
  }

  return (
    <main
      className="grid h-screen min-h-screen overflow-hidden bg-white text-[#081433] lg:grid-cols-[65%_35%]"
      style={{
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >
      {/* Left image panel */}
      <aside className="relative hidden h-screen overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
          alt="Professionals collaborating during a career planning session"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#152238]/90 via-[#152238]/35 to-[#152238]/20" />

        {/* Right side image shadow */}
        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-r from-transparent to-black/20" />

        <Link
        href="/"
        className="absolute left-12 top-10 flex items-center gap-3 text-white transition hover:opacity-80"
        >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Sparkles className="h-5 w-5" />
        </div>

        <p className="text-2xl font-black">
            Career<span className="text-[#F8B8CA]">OS</span>
        </p>
        </Link>

        <div className="absolute bottom-14 left-12 right-16 text-white">
          <p className="max-w-2xl text-5xl font-black leading-tight">
            “Build your profile, track your growth, and move with clarity.”
          </p>
          <div className="mt-7">
            <p className="text-lg font-bold">CareerOS Prototype</p>
            <p className="mt-1 text-sm text-white/75">
              Career navigation for every stage
            </p>
          </div>
        </div>
      </aside>

      {/* Right sign in form */}
      <section className="flex h-screen items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-9 text-center">
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: theme.soft }}
            >
              <Sparkles className="h-7 w-7" style={{ color: theme.rose2 }} />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#152238]">
              Welcome back to CareerOS
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#46536D]">
              Sign in to continue building your profile, viewing your living
              portfolio, and exploring realistic career paths.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#152238]">
                Email
              </span>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8499]" />
                <input
                  name="email"
                  type="email"
                  defaultValue="jason.tan@email.com"
                  className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm font-semibold text-[#152238] outline-none transition placeholder:text-[#9AA3B8] focus:border-[#E00046] focus:ring-1 focus:ring-[#E00046]"
                  style={{ borderColor: "#DDE2EC" }}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#152238]">
                Password
              </span>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8499]" />
                <input
                  name="password"
                  type="password"
                  defaultValue="careeros"
                  className="w-full rounded-xl border bg-white py-3 pl-11 pr-11 text-sm font-semibold text-[#152238] outline-none transition placeholder:text-[#9AA3B8] focus:border-[#E00046] focus:ring-1 focus:ring-[#E00046]"
                  style={{ borderColor: "#DDE2EC" }}
                />
                <Eye className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8499]" />
              </div>
            </label>

            <div className="flex items-center justify-between gap-4 pt-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#46536D]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#DDE2EC] accent-[#E00046]"
                />
                Remember me
              </label>

              <Link
                href="/?view=forgot-password"
                className="text-sm font-extrabold transition hover:opacity-75"
                style={{ color: theme.rose2 }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:scale-[1.01] active:scale-[0.99]"
              style={{ backgroundColor: theme.rose2 }}
            >
              Log in
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={signInAsExistingEmployer}
              className="flex w-full items-center justify-center gap-3 rounded-full border bg-[#FFF7FA] px-6 py-3.5 text-sm font-extrabold text-[#152238] transition hover:-translate-y-0.5 hover:border-[#F04D7A] hover:bg-white hover:shadow-md active:translate-y-0"
              style={{ borderColor: theme.border }}
            >
              <BriefcaseBusiness className="h-4 w-4 text-[#E00046]" />
              Sign in as existing employer
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E7EAF1]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A8499]">
              or
            </span>
            <div className="h-px flex-1 bg-[#E7EAF1]" />
          </div>

          <button className="flex w-full items-center justify-center gap-3 rounded-full border bg-[#fbfbfc] px-6 py-3.5 text-sm font-extrabold text-[#152238] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-0">
            <GoogleLogo />
            Continue with Google
          </button>

          <p className="mt-7 text-center text-sm font-semibold text-[#7A8499]">
            Don&apos;t have an account?{" "}
            <Link
              href="/?view=onboarding"
              className="font-extrabold transition hover:opacity-75"
              style={{ color: theme.rose2 }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
