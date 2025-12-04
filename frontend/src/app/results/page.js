"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EmojiEvents } from "@mui/icons-material";
import { election_contract } from "@ethereum/election.js";
import { ethers } from "ethers";
import { toUtf8String, toUtf8Bytes } from "ethers/utils";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ElectionStatus() {
  const [parties, set_parties] = useState([]);

  useEffect(() => {
    const fetch_parties = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/parties", {
          withCredentials: true,
        });
        const contract_instance = await election_contract();
        const api_parties = response.data.parties;
        const parties_id = await contract_instance.fetch_parties();

        if (api_parties.length !== parties_id.length) {
          throw new Error("Invalid Configurations");
        }

        const parties_map = new Map(api_parties.map((p) => [p["ID"], p]));
        const total_supporters = await contract_instance.total_participants();
        const full_parties = await Promise.all(
          parties_id.map(async (party_id_bytes) => {
            const party_id = toUtf8String(party_id_bytes).replace(/\0/g, "");

            const party = parties_map.get(party_id);
            if (!party) {
              throw new Error("Missing Party");
            }

            const supporters_big_number = await contract_instance.parties(
              party_id_bytes
            );
            const supporters = supporters_big_number.supporters.toString();

            return {
              leader: party.party_leader_name,
              vision: party.party_vision,
              supporters: supporters,
              symbol: party.party_symbol,
              name: party.party_name,
              percentage:
                total_supporters > 0n
                  ? (
                      (Number(supporters) / Number(total_supporters)) *
                      100
                    ).toFixed(2)
                  : "0",
            };
          })
        );

        full_parties.sort(
          (a, b) => parseInt(b.supporters) - parseInt(a.supporters)
        );

        set_parties(full_parties);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetch_parties();
    const interval_id = setInterval(fetch_parties, 900000);
    return () => clearInterval(interval_id);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full gradient-chip shadow-md">
          <EmojiEvents fontSize="small" className="text-white/90" />
          <span className="text-xs font-semibold tracking-wide text-white/90">
            Live Leaderboard
          </span>
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary-200 via-white to-secondary-200 bg-clip-text text-transparent drop-shadow-sm">
          Election Status
        </h1>
        <p className="mt-3 text-lg text-white/90 max-w-2xl mx-auto">
          Track parties, leaders, and real-time support with a vibrant, modern
          UI.
        </p>
      </div>

      {/* Card + Table with gradient border */}
      <motion.div
        className="gradient-border rounded-2xl p-[1px] shadow-elevation"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="glass-card rounded-2xl overflow-hidden">
          <Table className="min-w-full">
            <TableHeader className="bg-gradient-to-r from-primary-600/90 via-primary-500/90 to-secondary-500/90 text-white backdrop-blur-sm">
              <TableRow className="[&>th]:text-left [&>th]:font-semibold [&>th]:py-4 [&>th]:px-5">
                <TableHead>Rank</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>Supporters</TableHead>
                <TableHead>Support %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parties.length === 0
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <TableCell className="py-4 px-5">
                        <div className="h-3 w-6 rounded bg-white/20" />
                      </TableCell>
                      <TableCell className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20" />
                          <div className="h-3 w-40 rounded bg-white/20" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-5">
                        <div className="h-3 w-32 rounded bg-white/20" />
                      </TableCell>
                      <TableCell className="py-4 px-5">
                        <div className="h-3 w-16 rounded bg-white/20" />
                      </TableCell>
                      <TableCell className="py-4 px-5">
                        <div className="h-3 w-14 rounded bg-white/20" />
                      </TableCell>
                    </tr>
                  ))
                : parties.map((party, index) => (
                    <motion.tr
                      key={party.name + index}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.035, ease: "easeOut" }}
                      className="group transition-colors duration-300 even:bg-white/5 hover:bg-white/10"
                      title={`Vision: ${party.vision}`}
                    >
                      <TableCell className="py-4 px-5 font-semibold text-white/90">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={party.symbol || ""}
                              alt={party.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                              onError={(e) => {
                                const t = e.target;
                                if (t && t.tagName === "IMG")
                                  t.src =
                                    "https://via.placeholder.com/40?text=?";
                              }}
                            />
                            <span className="absolute -bottom-1 -right-1 inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 ring-2 ring-black/30" />
                          </div>
                          <span className="font-medium text-white group-hover:text-primary-200 transition-colors">
                            {party.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-5 text-white/80">
                        {party.leader}
                      </TableCell>
                      <TableCell className="py-4 px-5 text-white/80">
                        {party.supporters}
                      </TableCell>
                      <TableCell className="py-4 px-5">
                        <div className="flex items-center gap-3 max-w-[220px]">
                          <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400"
                              style={{ width: `${party.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white/90 min-w-[42px] text-right">
                            {party.percentage}%
                          </span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
