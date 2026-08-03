import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Gavel, SlidersHorizontal } from "lucide-react";
import { getBids } from "../../api/bids.api";
import Card from "../../components/ui/Card";
import CountdownChip from "../../components/ui/CountdownChip";
import EmptyState from "../../components/ui/EmptyState";
import { CardSkeleton } from "../../components/ui/Skeleton";
import Pagination from "../../components/ui/Pagination";

export default function ActiveAuctions() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("ending_soon");

  const { data, isLoading } = useQuery({
    queryKey: ["bids", "active", page, sort],
    queryFn: () => getBids({ page, limit: 12, sort }),
  });

  const auctions = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8" data-aos="fade-up">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Live Floor</p>
          <h1 className="font-display font-semibold text-3xl text-ink">Active Auctions</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="h-10 pl-4 pr-10 text-sm font-medium bg-white border border-line rounded-full appearance-none focus:outline-none focus:border-ink transition-colors cursor-pointer"
            >
              <option value="ending_soon">Ending soonest</option>
              <option value="newest">Newly listed</option>
              <option value="highest_bid">Highest value</option>
            </select>
            <SlidersHorizontal size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : auctions.length === 0 ? (
        <EmptyState
          icon={Gavel}
          title="No active auctions"
          description="The floor is quiet right now. Check back later for new stock listings."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {auctions.map((auction, i) => (
              <Link key={auction.bid_id} to={`/auctions/${auction.bid_id}`} className="group flex flex-col h-full">
                <Card hover className="h-full flex flex-col overflow-hidden" aos="fade-up" aosDelay={(i % 4) * 50}>
                  <div className="aspect-[4/3] bg-paper-dim relative overflow-hidden flex items-center justify-center">
                    {auction.image_url ? (
                      <img src={auction.image_url} alt={auction.product_name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Gavel size={28} className="text-ink-muted" />
                    )}
                    <div className="absolute top-3 left-3">
                      <CountdownChip endTime={auction.end_time} />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display font-semibold text-sm text-ink line-clamp-2 mb-1 group-hover:text-amber-dark transition-colors">
                      {auction.product_name}
                    </h3>
                    <p className="text-xs text-ink-muted mb-4">{auction.seller_name}</p>
                    
                    <div className="mt-auto pt-4 border-t border-line flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-1">
                          {auction.highest_bid ? "Current Bid" : "Starting Bid"}
                        </p>
                        <p className="font-mono font-tabular font-semibold text-lg text-ink">
                          ${Number(auction.highest_bid || auction.base_price).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs font-medium text-ink-soft">
                        {auction.pending_offers} offer{auction.pending_offers !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          {pagination && (
            <div className="mt-8">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}