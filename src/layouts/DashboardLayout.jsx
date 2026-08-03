import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Menu, X, Search, User } from "lucide-react";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import NotificationBell from "../components/common/NotificationBell";
import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState("");
  
  const { user } = useAuth();
  const location = useLocation();

  // Modern React Pattern: Adjust state during render to avoid cascading updates.
  // If the path changes (e.g., user hits the browser back button), we close the menu immediately.
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper-dim/40 flex overflow-hidden">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Unified Sidebar (Desktop & Mobile) */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
        
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 -right-12 p-2 rounded-full bg-white text-ink shadow-lg md:hidden press-scale"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300 h-screen overflow-hidden">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-line h-16 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-paper-dim text-ink-soft shrink-0 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-paper-dim rounded-full border border-line focus-within:ring-2 focus-within:ring-amber-soft focus-within:border-amber transition-all w-64">
              <Search size={16} className="text-ink-muted shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-ink-muted"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <NotificationBell />
            <div className="h-8 w-8 rounded-full bg-paper-dim border border-line flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {user?.user_image ? (
                <img src={user.user_image} className="h-full w-full object-cover" alt={user.name} />
              ) : (
                <User className="h-4 w-4 text-ink-muted" />
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}