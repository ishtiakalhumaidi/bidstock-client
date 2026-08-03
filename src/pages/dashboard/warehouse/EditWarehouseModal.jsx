import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Modal from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import { updateWarehouse } from "../../../api/warehouse.api";

export default function EditWarehouseModal({ warehouse, open, onClose }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      location: warehouse?.location,
      capacity: warehouse?.capacity,
      price_per_day: warehouse?.price_per_day,
      floor_area_sqm: warehouse?.floor_area_sqm ?? "",
      ceiling_height_m: warehouse?.ceiling_height_m ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      updateWarehouse(warehouse.warehouse_id, {
        ...data,
        floor_area_sqm: data.floor_area_sqm ? Number(data.floor_area_sqm) : null,
        ceiling_height_m: data.ceiling_height_m ? Number(data.ceiling_height_m) : null,
      }),
    onSuccess: () => {
      toast.success("Warehouse specifications updated");
      queryClient.invalidateQueries({ queryKey: ["warehouses", "mine"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
  });

  if (!warehouse) return null;

  return (
    <Modal open={open} onClose={onClose} title="Modify specifications">
      <form id="edit-warehouse-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <Input
          label="Location"
          required
          error={errors.location?.message}
          {...register("location", { required: "Location is required" })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Capacity"
            type="number"
            required
            error={errors.capacity?.message}
            {...register("capacity", { required: "Required", min: 1 })}
          />
          <Input
            label="Price/Day ($)"
            type="number"
            step="0.01"
            required
            error={errors.price_per_day?.message}
            {...register("price_per_day", { required: "Required", min: 0 })}
          />
        </div>

        <div className="pt-2 border-t border-line">
          <p className="text-xs font-medium text-ink-soft mb-1">Floor space (optional)</p>
          <p className="text-xs text-ink-muted mb-3">
            Enables precise sqm tracking for sellers adding inventory. Leave blank to keep using unit-count capacity only.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Floor area (sqm)"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="e.g. 500"
              error={errors.floor_area_sqm?.message}
              {...register("floor_area_sqm", { min: { value: 0.1, message: "Must be positive" } })}
            />
            <Input
              label="Ceiling height (m)"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="e.g. 4.5"
              error={errors.ceiling_height_m?.message}
              {...register("ceiling_height_m", { min: { value: 0.1, message: "Must be positive" } })}
            />
          </div>
        </div>

        <p className="text-xs text-ink-muted">Note: Availability status is managed automatically by active rental agreements.</p>
      </form>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-line">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" form="edit-warehouse-form" variant="accent" loading={mutation.isPending}>
          Commit changes
        </Button>
      </div>
    </Modal>
  );
}