import { NavLink, useNavigate } from "react-router";
import clsx from "clsx";
import {
  Gauge,
  LayoutGrid,
  PackagePlus,
  Package,
  Gavel,
  Warehouse,
  WarehouseIcon,
  ClipboardList,
  Boxes,
  Receipt,
  Inbox,
  User,
  LogOut,
  Handshake,
  Bell,
  Users,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const NAV_BY_ROLE = {
  seller: [
    { to: "add-product", label: "Add product", icon: PackagePlus },
    { to: "my-products", label: "My products", icon: Package },
    { to: "my-auctions", label: "My auctions", icon: Gavel },
    { to: "transaction-requests", label: "Offer requests", icon: Handshake },
    { to: "my-rents", label: "My rents", icon: ClipboardList },
    { to: "my-inventory", label: "My inventory", icon: Boxes },
  ],
  buyer: [
    { to: "my-offers", label: "My offers", icon: Inbox }
  ],
  warehouse_owner: [
    { to: "add-warehouse", label: "Add warehouse", icon: WarehouseIcon },
    { to: "my-warehouses", label: "My warehouses", icon: Warehouse },
    { to: "stored-inventory", label: "Stored inventory", icon: Boxes },
  ],
  admin: [
    { to: "users", label: "Users", icon: Users },
    { to: "all-transactions", label: "All transactions", icon: Receipt },
    { to: "all-auctions", label: "All auctions", icon: Gavel },
    { to: "all-warehouses", label: "All warehouses", icon: Warehouse },
    { to: "all-products", label: "All products", icon: Package },
  ],
};

export default function AdminSidebar({ className = "", onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const roleLinks = NAV_BY_ROLE[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/auth/signin");
  };

  return (
    <aside className={clsx("w-full h-full bg-ink text-paper flex flex-col shadow-2xl", className)}>
      <a href="/" className="h-16 flex items-center gap-3 px-6 border-b border-white/10 shrink-0">
        <span className="h-8 w-8 rounded-lg bg-amber flex items-center justify-center shadow-inner">
          <Gauge size={18} className="text-ink" />
        </span>
        <span className="font-display font-bold text-lg tracking-tight">BidStock</span>
      </a>
      

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
        
        {/* Core Overview */}
        <div className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 px-3 mb-2">Overview</p>
          <NavLink to="/dashboard" end onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
            <LayoutGrid size={16} />
            Dashboard
          </NavLink>
        </div>

        {/* Role Specific Actions */}
        {roleLinks.length > 0 && (
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 px-3 mb-2 flex items-center gap-1.5">
              {user?.role === 'admin' && <ShieldAlert size={10} />}
              {user?.role?.replace("_", " ")}
            </p>
            {roleLinks.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Global Account */}
        <div className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 px-3 mb-2">Account</p>
          <NavLink to="my-transactions" onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
            <Receipt size={16} />
            Ledger
          </NavLink>
          <NavLink to="notifications" onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
            <Bell size={16} />
            Notifications
          </NavLink>
          <NavLink to="my-profile" onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
            <User size={16} />
            Profile
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-white/10 shrink-0 bg-ink-soft/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-red hover:bg-red/10 transition-colors"
        >
          <LogOut size={16} />
          Secure Sign Out
        </button>
      </div>
    </aside>
  );
}

function linkClass(isActive) {
  return clsx(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
    isActive 
      ? "bg-amber text-ink shadow-md" 
      : "text-white/60 hover:text-paper hover:bg-white/10"
  );
}