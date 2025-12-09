import React, { useState } from "react";
import { Outlet } from "react-router";
import { Menu, X, Bell, Search } from "lucide-react";
import AdminSidebar from "../components/sidebar/AdminSidebar";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:block fixed inset-y-0 z-50">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <AdminSidebar className="absolute left-0 top-0 bottom-0 z-50 animate-in slide-in-from-left duration-200" />
          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 left-64 ml-4 p-2 rounded-full bg-white text-zinc-900 shadow-lg"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-200">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200 h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-zinc-100 text-zinc-600"
            >
              <Menu size={20} />
            </button>

            {/* Search Bar (Optional) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full border border-zinc-200 focus-within:ring-2 focus-within:ring-rose-100 focus-within:border-rose-300 transition-all">
              <Search size={16} className="text-zinc-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                className="bg-transparent border-none focus:outline-none text-sm w-48 placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
