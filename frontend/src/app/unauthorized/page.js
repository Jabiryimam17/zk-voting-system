"use client";
// app/unauthorized/page.jsx
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#0b0b12]">
      {/* Ambient radial glows only (no grid) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% -10%, rgba(7,137,48,0.14), transparent), radial-gradient(900px 500px at 110% 10%, rgba(252,209,22,0.14), transparent), radial-gradient(900px 520px at -10% 110%, rgba(232,27,35,0.12), transparent)",
        }}
      />

      <section className="relative z-10 px-6 py-16 w-full max-w-2xl text-center">
        <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-white/10 bg-white/[0.06] text-white/85 text-xs font-medium mb-6">
          <span className="inline-flex h-2 w-2 rounded-full bg-red-400 animate-pulse" />
          <span>Access Restricted</span>
        </div>

        {/* Icon */}
        <div className="mx-auto w-20 h-20 mb-6 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(232,27,35,0.35)]">
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
            aria-hidden="true"
          >
            <path
              d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="15" r="1.4" fill="currentColor" />
          </svg>
        </div>

        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#cfeedd] via-[#fff4bf] to-[#ffc9c7] text-4xl sm:text-5xl font-extrabold tracking-tight">
          404 Unauthorized
        </h1>
        <p className="mt-4 text-white/85 text-base sm:text-lg">
          You don’t have permission to view this page. Please sign in with an
          authorized account or return to the homepage.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white border border-white/15 bg-gradient-to-b from-white/10 to-white/5 hover:from-white/[0.14] hover:to-white/[0.08] transition-all shadow-[0_10px_30px_-10px_rgba(7,137,48,0.35),0_16px_40px_-12px_rgba(232,27,35,0.25)]"
          >
            <span className="absolute inset-0 -z-10 rounded-xl bg-[radial-gradient(45%_45%_at_50%_50%,rgba(252,209,22,0.18),rgba(252,209,22,0)_70%)] opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="opacity-90"
              aria-hidden="true"
            >
              <path
                d="M4 12L12 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Go home
          </Link>

          <Link
            href="/login"
            className="relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06)),linear-gradient(90deg,#078930,#fcd116_45%,#e81b23)] hover:brightness-110 transition-all"
          >
            <span className="relative">Sign in</span>
          </Link>
        </div>

        {/* Helper links */}
        <div className="mt-6 text-sm text-white/70">
          If you believe this is a mistake, contact support at{" "}
          <a
            href="mailto:support@example.com"
            className="text-white/85 underline-offset-4 hover:underline"
          >
            support@example.com
          </a>
          .
        </div>
      </section>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#078930] via-[#fcd116] to-[#e81b23] opacity-80" />
    </main>
  );
}
