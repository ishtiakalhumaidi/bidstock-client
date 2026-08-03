import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, DollarSign, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { updateOffer } from "../../../api/offers.api"; 
import Button from "../../ui/Button";
import { Input } from "../../ui/Field";

export default function EditOfferModal({ offer, open, onClose }) {
  const queryClient = useQueryClient();
  
  // 1. Initialize state directly with the offer value
  const [amount, setAmount] = useState(() => offer?.offered_price || offer?.bid_amount || "");
  const [prevOffer, setPrevOffer] = useState(offer);

  // 2. MODERN REACT PATTERN: Sync prop to state without useEffect
  // If the modal receives a new offer, immediately reset the amount state during render.
  if (offer !== prevOffer) {
    setPrevOffer(offer);
    setAmount(offer?.offered_price || offer?.bid_amount || "");
  }

  const updateMutation = useMutation({
    mutationFn: (newAmount) => updateOffer(offer.offer_id, { offered_price: newAmount }),
    onSuccess: () => {
      toast.success("Offer valuation updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update offer.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    updateMutation.mutate(Number(amount));
  };

  if (!open || !offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-line rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper-dim/50">
          <h3 className="font-display font-semibold text-lg text-ink">Update Valuation</h3>
          <button onClick={onClose} className="p-1 rounded-md text-ink-soft hover:bg-white hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-paper-dim/30 p-4 rounded-xl border border-line space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Target Asset:</span>
              <span className="font-medium text-ink truncate max-w-[200px]">{offer.product_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Current Offer:</span>
              <span className="font-mono font-medium text-ink">
                ${Number(offer.offered_price || offer.bid_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <Input
            label="New Proposed Valuation ($)"
            type="number"
            step="0.01"
            min="1"
            required
            icon={DollarSign}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter new amount"
          />

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="w-1/3" 
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-2/3" 
              icon={CheckCircle2}
              loading={updateMutation.isPending}
            >
              Update Offer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}