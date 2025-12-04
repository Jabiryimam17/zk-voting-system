// JavaScript (React)
"use client";
import React, { useState, useEffect } from "react";
import VerifyPhone from "../../components/VerifyPhone";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  User,
  Eye,
  CheckCircle2,
  TriangleAlert,
  X,
  Info,
  Target,
} from "lucide-react";

const PartyProfile = () => {
  const [national_id, set_national_id] = useState("");
  const search_params = useSearchParams();
  const [party_id, set_party_id] = useState("");
  const [open_confirm, set_open_confirm] = useState(false);
  const [confirmed, set_confirmed] = useState(false);
  const [party, set_party] = useState({
    party_leader_name: "",
    party_goals: [],
    party_description: "",
    party_vision: "",
    party_name: "",
    party_symbol: "http://localhost:3000/images/download.png",
    party_shortname: "",
  });

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      try {
        const decoded_token = jwtDecode(token);
        set_national_id(decoded_token["id"] || "");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetch_party = async () => {
      try {
        const id = search_params.get("id") || "";
        set_party_id(id);
        if (!id) return;

        const response = await axios.get(
          `http://localhost:8080/api/parties/${id}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const payload = response.data?.party;
          const partyData = Array.isArray(payload) ? payload[0] : payload;

          // Normalize goals: array or comma-separated string -> array
          let goals = partyData?.party_goals ?? [];
          if (typeof goals === "string") {
            goals = goals
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean);
          }

          set_party({
            party_leader_name: partyData?.party_leader_name || "",
            party_goals: goals,
            party_description: partyData?.party_description || "",
            party_vision: partyData?.party_vision || "",
            party_name: partyData?.party_name || "",
            party_symbol:
              partyData?.party_symbol ||
              "http://localhost:3000/images/download.png",
            party_shortname:
              partyData?.short_name || partyData?.party_shortname || "",
          });
        } else {
          console.error("Failed to fetch party data");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch_party();
  }, [search_params]);

  // Layout: wider centered card
  return (
    <div title={"Party Profile"}>
      {/* widened from max-w-[52.5rem] to max-w-[72rem] (~1152px) */}
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8 py-12">
        <div className="min-h-[80vh] gradient-border rounded-3xl p-[1px] shadow-elevation">
          <div
            className="glass-card rounded-3xl p-8 md:p-12"
            style={{
              paddingRight: "100px",
              paddingLeft: "100px",
              paddingTop: "50px",
              paddingBottom: "50px",
              minHeight: "80vh",
            }}
          >
            {/* Header band with Vision on the right (side-by-side) */}
            <div className="grid gap-8 md:gap-10 sm:grid-cols-2">
              {/* Left: logo + name + leader */}
              <div className="flex items-start gap-5 md:gap-6">
                <div className="relative shrink-0">
                  <img
                    src={
                      party?.party_symbol ||
                      "http://localhost:3000/images/download.png"
                    }
                    alt={party?.party_name || "Party symbol"}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-white/30 shadow-lg"
                    onError={(e) => {
                      const t = e.target;
                      if (t && t.tagName === "IMG") {
                        t.src = "";
                      }
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 ring-2 ring-black/30" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-200 via-white to-secondary-200 bg-clip-text text-transparent">
                    {party["party_name"] || "Party"}
                  </h1>
                  <div className="mt-2 inline-flex items-center gap-2 text-white/90">
                    <User size={16} />
                    <span className="text-sm">
                      Party Leader:{" "}
                      <span className="font-semibold">
                        {party["party_leader_name"] || "—"}
                      </span>
                    </span>
                  </div>
                  {party["party_shortname"] && (
                    <div className="mt-2">
                      <span className="inline-block rounded-full bg-white/10 text-white/90 text-base px-4 py-2 ring-1 ring-white/15 leading-snug whitespace-normal break-words max-w-full md:max-w-[28rem]">
                        Short name: {party["party_shortname"]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Vision summary + Vote (responsive, non-distorting) */}
              <div>
                <div
                  className="rounded-2xl border border-white/15 bg-white/5 p-6 md:p-7 h-full flex flex-col"
                  style={{ marginBottom: "20px" }}
                >
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Eye size={16} />
                    Our Vision
                  </div>

                  {/* Responsive, scrollable on small screens without distortion */}
                  <div className="mt-2 text-white/85 leading-relaxed whitespace-pre-line break-words overflow-hidden">
                    <div className="max-h-48 sm:max-h-60 md:max-h-72 overflow-auto pr-1">
                      {party["party_vision"]?.trim()
                        ? party["party_vision"]
                        : "No vision provided."}
                    </div>
                  </div>

                  <div className="mt-4 pt-1">
                    <button
                      onClick={() => set_open_confirm(true)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-400 hover:to-secondary-400 transition shadow-lg shadow-black/30"
                    >
                      <CheckCircle2 size={16} />
                      Vote
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* More breathing room below header */}
            <div className="mt-16 md:mt-20 space-y-12 md:space-y-14">
              {/* Description */}
              <section className="rounded-2xl border border-white/15 bg-white/5 p-6 md:p-8">
                <h3 className="flex items-center gap-3 text-white font-semibold">
                  <Info size={18} />
                  Description
                </h3>
                <p className="mt-4 text-white/85 leading-relaxed whitespace-pre-line break-words">
                  {party["party_description"]?.trim()
                    ? party["party_description"]
                    : "No description provided."}
                </p>
              </section>

              {/* Goals (structured, beautiful) */}
              <section
                style={{ marginBottom: "15px", marginTop: "15px" }}
                className="rounded-2xl border border-white/15 bg-white/5 p-6 md:p-8 mt-8"
              >
                <h3 className="flex items-center gap-3 text-white font-semibold">
                  <Target size={18} />
                  Goals
                </h3>

                {party["party_goals"]?.length > 0 ? (
                  <ol className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
                    {party["party_goals"].map((goal, index) => (
                      <li
                        key={index}
                        className="group relative rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-start gap-3 hover:border-white/20 transition-colors"
                        style={{
                          marginBottom: "1.5rem",
                          marginRight: "1.5rem",
                        }}
                      >
                        <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold shadow-md">
                          {index + 1}
                        </span>
                        <p className="text-white/90 leading-relaxed break-words">
                          {goal}
                        </p>
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            boxShadow:
                              "inset 0 0 0 1px rgba(255,255,255,0.06), 0 10px 20px -10px rgba(0,0,0,0.4)",
                          }}
                        />
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-4 text-white/80">No goals provided.</p>
                )}
              </section>

              {/* Bottom action */}
              <div className="pt-2 md:pt-4 flex justify-end">
                <button
                  onClick={() => set_open_confirm(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-400 hover:to-secondary-400 transition shadow-lg shadow-black/30"
                >
                  <CheckCircle2 size={18} />
                  Vote for {party["party_name"] || "this party"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Confirmation Modal (unchanged) */}
        {open_confirm && (
          <div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/60 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md gradient-border rounded-2xl p-[1px]">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <TriangleAlert className="text-amber-300" size={20} />
                    <h3 className="text-lg font-semibold text-white">
                      Confirm Your Vote
                    </h3>
                  </div>
                  <button
                    onClick={() => set_open_confirm(false)}
                    className="rounded-md p-1 hover:bg-white/10"
                    aria-label="Close"
                  >
                    <X size={18} className="text-white/80" />
                  </button>
                </div>

                <div className="mt-4 text-white/90">
                  <p>
                    Are you sure you want to vote for{" "}
                    <strong>
                      {party["Party Name"] || party["party_name"]}
                    </strong>
                    ?
                  </p>
                  <p className="mt-3 text-red-300 inline-flex items-center gap-2">
                    <TriangleAlert size={16} />
                    This decision cannot be changed after submission.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    onClick={() => set_open_confirm(false)}
                    className="rounded-lg px-4 py-2 bg-white/10 hover:bg-white/15 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => set_confirmed(true)}
                    className="rounded-lg px-4 py-2 font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-400 hover:to-secondary-400"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phone verification flow (unchanged) */}
        {confirmed && (
          <div className="mt-6">
            <VerifyPhone party_id={party_id} set_confirmed={set_confirmed} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyProfile;
