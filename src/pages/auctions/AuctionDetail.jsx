import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Gavel, ArrowLeft, ShieldCheck } from "lucide-react";
import { getSingleBid } from "../../api/bids.api";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import CountdownChip from "../../components/ui/CountdownChip";
import PlaceOfferModal from "../../components/auctions/PlaceOfferModal";

export default function AuctionDetail() {
  const { bid_id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [offering, setOffering] = useState(false);

const { data, isLoading } = useQuery({
    queryKey: ["bids", bid_id],
    queryFn: () => getSingleBid(bid_id),
  });



  
  const auction = data?.data;
  if (isLoading) return <div className="min-h-screen animate-pulse bg-paper-dim" />;
  if (!auction) return <div className="min-h-screen flex items-center justify-center">Auction not found</div>;

  const currentPrice = Number(auction.highest_bid || auction.base_price);
  const isSeller = user?.role === 'seller' && user?.name === auction.seller_name; // Rough check, ideal is comparing IDs

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to floor
      </button>

      <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
        {/* Visuals */}
        <div className="md:w-1/2 bg-paper-dim aspect-square md:aspect-auto flex items-center justify-center border-b md:border-b-0 md:border-r border-line p-6">
          {auction.image_url ? (
            <img src={auction.image_url} alt={auction.product_name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
          ) : (
            <Gavel size={64} className="text-ink-muted/50" />
          )}
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="mb-4">
            <CountdownChip endTime={auction.end_time} className="mb-3" />
            <h1 className="font-display font-semibold text-2xl md:text-3xl text-ink leading-tight mb-2">
              {auction.product_name}
            </h1>
            <p className="text-sm text-ink-muted">Listed by {auction.seller_name}</p>
          </div>

          <div className="py-5 border-y border-line my-2">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted mb-1">
              {auction.highest_bid ? "Current highest offer" : "Starting price"}
            </p>
            <p className="font-mono font-tabular font-semibold text-4xl text-ink">
              ${currentPrice.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-ink-soft mt-2">
              {auction.pending_offers} pending offer{auction.pending_offers !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="mt-4 mb-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted mb-2">Description</p>
            <p className="text-sm text-ink-soft leading-relaxed">
              {auction.description || "No specific details provided for this lot."}
            </p>
          </div>

          <div className="mt-auto pt-6">
            {!isAuthenticated ? (
              <Button variant="outline" className="w-full" onClick={() => navigate("/auth/signin")}>
                Sign in to bid
              </Button>
            ) : user?.role === 'buyer' ? (
              <Button variant="accent" size="lg" className="w-full" onClick={() => setOffering(true)} disabled={auction.status !== 'open'}>
                {auction.status === 'open' ? "Place Offer" : "Auction Closed"}
              </Button>
            ) : isSeller ? (
              <Button variant="primary" className="w-full" onClick={() => navigate(`/dashboard/my-auctions`)}>
                Manage in Dashboard
              </Button>
            ) : (
              <div className="bg-paper-dim rounded-lg p-3 text-center text-sm text-ink-soft flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> Only verified buyers can place offers.
              </div>
            )}
          </div>
        </div>
      </div>

      <PlaceOfferModal 
        auction={auction} 
        open={offering} 
        onClose={() => setOffering(false)} 
        currentPrice={currentPrice}
      />
    </div>
  );
}