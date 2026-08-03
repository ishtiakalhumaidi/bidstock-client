import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Gavel } from "lucide-react";
import { getBids } from "../../api/bids.api";
import AuctionCard from "../../components/auctions/AuctionCard";
import { CardSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

const SORTS = [
  { value: "ending_soon", label: "Ending soonest" },
  { value: "price_low", label: "Price: low to high" },
  { value: "price_high", label: "Price: high to low" },
];

export default function ActiveAuctions() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ending_soon");

  const { data, isLoading } = useQuery({
    queryKey: ["bids", "active"],
    queryFn: getBids,
    refetchInterval: 20000,
  });

  const bids = data?.data ?? [];

  const filtered = useMemo(() => {
    let list = bids.filter((b) => b.product_name?.toLowerCase().includes(search.toLowerCase()));

    if (sort === "ending_soon") {
      list = [...list].sort((a, b) => new Date(a.end_time) - new Date(b.end_time));
    } else if (sort === "price_low") {
      list = [...list].sort((a, b) => (a.highest_bid || a.base_price) - (b.highest_bid || b.base_price));
    } else if (sort === "price_high") {
      list = [...list].sort((a, b) => (b.highest_bid || b.base_price) - (a.highest_bid || a.base_price));
    }
    return list;
  }, [bids, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10" data-aos="fade-up">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">
            {bids.length} live lot{bids.length !== 1 ? "s" : ""}
          </p>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-ink">Live auctions</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white rounded-lg border border-line-strong focus-within:border-ink transition-colors">
            <Search size={15} className="text-ink-muted shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lots..."
              className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-ink-muted"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3.5 py-2.5 bg-white rounded-lg border border-line-strong text-sm text-ink-soft focus:border-ink focus:outline-none appearance-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Gavel}
          title={search ? "No lots match your search" : "No live auctions right now"}
          description={search ? "Try a different product name." : "Sellers haven't opened any auctions yet — check back soon."}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((bid, i) => (
            <AuctionCard key={bid.bid_id} bid={bid} aosDelay={(i % 4) * 60} />
          ))}
        </div>
      )}
    </div>
  );
}