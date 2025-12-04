"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import RegisterForm from "./partyform";

export default function PartyRegistrationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-chip shadow-md">
          <Flag size={16} className="text-white/90" />
          <span className="text-xs font-semibold tracking-wide text-white/90">
            Party Registration
          </span>
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary-200 via-white to-secondary-200 bg-clip-text text-transparent drop-shadow-sm">
          Register a New Party
        </h1>
        <p className="mt-3 text-lg text-white/90 max-w-2xl mx-auto">
          Provide party details, leader information, vision, and goals. You can
          add goals dynamically and submit once everything looks perfect.
        </p>
      </div>

      {/* Gradient bordered glass card around the form */}
      <motion.div
        className="gradient-border rounded-2xl p-[1px] shadow-elevation"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <RegisterForm />
        </div>
      </motion.div>
    </div>
  );
}
