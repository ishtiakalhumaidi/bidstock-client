import React from "react";
import { Link } from "react-router";
import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  // Converted the specific CSS gradients to a React style object
  const glassStyle = {
    backdropFilter: "blur(3px) saturate(180%)",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255, 220, 230, 0.3) 60%, #f9f2f4 100%)",
    border: "1px solid rgba(255, 150, 180, 0.1)",
  };

  return (
    <footer className="relative z-10 mt-8 w-full overflow-hidden pt-16 pb-8">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2 select-none">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-rose-600/10 blur-3xl"></div>
        <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-rose-600/10 blur-3xl"></div>
      </div>

      {/* Main Glass Container */}
      <div
        style={glassStyle}
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-2xl px-6 py-10 md:flex-row md:items-start md:justify-between md:gap-12 shadow-sm transition-all duration-300"
      >
        {/* Brand Column */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="mb-4 flex items-center gap-2">
            <Logo />
          </Link>
          <p className="text-zinc-600 mb-6 max-w-xs text-center text-sm md:text-left">
            Automating procurement and monetizing warehouse space for modern
            supply chains.
          </p>

          {/* Socials */}
          <div className="mt-2 flex gap-4 text-rose-400">
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-rose-600 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="hover:text-rose-600 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-rose-600 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex w-full flex-col gap-9 text-center md:w-auto md:flex-row md:justify-end md:text-left">
          {/* Column 1 */}
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-rose-500 uppercase">
              Marketplace
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/auctions"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link
                  to="/warehouses"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  Rent Storage
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/suppliers"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  For Suppliers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-rose-500 uppercase">
              Company
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-rose-500 uppercase">
              Resources
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/docs"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-zinc-600 hover:text-rose-600 transition-colors"
                >
                  Privacy & Terms
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="text-zinc-400 relative z-10 mt-10 text-center text-xs">
        <span>
          &copy; {new Date().getFullYear()} BidStock Inc. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
