import React from 'react';
import { motion } from 'framer-motion';
import { PackagePlus, Gavel, Trophy, Truck } from 'lucide-react';

const steps = [
  {
    title: "1. List Inventory",
    description: "Suppliers list bulk stock with base prices, quantity, and auction duration. Warehousing options are suggested automatically.",
    icon: PackagePlus,
    color: "bg-blue-50 text-blue-600",
    lineColor: "from-blue-200 to-rose-200"
  },
  {
    title: "2. Buyers Bid",
    description: "Verified buyers place real-time bids. The dashboard updates instantly, creating a competitive market environment.",
    icon: Gavel,
    color: "bg-rose-50 text-rose-600",
    lineColor: "from-rose-200 to-amber-200"
  },
  {
    title: "3. Auction Close",
    description: "When the timer ends, the highest bidder wins. A purchase order is automatically generated and sent to both parties.",
    icon: Trophy,
    color: "bg-amber-50 text-amber-600",
    lineColor: "from-amber-200 to-emerald-200"
  },
  {
    title: "4. Secure Fulfillment",
    description: "Payment is held in escrow. Funds are released to the Supplier only after the Buyer verifies the delivery.",
    icon: Truck,
    color: "bg-emerald-50 text-emerald-600",
    lineColor: "transparent" // Last step has no line
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white border-b border-zinc-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            From <span className="text-rose-600">Listing</span> to <span className="text-rose-600">Liquidation</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
            A transparent auction process that ensures Suppliers get market value and Buyers get secure access to stock.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center group relative"
              >
                {/* Connecting Line (Desktop Only) */}
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block absolute top-10 left-[60%] w-[80%] h-1 bg-gradient-to-r ${step.lineColor} -z-10`} />
                )}

                <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border-4 border-white`}>
                  <step.icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">{step.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm px-2">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}