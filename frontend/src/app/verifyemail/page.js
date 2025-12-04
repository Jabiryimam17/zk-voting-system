"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MailCheck, RefreshCw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function VerificationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const url_email = encodeURIComponent(email);

  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("idle"); // idle | sending | success | error
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  // Keep a stable 6-length refs array
  const inputsRef = useRef(Array(6).fill(null));

  const focusIndex = (idx) => {
    if (idx >= 0 && idx < 6) inputsRef.current[idx]?.focus();
  };

  // Allow digits, letters, underscore, hyphen
  const allowedRe = /[0-9A-Za-z_-]/g;

  const onChangeDigit = (i, raw) => {
    const chars = (raw.match(allowedRe) || []).join("");
    if (!chars) {
      setCodeDigits((prev) => {
        const next = [...prev];
        next[i] = "";
        return next;
      });
      return;
    }

    setCodeDigits((prev) => {
      const next = [...prev];
      let cursor = i;
      for (let k = 0; k < chars.length && cursor < 6; k += 1, cursor += 1) {
        next[cursor] = chars[k];
      }
      const nextEmpty = next.findIndex((d, idx) => idx > i && d === "");
      const toFocus = Math.min(i + chars.length, 5);
      focusIndex(nextEmpty !== -1 ? nextEmpty : toFocus);
      return next;
    });
  };

  const onKeyDown = (i, e) => {
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();
      setCodeDigits((prev) => {
        const next = [...prev];
        if (next[i]) {
          next[i] = "";
          return next;
        }
        if (i > 0) {
          next[i - 1] = "";
          focusIndex(i - 1);
        }
        return next;
      });
      return;
    }

    if (key === "ArrowLeft") {
      e.preventDefault();
      if (i > 0) focusIndex(i - 1);
      return;
    }

    if (key === "ArrowRight") {
      e.preventDefault();
      if (i < 5) focusIndex(i + 1);
      return;
    }

    // Block only non-allowed printable characters
    if (key.length === 1 && !/[0-9A-Za-z_-]/.test(key)) {
      e.preventDefault();
    }
  };

  const code = codeDigits.join("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (code.length < 6 || codeDigits.some((d) => d === "")) {
      setError("Please enter the 6-character code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/verify_email",
        {
          email: url_email,
          code,
        }
      );
      if (res.data?.is_valid) {
        setVerified(true);
      } else {
        setError("The code you entered is incorrect. Please try again.");
      }
    } catch (err) {
      setError("Could not verify the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async (event) => {
    event?.preventDefault?.();
    setResendStatus("sending");
    try {
      const res = await axios.patch(
        "http://localhost:8080/api/users/resend_code",
        { email: url_email }
      );
      setResendStatus(res.status === 200 ? "success" : "error");
    } catch {
      setResendStatus("error");
    }
    setTimeout(() => setResendStatus("idle"), 3000);
  };

  useEffect(() => {
    focusIndex(0);
  }, []);

  if (verified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md px-4 py-16"
      >
        <div className="gradient-border rounded-2xl p-[1px] shadow-elevation">
          <div className="glass-card rounded-2xl p-8 text-center">
            <ShieldCheck className="mx-auto text-white/90 mb-4" size={42} />
            <h2 className="text-2xl font-extrabold text-white mb-2">
              Verification Successful
            </h2>
            <p className="text-white/85">
              Your email {email || "your email"} has been verified.
            </p>
            <button
              className="btn-gradient mt-6 w-full"
              onClick={() => router.push("/login")}
            >
              Proceed to Login
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md px-4 py-16"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-chip shadow-md">
          <MailCheck size={16} className="text-white/90" />
          <span className="text-xs font-semibold tracking-wide text-white/90">
            Email Verification
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold bg-gradient-to-r from-primary-200 via-white to-secondary-200 bg-clip-text text-transparent">
          Verify your email
        </h1>
        <p className="mt-2 text-white/85">
          Enter the 6-character code we sent to{" "}
          <span className="font-semibold">{email || "your email"}</span>.
        </p>
      </div>

      <div className="gradient-border rounded-2xl p-[1px] shadow-elevation">
        <div className="glass-card rounded-2xl p-6">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="flex items-center justify-between gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="text"
                  autoComplete="one-time-code"
                  // Removed pattern to avoid browser regex parsing issues
                  maxLength={1}
                  className="otp-input"
                  value={codeDigits[i]}
                  onChange={(e) => onChangeDigit(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  ref={(el) => (inputsRef.current[i] = el)}
                  aria-label={`Character ${i + 1}`}
                />
              ))}
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/15 text-red-200 px-4 py-3 backdrop-blur">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="btn-gradient w-full mt-5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={resend}
              disabled={resendStatus === "sending"}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-white/90 bg-white/10 hover:bg-white/15 transition disabled:opacity-70"
            >
              <RefreshCw size={16} />
              {resendStatus === "sending" ? "Sending..." : "Resend Code"}
            </button>

            {resendStatus === "success" && (
              <p className="text-emerald-300 text-sm mt-2">
                New code sent successfully!
              </p>
            )}
            {resendStatus === "error" && (
              <p className="text-red-300 text-sm mt-2">
                Failed to resend. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
