import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Gavel,
  Package,
  Warehouse,
  CreditCard,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "../common/Logo";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Active Auctions", href: "/dashboard/auctions", icon: Gavel },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Warehouses", href: "/dashboard/warehouses", icon: Warehouse },
  { name: "My Warehouses", href: "/dashboard/my-warehouses", icon: Warehouse },
  { name: "My Rents", href: "/dashboard/my-rents", icon: Warehouse },
  { name: "Add Warehouses", href: "/dashboard/add-warehouse", icon: Warehouse },
  { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  { name: "Add Product", href: "/dashboard/add-product", icon: Users },
  { name: "My Products", href: "/dashboard/my-product", icon: Package },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function AdminSidebar({ className }) {
  const { logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();         
    navigate("/");    
  };

  return (
    <aside
      className={`flex flex-col h-full bg-white border-r border-zinc-200 w-64 ${className}`}
    >
      {/* Brand Logo Area */}
      <Link
        to={"/"}
        className="h-16 flex items-center px-6 border-b border-zinc-100"
      >
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
              ${isActive
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
        <button
          onClick={handleLogout} // 
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
