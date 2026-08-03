import { Link } from "react-router";
import { Check } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const PLANS = [
  {
    name: "Buyer", price: "Free", period: "", desc: "Bid on any live lot, no listing fees.",
    features: ["Place unlimited offers", "Track wins in one dashboard", "Instant close notifications", "Wallet-based settlement"],
    cta: "Create buyer account", highlighted: false,
  },
  {
    name: "Seller", price: "3%", period: "per closed lot", desc: "List products, rent space, and auction stock.",
    features: ["Unlimited product listings", "Open unlimited auctions", "Rent from any listed warehouse", "Automatic inventory deduction"],
    cta: "Start selling", highlighted: true,
  },
  {
    name: "Warehouse owner", price: "0%", period: "you set the rate", desc: "Publish capacity and collect rent from sellers.",
    features: ["List unlimited warehouses", "Set your own price per day", "Approve or reject tenants", "Track occupancy in real time"],
    cta: "List your warehouse", highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-lg mb-14" data-aos="fade-up">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">Pricing</p>
        <h1 className="font-display font-semibold text-4xl text-ink mb-4">One floor, no surprise fees</h1>
        <p className="text-ink-soft">
          Buying is free. Sellers pay a small fee only when a lot actually
          closes. Warehouse owners keep 100% of what they charge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => (
          <Card
            key={plan.name}
            aos="fade-up"
            aosDelay={i * 100}
            className={`p-7 flex flex-col ${plan.highlighted ? "border-ink ring-1 ring-ink" : ""}`}
          >
            {plan.highlighted && (
              <span className="self-start mb-4 px-2.5 py-1 rounded-full bg-amber-soft text-amber-dark text-[11px] font-mono font-medium uppercase tracking-wide">
                Most active
              </span>
            )}
            <h3 className="font-display font-semibold text-lg text-ink">{plan.name}</h3>
            <p className="text-sm text-ink-soft mt-1.5 mb-5">{plan.desc}</p>
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="font-display font-semibold text-3xl text-ink">{plan.price}</span>
              {plan.period && <span className="text-xs text-ink-muted">{plan.period}</span>}
            </div>
            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <Check size={15} className="text-teal shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/auth/signup">
              <Button variant={plan.highlighted ? "accent" : "outline"} className="w-full">
                {plan.cta}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}