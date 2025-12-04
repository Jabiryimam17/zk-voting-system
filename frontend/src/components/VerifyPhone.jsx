"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, IdCard, ShieldCheck, X } from "lucide-react";
import axios from "axios";
import { ethers, encodeBytes32String } from "ethers";
import { election_contract } from "@ethereum/election.js";
import decrypt from "@utilities/decryptit.js";
import gen_proof from "@utilities/GenProof.js";

async function fetch_user_data(id, password) {
  try {
    const response = await axios.get(
      `http://localhost:5000/voter_info?id=${id}`
    );
    const merkle_path = response.data["merkle_path"];
    const secrets = response.data["secret"];
    const decrypted_secret = await decrypt(
      secrets[1],
      password,
      secrets[3],
      secrets[2]
    );
    return { merkle_path, decrypted_secret };
  } catch (error) {
    console.error("Error fetching merkle path:", error);
    throw error;
  }
}

export default function VerificationPopup(props) {
  const router = useRouter();
  const [official_id, set_official_id] = useState("");
  const [password, set_password] = useState("");
  const [show_password, set_show_password] = useState(false);
  const [is_loading, set_is_loading] = useState(false);
  const [error_msg, set_error_msg] = useState("");
  const [success, set_success] = useState(false);

  const closeAll = () => {
    props.set_confirmed(false);
    set_success(false);
    set_error_msg("");
    set_official_id("");
    set_password("");
  };

  const handle_initial_submit = async () => {
    set_error_msg("");
    if (!official_id.trim() || !password.trim()) {
      set_error_msg("Please fill in both National ID and Password.");
      return;
    }

    try {
      const { merkle_path, decrypted_secret } = await fetch_user_data(
        official_id.trim(),
        password
      );
      const inputs = {
        sid: decrypted_secret.sid,
        official_id: official_id.trim(),
        nullifier: decrypted_secret.nullifier,
        R8: decrypted_secret.R8,
        S: decrypted_secret.S,
        A: decrypted_secret.A,
        commitment: decrypted_secret.commitment,
        leaf: merkle_path.leaf,
        path: merkle_path.path,
        path_indices: merkle_path.path_indices,
        actives: merkle_path.actives,
        merkle_root: merkle_path.merkle_root,
      };

      await verify(inputs);
    } catch (error) {
      console.error(error);
      set_error_msg("Invalid ID or password. Please try again.");
    }
  };

  const verify = async (inputs) => {
    set_is_loading(true);
    set_error_msg("");
    try {
      const { proof, publicSignals: public_signals } = await gen_proof(inputs);
      console.log("Proof:", proof);
      console.log("Public Signals:", public_signals);
      const a = [proof.pi_a[0], proof.pi_a[1]];
      const b = [
        [proof.pi_b[0][1], proof.pi_b[0][0]],
        [proof.pi_b[1][1], proof.pi_b[1][0]],
      ];
      const c = [proof.pi_c[0], proof.pi_c[1]];
      const public_inputs = [public_signals[0], public_signals[1]];
      const a_bn = a.map((x) => BigInt(x));
      const b_bn = b.map((pair) => pair.map((x) => BigInt(x)));
      const c_bn = c.map((x) => BigInt(x));
      const public_inputs_bn = public_inputs.map((x) => BigInt(x));
      const contract_instance = await election_contract();
      const tx = await contract_instance.vote(
        public_inputs_bn[1],
        a_bn,
        b_bn,
        c_bn,
        public_inputs_bn,
        encodeBytes32String(props.party_id)
      );
      await tx.wait();

      set_success(true);
      setTimeout(() => {
        closeAll();
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Verification failed:", error);
      set_error_msg(
        "Verification failed. Please input the correct ID and password."
      );
    } finally {
      set_is_loading(false);
    }
  };

  // Always render; parent can unmount by calling set_confirmed(false)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeAll}
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        className="relative mx-4 w-full max-w-md gradient-border rounded-2xl p-[1px]"
      >
        <div className="glass-card rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="inline-flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 grid place-items-center ring-1 ring-white/30">
                <Lock size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-extrabold text-white">
                Authenticate to Vote
              </h2>
            </div>
            <button
              onClick={closeAll}
              aria-label="Close"
              className="rounded-md p-1 text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-white/80 mb-5">
            Enter your National ID and account password to verify and submit
            your vote securely.
          </p>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="official_id" className="form-label">
                National ID
              </label>
              <div className="relative">
                <input
                  id="official_id"
                  type="text"
                  placeholder="Enter your national ID"
                  value={official_id}
                  onChange={(e) => set_official_id(e.target.value)}
                  className="input-glass pl-10"
                  autoFocus
                />
                <IdCard size={18} className="input-icon" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={show_password ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => set_password(e.target.value)}
                  className="input-glass pl-10 pr-24"
                />
                <Lock size={18} className="input-icon" />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-white/80 hover:text-white"
                  onClick={() => set_show_password((s) => !s)}
                >
                  {show_password ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error_msg && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/15 text-red-200 px-4 py-3 backdrop-blur">
                {error_msg}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-200 px-4 py-3 backdrop-blur flex items-center gap-2">
                <ShieldCheck size={18} />
                Verification successful! Redirecting…
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              onClick={closeAll}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-white/90 bg-white/10 hover:bg-white/15 transition"
              disabled={is_loading}
            >
              Cancel
            </button>
            <button
              onClick={handle_initial_submit}
              className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5"
              disabled={is_loading}
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
              Vote
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
