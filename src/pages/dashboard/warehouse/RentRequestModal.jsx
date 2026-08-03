import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Modal from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import { addRent } from "../../../api/rents.api";

export default function RentRequestModal({ warehouse, open, onClose }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const mutation = useMutation({
    mutationFn: (payload) => addRent({ ...payload, warehouse_id: warehouse.warehouse_id }),
    onSuccess: () => {
      toast.success("Lease secured successfully");
      queryClient.invalidateQueries({ queryKey: ["warehouses", "all"] });
      queryClient.invalidateQueries({ queryKey: ["rents", "mine"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not request lease"),
  });

  // Calculate estimated total based on backend logic (defaults to 30 days if no end_date)
  const estDays = startDate && endDate 
    ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))) 
    : 30;
  const estTotal = warehouse ? (warehouse.price_per_day * estDays) : 0;

  if (!warehouse) return null;

  return (
    <Modal open={open} onClose={onClose} title="Secure warehouse space">
      <div className="mb-4 p-3 bg-paper-dim rounded-lg border border-line">
        <p className="text-sm font-medium text-ink">{warehouse.location}</p>
        <p className="text-xs text-ink-muted mt-1">
          ${Number(warehouse.price_per_day).toLocaleString()} / day · {warehouse.capacity} units capacity
        </p>
      </div>

      <form id="rent-request-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <Input
          label="Start date"
          type="date"
          required
          error={errors.start_date?.message}
          {...register("start_date", { required: "Start date is required" })}
        />
        <Input
          label="End date"
          type="date"
          hint="Leave blank for an open-ended lease (defaults to 30 days initial billing)"
          error={errors.end_date?.message}
          {...register("end_date")}
        />

        <div className="pt-2 text-right">
          <p className="text-xs text-ink-muted">Estimated initial total</p>
          <p className="font-mono font-semibold text-lg text-ink">${estTotal.toLocaleString()}</p>
        </div>
      </form>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-line">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" form="rent-request-form" variant="accent" loading={mutation.isPending}>
          Confirm lease
        </Button>
      </div>
    </Modal>
  );
}