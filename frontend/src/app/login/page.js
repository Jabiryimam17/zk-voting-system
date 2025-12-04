"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [show_password, set_show_password] = useState(false);
  const [unauthorized, set_unauthorized] = useState(false);
  const [is_loading, set_is_loading] = useState(false);

  const handle_login = async (e) => {
    e.preventDefault();
    set_is_loading(true);
    set_unauthorized(false);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        router.push("/parties");
      } else {
        set_unauthorized(true);
      }
    } catch (error) {
      set_unauthorized(true);
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-chip shadow-md">
          <Lock size={16} className="text-white/90" />
          <span className="text-xs font-semibold tracking-wide text-white/90">
            Secure Access
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-extrabold bg-gradient-to-r from-primary-200 via-white to-secondary-200 bg-clip-text text-transparent">
          Welcome back
        </h1>
        <p className="mt-2 text-white/85">
          Sign in to continue managing elections
        </p>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto max-w-xl gradient-border rounded-2xl p-[1px] shadow-elevation"
      >
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <form onSubmit={handle_login} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white/90 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-white/80" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => set_email(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-[color-mix(in_oklab,var(--card)_35%,transparent)] text-white placeholder-white/70 border-[color-mix(in_oklab,var(--border)_80%,transparent)] outline-none transition focus:border-[color-mix(in_oklab,var(--primary)_70%,white_10%)] focus:ring-4 ring-[color-mix(in_oklab,var(--primary)_28%,transparent)] ring-offset-0"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-white/90 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-white/80" />
                </div>
                <input
                  id="password"
                  type={show_password ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => set_password(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-24 py-3 rounded-xl border bg-[color-mix(in_oklab,var(--card)_35%,transparent)] text-white placeholder-white/70 border-[color-mix(in_oklab,var(--border)_80%,transparent)] outline-none transition focus:border-[color-mix(in_oklab,var(--primary)_70%,white_10%)] focus:ring-4 ring-[color-mix(in_oklab,var(--primary)_28%,transparent)] ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => set_show_password((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-white/80 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {show_password ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-white/60">
                  Use 8+ characters with a mix of letters and numbers.
                </span>
                <a
                  href="/forgot"
                  className="text-sm text-primary-200 hover:text-white"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Error */}
            {unauthorized && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/15 text-red-200 px-4 py-3 backdrop-blur">
                <div className="font-semibold">Incorrect credentials</div>
                <div className="text-sm">
                  Please try again or verify your email.
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={is_loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-400 hover:to-secondary-400 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {is_loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-30"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              Log In
            </button>

            <div className="text-center text-sm text-white/80">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-primary-200 hover:text-white font-semibold"
              >
                Sign up
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
