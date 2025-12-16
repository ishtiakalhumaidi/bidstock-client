import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import Logo from "./Logo";
import { useAuth } from "../../hooks/useAuth";


const navItems = [
  { name: "Home", href: "/" },
  {
    name: "Marketplace",
    href: "/marketplace",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Live Auctions",
        href: "/auctions",
        description: "Bid on wholesale inventory in real-time",
      },
      {
        name: "Warehouse Storage",
        href: "/warehouses",
        description: "Rent commercial space for your stock",
      },
      {
        name: "Sell Inventory",
        href: "/suppliers",
        description: "List your products for bulk auction",
      },
    ],
  },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const { isAuthenticated } = useAuth(); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed top-0 inset-x-0 z-50"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        backdropFilter: isScrolled ? "blur(16px)" : "none",
        backgroundColor: isScrolled ? "rgba(255,255,255,0.85)" : "transparent",
        boxShadow: isScrolled ? "0 8px 32px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.hasDropdown && setActiveDropdown(item.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-1 font-medium text-zinc-700 hover:text-rose-600 transition"
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown size={16} />}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.name && (
                    <motion.div
                      className="absolute top-full mt-3 w-64 rounded-xl border bg-white shadow-xl"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      {item.dropdownItems.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className="block px-4 py-3 hover:bg-zinc-100 transition"
                        >
                          <div className="font-medium text-zinc-900">{sub.name}</div>
                          <div className="text-sm text-zinc-500">{sub.description}</div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full
                    bg-gradient-to-r from-rose-500 to-rose-700
                    px-6 py-2.5 text-white font-medium shadow-md hover:shadow-lg"
                >
                  Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <Link
                  to="/auth/signin"
                  className="font-medium text-zinc-700 hover:text-rose-600 transition"
                >
                  Sign In
                </Link>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/auth/signup"
                    className="inline-flex items-center gap-2 rounded-full
                      bg-gradient-to-r from-rose-500 to-rose-700
                      px-6 py-2.5 text-white font-medium shadow-md hover:shadow-lg"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden rounded-lg p-2 hover:bg-zinc-100"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden mt-4 rounded-xl border bg-white shadow-xl overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-3 font-medium text-zinc-700 hover:bg-zinc-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Actions */}
              <div className="border-t p-4 space-y-3">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="block w-full text-center rounded-lg
                      bg-gradient-to-r from-rose-500 to-rose-700
                      py-2.5 font-medium text-white shadow hover:shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth/signin"
                      className="block w-full text-center rounded-lg py-2 
                        font-medium text-zinc-700 hover:bg-zinc-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>

                    <Link
                      to="/auth/signup"
                      className="block w-full text-center rounded-lg
                        bg-gradient-to-r from-rose-500 to-rose-700
                        py-2.5 font-medium text-white shadow hover:shadow-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
