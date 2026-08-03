import { Link } from "react-router";
import { Gauge } from "lucide-react";

const columns = [
  {
    title: "Marketplace",
    links: [
      { to: "/auctions", label: "Live auctions" },
      { to: "/warehouses", label: "Warehouses" },
      { to: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/auth/signup", label: "Create account" },
      { to: "/auth/signin", label: "Sign in" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-dim/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-7 w-7 rounded-lg bg-ink flex items-center justify-center">
                <Gauge size={14} className="text-amber" />
              </span>
              <span className="font-display font-semibold text-ink">BidStock</span>
            </div>
            <p className="text-sm text-ink-soft max-w-xs">
              Warehouse space, stock, and auctions in one working floor —
              list, rent, bid, close.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted mb-3">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="link-underline text-sm text-ink-soft hover:text-ink transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-muted">© {new Date().getFullYear()} BidStock. All rights reserved.</p>
          <p className="font-mono text-xs text-ink-muted">Built for the warehouse floor</p>
        </div>
      </div>
    </footer>
  );
}