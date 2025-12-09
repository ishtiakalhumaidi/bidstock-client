import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { PackageOpen, ArrowLeft, Home, Search } from 'lucide-react';
import Logo from '../common/logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor (Consistent with Auth Pages) */}
      <div className="absolute inset-0 z-0">
         <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl opacity-60"></div>
         <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 sm:p-12 text-center"
      >
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* 404 Visuals */}
        <div className="relative mb-6 inline-block">
          <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full"></div>
          <div className="relative bg-white p-6 rounded-full shadow-lg shadow-rose-100/50">
            <PackageOpen className="h-16 w-16 text-rose-600" />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -right-2 -top-2 bg-zinc-900 text-white text-xs font-bold px-2 py-1 rounded-lg transform rotate-12">
            404
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-zinc-900 mb-3">
          Shipment Not Found
        </h1>
        <p className="text-zinc-500 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
          We checked every shelf in the warehouse, but we couldn't find the page you're looking for.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-zinc-100 hover:border-zinc-200 text-zinc-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-zinc-50 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-10 pt-6 border-t border-zinc-100">
           <Link to="/auctions" className="text-sm text-zinc-400 hover:text-rose-600 flex items-center justify-center gap-1 transition-colors">
              <Search className="h-3 w-3" /> Looking for active auctions?
           </Link>
        </div>

      </motion.div>
    </div>
  );
}