import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getBids } from "../../api/bids.api";
import CountdownChip from "../ui/CountdownChip";

export default function LiveTicker() {
  const { data, isLoading } = useQuery({
    queryKey: ["bids", "ticker"],
    queryFn: getBids,
    refetchInterval: 30000,
  });

  const bids = data?.data ?? [];

  if (isLoading || bids.length === 0) {
    return (
      <div className="border-y border-line bg-ink py-3 overflow-hidden">
        <p className="text-center font-mono text-xs text-white/50">
          {isLoading ? "Loading live auction floor…" : "No live auctions right now — check back soon"}
        </p>
      </div>
    );
  }

  const items = [...bids, ...bids];

  return (
    <div className="border-y border-line bg-ink overflow-hidden">
      <div className="ticker-track py-3">
        {items.map((bid, i) => (
          <Link
            key={`${bid.bid_id}-${i}`}
            to={`/auctions/${bid.bid_id}`}
            className="flex items-center gap-3 px-6 border-r border-white/10 shrink-0 group"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber shrink-0" />
            <span className="text-sm font-medium text-paper group-hover:text-amber transition-colors whitespace-nowrap">
              {bid.product_name}
            </span>
            <span className="font-mono font-tabular text-xs text-white/50 whitespace-nowrap">
              ${Number(bid.highest_bid || bid.base_price).toLocaleString()}
            </span>
            <CountdownChip endTime={bid.end_time} />
          </Link>
        ))}
      </div>
    </div>
  );
}