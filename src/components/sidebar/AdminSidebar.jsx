import React from "react";
import { Link, NavLink } from "react-router";
import {
  LayoutDashboard,
  Gavel,
  Package,
  Warehouse,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import Logo from "../common/Logo";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Active Auctions", href: "/dashboard/auctions", icon: Gavel },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Warehouses", href: "/dashboard/warehouses", icon: Warehouse },
  { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function AdminSidebar({ className }) {
  return (
    <aside
      className={`flex flex-col h-full bg-white border-r border-zinc-200 w-64 ${className}`}
    >
      {/* Brand Logo Area */}
      <Link to={'/'} className="h-16 flex items-center px-6 border-b border-zinc-100">
        <Logo />
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/dashboard"} // Only exact match for root
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-rose-50 text-rose-700 shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={18}
                  className={isActive ? "text-rose-600" : "text-zinc-400"}
                  strokeWidth={2}
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-zinc-100">
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
