import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import NumberFlow from '@number-flow/react';

// --- Utility for classes ---
const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- Mocking UI Components ---
const Badge = ({ children, className }) => (
  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
    {children}
  </span>
);

const Button = ({ children, className, ...props }) => (
  <button className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2", className)} {...props}>
    {children}
  </button>
);

// --- Configuration ---
const PLAN_TYPES = ['supplier', 'warehouse'];

const DATA = {
  supplier: [
    {
      id: 'supplier-starter',
      name: 'Starter',
      price: 0,
      period: '/mo',
      description: 'Pay as you go. Perfect for new suppliers.',
      features: [
        '5% Transaction Fee',
        'Unlimited Listings',
        'Basic Buyer Verification',
        'Standard Support',
      ],
      cta: 'Start Selling',
      highlighted: false,
    },
    {
      id: 'supplier-growth',
      name: 'Growth',
      price: 49,
      period: '/mo',
      description: 'Lower fees and analytics for scaling.',
      features: [
        'Reduced 2% Transaction Fee',
        'Priority Auction Placement',
        'Advanced Analytics Dashboard',
        'Verified "Pro" Badge',
        'Priority Support',
      ],
      cta: 'Get Pro Access',
      popular: true,
      highlighted: false,
    },
    {
      id: 'supplier-scale',
      name: 'Scale (Yearly)',
      price: 499, // Fixed price instead of Custom
      period: '/yr', // Yearly period
      description: 'Best value for high-volume national chains.',
      features: [
        '0% Transaction Fee (First $10k)',
        'API Integration Access',
        'Dedicated Account Manager',
        'Multi-User Access',
        'SLA Guarantees',
      ],
      cta: 'Get Annual Plan',
      highlighted: true,
    },
  ],
  warehouse: [
    {
      id: 'warehouse-basic',
      name: 'Basic',
      price: 0,
      period: '/mo',
      description: 'List your space with no upfront cost.',
      features: [
        '10% Rental Commission',
        'Up to 2 Warehouse Locations',
        'Basic Availability Calendar',
        'Standard Support',
      ],
      cta: 'List Space',
      highlighted: false,
    },
    {
      id: 'warehouse-pro',
      name: 'Pro Partner',
      price: 79,
      period: '/mo',
      description: 'Maximize occupancy with better visibility.',
      features: [
        'Reduced 5% Rental Commission',
        'Unlimited Locations',
        'Featured Search Results',
        'Tenant Screening Reports',
        'Smart Pricing Tools',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      highlighted: false,
    },
    {
      id: 'warehouse-network',
      name: 'Network (Yearly)',
      price: 799, // Fixed price instead of Custom
      period: '/yr', // Yearly period
      description: 'Complete solution for 3PL providers.',
      features: [
        '0% Rental Commission',
        'WMS Integration',
        'White-label Portal',
        'Dedicated Success Manager',
        'Priority Listing',
      ],
      cta: 'Get Annual Plan',
      highlighted: true,
    },
  ],
};

const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:45px_45px] opacity-10" />
);

const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(244,63,94,0.15),rgba(255,255,255,0))]" />
);

const Tab = ({ text, selected, setSelected }) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className="relative w-fit px-6 py-2 text-sm font-semibold capitalize transition-colors text-zinc-600 hover:text-zinc-900"
    >
      <span className={cn("relative z-10", selected && "text-zinc-900")}>
        {text === 'supplier' ? 'Supplier Plans' : 'Warehouse Plans'}
      </span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: 'spring', duration: 0.4 }}
          className="absolute inset-0 z-0 rounded-full bg-white shadow-sm border border-zinc-200"
        ></motion.span>
      )}
    </button>
  );
};

const PricingCard = ({ tier }) => {
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;

  return (
    <div
      className={cn(
        'relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg',
        isHighlighted
          ? 'bg-zinc-900 text-white border-zinc-800'
          : 'bg-white text-zinc-900 border-zinc-200',
        isPopular && 'outline outline-2 outline-rose-500',
      )}
    >
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      <div className="relative z-10">
        <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
          {tier.name}
          {isPopular && (
            <Badge className="bg-rose-100 text-rose-600 border-rose-200 hover:bg-rose-100">
              Most Popular
            </Badge>
          )}
        </h2>

        <div className="mt-4 flex items-baseline gap-1 relative h-12">
           <span className="text-4xl font-medium">$</span>
           <NumberFlow
             value={tier.price}
             className="text-4xl font-medium"
           />
           <span className={cn("text-sm", isHighlighted ? "text-zinc-400" : "text-zinc-500")}>
             {tier.period}
           </span>
        </div>

        <p className={cn("text-sm mt-2", isHighlighted ? "text-zinc-400" : "text-zinc-500")}>
          {tier.description}
        </p>
      </div>

      <div className="flex-1 space-y-4 relative z-10">
        <div className={cn("h-px w-full", isHighlighted ? "bg-zinc-800" : "bg-zinc-100")} />
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                'flex items-start gap-3 text-sm font-medium',
                isHighlighted ? 'text-zinc-300' : 'text-zinc-600',
              )}
            >
              <Check className={cn("h-5 w-5 shrink-0", isHighlighted ? "text-rose-400" : "text-rose-600")} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        className={cn(
          'h-12 w-full rounded-xl text-base font-semibold mt-4 relative z-10',
          isHighlighted 
            ? 'bg-white text-zinc-900 hover:bg-zinc-100' 
            : 'bg-zinc-900 text-white hover:bg-zinc-800',
          isPopular && !isHighlighted && 'bg-rose-600 hover:bg-rose-700'
        )}
      >
        {tier.cta} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default function Pricing() {
  const [selectedType, setSelectedType] = useState('supplier');

  return (
    <section className="flex flex-col items-center gap-10 py-24 bg-zinc-50">
      <div className="space-y-7 text-center px-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold md:text-5xl text-zinc-900">
            Transparent Pricing
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Choose the model that fits your volume. Start for free with pay-as-you-go, 
            or save 20% with our annual plans.
          </p>
        </div>
        
        {/* Toggle */}
        <div className="mx-auto flex w-fit rounded-full bg-zinc-200 p-1">
          {PLAN_TYPES.map((type) => (
            <Tab
              key={type}
              text={type}
              selected={selectedType === type}
              setSelected={setSelectedType}
            />
          ))}
        </div>
      </div>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 px-4">
        {DATA[selectedType].map((tier, i) => (
          <PricingCard
            key={i}
            tier={tier}
          />
        ))}
      </div>
    </section>
  );
}