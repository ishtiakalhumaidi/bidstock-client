import React from 'react';
import { Sparkles, ArrowRight, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router'; 

export default function FooterCTA() {
  return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-16 sm:px-16 sm:py-24 shadow-2xl">
          {/* Background Gradient/Pattern */}
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black"></div>
             <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/2 bg-rose-600/20 blur-[100px] rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start trading on BidStock today
            </h2>
            <p className="mx-auto mt-6 text-lg text-zinc-300">
              Join the fastest-growing B2B auction network. List your inventory or find warehouse space in minutes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto rounded-full bg-rose-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-900/20 hover:bg-rose-500 hover:-translate-y-0.5 transition-all duration-200">
                Create Free Account
              </Link>
              <Link to="/contact" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/50 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-zinc-800 transition-colors duration-200">
                Contact Sales <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}