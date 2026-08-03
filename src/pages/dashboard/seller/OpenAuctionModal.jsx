import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Gavel, AlertCircle, Clock, Boxes } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import { addBid } from "../../../api/bids.api";

function defaultEndTime() {
  const d = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  d.setSeconds(0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function OpenAuctionModal({ product, open, onClose }) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Hydrate default parameters dynamically when modal opens
  useEffect(() => {
    if (product) {
      reset({
        starting_bid: product.price,
        quantity: product.available_quantity || 1,
        end_time: defaultEndTime(),
      });
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      addBid({
        ...payload,
        product_id: product.product_id,
        quantity: Number(payload.quantity),
        end_time: new Date(payload.end_time).toISOString(),
      }),
    onSuccess: () => {
      toast.success("Auction deployed to the network.");
      queryClient.invalidateQueries({ queryKey: ["bids", "my-bids"] });
      queryClient.invalidateQueries({ queryKey: ["products", "mine"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Deployment failed. Verify parameters."),
  });

  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose} title="Deploy Auction Protocol" maxWidth="max-w-md">
      
      {/* Context Anchoring */}
      <div className="mb-6 p-4 bg-paper-dim border border-line rounded-lg">
        <h4 className="font-display font-medium text-sm text-ink mb-2 truncate">{product.name}</h4>
        <div className="flex items-center gap-4 text-xs font-mono text-ink-soft">
          <span className="flex items-center gap-1.5"><Boxes size={14} /> {product.available_quantity || 0} in stock</span>
          <span className="flex items-center gap-1.5"><Gavel size={14} /> Base: ${Number(product.price).toLocaleString()}</span>
        </div>
      </div>

      <form id="open-auction-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Floor Bid ($)"
            required
            type="number"
            step="0.01"
            min="0.01"
            error={errors.starting_bid?.message}
            {...register("starting_bid", { required: "Floor bid is required" })}
          />
          <Input
            label="Lot Quantity"
            required
            type="number"
            step="1"
            min="1"
            max={product.available_quantity || 1}
            error={errors.quantity?.message}
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Must allocate at least 1" },
              max: { value: product.available_quantity || 1, message: `Max capacity: ${product.available_quantity}` },
            })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1.5 flex items-center gap-1.5">
            <Clock size={12} /> Auction Lifecycle (End Time)
          </label>
          <input
            type="datetime-local"
            className={`w-full rounded-lg border ${
              errors.end_time ? "border-red" : "border-line-strong"
            } bg-white px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none transition-colors`}
            {...register("end_time", { required: "Close time is strictly required" })}
          />
          {errors.end_time && <p className="text-xs text-red mt-1.5">{errors.end_time.message}</p>}
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-soft/40 border border-amber/20 text-xs text-amber-dark">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <p>System constraint: Only one active auction parameter is permitted per product node concurrently.</p>
        </div>
      </form>
      
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-5 border-t border-line">
        <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
          Abort
        </Button>
        <Button type="submit" form="open-auction-form" variant="accent" icon={Gavel} loading={mutation.isPending} className="w-full sm:w-auto">
          Initialize Bidding
        </Button>
      </div>
    </Modal>
  );
}