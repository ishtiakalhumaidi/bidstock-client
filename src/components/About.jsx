import React from 'react';
import { motion } from 'framer-motion';
import { 
  Gavel, Warehouse, ShieldCheck, Users, Globe, TrendingUp, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router'; // or 'react-router-dom'

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-zinc-900 text-white py-24 sm:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
           {/* Abstract Background Pattern */}
           <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-rose-600 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6"
          >
            Revolutionizing the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
              Supply Chain Marketplace
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            BidStock connects sellers, buyers, and warehouse owners in a seamless ecosystem. 
            We bridge the gap between inventory storage and real-time auctions.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-4"
          >
            
            <Link to="/auctions" className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-full transition-all border border-zinc-700">
              Browse Market
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- MISSION STATS --- */}
      <section className="py-12 border-b border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-zinc-100">
            {[
              { label: "Active Users", value: "10k+" },
              { label: "Auctions Closed", value: "50M+" },
              { label: "Warehouses", value: "500+" },
              { label: "Countries", value: "12" },
            ].map((stat, idx) => (
              <div key={idx} className="p-2">
                <div className="text-3xl sm:text-4xl font-black text-zinc-900 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CORE PILLARS --- */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-rose-600 uppercase tracking-widest mb-2">Our Ecosystem</h2>
            <h3 className="text-3xl font-bold text-zinc-900">One Platform, Three Solutions</h3>
            <p className="text-zinc-500 mt-4">
              We've built a unified platform that solves the biggest challenges in logistics and sales.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-300">
              <div className="h-14 w-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
                <Gavel size={28} />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-3">Real-Time Auctions</h4>
              <p className="text-zinc-500 leading-relaxed">
                Sellers can liquidate inventory instantly through competitive bidding. Buyers get access to verified stock at market-driven prices.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-300">
              <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Warehouse size={28} />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-3">Smart Warehousing</h4>
              <p className="text-zinc-500 leading-relaxed">
                Warehouse owners monetize unused space. Sellers find storage exactly where they need it, with flexible short-term contracts.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-300">
              <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-3">Secure Transactions</h4>
              <p className="text-zinc-500 leading-relaxed">
                Payments are held in escrow until goods are verified. We prioritize trust and transparency in every B2B exchange.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- TEAM / CULTURE --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
             <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
               Built by logistics experts for modern businesses.
             </h2>
             <p className="text-lg text-zinc-500">
               We realized that the disconnect between storage and sales was costing businesses millions. BidStock was born to close that loop.
             </p>
             
             <div className="space-y-4">
                {[
                  "Verified Users Only",
                  "24/7 Support for Critical Ops",
                  "Automated Inventory Tracking",
                  "Global Payment Gateway"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                      <ArrowRight size={12} />
                    </div>
                    <span className="font-medium text-zinc-700">{item}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex-1 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-zinc-100 to-transparent rounded-full blur-3xl -z-10"></div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 translate-y-8">
                   <div className="h-48 bg-zinc-200 rounded-2xl overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80" alt="Meeting" className="h-full w-full object-cover"/>
                   </div>
                   <div className="h-64 bg-zinc-200 rounded-2xl overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80" alt="Warehouse" className="h-full w-full object-cover"/>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="h-64 bg-zinc-200 rounded-2xl overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80" alt="Teamwork" className="h-full w-full object-cover"/>
                   </div>
                   <div className="h-48 bg-zinc-200 rounded-2xl overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80" alt="Handshake" className="h-full w-full object-cover"/>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 bg-zinc-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to optimize your inventory?</h2>
          <p className="text-zinc-400 mb-10 text-lg">
            Join thousands of businesses who are saving on storage and maximizing sales revenue with BidStock.
          </p>
          <Link to="/auth/signup" className="inline-block px-10 py-4 bg-white text-zinc-900 font-bold rounded-full hover:bg-zinc-100 transition-colors shadow-lg hover:shadow-white/10">
            Join BidStock Today
          </Link>
        </div>
      </section>

    </div>
  );
}