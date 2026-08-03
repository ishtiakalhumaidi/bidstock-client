import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import { Input } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { addOffer } from "../../api/offers.api";

export default function PlaceOfferModal({ auction, open, onClose, currentPrice }) {
  const queryClient = useQueryClient();
  const minOffer = currentPrice + 1;
  const maxQty = auction?.quantity || 1;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { quantity: maxQty },
  });

  const mutation = useMutation({
    mutationFn: (payload) =>
      addOffer({
        bid_id: auction.bid_id,
        offered_price: payload.offered_price,
        quantity: Number(payload.quantity),
      }),
    onSuccess: () => {
      toast.success("Offer submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["bids", String(auction.bid_id)] });
      queryClient.invalidateQueries({ queryKey: ["offers", "mine"] });
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not place offer"),
  });

  return (
    <Modal open={open} onClose={onClose} title="Submit an Offer">
      <div className="mb-5 p-4 bg-amber-soft rounded-xl border border-amber/30 text-amber-dark">
        <p className="text-xs uppercase tracking-widest font-mono mb-1 font-semibold">Minimum Required</p>
        <p className="text-2xl font-mono font-tabular font-bold">${minOffer.toLocaleString()}</p>
      </div>

      <form id="place-offer-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <Input
          label="Your Offer Amount ($)"
          type="number"
          step="0.01"
          required
          autoFocus
          error={errors.offered_price?.message}
          {...register("offered_price", {
            required: "Amount is required",
            min: { value: minOffer, message: `Offer must be at least $${minOffer}` },
          })}
        />
        {maxQty > 1 && (
          <Input
            label={`Quantity (max ${maxQty})`}
            type="number"
            step="1"
            required
            error={errors.quantity?.message}
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Must be at least 1" },
              max: { value: maxQty, message: `Only ${maxQty} available` },
            })}
          />
        )}
        <p className="text-xs text-ink-muted leading-relaxed">
          By submitting this offer, you commit to purchasing the lot at this price if the seller accepts. Ensure you have the necessary funds available in your wallet.
        </p>
      </form>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-line">
        <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
        <Button type="submit" form="place-offer-form" variant="accent" loading={mutation.isPending}>
          Submit Offer
        </Button>
      </div>
    </Modal>
  );
}