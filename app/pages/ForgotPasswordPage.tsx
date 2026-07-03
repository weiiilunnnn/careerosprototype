import Link from "next/link";
import { ArrowLeft, Mail, Send, Sparkles } from "lucide-react";

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

export default function ForgotPasswordPage() {
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

        <div className="absolute left-12 top-10 flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-2xl font-black">
            Career<span className="text-[#F8B8CA]">OS</span>
          </p>
        </div>

        <div className="absolute bottom-14 left-12 right-16 text-white">
          <p className="max-w-2xl text-5xl font-black leading-tight">
            “Your career map should keep growing with you.”
          </p>
          <div className="mt-7">
            <p className="text-lg font-bold">CareerOS Prototype</p>
            <p className="mt-1 text-sm text-white/75">
              Reset access to your career workspace
            </p>
          </div>
        </div>
      </aside>

      {/* Right forgot password form */}
      <section className="flex h-screen items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-9 text-center">
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: theme.soft }}
            >
              <Send className="h-7 w-7" style={{ color: theme.rose2 }} />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#152238]">
              Forgot password
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#46536D]">
              Enter your email and CareerOS will send password reset
              instructions to your inbox.
            </p>
          </div>

          <form className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#152238]">
                Email to send reset instructions to
              </span>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8499]" />
                <input
                  type="email"
                  defaultValue="alex.lee@email.com"
                  className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm font-semibold text-[#152238] outline-none transition placeholder:text-[#9AA3B8] focus:border-[#E00046] focus:ring-1 focus:ring-[#E00046]"
                  style={{ borderColor: "#DDE2EC" }}
                />
              </div>
            </label>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:scale-[1.01] active:scale-[0.99]"
              style={{ backgroundColor: theme.rose2 }}
            >
              Send
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/?view=login"
              className="inline-flex items-center gap-2 text-sm font-extrabold transition hover:opacity-75"
              style={{ color: theme.rose2 }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Log in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}