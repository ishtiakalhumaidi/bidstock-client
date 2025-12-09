import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Gavel, 
  Warehouse, 
  ShieldCheck, 
  Package, 
  Zap, 
  CreditCard 
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const BentoGridItem = ({ title, description, icon, className, size = 'small' }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25 } },
  };

  return (
    <motion.div
      variants={variants}
      className={cn(
        'group border border-rose-100 bg-white hover:border-rose-300 relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl px-6 pt-6 pb-10 shadow-sm hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-500',
        className
      )}
    >
      <div className="absolute top-0 -right-1/2 z-0 size-full cursor-pointer bg-[linear-gradient(to_right,#e11d481a_1px,transparent_1px),linear-gradient(to_bottom,#e11d481a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>
      <div className="text-rose-50 group-hover:text-rose-100 absolute right-1 bottom-3 scale-[6] transition-all duration-700 group-hover:scale-[6.2]">
        {icon}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="bg-rose-50 text-rose-600 shadow-rose-100 group-hover:bg-rose-600 group-hover:text-white group-hover:shadow-rose-200 mb-4 flex h-12 w-12 items-center justify-center rounded-full shadow transition-all duration-500">
            {icon}
          </div>
          <h3 className="mb-2 text-xl font-bold text-zinc-900 tracking-tight">{title}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed font-medium">{description}</p>
        </div>
        <div className="text-rose-600 mt-6 flex items-center text-sm font-semibold">
          <span className="mr-1">Explore Feature</span>
          <ArrowRight className="size-4 transition-all duration-500 group-hover:translate-x-2" />
        </div>
      </div>
    </motion.div>
  );
};

// Updated items based on EER Diagram Flow
const items = [
  {
    title: 'Live Wholesale Auctions',
    description:
      'Buyers place competitive bids on bulk inventory listed by suppliers. Secure stock at the true market price through transparent auctioning.',
    icon: <Gavel className="size-6" />,
    size: 'large', // Col-span-3
  },
  {
    title: 'Warehouse Marketplace',
    description:
      'Suppliers can find and rent storage space from Warehouse Owners. Filter by capacity, location, and price to store your auction inventory.',
    icon: <Warehouse className="size-6" />,
    size: 'large', // Col-span-3
  },
  {
    title: 'Inventory Management',
    description: 'Suppliers can easily list products, set base prices, and manage available quantity for auction.',
    icon: <Package className="size-6" />,
    size: 'medium', // Col-span-3
  },
  {
    title: 'Secure Payments',
    description: "Integrated transaction processing handles Bid payments and Rent payments securely.",
    icon: <CreditCard className="size-6" />,
    size: 'medium', // Col-span-3
  },
  {
    title: 'Real-time Bidding',
    description: 'Instant updates on bid status and auction timers.',
    icon: <Zap className="size-6" />,
    size: 'small', // Col-span-2
  },
  {
    title: 'Verified Roles',
    description:
      'Strict verification for Suppliers, Buyers, and Warehouse Owners.',
    icon: <ShieldCheck className="size-6" />,
    size: 'small', // Col-span-2
  },
];

export default function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  return (
    <div className="bg-zinc-50 py-24">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            A Complete Ecosystem for <br />
            <span className="text-rose-600">Trading & Warehousing</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            BidStock connects Buyers, Suppliers, and Warehouse Owners in one unified platform.
          </p>
       </div>

      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6 auto-rows-[minmax(280px,auto)]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              icon={item.icon}
              size={item.size}
              className={cn(
                item.size === 'large'
                  ? 'md:col-span-3 lg:col-span-3' 
                  : item.size === 'medium'
                  ? 'md:col-span-3 lg:col-span-3'
                  : 'md:col-span-3 lg:col-span-3',
                'h-full'
              )}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}