"use client";

import { useState, useEffect } from "react";
import { election_contract } from "@ethereum/election";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

const national_id_host =
  process.env.NEXT_PUBLIC_NATIONAL_ID_HOST || "http://localhost:5000";

export default function Manage() {
  const router = useRouter();
  const [merkle_root, set_merkle_root] = useState("");
  const [host, set_host] = useState("");
  const [link_amount, set_link_amount] = useState("");
  const [status, set_status] = useState("");
  const [is_updating, set_is_updating] = useState(false);
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

    fetch_merkle_root();
  }, [router]);

  const fetch_merkle_root = async () => {
    try {
      const response = await axios.get(`${national_id_host}/merkle_root`);
      let root = response.data["merkle_root"];
      if (root && !root.startsWith("0x")) root = "0x" + root;
      set_merkle_root(root);
    } catch (error) {
      console.error("Failed to fetch Merkle root:", error);
    }
  };

  const handle_update_merkle_root = async () => {
    if (!merkle_root) {
      set_error_msg("Please enter a valid Merkle root.");
      return;
    }
    set_error_msg("");
    set_is_updating(true);
    set_status("Updating Merkle root...");
    try {
      const contract = await election_contract();
      const tx = await contract.set_merkle_root(merkle_root);
      await tx.wait();
      set_status("Merkle root updated successfully!");
    } catch (error) {
      console.error(error);
      set_error_msg(error.message || "Failed to update Merkle root.");
      set_status("");
    } finally {
      set_is_updating(false);
    }
  };

  const handle_update_host = async () => {
    if (!host) {
      set_error_msg("Please enter a valid host/URL.");
      return;
    }
    set_error_msg("");
    set_is_updating(true);
    set_status("Updating host...");
    try {
      const contract = await election_contract();
      const tx = await contract.set_host(host);
      await tx.wait();
      set_status("Host updated successfully!");
    } catch (error) {
      console.error(error);
      set_error_msg(error.message || "Failed to update host.");
      set_status("");
    } finally {
      set_is_updating(false);
    }
  };

  const handle_transfer_link = async () => {
    if (!link_amount || isNaN(link_amount) || parseFloat(link_amount) <= 0) {
      set_error_msg("Please enter a valid LINK amount.");
      return;
    }
    set_error_msg("");
    set_is_updating(true);
    set_status("Transferring LINK...");
    try {
      const { ethers } = await import("ethers");
      const contract = await election_contract();
      const election_address = await contract.getAddress();
      const link_token_address = await contract.link_token();

      const link_abi = [
        "function transfer(address to, uint256 value) public returns (bool)",
      ];
      const signer = contract.runner;
      const link_contract = new ethers.Contract(
        link_token_address,
        link_abi,
        signer
      );

      const amount_in_wei = ethers.parseEther(link_amount);
      const tx = await link_contract.transfer(election_address, amount_in_wei);
      await tx.wait();

      set_status(
        `Successfully transferred ${link_amount} LINK to election contract!`
      );
      set_link_amount("");
    } catch (error) {
      console.error(error);
      set_error_msg(error.message || "Failed to transfer LINK.");
      set_status("");
    } finally {
      set_is_updating(false);
    }
  };

  return (
    <div
      className="min-h-[80vh] w-full flex items-center justify-center px-6"
      style={{ marginTop: "100px" }}
    >
      <div className="w-full max-w-2xl text-center">
        <h1 className="title">Manage Election</h1>
        <p className="subtitle">
          Update the Merkle root and host URL for your election contract.
        </p>

        <div className="mt-8 flex flex-col items-center gap-6">
          {/* Merkle Root input */}
          <div className="w-full max-w-sm flex flex-col gap-2">
            <label
              htmlFor="merkle_root"
              className="text-white/85 text-sm text-left"
            >
              Merkle Root
            </label>
            <div className="flex gap-2">
              <input
                id="merkle_root"
                type="text"
                value={merkle_root}
                onChange={(e) => set_merkle_root(e.target.value)}
                placeholder="0x..."
                className="w-full input-glass"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  outline: "none",
                }}
              />
              <button
                onClick={handle_update_merkle_root}
                disabled={is_updating}
                className="btn-small"
              >
                Update
              </button>
            </div>
          </div>

          {/* Host input */}
          <div className="w-full max-w-sm flex flex-col gap-2">
            <label htmlFor="host" className="text-white/85 text-sm text-left">
              Host / URL
            </label>
            <div className="flex gap-2">
              <input
                id="host"
                type="text"
                value={host}
                onChange={(e) => set_host(e.target.value)}
                placeholder="http://..."
                className="w-full input-glass"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  outline: "none",
                }}
              />
              <button
                onClick={handle_update_host}
                disabled={is_updating}
                className="btn-small"
              >
                Update
              </button>
            </div>
          </div>

          {/* LINK Transfer input */}
          <div className="w-full max-w-sm flex flex-col gap-2">
            <label
              htmlFor="link_amount"
              className="text-white/85 text-sm text-left"
            >
              Transfer LINK to Contract
            </label>
            <div className="flex gap-2">
              <input
                id="link_amount"
                type="text"
                value={link_amount}
                onChange={(e) => set_link_amount(e.target.value)}
                placeholder="Amount in LINK"
                className="w-full input-glass"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  outline: "none",
                }}
              />
              <button
                onClick={handle_transfer_link}
                disabled={is_updating}
                className="btn-small"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          {/* Animated status area */}
          <div className={`status-wrap ${status || error_msg ? "show" : ""}`}>
            {status && (
              <>
                <div className="status-bar">
                  <div
                    className={`status-fill ${is_updating ? "animate" : ""}`}
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
        .btn-small {
          padding: 0.5rem 1rem;
          border-radius: 12px;
          color: #fff;
          font-weight: 600;
          background: linear-gradient(90deg, #078930, #fcd116 45%, #e81b23);
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-small:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
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
        .status-bar {
          position: relative;
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .status-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #078930, #fcd116, #e81b23);
          transform: translateX(-100%);
        }
        .status-fill.animate {
          animation: flow 1.6s ease-in-out infinite;
        }
        @keyframes flow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .status-text {
          color: rgba(255, 255, 255, 0.86);
        }
        .error-text {
          color: #fca5a5;
        }
      `}</style>
    </div>
  );
}
