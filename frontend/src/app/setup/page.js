"use client";

import { useState, useEffect } from "react";
import election_contract from "@ethereum/election";
import deploy_election from "@ethereum/election_deploy";
import deploy_verifier from "@ethereum/verifier_deploy";
import { useRouter } from "next/navigation";
import axios from "axios";
import transfer_link from "@ethereum/transfer_token";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function Setup() {
  const router = useRouter();
  const [amount, set_amount] = useState();
  const [status, set_status] = useState("");
  const [is_starting, set_is_starting] = useState(false);
  const [error_msg, set_error_msg] = useState("");
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      const decoded = jwt_decode(token);
      if (!decoded.admin) router.push("/unauthorized");
    } else router.push("/login");
  }, [router]);
  const handle_contract_deploy = async () => {
    set_error_msg("");
    set_is_starting(true);
    try {
      set_status("Deploying verifier...");
      const verifier_address = await deploy_verifier();
      set_status("Deploying election...");
      const election_address = await deploy_election(verifier_address);

      set_status("Fetching Merkle root...");
      const response = await axios.get("http://localhost:5000/merkle_root");
      let merkle_root = response.data["merkle_root"];
      if (!merkle_root?.startsWith("0x")) merkle_root = "0x" + merkle_root;

      set_status("Setting up contract...");
      const election_contract_instance = election_contract(election_address);
      const tx = await election_contract_instance.set_merkle_root(merkle_root);
      await tx.wait();
      await transfer_link(
        "0x779877a7b0d9e8603169ddbd7836e478b4624789",
        amount,
        election_address
      );

      set_status("Saving addresses...");
      await axios.post(
        "http://localhost:8080/api/users/contract_address",
        {
          election_address,
          verifier_address,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      set_status("Done! Redirecting...");
      setTimeout(() => router.push("/"), 600);
    } catch (error) {
      console.error(error.reason || error.message);
      console.log(error.args);
      set_error_msg(
        error?.message
          ? `Error: ${error.message}`
          : "Error: Failed to start the election."
      );
      set_status("");
      set_is_starting(false);
    }
  };

  return (
    <div
      className="min-h-[80vh] w-full flex items-center justify-center px-6"
      style={{ marginTop: "100px" }}
    >
      <div className="w-full max-w-2xl text-center">
        <h1 className="title">Election Setup</h1>
        <p className="subtitle">
          Deploy contracts, set the Merkle root, and launch your on-chain
          election.
        </p>

        {/* Amount input */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <label htmlFor="amount" className="text-white/85 text-sm">
            Amount (minimum 50)
          </label>
          <input
            id="amount"
            type="number"
            min={50}
            step={1}
            value={amount}
            onChange={(e) => set_amount(Number(e.target.value || 0))}
            placeholder="Enter amount to fund the election"
            className="w-full max-w-sm input-glass"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              outline: "none",
            }}
          />
          <p className="text-xs text-white/70">
            This amount will be transferred when starting the election.
          </p>
        </div>

        <div className="mt-10" style={{ marginTop: "30px" }}>
          <button
            type="button"
            onClick={handle_contract_deploy}
            disabled={is_starting}
            className={`btn ${is_starting ? "btn-disabled" : ""}`}
          >
            <span className="btn-glow" aria-hidden />
            <span className="btn-shimmer" aria-hidden />
            {is_starting ? (
              <span className="inline-flex items-center gap-2">
                <span className="spinner" />
                <span>Starting...</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="rocket"
                >
                  <path
                    d="M14.5 5.5l4 4M7 17l-3 3 4-1 3-3m3-10l5.5-1.5L20 7l-5 5-6 2 2-6 5-5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Start the Election</span>
              </span>
            )}
          </button>

          {/* Animated status area */}
          <div className={`status-wrap ${status || error_msg ? "show" : ""}`}>
            {status && (
              <>
                <div className="status-bar">
                  <div
                    className={`status-fill ${is_starting ? "animate" : ""}`}
                  />
                </div>
                <p className="status-text">{status}</p>
              </>
            )}
            {error_msg && <p className="error-text">{error_msg}</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Ethiopia palette accents on a dark base */
        :global(html),
        :global(body) {
          background: radial-gradient(
              1200px 600px at 10% -10%,
              rgba(7, 137, 48, 0.14),
              transparent
            ),
            radial-gradient(
              900px 500px at 110% 10%,
              rgba(252, 209, 22, 0.14),
              transparent
            ),
            radial-gradient(
              900px 520px at -10% 110%,
              rgba(232, 27, 35, 0.12),
              transparent
            ),
            #0b0b12;
        }

        .title {
          font-size: clamp(2rem, 3.3vw, 3rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, #cfeedd, #fff4bf 45%, #ffc9c7);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 2px 12px rgba(7, 137, 48, 0.22);
        }
        .subtitle {
          margin-top: 10px;
          color: rgba(255, 255, 255, 0.78);
        }

        /* Button with Ethiopian flag gradient */
        .btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.95rem 1.6rem;
          border-radius: 16px;
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.2px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background-image: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.08),
              rgba(255, 255, 255, 0.02)
            ),
            linear-gradient(90deg, #078930, #fcd116 45%, #e81b23);
          box-shadow: 0 10px 30px -10px rgba(7, 137, 48, 0.45),
            0 16px 40px -12px rgba(232, 27, 35, 0.35),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(2px);
          transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 200ms ease, background 300ms ease;
          overflow: hidden;
          isolation: isolate;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px -12px rgba(252, 209, 22, 0.45),
            0 24px 50px -16px rgba(232, 27, 35, 0.4),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.18);
        }
        .btn:active {
          transform: translateY(-0.5px) scale(0.99);
        }
        .btn:disabled,
        .btn.btn-disabled {
          opacity: 0.9;
          cursor: not-allowed;
          filter: saturate(0.9);
        }

        /* Soft glow behind button */
        .btn-glow {
          position: absolute;
          inset: -40%;
          background: radial-gradient(
            45% 45% at 50% 50%,
            rgba(252, 209, 22, 0.18),
            rgba(252, 209, 22, 0) 70%
          );
          filter: blur(14px);
          opacity: 0;
          transition: opacity 350ms ease;
          z-index: -1;
        }
        .btn:hover .btn-glow {
          opacity: 1;
        }

        /* Diagonal shimmer sweep on hover */
        .btn-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 20%,
            rgba(255, 255, 255, 0.02) 35%,
            transparent 60%
          );
          transform: translateX(-120%);
          transition: transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .btn:hover .btn-shimmer {
          transform: translateX(120%);
        }

        /* Rocket micro animation */
        .rocket {
          color: #fff;
          transform: translateY(0);
          transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .btn:hover .rocket {
          transform: translateY(-1px) translateX(1px);
        }

        /* Spinner for loading state */
        .spinner {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          animation: spin 900ms linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Status area (fade + slide in) */
        .status-wrap {
          display: grid;
          gap: 10px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 260ms ease, transform 260ms ease;
          margin-top: 18px;
        }
        .status-wrap.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* Progress bar using Ethiopia colors */
        .status-bar {
          position: relative;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.08),
            rgba(255, 255, 255, 0.02)
          );
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .status-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(7, 137, 48, 0),
            rgba(7, 137, 48, 0.65),
            rgba(252, 209, 22, 0.75),
            rgba(232, 27, 35, 0.65),
            rgba(232, 27, 35, 0)
          );
          transform: translateX(-100%);
          opacity: 0.95;
        }
        .status-fill.animate {
          animation: flow 1.6s ease-in-out infinite;
        }
        @keyframes flow {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(-10%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .status-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.86);
        }
        .error-text {
          font-size: 0.95rem;
          color: #fca5a5;
        }

        /* Small entrance motion for the whole section */
        :global(.min-h-\[80vh\]) > div > div {
          animation: rise-in 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        @keyframes rise-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.995);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
