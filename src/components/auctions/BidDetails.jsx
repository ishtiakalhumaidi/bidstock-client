import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, ArrowLeft, User, ShieldAlert } from "lucide-react";
import { getSingleBid } from "../../api/bids.api";
import { useAuth } from "../../hooks/useAuth";
import StatusPill from "../../components/ui/StatusPill";
import CountdownChip from "../../components/ui/CountdownChip";
import OfferForm from "../../components/auctions/OfferForm";
import SellerOffersPanel from "../../components/auctions/SellerOffersPanel";
import Button from "../../components/ui/Button";
import { CardSkeleton } from "../../components/ui/Skeleton";

export default function BidDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["bids", id],
    queryFn: () => getSingleBid(id),
    refetchInterval: 15000,
  });

  const bid = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <CardSkeleton />
      </div>
    );
  }

  if (isError || !bid) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
        <ShieldAlert size={28} className="text-ink-muted mx-auto mb-4" />
        <h2 className="font-display font-semibold text-xl text-ink mb-2">Lot not found</h2>
        <p className="text-sm text-ink-soft mb-6">This auction may have been removed or never existed.</p>
        <Link to="/auctions">
          <Button variant="outline">Back to auctions</Button>
        </Link>
      </div>
    );
  }

  const isOwningSeller = user?.role === "seller" && Number(user.user_id) === Number(bid.seller_id);
  const canBid = isAuthenticated && user?.role === "buyer" && bid.status === "open";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Link to="/auctions" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> All auctions
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6" data-aos="fade-up">
          <div className="aspect-[16/10] bg-paper-dim rounded-2xl border border-line overflow-hidden flex items-center justify-center">
            {bid.image_url ? (
              <img src={bid.image_url} alt={bid.product_name} className="h-full w-full object-cover" />
            ) : (
              <Package size={40} className="text-ink-muted" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <StatusPill status={bid.status} />
              <CountdownChip endTime={bid.end_time} />
            </div>
            <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink mb-2">{bid.product_name}</h1>
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <User size={14} /> Listed by {bid.seller_name}
            </div>
          </div>

          {bid.description && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted mb-2">Description</p>
              <p className="text-sm text-ink-soft leading-relaxed">{bid.description}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-5" data-aos="fade-up" data-aos-delay="100">
          <div className="border border-line rounded-2xl p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted mb-1">
              {bid.highest_bid ? "Current highest bid" : "Starting price"}
            </p>
            <p className="font-mono font-tabular font-semibold text-3xl text-ink">
              ${Number(bid.highest_bid || bid.base_price).toLocaleString()}
            </p>
            {bid.quantity > 1 && (
              <p className="text-xs text-ink-muted mt-1">{bid.quantity} units available in this lot</p>
            )}
            {bid.pending_offers !== undefined && (
              <p className="text-xs text-ink-muted mt-1">
                {bid.pending_offers ?? 0} pending offer{(bid.pending_offers ?? 0) !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {canBid ? <OfferForm bid={bid} /> : null}

          {!isAuthenticated && bid.status === "open" ? (
            <div className="border border-dashed border-line-strong rounded-2xl p-5 text-center">
              <p className="text-sm text-ink-soft mb-3">Sign in as a buyer to place an offer</p>
              <Link to="/auth/signin">
                <Button variant="primary" size="sm">Sign in</Button>
              </Link>
            </div>
          ) : null}

          {isOwningSeller ? <SellerOffersPanel bidId={bid.bid_id} bidStatus={bid.status} /> : null}
        </div>
      </div>
    </div>
  );
}