"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ArrowRight,
  Flag,
} from "lucide-react";

export default function PartiesPage() {
  const router = useRouter();
  const [parties, set_parties] = useState([]);
  const [expanded_index, set_expanded_index] = useState(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/parties", {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        set_parties(data.parties || []);
      } catch (e) {
        console.error("Failed to load parties:", e);
      } finally {
        set_loading(false);
      }
    };
    fetch_data();
  }, []);

  const toggle_goals = (idx) => {
    set_expanded_index((cur) => (cur === idx ? null : idx));
  };

  const handle_vote = (idx) => {
    const id = parties[idx]?.ID;
    if (!id) return;
    router.push(`/party?id=${id}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full gradient-chip shadow-md">
          <Users size={16} className="text-white/90" />
          <span className="text-xs font-semibold tracking-wide text-white/90">
            Registered Parties
          </span>
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary-200 via-white to-secondary-200 bg-clip-text text-transparent drop-shadow-sm">
          Parties
        </h1>
        <p className="mt-3 text-lg text-white/90 max-w-2xl mx-auto">
          Explore party profiles, leadership, and their vision. Expand a card to
          review goals, or vote directly.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="gradient-border rounded-2xl p-[1px]"
            >
              <div className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-white/20" />
                    <div className="h-3 w-24 rounded bg-white/20" />
                  </div>
                </div>
                <div className="mt-5 h-3 w-full rounded bg-white/15" />
                <div className="mt-3 h-3 w-2/3 rounded bg-white/15" />
                <div className="mt-6 h-10 w-32 rounded bg-white/20" />
              </div>
            </div>
          ))}
        </div>
      ) : parties.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl gradient-border p-[1px]">
          <div className="glass-card rounded-2xl p-10">
            <Flag className="mx-auto mb-3 text-white/80" />
            <p className="text-white/85">
              No parties found yet. Please check back later.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {parties.map((party, index) => {
            const is_open = expanded_index === index;
            return (
              <motion.div
                key={`${party.ID ?? party.party_name}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: index * 0.03,
                }}
                className="gradient-border rounded-2xl p-[1px] shadow-elevation self-start"
              >
                <div className="glass-card rounded-2xl p-6">
                  {/* Header row */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={party.party_symbol}
                        alt={party.party_name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-white/30"
                        onError={(e) => {
                          const t = e.target;
                          if (t && t.tagName === "IMG") t.src = "";
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 ring-2 ring-black/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white truncate">
                        {party.party_name}
                      </h3>
                      <p className="text-sm text-white/80 mt-1">
                        Leader:{" "}
                        <span className="font-medium">
                          {party.party_leader_name}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Vision */}
                  <p className="mt-4 text-white/85 line-clamp-3">
                    {party.party_vision || "No vision provided."}
                  </p>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                      onClick={() => toggle_goals(index)}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-white/90 bg-white/10 hover:bg-white/15 transition"
                    >
                      {is_open ? (
                        <>
                          Hide Goals <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          View Goals <ChevronDown size={16} />
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handle_vote(index)}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-400 hover:to-secondary-400 transition"
                    >
                      Vote This Party <ArrowRight size={16} />
                    </button>
                  </div>

                  {/* Goals list */}
                  <AnimatePresence initial={false}>
                    {is_open &&
                      Array.isArray(party.party_goals) &&
                      party.party_goals.length > 0 && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="mt-5 overflow-hidden space-y-2"
                        >
                          {party.party_goals.map((goal, goal_index) => (
                            <li
                              key={`${party.ID}-goal-${goal_index}`}
                              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white/90"
                            >
                              • {goal}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
