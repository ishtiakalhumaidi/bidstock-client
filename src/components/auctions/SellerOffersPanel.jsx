import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, User } from "lucide-react";
import toast from "react-hot-toast";
import { getBidOffers, acceptOffer } from "../../api/offers.api";
import { confirmAction } from "../../lib/confirm";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { RowSkeleton } from "../ui/Skeleton";

export default function SellerOffersPanel({ bidId, bidStatus }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["offers", "bid", bidId],
    queryFn: () => getBidOffers(bidId),
  });

  const offers = data?.data ?? [];

  const accept = useMutation({
    mutationFn: (offerId) => acceptOffer(offerId),
    onSuccess: () => {
      toast.success("Offer accepted — auction closed");
      queryClient.invalidateQueries({ queryKey: ["offers", "bid", bidId] });
      queryClient.invalidateQueries({ queryKey: ["bids", bidId] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not accept offer"),
  });

  const handleAccept = async (offer) => {
    const ok = await confirmAction({
      title: "Accept this offer?",
      text: `This closes the auction and accepts $${Number(offer.offered_price).toLocaleString()} from ${offer.buyer_name}. This can't be undone.`,
      confirmText: "Accept offer",
    });
    if (ok) accept.mutate(offer.offer_id);
  };

  return (
    <div className="border border-line rounded-2xl overflow-hidden" data-aos="fade-up">
      <div className="px-5 py-4 border-b border-line bg-paper-dim/40">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
          {offers.length} offer{offers.length !== 1 ? "s" : ""} received
        </p>
      </div>

      <div className="p-2">
        {isLoading ? (
          <div className="px-3 divide-y divide-line">
            <RowSkeleton />
            <RowSkeleton />
          </div>
        ) : offers.length === 0 ? (
          <div className="py-8">
            <EmptyState title="No offers yet" description="Buyers will appear here as they bid on this lot." />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {offers.map((offer) => (
              <li key={offer.offer_id} className="flex items-center gap-3 px-3 py-3">
                <div className="h-9 w-9 rounded-full bg-paper-dim border border-line flex items-center justify-center shrink-0 overflow-hidden">
                  {offer.buyer_image ? (
                    <img src={offer.buyer_image} className="h-full w-full object-cover" alt={offer.buyer_name} />
                  ) : (
                    <User size={15} className="text-ink-muted" />
                  )}
                </div>
               <div className="flex-1 min-w-0">
  <p className="text-sm font-medium text-ink truncate">{offer.buyer_name}</p>
  <p className="font-mono font-tabular text-sm text-ink-soft">
    ${Number(offer.offered_price).toLocaleString()}
    {offer.quantity > 1 && <span className="text-ink-muted"> · qty {offer.quantity}</span>}
  </p>
</div>
                {offer.status === "pending" && bidStatus === "open" ? (
                  <Button size="sm" variant="accent" icon={Check} loading={accept.isPending} onClick={() => handleAccept(offer)}>
                    Accept
                  </Button>
                ) : (
                  <span className={`text-[11px] font-mono uppercase px-2 py-1 rounded-full shrink-0 ${
                    offer.status === "accepted" ? "bg-teal-soft text-teal" : "bg-paper-dim text-ink-muted"
                  }`}>
                    {offer.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}