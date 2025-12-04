"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative flex items-center">
      {/* Hero content only; header/nav and decorative background come from layout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/10 ring-1 ring-white/15">
            <span className="text-xs font-semibold tracking-wider text-white/90">
              Free • Fair • Transparent
            </span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary-200 via-white to-secondary-200 bg-clip-text text-transparent">
            Shape Ethiopia’s Future
          </h1>
          <p className="mt-4 text-white/85 text-lg max-w-2xl mx-auto">
            Discover parties and candidates, explore their goals, and cast your
            voice with confidence.
          </p>

          {/* CTA buttons with extra bottom margin to separate from cards */}
          <div className="mt-8 mb-16 md:mb-24 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/parties"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-400 hover:to-secondary-400 transition shadow-lg shadow-black/20"
            >
              Explore Parties <ArrowRight size={18} />
            </Link>
            <Link
              href="/results"
              className="rounded-xl px-6 py-3 bg-white/10 hover:bg-white/15 transition"
            >
              Meet Candidates
            </Link>
          </div>

          {/* Extra top margin before cards to ensure clear separation */}
          <div
            className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
            style={{ marginTop: "15px" }}
          >
            <InfoCard
              title="Verified Results"
              desc="Live, transparent results with verifiable tallies."
              emoji="📊"
            />
            <InfoCard
              title="Secure Voting"
              desc="Modern auth and tamper‑resistant ballot handling."
              emoji="🛡️"
            />
            <InfoCard
              title="Civic Insights"
              desc="Clear party goals, policies, and leader profiles."
              emoji="🔎"
            />
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function InfoCard({ title, desc, emoji }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="gradient-border rounded-2xl p-[1px] shadow-elevation"
    >
      <div className="glass-card rounded-2xl p-6">
        <div className="text-3xl">{emoji}</div>
        <h3 className="mt-3 text-xl font-bold">{title}</h3>
        <p className="mt-2 text-white/85">{desc}</p>
      </div>
    </motion.div>
  );
}
