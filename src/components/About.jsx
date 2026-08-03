import { Link } from "react-router";
import { Gavel, Warehouse, Users, ArrowRight } from "lucide-react";
import Button from "./ui/Button";

const PRINCIPLES = [
  { icon: Gavel, title: "Real-time by default", desc: "Auctions close, inventory deducts, and payments settle the moment an offer is accepted — nothing waits on a human to reconcile it." },
  { icon: Warehouse, title: "Capacity is honest", desc: "Warehouse space is checked against real usage before every stock addition, so listings never promise more room than exists." },
  { icon: Users, title: "Every role, one floor", desc: "Buyers, sellers, and warehouse owners work from the same live data — no side channels, no stale spreadsheets." },
];

export default function About() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-24">
        <div className="max-w-2xl" data-aos="fade-up">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">About BidStock</p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl text-ink leading-[1.1]">
            Built for the working floor, not the pitch deck.
          </h1>
          <p className="mt-6 text-lg text-ink-soft">
            BidStock started from a simple problem: sellers had stock,
            warehouses had empty shelves, and buyers had no live way to bid
            on either. We built one floor where all three meet.
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-paper-dim/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.title}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="bg-white border border-line rounded-2xl p-7 hover-lift"
              >
                <div className="h-11 w-11 rounded-xl bg-ink flex items-center justify-center mb-5">
                  <p.icon size={18} className="text-amber" />
                </div>
                <h3 className="font-display font-semibold text-lg text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 flex flex-col items-center text-center" data-aos="fade-up">
        <h2 className="font-display font-semibold text-3xl text-ink max-w-lg">Ready to see the floor live?</h2>
        <p className="text-ink-soft mt-3 max-w-md">Browse open lots right now — no account required to watch.</p>
        <Link to="/auctions" className="mt-7">
          <Button variant="accent" size="lg">Explore auctions <ArrowRight size={16} /></Button>
        </Link>
      </section>
    </div>
  );
}