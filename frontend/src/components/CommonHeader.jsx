// JavaScript (React / Next.js)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SiteHeader({
  title = "Election Dashboard",
  is_authenticated = false,
}) {
  const router = useRouter();
  const [is_logging_out, set_is_logging_out] = useState(false);

  const handle_logout = async () => {
    try {
      set_is_logging_out(true);
      // Call your backend logout (adjust URL as needed)
      const res = await fetch("http://localhost:8080/api/users/logout", {
        method: "POST",
        credentials: "include", // include cookies
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        // optionally read the body for details
        console.error("Logout failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      // Ensure UI updates even if API fails (cookie may already be gone)
      set_is_logging_out(false);
      router.push("/"); // go to home (or a dedicated logged-out page)
      router.refresh(); // make the server layout re-read cookies
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold drop-shadow-sm">{title}</h1>

          <nav className="hidden sm:flex items-center gap-2">
            <Link href="/" className="btn-link">
              Home
            </Link>
            {is_authenticated ? (
              <div>
                <Link
                  href="/results"
                  className="btn-link/soft"
                  style={{ marginRight: "2px" }}
                >
                  Results
                </Link>
                <Link
                  href="/parties"
                  className="btn-link/soft"
                  style={{ marginRight: "2px" }}
                >
                  Parties
                </Link>
                <button
                  onClick={handle_logout}
                  disabled={is_logging_out}
                  className="btn-link/soft"
                  aria-busy={is_logging_out}
                  style={{ marginRight: "2px" }}
                >
                  {is_logging_out ? "Logging Out..." : "Log Out"}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-link/soft"
                  style={{ marginRight: "2px" }}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="btn-link"
                  style={{ marginRight: "3px" }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
