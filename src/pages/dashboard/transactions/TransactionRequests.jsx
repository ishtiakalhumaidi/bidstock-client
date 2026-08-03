import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Handshake, ChevronDown, ChevronUp, CheckCircle, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { getMyBids } from "../../../api/bids.api";
import { getBidOffers, acceptOffer } from "../../../api/offers.api";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import { RowSkeleton } from "../../../components/ui/Skeleton";
import { confirmAction } from "../../../lib/confirm";

export default function TransactionRequests() {
  const { data: bidsData, isLoading } = useQuery({
    queryKey: ["bids", "mine", "requests"],
    // FIX 1: Pass parameters as an object matching your API definition
    queryFn: () => getMyBids({ page: 1, limit: 50 }),
  });

  // FIX 2: Safely cast offer_count to a Number to prevent strict filtering failures
  const activeRequests = (bidsData?.data ?? []).filter(
    (bid) => Number(bid.offer_count || 0) > 0 && bid.status === 'open'
  );

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8" data-aos="fade-up">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">Liquidation Engine</p>
        <h1 className="font-display font-semibold text-2xl text-ink">Transaction Requests</h1>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white border border-line rounded-2xl p-4 divide-y divide-line">
            <RowSkeleton /><RowSkeleton />
          </div>
        ) : activeRequests.length === 0 ? (
          <EmptyState
            icon={Handshake}
            title="No inbound requests"
            description="There are currently no pending offers requiring your authorization."
          />
        ) : (
          activeRequests.map((bid) => (
            <BidOfferGroup key={bid.bid_id} bid={bid} />
          ))
        )}
      </div>
    </div>
  );
}

function BidOfferGroup({ bid }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const { data: offersData, isLoading } = useQuery({
    queryKey: ["offers", "bid", bid.bid_id],
    queryFn: () => getBidOffers(bid.bid_id),
    enabled: expanded,
  });

  const offers = offersData?.data ?? [];

  const acceptMutation = useMutation({
    mutationFn: (offerId) => acceptOffer(offerId),
    onSuccess: () => {
      toast.success("Offer accepted. Ledger updated and auction closed.");
      // Invalidate the specific queries to force a UI refresh
      queryClient.invalidateQueries({ queryKey: ["bids", "mine", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["offers", "bid", bid.bid_id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to execute acceptance"),
  });

  const handleAccept = async (offer) => {
    const ok = await confirmAction({
      title: "Execute Transaction?",
      text: `Accepting this offer of $${Number(offer.offered_price).toLocaleString()} will finalize the auction, deduct inventory, and reject all competing offers.`,
      confirmText: "Authorize",
    });
    if (ok) acceptMutation.mutate(offer.offer_id);
  };

  return (
    <Card className="overflow-hidden">
      <div 
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-paper-dim/40 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="h-12 w-12 bg-paper border border-line rounded-lg overflow-hidden shrink-0">
            {bid.image_url ? (
              <img src={bid.image_url} className="h-full w-full object-cover" alt={bid.product_name} />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Handshake size={16} className="text-ink-muted" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-display font-semibold text-ink truncate">{bid.product_name}</h3>
            <p className="text-[11px] font-mono text-ink-soft mt-0.5">
              BASE: ${Number(bid.base_price || 0).toLocaleString()} · TOP: ${Number(bid.highest_bid || 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="px-2.5 py-1 bg-amber-soft border border-amber/20 text-amber-dark font-medium text-xs rounded">
            {Number(bid.offer_count)} Offer{Number(bid.offer_count) !== 1 ? 's' : ''}
          </span>
          <button className="h-8 w-8 flex items-center justify-center rounded bg-paper-dim text-ink-muted hover:text-ink hover:bg-line transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-line bg-paper-dim/20 p-5">
          {isLoading ? (
            <div className="animate-pulse flex gap-4">
              <div className="h-16 w-full bg-paper-dim border border-line rounded-xl" />
            </div>
          ) : offers.length === 0 ? (
            <p className="text-sm font-mono text-ink-muted text-center py-4">No active offers available for review.</p>
          ) : (
            <ul className="space-y-3">
              {offers.map((offer) => (
                <li key={offer.offer_id} className="bg-white border border-line rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-amber-soft transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold font-display text-ink">{offer.buyer_name}</p>
                      {offer.is_suspicious === 1 && (
                        <span className="flex items-center gap-1 text-[10px] text-red uppercase tracking-wider font-bold bg-red-soft border border-red/20 px-1.5 py-0.5 rounded">
                          <ShieldAlert size={10} /> Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-ink-muted">
                      {new Date(offer.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-line pt-3 md:pt-0">
                    <div className="text-right">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-0.5">Offered Amount</p>
                      <p className="font-mono font-tabular font-bold text-lg text-ink">
                        ${Number(offer.offered_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    {offer.status === 'pending' ? (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        icon={CheckCircle}
                        loading={acceptMutation.isPending}
                        onClick={() => handleAccept(offer)}
                      >
                        Authorize
                      </Button>
                    ) : (
                      <span className="text-xs font-mono text-ink-muted bg-paper-dim px-3 py-1.5 rounded border border-line capitalize">
                        {offer.status}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}