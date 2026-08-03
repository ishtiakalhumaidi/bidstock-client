export default function About() {
  return (
    <div className="py-24 px-4 sm:px-6 max-w-3xl mx-auto min-h-screen">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">System Overview</p>
      <h1 className="font-display font-semibold text-3xl sm:text-4xl text-ink mb-10">
        Engineering a leaner supply chain.
      </h1>

      <div className="prose prose-sm sm:prose-base prose-p:text-ink-soft prose-headings:text-ink prose-headings:font-display prose-headings:font-semibold">
        <p>
          Traditional inventory management relies on fragmented systems, manual data entry, and inefficient spatial utilization. BidStock was architected to solve the latency between physical storage and capital liquidation.
        </p>
        
        <h3 className="text-xl mt-8 mb-4">Core Architecture</h3>
        <p>
          We unified three distinct operational entities into a single, synchronized platform:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-ink-soft mb-6">
          <li><strong>Facility Providers (Warehouse Owners):</strong> Inject physical capacity constraints into the system.</li>
          <li><strong>Suppliers (Sellers):</strong> Consume capacity via time-bound rents and deploy inventory models directly into those structural footprints.</li>
          <li><strong>Capital Deployers (Buyers):</strong> Execute highly concurrent bidding functions against active supplier lots.</li>
        </ul>

        <h3 className="text-xl mt-8 mb-4">Data Integrity & Flow</h3>
        <p>
          Every module—from the automated status transition of a warehouse rent down to the localized low-stock threshold triggers—relies on a strictly normalized relational database. When a buyer's offer is accepted, the system handles the ledger update, physical quantity deduction, and secure payload transfer atomically.
        </p>
        
        <div className="mt-12 p-6 bg-paper-dim border border-line rounded-xl">
          <p className="font-mono text-sm text-ink">
            <strong>System Status:</strong> All core services operational. Average API response latency &lt; 150ms.
          </p>
        </div>
      </div>
    </div>
  );
}