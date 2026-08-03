import { Link } from "react-router";
import { Package } from "lucide-react";
import Card from "../ui/Card";
import CountdownChip from "../ui/CountdownChip";

export default function AuctionCard({ bid, aosDelay = 0 }) {
  const currentPrice = bid.highest_bid || bid.base_price;

  return (
    <Link to={`/auctions/${bid.bid_id}`} className="block">
      <Card
        hover
        aos="fade-up"
        aosDelay={aosDelay}
        className="overflow-hidden h-full flex flex-col"
      >
        <div className="aspect-[4/3] bg-paper-dim flex items-center justify-center overflow-hidden">
          {bid.image_url ? (
            <img
              src={bid.image_url}
              alt={bid.product_name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <Package size={32} className="text-ink-muted" />
          )}
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-sm text-ink leading-snug line-clamp-2 min-w-0">
              {bid.product_name}
            </h3>
            <CountdownChip endTime={bid.end_time} />
          </div>

          <p className="text-xs text-ink-muted truncate">
            by {bid.seller_name}
          </p>

          <div className="mt-auto pt-3 border-t border-line flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-wide text-ink-muted mb-0.5">
                {bid.highest_bid ? "Current bid" : "Starting price"}
              </p>
              <p className="font-mono font-tabular font-semibold text-ink truncate">
                ${Number(currentPrice).toLocaleString()}
              </p>
            </div>
            <div className="mt-auto pt-3 border-t border-line flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-wide text-ink-muted mb-0.5">
                  {bid.highest_bid ? "Current bid" : "Starting price"}
                </p>
                <p className="font-mono font-tabular font-semibold text-ink truncate">
                  ${Number(currentPrice).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {bid.quantity > 1 && (
                  <span className="text-[11px] font-mono text-ink-muted">
                    Qty: {bid.quantity}
                  </span>
                )}
                {bid.pending_offers > 0 && (
                  <span className="text-[11px] font-mono text-amber-dark">
                    {bid.pending_offers} offer
                    {bid.pending_offers > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            {bid.pending_offers > 0 && (
              <span className="text-[11px] font-mono text-amber-dark shrink-0">
                {bid.pending_offers} offer{bid.pending_offers > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
