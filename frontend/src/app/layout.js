import "../output.css";
import SiteHeader from "../components/CommonHeader"; // integrate the refactored header

const election_host =
  process.env.NEXT_PUBLIC_ELECTION_HOST || "http://localhost:8080";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  const cookie_store = await cookies();
  const token = cookie_store.get("token")?.value;
  let is_authenticated = !!token;
  let is_admin = false;

  if (is_authenticated) {
    try {
      const decoded_token = jwt.decode(token);
      if (decoded_token.exp < Date.now() / 1000) {
        is_authenticated = false;
        // Optional: clear cookie via server action or a separate route
        // For now we just treat it as not authenticated
      } else {
        is_admin = !!decoded_token.admin;
      }
    } catch (e) {
      is_authenticated = false;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen font-sans antialiased colorful-surface">
        <div className="relative flex flex-col min-h-screen">
          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="blob blob-primary" />
            <div className="blob blob-secondary" />
            <div className="vignette" />
          </div>

          {/* Use the shared header here */}
          <SiteHeader
            title="Election Dashboard"
            is_authenticated={is_authenticated}
            is_admin={is_admin}
          />

          <main className="flex-1">{children}</main>

          <footer className="border-t/0 bg-white/10 dark:bg-black/20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-sm text-white/90 dark:text-white/90">
                © {new Date().getFullYear()} Election Dashboard. All rights
                reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
