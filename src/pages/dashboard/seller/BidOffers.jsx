import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { 
  Inbox, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  User, 
  Clock, 
  Activity,
  ShieldAlert
} from "lucide-react";
import toast from "react-hot-toast";

import { getBidOffers, acceptOffer, updateOffer } from "../../../api/offers.api"; 
import StatusPill from "../../../components/ui/StatusPill";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import { RowSkeleton } from "../../../components/ui/Skeleton";
import { confirmAction } from "../../../lib/confirm";

export default function BidOffers() {
  const { bid_id } = useParams();
  const queryClient = useQueryClient();

  // Fetch all offers tied to this specific auction node
  const { data, isLoading } = useQuery({
    queryKey: ["offers", bid_id],
    queryFn: () => getBidOffers(bid_id),
    enabled: !!bid_id,
  });

  const offers = data?.data ?? [];

  // Mutations for state resolution
  const acceptMutation = useMutation({
    mutationFn: (offerId) => acceptOffer(offerId),
    onSuccess: () => {
      toast.success("Offer accepted. Transaction protocol initiated.");
      queryClient.invalidateQueries({ queryKey: ["offers", bid_id] });
      queryClient.invalidateQueries({ queryKey: ["bids", "my-bids"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Execution failed."),
  });

  const rejectMutation = useMutation({
    mutationFn: (offerId) => updateOffer(offerId, { status: "rejected" }),
    onSuccess: () => {
      toast.success("Offer rejected and dropped from consideration.");
      queryClient.invalidateQueries({ queryKey: ["offers", bid_id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Rejection sequence failed."),
  });

  const handleAccept = async (offer) => {
    const ok = await confirmAction({
      title: "Authorize Transaction?",
      text: `Accepting ${offer.buyer_name}'s offer of $${Number(offer.offered_price).toLocaleString()} will lock this auction and initiate the final checkout phase. All other pending offers will be invalidated.`,
      confirmText: "Authorize & Accept",
      danger: false,
    });
    if (ok) acceptMutation.mutate(offer.offer_id);
  };

  const handleReject = async (offer) => {
    const ok = await confirmAction({
      title: "Drop Offer?",
      text: `Are you sure you want to reject this offer of $${Number(offer.offered_price).toLocaleString()}? This cannot be undone.`,
      confirmText: "Drop Offer",
      danger: true,
    });
    if (ok) rejectMutation.mutate(offer.offer_id);
  };

  // Compute highest offer for visual anchoring using 'offered_price'
  const highestOffer = offers.reduce((max, offer) => 
    (offer.status !== 'rejected' && Number(offer.offered_price) > max) ? Number(offer.offered_price) : max
  , 0);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Navigation Node */}
      <Link 
        to="/dashboard/my-auctions" 
        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Back to Auctions
      </Link>

      {/* Header Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
            <Activity size={12} className="text-teal" />
            Node Reference: #{bid_id}
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">Market Offers Resolution</h1>
        </div>
        
        {offers.length > 0 && (
          <div className="flex items-center gap-4 bg-paper-dim px-4 py-2 rounded-lg border border-line">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted">Peak Market Value</span>
              <span className="font-mono font-semibold text-ink text-lg leading-none mt-1">
                ${highestOffer.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Resolution Matrix */}
      <div className="bg-white border border-line rounded-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 divide-y divide-line">
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </div>
        ) : offers.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={Inbox}
              title="No inbound data"
              description="This auction has not accumulated any market offers yet. Bids will appear here in real-time as buyers interact with your listing."
            />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {offers.map((offer) => (
              <li
                key={offer.offer_id}
                className={`group flex flex-col md:flex-row md:items-center gap-4 px-5 py-5 transition-colors ${
                  offer.status === 'accepted' ? 'bg-teal-soft/10' : 'hover:bg-paper-dim/50'
                }`}
              >
                {/* 1. Counterparty Identity */}
                <div className="flex items-center gap-4 md:w-1/3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-paper border border-line flex items-center justify-center shrink-0 overflow-hidden">
                    {offer.buyer_image ? (
                      <img src={offer.buyer_image} alt={offer.buyer_name} className="h-full w-full object-cover" />
                    ) : (
                      <User size={16} className="text-ink-muted" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate font-display">
                      {offer.buyer_name}
                    </p>
                    <p className="text-[11px] font-mono text-ink-soft tracking-wide flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> 
                      {new Date(offer.created_at).toLocaleDateString()} · {new Date(offer.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* 2. Financial Payload */}
                <div className="flex flex-col md:w-1/4 py-2 md:py-0 border-y border-line md:border-none border-dashed">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted mb-0.5">Proposed Valuation</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-tabular font-semibold text-xl tracking-tight ${Number(offer.offered_price) === highestOffer && offer.status !== 'rejected' ? 'text-teal' : 'text-ink'}`}>
                      ${Number(offer.offered_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {Number(offer.offered_price) === highestOffer && offer.status === 'pending' && (
                      <span className="text-[9px] uppercase font-bold bg-teal-soft/30 text-teal border border-teal/20 px-1.5 py-0.5 rounded">
                        Top
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. System Status */}
                <div className="md:w-1/5 flex items-center">
                  <StatusPill status={offer.status} />
                </div>

                {/* 4. Execution Logic */}
                <div className="flex items-center justify-end gap-2 mt-2 md:mt-0 md:w-auto md:ml-auto shrink-0">
                  {offer.status === "pending" ? (
                    <>
                      <Button 
                        size="sm"
                        variant="outline"
                        icon={XCircle}
                        className="text-ink-soft hover:text-red hover:border-red transition-colors"
                        onClick={() => handleReject(offer)}
                        loading={rejectMutation.isPending}
                        disabled={acceptMutation.isPending}
                      >
                        Drop
                      </Button>
                      <Button 
                        size="sm"
                        variant="primary"
                        icon={CheckCircle}
                        className="bg-ink hover:bg-ink-light"
                        onClick={() => handleAccept(offer)}
                        loading={acceptMutation.isPending}
                        disabled={rejectMutation.isPending}
                      >
                        Authorize
                      </Button>
                    </>
                  ) : offer.status === "accepted" ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-teal bg-teal-soft/20 border border-teal/20 px-3 py-1.5 rounded-lg">
                      <ShieldAlert size={14} />
                      Transaction Locked
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-ink-muted px-3 py-1.5">Resolved</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}