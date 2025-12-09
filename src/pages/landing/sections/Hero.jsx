import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Warehouse } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-100/40 via-white to-white"></div>
        <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-rose-500/5 blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:16px_16px] opacity-[0.03]"></div>

      <div className="relative z-10 container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <div className="inline-flex items-center rounded-full border border-rose-100 bg-white/80 px-3 py-1 text-sm backdrop-blur-sm shadow-sm">
              <span className="mr-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
                New
              </span>
              <span className="text-zinc-600 text-xs sm:text-sm">
                B2B Auctions & Warehouse Logistics
              </span>
              <ChevronRight className="ml-1 h-4 w-4 text-zinc-400" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-rose-950 via-zinc-800 to-rose-600 bg-clip-text text-center text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl text-balance"
          >
            Bid on Wholesale Stock & <br /> Rent Warehouse Space
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-center text-lg text-zinc-600"
          >
            The centralized marketplace for modern supply chains. Suppliers list
            inventory for auction and rent storage. Buyers bid to secure stock
            at market prices.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {/* Primary Button */}
            <button className="group relative overflow-hidden rounded-full bg-rose-600 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:bg-rose-700 hover:shadow-rose-500/30 hover:-translate-y-0.5">
              <span className="relative z-10 flex items-center font-medium">
                Start Bidding
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            </button>

            {/* Secondary Button */}
            <button className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white/50 px-8 py-3 font-medium text-zinc-700 backdrop-blur-sm transition-all hover:bg-zinc-50 hover:text-rose-600 hover:-translate-y-0.5">
              <Warehouse className="h-4 w-4" />
              List Warehouse Space
            </button>
          </motion.div>

          {/* Feature Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: "spring",
              stiffness: 50,
            }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white/50 shadow-2xl backdrop-blur-sm">
              <div className="flex h-10 items-center border-b border-zinc-200 bg-zinc-50/50 px-4">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto flex items-center rounded-md bg-white px-3 py-1 text-xs text-zinc-400 border border-zinc-100">
                  bidstock.com/auctions/electronics-batch-204
                </div>
              </div>
              <div className="relative">
                {/* Visualizing an Auction Dashboard */}
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                  alt="BidStock Auction Dashboard"
                  className="w-full h-[400px] object-cover object-top opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-20"></div>

                {/* Floating "Live Bid" UI Element */}
                <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-white/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                      Live Auction
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                      Ends in 2h 15m
                    </span>
                  </div>

                  <h3 className="font-bold text-zinc-900 mb-1">
                    Sony IMX Sensors (500 units)
                  </h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    Lot #8842 • Seller: TechGlobal Inc.
                  </p>

                  <div className="flex justify-between items-end border-t border-zinc-100 pt-3">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-zinc-400">
                        Current Highest Bid
                      </p>
                      <p className="text-xl font-bold text-zinc-900">$12,450</p>
                    </div>
                    <button className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-rose-700 transition shadow-lg shadow-rose-200">
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
