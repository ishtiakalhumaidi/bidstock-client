import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Inbox, ExternalLink, CreditCard, Activity, Package, CheckCircle2, XCircle, Clock, Pencil } from "lucide-react";
import { getMyOffers } from "../../../api/offers.api";
import { useAuth } from "../../../hooks/useAuth";
import EditOfferModal from "../../../components/dashboard/offers/EditOfferModal"; // Ensure path is correct
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import StatusPill from "../../../components/ui/StatusPill";
import EmptyState from "../../../components/ui/EmptyState";
import { CardSkeleton } from "../../../components/ui/Skeleton";
import Pagination from "../../../components/ui/Pagination";

export default function MyOffers() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [editingOffer, setEditingOffer] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["offers", "mine", page],
    queryFn: () => getMyOffers({ page, limit: 12 }),
  });

  const offers = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Header Metrics & Control Node */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6" data-aos="fade-up">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-2 flex items-center gap-1.5">
            <Activity size={12} className="text-teal" />
            Market Engagements ({pagination?.total ?? offers.length})
          </p>
          <h1 className="font-display font-semibold text-3xl text-ink tracking-tight">My Offers</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white border border-line rounded-card shadow-sm p-12">
          <EmptyState
            icon={Inbox}
            title="No active deployments"
            description="You have not submitted any financial offers to the marketplace yet."
            actionLabel="Browse Live Auctions"
            onAction={() => (window.location.href = "/auctions")}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {offers.map((offer, i) => {
              // Safety check: ensure only the owner can edit
              const isBuyer = String(user?.user_id) === String(offer.buyer_id);

              return (
                <div 
                  key={offer.offer_id} 
                  data-aos="fade-up" 
                  data-aos-delay={(i % 3) * 50}
                  className={`group flex flex-col backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 h-full ${
                    offer.status === 'accepted' && offer.payment_status !== 'completed' 
                      ? 'bg-white border-teal/30 shadow-[0_0_15px_rgba(20,184,166,0.1)]' 
                      : offer.status === 'rejected'
                      ? 'bg-paper-dim/30 border-line opacity-80 hover:opacity-100'
                      : 'bg-white/80 border-line hover:border-ink/20 hover:shadow-lg'
                  }`}
                >
                  {/* 1. Card Header: Context & Status */}
                  <div className="p-4 border-b border-line/50 bg-gradient-to-b from-paper-dim/40 to-transparent flex justify-between items-start">
                    <StatusPill status={offer.status} />
                    <Link 
                      to={`/auctions/${offer.bid_id}`} 
                      title="View Original Listing"
                      className="h-8 w-8 flex items-center justify-center rounded-md bg-paper border border-line text-ink-soft hover:text-ink hover:border-ink/30 transition-colors shadow-sm"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                  
                  {/* 2. Card Body: Asset Identity */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="h-12 w-12 rounded-lg bg-paper-dim border border-line flex items-center justify-center shrink-0">
                        <Package size={20} className="text-ink-muted" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-semibold text-lg text-ink line-clamp-2 leading-tight mb-1.5">
                          {offer.product_name}
                        </h3>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-ink-muted truncate">
                          SELLER: {offer.seller_name}
                        </p>
                      </div>
                    </div>

                    {/* 3. Financial Payload */}
                    <div className="mt-auto">
                      <div className={`p-4 rounded-xl border flex justify-between items-end ${
                        offer.status === 'accepted' 
                          ? 'bg-teal-soft/10 border-teal/20' 
                          : offer.status === 'rejected'
                          ? 'bg-red-soft/10 border-red/10'
                          : 'bg-paper-dim border-line'
                      }`}>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-1">
                            Proposed Valuation
                          </span>
                          <span className={`font-mono font-tabular font-bold text-2xl tracking-tight ${
                            offer.status === 'accepted' ? 'text-teal' : offer.status === 'rejected' ? 'text-ink-soft line-through' : 'text-ink'
                          }`}>
                            ${Number(offer.offered_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        
                        {/* State Icons */}
                        <div className="shrink-0 mb-1">
                          {offer.status === 'accepted' && <CheckCircle2 size={24} className="text-teal/40" />}
                          {offer.status === 'rejected' && <XCircle size={24} className="text-red/40" />}
                          {offer.status === 'pending' && <Clock size={24} className="text-amber/40" />}
                        </div>
                      </div>
                    </div>

                    {/* 4. Execution Logic (Payment Gate or Edit Logic) */}
                    {offer.status === 'accepted' && (
                      <div className="mt-4 pt-4 border-t border-line border-dashed">
                        {offer.payment_status === 'completed' ? (
                          <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-paper-dim border border-line rounded-lg text-xs font-mono uppercase tracking-widest text-ink-muted font-semibold">
                            <CheckCircle2 size={14} className="text-teal" /> Transaction Settled
                          </div>
                        ) : (
                          <Link to={`/dashboard/checkout/${offer.transaction_id}`}>
                            <Button 
                              variant="primary" 
                              className="w-full h-11 text-base shadow-sm animate-pulse-slow" 
                              icon={CreditCard}
                            >
                              Execute Payment
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}

                    {/* 5. Execution Logic (Edit Pending Offer) */}
                    {offer.status === 'pending' && isBuyer && (
                      <div className="mt-4 pt-4 border-t border-line border-dashed">
                        <Button 
                          variant="outline" 
                          className="w-full h-11 text-sm shadow-sm hover:border-ink/30 transition-colors" 
                          icon={Pencil}
                          onClick={() => setEditingOffer(offer)}
                        >
                          Edit Price
                        </Button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination Node */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-line">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}

      {/* 6. Edit Offer Modal Overlay */}
      <EditOfferModal 
        offer={editingOffer} 
        open={!!editingOffer} 
        onClose={() => setEditingOffer(null)} 
      />
    </div>
  );
}