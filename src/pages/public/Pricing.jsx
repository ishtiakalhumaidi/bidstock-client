import { Link } from "react-router";
import { Check, ShieldCheck, Zap } from "lucide-react";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const TIERS = [
  {
    name: "Buyer Node",
    target: "Sourcing & Procurement",
    price: "29",
    metrics: "2.5% transaction fee on successful bids",
    features: [
      "Access global liquidation auctions",
      "Real-time bidding pipeline",
      "Automated transaction resolution",
      "Basic ledger export"
    ]
  },
  {
    name: "Seller Node",
    target: "Wholesale & Liquidation",
    price: "39",
    metrics: "1.5% commission per liquidated lot",
    popular: true,
    features: [
      "Lease active warehouse capacity",
      "Deploy infinite product schemas",
      "Initiate automated auction cycles",
      "Low-stock system alerts"
    ]
  },
  {
    name: "Infrastructure",
    target: "Warehouse Owners",
    price: "59",
    metrics: "5% fee on rental agreements",
    features: [
      "List infinite spatial capacity",
      "Monitor tenant inventory loads",
      "Automated billing cycles",
      "System-managed availability status"
    ]
  }
];

export default function Pricing() {
  const { user } = useAuth(); // Detect logged-in status

  return (
    <div className="py-24 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-20" data-aos="fade-up">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-soft border border-amber/20 text-amber-dark text-xs font-mono font-medium uppercase tracking-widest mb-6">
          <Zap size={14} className="text-amber-dark" /> Financial Schemas
        </span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-ink tracking-tight mb-6">
          Transparent architecture. <br className="hidden sm:block" />
          <span className="text-ink-soft">Zero base latency.</span>
        </h1>
        <p className="text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
          BidStock operates on a strictly performance-driven fee structure. No upfront provisioning costs or hidden subscriptions. Capital is only extracted during successful operational cycles.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
        {TIERS.map((tier, index) => (
          <div 
            key={tier.name} 
            data-aos="fade-up" 
            data-aos-delay={index * 100}
            className={`group flex flex-col bg-white border rounded-3xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
              tier.popular ? 'border-amber/40 shadow-md ring-1 ring-amber/10' : 'border-line hover:border-ink/20'
            }`}
          >
            {/* Highlight Banner for Seller Node */}
            {tier.popular && (
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber to-amber-dark" />
            )}

            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2">{tier.target}</p>
              <h3 className="font-display font-semibold text-2xl text-ink">{tier.name}</h3>
            </div>
            
            <div className="mb-8 pb-8 border-b border-line">
              <div className="flex items-baseline gap-1 mb-3">
                <span className="font-mono font-tabular text-5xl font-bold text-ink">${tier.price}</span>
                <span className="text-sm font-sans font-medium text-ink-soft">/ month</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-paper-dim text-xs font-medium text-ink-soft">
                <ShieldCheck size={14} className="text-teal" />
                {tier.metrics}
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink font-medium">
                  <Check size={18} className="text-teal shrink-0" />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Dynamic Auth Button */}
            <Link to={user ? "/dashboard" : "/auth/signup"} className="block w-full mt-auto">
              <Button 
                variant={tier.popular ? "primary" : "outline"} 
                className={`w-full h-12 text-base ${tier.popular ? 'bg-ink text-white hover:bg-ink/90' : ''}`}
              >
                {user ? "Enter Workspace" : "Initialize Node"}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Enterprise / Scale Banner */}
      <div className="bg-ink rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden" data-aos="fade-up">
        <div className="absolute -top-24 -right-24 w-[300px] h-[300px] bg-amber/20 rounded-full blur-[80px] pointer-events-none" />
        
        <h2 className="font-display font-semibold text-2xl sm:text-3xl text-white mb-4 relative z-10">
          Require High-Volume Pipeline Integration?
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto mb-8 relative z-10">
          For network suppliers moving massive liquidation volumes, we offer dedicated API endpoints and discounted volume-based transaction schemas.
        </p>
        <Button variant="outline" className="relative z-10 border-white/20 text-white hover:bg-white/10 px-8 h-12">
          Contact Protocol Admin
        </Button>
      </div>
    </div>
  );
}