import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Gavel,
  Package,
  Warehouse,
  CreditCard,
  Users,
  LogOut,
  User,
  PackagePlus,
  Wallet,    
  Key       
} from "lucide-react";
import Logo from "../common/Logo";
import { useAuth } from "../../hooks/useAuth";

export default function AdminSidebar({ className }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  
  const navItems = [
    { 
      name: "Overview", 
      href: "/dashboard", 
      icon: LayoutDashboard, 
      roles: ['admin', 'seller', 'buyer', 'warehouse_owner'] 
    },
    { 
      name: "User Management", 
      href: "/dashboard/users", 
      icon: Users, 
      roles: ['admin'] 
    },
    { 
      name: "Global Inventory", 
      href: "/dashboard/inventory", 
      icon: Package, 
      roles: ['admin'] 
    },
    
    
    { 
      name: "Add Product", 
      href: "/dashboard/add-product", 
      icon: PackagePlus, // Corrected from Users
      roles: ['seller'] 
    },
    { 
      name: "My Products", 
      href: "/dashboard/my-product", 
      icon: Package, 
      roles: ['seller'] 
    },
    { 
      name: "My Inventory", 
      href: "/dashboard/my-inventories", 
      icon: Package, 
      roles: ['seller'] 
    },
    { 
      name: "My Auctions", 
      href: "/dashboard/my-auctions", 
      icon: Gavel, 
      roles: ['seller'] 
    },
    { 
      name: "Rent Warehouse", 
      href: "/warehouses", 
      icon: Warehouse, 
      roles: ['seller'] 
    },
    { 
      name: "My Rents", 
      href: "/dashboard/my-rents", 
      icon: Key, 
      roles: ['seller'] 
    },

    
    { 
      name: "My Warehouses", 
      href: "/dashboard/my-warehouses", 
      icon: Warehouse, 
      roles: ['warehouse_owner'] 
    },
    { 
      name: "Add Warehouse", 
      href: "/dashboard/add-warehouse", 
      icon: Warehouse, 
      roles: ['warehouse_owner'] 
    },

    
    { 
      name: "Payment Requests", 
      href: "/dashboard/transactions-requests", 
      icon: Wallet, 
      roles: ['buyer', 'seller'] 
    },
    { 
      name: "Transaction History", 
      href: "/dashboard/my-transactions", 
      icon: CreditCard, 
      roles: ['admin', 'seller', 'buyer', 'warehouse_owner'] 
    },

   
    { 
      name: "My Profile", 
      href: "/dashboard/my-profile", 
      icon: User, 
      roles: ['admin', 'seller', 'buyer', 'warehouse_owner'] 
    },
  ];

  
  const filteredNavItems = navItems.filter((item) => 
    item.roles.includes(user?.role)
  );

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
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/dashboard"}
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
        <div className="mb-4 px-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Logged in as
            </p>
            <p className="text-sm font-bold text-zinc-900 capitalize">
                {user?.role?.replace('_', ' ')}
            </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}