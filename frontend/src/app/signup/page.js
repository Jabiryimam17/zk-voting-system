"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, KeyRound, IdCard } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    nationalId: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
        national_id: form.nationalId,
      };
      const res = await axios.post(
        "http://localhost:8080/api/users/register",
        payload
      );
      if (res.data?.is_match) {
        router.push(`/verifyemail?email=${encodeURIComponent(form.email)}`);
      } else {
        setErrorMsg(res.data?.message || "Registration failed. Try again.");
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-chip shadow-md">
          <UserPlus size={16} className="text-white/90" />
          <span className="text-xs font-semibold tracking-wide text-white/90">
            Create your account
          </span>
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary-200 via-white to-secondary-200 bg-clip-text text-transparent">
          Register
        </h1>
        <p className="mt-2 text-white/85 max-w-2xl mx-auto">
          Join the platform to participate and manage your election activities.
        </p>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto max-w-2xl gradient-border rounded-2xl p-[1px] shadow-elevation"
      >
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="firstName">
                  First Name
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    placeholder="First Name"
                    className="input-glass pl-10"
                    required
                  />
                  <UserPlus size={18} className="input-icon" />
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="lastName">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    placeholder="Last Name"
                    className="input-glass pl-10"
                    required
                  />
                  <UserPlus size={18} className="input-icon" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  className="input-glass pl-10"
                  required
                />
                <Mail size={18} className="input-icon" />
              </div>
              <p className="form-help">
                We’ll send a verification code to this email.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="input-glass pl-10 pr-24"
                  required
                  minLength={8}
                />
                <KeyRound size={18} className="input-icon" />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-white/80 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
              <p className="form-help">
                Use 8+ characters with letters and numbers.
              </p>
            </div>

            {/* National ID */}
            <div>
              <label className="form-label" htmlFor="nationalId">
                National ID
              </label>
              <div className="relative">
                <input
                  id="nationalId"
                  name="nationalId"
                  value={form.nationalId}
                  onChange={onChange}
                  placeholder="Government-issued ID"
                  className="input-glass pl-10"
                  required
                />
                <IdCard size={18} className="input-icon" />
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/15 text-red-200 px-4 py-3 backdrop-blur">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
