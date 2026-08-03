import { Link } from "react-router";
import {
  ArrowRight, ListPlus, WarehouseIcon, Boxes, Gavel, HandCoins,
  Store, Briefcase, Warehouse, ShieldCheck, Activity, Globe,
  Cpu, Lock, HelpCircle, ChevronRight, BarChart3, Database
} from "lucide-react";
import LiveTicker from "../../components/landing/LiveTicker";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../hooks/useAuth"; // Import your auth hook

const STEPS = [
  { n: "01", title: "List a product", desc: "Sellers add products with pricing, specs, and images to the catalog.", icon: ListPlus },
  { n: "02", title: "Rent warehouse space", desc: "Reserve capacity from a warehouse owner and confirm the lease.", icon: WarehouseIcon },
  { n: "03", title: "Stock inventory", desc: "Add quantity against the rented space — capacity is checked automatically.", icon: Boxes },
  { n: "04", title: "Open an auction", desc: "Set a starting price and close time. The floor goes live instantly.", icon: Gavel },
  { n: "05", title: "Accept the best offer", desc: "Close the lot, and payment, inventory, and notifications settle automatically.", icon: HandCoins },
];

const ROLES = [
  { icon: Briefcase, title: "For buyers", desc: "Watch live lots, place competing offers, and track every win from one dashboard.", cta: "Browse auctions", to: "/auctions" },
  { icon: Store, title: "For sellers", desc: "List stock, rent space, open auctions, and get paid the moment a lot closes.", cta: "Start selling", to: "/dashboard", authTo: "/auth/signup" },
  { icon: Warehouse, title: "For warehouse owners", desc: "Publish capacity, set your rate, and earn from every seller who rents space.", cta: "List your warehouse", to: "/dashboard", authTo: "/auth/signup" },
];

const FAQS = [
  { q: "How is warehouse capacity verified?", a: "When a seller adds inventory, the system automatically cross-references the physical dimensions and unit counts against the active lease to ensure the facility is never overbooked." },
  { q: "What happens when an auction closes?", a: "Upon accepting a winning bid, the platform automatically drafts a smart transaction, deducts the specific quantity from the linked warehouse, and sends immediate push notifications to both parties." },
  { q: "Are payments handled automatically?", a: "Yes. Once an offer is accepted, the buyer is routed to a secure payment gateway. Funds are transferred, and the platform logs the settlement instantly." },
  { q: "Can I manage multiple warehouses?", a: "Absolutely. Warehouse owners have a dedicated command center to manage multiple facility nodes, track active tenant leases, and monitor real-time spatial capacity across their entire portfolio." }
];

