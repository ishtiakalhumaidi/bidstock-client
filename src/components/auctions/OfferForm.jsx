import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Gavel } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { addOffer } from "../../api/offers.api";

export default function OfferForm({ bid }) {
  const queryClient = useQueryClient();
  const currentPrice = Number(bid.highest_bid || bid.base_price);
  const minOffer = currentPrice + 1;
  const maxQty = bid.quantity || 1;
  const [amount, setAmount] = useState(minOffer);
  const [qty, setQty] = useState(maxQty);

  const mutation = useMutation({
    mutationFn: () => addOffer({ bid_id: bid.bid_id, offered_price: amount, quantity: qty }),
    onSuccess: () => {
      toast.success("Offer placed");
      queryClient.invalidateQueries({ queryKey: ["bids", bid.bid_id] });
      queryClient.invalidateQueries({ queryKey: ["bids", "active"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not place offer"),
  });

  return (
    <div className="border border-line rounded-2xl p-5 bg-paper-dim/40" data-aos="fade-up">
      <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted mb-3">Place your offer</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-lg text-ink-muted">$</span>
        <input
          type="number"
          min={minOffer}
          step="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full font-mono font-tabular text-2xl font-semibold text-ink bg-transparent border-none focus:outline-none"
        />
      </div>
      <p className="text-xs text-ink-muted mb-4">
        Must be higher than the current bid of ${currentPrice.toLocaleString()}
      </p>

      {maxQty > 1 && (
        <div className="mb-4">
          <label className="text-xs font-mono uppercase tracking-wide text-ink-muted mb-1 block">
            Quantity (max {maxQty})
          </label>
          <input
            type="number"
            min={1}
            max={maxQty}
            value={qty}
            onChange={(e) => setQty(Math.min(maxQty, Math.max(1, Number(e.target.value))))}
            className="w-full font-mono text-sm border border-line-strong rounded-lg px-3 py-2 focus:outline-none focus:border-ink"
          />
        </div>
      )}

      <Button
        variant="accent"
        icon={Gavel}
        className="w-full"
        loading={mutation.isPending}
        disabled={amount <= currentPrice || qty < 1 || qty > maxQty}
        onClick={() => mutation.mutate()}
      >
        Place offer
      </Button>
    </div>
  );
}