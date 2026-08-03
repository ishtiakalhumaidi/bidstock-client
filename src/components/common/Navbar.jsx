import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Logo from "./Logo";
import Button from "../ui/Button";

const navLinks = [
  { to: "/auctions", label: "Auctions" },
  { to: "/warehouses", label: "Warehouses" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? "text-ink bg-paper-dim" : "text-ink-soft hover:text-ink hover:bg-paper-dim"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth/signin" className="px-3.5 py-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors">
                Sign in
              </Link>
              <Link to="/auth/signup">
                <Button variant="accent" size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-ink hover:bg-paper-dim press-scale"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-paper px-4 py-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-ink-soft hover:bg-paper-dim hover:text-ink"
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-3 mt-3 border-t border-line flex flex-col gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                <Button variant="primary" className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/signin" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link to="/auth/signup" onClick={() => setOpen(false)}>
                  <Button variant="accent" className="w-full">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}