export default function Home() {
  const { user } = useAuth(); // Detect logged-in status

  return (
    <div className="bg-paper">
      {/* 1. Enhanced High-Contrast Hero Section */}
      <section className="relative overflow-hidden bg-ink pt-28 pb-24 lg:pt-36 lg:pb-32 text-white">
        {/* Abstract Background Glows */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-amber/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-teal-soft/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl" data-aos="fade-up">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-amber-soft text-xs font-mono font-medium uppercase tracking-widest mb-8 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse" />
              Network Protocol Online
            </span>
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
              Industrial procurement, <br className="hidden sm:block" />
              <span className="text-white/60">fully automated.</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl font-light leading-relaxed mb-10">
              BidStock connects sellers who need space, warehouse owners who have it, and buyers ready to bid — with every lot, lease, and payment settled in real time.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/auctions">
                <Button variant="primary" size="lg" className="h-12 px-8 bg-amber text-ink hover:bg-amber-dark border-none">
                  Enter Auction House <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
              {user ? (
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="h-12 px-8 border-white/20 text-white hover:bg-white/10">
                    Go to Command Center
                  </Button>
                </Link>
              ) : (
                <Link to="/auth/signup">
                  <Button variant="outline" size="lg" className="h-12 px-8 border-white/20 text-white hover:bg-white/10">
                    Deploy Account Node
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Market Ticker */}
      <div className="bg-paper-dim border-b border-line">
        <LiveTicker />
      </div>

      {/* 3. Active Network Nodes (Live Stats Overview) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-b border-line">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
          <div className="w-full md:w-1/3" data-aos="fade-right">
            <h2 className="font-display font-semibold text-2xl text-ink mb-3">Active Network Nodes</h2>
            <p className="text-sm text-ink-soft leading-relaxed">
              Real-time telemetry from the BidStock marketplace infrastructure. Monitor the volume of assets and capital flowing through the platform.
            </p>
          </div>
          <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Active Suppliers", val: "1,204", icon: Globe },
              { label: "Storage Facilities", val: "342", icon: Database },
              { label: "Live Auctions", val: "89", icon: Activity },
              { label: "Capital Exchanged", val: "$2.4M+", icon: BarChart3 }
            ].map((stat, i) => (
              <div key={i} className="border-l-2 border-amber/30 pl-4 py-2" data-aos="fade-up" data-aos-delay={i * 100}>
                <stat.icon size={16} className="text-ink-muted mb-2" />
                <div className="font-mono font-bold text-2xl text-ink tracking-tight mb-1">{stat.val}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-ink-soft">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Manifest (How it works) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="max-w-xl mb-16" data-aos="fade-up">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-3 flex items-center gap-2">
            <Cpu size={12} className="text-amber" /> Supply Chain Protocol
          </p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink tracking-tight">How an asset moves from shelf to sold</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-line rounded-2xl overflow-hidden border border-line shadow-sm">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className="bg-white p-6 lg:p-8 flex flex-col gap-5 transition-colors duration-200 hover:bg-paper-dim/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-ink-muted bg-paper px-2 py-1 rounded">{step.n}</span>
                <step.icon size={20} className="text-amber-dark" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base text-ink mb-2">{step.title}</h3>
                <p className="text-xs text-ink-soft leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Role Selection */}
      <section className="bg-paper-dim/50 border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="max-w-xl mb-16" data-aos="fade-up">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-3 flex items-center gap-2">
              <Lock size={12} className="text-teal" /> Network Access
            </p>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink tracking-tight">Built for every side of the floor</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map((role, i) => (
              <Card key={role.title} hover aos="fade-up" aosDelay={i * 100} className="p-8 flex flex-col h-full bg-white">
                <div className="h-12 w-12 rounded-xl bg-ink flex items-center justify-center mb-6 shadow-sm">
                  <role.icon size={20} className="text-amber" />
                </div>
                <h3 className="font-display font-semibold text-xl text-ink mb-3">{role.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-8 flex-1">{role.desc}</p>
                <Link 
                  to={user ? role.to : (role.authTo || role.to)} 
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-amber-dark transition-colors group mt-auto"
                >
                  {user ? "Enter Workspace" : role.cta} 
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 border-b border-line">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div data-aos="fade-right">
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink tracking-tight mb-6">
              Every transaction tracked, end to end.
            </h2>
            <p className="text-base text-ink-soft leading-relaxed mb-8">
              Forget manual inventory updates and chasing invoices. BidStock acts as a central ledger—when an offer is accepted, the system immediately deducts inventory, locks the warehouse capacity, and routes the payment automatically.
            </p>
            <ul className="space-y-4">
              {[
                "Automated Reverse-Bidding Smart Contracts",
                "Real-time Inventory & Spatial Sync",
                "Instant P2P Payment Routing"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-ink">
                  <ShieldCheck size={18} className="text-teal" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-square bg-paper-dim border border-line rounded-3xl p-8 flex items-center justify-center relative overflow-hidden">
              {/* Abstract decorative element representing tracking */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ink via-transparent to-transparent" />
              <div className="relative z-10 w-full max-w-sm bg-white border border-line rounded-xl shadow-xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-line/50">
                  <div className="h-2 w-16 bg-line-strong rounded" />
                  <div className="h-2 w-8 bg-teal/20 rounded" />
                </div>
                <div className="space-y-3">
                  <div className="h-8 w-full bg-paper-dim rounded-md" />
                  <div className="h-8 w-full bg-paper-dim rounded-md" />
                  <div className="h-8 w-3/4 bg-paper-dim rounded-md" />
                </div>
                <div className="mt-6 pt-4 border-t border-line/50 flex justify-end">
                  <div className="h-6 w-24 bg-amber-soft rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16" data-aos="fade-up">
          <HelpCircle size={32} className="text-ink-muted mx-auto mb-4" />
          <h2 className="font-display font-semibold text-3xl text-ink tracking-tight">System Queries</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-line p-6 rounded-2xl hover:shadow-sm transition-shadow" data-aos="fade-up" data-aos-delay={i * 50}>
              <h3 className="font-display font-semibold text-lg text-ink mb-2 flex items-start gap-3">
                <ChevronRight size={18} className="text-amber mt-1 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Dedicated Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <Card aos="fade-up" className="p-10 sm:p-16 flex flex-col items-center text-center bg-ink text-white border-none overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64  bg-amber/20 rounded-full blur-[80px] pointer-events-none" />
          <h2 className="font-display text-ink font-bold text-3xl sm:text-4xl tracking-tight mb-4 relative z-10">
            Ready to deploy your operations?
          </h2>
          <p className=" text-ink mb-8 max-w-lg relative z-10">
            Join thousands of suppliers, warehouse owners, and procurement agents on the market's most efficient logistics floor.
          </p>
          <div className="relative z-10">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="lg" className="bg-amber text-ink hover:bg-amber-dark border-none shadow-lg">
                  Return to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth/signup">
                <Button variant="primary" size="lg" className="bg-amber text-ink hover:bg-amber-dark border-none shadow-lg">
                  Initialize Free Account
                </Button>
              </Link>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}